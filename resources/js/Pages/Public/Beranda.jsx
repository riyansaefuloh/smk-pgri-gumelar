import React, { useState } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Link } from '@inertiajs/react';
import { IconArrowRight, IconSchool } from '@tabler/icons-react';

/**
 * Sorot kata kunci tertentu pada judul hero dengan warna pub-primary bila cocok.
 */
function renderHighlightedTitle(title, keywords = []) {
    if (!title || keywords.length === 0) {
        return title;
    }
    const parts = title.split(new RegExp(`(${keywords.join('|')})`, 'g'));

    return parts.map((part, idx) =>
        keywords.includes(part) ? (
            <span key={idx} className="text-[#4F6DF5]">
                {part}
            </span>
        ) : (
            <React.Fragment key={idx}>{part}</React.Fragment>
        )
    );
}

export default function Beranda({ beranda }) {
    const [heroImgFailed, setHeroImgFailed] = useState(false);
    const [kepsekImgFailed, setKepsekImgFailed] = useState(false);
    const [bannerImgFailed, setBannerImgFailed] = useState(false);
    const [sambutanExpanded, setSambutanExpanded] = useState(false);

    const dataBeranda = beranda || {
        judul_hero: 'Membangun Generasi Terampil dan Siap Menghadapi Masa Depan',
        subjudul_hero:
            'Kenali SMK PGRI Gumelar sebagai tempat untuk mengembangkan potensi, mengasah keterampilan, dan mempersiapkan diri menghadapi dunia kerja maupun pendidikan lanjutan.',
        gambar_hero: '/images/hero-default.jpg',
        nama_kepala_sekolah: 'Ratna Dewi Astuti, S.Pd.',
        foto_kepala_sekolah: '/images/kepala-sekolah.jpg',
        teks_sambutan:
            'Selamat datang di website resmi SMK PGRI Gumelar. Website ini menjadi sarana bagi masyarakat untuk mengenal sekolah dan memperoleh informasi pendidikan.',
        judul_banner_bawah: 'Masa Depan Cerah Dimulai dari Sini!',
        subjudul_banner_bawah:
            'Bergabunglah dengan SMK PGRI Gumelar, kembangkan keterampilanmu, dan persiapkan diri untuk meraih masa depan yang kamu impikan.',
        gambar_banner_bawah: '/images/banner-bawah.jpg',
    };

    return (
        <PublicLayout title="Beranda" transparentNavbar>
            {/* HERO SECTION FULL-BLEED */}
            <section className="relative min-h-[88vh] sm:min-h-screen flex items-center justify-center overflow-hidden bg-pub-dark text-white">
                {/* Background Image */}
                {dataBeranda.gambar_hero && !heroImgFailed ? (
                    <img
                        src={dataBeranda.gambar_hero}
                        alt="SMK PGRI Gumelar"
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={() => setHeroImgFailed(true)}
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-brand-800 to-slate-950" />
                )}

                {/* Overlay Halus hanya di belakang teks & tombol agar foto tetap terang */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/30 via-transparent to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_65%_50%_at_50%_52%,rgba(15,23,42,0.55)_0%,rgba(15,23,42,0.22)_55%,transparent_85%)] pointer-events-none" />

                {/* Konten Hero Rata Tengah */}
                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 text-center space-y-6">
                    <h1 className="font-heading text-3xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight leading-[1.18] text-white drop-shadow-xs">
                        {renderHighlightedTitle(dataBeranda.judul_hero || '', ['Terampil', 'Menghadapi'])}
                    </h1>

                    <p className="font-body text-sm sm:text-base text-white/95 max-w-2xl mx-auto leading-relaxed">
                        {dataBeranda.subjudul_hero}
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
                        <Link
                            href="/spmb"
                            className="inline-flex items-center gap-2.5 pl-5 pr-2 py-2 rounded-full bg-[#4F6DF5] hover:bg-[#3B5BDB] text-white font-body text-sm font-medium shadow-lg shadow-[#4F6DF5]/30 transition-all"
                        >
                            <span>Daftar Sekarang</span>
                            <span className="w-7 h-7 rounded-full bg-white text-[#4F6DF5] flex items-center justify-center shrink-0">
                                <IconArrowRight size={15} stroke={2.4} />
                            </span>
                        </Link>

                        <Link
                            href="/profil/tentang"
                            className="inline-flex items-center justify-center px-6 py-2.5 rounded-full border border-[#4F6DF5] bg-slate-950/30 hover:bg-white/10 text-[#4F6DF5] hover:text-white font-body text-sm font-medium backdrop-blur-xs transition-colors"
                        >
                            Jelajahi Profil
                        </Link>
                    </div>
                </div>
            </section>

            {/* SAMBUTAN KEPALA SEKOLAH */}
            <section className="py-16 lg:py-24 bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
                        {/* Foto Kepala Sekolah dengan Bingkai Garis Putus Panjang & Sudut Kanan Atas Melengkung */}
                        <div className="lg:col-span-5 flex justify-center">
                            <div className="relative w-72 sm:w-80 aspect-[3/4] p-4 sm:p-5">
                                <svg
                                    viewBox="0 0 320 426"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="absolute inset-0 w-full h-full pointer-events-none"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M 1 1 L 204 1 A 115 115 0 0 1 319 116 L 319 425 L 1 425 Z"
                                        stroke="#4F6DF5"
                                        strokeOpacity="0.45"
                                        strokeWidth="1.5"
                                        strokeDasharray="12 10"
                                    />
                                </svg>
                                <div className="w-full h-full rounded-tr-[98px] bg-[#F8FAFC] overflow-hidden flex flex-col items-center justify-center relative z-10">
                                    {dataBeranda.foto_kepala_sekolah && !kepsekImgFailed ? (
                                        <img
                                            src={dataBeranda.foto_kepala_sekolah}
                                            alt={dataBeranda.nama_kepala_sekolah}
                                            className="w-full h-full object-cover object-top"
                                            onError={() => setKepsekImgFailed(true)}
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center p-6 text-center space-y-3">
                                            <div className="w-20 h-20 rounded-full bg-[#EEF2FF] text-[#4F6DF5] flex items-center justify-center">
                                                <IconSchool size={40} />
                                            </div>
                                            <span className="font-badge text-xs text-[#4F6DF5]">
                                                Kepala Sekolah
                                            </span>
                                            <h4 className="font-heading text-base font-bold text-[#1f1f1f]">
                                                {dataBeranda.nama_kepala_sekolah}
                                            </h4>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Teks Sambutan */}
                        <div className="lg:col-span-7 space-y-5">
                            <div className="space-y-2">
                                <span className="font-badge inline-block text-xs text-[#4F6DF5]">
                                    Sambutan Kepala Sekolah
                                </span>
                                <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1f1f1f] tracking-tight leading-tight">
                                    Sambutan{' '}
                                    <span className="text-[#4F6DF5]">Kepala Sekolah</span>
                                    <br />
                                    SMK <span className="text-[#4F6DF5]">PGRI</span> Gumelar
                                </h2>
                            </div>

                            {/* Ikon Kutip Pembuka */}
                            <div className="text-[#4F6DF5] select-none" aria-hidden="true">
                                <svg
                                    width="28"
                                    height="22"
                                    viewBox="0 0 28 22"
                                    fill="currentColor"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M11.6 0L7.8 9.2H12V22H0V10.6L5.2 0H11.6ZM27.6 0L23.8 9.2H28V22H16V10.6L21.2 0H27.6Z" />
                                </svg>
                            </div>

                            {/* Kutipan Sambutan dengan Garis Vertikal Kiri */}
                            <div className="pl-5 sm:pl-6 ml-1 border-l border-[#4F6DF5]/35 space-y-2">
                                <div
                                    className={`max-h-56 sm:max-h-60 ${
                                        sambutanExpanded ? 'overflow-y-auto pr-2' : 'overflow-hidden'
                                    }`}
                                >
                                    <p className="font-body italic text-sm sm:text-[15px] text-[#525252] leading-relaxed whitespace-pre-line">
                                        {dataBeranda.teks_sambutan}
                                    </p>
                                </div>

                                {(dataBeranda.teks_sambutan || '').length > 220 && (
                                    <div className="flex justify-end pt-1">
                                        <button
                                            type="button"
                                            onClick={() => setSambutanExpanded((prev) => !prev)}
                                            className="font-body text-xs font-medium text-[#4F6DF5] hover:underline focus:outline-none"
                                        >
                                            {sambutanExpanded ? 'Tutup' : 'Baca Selengkapnya'}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Tanda Tangan Kepala Sekolah */}
                            <div className="pt-1">
                                <p className="font-heading text-base sm:text-lg font-bold text-[#1f1f1f]">
                                    {dataBeranda.nama_kepala_sekolah}
                                </p>
                                <p className="font-body text-xs sm:text-sm text-[#525252]">
                                    Kepala Sekolah SMK PGRI Gumelar
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* BANNER PENUTUP / CTA */}
            <section className="py-12 lg:py-20 bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl min-h-[320px] sm:min-h-[380px] flex items-center justify-center bg-pub-dark text-white">
                        {/* Background Image */}
                        {dataBeranda.gambar_banner_bawah && !bannerImgFailed ? (
                            <img
                                src={dataBeranda.gambar_banner_bawah}
                                alt={dataBeranda.judul_banner_bawah || 'Banner Penutup'}
                                className="absolute inset-0 w-full h-full object-cover"
                                onError={() => setBannerImgFailed(true)}
                            />
                        ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-brand-800 to-slate-950" />
                        )}

                        {/* Overlay Radial Halus hanya di belakang teks & tombol */}
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_52%,rgba(15,23,42,0.58)_0%,rgba(15,23,42,0.22)_58%,transparent_90%)] pointer-events-none" />

                        {/* Konten CTA Rata Tengah */}
                        <div className="relative z-10 max-w-3xl mx-auto px-6 sm:px-10 py-14 text-center space-y-5">
                            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight text-white drop-shadow-xs">
                                {renderHighlightedTitle(dataBeranda.judul_banner_bawah || '', ['Cerah'])}
                            </h2>

                            <p className="font-body text-sm sm:text-base text-white/95 max-w-2xl mx-auto leading-relaxed">
                                {dataBeranda.subjudul_banner_bawah}
                            </p>

                            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
                                <Link
                                    href="/spmb"
                                    className="inline-flex items-center gap-2.5 pl-5 pr-2 py-2 rounded-full bg-[#4F6DF5] hover:bg-[#3B5BDB] text-white font-body text-sm font-medium shadow-lg shadow-[#4F6DF5]/30 transition-all"
                                >
                                    <span>Daftar Sekarang</span>
                                    <span className="w-7 h-7 rounded-full bg-white text-[#4F6DF5] flex items-center justify-center shrink-0">
                                        <IconArrowRight size={15} stroke={2.4} />
                                    </span>
                                </Link>

                                <Link
                                    href="/spmb#cek"
                                    className="inline-flex items-center justify-center px-6 py-2.5 rounded-full border border-[#4F6DF5] bg-slate-950/30 hover:bg-white/10 text-[#4F6DF5] hover:text-white font-body text-sm font-medium backdrop-blur-xs transition-colors"
                                >
                                    Cek Pendaftaran
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
