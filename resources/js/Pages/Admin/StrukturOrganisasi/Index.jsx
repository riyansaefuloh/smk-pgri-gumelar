import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from '@inertiajs/react';
import {
    IconDeviceDesktop,
    IconDeviceMobile,
    IconEye,
    IconHierarchy2,
    IconPencil,
} from '@tabler/icons-react';
import AdminLayout from '@/Layouts/AdminLayout';
import CmsButton from '@/Components/Admin/CmsButton';
import ImageDropzoneField from '@/Components/Admin/ImageDropzoneField';

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
 * Halaman Pengelolaan Struktur Organisasi (CMS Profil Sekolah)
 * - Mode Switcher: Mode Edit <-> Pratinjau Publik (Desktop / Mobile)
 * - Form informasi pengantar dan unggah gambar bagan struktur organisasi
 */
export default function StrukturOrganisasiIndex({ title, struktur }) {
    const [pageMode, setPageMode] = useState('edit');
    const [previewDevice, setPreviewDevice] = useState('desktop');

    const form = useForm({
        _method: 'put',
        judul_halaman: struktur?.judul_halaman || '',
        subjudul_halaman: struktur?.subjudul_halaman || '',
        gambar_bagan_struktur: null,
    });

    const isDirty = useMemo(
        () =>
            form.data.judul_halaman !== (struktur?.judul_halaman || '') ||
            form.data.subjudul_halaman !== (struktur?.subjudul_halaman || '') ||
            Boolean(form.data.gambar_bagan_struktur),
        [form.data, struktur]
    );

    const [baganPreviewUrl, setBaganPreviewUrl] = useState(struktur?.gambar_bagan_struktur || '');
    useEffect(() => {
        if (!form.data.gambar_bagan_struktur) {
            setBaganPreviewUrl(struktur?.gambar_bagan_struktur || '');
            return undefined;
        }
        const objectUrl = URL.createObjectURL(form.data.gambar_bagan_struktur);
        setBaganPreviewUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [form.data.gambar_bagan_struktur, struktur?.gambar_bagan_struktur]);

    const handleSubmit = (e) => {
        e.preventDefault();
        form.post('/admin/struktur-organisasi', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: (page) => {
                const updated = page?.props?.struktur;
                form.setData({
                    _method: 'put',
                    judul_halaman: updated?.judul_halaman ?? form.data.judul_halaman.trim(),
                    subjudul_halaman: updated?.subjudul_halaman ?? form.data.subjudul_halaman.trim(),
                    gambar_bagan_struktur: null,
                });
            },
        });
    };

    const handleReset = () => {
        form.setData({
            _method: 'put',
            judul_halaman: struktur?.judul_halaman || '',
            subjudul_halaman: struktur?.subjudul_halaman || '',
            gambar_bagan_struktur: null,
        });
        form.clearErrors();
    };

    return (
        <AdminLayout
            title={title || 'Struktur Organisasi'}
            subtitle="Kelola judul pengantar dan bagan struktur organisasi kepemimpinan sekolah."
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
            {isDirty && (
                <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-xl bg-warning-100 border border-warning-500/30">
                    <UnsavedBadge />
                    <span className="text-xs text-content-warning">
                        Simpan perubahan agar bagan struktur organisasi terbaru tampil di portal publik.
                    </span>
                </div>
            )}

            {pageMode === 'edit' ? (
                <div className="space-y-6">
                    <section className="bg-surface-primary border border-stroke-card rounded-xl shadow-admin-card overflow-hidden">
                        <div className="px-5 py-3.5 border-b border-stroke-card flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h2 className="text-base font-bold text-content-primary">
                                    Informasi &amp; Bagan Struktur Organisasi
                                </h2>
                                <p className="text-xs text-content-secondary mt-0.5">
                                    Atur judul, keterangan pengantar, serta unggah gambar bagan struktur organisasi sekolah.
                                </p>
                            </div>
                            {isDirty && <UnsavedBadge />}
                        </div>

                        <form onSubmit={handleSubmit} noValidate>
                            <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                                <div className="lg:col-span-7 space-y-4">
                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label htmlFor="judul_halaman" className="block text-sm font-medium text-content-primary">
                                                Judul Halaman <span className="text-content-negative">*</span>
                                            </label>
                                            <span className="text-xs text-content-tertiary">
                                                {form.data.judul_halaman.length}/200
                                            </span>
                                        </div>
                                        <input
                                            id="judul_halaman"
                                            type="text"
                                            maxLength={200}
                                            value={form.data.judul_halaman}
                                            onChange={(e) => form.setData('judul_halaman', e.target.value)}
                                            placeholder="Masukkan judul halaman struktur organisasi..."
                                            className={inputClass(Boolean(form.errors.judul_halaman))}
                                        />
                                        {form.errors.judul_halaman && (
                                            <p className="mt-1 text-xs font-medium text-content-negative">
                                                {form.errors.judul_halaman}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label htmlFor="subjudul_halaman" className="block text-sm font-medium text-content-primary">
                                                Keterangan Pengantar <span className="text-content-negative">*</span>
                                            </label>
                                            <span className="text-xs text-content-tertiary">
                                                {form.data.subjudul_halaman.length}/3000
                                            </span>
                                        </div>
                                        <textarea
                                            id="subjudul_halaman"
                                            rows={7}
                                            maxLength={3000}
                                            value={form.data.subjudul_halaman}
                                            onChange={(e) => form.setData('subjudul_halaman', e.target.value)}
                                            placeholder="Masukkan keterangan pengantar struktur organisasi sekolah..."
                                            className={textareaClass(Boolean(form.errors.subjudul_halaman))}
                                        />
                                        <p className="mt-1 text-xs text-content-tertiary">
                                            Jelaskan secara singkat tata kelola kepemimpinan dan pembagian tugas di sekolah.
                                        </p>
                                        {form.errors.subjudul_halaman && (
                                            <p className="mt-1 text-xs font-medium text-content-negative">
                                                {form.errors.subjudul_halaman}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="lg:col-span-5">
                                    <ImageDropzoneField
                                        id="gambar_bagan_struktur"
                                        label="Gambar Bagan Struktur Organisasi"
                                        helperText="Rasio lanskap 16:9 · JPG, PNG, WebP · Maks. 3 MB"
                                        aspectClass="aspect-video"
                                        previewMaxWidthClass="max-w-[320px]"
                                        previewUrl={baganPreviewUrl}
                                        selectedFile={form.data.gambar_bagan_struktur}
                                        serverError={form.errors.gambar_bagan_struktur}
                                        onFileSelect={(file) => form.setData('gambar_bagan_struktur', file)}
                                        onClearFile={() => form.setData('gambar_bagan_struktur', null)}
                                    />
                                </div>
                            </div>

                            <div className="px-5 py-3.5 border-t border-stroke-card bg-surface-primary flex flex-wrap items-center justify-end gap-2.5">
                                {isDirty && (
                                    <CmsButton
                                        type="button"
                                        hierarchy="tertiary"
                                        size="md"
                                        disabled={form.processing}
                                        onClick={handleReset}
                                    >
                                        Batalkan Perubahan
                                    </CmsButton>
                                )}
                                <CmsButton
                                    type="submit"
                                    hierarchy="primary"
                                    size="md"
                                    loading={form.processing}
                                >
                                    {form.processing ? 'Menyimpan...' : 'Simpan Struktur Organisasi'}
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
                                Pratinjau Tampilan Struktur Organisasi
                            </h2>
                            <p className="text-xs text-content-secondary">
                                Menampilkan pratinjau langsung dari isian form saat ini.
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
                            className={`w-full bg-surface-primary border border-stroke-card rounded-xl shadow-admin-card overflow-hidden transition-all p-6 sm:p-10 space-y-6 ${
                                previewDevice === 'mobile' ? 'max-w-sm' : 'max-w-full'
                            }`}
                        >
                            <div className="max-w-3xl space-y-2">
                                <span className="inline-block px-2.5 py-1 rounded-md border border-brand-500/20 bg-brand-500/10 text-brand-600 text-xs font-medium">
                                    Struktur Organisasi
                                </span>
                                <h3 className="text-xl sm:text-2xl font-bold text-content-primary leading-tight">
                                    {form.data.judul_halaman || 'Judul halaman belum diisi'}
                                </h3>
                                <p className="text-sm text-content-secondary leading-relaxed whitespace-pre-line">
                                    {form.data.subjudul_halaman || 'Keterangan pengantar belum diisi.'}
                                </p>
                            </div>

                            <div className="rounded-xl border border-stroke-card bg-surface-secondary overflow-hidden flex items-center justify-center min-h-[260px]">
                                {baganPreviewUrl ? (
                                    <img
                                        src={baganPreviewUrl}
                                        alt="Pratinjau Bagan Struktur Organisasi"
                                        className="w-full h-auto object-contain"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-content-disabled p-8 text-center">
                                        <IconHierarchy2 size={36} stroke={1.5} />
                                        <span className="text-xs text-content-tertiary">
                                            Gambar bagan struktur organisasi belum diunggah
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
