import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { router, useForm } from '@inertiajs/react';
import {
    IconAlertCircle,
    IconArrowDown,
    IconArrowRight,
    IconArrowUp,
    IconChevronDown,
    IconChevronUp,
    IconDeviceDesktop,
    IconDeviceMobile,
    IconEdit,
    IconEye,
    IconPencil,
    IconPhoto,
    IconPlus,
    IconTrash,
    IconUpload,
    IconX,
} from '@tabler/icons-react';
import AdminLayout from '@/Layouts/AdminLayout';
import CmsButton from '@/Components/Admin/CmsButton';

const MAX_LAYANAN = 20;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_BYTES = 3 * 1024 * 1024;

/**
 * Halaman Profil Bengkel TEFA — Versi Lo-Fi Monokrom
 * - Mode Switcher: Mode Edit ↔ Pratinjau Publik 1:1 (Desktop / Mobile)
 * - Simpan mandiri per seksi (Header, Profil Unit, Katalog Layanan)
 * - Tambah / Edit Layanan via Slide-Over Panel Samping + Pratinjau Mini
 */
export default function TefaBengkelIndex({ title, bengkel, header }) {
    // 1. Mode Halaman & Preview
    const [pageMode, setPageMode] = useState('edit'); // 'edit' | 'preview'
    const [previewDevice, setPreviewDevice] = useState('desktop'); // 'desktop' | 'mobile'

    const hasInitialHeader = Boolean(header?.judul_header?.trim());
    const [headerOpen, setHeaderOpen] = useState(!hasInitialHeader);

    // Slide-Over Katalog Layanan & Modal Hapus
    const [layananDrawerOpen, setLayananDrawerOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [layananDraft, setLayananDraft] = useState({
        nama_layanan: '',
        deskripsi_layanan: '',
    });
    const [layananClientError, setLayananClientError] = useState('');
    const [savingLayanan, setSavingLayanan] = useState(false);
    const [reorderingLayanan, setReorderingLayanan] = useState(false);
    const [deleteIndexTarget, setDeleteIndexTarget] = useState(null);

    // Upload Foto Bengkel
    const fileInputRef = useRef(null);
    const [photoClientError, setPhotoClientError] = useState('');
    const [previewUrl, setPreviewUrl] = useState(bengkel?.foto_bengkel || '');
    const [isDraggingPhoto, setIsDraggingPhoto] = useState(false);

    // 2. Form Seksi 1: Header Halaman Publik
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

    // 3. Form Seksi 2: Profil & Operasional Unit Bengkel
    const profilForm = useForm({
        _method: 'put',
        nama_unit_bengkel: bengkel?.nama_unit_bengkel || '',
        jadwal_operasional: bengkel?.jadwal_operasional || '',
        deskripsi_bengkel: bengkel?.deskripsi_bengkel || '',
        foto_bengkel: null,
    });

    const isProfilDirty = useMemo(
        () =>
            profilForm.data.nama_unit_bengkel !== (bengkel?.nama_unit_bengkel || '') ||
            profilForm.data.jadwal_operasional !== (bengkel?.jadwal_operasional || '') ||
            profilForm.data.deskripsi_bengkel !== (bengkel?.deskripsi_bengkel || '') ||
            Boolean(profilForm.data.foto_bengkel),
        [profilForm.data, bengkel]
    );

    const hasUnsavedChanges = isHeaderDirty || isProfilDirty;

    useEffect(() => {
        if (!profilForm.data.foto_bengkel) {
            setPreviewUrl(bengkel?.foto_bengkel || '');
            return undefined;
        }
        const objectUrl = URL.createObjectURL(profilForm.data.foto_bengkel);
        setPreviewUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [profilForm.data.foto_bengkel, bengkel?.foto_bengkel]);

    useEffect(() => {
        const hasOverlay = layananDrawerOpen || deleteIndexTarget !== null;
        document.body.style.overflow = hasOverlay ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [layananDrawerOpen, deleteIndexTarget]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key !== 'Escape') {
                return;
            }
            if (deleteIndexTarget !== null && !savingLayanan) {
                setDeleteIndexTarget(null);
                return;
            }
            if (layananDrawerOpen && !savingLayanan) {
                closeLayananDrawer();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [layananDrawerOpen, deleteIndexTarget, savingLayanan]);

    const daftarLayanan = Array.isArray(bengkel?.daftar_layanan)
        ? bengkel.daftar_layanan
        : [];

    // 4. Handler Header
    const handleSaveHeader = (e) => {
        e.preventDefault();
        headerForm.put('/admin/tefa-bengkel/header', {
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

    // 5. Handler Profil Unit
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
        profilForm.setData('foto_bengkel', file);
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
        profilForm.setData('foto_bengkel', null);
    };

    const handleSaveProfil = (e) => {
        e.preventDefault();
        profilForm.post('/admin/tefa-bengkel/profil', {
            forceFormData: true,
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                profilForm.setData('foto_bengkel', null);
            },
        });
    };

    const handleResetProfil = () => {
        profilForm.clearErrors();
        setPhotoClientError('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        profilForm.setData({
            _method: 'put',
            nama_unit_bengkel: bengkel?.nama_unit_bengkel || '',
            jadwal_operasional: bengkel?.jadwal_operasional || '',
            deskripsi_bengkel: bengkel?.deskripsi_bengkel || '',
            foto_bengkel: null,
        });
    };

    // 6. Handler Katalog Layanan
    const openCreateLayanan = () => {
        if (daftarLayanan.length >= MAX_LAYANAN) {
            return;
        }
        setEditingIndex(null);
        setLayananDraft({ nama_layanan: '', deskripsi_layanan: '' });
        setLayananClientError('');
        setLayananDrawerOpen(true);
    };

    const openEditLayanan = (index) => {
        const target = daftarLayanan[index];
        if (!target) {
            return;
        }
        setEditingIndex(index);
        setLayananDraft({
            nama_layanan: target.nama_layanan || '',
            deskripsi_layanan: target.deskripsi_layanan || '',
        });
        setLayananClientError('');
        setLayananDrawerOpen(true);
    };

    const closeLayananDrawer = () => {
        setLayananDrawerOpen(false);
        setEditingIndex(null);
        setLayananDraft({ nama_layanan: '', deskripsi_layanan: '' });
        setLayananClientError('');
    };

    const persistLayananList = (nextList, onSuccessCallback, { isReorder = false } = {}) => {
        setSavingLayanan(true);
        if (isReorder) {
            setReorderingLayanan(true);
        }
        router.put(
            '/admin/tefa-bengkel/layanan',
            { daftar_layanan: nextList },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    onSuccessCallback?.();
                },
                onError: (errs) => {
                    const firstErr = Object.values(errs)[0];
                    if (firstErr) {
                        setLayananClientError(String(firstErr));
                    }
                },
                onFinish: () => {
                    setSavingLayanan(false);
                    setReorderingLayanan(false);
                },
            }
        );
    };

    const handleSubmitLayananDrawer = (e) => {
        e.preventDefault();
        const trimmedName = layananDraft.nama_layanan.trim();
        const trimmedDesc = layananDraft.deskripsi_layanan.trim();

        if (!trimmedName) {
            setLayananClientError('Nama layanan wajib diisi.');
            return;
        }
        if (trimmedName.length > 100) {
            setLayananClientError('Nama layanan maksimal 100 karakter.');
            return;
        }
        if (trimmedDesc.length > 500) {
            setLayananClientError('Deskripsi layanan maksimal 500 karakter.');
            return;
        }

        const nextList = [...daftarLayanan];
        const entry = {
            nama_layanan: trimmedName,
            deskripsi_layanan: trimmedDesc,
        };

        if (editingIndex !== null && editingIndex >= 0 && editingIndex < nextList.length) {
            nextList[editingIndex] = entry;
        } else {
            nextList.push(entry);
        }

        persistLayananList(nextList, closeLayananDrawer);
    };

    const handleConfirmDeleteLayanan = () => {
        if (deleteIndexTarget === null || savingLayanan) {
            return;
        }
        const nextList = daftarLayanan.filter((_, idx) => idx !== deleteIndexTarget);
        persistLayananList(nextList, () => setDeleteIndexTarget(null));
    };

    const handleMoveLayanan = (index, direction) => {
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= daftarLayanan.length || savingLayanan) {
            return;
        }
        const nextList = [...daftarLayanan];
        const [moved] = nextList.splice(index, 1);
        nextList.splice(targetIndex, 0, moved);
        persistLayananList(nextList, undefined, { isReorder: true });
    };

    return (
        <AdminLayout
            title={title || 'Profil Bengkel TEFA'}
            subtitle="Atur profil unit bengkel dan daftar layanan servis yang tampil pada portal publik sekolah."
            headerActions={
                <div className="inline-flex rounded-lg border border-stroke-card p-1 bg-surface-secondary">
                    <button
                        type="button"
                        onClick={() => setPageMode('edit')}
                        className={`inline-flex items-center gap-1.5 h-8 px-3 text-xs sm:text-sm rounded-md transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/25 ${
                            pageMode === 'edit'
                                ? 'bg-surface-primary border border-brand-200 shadow-xs text-brand-600 font-semibold'
                                : 'text-content-secondary hover:text-content-primary font-medium'
                        }`}
                    >
                        <IconPencil size={15} className={pageMode === 'edit' ? 'text-brand-500' : 'text-content-warning'} />
                        <span>Mode Edit</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setPageMode('preview')}
                        className={`inline-flex items-center gap-1.5 h-8 px-3 text-xs sm:text-sm rounded-md transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/25 ${
                            pageMode === 'preview'
                                ? 'bg-surface-primary border border-brand-200 shadow-xs text-brand-600 font-semibold'
                                : 'text-content-secondary hover:text-content-primary font-medium'
                        }`}
                    >
                        <IconEye size={15} className="text-brand-500" />
                        <span>Pratinjau Publik</span>
                    </button>
                </div>
            }
        >
            {pageMode === 'edit' ? (
                <div className="space-y-5 text-content-primary">
                    {/* CARD 1: Header Halaman Publik TEFA (Collapsible & Mandiri) */}
                    <section className="bg-surface-primary border border-stroke-card rounded-xl shadow-admin-card overflow-hidden">
                        <div
                            className={`px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 ${
                                headerOpen ? 'border-b border-stroke-card' : ''
                            }`}
                        >
                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h2 className="text-base font-bold text-content-primary">
                                        Header Halaman Publik TEFA
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
                                        Judul utama dan paragraf pengantar terpusat di atas halaman publik TEFA.
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
                            <form onSubmit={handleSaveHeader} noValidate className="p-5 space-y-4">
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label
                                                htmlFor="judul_header"
                                                className="block text-sm font-medium text-content-primary"
                                            >
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
                                            placeholder="Contoh: Mengenal TEFA (Teaching Factory)"
                                            className={`w-full h-10 px-3 text-sm rounded-md border bg-surface-primary text-content-primary placeholder:text-content-disabled shadow-xs transition focus:outline-none ${
                                                headerForm.errors.judul_header
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
                                                htmlFor="subjudul_header"
                                                className="block text-sm font-medium text-content-primary"
                                            >
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
                                            placeholder="Ringkasan pengantar Teaching Factory di bawah judul utama..."
                                            className={`w-full p-3 text-sm rounded-md border bg-surface-primary text-content-primary placeholder:text-content-disabled shadow-xs transition focus:outline-none ${
                                                headerForm.errors.subjudul_header
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

                    {/* CARD 2: Identitas & Operasional Unit Bengkel */}
                    <section className="bg-surface-primary border border-stroke-card rounded-xl shadow-admin-card overflow-hidden">
                        <div className="px-5 py-3.5 border-b border-stroke-card flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h2 className="text-base font-bold text-content-primary">
                                    Identitas &amp; Operasional Unit Bengkel
                                </h2>
                                <p className="text-xs text-content-secondary mt-0.5">
                                    Informasi unit bengkel dan foto portrait yang tampil berdampingan di halaman publik.
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSaveProfil} noValidate>
                            <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                                <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <div className="flex items-center justify-between mb-1.5">
                                                <label
                                                    htmlFor="nama_unit_bengkel"
                                                    className="block text-sm font-medium text-content-primary"
                                                >
                                                    Nama Unit Bengkel <span className="text-content-negative">*</span>
                                                </label>
                                                <span className="text-xs text-content-tertiary">
                                                    {profilForm.data.nama_unit_bengkel.length}/200
                                                </span>
                                            </div>
                                            <input
                                                id="nama_unit_bengkel"
                                                type="text"
                                                maxLength={200}
                                                value={profilForm.data.nama_unit_bengkel}
                                                onChange={(e) => profilForm.setData('nama_unit_bengkel', e.target.value)}
                                                placeholder="Contoh: TEFA Automotive Service"
                                                className={`w-full h-10 px-3 text-sm rounded-md border bg-surface-primary text-content-primary placeholder:text-content-disabled shadow-xs transition focus:outline-none ${
                                                    profilForm.errors.nama_unit_bengkel
                                                        ? 'border-negative-600 focus:border-negative-600 focus:ring-2 focus:ring-negative-500/15'
                                                        : 'border-stroke-input focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15'
                                                }`}
                                            />
                                            {profilForm.errors.nama_unit_bengkel && (
                                                <p className="mt-1 text-xs font-medium text-content-negative">
                                                    {profilForm.errors.nama_unit_bengkel}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <div className="flex items-center justify-between mb-1.5">
                                                <label
                                                    htmlFor="jadwal_operasional"
                                                    className="block text-sm font-medium text-content-primary"
                                                >
                                                    Jadwal Operasional <span className="text-content-negative">*</span>
                                                </label>
                                                <span className="text-xs text-content-tertiary">
                                                    {profilForm.data.jadwal_operasional.length}/200
                                                </span>
                                            </div>
                                            <input
                                                id="jadwal_operasional"
                                                type="text"
                                                maxLength={200}
                                                value={profilForm.data.jadwal_operasional}
                                                onChange={(e) => profilForm.setData('jadwal_operasional', e.target.value)}
                                                placeholder="Contoh: Senin – Sabtu, 08.00 – 15.00 WIB"
                                                className={`w-full h-10 px-3 text-sm rounded-md border bg-surface-primary text-content-primary placeholder:text-content-disabled shadow-xs transition focus:outline-none ${
                                                    profilForm.errors.jadwal_operasional
                                                        ? 'border-negative-600 focus:border-negative-600 focus:ring-2 focus:ring-negative-500/15'
                                                        : 'border-stroke-input focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15'
                                                }`}
                                            />
                                            {profilForm.errors.jadwal_operasional && (
                                                <p className="mt-1 text-xs font-medium text-content-negative">
                                                    {profilForm.errors.jadwal_operasional}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex-1 flex flex-col">
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label
                                                htmlFor="deskripsi_bengkel"
                                                className="block text-sm font-medium text-content-primary"
                                            >
                                                Deskripsi Bengkel <span className="text-content-negative">*</span>
                                            </label>
                                            <span className="text-xs text-content-tertiary">
                                                {profilForm.data.deskripsi_bengkel.length} karakter
                                            </span>
                                        </div>
                                        <textarea
                                            id="deskripsi_bengkel"
                                            rows={7}
                                            maxLength={20000}
                                            value={profilForm.data.deskripsi_bengkel}
                                            onChange={(e) => profilForm.setData('deskripsi_bengkel', e.target.value)}
                                            placeholder="Jelaskan profil unit bengkel, fasilitas praktik siswa, dan standar pengerjaan servis..."
                                            className={`w-full flex-1 p-3 text-sm rounded-md border bg-surface-primary text-content-primary placeholder:text-content-disabled shadow-xs transition focus:outline-none ${
                                                profilForm.errors.deskripsi_bengkel
                                                    ? 'border-negative-600 focus:border-negative-600 focus:ring-2 focus:ring-negative-500/15'
                                                    : 'border-stroke-input focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15'
                                            }`}
                                        />
                                        <p className="mt-1 text-xs text-content-tertiary">
                                            Ideal 150–400 karakter (2–4 kalimat ringkas) agar tampilan kolom kanan tetap seimbang di web publik.
                                        </p>
                                        {profilForm.errors.deskripsi_bengkel && (
                                            <p className="mt-1 text-xs font-medium text-content-negative">
                                                {profilForm.errors.deskripsi_bengkel}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="lg:col-span-4 flex flex-col">
                                    <span className="block text-sm font-medium text-content-primary mb-1.5">
                                        Foto Unit Bengkel (Portrait 3:4)
                                    </span>
                                    <div
                                        onDragOver={(e) => {
                                            e.preventDefault();
                                            setIsDraggingPhoto(true);
                                        }}
                                        onDragLeave={() => setIsDraggingPhoto(false)}
                                        onDrop={handlePhotoDrop}
                                        className={`flex-1 p-5 rounded-lg border border-dashed flex flex-col justify-center items-center text-center transition-colors ${
                                            isDraggingPhoto
                                                ? 'border-brand-500 bg-brand-50'
                                                : 'border-stroke-input bg-surface-primary hover:border-brand-300'
                                        }`}
                                    >
                                        {previewUrl ? (
                                            <div className="w-full space-y-3">
                                                <div className="w-full max-w-[170px] mx-auto aspect-[3/4] rounded-md border border-stroke-card bg-surface-secondary overflow-hidden">
                                                    <img
                                                        src={previewUrl}
                                                        alt="Pratinjau foto bengkel"
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

                                                    {profilForm.data.foto_bengkel && (
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
                                            id="foto_bengkel"
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            onChange={handleFileSelect}
                                            className="hidden"
                                        />

                                        <p className="mt-3 text-xs text-content-tertiary">
                                            Rasio portrait 3:4 · JPG, PNG, WebP · Maks. 3 MB
                                        </p>

                                        {profilForm.data.foto_bengkel && (
                                            <p className="mt-1.5 text-xs font-medium text-brand-600 truncate max-w-full">
                                                Dipilih: {profilForm.data.foto_bengkel.name}
                                            </p>
                                        )}

                                        {(photoClientError || profilForm.errors.foto_bengkel) && (
                                            <p className="mt-1.5 text-xs font-medium text-content-negative">
                                                {photoClientError || profilForm.errors.foto_bengkel}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="px-5 py-3.5 border-t border-stroke-card bg-surface-primary flex flex-wrap items-center justify-end gap-3">
                                <div className="flex flex-wrap items-center gap-3 ml-auto">
                                    {isProfilDirty && (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-warning-100 border border-warning-500/30 text-xs font-medium text-content-warning">
                                            <span className="w-1.5 h-1.5 rounded-full bg-warning-500" />
                                            <span>Perubahan belum disimpan</span>
                                        </span>
                                    )}
                                    <div className="flex flex-wrap items-center gap-2">
                                        {isProfilDirty && (
                                            <CmsButton
                                                hierarchy="tertiary"
                                                size="sm"
                                                onClick={handleResetProfil}
                                                disabled={profilForm.processing}
                                            >
                                                Batalkan Perubahan
                                            </CmsButton>
                                        )}
                                        <CmsButton
                                            type="submit"
                                            hierarchy="primary"
                                            size="md"
                                            loading={profilForm.processing}
                                        >
                                            {profilForm.processing ? 'Menyimpan...' : 'Simpan Profil Unit'}
                                        </CmsButton>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </section>

                    {/* CARD 3: Katalog Layanan Servis Bengkel */}
                    <section className="bg-surface-primary border border-stroke-card rounded-xl shadow-admin-card overflow-hidden">
                        <div className="px-5 py-3.5 border-b border-stroke-card flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h2 className="text-base font-bold text-content-primary">
                                        Katalog Layanan Servis Bengkel
                                    </h2>
                                    <span className="text-xs px-2.5 py-0.5 rounded-full border border-brand-500/20 bg-brand-500/10 text-brand-600 font-semibold">
                                        {daftarLayanan.length} / {MAX_LAYANAN}
                                    </span>
                                    {reorderingLayanan && (
                                        <span className="text-xs text-brand-600 font-medium">
                                            Menyimpan urutan...
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-content-secondary mt-0.5">
                                    Kelola daftar layanan bengkel lewat panel samping dan atur urutan tampilnya.
                                </p>
                            </div>

                            <CmsButton
                                hierarchy="primary"
                                size="md"
                                prefixIcon={<IconPlus size={16} />}
                                onClick={openCreateLayanan}
                                disabled={daftarLayanan.length >= MAX_LAYANAN || savingLayanan}
                            >
                                Tambah Layanan
                            </CmsButton>
                        </div>

                        {daftarLayanan.length === 0 ? (
                            <div className="p-10 text-center flex flex-col items-center space-y-2.5">
                                <p className="text-base font-semibold text-content-primary">
                                    Belum ada layanan servis
                                </p>
                                <p className="text-sm text-content-secondary max-w-md leading-relaxed">
                                    Tambahkan daftar layanan perawatan atau perbaikan sepeda motor agar tampil di halaman publik TEFA.
                                </p>
                                <div className="pt-1">
                                    <CmsButton
                                        hierarchy="secondary"
                                        size="sm"
                                        prefixIcon={<IconPlus size={14} className="text-brand-500" />}
                                        onClick={openCreateLayanan}
                                    >
                                        Tambah Layanan Pertama
                                    </CmsButton>
                                </div>
                            </div>
                        ) : (
                            <div className="divide-y divide-stroke-card">
                                {daftarLayanan.map((item, idx) => (
                                    <div
                                        key={`${idx}-${item.nama_layanan}`}
                                        className="px-5 py-3.5 flex items-start justify-between gap-4 hover:bg-brand-50/50 transition-colors"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-brand-500">#{idx + 1}</span>
                                                <h3 className="text-sm font-semibold text-content-primary truncate">
                                                    {item.nama_layanan}
                                                </h3>
                                            </div>
                                            <p className="text-xs text-content-secondary mt-0.5 line-clamp-2 leading-relaxed">
                                                {item.deskripsi_layanan || 'Belum ada deskripsi singkat.'}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-1 shrink-0">
                                            <CmsButton
                                                hierarchy="tertiary"
                                                tone="brand"
                                                size="icon-sm"
                                                disabled={idx === 0 || savingLayanan}
                                                onClick={() => handleMoveLayanan(idx, -1)}
                                                title="Pindah ke atas"
                                                aria-label={`Pindah layanan ${item.nama_layanan} ke atas`}
                                                prefixIcon={<IconArrowUp size={15} />}
                                            />
                                            <CmsButton
                                                hierarchy="tertiary"
                                                tone="brand"
                                                size="icon-sm"
                                                disabled={idx === daftarLayanan.length - 1 || savingLayanan}
                                                onClick={() => handleMoveLayanan(idx, 1)}
                                                title="Pindah ke bawah"
                                                aria-label={`Pindah layanan ${item.nama_layanan} ke bawah`}
                                                prefixIcon={<IconArrowDown size={15} />}
                                            />
                                            <CmsButton
                                                hierarchy="tertiary"
                                                tone="warning"
                                                size="icon-sm"
                                                disabled={savingLayanan}
                                                onClick={() => openEditLayanan(idx)}
                                                title="Edit layanan"
                                                aria-label={`Edit layanan ${item.nama_layanan}`}
                                                prefixIcon={<IconEdit size={15} />}
                                            />
                                            <CmsButton
                                                hierarchy="tertiary"
                                                tone="danger"
                                                size="icon-sm"
                                                disabled={savingLayanan}
                                                onClick={() => setDeleteIndexTarget(idx)}
                                                title="Hapus layanan"
                                                aria-label={`Hapus layanan ${item.nama_layanan}`}
                                                prefixIcon={<IconTrash size={15} />}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            ) : (
                /* MODE PRATINJAU 1:1 HALAMAN PUBLIK (HI-FI IDDS) */
                <div className="space-y-4 text-content-primary">
                    {/* Bar Kontrol Pratinjau */}
                    <div className="bg-surface-primary border border-stroke-card rounded-xl shadow-xs px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-xs">
                            <span className="w-2 h-2 rounded-full bg-brand-500" />
                            <span className="font-semibold text-content-primary">Simulasi 1:1 Halaman Publik TEFA</span>
                            <span className="text-content-tertiary hidden sm:inline">
                                • Menggunakan input aktif dari Mode Edit
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="inline-flex rounded-md border border-stroke-card p-0.5 bg-surface-secondary">
                                <button
                                    type="button"
                                    onClick={() => setPreviewDevice('desktop')}
                                    className={`inline-flex items-center gap-1.5 h-8 px-3 text-xs rounded transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/25 ${
                                        previewDevice === 'desktop'
                                            ? 'bg-surface-primary border border-brand-200 text-brand-600 font-semibold shadow-xs'
                                            : 'text-content-secondary hover:text-content-primary font-medium'
                                    }`}
                                >
                                    <IconDeviceDesktop size={14} />
                                    <span>Desktop</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPreviewDevice('mobile')}
                                    className={`inline-flex items-center gap-1.5 h-8 px-3 text-xs rounded transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/25 ${
                                        previewDevice === 'mobile'
                                            ? 'bg-surface-primary border border-brand-200 text-brand-600 font-semibold shadow-xs'
                                            : 'text-content-secondary hover:text-content-primary font-medium'
                                    }`}
                                >
                                    <IconDeviceMobile size={14} />
                                    <span>Mobile</span>
                                </button>
                            </div>

                            <CmsButton
                                hierarchy="secondary"
                                size="sm"
                                onClick={() => setPageMode('edit')}
                            >
                                ← Kembali Edit
                            </CmsButton>
                        </div>
                    </div>

                    {/* Peringatan jika ada perubahan yang belum disimpan */}
                    {hasUnsavedChanges && (
                        <div className="bg-warning-100 border border-warning-500/40 rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
                            <div className="flex items-center gap-2 text-content-warning">
                                <IconAlertCircle size={15} className="shrink-0" />
                                <span>
                                    Pratinjau ini menampilkan{' '}
                                    <strong>perubahan yang belum disimpan</strong> ke database.
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setPageMode('edit')}
                                className="font-semibold underline text-content-warning hover:opacity-80"
                            >
                                Kembali ke Mode Edit untuk Simpan
                            </button>
                        </div>
                    )}

                    {/* Kanvas Pratinjau */}
                    <div className="bg-surface-secondary border border-stroke-card rounded-xl p-3 sm:p-6 flex justify-center">
                        <div
                            className={`w-full bg-surface-primary border border-stroke-card rounded-xl shadow-admin-card overflow-hidden transition-all duration-200 ${
                                previewDevice === 'mobile' ? 'max-w-[390px]' : ''
                            }`}
                        >
                            {/* Simulasi Navbar Web Publik */}
                            <div className="px-5 sm:px-8 py-3.5 border-b border-stroke-shell flex items-center justify-between gap-4">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded-full border border-brand-200 bg-brand-50 text-brand-600 flex items-center justify-center text-xs font-bold">
                                        P
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold leading-tight text-content-primary">SMK PGRI Gumelar</div>
                                        <div className="text-[11px] text-content-tertiary leading-tight hidden sm:block">
                                            YPLP DM PGRI JT Cabang Banyumas
                                        </div>
                                    </div>
                                </div>

                                {previewDevice === 'desktop' && (
                                    <div className="hidden md:flex items-center gap-4 text-xs text-content-secondary">
                                        <span>Beranda</span>
                                        <span>Profile</span>
                                        <span>PPDB</span>
                                        <span>Akademik</span>
                                        <span className="font-semibold text-brand-600 underline decoration-brand-500 underline-offset-4">
                                            TEFA &amp; Karya
                                        </span>
                                        <span>Karier &amp; Alumni</span>
                                    </div>
                                )}

                                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-brand-500 text-white shadow-xs">
                                    <span>Daftar</span>
                                    <IconArrowRight size={12} />
                                </span>
                            </div>

                            {/* Simulasi Konten Halaman Publik TEFA */}
                            <div className="px-5 sm:px-10 py-8 sm:py-10 space-y-8">
                                <div className="max-w-2xl mx-auto text-center space-y-2.5">
                                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-content-primary">
                                        {headerForm.data.judul_header || 'Judul Header Belum Diisi'}
                                    </h2>
                                    <p className="text-xs sm:text-sm text-content-secondary leading-relaxed whitespace-pre-line">
                                        {headerForm.data.subjudul_header || 'Subjudul pengantar halaman TEFA belum diisi.'}
                                    </p>
                                </div>

                                <div
                                    className={`grid gap-7 items-start ${
                                        previewDevice === 'mobile'
                                            ? 'grid-cols-1'
                                            : 'grid-cols-1 md:grid-cols-12'
                                    }`}
                                >
                                    <div className={previewDevice === 'mobile' ? '' : 'md:col-span-5'}>
                                        <div className="w-full aspect-[3/4] rounded-2xl border border-stroke-card bg-surface-secondary overflow-hidden flex items-center justify-center">
                                            {previewUrl ? (
                                                <img
                                                    src={previewUrl}
                                                    alt={profilForm.data.nama_unit_bengkel || 'Foto Bengkel TEFA'}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center gap-1.5 text-content-disabled px-6 text-center">
                                                    <IconPhoto size={28} stroke={1.5} />
                                                    <span className="text-xs font-semibold">Foto Bengkel TEFA</span>
                                                    <span className="text-xs">(Portrait 3:4)</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className={`${previewDevice === 'mobile' ? '' : 'md:col-span-7'} space-y-5`}>
                                        <div className="space-y-2">
                                            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-content-primary">
                                                {profilForm.data.nama_unit_bengkel || 'Nama Unit Bengkel Belum Diisi'}
                                            </h3>
                                            <p className="text-xs sm:text-sm text-content-secondary leading-relaxed whitespace-pre-line">
                                                {profilForm.data.deskripsi_bengkel || 'Deskripsi bengkel belum diisi.'}
                                            </p>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="text-xs font-bold text-content-primary">
                                                Daftar Layanan:
                                            </div>

                                            {daftarLayanan.length > 0 ? (
                                                <div className="space-y-3">
                                                    {daftarLayanan.map((item, idx) => (
                                                        <div key={idx} className="flex items-start gap-3">
                                                            <div className="w-8 h-8 rounded-full border border-brand-200 bg-brand-100 flex items-center justify-center shrink-0 text-xs font-bold text-brand-600">
                                                                {idx + 1}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <div className="text-xs sm:text-sm font-bold text-content-primary">
                                                                    {item.nama_layanan}
                                                                </div>
                                                                {item.deskripsi_layanan && (
                                                                    <p className="text-xs text-content-secondary leading-relaxed mt-0.5">
                                                                        {item.deskripsi_layanan}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-xs text-content-tertiary italic">
                                                    Belum ada daftar layanan ditambahkan.
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-1 pt-1">
                                            <div className="text-xs font-bold text-content-primary">
                                                Jadwal Operasional:
                                            </div>
                                            <p className="text-xs sm:text-sm text-content-secondary">
                                                {profilForm.data.jadwal_operasional || 'Jadwal operasional belum diisi.'}
                                            </p>
                                        </div>

                                        <div className="pt-1">
                                            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-brand-500 text-white shadow-xs">
                                                <span>Hubungi Kami</span>
                                                <IconArrowRight size={14} />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Slide-Over Drawer: Tambah / Edit Layanan Servis (Portal ke body sesuai standar Overlay IDDN) */}
            {layananDrawerOpen && createPortal(
                <div className="fixed inset-0 z-[60]">
                    <div
                        className="fixed inset-0 bg-brand-900/35 backdrop-blur-[1.5px] transition-opacity"
                        onClick={() => !savingLayanan && closeLayananDrawer()}
                    />
                    <aside
                        className="fixed top-0 right-0 bottom-0 z-[70] w-full max-w-lg bg-surface-primary border-l border-stroke-card shadow-2xl flex flex-col"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="drawer-layanan-title"
                    >
                        <div className="px-5 py-4 border-b border-stroke-card flex items-center justify-between shrink-0">
                            <div>
                                <h3 id="drawer-layanan-title" className="text-base sm:text-lg font-bold text-content-primary">
                                    {editingIndex !== null ? 'Edit Layanan Servis' : 'Tambah Layanan Servis'}
                                </h3>
                                <p className="text-xs text-content-secondary mt-0.5">
                                    Perubahan langsung tersimpan ke katalog bengkel TEFA.
                                </p>
                            </div>
                            <CmsButton
                                hierarchy="tertiary"
                                size="icon-sm"
                                onClick={closeLayananDrawer}
                                disabled={savingLayanan}
                                aria-label="Tutup panel"
                                prefixIcon={<IconX size={16} />}
                            />
                        </div>

                        <form onSubmit={handleSubmitLayananDrawer} noValidate className="flex-1 flex flex-col min-h-0">
                            <div className="p-5 space-y-4 overflow-y-auto flex-1">
                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label
                                            htmlFor="drawer_nama_layanan"
                                            className="block text-sm font-medium text-content-primary"
                                        >
                                            Nama Layanan <span className="text-content-negative">*</span>
                                        </label>
                                        <span className="text-xs text-content-tertiary">
                                            {layananDraft.nama_layanan.length}/100
                                        </span>
                                    </div>
                                    <input
                                        id="drawer_nama_layanan"
                                        type="text"
                                        maxLength={100}
                                        autoFocus
                                        value={layananDraft.nama_layanan}
                                        onChange={(e) => {
                                            setLayananClientError('');
                                            setLayananDraft((prev) => ({
                                                ...prev,
                                                nama_layanan: e.target.value,
                                            }));
                                        }}
                                        placeholder="Contoh: Servis Ringan"
                                        className="w-full h-10 px-3 text-sm rounded-md border border-stroke-input bg-surface-primary text-content-primary placeholder:text-content-disabled shadow-xs transition focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
                                    />
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label
                                            htmlFor="drawer_deskripsi_layanan"
                                            className="block text-sm font-medium text-content-primary"
                                        >
                                            Deskripsi Singkat
                                        </label>
                                        <span className="text-xs text-content-tertiary">
                                            {layananDraft.deskripsi_layanan.length} karakter
                                        </span>
                                    </div>
                                    <textarea
                                        id="drawer_deskripsi_layanan"
                                        rows={4}
                                        maxLength={500}
                                        value={layananDraft.deskripsi_layanan}
                                        onChange={(e) => {
                                            setLayananClientError('');
                                            setLayananDraft((prev) => ({
                                                ...prev,
                                                deskripsi_layanan: e.target.value,
                                            }));
                                        }}
                                        placeholder="Contoh: Pemeriksaan dan perawatan komponen dasar sepeda motor untuk menjaga performa berkendara."
                                        className="w-full p-3 text-sm rounded-md border border-stroke-input bg-surface-primary text-content-primary placeholder:text-content-disabled shadow-xs transition focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
                                    />
                                    <p className="mt-1 text-xs text-content-tertiary">
                                        Panjang ideal 60–160 karakter agar mudah dipindai pengunjung.
                                    </p>
                                </div>

                                {layananClientError && (
                                    <p className="text-xs font-medium text-content-negative">
                                        {layananClientError}
                                    </p>
                                )}

                                {/* Pratinjau Mini Item Layanan */}
                                <div className="pt-2">
                                    <p className="text-xs font-medium text-content-tertiary mb-2">
                                        Pratinjau di halaman publik:
                                    </p>
                                    <div className="p-3.5 rounded-lg border border-stroke-card bg-surface-primary flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full border border-brand-500/20 bg-brand-500/10 flex items-center justify-center shrink-0 text-xs font-bold text-brand-600">
                                            {editingIndex !== null ? editingIndex + 1 : daftarLayanan.length + 1}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-xs sm:text-sm font-bold text-content-primary">
                                                {layananDraft.nama_layanan.trim() || 'Nama Layanan'}
                                            </div>
                                            <p className="text-xs text-content-secondary leading-relaxed mt-0.5">
                                                {layananDraft.deskripsi_layanan.trim() ||
                                                    'Deskripsi singkat cakupan perawatan akan tampil di sini.'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="px-5 py-3.5 border-t border-stroke-card bg-surface-primary flex items-center justify-end gap-2 shrink-0">
                                <CmsButton
                                    hierarchy="secondary"
                                    size="md"
                                    onClick={closeLayananDrawer}
                                    disabled={savingLayanan}
                                >
                                    Batal
                                </CmsButton>
                                <CmsButton
                                    type="submit"
                                    hierarchy="primary"
                                    size="md"
                                    loading={savingLayanan}
                                >
                                    {savingLayanan
                                        ? 'Menyimpan...'
                                        : editingIndex !== null
                                            ? 'Simpan Perubahan'
                                            : 'Tambah Layanan'}
                                </CmsButton>
                            </div>
                        </form>
                    </aside>
                </div>,
                document.body
            )}

            {/* Modal Konfirmasi Hapus Layanan (Hi-Fi IDDS) */}
            {deleteIndexTarget !== null && createPortal(
                <div
                    className="fixed inset-0 z-[80] flex items-center justify-center bg-brand-900/40 backdrop-blur-[1.5px] p-4"
                    onClick={() => !savingLayanan && setDeleteIndexTarget(null)}
                >
                    <div
                        className="w-full max-w-sm bg-surface-primary border border-stroke-card rounded-xl shadow-xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="modal-hapus-layanan-title"
                    >
                        <div className="px-5 py-3.5 border-b border-stroke-card">
                            <h3 id="modal-hapus-layanan-title" className="text-base font-bold text-content-primary">
                                Hapus Layanan Ini?
                            </h3>
                        </div>

                        <div className="p-5 space-y-4">
                            <p className="text-sm text-content-secondary leading-relaxed">
                                Layanan{' '}
                                <span className="font-semibold text-content-primary">
                                    "{daftarLayanan[deleteIndexTarget]?.nama_layanan}"
                                </span>{' '}
                                akan dihapus dari katalog layanan bengkel TEFA.
                            </p>

                            <div className="pt-3 border-t border-stroke-card flex items-center justify-end gap-2">
                                <CmsButton
                                    hierarchy="secondary"
                                    size="sm"
                                    disabled={savingLayanan}
                                    onClick={() => setDeleteIndexTarget(null)}
                                >
                                    Batal
                                </CmsButton>
                                <CmsButton
                                    hierarchy="primary"
                                    tone="danger"
                                    size="sm"
                                    loading={savingLayanan}
                                    onClick={handleConfirmDeleteLayanan}
                                >
                                    {savingLayanan ? 'Menghapus...' : 'Hapus Layanan'}
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
