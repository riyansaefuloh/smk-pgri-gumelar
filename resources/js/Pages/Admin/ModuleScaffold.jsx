import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    IconArrowLeft,
    IconDatabase,
    IconDatabaseOff,
    IconCheck,
    IconExternalLink,
    IconAlertTriangle,
} from '@tabler/icons-react';
import { Link } from '@inertiajs/react';

export default function ModuleScaffold({ title, category, description, migrationStatus }) {
    return (
        <AdminLayout
            title={title}
            subtitle={description || `Kelola data dan konten untuk sub-menu ${title}.`}
        >
            <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 sm:p-8 space-y-6 shadow-xs">
                {/* Header status bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#e2e8f0]">
                    <div className="flex items-center gap-2.5">
                        <span className="px-3 py-1 rounded-md text-xs font-semibold bg-[#ecf3fe] text-[#0968f6]">
                            {category || 'Modul Layanan'}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#edfded] text-[#288034]">
                            <IconCheck size={13} stroke={2.5} />
                            Rute Terhubung
                        </span>
                        {migrationStatus && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#fff8e6] text-[#b45309] border border-[#fde68a]">
                                <IconAlertTriangle size={13} stroke={2.5} />
                                Pending Migrasi
                            </span>
                        )}
                    </div>

                    <a
                        href="/"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-[#0968f6] hover:underline font-medium"
                    >
                        <span>Lihat di Portal Publik</span>
                        <IconExternalLink size={14} />
                    </a>
                </div>

                {/* Banner Status Migrasi jika belum ada tabel migrasi */}
                {migrationStatus && (
                    <div className="p-4 sm:p-5 rounded-xl border border-[#fcd34d] bg-[#fffbeb] flex items-start gap-3.5 shadow-2xs">
                        <div className="w-9 h-9 rounded-lg bg-[#fef3c7] text-[#d97706] flex items-center justify-center shrink-0 mt-0.5">
                            <IconAlertTriangle size={20} stroke={2} />
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-semibold text-sm text-[#92400e]">
                                {migrationStatus}
                            </h3>
                            <p className="text-xs text-[#b45309] leading-relaxed">
                                Struktur tabel database untuk sub-menu ini belum dirancang dan belum dieksekusi di skema migrasi Laravel.
                                Kerangka navigasi dan antarmuka CMS telah siap, menunggu konfirmasi bersama sebelum skema tabel diimplementasikan.
                            </p>
                        </div>
                    </div>
                )}

                {/* Judul & Deskripsi Modul */}
                <div className="space-y-2">
                    <h2 className="text-xl sm:text-2xl font-bold text-[#1f1f1f] tracking-tight">
                        {title}
                    </h2>
                    <p className="text-sm text-[#525252] leading-relaxed max-w-2xl font-normal">
                        {description || `Halaman administrasi untuk mengelola ${title} SMK PGRI Gumelar secara mandiri.`}
                    </p>
                </div>

                {/* Kartu Status Sub-Menu / Database */}
                <div className="p-5 rounded-xl border border-dashed border-[#e2e8f0] bg-[#f2f4f7] flex items-start sm:items-center gap-3.5">
                    <div className={`w-10 h-10 rounded-xl bg-white border border-[#e2e8f0] flex items-center justify-center shrink-0 shadow-2xs ${
                        migrationStatus ? 'text-[#d97706]' : 'text-[#0968f6]'
                    }`}>
                        {migrationStatus ? (
                            <IconDatabaseOff size={20} stroke={1.8} />
                        ) : (
                            <IconDatabase size={20} stroke={1.8} />
                        )}
                    </div>
                    <div>
                        <h4 className="font-semibold text-xs text-[#1f1f1f]">
                            {migrationStatus ? 'Kerangka Sub-Menu Siap (Menunggu Skema Tabel)' : 'Kerangka Sub-menu Siap'}
                        </h4>
                        <p className="text-xs text-[#737373] mt-0.5 leading-relaxed">
                            {migrationStatus
                                ? 'Sub-menu navigasi telah terdaftar aktif pada sidebar Admin CMS. Form isian dan tabel data akan dibangun setelah migrasi database dikonfirmasi.'
                                : 'Sub-menu telah terhubung ke sidebar CMS dan database SMK PGRI Gumelar. Form isian dan tabel data spesifik modul ini siap dikembangkan.'}
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-[#525252] bg-white hover:bg-[#ecf3fe] hover:text-[#0968f6] border border-[#e2e8f0] transition shadow-xs"
                    >
                        <IconArrowLeft size={16} />
                        <span>Kembali ke Dashboard</span>
                    </Link>
                </div>
            </div>
        </AdminLayout>
    );
}
