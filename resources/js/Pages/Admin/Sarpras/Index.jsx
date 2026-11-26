import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { router, useForm } from '@inertiajs/react';
import {
    IconCheck,
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
    IconTags,
    IconTrash,
    IconX,
} from '@tabler/icons-react';
import AdminLayout from '@/Layouts/AdminLayout';
import CmsButton from '@/Components/Admin/CmsButton';
import ImageDropzoneField from '@/Components/Admin/ImageDropzoneField';
import TailwindPagination from '@/Components/Admin/TailwindPagination';

const KATEGORI_BADGE_BASE = 'border border-brand-500/20 bg-brand-500/10 text-brand-600 font-medium';
const KATEGORI_BADGE_INTERACTIVE = `${KATEGORI_BADGE_BASE} hover:bg-brand-500/15 transition`;

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

function SarprasThumbnail({ src, alt, className = 'w-14 h-10 rounded' }) {
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
 * Halaman Sarana & Prasarana (CMS Profil Sekolah)
 * - Mengikuti pola Karya & Inovasi: Header collapsible, Status Tabs (Semua/Tayang/Draft), View Switcher (Tabel/Galeri Grid),
 *   Filter Kategori Dropdown & Chip, Kelola Kategori Drawer, Tambah/Edit Drawer + Quick-Add Kategori, Modal Pratinjau & Hapus, TailwindPagination
 */
export default function SarprasIndex({ title, sarpras, kategoris = [], header, filters, stats }) {
    const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'
    const [tableLoading, setTableLoading] = useState(false);

    const hasInitialHeader = Boolean(header?.judul_header?.trim());
    const [headerOpen, setHeaderOpen] = useState(!hasInitialHeader);

    // Filter & Search
    const [search, setSearch] = useState(filters?.search || '');
    const [kategoriFilter, setKategoriFilter] = useState(filters?.kategori ? String(filters.kategori) : '');
    const [statusFilter, setStatusFilter] = useState(filters?.status ?? '');
    const [perPage, setPerPage] = useState(Number(filters?.per_page) || 10);
    const perPageRef = useRef(perPage);
    const isFirstRender = useRef(true);

    // Overlay States
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [previewItem, setPreviewItem] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // Kelola Kategori Drawer & Inline Quick-Add
    const [kategoriDrawerOpen, setKategoriDrawerOpen] = useState(false);
    const [quickAddKategoriOpen, setQuickAddKategoriOpen] = useState(false);
    const [pendingSelectKatName, setPendingSelectKatName] = useState('');
    const [editingKatId, setEditingKatId] = useState(null);
    const [editKatName, setEditKatName] = useState('');
    const [editKatError, setEditKatError] = useState('');
    const [updatingKat, setUpdatingKat] = useState(false);
    const [deleteKatTarget, setDeleteKatTarget] = useState(null);
    const [deletingKat, setDeletingKat] = useState(false);

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

    // Form Tambah / Edit Fasilitas
    const sarprasForm = useForm({
        _method: 'post',
        kategori_sarpras_id: '',
        nama_fasilitas: '',
        deskripsi_fasilitas: '',
        urutan_tampil: '0',
        status_publikasi: true,
        foto_fasilitas: null,
    });

    const quickKategoriForm = useForm({
        nama_kategori: '',
    });

    const drawerKategoriForm = useForm({
        nama_kategori: '',
    });

    const [fotoPreviewUrl, setFotoPreviewUrl] = useState('');
    useEffect(() => {
        if (!sarprasForm.data.foto_fasilitas) {
            setFotoPreviewUrl(editingItem?.foto_fasilitas || '');
            return undefined;
        }
        const objectUrl = URL.createObjectURL(sarprasForm.data.foto_fasilitas);
        setFotoPreviewUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [sarprasForm.data.foto_fasilitas, editingItem?.foto_fasilitas]);

    // Auto-select newly created quick-add category
    useEffect(() => {
        if (!pendingSelectKatName || kategoris.length === 0) {
            return;
        }
        const match = kategoris.find((k) => k.nama_kategori === pendingSelectKatName);
        if (match) {
            sarprasForm.setData('kategori_sarpras_id', String(match.id));
            setPendingSelectKatName('');
        }
    }, [kategoris, pendingSelectKatName]);

    // Lock body scroll & Escape handler
    useEffect(() => {
        const hasOverlay = drawerOpen || kategoriDrawerOpen || Boolean(previewItem) || Boolean(deleteTarget) || Boolean(deleteKatTarget);
        document.body.style.overflow = hasOverlay ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [drawerOpen, kategoriDrawerOpen, previewItem, deleteTarget, deleteKatTarget]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key !== 'Escape') {
                return;
            }
            if (deleteKatTarget && !deletingKat) {
                setDeleteKatTarget(null);
                return;
            }
            if (deleteTarget && !deleting) {
                setDeleteTarget(null);
                return;
            }
            if (previewItem) {
                setPreviewItem(null);
                return;
            }
            if (kategoriDrawerOpen && !drawerKategoriForm.processing && !updatingKat) {
                closeKategoriDrawer();
                return;
            }
            if (drawerOpen && !sarprasForm.processing) {
                closeDrawer();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [drawerOpen, kategoriDrawerOpen, previewItem, deleteTarget, deleteKatTarget, deleting, deletingKat, sarprasForm.processing, drawerKategoriForm.processing, updatingKat]);

    const navigateList = (overrides = {}, { replace = false } = {}) => {
        const params = {
            search: overrides.search !== undefined ? overrides.search : search.trim(),
            kategori: overrides.kategori !== undefined ? overrides.kategori : kategoriFilter,
            status: overrides.status !== undefined ? overrides.status : statusFilter,
            per_page: overrides.per_page !== undefined ? overrides.per_page : perPageRef.current,
            page: overrides.page !== undefined ? overrides.page : 1,
        };
        if (!params.search) delete params.search;
        if (!params.kategori) delete params.kategori;
        if (params.status === '') delete params.status;

        router.get('/admin/sarpras', params, {
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
    }, [search, kategoriFilter, statusFilter]);

    const toggleKategoriChip = (katId) => {
        const nextId = String(katId || '');
        if (!nextId) return;
        setKategoriFilter((prev) => (prev === nextId ? '' : nextId));
    };

    const resetFilters = () => {
        setSearch('');
        setKategoriFilter('');
        setStatusFilter('');
    };

    // Header handlers
    const handleSubmitHeader = (e) => {
        e.preventDefault();
        headerForm.put('/admin/sarpras/header', {
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

    // Fasilitas Drawer handlers
    const openCreateDrawer = () => {
        setEditingItem(null);
        setQuickAddKategoriOpen(false);
        quickKategoriForm.reset();
        quickKategoriForm.clearErrors();
        sarprasForm.clearErrors();
        sarprasForm.setData({
            _method: 'post',
            kategori_sarpras_id: kategoris[0]?.id ? String(kategoris[0].id) : '',
            nama_fasilitas: '',
            deskripsi_fasilitas: '',
            urutan_tampil: '0',
            status_publikasi: true,
            foto_fasilitas: null,
        });
        setDrawerOpen(true);
    };

    const openEditDrawer = (item) => {
        setEditingItem(item);
        setQuickAddKategoriOpen(false);
        quickKategoriForm.reset();
        quickKategoriForm.clearErrors();
        sarprasForm.clearErrors();
        sarprasForm.setData({
            _method: 'put',
            kategori_sarpras_id: item.kategori_sarpras_id ? String(item.kategori_sarpras_id) : '',
            nama_fasilitas: item.nama_fasilitas || '',
            deskripsi_fasilitas: item.deskripsi_fasilitas || '',
            urutan_tampil: String(item.urutan_tampil ?? 0),
            status_publikasi: Boolean(item.status_publikasi),
            foto_fasilitas: null,
        });
        setDrawerOpen(true);
    };

    const closeDrawer = () => {
        setDrawerOpen(false);
        setEditingItem(null);
        setQuickAddKategoriOpen(false);
        setPendingSelectKatName('');
        quickKategoriForm.reset();
        quickKategoriForm.clearErrors();
        sarprasForm.reset();
        sarprasForm.clearErrors();
    };

    const handleSubmitDrawer = (e) => {
        e.preventDefault();
        const url = editingItem ? `/admin/sarpras/${editingItem.id}` : '/admin/sarpras';
        sarprasForm.post(url, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => closeDrawer(),
        });
    };

    const handleQuickAddKategori = (e) => {
        e.preventDefault();
        const trimmed = quickKategoriForm.data.nama_kategori.trim();
        if (!trimmed) return;
        setPendingSelectKatName(trimmed);
        quickKategoriForm.post('/admin/sarpras/kategori', {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                quickKategoriForm.reset();
                setQuickAddKategoriOpen(false);
            },
            onError: () => setPendingSelectKatName(''),
        });
    };

    const handleToggleStatus = (row) => {
        router.patch(
            `/admin/sarpras/${row.id}/toggle`,
            {},
            { preserveScroll: true, preserveState: true }
        );
    };

    const handleConfirmDelete = () => {
        if (!deleteTarget || deleting) return;
        setDeleting(true);
        router.delete(`/admin/sarpras/${deleteTarget.id}`, {
            preserveScroll: true,
            onSuccess: () => setDeleteTarget(null),
            onFinish: () => setDeleting(false),
        });
    };

    // Kelola Kategori Drawer handlers
    const closeKategoriDrawer = () => {
        setKategoriDrawerOpen(false);
        setEditingKatId(null);
        setEditKatName('');
        setEditKatError('');
        drawerKategoriForm.reset();
        drawerKategoriForm.clearErrors();
    };

    const handleCreateKategori = (e) => {
        e.preventDefault();
        drawerKategoriForm.post('/admin/sarpras/kategori', {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => drawerKategoriForm.reset(),
        });
    };

    const handleSaveEditKat = (kat) => {
        const trimmed = editKatName.trim();
        if (!trimmed) {
            setEditKatError('Nama kategori wajib diisi.');
            return;
        }
        if (trimmed.length > 100) {
            setEditKatError('Nama kategori maksimal 100 karakter.');
            return;
        }
        setUpdatingKat(true);
        setEditKatError('');
        router.put(
            `/admin/sarpras/kategori/${kat.id}`,
            { nama_kategori: trimmed },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setEditingKatId(null);
                    setEditKatName('');
                },
                onError: (errs) => setEditKatError(errs.nama_kategori || 'Gagal memperbarui kategori.'),
                onFinish: () => setUpdatingKat(false),
            }
        );
    };

    const confirmDeleteKategori = () => {
        if (!deleteKatTarget || deletingKat || deleteKatTarget.sarpras_count > 0) return;
        setDeletingKat(true);
        router.delete(`/admin/sarpras/kategori/${deleteKatTarget.id}`, {
            preserveScroll: true,
            preserveState: true,
            onFinish: () => {
                setDeletingKat(false);
                setDeleteKatTarget(null);
            },
        });
    };

    const items = sarpras?.data || [];
    const currentPage = sarpras?.current_page || 1;
    const totalPages = sarpras?.last_page || 1;
    const totalCount = stats?.total ?? 0;
    const publishedCount = stats?.published ?? 0;
    const draftCount = stats?.draft ?? 0;
    const hasActiveFilters = Boolean(search.trim() || kategoriFilter || statusFilter !== '');

    const statusTabs = [
        { key: '', label: `Semua (${totalCount})` },
        { key: '1', label: `Tayang Publik (${publishedCount})` },
        { key: '0', label: `Draft Internal (${draftCount})` },
    ];

    return (
        <AdminLayout
            title={title || 'Sarana & Prasarana'}
            subtitle="Kelola inventaris fasilitas pembelajaran, ruang praktik, dan sarana pendukung sekolah dalam tampilan tabel maupun galeri kartu."
            headerActions={
                <div className="flex flex-wrap items-center gap-2">
                    <CmsButton
                        hierarchy="secondary"
                        size="md"
                        prefixIcon={<IconTags size={16} className="text-brand-500" />}
                        onClick={() => setKategoriDrawerOpen(true)}
                    >
                        Kelola Kategori ({kategoris.length})
                    </CmsButton>
                    <CmsButton
                        hierarchy="primary"
                        size="md"
                        prefixIcon={<IconPlus size={16} />}
                        onClick={openCreateDrawer}
                    >
                        Tambah Fasilitas
                    </CmsButton>
                </div>
            }
        >
            <div className="space-y-5 text-content-primary">
                {/* CARD 1: Header Halaman Publik */}
                <section className="bg-surface-primary border border-stroke-card rounded-xl shadow-admin-card overflow-hidden">
                    <div
                        className={`px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 ${
                            headerOpen ? 'border-b border-stroke-card' : ''
                        }`}
                    >
                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <h2 className="text-base font-bold text-content-primary">
                                    Header Halaman Publik (Sarana &amp; Prasarana)
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
                                    Judul utama dan teks pengantar di atas halaman publik sarana &amp; prasarana.
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
                                        placeholder="Masukkan judul header halaman sarana & prasarana..."
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
                                        placeholder="Masukkan deskripsi pengantar halaman sarana & prasarana..."
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

                {/* CARD 2: Katalog Sarana & Prasarana */}
                <section className="bg-surface-primary border border-stroke-card rounded-xl shadow-admin-card overflow-hidden">
                    <div className="px-5 pt-2.5 border-b border-stroke-card flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-1 overflow-x-auto">
                            {statusTabs.map((tab) => {
                                const active = statusFilter === tab.key;
                                return (
                                    <button
                                        key={tab.key || 'all'}
                                        type="button"
                                        onClick={() => setStatusFilter(tab.key)}
                                        className={`px-3 py-2 text-sm border-b-2 transition whitespace-nowrap ${
                                            active
                                                ? 'border-brand-500 font-bold text-brand-600'
                                                : 'border-transparent font-medium text-content-tertiary hover:text-content-primary'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                );
                            })}
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

                    {/* Toolbar Pencarian & Filter Kategori */}
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
                                placeholder="Cari nama atau deskripsi fasilitas..."
                                aria-label="Cari nama atau deskripsi fasilitas"
                                className="w-full h-10 pl-9 pr-3 text-sm rounded-md border border-stroke-input bg-surface-primary text-content-primary placeholder:text-content-disabled shadow-xs transition focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                            <select
                                value={kategoriFilter}
                                onChange={(e) => setKategoriFilter(e.target.value)}
                                aria-label="Filter kategori fasilitas"
                                className="flex-1 sm:w-52 h-10 px-3 text-sm rounded-md border border-stroke-input bg-surface-primary text-content-primary shadow-xs transition focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
                            >
                                <option value="">Semua Kategori</option>
                                {kategoris.map((kat) => (
                                    <option key={kat.id} value={String(kat.id)}>
                                        {kat.nama_kategori} ({kat.sarpras_count})
                                    </option>
                                ))}
                            </select>

                            {hasActiveFilters && (
                                <CmsButton
                                    hierarchy="tertiary"
                                    tone="brand"
                                    size="md"
                                    prefixIcon={<IconRefresh size={16} />}
                                    onClick={resetFilters}
                                >
                                    Reset
                                </CmsButton>
                            )}
                        </div>
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
                                        {hasActiveFilters ? 'Fasilitas tidak ditemukan' : 'Belum ada data fasilitas'}
                                    </p>
                                    <p className="text-sm text-content-secondary leading-relaxed">
                                        {hasActiveFilters
                                            ? 'Tidak ada fasilitas yang sesuai dengan kata kunci pencarian, tab status, atau kategori yang dipilih.'
                                            : 'Mulai tambahkan dokumentasi ruang kelas, bengkel praktik, dan fasilitas penunjang sekolah.'}
                                    </p>
                                    <div className="pt-1">
                                        {hasActiveFilters ? (
                                            <CmsButton
                                                hierarchy="secondary"
                                                size="sm"
                                                prefixIcon={<IconRefresh size={14} className="text-brand-500" />}
                                                onClick={resetFilters}
                                            >
                                                Reset Filter
                                            </CmsButton>
                                        ) : (
                                            <CmsButton
                                                hierarchy="secondary"
                                                size="sm"
                                                prefixIcon={<IconPlus size={14} className="text-brand-500" />}
                                                onClick={openCreateDrawer}
                                            >
                                                Tambah Fasilitas Pertama
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
                                            <th className="px-4 py-3">Fasilitas</th>
                                            <th className="px-4 py-3 w-44">Kategori</th>
                                            <th className="px-4 py-3 w-24 text-center">Urutan</th>
                                            <th className="px-4 py-3 w-40">Publikasi</th>
                                            <th className="px-4 py-3 w-32 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-stroke-card">
                                        {items.map((row) => {
                                            const isPublished = Boolean(row.status_publikasi);
                                            const isFilteredKat = kategoriFilter === String(row.kategori_sarpras_id);
                                            const katLabel = row.kategori_sarpras?.nama_kategori || row.kategori_fasilitas;
                                            return (
                                                <tr key={row.id} className="hover:bg-brand-50/60 transition-colors">
                                                    <td className="px-4 py-3 align-middle">
                                                        <button
                                                            type="button"
                                                            onClick={() => setPreviewItem(row)}
                                                            title="Klik untuk pratinjau detail fasilitas"
                                                            className="flex items-center gap-3 max-w-md text-left group focus:outline-none"
                                                        >
                                                            <SarprasThumbnail src={row.foto_fasilitas} alt={row.nama_fasilitas} />
                                                            <div className="min-w-0">
                                                                <p className="text-sm font-bold text-content-primary truncate group-hover:text-brand-600 group-hover:underline">
                                                                    {row.nama_fasilitas}
                                                                </p>
                                                                <p className="text-xs text-content-secondary line-clamp-1 mt-0.5">
                                                                    {row.deskripsi_fasilitas}
                                                                </p>
                                                            </div>
                                                        </button>
                                                    </td>
                                                    <td className="px-4 py-3 align-middle">
                                                        {row.kategori_sarpras ? (
                                                            <button
                                                                type="button"
                                                                onClick={() => toggleKategoriChip(row.kategori_sarpras_id)}
                                                                title={isFilteredKat ? 'Hapus filter kategori' : 'Filter berdasarkan kategori ini'}
                                                                className={`inline-block text-xs px-2.5 py-0.5 rounded-full ${KATEGORI_BADGE_INTERACTIVE} ${
                                                                    isFilteredKat ? 'ring-1 ring-brand-500/40 font-semibold' : ''
                                                                }`}
                                                            >
                                                                {katLabel}
                                                            </button>
                                                        ) : (
                                                            <span className="text-content-disabled">-</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 text-center font-semibold text-content-secondary align-middle">
                                                        #{row.urutan_tampil ?? 0}
                                                    </td>
                                                    <td className="px-4 py-3 align-middle">
                                                        <div className="inline-flex items-center gap-2">
                                                            <button
                                                                type="button"
                                                                role="switch"
                                                                aria-checked={isPublished}
                                                                aria-label={`Ubah status publikasi ${row.nama_fasilitas}`}
                                                                onClick={() => handleToggleStatus(row)}
                                                                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border transition-colors ${
                                                                    isPublished
                                                                        ? 'bg-positive-600 border-positive-600'
                                                                        : 'bg-stroke-input border-stroke-input'
                                                                }`}
                                                            >
                                                                <span
                                                                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-xs transition-transform ${
                                                                        isPublished ? 'translate-x-4' : 'translate-x-0.5'
                                                                    }`}
                                                                />
                                                            </button>
                                                            <span
                                                                className={`text-xs font-medium ${
                                                                    isPublished ? 'text-content-positive' : 'text-content-tertiary'
                                                                }`}
                                                            >
                                                                {isPublished ? 'Tayang' : 'Draft'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 align-middle">
                                                        <div className="flex items-center justify-end gap-1">
                                                            <CmsButton
                                                                hierarchy="tertiary"
                                                                tone="brand"
                                                                size="icon-sm"
                                                                title="Pratinjau"
                                                                aria-label={`Pratinjau ${row.nama_fasilitas}`}
                                                                onClick={() => setPreviewItem(row)}
                                                                prefixIcon={<IconEye size={15} />}
                                                            />
                                                            <CmsButton
                                                                hierarchy="tertiary"
                                                                tone="warning"
                                                                size="icon-sm"
                                                                title="Edit"
                                                                aria-label={`Edit ${row.nama_fasilitas}`}
                                                                onClick={() => openEditDrawer(row)}
                                                                prefixIcon={<IconEdit size={15} />}
                                                            />
                                                            <CmsButton
                                                                hierarchy="tertiary"
                                                                tone="danger"
                                                                size="icon-sm"
                                                                title="Hapus"
                                                                aria-label={`Hapus ${row.nama_fasilitas}`}
                                                                onClick={() => setDeleteTarget(row)}
                                                                prefixIcon={<IconTrash size={15} />}
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {items.map((row) => {
                                    const isPublished = Boolean(row.status_publikasi);
                                    const isFilteredKat = kategoriFilter === String(row.kategori_sarpras_id);
                                    const katLabel = row.kategori_sarpras?.nama_kategori || row.kategori_fasilitas;
                                    return (
                                        <div
                                            key={row.id}
                                            className="rounded-xl border border-stroke-card bg-surface-primary overflow-hidden flex flex-col shadow-xs hover:border-brand-300 transition-colors"
                                        >
                                            <button
                                                type="button"
                                                onClick={() => setPreviewItem(row)}
                                                className="w-full text-left focus:outline-none group"
                                            >
                                                <SarprasThumbnail
                                                    src={row.foto_fasilitas}
                                                    alt={row.nama_fasilitas}
                                                    className="w-full aspect-video"
                                                />
                                            </button>

                                            <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                                                <div>
                                                    <div className="flex items-center justify-between gap-2 mb-1.5">
                                                        {row.kategori_sarpras ? (
                                                            <button
                                                                type="button"
                                                                onClick={() => toggleKategoriChip(row.kategori_sarpras_id)}
                                                                title={isFilteredKat ? 'Hapus filter kategori' : 'Filter berdasarkan kategori ini'}
                                                                className={`text-xs px-2.5 py-0.5 rounded-full truncate ${KATEGORI_BADGE_INTERACTIVE} ${
                                                                    isFilteredKat ? 'ring-1 ring-brand-500/40 font-semibold' : ''
                                                                }`}
                                                            >
                                                                {katLabel}
                                                            </button>
                                                        ) : (
                                                            <span className="text-xs text-content-disabled">-</span>
                                                        )}
                                                        <span className="text-xs font-semibold text-content-tertiary shrink-0">
                                                            #{row.urutan_tampil ?? 0}
                                                        </span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => setPreviewItem(row)}
                                                        className="text-left w-full focus:outline-none group"
                                                    >
                                                        <h3 className="text-base font-bold text-content-primary line-clamp-1 group-hover:text-brand-600 group-hover:underline">
                                                            {row.nama_fasilitas}
                                                        </h3>
                                                    </button>
                                                    <p className="text-xs text-content-secondary line-clamp-2 mt-1 leading-relaxed">
                                                        {row.deskripsi_fasilitas}
                                                    </p>
                                                </div>

                                                <div className="pt-3 border-t border-stroke-card flex items-center justify-between gap-2">
                                                    <div className="inline-flex items-center gap-2">
                                                        <button
                                                            type="button"
                                                            role="switch"
                                                            aria-checked={isPublished}
                                                            aria-label={`Ubah status publikasi ${row.nama_fasilitas}`}
                                                            onClick={() => handleToggleStatus(row)}
                                                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border transition-colors ${
                                                                isPublished
                                                                    ? 'bg-positive-600 border-positive-600'
                                                                    : 'bg-stroke-input border-stroke-input'
                                                            }`}
                                                        >
                                                            <span
                                                                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-xs transition-transform ${
                                                                    isPublished ? 'translate-x-4' : 'translate-x-0.5'
                                                                }`}
                                                            />
                                                        </button>
                                                        <span
                                                            className={`text-xs font-medium ${
                                                                isPublished ? 'text-content-positive' : 'text-content-tertiary'
                                                            }`}
                                                        >
                                                            {isPublished ? 'Tayang' : 'Draft'}
                                                        </span>
                                                    </div>

                                                    <div className="inline-flex items-center gap-1">
                                                        <CmsButton
                                                            hierarchy="tertiary"
                                                            tone="brand"
                                                            size="icon-sm"
                                                            title="Pratinjau"
                                                            aria-label={`Pratinjau ${row.nama_fasilitas}`}
                                                            onClick={() => setPreviewItem(row)}
                                                            prefixIcon={<IconEye size={15} />}
                                                        />
                                                        <CmsButton
                                                            hierarchy="tertiary"
                                                            tone="warning"
                                                            size="icon-sm"
                                                            title="Edit"
                                                            aria-label={`Edit ${row.nama_fasilitas}`}
                                                            onClick={() => openEditDrawer(row)}
                                                            prefixIcon={<IconEdit size={15} />}
                                                        />
                                                        <CmsButton
                                                            hierarchy="tertiary"
                                                            tone="danger"
                                                            size="icon-sm"
                                                            title="Hapus"
                                                            aria-label={`Hapus ${row.nama_fasilitas}`}
                                                            onClick={() => setDeleteTarget(row)}
                                                            prefixIcon={<IconTrash size={15} />}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Pagination Footer */}
                    {(sarpras?.total || 0) > 0 && (
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

            {/* SLIDE-OVER DRAWER TAMBAH / EDIT FASILITAS */}
            {drawerOpen &&
                createPortal(
                    <div className="fixed inset-0 z-[60]">
                        <div
                            className="fixed inset-0 bg-brand-900/35 backdrop-blur-[1.5px] transition-opacity"
                            onClick={() => !sarprasForm.processing && closeDrawer()}
                        />

                        <aside
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="drawer-sarpras-title"
                            className="fixed top-0 right-0 bottom-0 z-[70] w-full max-w-lg bg-surface-primary border-l border-stroke-card shadow-2xl flex flex-col"
                        >
                            <div className="px-5 py-4 border-b border-stroke-card flex items-center justify-between shrink-0">
                                <div>
                                    <h3 id="drawer-sarpras-title" className="text-base sm:text-lg font-bold text-content-primary">
                                        {editingItem ? 'Edit Fasilitas' : 'Tambah Fasilitas'}
                                    </h3>
                                    <p className="text-xs text-content-secondary mt-0.5">
                                        Lengkapi dokumentasi fasilitas agar tampil rapi di halaman publik.
                                    </p>
                                </div>
                                <CmsButton
                                    hierarchy="tertiary"
                                    size="icon-sm"
                                    onClick={closeDrawer}
                                    disabled={sarprasForm.processing}
                                    aria-label="Tutup panel"
                                    prefixIcon={<IconX size={16} />}
                                />
                            </div>

                            <form onSubmit={handleSubmitDrawer} noValidate className="flex-1 flex flex-col min-h-0">
                                <div className="p-5 space-y-4 overflow-y-auto flex-1">
                                    {kategoris.length === 0 && !quickAddKategoriOpen && (
                                        <div className="p-3 rounded-lg border border-warning-500/40 bg-warning-100 text-xs text-content-warning flex flex-wrap items-center justify-between gap-2">
                                            <span>Belum ada kategori. Tambahkan satu terlebih dahulu.</span>
                                            <button
                                                type="button"
                                                onClick={() => setQuickAddKategoriOpen(true)}
                                                className="font-semibold underline text-content-warning hover:opacity-80"
                                            >
                                                + Buat Kategori Sekarang
                                            </button>
                                        </div>
                                    )}

                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label htmlFor="nama_fasilitas" className="block text-sm font-medium text-content-primary">
                                                Nama Fasilitas <span className="text-content-negative">*</span>
                                            </label>
                                            <span className="text-xs text-content-tertiary">
                                                {sarprasForm.data.nama_fasilitas.length}/200
                                            </span>
                                        </div>
                                        <input
                                            id="nama_fasilitas"
                                            type="text"
                                            maxLength={200}
                                            value={sarprasForm.data.nama_fasilitas}
                                            onChange={(e) => sarprasForm.setData('nama_fasilitas', e.target.value)}
                                            placeholder="Masukkan nama fasilitas atau ruangan..."
                                            className={inputClass(Boolean(sarprasForm.errors.nama_fasilitas))}
                                        />
                                        {sarprasForm.errors.nama_fasilitas && (
                                            <p className="mt-1 text-xs font-medium text-content-negative">
                                                {sarprasForm.errors.nama_fasilitas}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                                        <div>
                                            <div className="flex items-center justify-between mb-1.5">
                                                <label htmlFor="kategori_sarpras_id" className="block text-sm font-medium text-content-primary">
                                                    Kategori Fasilitas <span className="text-content-negative">*</span>
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        quickKategoriForm.clearErrors();
                                                        setQuickAddKategoriOpen((prev) => !prev);
                                                    }}
                                                    className="text-xs font-semibold text-brand-500 hover:text-brand-600 hover:underline"
                                                >
                                                    {quickAddKategoriOpen ? 'Tutup' : '+ Kategori baru'}
                                                </button>
                                            </div>
                                            <select
                                                id="kategori_sarpras_id"
                                                value={sarprasForm.data.kategori_sarpras_id}
                                                disabled={kategoris.length === 0}
                                                onChange={(e) => sarprasForm.setData('kategori_sarpras_id', e.target.value)}
                                                className={`w-full h-10 px-3 text-sm rounded-md border bg-surface-primary text-content-primary disabled:bg-surface-secondary disabled:text-content-disabled shadow-xs transition focus:outline-none ${
                                                    sarprasForm.errors.kategori_sarpras_id
                                                        ? 'border-negative-600 focus:border-negative-600 focus:ring-2 focus:ring-negative-500/15'
                                                        : 'border-stroke-input focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15'
                                                }`}
                                            >
                                                <option value="">Pilih kategori...</option>
                                                {kategoris.map((kat) => (
                                                    <option key={kat.id} value={String(kat.id)}>
                                                        {kat.nama_kategori}
                                                    </option>
                                                ))}
                                            </select>
                                            {sarprasForm.errors.kategori_sarpras_id && (
                                                <p className="mt-1 text-xs font-medium text-content-negative">
                                                    {sarprasForm.errors.kategori_sarpras_id}
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
                                                max={100000}
                                                value={sarprasForm.data.urutan_tampil}
                                                onChange={(e) => sarprasForm.setData('urutan_tampil', e.target.value)}
                                                className={inputClass(Boolean(sarprasForm.errors.urutan_tampil))}
                                            />
                                            <p className="mt-1 text-xs text-content-tertiary">
                                                Angka lebih kecil tampil lebih awal.
                                            </p>
                                            {sarprasForm.errors.urutan_tampil && (
                                                <p className="mt-1 text-xs font-medium text-content-negative">
                                                    {sarprasForm.errors.urutan_tampil}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Inline Quick-Add Kategori */}
                                    {quickAddKategoriOpen && (
                                        <div className="p-3.5 rounded-lg border border-stroke-card bg-surface-secondary/70 space-y-2.5">
                                            <span className="block text-xs font-semibold text-content-primary">
                                                Buat Kategori Baru
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    maxLength={100}
                                                    value={quickKategoriForm.data.nama_kategori}
                                                    onChange={(e) => quickKategoriForm.setData('nama_kategori', e.target.value)}
                                                    placeholder="Masukkan nama kategori..."
                                                    className={`flex-1 ${inputClass(Boolean(quickKategoriForm.errors.nama_kategori))}`}
                                                />
                                                <CmsButton
                                                    type="button"
                                                    hierarchy="primary"
                                                    size="md"
                                                    loading={quickKategoriForm.processing}
                                                    onClick={handleQuickAddKategori}
                                                >
                                                    Simpan
                                                </CmsButton>
                                            </div>
                                            {quickKategoriForm.errors.nama_kategori && (
                                                <p className="text-xs font-medium text-content-negative">
                                                    {quickKategoriForm.errors.nama_kategori}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label htmlFor="deskripsi_fasilitas" className="block text-sm font-medium text-content-primary">
                                                Deskripsi Fasilitas <span className="text-content-negative">*</span>
                                            </label>
                                            <span className="text-xs text-content-tertiary">
                                                {sarprasForm.data.deskripsi_fasilitas.length}/5000
                                            </span>
                                        </div>
                                        <textarea
                                            id="deskripsi_fasilitas"
                                            rows={4}
                                            maxLength={5000}
                                            value={sarprasForm.data.deskripsi_fasilitas}
                                            onChange={(e) => sarprasForm.setData('deskripsi_fasilitas', e.target.value)}
                                            placeholder="Masukkan deskripsi fungsi dan kelengkapan fasilitas..."
                                            className={textareaClass(Boolean(sarprasForm.errors.deskripsi_fasilitas))}
                                        />
                                        {sarprasForm.errors.deskripsi_fasilitas && (
                                            <p className="mt-1 text-xs font-medium text-content-negative">
                                                {sarprasForm.errors.deskripsi_fasilitas}
                                            </p>
                                        )}
                                    </div>

                                    <div className="p-3.5 rounded-lg border border-stroke-card bg-surface-primary flex items-center justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-medium text-content-primary">
                                                Status Publikasi
                                            </p>
                                            <p className="text-xs text-content-secondary">
                                                {sarprasForm.data.status_publikasi
                                                    ? 'Tayang langsung di halaman publik.'
                                                    : 'Disimpan sebagai draft internal.'}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            role="switch"
                                            aria-checked={sarprasForm.data.status_publikasi}
                                            onClick={() => sarprasForm.setData('status_publikasi', !sarprasForm.data.status_publikasi)}
                                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border transition-colors ${
                                                sarprasForm.data.status_publikasi
                                                    ? 'bg-positive-600 border-positive-600'
                                                    : 'bg-stroke-input border-stroke-input'
                                            }`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition-transform ${
                                                    sarprasForm.data.status_publikasi ? 'translate-x-5' : 'translate-x-1'
                                                }`}
                                            />
                                        </button>
                                    </div>

                                    <ImageDropzoneField
                                        id="foto_fasilitas"
                                        label={editingItem ? 'Foto Fasilitas (16:9)' : 'Foto Fasilitas (16:9) *'}
                                        helperText="Rasio lanskap 16:9 · JPG, PNG, WebP · Maks. 3 MB"
                                        aspectClass="aspect-video"
                                        previewMaxWidthClass="max-w-[320px]"
                                        previewUrl={fotoPreviewUrl}
                                        selectedFile={sarprasForm.data.foto_fasilitas}
                                        serverError={sarprasForm.errors.foto_fasilitas}
                                        onFileSelect={(file) => sarprasForm.setData('foto_fasilitas', file)}
                                        onClearFile={() => sarprasForm.setData('foto_fasilitas', null)}
                                    />
                                </div>

                                <div className="px-5 py-3.5 border-t border-stroke-card bg-surface-primary flex items-center justify-end gap-2.5 shrink-0">
                                    <CmsButton
                                        type="button"
                                        hierarchy="secondary"
                                        size="md"
                                        disabled={sarprasForm.processing}
                                        onClick={closeDrawer}
                                    >
                                        Batal
                                    </CmsButton>
                                    <CmsButton
                                        type="submit"
                                        hierarchy="primary"
                                        size="md"
                                        loading={sarprasForm.processing}
                                    >
                                        {sarprasForm.processing ? 'Menyimpan...' : 'Simpan Fasilitas'}
                                    </CmsButton>
                                </div>
                            </form>
                        </aside>
                    </div>,
                    document.body
                )}

            {/* SLIDE-OVER DRAWER KELOLA KATEGORI */}
            {kategoriDrawerOpen &&
                createPortal(
                    <div className="fixed inset-0 z-[60]">
                        <div
                            className="fixed inset-0 bg-brand-900/35 backdrop-blur-[1.5px]"
                            onClick={() => !drawerKategoriForm.processing && !updatingKat && closeKategoriDrawer()}
                        />

                        <aside
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="drawer-kategori-sarpras-title"
                            className="fixed top-0 right-0 bottom-0 z-[70] w-full max-w-md bg-surface-primary border-l border-stroke-card shadow-2xl flex flex-col"
                        >
                            <div className="px-5 py-4 border-b border-stroke-card flex items-center justify-between shrink-0">
                                <div>
                                    <h3 id="drawer-kategori-sarpras-title" className="text-base sm:text-lg font-bold text-content-primary">
                                        Kelola Kategori Fasilitas
                                    </h3>
                                    <p className="text-xs text-content-secondary mt-0.5">
                                        Tambah, ubah nama, atau hapus kategori yang belum digunakan.
                                    </p>
                                </div>
                                <CmsButton
                                    hierarchy="tertiary"
                                    size="icon-sm"
                                    onClick={closeKategoriDrawer}
                                    aria-label="Tutup panel kategori"
                                    prefixIcon={<IconX size={16} />}
                                />
                            </div>

                            <div className="p-5 border-b border-stroke-card bg-surface-primary shrink-0">
                                <form onSubmit={handleCreateKategori} noValidate className="space-y-2">
                                    <label htmlFor="new_kategori_sarpras" className="block text-sm font-medium text-content-primary">
                                        Tambah Kategori Baru
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            id="new_kategori_sarpras"
                                            type="text"
                                            maxLength={100}
                                            value={drawerKategoriForm.data.nama_kategori}
                                            onChange={(e) => drawerKategoriForm.setData('nama_kategori', e.target.value)}
                                            placeholder="Masukkan nama kategori..."
                                            className={`flex-1 ${inputClass(Boolean(drawerKategoriForm.errors.nama_kategori))}`}
                                        />
                                        <CmsButton
                                            type="submit"
                                            hierarchy="primary"
                                            size="md"
                                            loading={drawerKategoriForm.processing}
                                        >
                                            Tambah
                                        </CmsButton>
                                    </div>
                                    {drawerKategoriForm.errors.nama_kategori && (
                                        <p className="text-xs font-medium text-content-negative">
                                            {drawerKategoriForm.errors.nama_kategori}
                                        </p>
                                    )}
                                </form>
                            </div>

                            <div className="flex-1 overflow-y-auto divide-y divide-stroke-card">
                                {kategoris.length === 0 ? (
                                    <div className="p-8 text-center">
                                        <p className="text-base font-semibold text-content-primary">
                                            Belum ada kategori
                                        </p>
                                        <p className="text-xs text-content-secondary mt-1">
                                            Tambahkan kategori baru melalui form di atas.
                                        </p>
                                    </div>
                                ) : (
                                    kategoris.map((kat) => {
                                        const isEditing = editingKatId === kat.id;
                                        const inUse = (kat.sarpras_count || 0) > 0;
                                        return (
                                            <div key={kat.id} className="px-5 py-3.5 space-y-2">
                                                {isEditing ? (
                                                    <div className="space-y-2">
                                                        <input
                                                            type="text"
                                                            maxLength={100}
                                                            value={editKatName}
                                                            onChange={(e) => {
                                                                setEditKatName(e.target.value);
                                                                if (editKatError) setEditKatError('');
                                                            }}
                                                            placeholder="Masukkan nama kategori..."
                                                            className={inputClass(Boolean(editKatError))}
                                                        />
                                                        {editKatError && (
                                                            <p className="text-xs font-medium text-content-negative">
                                                                {editKatError}
                                                            </p>
                                                        )}
                                                        <div className="flex items-center justify-end gap-2">
                                                            <CmsButton
                                                                hierarchy="secondary"
                                                                size="sm"
                                                                disabled={updatingKat}
                                                                onClick={() => {
                                                                    setEditingKatId(null);
                                                                    setEditKatError('');
                                                                }}
                                                            >
                                                                Batal
                                                            </CmsButton>
                                                            <CmsButton
                                                                hierarchy="primary"
                                                                size="sm"
                                                                loading={updatingKat}
                                                                prefixIcon={<IconCheck size={14} />}
                                                                onClick={() => handleSaveEditKat(kat)}
                                                            >
                                                                Simpan
                                                            </CmsButton>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-between gap-3">
                                                        <div className="min-w-0 flex items-center gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setKategoriFilter(String(kat.id));
                                                                    closeKategoriDrawer();
                                                                }}
                                                                className={`text-xs px-2.5 py-0.5 rounded-full truncate ${KATEGORI_BADGE_INTERACTIVE}`}
                                                            >
                                                                {kat.nama_kategori}
                                                            </button>
                                                            <span className="text-xs text-content-tertiary shrink-0">
                                                                {kat.sarpras_count || 0} fasilitas
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center gap-1 shrink-0">
                                                            <CmsButton
                                                                hierarchy="tertiary"
                                                                tone="warning"
                                                                size="icon-sm"
                                                                title="Ubah nama kategori"
                                                                aria-label={`Edit kategori ${kat.nama_kategori}`}
                                                                onClick={() => {
                                                                    setEditingKatId(kat.id);
                                                                    setEditKatName(kat.nama_kategori);
                                                                    setEditKatError('');
                                                                }}
                                                                prefixIcon={<IconEdit size={15} />}
                                                            />
                                                            <CmsButton
                                                                hierarchy="tertiary"
                                                                tone="danger"
                                                                size="icon-sm"
                                                                disabled={inUse}
                                                                title={inUse ? 'Kategori sedang digunakan' : 'Hapus kategori'}
                                                                aria-label={`Hapus kategori ${kat.nama_kategori}`}
                                                                onClick={() => setDeleteKatTarget(kat)}
                                                                prefixIcon={<IconTrash size={15} />}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </aside>
                    </div>,
                    document.body
                )}

            {/* MODAL PRATINJAU FASILITAS */}
            {previewItem &&
                createPortal(
                    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                        <div
                            className="fixed inset-0 bg-brand-900/40 backdrop-blur-[1px]"
                            onClick={() => setPreviewItem(null)}
                        />

                        <div
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="modal-preview-sarpras-title"
                            className="relative z-[70] w-full max-w-lg bg-surface-primary rounded-xl border border-stroke-card shadow-2xl overflow-hidden"
                        >
                            <div className="px-5 py-3.5 border-b border-stroke-card flex items-center justify-between gap-3">
                                <h3 id="modal-preview-sarpras-title" className="text-base sm:text-lg font-bold text-content-primary">
                                    Pratinjau Fasilitas Sekolah
                                </h3>
                                <CmsButton
                                    hierarchy="tertiary"
                                    size="icon-sm"
                                    aria-label="Tutup pratinjau"
                                    onClick={() => setPreviewItem(null)}
                                    prefixIcon={<IconX size={16} />}
                                />
                            </div>

                            <div className="p-5 space-y-3">
                                <SarprasThumbnail
                                    src={previewItem.foto_fasilitas}
                                    alt={previewItem.nama_fasilitas}
                                    className="w-full aspect-video rounded-xl"
                                />
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs ${KATEGORI_BADGE_BASE}`}>
                                        {previewItem.kategori_sarpras?.nama_kategori || previewItem.kategori_fasilitas || '-'}
                                    </span>
                                    <span className={`text-xs font-medium ${previewItem.status_publikasi ? 'text-content-positive' : 'text-content-tertiary'}`}>
                                        {previewItem.status_publikasi ? 'Tayang Publik' : 'Draft Internal'} · #{previewItem.urutan_tampil ?? 0}
                                    </span>
                                </div>
                                <h4 className="text-base font-bold text-content-primary">
                                    {previewItem.nama_fasilitas}
                                </h4>
                                <p className="text-sm text-content-secondary leading-relaxed whitespace-pre-line">
                                    {previewItem.deskripsi_fasilitas}
                                </p>
                            </div>

                            <div className="px-5 py-3.5 border-t border-stroke-card bg-surface-primary flex justify-end">
                                <CmsButton
                                    hierarchy="secondary"
                                    size="md"
                                    onClick={() => setPreviewItem(null)}
                                >
                                    Tutup
                                </CmsButton>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}

            {/* MODAL KONFIRMASI HAPUS FASILITAS */}
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
                            aria-labelledby="modal-hapus-sarpras-title"
                            className="relative z-[80] w-full max-w-md bg-surface-primary rounded-xl border border-stroke-card shadow-2xl overflow-hidden"
                        >
                            <div className="p-5 space-y-3">
                                <div className="w-10 h-10 rounded-lg bg-negative-100 text-content-negative flex items-center justify-center">
                                    <IconTrash size={20} />
                                </div>
                                <h3 id="modal-hapus-sarpras-title" className="text-base font-bold text-content-primary">
                                    Hapus Data Fasilitas?
                                </h3>
                                <p className="text-sm text-content-secondary leading-relaxed">
                                    Fasilitas <span className="font-semibold text-content-primary">{deleteTarget.nama_fasilitas}</span> beserta fotonya akan dihapus permanen.
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

            {/* MODAL KONFIRMASI HAPUS KATEGORI */}
            {deleteKatTarget &&
                createPortal(
                    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
                        <div
                            className="fixed inset-0 bg-brand-900/40 backdrop-blur-[1px]"
                            onClick={() => !deletingKat && setDeleteKatTarget(null)}
                        />

                        <div
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="modal-hapus-kat-sarpras-title"
                            className="relative z-[80] w-full max-w-md bg-surface-primary rounded-xl border border-stroke-card shadow-2xl overflow-hidden"
                        >
                            <div className="p-5 space-y-3">
                                <div className="w-10 h-10 rounded-lg bg-negative-100 text-content-negative flex items-center justify-center">
                                    <IconTrash size={20} />
                                </div>
                                <h3 id="modal-hapus-kat-sarpras-title" className="text-base font-bold text-content-primary">
                                    Hapus Kategori Fasilitas?
                                </h3>
                                <p className="text-sm text-content-secondary leading-relaxed">
                                    Kategori <span className="font-semibold text-content-primary">{deleteKatTarget.nama_kategori}</span> akan dihapus dari daftar kategori fasilitas.
                                </p>
                            </div>

                            <div className="px-5 py-3.5 border-t border-stroke-card bg-surface-primary flex items-center justify-end gap-2.5">
                                <CmsButton
                                    type="button"
                                    hierarchy="secondary"
                                    size="md"
                                    disabled={deletingKat}
                                    onClick={() => setDeleteKatTarget(null)}
                                >
                                    Batal
                                </CmsButton>
                                <CmsButton
                                    type="button"
                                    hierarchy="primary"
                                    tone="danger"
                                    size="md"
                                    loading={deletingKat}
                                    onClick={confirmDeleteKategori}
                                >
                                    {deletingKat ? 'Menghapus...' : 'Hapus'}
                                </CmsButton>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
        </AdminLayout>
    );
}
