import React from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Link } from '@inertiajs/react';
import { IconArrowRight, IconSchool, IconCheck, IconTools, IconCalendar, IconFileText } from '@tabler/icons-react';

export default function Beranda({ beranda, jurusan, berita_terbaru, kalender_kegiatan, karya_terbaru }) {
    const dataBeranda = beranda || {
        judul_hero: 'Membangun Generasi Terampil dan Siap Menghadapi Masa Depan',
        subjudul_hero: 'Kenali SMK PGRI Gumelar sebagai tempat untuk mengembangkan potensi, mengasah keterampilan, dan mempersiapkan diri menghadapi dunia kerja.',
        nama_kepala_sekolah: 'Ratna Dewi Astuti, S.Pd.',
        teks_sambutan: 'Selamat datang di website resmi SMK PGRI Gumelar. Website ini menjadi sarana bagi masyarakat untuk mengenal sekolah dan memperoleh informasi pendidikan.',
    };

    return (
        <PublicLayout title="Beranda">
            {/* HERO SECTION */}
            <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-blue-800 to-indigo-900 text-white py-20 lg:py-28">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.3),transparent_50%)]" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-3xl space-y-6">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-700/60 border border-blue-400/30 text-blue-200 text-xs font-semibold backdrop-blur-xs">
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                            Penerimaan Peserta Didik Baru (SPMB) 2026 Dibuka
                        </div>

                        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                            {dataBeranda.judul_hero}
                        </h1>

                        <p className="text-base sm:text-lg text-blue-100/90 leading-relaxed max-w-2xl">
                            {dataBeranda.subjudul_hero}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 pt-4">
                            <Link
                                href="/spmb"
                                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-amber-400 text-slate-900 font-extrabold text-sm shadow-lg shadow-amber-400/25 hover:bg-amber-300 hover:shadow-xl transition-all duration-200"
                            >
                                <span>Daftar SPMB Sekarang</span>
                                <IconArrowRight size={18} />
                            </Link>

                            <Link
                                href="/profil/tentang"
                                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 backdrop-blur-xs transition-colors"
                            >
                                <span>Jelajahi Profil</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* SAMBUTAN KEPALA SEKOLAH */}
            <section className="py-16 lg:py-24 bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        {/* Foto / Ilustrasi Kepala Sekolah */}
                        <div className="lg:col-span-5 flex justify-center">
                            <div className="relative">
                                <div className="w-64 h-80 sm:w-72 sm:h-96 rounded-3xl bg-gradient-to-tr from-blue-700 to-indigo-600 shadow-2xl p-1 flex items-center justify-center text-white overflow-hidden">
                                    <div className="w-full h-full rounded-[22px] bg-slate-100 flex flex-col items-center justify-center p-6 text-slate-700">
                                        <div className="w-24 h-24 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mb-4 shadow-inner">
                                            <IconSchool size={48} />
                                        </div>
                                        <span className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
                                            Kepala Sekolah
                                        </span>
                                        <h4 className="text-base font-extrabold text-slate-900 text-center">
                                            {dataBeranda.nama_kepala_sekolah}
                                        </h4>
                                    </div>
                                </div>
                                <div className="absolute -bottom-4 -right-4 bg-amber-400 text-slate-900 px-4 py-2 rounded-xl font-black text-xs shadow-lg">
                                    SMK PGRI Gumelar
                                </div>
                            </div>
                        </div>

                        {/* Teks Sambutan */}
                        <div className="lg:col-span-7 space-y-5">
                            <div className="inline-block px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold">
                                Sambutan Resmi
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                                Membangun Generasi Terampil dan Berkarakter
                            </h2>
                            <p className="text-slate-650 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                                {dataBeranda.teks_sambutan}
                            </p>
                            <div className="pt-2">
                                <Link
                                    href="/profil/tentang"
                                    className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-700 hover:text-blue-800"
                                >
                                    <span>Baca Selengkapnya Tentang Sekolah</span>
                                    <IconArrowRight size={16} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
