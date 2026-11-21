import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { IconHome, IconSchool, IconCheck } from '@tabler/icons-react';

export default function Beranda({ title, beranda }) {
    const data = beranda || {};

    return (
        <AdminLayout title={title || 'Kelola Beranda'}>
            <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                            <IconHome size={22} />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-slate-900">
                                Data Aktif Beranda Website Publik
                            </h2>
                            <p className="text-xs text-slate-500">
                                Terhubung langsung dengan tabel database <code>berandas</code>.
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-150 space-y-2">
                            <span className="font-bold text-slate-500 uppercase tracking-wider block text-[10px]">
                                Judul Hero Banner:
                            </span>
                            <p className="text-sm font-extrabold text-slate-800">
                                {data.judul_hero || '-'}
                            </p>
                            <span className="font-bold text-slate-500 uppercase tracking-wider block text-[10px] pt-2">
                                Subjudul Hero:
                            </span>
                            <p className="text-slate-650 leading-relaxed">
                                {data.subjudul_hero || '-'}
                            </p>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-150 space-y-2">
                            <span className="font-bold text-slate-500 uppercase tracking-wider block text-[10px]">
                                Nama Kepala Sekolah:
                            </span>
                            <p className="text-sm font-extrabold text-slate-800">
                                {data.nama_kepala_sekolah || '-'}
                            </p>
                            <span className="font-bold text-slate-500 uppercase tracking-wider block text-[10px] pt-2">
                                Cuplikan Teks Sambutan:
                            </span>
                            <p className="text-slate-650 leading-relaxed line-clamp-3">
                                {data.teks_sambutan || '-'}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1.5 text-emerald-600 font-semibold">
                            <IconCheck size={16} /> Status: Data Seeder Aktif
                        </span>
                        <span>SMK PGRI Gumelar CMS</span>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
