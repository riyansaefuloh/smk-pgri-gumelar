import React, { useEffect, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    IconArrowRight,
    IconBook,
    IconBriefcase,
    IconBuilding,
    IconCalendar,
    IconChevronDown,
    IconClipboardList,
    IconDownload,
    IconFileText,
    IconInfoCircle,
    IconMenu2,
    IconPalette,
    IconSchool,
    IconTools,
    IconUserCheck,
    IconUsers,
    IconX,
} from '@tabler/icons-react';

export default function Navbar({ transparent = false }) {
    const { url } = usePage();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [scrolled, setScrolled] = useState(false);
    const [logoFailed, setLogoFailed] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 24);
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isTransparent = transparent && !scrolled && !mobileMenuOpen;

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
                { label: 'Guru & Tenaga Pengajar', href: '/profil/guru', desc: 'Direktori guru & staf', icon: IconUsers },
                { label: 'Sarana & Prasarana', href: '/profil/sarpras', desc: 'Fasilitas bengkel dan belajar', icon: IconBuilding },
            ],
        },
        {
            label: 'SPMB',
            dropdown: [
                { label: 'Informasi SPMB', href: '/spmb', desc: 'Alur, syarat, dan jadwal gelombang', icon: IconInfoCircle },
                { label: 'Formulir Pendaftaran', href: '/spmb#daftar', desc: 'Daftar calon siswa baru online', icon: IconClipboardList },
            ],
        },
        {
            label: 'Akademik',
            dropdown: [
                { label: 'Program Keahlian', href: '/jurusan', desc: 'Kompetensi keahlian & kurikulum', icon: IconSchool },
                { label: 'Berita & Pengumuman', href: '/berita', desc: 'Informasi dan warta terkini', icon: IconFileText },
                { label: 'Kalender Akademik', href: '/kalender', desc: 'Jadwal dan agenda sekolah', icon: IconCalendar },
                { label: 'Pusat Unduhan', href: '/unduhan', desc: 'Berkas dan formulir publik', icon: IconDownload },
            ],
        },
        {
            label: 'TEFA & Karya',
            dropdown: [
                { label: 'Teaching Factory (TEFA)', href: '/tefa', desc: 'Unit produksi & layanan servis', icon: IconTools },
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
        <header
            className={`w-full z-50 transition-all duration-200 ${
                transparent ? 'fixed top-0 inset-x-0' : 'sticky top-0'
            } ${
                isTransparent
                    ? 'bg-transparent text-white'
                    : 'bg-white/95 backdrop-blur-md border-b border-stroke-card text-content-primary shadow-xs'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Brand Logo & Nama Sekolah */}
                    <Link href="/" className="flex items-center gap-3 group shrink-0">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
                            {!logoFailed ? (
                                <img
                                    src="/images/logo-pgri.png"
                                    alt="Logo SMK PGRI Gumelar"
                                    className="w-full h-full object-contain"
                                    onError={() => setLogoFailed(true)}
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-xl bg-pub-primary text-white flex items-center justify-center">
                                    <IconSchool size={22} stroke={1.8} />
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col">
                            <span
                                className={`font-heading font-bold text-base sm:text-lg leading-tight tracking-tight transition-colors ${
                                    isTransparent ? 'text-white' : 'text-content-primary'
                                }`}
                            >
                                SMK PGRI Gumelar
                            </span>
                            <span
                                className={`font-body text-xs font-normal leading-tight transition-colors ${
                                    isTransparent ? 'text-white/80' : 'text-content-secondary'
                                }`}
                            >
                                YPLP DM PGRI JT Cabang Banyumas
                            </span>
                        </div>
                    </Link>

                    {/* Navigasi Desktop */}
                    <nav className="hidden lg:flex items-center gap-1 font-body">
                        {navItems.map((item, idx) => {
                            if (!item.dropdown) {
                                const active = isCurrent(item.href);
                                return (
                                    <Link
                                        key={idx}
                                        href={item.href}
                                        className={`px-3.5 py-2 text-sm rounded-lg transition-colors ${
                                            isTransparent
                                                ? active
                                                    ? 'text-white font-semibold drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]'
                                                    : 'text-white/90 hover:text-white font-medium'
                                                : active
                                                    ? 'text-pub-primary font-semibold'
                                                    : 'text-content-secondary hover:text-pub-primary font-medium'
                                        }`}
                                    >
                                        {item.label}
                                    </Link>
                                );
                            }

                            const isDropdownActive = item.dropdown.some((sub) => isCurrent(sub.href));

                            return (
                                <div key={idx} className="relative group">
                                    <button
                                        type="button"
                                        className={`flex items-center gap-1 px-3 py-2 text-sm rounded-lg transition-colors ${
                                            isTransparent
                                                ? isDropdownActive
                                                    ? 'text-white font-semibold'
                                                    : 'text-white/90 hover:text-white font-medium'
                                                : isDropdownActive
                                                    ? 'text-pub-primary font-semibold'
                                                    : 'text-content-secondary hover:text-pub-primary font-medium'
                                        }`}
                                    >
                                        <span>{item.label}</span>
                                        <IconChevronDown
                                            size={15}
                                            className={`group-hover:rotate-180 transition-transform duration-200 ${
                                                isTransparent ? 'text-white/80' : 'text-content-tertiary group-hover:text-pub-primary'
                                            }`}
                                        />
                                    </button>

                                    {/* Dropdown Menu Desktop */}
                                    <div className="absolute left-0 top-full pt-2 w-72 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-1">
                                        <div className="bg-surface-primary rounded-2xl shadow-xl border border-stroke-card p-2 space-y-1">
                                            {item.dropdown.map((sub, sIdx) => {
                                                const SubIcon = sub.icon;
                                                return (
                                                    <Link
                                                        key={sIdx}
                                                        href={sub.href}
                                                        className={`flex items-start gap-3 p-2.5 rounded-xl transition-colors ${
                                                            isCurrent(sub.href)
                                                                ? 'bg-pub-soft text-pub-primary'
                                                                : 'hover:bg-pub-muted text-content-primary hover:text-pub-primary'
                                                        }`}
                                                    >
                                                        <div className="p-2 rounded-lg bg-pub-soft text-pub-primary mt-0.5 shrink-0">
                                                            <SubIcon size={17} />
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-semibold leading-tight">
                                                                {sub.label}
                                                            </div>
                                                            <div className="text-xs text-content-tertiary font-normal mt-0.5 leading-snug">
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

                    {/* Tombol CTA Pill Desktop */}
                    <div className="hidden lg:flex items-center gap-3 shrink-0">
                        <Link
                            href="/spmb"
                            className="inline-flex items-center gap-2.5 pl-5 pr-2 py-1.5 rounded-full bg-[#4F6DF5] hover:bg-[#3B5BDB] text-white font-body text-sm font-medium shadow-md shadow-[#4F6DF5]/25 transition-all"
                        >
                            <span>Daftar</span>
                            <span className="w-7 h-7 rounded-full bg-white text-[#4F6DF5] flex items-center justify-center shrink-0">
                                <IconArrowRight size={15} stroke={2.4} />
                            </span>
                        </Link>
                    </div>

                    {/* Hamburger Button Mobile */}
                    <div className="flex lg:hidden items-center gap-2">
                        <Link
                            href="/spmb"
                            className="inline-flex items-center gap-1.5 pl-3.5 pr-1.5 py-1 rounded-full bg-[#4F6DF5] text-white font-body text-xs font-medium shadow-xs"
                        >
                            <span>Daftar</span>
                            <span className="w-5 h-5 rounded-full bg-white text-[#4F6DF5] flex items-center justify-center shrink-0">
                                <IconArrowRight size={12} stroke={2.4} />
                            </span>
                        </Link>
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className={`p-2 rounded-xl transition ${
                                isTransparent
                                    ? 'text-white hover:bg-white/10'
                                    : 'text-content-primary hover:text-pub-primary hover:bg-pub-muted'
                            }`}
                            aria-label="Toggle Menu"
                        >
                            {mobileMenuOpen ? <IconX size={24} /> : <IconMenu2 size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Menu Navigasi Mobile */}
            {mobileMenuOpen && (
                <div className="lg:hidden border-t border-stroke-card bg-surface-primary text-content-primary px-4 pt-3 pb-6 max-h-[calc(100vh-5rem)] overflow-y-auto font-body">
                    <div className="space-y-1">
                        {navItems.map((item, idx) => {
                            if (!item.dropdown) {
                                return (
                                    <Link
                                        key={idx}
                                        href={item.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`block px-3 py-2.5 rounded-xl text-sm font-semibold ${
                                            isCurrent(item.href)
                                                ? 'bg-pub-soft text-pub-primary'
                                                : 'text-content-primary hover:bg-pub-muted'
                                        }`}
                                    >
                                        {item.label}
                                    </Link>
                                );
                            }

                            const isOpen = openDropdown === item.label;

                            return (
                                <div key={idx} className="border-b border-stroke-card py-1">
                                    <button
                                        type="button"
                                        onClick={() => toggleDropdown(item.label)}
                                        className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-content-primary"
                                    >
                                        <span>{item.label}</span>
                                        <IconChevronDown
                                            size={18}
                                            className={`transition-transform ${isOpen ? 'rotate-180 text-pub-primary' : 'text-content-tertiary'}`}
                                        />
                                    </button>

                                    {isOpen && (
                                        <div className="pl-4 pr-2 py-1 space-y-1 bg-pub-muted rounded-xl mt-1">
                                            {item.dropdown.map((sub, sIdx) => (
                                                <Link
                                                    key={sIdx}
                                                    href={sub.href}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className={`block px-3 py-2 rounded-lg text-xs font-medium ${
                                                        isCurrent(sub.href)
                                                            ? 'text-pub-primary bg-surface-primary font-semibold shadow-xs'
                                                            : 'text-content-secondary hover:text-pub-primary'
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

                    <div className="mt-5 pt-4 border-t border-stroke-card flex flex-col gap-2">
                        <Link
                            href="/spmb"
                            onClick={() => setMobileMenuOpen(false)}
                            className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-pub-primary hover:bg-pub-hover text-white font-medium rounded-full shadow-md text-sm"
                        >
                            <span>Daftar SPMB Online</span>
                            <IconArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
