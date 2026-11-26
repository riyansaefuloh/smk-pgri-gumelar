import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { router, useForm } from '@inertiajs/react';
import {
    IconChevronDown,
    IconChevronUp,
    IconEdit,
    IconEye,
    IconLayoutGrid,
    IconList,
    IconPhoto,
    IconPlus,
    IconRefresh,
    IconSearch,
    IconTrash,
    IconX,
} from '@tabler/icons-react';
import AdminLayout from '@/Layouts/AdminLayout';
import CmsButton from '@/Components/Admin/CmsButton';
import ImageDropzoneField from '@/Components/Admin/ImageDropzoneField';
import TailwindPagination from '@/Components/Admin/TailwindPagination';

function inputClass(hasError) {
    return `w-full h-10 px-3 text-sm rounded-md border bg-surface-primary text-content-primary placeholder:text-content-disabled shadow-xs transition focus:outline-none ${
        hasError
            ? 'border-negative-600 focus:border-negative-600 focus:ring-2 focus:ring-negative-500/15'
            : 'border-stroke-input focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15'
    }`;
}

function textareaClass(hasError) {
    return `w-full p-3 text-sm rounded-md border bg-surface-primary text-content-primary placeholder:text-content-disabled shadow-xs transition focus:outline-none ${
        hasError
            ? 'border-negative-600 focus:border-negative-600 focus:ring-2 focus:ring-negative-500/15'
            : 'border-stroke-input focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15'
    }`;
}

function GuruThumbnail({ src, alt, className = 'w-11 h-14 rounded-md' }) {
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        setFailed(false);
    }, [src]);

    return (
        <div className={`${className} border border-stroke-card bg-surface-secondary overflow-hidden flex items-center justify-center shrink-0`}>
            {src && !failed ? (
                <img
                    src={src}
                    alt={alt}
                    className="w-full h-full object-cover"
                    onError={() => setFailed(true)}
                />
            ) : (
                <IconPhoto size={18} className="text-content-disabled" />
            )}
        </div>
    );
}

/**
 * Halaman Direktori Guru & Staf (CMS Profil Sekolah)
 * - Header Halaman Publik (collapsible & simpan mandiri)
 * - Katalog Tabel / Grid, Pencarian, Pagination, Slide-Over Drawer, Modal Pratinjau & Hapus
 */
