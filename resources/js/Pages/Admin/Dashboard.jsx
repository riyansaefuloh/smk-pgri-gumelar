import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    IconSchool,
    IconUsers,
    IconId,
    IconUserCheck,
    IconNews,
    IconBuildingStore,
    IconArrowRight,
    IconBriefcase,
    IconCompass,
    IconCalendar,
    IconTrendingUp,
} from '@tabler/icons-react';
import { Link } from '@inertiajs/react';

export default function Dashboard() {
    // 4 KPI Metric Cards: Teks ringkas, bersih, tidak ramai (Pola IDDS Highlight Metrics)
    const metrics = [
        {
            title: 'Pendaftar SPMB',
            value: '0',
            unit: 'Siswa',
            trend: 'Gelombang 1 Aktif',
            icon: IconId,
            iconBg: 'bg-blue-50 text-[#0968f6]',
            href: '/admin/spmb-pendaftar',
        },
        {
            title: 'Tracer Study Alumni',
            value: '0',
            unit: 'Partisipan',
            trend: 'Terdata di Sistem',
            icon: IconUserCheck,
            iconBg: 'bg-emerald-50 text-emerald-600',
            href: '/admin/alumni-tracer',
        },
        {
            title: 'Warta Publikasi',
            value: '1',
            unit: 'Berita',
            trend: 'Artikel Terbit',
            icon: IconNews,
            iconBg: 'bg-amber-50 text-amber-600',
            href: '/admin/berita',
        },
        {
            title: 'Direktori Guru & GTK',
            value: '3',
            unit: 'Tenaga Pendidik',
            trend: 'Data Terverifikasi',
            icon: IconUsers,
            iconBg: 'bg-purple-50 text-purple-600',
            href: '/admin/guru',
        },
    ];

    // 6 Modul Layanan Terintegrasi (Format Real Sesuai Kebutuhan Nyata Sekolah)
    const modules = [
        {
            title: 'Profil Sekolah',
            desc: 'Hero banner, visi-misi, sejarah linimasa, struktur organisasi, direktori guru & GTK, dan sarana prasarana.',
            icon: IconSchool,
            href: '/admin/beranda',
            count: '8 Sub-menu',
            badge: 'Pondasi F-01',
            badgeClass: 'bg-slate-100 text-slate-700',
        },
        {
            title: 'PPDB Online',
            desc: 'Verifikasi pendaftaran calon siswa baru ramah HP, master gelombang pendaftaran, dan cetak bukti.',
            icon: IconId,
            href: '/admin/spmb-pendaftar',
            count: '0 Pendaftar',
            badge: 'Layanan F-02',
            badgeClass: 'bg-blue-50 text-[#0968f6] border border-blue-200/60',
        },
        {
            title: 'Academic Hub',
            desc: 'Program keahlian TBSM terakreditasi, warta berita publikasi resmi, dan kalender kegiatan akademik.',
            icon: IconNews,
            href: '/admin/berita',
            count: '1 Berita',
            badge: 'Publikasi F-04',
            badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
        },
        {
            title: 'Etalase TEFA',
            desc: 'Katalog jasa bengkel servis motor berkala, etalase sparepart TEFA, dan galeri karya inovasi siswa.',
            icon: IconBuildingStore,
            href: '/admin/tefa-bengkel',
            count: '2 Layanan',
            badge: 'TEFA F-03',
            badgeClass: 'bg-amber-50 text-amber-700 border border-amber-200/60',
        },
        {
            title: 'Job Center & DUDI',
            desc: 'Pusat informasi bursa kerja khusus (BKK), lowongan kerja mitra industri terverifikasi, dan relasi DUDI.',
            icon: IconBriefcase,
            href: '/admin/lowongan-kerja',
            count: 'Siap Pakai',
            badge: 'Karier F-06',
            badgeClass: 'bg-slate-100 text-slate-700',
        },
        {
            title: 'Tracer Study',
            desc: 'Survei kuesioner penelusuran rekam jejak lulusan terproteksi kode unik alumni terintegrasi Dapodik.',
            icon: IconCompass,
            href: '/admin/alumni-tracer',
            count: '2 Kode',
            badge: 'Tracer F-05',
            badgeClass: 'bg-blue-50 text-[#0968f6] border border-blue-200/60',
        },
    ];

    // Header Action Real: Indikator Tahun Ajaran Resmi (Tanpa tombol artifisial yang tidak diperlukan)
    const headerActions = (
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#e2e8f0] text-xs text-[#525252] shadow-xs">
            <IconCalendar size={14} className="text-[#0968f6]" />
            <span className="font-medium">Tahun Ajaran 2026/2027</span>
        </div>
    );

    return (
        <AdminLayout
            title="Dashboard"
            subtitle="Pusat kendali dan administrasi layanan digital terpadu SMK PGRI Gumelar."
            headerActions={headerActions}
        >
            <div className="space-y-6">
                {/* 1. Baris 4 Kartu Metrik KPI (Pola IDDS Card Data: Stroke Ideal Slate-200 #e2e8f0) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {metrics.map((metric, idx) => {
                        const MetricIcon = metric.icon;
                        return (
                            <Link
                                key={idx}
                                href={metric.href}
                                className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-xs hover:border-[#0968f6] hover:shadow-sm hover:-translate-y-0.5 transition-all group flex flex-col justify-between space-y-3"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-[#525252]">
                                        {metric.title}
                                    </span>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${metric.iconBg}`}>
                                        <MetricIcon size={16} />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-3xl font-bold text-[#1f1f1f] tracking-tight group-hover:text-[#0968f6] transition-colors">
                                            {metric.value}
                                        </span>
                                        <span className="text-xs text-[#737373] font-medium">
                                            {metric.unit}
                                        </span>
                                    </div>

                                    {/* Subteks Tunggal yang Bersih & Rapi Sesuai IDDS */}
                                    <div className="mt-2 text-xs">
                                        <span className="inline-flex items-center gap-1 text-emerald-600 font-medium text-xs">
                                            <IconTrendingUp size={14} />
                                            {metric.trend}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* 2. Kontainer Kartu Utama: 6 Modul Layanan Terintegrasi (Border Ideal Slate-200 #e2e8f0) */}
                <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 sm:p-8 shadow-xs space-y-6">
                    {/* Header Bagian Modul */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#e2e8f0]">
                        <div>
                            <h3 className="font-bold text-sm text-[#1f1f1f] uppercase tracking-wider">
                                Modul Layanan Terintegrasi
                            </h3>
                            <p className="text-xs text-[#525252] mt-0.5 font-normal">
                                Akses cepat kelola data master dan informasi publikasi sekolah.
                            </p>
                        </div>
                    </div>

                    {/* Grid 6 Modul (3 Kolom x 2 Baris) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {modules.map((item, idx) => {
                            const ItemIcon = item.icon;
                            return (
                                <Link
                                    key={idx}
                                    href={item.href}
                                    className="p-5 sm:p-6 rounded-xl border border-[#d0d5dd] bg-white shadow-xs hover:bg-[#fafcff] hover:border-[#0968f6] hover:shadow-md hover:-translate-y-0.5 transition-all group flex flex-col justify-between space-y-4"
                                >
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="w-9 h-9 rounded-lg bg-[#ecf3fe] text-[#0968f6] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                                <ItemIcon size={19} />
                                            </div>
                                            <span className={`text-[10.5px] font-semibold px-2 py-0.5 rounded-md ${item.badgeClass}`}>
                                                {item.badge}
                                            </span>
                                        </div>

                                        <h4 className="font-semibold text-sm text-[#1f1f1f] group-hover:text-[#0968f6] transition-colors">
                                            {item.title}
                                        </h4>
                                        <p className="font-normal text-xs text-[#525252] leading-relaxed line-clamp-2">
                                            {item.desc}
                                        </p>
                                    </div>

                                    <div className="pt-3 border-t border-[#e2e8f0] flex items-center justify-between text-xs text-[#525252]">
                                        <span>Status: <strong className="text-[#1f1f1f] font-medium">{item.count}</strong></span>
                                        <span className="text-[#0968f6] font-medium group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1 text-[11.5px]">
                                            Buka Modul <IconArrowRight size={13} />
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
