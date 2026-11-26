import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from '@inertiajs/react';
import {
    IconAlertCircle,
    IconArrowDown,
    IconArrowRight,
    IconArrowUp,
    IconCheck,
    IconChevronDown,
    IconChevronUp,
    IconDeviceDesktop,
    IconDeviceMobile,
    IconDownload,
    IconEdit,
    IconExternalLink,
    IconEye,
    IconFileTypePdf,
    IconInfoCircle,
    IconPencil,
    IconPhoto,
    IconPlus,
    IconTrash,
    IconUpload,
    IconX,
} from '@tabler/icons-react';
import AdminLayout from '@/Layouts/AdminLayout';
import CmsButton from '@/Components/Admin/CmsButton';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_BYTES = 3 * 1024 * 1024;
const MAX_PDF_BYTES = 10 * 1024 * 1024;

function renderStyledTitle(text, defaultFullText, highlightWords = [], highlightClass = 'text-blue-600') {
    const raw = text || defaultFullText;
    if (!raw) return '';
    if (!highlightWords || highlightWords.length === 0) return raw;
    const pattern = highlightWords.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    const regex = new RegExp(`(${pattern})`, 'gi');
    const parts = raw.split(regex);
    return parts.map((part, i) => {
        const isMatch = highlightWords.some((w) => w.toLowerCase() === part.toLowerCase());
        return isMatch ? (
            <span key={i} className={highlightClass}>
                {part}
            </span>
        ) : (
            part
        );
    });
}

const DEFAULT_PREVIEW_BIAYA = [
    { komponen_biaya: 'Biaya Pendaftaran', keterangan: 'Pembayaran saat mendaftar', nominal_biaya: 'Rp. -' },
    { komponen_biaya: 'Seragam Sekolah', keterangan: '1 set (menyesuaikan ketentuan)', nominal_biaya: 'Rp. -' },
    { komponen_biaya: 'SPP / Komite', keterangan: 'Pembayaran per semester', nominal_biaya: 'Rp. -' },
    { komponen_biaya: 'Kegiatan Pembelajaran', keterangan: 'Praktik, uji kompetensi, dll.', nominal_biaya: 'Rp. -' },
    { komponen_biaya: 'Lain-lain', keterangan: 'Disesuaikan dengan program sekolah', nominal_biaya: 'Rp. -' },
];

const DEFAULT_PREVIEW_ALUR = [
    {
        langkah: '1',
        judul: 'Isi Formulir Pendaftaran',
        deskripsi: 'Lengkapi formulir PPDB online dengan data diri, informasi pendidikan, alamat, kontak orang tua, dan pilihan program keahlian.',
    },
    {
        langkah: '2',
        judul: 'Unggah Dokumen Persyaratan',
        deskripsi: 'Unggah dokumen yang diminta dalam format digital. Pastikan semua berkas terbaca jelas dan sesuai ketentuan sekolah.',
    },
    {
        langkah: '3',
        judul: 'Periksa dan Kirim Formulir',
        deskripsi: 'Periksa kembali data dan dokumen yang telah diisi. Jika sudah benar dan lengkap, kirim formulir pendaftaran.',
    },
    {
        langkah: '4',
        judul: 'Terima Bukti Pendaftaran',
        deskripsi: 'Setelah formulir berhasil dikirim, simpan nomor atau bukti pendaftaran sebagai referensi untuk proses selanjutnya.',
    },
    {
        langkah: '5',
        judul: 'Verifikasi oleh Sekolah',
        deskripsi: 'Panitia PPDB memeriksa kelengkapan dokumen dan kesesuaian data. Lakukan perbaikan jika ada informasi yang perlu dilengkapi.',
    },
    {
        langkah: '6',
        judul: 'Informasi Hasil Seleksi',
        deskripsi: 'Pantau pengumuman melalui kanal resmi sekolah. Jika diterima, ikuti petunjuk daftar ulang dan tahapan berikutnya.',
    },
];

