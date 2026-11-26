import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { router, useForm } from '@inertiajs/react';
import {
    IconCheck,
    IconChevronDown,
    IconChevronLeft,
    IconChevronRight,
    IconChevronUp,
    IconChevronsLeft,
    IconChevronsRight,
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
    IconUpload,
    IconX,
} from '@tabler/icons-react';
import AdminLayout from '@/Layouts/AdminLayout';
import CmsButton from '@/Components/Admin/CmsButton';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_BYTES = 3 * 1024 * 1024;
const KATEGORI_BADGE_BASE = 'border border-brand-500/20 bg-brand-500/10 text-brand-600 font-medium';
const KATEGORI_BADGE_INTERACTIVE = `${KATEGORI_BADGE_BASE} hover:bg-brand-500/15 transition`;

function KaryaThumbnail({ src, alt, className = 'w-14 h-10 rounded' }) {
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

    if (totalPages <= 0) {
        return null;
    }

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
        `w-8 h-8 rounded-md inline-flex items-center justify-center transition ${isDisabled
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
                    style={{ backgroundImage: 'none' }}
                    className="appearance-none bg-none min-w-[44px] h-8 px-2.5 text-center text-sm font-medium rounded-md border border-stroke-input bg-surface-primary text-content-primary shadow-xs cursor-pointer transition focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 disabled:opacity-50"
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
                                onClick={() => page !== currentPage && onPageChange?.(page)}
                                aria-current={isActive ? 'page' : undefined}
                                className={`min-w-[32px] h-8 px-2 rounded-md text-sm transition inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${isActive
                                    ? 'text-brand-600 font-bold'
                                    : 'text-content-secondary hover:bg-surface-secondary hover:text-content-primary font-medium'
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
                        aria-label="Halaman berikutnya"
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

/**
 * Halaman Karya & Inovasi Siswa — Versi Lo-Fi Monokrom
 * - Status Tabs (Semua / Tayang Publik / Draft Internal)
 * - View Switcher: Tabel ↔ Galeri Grid
 * - Slide-Over Editor Karya (dengan Inline Quick-Add Kategori)
 * - Slide-Over Kelola Kategori (Rename inline, klik jumlah karya untuk filter, Modal hapus)
 */
export default function TefaKaryaIndex({
    title,
    karyas,
    kategoris = [],
    header,
    filters = {},
    stats = {},
}) {
    // 1. State Filter, View & Tabel
    const [search, setSearch] = useState(filters.search ?? '');
    const [kategoriFilter, setKategoriFilter] = useState(
        filters.kategori ? String(filters.kategori) : ''
    );
    const [statusFilter, setStatusFilter] = useState(
        filters.status !== undefined && filters.status !== null ? String(filters.status) : ''
    );
    const [perPage, setPerPage] = useState(
        Number(filters.per_page || karyas?.per_page || 10)
    );
    const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'
    const [tableLoading, setTableLoading] = useState(false);
    const isFirstRender = useRef(true);
    const perPageRef = useRef(perPage);
    perPageRef.current = perPage;

    // 2. State Section, Drawer & Modal
    const hasInitialHeader = Boolean(header?.judul_header?.trim());
    const [headerOpen, setHeaderOpen] = useState(!hasInitialHeader);
    const [karyaDrawerOpen, setKaryaDrawerOpen] = useState(false);
    const [editingKarya, setEditingKarya] = useState(null);
    const [previewKaryaTarget, setPreviewKaryaTarget] = useState(null);
    const [deleteKaryaTarget, setDeleteKaryaTarget] = useState(null);
    const [deletingKarya, setDeletingKarya] = useState(false);

    // State Slide-Over Kelola Kategori + Rename Inline + Hapus Modal
    const [kategoriDrawerOpen, setKategoriDrawerOpen] = useState(false);
    const [editingKategoriId, setEditingKategoriId] = useState(null);
    const [editingKategoriName, setEditingKategoriName] = useState('');
    const [updatingKategori, setUpdatingKategori] = useState(false);
    const [editKategoriError, setEditKategoriError] = useState('');
    const [deleteKategoriTarget, setDeleteKategoriTarget] = useState(null);
    const [deletingKategori, setDeletingKategori] = useState(false);

    // Inline Quick-Add Kategori di dalam Form Karya
    const [quickAddKategoriOpen, setQuickAddKategoriOpen] = useState(false);
    const [pendingSelectKatName, setPendingSelectKatName] = useState('');

    // Upload Foto Karya
    const fileInputRef = useRef(null);
    const [photoClientError, setPhotoClientError] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');
    const [isDraggingPhoto, setIsDraggingPhoto] = useState(false);

    // 3. Forms Inertia
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

    const karyaForm = useForm({
        _method: 'post',
        kategori_karya_id: '',
        judul_karya: '',
        deskripsi_karya: '',
        urutan_tampil: '0',
        status_publikasi: true,
        foto_karya: null,
    });

    const kategoriForm = useForm({
        nama_kategori: '',
    });

    const quickKategoriForm = useForm({
        nama_kategori: '',
    });

    const rows = karyas?.data || [];
    const totalCount = stats.total ?? karyas?.total ?? rows.length;
    const publishedCount = stats.published ?? 0;
    const draftCount = stats.draft ?? 0;
    const hasActiveFilters = Boolean(search || kategoriFilter || statusFilter !== '');

    // Otomatis memilih kategori baru setelah quick-add di dalam Slide-Over Karya
    useEffect(() => {
        if (!pendingSelectKatName) {
            return;
        }
        const match = kategoris.find(
            (kat) => kat.nama_kategori.toLowerCase() === pendingSelectKatName.toLowerCase()
        );
        if (match) {
            karyaForm.setData('kategori_karya_id', String(match.id));
            setPendingSelectKatName('');
        }
    }, [kategoris, pendingSelectKatName]);

    // Preview URL foto di Slide-Over Karya
    useEffect(() => {
        if (!karyaDrawerOpen) {
            setPreviewUrl('');
            return undefined;
        }
        if (!karyaForm.data.foto_karya) {
            setPreviewUrl(editingKarya?.foto_karya || '');
            return undefined;
        }
        const objectUrl = URL.createObjectURL(karyaForm.data.foto_karya);
        setPreviewUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [karyaDrawerOpen, karyaForm.data.foto_karya, editingKarya?.foto_karya]);

    // Kunci scroll halaman latar belakang saat overlay aktif (IDDN Blocking Interaction)
    useEffect(() => {
        const hasOverlay =
            karyaDrawerOpen ||
            kategoriDrawerOpen ||
            Boolean(previewKaryaTarget) ||
            Boolean(deleteKaryaTarget) ||
            Boolean(deleteKategoriTarget);
        document.body.style.overflow = hasOverlay ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [
        karyaDrawerOpen,
        kategoriDrawerOpen,
        previewKaryaTarget,
        deleteKaryaTarget,
        deleteKategoriTarget,
    ]);

    // Tutup overlay teratas dengan tombol Escape
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key !== 'Escape') {
                return;
            }
            if (deleteKaryaTarget && !deletingKarya) {
                setDeleteKaryaTarget(null);
                return;
            }
            if (deleteKategoriTarget && !deletingKategori) {
                setDeleteKategoriTarget(null);
                return;
            }
            if (previewKaryaTarget) {
                setPreviewKaryaTarget(null);
                return;
            }
            if (kategoriDrawerOpen && !kategoriForm.processing && !updatingKategori) {
                if (editingKategoriId !== null) {
                    cancelEditKategori();
                } else {
                    closeKategoriDrawer();
                }
                return;
            }
            if (karyaDrawerOpen && !karyaForm.processing) {
                closeKaryaDrawer();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [
        deleteKaryaTarget,
        deletingKarya,
        deleteKategoriTarget,
        deletingKategori,
        previewKaryaTarget,
        kategoriDrawerOpen,
        kategoriForm.processing,
        updatingKategori,
        editingKategoriId,
        karyaDrawerOpen,
        karyaForm.processing,
    ]);

    const buildQueryParams = (overrides = {}) => {
        const nextPerPage = overrides.per_page ?? perPageRef.current;
        return {
            ...(search ? { search } : {}),
            ...(kategoriFilter ? { kategori: kategoriFilter } : {}),
            ...(statusFilter !== '' ? { status: statusFilter } : {}),
            ...(nextPerPage && nextPerPage !== 10 ? { per_page: nextPerPage } : {}),
            ...(overrides.page && overrides.page > 1 ? { page: overrides.page } : {}),
        };
    };

    const navigateKaryaList = (overrides = {}, { replace = false } = {}) => {
        router.get(
            '/admin/tefa-karya',
            buildQueryParams(overrides),
            {
                preserveState: true,
                preserveScroll: true,
                replace,
                onStart: () => setTableLoading(true),
                onFinish: () => setTableLoading(false),
            }
        );
    };

    // Sinkronkan filter & pencarian ke server (debounce 300ms)
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return undefined;
        }

        const timer = setTimeout(() => {
            navigateKaryaList({}, { replace: true });
        }, 300);

        return () => clearTimeout(timer);
    }, [search, kategoriFilter, statusFilter]);

    const handlePageChange = (nextPage) => {
        if (nextPage === (karyas?.current_page || 1)) {
            return;
        }
        navigateKaryaList({ page: nextPage });
    };

    const handlePageSizeChange = (newSize) => {
        const parsed = Number(newSize) || 10;
        setPerPage(parsed);
        perPageRef.current = parsed;
        navigateKaryaList({ per_page: parsed, page: 1 });
    };

    const resetFilters = () => {
        setSearch('');
        setKategoriFilter('');
        setStatusFilter('');
    };

    const toggleKategoriFilterChip = (katId) => {
        const nextId = String(katId || '');
        if (!nextId) {
            return;
        }
        setKategoriFilter((prev) => (prev === nextId ? '' : nextId));
    };

    // Handler Header
    const handleSubmitHeader = (e) => {
        e.preventDefault();
        headerForm.put('/admin/tefa-karya/header', {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const handleResetHeader = () => {
        headerForm.clearErrors();
        headerForm.setData({
            judul_header: header?.judul_header || '',
            subjudul_header: header?.subjudul_header || '',
        });
    };

    // Handler Slide-Over Drawer Karya
    const openCreateDrawer = () => {
        setEditingKarya(null);
        setPhotoClientError('');
        setQuickAddKategoriOpen(false);
        quickKategoriForm.reset();
        quickKategoriForm.clearErrors();
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        karyaForm.clearErrors();
        karyaForm.setData({
            _method: 'post',
            kategori_karya_id: kategoris[0]?.id ? String(kategoris[0].id) : '',
            judul_karya: '',
            deskripsi_karya: '',
            urutan_tampil: '0',
            status_publikasi: true,
            foto_karya: null,
        });
        setKaryaDrawerOpen(true);
    };

    const openEditDrawer = (item) => {
        setEditingKarya(item);
        setPhotoClientError('');
        setQuickAddKategoriOpen(false);
        quickKategoriForm.reset();
        quickKategoriForm.clearErrors();
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        karyaForm.clearErrors();
        karyaForm.setData({
            _method: 'put',
            kategori_karya_id: String(item.kategori_karya_id || ''),
            judul_karya: item.judul_karya || '',
            deskripsi_karya: item.deskripsi_karya || '',
            urutan_tampil: String(item.urutan_tampil ?? 0),
            status_publikasi: Boolean(item.status_publikasi),
            foto_karya: null,
        });
        setKaryaDrawerOpen(true);
    };

    const closeKaryaDrawer = () => {
        setKaryaDrawerOpen(false);
        setEditingKarya(null);
        setPhotoClientError('');
        setQuickAddKategoriOpen(false);
        setPendingSelectKatName('');
        quickKategoriForm.reset();
        quickKategoriForm.clearErrors();
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        karyaForm.reset();
        karyaForm.clearErrors();
    };

    const validateAndSetPhoto = (file, inputEl = null) => {
        if (!file) {
            return;
        }
        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            setPhotoClientError('Format foto harus JPG, PNG, atau WebP.');
            if (inputEl) {
                inputEl.value = '';
            }
            return;
        }
        if (file.size > MAX_IMAGE_BYTES) {
            setPhotoClientError('Ukuran foto maksimal 3 MB.');
            if (inputEl) {
                inputEl.value = '';
            }
            return;
        }
        setPhotoClientError('');
        karyaForm.setData('foto_karya', file);
    };

    const handleFileSelect = (e) => {
        validateAndSetPhoto(e.target.files?.[0], e.target);
    };

    const handlePhotoDrop = (e) => {
        e.preventDefault();
        setIsDraggingPhoto(false);
        validateAndSetPhoto(e.dataTransfer?.files?.[0]);
    };

    const handleClearPhoto = () => {
        setPhotoClientError('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        karyaForm.setData('foto_karya', null);
    };

    const handleSubmitKarya = (e) => {
        e.preventDefault();
        const url = editingKarya
            ? `/admin/tefa-karya/${editingKarya.id}`
            : '/admin/tefa-karya';

        karyaForm.post(url, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => closeKaryaDrawer(),
        });
    };

    const handleQuickAddKategori = (e) => {
        e.preventDefault();
        const trimmed = quickKategoriForm.data.nama_kategori.trim();
        setPendingSelectKatName(trimmed);
        quickKategoriForm.post('/admin/tefa-karya/kategori', {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                quickKategoriForm.reset('nama_kategori');
                setQuickAddKategoriOpen(false);
            },
            onError: () => setPendingSelectKatName(''),
        });
    };

    const confirmDeleteKarya = () => {
        if (!deleteKaryaTarget || deletingKarya) {
            return;
        }
        setDeletingKarya(true);
        router.delete(`/admin/tefa-karya/${deleteKaryaTarget.id}`, {
            preserveScroll: true,
            onFinish: () => {
                setDeletingKarya(false);
                setDeleteKaryaTarget(null);
            },
        });
    };

    const handleToggleStatus = (item) => {
        router.patch(
            `/admin/tefa-karya/${item.id}/toggle`,
            {},
            { preserveScroll: true }
        );
    };

    // Handler Slide-Over Kelola Kategori
    const closeKategoriDrawer = () => {
        setKategoriDrawerOpen(false);
        cancelEditKategori();
        kategoriForm.reset();
        kategoriForm.clearErrors();
    };

    const handleCreateKategori = (e) => {
        e.preventDefault();
        kategoriForm.post('/admin/tefa-karya/kategori', {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => kategoriForm.reset('nama_kategori'),
        });
    };

    const startEditKategori = (kat) => {
        setEditingKategoriId(kat.id);
        setEditingKategoriName(kat.nama_kategori);
        setEditKategoriError('');
    };

    const cancelEditKategori = () => {
        setEditingKategoriId(null);
        setEditingKategoriName('');
        setEditKategoriError('');
    };

    const handleSaveEditKategori = (kat) => {
        const trimmed = editingKategoriName.trim();
        if (!trimmed) {
            setEditKategoriError('Nama kategori wajib diisi.');
            return;
        }
        if (trimmed.length > 100) {
            setEditKategoriError('Nama kategori maksimal 100 karakter.');
            return;
        }

        setUpdatingKategori(true);
        setEditKategoriError('');
        router.put(
            `/admin/tefa-karya/kategori/${kat.id}`,
            { nama_kategori: trimmed },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => cancelEditKategori(),
                onError: (errs) => {
                    setEditKategoriError(errs.nama_kategori || 'Gagal memperbarui kategori.');
                },
                onFinish: () => setUpdatingKategori(false),
            }
        );
    };

    const confirmDeleteKategori = () => {
        if (!deleteKategoriTarget || deletingKategori || deleteKategoriTarget.tefa_karyas_count > 0) {
            return;
        }
        setDeletingKategori(true);
        router.delete(`/admin/tefa-karya/kategori/${deleteKategoriTarget.id}`, {
            preserveScroll: true,
            preserveState: true,
            onFinish: () => {
                setDeletingKategori(false);
                setDeleteKategoriTarget(null);
            },
        });
    };

    const filterByKategoriFromDrawer = (katId) => {
        setKategoriFilter(String(katId));
        closeKategoriDrawer();
    };

    const statusTabs = [
        { key: '', label: `Semua (${totalCount})` },
        { key: '1', label: `Tayang Publik (${publishedCount})` },
        { key: '0', label: `Draft Internal (${draftCount})` },
    ];

    return (
        <AdminLayout
            title={title || 'Karya & Inovasi'}
            subtitle="Kelola etalase karya inovatif siswa dalam tampilan tabel maupun galeri kartu."
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
                        Tambah Karya
                    </CmsButton>
                </div>
            }
        >
            <div className="space-y-5 text-content-primary">
                {/* CARD 1: Header Halaman Publik Karya & Inovasi (Collapsible & Mandiri) */}
                <section className="bg-surface-primary border border-stroke-card rounded-xl shadow-admin-card overflow-hidden">
                    <div
                        className={`px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 ${headerOpen ? 'border-b border-stroke-card' : ''
                            }`}
                    >
                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <h2 className="text-base font-bold text-content-primary">
                                    Header Halaman Publik (Karya &amp; Inovasi)
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
                                    Judul utama dan teks pengantar di atas halaman publik galeri karya siswa.
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
                                        <label
                                            htmlFor="judul_header_karya"
                                            className="block text-sm font-medium text-content-primary"
                                        >
                                            Judul Header <span className="text-content-negative">*</span>
                                        </label>
                                        <span className="text-xs text-content-tertiary">
                                            {headerForm.data.judul_header.length}/200
                                        </span>
                                    </div>
                                    <input
                                        id="judul_header_karya"
                                        type="text"
                                        maxLength={200}
                                        value={headerForm.data.judul_header}
                                        onChange={(e) => headerForm.setData('judul_header', e.target.value)}
                                        placeholder="Contoh: Eksplorasi Karya dan Kreativitas"
                                        className={`w-full h-10 px-3 text-sm rounded-md border bg-surface-primary text-content-primary placeholder:text-content-disabled shadow-xs transition focus:outline-none ${headerForm.errors.judul_header
                                            ? 'border-negative-600 focus:border-negative-600 focus:ring-2 focus:ring-negative-500/15'
                                            : 'border-stroke-input focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15'
                                            }`}
                                    />
                                    {headerForm.errors.judul_header && (
                                        <p className="mt-1 text-xs font-medium text-content-negative">
                                            {headerForm.errors.judul_header}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label
                                            htmlFor="subjudul_header_karya"
                                            className="block text-sm font-medium text-content-primary"
                                        >
                                            Subjudul Header
                                        </label>
                                        <span className="text-xs text-content-tertiary">
                                            {headerForm.data.subjudul_header.length} karakter
                                        </span>
                                    </div>
                                    <textarea
                                        id="subjudul_header_karya"
                                        rows={3}
                                        maxLength={1000}
                                        value={headerForm.data.subjudul_header}
                                        onChange={(e) => headerForm.setData('subjudul_header', e.target.value)}
                                        placeholder="Teks pengantar singkat di bawah judul galeri karya siswa..."
                                        className={`w-full p-3 text-sm rounded-md border bg-surface-primary text-content-primary placeholder:text-content-disabled shadow-xs transition focus:outline-none ${headerForm.errors.subjudul_header
                                            ? 'border-negative-600 focus:border-negative-600 focus:ring-2 focus:ring-negative-500/15'
                                            : 'border-stroke-input focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15'
                                            }`}
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

                {/* CARD 2: Katalog Karya (Status Tabs + View Switcher + Pencarian + Tabel/Galeri) */}
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
                                        className={`px-3 py-2 text-sm border-b-2 transition whitespace-nowrap ${active
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
                                    className={`inline-flex items-center gap-1.5 h-8 px-3 text-xs rounded transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/25 ${viewMode === 'table'
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
                                    className={`inline-flex items-center gap-1.5 h-8 px-3 text-xs rounded transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/25 ${viewMode === 'grid'
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
                                placeholder="Cari judul atau deskripsi karya..."
                                aria-label="Cari judul atau deskripsi karya"
                                className="w-full h-10 pl-9 pr-3 text-sm rounded-md border border-stroke-input bg-surface-primary text-content-primary placeholder:text-content-disabled shadow-xs transition focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                            <select
                                value={kategoriFilter}
                                onChange={(e) => setKategoriFilter(e.target.value)}
                                aria-label="Filter kategori karya"
                                className="flex-1 sm:w-52 h-10 px-3 text-sm rounded-md border border-stroke-input bg-surface-primary text-content-primary shadow-xs transition focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
                            >
                                <option value="">Semua Kategori</option>
                                {kategoris.map((kat) => (
                                    <option key={kat.id} value={String(kat.id)}>
                                        {kat.nama_kategori} ({kat.tefa_karyas_count})
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

                        {rows.length === 0 ? (
                            <div className="py-12 text-center">
                                <div className="flex flex-col items-center space-y-2.5 max-w-md mx-auto px-4">
                                    <p className="text-base font-semibold text-content-primary">
                                        {hasActiveFilters ? 'Karya tidak ditemukan' : 'Belum ada karya siswa'}
                                    </p>
                                    <p className="text-sm text-content-secondary leading-relaxed">
                                        {hasActiveFilters
                                            ? 'Tidak ada karya yang sesuai dengan kata kunci pencarian, tab status, atau kategori yang dipilih.'
                                            : 'Mulai tambahkan dokumentasi karya inovatif siswa untuk ditampilkan pada galeri publik TEFA.'}
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
                                                Tambah Karya Pertama
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
                                            <th className="px-4 py-3">Karya Siswa</th>
                                            <th className="px-4 py-3 w-44">Kategori</th>
                                            <th className="px-4 py-3 w-24 text-center">Urutan</th>
                                            <th className="px-4 py-3 w-40">Publikasi</th>
                                            <th className="px-4 py-3 w-32 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-stroke-card">
                                        {rows.map((row) => {
                                            const isPublished = Boolean(row.status_publikasi);
                                            const isFilteredKat = kategoriFilter === String(row.kategori_karya_id);
                                            return (
                                                <tr key={row.id} className="hover:bg-brand-50/60 transition-colors">
                                                    <td className="px-4 py-3 align-middle">
                                                        <button
                                                            type="button"
                                                            onClick={() => setPreviewKaryaTarget(row)}
                                                            title="Klik untuk pratinjau detail karya"
                                                            className="flex items-center gap-3 max-w-md text-left group focus:outline-none"
                                                        >
                                                            <KaryaThumbnail src={row.foto_karya} alt={row.judul_karya} />
                                                            <div className="min-w-0">
                                                                <p className="text-sm font-bold text-content-primary truncate group-hover:text-brand-600 group-hover:underline">
                                                                    {row.judul_karya}
                                                                </p>
                                                                <p className="text-xs text-content-secondary line-clamp-1 mt-0.5">
                                                                    {row.deskripsi_karya}
                                                                </p>
                                                            </div>
                                                        </button>
                                                    </td>

                                                    <td className="px-4 py-3 align-middle">
                                                        {row.kategori_karya ? (
                                                            <button
                                                                type="button"
                                                                onClick={() => toggleKategoriFilterChip(row.kategori_karya_id)}
                                                                title={isFilteredKat ? 'Hapus filter kategori' : 'Filter berdasarkan kategori ini'}
                                                                className={`inline-block text-xs px-2.5 py-0.5 rounded-full ${KATEGORI_BADGE_INTERACTIVE} ${isFilteredKat ? 'ring-1 ring-brand-500/40 font-semibold' : ''
                                                                    }`}
                                                            >
                                                                {row.kategori_karya.nama_kategori}
                                                            </button>
                                                        ) : (
                                                            <span className="text-content-disabled">-</span>
                                                        )}
                                                    </td>

                                                    <td className="px-4 py-3 text-center font-semibold text-content-secondary align-middle">
                                                        #{row.urutan_tampil}
                                                    </td>

                                                    <td className="px-4 py-3 align-middle">
                                                        <div className="inline-flex items-center gap-2">
                                                            <button
                                                                type="button"
                                                                role="switch"
                                                                aria-checked={isPublished}
                                                                aria-label={`Ubah status publikasi ${row.judul_karya}`}
                                                                onClick={() => handleToggleStatus(row)}
                                                                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border transition-colors ${isPublished
                                                                    ? 'bg-positive-600 border-positive-600'
                                                                    : 'bg-stroke-input border-stroke-input'
                                                                    }`}
                                                            >
                                                                <span
                                                                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-xs transition-transform ${isPublished ? 'translate-x-4' : 'translate-x-0.5'
                                                                        }`}
                                                                />
                                                            </button>
                                                            <span
                                                                className={`text-xs font-medium ${isPublished ? 'text-content-positive' : 'text-content-tertiary'
                                                                    }`}
                                                            >
                                                                {isPublished ? 'Tayang' : 'Draft'}
                                                            </span>
                                                        </div>
                                                    </td>

                                                    <td className="px-4 py-3 text-right align-middle">
                                                        <div className="inline-flex items-center justify-end gap-1">
                                                            <CmsButton
                                                                hierarchy="tertiary"
                                                                tone="brand"
                                                                size="icon-sm"
                                                                onClick={() => setPreviewKaryaTarget(row)}
                                                                title="Pratinjau karya"
                                                                aria-label={`Pratinjau karya ${row.judul_karya}`}
                                                                prefixIcon={<IconEye size={15} />}
                                                            />
                                                            <CmsButton
                                                                hierarchy="tertiary"
                                                                tone="warning"
                                                                size="icon-sm"
                                                                onClick={() => openEditDrawer(row)}
                                                                title="Edit karya"
                                                                aria-label={`Edit karya ${row.judul_karya}`}
                                                                prefixIcon={<IconEdit size={15} />}
                                                            />
                                                            <CmsButton
                                                                hierarchy="tertiary"
                                                                tone="danger"
                                                                size="icon-sm"
                                                                onClick={() => setDeleteKaryaTarget(row)}
                                                                title="Hapus karya"
                                                                aria-label={`Hapus karya ${row.judul_karya}`}
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
                            /* Mode Galeri Grid — foto, judul, dan kategori dapat diklik langsung */
                            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {rows.map((row) => {
                                    const isPublished = Boolean(row.status_publikasi);
                                    const isFilteredKat = kategoriFilter === String(row.kategori_karya_id);
                                    return (
                                        <div
                                            key={row.id}
                                            className="rounded-xl border border-stroke-card bg-surface-primary shadow-xs overflow-hidden flex flex-col hover:border-brand-300 transition-colors"
                                        >
                                            <button
                                                type="button"
                                                onClick={() => setPreviewKaryaTarget(row)}
                                                className="block w-full text-left focus:outline-none group"
                                                title="Klik untuk pratinjau detail karya"
                                            >
                                                <KaryaThumbnail
                                                    src={row.foto_karya}
                                                    alt={row.judul_karya}
                                                    className="w-full h-40 rounded-none border-0 border-b border-stroke-card group-hover:opacity-90 transition-opacity"
                                                />
                                            </button>

                                            <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                                                <div>
                                                    <div className="flex items-center justify-between gap-2 mb-1.5">
                                                        {row.kategori_karya ? (
                                                            <button
                                                                type="button"
                                                                onClick={() => toggleKategoriFilterChip(row.kategori_karya_id)}
                                                                title={isFilteredKat ? 'Hapus filter kategori' : 'Filter berdasarkan kategori ini'}
                                                                className={`text-xs px-2.5 py-0.5 rounded-full truncate ${KATEGORI_BADGE_INTERACTIVE} ${isFilteredKat ? 'ring-1 ring-brand-500/40 font-semibold' : ''
                                                                    }`}
                                                            >
                                                                {row.kategori_karya.nama_kategori}
                                                            </button>
                                                        ) : (
                                                            <span className="text-xs text-content-disabled">-</span>
                                                        )}
                                                        <span className="text-xs font-semibold text-content-tertiary shrink-0">
                                                            #{row.urutan_tampil}
                                                        </span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => setPreviewKaryaTarget(row)}
                                                        className="text-left w-full focus:outline-none group"
                                                    >
                                                        <h3 className="text-base font-bold text-content-primary line-clamp-1 group-hover:text-brand-600 group-hover:underline">
                                                            {row.judul_karya}
                                                        </h3>
                                                    </button>
                                                    <p className="text-xs text-content-secondary line-clamp-2 mt-1 leading-relaxed">
                                                        {row.deskripsi_karya}
                                                    </p>
                                                </div>

                                                <div className="pt-3 border-t border-stroke-card flex items-center justify-between gap-2">
                                                    <div className="inline-flex items-center gap-2">
                                                        <button
                                                            type="button"
                                                            role="switch"
                                                            aria-checked={isPublished}
                                                            aria-label={`Ubah status publikasi ${row.judul_karya}`}
                                                            onClick={() => handleToggleStatus(row)}
                                                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border transition-colors ${isPublished
                                                                ? 'bg-positive-600 border-positive-600'
                                                                : 'bg-stroke-input border-stroke-input'
                                                                }`}
                                                        >
                                                            <span
                                                                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-xs transition-transform ${isPublished ? 'translate-x-4' : 'translate-x-0.5'
                                                                    }`}
                                                            />
                                                        </button>
                                                        <span
                                                            className={`text-xs font-medium ${isPublished ? 'text-content-positive' : 'text-content-tertiary'
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
                                                            onClick={() => setPreviewKaryaTarget(row)}
                                                            title="Pratinjau karya"
                                                            aria-label={`Pratinjau karya ${row.judul_karya}`}
                                                            prefixIcon={<IconEye size={15} />}
                                                        />
                                                        <CmsButton
                                                            hierarchy="tertiary"
                                                            tone="warning"
                                                            size="icon-sm"
                                                            onClick={() => openEditDrawer(row)}
                                                            title="Edit karya"
                                                            aria-label={`Edit karya ${row.judul_karya}`}
                                                            prefixIcon={<IconEdit size={15} />}
                                                        />
                                                        <CmsButton
                                                            hierarchy="tertiary"
                                                            tone="danger"
                                                            size="icon-sm"
                                                            onClick={() => setDeleteKaryaTarget(row)}
                                                            title="Hapus karya"
                                                            aria-label={`Hapus karya ${row.judul_karya}`}
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

                    {/* Pagination Footer (Tailwind) */}
                    {(karyas?.total || 0) > 0 && (
                        <div className="px-5 py-3.5 border-t border-stroke-card bg-surface-primary">
                            <TailwindPagination
                                currentPage={karyas?.current_page || 1}
                                totalPages={karyas?.last_page || 1}
                                pageSize={perPage}
                                pageSizeOptions={[10, 20, 50, 100]}
                                onPageChange={handlePageChange}
                                onPageSizeChange={handlePageSizeChange}
                                disabled={tableLoading}
                            />
                        </div>
                    )}
                </section>
            </div>

            {/* Slide-Over Drawer: Tambah / Edit Karya (Portal ke body sesuai standar Overlay IDDN) */}
            {karyaDrawerOpen && createPortal(
                <div className="fixed inset-0 z-[60]">
                    <div
                        className="fixed inset-0 bg-brand-900/35 backdrop-blur-[1.5px] transition-opacity"
                        onClick={() => !karyaForm.processing && closeKaryaDrawer()}
                    />
                    <aside
                        className="fixed top-0 right-0 bottom-0 z-[70] w-full max-w-lg bg-surface-primary border-l border-stroke-card shadow-2xl flex flex-col"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="drawer-karya-title"
                    >
                        <div className="px-5 py-4 border-b border-stroke-card flex items-center justify-between shrink-0">
                            <div>
                                <h3 id="drawer-karya-title" className="text-base sm:text-lg font-bold text-content-primary">
                                    {editingKarya ? 'Edit Karya Siswa' : 'Tambah Karya Siswa'}
                                </h3>
                                <p className="text-xs text-content-secondary mt-0.5">
                                    Lengkapi dokumentasi karya agar tampil rapi di halaman publik.
                                </p>
                            </div>
                            <CmsButton
                                hierarchy="tertiary"
                                size="icon-sm"
                                onClick={closeKaryaDrawer}
                                disabled={karyaForm.processing}
                                aria-label="Tutup panel"
                                prefixIcon={<IconX size={16} />}
                            />
                        </div>

                        <form onSubmit={handleSubmitKarya} noValidate className="flex-1 flex flex-col min-h-0">
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
                                        <label
                                            htmlFor="judul_karya"
                                            className="block text-sm font-medium text-content-primary"
                                        >
                                            Judul Karya <span className="text-content-negative">*</span>
                                        </label>
                                        <span className="text-xs text-content-tertiary">
                                            {karyaForm.data.judul_karya.length}/200
                                        </span>
                                    </div>
                                    <input
                                        id="judul_karya"
                                        type="text"
                                        maxLength={200}
                                        value={karyaForm.data.judul_karya}
                                        onChange={(e) => karyaForm.setData('judul_karya', e.target.value)}
                                        placeholder="Masukkan judul karya siswa..."
                                        className={`w-full h-10 px-3 text-sm rounded-md border bg-surface-primary text-content-primary placeholder:text-content-disabled shadow-xs transition focus:outline-none ${karyaForm.errors.judul_karya
                                            ? 'border-negative-600 focus:border-negative-600 focus:ring-2 focus:ring-negative-500/15'
                                            : 'border-stroke-input focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15'
                                            }`}
                                    />
                                    {karyaForm.errors.judul_karya && (
                                        <p className="mt-1 text-xs font-medium text-content-negative">
                                            {karyaForm.errors.judul_karya}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label
                                                htmlFor="kategori_karya_id"
                                                className="block text-sm font-medium text-content-primary"
                                            >
                                                Kategori Karya <span className="text-content-negative">*</span>
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
                                            id="kategori_karya_id"
                                            value={karyaForm.data.kategori_karya_id}
                                            disabled={kategoris.length === 0}
                                            onChange={(e) => karyaForm.setData('kategori_karya_id', e.target.value)}
                                            className={`w-full h-10 px-3 text-sm rounded-md border bg-surface-primary text-content-primary disabled:bg-surface-secondary disabled:text-content-disabled shadow-xs transition focus:outline-none ${karyaForm.errors.kategori_karya_id
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
                                        {karyaForm.errors.kategori_karya_id && (
                                            <p className="mt-1 text-xs font-medium text-content-negative">
                                                {karyaForm.errors.kategori_karya_id}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="urutan_tampil"
                                            className="block text-sm font-medium text-content-primary mb-1.5"
                                        >
                                            Urutan Tampil
                                        </label>
                                        <input
                                            id="urutan_tampil"
                                            type="number"
                                            min={0}
                                            max={100000}
                                            value={karyaForm.data.urutan_tampil}
                                            onChange={(e) => karyaForm.setData('urutan_tampil', e.target.value)}
                                            className={`w-full h-10 px-3 text-sm rounded-md border bg-surface-primary text-content-primary shadow-xs transition focus:outline-none ${karyaForm.errors.urutan_tampil
                                                ? 'border-negative-600 focus:border-negative-600 focus:ring-2 focus:ring-negative-500/15'
                                                : 'border-stroke-input focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15'
                                                }`}
                                        />
                                        <p className="mt-1 text-xs text-content-tertiary">
                                            Angka lebih kecil tampil lebih awal.
                                        </p>
                                        {karyaForm.errors.urutan_tampil && (
                                            <p className="mt-1 text-xs font-medium text-content-negative">
                                                {karyaForm.errors.urutan_tampil}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Inline Quick-Add Kategori (tanpa pop-up bertumpuk) */}
                                {quickAddKategoriOpen && (
                                    <div className="p-3 rounded-lg border border-brand-200 bg-brand-50/60 space-y-2">
                                        <p className="text-xs font-semibold text-content-primary">
                                            Tambah Kategori Baru
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                maxLength={100}
                                                value={quickKategoriForm.data.nama_kategori}
                                                onChange={(e) => quickKategoriForm.setData('nama_kategori', e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        handleQuickAddKategori(e);
                                                    }
                                                }}
                                                placeholder="Masukkan nama kategori..."
                                                className="flex-1 h-8 px-3 text-xs rounded-md border border-stroke-input bg-surface-primary text-content-primary placeholder:text-content-disabled focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
                                            />
                                            <CmsButton
                                                hierarchy="tertiary"
                                                size="sm"
                                                disabled={quickKategoriForm.processing}
                                                onClick={() => {
                                                    setQuickAddKategoriOpen(false);
                                                    quickKategoriForm.reset();
                                                    quickKategoriForm.clearErrors();
                                                }}
                                                className="shrink-0"
                                            >
                                                Batal
                                            </CmsButton>
                                            <CmsButton
                                                hierarchy="primary"
                                                size="sm"
                                                loading={quickKategoriForm.processing}
                                                onClick={handleQuickAddKategori}
                                                className="shrink-0"
                                            >
                                                {quickKategoriForm.processing ? 'Menyimpan...' : 'Simpan'}
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
                                    <span className="block text-sm font-medium text-content-primary mb-1.5">
                                        Foto Karya {!editingKarya && <span className="text-content-negative">*</span>}
                                    </span>
                                    <div
                                        onDragOver={(e) => {
                                            e.preventDefault();
                                            setIsDraggingPhoto(true);
                                        }}
                                        onDragLeave={() => setIsDraggingPhoto(false)}
                                        onDrop={handlePhotoDrop}
                                        className={`p-5 rounded-lg border border-dashed flex flex-col justify-center items-center text-center transition-colors ${isDraggingPhoto
                                            ? 'border-brand-500 bg-brand-50'
                                            : 'border-stroke-input bg-surface-primary hover:border-brand-300'
                                            }`}
                                    >
                                        {previewUrl ? (
                                            <div className="w-full space-y-3">
                                                <div className="w-full aspect-video rounded-md border border-stroke-card bg-surface-secondary overflow-hidden">
                                                    <img
                                                        src={previewUrl}
                                                        alt="Pratinjau foto karya"
                                                        className="w-full h-full object-cover"
                                                        onError={() => setPreviewUrl('')}
                                                    />
                                                </div>

                                                <p className="text-xs text-content-secondary">
                                                    Unggah atau seret file baru ke kotak ini untuk mengganti.
                                                </p>

                                                <div className="space-y-2">
                                                    <CmsButton
                                                        hierarchy="secondary"
                                                        size="md"
                                                        prefixIcon={<IconUpload size={16} className="text-brand-500" />}
                                                        onClick={() => fileInputRef.current?.click()}
                                                        className="w-full"
                                                    >
                                                        Ganti File
                                                    </CmsButton>

                                                    {karyaForm.data.foto_karya && (
                                                        <CmsButton
                                                            hierarchy="tertiary"
                                                            size="sm"
                                                            onClick={handleClearPhoto}
                                                            className="w-full"
                                                        >
                                                            Batal Ganti
                                                        </CmsButton>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="w-full space-y-3">
                                                <div className="w-10 h-10 mx-auto rounded-lg bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-500">
                                                    <IconUpload size={18} stroke={1.8} />
                                                </div>

                                                <div className="space-y-1">
                                                    <p className="text-sm font-bold text-content-primary">
                                                        Unggah File
                                                    </p>
                                                    <p className="text-xs text-content-secondary">
                                                        Unggah atau seret dan lepas ke dalam kotak ini.
                                                    </p>
                                                </div>

                                                <CmsButton
                                                    hierarchy="primary"
                                                    size="md"
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="w-full"
                                                >
                                                    Pilih File
                                                </CmsButton>
                                            </div>
                                        )}

                                        <input
                                            ref={fileInputRef}
                                            id="foto_karya"
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            onChange={handleFileSelect}
                                            className="hidden"
                                        />

                                        <p className="mt-3 text-xs text-content-tertiary">
                                            JPG, PNG, WebP · Maks. 3 MB
                                        </p>

                                        {karyaForm.data.foto_karya && (
                                            <p className="mt-1.5 text-xs font-medium text-brand-600 truncate max-w-full">
                                                Dipilih: {karyaForm.data.foto_karya.name}
                                            </p>
                                        )}
                                    </div>
                                    {(photoClientError || karyaForm.errors.foto_karya) && (
                                        <p className="mt-1 text-xs font-medium text-content-negative">
                                            {photoClientError || karyaForm.errors.foto_karya}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label
                                            htmlFor="deskripsi_karya"
                                            className="block text-sm font-medium text-content-primary"
                                        >
                                            Deskripsi Karya <span className="text-content-negative">*</span>
                                        </label>
                                        <span className="text-xs text-content-tertiary">
                                            {karyaForm.data.deskripsi_karya.length} karakter
                                        </span>
                                    </div>
                                    <textarea
                                        id="deskripsi_karya"
                                        rows={5}
                                        maxLength={20000}
                                        value={karyaForm.data.deskripsi_karya}
                                        onChange={(e) => karyaForm.setData('deskripsi_karya', e.target.value)}
                                        placeholder="Awali dengan ringkasan karya (1–2 kalimat), lalu jelaskan proses pengerjaan & keunggulannya..."
                                        className={`w-full p-3 text-sm rounded-md border bg-surface-primary text-content-primary placeholder:text-content-disabled shadow-xs transition focus:outline-none ${karyaForm.errors.deskripsi_karya
                                            ? 'border-negative-600 focus:border-negative-600 focus:ring-2 focus:ring-negative-500/15'
                                            : 'border-stroke-input focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15'
                                            }`}
                                    />
                                    <p className="mt-1 text-xs text-content-tertiary">
                                        Kalimat awal akan tampil sebagai ringkasan pada kartu galeri publik.
                                    </p>
                                    {karyaForm.errors.deskripsi_karya && (
                                        <p className="mt-1 text-xs font-medium text-content-negative">
                                            {karyaForm.errors.deskripsi_karya}
                                        </p>
                                    )}
                                </div>

                                <label htmlFor="status_publikasi" className="flex items-start gap-2.5 cursor-pointer select-none">
                                    <input
                                        id="status_publikasi"
                                        type="checkbox"
                                        checked={Boolean(karyaForm.data.status_publikasi)}
                                        onChange={(e) => karyaForm.setData('status_publikasi', e.target.checked)}
                                        className="mt-1 h-4 w-4 rounded border-stroke-input text-brand-500 focus:ring-brand-500/25"
                                    />
                                    <span>
                                        <span className="block text-sm font-medium text-content-primary">
                                            Langsung tayangkan di halaman publik
                                        </span>
                                        <span className="block text-xs text-content-secondary">
                                            Nonaktifkan jika masih ingin disimpan sebagai draft internal.
                                        </span>
                                    </span>
                                </label>
                            </div>

                            <div className="px-5 py-3.5 border-t border-stroke-card bg-surface-primary flex items-center justify-end gap-2 shrink-0">
                                <CmsButton
                                    hierarchy="secondary"
                                    size="md"
                                    onClick={closeKaryaDrawer}
                                    disabled={karyaForm.processing}
                                >
                                    Batal
                                </CmsButton>
                                <CmsButton
                                    type="submit"
                                    hierarchy="primary"
                                    size="md"
                                    loading={karyaForm.processing}
                                    disabled={kategoris.length === 0}
                                >
                                    {karyaForm.processing
                                        ? 'Menyimpan...'
                                        : editingKarya
                                            ? 'Simpan Perubahan'
                                            : 'Tambah Karya'}
                                </CmsButton>
                            </div>
                        </form>
                    </aside>
                </div>,
                document.body
            )}

            {/* Slide-Over Drawer: Kelola Kategori Karya (Portal ke body sesuai standar Overlay IDDN) */}
            {kategoriDrawerOpen && createPortal(
                <div className="fixed inset-0 z-[60]">
                    <div
                        className="fixed inset-0 bg-brand-900/35 backdrop-blur-[1.5px] transition-opacity"
                        onClick={() => !kategoriForm.processing && !updatingKategori && closeKategoriDrawer()}
                    />
                    <aside
                        className="fixed top-0 right-0 bottom-0 z-[70] w-full max-w-md bg-surface-primary border-l border-stroke-card shadow-2xl flex flex-col"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="drawer-kategori-title"
                    >
                        <div className="px-5 py-4 border-b border-stroke-card flex items-center justify-between shrink-0">
                            <div>
                                <h3 id="drawer-kategori-title" className="text-base sm:text-lg font-bold text-content-primary">
                                    Kelola Kategori Karya
                                </h3>
                                <p className="text-xs text-content-secondary mt-0.5">
                                    Tambah, ubah nama, atau cek karya pada tiap kategori.
                                </p>
                            </div>
                            <CmsButton
                                hierarchy="tertiary"
                                size="icon-sm"
                                onClick={closeKategoriDrawer}
                                disabled={kategoriForm.processing || updatingKategori}
                                aria-label="Tutup panel kategori"
                                prefixIcon={<IconX size={16} />}
                            />
                        </div>

                        <div className="p-5 space-y-4 overflow-y-auto flex-1">
                            <form onSubmit={handleCreateKategori} noValidate className="space-y-1.5">
                                <label
                                    htmlFor="nama_kategori_baru"
                                    className="block text-sm font-medium text-content-primary"
                                >
                                    Tambah Kategori Baru <span className="text-content-negative">*</span>
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        id="nama_kategori_baru"
                                        type="text"
                                        maxLength={100}
                                        value={kategoriForm.data.nama_kategori}
                                        onChange={(e) => kategoriForm.setData('nama_kategori', e.target.value)}
                                        placeholder="Masukkan nama kategori..."
                                        className={`flex-1 h-10 px-3 text-sm rounded-md border bg-surface-primary text-content-primary placeholder:text-content-disabled shadow-xs transition focus:outline-none ${kategoriForm.errors.nama_kategori
                                            ? 'border-negative-600 focus:border-negative-600 focus:ring-2 focus:ring-negative-500/15'
                                            : 'border-stroke-input focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15'
                                            }`}
                                    />
                                    <CmsButton
                                        type="submit"
                                        hierarchy="primary"
                                        size="md"
                                        prefixIcon={<IconPlus size={16} />}
                                        loading={kategoriForm.processing}
                                        className="shrink-0"
                                    >
                                        Tambah
                                    </CmsButton>
                                </div>
                                {kategoriForm.errors.nama_kategori && (
                                    <p className="text-xs font-medium text-content-negative">
                                        {kategoriForm.errors.nama_kategori}
                                    </p>
                                )}
                            </form>

                            <div className="divide-y divide-stroke-card border border-stroke-card rounded-lg overflow-hidden">
                                {kategoris.length === 0 ? (
                                    <p className="p-6 text-center text-xs text-content-secondary">
                                        Belum ada kategori karya.
                                    </p>
                                ) : (
                                    kategoris.map((kat) => {
                                        const inUse = kat.tefa_karyas_count > 0;
                                        const isEditing = editingKategoriId === kat.id;

                                        if (isEditing) {
                                            return (
                                                <div key={kat.id} className="p-3 bg-brand-50/50 space-y-2">
                                                    <div className="flex items-center gap-1.5">
                                                        <input
                                                            type="text"
                                                            maxLength={100}
                                                            autoFocus
                                                            value={editingKategoriName}
                                                            onChange={(e) => {
                                                                setEditKategoriError('');
                                                                setEditingKategoriName(e.target.value);
                                                            }}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    e.preventDefault();
                                                                    handleSaveEditKategori(kat);
                                                                }
                                                            }}
                                                            aria-label={`Ubah nama kategori ${kat.nama_kategori}`}
                                                            className="flex-1 h-8 px-2.5 text-sm rounded-md border border-stroke-input bg-surface-primary text-content-primary focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
                                                        />
                                                        <CmsButton
                                                            hierarchy="tertiary"
                                                            size="sm"
                                                            disabled={updatingKategori}
                                                            onClick={cancelEditKategori}
                                                            title="Batal"
                                                            aria-label="Batalkan ubah nama"
                                                        >
                                                            Batal
                                                        </CmsButton>
                                                        <CmsButton
                                                            hierarchy="primary"
                                                            size="sm"
                                                            prefixIcon={<IconCheck size={14} />}
                                                            loading={updatingKategori}
                                                            onClick={() => handleSaveEditKategori(kat)}
                                                            title="Simpan nama"
                                                            aria-label="Simpan nama kategori"
                                                        >
                                                            Simpan
                                                        </CmsButton>
                                                    </div>
                                                    {editKategoriError && (
                                                        <p className="text-xs font-medium text-content-negative">
                                                            {editKategoriError}
                                                        </p>
                                                    )}
                                                </div>
                                            );
                                        }

                                        return (
                                            <div
                                                key={kat.id}
                                                className="px-3.5 py-3 flex items-center justify-between gap-2 hover:bg-brand-50/40 transition-colors"
                                            >
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <span className="text-sm font-semibold text-content-primary truncate">
                                                        {kat.nama_kategori}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => filterByKategoriFromDrawer(kat.id)}
                                                        title="Tampilkan karya dalam kategori ini"
                                                        className={`text-xs px-2.5 py-0.5 rounded-full ${KATEGORI_BADGE_INTERACTIVE} shrink-0`}
                                                    >
                                                        {kat.tefa_karyas_count} karya
                                                    </button>
                                                </div>

                                                <div className="flex items-center gap-1 shrink-0">
                                                    <CmsButton
                                                        hierarchy="tertiary"
                                                        tone="warning"
                                                        size="icon-sm"
                                                        onClick={() => startEditKategori(kat)}
                                                        title="Ubah nama kategori"
                                                        aria-label={`Ubah nama kategori ${kat.nama_kategori}`}
                                                        prefixIcon={<IconEdit size={15} />}
                                                    />

                                                    {inUse ? (
                                                        <span className="text-xs px-2 py-0.5 rounded-full bg-surface-secondary text-content-tertiary border border-stroke-card select-none">
                                                            Digunakan
                                                        </span>
                                                    ) : (
                                                        <CmsButton
                                                            hierarchy="tertiary"
                                                            tone="danger"
                                                            size="icon-sm"
                                                            onClick={() => setDeleteKategoriTarget(kat)}
                                                            title="Hapus kategori"
                                                            aria-label={`Hapus kategori ${kat.nama_kategori}`}
                                                            prefixIcon={<IconTrash size={15} />}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        <div className="px-5 py-3.5 border-t border-stroke-card bg-surface-primary text-xs text-content-secondary leading-relaxed shrink-0">
                            Kategori yang masih digunakan karya tidak dapat dihapus, tetapi namanya tetap bisa diubah. Klik jumlah karya untuk menyaring daftar.
                        </div>
                    </aside>
                </div>,
                document.body
            )}

            {/* Modal Pratinjau Kartu & Detail Karya (Hi-Fi IDDS) */}
            {previewKaryaTarget && createPortal(
                <div
                    className="fixed inset-0 z-[70] flex items-center justify-center bg-brand-900/40 backdrop-blur-[1.5px] p-4"
                    onClick={() => setPreviewKaryaTarget(null)}
                >
                    <div
                        className="w-full max-w-lg bg-surface-primary border border-stroke-card rounded-xl shadow-xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="modal-preview-karya-title"
                    >
                        <div className="px-5 py-3.5 border-b border-stroke-card flex items-center justify-between">
                            <h3 id="modal-preview-karya-title" className="text-base sm:text-lg font-bold text-content-primary">
                                Pratinjau Karya Siswa
                            </h3>
                            <CmsButton
                                hierarchy="tertiary"
                                size="icon-sm"
                                onClick={() => setPreviewKaryaTarget(null)}
                                aria-label="Tutup pratinjau"
                                prefixIcon={<IconX size={16} />}
                            />
                        </div>

                        <div className="p-5 space-y-4">
                            <KaryaThumbnail
                                src={previewKaryaTarget.foto_karya}
                                alt={previewKaryaTarget.judul_karya}
                                className="w-full aspect-video rounded-md"
                            />

                            <div className="space-y-2">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <span className={`text-xs px-2.5 py-0.5 rounded-full ${KATEGORI_BADGE_BASE}`}>
                                        {previewKaryaTarget.kategori_karya?.nama_kategori || '-'}
                                    </span>
                                    <span className="text-xs font-medium text-content-tertiary">
                                        Urutan #{previewKaryaTarget.urutan_tampil} •{' '}
                                        <span className={previewKaryaTarget.status_publikasi ? 'text-content-positive font-semibold' : 'text-content-tertiary'}>
                                            {previewKaryaTarget.status_publikasi ? 'Tayang Publik' : 'Draft Internal'}
                                        </span>
                                    </span>
                                </div>
                                <h4 className="text-base sm:text-lg font-bold text-content-primary">
                                    {previewKaryaTarget.judul_karya}
                                </h4>
                                <p className="text-sm text-content-secondary leading-relaxed whitespace-pre-line">
                                    {previewKaryaTarget.deskripsi_karya}
                                </p>
                            </div>

                            <div className="pt-3 border-t border-stroke-card flex items-center justify-end gap-2">
                                <CmsButton
                                    hierarchy="secondary"
                                    size="sm"
                                    onClick={() => setPreviewKaryaTarget(null)}
                                >
                                    Tutup
                                </CmsButton>
                                <CmsButton
                                    hierarchy="primary"
                                    size="sm"
                                    prefixIcon={<IconEdit size={14} />}
                                    onClick={() => {
                                        const target = previewKaryaTarget;
                                        setPreviewKaryaTarget(null);
                                        openEditDrawer(target);
                                    }}
                                >
                                    Edit Karya
                                </CmsButton>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Modal Konfirmasi Hapus Karya */}
            {deleteKaryaTarget && createPortal(
                <div
                    className="fixed inset-0 z-[80] flex items-center justify-center bg-brand-900/40 backdrop-blur-[1.5px] p-4"
                    onClick={() => !deletingKarya && setDeleteKaryaTarget(null)}
                >
                    <div
                        className="w-full max-w-sm bg-surface-primary border border-stroke-card rounded-xl shadow-xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="modal-hapus-karya-title"
                    >
                        <div className="px-5 py-3.5 border-b border-stroke-card">
                            <h3 id="modal-hapus-karya-title" className="text-base font-bold text-content-primary">
                                Hapus Karya Siswa?
                            </h3>
                        </div>

                        <div className="p-5 space-y-4">
                            <p className="text-sm text-content-secondary leading-relaxed">
                                Karya{' '}
                                <span className="font-semibold text-content-primary">
                                    "{deleteKaryaTarget.judul_karya}"
                                </span>{' '}
                                beserta foto dokumentasinya akan dihapus permanen dan tidak dapat dipulihkan.
                            </p>

                            <div className="pt-3 border-t border-stroke-card flex items-center justify-end gap-2">
                                <CmsButton
                                    hierarchy="secondary"
                                    size="sm"
                                    disabled={deletingKarya}
                                    onClick={() => setDeleteKaryaTarget(null)}
                                >
                                    Batal
                                </CmsButton>
                                <CmsButton
                                    hierarchy="primary"
                                    tone="danger"
                                    size="sm"
                                    loading={deletingKarya}
                                    onClick={confirmDeleteKarya}
                                >
                                    {deletingKarya ? 'Menghapus...' : 'Hapus Karya'}
                                </CmsButton>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Modal Konfirmasi Hapus Kategori */}
            {deleteKategoriTarget && createPortal(
                <div
                    className="fixed inset-0 z-[80] flex items-center justify-center bg-brand-900/40 backdrop-blur-[1.5px] p-4"
                    onClick={() => !deletingKategori && setDeleteKategoriTarget(null)}
                >
                    <div
                        className="w-full max-w-sm bg-surface-primary border border-stroke-card rounded-xl shadow-xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="modal-hapus-kategori-title"
                    >
                        <div className="px-5 py-3.5 border-b border-stroke-card">
                            <h3 id="modal-hapus-kategori-title" className="text-base font-bold text-content-primary">
                                Hapus Kategori Karya?
                            </h3>
                        </div>

                        <div className="p-5 space-y-4">
                            <p className="text-sm text-content-secondary leading-relaxed">
                                Kategori{' '}
                                <span className="font-semibold text-content-primary">
                                    "{deleteKategoriTarget.nama_kategori}"
                                </span>{' '}
                                akan dihapus permanen dari daftar kategori karya.
                            </p>

                            <div className="pt-3 border-t border-stroke-card flex items-center justify-end gap-2">
                                <CmsButton
                                    hierarchy="secondary"
                                    size="sm"
                                    disabled={deletingKategori}
                                    onClick={() => setDeleteKategoriTarget(null)}
                                >
                                    Batal
                                </CmsButton>
                                <CmsButton
                                    hierarchy="primary"
                                    tone="danger"
                                    size="sm"
                                    loading={deletingKategori}
                                    onClick={confirmDeleteKategori}
                                >
                                    {deletingKategori ? 'Menghapus...' : 'Hapus Kategori'}
                                </CmsButton>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </AdminLayout>
    );
}
