<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Bukti Pendaftaran - {{ $pendaftar->nomor_registrasi }}</title>
    <style>
        @page {
            size: A4 portrait;
            margin: 25px 30px;
        }
        body {
            font-family: Arial, Helvetica, sans-serif;
            color: #111827;
            font-size: 9.5pt;
            line-height: 1.35;
            margin: 0;
            padding: 0;
        }

        /* KOP SURAT */
        .kop-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }
        .kop-logo {
            width: 70px;
            text-align: left;
            vertical-align: middle;
        }
        .kop-spacer {
            width: 70px;
        }
        .logo-emblem {
            width: 65px;
            height: 65px;
            background-color: #2563eb;
            border-radius: 50%;
            text-align: center;
            line-height: 65px;
            color: #ffffff;
            font-size: 18pt;
            font-weight: bold;
            display: inline-block;
        }
        .kop-text {
            text-align: center;
            vertical-align: middle;
            padding: 0 10px;
        }
        .kop-text .instansi {
            font-size: 10pt;
            font-weight: bold;
            color: #1f2937;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin: 0;
            text-align: center;
        }
        .kop-text .nama-sekolah {
            font-size: 15pt;
            font-weight: 900;
            color: #111827;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            margin: 2px 0;
            text-align: center;
        }
        .kop-text .jurusan {
            font-size: 9pt;
            font-weight: bold;
            color: #2563eb;
            text-transform: uppercase;
            margin: 0 0 2px 0;
            text-align: center;
        }
        .kop-text .alamat {
            font-size: 8pt;
            color: #4b5563;
            margin: 0;
            line-height: 1.25;
            text-align: center;
        }
        .divider {
            border-bottom: 1.5px solid #9ca3af;
            margin-bottom: 14px;
        }

        /* JUDUL DOKUMEN */
        .doc-title {
            text-align: center;
            font-size: 13pt;
            font-weight: bold;
            color: #111827;
            margin-bottom: 14px;
            letter-spacing: 0.5px;
        }

        /* SECTION CARD / KOTAK DATA */
        .card-table {
            width: 100%;
            border-collapse: collapse;
            border: 1px solid #d1d5db;
            margin-bottom: 14px;
        }
        .card-header {
            background-color: #ffffff;
            font-weight: bold;
            font-size: 10pt;
            color: #111827;
            padding: 7px 10px;
            border-bottom: 1px solid #d1d5db;
            text-align: left;
        }
        .card-table td {
            padding: 6px 10px;
            font-size: 9pt;
            border: 1px solid #e5e7eb;
            vertical-align: top;
        }
        .card-table td.col-label {
            color: #374151;
            background-color: #ffffff;
            width: 25%;
        }
        .card-table td.col-val {
            color: #111827;
        }
        .font-semibold {
            font-weight: 600;
        }

        /* KOTAK KETERANGAN */
        .keterangan-box {
            border: 1px solid #d1d5db;
            padding: 8px 10px;
            font-size: 8.5pt;
            color: #374151;
            margin-bottom: 18px;
            line-height: 1.35;
        }
        .keterangan-box strong {
            color: #111827;
        }

        /* TANDA TANGAN */
        .ttd-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        .ttd-table td {
            width: 50%;
            text-align: center;
            font-size: 9pt;
            vertical-align: top;
        }
        .ttd-space {
            height: 50px;
        }
    </style>
