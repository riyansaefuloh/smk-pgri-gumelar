import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from '@inertiajs/react';
import {
    IconArrowRight,
    IconDeviceDesktop,
    IconDeviceMobile,
    IconEye,
    IconPencil,
    IconPhoto,
    IconSchool,
    IconUpload,
} from '@tabler/icons-react';
import AdminLayout from '@/Layouts/AdminLayout';
import CmsButton from '@/Components/Admin/CmsButton';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_BYTES = 3 * 1024 * 1024;

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

function UnsavedBadge() {
    return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-warning-100 border border-warning-500/30 text-xs font-medium text-content-warning">
            <span className="w-1.5 h-1.5 rounded-full bg-warning-500" />
            <span>Perubahan belum disimpan</span>
        </span>
    );
}

/**
 * Komponen reusable dropzone upload gambar mengikuti standar CMS IDDS.
 */
function ImageDropzoneField({
    id,
    label,
    helperText,
    aspectClass = 'aspect-video',
    previewMaxWidthClass = 'max-w-[320px]',
    previewUrl,
    selectedFile,
    serverError,
    onFileSelect,
    onClearFile,
}) {
    const inputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [clientError, setClientError] = useState('');
    const [imgFailed, setImgFailed] = useState(false);

    useEffect(() => {
        setImgFailed(false);
    }, [previewUrl]);

    const validateAndSelect = (file) => {
        if (!file) {
            return;
        }
        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            setClientError('Format gambar harus JPG, PNG, atau WebP.');
            return;
        }
        if (file.size > MAX_IMAGE_BYTES) {
            setClientError('Ukuran gambar maksimal 3 MB.');
            return;
        }
        setClientError('');
        onFileSelect(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer?.files?.[0];
        validateAndSelect(file);
    };

    const combinedError = clientError || serverError;
    const hasPreview = Boolean(previewUrl) && !imgFailed;

    return (
        <div className="flex flex-col h-full">
            <span className="block text-sm font-medium text-content-primary mb-1.5">
                {label}
            </span>

            <div
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`flex-1 p-5 rounded-lg border border-dashed flex flex-col justify-center items-center text-center transition-colors ${
                    isDragging
                        ? 'border-brand-500 bg-brand-50'
                        : combinedError
                            ? 'border-negative-600 bg-surface-primary'
                            : 'border-stroke-input bg-surface-primary hover:border-brand-300'
                }`}
            >
                {hasPreview ? (
                    <div className="w-full space-y-3">
                        <div className={`w-full ${previewMaxWidthClass} mx-auto ${aspectClass} rounded-md border border-stroke-card bg-surface-secondary overflow-hidden`}>
                            <img
                                src={previewUrl}
                                alt={label}
                                className="w-full h-full object-cover"
                                onError={() => setImgFailed(true)}
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
                                onClick={() => inputRef.current?.click()}
                                className="w-full"
                            >
                                Ganti File
                            </CmsButton>

                            {selectedFile && (
                                <CmsButton
                                    hierarchy="tertiary"
                                    size="sm"
                                    onClick={() => {
                                        setClientError('');
                                        onClearFile();
                                    }}
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
                            onClick={() => inputRef.current?.click()}
                            className="w-full"
                        >
                            Pilih File
                        </CmsButton>
                    </div>
                )}

                <input
                    ref={inputRef}
                    id={id}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => {
                        validateAndSelect(e.target.files?.[0]);
                        e.target.value = '';
                    }}
                />

                {helperText && (
                    <p className="mt-3 text-xs text-content-tertiary">{helperText}</p>
                )}

                {selectedFile && (
                    <p className="mt-1.5 text-xs font-medium text-brand-600 truncate max-w-full">
                        Dipilih: {selectedFile.name}
                    </p>
                )}

                {combinedError && (
                    <p className="mt-1.5 text-xs font-medium text-content-negative">
                        {combinedError}
                    </p>
                )}
            </div>
        </div>
    );
}

/**
 * Halaman Pengelolaan Beranda Website (CMS Profil Sekolah)
 * - Mode Switcher: Mode Edit <-> Pratinjau Publik (Desktop / Mobile)
 * - Simpan mandiri untuk 3 seksi: Hero Banner, Sambutan Kepala Sekolah, Banner Bawah
 */
