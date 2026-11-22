import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import Swal from 'sweetalert2';
import {
    IconHome,
    IconBuildingBank,
    IconSchool,
    IconBook,
    IconBuildingStore,
    IconBriefcase,
    IconUserSearch,
    IconBook2,
    IconChevronDown,
    IconX,
    IconLayoutSidebarLeftCollapse,
    IconLayoutSidebarLeftExpand,
} from '@tabler/icons-react';

export default function AdminSidebar({
    isOpen,
    onClose,
    isCollapsed = false,
    onToggleCollapse,
}) {
    const { url } = usePage();

    // Accordion otomatis membuka menu terkait route aktif
    const [openGroups, setOpenGroups] = useState({
        profil: url.includes('/admin/beranda') || url.includes('/admin/tentang-sekolah') || url.includes('/admin/sejarah-sekolah') || url.includes('/admin/struktur-organisasi') || url.includes('/admin/guru') || url.includes('/admin/sarpras'),
        spmb: url.includes('/admin/spmb'),
        academic: url.includes('/admin/program-keahlian') || url.includes('/admin/berita') || url.includes('/admin/kalender-akademik') || url.includes('/admin/unduhan') || url.includes('/admin/mapel-pilihan') || url.includes('/admin/ekstrakurikuler') || url.includes('/admin/osis-kesiswaan'),
        tefa: url.includes('/admin/tefa') || url.includes('/admin/kategori-karya'),
        dudi: url.includes('/admin/lowongan') || url.includes('/admin/mitra'),
        tracer: url.includes('/admin/alumni') || url.includes('/admin/kode-alumni'),
    });

    const toggleGroup = (key) => {
        setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const isCurrent = (path) => url === path || url.startsWith(path + '/');

    // 6 Modul Utama Layanan Sekolah
    const menuGroups = [
        {
            key: 'profil',
            label: 'Profil Sekolah',
            icon: IconBuildingBank,
            subItems: [
                { label: 'Beranda', href: '/admin/beranda' },
                { label: 'Tentang Sekolah', href: '/admin/tentang-sekolah' },
                { label: 'Sejarah Sekolah', href: '/admin/sejarah-sekolah' },
                { label: 'Struktur Organisasi', href: '/admin/struktur-organisasi' },
                { label: 'Direktori Guru & Staf', href: '/admin/guru' },
                { label: 'Sarana & Prasarana', href: '/admin/sarpras' },
            ],
        },
        {
            key: 'spmb',
            label: 'SPMB Online',
            icon: IconSchool,
            subItems: [
                { label: 'Pengaturan Halaman', href: '/admin/spmb-halaman' },
                { label: 'Jadwal Gelombang', href: '/admin/spmb-gelombang' },
                { label: 'Data Pendaftar Siswa', href: '/admin/spmb-pendaftar', highlight: true },
            ],
        },
        {
            key: 'academic',
            label: 'Academic Hub',
            icon: IconBook,
            subItems: [
                { label: 'Program Keahlian', href: '/admin/program-keahlian' },
                { label: 'Berita & Pengumuman', href: '/admin/berita' },
                { label: 'Kalender Akademik', href: '/admin/kalender-akademik' },
                { label: 'Pusat Unduhan', href: '/admin/unduhan' },
                { label: 'Mata Pelajaran Pilihan', href: '/admin/mapel-pilihan' },
                { label: 'Ekstrakurikuler', href: '/admin/ekstrakurikuler' },
                { label: 'Kokurikuler & OSIS', href: '/admin/osis-kesiswaan' },
            ],
        },
        {
            key: 'tefa',
            label: 'TEFA & Karya Siswa',
            icon: IconBuildingStore,
            subItems: [
                { label: 'Profil Bengkel TEFA', href: '/admin/tefa-bengkel' },
                { label: 'Karya & Inovasi', href: '/admin/tefa-karya' },
            ],
        },
        {
            key: 'dudi',
            label: 'Job Center & BKK',
            icon: IconBriefcase,
            subItems: [
                { label: 'Mitra Industri (DUDI)', href: '/admin/mitra-dudi' },
                { label: 'Papan Lowongan Kerja', href: '/admin/lowongan-kerja' },
            ],
        },
        {
            key: 'tracer',
            label: 'Tracer Study',
            icon: IconUserSearch,
            subItems: [
                { label: 'Kode Alumni', href: '/admin/kode-alumni' },
                { label: 'Respon & Testimoni', href: '/admin/alumni-tracer', highlight: true },
            ],
        },
    ];

    const isDashboardActive = url === '/admin/dashboard' || url === '/dashboard' || url === '/admin';

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 z-40 bg-[#1f1f1f]/50 backdrop-blur-xs lg:hidden"
                    aria-hidden="true"
                />
            )}

            {/* Sidebar Element (Lebar Proporsional 240px, atau Compact 68px saat Collapsed) */}
            <aside
                className={`fixed top-0 bottom-0 left-0 z-50 bg-white border-r border-[#e5e5e5] flex flex-col transition-all duration-300 ease-in-out lg:static lg:translate-x-0 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                } ${isCollapsed ? 'w-[68px]' : 'w-[240px]'}`}
            >
                {/* Brand Header: Logo + Judul + Switch Tab Besar/Kecil */}
                <div className={`h-16 flex items-center shrink-0 bg-white ${
                    isCollapsed ? 'justify-center px-0' : 'px-4 justify-between'
                }`}>
                    {isCollapsed ? (
                        /* Saat Collapsed: Tombol Expand Terpusat Sempurna (Sejajar dengan Ikon Menu) */
                        <button
                            type="button"
                            onClick={onToggleCollapse}
                            className="w-10 h-10 rounded-xl text-[#525252] hover:text-[#0968f6] hover:bg-[#ecf3fe] transition flex items-center justify-center cursor-pointer"
                            title="Perbesar Sidebar (Expand)"
                            aria-label="Perbesar Sidebar"
                        >
                            <IconLayoutSidebarLeftExpand size={20} stroke={1.8} className="text-[#0968f6]" />
                        </button>
                    ) : (
                        /* Saat Expanded: Logo + Brand Teks di Kiri, Tombol Collapse di Kanan */
                        <>
                            <Link
                                href="/admin/dashboard"
                                className="flex items-center gap-2.5 group"
                                title="SMK PGRI Gumelar Admin CMS"
                            >
                                <img
                                    src="/images/logo-pgri.png"
                                    alt="Logo SMK PGRI Gumelar"
                                    className="w-8 h-8 object-contain shrink-0 group-hover:scale-105 transition-transform"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://ui-avatars.com/api/?name=PGRI&background=0968F6&color=fff&rounded=true';
                                    }}
                                />
                                <div className="flex flex-col text-left truncate">
                                    <span className="font-bold text-[12.5px] leading-tight text-[#1f1f1f] tracking-tight truncate">
                                        SMK PGRI GUMELAR
                                    </span>
                                    <span className="font-normal text-[10.5px] leading-tight text-[#737373] mt-0.5 truncate">
                                        Admin CMS
                                    </span>
                                </div>
                            </Link>

                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    onClick={onToggleCollapse}
                                    className="hidden lg:flex p-1.5 rounded-lg text-[#737373] hover:text-[#0968f6] hover:bg-[#ecf3fe] transition items-center justify-center cursor-pointer"
                                    title="Perkecil Sidebar (Collapse)"
                                    aria-label="Perkecil Sidebar"
                                >
                                    <IconLayoutSidebarLeftCollapse size={19} stroke={1.8} />
                                </button>

                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="lg:hidden p-1.5 rounded-lg text-[#737373] hover:text-[#1f1f1f] hover:bg-[#f2f2f2] transition"
                                    aria-label="Tutup Menu"
                                >
                                    <IconX size={18} />
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {/* Garis Pembatas Inset Halus */}
                <div className={isCollapsed ? 'w-10 mx-auto' : 'px-4'}>
                    <div className="h-px bg-[#e5e5e5] w-full" />
                </div>

                {/* Navigasi Menu: Semua Ikon Terpusat Presisi & Sejajar */}
                <div className={`flex-1 overflow-y-auto pt-5 pb-6 space-y-5 ${isCollapsed ? 'px-0' : 'px-3'}`}>
                    {/* 1. SEKSI OVERVIEW */}
                    <div className="space-y-1.5">
                        {!isCollapsed && (
                            <p className="px-3 text-[10.5px] font-semibold text-[#737373] uppercase tracking-wider font-inter">
                                OVERVIEW
                            </p>
                        )}

                        <Link
                            href="/admin/dashboard"
                            title="Dashboard"
                            className={`flex items-center h-10 rounded-xl transition-all text-[13px] font-inter ${
                                isCollapsed
                                    ? 'w-10 h-10 mx-auto justify-center'
                                    : 'w-full px-3 gap-3'
                            } ${
                                isDashboardActive
                                    ? 'bg-[#ecf3fe] text-[#0968f6] font-semibold shadow-xs'
                                    : 'text-[#525252] hover:text-[#1f1f1f] hover:bg-[#f8f8f7] font-medium'
                            }`}
                        >
                            <IconHome
                                size={19}
                                stroke={2}
                                className={isDashboardActive ? 'text-[#0968f6] shrink-0' : 'text-[#737373] shrink-0'}
                            />
                            {!isCollapsed && <span>Dashboard</span>}
                        </Link>
                    </div>

                    {/* 2. SEKSI MENU UTAMA (9 MODUL LENGKAP) */}
                    <div className="space-y-1.5">
                        {!isCollapsed && (
                            <p className="px-3 text-[10.5px] font-semibold text-[#737373] uppercase tracking-wider font-inter">
                                MENU UTAMA
                            </p>
                        )}

                        {menuGroups.map((group) => {
                            const GroupIcon = group.icon;
                            const isExpanded = openGroups[group.key];
                            const hasActiveChild = group.subItems.some((sub) => isCurrent(sub.href));

                            return (
                                <div key={group.key} className="space-y-1">
                                    <button
                                        type="button"
                                        onClick={() => toggleGroup(group.key)}
                                        title={group.label}
                                        className={`flex items-center h-10 rounded-xl transition-all text-[13px] font-inter cursor-pointer ${
                                            isCollapsed
                                                ? 'w-10 h-10 mx-auto justify-center'
                                                : 'w-full px-3 justify-between'
                                        } ${
                                            hasActiveChild && !isExpanded
                                                ? 'bg-[#ecf3fe] text-[#0968f6] font-semibold'
                                                : 'text-[#525252] hover:text-[#1f1f1f] hover:bg-[#f8f8f7] font-medium'
                                        }`}
                                    >
                                        {isCollapsed ? (
                                            /* Mode Collapsed: Ikon Murni Terpusat Sempurna, 100% Sejajar */
                                            <GroupIcon
                                                size={19}
                                                stroke={1.8}
                                                className={hasActiveChild ? 'text-[#0968f6] shrink-0' : 'text-[#737373] shrink-0'}
                                            />
                                        ) : (
                                            /* Mode Expanded: Ikon + Teks di Kiri, Chevron di Kanan */
                                            <>
                                                <div className="flex items-center gap-3 truncate">
                                                    <GroupIcon
                                                        size={19}
                                                        stroke={1.8}
                                                        className={hasActiveChild ? 'text-[#0968f6] shrink-0' : 'text-[#737373] shrink-0'}
                                                    />
                                                    <span className="truncate">{group.label}</span>
                                                </div>

                                                <IconChevronDown
                                                    size={16}
                                                    className={`text-[#737373] transition-transform duration-200 shrink-0 ${
                                                        isExpanded ? 'rotate-180' : ''
                                                    }`}
                                                />
                                            </>
                                        )}
                                    </button>

                                    {/* Sub-item Dropdown (hanya tampil saat expanded dan sidebar tidak collapsed) */}
                                    {isExpanded && !isCollapsed && (
                                        <div className="pl-3.5 pr-1 py-1 space-y-1 border-l border-[#e5e5e5] ml-4">
                                            {group.subItems.map((sub, sIdx) => {
                                                const active = isCurrent(sub.href);
                                                return (
                                                    <Link
                                                        key={sIdx}
                                                        href={sub.href}
                                                        className={`flex items-center justify-between px-2.5 h-8 rounded-lg text-[12.5px] font-inter transition-all group/sub ${
                                                            active
                                                                ? 'bg-[#ecf3fe] text-[#0968f6] font-semibold'
                                                                : 'text-[#525252] hover:text-[#1f1f1f] hover:bg-[#f8f8f7] font-normal'
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-2.5 truncate">
                                                            <span
                                                                className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${
                                                                    active
                                                                        ? 'bg-[#0968f6]'
                                                                        : 'bg-[#cbd5e1] group-hover/sub:bg-[#94a3b8]'
                                                                }`}
                                                            />
                                                            <span className="truncate">{sub.label}</span>
                                                        </div>
                                                        {sub.highlight && !active && (
                                                            <span className="w-1.5 h-1.5 rounded-full bg-[#eebb04] shrink-0 ml-1.5" />
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

                    {/* 3. SEKSI DUKUNGAN SISTEM */}
                    <div className="space-y-1.5 pt-2 border-t border-[#f2f2f2]">
                        {!isCollapsed && (
                            <p className="px-3 text-[10.5px] font-semibold text-[#737373] uppercase tracking-wider font-inter">
                                DUKUNGAN
                            </p>
                        )}

                        <a
                            href="#panduan"
                            title="Panduan Pengguna CMS"
                            onClick={(e) => {
                                e.preventDefault();
                                Swal.fire({
                                    title: 'Buku Panduan Pengguna',
                                    html: '<div class="text-left text-xs space-y-2.5 text-[#525252] leading-relaxed"><p>Selamat datang di <b>Admin CMS SMK PGRI Gumelar</b>.</p><p>Panduan lengkap operasional pengelolaan konten, SPMB, TEFA, BKK, dan Tracer Study telah disusun dalam dokumentasi resmi pengabdian masyarakat (PKM-TTG 2026 Telkom University Purwokerto).</p><p class="pt-2 text-[11px] text-[#737373] border-t border-[#f2f2f2]">Butuh bantuan teknis atau pendampingan? Hubungi Tim Pengembang PKM-TTG atau Operator IT Sekolah.</p></div>',
                                    icon: 'info',
                                    confirmButtonText: 'Tutup',
                                    confirmButtonColor: '#0968f6',
                                });
                            }}
                            className={`flex items-center h-10 rounded-xl text-[#525252] hover:text-[#1f1f1f] hover:bg-[#f8f8f7] transition-all text-[13px] font-inter font-medium ${
                                isCollapsed
                                    ? 'w-10 h-10 mx-auto justify-center'
                                    : 'w-full px-3 gap-3'
                            }`}
                        >
                            <IconBook2 size={19} stroke={1.8} className="text-[#737373] shrink-0" />
                            {!isCollapsed && <span>Panduan Pengguna</span>}
                        </a>
                    </div>
                </div>
            </aside>
        </>
    );
}
