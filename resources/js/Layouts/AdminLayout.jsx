import React, { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AdminSidebar from '@/Components/AdminSidebar';
import AdminTopbar from '@/Components/AdminTopbar';
import Swal from 'sweetalert2';

export default function AdminLayout({ children, title = 'Panel Admin' }) {
    const { flash, auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Integrasi SweetAlert2 untuk menangkap flash notification dari Laravel Controller
    useEffect(() => {
        if (flash?.success) {
            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: flash.success,
                timer: 2500,
                showConfirmButton: false,
                toast: true,
                position: 'top-end',
                timerProgressBar: true,
            });
        }
        if (flash?.error) {
            Swal.fire({
                icon: 'error',
                title: 'Perhatian!',
                text: flash.error,
                confirmButtonColor: '#2563eb',
            });
        }
    }, [flash]);

    return (
        <div className="min-h-screen flex bg-slate-100 text-slate-850 antialiased font-sans">
            <Head>
                <title>{title ? `${title} - CMS SMK PGRI Gumelar` : 'CMS SMK PGRI Gumelar'}</title>
            </Head>

            {/* 1. Sidebar Navigasi Admin */}
            <AdminSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* 2. Area Kerja Konten */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Topbar Navigasi */}
                <AdminTopbar
                    user={auth?.user}
                    onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                />

                {/* Konten Halaman CRUD */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    {/* Header Halaman CMS */}
                    {title && (
                        <div className="mb-6">
                            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                                {title}
                            </h1>
                        </div>
                    )}

                    {/* Children Component */}
                    {children}
                </main>
            </div>
        </div>
    );
}
