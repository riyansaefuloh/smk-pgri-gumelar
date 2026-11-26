import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { router, useForm } from '@inertiajs/react';
import Swal from 'sweetalert2';
import {
    IconAlertCircle,
    IconCalendar,
    IconEdit,
    IconPlus,
    IconSearch,
    IconTrash,
    IconUsers,
    IconX,
} from '@tabler/icons-react';
import AdminLayout from '@/Layouts/AdminLayout';
import CmsButton from '@/Components/Admin/CmsButton';

const FILTER_CHIP_BASE =
    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border border-brand-500/20 bg-brand-500/10 text-brand-600 font-medium hover:bg-brand-500/15 transition';
const FILTER_CHIP_ACTIVE = 'ring-1 ring-brand-500/40 font-semibold';

function formatTanggalIndo(dateValue) {
    if (!dateValue) return '-';
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return String(dateValue);
    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(date);
}

function toInputDate(dateValue) {
    if (!dateValue) return '';
    return String(dateValue).slice(0, 10);
}

export default function Gelombang({ title = 'Jadwal Gelombang', gelombangs = [] }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('semua'); // 'semua' | 'buka' | 'tutup'
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [togglingId, setTogglingId] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const form = useForm({
        nama_gelombang: '',
        tahun_ajaran: '',
        tanggal_buka: '',
        tanggal_tutup: '',
        status_gelombang_buka: true,
    });

    const filteredGelombangs = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        return gelombangs.filter((item) => {
            const matchesSearch =
                !q ||
                String(item.nama_gelombang || '').toLowerCase().includes(q) ||
                String(item.tahun_ajaran || '').toLowerCase().includes(q);
            const matchesStatus =
                statusFilter === 'semua' ||
                (statusFilter === 'buka' && Boolean(item.status_gelombang_buka)) ||
                (statusFilter === 'tutup' && !item.status_gelombang_buka);
            return matchesSearch && matchesStatus;
        });
    }, [gelombangs, searchQuery, statusFilter]);

    const activeGelombang = useMemo(
        () => gelombangs.find((g) => Boolean(g.status_gelombang_buka)),
        [gelombangs]
    );

    const totalBuka = useMemo(
        () => (activeGelombang ? 1 : 0),
        [activeGelombang]
    );
    const totalTutup = gelombangs.length - totalBuka;

    useEffect(() => {
        const hasOverlay = drawerOpen || deleteTarget !== null;
        document.body.style.overflow = hasOverlay ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [drawerOpen, deleteTarget]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key !== 'Escape') return;
            if (deleteTarget !== null && !deleting) {
                setDeleteTarget(null);
                return;
            }
            if (drawerOpen && !form.processing) {
                closeDrawer();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [drawerOpen, deleteTarget, form.processing, deleting]);

    const openCreateDrawer = () => {
        setEditingItem(null);
        form.clearErrors();
        form.setData({
            nama_gelombang: '',
            tahun_ajaran: '',
            tanggal_buka: '',
            tanggal_tutup: '',
            status_gelombang_buka: !activeGelombang,
        });
        setDrawerOpen(true);
    };

    const openEditDrawer = (item) => {
        setEditingItem(item);
        form.clearErrors();
        form.setData({
            nama_gelombang: item.nama_gelombang || '',
            tahun_ajaran: item.tahun_ajaran || '',
            tanggal_buka: toInputDate(item.tanggal_buka),
            tanggal_tutup: toInputDate(item.tanggal_tutup),
            status_gelombang_buka: Boolean(item.status_gelombang_buka),
        });
        setDrawerOpen(true);
    };

    const closeDrawer = () => {
        if (form.processing) return;
        setDrawerOpen(false);
        setEditingItem(null);
        form.clearErrors();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingItem) {
            form.put(`/admin/spmb-gelombang/${editingItem.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setDrawerOpen(false);
                    setEditingItem(null);
                },
            });
        } else {
            form.post('/admin/spmb-gelombang', {
                preserveScroll: true,
                onSuccess: () => {
                    setDrawerOpen(false);
                    form.reset();
                },
            });
        }
    };

    const handleToggleStatus = (item) => {
        if (togglingId === item.id) return;

        // Jika hendak mengaktifkan, dan sudah ada gelombang lain yang berstatus aktif
        if (!item.status_gelombang_buka && activeGelombang && activeGelombang.id !== item.id) {
            Swal.fire({
                icon: 'warning',
                title: 'Gelombang Lain Masih Aktif!',
                html: `Saat ini <b>${activeGelombang.nama_gelombang} (${activeGelombang.tahun_ajaran})</b> masih berstatus <b>DIBUKA</b>.<br><br>Aturan sistem hanya memperbolehkan <b>1 gelombang aktif</b> dalam satu waktu. Silakan tutup gelombang tersebut terlebih dahulu sebelum membuka gelombang ini.`,
                confirmButtonText: 'Mengerti',
                confirmButtonColor: '#0968f6',
            });
            return;
        }

        setTogglingId(item.id);
        router.patch(
            `/admin/spmb-gelombang/${item.id}/toggle`,
            {},
            {
                preserveScroll: true,
                onFinish: () => setTogglingId(null),
            }
        );
    };

    const handleConfirmDelete = () => {
        if (!deleteTarget || deleting) return;
        setDeleting(true);
        router.delete(`/admin/spmb-gelombang/${deleteTarget.id}`, {
            preserveScroll: true,
            onSuccess: () => setDeleteTarget(null),
            onFinish: () => setDeleting(false),
        });
    };

    const inputClass = (hasError) =>
        `w-full h-10 px-3 text-sm rounded-md border bg-surface-primary text-content-primary placeholder:text-content-disabled shadow-xs transition focus:outline-none ${
            hasError
                ? 'border-negative-600 focus:border-negative-600 focus:ring-2 focus:ring-negative-500/15'
                : 'border-stroke-input focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15'
        }`;

    return (
        <AdminLayout
            title={title}
            subtitle="Kelola jadwal gelombang pendaftaran, rentang tanggal, dan status buka atau tutup SPMB online."
            headerActions={
                <CmsButton
                    hierarchy="primary"
                    size="md"
                    prefixIcon={<IconPlus size={16} />}
                    onClick={openCreateDrawer}
                >
                    Tambah Gelombang
                </CmsButton>
            }
        >
            {/* Card Utama Daftar Gelombang */}
            <div className="bg-surface-primary rounded-xl border border-stroke-card shadow-admin-card overflow-hidden">
                {/* Banner Status Gelombang Aktif */}
                {activeGelombang ? (
                    <div className="px-4 py-2.5 bg-blue-50/70 border-b border-stroke-card flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2 text-blue-900">
                            <span className="w-2 h-2 rounded-full bg-positive-500 animate-pulse shrink-0" />
                            <span>
                                Gelombang Aktif Saat Ini: <strong>{activeGelombang.nama_gelombang}</strong> ({activeGelombang.tahun_ajaran}) &bull; Periode: {formatTanggalIndo(activeGelombang.tanggal_buka)} – {formatTanggalIndo(activeGelombang.tanggal_tutup)}
                            </span>
                        </div>
                        <span className="text-[11px] text-blue-700 font-medium">
                            (Hanya 1 gelombang dapat dibuka dalam satu waktu)
                        </span>
                    </div>
                ) : (
                    <div className="px-4 py-2.5 bg-warning-50 border-b border-stroke-card flex items-center gap-2 text-xs text-content-warning">
                        <IconAlertCircle size={15} className="shrink-0" />
                        <span>
                            <strong>Tidak ada gelombang aktif.</strong> Calon siswa tidak dapat mendaftar di portal publik sebelum ada 1 gelombang yang dibuka.
                        </span>
                    </div>
                )}

                {/* Toolbar Pencarian & Filter */}
                <div className="p-4 sm:p-5 border-b border-stroke-card bg-surface-primary flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="relative w-full lg:max-w-xs">
                        <IconSearch
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-content-tertiary pointer-events-none"
                        />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari nama gelombang atau tahun ajaran..."
                            className="w-full h-10 pl-9 pr-3 text-sm rounded-md border border-stroke-input bg-surface-primary text-content-primary placeholder:text-content-disabled shadow-xs transition focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setStatusFilter('semua')}
                            className={`${FILTER_CHIP_BASE} ${
                                statusFilter === 'semua' ? FILTER_CHIP_ACTIVE : ''
                            }`}
                        >
                            <span>Semua</span>
                            <span className="text-xs">({gelombangs.length})</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setStatusFilter('buka')}
                            className={`${FILTER_CHIP_BASE} ${
                                statusFilter === 'buka' ? FILTER_CHIP_ACTIVE : ''
                            }`}
                        >
                            <span>Dibuka</span>
                            <span className="text-xs">({totalBuka})</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setStatusFilter('tutup')}
                            className={`${FILTER_CHIP_BASE} ${
                                statusFilter === 'tutup' ? FILTER_CHIP_ACTIVE : ''
                            }`}
                        >
                            <span>Ditutup</span>
                            <span className="text-xs">({totalTutup})</span>
                        </button>
                    </div>
                </div>

                {/* Tabel Data */}
                {filteredGelombangs.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-surface-secondary border-b border-stroke-card">
                                    <th className="py-3 px-4 sm:px-5 text-xs font-semibold text-content-secondary uppercase tracking-wider">
                                        Gelombang
                                    </th>
                                    <th className="py-3 px-4 text-xs font-semibold text-content-secondary uppercase tracking-wider">
                                        Jadwal Pendaftaran
                                    </th>
                                    <th className="py-3 px-4 text-xs font-semibold text-content-secondary uppercase tracking-wider">
                                        Pendaftar
                                    </th>
                                    <th className="py-3 px-4 text-xs font-semibold text-content-secondary uppercase tracking-wider">
                                        Status Buka/Tutup
                                    </th>
                                    <th className="py-3 px-4 sm:px-5 text-xs font-semibold text-content-secondary uppercase tracking-wider text-right">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stroke-card">
                                {filteredGelombangs.map((item) => {
                                    const isOpen = Boolean(item.status_gelombang_buka);
                                    const isToggling = togglingId === item.id;

                                    return (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-surface-secondary/50 transition"
                                        >
                                            <td className="py-3.5 px-4 sm:px-5">
                                                <div className="text-xs font-semibold text-content-primary">
                                                    {item.nama_gelombang}
                                                </div>
                                                <div className="text-xs text-content-tertiary mt-0.5">
                                                    Tahun Ajaran {item.tahun_ajaran}
                                                </div>
                                            </td>

                                            <td className="py-3.5 px-4">
                                                <div className="inline-flex items-center gap-1.5 text-xs font-medium text-content-primary">
                                                    <IconCalendar
                                                        size={14}
                                                        className="text-content-tertiary shrink-0"
                                                    />
                                                    <span>
                                                        {formatTanggalIndo(item.tanggal_buka)} –{' '}
                                                        {formatTanggalIndo(item.tanggal_tutup)}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="py-3.5 px-4">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border border-brand-500/20 bg-brand-500/10 text-brand-600 font-medium">
                                                    <IconUsers size={13} />
                                                    <span>{item.spmb_pendaftars_count ?? 0} siswa</span>
                                                </span>
                                            </td>

                                            <td className="py-3.5 px-4">
                                                <div className="inline-flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        role="switch"
                                                        aria-checked={isOpen}
                                                        disabled={isToggling}
                                                        onClick={() => handleToggleStatus(item)}
                                                        title={
                                                            isOpen
                                                                ? 'Klik untuk menutup gelombang'
                                                                : activeGelombang && activeGelombang.id !== item.id
                                                                ? `Tidak dapat dibuka: ${activeGelombang.nama_gelombang} masih aktif`
                                                                : 'Klik untuk membuka gelombang'
                                                        }
                                                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:opacity-50 ${
                                                            isOpen
                                                                ? 'bg-positive-600 border-positive-600'
                                                                : 'bg-stroke-input border-stroke-input'
                                                        }`}
                                                    >
                                                        <span
                                                            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-xs transition-transform ${
                                                                isOpen ? 'translate-x-4' : 'translate-x-0.5'
                                                            }`}
                                                        />
                                                    </button>
                                                    <span
                                                        className={`text-xs font-medium ${
                                                            isOpen
                                                                ? 'text-content-positive'
                                                                : 'text-content-tertiary'
                                                        }`}
                                                    >
                                                        {isOpen ? 'Dibuka' : 'Ditutup'}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="py-3.5 px-4 sm:px-5 text-right">
                                                <div className="inline-flex items-center justify-end gap-1">
                                                    <CmsButton
                                                        hierarchy="tertiary"
                                                        tone="warning"
                                                        size="icon-sm"
                                                        title="Ubah jadwal gelombang"
                                                        onClick={() => openEditDrawer(item)}
                                                    >
                                                        <IconEdit size={16} />
                                                    </CmsButton>
                                                    <CmsButton
                                                        hierarchy="tertiary"
                                                        tone="danger"
                                                        size="icon-sm"
                                                        title="Hapus gelombang"
                                                        onClick={() => setDeleteTarget(item)}
                                                    >
                                                        <IconTrash size={16} />
                                                    </CmsButton>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    /* Empty State */
                    <div className="py-12 px-6 text-center">
                        <div className="w-12 h-12 mx-auto rounded-xl bg-surface-secondary border border-stroke-card flex items-center justify-center text-content-disabled mb-3">
                            <IconCalendar size={22} />
                        </div>
                        <h3 className="text-base font-semibold text-content-primary">
                            {gelombangs.length === 0
                                ? 'Belum ada jadwal gelombang'
                                : 'Gelombang tidak ditemukan'}
                        </h3>
                        <p className="text-xs text-content-secondary mt-1 max-w-sm mx-auto">
                            {gelombangs.length === 0
                                ? 'Tambahkan gelombang pendaftaran baru agar calon siswa dapat mengisi formulir SPMB online.'
                                : 'Coba ubah kata kunci pencarian atau filter status untuk melihat jadwal gelombang lainnya.'}
                        </p>
                        {gelombangs.length === 0 && (
                            <div className="mt-4">
                                <CmsButton
                                    hierarchy="primary"
                                    size="sm"
                                    prefixIcon={<IconPlus size={15} />}
                                    onClick={openCreateDrawer}
                                >
                                    Tambah Gelombang
                                </CmsButton>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Slide-Over Drawer: Tambah / Edit Gelombang */}
            {drawerOpen &&
                createPortal(
                    <div className="fixed inset-0 z-[60] flex justify-end">
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 bg-brand-900/35 backdrop-blur-[1px] transition-opacity"
                            onClick={closeDrawer}
                        />

                        {/* Panel Drawer */}
                        <div className="relative z-[70] w-full max-w-lg bg-surface-primary h-full shadow-2xl border-l border-stroke-card flex flex-col">
                            {/* Header Drawer */}
                            <div className="px-5 py-4 border-b border-stroke-card bg-surface-primary flex items-center justify-between gap-3">
                                <div>
                                    <h2 className="text-base sm:text-lg font-bold text-content-primary">
                                        {editingItem
                                            ? 'Ubah Jadwal Gelombang'
                                            : 'Tambah Jadwal Gelombang'}
                                    </h2>
                                    <p className="text-xs text-content-secondary mt-0.5">
                                        Atur periode pembukaan dan penutupan pendaftaran online.
                                    </p>
                                </div>
                                <CmsButton
                                    hierarchy="tertiary"
                                    size="icon-sm"
                                    onClick={closeDrawer}
                                    disabled={form.processing}
                                    aria-label="Tutup panel"
                                >
                                    <IconX size={18} />
                                </CmsButton>
                            </div>

                            {/* Form Body */}
                            <form
                                id="gelombang-form"
                                onSubmit={handleSubmit}
                                className="flex-1 overflow-y-auto p-5 space-y-5"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-content-primary mb-1.5">
                                        Nama Gelombang <span className="text-content-negative">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={form.data.nama_gelombang}
                                        onChange={(e) =>
                                            form.setData('nama_gelombang', e.target.value)
                                        }
                                        placeholder="Masukkan nama gelombang..."
                                        className={inputClass(Boolean(form.errors.nama_gelombang))}
                                    />
                                    {form.errors.nama_gelombang && (
                                        <p className="mt-1 text-xs font-medium text-content-negative">
                                            {form.errors.nama_gelombang}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-content-primary mb-1.5">
                                        Tahun Ajaran <span className="text-content-negative">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={form.data.tahun_ajaran}
                                        onChange={(e) =>
                                            form.setData('tahun_ajaran', e.target.value)
                                        }
                                        placeholder="Masukkan tahun ajaran..."
                                        className={inputClass(Boolean(form.errors.tahun_ajaran))}
                                    />
                                    <p className="mt-1 text-xs text-content-tertiary">
                                        Format tahun ajaran akademik (contoh: 2026/2027).
                                    </p>
                                    {form.errors.tahun_ajaran && (
                                        <p className="mt-1 text-xs font-medium text-content-negative">
                                            {form.errors.tahun_ajaran}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-content-primary mb-1.5">
                                            Tanggal Buka{' '}
                                            <span className="text-content-negative">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            value={form.data.tanggal_buka}
                                            onChange={(e) =>
                                                form.setData('tanggal_buka', e.target.value)
                                            }
                                            className={inputClass(
                                                Boolean(form.errors.tanggal_buka)
                                            )}
                                        />
                                        {form.errors.tanggal_buka && (
                                            <p className="mt-1 text-xs font-medium text-content-negative">
                                                {form.errors.tanggal_buka}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-content-primary mb-1.5">
                                            Tanggal Tutup{' '}
                                            <span className="text-content-negative">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            value={form.data.tanggal_tutup}
                                            onChange={(e) =>
                                                form.setData('tanggal_tutup', e.target.value)
                                            }
                                            className={inputClass(
                                                Boolean(form.errors.tanggal_tutup)
                                            )}
                                        />
                                        {form.errors.tanggal_tutup && (
                                            <p className="mt-1 text-xs font-medium text-content-negative">
                                                {form.errors.tanggal_tutup}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="p-4 rounded-xl border border-stroke-card bg-surface-primary flex items-center justify-between gap-4">
                                        <div>
                                            <div className="text-sm font-medium text-content-primary">
                                                Status Pendaftaran
                                            </div>
                                            <p className="text-xs text-content-tertiary mt-0.5">
                                                Aktifkan agar calon siswa dapat mendaftar pada gelombang
                                                ini.
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            role="switch"
                                            aria-checked={form.data.status_gelombang_buka}
                                            onClick={() => {
                                                const nextState = !form.data.status_gelombang_buka;
                                                if (
                                                    nextState &&
                                                    activeGelombang &&
                                                    (!editingItem || editingItem.id !== activeGelombang.id)
                                                ) {
                                                    Swal.fire({
                                                        icon: 'warning',
                                                        title: 'Gelombang Lain Masih Aktif!',
                                                        html: `Saat ini <b>${activeGelombang.nama_gelombang} (${activeGelombang.tahun_ajaran})</b> masih berstatus <b>DIBUKA</b>.<br><br>Hanya 1 gelombang yang dapat aktif dalam satu waktu.`,
                                                        confirmButtonText: 'Mengerti',
                                                        confirmButtonColor: '#0968f6',
                                                    });
                                                    return;
                                                }
                                                form.setData('status_gelombang_buka', nextState);
                                            }}
                                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
                                                form.data.status_gelombang_buka
                                                    ? 'bg-positive-600 border-positive-600'
                                                    : 'bg-stroke-input border-stroke-input'
                                            }`}
                                        >
                                            <span
                                                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-xs transition-transform ${
                                                    form.data.status_gelombang_buka
                                                        ? 'translate-x-4'
                                                        : 'translate-x-0.5'
                                                }`}
                                            />
                                        </button>
                                    </div>

                                    {activeGelombang && (!editingItem || editingItem.id !== activeGelombang.id) && (
                                        <div className="p-3 rounded-lg bg-warning-50 border border-warning-200 text-xs text-content-warning flex items-start gap-2">
                                            <IconAlertCircle size={16} className="shrink-0 mt-0.5" />
                                            <span>
                                                <strong>Aturan Sistem:</strong> Saat ini <strong>{activeGelombang.nama_gelombang}</strong> sedang dibuka. Tutup gelombang tersebut terlebih dahulu jika ingin membuka gelombang ini.
                                            </span>
                                        </div>
                                    )}

                                    {form.errors.status_gelombang_buka && (
                                        <p className="text-xs font-medium text-content-negative">
                                            {form.errors.status_gelombang_buka}
                                        </p>
                                    )}
                                </div>
                            </form>

                            {/* Footer Drawer (Permukaan Putih) */}
                            <div className="px-5 py-4 border-t border-stroke-card bg-surface-primary flex items-center justify-end gap-2.5">
                                <CmsButton
                                    type="button"
                                    hierarchy="secondary"
                                    size="md"
                                    onClick={closeDrawer}
                                    disabled={form.processing}
                                >
                                    Batal
                                </CmsButton>
                                <CmsButton
                                    type="submit"
                                    form="gelombang-form"
                                    hierarchy="primary"
                                    size="md"
                                    loading={form.processing}
                                >
                                    {editingItem ? 'Simpan Perubahan' : 'Simpan Gelombang'}
                                </CmsButton>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}

            {/* Modal Konfirmasi Hapus */}
            {deleteTarget &&
                createPortal(
                    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
                        <div
                            className="fixed inset-0 bg-brand-900/40 backdrop-blur-[1px]"
                            onClick={() => !deleting && setDeleteTarget(null)}
                        />
                        <div className="relative z-10 w-full max-w-md bg-surface-primary rounded-xl border border-stroke-card shadow-2xl overflow-hidden">
                            <div className="p-5 sm:p-6">
                                <div className="w-10 h-10 rounded-full bg-negative-100 text-content-negative flex items-center justify-center mb-4">
                                    <IconAlertCircle size={20} />
                                </div>
                                <h3 className="text-base font-bold text-content-primary">
                                    Hapus Jadwal Gelombang?
                                </h3>
                                <p className="text-sm text-content-secondary mt-1.5">
                                    Anda yakin ingin menghapus{' '}
                                    <strong className="text-content-primary">
                                        {deleteTarget.nama_gelombang}
                                    </strong>
                                    ? Tindakan ini tidak dapat dibatalkan.
                                </p>
                            </div>
                            <div className="px-5 py-4 border-t border-stroke-card bg-surface-primary flex items-center justify-end gap-2.5">
                                <CmsButton
                                    hierarchy="secondary"
                                    size="md"
                                    onClick={() => setDeleteTarget(null)}
                                    disabled={deleting}
                                >
                                    Batal
                                </CmsButton>
                                <CmsButton
                                    hierarchy="primary"
                                    tone="danger"
                                    size="md"
                                    loading={deleting}
                                    onClick={handleConfirmDelete}
                                >
                                    Hapus Gelombang
                                </CmsButton>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
        </AdminLayout>
    );
}