export default function BerandaIndex({ title, beranda }) {
    const [pageMode, setPageMode] = useState('edit');
    const [previewDevice, setPreviewDevice] = useState('desktop');

    // Seksi 1: Hero Banner Utama
    const heroForm = useForm({
        _method: 'put',
        judul_hero: beranda?.judul_hero || '',
        subjudul_hero: beranda?.subjudul_hero || '',
        gambar_hero: null,
    });

    const isHeroDirty = useMemo(
        () =>
            heroForm.data.judul_hero !== (beranda?.judul_hero || '') ||
            heroForm.data.subjudul_hero !== (beranda?.subjudul_hero || '') ||
            Boolean(heroForm.data.gambar_hero),
        [heroForm.data, beranda]
    );

    const [heroPreviewUrl, setHeroPreviewUrl] = useState(beranda?.gambar_hero || '');
    useEffect(() => {
        if (!heroForm.data.gambar_hero) {
            setHeroPreviewUrl(beranda?.gambar_hero || '');
            return undefined;
        }
        const objectUrl = URL.createObjectURL(heroForm.data.gambar_hero);
        setHeroPreviewUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [heroForm.data.gambar_hero, beranda?.gambar_hero]);

    // Seksi 2: Sambutan Kepala Sekolah
    const sambutanForm = useForm({
        _method: 'put',
        nama_kepala_sekolah: beranda?.nama_kepala_sekolah || '',
        teks_sambutan: beranda?.teks_sambutan || '',
        foto_kepala_sekolah: null,
    });

    const isSambutanDirty = useMemo(
        () =>
            sambutanForm.data.nama_kepala_sekolah !== (beranda?.nama_kepala_sekolah || '') ||
            sambutanForm.data.teks_sambutan !== (beranda?.teks_sambutan || '') ||
            Boolean(sambutanForm.data.foto_kepala_sekolah),
        [sambutanForm.data, beranda]
    );

    const [kepsekPreviewUrl, setKepsekPreviewUrl] = useState(beranda?.foto_kepala_sekolah || '');
    useEffect(() => {
        if (!sambutanForm.data.foto_kepala_sekolah) {
            setKepsekPreviewUrl(beranda?.foto_kepala_sekolah || '');
            return undefined;
        }
        const objectUrl = URL.createObjectURL(sambutanForm.data.foto_kepala_sekolah);
        setKepsekPreviewUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [sambutanForm.data.foto_kepala_sekolah, beranda?.foto_kepala_sekolah]);

    // Seksi 3: Banner Ajakan Bawah
    const bannerForm = useForm({
        _method: 'put',
        judul_banner_bawah: beranda?.judul_banner_bawah || '',
        subjudul_banner_bawah: beranda?.subjudul_banner_bawah || '',
        gambar_banner_bawah: null,
    });

    const isBannerDirty = useMemo(
        () =>
            bannerForm.data.judul_banner_bawah !== (beranda?.judul_banner_bawah || '') ||
            bannerForm.data.subjudul_banner_bawah !== (beranda?.subjudul_banner_bawah || '') ||
            Boolean(bannerForm.data.gambar_banner_bawah),
        [bannerForm.data, beranda]
    );

    const [bannerPreviewUrl, setBannerPreviewUrl] = useState(beranda?.gambar_banner_bawah || '');
    useEffect(() => {
        if (!bannerForm.data.gambar_banner_bawah) {
            setBannerPreviewUrl(beranda?.gambar_banner_bawah || '');
            return undefined;
        }
        const objectUrl = URL.createObjectURL(bannerForm.data.gambar_banner_bawah);
        setBannerPreviewUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [bannerForm.data.gambar_banner_bawah, beranda?.gambar_banner_bawah]);

    const hasUnsavedChanges = isHeroDirty || isSambutanDirty || isBannerDirty;

    const handleSaveHero = (e) => {
        e.preventDefault();
        heroForm.post('/admin/beranda/hero', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: (page) => {
                const updated = page?.props?.beranda;
                heroForm.setData({
                    _method: 'put',
                    judul_hero: updated?.judul_hero ?? heroForm.data.judul_hero.trim(),
                    subjudul_hero: updated?.subjudul_hero ?? heroForm.data.subjudul_hero.trim(),
                    gambar_hero: null,
                });
            },
        });
    };

    const handleResetHero = () => {
        heroForm.setData({
            _method: 'put',
            judul_hero: beranda?.judul_hero || '',
            subjudul_hero: beranda?.subjudul_hero || '',
            gambar_hero: null,
        });
        heroForm.clearErrors();
    };

    const handleSaveSambutan = (e) => {
        e.preventDefault();
        sambutanForm.post('/admin/beranda/sambutan', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: (page) => {
                const updated = page?.props?.beranda;
                sambutanForm.setData({
                    _method: 'put',
                    nama_kepala_sekolah: updated?.nama_kepala_sekolah ?? sambutanForm.data.nama_kepala_sekolah.trim(),
                    teks_sambutan: updated?.teks_sambutan ?? sambutanForm.data.teks_sambutan.trim(),
                    foto_kepala_sekolah: null,
                });
            },
        });
    };

    const handleResetSambutan = () => {
        sambutanForm.setData({
            _method: 'put',
            nama_kepala_sekolah: beranda?.nama_kepala_sekolah || '',
            teks_sambutan: beranda?.teks_sambutan || '',
            foto_kepala_sekolah: null,
        });
        sambutanForm.clearErrors();
    };

    const handleSaveBanner = (e) => {
        e.preventDefault();
        bannerForm.post('/admin/beranda/banner-bawah', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: (page) => {
                const updated = page?.props?.beranda;
                bannerForm.setData({
                    _method: 'put',
                    judul_banner_bawah: updated?.judul_banner_bawah ?? bannerForm.data.judul_banner_bawah.trim(),
                    subjudul_banner_bawah: updated?.subjudul_banner_bawah ?? bannerForm.data.subjudul_banner_bawah.trim(),
                    gambar_banner_bawah: null,
                });
            },
        });
    };

    const handleResetBanner = () => {
        bannerForm.setData({
            _method: 'put',
            judul_banner_bawah: beranda?.judul_banner_bawah || '',
            subjudul_banner_bawah: beranda?.subjudul_banner_bawah || '',
            gambar_banner_bawah: null,
        });
        bannerForm.clearErrors();
    };

    return (
        <AdminLayout
            title={title || 'Beranda Website'}
            subtitle="Kelola konten utama halaman depan website publik: hero banner, sambutan kepala sekolah, dan banner ajakan bawah."
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
            {/* Status Bar Unsaved Changes */}
            {hasUnsavedChanges && (
                <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-xl bg-warning-100 border border-warning-500/30">
                    <UnsavedBadge />
                    <span className="text-xs text-content-warning">
                        Simpan masing-masing seksi yang diubah agar perubahan tampil di portal publik.
                    </span>
                </div>
            )}

            {pageMode === 'edit' ? (
                <div className="space-y-6">
                    {/* SEKSI 1: HERO BANNER UTAMA */}
                    <section className="bg-surface-primary border border-stroke-card rounded-xl shadow-admin-card overflow-hidden">
                        <div className="px-5 py-3.5 border-b border-stroke-card flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h2 className="text-base font-bold text-content-primary">
                                    Hero Banner Utama
                                </h2>
                                <p className="text-xs text-content-secondary mt-0.5">
                                    Bagian paling atas halaman beranda yang pertama kali dilihat pengunjung.
                                </p>
                            </div>
                            {isHeroDirty && <UnsavedBadge />}
                        </div>

                        <form onSubmit={handleSaveHero} noValidate>
                            <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
                                <div className="lg:col-span-7 space-y-4">
                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label htmlFor="judul_hero" className="block text-sm font-medium text-content-primary">
                                                Judul Hero Banner <span className="text-content-negative">*</span>
                                            </label>
                                            <span className="text-xs text-content-tertiary">
                                                {heroForm.data.judul_hero.length}/200
                                            </span>
                                        </div>
                                        <input
                                            id="judul_hero"
                                            type="text"
                                            maxLength={200}
                                            value={heroForm.data.judul_hero}
                                            onChange={(e) => heroForm.setData('judul_hero', e.target.value)}
                                            placeholder="Masukkan judul utama hero banner..."
                                            className={inputClass(Boolean(heroForm.errors.judul_hero))}
                                        />
                                        {heroForm.errors.judul_hero && (
                                            <p className="mt-1 text-xs font-medium text-content-negative">
                                                {heroForm.errors.judul_hero}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label htmlFor="subjudul_hero" className="block text-sm font-medium text-content-primary">
                                                Subjudul Hero Banner <span className="text-content-negative">*</span>
                                            </label>
                                            <span className="text-xs text-content-tertiary">
                                                {heroForm.data.subjudul_hero.length}/1000
                                            </span>
                                        </div>
                                        <textarea
                                            id="subjudul_hero"
                                            rows={5}
                                            maxLength={1000}
                                            value={heroForm.data.subjudul_hero}
                                            onChange={(e) => heroForm.setData('subjudul_hero', e.target.value)}
                                            placeholder="Masukkan deskripsi singkat pengantar di bawah judul hero..."
                                            className={textareaClass(Boolean(heroForm.errors.subjudul_hero))}
                                        />
                                        <p className="mt-1 text-xs text-content-tertiary">
                                            Gunakan 1–2 kalimat ringkas agar tetap proporsional di layar desktop maupun mobile.
                                        </p>
                                        {heroForm.errors.subjudul_hero && (
                                            <p className="mt-1 text-xs font-medium text-content-negative">
                                                {heroForm.errors.subjudul_hero}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="lg:col-span-5">
                                    <ImageDropzoneField
                                        id="gambar_hero"
                                        label="Gambar Latar Hero (16:9)"
                                        helperText="Disarankan gambar lanskap resolusi minimal 1280×720 px."
                                        aspectClass="aspect-video"
                                        previewUrl={heroPreviewUrl}
                                        selectedFile={heroForm.data.gambar_hero}
                                        serverError={heroForm.errors.gambar_hero}
                                        onFileSelect={(file) => heroForm.setData('gambar_hero', file)}
                                        onClearFile={() => heroForm.setData('gambar_hero', null)}
                                    />
                                </div>
                            </div>

                            <div className="px-5 py-3.5 border-t border-stroke-card bg-surface-primary flex flex-wrap items-center justify-end gap-2.5">
                                {isHeroDirty && (
                                    <CmsButton
                                        type="button"
                                        hierarchy="tertiary"
                                        size="md"
                                        disabled={heroForm.processing}
                                        onClick={handleResetHero}
                                    >
                                        Batalkan Perubahan
                                    </CmsButton>
                                )}
                                <CmsButton
                                    type="submit"
                                    hierarchy="primary"
                                    size="md"
                                    loading={heroForm.processing}
                                >
                                    {heroForm.processing ? 'Menyimpan...' : 'Simpan Hero Banner'}
                                </CmsButton>
                            </div>
                        </form>
                    </section>

                    {/* SEKSI 2: SAMBUTAN KEPALA SEKOLAH */}
                    <section className="bg-surface-primary border border-stroke-card rounded-xl shadow-admin-card overflow-hidden">
                        <div className="px-5 py-3.5 border-b border-stroke-card flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h2 className="text-base font-bold text-content-primary">
                                    Sambutan Kepala Sekolah
                                </h2>
                                <p className="text-xs text-content-secondary mt-0.5">
                                    Menampilkan foto profil kepala sekolah beserta pesan sambutan resmi di halaman depan.
                                </p>
                            </div>
                            {isSambutanDirty && <UnsavedBadge />}
                        </div>

                        <form onSubmit={handleSaveSambutan} noValidate>
                            <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
                                <div className="lg:col-span-8 space-y-4">
                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label htmlFor="nama_kepala_sekolah" className="block text-sm font-medium text-content-primary">
                                                Nama Kepala Sekolah &amp; Gelar <span className="text-content-negative">*</span>
                                            </label>
                                            <span className="text-xs text-content-tertiary">
                                                {sambutanForm.data.nama_kepala_sekolah.length}/200
                                            </span>
                                        </div>
                                        <input
                                            id="nama_kepala_sekolah"
                                            type="text"
                                            maxLength={200}
                                            value={sambutanForm.data.nama_kepala_sekolah}
                                            onChange={(e) => sambutanForm.setData('nama_kepala_sekolah', e.target.value)}
                                            placeholder="Masukkan nama lengkap kepala sekolah beserta gelar..."
                                            className={inputClass(Boolean(sambutanForm.errors.nama_kepala_sekolah))}
                                        />
                                        {sambutanForm.errors.nama_kepala_sekolah && (
                                            <p className="mt-1 text-xs font-medium text-content-negative">
                                                {sambutanForm.errors.nama_kepala_sekolah}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label htmlFor="teks_sambutan" className="block text-sm font-medium text-content-primary">
                                                Teks Sambutan <span className="text-content-negative">*</span>
                                            </label>
                                            <span className="text-xs text-content-tertiary">
                                                {sambutanForm.data.teks_sambutan.length}/5000
                                            </span>
                                        </div>
                                        <textarea
                                            id="teks_sambutan"
                                            rows={8}
                                            maxLength={5000}
                                            value={sambutanForm.data.teks_sambutan}
                                            onChange={(e) => sambutanForm.setData('teks_sambutan', e.target.value)}
                                            placeholder="Masukkan isi sambutan resmi kepala sekolah..."
                                            className={textareaClass(Boolean(sambutanForm.errors.teks_sambutan))}
                                        />
                                        <p className="mt-1 text-xs text-content-tertiary">
                                            Gunakan paragraf yang jelas dan ringkas agar nyaman dibaca pengunjung.
                                        </p>
                                        {sambutanForm.errors.teks_sambutan && (
                                            <p className="mt-1 text-xs font-medium text-content-negative">
                                                {sambutanForm.errors.teks_sambutan}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="lg:col-span-4">
                                    <ImageDropzoneField
                                        id="foto_kepala_sekolah"
                                        label="Foto Kepala Sekolah (Portrait 3:4)"
                                        helperText="Format JPG/PNG/WebP, maks. 3 MB. Gunakan foto portrait dengan pencahayaan jelas."
                                        aspectClass="aspect-[3/4]"
                                        previewMaxWidthClass="max-w-[170px]"
                                        previewUrl={kepsekPreviewUrl}
                                        selectedFile={sambutanForm.data.foto_kepala_sekolah}
                                        serverError={sambutanForm.errors.foto_kepala_sekolah}
                                        onFileSelect={(file) => sambutanForm.setData('foto_kepala_sekolah', file)}
                                        onClearFile={() => sambutanForm.setData('foto_kepala_sekolah', null)}
                                    />
                                </div>
                            </div>

                            <div className="px-5 py-3.5 border-t border-stroke-card bg-surface-primary flex flex-wrap items-center justify-end gap-2.5">
                                {isSambutanDirty && (
                                    <CmsButton
                                        type="button"
                                        hierarchy="tertiary"
                                        size="md"
                                        disabled={sambutanForm.processing}
                                        onClick={handleResetSambutan}
                                    >
                                        Batalkan Perubahan
                                    </CmsButton>
                                )}
                                <CmsButton
                                    type="submit"
                                    hierarchy="primary"
                                    size="md"
                                    loading={sambutanForm.processing}
                                >
                                    {sambutanForm.processing ? 'Menyimpan...' : 'Simpan Sambutan'}
                                </CmsButton>
                            </div>
                        </form>
                    </section>

                    {/* SEKSI 3: BANNER AJAKAN BAWAH */}
                    <section className="bg-surface-primary border border-stroke-card rounded-xl shadow-admin-card overflow-hidden">
                        <div className="px-5 py-3.5 border-b border-stroke-card flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h2 className="text-base font-bold text-content-primary">
                                    Banner Ajakan Bawah (CTA)
                                </h2>
                                <p className="text-xs text-content-secondary mt-0.5">
                                    Seksi ajakan penutup di bagian bawah halaman beranda.
                                </p>
                            </div>
                            {isBannerDirty && <UnsavedBadge />}
                        </div>

                        <form onSubmit={handleSaveBanner} noValidate>
                            <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
                                <div className="lg:col-span-7 space-y-4">
                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label htmlFor="judul_banner_bawah" className="block text-sm font-medium text-content-primary">
                                                Judul Banner Bawah <span className="text-content-negative">*</span>
                                            </label>
                                            <span className="text-xs text-content-tertiary">
                                                {bannerForm.data.judul_banner_bawah.length}/200
                                            </span>
                                        </div>
                                        <input
                                            id="judul_banner_bawah"
                                            type="text"
                                            maxLength={200}
                                            value={bannerForm.data.judul_banner_bawah}
                                            onChange={(e) => bannerForm.setData('judul_banner_bawah', e.target.value)}
                                            placeholder="Masukkan judul banner ajakan bawah..."
                                            className={inputClass(Boolean(bannerForm.errors.judul_banner_bawah))}
                                        />
                                        {bannerForm.errors.judul_banner_bawah && (
                                            <p className="mt-1 text-xs font-medium text-content-negative">
                                                {bannerForm.errors.judul_banner_bawah}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label htmlFor="subjudul_banner_bawah" className="block text-sm font-medium text-content-primary">
                                                Subjudul Banner Bawah <span className="text-content-negative">*</span>
                                            </label>
                                            <span className="text-xs text-content-tertiary">
                                                {bannerForm.data.subjudul_banner_bawah.length}/1000
                                            </span>
                                        </div>
                                        <textarea
                                            id="subjudul_banner_bawah"
                                            rows={5}
                                            maxLength={1000}
                                            value={bannerForm.data.subjudul_banner_bawah}
                                            onChange={(e) => bannerForm.setData('subjudul_banner_bawah', e.target.value)}
                                            placeholder="Masukkan kalimat ajakan pendukung pada banner bawah..."
                                            className={textareaClass(Boolean(bannerForm.errors.subjudul_banner_bawah))}
                                        />
                                        {bannerForm.errors.subjudul_banner_bawah && (
                                            <p className="mt-1 text-xs font-medium text-content-negative">
                                                {bannerForm.errors.subjudul_banner_bawah}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="lg:col-span-5">
                                    <ImageDropzoneField
                                        id="gambar_banner_bawah"
                                        label="Gambar Banner Bawah (16:9)"
                                        helperText="Gambar latar bagian ajakan penutup beranda."
                                        aspectClass="aspect-video"
                                        previewUrl={bannerPreviewUrl}
                                        selectedFile={bannerForm.data.gambar_banner_bawah}
                                        serverError={bannerForm.errors.gambar_banner_bawah}
                                        onFileSelect={(file) => bannerForm.setData('gambar_banner_bawah', file)}
                                        onClearFile={() => bannerForm.setData('gambar_banner_bawah', null)}
                                    />
                                </div>
                            </div>

                            <div className="px-5 py-3.5 border-t border-stroke-card bg-surface-primary flex flex-wrap items-center justify-end gap-2.5">
                                {isBannerDirty && (
                                    <CmsButton
                                        type="button"
                                        hierarchy="tertiary"
                                        size="md"
                                        disabled={bannerForm.processing}
                                        onClick={handleResetBanner}
                                    >
                                        Batalkan Perubahan
                                    </CmsButton>
                                )}
                                <CmsButton
                                    type="submit"
                                    hierarchy="primary"
                                    size="md"
                                    loading={bannerForm.processing}
                                >
                                    {bannerForm.processing ? 'Menyimpan...' : 'Simpan Banner Bawah'}
                                </CmsButton>
                            </div>
                        </form>
                    </section>
                </div>
            ) : (
                /* MODE PRATINJAU PUBLIK */
                <div className="space-y-4">
                    <div className="bg-surface-primary border border-stroke-card rounded-xl px-5 py-3 flex flex-wrap items-center justify-between gap-3 shadow-admin-card">
                        <div>
                            <h2 className="text-base font-bold text-content-primary">
                                Pratinjau Tampilan Beranda Publik
                            </h2>
                            <p className="text-xs text-content-secondary">
                                Menampilkan pratinjau langsung dari isian form saat ini sebelum maupun sesudah disimpan.
                            </p>
                        </div>

                        <div className="inline-flex rounded-lg border border-stroke-card p-1 bg-surface-secondary">
                            <button
                                type="button"
                                onClick={() => setPreviewDevice('desktop')}
                                className={`inline-flex items-center gap-1.5 h-8 px-3 text-xs rounded-md transition ${
                                    previewDevice === 'desktop'
                                        ? 'bg-surface-primary border border-brand-200 shadow-xs text-brand-600 font-semibold'
                                        : 'text-content-secondary hover:text-content-primary font-medium'
                                }`}
                            >
                                <IconDeviceDesktop size={15} />
                                <span>Desktop</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setPreviewDevice('mobile')}
                                className={`inline-flex items-center gap-1.5 h-8 px-3 text-xs rounded-md transition ${
                                    previewDevice === 'mobile'
                                        ? 'bg-surface-primary border border-brand-200 shadow-xs text-brand-600 font-semibold'
                                        : 'text-content-secondary hover:text-content-primary font-medium'
                                }`}
                            >
                                <IconDeviceMobile size={15} />
                                <span>Mobile</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <div
                            className={`w-full bg-surface-primary border border-stroke-card rounded-xl shadow-admin-card overflow-hidden transition-all ${
                                previewDevice === 'mobile' ? 'max-w-sm' : 'max-w-full'
                            }`}
                        >
                            {/* Preview Hero */}
                            <div className="relative bg-brand-800 text-white p-6 sm:p-10">
                                {heroPreviewUrl && (
                                    <img
                                        src={heroPreviewUrl}
                                        alt="Pratinjau Hero"
                                        className="absolute inset-0 w-full h-full object-cover opacity-25"
                                    />
                                )}
                                <div className="relative z-10 max-w-2xl space-y-3">
                                    <span className="inline-block px-3 py-1 rounded-full bg-brand-500/30 border border-brand-300/40 text-xs font-medium">
                                        Hero Banner Beranda
                                    </span>
                                    <h3 className="text-xl sm:text-2xl font-bold leading-tight">
                                        {heroForm.data.judul_hero || 'Judul hero banner belum diisi'}
                                    </h3>
                                    <p className="text-sm text-brand-100 leading-relaxed">
                                        {heroForm.data.subjudul_hero || 'Subjudul hero banner belum diisi.'}
                                    </p>
                                    <div className="pt-2 flex flex-wrap gap-2">
                                        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-brand-500 text-white text-xs font-semibold">
                                            <span>Daftar SPMB Sekarang</span>
                                            <IconArrowRight size={14} />
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Preview Sambutan Kepala Sekolah */}
                            <div className={`p-6 sm:p-10 border-b border-stroke-card grid gap-6 items-center ${
                                previewDevice === 'mobile' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-12'
                            }`}>
                                <div className={previewDevice === 'mobile' ? 'flex justify-center' : 'md:col-span-4 flex justify-center'}>
                                    <div className="w-44 aspect-[3/4] rounded-xl border border-stroke-card bg-surface-secondary overflow-hidden flex flex-col items-center justify-center">
                                        {kepsekPreviewUrl ? (
                                            <img
                                                src={kepsekPreviewUrl}
                                                alt="Pratinjau Kepala Sekolah"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 text-content-disabled p-4 text-center">
                                                <IconSchool size={32} />
                                                <span className="text-xs text-content-tertiary">Foto Kepala Sekolah</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className={previewDevice === 'mobile' ? 'space-y-2' : 'md:col-span-8 space-y-2'}>
                                    <span className="inline-block px-2.5 py-1 rounded-md border border-brand-500/20 bg-brand-500/10 text-brand-600 text-xs font-medium">
                                        Sambutan Kepala Sekolah
                                    </span>
                                    <h4 className="text-base sm:text-lg font-bold text-content-primary">
                                        {sambutanForm.data.nama_kepala_sekolah || 'Nama kepala sekolah belum diisi'}
                                    </h4>
                                    <p className="text-sm text-content-secondary leading-relaxed whitespace-pre-line">
                                        {sambutanForm.data.teks_sambutan || 'Teks sambutan belum diisi.'}
                                    </p>
                                </div>
                            </div>

                            {/* Preview Banner Bawah */}
                            <div className="relative bg-brand-700 text-white p-6 sm:p-10">
                                {bannerPreviewUrl && (
                                    <img
                                        src={bannerPreviewUrl}
                                        alt="Pratinjau Banner Bawah"
                                        className="absolute inset-0 w-full h-full object-cover opacity-25"
                                    />
                                )}
                                <div className="relative z-10 max-w-2xl space-y-2">
                                    <h4 className="text-lg sm:text-xl font-bold">
                                        {bannerForm.data.judul_banner_bawah || 'Judul banner bawah belum diisi'}
                                    </h4>
                                    <p className="text-sm text-brand-100 leading-relaxed">
                                        {bannerForm.data.subjudul_banner_bawah || 'Subjudul banner bawah belum diisi.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
