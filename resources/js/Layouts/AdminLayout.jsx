import React, { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AdminSidebar from '@/Components/AdminSidebar';
import AdminTopbar from '@/Components/AdminTopbar';
import Swal from 'sweetalert2';

export default function AdminLayout({
    children,
    title = 'Dashboard',
    subtitle,
    headerActions,
}) {
    const { flash, auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // Integrasi SweetAlert2 Toast Feedback untuk flash notifications dari Laravel
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
                confirmButtonColor: '#0968f6',
            });
        }
    }, [flash]);

    return (
        <div className="min-h-screen flex bg-[#f2f4f7] text-[#1f1f1f] antialiased font-sans">
            <Head>
                <title>{title ? `${title} - Admin CMS SMK PGRI Gumelar` : 'Admin CMS SMK PGRI Gumelar'}</title>
            </Head>

            {/* 1. Sidebar Navigasi Admin dengan Switch Tab Besar/Kecil */}
            <AdminSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                isCollapsed={sidebarCollapsed}
                onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            />

            {/* 2. Area Kerja Konten Utama dengan Skema Topbar IDDS */}
            <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-hidden">
                {/* Topbar IDDS: Breadcrumb di kiri, Quick Link + Profil User di kanan */}
                <AdminTopbar
                    title={title}
                    user={auth?.user}
                    onToggleSidebar={() => setSidebarOpen(true)}
                />

                {/* Konten Halaman CMS (Token Spacing: p-6 lg:p-8 / 24px-32px) */}
                <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto space-y-6">
                        {/* Sub-bar Header Kontekstual Halaman */}
                        {(subtitle || headerActions) && (
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h1 className="text-xl sm:text-2xl font-bold text-[#1f1f1f] tracking-tight">
                                        {title}
                                    </h1>
                                    {subtitle && (
                                        <p className="text-xs sm:text-sm text-[#525252] mt-1 font-normal">
                                            {subtitle}
                                        </p>
                                    )}
                                </div>

                                {headerActions && (
                                    <div className="flex items-center gap-3 shrink-0">
                                        {headerActions}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Konten Utama */}
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
