import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { router, useForm } from '@inertiajs/react';
import {
    IconArrowDown,
    IconArrowUp,
    IconBuilding,
    IconCheck,
    IconDeviceDesktop,
    IconDeviceMobile,
    IconEdit,
    IconEye,
    IconFileCertificate,
    IconListCheck,
    IconPencil,
    IconPlus,
    IconTrash,
    IconX,
} from '@tabler/icons-react';
import AdminLayout from '@/Layouts/AdminLayout';
import CmsButton from '@/Components/Admin/CmsButton';
import ImageDropzoneField from '@/Components/Admin/ImageDropzoneField';

const MAX_MISI = 20;

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
 * Halaman Pengelolaan Tentang Sekolah (CMS Profil Sekolah)
 * - Mode Switcher: Mode Edit <-> Pratinjau Publik (Desktop / Mobile)
 * - Simpan mandiri per seksi: Profil & Pengenalan, Statistik, Visi, Daftar Misi (Drawer), Legalitas
 */
export default function TentangSekolahIndex({ title, tentang }) {
    const [pageMode, setPageMode] = useState('edit');
    const [previewDevice, setPreviewDevice] = useState('desktop');

    // State Drawer & Modal Daftar Misi
    const [misiDrawerOpen, setMisiDrawerOpen] = useState(false);
    const [editingMisiIndex, setEditingMisiIndex] = useState(null);
    const [misiDraft, setMisiDraft] = useState('');
    const [misiClientError, setMisiClientError] = useState('');
    const [savingMisi, setSavingMisi] = useState(false);
    const [reorderingMisi, setReorderingMisi] = useState(false);
    const [deleteMisiIndex, setDeleteMisiIndex] = useState(null);

    const daftarMisi = useMemo(
        () => (Array.isArray(tentang?.poin_misi) ? tentang.poin_misi : []),
        [tentang?.poin_misi]
    );

    // Seksi 1: Profil & Pengenalan Sekolah
    const profilForm = useForm({
        _method: 'put',
        judul_halaman: tentang?.judul_halaman || '',
        sub_judul_halaman: tentang?.sub_judul_halaman || '',
        foto_gedung_sekolah: null,
    });

    const isProfilDirty = useMemo(
        () =>
            profilForm.data.judul_halaman !== (tentang?.judul_halaman || '') ||
            profilForm.data.sub_judul_halaman !== (tentang?.sub_judul_halaman || '') ||
            Boolean(profilForm.data.foto_gedung_sekolah),
        [profilForm.data, tentang]
    );

    const [gedungPreviewUrl, setGedungPreviewUrl] = useState(tentang?.foto_gedung_sekolah || '');
    useEffect(() => {
        if (!profilForm.data.foto_gedung_sekolah) {
            setGedungPreviewUrl(tentang?.foto_gedung_sekolah || '');
            return undefined;
        }
        const objectUrl = URL.createObjectURL(profilForm.data.foto_gedung_sekolah);
        setGedungPreviewUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [profilForm.data.foto_gedung_sekolah, tentang?.foto_gedung_sekolah]);

    // Seksi 2: Statistik Ringkas Sekolah
    const statistikForm = useForm({
        _method: 'put',
        jumlah_jurusan: tentang?.jumlah_jurusan || '',
        jumlah_siswa: tentang?.jumlah_siswa || '',
        jumlah_guru_staf: tentang?.jumlah_guru_staf || '',
        lama_tahun_beroperasi: tentang?.lama_tahun_beroperasi || '',
    });

    const isStatistikDirty = useMemo(
        () =>
            statistikForm.data.jumlah_jurusan !== (tentang?.jumlah_jurusan || '') ||
            statistikForm.data.jumlah_siswa !== (tentang?.jumlah_siswa || '') ||
            statistikForm.data.jumlah_guru_staf !== (tentang?.jumlah_guru_staf || '') ||
            statistikForm.data.lama_tahun_beroperasi !== (tentang?.lama_tahun_beroperasi || ''),
        [statistikForm.data, tentang]
    );

    // Seksi 3: Visi Sekolah
    const visiForm = useForm({
        _method: 'put',
        teks_visi: tentang?.teks_visi || '',
    });

    const isVisiDirty = useMemo(
        () => visiForm.data.teks_visi !== (tentang?.teks_visi || ''),
        [visiForm.data.teks_visi, tentang?.teks_visi]
    );

    // Seksi 4: Legalitas & Izin Operasional
    const legalitasForm = useForm({
        _method: 'put',
        judul_legalitas: tentang?.judul_legalitas || '',
        keterangan_legalitas: tentang?.keterangan_legalitas || '',
        nama_sekolah: tentang?.nama_sekolah || '',
        npsn: tentang?.npsn || '',
        sk_izin_operasional: tentang?.sk_izin_operasional || '',
        jenjang_status: tentang?.jenjang_status || '',
        yayasan_penyelenggara: tentang?.yayasan_penyelenggara || '',
        akreditasi: tentang?.akreditasi || '',
        foto_legalitas: null,
    });

    const isLegalitasDirty = useMemo(
        () =>
            legalitasForm.data.judul_legalitas !== (tentang?.judul_legalitas || '') ||
            legalitasForm.data.keterangan_legalitas !== (tentang?.keterangan_legalitas || '') ||
            legalitasForm.data.nama_sekolah !== (tentang?.nama_sekolah || '') ||
            legalitasForm.data.npsn !== (tentang?.npsn || '') ||
            legalitasForm.data.sk_izin_operasional !== (tentang?.sk_izin_operasional || '') ||
            legalitasForm.data.jenjang_status !== (tentang?.jenjang_status || '') ||
            legalitasForm.data.yayasan_penyelenggara !== (tentang?.yayasan_penyelenggara || '') ||
            legalitasForm.data.akreditasi !== (tentang?.akreditasi || '') ||
            Boolean(legalitasForm.data.foto_legalitas),
        [legalitasForm.data, tentang]
    );

    const [legalitasPreviewUrl, setLegalitasPreviewUrl] = useState(tentang?.foto_legalitas || '');
    useEffect(() => {
        if (!legalitasForm.data.foto_legalitas) {
            setLegalitasPreviewUrl(tentang?.foto_legalitas || '');
            return undefined;
        }
        const objectUrl = URL.createObjectURL(legalitasForm.data.foto_legalitas);
        setLegalitasPreviewUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [legalitasForm.data.foto_legalitas, tentang?.foto_legalitas]);

    const hasUnsavedChanges = isProfilDirty || isStatistikDirty || isVisiDirty || isLegalitasDirty;

    // Lock body scroll & Escape key untuk Drawer/Modal
    useEffect(() => {
        const hasOverlay = misiDrawerOpen || deleteMisiIndex !== null;
        document.body.style.overflow = hasOverlay ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [misiDrawerOpen, deleteMisiIndex]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key !== 'Escape') {
                return;
            }
            if (deleteMisiIndex !== null && !savingMisi) {
                setDeleteMisiIndex(null);
                return;
            }
            if (misiDrawerOpen && !savingMisi) {
                closeMisiDrawer();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [misiDrawerOpen, deleteMisiIndex, savingMisi]);

    // Handlers Form Mandiri
    const handleSaveProfil = (e) => {
        e.preventDefault();
        profilForm.post('/admin/tentang-sekolah/profil', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: (page) => {
                const updated = page?.props?.tentang;
                profilForm.setData({
                    _method: 'put',
                    judul_halaman: updated?.judul_halaman ?? profilForm.data.judul_halaman.trim(),
                    sub_judul_halaman: updated?.sub_judul_halaman ?? profilForm.data.sub_judul_halaman.trim(),
                    foto_gedung_sekolah: null,
                });
            },
        });
    };

    const handleResetProfil = () => {
        profilForm.setData({
            _method: 'put',
            judul_halaman: tentang?.judul_halaman || '',
            sub_judul_halaman: tentang?.sub_judul_halaman || '',
            foto_gedung_sekolah: null,
        });
        profilForm.clearErrors();
    };

    const handleSaveStatistik = (e) => {
        e.preventDefault();
        statistikForm.post('/admin/tentang-sekolah/statistik', {
            preserveScroll: true,
            onSuccess: (page) => {
                const updated = page?.props?.tentang;
                statistikForm.setData({
                    _method: 'put',
                    jumlah_jurusan: updated?.jumlah_jurusan ?? statistikForm.data.jumlah_jurusan.trim(),
                    jumlah_siswa: updated?.jumlah_siswa ?? statistikForm.data.jumlah_siswa.trim(),
                    jumlah_guru_staf: updated?.jumlah_guru_staf ?? statistikForm.data.jumlah_guru_staf.trim(),
                    lama_tahun_beroperasi: updated?.lama_tahun_beroperasi ?? statistikForm.data.lama_tahun_beroperasi.trim(),
                });
            },
        });
    };

    const handleResetStatistik = () => {
        statistikForm.setData({
            _method: 'put',
            jumlah_jurusan: tentang?.jumlah_jurusan || '',
            jumlah_siswa: tentang?.jumlah_siswa || '',
            jumlah_guru_staf: tentang?.jumlah_guru_staf || '',
            lama_tahun_beroperasi: tentang?.lama_tahun_beroperasi || '',
        });
        statistikForm.clearErrors();
    };

    const handleSaveVisi = (e) => {
        e.preventDefault();
        visiForm.post('/admin/tentang-sekolah/visi', {
            preserveScroll: true,
            onSuccess: (page) => {
                const updated = page?.props?.tentang;
                visiForm.setData({
                    _method: 'put',
                    teks_visi: updated?.teks_visi ?? visiForm.data.teks_visi.trim(),
                });
            },
        });
    };

    const handleResetVisi = () => {
        visiForm.setData({
            _method: 'put',
            teks_visi: tentang?.teks_visi || '',
        });
        visiForm.clearErrors();
    };

    const handleSaveLegalitas = (e) => {
        e.preventDefault();
        legalitasForm.post('/admin/tentang-sekolah/legalitas', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: (page) => {
                const updated = page?.props?.tentang;
                legalitasForm.setData({
                    _method: 'put',
                    judul_legalitas: updated?.judul_legalitas ?? legalitasForm.data.judul_legalitas.trim(),
                    keterangan_legalitas: updated?.keterangan_legalitas ?? legalitasForm.data.keterangan_legalitas.trim(),
                    nama_sekolah: updated?.nama_sekolah ?? legalitasForm.data.nama_sekolah.trim(),
                    npsn: updated?.npsn ?? legalitasForm.data.npsn.trim(),
                    sk_izin_operasional: updated?.sk_izin_operasional ?? legalitasForm.data.sk_izin_operasional.trim(),
                    jenjang_status: updated?.jenjang_status ?? legalitasForm.data.jenjang_status.trim(),
                    yayasan_penyelenggara: updated?.yayasan_penyelenggara ?? legalitasForm.data.yayasan_penyelenggara.trim(),
                    akreditasi: updated?.akreditasi ?? legalitasForm.data.akreditasi.trim(),
                    foto_legalitas: null,
                });
            },
        });
    };

    const handleResetLegalitas = () => {
        legalitasForm.setData({
            _method: 'put',
            judul_legalitas: tentang?.judul_legalitas || '',
            keterangan_legalitas: tentang?.keterangan_legalitas || '',
            nama_sekolah: tentang?.nama_sekolah || '',
            npsn: tentang?.npsn || '',
            sk_izin_operasional: tentang?.sk_izin_operasional || '',
            jenjang_status: tentang?.jenjang_status || '',
            yayasan_penyelenggara: tentang?.yayasan_penyelenggara || '',
            akreditasi: tentang?.akreditasi || '',
            foto_legalitas: null,
        });
        legalitasForm.clearErrors();
    };

    // Handlers Drawer Misi
    const openCreateMisi = () => {
        setEditingMisiIndex(null);
        setMisiDraft('');
        setMisiClientError('');
        setMisiDrawerOpen(true);
    };

    const openEditMisi = (index) => {
        setEditingMisiIndex(index);
        setMisiDraft(daftarMisi[index] || '');
        setMisiClientError('');
        setMisiDrawerOpen(true);
    };

    const closeMisiDrawer = () => {
        setMisiDrawerOpen(false);
        setEditingMisiIndex(null);
        setMisiDraft('');
        setMisiClientError('');
    };

    const persistMisiList = (nextList, onSuccessCallback, { isReorder = false } = {}) => {
        setSavingMisi(true);
        if (isReorder) {
            setReorderingMisi(true);
        }
        router.put(
            '/admin/tentang-sekolah/misi',
            { poin_misi: nextList },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => onSuccessCallback?.(),
                onError: (errs) => {
                    const firstErr = Object.values(errs)[0];
                    if (firstErr) {
                        setMisiClientError(String(firstErr));
                    }
                },
                onFinish: () => {
                    setSavingMisi(false);
                    setReorderingMisi(false);
                },
            }
        );
    };

    const handleSubmitMisiDrawer = (e) => {
        e.preventDefault();
        const trimmed = misiDraft.trim();
        if (!trimmed) {
            setMisiClientError('Teks poin misi wajib diisi.');
            return;
        }
        if (trimmed.length > 500) {
            setMisiClientError('Poin misi maksimal 500 karakter.');
            return;
        }

        const nextList = [...daftarMisi];
        if (editingMisiIndex !== null && editingMisiIndex >= 0 && editingMisiIndex < nextList.length) {
            nextList[editingMisiIndex] = trimmed;
        } else {
            nextList.push(trimmed);
        }

        persistMisiList(nextList, closeMisiDrawer);
    };

    const handleConfirmDeleteMisi = () => {
        if (deleteMisiIndex === null || savingMisi) {
            return;
        }
        const nextList = daftarMisi.filter((_, idx) => idx !== deleteMisiIndex);
        persistMisiList(nextList, () => setDeleteMisiIndex(null));
    };

    const handleMoveMisi = (index, direction) => {
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= daftarMisi.length || savingMisi) {
            return;
        }
        const nextList = [...daftarMisi];
        const [moved] = nextList.splice(index, 1);
        nextList.splice(targetIndex, 0, moved);
        persistMisiList(nextList, undefined, { isReorder: true });
    };

    return (
        <AdminLayout
            title={title || 'Tentang Sekolah'}
            subtitle="Kelola profil pengenalan sekolah, statistik ringkas, visi dan misi, serta informasi legalitas resmi."
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
                    {/* CARD 1: PROFIL & PENGENALAN SEKOLAH */}
                    <section className="bg-surface-primary border border-stroke-card rounded-xl shadow-admin-card overflow-hidden">
                        <div className="px-5 py-3.5 border-b border-stroke-card flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h2 className="text-base font-bold text-content-primary">
                                    Profil &amp; Pengenalan Sekolah
                                </h2>
                                <p className="text-xs text-content-secondary mt-0.5">
                                    Judul utama, deskripsi pengenalan, dan foto gedung sekolah yang tampil di bagian atas halaman.
                                </p>
                            </div>
                            {isProfilDirty && <UnsavedBadge />}
                        </div>

                        <form onSubmit={handleSaveProfil} noValidate>
                            <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                                <div className="lg:col-span-7 space-y-4">
                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label htmlFor="judul_halaman" className="block text-sm font-medium text-content-primary">
                                                Judul Halaman <span className="text-content-negative">*</span>
                                            </label>
                                            <span className="text-xs text-content-tertiary">
                                                {profilForm.data.judul_halaman.length}/200
                                            </span>
                                        </div>
                                        <input
                                            id="judul_halaman"
                                            type="text"
                                            maxLength={200}
                                            value={profilForm.data.judul_halaman}
                                            onChange={(e) => profilForm.setData('judul_halaman', e.target.value)}
                                            placeholder="Masukkan judul utama halaman tentang sekolah..."
                                            className={inputClass(Boolean(profilForm.errors.judul_halaman))}
                                        />
                                        {profilForm.errors.judul_halaman && (
                                            <p className="mt-1 text-xs font-medium text-content-negative">
                                                {profilForm.errors.judul_halaman}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label htmlFor="sub_judul_halaman" className="block text-sm font-medium text-content-primary">
                                                Deskripsi Pengenalan Sekolah <span className="text-content-negative">*</span>
                                            </label>
                                            <span className="text-xs text-content-tertiary">
                                                {profilForm.data.sub_judul_halaman.length}/3000
                                            </span>
                                        </div>
                                        <textarea
                                            id="sub_judul_halaman"
                                            rows={6}
                                            maxLength={3000}
                                            value={profilForm.data.sub_judul_halaman}
                                            onChange={(e) => profilForm.setData('sub_judul_halaman', e.target.value)}
                                            placeholder="Masukkan deskripsi pengenalan singkat profil sekolah..."
                                            className={textareaClass(Boolean(profilForm.errors.sub_judul_halaman))}
                                        />
                                        <p className="mt-1 text-xs text-content-tertiary">
                                            Jelaskan fokus pendidikan, pendekatan teori dan praktik, serta karakter lulusan secara ringkas.
                                        </p>
                                        {profilForm.errors.sub_judul_halaman && (
                                            <p className="mt-1 text-xs font-medium text-content-negative">
                                                {profilForm.errors.sub_judul_halaman}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="lg:col-span-5">
                                    <ImageDropzoneField
                                        id="foto_gedung_sekolah"
                                        label="Foto Gedung Sekolah (16:9)"
                                        helperText="Rasio lanskap 16:9 · JPG, PNG, WebP · Maks. 3 MB"
                                        aspectClass="aspect-video"
                                        previewMaxWidthClass="max-w-[320px]"
                                        previewUrl={gedungPreviewUrl}
                                        selectedFile={profilForm.data.foto_gedung_sekolah}
                                        serverError={profilForm.errors.foto_gedung_sekolah}
                                        onFileSelect={(file) => profilForm.setData('foto_gedung_sekolah', file)}
                                        onClearFile={() => profilForm.setData('foto_gedung_sekolah', null)}
                                    />
                                </div>
                            </div>

                            <div className="px-5 py-3.5 border-t border-stroke-card bg-surface-primary flex flex-wrap items-center justify-end gap-2.5">
                                {isProfilDirty && (
                                    <CmsButton
                                        type="button"
                                        hierarchy="tertiary"
                                        size="md"
                                        disabled={profilForm.processing}
                                        onClick={handleResetProfil}
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
                                    {profilForm.processing ? 'Menyimpan...' : 'Simpan Profil Sekolah'}
                                </CmsButton>
                            </div>
                        </form>
                    </section>

                    {/* CARD 2: STATISTIK RINGKAS SEKOLAH */}
                    <section className="bg-surface-primary border border-stroke-card rounded-xl shadow-admin-card overflow-hidden">
                        <div className="px-5 py-3.5 border-b border-stroke-card flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h2 className="text-base font-bold text-content-primary">
                                    Statistik Ringkas Sekolah
                                </h2>
                                <p className="text-xs text-content-secondary mt-0.5">
                                    Angka sorotan pencapaian sekolah yang ditampilkan dalam kartu statistik publik.
                                </p>
                            </div>
                            {isStatistikDirty && <UnsavedBadge />}
                        </div>

                        <form onSubmit={handleSaveStatistik} noValidate>
                            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div>
                                    <label htmlFor="jumlah_jurusan" className="block text-sm font-medium text-content-primary mb-1.5">
                                        Jumlah Jurusan <span className="text-content-negative">*</span>
                                    </label>
                                    <input
                                        id="jumlah_jurusan"
                                        type="text"
                                        maxLength={50}
                                        value={statistikForm.data.jumlah_jurusan}
                                        onChange={(e) => statistikForm.setData('jumlah_jurusan', e.target.value)}
                                        placeholder="Masukkan jumlah jurusan..."
                                        className={inputClass(Boolean(statistikForm.errors.jumlah_jurusan))}
                                    />
                                    {statistikForm.errors.jumlah_jurusan && (
                                        <p className="mt-1 text-xs font-medium text-content-negative">
                                            {statistikForm.errors.jumlah_jurusan}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="jumlah_siswa" className="block text-sm font-medium text-content-primary mb-1.5">
                                        Jumlah Siswa <span className="text-content-negative">*</span>
                                    </label>
                                    <input
                                        id="jumlah_siswa"
                                        type="text"
                                        maxLength={50}
                                        value={statistikForm.data.jumlah_siswa}
                                        onChange={(e) => statistikForm.setData('jumlah_siswa', e.target.value)}
                                        placeholder="Masukkan jumlah siswa..."
                                        className={inputClass(Boolean(statistikForm.errors.jumlah_siswa))}
                                    />
                                    {statistikForm.errors.jumlah_siswa && (
                                        <p className="mt-1 text-xs font-medium text-content-negative">
                                            {statistikForm.errors.jumlah_siswa}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="jumlah_guru_staf" className="block text-sm font-medium text-content-primary mb-1.5">
                                        Jumlah Guru &amp; Staf <span className="text-content-negative">*</span>
                                    </label>
                                    <input
                                        id="jumlah_guru_staf"
                                        type="text"
                                        maxLength={50}
                                        value={statistikForm.data.jumlah_guru_staf}
                                        onChange={(e) => statistikForm.setData('jumlah_guru_staf', e.target.value)}
                                        placeholder="Masukkan jumlah guru & staf..."
                                        className={inputClass(Boolean(statistikForm.errors.jumlah_guru_staf))}
                                    />
                                    {statistikForm.errors.jumlah_guru_staf && (
                                        <p className="mt-1 text-xs font-medium text-content-negative">
                                            {statistikForm.errors.jumlah_guru_staf}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="lama_tahun_beroperasi" className="block text-sm font-medium text-content-primary mb-1.5">
                                        Lama Beroperasi (Tahun) <span className="text-content-negative">*</span>
                                    </label>
                                    <input
                                        id="lama_tahun_beroperasi"
                                        type="text"
                                        maxLength={50}
                                        value={statistikForm.data.lama_tahun_beroperasi}
                                        onChange={(e) => statistikForm.setData('lama_tahun_beroperasi', e.target.value)}
                                        placeholder="Masukkan lama beroperasi..."
                                        className={inputClass(Boolean(statistikForm.errors.lama_tahun_beroperasi))}
                                    />
                                    {statistikForm.errors.lama_tahun_beroperasi && (
                                        <p className="mt-1 text-xs font-medium text-content-negative">
                                            {statistikForm.errors.lama_tahun_beroperasi}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="px-5 py-3.5 border-t border-stroke-card bg-surface-primary flex flex-wrap items-center justify-end gap-2.5">
                                {isStatistikDirty && (
                                    <CmsButton
                                        type="button"
                                        hierarchy="tertiary"
                                        size="md"
                                        disabled={statistikForm.processing}
                                        onClick={handleResetStatistik}
                                    >
                                        Batalkan Perubahan
                                    </CmsButton>
                                )}
                                <CmsButton
                                    type="submit"
                                    hierarchy="primary"
                                    size="md"
                                    loading={statistikForm.processing}
                                >
                                    {statistikForm.processing ? 'Menyimpan...' : 'Simpan Statistik'}
                                </CmsButton>
                            </div>
                        </form>
                    </section>

                    {/* CARD 3: VISI SEKOLAH */}
                    <section className="bg-surface-primary border border-stroke-card rounded-xl shadow-admin-card overflow-hidden">
                        <div className="px-5 py-3.5 border-b border-stroke-card flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h2 className="text-base font-bold text-content-primary">
                                    Visi Sekolah
                                </h2>
                                <p className="text-xs text-content-secondary mt-0.5">
                                    Rumusan tujuan jangka panjang dan cita-cita sekolah.
                                </p>
                            </div>
                            {isVisiDirty && <UnsavedBadge />}
                        </div>

                        <form onSubmit={handleSaveVisi} noValidate>
                            <div className="p-5">
                                <div className="flex items-center justify-between mb-1.5">
                                    <label htmlFor="teks_visi" className="block text-sm font-medium text-content-primary">
                                        Teks Visi <span className="text-content-negative">*</span>
                                    </label>
                                    <span className="text-xs text-content-tertiary">
                                        {visiForm.data.teks_visi.length}/3000
                                    </span>
                                </div>
                                <textarea
                                    id="teks_visi"
                                    rows={4}
                                    maxLength={3000}
                                    value={visiForm.data.teks_visi}
                                    onChange={(e) => visiForm.setData('teks_visi', e.target.value)}
                                    placeholder="Masukkan rumusan visi sekolah..."
                                    className={textareaClass(Boolean(visiForm.errors.teks_visi))}
                                />
                                {visiForm.errors.teks_visi && (
                                    <p className="mt-1 text-xs font-medium text-content-negative">
                                        {visiForm.errors.teks_visi}
                                    </p>
                                )}
                            </div>

                            <div className="px-5 py-3.5 border-t border-stroke-card bg-surface-primary flex flex-wrap items-center justify-end gap-2.5">
                                {isVisiDirty && (
                                    <CmsButton
                                        type="button"
                                        hierarchy="tertiary"
                                        size="md"
                                        disabled={visiForm.processing}
                                        onClick={handleResetVisi}
                                    >
                                        Batalkan Perubahan
                                    </CmsButton>
                                )}
                                <CmsButton
                                    type="submit"
                                    hierarchy="primary"
                                    size="md"
                                    loading={visiForm.processing}
                                >
                                    {visiForm.processing ? 'Menyimpan...' : 'Simpan Visi'}
                                </CmsButton>
                            </div>
                        </form>
                    </section>

                    {/* CARD 4: DAFTAR POIN MISI SEKOLAH */}
                    <section className="bg-surface-primary border border-stroke-card rounded-xl shadow-admin-card overflow-hidden">
                        <div className="px-5 py-3.5 border-b border-stroke-card flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h2 className="text-base font-bold text-content-primary">
                                        Daftar Misi Sekolah
                                    </h2>
                                    <span className="text-xs px-2.5 py-0.5 rounded-full border border-brand-500/20 bg-brand-500/10 text-brand-600 font-semibold">
                                        {daftarMisi.length} / {MAX_MISI}
                                    </span>
                                    {reorderingMisi && (
                                        <span className="text-xs text-brand-600 font-medium">
                                            Menyimpan urutan...
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-content-secondary mt-0.5">
                                    Kelola poin misi sekolah beserta urutan tampilnya. Perubahan langsung tersimpan.
                                </p>
                            </div>

                            <CmsButton
                                type="button"
                                hierarchy="primary"
                                size="md"
                                prefixIcon={<IconPlus size={16} />}
                                disabled={daftarMisi.length >= MAX_MISI || savingMisi}
                                onClick={openCreateMisi}
                            >
                                Tambah Misi
                            </CmsButton>
                        </div>

                        {daftarMisi.length === 0 ? (
                            <div className="p-10 text-center flex flex-col items-center space-y-2.5">
                                <p className="text-base font-semibold text-content-primary">
                                    Belum ada poin misi
                                </p>
                                <p className="text-sm text-content-secondary max-w-md leading-relaxed">
                                    Tambahkan poin misi sekolah agar pengunjung memahami langkah strategis sekolah.
                                </p>
                                <div className="pt-1">
                                    <CmsButton
                                        type="button"
                                        hierarchy="secondary"
                                        size="sm"
                                        prefixIcon={<IconPlus size={14} className="text-brand-500" />}
                                        onClick={openCreateMisi}
                                    >
                                        Tambah Misi Pertama
                                    </CmsButton>
                                </div>
                            </div>
                        ) : (
                            <div className="divide-y divide-stroke-card">
                                {daftarMisi.map((poin, idx) => (
                                    <div
                                        key={`${idx}-${poin.slice(0, 16)}`}
                                        className="px-5 py-3.5 flex items-start justify-between gap-4 hover:bg-brand-50/50 transition-colors"
                                    >
                                        <div className="min-w-0 flex-1 flex items-start gap-2.5">
                                            <span className="text-xs font-bold text-brand-500 mt-0.5 shrink-0">
                                                #{idx + 1}
                                            </span>
                                            <p className="text-sm text-content-primary leading-relaxed">
                                                {poin}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-1 shrink-0">
                                            <CmsButton
                                                hierarchy="tertiary"
                                                tone="brand"
                                                size="icon-sm"
                                                title="Naikkan urutan"
                                                aria-label="Naikkan urutan"
                                                disabled={idx === 0 || savingMisi || reorderingMisi}
                                                onClick={() => handleMoveMisi(idx, -1)}
                                                prefixIcon={<IconArrowUp size={15} />}
                                            />
                                            <CmsButton
                                                hierarchy="tertiary"
                                                tone="brand"
                                                size="icon-sm"
                                                title="Turunkan urutan"
                                                aria-label="Turunkan urutan"
                                                disabled={idx === daftarMisi.length - 1 || savingMisi || reorderingMisi}
                                                onClick={() => handleMoveMisi(idx, 1)}
                                                prefixIcon={<IconArrowDown size={15} />}
                                            />
                                            <CmsButton
                                                hierarchy="tertiary"
                                                tone="warning"
                                                size="icon-sm"
                                                title="Edit poin misi"
                                                aria-label="Edit poin misi"
                                                disabled={savingMisi}
                                                onClick={() => openEditMisi(idx)}
                                                prefixIcon={<IconEdit size={15} />}
                                            />
                                            <CmsButton
                                                hierarchy="tertiary"
                                                tone="danger"
                                                size="icon-sm"
                                                title="Hapus poin misi"
                                                aria-label="Hapus poin misi"
                                                disabled={savingMisi}
                                                onClick={() => setDeleteMisiIndex(idx)}
                                                prefixIcon={<IconTrash size={15} />}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* CARD 5: LEGALITAS & IZIN OPERASIONAL */}
                    <section className="bg-surface-primary border border-stroke-card rounded-xl shadow-admin-card overflow-hidden">
                        <div className="px-5 py-3.5 border-b border-stroke-card flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h2 className="text-base font-bold text-content-primary">
                                    Legalitas &amp; Izin Operasional
                                </h2>
                                <p className="text-xs text-content-secondary mt-0.5">
                                    Informasi legalitas pendirian, nomor SK resmi, dan foto dokumentasi sertifikat/izin.
                                </p>
                            </div>
                            {isLegalitasDirty && <UnsavedBadge />}
                        </div>

                        <form onSubmit={handleSaveLegalitas} noValidate>
                            <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                                <div className="lg:col-span-7 space-y-4">
                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label htmlFor="judul_legalitas" className="block text-sm font-medium text-content-primary">
                                                Judul Legalitas <span className="text-content-negative">*</span>
                                            </label>
                                            <span className="text-xs text-content-tertiary">
                                                {legalitasForm.data.judul_legalitas.length}/200
                                            </span>
                                        </div>
                                        <input
                                            id="judul_legalitas"
                                            type="text"
                                            maxLength={200}
                                            value={legalitasForm.data.judul_legalitas}
                                            onChange={(e) => legalitasForm.setData('judul_legalitas', e.target.value)}
                                            placeholder="Masukkan judul seksi legalitas sekolah..."
                                            className={inputClass(Boolean(legalitasForm.errors.judul_legalitas))}
                                        />
                                        {legalitasForm.errors.judul_legalitas && (
                                            <p className="mt-1 text-xs font-medium text-content-negative">
                                                {legalitasForm.errors.judul_legalitas}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label htmlFor="keterangan_legalitas" className="block text-sm font-medium text-content-primary">
                                                Keterangan Legalitas <span className="text-content-negative">*</span>
                                            </label>
                                            <span className="text-xs text-content-tertiary">
                                                {legalitasForm.data.keterangan_legalitas.length}/5000
                                            </span>
                                        </div>
                                        <textarea
                                            id="keterangan_legalitas"
                                            rows={6}
                                            maxLength={5000}
                                            value={legalitasForm.data.keterangan_legalitas}
                                            onChange={(e) => legalitasForm.setData('keterangan_legalitas', e.target.value)}
                                            placeholder="Masukkan rincian nomor SK izin operasional dan naungan lembaga..."
                                            className={textareaClass(Boolean(legalitasForm.errors.keterangan_legalitas))}
                                        />
                                        {legalitasForm.errors.keterangan_legalitas && (
                                            <p className="mt-1 text-xs font-medium text-content-negative">
                                                {legalitasForm.errors.keterangan_legalitas}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                                        {[
                                            { id: 'nama_sekolah', label: 'Nama Sekolah', max: 200, placeholder: 'Masukkan nama resmi sekolah...' },
                                            { id: 'npsn', label: 'NPSN', max: 30, placeholder: 'Masukkan nomor NPSN...' },
                                            { id: 'sk_izin_operasional', label: 'SK Izin Operasional', max: 200, placeholder: 'Masukkan nomor SK izin operasional...' },
                                            { id: 'jenjang_status', label: 'Jenjang / Status', max: 100, placeholder: 'Masukkan jenjang dan status sekolah...' },
                                            { id: 'yayasan_penyelenggara', label: 'Yayasan Penyelenggara', max: 200, placeholder: 'Masukkan nama yayasan penyelenggara...' },
                                            { id: 'akreditasi', label: 'Akreditasi', max: 50, placeholder: 'Masukkan peringkat akreditasi...' },
                                        ].map((field) => (
                                            <div key={field.id}>
                                                <label htmlFor={field.id} className="block text-sm font-medium text-content-primary mb-1.5">
                                                    {field.label}
                                                </label>
                                                <input
                                                    id={field.id}
                                                    type="text"
                                                    maxLength={field.max}
                                                    value={legalitasForm.data[field.id]}
                                                    onChange={(e) => legalitasForm.setData(field.id, e.target.value)}
                                                    placeholder={field.placeholder}
                                                    className={inputClass(Boolean(legalitasForm.errors[field.id]))}
                                                />
                                                {legalitasForm.errors[field.id] && (
                                                    <p className="mt-1 text-xs font-medium text-content-negative">
                                                        {legalitasForm.errors[field.id]}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="lg:col-span-5">
                                    <ImageDropzoneField
                                        id="foto_legalitas"
                                        label="Foto Dokumen Legalitas (16:9)"
                                        helperText="Rasio lanskap 16:9 · JPG, PNG, WebP · Maks. 3 MB"
                                        aspectClass="aspect-video"
                                        previewMaxWidthClass="max-w-[320px]"
                                        previewUrl={legalitasPreviewUrl}
                                        selectedFile={legalitasForm.data.foto_legalitas}
                                        serverError={legalitasForm.errors.foto_legalitas}
                                        onFileSelect={(file) => legalitasForm.setData('foto_legalitas', file)}
                                        onClearFile={() => legalitasForm.setData('foto_legalitas', null)}
                                    />
                                </div>
                            </div>

                            <div className="px-5 py-3.5 border-t border-stroke-card bg-surface-primary flex flex-wrap items-center justify-end gap-2.5">
                                {isLegalitasDirty && (
                                    <CmsButton
                                        type="button"
                                        hierarchy="tertiary"
                                        size="md"
                                        disabled={legalitasForm.processing}
                                        onClick={handleResetLegalitas}
                                    >
                                        Batalkan Perubahan
                                    </CmsButton>
                                )}
                                <CmsButton
                                    type="submit"
                                    hierarchy="primary"
                                    size="md"
                                    loading={legalitasForm.processing}
                                >
                                    {legalitasForm.processing ? 'Menyimpan...' : 'Simpan Legalitas'}
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
                                Pratinjau Tampilan Tentang Sekolah
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
                            {/* Preview Profil & Gedung */}
                            <div className={`p-6 sm:p-10 border-b border-stroke-card grid gap-6 items-center ${
                                previewDevice === 'mobile' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-12'
                            }`}>
                                <div className={previewDevice === 'mobile' ? 'space-y-3' : 'md:col-span-7 space-y-3'}>
                                    <span className="inline-block px-2.5 py-1 rounded-md border border-brand-500/20 bg-brand-500/10 text-brand-600 text-xs font-medium">
                                        Profil Sekolah
                                    </span>
                                    <h3 className="text-xl sm:text-2xl font-bold text-content-primary leading-tight">
                                        {profilForm.data.judul_halaman || 'Judul halaman belum diisi'}
                                    </h3>
                                    <p className="text-sm text-content-secondary leading-relaxed whitespace-pre-line">
                                        {profilForm.data.sub_judul_halaman || 'Deskripsi pengenalan belum diisi.'}
                                    </p>
                                </div>

                                <div className={previewDevice === 'mobile' ? '' : 'md:col-span-5'}>
                                    <div className="aspect-video rounded-xl border border-stroke-card bg-surface-secondary overflow-hidden flex items-center justify-center">
                                        {gedungPreviewUrl ? (
                                            <img
                                                src={gedungPreviewUrl}
                                                alt="Pratinjau Gedung Sekolah"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 text-content-disabled p-4">
                                                <IconBuilding size={32} />
                                                <span className="text-xs text-content-tertiary">Foto Gedung Sekolah</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Preview Statistik */}
                            <div className={`p-6 sm:p-8 bg-surface-secondary border-b border-stroke-card grid gap-4 ${
                                previewDevice === 'mobile' ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'
                            }`}>
                                {[
                                    { label: 'Program Keahlian', value: statistikForm.data.jumlah_jurusan || '-' },
                                    { label: 'Peserta Didik', value: statistikForm.data.jumlah_siswa || '-' },
                                    { label: 'Guru & Staf', value: statistikForm.data.jumlah_guru_staf || '-' },
                                    { label: 'Tahun Beroperasi', value: statistikForm.data.lama_tahun_beroperasi || '-' },
                                ].map((item) => (
                                    <div key={item.label} className="bg-surface-primary border border-stroke-card rounded-lg p-4 text-center">
                                        <div className="text-xl font-bold text-brand-600">{item.value}</div>
                                        <div className="text-xs text-content-secondary mt-1">{item.label}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Preview Visi & Misi */}
                            <div className={`p-6 sm:p-10 border-b border-stroke-card grid gap-6 ${
                                previewDevice === 'mobile' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-12'
                            }`}>
                                <div className={previewDevice === 'mobile' ? 'space-y-2' : 'md:col-span-5 space-y-2'}>
                                    <h4 className="text-base font-bold text-content-primary">Visi Sekolah</h4>
                                    <p className="text-sm text-content-secondary leading-relaxed">
                                        {visiForm.data.teks_visi || 'Teks visi belum diisi.'}
                                    </p>
                                </div>

                                <div className={previewDevice === 'mobile' ? 'space-y-2' : 'md:col-span-7 space-y-2'}>
                                    <h4 className="text-base font-bold text-content-primary">Misi Sekolah</h4>
                                    {daftarMisi.length === 0 ? (
                                        <p className="text-sm text-content-tertiary">Belum ada poin misi.</p>
                                    ) : (
                                        <ul className="space-y-2">
                                            {daftarMisi.map((misi, idx) => (
                                                <li key={idx} className="flex items-start gap-2.5 text-sm text-content-secondary">
                                                    <IconCheck size={16} className="text-brand-500 shrink-0 mt-0.5" />
                                                    <span>{misi}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>

                            {/* Preview Legalitas */}
                            <div className={`p-6 sm:p-10 grid gap-6 items-center ${
                                previewDevice === 'mobile' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-12'
                            }`}>
                                <div className={previewDevice === 'mobile' ? '' : 'md:col-span-5'}>
                                    <div className="aspect-video rounded-xl border border-stroke-card bg-surface-secondary overflow-hidden flex items-center justify-center">
                                        {legalitasPreviewUrl ? (
                                            <img
                                                src={legalitasPreviewUrl}
                                                alt="Pratinjau Legalitas"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 text-content-disabled p-4">
                                                <IconFileCertificate size={32} />
                                                <span className="text-xs text-content-tertiary">Foto Legalitas</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className={previewDevice === 'mobile' ? 'space-y-3' : 'md:col-span-7 space-y-3'}>
                                    <span className="inline-block px-2.5 py-1 rounded-md border border-brand-500/20 bg-brand-500/10 text-brand-600 text-xs font-medium">
                                        Legalitas Resmi
                                    </span>
                                    <h4 className="text-base sm:text-lg font-bold text-content-primary">
                                        {legalitasForm.data.judul_legalitas || 'Judul legalitas belum diisi'}
                                    </h4>
                                    <p className="text-sm text-content-secondary leading-relaxed whitespace-pre-line">
                                        {legalitasForm.data.keterangan_legalitas || 'Keterangan legalitas belum diisi.'}
                                    </p>
                                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                        {[
                                            { label: 'Nama Sekolah', value: legalitasForm.data.nama_sekolah },
                                            { label: 'NPSN', value: legalitasForm.data.npsn },
                                            { label: 'SK Izin Operasional', value: legalitasForm.data.sk_izin_operasional },
                                            { label: 'Jenjang / Status', value: legalitasForm.data.jenjang_status },
                                            { label: 'Yayasan Penyelenggara', value: legalitasForm.data.yayasan_penyelenggara },
                                            { label: 'Akreditasi', value: legalitasForm.data.akreditasi },
                                        ].map((item) => (
                                            <div key={item.label} className="p-2.5 rounded-lg bg-surface-secondary border border-stroke-card">
                                                <dt className="text-xs text-content-tertiary">{item.label}</dt>
                                                <dd className="text-sm font-semibold text-content-primary mt-0.5">
                                                    {item.value || '-'}
                                                </dd>
                                            </div>
                                        ))}
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* SLIDE-OVER DRAWER TAMBAH / EDIT MISI */}
            {misiDrawerOpen &&
                createPortal(
                    <div className="fixed inset-0 z-[60] flex justify-end">
                        <div
                            className="fixed inset-0 bg-brand-900/35 backdrop-blur-[1px]"
                            onClick={() => !savingMisi && closeMisiDrawer()}
                        />

                        <aside
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="drawer-misi-title"
                            className="relative z-[70] w-full max-w-md bg-surface-primary h-full shadow-2xl border-l border-stroke-card flex flex-col"
                        >
                            <div className="px-5 py-4 border-b border-stroke-card flex items-center justify-between gap-3">
                                <div>
                                    <h3 id="drawer-misi-title" className="text-base sm:text-lg font-bold text-content-primary">
                                        {editingMisiIndex !== null ? 'Edit Poin Misi' : 'Tambah Poin Misi'}
                                    </h3>
                                    <p className="text-xs text-content-secondary mt-0.5">
                                        Tuliskan satu poin misi yang jelas dan terukur.
                                    </p>
                                </div>
                                <CmsButton
                                    hierarchy="tertiary"
                                    size="icon-sm"
                                    aria-label="Tutup panel"
                                    disabled={savingMisi}
                                    onClick={closeMisiDrawer}
                                >
                                    <IconX size={18} />
                                </CmsButton>
                            </div>

                            <form onSubmit={handleSubmitMisiDrawer} className="flex-1 flex flex-col overflow-hidden" noValidate>
                                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label htmlFor="poin_misi_input" className="block text-sm font-medium text-content-primary">
                                                Isi Poin Misi <span className="text-content-negative">*</span>
                                            </label>
                                            <span className="text-xs text-content-tertiary">
                                                {misiDraft.length}/500
                                            </span>
                                        </div>
                                        <textarea
                                            id="poin_misi_input"
                                            rows={5}
                                            maxLength={500}
                                            value={misiDraft}
                                            onChange={(e) => {
                                                setMisiDraft(e.target.value);
                                                if (misiClientError) {
                                                    setMisiClientError('');
                                                }
                                            }}
                                            placeholder="Masukkan teks poin misi sekolah..."
                                            className={textareaClass(Boolean(misiClientError))}
                                        />
                                        {misiClientError && (
                                            <p className="mt-1 text-xs font-medium text-content-negative">
                                                {misiClientError}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="px-5 py-3.5 border-t border-stroke-card bg-surface-primary flex items-center justify-end gap-2.5">
                                    <CmsButton
                                        type="button"
                                        hierarchy="secondary"
                                        size="md"
                                        disabled={savingMisi}
                                        onClick={closeMisiDrawer}
                                    >
                                        Batal
                                    </CmsButton>
                                    <CmsButton
                                        type="submit"
                                        hierarchy="primary"
                                        size="md"
                                        loading={savingMisi}
                                    >
                                        {savingMisi ? 'Menyimpan...' : 'Simpan Misi'}
                                    </CmsButton>
                                </div>
                            </form>
                        </aside>
                    </div>,
                    document.body
                )}

            {/* MODAL KONFIRMASI HAPUS POIN MISI */}
            {deleteMisiIndex !== null &&
                createPortal(
                    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
                        <div
                            className="fixed inset-0 bg-brand-900/40 backdrop-blur-[1px]"
                            onClick={() => !savingMisi && setDeleteMisiIndex(null)}
                        />

                        <div
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="modal-hapus-misi-title"
                            className="relative z-[80] w-full max-w-md bg-surface-primary rounded-xl border border-stroke-card shadow-2xl overflow-hidden"
                        >
                            <div className="p-5 space-y-3">
                                <div className="w-10 h-10 rounded-lg bg-negative-100 text-content-negative flex items-center justify-center">
                                    <IconTrash size={20} />
                                </div>
                                <h3 id="modal-hapus-misi-title" className="text-base font-bold text-content-primary">
                                    Hapus Poin Misi?
                                </h3>
                                <p className="text-sm text-content-secondary leading-relaxed">
                                    Poin misi ke-{deleteMisiIndex + 1} akan dihapus dari daftar misi sekolah. Tindakan ini dapat ditambahkan kembali kapan saja.
                                </p>
                            </div>

                            <div className="px-5 py-3.5 border-t border-stroke-card bg-surface-primary flex items-center justify-end gap-2.5">
                                <CmsButton
                                    type="button"
                                    hierarchy="secondary"
                                    size="md"
                                    disabled={savingMisi}
                                    onClick={() => setDeleteMisiIndex(null)}
                                >
                                    Batal
                                </CmsButton>
                                <CmsButton
                                    type="button"
                                    hierarchy="primary"
                                    tone="danger"
                                    size="md"
                                    loading={savingMisi}
                                    onClick={handleConfirmDeleteMisi}
                                >
                                    {savingMisi ? 'Menghapus...' : 'Hapus'}
                                </CmsButton>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
        </AdminLayout>
    );
}