export default function GuruIndex({ title, gurus, header, totalGuru = 0, filters }) {
    const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'
    const [tableLoading, setTableLoading] = useState(false);

    const hasInitialHeader = Boolean(header?.judul_header?.trim());
    const [headerOpen, setHeaderOpen] = useState(!hasInitialHeader);

    // Filter & Search
    const [search, setSearch] = useState(filters?.search || '');
    const [perPage, setPerPage] = useState(Number(filters?.per_page) || 10);
    const perPageRef = useRef(perPage);
    const isFirstRender = useRef(true);

    // Overlay States
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingGuru, setEditingGuru] = useState(null);
    const [previewGuru, setPreviewGuru] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // Form Header Halaman Publik
    const headerForm = useForm({
        judul_header: header?.judul_header || '',
        subjudul_header: header?.subjudul_header || '',
    });

    const isHeaderDirty = useMemo(
        () =>
            headerForm.data.judul_header !== (header?.judul_header || '') ||
            headerForm.data.subjudul_header !== (header?.subjudul_header || ''),
        [headerForm.data, header]
    );

    // Form Tambah / Edit Guru
    const guruForm = useForm({
        _method: 'post',
        nama_lengkap_gelar: '',
        jabatan: '',
        mata_pelajaran: '',
        urutan_tampil: '0',
        foto_profil: null,
    });

    const [fotoPreviewUrl, setFotoPreviewUrl] = useState('');
    useEffect(() => {
        if (!guruForm.data.foto_profil) {
            setFotoPreviewUrl(editingGuru?.foto_profil || '');
            return undefined;
        }
        const objectUrl = URL.createObjectURL(guruForm.data.foto_profil);
        setFotoPreviewUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [guruForm.data.foto_profil, editingGuru?.foto_profil]);

    // Lock body scroll & Escape handler
    useEffect(() => {
        const hasOverlay = drawerOpen || Boolean(previewGuru) || Boolean(deleteTarget);
        document.body.style.overflow = hasOverlay ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [drawerOpen, previewGuru, deleteTarget]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key !== 'Escape') {
                return;
            }
            if (deleteTarget && !deleting) {
                setDeleteTarget(null);
                return;
            }
            if (previewGuru) {
                setPreviewGuru(null);
                return;
            }
            if (drawerOpen && !guruForm.processing) {
                closeDrawer();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [drawerOpen, previewGuru, deleteTarget, deleting, guruForm.processing]);

    const navigateList = (overrides = {}, { replace = false } = {}) => {
        const params = {
            search: overrides.search !== undefined ? overrides.search : search.trim(),
            per_page: overrides.per_page !== undefined ? overrides.per_page : perPageRef.current,
            page: overrides.page !== undefined ? overrides.page : 1,
        };
        if (!params.search) {
            delete params.search;
        }
        router.get('/admin/guru', params, {
            preserveState: true,
            preserveScroll: true,
            replace,
            onStart: () => setTableLoading(true),
            onFinish: () => setTableLoading(false),
        });
    };

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return undefined;
        }
        const timer = setTimeout(() => {
            navigateList({}, { replace: true });
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    const handleSubmitHeader = (e) => {
        e.preventDefault();
        headerForm.put('/admin/guru/header', {
            preserveScroll: true,
            preserveState: true,
            onSuccess: (page) => {
                const updated = page?.props?.header;
                headerForm.setData({
                    judul_header: updated?.judul_header ?? headerForm.data.judul_header.trim(),
                    subjudul_header: updated?.subjudul_header ?? headerForm.data.subjudul_header.trim(),
                });
            },
        });
    };

    const handleResetHeader = () => {
        headerForm.clearErrors();
        headerForm.setData({
            judul_header: header?.judul_header || '',
            subjudul_header: header?.subjudul_header || '',
        });
    };

    const openCreateDrawer = () => {
        setEditingGuru(null);
        guruForm.clearErrors();
        guruForm.setData({
            _method: 'post',
            nama_lengkap_gelar: '',
            jabatan: '',
            mata_pelajaran: '',
            urutan_tampil: '0',
            foto_profil: null,
        });
        setDrawerOpen(true);
    };

    const openEditDrawer = (item) => {
        setEditingGuru(item);
        guruForm.clearErrors();
        guruForm.setData({
            _method: 'put',
            nama_lengkap_gelar: item.nama_lengkap_gelar || '',
            jabatan: item.jabatan || '',
            mata_pelajaran: item.mata_pelajaran || '',
            urutan_tampil: String(item.urutan_tampil ?? 0),
            foto_profil: null,
        });
        setDrawerOpen(true);
    };

    const closeDrawer = () => {
        setDrawerOpen(false);
        setEditingGuru(null);
        guruForm.reset();
        guruForm.clearErrors();
    };

    const handleSubmitDrawer = (e) => {
        e.preventDefault();
        const url = editingGuru ? `/admin/guru/${editingGuru.id}` : '/admin/guru';
        guruForm.post(url, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => closeDrawer(),
        });
    };

    const handleConfirmDelete = () => {
        if (!deleteTarget || deleting) {
            return;
        }
        setDeleting(true);
        router.delete(`/admin/guru/${deleteTarget.id}`, {
            preserveScroll: true,
            onSuccess: () => setDeleteTarget(null),
            onFinish: () => setDeleting(false),
        });
    };

    const items = gurus?.data || [];
    const currentPage = gurus?.current_page || 1;
    const totalPages = gurus?.last_page || 1;

    const hasActiveFilters = Boolean(search.trim());

    return (
        <AdminLayout
            title={title || 'Direktori Guru & Staf'}
            subtitle="Kelola data dewan guru, tenaga kependidikan, dan staf sekolah dalam tampilan tabel maupun galeri kartu."
            headerActions={
                <CmsButton
                    hierarchy="primary"
                    size="md"
                    prefixIcon={<IconPlus size={16} />}
                    onClick={openCreateDrawer}
                >
                    Tambah Guru / Staf
                </CmsButton>
            }
        >
            <div className="space-y-5 text-content-primary">
                {/* CARD 1: Header Halaman Publik (Sesuai Pola Karya & Inovasi) */}
                <section className="bg-surface-primary border border-stroke-card rounded-xl shadow-admin-card overflow-hidden">
                    <div
                        className={`px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 ${
                            headerOpen ? 'border-b border-stroke-card' : ''
                        }`}
                    >
                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <h2 className="text-base font-bold text-content-primary">
                                    Header Halaman Publik (Direktori Guru &amp; Staf)
                                </h2>
                                {!headerOpen && isHeaderDirty && (
                                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-warning-100 border border-warning-500/30 text-xs font-medium text-content-warning">
                                        <span className="w-1.5 h-1.5 rounded-full bg-warning-500" />
                                        <span>Belum disimpan</span>
                                    </span>
                                )}
                            </div>
                            {!headerOpen ? (
                                <p className="text-sm text-content-secondary truncate mt-1">
                                    <span className="font-medium text-content-primary">
                                        {headerForm.data.judul_header || 'Judul header belum diisi'}
                                    </span>
                                    {headerForm.data.subjudul_header && (
                                        <span className="text-content-tertiary">
                                            {' '}— {headerForm.data.subjudul_header}
                                        </span>
                                    )}
                                </p>
                            ) : (
                                <p className="text-xs text-content-secondary mt-0.5">
                                    Judul utama dan teks pengantar di atas halaman publik direktori guru &amp; staf.
                                </p>
                            )}
                        </div>

                        <CmsButton
                            hierarchy="secondary"
                            size="sm"
                            suffixIcon={headerOpen ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />}
                            onClick={() => setHeaderOpen((prev) => !prev)}
                        >
                            {headerOpen ? 'Tutup' : 'Ubah Header'}
                        </CmsButton>
                    </div>

                    {headerOpen && (
                        <form onSubmit={handleSubmitHeader} noValidate className="p-5 space-y-4">
                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label htmlFor="judul_header" className="block text-sm font-medium text-content-primary">
                                            Judul Header <span className="text-content-negative">*</span>
                                        </label>
                                        <span className="text-xs text-content-tertiary">
                                            {headerForm.data.judul_header.length}/200
                                        </span>
                                    </div>
                                    <input
                                        id="judul_header"
                                        type="text"
                                        maxLength={200}
                                        value={headerForm.data.judul_header}
                                        onChange={(e) => headerForm.setData('judul_header', e.target.value)}
                                        placeholder="Masukkan judul header halaman direktori guru..."
                                        className={inputClass(Boolean(headerForm.errors.judul_header))}
                                    />
                                    {headerForm.errors.judul_header && (
                                        <p className="mt-1 text-xs font-medium text-content-negative">
                                            {headerForm.errors.judul_header}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label htmlFor="subjudul_header" className="block text-sm font-medium text-content-primary">
                                            Subjudul Header
                                        </label>
                                        <span className="text-xs text-content-tertiary">
                                            {headerForm.data.subjudul_header.length} karakter
                                        </span>
                                    </div>
                                    <textarea
                                        id="subjudul_header"
                                        rows={3}
                                        maxLength={1000}
                                        value={headerForm.data.subjudul_header}
                                        onChange={(e) => headerForm.setData('subjudul_header', e.target.value)}
                                        placeholder="Masukkan deskripsi pengantar halaman direktori guru..."
                                        className={textareaClass(Boolean(headerForm.errors.subjudul_header))}
                                    />
                                    <p className="mt-1 text-xs text-content-tertiary">
                                        Panjang ideal 100–250 karakter agar teks pengantar tetap ringkas.
                                    </p>
                                    {headerForm.errors.subjudul_header && (
                                        <p className="mt-1 text-xs font-medium text-content-negative">
                                            {headerForm.errors.subjudul_header}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="pt-3 border-t border-stroke-card flex flex-wrap items-center justify-between gap-2">
                                {isHeaderDirty && (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-warning-100 border border-warning-500/30 text-xs font-medium text-content-warning">
                                        <span className="w-1.5 h-1.5 rounded-full bg-warning-500" />
                                        <span>Perubahan belum disimpan</span>
                                    </span>
                                )}
                                <div className="flex flex-wrap items-center gap-2 ml-auto">
                                    {isHeaderDirty && (
                                        <CmsButton
                                            hierarchy="tertiary"
                                            size="sm"
                                            onClick={handleResetHeader}
                                            disabled={headerForm.processing}
                                        >
                                            Batalkan Perubahan
                                        </CmsButton>
                                    )}
                                    <CmsButton
                                        type="submit"
                                        hierarchy="primary"
                                        size="md"
                                        loading={headerForm.processing}
                                    >
                                        {headerForm.processing ? 'Menyimpan...' : 'Simpan Header'}
                                    </CmsButton>
                                </div>
                            </div>
                        </form>
                    )}
                </section>

                {/* CARD 2: Katalog Guru & Staf (Tab + View Switcher + Pencarian + Tabel/Galeri Grid) */}
                <section className="bg-surface-primary border border-stroke-card rounded-xl shadow-admin-card overflow-hidden">
                    <div className="px-5 pt-2.5 border-b border-stroke-card flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-1 overflow-x-auto">
                            <span className="px-3 py-2 text-sm border-b-2 border-brand-500 font-bold text-brand-600 whitespace-nowrap">
                                Semua ({totalGuru})
                            </span>
                        </div>

                        <div className="pb-2 flex items-center gap-2">
                            <div className="inline-flex rounded-md border border-stroke-card p-0.5 bg-surface-secondary">
                                <button
                                    type="button"
                                    onClick={() => setViewMode('table')}
                                    className={`inline-flex items-center gap-1.5 h-8 px-3 text-xs rounded transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/25 ${
                                        viewMode === 'table'
                                            ? 'bg-surface-primary border border-brand-200 text-brand-600 font-semibold shadow-xs'
                                            : 'text-content-secondary hover:text-content-primary font-medium'
                                    }`}
                                >
                                    <IconList size={14} className={viewMode === 'table' ? 'text-brand-500' : 'text-content-tertiary'} />
                                    <span>Tabel</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setViewMode('grid')}
                                    className={`inline-flex items-center gap-1.5 h-8 px-3 text-xs rounded transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/25 ${
                                        viewMode === 'grid'
                                            ? 'bg-surface-primary border border-brand-200 text-brand-600 font-semibold shadow-xs'
                                            : 'text-content-secondary hover:text-content-primary font-medium'
                                    }`}
                                >
                                    <IconLayoutGrid size={14} className={viewMode === 'grid' ? 'text-brand-500' : 'text-content-tertiary'} />
                                    <span>Galeri Grid</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Toolbar Pencarian */}
                    <div className="px-5 py-3 bg-surface-primary border-b border-stroke-card flex flex-wrap items-center justify-between gap-2.5">
                        <div className="relative w-full sm:w-64">
                            <IconSearch
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-content-tertiary pointer-events-none"
                            />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari nama, jabatan, atau mapel..."
                                aria-label="Cari nama, jabatan, atau mapel"
                                className="w-full h-10 pl-9 pr-3 text-sm rounded-md border border-stroke-input bg-surface-primary text-content-primary placeholder:text-content-disabled shadow-xs transition focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
                            />
                        </div>

                        {hasActiveFilters && (
                            <CmsButton
                                hierarchy="tertiary"
                                tone="brand"
                                size="md"
                                prefixIcon={<IconRefresh size={16} />}
                                onClick={() => setSearch('')}
                            >
                                Reset
                            </CmsButton>
                        )}
                    </div>

                    <div className="relative">
                        {tableLoading && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface-primary/75 backdrop-blur-[1px]">
                                <span className="text-xs font-medium text-brand-600">
                                    Memuat data...
                                </span>
                            </div>
                        )}

                        {items.length === 0 ? (
                            <div className="py-12 text-center">
                                <div className="flex flex-col items-center space-y-2.5 max-w-md mx-auto px-4">
                                    <p className="text-base font-semibold text-content-primary">
                                        {hasActiveFilters ? 'Data tidak ditemukan' : 'Belum ada data guru atau staf'}
                                    </p>
                                    <p className="text-sm text-content-secondary leading-relaxed">
                                        {hasActiveFilters
                                            ? 'Tidak ada data guru atau staf yang sesuai dengan kata kunci pencarian.'
                                            : 'Mulai tambahkan data guru, kepala sekolah, maupun staf tata usaha untuk ditampilkan di portal publik.'}
                                    </p>
                                    <div className="pt-1">
                                        {hasActiveFilters ? (
                                            <CmsButton
                                                hierarchy="secondary"
                                                size="sm"
                                                prefixIcon={<IconRefresh size={14} className="text-brand-500" />}
                                                onClick={() => setSearch('')}
                                            >
                                                Reset Pencarian
                                            </CmsButton>
                                        ) : (
                                            <CmsButton
                                                hierarchy="secondary"
                                                size="sm"
                                                prefixIcon={<IconPlus size={14} className="text-brand-500" />}
                                                onClick={openCreateDrawer}
                                            >
                                                Tambah Guru / Staf Pertama
                                            </CmsButton>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : viewMode === 'table' ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs border-collapse">
                                    <thead className="bg-surface-secondary text-content-primary font-semibold uppercase tracking-wider border-b border-stroke-card">
                                        <tr>
                                            <th className="px-4 py-3">Guru / Staf</th>
                                            <th className="px-4 py-3 w-48">Jabatan</th>
                                            <th className="px-4 py-3 w-48">Mata Pelajaran</th>
                                            <th className="px-4 py-3 w-24 text-center">Urutan</th>
                                            <th className="px-4 py-3 w-32 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-stroke-card">
                                        {items.map((item) => (
                                            <tr key={item.id} className="hover:bg-brand-50/60 transition-colors">
                                                <td className="px-4 py-3 align-middle">
                                                    <button
                                                        type="button"
                                                        onClick={() => setPreviewGuru(item)}
                                                        title="Klik untuk pratinjau profil"
                                                        className="flex items-center gap-3 max-w-md text-left group focus:outline-none"
                                                    >
                                                        <GuruThumbnail
                                                            src={item.foto_profil}
                                                            alt={item.nama_lengkap_gelar}
                                                        />
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-bold text-content-primary truncate group-hover:text-brand-600 group-hover:underline">
                                                                {item.nama_lengkap_gelar}
                                                            </p>
                                                        </div>
                                                    </button>
                                                </td>
                                                <td className="px-4 py-3 align-middle">
                                                    <span className="inline-block text-xs px-2.5 py-0.5 rounded-full border border-brand-500/20 bg-brand-500/10 text-brand-600 font-medium">
                                                        {item.jabatan}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 align-middle text-xs text-content-secondary">
                                                    {item.mata_pelajaran || <span className="text-content-disabled">-</span>}
                                                </td>
                                                <td className="px-4 py-3 text-center font-semibold text-content-secondary align-middle">
                                                    #{item.urutan_tampil ?? 0}
                                                </td>
                                                <td className="px-4 py-3 align-middle">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <CmsButton
                                                            hierarchy="tertiary"
                                                            tone="brand"
                                                            size="icon-sm"
                                                            title="Pratinjau"
                                                            aria-label={`Pratinjau ${item.nama_lengkap_gelar}`}
                                                            onClick={() => setPreviewGuru(item)}
                                                            prefixIcon={<IconEye size={15} />}
                                                        />
                                                        <CmsButton
                                                            hierarchy="tertiary"
                                                            tone="warning"
                                                            size="icon-sm"
                                                            title="Edit"
                                                            aria-label={`Edit ${item.nama_lengkap_gelar}`}
                                                            onClick={() => openEditDrawer(item)}
                                                            prefixIcon={<IconEdit size={15} />}
                                                        />
                                                        <CmsButton
                                                            hierarchy="tertiary"
                                                            tone="danger"
                                                            size="icon-sm"
                                                            title="Hapus"
                                                            aria-label={`Hapus ${item.nama_lengkap_gelar}`}
                                                            onClick={() => setDeleteTarget(item)}
                                                            prefixIcon={<IconTrash size={15} />}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="rounded-xl border border-stroke-card bg-surface-primary overflow-hidden flex flex-col shadow-xs hover:border-brand-300 transition-colors"
                                    >
                                        <button
                                            type="button"
                                            onClick={() => setPreviewGuru(item)}
                                            className="w-full text-left focus:outline-none group"
                                        >
                                            <GuruThumbnail
                                                src={item.foto_profil}
                                                alt={item.nama_lengkap_gelar}
                                                className="w-full aspect-[3/4]"
                                            />
                                        </button>
                                        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                                            <div className="space-y-1.5">
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border border-brand-500/20 bg-brand-500/10 text-brand-600 font-medium truncate">
                                                        {item.jabatan}
                                                    </span>
                                                    <span className="text-xs font-semibold text-content-tertiary shrink-0">
                                                        #{item.urutan_tampil ?? 0}
                                                    </span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setPreviewGuru(item)}
                                                    className="text-left focus:outline-none group"
                                                >
                                                    <h3 className="text-base font-bold text-content-primary line-clamp-2 group-hover:text-brand-600 group-hover:underline">
                                                        {item.nama_lengkap_gelar}
                                                    </h3>
                                                </button>
                                                {item.mata_pelajaran && (
                                                    <p className="text-xs text-content-secondary line-clamp-1">
                                                        {item.mata_pelajaran}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="pt-2 border-t border-stroke-card flex items-center justify-end gap-1">
                                                <CmsButton
                                                    hierarchy="tertiary"
                                                    tone="brand"
                                                    size="icon-sm"
                                                    title="Pratinjau"
                                                    aria-label={`Pratinjau ${item.nama_lengkap_gelar}`}
                                                    onClick={() => setPreviewGuru(item)}
                                                    prefixIcon={<IconEye size={15} />}
                                                />
                                                <CmsButton
                                                    hierarchy="tertiary"
                                                    tone="warning"
                                                    size="icon-sm"
                                                    title="Edit"
                                                    aria-label={`Edit ${item.nama_lengkap_gelar}`}
                                                    onClick={() => openEditDrawer(item)}
                                                    prefixIcon={<IconEdit size={15} />}
                                                />
                                                <CmsButton
                                                    hierarchy="tertiary"
                                                    tone="danger"
                                                    size="icon-sm"
                                                    title="Hapus"
                                                    aria-label={`Hapus ${item.nama_lengkap_gelar}`}
                                                    onClick={() => setDeleteTarget(item)}
                                                    prefixIcon={<IconTrash size={15} />}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Pagination Footer (Tailwind) */}
                    {(gurus?.total || 0) > 0 && (
                        <div className="px-5 py-3.5 border-t border-stroke-card bg-surface-primary">
                            <TailwindPagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                pageSize={perPage}
                                pageSizeOptions={[10, 20, 50, 100]}
                                disabled={tableLoading}
                                onPageChange={(page) => navigateList({ page })}
                                onPageSizeChange={(size) => {
                                    setPerPage(size);
                                    perPageRef.current = size;
                                    navigateList({ per_page: size, page: 1 });
                                }}
                            />
                        </div>
                    )}
                </section>
            </div>

            {/* SLIDE-OVER DRAWER TAMBAH / EDIT GURU */}
            {drawerOpen &&
                createPortal(
                    <div className="fixed inset-0 z-[60] flex justify-end">
                        <div
                            className="fixed inset-0 bg-brand-900/35 backdrop-blur-[1px]"
                            onClick={() => !guruForm.processing && closeDrawer()}
                        />

                        <aside
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="drawer-guru-title"
                            className="relative z-[70] w-full max-w-lg bg-surface-primary h-full shadow-2xl border-l border-stroke-card flex flex-col"
                        >
                            <div className="px-5 py-4 border-b border-stroke-card flex items-center justify-between gap-3">
                                <div>
                                    <h3 id="drawer-guru-title" className="text-base sm:text-lg font-bold text-content-primary">
                                        {editingGuru ? 'Edit Data Guru / Staf' : 'Tambah Guru / Staf'}
                                    </h3>
                                    <p className="text-xs text-content-secondary mt-0.5">
                                        Lengkapi nama beserta gelar, jabatan, urutan tampil, dan foto profil.
                                    </p>
                                </div>
                                <CmsButton
                                    hierarchy="tertiary"
                                    size="icon-sm"
                                    aria-label="Tutup panel"
                                    disabled={guruForm.processing}
                                    onClick={closeDrawer}
                                >
                                    <IconX size={18} />
                                </CmsButton>
                            </div>

                            <form onSubmit={handleSubmitDrawer} className="flex-1 flex flex-col overflow-hidden" noValidate>
                                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label htmlFor="nama_lengkap_gelar" className="block text-sm font-medium text-content-primary">
                                                Nama Lengkap &amp; Gelar <span className="text-content-negative">*</span>
                                            </label>
                                            <span className="text-xs text-content-tertiary">
                                                {guruForm.data.nama_lengkap_gelar.length}/200
                                            </span>
                                        </div>
                                        <input
                                            id="nama_lengkap_gelar"
                                            type="text"
                                            maxLength={200}
                                            value={guruForm.data.nama_lengkap_gelar}
                                            onChange={(e) => guruForm.setData('nama_lengkap_gelar', e.target.value)}
                                            placeholder="Masukkan nama lengkap beserta gelar..."
                                            className={inputClass(Boolean(guruForm.errors.nama_lengkap_gelar))}
                                        />
                                        {guruForm.errors.nama_lengkap_gelar && (
                                            <p className="mt-1 text-xs font-medium text-content-negative">
                                                {guruForm.errors.nama_lengkap_gelar}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div className="sm:col-span-2">
                                            <div className="flex items-center justify-between mb-1.5">
                                                <label htmlFor="jabatan" className="block text-sm font-medium text-content-primary">
                                                    Jabatan <span className="text-content-negative">*</span>
                                                </label>
                                                <span className="text-xs text-content-tertiary">
                                                    {guruForm.data.jabatan.length}/200
                                                </span>
                                            </div>
                                            <input
                                                id="jabatan"
                                                type="text"
                                                maxLength={200}
                                                value={guruForm.data.jabatan}
                                                onChange={(e) => guruForm.setData('jabatan', e.target.value)}
                                                placeholder="Masukkan jabatan di sekolah..."
                                                className={inputClass(Boolean(guruForm.errors.jabatan))}
                                            />
                                            {guruForm.errors.jabatan && (
                                                <p className="mt-1 text-xs font-medium text-content-negative">
                                                    {guruForm.errors.jabatan}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="urutan_tampil" className="block text-sm font-medium text-content-primary mb-1.5">
                                                Urutan Tampil
                                            </label>
                                            <input
                                                id="urutan_tampil"
                                                type="number"
                                                min={0}
                                                max={9999}
                                                value={guruForm.data.urutan_tampil}
                                                onChange={(e) => guruForm.setData('urutan_tampil', e.target.value)}
                                                placeholder="0"
                                                className={inputClass(Boolean(guruForm.errors.urutan_tampil))}
                                            />
                                            {guruForm.errors.urutan_tampil && (
                                                <p className="mt-1 text-xs font-medium text-content-negative">
                                                    {guruForm.errors.urutan_tampil}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label htmlFor="mata_pelajaran" className="block text-sm font-medium text-content-primary">
                                                Mata Pelajaran
                                            </label>
                                            <span className="text-xs text-content-tertiary">
                                                {guruForm.data.mata_pelajaran.length}/200
                                            </span>
                                        </div>
                                        <input
                                            id="mata_pelajaran"
                                            type="text"
                                            maxLength={200}
                                            value={guruForm.data.mata_pelajaran}
                                            onChange={(e) => guruForm.setData('mata_pelajaran', e.target.value)}
                                            placeholder="Masukkan mata pelajaran yang diampu (opsional)..."
                                            className={inputClass(Boolean(guruForm.errors.mata_pelajaran))}
                                        />
                                        <p className="mt-1 text-xs text-content-tertiary">
                                            Kosongkan apabila tidak mengampu mata pelajaran (misal staf administrasi).
                                        </p>
                                        {guruForm.errors.mata_pelajaran && (
                                            <p className="mt-1 text-xs font-medium text-content-negative">
                                                {guruForm.errors.mata_pelajaran}
                                            </p>
                                        )}
                                    </div>

                                    <ImageDropzoneField
                                        id="foto_profil"
                                        label={editingGuru ? 'Foto Profil (Portrait 3:4)' : 'Foto Profil (Portrait 3:4) *'}
                                        helperText="Rasio portrait 3:4 · JPG, PNG, WebP · Maks. 3 MB"
                                        aspectClass="aspect-[3/4]"
                                        previewMaxWidthClass="max-w-[170px]"
                                        previewUrl={fotoPreviewUrl}
                                        selectedFile={guruForm.data.foto_profil}
                                        serverError={guruForm.errors.foto_profil}
                                        onFileSelect={(file) => guruForm.setData('foto_profil', file)}
                                        onClearFile={() => guruForm.setData('foto_profil', null)}
                                    />
                                </div>

                                <div className="px-5 py-3.5 border-t border-stroke-card bg-surface-primary flex items-center justify-end gap-2.5">
                                    <CmsButton
                                        type="button"
                                        hierarchy="secondary"
                                        size="md"
                                        disabled={guruForm.processing}
                                        onClick={closeDrawer}
                                    >
                                        Batal
                                    </CmsButton>
                                    <CmsButton
                                        type="submit"
                                        hierarchy="primary"
                                        size="md"
                                        loading={guruForm.processing}
                                    >
                                        {guruForm.processing ? 'Menyimpan...' : 'Simpan Data'}
                                    </CmsButton>
                                </div>
                            </form>
                        </aside>
                    </div>,
                    document.body
                )}

            {/* MODAL PRATINJAU GURU */}
            {previewGuru &&
                createPortal(
                    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                        <div
                            className="fixed inset-0 bg-brand-900/40 backdrop-blur-[1px]"
                            onClick={() => setPreviewGuru(null)}
                        />

                        <div
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="modal-preview-guru-title"
                            className="relative z-[70] w-full max-w-md bg-surface-primary rounded-xl border border-stroke-card shadow-2xl overflow-hidden"
                        >
                            <div className="px-5 py-3.5 border-b border-stroke-card flex items-center justify-between gap-3">
                                <h3 id="modal-preview-guru-title" className="text-base sm:text-lg font-bold text-content-primary">
                                    Pratinjau Profil Guru / Staf
                                </h3>
                                <CmsButton
                                    hierarchy="tertiary"
                                    size="icon-sm"
                                    aria-label="Tutup pratinjau"
                                    onClick={() => setPreviewGuru(null)}
                                >
                                    <IconX size={18} />
                                </CmsButton>
                            </div>

                            <div className="p-5 flex flex-col items-center text-center space-y-3">
                                <GuruThumbnail
                                    src={previewGuru.foto_profil}
                                    alt={previewGuru.nama_lengkap_gelar}
                                    className="w-40 aspect-[3/4] rounded-xl"
                                />
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs border border-brand-500/20 bg-brand-500/10 text-brand-600 font-medium">
                                    {previewGuru.jabatan}
                                </span>
                                <h4 className="text-base font-bold text-content-primary">
                                    {previewGuru.nama_lengkap_gelar}
                                </h4>
                                {previewGuru.mata_pelajaran && (
                                    <p className="text-sm text-content-secondary">
                                        Mata Pelajaran: {previewGuru.mata_pelajaran}
                                    </p>
                                )}
                                <p className="text-xs text-content-tertiary">
                                    Urutan tampil: #{previewGuru.urutan_tampil ?? 0}
                                </p>
                            </div>

                            <div className="px-5 py-3.5 border-t border-stroke-card bg-surface-primary flex justify-end">
                                <CmsButton
                                    hierarchy="secondary"
                                    size="md"
                                    onClick={() => setPreviewGuru(null)}
                                >
                                    Tutup
                                </CmsButton>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}

            {/* MODAL KONFIRMASI HAPUS */}
            {deleteTarget &&
                createPortal(
                    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
                        <div
                            className="fixed inset-0 bg-brand-900/40 backdrop-blur-[1px]"
                            onClick={() => !deleting && setDeleteTarget(null)}
                        />

                        <div
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="modal-hapus-guru-title"
                            className="relative z-[80] w-full max-w-md bg-surface-primary rounded-xl border border-stroke-card shadow-2xl overflow-hidden"
                        >
                            <div className="p-5 space-y-3">
                                <div className="w-10 h-10 rounded-lg bg-negative-100 text-content-negative flex items-center justify-center">
                                    <IconTrash size={20} />
                                </div>
                                <h3 id="modal-hapus-guru-title" className="text-base font-bold text-content-primary">
                                    Hapus Data Guru / Staf?
                                </h3>
                                <p className="text-sm text-content-secondary leading-relaxed">
                                    Data <span className="font-semibold text-content-primary">{deleteTarget.nama_lengkap_gelar}</span> beserta foto profilnya akan dihapus permanen.
                                </p>
                            </div>

                            <div className="px-5 py-3.5 border-t border-stroke-card bg-surface-primary flex items-center justify-end gap-2.5">
                                <CmsButton
                                    type="button"
                                    hierarchy="secondary"
                                    size="md"
                                    disabled={deleting}
                                    onClick={() => setDeleteTarget(null)}
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
                                    {deleting ? 'Menghapus...' : 'Hapus'}
                                </CmsButton>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
        </AdminLayout>
    );
}
