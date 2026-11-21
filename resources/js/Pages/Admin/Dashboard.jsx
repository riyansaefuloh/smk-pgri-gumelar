import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { IconSchool, IconId, IconUserCheck, IconNews, IconUsers, IconBriefcase } from '@tabler/icons-react';
import { Link } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AdminLayout title="Dashboard Utama">
            <div className="space-y-6">
                {/* Welcome Card */}
                <div className="bg-gradient-to-r from-blue-700 to-indigo-700 rounded-2xl p-6 sm:p-8 text-white shadow-md">
                    <div className="max-w-3xl space-y-2">
                        <span className="inline-block px-3 py-1 rounded-full bg-blue-600/60 text-blue-200 text-xs font-semibold border border-blue-400/30">
                            Selamat Datang di Panel CMS
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                            Website Integratif SMK PGRI Gumelar
                        </h2>
                        <p className="text-sm text-blue-100/90 leading-relaxed">
                            Kelola layanan pendaftaran SPMB online, data penelusuran tracer study alumni, warta berita, hingga galeri bengkel Teaching Factory (TEFA) dalam satu portal terpadu.
                        </p>
                    </div>
                </div>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                            <IconId size={26} />
                        </div>
                        <div>
                            <span className="text-xs text-slate-500 font-semibold block">Pendaftar SPMB</span>
                            <span className="text-xl font-extrabold text-slate-900 block">Siap Dikelola</span>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                            <IconUserCheck size={26} />
                        </div>
                        <div>
                            <span className="text-xs text-slate-500 font-semibold block">Tracer Alumni</span>
                            <span className="text-xl font-extrabold text-slate-900 block">Siap Dikelola</span>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                            <IconNews size={26} />
                        </div>
                        <div>
                            <span className="text-xs text-slate-500 font-semibold block">Warta & Berita</span>
                            <span className="text-xl font-extrabold text-slate-900 block">Siap Dikelola</span>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                            <IconUsers size={26} />
                        </div>
                        <div>
                            <span className="text-xs text-slate-500 font-semibold block">Direktori Guru</span>
                            <span className="text-xl font-extrabold text-slate-900 block">Siap Dikelola</span>
                        </div>
                    </div>
                </div>

                {/* Quick Action */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
                    <h3 className="text-sm font-bold text-slate-900 mb-3">Modul Awal CMS Aktif</h3>
                    <div className="flex flex-wrap gap-3">
                        <Link
                            href="/admin/beranda"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-bold transition"
                        >
                            <span>Kelola Beranda</span>
                        </Link>
                        <a
                            href="/"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                        >
                            <span>Lihat Halaman Publik (/)</span>
                        </a>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
