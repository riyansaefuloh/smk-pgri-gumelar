import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    IconChevronDown,
    IconMenu2,
    IconX,
    IconPhone,
    IconMail,
    IconSchool,
    IconArrowRight,
    IconBook,
    IconUsers,
    IconBuilding,
    IconCalendar,
    IconDownload,
    IconTools,
    IconPalette,
    IconBriefcase,
    IconUserCheck,
    IconFileText,
} from '@tabler/icons-react';

export default function Navbar() {
    const { url, props } = usePage();
    const kontak = props.kontak_sekolah || {};
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);

    const toggleDropdown = (name) => {
        setOpenDropdown(openDropdown === name ? null : name);
    };

    const isCurrent = (path) => {
        if (path === '/' && url === '/') return true;
        if (path !== '/' && url.startsWith(path)) return true;
        return false;
    };

    const navItems = [
        { label: 'Beranda', href: '/' },
        {
            label: 'Profile',
            dropdown: [
                { label: 'Tentang Sekolah', href: '/profil/tentang', desc: 'Visi, misi, dan profil umum', icon: IconSchool },
                { label: 'Sejarah Sekolah', href: '/profil/sejarah', desc: 'Perjalanan berdirinya sekolah', icon: IconBook },
                { label: 'Struktur Organisasi', href: '/profil/struktur', desc: 'Bagan kepemimpinan sekolah', icon: IconUsers },
                { label: 'Guru & Tenaga Pengajar', href: '/profil/guru', desc: 'Direktori GTK sekolah', icon: IconUsers },
                { label: 'Sarana & Prasarana', href: '/profil/sarpras', desc: 'Fasilitas bengkel dan belajar', icon: IconBuilding },
            ],
        },
        { label: 'Program Keahlian', href: '/jurusan' },
        {
            label: 'Akademik',
            dropdown: [
                { label: 'Berita & Pengumuman', href: '/berita', desc: 'Informasi dan warta terkini', icon: IconFileText },
                { label: 'Kalender Akademik', href: '/kalender', desc: 'Jadwal dan agenda sekolah', icon: IconCalendar },
                { label: 'Pusat Unduhan', href: '/unduhan', desc: 'Berkas dan formulir publik', icon: IconDownload },
            ],
        },
        {
            label: 'TEFA & Karya',
            dropdown: [
                { label: 'Teaching Factory (TEFA)', href: '/tefa', desc: 'Unit produksi & servis motor', icon: IconTools },
                { label: 'Karya Siswa', href: '/karya', desc: 'Inovasi & kreativitas kejuruan', icon: IconPalette },
            ],
        },
        {
            label: 'Karier & Alumni',
            dropdown: [
                { label: 'Kemitraan Industri (DUDI)', href: '/mitra', desc: 'Perusahaan mitra sekolah', icon: IconBriefcase },
                { label: 'Bursa Kerja Khusus (BKK)', href: '/bkk', desc: 'Lowongan kerja lulusan', icon: IconBriefcase },
                { label: 'Tracer Study', href: '/tracer-study', desc: 'Penelusuran jejak alumni', icon: IconUserCheck },
            ],
        },
    ];

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
            {/* Top Bar Informasi Kontak */}
            <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-6 lg:px-8 hidden md:block">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <span className="flex items-center gap-1.5">
                            <IconPhone size={14} className="text-amber-400" />
                            {kontak.nomor_telepon || '(0281) 657xxxx'} / {kontak.nomor_whatsapp || '0812-3456-7890'}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <IconMail size={14} className="text-amber-400" />
                            {kontak.alamat_email || 'smkpgridm.gumelar@gmail.com'}
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span>Kecamatan Gumelar, Kabupaten Banyumas</span>
                        <Link href="/login" className="text-slate-400 hover:text-white transition">
                            Login Admin
                        </Link>
                    </div>
                </div>
            </div>

            {/* Navbar Utama */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Brand Logo & Nama Sekolah */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
                            <IconSchool size={26} stroke={1.8} />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-extrabold text-slate-900 text-base sm:text-lg leading-tight tracking-tight">
                                SMK PGRI GUMELAR
                            </span>
                            <span className="text-[11px] text-slate-500 font-medium tracking-wide">
                                YPLP DM PGRI JT Cabang Banyumas
                            </span>
                        </div>
                    </Link>

                    {/* Navigasi Desktop */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {navItems.map((item, idx) => {
                            if (!item.dropdown) {
                                return (
                                    <Link
                                        key={idx}
                                        href={item.href}
                                        className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors ${
                                            isCurrent(item.href)
                                                ? 'text-blue-700 bg-blue-50/70'
                                                : 'text-slate-750 hover:text-blue-700 hover:bg-slate-100/70'
                                        }`}
                                    >
                                        {item.label}
                                    </Link>
                                );
                            }

                            return (
                                <div key={idx} className="relative group">
                                    <button
                                        type="button"
                                        className="flex items-center gap-1 px-3.5 py-2 text-sm font-semibold text-slate-750 group-hover:text-blue-700 rounded-lg group-hover:bg-slate-100/70 transition-colors"
                                    >
                                        {item.label}
                                        <IconChevronDown size={16} className="text-slate-400 group-hover:text-blue-700 group-hover:rotate-180 transition-transform duration-200" />
                                    </button>

                                    {/* Dropdown Menu Desktop */}
                                    <div className="absolute left-0 top-full pt-2 w-72 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-1">
                                        <div className="bg-white rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-150 p-2 space-y-1 ring-1 ring-black/5">
                                            {item.dropdown.map((sub, sIdx) => {
                                                const SubIcon = sub.icon;
                                                return (
                                                    <Link
                                                        key={sIdx}
                                                        href={sub.href}
                                                        className={`flex items-start gap-3 p-2.5 rounded-xl transition-colors ${
                                                            isCurrent(sub.href)
                                                                ? 'bg-blue-50/80 text-blue-700'
                                                                : 'hover:bg-slate-50 text-slate-700 hover:text-blue-700'
                                                        }`}
                                                    >
                                                        <div className="p-2 rounded-lg bg-slate-100 text-slate-600 group-hover/sub:bg-blue-100 group-hover/sub:text-blue-700 mt-0.5">
                                                            <SubIcon size={18} />
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-bold leading-tight">
                                                                {sub.label}
                                                            </div>
                                                            <div className="text-[11px] text-slate-500 font-normal mt-0.5 leading-snug">
                                                                {sub.desc}
                                                            </div>
                                                        </div>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </nav>

                    {/* Tombol CTA SPMB Desktop */}
                    <div className="hidden lg:flex items-center gap-3">
                        <Link
                            href="/spmb"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-600 text-white text-sm font-bold shadow-md shadow-blue-600/25 hover:shadow-lg hover:shadow-blue-600/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                        >
                            <span>Daftar SPMB</span>
                            <IconArrowRight size={16} />
                        </Link>
                    </div>

                    {/* Hamburger Button Mobile */}
                    <div className="flex lg:hidden items-center gap-2">
                        <Link
                            href="/spmb"
                            className="px-3 py-1.5 text-xs font-bold bg-blue-700 text-white rounded-lg shadow-sm"
                        >
                            SPMB
                        </Link>
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-xl text-slate-700 hover:text-blue-700 hover:bg-slate-100 transition"
                            aria-label="Toggle Menu"
                        >
                            {mobileMenuOpen ? <IconX size={26} /> : <IconMenu2 size={26} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Menu Navigasi Mobile (Drawer) */}
            {mobileMenuOpen && (
                <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 max-h-[calc(100vh-5rem)] overflow-y-auto">
                    <div className="space-y-1">
                        {navItems.map((item, idx) => {
                            if (!item.dropdown) {
                                return (
                                    <Link
                                        key={idx}
                                        href={item.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`block px-3 py-2.5 rounded-xl text-sm font-bold ${
                                            isCurrent(item.href)
                                                ? 'bg-blue-50 text-blue-700'
                                                : 'text-slate-800 hover:bg-slate-50'
                                        }`}
                                    >
                                        {item.label}
                                    </Link>
                                );
                            }

                            const isOpen = openDropdown === item.label;

                            return (
                                <div key={idx} className="border-b border-slate-100 py-1">
                                    <button
                                        type="button"
                                        onClick={() => toggleDropdown(item.label)}
                                        className="w-full flex items-center justify-between px-3 py-2 text-sm font-bold text-slate-800"
                                    >
                                        <span>{item.label}</span>
                                        <IconChevronDown
                                            size={18}
                                            className={`transition-transform ${isOpen ? 'rotate-180 text-blue-700' : 'text-slate-400'}`}
                                        />
                                    </button>

                                    {isOpen && (
                                        <div className="pl-4 pr-2 py-1 space-y-1 bg-slate-50/70 rounded-xl mt-1">
                                            {item.dropdown.map((sub, sIdx) => (
                                                <Link
                                                    key={sIdx}
                                                    href={sub.href}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className={`block px-3 py-2 rounded-lg text-xs font-semibold ${
                                                        isCurrent(sub.href)
                                                            ? 'text-blue-700 bg-white font-bold shadow-xs'
                                                            : 'text-slate-650 hover:text-blue-700'
                                                    }`}
                                                >
                                                    {sub.label}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-200 flex flex-col gap-2">
                        <Link
                            href="/spmb"
                            onClick={() => setMobileMenuOpen(false)}
                            className="w-full text-center py-3 bg-gradient-to-r from-blue-700 to-indigo-600 text-white font-bold rounded-xl shadow-md text-sm"
                        >
                            Daftar SPMB Online
                        </Link>
                        <Link
                            href="/login"
                            onClick={() => setMobileMenuOpen(false)}
                            className="w-full text-center py-2 text-slate-500 font-semibold text-xs hover:text-slate-800"
                        >
                            Masuk ke Panel Admin (CMS)
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
