import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { router, useForm } from '@inertiajs/react';
import {
    IconAlertCircle,
    IconBrandWhatsapp,
    IconCheck,
    IconChevronLeft,
    IconChevronRight,
    IconChevronsLeft,
    IconChevronsRight,
    IconClock,
    IconDownload,
    IconExternalLink,
    IconEye,
    IconFileDescription,
    IconFileSpreadsheet,
    IconFileTypePdf,
    IconFilter,
    IconId,
    IconRefresh,
    IconSchool,
    IconSearch,
    IconTrash,
    IconUser,
    IconUsers,
    IconX,
} from '@tabler/icons-react';
import AdminLayout from '@/Layouts/AdminLayout';
import CmsButton from '@/Components/Admin/CmsButton';

const STATUS_CONFIG = {
    menunggu_verifikasi: {
        label: 'Menunggu Verifikasi',
        badgeClass: 'border-stroke-card bg-surface-secondary text-content-primary font-medium',
        dotClass: 'bg-amber-500',
    },
    berkas_lengkap: {
        label: 'Berkas Lengkap',
        badgeClass: 'border-stroke-card bg-surface-secondary text-content-primary font-medium',
        dotClass: 'bg-blue-500',
    },
    diterima: {
        label: 'Diterima',
        badgeClass: 'border-stroke-card bg-surface-secondary text-content-primary font-medium',
        dotClass: 'bg-emerald-500',
    },
    perlu_perbaikan: {
        label: 'Perlu Perbaikan',
        badgeClass: 'border-stroke-card bg-surface-secondary text-content-primary font-medium',
        dotClass: 'bg-amber-600',
    },
    ditolak: {
        label: 'Ditolak',
        badgeClass: 'border-stroke-card bg-surface-secondary text-content-primary font-medium',
        dotClass: 'bg-neutral-400',
    },
};

function StatusBadge({ status }) {
    const config = STATUS_CONFIG[status] || {
        label: status || '-',
        badgeClass: 'border-stroke-card bg-surface-secondary text-content-secondary',
        dotClass: 'bg-content-tertiary',
    };

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border ${config.badgeClass}`}
        >
            <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`} />
            <span>{config.label}</span>
        </span>
    );
}

