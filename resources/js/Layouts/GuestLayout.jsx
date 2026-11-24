import React from 'react';
import { Link } from '@inertiajs/react';
import { IconArrowLeft } from '@tabler/icons-react';

export default function GuestLayout({ children }) {
    return (
        <div className="fixed inset-0 w-full h-full flex flex-col lg:flex-row font-inter antialiased selection:bg-[#ecf3fe] selection:text-[#0968f6] bg-[#f2f4f7] overflow-y-auto lg:overflow-hidden select-none">
            {/* ========================================================================= */}
            {/* 1. SISI KIRI: BRANDING & HERO STAGE (Proporsi 60% - Megah, Kokoh & Tegak)  */}
            {/* ========================================================================= */}
            <div className="relative hidden lg:flex lg:w-[60%] h-full bg-[#f2f4f7] text-[#1f1f1f] flex-col justify-between p-10 xl:p-14 overflow-hidden">
                {/* Header Kiri: Logo Resmi SMK PGRI Gumelar */}
                <div className="relative z-10 flex items-center gap-3">
                    <img
                        src="/images/logo-pgri.png"
                        alt="Logo SMK PGRI Gumelar"
                        className="w-10 h-10 object-contain shrink-0"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://ui-avatars.com/api/?name=PGRI&background=0968F6&color=fff&rounded=true';
                        }}
                    />
                    <div className="flex flex-col">
                        <span className="font-bold text-sm tracking-wide text-[#1f1f1f] uppercase leading-tight">
                            SMK PGRI GUMELAR
                        </span>
                        <span className="text-[11px] text-[#737373] font-normal leading-tight mt-0.5">
                            YPLP DM PGRI JT Cabang Banyumas
                        </span>
                    </div>
                </div>

                {/* Konten Utama Kiri: SVG & Teks Terpusat Penuh */}
                <div className="relative z-10 my-auto py-6 flex flex-col items-center justify-center max-w-lg mx-auto w-full text-center">
                    {/* Ilustrasi Resmi IDDS Transparan & Skala Gagah */}
                    <div className="w-full flex justify-center items-center">
                        <img
                            src="/images/inagov_surveyservice_hero.svg"
                            alt="Ilustrasi Layanan Terpadu IDDS"
                            className="w-full max-w-[450px] xl:max-w-[490px] h-auto object-contain pointer-events-none drop-shadow-xs"
                        />
                    </div>

                    {/* Teks Pengantar Ringkas (Sentence Case IDDS) */}
                    <div className="mt-7 space-y-2.5 px-2">
                        <h2 className="text-2xl xl:text-[26px] font-bold tracking-tight text-[#1f1f1f] leading-snug">
                            Satu sistem terpadu layanan sekolah
                        </h2>
                        <p className="text-sm text-[#525252] leading-relaxed font-normal max-w-md mx-auto">
                            Pusat kendali mandiri profil sekolah, SPMB, bengkel TEFA, bursa kerja khusus, hingga penelusuran alumni.
                        </p>
                    </div>
                </div>

                {/* Spacer Bawah Bersih */}
                <div className="relative z-10 h-6"></div>
            </div>

            {/* ========================================================================= */}
            {/* 2. SISI KANAN: SLIDE LOGIN (Proporsi 40% - Putih Bersih Alami)             */}
            {/* ========================================================================= */}
            <div className="w-full lg:w-[40%] shrink-0 h-full bg-white flex flex-col justify-between px-8 sm:px-12 xl:px-16 py-6 sm:py-8 relative z-20 overflow-y-auto lg:overflow-hidden border-l border-[#eaecf0]">
                {/* Header Kanan / Link Kembali */}
                <div className="flex items-center justify-between w-full">
                    <Link href="/" className="flex items-center gap-2.5 group lg:hidden">
                        <img
                            src="/images/logo-pgri.png"
                            alt="Logo SMK PGRI Gumelar"
                            className="w-8 h-8 object-contain"
                        />
                        <span className="font-bold text-xs text-[#1f1f1f]">
                            SMK PGRI GUMELAR
                        </span>
                    </Link>

                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 text-xs text-[#737373] hover:text-[#0968f6] transition font-medium ml-auto"
                    >
                        <IconArrowLeft size={14} />
                        <span>Kembali ke portal publik</span>
                    </Link>
                </div>

                {/* Konten Form Tengah */}
                <div className="my-auto py-4 w-full">
                    {children}
                </div>

                {/* Spacer Bawah Bersih */}
                <div className="h-6"></div>
            </div>
        </div>
    );
}
