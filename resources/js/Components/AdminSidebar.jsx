import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    IconDashboard,
    IconHome,
    IconSchool,
    IconUsers,
    IconBuilding,
    IconFileText,
    IconCalendar,
    IconDownload,
    IconTools,
    IconPalette,
    IconBriefcase,
    IconUserCheck,
    IconKey,
    IconPhone,
    IconSettings,
    IconChevronDown,
    IconChevronRight,
    IconX,
    IconId,
} from '@tabler/icons-react';

export default function AdminSidebar({ isOpen, onClose }) {
    const { url } = usePage();

    const [openGroups, setOpenGroups] = useState({
        profil: true,
        spmb: true,
        akademik: false,
        tefa: false,
        karier: false,
        pengaturan: false,
    });

    const toggleGroup = (key) => {
        setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const isCurrent = (path) => url === path || url.startsWith(path + '/');

    const menuGroups = [
        {
            title: 'Utama',
            items: [
                { label: 'Dashboard', href: '/dashboard', icon: IconDashboard },
            ],
        },
        {
            groupKey: 'spmb',
            title: 'Layanan SPMB (PPDB)',
            items: [
                { label: 'Data Pendaftar Masuk', href: '/admin/spmb-pendaftar', icon: IconId, highlight: true },
                { label: 'Gelombang Pendaftaran', href: '/admin/spmb-gelombang', icon: IconCalendar },
                { label: 'Teks Halaman SPMB', href: '/admin/spmb-halaman', icon: IconFileText },
            ],
        },
        {
            groupKey: 'karier',
            title: 'BKK & Tracer Alumni',
            items: [
                { label: 'Data Tracer Study', href: '/admin/alumni-tracer', icon: IconUserCheck, highlight: true },
                { label: 'Kode Validasi Alumni', href: '/admin/kode-alumni', icon: IconKey },
                { label: 'Lowongan Kerja (BKK)', href: '/admin/lowongan-kerja', icon: IconBriefcase },
                { label: 'Mitra Industri (DUDI)', href: '/admin/mitra-dudi', icon: IconBuilding },
            ],
        },
        {
            groupKey: 'profil',
            title: 'Beranda & Profil',
            items: [
                { label: 'Hero & Sambutan Beranda', href: '/admin/beranda', icon: IconHome },
                { label: 'Tentang & Visi-Misi', href: '/admin/tentang-sekolah', icon: IconSchool },
                { label: 'Sejarah Sekolah', href: '/admin/sejarah-sekolah', icon: IconFileText },
                { label: 'Struktur Organisasi', href: '/admin/struktur-organisasi', icon: IconUsers },
                { label: 'Direktori Guru & GTK', href: '/admin/guru', icon: IconUsers },
                { label: 'Sarana & Prasarana', href: '/admin/sarpras', icon: IconBuilding },
            ],
        },
        {
            groupKey: 'akademik',
            title: 'Akademik & Publikasi',
            items: [
                { label: 'Program Keahlian TBSM', href: '/admin/program-keahlian', icon: IconSchool },
                { label: 'Berita & Pengumuman', href: '/admin/berita', icon: IconFileText },
                { label: 'Kategori Berita', href: '/admin/kategori-berita', icon: IconFileText },
                { label: 'Kalender Akademik', href: '/admin/kalender-akademik', icon: IconCalendar },
                { label: 'Kategori Kegiatan', href: '/admin/kategori-kegiatan', icon: IconCalendar },
                { label: 'Pusat Unduhan Publik', href: '/admin/unduhan', icon: IconDownload },
            ],
        },
        {
            groupKey: 'tefa',
            title: 'TEFA & Karya Siswa',
            items: [
                { label: 'Bengkel TEFA Motor', href: '/admin/tefa-bengkel', icon: IconTools },
                { label: 'Galeri Karya Siswa', href: '/admin/tefa-karya', icon: IconPalette },
                { label: 'Kategori Karya', href: '/admin/kategori-karya', icon: IconPalette },
            ],
        },
        {
            groupKey: 'pengaturan',
            title: 'Pengaturan Sentral',
            items: [
                { label: 'Header 10 Halaman', href: '/admin/halaman-header', icon: IconSettings },
                { label: 'Kontak & Medsos Sekolah', href: '/admin/kontak-sekolah', icon: IconPhone },
            ],
        },
    ];

    return (
        <>
            {/* Backdrop Mobile */}
            {isOpen && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
                />
            )}

            {/* Sidebar Container */}
            <aside
                className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Brand Header */}
                <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800 bg-slate-950/60">
                    <Link href="/dashboard" className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md">
                            <IconSchool size={22} />
                        </div>
                        <div>
                            <span className="font-extrabold text-white text-sm tracking-tight block">
                                CMS SMK PGRI
                            </span>
                            <span className="text-[10px] text-slate-400 block font-medium">
                                Panel Pengelola Sekolah
                            </span>
                        </div>
                    </Link>
                    <button
                        type="button"
                        onClick={onClose}
                        className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                    >
                        <IconX size={20} />
                    </button>
                </div>

                {/* Navigasi Scrollable */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5 text-xs">
                    {menuGroups.map((group, gIdx) => {
                        // Jika bukan grup expandable (seperti menu Utama)
                        if (!group.groupKey) {
                            return (
                                <div key={gIdx} className="space-y-1">
                                    {group.items.map((item, iIdx) => {
                                        const ItemIcon = item.icon;
                                        const active = isCurrent(item.href);
                                        return (
                                            <Link
                                                key={iIdx}
                                                href={item.href}
                                                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold transition-colors ${
                                                    active
                                                        ? 'bg-blue-600 text-white shadow-sm'
                                                        : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                                                }`}
                                            >
                                                <ItemIcon size={18} className={active ? 'text-white' : 'text-slate-400'} />
                                                <span>{item.label}</span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            );
                        }

                        const isGroupOpen = openGroups[group.groupKey] ?? true;

                        return (
                            <div key={gIdx} className="space-y-1">
                                <button
                                    type="button"
                                    onClick={() => toggleGroup(group.groupKey)}
                                    className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider hover:text-slate-200"
                                >
                                    <span>{group.title}</span>
                                    <IconChevronDown
                                        size={14}
                                        className={`transition-transform duration-200 ${isGroupOpen ? '' : '-rotate-90'}`}
                                    />
                                </button>

                                {isGroupOpen && (
                                    <div className="space-y-0.5 pt-0.5">
                                        {group.items.map((item, iIdx) => {
                                            const ItemIcon = item.icon;
                                            const active = isCurrent(item.href);
                                            return (
                                                <Link
                                                    key={iIdx}
                                                    href={item.href}
                                                    className={`flex items-center justify-between px-3.5 py-2 rounded-xl font-medium transition-colors ${
                                                        active
                                                            ? 'bg-blue-600 text-white font-semibold shadow-xs'
                                                            : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-2.5 truncate">
                                                        <ItemIcon size={16} className={active ? 'text-white' : 'text-slate-400'} />
                                                        <span className="truncate">{item.label}</span>
                                                    </div>
                                                    {item.highlight && !active && (
                                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                                    )}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Footer Sidebar */}
                <div className="p-3 border-t border-slate-800 bg-slate-950/40 text-[11px] text-slate-400 text-center">
                    <span>Versi Integratif 1.0 (PKM-TTG)</span>
                </div>
            </aside>
        </>
    );
}