function TailwindPagination({
    currentPage = 1,
    totalPages = 1,
    pageSize = 10,
    pageSizeOptions = [10, 20, 50, 100],
    onPageChange,
    onPageSizeChange,
    disabled = false,
}) {
    const [pageInput, setPageInput] = useState(String(currentPage));

    useEffect(() => {
        setPageInput(String(currentPage));
    }, [currentPage]);

    if (totalPages <= 0) return null;

    const commitPageInput = () => {
        const parsed = parseInt(pageInput.replace(/\D/g, ''), 10);
        const clamped = Number.isNaN(parsed)
            ? currentPage
            : Math.min(totalPages, Math.max(1, parsed));
        setPageInput(String(clamped));
        if (clamped !== currentPage && !disabled) {
            onPageChange?.(clamped);
        }
    };

    const startPage =
        currentPage === 1
            ? 1
            : currentPage === totalPages
                ? Math.max(1, totalPages - 2)
                : currentPage - 1;
    const endPage =
        currentPage === 1
            ? Math.min(3, totalPages)
            : currentPage === totalPages
                ? totalPages
                : Math.min(totalPages, currentPage + 1);

    const visiblePages = [];
    for (let p = startPage; p <= endPage; p += 1) {
        visiblePages.push(p);
    }

    const navBtnClass = (isDisabled) =>
        `w-8 h-8 rounded-md inline-flex items-center justify-center transition ${
            isDisabled
                ? 'text-content-disabled opacity-50 cursor-not-allowed'
                : 'text-content-secondary hover:bg-surface-secondary hover:text-content-primary focus:outline-none focus:ring-2 focus:ring-brand-500/20'
        }`;

    return (
        <nav
            aria-label="Navigasi halaman"
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm text-content-secondary"
        >
            <div className="flex items-center gap-2.5">
                <span className="font-medium text-content-primary">Baris per halaman</span>
                <select
                    value={pageSize}
                    disabled={disabled}
                    aria-label="Baris per halaman"
                    onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
                    className="h-8 py-0 pl-2.5 pr-7 text-xs sm:text-sm font-medium leading-[30px] rounded-md border border-stroke-input bg-surface-primary text-content-primary shadow-xs cursor-pointer transition focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 disabled:opacity-50"
                >
                    {pageSizeOptions.map((opt) => (
                        <option key={opt} value={opt}>
                            {opt}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 sm:gap-4">
                <div className="flex items-center gap-2">
                    <span>Halaman</span>
                    <input
                        type="text"
                        inputMode="numeric"
                        aria-label="Halaman saat ini"
                        disabled={disabled}
                        value={pageInput}
                        onChange={(e) => setPageInput(e.target.value.replace(/\D/g, ''))}
                        onBlur={commitPageInput}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                commitPageInput();
                            }
                        }}
                        className="w-11 h-8 px-1.5 text-center text-sm font-medium rounded-md border border-stroke-input bg-surface-primary text-content-primary shadow-xs transition focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 disabled:opacity-50"
                    />
                    <span>dari {totalPages}</span>
                </div>

                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        disabled={disabled || currentPage === 1}
                        onClick={() => onPageChange?.(1)}
                        aria-label="Halaman pertama"
                        className={navBtnClass(disabled || currentPage === 1)}
                    >
                        <IconChevronsLeft size={16} />
                    </button>
                    <button
                        type="button"
                        disabled={disabled || currentPage === 1}
                        onClick={() => onPageChange?.(currentPage - 1)}
                        aria-label="Halaman sebelumnya"
                        className={navBtnClass(disabled || currentPage === 1)}
                    >
                        <IconChevronLeft size={16} />
                    </button>

                    {visiblePages.map((page) => {
                        const isActive = page === currentPage;
                        return (
                            <button
                                key={page}
                                type="button"
                                disabled={disabled}
                                onClick={() => onPageChange?.(page)}
                                className={`w-8 h-8 rounded-md text-xs font-semibold transition ${
                                    isActive
                                        ? 'bg-brand-500 text-white shadow-xs'
                                        : 'text-content-secondary hover:bg-surface-secondary hover:text-content-primary'
                                }`}
                            >
                                {page}
                            </button>
                        );
                    })}

                    <button
                        type="button"
                        disabled={disabled || currentPage === totalPages}
                        onClick={() => onPageChange?.(currentPage + 1)}
                        aria-label="Halaman selanjutnya"
                        className={navBtnClass(disabled || currentPage === totalPages)}
                    >
                        <IconChevronRight size={16} />
                    </button>
                    <button
                        type="button"
                        disabled={disabled || currentPage === totalPages}
                        onClick={() => onPageChange?.(totalPages)}
                        aria-label="Halaman terakhir"
                        className={navBtnClass(disabled || currentPage === totalPages)}
                    >
                        <IconChevronsRight size={16} />
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default function Pendaftar({
    title = 'Data Pendaftar Siswa',
    pendaftars,
    stats,
    gelombangs = [],
    filters = {},
}) {
    // Filter State
    const [searchTerm, setSearchTerm] = useState(filters.q || '');
    const [selectedGelombang, setSelectedGelombang] = useState(filters.gelombang_id || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');
    const [perPage, setPerPage] = useState(filters.per_page || 10);

    // Detail & Verifikasi Drawer State
    const [activePendaftar, setActivePendaftar] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    // Delete Modal State
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // Verifikasi Form
    const verifikasiForm = useForm({
        status_pendaftaran: 'menunggu_verifikasi',
        catatan_verifikasi: '',
    });

    useEffect(() => {
        if (activePendaftar) {
            verifikasiForm.setData({
                status_pendaftaran: activePendaftar.status_pendaftaran || 'menunggu_verifikasi',
                catatan_verifikasi: activePendaftar.catatan_verifikasi || '',
            });
            verifikasiForm.clearErrors();
        }
    }, [activePendaftar]);

    // Handle ESC key & scroll locking for drawer/modal
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
            if (deleteTarget && !deleting) {
                setDeleteTarget(null);
                return;
            }
            if (drawerOpen && !verifikasiForm.processing) {
                setDrawerOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [drawerOpen, deleteTarget, deleting, verifikasiForm.processing]);

    // Filter apply handler
    const applyFilters = (overrides = {}) => {
        const currentParams = {
            q: searchTerm.trim() || undefined,
            gelombang_id: selectedGelombang || undefined,
            status: selectedStatus || undefined,
            per_page: perPage !== 10 ? perPage : undefined,
            ...overrides,
        };

        router.get('/admin/spmb-pendaftar', currentParams, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        applyFilters({ page: 1 });
    };

    const handleGelombangChange = (val) => {
        setSelectedGelombang(val);
        applyFilters({ gelombang_id: val || undefined, page: 1 });
    };

    const handleStatusFilterChange = (val) => {
        const nextStatus = selectedStatus === val ? '' : val;
        setSelectedStatus(nextStatus);
        applyFilters({ status: nextStatus || undefined, page: 1 });
    };

    const handleResetAllFilters = () => {
        setSearchTerm('');
        setSelectedGelombang('');
        setSelectedStatus('');
        setPerPage(10);
        router.get('/admin/spmb-pendaftar', {}, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const openDrawer = (item) => {
        setActivePendaftar(item);
        setDrawerOpen(true);
    };

    const closeDrawer = () => {
        if (verifikasiForm.processing) return;
        setDrawerOpen(false);
        setActivePendaftar(null);
    };

    const handleSubmitVerifikasi = (e) => {
        e.preventDefault();
        if (!activePendaftar) return;

        verifikasiForm.patch(`/admin/spmb-pendaftar/${activePendaftar.id}/status`, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                closeDrawer();
            },
        });
    };

    const handleConfirmDelete = () => {
        if (!deleteTarget || deleting) return;
        setDeleting(true);

        router.delete(`/admin/spmb-pendaftar/${deleteTarget.id}`, {
            preserveScroll: true,
            preserveState: true,
            onFinish: () => {
                setDeleting(false);
                setDeleteTarget(null);
            },
        });
    };

    const formatWhatsAppLink = (phone) => {
        if (!phone) return '#';
        let clean = phone.replace(/\D/g, '');
        if (clean.startsWith('0')) {
            clean = '62' + clean.slice(1);
        }
        return `https://wa.me/${clean}`;
    };

    const formatDateIndo = (dateStr) => {
        if (!dateStr) return '-';
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
            });
        } catch {
            return dateStr;
        }
    };

    const dataList = pendaftars?.data || [];
    const totalData = pendaftars?.total || 0;
    const currentPage = pendaftars?.current_page || 1;
    const lastPage = pendaftars?.last_page || 1;

    // URL Export Excel yang dinamis mengikuti filter aktif
    const exportUrl = useMemo(() => {
        const params = new URLSearchParams();
        if (searchTerm.trim()) params.append('q', searchTerm.trim());
        if (selectedGelombang) params.append('gelombang_id', selectedGelombang);
        if (selectedStatus) params.append('status', selectedStatus);
        const qs = params.toString();
        return `/admin/spmb-pendaftar/export${qs ? `?${qs}` : ''}`;
    }, [searchTerm, selectedGelombang, selectedStatus]);

    return (
        <AdminLayout
            title={title}
            subtitle="Kelola verifikasi berkas dan seleksi calon peserta didik baru SMK PGRI Gumelar."
            headerActions={
                <a
                    href="/spmb"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg border border-stroke-card bg-surface-primary text-xs font-semibold text-content-primary hover:bg-surface-secondary shadow-xs transition"
                >
                    <IconExternalLink size={15} className="text-content-secondary" />
                    <span>Lihat Formulir Publik</span>
                </a>
            }
        >
            <div className="space-y-6">
                {/* 1. KARTU STATISTIK METRIK CEPAT */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-surface-primary p-4 rounded-xl border border-stroke-card shadow-admin-card flex items-center gap-3.5">
                        <IconUsers size={26} stroke={1.5} className="text-content-tertiary shrink-0" />
                        <div>
                            <p className="text-xs font-medium text-content-tertiary">Total Pendaftar</p>
                            <p className="text-xl font-bold text-content-primary mt-0.5">
                                {stats?.total || 0}
                            </p>
                        </div>
                    </div>

                    <div className="bg-surface-primary p-4 rounded-xl border border-stroke-card shadow-admin-card flex items-center gap-3.5">
                        <IconClock size={26} stroke={1.5} className="text-content-tertiary shrink-0" />
                        <div>
                            <p className="text-xs font-medium text-content-tertiary">Menunggu Verifikasi</p>
                            <p className="text-xl font-bold text-content-primary mt-0.5">
                                {stats?.menunggu_verifikasi || 0}
                            </p>
                        </div>
                    </div>

                    <div className="bg-surface-primary p-4 rounded-xl border border-stroke-card shadow-admin-card flex items-center gap-3.5">
                        <IconCheck size={26} stroke={1.5} className="text-content-tertiary shrink-0" />
                        <div>
                            <p className="text-xs font-medium text-content-tertiary">Diterima / Lengkap</p>
                            <p className="text-xl font-bold text-content-primary mt-0.5">
                                {(stats?.diterima || 0) + (stats?.berkas_lengkap || 0)}
                            </p>
                        </div>
                    </div>

                    <div className="bg-surface-primary p-4 rounded-xl border border-stroke-card shadow-admin-card flex items-center gap-3.5">
                        <IconAlertCircle size={26} stroke={1.5} className="text-content-tertiary shrink-0" />
                        <div>
                            <p className="text-xs font-medium text-content-tertiary">Perbaikan / Ditolak</p>
                            <p className="text-xl font-bold text-content-primary mt-0.5">
                                {(stats?.perlu_perbaikan || 0) + (stats?.ditolak || 0)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* 2. TOOLBAR PENCARIAN & FILTER DALAM KARTU */}
                <div className="bg-surface-primary rounded-xl border border-stroke-card shadow-admin-card p-4 sm:p-5 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        {/* Input Pencarian */}
                        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
                            <IconSearch
                                size={18}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-content-tertiary pointer-events-none"
                            />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Cari nama siswa, no registrasi, NISN, atau SMP..."
                                className="w-full h-10 pl-10 pr-9 text-sm rounded-md border border-stroke-input bg-surface-primary text-content-primary placeholder:text-content-disabled shadow-xs transition focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
                            />
                            {searchTerm && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchTerm('');
                                        applyFilters({ q: undefined, page: 1 });
                                    }}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-content-tertiary hover:text-content-primary"
                                >
                                    <IconX size={16} />
                                </button>
                            )}
                        </form>

                        {/* Filter Gelombang & Reset */}
                        <div className="flex flex-wrap items-center gap-2.5">
                            <select
                                value={selectedGelombang}
                                onChange={(e) => handleGelombangChange(e.target.value)}
                                className="h-10 px-3 text-sm rounded-md border border-stroke-input bg-surface-primary text-content-primary shadow-xs transition focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
                            >
                                <option value="">Semua Gelombang</option>
                                {gelombangs.map((g) => (
                                    <option key={g.id} value={g.id}>
                                        {g.nama_gelombang} ({g.tahun_ajaran})
                                    </option>
                                ))}
                            </select>

                            {(searchTerm || selectedGelombang || selectedStatus) && (
                                <CmsButton
                                    type="button"
                                    hierarchy="tertiary"
                                    size="sm"
                                    prefixIcon={<IconRefresh size={14} />}
                                    onClick={handleResetAllFilters}
                                >
                                    Reset Filter
                                </CmsButton>
                            )}
                        </div>
                    </div>

                    {/* Chip Filter Status & Tombol Export Excel */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-stroke-card">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-medium text-content-tertiary mr-1">
                                Status:
                            </span>
                            <button
                                type="button"
                                onClick={() => handleStatusFilterChange('')}
                                className={`px-3 py-1 rounded-full text-xs transition border ${
                                    !selectedStatus
                                        ? 'border-content-primary bg-content-primary text-surface-primary font-semibold shadow-xs'
                                        : 'border-stroke-card bg-surface-primary text-content-secondary hover:bg-surface-secondary hover:text-content-primary font-medium'
                                }`}
                            >
                                Semua ({stats?.total || 0})
                            </button>

                            <button
                                type="button"
                                onClick={() => handleStatusFilterChange('menunggu_verifikasi')}
                                className={`px-3 py-1 rounded-full text-xs transition border ${
                                    selectedStatus === 'menunggu_verifikasi'
                                        ? 'border-content-primary bg-content-primary text-surface-primary font-semibold shadow-xs'
                                        : 'border-stroke-card bg-surface-primary text-content-secondary hover:bg-surface-secondary hover:text-content-primary font-medium'
                                }`}
                            >
                                Menunggu ({stats?.menunggu_verifikasi || 0})
                            </button>

                            <button
                                type="button"
                                onClick={() => handleStatusFilterChange('berkas_lengkap')}
                                className={`px-3 py-1 rounded-full text-xs transition border ${
                                    selectedStatus === 'berkas_lengkap'
                                        ? 'border-content-primary bg-content-primary text-surface-primary font-semibold shadow-xs'
                                        : 'border-stroke-card bg-surface-primary text-content-secondary hover:bg-surface-secondary hover:text-content-primary font-medium'
                                }`}
                            >
                                Berkas Lengkap ({stats?.berkas_lengkap || 0})
                            </button>

                            <button
                                type="button"
                                onClick={() => handleStatusFilterChange('diterima')}
                                className={`px-3 py-1 rounded-full text-xs transition border ${
                                    selectedStatus === 'diterima'
                                        ? 'border-content-primary bg-content-primary text-surface-primary font-semibold shadow-xs'
                                        : 'border-stroke-card bg-surface-primary text-content-secondary hover:bg-surface-secondary hover:text-content-primary font-medium'
                                }`}
                            >
                                Diterima ({stats?.diterima || 0})
                            </button>

                            <button
                                type="button"
                                onClick={() => handleStatusFilterChange('perlu_perbaikan')}
                                className={`px-3 py-1 rounded-full text-xs transition border ${
                                    selectedStatus === 'perlu_perbaikan'
                                        ? 'border-content-primary bg-content-primary text-surface-primary font-semibold shadow-xs'
                                        : 'border-stroke-card bg-surface-primary text-content-secondary hover:bg-surface-secondary hover:text-content-primary font-medium'
                                }`}
                            >
                                Perlu Perbaikan ({stats?.perlu_perbaikan || 0})
                            </button>

                            <button
                                type="button"
                                onClick={() => handleStatusFilterChange('ditolak')}
                                className={`px-3 py-1 rounded-full text-xs transition border ${
                                    selectedStatus === 'ditolak'
                                        ? 'border-content-primary bg-content-primary text-surface-primary font-semibold shadow-xs'
                                        : 'border-stroke-card bg-surface-primary text-content-secondary hover:bg-surface-secondary hover:text-content-primary font-medium'
                                }`}
                            >
                                Ditolak ({stats?.ditolak || 0})
                            </button>
                        </div>

                        {/* Tombol Export Excel di pojok kanan status (Tombol Hijau, Teks & Ikon Putih) */}
                        <div className="shrink-0 self-start sm:self-auto">
                            <a
                                href={exportUrl}
                                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition"
                                title="Export Rekap Data Siswa Pendaftar ke Excel (.xlsx)"
                            >
                                <IconFileSpreadsheet size={15} className="text-white" />
                                <span>Export Excel</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* 3. TABEL DATA PENDAFTAR SISWA */}
                <div className="bg-surface-primary rounded-xl border border-stroke-card shadow-admin-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-sm">
                            <thead>
                                <tr className="border-b border-stroke-card bg-surface-secondary text-content-secondary text-xs uppercase tracking-wider font-semibold">
                                    <th className="py-3 px-4 text-center">No. Registrasi</th>
                                    <th className="py-3 px-4 text-center">Calon Siswa</th>
                                    <th className="py-3 px-4 text-center">Asal SMP</th>
                                    <th className="py-3 px-4 text-center">Gelombang</th>
                                    <th className="py-3 px-4 text-center">Status</th>
                                    <th className="py-3 px-4 text-center">Tgl Daftar</th>
                                    <th className="py-3 px-4 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stroke-card text-content-primary">
                                {dataList.length > 0 ? (
                                    dataList.map((row) => (
                                        <tr
                                            key={row.id}
                                            className="hover:bg-surface-secondary/50 transition-colors"
                                        >
                                            {/* No Registrasi */}
                                            <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                                <span className="font-mono text-xs font-semibold text-content-primary">
                                                    {row.nomor_registrasi}
                                                </span>
                                            </td>

                                            {/* Calon Siswa */}
                                            <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                                <span className="font-semibold text-content-primary">
                                                    {row.nama_lengkap_siswa}
                                                </span>
                                            </td>

                                            {/* Asal Sekolah */}
                                            <td className="py-3.5 px-4 text-center text-content-secondary min-w-[150px]">
                                                {row.asal_sekolah_smp || '-'}
                                            </td>

                                            {/* Gelombang */}
                                            <td className="py-3.5 px-4 text-center text-content-secondary whitespace-nowrap">
                                                <span className="font-medium text-content-primary">
                                                    {row.spmb_gelombang?.nama_gelombang || 'Gelombang Default'}
                                                </span>
                                            </td>

                                            {/* Status Verifikasi */}
                                            <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                                <StatusBadge status={row.status_pendaftaran} />
                                            </td>

                                            {/* Tanggal Daftar */}
                                            <td className="py-3.5 px-4 text-center text-xs text-content-secondary whitespace-nowrap">
                                                {formatDateIndo(row.created_at)}
                                            </td>

                                            {/* Aksi */}
                                            <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                                <div className="inline-flex items-center justify-center gap-1.5">
                                                    {/* Detail & Verifikasi */}
                                                    <CmsButton
                                                        type="button"
                                                        hierarchy="tertiary"
                                                        tone="brand"
                                                        size="icon-sm"
                                                        title="Lihat rincian & verifikasi berkas"
                                                        onClick={() => openDrawer(row)}
                                                    >
                                                        <IconEye size={16} />
                                                    </CmsButton>

                                                    {/* Unduh Bukti PDF */}
                                                    <a
                                                        href={`/admin/spmb-pendaftar/${row.id}/pdf`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        title="Cetak/Unduh Bukti Registrasi PDF"
                                                        className="w-8 h-8 rounded-md inline-flex items-center justify-center text-brand-600 hover:bg-brand-500/10 transition select-none"
                                                    >
                                                        <IconFileTypePdf size={16} />
                                                    </a>

                                                    {/* Hapus */}
                                                    <CmsButton
                                                        type="button"
                                                        hierarchy="tertiary"
                                                        tone="danger"
                                                        size="icon-sm"
                                                        title="Hapus data pendaftar"
                                                        onClick={() => setDeleteTarget(row)}
                                                    >
                                                        <IconTrash size={16} />
                                                    </CmsButton>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="py-12 text-center text-content-disabled">
                                            <div className="flex flex-col items-center gap-2">
                                                <IconUsers size={32} className="text-content-disabled" />
                                                <p className="text-sm font-semibold text-content-secondary">
                                                    Tidak ada data pendaftar siswa yang ditemukan.
                                                </p>
                                                <p className="text-xs text-content-tertiary">
                                                    Coba ganti kata kunci pencarian atau ubah filter status di atas.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Footer */}
                    {totalData > 0 && (
                        <div className="p-4 border-t border-stroke-card bg-surface-primary">
                            <TailwindPagination
                                currentPage={currentPage}
                                totalPages={lastPage}
                                pageSize={perPage}
                                pageSizeOptions={[10, 20, 50, 100]}
                                onPageChange={(page) => applyFilters({ page })}
                                onPageSizeChange={(newSize) => {
                                    setPerPage(newSize);
                                    applyFilters({ per_page: newSize, page: 1 });
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* 4. SLIDE-OVER DRAWER: DETAIL & VERIFIKASI BERKAS */}
            {drawerOpen &&
                activePendaftar &&
                createPortal(
                    <div className="fixed inset-0 z-[60] flex justify-end">
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 bg-brand-900/35 backdrop-blur-[1px] transition-opacity"
                            onClick={closeDrawer}
                        />

                        {/* Panel Samping */}
                        <div className="relative z-[70] w-full max-w-xl bg-surface-primary h-full shadow-2xl border-l border-stroke-card flex flex-col overflow-hidden">
                            {/* Header Drawer */}
                            <div className="px-6 py-4 border-b border-stroke-card bg-surface-primary flex items-center justify-between">
                                <div>
                                    <h2 className="text-base sm:text-lg font-bold text-content-primary">
                                        Detail &amp; Verifikasi Pendaftar
                                    </h2>
                                    <p className="text-xs text-content-secondary mt-0.5">
                                        Nomor Registrasi:{' '}
                                        <span className="font-mono font-semibold text-content-primary">
                                            {activePendaftar.nomor_registrasi}
                                        </span>
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <a
                                        href={`/admin/spmb-pendaftar/${activePendaftar.id}/pdf`}
                                        target="_blank"
                                        rel="noreferrer"
                                        title="Cetak/Unduh Bukti Registrasi PDF"
                                        className="h-8 px-2.5 rounded-md border border-stroke-input bg-surface-primary text-xs font-medium text-content-primary hover:bg-surface-secondary inline-flex items-center gap-1.5 transition shadow-xs"
                                    >
                                        <IconFileTypePdf size={15} className="text-brand-600" />
                                        <span className="hidden sm:inline">Cetak PDF</span>
                                    </a>
                                    <button
                                        type="button"
                                        onClick={closeDrawer}
                                        className="w-8 h-8 rounded-md text-content-tertiary hover:bg-surface-secondary hover:text-content-primary inline-flex items-center justify-center transition"
                                    >
                                        <IconX size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Isi Konten Scrollable */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                {/* Seksi: Pilihan Pendaftaran & Jurusan */}
                                <div className="space-y-3">
                                    <h3 className="text-xs uppercase font-bold text-content-tertiary tracking-wider flex items-center gap-1.5">
                                        <IconSchool size={15} className="text-content-secondary" />
                                        <span>Pilihan Pendaftaran &amp; Jurusan</span>
                                    </h3>
                                    <div className="grid grid-cols-2 gap-3 text-xs bg-surface-secondary/40 p-4 rounded-xl border border-stroke-card">
                                        <div>
                                            <span className="text-content-tertiary block">Gelombang Pendaftaran</span>
                                            <span className="font-semibold text-content-primary text-sm">
                                                {activePendaftar.spmb_gelombang?.nama_gelombang || 'Gelombang Default'}
                                            </span>
                                            {activePendaftar.spmb_gelombang?.tahun_ajaran && (
                                                <span className="text-content-tertiary block text-[11px] mt-0.5">
                                                    Tahun Ajaran {activePendaftar.spmb_gelombang.tahun_ajaran}
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <span className="text-content-tertiary block">Pilihan Jurusan / Program Keahlian</span>
                                            <span className="font-semibold text-content-primary text-sm">
                                                {activePendaftar.pilihan_program_keahlian || '-'}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-content-tertiary block">Tanggal Mendaftar</span>
                                            <span className="font-medium text-content-primary">
                                                {formatDateIndo(activePendaftar.created_at)}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-content-tertiary block">Status Pendaftaran</span>
                                            <div className="mt-1">
                                                <StatusBadge status={activePendaftar.status_pendaftaran} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Seksi A: Biodata Calon Siswa */}
                                <div className="space-y-3">
                                    <h3 className="text-xs uppercase font-bold text-content-tertiary tracking-wider flex items-center gap-1.5">
                                        <IconUser size={15} className="text-content-secondary" />
                                        <span>A. Biodata Calon Siswa</span>
                                    </h3>
                                    <div className="grid grid-cols-2 gap-3 text-xs bg-surface-secondary/40 p-4 rounded-xl border border-stroke-card">
                                        <div>
                                            <span className="text-content-tertiary block">Nama Lengkap</span>
                                            <span className="font-semibold text-content-primary text-sm">
                                                {activePendaftar.nama_lengkap_siswa}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-content-tertiary block">Jenis Kelamin</span>
                                            <span className="font-medium text-content-primary">
                                                {activePendaftar.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-content-tertiary block">NISN Siswa</span>
                                            <span className="font-mono text-content-primary font-medium">
                                                {activePendaftar.nisn_siswa || '-'}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-content-tertiary block">NIK Siswa</span>
                                            <span className="font-mono text-content-primary font-medium">
                                                {activePendaftar.nik_siswa || '-'}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-content-tertiary block">Tempat, Tgl Lahir</span>
                                            <span className="text-content-primary">
                                                {activePendaftar.tempat_lahir_siswa},{' '}
                                                {formatDateIndo(activePendaftar.tanggal_lahir_siswa)}
                                            </span>
                                        </div>
                                        <div className="col-span-2">
                                            <span className="text-content-tertiary block">Asal Sekolah SMP</span>
                                            <span className="font-medium text-content-primary">
                                                {activePendaftar.asal_sekolah_smp || '-'}
                                            </span>
                                        </div>
                                        <div className="col-span-2">
                                            <span className="text-content-tertiary block">Alamat Domisili</span>
                                            <span className="text-content-primary">
                                                {activePendaftar.alamat_domisili_siswa || '-'}
                                            </span>
                                        </div>
                                        <div className="col-span-2 flex items-center justify-between pt-2 border-t border-stroke-card">
                                            <div>
                                                <span className="text-content-tertiary block">WhatsApp Siswa</span>
                                                <span className="font-mono text-content-primary font-medium">
                                                    {activePendaftar.nomor_whatsapp_siswa || '-'}
                                                </span>
                                            </div>
                                            {activePendaftar.nomor_whatsapp_siswa && (
                                                <a
                                                    href={formatWhatsAppLink(activePendaftar.nomor_whatsapp_siswa)}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-positive-100 text-content-positive text-xs font-semibold hover:bg-positive-600 hover:text-white transition"
                                                >
                                                    <IconBrandWhatsapp size={15} />
                                                    <span>Chat Siswa</span>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Seksi B: Data Orang Tua / Wali */}
                                <div className="space-y-3">
                                    <h3 className="text-xs uppercase font-bold text-content-tertiary tracking-wider flex items-center gap-1.5">
                                        <IconId size={15} className="text-content-secondary" />
                                        <span>B. Data Orang Tua / Wali</span>
                                    </h3>
                                    <div className="grid grid-cols-2 gap-3 text-xs bg-surface-secondary/40 p-4 rounded-xl border border-stroke-card">
                                        <div>
                                            <span className="text-content-tertiary block">Nama Ayah</span>
                                            <span className="font-medium text-content-primary">
                                                {activePendaftar.nama_ayah || '-'}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-content-tertiary block">Nama Ibu Kandung</span>
                                            <span className="font-medium text-content-primary">
                                                {activePendaftar.nama_ibu_kandung || '-'}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-content-tertiary block">Pekerjaan</span>
                                            <span className="text-content-primary">
                                                {activePendaftar.pekerjaan_orang_tua_wali || '-'}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-content-tertiary block">Nama Wali (Jika Ada)</span>
                                            <span className="text-content-primary">
                                                {activePendaftar.nama_wali || '-'}
                                            </span>
                                        </div>
                                        <div className="col-span-2 flex items-center justify-between pt-2 border-t border-stroke-card">
                                            <div>
                                                <span className="text-content-tertiary block">WhatsApp Wali</span>
                                                <span className="font-mono text-content-primary font-medium">
                                                    {activePendaftar.nomor_whatsapp_wali || '-'}
                                                </span>
                                            </div>
                                            {activePendaftar.nomor_whatsapp_wali && (
                                                <a
                                                    href={formatWhatsAppLink(activePendaftar.nomor_whatsapp_wali)}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-positive-100 text-content-positive text-xs font-semibold hover:bg-positive-600 hover:text-white transition"
                                                >
                                                    <IconBrandWhatsapp size={15} />
                                                    <span>Chat Wali</span>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Seksi C: Berkas Persyaratan yang Diunggah */}
                                <div className="space-y-3">
                                    <h3 className="text-xs uppercase font-bold text-content-tertiary tracking-wider flex items-center gap-1.5">
                                        <IconFileDescription size={15} className="text-content-secondary" />
                                        <span>C. Dokumen Berkas Persyaratan</span>
                                    </h3>
                                    <div className="space-y-2">
                                        {/* Kartu Keluarga */}
                                        <div className="p-3 rounded-lg border border-stroke-card bg-surface-primary flex items-center justify-between gap-3 text-xs">
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <IconFileTypePdf size={20} className="text-negative-600 shrink-0" />
                                                <div className="truncate">
                                                    <p className="font-semibold text-content-primary truncate">
                                                        Kartu Keluarga (KK)
                                                    </p>
                                                    <p className="text-content-tertiary text-[11px]">
                                                        {activePendaftar.file_kartu_keluarga
                                                            ? 'Dokumen terunggah'
                                                            : 'Belum diunggah'}
                                                    </p>
                                                </div>
                                            </div>
                                            {activePendaftar.file_kartu_keluarga ? (
                                                <a
                                                    href={activePendaftar.file_kartu_keluarga}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs border border-brand-500/20 bg-brand-500/10 text-brand-600 font-medium hover:bg-brand-500/15 transition shrink-0"
                                                >
                                                    <span>Lihat Berkas</span>
                                                    <IconExternalLink size={12} />
                                                </a>
                                            ) : (
                                                <span className="text-content-disabled italic">Tidak ada</span>
                                            )}
                                        </div>

                                        {/* Akta Kelahiran */}
                                        <div className="p-3 rounded-lg border border-stroke-card bg-surface-primary flex items-center justify-between gap-3 text-xs">
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <IconFileTypePdf size={20} className="text-brand-600 shrink-0" />
                                                <div className="truncate">
                                                    <p className="font-semibold text-content-primary truncate">
                                                        Akta Kelahiran
                                                    </p>
                                                    <p className="text-content-tertiary text-[11px]">
                                                        {activePendaftar.file_akta_kelahiran
                                                            ? 'Dokumen terunggah'
                                                            : 'Belum diunggah'}
                                                    </p>
                                                </div>
                                            </div>
                                            {activePendaftar.file_akta_kelahiran ? (
                                                <a
                                                    href={activePendaftar.file_akta_kelahiran}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs border border-brand-500/20 bg-brand-500/10 text-brand-600 font-medium hover:bg-brand-500/15 transition shrink-0"
                                                >
                                                    <span>Lihat Berkas</span>
                                                    <IconExternalLink size={12} />
                                                </a>
                                            ) : (
                                                <span className="text-content-disabled italic">Tidak ada</span>
                                            )}
                                        </div>

                                        {/* Ijazah / SKL */}
                                        <div className="p-3 rounded-lg border border-stroke-card bg-surface-primary flex items-center justify-between gap-3 text-xs">
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <IconFileTypePdf size={20} className="text-positive-600 shrink-0" />
                                                <div className="truncate">
                                                    <p className="font-semibold text-content-primary truncate">
                                                        Ijazah / Surat Keterangan Lulus (SKL)
                                                    </p>
                                                    <p className="text-content-tertiary text-[11px]">
                                                        {activePendaftar.file_ijazah_atau_skl
                                                            ? 'Dokumen terunggah'
                                                            : 'Belum diunggah'}
                                                    </p>
                                                </div>
                                            </div>
                                            {activePendaftar.file_ijazah_atau_skl ? (
                                                <a
                                                    href={activePendaftar.file_ijazah_atau_skl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs border border-brand-500/20 bg-brand-500/10 text-brand-600 font-medium hover:bg-brand-500/15 transition shrink-0"
                                                >
                                                    <span>Lihat Berkas</span>
                                                    <IconExternalLink size={12} />
                                                </a>
                                            ) : (
                                                <span className="text-content-disabled italic">Tidak ada</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Seksi D: Form Keputusan Verifikasi */}
                                <form id="form-verifikasi-pendaftar" onSubmit={handleSubmitVerifikasi} className="space-y-4 pt-2 border-t border-stroke-card">
                                    <h3 className="text-xs uppercase font-bold text-content-tertiary tracking-wider">
                                        D. Keputusan Verifikasi Panitia
                                    </h3>

                                    <div>
                                        <label className="block text-sm font-medium text-content-primary mb-1.5">
                                            Status Pendaftaran <span className="text-content-negative">*</span>
                                        </label>
                                        <select
                                            value={verifikasiForm.data.status_pendaftaran}
                                            onChange={(e) =>
                                                verifikasiForm.setData('status_pendaftaran', e.target.value)
                                            }
                                            className="w-full h-10 px-3 text-sm rounded-md border border-stroke-input bg-surface-primary text-content-primary shadow-xs transition focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
                                        >
                                            <option value="menunggu_verifikasi">Menunggu Verifikasi (Default)</option>
                                            <option value="berkas_lengkap">Berkas Lengkap &amp; Valid</option>
                                            <option value="diterima">Diterima Sebagai Siswa Baru</option>
                                            <option value="perlu_perbaikan">Perlu Perbaikan Berkas</option>
                                            <option value="ditolak">Ditolak</option>
                                        </select>
                                        {verifikasiForm.errors.status_pendaftaran && (
                                            <p className="mt-1 text-xs font-medium text-content-negative">
                                                {verifikasiForm.errors.status_pendaftaran}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label className="block text-sm font-medium text-content-primary">
                                                Catatan Verifikasi Panitia
                                            </label>
                                            <span className="text-xs text-content-tertiary">
                                                {verifikasiForm.data.catatan_verifikasi.length}/1000
                                            </span>
                                        </div>
                                        <textarea
                                            rows={3}
                                            maxLength={1000}
                                            value={verifikasiForm.data.catatan_verifikasi}
                                            onChange={(e) =>
                                                verifikasiForm.setData('catatan_verifikasi', e.target.value)
                                            }
                                            placeholder="Tuliskan catatan untuk siswa jika berkas perlu perbaikan atau petunjuk daftar ulang..."
                                            className="w-full p-3 text-sm rounded-md border border-stroke-input bg-surface-primary text-content-primary placeholder:text-content-disabled shadow-xs transition focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
                                        />
                                        <p className="mt-1 text-xs text-content-tertiary">
                                            Catatan ini dapat dibaca oleh calon siswa saat mengecek status pendaftaran.
                                        </p>
                                        {verifikasiForm.errors.catatan_verifikasi && (
                                            <p className="mt-1 text-xs font-medium text-content-negative">
                                                {verifikasiForm.errors.catatan_verifikasi}
                                            </p>
                                        )}
                                    </div>
                                </form>
                            </div>

                            {/* Footer Drawer */}
                            <div className="px-6 py-4 border-t border-stroke-card bg-surface-primary flex items-center justify-between gap-3">
                                <CmsButton
                                    type="button"
                                    hierarchy="secondary"
                                    size="md"
                                    onClick={closeDrawer}
                                    disabled={verifikasiForm.processing}
                                >
                                    Tutup
                                </CmsButton>

                                <CmsButton
                                    type="submit"
                                    form="form-verifikasi-pendaftar"
                                    hierarchy="primary"
                                    size="md"
                                    loading={verifikasiForm.processing}
                                >
                                    {verifikasiForm.processing ? 'Menyimpan...' : 'Simpan Keputusan'}
                                </CmsButton>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}

            {/* 5. MODAL KONFIRMASI HAPUS */}
            {deleteTarget &&
                createPortal(
                    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
                        <div
                            className="fixed inset-0 bg-brand-900/40 backdrop-blur-[1px] transition-opacity"
                            onClick={() => !deleting && setDeleteTarget(null)}
                        />

                        <div className="relative z-[90] w-full max-w-md bg-surface-primary rounded-xl shadow-2xl border border-stroke-card p-6 space-y-4">
                            <div className="flex items-center gap-3 text-content-negative">
                                <div className="w-10 h-10 rounded-full bg-negative-100 flex items-center justify-center shrink-0">
                                    <IconTrash size={20} />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-content-primary">
                                        Hapus Data Pendaftar?
                                    </h3>
                                    <p className="text-xs text-content-secondary mt-0.5">
                                        Tindakan ini tidak dapat dibatalkan.
                                    </p>
                                </div>
                            </div>

                            <p className="text-sm text-content-secondary leading-relaxed">
                                Apakah Anda yakin ingin menghapus data pendaftar{' '}
                                <strong className="text-content-primary font-semibold">
                                    {deleteTarget.nama_lengkap_siswa}
                                </strong>{' '}
                                dengan nomor registrasi{' '}
                                <span className="font-mono font-semibold text-content-primary">
                                    {deleteTarget.nomor_registrasi}
                                </span>
                                ? Seluruh berkas lampiran siswa ini juga akan dibersihkan.
                            </p>

                            <div className="pt-2 flex items-center justify-end gap-2.5">
                                <CmsButton
                                    type="button"
                                    hierarchy="secondary"
                                    size="md"
                                    onClick={() => setDeleteTarget(null)}
                                    disabled={deleting}
                                >
                                    Batal
                                </CmsButton>
                                <CmsButton
                                    type="button"
                                    hierarchy="primary"
                                    tone="danger"
                                    size="md"
                                    loading={deleting}
                                    onClick={handleConfirmDelete}
                                >
                                    {deleting ? 'Menghapus...' : 'Ya, Hapus'}
                                </CmsButton>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
        </AdminLayout>
    );
}