</head>
<body>

    <!-- KOP SURAT (SESUAI GAYA REFERENSI DENGAN LOGO DI KIRI) -->
    @php
        $logoPath = public_path('images/logo-pgri.png');
        $logoBase64 = file_exists($logoPath) ? base64_encode(file_get_contents($logoPath)) : null;
    @endphp
    <table class="kop-table">
        <tr>
            <td class="kop-logo">
                @if($logoBase64)
                    <img src="data:image/png;base64,{{ $logoBase64 }}" style="width: 65px; height: auto;" alt="Logo PGRI">
                @else
                    <div class="logo-emblem">PGRI</div>
                @endif
            </td>
            <td class="kop-text">
                <div class="instansi">YPLP PDM PGRI JAWA TENGAH CABANG BANYUMAS</div>
                <div class="nama-sekolah">SMK PGRI GUMELAR</div>
                <div class="jurusan">KOMPETENSI KEAHLIAN: TEKNIK SEPEDA MOTOR (TSM)</div>
                <div class="alamat">
                    Jl. Raya Gumelar, Kec. Gumelar, Kabupaten Banyumas, Jawa Tengah 53165<br>
                    Izin Operasional: SK No. 422/217 | Email: smkpgri.gumelar@gmail.com
                </div>
            </td>
            <td class="kop-spacer"></td>
        </tr>
    </table>

    <!-- GARIS PEMISAH -->
    <div class="divider"></div>

    <!-- JUDUL UTAMA -->
    <div class="doc-title">Bukti Pendaftaran</div>

    <!-- 1. KOTAK INFO PENDAFTARAN -->
    <table class="card-table">
        <tr>
            <th colspan="2" class="card-header">Info Pendaftaran</th>
        </tr>
        <tr>
            <td class="col-label">Nomor Pendaftaran</td>
            <td class="col-val font-semibold">{{ $pendaftar->nomor_registrasi }}</td>
        </tr>
        <tr>
            <td class="col-label">Gelombang / Tahun Ajaran</td>
            <td class="col-val">
                {{ $pendaftar->spmbGelombang->nama_gelombang ?? '-' }} 
                (T.A {{ $pendaftar->spmbGelombang->tahun_ajaran ?? '2026/2027' }})
            </td>
        </tr>
        <tr>
            <td class="col-label">Program Keahlian Pilihan</td>
            <td class="col-val">{{ $pendaftar->pilihan_program_keahlian }}</td>
        </tr>
        <tr>
            <td class="col-label">Status Verifikasi Awal</td>
            <td class="col-val font-semibold">
                {{ ucwords(str_replace('_', ' ', $pendaftar->status_pendaftaran)) }}
            </td>
        </tr>
        <tr>
            <td class="col-label">Waktu Pendaftaran</td>
            <td class="col-val">{{ $pendaftar->created_at->translatedFormat('d F Y, H:i') }} WIB</td>
        </tr>
    </table>

    <!-- 2. KOTAK BIODATA SISWA (GRID 2 KOLOM SESUAI REFERENSI) -->
    <table class="card-table">
        <tr>
            <th colspan="4" class="card-header">Biodata Siswa</th>
        </tr>
        <tr>
            <td class="col-label" style="width: 20%;">Nama Lengkap</td>
            <td class="col-val font-semibold" colspan="3">{{ strtoupper($pendaftar->nama_lengkap_siswa) }}</td>
        </tr>
        <tr>
            <td class="col-label" style="width: 20%;">NISN</td>
            <td class="col-val" style="width: 30%;">{{ $pendaftar->nisn_siswa }}</td>
            <td class="col-label" style="width: 20%;">NIK</td>
            <td class="col-val" style="width: 30%;">{{ $pendaftar->nik_siswa }}</td>
        </tr>
        <tr>
            <td class="col-label">Kelamin</td>
            <td class="col-val">{{ $pendaftar->jenis_kelamin === 'L' ? 'Laki - laki' : 'Perempuan' }}</td>
            <td class="col-label">Tempat &amp; Tgl. Lahir</td>
            <td class="col-val">
                {{ $pendaftar->tempat_lahir_siswa }}, 
                {{ \Carbon\Carbon::parse($pendaftar->tanggal_lahir_siswa)->translatedFormat('d F Y') }}
            </td>
        </tr>
        <tr>
            <td class="col-label">Alamat</td>
            <td class="col-val" colspan="3">{{ $pendaftar->alamat_domisili_siswa }}</td>
        </tr>
        <tr>
            <td class="col-label">Asal Sekolah</td>
            <td class="col-val">{{ $pendaftar->asal_sekolah_smp }}</td>
            <td class="col-label">No. WhatsApp Siswa</td>
            <td class="col-val">{{ $pendaftar->nomor_whatsapp_siswa }}</td>
        </tr>
    </table>

    <!-- 3. KOTAK DATA ORANG TUA / WALI -->
    <table class="card-table">
        <tr>
            <th colspan="4" class="card-header">Data Orang Tua / Wali</th>
        </tr>
        <tr>
            <td class="col-label" style="width: 20%;">Nama Ayah</td>
            <td class="col-val" style="width: 30%;">{{ $pendaftar->nama_ayah ?: '-' }}</td>
            <td class="col-label" style="width: 20%;">Nama Ibu Kandung</td>
            <td class="col-val" style="width: 30%;">{{ $pendaftar->nama_ibu_kandung ?: '-' }}</td>
        </tr>
        @if($pendaftar->nama_wali)
        <tr>
            <td class="col-label">Nama Wali</td>
            <td class="col-val" colspan="3">{{ $pendaftar->nama_wali }}</td>
        </tr>
        @endif
        <tr>
            <td class="col-label">Pekerjaan</td>
            <td class="col-val">{{ $pendaftar->pekerjaan_orang_tua_wali }}</td>
            <td class="col-label">No. WhatsApp Wali</td>
            <td class="col-val">{{ $pendaftar->nomor_whatsapp_wali }}</td>
        </tr>
    </table>

    <!-- KOTAK KETERANGAN (PERSIS GAYA REFERENSI) -->
    <div class="keterangan-box">
        <strong>Keterangan:</strong> Simpan lembar bukti pendaftaran online ini. Panitia SPMB SMK PGRI Gumelar akan melakukan verifikasi berkas dokumen fisik (Kartu Keluarga, Akta Kelahiran, dan Ijazah/SKL). Informasi jadwal verifikasi berkas dan pengumuman penerimaan akan disampaikan melalui portal website atau WhatsApp resmi panitia SPMB.
    </div>

    <!-- TANDA TANGAN DUA PIHAK -->
    <table class="ttd-table">
        <tr>
            <td>
                Calon Siswa Baru,
                <div class="ttd-space"></div>
                <strong>{{ strtoupper($pendaftar->nama_lengkap_siswa) }}</strong>
            </td>
            <td>
                Gumelar, {{ \Carbon\Carbon::parse($pendaftar->created_at)->translatedFormat('d F Y') }}<br>
                Panitia SPMB SMK PGRI Gumelar,
                <div class="ttd-space"></div>
                <strong>( Panitia SPMB )</strong>
            </td>
        </tr>
    </table>

</body>
</html>