function CompactImageUpload({
    label,
    helperNote = 'Rasio lanskap 16:9 · JPG, PNG, WebP · Maks. 3 MB',
    currentUrl,
    file,
    error,
    onFileSelect,
    aspectRatio = 'aspect-video',
    maxPreviewWidth = 'max-w-[220px]',
}) {
    const fileInputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [clientError, setClientError] = useState('');
    const [previewUrl, setPreviewUrl] = useState(currentUrl || '');

    useEffect(() => {
        if (!file) {
            setPreviewUrl(currentUrl || '');
            return undefined;
        }
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [file, currentUrl]);

    const validateAndSet = (picked) => {
        if (!picked) return;
        if (!ALLOWED_IMAGE_TYPES.includes(picked.type)) {
            setClientError('Format gambar harus JPG, PNG, atau WebP.');
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }
        if (picked.size > MAX_IMAGE_BYTES) {
            setClientError('Ukuran gambar maksimal 3 MB.');
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }
        setClientError('');
        onFileSelect(picked);
    };

    const handleClear = () => {
        setClientError('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        onFileSelect(null);
    };

    const displayError = clientError || error;

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
                onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    validateAndSet(e.dataTransfer?.files?.[0]);
                }}
                className={`flex-1 p-5 rounded-lg border border-dashed flex flex-col justify-center items-center text-center transition-colors ${
                    isDragging
                        ? 'border-brand-500 bg-brand-50'
                        : 'border-stroke-input bg-surface-primary hover:border-brand-300'
                }`}
            >
                {previewUrl ? (
                    <div className="w-full space-y-3">
                        <div
                            className={`w-full ${maxPreviewWidth} mx-auto ${aspectRatio} rounded-md border border-stroke-card bg-surface-secondary overflow-hidden`}
                        >
                            <img
                                src={previewUrl}
                                alt={label}
                                className="w-full h-full object-cover"
                                onError={() => setPreviewUrl('')}
                            />
                        </div>

                        <p className="text-xs text-content-secondary">
                            Unggah atau seret file baru ke kotak ini untuk mengganti.
                        </p>

                        <div className="space-y-2">
                            <CmsButton
                                type="button"
                                hierarchy="secondary"
                                size="md"
                                prefixIcon={<IconUpload size={16} className="text-brand-500" />}
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full"
                            >
                                Ganti File
                            </CmsButton>

                            {file && (
                                <CmsButton
                                    type="button"
                                    hierarchy="tertiary"
                                    size="sm"
                                    onClick={handleClear}
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
                            type="button"
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
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => validateAndSet(e.target.files?.[0])}
                    className="hidden"
                />

                <p className="mt-3 text-xs text-content-tertiary">
                    {helperNote}
                </p>

                {file && (
                    <p className="mt-1.5 text-xs font-medium text-brand-600 truncate max-w-full">
                        Dipilih: {file.name}
                    </p>
                )}

                {displayError && (
                    <p className="mt-1.5 text-xs font-medium text-content-negative">
                        {displayError}
                    </p>
                )}
            </div>
        </div>
    );
}

export default function Halaman({ title = 'Pengaturan Halaman SPMB', halaman }) {
    const initialBiaya = useMemo(
        () => (Array.isArray(halaman?.daftar_rincian_biaya) ? halaman.daftar_rincian_biaya : []),
        [halaman]
    );
    const initialAlur = useMemo(
        () => (Array.isArray(halaman?.daftar_alur_pendaftaran) ? halaman.daftar_alur_pendaftaran : []),
        [halaman]
    );

    // 1. Form Seksi 1: Hero Utama & Brosur PDF
    const heroForm = useForm({
        judul_hero_spmb: halaman?.judul_hero_spmb || '',
        subjudul_hero_spmb: halaman?.subjudul_hero_spmb || '',
        gambar_hero_spmb: null,
        file_brosur_pdf: null,
    });

    const isHeroDirty = useMemo(() => {
        return (
            heroForm.data.judul_hero_spmb !== (halaman?.judul_hero_spmb || '') ||
            heroForm.data.subjudul_hero_spmb !== (halaman?.subjudul_hero_spmb || '') ||
            Boolean(heroForm.data.gambar_hero_spmb) ||
            Boolean(heroForm.data.file_brosur_pdf)
        );
    }, [heroForm.data, halaman]);

    // 2. Form Seksi 2: Informasi Biaya Pendidikan
    const biayaForm = useForm({
        judul_biaya: halaman?.judul_biaya || '',
        subjudul_biaya: halaman?.subjudul_biaya || '',
        daftar_rincian_biaya: initialBiaya,
    });

    const isBiayaDirty = useMemo(() => {
        return (
            biayaForm.data.judul_biaya !== (halaman?.judul_biaya || '') ||
            biayaForm.data.subjudul_biaya !== (halaman?.subjudul_biaya || '') ||
            JSON.stringify(biayaForm.data.daftar_rincian_biaya) !== JSON.stringify(initialBiaya)
        );
    }, [biayaForm.data, halaman, initialBiaya]);

    // 3. Form Seksi 3: Alur & Tahapan Pendaftaran
    const alurForm = useForm({
        judul_alur_pendaftaran: halaman?.judul_alur_pendaftaran || '',
        subjudul_alur_pendaftaran: halaman?.subjudul_alur_pendaftaran || '',
        daftar_alur_pendaftaran: initialAlur,
    });

    const isAlurDirty = useMemo(() => {
        return (
            alurForm.data.judul_alur_pendaftaran !== (halaman?.judul_alur_pendaftaran || '') ||
            alurForm.data.subjudul_alur_pendaftaran !== (halaman?.subjudul_alur_pendaftaran || '') ||
            JSON.stringify(alurForm.data.daftar_alur_pendaftaran) !== JSON.stringify(initialAlur)
        );
    }, [alurForm.data, halaman, initialAlur]);

    // 4. Form Seksi 4: Banner Ajakan Bawah (CTA)
    const bannerForm = useForm({
        judul_banner_bawah_spmb: halaman?.judul_banner_bawah_spmb || '',
        subjudul_banner_bawah_spmb: halaman?.subjudul_banner_bawah_spmb || '',
        gambar_banner_bawah_spmb: null,
    });

    const isBannerDirty = useMemo(() => {
        return (
            bannerForm.data.judul_banner_bawah_spmb !== (halaman?.judul_banner_bawah_spmb || '') ||
            bannerForm.data.subjudul_banner_bawah_spmb !== (halaman?.subjudul_banner_bawah_spmb || '') ||
            Boolean(bannerForm.data.gambar_banner_bawah_spmb)
        );
    }, [bannerForm.data, halaman]);

    // Mode Halaman: 'edit' | 'preview' & Pratinjau Device: 'desktop' | 'mobile'
    const [pageMode, setPageMode] = useState('edit');
    const [previewDevice, setPreviewDevice] = useState('desktop');

    const heroPreviewUrl = useMemo(() => {
        if (heroForm.data.gambar_hero_spmb instanceof File) {
            return URL.createObjectURL(heroForm.data.gambar_hero_spmb);
        }
        return halaman?.gambar_hero_spmb || '';
    }, [heroForm.data.gambar_hero_spmb, halaman?.gambar_hero_spmb]);

    const bannerPreviewUrl = useMemo(() => {
        if (bannerForm.data.gambar_banner_bawah_spmb instanceof File) {
            return URL.createObjectURL(bannerForm.data.gambar_banner_bawah_spmb);
        }
        return halaman?.gambar_banner_bawah_spmb || '';
    }, [bannerForm.data.gambar_banner_bawah_spmb, halaman?.gambar_banner_bawah_spmb]);

    const hasUnsavedChanges = isHeroDirty || isBiayaDirty || isAlurDirty || isBannerDirty;

    const previewBiayaList = useMemo(() => {
        return biayaForm.data.daftar_rincian_biaya?.length > 0
            ? biayaForm.data.daftar_rincian_biaya
            : DEFAULT_PREVIEW_BIAYA;
    }, [biayaForm.data.daftar_rincian_biaya]);

    const previewAlurList = useMemo(() => {
        return alurForm.data.daftar_alur_pendaftaran?.length > 0
            ? alurForm.data.daftar_alur_pendaftaran
            : DEFAULT_PREVIEW_ALUR;
    }, [alurForm.data.daftar_alur_pendaftaran]);

    // Collapsible sections
    const [openHero, setOpenHero] = useState(true);
    const [openBiaya, setOpenBiaya] = useState(true);
    const [openAlur, setOpenAlur] = useState(true);
    const [openBanner, setOpenBanner] = useState(true);

    // PDF Upload state
    const pdfInputRef = useRef(null);
    const [pdfDragging, setPdfDragging] = useState(false);
    const [pdfClientError, setPdfClientError] = useState('');

    // Drawer: Biaya
    const [biayaDrawerOpen, setBiayaDrawerOpen] = useState(false);
    const [editingBiayaIndex, setEditingBiayaIndex] = useState(null);
    const [biayaDraft, setBiayaDraft] = useState({
        komponen_biaya: '',
        nominal_biaya: '',
        keterangan: '',
    });
    const [biayaDraftError, setBiayaDraftError] = useState('');

    // Drawer: Alur
    const [alurDrawerOpen, setAlurDrawerOpen] = useState(false);
    const [editingAlurIndex, setEditingAlurIndex] = useState(null);
    const [alurDraft, setAlurDraft] = useState({
        langkah: '',
        judul: '',
        deskripsi: '',
    });
    const [alurDraftError, setAlurDraftError] = useState('');

    // Delete confirmation modal state
    const [deleteConfirm, setDeleteConfirm] = useState(null); // { type: 'biaya' | 'alur', index, label }

    useEffect(() => {
        const hasOverlay = biayaDrawerOpen || alurDrawerOpen || deleteConfirm !== null;
        document.body.style.overflow = hasOverlay ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [biayaDrawerOpen, alurDrawerOpen, deleteConfirm]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key !== 'Escape') return;
            if (deleteConfirm) {
                setDeleteConfirm(null);
                return;
            }
            if (biayaDrawerOpen) {
                setBiayaDrawerOpen(false);
                return;
            }
            if (alurDrawerOpen) {
                setAlurDrawerOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [biayaDrawerOpen, alurDrawerOpen, deleteConfirm]);

    const handlePickPdf = (picked) => {
        if (!picked) return;
        setPdfClientError('');
        if (picked.type !== 'application/pdf') {
            setPdfClientError('File brosur wajib berupa dokumen PDF.');
            return;
        }
        if (picked.size > MAX_PDF_BYTES) {
            setPdfClientError('Ukuran file brosur maksimal 10 MB.');
            return;
        }
        heroForm.setData('file_brosur_pdf', picked);
    };

    // --- Save Handlers per Seksi ---
    const handleSaveHero = (e) => {
        e.preventDefault();
        heroForm.post('/admin/spmb-halaman/hero', {
            forceFormData: true,
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                heroForm.setData((prev) => ({
                    ...prev,
                    gambar_hero_spmb: null,
                    file_brosur_pdf: null,
                }));
            },
        });
    };

    const handleResetHero = () => {
        heroForm.clearErrors();
        setPdfClientError('');
        heroForm.setData({
            judul_hero_spmb: halaman?.judul_hero_spmb || '',
            subjudul_hero_spmb: halaman?.subjudul_hero_spmb || '',
            gambar_hero_spmb: null,
            file_brosur_pdf: null,
        });
    };

    const handleSaveBiaya = (e) => {
        e.preventDefault();
        biayaForm.put('/admin/spmb-halaman/biaya', {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const handleResetBiaya = () => {
        biayaForm.clearErrors();
        biayaForm.setData({
            judul_biaya: halaman?.judul_biaya || '',
            subjudul_biaya: halaman?.subjudul_biaya || '',
            daftar_rincian_biaya: initialBiaya,
        });
    };

    const handleSaveAlur = (e) => {
        e.preventDefault();
        alurForm.put('/admin/spmb-halaman/alur', {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const handleResetAlur = () => {
        alurForm.clearErrors();
        alurForm.setData({
            judul_alur_pendaftaran: halaman?.judul_alur_pendaftaran || '',
            subjudul_alur_pendaftaran: halaman?.subjudul_alur_pendaftaran || '',
            daftar_alur_pendaftaran: initialAlur,
        });
    };

    const handleSaveBanner = (e) => {
        e.preventDefault();
        bannerForm.post('/admin/spmb-halaman/banner', {
            forceFormData: true,
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                bannerForm.setData((prev) => ({
                    ...prev,
                    gambar_banner_bawah_spmb: null,
                }));
            },
        });
    };

    const handleResetBanner = () => {
        bannerForm.clearErrors();
        bannerForm.setData({
            judul_banner_bawah_spmb: halaman?.judul_banner_bawah_spmb || '',
            subjudul_banner_bawah_spmb: halaman?.subjudul_banner_bawah_spmb || '',
            gambar_banner_bawah_spmb: null,
        });
    };

    // --- Biaya Drawer Handlers ---
    const openAddBiaya = () => {
        setEditingBiayaIndex(null);
        setBiayaDraft({ komponen_biaya: '', nominal_biaya: '', keterangan: '' });
        setBiayaDraftError('');
        setBiayaDrawerOpen(true);
    };

    const openEditBiaya = (idx) => {
        const item = biayaForm.data.daftar_rincian_biaya[idx];
        setEditingBiayaIndex(idx);
        setBiayaDraft({
            komponen_biaya: item?.komponen_biaya || '',
            nominal_biaya: item?.nominal_biaya || '',
            keterangan: item?.keterangan || '',
        });
        setBiayaDraftError('');
        setBiayaDrawerOpen(true);
    };

    const saveBiayaDraft = (e) => {
        e.preventDefault();
        if (!biayaDraft.komponen_biaya.trim()) {
            setBiayaDraftError('Nama komponen biaya wajib diisi.');
            return;
        }
        const nextList = [...biayaForm.data.daftar_rincian_biaya];
        const cleanItem = {
            komponen_biaya: biayaDraft.komponen_biaya.trim(),
            nominal_biaya: biayaDraft.nominal_biaya.trim() || '-',
            keterangan: biayaDraft.keterangan.trim(),
        };
        if (editingBiayaIndex !== null) {
            nextList[editingBiayaIndex] = cleanItem;
        } else {
            nextList.push(cleanItem);
        }
        biayaForm.setData('daftar_rincian_biaya', nextList);
        setBiayaDrawerOpen(false);
    };

    // --- Alur Drawer Handlers ---
    const openAddAlur = () => {
        setEditingAlurIndex(null);
        setAlurDraft({
            langkah: String(alurForm.data.daftar_alur_pendaftaran.length + 1),
            judul: '',
            deskripsi: '',
        });
        setAlurDraftError('');
        setAlurDrawerOpen(true);
    };

    const openEditAlur = (idx) => {
        const item = alurForm.data.daftar_alur_pendaftaran[idx];
        setEditingAlurIndex(idx);
        setAlurDraft({
            langkah: item?.langkah || String(idx + 1),
            judul: item?.judul || '',
            deskripsi: item?.deskripsi || '',
        });
        setAlurDraftError('');
        setAlurDrawerOpen(true);
    };

    const saveAlurDraft = (e) => {
        e.preventDefault();
        if (!alurDraft.judul.trim()) {
            setAlurDraftError('Judul langkah pendaftaran wajib diisi.');
            return;
        }
        const nextList = [...alurForm.data.daftar_alur_pendaftaran];
        const cleanItem = {
            langkah: alurDraft.langkah.trim() || String(nextList.length + 1),
            judul: alurDraft.judul.trim(),
            deskripsi: alurDraft.deskripsi.trim(),
        };
        if (editingAlurIndex !== null) {
            nextList[editingAlurIndex] = cleanItem;
        } else {
            nextList.push(cleanItem);
        }
        alurForm.setData('daftar_alur_pendaftaran', nextList);
        setAlurDrawerOpen(false);
    };

    const moveAlur = (idx, direction) => {
        const targetIdx = idx + direction;
        const list = [...alurForm.data.daftar_alur_pendaftaran];
        if (targetIdx < 0 || targetIdx >= list.length) return;
        const temp = list[idx];
        list[idx] = list[targetIdx];
        list[targetIdx] = temp;
        const renumbered = list.map((item, i) => ({
            ...item,
            langkah: String(i + 1),
        }));
        alurForm.setData('daftar_alur_pendaftaran', renumbered);
    };

    const confirmDelete = () => {
        if (!deleteConfirm) return;
        if (deleteConfirm.type === 'biaya') {
            const nextList = biayaForm.data.daftar_rincian_biaya.filter(
                (_, i) => i !== deleteConfirm.index
            );
            biayaForm.setData('daftar_rincian_biaya', nextList);
        } else if (deleteConfirm.type === 'alur') {
            const nextList = alurForm.data.daftar_alur_pendaftaran
                .filter((_, i) => i !== deleteConfirm.index)
                .map((item, i) => ({ ...item, langkah: String(i + 1) }));
            alurForm.setData('daftar_alur_pendaftaran', nextList);
        }
        setDeleteConfirm(null);
    };

    const inputClass = (hasError) =>
        `w-full h-10 px-3 text-sm rounded-md border bg-surface-primary text-content-primary placeholder:text-content-disabled shadow-xs transition focus:outline-none ${
            hasError
                ? 'border-negative-600 focus:border-negative-600 focus:ring-2 focus:ring-negative-500/15'
                : 'border-stroke-input focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15'
        }`;

    const textareaClass = (hasError) =>
        `w-full p-3 text-sm rounded-md border bg-surface-primary text-content-primary placeholder:text-content-disabled shadow-xs transition focus:outline-none ${
            hasError
                ? 'border-negative-600 focus:border-negative-600 focus:ring-2 focus:ring-negative-500/15'
                : 'border-stroke-input focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15'
        }`;

    return (
        <AdminLayout
            title={title}
            subtitle="Atur informasi brosur resmi, kebijakan biaya, dan 6 langkah alur pendaftaran SPMB pada portal publik."
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
                <div className="space-y-6">
                {/* SEKSI 1: HERO & BROSUR PDF (SIMPAN MANDIRI) */}
                <form
                    onSubmit={handleSaveHero}
                    noValidate
                    className="bg-surface-primary rounded-xl border border-stroke-card shadow-admin-card overflow-hidden"
                >
                    <button
                        type="button"
                        onClick={() => setOpenHero(!openHero)}
                        className="w-full p-5 flex items-center justify-between gap-4 text-left hover:bg-surface-secondary/40 transition"
                    >
                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <h2 className="text-base font-bold text-content-primary">
                                    1. Hero Utama & Brosur PDF SPMB
                                </h2>
                                {!openHero && isHeroDirty && (
                                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-warning-100 border border-warning-500/30 text-xs font-medium text-content-warning">
                                        <span className="w-1.5 h-1.5 rounded-full bg-warning-500" />
                                        <span>Belum disimpan</span>
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-content-secondary mt-0.5">
                                Judul pembuka halaman SPMB, gambar latar, dan file brosur resmi PDF.
                            </p>
                        </div>
                        <span className="text-content-tertiary shrink-0">
                            {openHero ? <IconChevronUp size={18} /> : <IconChevronDown size={18} />}
                        </span>
                    </button>

                    {openHero && (
                        <div className="p-5 border-t border-stroke-card">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                                {/* Kolom Kiri: Form Judul, Subjudul, & Brosur PDF */}
                                <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label className="text-sm font-medium text-content-primary">
                                                Judul Hero SPMB <span className="text-content-negative">*</span>
                                            </label>
                                            <span className="text-xs text-content-tertiary">
                                                {heroForm.data.judul_hero_spmb.length}/255
                                            </span>
                                        </div>
                                        <input
                                            type="text"
                                            maxLength={255}
                                            value={heroForm.data.judul_hero_spmb}
                                            onChange={(e) => heroForm.setData('judul_hero_spmb', e.target.value)}
                                            placeholder="Contoh: Penerimaan Peserta Didik Baru (PPDB) SMK PGRI Gumelar"
                                            className={inputClass(Boolean(heroForm.errors.judul_hero_spmb))}
                                        />
                                        {heroForm.errors.judul_hero_spmb && (
                                            <p className="mt-1 text-xs font-medium text-content-negative">
                                                {heroForm.errors.judul_hero_spmb}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex-1 flex flex-col">
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label className="text-sm font-medium text-content-primary">
                                                Subjudul Hero SPMB <span className="text-content-negative">*</span>
                                            </label>
                                            <span className="text-xs text-content-tertiary">
                                                {heroForm.data.subjudul_hero_spmb.length} karakter
                                            </span>
                                        </div>
                                        <textarea
                                            rows={3}
                                            value={heroForm.data.subjudul_hero_spmb}
                                            onChange={(e) =>
                                                heroForm.setData('subjudul_hero_spmb', e.target.value)
                                            }
                                            placeholder="Masukkan paragraf pengantar pendaftaran..."
                                            className={textareaClass(Boolean(heroForm.errors.subjudul_hero_spmb))}
                                        />
                                        <p className="mt-1 text-xs text-content-tertiary">
                                            Ideal 100–250 karakter agar teks pengantar tetap ringkas dan seimbang.
                                        </p>
                                        {heroForm.errors.subjudul_hero_spmb && (
                                            <p className="mt-1 text-xs font-medium text-content-negative">
                                                {heroForm.errors.subjudul_hero_spmb}
                                            </p>
                                        )}
                                    </div>

                                    {/* Upload Brosur PDF */}
                                    <div>
                                        <label className="block text-sm font-medium text-content-primary mb-1.5">
                                            Dokumen Brosur Resmi (PDF)
                                        </label>

                                        <div
                                            onClick={() => pdfInputRef.current?.click()}
                                            onDragOver={(e) => {
                                                e.preventDefault();
                                                setPdfDragging(true);
                                            }}
                                            onDragLeave={() => setPdfDragging(false)}
                                            onDrop={(e) => {
                                                e.preventDefault();
                                                setPdfDragging(false);
                                                handlePickPdf(e.dataTransfer.files?.[0]);
                                            }}
                                            className={`cursor-pointer rounded-lg border border-dashed p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition ${
                                                pdfDragging
                                                    ? 'border-brand-500 bg-brand-50'
                                                    : 'border-stroke-input bg-surface-primary hover:border-brand-300'
                                            }`}
                                        >
                                            <input
                                                ref={pdfInputRef}
                                                type="file"
                                                accept="application/pdf"
                                                className="hidden"
                                                onChange={(e) => handlePickPdf(e.target.files?.[0])}
                                            />
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-brand-50 border border-brand-200 text-brand-500 flex items-center justify-center shrink-0">
                                                    <IconFileTypePdf size={20} />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-content-primary">
                                                        {heroForm.data.file_brosur_pdf
                                                            ? heroForm.data.file_brosur_pdf.name
                                                            : 'Klik untuk unggah atau seret file PDF brosur ke sini'}
                                                    </div>
                                                    <div className="text-xs text-content-tertiary mt-0.5">
                                                        Format wajib PDF · Maksimal 10 MB
                                                    </div>
                                                </div>
                                            </div>

                                            {halaman?.file_brosur_pdf && !heroForm.data.file_brosur_pdf && (
                                                <a
                                                    href={halaman.file_brosur_pdf}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border border-brand-500/20 bg-brand-500/10 text-brand-600 font-medium hover:bg-brand-500/15 transition shrink-0"
                                                >
                                                    <span>Lihat Brosur Saat Ini</span>
                                                    <IconExternalLink size={13} />
                                                </a>
                                            )}
                                        </div>
                                        {(pdfClientError || heroForm.errors.file_brosur_pdf) && (
                                            <p className="mt-1 text-xs font-medium text-content-negative">
                                                {pdfClientError || heroForm.errors.file_brosur_pdf}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Kolom Kanan: Foto / Gambar Latar Hero SPMB */}
                                <div className="lg:col-span-4 flex flex-col">
                                    <CompactImageUpload
                                        label="Gambar Latar Hero SPMB (Lanskap 16:9)"
                                        helperNote="Rasio lanskap 16:9 · JPG, PNG, WebP · Maks. 3 MB"
                                        currentUrl={halaman?.gambar_hero_spmb}
                                        file={heroForm.data.gambar_hero_spmb}
                                        error={heroForm.errors.gambar_hero_spmb}
                                        onFileSelect={(picked) => heroForm.setData('gambar_hero_spmb', picked)}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Footer Seksi 1: Simpan Mandiri */}
                    <div className="px-5 py-3.5 border-t border-stroke-card bg-surface-primary flex flex-wrap items-center justify-between gap-2">
                        {isHeroDirty ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-warning-100 border border-warning-500/30 text-xs font-medium text-content-warning">
                                <span className="w-1.5 h-1.5 rounded-full bg-warning-500" />
                                <span>Perubahan belum disimpan</span>
                            </span>
                        ) : (
                            <span className="text-xs text-content-tertiary">
                                Pengaturan hero dan brosur tersimpan.
                            </span>
                        )}
                        <div className="flex flex-wrap items-center gap-2 ml-auto">
                            {isHeroDirty && (
                                <CmsButton
                                    type="button"
                                    hierarchy="tertiary"
                                    size="sm"
                                    onClick={handleResetHero}
                                    disabled={heroForm.processing}
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
                                {heroForm.processing ? 'Menyimpan...' : 'Simpan Hero & Brosur'}
                            </CmsButton>
                        </div>
                    </div>
                </form>

                {/* SEKSI 2: INFORMASI BIAYA PENDIDIKAN (SIMPAN MANDIRI) */}
                <form
                    onSubmit={handleSaveBiaya}
                    noValidate
                    className="bg-surface-primary rounded-xl border border-stroke-card shadow-admin-card overflow-hidden"
                >
                    <button
                        type="button"
                        onClick={() => setOpenBiaya(!openBiaya)}
                        className="w-full p-5 flex items-center justify-between gap-4 text-left hover:bg-surface-secondary/40 transition"
                    >
                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <h2 className="text-base font-bold text-content-primary">
                                    2. Informasi & Rincian Biaya Pendidikan
                                </h2>
                                {!openBiaya && isBiayaDirty && (
                                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-warning-100 border border-warning-500/30 text-xs font-medium text-content-warning">
                                        <span className="w-1.5 h-1.5 rounded-full bg-warning-500" />
                                        <span>Belum disimpan</span>
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-content-secondary mt-0.5">
                                Kelola komponen pembiayaan atau kebijakan subsidi pendaftaran.
                            </p>
                        </div>
                        <span className="text-content-tertiary shrink-0">
                            {openBiaya ? <IconChevronUp size={18} /> : <IconChevronDown size={18} />}
                        </span>
                    </button>

                    {openBiaya && (
                        <div className="p-5 border-t border-stroke-card space-y-5">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                                <div className="lg:col-span-5">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label className="block text-sm font-medium text-content-primary">
                                            Judul Seksi Biaya <span className="text-content-negative">*</span>
                                        </label>
                                        <span className="text-xs text-content-tertiary">
                                            {biayaForm.data.judul_biaya.length}/255
                                        </span>
                                    </div>
                                    <input
                                        type="text"
                                        maxLength={255}
                                        value={biayaForm.data.judul_biaya}
                                        onChange={(e) => biayaForm.setData('judul_biaya', e.target.value)}
                                        placeholder="Contoh: Informasi Biaya Pendidikan"
                                        className={inputClass(Boolean(biayaForm.errors.judul_biaya))}
                                    />
                                    {biayaForm.errors.judul_biaya && (
                                        <p className="mt-1 text-xs font-medium text-content-negative">
                                            {biayaForm.errors.judul_biaya}
                                        </p>
                                    )}
                                </div>

                                <div className="lg:col-span-7">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label className="block text-sm font-medium text-content-primary">
                                            Subjudul Seksi Biaya <span className="text-content-negative">*</span>
                                        </label>
                                        <span className="text-xs text-content-tertiary">
                                            {biayaForm.data.subjudul_biaya.length} karakter
                                        </span>
                                    </div>
                                    <textarea
                                        rows={3}
                                        value={biayaForm.data.subjudul_biaya}
                                        onChange={(e) =>
                                            biayaForm.setData('subjudul_biaya', e.target.value)
                                        }
                                        placeholder="Masukkan keterangan kebijakan pembiayaan..."
                                        className={textareaClass(Boolean(biayaForm.errors.subjudul_biaya))}
                                    />
                                    {biayaForm.errors.subjudul_biaya && (
                                        <p className="mt-1 text-xs font-medium text-content-negative">
                                            {biayaForm.errors.subjudul_biaya}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Daftar Komponen Biaya */}
                            <div>
                                <div className="flex items-center justify-between gap-3 mb-3">
                                    <div className="text-sm font-medium text-content-primary">
                                        Daftar Komponen Biaya (
                                        {biayaForm.data.daftar_rincian_biaya.length})
                                    </div>
                                    <CmsButton
                                        type="button"
                                        hierarchy="secondary"
                                        size="sm"
                                        prefixIcon={<IconPlus size={14} className="text-brand-500" />}
                                        onClick={openAddBiaya}
                                    >
                                        Tambah Komponen
                                    </CmsButton>
                                </div>

                                {biayaForm.data.daftar_rincian_biaya.length > 0 ? (
                                    <div className="border border-stroke-card rounded-xl overflow-hidden divide-y divide-stroke-card">
                                        {biayaForm.data.daftar_rincian_biaya.map((item, idx) => (
                                            <div
                                                key={idx}
                                                className="p-3.5 sm:px-4 bg-surface-primary flex items-center justify-between gap-4 hover:bg-surface-secondary/40 transition"
                                            >
                                                <div className="min-w-0">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="text-sm font-semibold text-content-primary">
                                                            {item.komponen_biaya}
                                                        </span>
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs border border-brand-500/20 bg-brand-500/10 text-brand-600 font-medium">
                                                            {item.nominal_biaya || '-'}
                                                        </span>
                                                    </div>
                                                    {item.keterangan && (
                                                        <p className="text-xs text-content-secondary mt-0.5">
                                                            {item.keterangan}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="inline-flex items-center gap-1 shrink-0">
                                                    <CmsButton
                                                        type="button"
                                                        hierarchy="tertiary"
                                                        tone="warning"
                                                        size="icon-sm"
                                                        title="Ubah komponen biaya"
                                                        onClick={() => openEditBiaya(idx)}
                                                    >
                                                        <IconEdit size={16} />
                                                    </CmsButton>
                                                    <CmsButton
                                                        type="button"
                                                        hierarchy="tertiary"
                                                        tone="danger"
                                                        size="icon-sm"
                                                        title="Hapus komponen biaya"
                                                        onClick={() =>
                                                            setDeleteConfirm({
                                                                type: 'biaya',
                                                                index: idx,
                                                                label: item.komponen_biaya,
                                                             })
                                                        }
                                                    >
                                                        <IconTrash size={16} />
                                                    </CmsButton>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-6 rounded-xl border border-dashed border-stroke-input text-center text-xs text-content-tertiary">
                                        Belum ada rincian komponen biaya yang ditambahkan.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Footer Seksi 2: Simpan Mandiri */}
                    <div className="px-5 py-3.5 border-t border-stroke-card bg-surface-primary flex flex-wrap items-center justify-between gap-2">
                        {isBiayaDirty ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-warning-100 border border-warning-500/30 text-xs font-medium text-content-warning">
                                <span className="w-1.5 h-1.5 rounded-full bg-warning-500" />
                                <span>Perubahan belum disimpan</span>
                            </span>
                        ) : (
                            <span className="text-xs text-content-tertiary">
                                Pengaturan informasi biaya tersimpan.
                            </span>
                        )}
                        <div className="flex flex-wrap items-center gap-2 ml-auto">
                            {isBiayaDirty && (
                                <CmsButton
                                    type="button"
                                    hierarchy="tertiary"
                                    size="sm"
                                    onClick={handleResetBiaya}
                                    disabled={biayaForm.processing}
                                >
                                    Batalkan Perubahan
                                </CmsButton>
                            )}
                            <CmsButton
                                type="submit"
                                hierarchy="primary"
                                size="md"
                                loading={biayaForm.processing}
                            >
                                {biayaForm.processing ? 'Menyimpan...' : 'Simpan Informasi Biaya'}
                            </CmsButton>
                        </div>
                    </div>
                </form>

                {/* SEKSI 3: ALUR PENDAFTARAN (SIMPAN MANDIRI) */}
                <form
                    onSubmit={handleSaveAlur}
                    noValidate
                    className="bg-surface-primary rounded-xl border border-stroke-card shadow-admin-card overflow-hidden"
                >
                    <button
                        type="button"
                        onClick={() => setOpenAlur(!openAlur)}
                        className="w-full p-5 flex items-center justify-between gap-4 text-left hover:bg-surface-secondary/40 transition"
                    >
                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <h2 className="text-base font-bold text-content-primary">
                                    3. Tahapan Alur Pendaftaran
                                </h2>
                                {!openAlur && isAlurDirty && (
                                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-warning-100 border border-warning-500/30 text-xs font-medium text-content-warning">
                                        <span className="w-1.5 h-1.5 rounded-full bg-warning-500" />
                                        <span>Belum disimpan</span>
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-content-secondary mt-0.5">
                                Panduan langkah-langkah pendaftaran online bagi calon siswa baru.
                            </p>
                        </div>
                        <span className="text-content-tertiary shrink-0">
                            {openAlur ? <IconChevronUp size={18} /> : <IconChevronDown size={18} />}
                        </span>
                    </button>

                    {openAlur && (
                        <div className="p-5 border-t border-stroke-card space-y-5">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                                <div className="lg:col-span-5">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label className="block text-sm font-medium text-content-primary">
                                            Judul Seksi Alur <span className="text-content-negative">*</span>
                                        </label>
                                        <span className="text-xs text-content-tertiary">
                                            {alurForm.data.judul_alur_pendaftaran.length}/255
                                        </span>
                                    </div>
                                    <input
                                        type="text"
                                        maxLength={255}
                                        value={alurForm.data.judul_alur_pendaftaran}
                                        onChange={(e) =>
                                            alurForm.setData('judul_alur_pendaftaran', e.target.value)
                                        }
                                        placeholder="Contoh: Alur & Tahapan Pendaftaran"
                                        className={inputClass(
                                            Boolean(alurForm.errors.judul_alur_pendaftaran)
                                        )}
                                    />
                                    {alurForm.errors.judul_alur_pendaftaran && (
                                        <p className="mt-1 text-xs font-medium text-content-negative">
                                            {alurForm.errors.judul_alur_pendaftaran}
                                        </p>
                                    )}
                                </div>

                                <div className="lg:col-span-7">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label className="block text-sm font-medium text-content-primary">
                                            Subjudul Seksi Alur{' '}
                                            <span className="text-content-negative">*</span>
                                        </label>
                                        <span className="text-xs text-content-tertiary">
                                            {alurForm.data.subjudul_alur_pendaftaran.length} karakter
                                        </span>
                                    </div>
                                    <textarea
                                        rows={3}
                                        value={alurForm.data.subjudul_alur_pendaftaran}
                                        onChange={(e) =>
                                            alurForm.setData('subjudul_alur_pendaftaran', e.target.value)
                                        }
                                        placeholder="Masukkan deskripsi singkat alur pendaftaran..."
                                        className={textareaClass(
                                            Boolean(alurForm.errors.subjudul_alur_pendaftaran)
                                        )}
                                    />
                                    {alurForm.errors.subjudul_alur_pendaftaran && (
                                        <p className="mt-1 text-xs font-medium text-content-negative">
                                            {alurForm.errors.subjudul_alur_pendaftaran}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Daftar Langkah Alur */}
                            <div>
                                <div className="flex items-center justify-between gap-3 mb-3">
                                    <div className="text-sm font-medium text-content-primary">
                                        Daftar Langkah Pendaftaran (
                                        {alurForm.data.daftar_alur_pendaftaran.length})
                                    </div>
                                    <CmsButton
                                        type="button"
                                        hierarchy="secondary"
                                        size="sm"
                                        prefixIcon={<IconPlus size={14} className="text-brand-500" />}
                                        onClick={openAddAlur}
                                    >
                                        Tambah Langkah
                                    </CmsButton>
                                </div>

                                {alurForm.data.daftar_alur_pendaftaran.length > 0 ? (
                                    <div className="border border-stroke-card rounded-xl overflow-hidden divide-y divide-stroke-card">
                                        {alurForm.data.daftar_alur_pendaftaran.map((item, idx) => (
                                            <div
                                                key={idx}
                                                className="p-3.5 sm:px-4 bg-surface-primary flex items-start justify-between gap-4 hover:bg-surface-secondary/40 transition"
                                            >
                                                <div className="flex items-start gap-3 min-w-0">
                                                    <span className="w-7 h-7 rounded-full border border-brand-500/20 bg-brand-500/10 text-brand-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                                                        {item.langkah || idx + 1}
                                                    </span>
                                                    <div className="min-w-0">
                                                        <div className="text-sm font-semibold text-content-primary">
                                                            {item.judul}
                                                        </div>
                                                        {item.deskripsi && (
                                                            <p className="text-xs text-content-secondary mt-0.5">
                                                                {item.deskripsi}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="inline-flex items-center gap-1 shrink-0">
                                                    <CmsButton
                                                        type="button"
                                                        hierarchy="tertiary"
                                                        tone="brand"
                                                        size="icon-sm"
                                                        disabled={idx === 0}
                                                        title="Pindahkan ke atas"
                                                        onClick={() => moveAlur(idx, -1)}
                                                    >
                                                        <IconArrowUp size={15} />
                                                    </CmsButton>
                                                    <CmsButton
                                                        type="button"
                                                        hierarchy="tertiary"
                                                        tone="brand"
                                                        size="icon-sm"
                                                        disabled={
                                                            idx ===
                                                            alurForm.data.daftar_alur_pendaftaran
                                                                .length -
                                                                1
                                                        }
                                                        title="Pindahkan ke bawah"
                                                        onClick={() => moveAlur(idx, 1)}
                                                    >
                                                        <IconArrowDown size={15} />
                                                    </CmsButton>
                                                    <CmsButton
                                                        type="button"
                                                        hierarchy="tertiary"
                                                        tone="warning"
                                                        size="icon-sm"
                                                        title="Ubah langkah"
                                                        onClick={() => openEditAlur(idx)}
                                                    >
                                                        <IconEdit size={16} />
                                                    </CmsButton>
                                                    <CmsButton
                                                        type="button"
                                                        hierarchy="tertiary"
                                                        tone="danger"
                                                        size="icon-sm"
                                                        title="Hapus langkah"
                                                        onClick={() =>
                                                            setDeleteConfirm({
                                                                type: 'alur',
                                                                index: idx,
                                                                label: item.judul,
                                                            })
                                                        }
                                                    >
                                                        <IconTrash size={16} />
                                                    </CmsButton>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-6 rounded-xl border border-dashed border-stroke-input text-center text-xs text-content-tertiary">
                                        Belum ada tahapan alur pendaftaran yang ditambahkan.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Footer Seksi 3: Simpan Mandiri */}
                    <div className="px-5 py-3.5 border-t border-stroke-card bg-surface-primary flex flex-wrap items-center justify-between gap-2">
                        {isAlurDirty ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-warning-100 border border-warning-500/30 text-xs font-medium text-content-warning">
                                <span className="w-1.5 h-1.5 rounded-full bg-warning-500" />
                                <span>Perubahan belum disimpan</span>
                            </span>
                        ) : (
                            <span className="text-xs text-content-tertiary">
                                Pengaturan alur pendaftaran tersimpan.
                            </span>
                        )}
                        <div className="flex flex-wrap items-center gap-2 ml-auto">
                            {isAlurDirty && (
                                <CmsButton
                                    type="button"
                                    hierarchy="tertiary"
                                    size="sm"
                                    onClick={handleResetAlur}
                                    disabled={alurForm.processing}
                                >
                                    Batalkan Perubahan
                                </CmsButton>
                            )}
                            <CmsButton
                                type="submit"
                                hierarchy="primary"
                                size="md"
                                loading={alurForm.processing}
                            >
                                {alurForm.processing ? 'Menyimpan...' : 'Simpan Alur Pendaftaran'}
                            </CmsButton>
                        </div>
                    </div>
                </form>

                {/* SEKSI 4: BANNER BAWAH (SIMPAN MANDIRI) */}
                <form
                    onSubmit={handleSaveBanner}
                    noValidate
                    className="bg-surface-primary rounded-xl border border-stroke-card shadow-admin-card overflow-hidden"
                >
                    <button
                        type="button"
                        onClick={() => setOpenBanner(!openBanner)}
                        className="w-full p-5 flex items-center justify-between gap-4 text-left hover:bg-surface-secondary/40 transition"
                    >
                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <h2 className="text-base font-bold text-content-primary">
                                    4. Banner Ajakan Bawah (CTA)
                                </h2>
                                {!openBanner && isBannerDirty && (
                                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-warning-100 border border-warning-500/30 text-xs font-medium text-content-warning">
                                        <span className="w-1.5 h-1.5 rounded-full bg-warning-500" />
                                        <span>Belum disimpan</span>
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-content-secondary mt-0.5">
                                Kartu ajakan mendaftar di bagian bawah halaman SPMB sebelum footer.
                            </p>
                        </div>
                        <span className="text-content-tertiary shrink-0">
                            {openBanner ? <IconChevronUp size={18} /> : <IconChevronDown size={18} />}
                        </span>
                    </button>

                    {openBanner && (
                        <div className="p-5 border-t border-stroke-card">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                                {/* Kolom Kiri: Form Judul & Subjudul Banner */}
                                <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label className="block text-sm font-medium text-content-primary">
                                                Judul Banner Bawah <span className="text-content-negative">*</span>
                                            </label>
                                            <span className="text-xs text-content-tertiary">
                                                {bannerForm.data.judul_banner_bawah_spmb.length}/255
                                            </span>
                                        </div>
                                        <input
                                            type="text"
                                            maxLength={255}
                                            value={bannerForm.data.judul_banner_bawah_spmb}
                                            onChange={(e) =>
                                                bannerForm.setData('judul_banner_bawah_spmb', e.target.value)
                                            }
                                            placeholder="Contoh: Bergabunglah Bersama SMK PGRI Gumelar!"
                                            className={inputClass(
                                                Boolean(bannerForm.errors.judul_banner_bawah_spmb)
                                            )}
                                        />
                                        {bannerForm.errors.judul_banner_bawah_spmb && (
                                            <p className="mt-1 text-xs font-medium text-content-negative">
                                                {bannerForm.errors.judul_banner_bawah_spmb}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex-1 flex flex-col">
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label className="block text-sm font-medium text-content-primary">
                                                Subjudul Banner Bawah{' '}
                                                <span className="text-content-negative">*</span>
                                            </label>
                                            <span className="text-xs text-content-tertiary">
                                                {bannerForm.data.subjudul_banner_bawah_spmb.length} karakter
                                            </span>
                                        </div>
                                        <textarea
                                            rows={3}
                                            value={bannerForm.data.subjudul_banner_bawah_spmb}
                                            onChange={(e) =>
                                                bannerForm.setData('subjudul_banner_bawah_spmb', e.target.value)
                                            }
                                            placeholder="Contoh: Raih masa depan cerah dengan pendidikan vokasi terbaik dan siap kerja..."
                                            className={textareaClass(
                                                Boolean(bannerForm.errors.subjudul_banner_bawah_spmb)
                                            )}
                                        />
                                        <p className="mt-1 text-xs text-content-tertiary">
                                            Ideal 100–200 karakter untuk teks ajakan penutup.
                                        </p>
                                        {bannerForm.errors.subjudul_banner_bawah_spmb && (
                                            <p className="mt-1 text-xs font-medium text-content-negative">
                                                {bannerForm.errors.subjudul_banner_bawah_spmb}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Kolom Kanan: Foto / Banner Bawah */}
                                <div className="lg:col-span-4 flex flex-col">
                                    <CompactImageUpload
                                        label="Gambar Latar Banner Bawah (Lanskap 16:9)"
                                        helperNote="Rasio lanskap 16:9 · JPG, PNG, WebP · Maks. 3 MB"
                                        currentUrl={halaman?.gambar_banner_bawah_spmb}
                                        file={bannerForm.data.gambar_banner_bawah_spmb}
                                        error={bannerForm.errors.gambar_banner_bawah_spmb}
                                        onFileSelect={(picked) =>
                                            bannerForm.setData('gambar_banner_bawah_spmb', picked)
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Footer Seksi 4: Simpan Mandiri */}
                    <div className="px-5 py-3.5 border-t border-stroke-card bg-surface-primary flex flex-wrap items-center justify-between gap-2">
                        {isBannerDirty ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-warning-100 border border-warning-500/30 text-xs font-medium text-content-warning">
                                <span className="w-1.5 h-1.5 rounded-full bg-warning-500" />
                                <span>Perubahan belum disimpan</span>
                            </span>
                        ) : (
                            <span className="text-xs text-content-tertiary">
                                Pengaturan banner ajakan tersimpan.
                            </span>
                        )}
                        <div className="flex flex-wrap items-center gap-2 ml-auto">
                            {isBannerDirty && (
                                <CmsButton
                                    type="button"
                                    hierarchy="tertiary"
                                    size="sm"
                                    onClick={handleResetBanner}
                                    disabled={bannerForm.processing}
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
                                {bannerForm.processing ? 'Menyimpan...' : 'Simpan Banner Ajakan'}
                            </CmsButton>
                        </div>
                    </div>
                </form>
            </div>
            ) : (
                /* MODE PRATINJAU 1:1 HALAMAN PUBLIK SPMB (HI-FI IDDS) */
                <div className="space-y-4 text-content-primary">
                    {/* Bar Kontrol Pratinjau */}
                    <div className="bg-surface-primary border border-stroke-card rounded-xl shadow-xs px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-xs">
                            <span className="w-2 h-2 rounded-full bg-brand-500" />
                            <span className="font-semibold text-content-primary">Simulasi 1:1 Halaman Informasi SPMB</span>
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
                    <div className="bg-surface-secondary border border-stroke-card rounded-xl p-2 sm:p-6 flex justify-center">
                        <div
                            className={`w-full bg-white border border-stroke-card rounded-2xl shadow-xl overflow-hidden transition-all duration-200 text-slate-800 ${
                                previewDevice === 'mobile' ? 'max-w-[390px]' : ''
                            }`}
                        >
                            {/* 1. SEKSI HERO + SIMULASI NAVBAR ATAS (TRANSPARENT FLOATING) */}
                            <div className="relative overflow-hidden bg-slate-950 text-white min-h-[440px] sm:min-h-[500px] flex flex-col justify-between">
                                {/* Background Image with Vignette/Gradient Overlay */}
                                <img
                                    src={
                                        heroPreviewUrl ||
                                        'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop'
                                    }
                                    alt="Hero SPMB"
                                    className="absolute inset-0 w-full h-full object-cover object-center"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-900/60 to-slate-950/80 backdrop-blur-[0.5px]" />

                                {/* Mock Navbar Header */}
                                <div className="relative z-20 px-4 sm:px-8 py-3.5 border-b border-white/10 flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-2.5">
                                        <img
                                            src="/images/logo-pgri.png"
                                            alt="Logo"
                                            className="w-7 h-7 object-contain shrink-0"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                            }}
                                        />
                                        <div>
                                            <div className="text-xs font-bold leading-tight text-white tracking-tight">
                                                SMK PGRI Gumelar
                                            </div>
                                            <div className="text-[10px] text-slate-300 leading-tight">
                                                YPLP DM PGRI Cabang Banyumas
                                            </div>
                                        </div>
                                    </div>

                                    {previewDevice === 'desktop' && (
                                        <div className="hidden md:flex items-center gap-4 lg:gap-5 text-xs text-slate-200">
                                            <span className="hover:text-white cursor-default">Beranda</span>
                                            <span className="hover:text-white cursor-default inline-flex items-center gap-1">
                                                Profil <IconChevronDown size={12} />
                                            </span>
                                            <span className="font-bold text-white underline decoration-blue-500 underline-offset-8">
                                                PPDB
                                            </span>
                                            <span className="hover:text-white cursor-default inline-flex items-center gap-1">
                                                Akademik <IconChevronDown size={12} />
                                            </span>
                                            <span className="hover:text-white cursor-default inline-flex items-center gap-1">
                                                TEFA &amp; Karya <IconChevronDown size={12} />
                                            </span>
                                            <span className="hover:text-white cursor-default inline-flex items-center gap-1">
                                                Karier &amp; Alumni <IconChevronDown size={12} />
                                            </span>
                                        </div>
                                    )}

                                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-xs">
                                        <span>Daftar</span>
                                        <span className="w-3.5 h-3.5 rounded-full bg-white/25 flex items-center justify-center">
                                            <IconArrowRight size={10} />
                                        </span>
                                    </span>
                                </div>

                                {/* Hero Main Content */}
                                <div className="relative z-10 px-5 sm:px-10 py-16 sm:py-20 text-center max-w-2xl mx-auto space-y-4 my-auto">
                                    <h1 className="text-2xl sm:text-4xl lg:text-[40px] font-black tracking-tight leading-tight text-white">
                                        {renderStyledTitle(
                                            heroForm.data.judul_hero_spmb,
                                            'Wujudkan Masa Depanmu Bersama SMK PGRI Gumelar',
                                            ['Masa Depanmu', 'Masa Depan'],
                                            'text-blue-500'
                                        )}
                                    </h1>

                                    <p className="text-xs sm:text-sm text-slate-200/90 leading-relaxed max-w-xl mx-auto whitespace-pre-line">
                                        {heroForm.data.subjudul_hero_spmb ||
                                            'Saatnya mengembangkan potensi, mengasah keterampilan, dan mempersiapkan diri menghadapi dunia kerja. Bergabunglah bersama SMK PGRI Gumelar dan mulai perjalananmu menuju masa depan yang lebih baik.'}
                                    </p>

                                    <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
                                        <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30">
                                            <span>Daftar Sekarang</span>
                                            <span className="w-4 h-4 rounded-full bg-white/25 flex items-center justify-center">
                                                <IconArrowRight size={11} />
                                            </span>
                                        </span>

                                        <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-slate-900/60 hover:bg-slate-900/80 text-white border border-white/20 backdrop-blur-xs">
                                            <IconDownload size={14} className="text-slate-300" />
                                            <span>Unduh Brosur</span>
                                        </span>
                                    </div>
                                </div>

                                <div className="h-6" />
                            </div>

                            {/* 2. SEKSI BIAYA PENDIDIKAN (TABEL PUTIH CARD + INFO BOX) */}
                            <div className="px-5 sm:px-12 py-16 sm:py-20 bg-white text-center">
                                <div className="max-w-2xl mx-auto space-y-2">
                                    <h2 className="text-xl sm:text-3xl font-black tracking-tight text-slate-900">
                                        {renderStyledTitle(
                                            biayaForm.data.judul_biaya,
                                            'Informasi Biaya Pendidikan yang Transparan',
                                            ['Biaya', 'Transparan'],
                                            'text-blue-600'
                                        )}
                                    </h2>
                                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                        {biayaForm.data.subjudul_biaya ||
                                            'Berikut adalah rincian biaya yang perlu disiapkan untuk mengikuti pendidikan di SMK PGRI Gumelar. Informasi ini membantu kamu dan orang tua dalam mempersiapkan kebutuhan pendidikan dengan lebih baik.'}
                                    </p>
                                </div>

                                <div className="mt-10 max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-6 text-left">
                                    <div className="overflow-x-auto rounded-xl">
                                        <table className="w-full text-xs">
                                            <thead>
                                                <tr className="bg-blue-50/75 text-blue-950 font-bold">
                                                    <th className="w-12 px-3 sm:px-4 py-3 text-center rounded-l-lg">
                                                        No
                                                    </th>
                                                    <th className="px-3 sm:px-4 py-3 text-left">
                                                        Komponen Biaya
                                                    </th>
                                                    <th className="px-3 sm:px-4 py-3 text-left">
                                                        Keterangan
                                                    </th>
                                                    <th className="w-28 sm:w-36 px-3 sm:px-4 py-3 text-left rounded-r-lg">
                                                        Nominal
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {previewBiayaList.map((item, idx) => (
                                                    <tr
                                                        key={idx}
                                                        className="hover:bg-slate-50/50 transition-colors"
                                                    >
                                                        <td className="px-3 sm:px-4 py-3.5 text-center text-slate-500 font-medium">
                                                            {idx + 1}
                                                        </td>
                                                        <td className="px-3 sm:px-4 py-3.5 font-semibold text-slate-800">
                                                            {item.komponen_biaya}
                                                        </td>
                                                        <td className="px-3 sm:px-4 py-3.5 text-slate-600">
                                                            {item.keterangan || '-'}
                                                        </td>
                                                        <td className="px-3 sm:px-4 py-3.5 font-bold text-slate-900">
                                                            {item.nominal_biaya}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Info Note Box */}
                                    <div className="mt-5 rounded-xl bg-blue-50/70 border border-blue-100/90 p-4 flex items-start gap-3">
                                        <IconInfoCircle
                                            size={20}
                                            className="text-blue-600 shrink-0 mt-0.5"
                                        />
                                        <div>
                                            <p className="text-xs font-bold text-blue-950">
                                                Nominal biaya dapat berubah sesuai dengan kebijakan sekolah.
                                            </p>
                                            <p className="text-[11px] text-blue-800/80 mt-0.5 leading-relaxed">
                                                Untuk informasi terbaru dan lebih detail, silakan unduh brosur PPDB atau hubungi panitia PPDB.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 3. SEKSI ALUR PENDAFTARAN (ZIG-ZAG TIMELINE STEPPER) */}
                            <div className="px-5 sm:px-12 py-16 sm:py-20 bg-white text-center border-t border-slate-100">
                                <div className="max-w-2xl mx-auto space-y-2">
                                    <h2 className="text-xl sm:text-3xl font-black tracking-tight text-slate-900">
                                        {renderStyledTitle(
                                            alurForm.data.judul_alur_pendaftaran,
                                            'Langkah Mudah Mendaftar di SMK PGRI Gumelar',
                                            ['Mudah Mendaftar', 'Langkah'],
                                            'text-blue-600'
                                        )}
                                    </h2>
                                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                        {alurForm.data.subjudul_alur_pendaftaran ||
                                            'Ikuti tahapan berikut untuk menyelesaikan proses pendaftaran secara online. Pastikan kamu menyiapkan dokumen yang diperlukan agar proses pendaftaran berjalan lancar.'}
                                    </p>
                                </div>

                                <div className="mt-14 max-w-2xl mx-auto relative">
                                    {/* Garis vertikal timeline */}
                                    <div
                                        className={`absolute top-4 bottom-4 w-0.5 bg-blue-100 ${
                                            previewDevice === 'mobile'
                                                ? 'left-4'
                                                : 'left-1/2 -translate-x-1/2'
                                        }`}
                                    />

                                    <div className="space-y-8 sm:space-y-10 relative">
                                        {previewAlurList.map((item, idx) => {
                                            const stepNum = String(item.langkah || idx + 1).padStart(2, '0');
                                            const isEven = idx % 2 === 0; // step 1, 3, 5 -> Right
                                            const isDesktop = previewDevice === 'desktop';

                                            if (!isDesktop) {
                                                return (
                                                    <div
                                                        key={idx}
                                                        className="relative flex items-start pl-11 text-left"
                                                    >
                                                        <div className="absolute left-0 top-0.5 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-sm z-10">
                                                            {stepNum}
                                                        </div>
                                                        <div>
                                                            <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                                                                {item.judul}
                                                            </h4>
                                                            <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed mt-1">
                                                                {item.deskripsi}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            }

                                            // Desktop: Alternating zigzag
                                            return (
                                                <div
                                                    key={idx}
                                                    className="relative flex items-center justify-between"
                                                >
                                                    {/* Left side */}
                                                    <div
                                                        className={`w-1/2 ${
                                                            isEven ? 'pr-8' : 'pr-8 text-right'
                                                        }`}
                                                    >
                                                        {!isEven && (
                                                            <div>
                                                                <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                                                                    {item.judul}
                                                                </h4>
                                                                <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed mt-1">
                                                                    {item.deskripsi}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Center Badge */}
                                                    <div className="absolute left-1/2 -translate-x-1/2 z-10 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                                                        {stepNum}
                                                    </div>

                                                    {/* Right side */}
                                                    <div
                                                        className={`w-1/2 ${
                                                            isEven ? 'pl-8 text-left' : 'pl-8'
                                                        }`}
                                                    >
                                                        {isEven && (
                                                            <div>
                                                                <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                                                                    {item.judul}
                                                                </h4>
                                                                <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed mt-1">
                                                                    {item.deskripsi}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* 4. SEKSI BANNER BAWAH (CTA CARD WITH ROUNDED CORNERS & MARGIN) */}
                            <div className="px-4 sm:px-8 pb-12 pt-4 bg-white">
                                <div className="relative rounded-3xl overflow-hidden shadow-xl min-h-[260px] sm:min-h-[300px] flex items-center justify-center text-center p-6 sm:p-12 text-white">
                                    <img
                                        src={
                                            bannerPreviewUrl ||
                                            heroPreviewUrl ||
                                            'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop'
                                        }
                                        alt="Banner Bawah SPMB"
                                        className="absolute inset-0 w-full h-full object-cover object-center"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/70 to-slate-900/60 backdrop-blur-[0.5px]" />

                                    <div className="relative z-10 max-w-xl mx-auto space-y-3">
                                        <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                                            {renderStyledTitle(
                                                bannerForm.data.judul_banner_bawah_spmb,
                                                'Masa Depan Cerah Dimulai dari Sini!',
                                                ['Cerah', 'Masa Depan'],
                                                'text-cyan-400'
                                            )}
                                        </h2>
                                        <p className="text-xs sm:text-sm text-slate-200/90 leading-relaxed max-w-md mx-auto whitespace-pre-line">
                                            {bannerForm.data.subjudul_banner_bawah_spmb ||
                                                'Bergabunglah dengan SMK PGRI Gumelar, kembangkan keterampilanmu, dan persiapkan diri untuk meraih masa depan yang kamu impikan.'}
                                        </p>
                                        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-3">
                                            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md">
                                                <span>Daftar Sekarang</span>
                                                <span className="w-3.5 h-3.5 rounded-full bg-white/25 flex items-center justify-center">
                                                    <IconArrowRight size={10} />
                                                </span>
                                            </span>
                                            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium bg-slate-900/60 text-white border border-white/20 backdrop-blur-xs">
                                                <span>Status Pendaftaran</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Pratinjau */}
                            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 text-center text-[11px] text-slate-500">
                                &copy; 2026 SMK PGRI Gumelar Banyumas &bull; Portal SPMB Resmi
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* SLIDE-OVER DRAWER: KOMPONEN BIAYA */}
            {biayaDrawerOpen &&
                createPortal(
                    <div className="fixed inset-0 z-[60] flex justify-end">
                        <div
                            className="fixed inset-0 bg-brand-900/35 backdrop-blur-[1px]"
                            onClick={() => setBiayaDrawerOpen(false)}
                        />
                        <div className="relative z-[70] w-full max-w-md bg-surface-primary h-full shadow-2xl border-l border-stroke-card flex flex-col">
                            <div className="px-5 py-4 border-b border-stroke-card bg-surface-primary flex items-center justify-between">
                                <div>
                                    <h2 className="text-base sm:text-lg font-bold text-content-primary">
                                        {editingBiayaIndex !== null
                                            ? 'Ubah Komponen Biaya'
                                            : 'Tambah Komponen Biaya'}
                                    </h2>
                                    <p className="text-xs text-content-secondary mt-0.5">
                                        Isi rincian item pembiayaan atau program subsidi.
                                    </p>
                                </div>
                                <CmsButton
                                    hierarchy="tertiary"
                                    size="icon-sm"
                                    onClick={() => setBiayaDrawerOpen(false)}
                                >
                                    <IconX size={18} />
                                </CmsButton>
                            </div>

                            <form
                                id="biaya-item-form"
                                onSubmit={saveBiayaDraft}
                                className="flex-1 overflow-y-auto p-5 space-y-4"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-content-primary mb-1.5">
                                        Nama Komponen <span className="text-content-negative">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={biayaDraft.komponen_biaya}
                                        onChange={(e) =>
                                            setBiayaDraft({
                                                ...biayaDraft,
                                                komponen_biaya: e.target.value,
                                            })
                                        }
                                        placeholder="Masukkan nama komponen biaya..."
                                        className={inputClass(Boolean(biayaDraftError))}
                                    />
                                    {biayaDraftError && (
                                        <p className="mt-1 text-xs font-medium text-content-negative">
                                            {biayaDraftError}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-content-primary mb-1.5">
                                        Nominal / Status
                                    </label>
                                    <input
                                        type="text"
                                        value={biayaDraft.nominal_biaya}
                                        onChange={(e) =>
                                            setBiayaDraft({
                                                ...biayaDraft,
                                                nominal_biaya: e.target.value,
                                            })
                                        }
                                        placeholder="Masukkan nominal atau keterangan bebas biaya..."
                                        className={inputClass(false)}
                                    />
                                    <p className="mt-1 text-xs text-content-tertiary">
                                        Kosongkan atau isi tanda strip (-) jika nominal disamarkan.
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-content-primary mb-1.5">
                                        Keterangan Tambahan
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={biayaDraft.keterangan}
                                        onChange={(e) =>
                                            setBiayaDraft({
                                                ...biayaDraft,
                                                keterangan: e.target.value,
                                            })
                                        }
                                        placeholder="Masukkan keterangan singkat..."
                                        className={textareaClass(false)}
                                    />
                                </div>
                            </form>

                            <div className="px-5 py-4 border-t border-stroke-card bg-surface-primary flex items-center justify-end gap-2.5">
                                <CmsButton
                                    hierarchy="secondary"
                                    size="md"
                                    onClick={() => setBiayaDrawerOpen(false)}
                                >
                                    Batal
                                </CmsButton>
                                <CmsButton
                                    type="submit"
                                    form="biaya-item-form"
                                    hierarchy="primary"
                                    size="md"
                                >
                                    Terapkan ke Daftar
                                </CmsButton>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}

            {/* SLIDE-OVER DRAWER: LANGKAH ALUR */}
            {alurDrawerOpen &&
                createPortal(
                    <div className="fixed inset-0 z-[60] flex justify-end">
                        <div
                            className="fixed inset-0 bg-brand-900/35 backdrop-blur-[1px]"
                            onClick={() => setAlurDrawerOpen(false)}
                        />
                        <div className="relative z-[70] w-full max-w-md bg-surface-primary h-full shadow-2xl border-l border-stroke-card flex flex-col">
                            <div className="px-5 py-4 border-b border-stroke-card bg-surface-primary flex items-center justify-between">
                                <div>
                                    <h2 className="text-base sm:text-lg font-bold text-content-primary">
                                        {editingAlurIndex !== null
                                            ? 'Ubah Langkah Pendaftaran'
                                            : 'Tambah Langkah Pendaftaran'}
                                    </h2>
                                    <p className="text-xs text-content-secondary mt-0.5">
                                        Susun tahapan alur yang mudah dipahami calon siswa.
                                    </p>
                                </div>
                                <CmsButton
                                    hierarchy="tertiary"
                                    size="icon-sm"
                                    onClick={() => setAlurDrawerOpen(false)}
                                >
                                    <IconX size={18} />
                                </CmsButton>
                            </div>

                            <form
                                id="alur-item-form"
                                onSubmit={saveAlurDraft}
                                className="flex-1 overflow-y-auto p-5 space-y-4"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-content-primary mb-1.5">
                                        Nomor Langkah
                                    </label>
                                    <input
                                        type="text"
                                        value={alurDraft.langkah}
                                        onChange={(e) =>
                                            setAlurDraft({ ...alurDraft, langkah: e.target.value })
                                        }
                                        placeholder="Masukkan nomor urut..."
                                        className={inputClass(false)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-content-primary mb-1.5">
                                        Judul Langkah <span className="text-content-negative">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={alurDraft.judul}
                                        onChange={(e) =>
                                            setAlurDraft({ ...alurDraft, judul: e.target.value })
                                        }
                                        placeholder="Masukkan judul tahapan..."
                                        className={inputClass(Boolean(alurDraftError))}
                                    />
                                    {alurDraftError && (
                                        <p className="mt-1 text-xs font-medium text-content-negative">
                                            {alurDraftError}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-content-primary mb-1.5">
                                        Deskripsi Langkah
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={alurDraft.deskripsi}
                                        onChange={(e) =>
                                            setAlurDraft({
                                                ...alurDraft,
                                                deskripsi: e.target.value,
                                            })
                                        }
                                        placeholder="Masukkan penjelasan singkat langkah pendaftaran..."
                                        className={textareaClass(false)}
                                    />
                                </div>
                            </form>

                            <div className="px-5 py-4 border-t border-stroke-card bg-surface-primary flex items-center justify-end gap-2.5">
                                <CmsButton
                                    hierarchy="secondary"
                                    size="md"
                                    onClick={() => setAlurDrawerOpen(false)}
                                >
                                    Batal
                                </CmsButton>
                                <CmsButton
                                    type="submit"
                                    form="alur-item-form"
                                    hierarchy="primary"
                                    size="md"
                                >
                                    Terapkan ke Daftar
                                </CmsButton>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}

            {/* MODAL KONFIRMASI HAPUS ITEM */}
            {deleteConfirm &&
                createPortal(
                    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
                        <div
                            className="fixed inset-0 bg-brand-900/40 backdrop-blur-[1px]"
                            onClick={() => setDeleteConfirm(null)}
                        />
                        <div className="relative z-10 w-full max-w-md bg-surface-primary rounded-xl border border-stroke-card shadow-2xl overflow-hidden">
                            <div className="p-5 sm:p-6">
                                <div className="w-10 h-10 rounded-full bg-negative-100 text-content-negative flex items-center justify-center mb-4">
                                    <IconAlertCircle size={20} />
                                </div>
                                <h3 className="text-base font-bold text-content-primary">
                                    Hapus Item dari Daftar?
                                </h3>
                                <p className="text-sm text-content-secondary mt-1.5">
                                    Anda yakin ingin menghapus{' '}
                                    <strong className="text-content-primary">
                                        {deleteConfirm.label}
                                    </strong>
                                    ? Jangan lupa tekan Simpan Pengaturan setelahnya.
                                </p>
                            </div>
                            <div className="px-5 py-4 border-t border-stroke-card bg-surface-primary flex items-center justify-end gap-2.5">
                                <CmsButton
                                    hierarchy="secondary"
                                    size="md"
                                    onClick={() => setDeleteConfirm(null)}
                                >
                                    Batal
                                </CmsButton>
                                <CmsButton
                                    hierarchy="primary"
                                    tone="danger"
                                    size="md"
                                    onClick={confirmDelete}
                                >
                                    Hapus Item
                                </CmsButton>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
        </AdminLayout>
    );
}
