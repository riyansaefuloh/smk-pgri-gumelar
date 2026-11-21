import React from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';

export default function PublicLayout({ children, title = 'SMK PGRI Gumelar' }) {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-850 antialiased font-sans selection:bg-blue-600 selection:text-white">
            <Head>
                <title>{title ? `${title} - SMK PGRI Gumelar` : 'SMK PGRI Gumelar - Layanan & Branding'}</title>
                <meta name="description" content="Website resmi SMK PGRI Gumelar Banyumas. Pusat informasi PPDB/SPMB, program keahlian TBSM, Teaching Factory, bursa kerja, dan tracer study." />
            </Head>

            {/* 1. Header & Navigasi */}
            <Navbar />

            {/* 2. Konten Dinamis Halaman Publik */}
            <main className="flex-grow">
                {children}
            </main>

            {/* 3. Footer Sekolah */}
            <Footer />
        </div>
    );
}
