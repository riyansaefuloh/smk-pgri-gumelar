import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import {
    IconMenu2,
    IconExternalLink,
    IconUser,
    IconLogout,
    IconChevronDown,
    IconBell,
} from '@tabler/icons-react';

export default function AdminTopbar({ title = 'Dashboard', user, onToggleSidebar }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = (e) => {
        e.preventDefault();
        router.post('/logout');
    };

    const userName = user?.name || 'Admin SMK PGRI Gumelar';
    const userRole = 'Admin';

    return (
        <header className="h-16 bg-white border-b border-[#e5e5e5] px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 shrink-0 font-sans">
            {/* Sisi Kiri: Toggle Drawer Mobile & Breadcrumb Kontekstual IDDS */}
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={onToggleSidebar}
                    className="lg:hidden p-2 rounded-xl text-[#525252] hover:text-[#1f1f1f] hover:bg-[#f2f2f2] transition"
                    aria-label="Buka Menu"
                >
                    <IconMenu2 size={20} />
                </button>

                <div className="flex items-center gap-2 text-xs font-inter text-[#737373]">
                    <span className="hidden sm:inline font-normal">Admin CMS</span>
                    <span className="hidden sm:inline text-[#a3a3a3]">/</span>
                    <span className="font-semibold text-sm sm:text-[15px] text-[#1f1f1f] tracking-tight">
                        {title}
                    </span>
                </div>
            </div>

            {/* Sisi Kanan: Quick Link Portal, Lonceng Notifikasi, dan Profil Admin */}
            <div className="flex items-center gap-3">
                {/* Tombol Cepat Website Publik */}
                <a
                    href="/"
                    target="_blank"
                    rel="noreferrer"
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-inter font-medium text-[#525252] bg-white hover:bg-[#ecf3fe] hover:text-[#0968f6] border border-[#e5e5e5] shadow-xs transition"
                >
                    <IconExternalLink size={14} />
                    <span>Website Publik</span>
                </a>

                {/* Lonceng Notifikasi Sistem dengan Badge Merah */}
                <button
                    type="button"
                    className="relative p-2 rounded-xl text-[#737373] hover:text-[#0968f6] hover:bg-[#ecf3fe] transition cursor-pointer"
                    title="Notifikasi Sistem"
                >
                    <IconBell size={18} stroke={1.8} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#d50b0b] ring-2 ring-white" />
                </button>

                <div className="h-5 w-px bg-[#e5e5e5] hidden sm:block" />

                {/* Profil Pengguna Dropdown (Menggunakan Aset Komponen React Asli / SVG Icon Tanpa File Gambar) */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-xl hover:bg-[#f2f2f2] transition cursor-pointer select-none"
                    >
                        {/* Komponen Avatar Bawaan React dengan Ikon User IDDS */}
                        <div className="w-8 h-8 rounded-full bg-[#ecf3fe] text-[#0968f6] border border-[#dceafe] flex items-center justify-center shrink-0">
                            <IconUser size={18} stroke={1.8} />
                        </div>

                        <div className="hidden md:flex flex-col text-left">
                            <span className="font-semibold text-[12.5px] text-[#1f1f1f] leading-tight">
                                {userName}
                            </span>
                            <span className="font-normal text-[11px] text-[#737373] leading-tight">
                                {userRole}
                            </span>
                        </div>

                        <IconChevronDown
                            size={16}
                            className={`text-[#737373] transition-transform duration-200 hidden sm:block ${
                                dropdownOpen ? 'rotate-180' : ''
                            }`}
                        />
                    </button>

                    {/* Dropdown Menu Pengguna */}
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-[#e5e5e5] py-2 z-50 text-xs animate-in fade-in slide-in-from-top-1">
                            <div className="px-3.5 py-2 border-b border-[#e5e5e5] md:hidden">
                                <p className="font-bold text-[#1f1f1f] text-[13px]">{userName}</p>
                                <p className="text-[#737373] text-[11px]">{userRole}</p>
                            </div>

                            <a
                                href="/"
                                target="_blank"
                                rel="noreferrer"
                                className="flex sm:hidden items-center gap-2 px-3.5 py-2 text-[#525252] hover:bg-[#ecf3fe] hover:text-[#0968f6] transition font-medium"
                            >
                                <IconExternalLink size={15} />
                                <span>Lihat Website Publik</span>
                            </a>

                            <Link
                                href="/profile"
                                onClick={() => setDropdownOpen(false)}
                                className="flex items-center gap-2 px-3.5 py-2 text-[#525252] hover:bg-[#f2f2f2] hover:text-[#0968f6] transition font-medium"
                            >
                                <IconUser size={15} />
                                <span>Kelola Profil Akun</span>
                            </Link>

                            <div className="my-1 border-t border-[#e5e5e5]" />

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="w-full flex items-center gap-2 px-3.5 py-2 text-[#d50b0b] hover:bg-[#fdeded] transition text-left font-medium"
                            >
                                <IconLogout size={15} />
                                <span>Keluar (Logout)</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
