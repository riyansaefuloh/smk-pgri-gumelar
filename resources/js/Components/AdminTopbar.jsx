import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import {
    IconMenu2,
    IconExternalLink,
    IconUser,
    IconLogout,
    IconChevronDown,
} from '@tabler/icons-react';
import { Avatar } from '@idds/react';

export default function AdminTopbar({ user, onToggleSidebar }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = (e) => {
        e.preventDefault();
        router.post('/logout');
    };

    return (
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-xs sticky top-0 z-30">
            {/* Sisi Kiri: Toggle Sidebar Mobile & Quick Link Web */}
            <div className="flex items-center gap-4">
                <button
                    type="button"
                    onClick={onToggleSidebar}
                    className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                    aria-label="Toggle Sidebar"
                >
                    <IconMenu2 size={24} />
                </button>

                <a
                    href="/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 transition"
                >
                    <IconExternalLink size={15} />
                    <span>Lihat Website Publik</span>
                </a>
            </div>

            {/* Sisi Kanan: User Profile & Dropdown Logout */}
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition"
                >
                    <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                        {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                    </div>
                    <div className="hidden sm:block text-left">
                        <div className="text-xs font-bold text-slate-800 leading-tight">
                            {user?.name || 'Admin SMK PGRI'}
                        </div>
                        <div className="text-[10px] text-slate-500 font-normal leading-tight">
                            {user?.email || 'admin@smkpgri-gumelar.sch.id'}
                        </div>
                    </div>
                    <IconChevronDown size={14} className="text-slate-400 hidden sm:block" />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 text-xs">
                        <div className="px-4 py-2 border-b border-slate-100 sm:hidden">
                            <p className="font-bold text-slate-800">{user?.name || 'Admin'}</p>
                            <p className="text-slate-500 text-[11px] truncate">{user?.email}</p>
                        </div>

                        <Link
                            href="/profile"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-blue-700 transition"
                        >
                            <IconUser size={16} />
                            <span>Pengaturan Akun</span>
                        </Link>

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 transition text-left"
                        >
                            <IconLogout size={16} />
                            <span>Keluar (Logout)</span>
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}
