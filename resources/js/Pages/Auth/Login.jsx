import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { TextField, PasswordInput } from '@idds/react';
import { IconAlertCircle } from '@tabler/icons-react';

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

    // Deteksi jenis error secara presisi
    const isCredentialError = Boolean(
        errors.email && (errors.email.includes('kata sandi') || errors.email.includes('percobaan masuk'))
    );
    // Field hanya berstatus merah jika ada kesalahan spesifik pada field tersebut (misal format salah atau belum diisi)
    // Saat gagal login umum (kredensial salah), fokus pesan cukup ada di alert banner atas tanpa membuat box default merah
    const emailHasError = Boolean(errors.email && !isCredentialError);
    const passwordHasError = Boolean(errors.password);

    return (
        <GuestLayout>
            <Head title="Masuk Akun Pengelola - Admin CMS" />

            <div className="w-full max-w-[340px] sm:max-w-[370px] mx-auto space-y-6">
                {/* Header Judul Bersih, Proporsional & Selaras dengan Sisi Kiri (24px) */}
                <div className="space-y-1.5">
                    <h1 className="text-2xl sm:text-[24px] font-bold text-[#1f1f1f] tracking-tight leading-snug">
                        Masuk akun pengelola
                    </h1>
                    <p className="text-sm text-[#525252] leading-relaxed mt-1">
                        Gunakan alamat email resmi dan kata sandi yang telah didaftarkan sekolah.
                    </p>
                </div>

                {/* Notifikasi Status Sesi */}
                {status && (
                    <div className="p-3 rounded-xl bg-[#edfded] border border-[#bbf7d0] text-xs font-medium text-[#166534]">
                        {status}
                    </div>
                )}

                {/* Alert Pesan Error Kredensial Ramah (Hanya muncul saat kombinasi email/password salah) */}
                {isCredentialError && (
                    <div className="p-3.5 rounded-xl bg-[#fef2f2] border border-[#fecaca] flex items-start gap-3 text-xs text-[#991b1b] shadow-xs">
                        <IconAlertCircle size={19} className="text-[#dc2626] shrink-0 mt-0.5" />
                        <div className="space-y-0.5">
                            <p className="font-semibold text-[13px] text-[#991b1b]">
                                Gagal Masuk ke Akun
                            </p>
                            <p className="text-[#7f1d1d] leading-relaxed text-[12px]">
                                {errors.email}
                            </p>
                        </div>
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
                            status={emailHasError ? 'error' : 'neutral'}
                            statusMessage={!isCredentialError ? errors.email : undefined}
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
                            status={passwordHasError ? 'error' : 'neutral'}
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
