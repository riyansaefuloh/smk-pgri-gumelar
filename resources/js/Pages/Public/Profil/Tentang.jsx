import React, { useState } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import {
    IconBuilding,
    IconBuildingBank,
    IconCheck,
    IconSchool,
    IconSitemap,
    IconTarget,
    IconUsers,
} from '@tabler/icons-react';

/**
 * Sorot kata kunci tertentu pada judul halaman dengan warna #4F6DF5.
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

/**
 * Item statistik ringkas dengan ikon bulat lembut dan angka Libre Baskerville.
 */
function StatItem({ stat }) {
    const Icon = stat.icon;
    return (
        <div className="flex flex-col items-center text-center">
            <div className="w-11 h-11 rounded-full bg-[#EEF2FF] text-[#4F6DF5] flex items-center justify-center mb-2.5">
                <Icon size={20} stroke={1.8} />
            </div>
            <div className="font-number text-2xl sm:text-[28px] font-bold text-[#1f1f1f] leading-tight">
                {stat.value}
            </div>
            <div className="font-body text-xs text-[#525252] mt-1 leading-snug">
                {stat.lines.map((line, lineIdx) => (
                    <span key={lineIdx} className="block">
                        {line}
                    </span>
                ))}
            </div>
        </div>
    );
}

export default function Tentang({ tentang, header }) {
    const [gedungImgFailed, setGedungImgFailed] = useState(false);
    const [legalitasImgFailed, setLegalitasImgFailed] = useState(false);

    const data = tentang || {
        judul_halaman: 'Mengenal SMK PGRI Gumelar Lebih Dekat',
        sub_judul_halaman:
            'SMK PGRI Gumelar merupakan lembaga pendidikan kejuruan yang berfokus pada pengembangan pengetahuan, keterampilan, dan karakter siswa. Melalui pembelajaran teori dan praktik, sekolah menjadi tempat bagi siswa untuk mengembangkan potensi diri sebagai bekal menghadapi dunia kerja, berwirausaha, maupun melanjutkan pendidikan.',
        foto_gedung_sekolah: '/images/gedung-sekolah.jpg',
        teks_visi:
            'Terwujudnya SMK PGRI Gumelar sebagai lembaga pendidikan kejuruan yang unggul, berkarakter, terampil, dan berdaya saing di dunia kerja maupun wirausaha.',
        poin_misi: [
            'Menyelenggarakan pembelajaran teori dan praktik kejuruan yang relevan dengan kebutuhan dunia usaha dan dunia industri.',
            'Membentuk karakter peserta didik yang disiplin, berakhlak mulia, dan bertanggung jawab.',
            'Mengembangkan jiwa kewirausahaan serta kesiapan kerja lulusan melalui program Teaching Factory dan kerja sama industri.',
        ],
        jumlah_jurusan: 1,
        jumlah_siswa: 100,
        jumlah_guru_staf: 15,
        lama_tahun_beroperasi: 25,
        judul_legalitas: 'Identitas & Legalitas Resmi Sekolah',
        keterangan_legalitas:
            'Informasi legalitas dan status akreditasi resmi SMK PGRI Gumelar di bawah naungan YPLP DM PGRI Jawa Tengah Cabang Banyumas.',
        nama_sekolah: 'SMK PGRI Gumelar',
        npsn: '20302130',
        sk_izin_operasional: '421.5/1234/2001',
        jenjang_status: 'SMK / Swasta',
        yayasan_penyelenggara: 'YPLP DM PGRI JT Cabang Banyumas',
        akreditasi: 'B',
        foto_legalitas: null,
    };

    const judulTampil =
        header?.judul_halaman ||
        data.judul_halaman ||
        'Mengenal SMK PGRI Gumelar Lebih Dekat';

    const subjudulTampil =
        header?.sub_judul_halaman ||
        data.sub_judul_halaman ||
        'SMK PGRI Gumelar merupakan lembaga pendidikan kejuruan yang berfokus pada pengembangan pengetahuan, keterampilan, dan karakter siswa.';

    const stats = [
        {
            icon: IconSitemap,
            value: data.jumlah_jurusan ?? 1,
            lines: ['Program', 'Keahlian'],
        },
        {
            icon: IconUsers,
            value: data.jumlah_siswa ?? 100,
            lines: ['Siswa Aktif', 'Laki-laki & Perempuan'],
        },
        {
            icon: IconSchool,
            value: data.jumlah_guru_staf ?? 15,
            lines: ['Guru &', 'Tenaga Kependidikan'],
        },
        {
            icon: IconBuildingBank,
            value: data.lama_tahun_beroperasi ?? 25,
            lines: ['Tahun', 'Beroperasi'],
        },
    ];

    const poinMisi = Array.isArray(data.poin_misi)
        ? data.poin_misi.filter(Boolean)
        : [];

    const legalitasItems = [
        { label: 'Nama Sekolah', value: data.nama_sekolah },
        { label: 'NPSN', value: data.npsn },
        { label: 'SK Izin Operasional', value: data.sk_izin_operasional },
        { label: 'Jenjang & Status', value: data.jenjang_status },
        { label: 'Yayasan Penyelenggara', value: data.yayasan_penyelenggara },
        { label: 'Akreditasi', value: data.akreditasi },
    ].filter((item) => item.value);

    return (
        <PublicLayout title="Tentang Sekolah">
            {/* SEKSI UTAMA: MENGENAL SMK PGRI GUMELAR */}
            <section className="py-12 lg:py-16 bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Eyebrow & Judul Rata Tengah */}
                    <div className="text-center space-y-3">
                        <span className="font-badge inline-block text-xs font-medium text-[#4F6DF5]">
                            Tentang SMK PGRI Gumelar
                        </span>

                        <h1 className="font-heading text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#1f1f1f] tracking-tight leading-[1.2] max-w-2xl mx-auto">
                            {renderHighlightedTitle(judulTampil, ['PGRI'])}
                        </h1>
                    </div>

                    {/* Layout Arc: Stat Kiri-Kanan Mengapit Deskripsi + Stat Tengah di Bawah */}
                    <div className="mt-5">
                        {/* Baris 1: Stat Kiri | Deskripsi | Stat Kanan */}
                        <div className="flex items-start gap-4 sm:gap-6">
                            {/* Stat 1: Program Keahlian — kiri */}
                            <div className="shrink-0 w-24 sm:w-28 flex justify-center pt-1">
                                <StatItem stat={stats[0]} />
                            </div>

                            {/* Teks Deskripsi — tengah */}
                            <div className="flex-1 text-center">
                                <p className="font-body text-sm sm:text-[15px] text-[#525252] leading-relaxed">
                                    {subjudulTampil}
                                </p>
                            </div>

                            {/* Stat 4: Tahun Beroperasi — kanan */}
                            <div className="shrink-0 w-24 sm:w-28 flex justify-center pt-1">
                                <StatItem stat={stats[3]} />
                            </div>
                        </div>

                        {/* Baris 2: Siswa Aktif + Guru — tepat di bawah deskripsi, jarak seimbang */}
                        <div className="mt-7 max-w-lg mx-auto flex items-start justify-between gap-8">
                            <StatItem stat={stats[1]} />
                            <StatItem stat={stats[2]} />
                        </div>
                    </div>

                    {/* Foto Gedung Sekolah (ukuran seragam dengan Banner Penutup Beranda) */}
                    <div className="mt-10 md:mt-12">
                        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#F8FAFC] h-[320px] sm:h-[380px]">
                            {data.foto_gedung_sekolah && !gedungImgFailed ? (
                                <img
                                    src={data.foto_gedung_sekolah}
                                    alt={data.nama_sekolah || 'Gedung SMK PGRI Gumelar'}
                                    className="absolute inset-0 w-full h-full object-cover"
                                    onError={() => setGedungImgFailed(true)}
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center space-y-3">
                                    <div className="w-16 h-16 rounded-full bg-[#EEF2FF] text-[#4F6DF5] flex items-center justify-center">
                                        <IconBuilding size={32} stroke={1.6} />
                                    </div>
                                    <p className="font-heading text-base font-bold text-[#1f1f1f]">
                                        {data.nama_sekolah || 'SMK PGRI Gumelar'}
                                    </p>
                                    <p className="font-body text-xs text-[#525252]">
                                        Foto gedung sekolah dapat diatur melalui Panel Admin CMS.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* SEKSI VISI & MISI SEKOLAH */}
            {(data.teks_visi || poinMisi.length > 0) && (
                <section className="py-14 lg:py-20 bg-[#F8FAFC] border-t border-stroke-card">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center space-y-3 mb-10">
                            <span className="font-badge inline-block text-xs font-medium text-[#4F6DF5]">
                                Arah & Tujuan Pendidikan
                            </span>
                            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#1f1f1f] tracking-tight">
                                Visi & <span className="text-[#4F6DF5]">Misi</span> Sekolah
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                            {data.teks_visi && (
                                <div className="lg:col-span-5 bg-white rounded-2xl border border-stroke-card p-6 sm:p-8 space-y-4">
                                    <div className="w-11 h-11 rounded-full bg-[#EEF2FF] text-[#4F6DF5] flex items-center justify-center">
                                        <IconTarget size={22} stroke={1.8} />
                                    </div>
                                    <h3 className="font-heading text-xl font-bold text-[#1f1f1f]">
                                        Visi Sekolah
                                    </h3>
                                    <p className="font-body text-sm sm:text-[15px] text-[#525252] leading-relaxed">
                                        {data.teks_visi}
                                    </p>
                                </div>
                            )}

                            {poinMisi.length > 0 && (
                                <div
                                    className={`${
                                        data.teks_visi ? 'lg:col-span-7' : 'lg:col-span-12'
                                    } bg-white rounded-2xl border border-stroke-card p-6 sm:p-8 space-y-4`}
                                >
                                    <div className="w-11 h-11 rounded-full bg-[#EEF2FF] text-[#4F6DF5] flex items-center justify-center">
                                        <IconSchool size={22} stroke={1.8} />
                                    </div>
                                    <h3 className="font-heading text-xl font-bold text-[#1f1f1f]">
                                        Misi Sekolah
                                    </h3>
                                    <ul className="space-y-3">
                                        {poinMisi.map((poin, idx) => (
                                            <li key={idx} className="flex items-start gap-3">
                                                <span className="w-6 h-6 rounded-full bg-[#EEF2FF] text-[#4F6DF5] flex items-center justify-center shrink-0 mt-0.5">
                                                    <IconCheck size={14} stroke={2.4} />
                                                </span>
                                                <span className="font-body text-sm sm:text-[15px] text-[#525252] leading-relaxed">
                                                    {poin}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* SEKSI IDENTITAS & LEGALITAS SEKOLAH */}
            {legalitasItems.length > 0 && (
                <section className="py-14 lg:py-20 bg-white border-t border-stroke-card">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center space-y-3 mb-10">
                            <span className="font-badge inline-block text-xs font-medium text-[#4F6DF5]">
                                Legalitas & Akreditasi
                            </span>
                            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#1f1f1f] tracking-tight">
                                {data.judul_legalitas || 'Identitas & Legalitas Resmi Sekolah'}
                            </h2>
                            {data.keterangan_legalitas && (
                                <p className="font-body text-sm sm:text-[15px] text-[#525252] max-w-2xl mx-auto leading-relaxed">
                                    {data.keterangan_legalitas}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                            <div
                                className={`${
                                    data.foto_legalitas && !legalitasImgFailed
                                        ? 'lg:col-span-7'
                                        : 'lg:col-span-12'
                                } grid grid-cols-1 sm:grid-cols-2 gap-4`}
                            >
                                {legalitasItems.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="rounded-2xl border border-stroke-card bg-[#F8FAFC] p-5 space-y-1.5"
                                    >
                                        <span className="font-badge inline-block text-[11px] text-[#4F6DF5]">
                                            {item.label}
                                        </span>
                                        <p className="font-heading text-base font-bold text-[#1f1f1f]">
                                            {item.value}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {data.foto_legalitas && !legalitasImgFailed && (
                                <div className="lg:col-span-5 rounded-2xl overflow-hidden border border-stroke-card bg-[#F8FAFC]">
                                    <img
                                        src={data.foto_legalitas}
                                        alt="Dokumen Legalitas SMK PGRI Gumelar"
                                        className="w-full h-full object-cover"
                                        onError={() => setLegalitasImgFailed(true)}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}
        </PublicLayout>
    );
}
