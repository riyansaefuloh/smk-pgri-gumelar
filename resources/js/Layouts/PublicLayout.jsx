import React from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';

export default function PublicLayout({
    children,
    title = 'SMK PGRI Gumelar',
    transparentNavbar = false,
}) {
    return (
        <div className="min-h-screen flex flex-col bg-pub-surface text-content-primary antialiased font-body selection:bg-pub-primary selection:text-white">
            <Head>
                <title>{title ? `${title} - SMK PGRI Gumelar` : 'SMK PGRI Gumelar'}</title>
                <meta
                    name="description"
                    content="Website resmi SMK PGRI Gumelar Banyumas. Pusat informasi SPMB/PPDB, program keahlian, Teaching Factory, bursa kerja, dan tracer study."
                />
            </Head>

            {/* Header & Navigasi */}
            <Navbar transparent={transparentNavbar} />

            {/* Konten Dinamis Halaman Publik */}
            <main className="flex-grow">
                {children}
            </main>

            {/* Footer Sekolah */}
            <Footer />
        </div>
    );
}
