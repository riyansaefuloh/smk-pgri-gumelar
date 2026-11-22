import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { TextField, PasswordInput } from '@idds/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Masuk Akun Pengelola - Admin CMS" />

            <div className="w-full max-w-[340px] sm:max-w-[360px] mx-auto space-y-7">
                {/* Header Judul Bersih & Proporsional */}
                <div className="space-y-2">
                    <h1 className="text-2xl sm:text-[26px] font-bold text-[#1f1f1f] tracking-tight leading-snug">
                        Masuk akun pengelola
                    </h1>
                    <p className="text-xs sm:text-sm text-[#737373] leading-relaxed">
                        Gunakan alamat email resmi dan kata sandi yang telah didaftarkan sekolah.
                    </p>
                </div>

                {/* Notifikasi Status */}
                {status && (
                    <div className="p-3 rounded-md bg-[#edfded] border border-[#bbf7d0] text-xs font-medium text-[#166534]">
                        {status}
                    </div>
                )}

                {/* Formulir Otentikasi */}
                <form onSubmit={submit} className="space-y-5">
                    {/* Input Email Resmi IDDS */}
                    <div className="space-y-1.5">
                        <TextField
                            label="Alamat email resmi"
                            value={data.email}
                            onChange={(val) => setData('email', val)}
                            placeholder="nama@smkpgri-gumelar.sch.id"
                            status={errors.email ? 'error' : 'neutral'}
                            statusMessage={errors.email}
                            disabled={processing}
                        />
                    </div>

                    {/* Input Password IDDS */}
                    <div className="space-y-1.5">
                        <PasswordInput
                            label="Kata sandi"
                            value={data.password}
                            onChange={(val) => setData('password', val)}
                            placeholder="Masukkan kata sandi"
                            status={errors.password ? 'error' : 'neutral'}
                            statusMessage={errors.password}
                            disabled={processing}
                        />

                        {/* Opsi Ingat Saya */}
                        <div className="flex items-center pt-1.5">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="w-4 h-4 rounded text-[#0968f6] border-[#d4d4d4] focus:ring-[#0968f6]"
                                />
                                <span className="text-xs text-[#525252] font-normal">
                                    Ingat saya di perangkat ini
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* Tombol Aksi Utama: Solid Gov Blue #0968F6 dengan Radius Tegas 6px */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full h-11 text-sm font-semibold rounded-md bg-[#0968F6] hover:bg-[#0755CA] text-white transition-colors duration-150 flex items-center justify-center cursor-pointer disabled:opacity-75 shadow-xs active:scale-[0.99]"
                        >
                            {processing ? (
                                <span className="inline-flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Memproses...</span>
                                </span>
                            ) : (
                                'Masuk'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
}
