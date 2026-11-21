import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    IconPhone,
    IconMail,
    IconMapPin,
    IconBrandWhatsapp,
    IconBrandInstagram,
    IconBrandTiktok,
    IconBrandYoutube,
    IconSchool,
    IconArrowRight,
    IconClock,
} from '@tabler/icons-react';

export default function Footer() {
    const { props } = usePage();
    const kontak = props.kontak_sekolah || {};

    return (
        <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800/80">
                    {/* Kolom 1: Profil Sekolah */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
                                <IconSchool size={24} />
                            </div>
                            <div>
                                <h3 className="font-extrabold text-white text-base tracking-tight leading-tight">
                                    SMK PGRI GUMELAR
                                </h3>
                                <p className="text-xs text-slate-400">
                                    YPLP DM PGRI JT Cabang Banyumas
                                </p>
                            </div>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Membina generasi muda berkarakter, terampil, mandiri, dan siap kerja di industri otomotif modern maupun berwirausaha.
                        </p>
                        <div className="pt-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-blue-900/40 text-blue-300 border border-blue-700/50">
                                Izin Operasional: SK No. 422/217
                            </span>
                        </div>
                    </div>

                    {/* Kolom 2: Tautan Pintas */}
                    <div className="space-y-3">
                        <h4 className="font-bold text-white text-sm tracking-wide uppercase">
                            Tautan Pintas
                        </h4>
                        <ul className="space-y-2 text-xs">
                            <li>
                                <Link href="/spmb" className="hover:text-blue-400 transition flex items-center gap-1.5">
                                    <IconArrowRight size={13} className="text-blue-500" />
                                    <span>Pendaftaran SPMB Online</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/jurusan" className="hover:text-blue-400 transition flex items-center gap-1.5">
                                    <IconArrowRight size={13} className="text-blue-500" />
                                    <span>Program Keahlian TBSM</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/tefa" className="hover:text-blue-400 transition flex items-center gap-1.5">
                                    <IconArrowRight size={13} className="text-blue-500" />
                                    <span>Teaching Factory & Servis</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/berita" className="hover:text-blue-400 transition flex items-center gap-1.5">
                                    <IconArrowRight size={13} className="text-blue-500" />
                                    <span>Berita & Informasi Terkini</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/kalender" className="hover:text-blue-400 transition flex items-center gap-1.5">
                                    <IconArrowRight size={13} className="text-blue-500" />
                                    <span>Kalender Akademik</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/tracer-study" className="hover:text-blue-400 transition flex items-center gap-1.5">
                                    <IconArrowRight size={13} className="text-blue-500" />
                                    <span>Tracer Study Alumni</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Kolom 3: Kontak & Alamat */}
                    <div className="space-y-3">
                        <h4 className="font-bold text-white text-sm tracking-wide uppercase">
                            Kontak & Lokasi
                        </h4>
                        <ul className="space-y-3 text-xs">
                            <li className="flex items-start gap-2.5">
                                <IconMapPin size={18} className="text-amber-400 shrink-0 mt-0.5" />
                                <span className="leading-relaxed">
                                    {kontak.alamat_lengkap || 'Jl. Raya Gumelar, Kecamatan Gumelar, Kabupaten Banyumas, Jawa Tengah 53165'}
                                </span>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <IconPhone size={16} className="text-amber-400 shrink-0" />
                                <span>{kontak.nomor_telepon || '(0281) 657xxxx'}</span>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <IconBrandWhatsapp size={16} className="text-emerald-400 shrink-0" />
                                <a
                                    href={`https://wa.me/${(kontak.nomor_whatsapp || '081234567890').replace(/[^0-9]/g, '')}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="hover:text-emerald-400 transition"
                                >
                                    {kontak.nomor_whatsapp || '0812-3456-7890'} (WhatsApp)
                                </a>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <IconMail size={16} className="text-amber-400 shrink-0" />
                                <a href={`mailto:${kontak.alamat_email || 'smkpgridm.gumelar@gmail.com'}`} className="hover:text-amber-300 transition">
                                    {kontak.alamat_email || 'smkpgridm.gumelar@gmail.com'}
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Kolom 4: Jam Layanan & Media Sosial */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-white text-sm tracking-wide uppercase">
                            Jam Operasional
                        </h4>
                        <div className="text-xs space-y-1.5 text-slate-400 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                            <div className="flex items-center gap-2 text-slate-300 font-semibold">
                                <IconClock size={15} className="text-blue-400" />
                                <span>Senin - Jumat</span>
                            </div>
                            <p className="pl-6">07.00 - 15.30 WIB</p>
                            <div className="flex items-center gap-2 text-slate-300 font-semibold pt-1">
                                <IconClock size={15} className="text-blue-400" />
                                <span>Sabtu (Ekstrakurikuler/Piket)</span>
                            </div>
                            <p className="pl-6">07.30 - 12.00 WIB</p>
                        </div>

                        <div>
                            <h5 className="text-xs font-semibold text-slate-300 mb-2">Media Sosial Resmi:</h5>
                            <div className="flex items-center gap-2.5">
                                {kontak.link_instagram && (
                                    <a
                                        href={kontak.link_instagram}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-pink-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors shadow-sm"
                                        aria-label="Instagram"
                                    >
                                        <IconBrandInstagram size={18} />
                                    </a>
                                )}
                                {kontak.link_tiktok && (
                                    <a
                                        href={kontak.link_tiktok}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-black text-slate-300 hover:text-white flex items-center justify-center transition-colors shadow-sm"
                                        aria-label="TikTok"
                                    >
                                        <IconBrandTiktok size={18} />
                                    </a>
                                )}
                                {kontak.link_youtube && (
                                    <a
                                        href={kontak.link_youtube}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors shadow-sm"
                                        aria-label="YouTube"
                                    >
                                        <IconBrandYoutube size={18} />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Baris Bawah: Copyright & Acknowledgement */}
                <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
                    <p>
                        © {new Date().getFullYear()} SMK PGRI Gumelar. Seluruh hak cipta dilindungi.
                    </p>
                    <p className="text-[11px] text-slate-400 text-center sm:text-right">
                        Dikembangkan bersama Tim PKM-TTG 2026 Telkom University Purwokerto
                    </p>
                </div>
            </div>
        </footer>
    );
}
