import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { router, useForm } from '@inertiajs/react';
import {
    IconArrowDown,
    IconArrowUp,
    IconDeviceDesktop,
    IconDeviceMobile,
    IconEdit,
    IconEye,
    IconHistory,
    IconPencil,
    IconPhoto,
    IconPlus,
    IconTrash,
    IconX,
} from '@tabler/icons-react';
import AdminLayout from '@/Layouts/AdminLayout';
import CmsButton from '@/Components/Admin/CmsButton';
import ImageDropzoneField from '@/Components/Admin/ImageDropzoneField';

const MAX_MILESTONE = 30;

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
 * Halaman Pengelolaan Sejarah Sekolah (CMS Profil Sekolah)
 * - Mode Switcher: Mode Edit <-> Pratinjau Publik (Desktop / Mobile)
 * - Simpan mandiri: Narasi & Foto Sejarah, serta Linimasa Milestone (Slide-Over Drawer)
 */
export default function SejarahSekolahIndex({ title, sejarah }) {
    const [pageMode, setPageMode] = useState('edit');
    const [previewDevice, setPreviewDevice] = useState('desktop');

    // State Drawer & Modal Milestone
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [milestoneDraft, setMilestoneDraft] = useState({
        tahun: '',
        judul: '',
        deskripsi: '',
    });
    const [clientError, setClientError] = useState('');
    const [savingMilestone, setSavingMilestone] = useState(false);
    const [reorderingMilestone, setReorderingMilestone] = useState(false);
    const [deleteIndexTarget, setDeleteIndexTarget] = useState(null);

    const daftarMilestone = useMemo(
        () => (Array.isArray(sejarah?.daftar_milestone) ? sejarah.daftar_milestone : []),
        [sejarah?.daftar_milestone]
    );

    // Seksi 1: Narasi & Foto Sejarah
    const narasiForm = useForm({
        _method: 'put',
        judul_sejarah: sejarah?.judul_sejarah || '',
        deskripsi_sejarah: sejarah?.deskripsi_sejarah || '',
        foto_sekolah: null,
    });

    const isNarasiDirty = useMemo(
        () =>
            narasiForm.data.judul_sejarah !== (sejarah?.judul_sejarah || '') ||
            narasiForm.data.deskripsi_sejarah !== (sejarah?.deskripsi_sejarah || '') ||
            Boolean(narasiForm.data.foto_sekolah),
        [narasiForm.data, sejarah]
    );

    const [fotoPreviewUrl, setFotoPreviewUrl] = useState(sejarah?.foto_sekolah || '');
    useEffect(() => {
        if (!narasiForm.data.foto_sekolah) {
            setFotoPreviewUrl(sejarah?.foto_sekolah || '');
            return undefined;
        }
        const objectUrl = URL.createObjectURL(narasiForm.data.foto_sekolah);
        setFotoPreviewUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [narasiForm.data.foto_sekolah, sejarah?.foto_sekolah]);

    // Lock body scroll & Escape key untuk Overlay
    useEffect(() => {
        const hasOverlay = drawerOpen || deleteIndexTarget !== null;
        document.body.style.overflow = hasOverlay ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [drawerOpen, deleteIndexTarget]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key !== 'Escape') {
                return;
            }
            if (deleteIndexTarget !== null && !savingMilestone) {
                setDeleteIndexTarget(null);
                return;
            }
            if (drawerOpen && !savingMilestone) {
                closeDrawer();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [drawerOpen, deleteIndexTarget, savingMilestone]);

    const handleSaveNarasi = (e) => {
        e.preventDefault();
        narasiForm.post('/admin/sejarah-sekolah/narasi', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: (page) => {
                const updated = page?.props?.sejarah;
                narasiForm.setData({
                    _method: 'put',
                    judul_sejarah: updated?.judul_sejarah ?? narasiForm.data.judul_sejarah.trim(),
                    deskripsi_sejarah: updated?.deskripsi_sejarah ?? narasiForm.data.deskripsi_sejarah.trim(),
                    foto_sekolah: null,
                });
            },
        });
    };

    const handleResetNarasi = () => {
        narasiForm.setData({
            _method: 'put',
            judul_sejarah: sejarah?.judul_sejarah || '',
            deskripsi_sejarah: sejarah?.deskripsi_sejarah || '',
            foto_sekolah: null,
        });
        narasiForm.clearErrors();
    };

    // Handlers Milestone Drawer
    const openCreateDrawer = () => {
        setEditingIndex(null);
        setMilestoneDraft({ tahun: '', judul: '', deskripsi: '' });
        setClientError('');
        setDrawerOpen(true);
    };

    const openEditDrawer = (index) => {
        const target = daftarMilestone[index];
        if (!target) {
            return;
        }
        setEditingIndex(index);
        setMilestoneDraft({
            tahun: target.tahun || '',
            judul: target.judul || '',
            deskripsi: target.deskripsi || '',
        });
        setClientError('');
        setDrawerOpen(true);
    };

    const closeDrawer = () => {
        setDrawerOpen(false);
        setEditingIndex(null);
        setMilestoneDraft({ tahun: '', judul: '', deskripsi: '' });
        setClientError('');
    };

    const persistMilestones = (nextList, onSuccessCallback, { isReorder = false } = {}) => {
        setSavingMilestone(true);
        if (isReorder) {
            setReorderingMilestone(true);
        }
        router.put(
            '/admin/sejarah-sekolah/milestone',
            { daftar_milestone: nextList },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => onSuccessCallback?.(),
                onError: (errs) => {
                    const firstErr = Object.values(errs)[0];
                    if (firstErr) {
                        setClientError(String(firstErr));
                    }
                },
                onFinish: () => {
                    setSavingMilestone(false);
                    setReorderingMilestone(false);
                },
            }
        );
    };

    const handleSubmitDrawer = (e) => {
        e.preventDefault();
        const tahun = milestoneDraft.tahun.trim();
        const judul = milestoneDraft.judul.trim();
        const deskripsi = milestoneDraft.deskripsi.trim();

        if (!tahun) {
            setClientError('Tahun atau periode milestone wajib diisi.');
            return;
        }
        if (tahun.length > 30) {
            setClientError('Tahun atau periode maksimal 30 karakter.');
            return;
        }
        if (!judul) {
            setClientError('Judul peristiwa milestone wajib diisi.');
            return;
        }
        if (judul.length > 150) {
            setClientError('Judul peristiwa maksimal 150 karakter.');
            return;
        }
        if (deskripsi.length > 1000) {
            setClientError('Deskripsi peristiwa maksimal 1.000 karakter.');
            return;
        }

        const entry = { tahun, judul, deskripsi };
        const nextList = [...daftarMilestone];
        if (editingIndex !== null && editingIndex >= 0 && editingIndex < nextList.length) {
            nextList[editingIndex] = entry;
        } else {
            nextList.push(entry);
        }

        persistMilestones(nextList, closeDrawer);
    };

    const handleConfirmDelete = () => {
        if (deleteIndexTarget === null || savingMilestone) {
            return;
        }
        const nextList = daftarMilestone.filter((_, idx) => idx !== deleteIndexTarget);
        persistMilestones(nextList, () => setDeleteIndexTarget(null));
    };

    const handleMoveMilestone = (index, direction) => {
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= daftarMilestone.length || savingMilestone) {
            return;
        }
        const nextList = [...daftarMilestone];
        const [moved] = nextList.splice(index, 1);
        nextList.splice(targetIndex, 0, moved);
        persistMilestones(nextList, undefined, { isReorder: true });
    };

    return (
        <AdminLayout
            title={title || 'Sejarah Sekolah'}
            subtitle="Kelola narasi sejarah berdirinya sekolah, foto dokumentasi, serta linimasa perkembangan sekolah."
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
            {isNarasiDirty && (
                <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-xl bg-warning-100 border border-warning-500/30">
                    <UnsavedBadge />
                    <span className="text-xs text-content-warning">
                        Simpan perubahan narasi sejarah agar tampil di portal publik.
                    </span>
                </div>
            )}

            {pageMode === 'edit' ? (
                <div className="space-y-6">
                    {/* CARD 1: NARASI & FOTO SEJARAH */}
                    <section className="bg-surface-primary border border-stroke-card rounded-xl shadow-admin-card overflow-hidden">
                        <div className="px-5 py-3.5 border-b border-stroke-card flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h2 className="text-base font-bold text-content-primary">
                                    Narasi &amp; Dokumentasi Sejarah
                                </h2>
                                <p className="text-xs text-content-secondary mt-0.5">
                                    Judul utama, pengantar singkat, cerita perjalanan sekolah, dan foto dokumentasi.
                                </p>
                            </div>
                            {isNarasiDirty && <UnsavedBadge />}
                        </div>

                        <form onSubmit={handleSaveNarasi} noValidate>
                            <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                                <div className="lg:col-span-7 space-y-4">
                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label htmlFor="judul_sejarah" className="block text-sm font-medium text-content-primary">
                                                Judul Sejarah <span className="text-content-negative">*</span>
                                            </label>
                                            <span className="text-xs text-content-tertiary">
                                                {narasiForm.data.judul_sejarah.length}/200
                                            </span>
                                        </div>
                                        <input
                                            id="judul_sejarah"
                                            type="text"
                                            maxLength={200}
                                            value={narasiForm.data.judul_sejarah}
                                            onChange={(e) => narasiForm.setData('judul_sejarah', e.target.value)}
                                            placeholder="Masukkan judul utama halaman sejarah sekolah..."
                                            className={inputClass(Boolean(narasiForm.errors.judul_sejarah))}
                                        />
                                        {narasiForm.errors.judul_sejarah && (
                                            <p className="mt-1 text-xs font-medium text-content-negative">
                                                {narasiForm.errors.judul_sejarah}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label htmlFor="deskripsi_sejarah" className="block text-sm font-medium text-content-primary">
                                                Narasi Sejarah Lengkap <span className="text-content-negative">*</span>
                                            </label>
                                            <span className="text-xs text-content-tertiary">
                                                {narasiForm.data.deskripsi_sejarah.length}/10000
                                            </span>
                                        </div>
                                        <textarea
                                            id="deskripsi_sejarah"
                                            rows={7}
                                            maxLength={10000}
                                            value={narasiForm.data.deskripsi_sejarah}
                                            onChange={(e) => narasiForm.setData('deskripsi_sejarah', e.target.value)}
                                            placeholder="Masukkan narasi sejarah berdirinya sekolah hingga perkembangan saat ini..."
                                            className={textareaClass(Boolean(narasiForm.errors.deskripsi_sejarah))}
                                        />
                                        <p className="mt-1 text-xs text-content-tertiary">
                                            Pisahkan antar paragraf dengan baris kosong agar nyaman dibaca di portal publik.
                                        </p>
                                        {narasiForm.errors.deskripsi_sejarah && (
                                            <p className="mt-1 text-xs font-medium text-content-negative">
                                                {narasiForm.errors.deskripsi_sejarah}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="lg:col-span-5">
                                    <ImageDropzoneField
                                        id="foto_sekolah"
                                        label="Foto Dokumentasi Sekolah (16:9)"
                                        helperText="Rasio lanskap 16:9 · JPG, PNG, WebP · Maks. 3 MB"
                                        aspectClass="aspect-video"
                                        previewMaxWidthClass="max-w-[320px]"
                                        previewUrl={fotoPreviewUrl}
                                        selectedFile={narasiForm.data.foto_sekolah}
                                        serverError={narasiForm.errors.foto_sekolah}
                                        onFileSelect={(file) => narasiForm.setData('foto_sekolah', file)}
                                        onClearFile={() => narasiForm.setData('foto_sekolah', null)}
                                    />
                                </div>
                            </div>

                            <div className="px-5 py-3.5 border-t border-stroke-card bg-surface-primary flex flex-wrap items-center justify-end gap-2.5">
                                {isNarasiDirty && (
                                    <CmsButton
                                        type="button"
                                        hierarchy="tertiary"
                                        size="md"
                                        disabled={narasiForm.processing}
                                        onClick={handleResetNarasi}
                                    >
                                        Batalkan Perubahan
                                    </CmsButton>
                                )}
                                <CmsButton
                                    type="submit"
                                    hierarchy="primary"
                                    size="md"
                                    loading={narasiForm.processing}
                                >
                                    {narasiForm.processing ? 'Menyimpan...' : 'Simpan Narasi Sejarah'}
                                </CmsButton>
                            </div>
                        </form>
                    </section>

                    {/* CARD 2: LINIMASA / MILESTONE SEJARAH */}
                    <section className="bg-surface-primary border border-stroke-card rounded-xl shadow-admin-card overflow-hidden">
                        <div className="px-5 py-3.5 border-b border-stroke-card flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h2 className="text-base font-bold text-content-primary">
                                        Linimasa Perkembangan (Milestone)
                                    </h2>
                                    <span className="text-xs px-2.5 py-0.5 rounded-full border border-brand-500/20 bg-brand-500/10 text-brand-600 font-semibold">
                                        {daftarMilestone.length} / {MAX_MILESTONE}
                                    </span>
                                    {reorderingMilestone && (
                                        <span className="text-xs text-brand-600 font-medium">
                                            Menyimpan urutan...
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-content-secondary mt-0.5">
                                    Catat tonggak sejarah penting sekolah secara berurutan. Perubahan langsung tersimpan.
                                </p>
                            </div>

                            <CmsButton
                                type="button"
                                hierarchy="primary"
                                size="md"
                                prefixIcon={<IconPlus size={16} />}
                                disabled={daftarMilestone.length >= MAX_MILESTONE || savingMilestone}
                                onClick={openCreateDrawer}
                            >
                                Tambah Milestone
                            </CmsButton>
                        </div>

                        {daftarMilestone.length === 0 ? (
                            <div className="p-10 text-center flex flex-col items-center space-y-2.5">
                                <p className="text-base font-semibold text-content-primary">
                                    Belum ada data milestone sejarah
                                </p>
                                <p className="text-sm text-content-secondary max-w-md leading-relaxed">
                                    Tambahkan tonggak sejarah seperti tahun pendirian, perubahan status, atau pencapaian penting sekolah.
                                </p>
                                <div className="pt-1">
                                    <CmsButton
                                        type="button"
                                        hierarchy="secondary"
                                        size="sm"
                                        prefixIcon={<IconPlus size={14} className="text-brand-500" />}
                                        onClick={openCreateDrawer}
                                    >
                                        Tambah Milestone Pertama
                                    </CmsButton>
                                </div>
                            </div>
                        ) : (
                            <div className="divide-y divide-stroke-card">
                                {daftarMilestone.map((item, idx) => (
                                    <div
                                        key={`${idx}-${item.tahun}-${item.judul}`}
                                        className="px-5 py-3.5 flex items-start justify-between gap-4 hover:bg-brand-50/50 transition-colors"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="text-xs font-bold text-brand-500">#{idx + 1}</span>
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs border border-brand-500/20 bg-brand-500/10 text-brand-600 font-medium">
                                                    {item.tahun || '-'}
                                                </span>
                                                <h3 className="text-sm font-semibold text-content-primary truncate">
                                                    {item.judul}
                                                </h3>
                                            </div>
                                            <p className="text-xs text-content-secondary mt-0.5 line-clamp-2 leading-relaxed">
                                                {item.deskripsi || 'Belum ada deskripsi singkat.'}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-1 shrink-0">
                                            <CmsButton
                                                hierarchy="tertiary"
                                                tone="brand"
                                                size="icon-sm"
                                                title="Pindah ke atas"
                                                aria-label={`Pindah milestone ${item.judul} ke atas`}
                                                disabled={idx === 0 || savingMilestone || reorderingMilestone}
                                                onClick={() => handleMoveMilestone(idx, -1)}
                                                prefixIcon={<IconArrowUp size={15} />}
                                            />
                                            <CmsButton
                                                hierarchy="tertiary"
                                                tone="brand"
                                                size="icon-sm"
                                                title="Pindah ke bawah"
                                                aria-label={`Pindah milestone ${item.judul} ke bawah`}
                                                disabled={idx === daftarMilestone.length - 1 || savingMilestone || reorderingMilestone}
                                                onClick={() => handleMoveMilestone(idx, 1)}
                                                prefixIcon={<IconArrowDown size={15} />}
                                            />
                                            <CmsButton
                                                hierarchy="tertiary"
                                                tone="warning"
                                                size="icon-sm"
                                                title="Edit milestone"
                                                aria-label={`Edit milestone ${item.judul}`}
                                                disabled={savingMilestone}
                                                onClick={() => openEditDrawer(idx)}
                                                prefixIcon={<IconEdit size={15} />}
                                            />
                                            <CmsButton
                                                hierarchy="tertiary"
                                                tone="danger"
                                                size="icon-sm"
                                                title="Hapus milestone"
                                                aria-label={`Hapus milestone ${item.judul}`}
                                                disabled={savingMilestone}
                                                onClick={() => setDeleteIndexTarget(idx)}
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
                /* MODE PRATINJAU PUBLIK */
                <div className="space-y-4">
                    <div className="bg-surface-primary border border-stroke-card rounded-xl px-5 py-3 flex flex-wrap items-center justify-between gap-3 shadow-admin-card">
                        <div>
                            <h2 className="text-base font-bold text-content-primary">
                                Pratinjau Tampilan Sejarah Sekolah
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
                            className={`w-full bg-surface-primary border border-stroke-card rounded-xl shadow-admin-card overflow-hidden transition-all ${
                                previewDevice === 'mobile' ? 'max-w-sm' : 'max-w-full'
                            }`}
                        >
                            {/* Preview Narasi */}
                            <div className={`p-6 sm:p-10 border-b border-stroke-card grid gap-6 items-start ${
                                previewDevice === 'mobile' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-12'
                            }`}>
                                <div className={previewDevice === 'mobile' ? 'space-y-3' : 'md:col-span-7 space-y-3'}>
                                    <span className="inline-block px-2.5 py-1 rounded-md border border-brand-500/20 bg-brand-500/10 text-brand-600 text-xs font-medium">
                                        Sejarah Sekolah
                                    </span>
                                    <h3 className="text-xl sm:text-2xl font-bold text-content-primary leading-tight">
                                        {narasiForm.data.judul_sejarah || 'Judul sejarah belum diisi'}
                                    </h3>
                                    <p className="text-sm text-content-secondary leading-relaxed whitespace-pre-line pt-1">
                                        {narasiForm.data.deskripsi_sejarah || 'Narasi sejarah belum diisi.'}
                                    </p>
                                </div>

                                <div className={previewDevice === 'mobile' ? '' : 'md:col-span-5'}>
                                    <div className="aspect-video rounded-xl border border-stroke-card bg-surface-secondary overflow-hidden flex items-center justify-center">
                                        {fotoPreviewUrl ? (
                                            <img
                                                src={fotoPreviewUrl}
                                                alt="Pratinjau Dokumentasi Sejarah"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 text-content-disabled p-4">
                                                <IconPhoto size={32} />
                                                <span className="text-xs text-content-tertiary">Foto Dokumentasi</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Preview Linimasa */}
                            <div className="p-6 sm:p-10 bg-surface-secondary">
                                <h4 className="text-base font-bold text-content-primary mb-4">
                                    Linimasa Perkembangan
                                </h4>
                                {daftarMilestone.length === 0 ? (
                                    <p className="text-sm text-content-tertiary">Belum ada milestone sejarah.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {daftarMilestone.map((item, idx) => (
                                            <div
                                                key={idx}
                                                className="bg-surface-primary border border-stroke-card rounded-xl p-4 flex flex-col sm:flex-row sm:items-start gap-3"
                                            >
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-md border border-brand-500/20 bg-brand-500/10 text-brand-600 text-xs font-semibold shrink-0 self-start">
                                                    {item.tahun}
                                                </span>
                                                <div className="space-y-1">
                                                    <h5 className="text-sm font-bold text-content-primary">{item.judul}</h5>
                                                    {item.deskripsi && (
                                                        <p className="text-xs text-content-secondary leading-relaxed">
                                                            {item.deskripsi}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* SLIDE-OVER DRAWER TAMBAH / EDIT MILESTONE */}
            {drawerOpen &&
                createPortal(
                    <div className="fixed inset-0 z-[60] flex justify-end">
                        <div
                            className="fixed inset-0 bg-brand-900/35 backdrop-blur-[1px]"
                            onClick={() => !savingMilestone && closeDrawer()}
                        />

                        <aside
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="drawer-milestone-title"
                            className="relative z-[70] w-full max-w-md bg-surface-primary h-full shadow-2xl border-l border-stroke-card flex flex-col"
                        >
                            <div className="px-5 py-4 border-b border-stroke-card flex items-center justify-between gap-3">
                                <div>
                                    <h3 id="drawer-milestone-title" className="text-base sm:text-lg font-bold text-content-primary">
                                        {editingIndex !== null ? 'Edit Milestone Sejarah' : 'Tambah Milestone Sejarah'}
                                    </h3>
                                    <p className="text-xs text-content-secondary mt-0.5">
                                        Isi tahun/periode dan peristiwa penting sekolah.
                                    </p>
                                </div>
                                <CmsButton
                                    hierarchy="tertiary"
                                    size="icon-sm"
                                    aria-label="Tutup panel"
                                    disabled={savingMilestone}
                                    onClick={closeDrawer}
                                >
                                    <IconX size={18} />
                                </CmsButton>
                            </div>

                            <form onSubmit={handleSubmitDrawer} className="flex-1 flex flex-col overflow-hidden" noValidate>
                                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label htmlFor="milestone_tahun" className="block text-sm font-medium text-content-primary">
                                                Tahun / Periode <span className="text-content-negative">*</span>
                                            </label>
                                            <span className="text-xs text-content-tertiary">
                                                {milestoneDraft.tahun.length}/30
                                            </span>
                                        </div>
                                        <input
                                            id="milestone_tahun"
                                            type="text"
                                            maxLength={30}
                                            value={milestoneDraft.tahun}
                                            onChange={(e) => {
                                                setMilestoneDraft((prev) => ({ ...prev, tahun: e.target.value }));
                                                if (clientError) setClientError('');
                                            }}
                                            placeholder="Masukkan tahun atau rentang periode..."
                                            className={inputClass(Boolean(clientError && !milestoneDraft.tahun.trim()))}
                                        />
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label htmlFor="milestone_judul" className="block text-sm font-medium text-content-primary">
                                                Judul Peristiwa <span className="text-content-negative">*</span>
                                            </label>
                                            <span className="text-xs text-content-tertiary">
                                                {milestoneDraft.judul.length}/150
                                            </span>
                                        </div>
                                        <input
                                            id="milestone_judul"
                                            type="text"
                                            maxLength={150}
                                            value={milestoneDraft.judul}
                                            onChange={(e) => {
                                                setMilestoneDraft((prev) => ({ ...prev, judul: e.target.value }));
                                                if (clientError) setClientError('');
                                            }}
                                            placeholder="Masukkan judul peristiwa bersejarah..."
                                            className={inputClass(Boolean(clientError && !milestoneDraft.judul.trim()))}
                                        />
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label htmlFor="milestone_deskripsi" className="block text-sm font-medium text-content-primary">
                                                Deskripsi Singkat
                                            </label>
                                            <span className="text-xs text-content-tertiary">
                                                {milestoneDraft.deskripsi.length}/1000
                                            </span>
                                        </div>
                                        <textarea
                                            id="milestone_deskripsi"
                                            rows={5}
                                            maxLength={1000}
                                            value={milestoneDraft.deskripsi}
                                            onChange={(e) => {
                                                setMilestoneDraft((prev) => ({ ...prev, deskripsi: e.target.value }));
                                                if (clientError) setClientError('');
                                            }}
                                            placeholder="Masukkan keterangan singkat mengenai peristiwa ini..."
                                            className={textareaClass(false)}
                                        />
                                    </div>

                                    {clientError && (
                                        <p className="text-xs font-medium text-content-negative">{clientError}</p>
                                    )}
                                </div>

                                <div className="px-5 py-3.5 border-t border-stroke-card bg-surface-primary flex items-center justify-end gap-2.5">
                                    <CmsButton
                                        type="button"
                                        hierarchy="secondary"
                                        size="md"
                                        disabled={savingMilestone}
                                        onClick={closeDrawer}
                                    >
                                        Batal
                                    </CmsButton>
                                    <CmsButton
                                        type="submit"
                                        hierarchy="primary"
                                        size="md"
                                        loading={savingMilestone}
                                    >
                                        {savingMilestone ? 'Menyimpan...' : 'Simpan Milestone'}
                                    </CmsButton>
                                </div>
                            </form>
                        </aside>
                    </div>,
                    document.body
                )}

            {/* MODAL KONFIRMASI HAPUS MILESTONE */}
            {deleteIndexTarget !== null &&
                createPortal(
                    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
                        <div
                            className="fixed inset-0 bg-brand-900/40 backdrop-blur-[1px]"
                            onClick={() => !savingMilestone && setDeleteIndexTarget(null)}
                        />

                        <div
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="modal-hapus-milestone-title"
                            className="relative z-[80] w-full max-w-md bg-surface-primary rounded-xl border border-stroke-card shadow-2xl overflow-hidden"
                        >
                            <div className="p-5 space-y-3">
                                <div className="w-10 h-10 rounded-lg bg-negative-100 text-content-negative flex items-center justify-center">
                                    <IconTrash size={20} />
                                </div>
                                <h3 id="modal-hapus-milestone-title" className="text-base font-bold text-content-primary">
                                    Hapus Milestone Sejarah?
                                </h3>
                                <p className="text-sm text-content-secondary leading-relaxed">
                                    Milestone{' '}
                                    <span className="font-semibold text-content-primary">
                                        {daftarMilestone[deleteIndexTarget]?.judul || ''}
                                    </span>{' '}
                                    akan dihapus dari linimasa sejarah sekolah.
                                </p>
                            </div>

                            <div className="px-5 py-3.5 border-t border-stroke-card bg-surface-primary flex items-center justify-end gap-2.5">
                                <CmsButton
                                    type="button"
                                    hierarchy="secondary"
                                    size="md"
                                    disabled={savingMilestone}
                                    onClick={() => setDeleteIndexTarget(null)}
                                >
                                    Batal
                                </CmsButton>
                                <CmsButton
                                    type="button"
                                    hierarchy="primary"
                                    tone="danger"
                                    size="md"
                                    loading={savingMilestone}
                                    onClick={handleConfirmDelete}
                                >
                                    {savingMilestone ? 'Menghapus...' : 'Hapus'}
                                </CmsButton>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
        </AdminLayout>
    );
}
