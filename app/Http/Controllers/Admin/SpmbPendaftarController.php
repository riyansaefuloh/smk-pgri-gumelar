<?php

namespace App\Http\Controllers\Admin;

use App\Exports\SpmbPendaftarExport;
use App\Http\Controllers\Controller;
use App\Models\SpmbGelombang;
use App\Models\SpmbPendaftar;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class SpmbPendaftarController extends Controller
{
    /**
     * Tampilkan data pendaftar siswa SPMB dengan pencarian & filter.
     */
    public function index(Request $request)
    {
        $search = trim((string) $request->input('q', ''));
        $gelombangId = $request->input('gelombang_id');
        $status = $request->input('status');
        $perPage = (int) $request->input('per_page', 10);
        if (!in_array($perPage, [10, 20, 50, 100], true)) {
            $perPage = 10;
        }

        $query = SpmbPendaftar::with('spmbGelombang');

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('nama_lengkap_siswa', 'like', "%{$search}%")
                    ->orWhere('nomor_registrasi', 'like', "%{$search}%")
                    ->orWhere('nisn_siswa', 'like', "%{$search}%")
                    ->orWhere('nik_siswa', 'like', "%{$search}%")
                    ->orWhere('asal_sekolah_smp', 'like', "%{$search}%");
            });
        }

        if ($gelombangId && is_numeric($gelombangId)) {
            $query->where('spmb_gelombang_id', $gelombangId);
        }

        if ($status && in_array($status, ['menunggu_verifikasi', 'berkas_lengkap', 'perlu_perbaikan', 'diterima', 'ditolak'], true)) {
            $query->where('status_pendaftaran', $status);
        }

        $pendaftars = $query
            ->orderByRaw("CASE WHEN status_pendaftaran = 'menunggu_verifikasi' THEN 0 ELSE 1 END")
            ->orderByDesc('id')
            ->paginate($perPage)
            ->withQueryString();

        // Ringkasan Statistik Metrik
        $stats = [
            'total'               => SpmbPendaftar::count(),
            'menunggu_verifikasi' => SpmbPendaftar::where('status_pendaftaran', 'menunggu_verifikasi')->count(),
            'berkas_lengkap'      => SpmbPendaftar::where('status_pendaftaran', 'berkas_lengkap')->count(),
            'diterima'            => SpmbPendaftar::where('status_pendaftaran', 'diterima')->count(),
            'perlu_perbaikan'     => SpmbPendaftar::where('status_pendaftaran', 'perlu_perbaikan')->count(),
            'ditolak'             => SpmbPendaftar::where('status_pendaftaran', 'ditolak')->count(),
        ];

        // Daftar Gelombang untuk dropdown filter
        $gelombangs = SpmbGelombang::orderBy('tanggal_buka', 'asc')
            ->get(['id', 'nama_gelombang', 'tahun_ajaran', 'status_gelombang_buka']);

        return Inertia::render('Admin/SpmbPendaftar/Index', [
            'title'      => 'Data Pendaftar Siswa',
            'pendaftars' => $pendaftars,
            'stats'      => $stats,
            'gelombangs' => $gelombangs,
            'filters'    => [
                'q'            => $search,
                'gelombang_id' => $gelombangId,
                'status'       => $status,
                'per_page'     => $perPage,
            ],
        ]);
    }

    /**
     * Perbarui status verifikasi dan catatan panitia.
     */
    public function updateStatus(Request $request, SpmbPendaftar $spmbPendaftar)
    {
        $validated = $request->validate([
            'status_pendaftaran' => [
                'required',
                'in:menunggu_verifikasi,berkas_lengkap,perlu_perbaikan,diterima,ditolak',
            ],
            'catatan_verifikasi' => ['nullable', 'string', 'max:1000'],
        ], [
            'status_pendaftaran.required' => 'Status verifikasi pendaftaran wajib dipilih.',
            'status_pendaftaran.in'       => 'Pilihan status verifikasi tidak valid.',
            'catatan_verifikasi.max'      => 'Catatan verifikasi maksimal 1.000 karakter.',
        ]);

        $spmbPendaftar->update([
            'status_pendaftaran' => $validated['status_pendaftaran'],
            'catatan_verifikasi' => trim((string) ($validated['catatan_verifikasi'] ?? '')) ?: null,
        ]);

        return back()->with('success', "Status verifikasi pendaftar {$spmbPendaftar->nomor_registrasi} ({$spmbPendaftar->nama_lengkap_siswa}) berhasil diperbarui.");
    }

    /**
     * Export rekap data siswa pendaftar ke format Excel (.xlsx).
     */
    public function exportExcel(Request $request)
    {
        $search = trim((string) $request->input('q', ''));
        $gelombangId = $request->input('gelombang_id');
        $status = $request->input('status');

        $timestamp = now()->format('Ymd_His');
        $fileName = "Rekap_Pendaftar_SPMB_{$timestamp}.xlsx";

        return Excel::download(
            new SpmbPendaftarExport($search, $gelombangId, $status),
            $fileName
        );
    }

    /**
     * Unduh berkas Tanda Bukti Registrasi resmi (PDF).
     */
    public function downloadPdf(SpmbPendaftar $spmbPendaftar)
    {
        $spmbPendaftar->load('spmbGelombang');

        $pdf = Pdf::loadView('pdf.bukti-pendaftaran', [
            'pendaftar'     => $spmbPendaftar,
            'tanggal_cetak' => now()->translatedFormat('d F Y, H:i') . ' WIB',
        ])->setPaper('a4', 'portrait');

        $fileName = "Tanda-Bukti-SPMB-{$spmbPendaftar->nomor_registrasi}.pdf";

        return $pdf->download($fileName);
    }

    /**
     * Hapus data pendaftar (jika duplikat / dibatalkan).
     */
    public function destroy(SpmbPendaftar $spmbPendaftar)
    {
        $nomor = $spmbPendaftar->nomor_registrasi;
        $nama = $spmbPendaftar->nama_lengkap_siswa;

        // Bersihkan berkas terlampir jika ada di disk public
        $files = [
            $spmbPendaftar->file_kartu_keluarga,
            $spmbPendaftar->file_akta_kelahiran,
            $spmbPendaftar->file_ijazah_atau_skl,
        ];

        foreach ($files as $file) {
            if ($file && str_starts_with($file, '/storage/')) {
                $relPath = str_replace('/storage/', '', $file);
                if (Storage::disk('public')->exists($relPath)) {
                    Storage::disk('public')->delete($relPath);
                }
            }
        }

        $spmbPendaftar->delete();

        return back()->with('success', "Data calon siswa {$nama} ({$nomor}) berhasil dihapus.");
    }
}
