<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSpmbPendaftarRequest;
use App\Models\SpmbGelombang;
use App\Models\SpmbHalaman;
use App\Models\SpmbPendaftar;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SpmbController extends Controller
{
    /**
     * Halaman Informasi Brosur, Alur, & Biaya SPMB
     */
    public function index()
    {
        $halaman = SpmbHalaman::first();
        $gelombangAktif = SpmbGelombang::where('status_gelombang_buka', true)
            ->whereDate('tanggal_buka', '<=', now())
            ->whereDate('tanggal_tutup', '>=', now())
            ->orderBy('tanggal_buka', 'asc')
            ->first();

        $semuaGelombang = SpmbGelombang::orderBy('tanggal_buka', 'asc')->get();

        return Inertia::render('Public/Spmb/Index', [
            'halaman'         => $halaman,
            'gelombang_aktif' => $gelombangAktif,
            'semua_gelombang' => $semuaGelombang,
        ]);
    }

    /**
     * Halaman Formulir Pendaftaran Bertahap (Stepper Form)
     */
    public function daftar()
    {
        $gelombangAktif = SpmbGelombang::where('status_gelombang_buka', true)
            ->whereDate('tanggal_buka', '<=', now())
            ->whereDate('tanggal_tutup', '>=', now())
            ->first();

        // Jika tidak ada gelombang pendaftaran yang buka, arahkan kembali dengan pesan
        if (!$gelombangAktif) {
            return redirect()->route('spmb.index')->with(
                'error',
                'Mohon maaf, saat ini pendaftaran online belum dibuka atau gelombang telah berakhir.'
            );
        }

        return Inertia::render('Public/Spmb/Daftar', [
            'gelombang' => $gelombangAktif,
        ]);
    }

    /**
     * Proses Simpan Data Pendaftaran Calon Siswa Baru
     */
    public function store(StoreSpmbPendaftarRequest $request)
    {
        $validated = $request->validated();

        DB::beginTransaction();
        try {
            // 1. Logika Pembuatan Nomor Registrasi Otomatis (SPMB-2026-XXXX)
            $tahun = date('Y');
            $prefix = "SPMB-{$tahun}-";

            // Hitung pendaftar terakhir di tahun yang sama dengan lock pesimis
            $lastPendaftar = SpmbPendaftar::where('nomor_registrasi', 'LIKE', "{$prefix}%")
                ->lockForUpdate()
                ->orderBy('id', 'desc')
                ->first();

            if ($lastPendaftar) {
                // Ambil 4 digit angka terakhir lalu tambahkan 1
                $lastNumber = (int) substr($lastPendaftar->nomor_registrasi, -4);
                $nextNumber = str_pad($lastNumber + 1, 4, '0', STR_PAD_LEFT);
            } else {
                $nextNumber = '0001';
            }

            $nomorRegistrasi = $prefix . $nextNumber;

            // 2. Simpan Berkas Dokumen ke Storage Public
            $pathKk = $request->file('file_kartu_keluarga')
                ->store("spmb/{$tahun}/kk", 'public');

            $pathAkta = $request->hasFile('file_akta_kelahiran')
                ? $request->file('file_akta_kelahiran')->store("spmb/{$tahun}/akta", 'public')
                : null;

            $pathIjazah = $request->hasFile('file_ijazah_atau_skl')
                ? $request->file('file_ijazah_atau_skl')->store("spmb/{$tahun}/ijazah", 'public')
                : null;

            // 3. Masukkan ke Database
            $pendaftar = SpmbPendaftar::create([
                'nomor_registrasi'          => $nomorRegistrasi,
                'spmb_gelombang_id'         => $validated['spmb_gelombang_id'],
                'nama_lengkap_siswa'        => $validated['nama_lengkap_siswa'],
                'jenis_kelamin'             => $validated['jenis_kelamin'],
                'nisn_siswa'                => $validated['nisn_siswa'],
                'nik_siswa'                 => $validated['nik_siswa'],
                'tempat_lahir_siswa'        => $validated['tempat_lahir_siswa'],
                'tanggal_lahir_siswa'       => $validated['tanggal_lahir_siswa'],
                'asal_sekolah_smp'          => $validated['asal_sekolah_smp'],
                'alamat_domisili_siswa'     => $validated['alamat_domisili_siswa'],
                'nomor_whatsapp_siswa'      => $validated['nomor_whatsapp_siswa'],
                'nama_ayah'                 => $validated['nama_ayah'] ?? null,
                'nama_ibu_kandung'          => $validated['nama_ibu_kandung'] ?? null,
                'nama_wali'                 => $validated['nama_wali'] ?? null,
                'pekerjaan_orang_tua_wali'  => $validated['pekerjaan_orang_tua_wali'],
                'nomor_whatsapp_wali'       => $validated['nomor_whatsapp_wali'],
                'pilihan_program_keahlian'  => $validated['pilihan_program_keahlian'] ?? 'Teknik Sepeda Motor (TSM)',
                'file_kartu_keluarga'       => $pathKk,
                'file_akta_kelahiran'       => $pathAkta,
                'file_ijazah_atau_skl'      => $pathIjazah,
                'status_pendaftaran'        => 'menunggu_verifikasi',
            ]);

            DB::commit();

            return redirect()->route('spmb.sukses', $pendaftar->nomor_registrasi)
                ->with('success', 'Alhamdulillah! Pendaftaran online berhasil dikirim.');

        } catch (\Throwable $th) {
            DB::rollBack();

            // Hapus file yang sempat terupload jika database gagal menyimpan
            if (isset($pathKk)) Storage::disk('public')->delete($pathKk);
            if (isset($pathAkta) && $pathAkta) Storage::disk('public')->delete($pathAkta);
            if (isset($pathIjazah) && $pathIjazah) Storage::disk('public')->delete($pathIjazah);

            return back()->with('error', 'Terjadi kesalahan sistem saat menyimpan data: ' . $th->getMessage());
        }
    }

    /**
     * Halaman Konfirmasi Sukses Pendaftaran
     */
    public function sukses(string $nomor_registrasi)
    {
        $pendaftar = SpmbPendaftar::with('spmbGelombang')
            ->where('nomor_registrasi', $nomor_registrasi)
            ->firstOrFail();

        return Inertia::render('Public/Spmb/Sukses', [
            'pendaftar' => $pendaftar,
        ]);
    }

    /**
     * Generate & Download PDF Tanda Bukti Pendaftaran Resmi (DOMPDF)
     */
    public function cetakBukti(string $nomor_registrasi)
    {
        $pendaftar = SpmbPendaftar::with('spmbGelombang')
            ->where('nomor_registrasi', $nomor_registrasi)
            ->firstOrFail();

        $pdf = Pdf::loadView('pdf.bukti-pendaftaran', [
            'pendaftar' => $pendaftar,
            'tanggal_cetak' => now()->translatedFormat('d F Y, H:i') . ' WIB',
        ])->setPaper('a4', 'portrait');

        $fileName = "Tanda-Bukti-SPMB-{$pendaftar->nomor_registrasi}.pdf";

        return $pdf->download($fileName);
    }
}
