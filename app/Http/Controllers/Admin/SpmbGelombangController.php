<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SpmbGelombang;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SpmbGelombangController extends Controller
{
    /**
     * Tampilkan Daftar Gelombang Pendaftaran
     */
    public function index()
    {
        $gelombangs = SpmbGelombang::withCount('spmbPendaftars')
            ->orderBy('tanggal_buka', 'desc')
            ->get();

        return Inertia::render('Admin/SpmbGelombang/Index', [
            'title'      => 'Jadwal Gelombang',
            'gelombangs' => $gelombangs,
        ]);
    }

    /**
     * Simpan Gelombang Pendaftaran Baru
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_gelombang'        => ['required', 'string', 'max:100'],
            'tahun_ajaran'          => ['required', 'string', 'max:50'],
            'tanggal_buka'          => ['required', 'date'],
            'tanggal_tutup'         => ['required', 'date', 'after_or_equal:tanggal_buka'],
            'status_gelombang_buka' => ['boolean'],
        ], [
            'nama_gelombang.required' => 'Nama gelombang (misal: Gelombang 1) wajib diisi.',
            'tahun_ajaran.required'   => 'Tahun ajaran (misal: 2026/2027) wajib diisi.',
            'tanggal_buka.required'   => 'Tanggal pembukaan pendaftaran wajib diisi.',
            'tanggal_tutup.required'  => 'Tanggal penutupan pendaftaran wajib diisi.',
            'tanggal_tutup.after_or_equal' => 'Tanggal tutup harus sama atau setelah tanggal buka.',
        ]);

        // Aturan: Hanya boleh 1 gelombang yang berstatus aktif dalam satu waktu
        if ($request->boolean('status_gelombang_buka')) {
            $gelombangAktif = SpmbGelombang::where('status_gelombang_buka', true)->first();
            if ($gelombangAktif) {
                return back()
                    ->withInput()
                    ->withErrors([
                        'status_gelombang_buka' => "Tidak dapat mengaktifkan gelombang ini karena {$gelombangAktif->nama_gelombang} ({$gelombangAktif->tahun_ajaran}) masih aktif. Tutup gelombang tersebut terlebih dahulu.",
                    ])
                    ->with('error', "Gagal menambahkan gelombang aktif. {$gelombangAktif->nama_gelombang} saat ini masih DIBUKA. Hanya 1 gelombang yang boleh aktif.");
            }
        }

        SpmbGelombang::create($validated);

        return back()->with('success', 'Gelombang pendaftaran baru berhasil ditambahkan.');
    }

    /**
     * Update Data Gelombang
     */
    public function update(Request $request, SpmbGelombang $spmbGelombang)
    {
        $validated = $request->validate([
            'nama_gelombang'        => ['required', 'string', 'max:100'],
            'tahun_ajaran'          => ['required', 'string', 'max:50'],
            'tanggal_buka'          => ['required', 'date'],
            'tanggal_tutup'         => ['required', 'date', 'after_or_equal:tanggal_buka'],
            'status_gelombang_buka' => ['boolean'],
        ]);

        // Aturan: Hanya boleh 1 gelombang yang berstatus aktif dalam satu waktu
        if ($request->boolean('status_gelombang_buka')) {
            $gelombangAktif = SpmbGelombang::where('status_gelombang_buka', true)
                ->where('id', '!=', $spmbGelombang->id)
                ->first();

            if ($gelombangAktif) {
                return back()
                    ->withInput()
                    ->withErrors([
                        'status_gelombang_buka' => "Tidak dapat mengaktifkan gelombang ini karena {$gelombangAktif->nama_gelombang} ({$gelombangAktif->tahun_ajaran}) masih aktif. Tutup gelombang tersebut terlebih dahulu.",
                    ])
                    ->with('error', "Gagal mengaktifkan {$spmbGelombang->nama_gelombang}. Saat ini {$gelombangAktif->nama_gelombang} masih DIBUKA. Hanya 1 gelombang yang boleh aktif.");
            }
        }

        $spmbGelombang->update($validated);

        return back()->with('success', 'Data gelombang pendaftaran berhasil diperbarui.');
    }

    /**
     * Toggle Switch Buka / Tutup Gelombang
     */
    public function toggleStatus(SpmbGelombang $spmbGelombang)
    {
        // Jika gelombang saat ini DITUTUP dan hendak DIBUKA
        if (!$spmbGelombang->status_gelombang_buka) {
            $gelombangAktif = SpmbGelombang::where('status_gelombang_buka', true)
                ->where('id', '!=', $spmbGelombang->id)
                ->first();

            if ($gelombangAktif) {
                return back()->with(
                    'error',
                    "Tidak dapat membuka {$spmbGelombang->nama_gelombang}. Saat ini {$gelombangAktif->nama_gelombang} ({$gelombangAktif->tahun_ajaran}) masih berstatus DIBUKA. Tutup gelombang tersebut terlebih dahulu."
                );
            }

            $spmbGelombang->update([
                'status_gelombang_buka' => true,
            ]);
            return back()->with('success', "Status {$spmbGelombang->nama_gelombang} kini DIBUKA.");
        }

        // Jika gelombang saat ini DIBUKA dan hendak DITUTUP
        $spmbGelombang->update([
            'status_gelombang_buka' => false,
        ]);
        return back()->with('success', "Status {$spmbGelombang->nama_gelombang} kini DITUTUP.");
    }

    /**
     * Hapus Gelombang
     */
    public function destroy(SpmbGelombang $spmbGelombang)
    {
        // Cek apakah sudah ada siswa yang mendaftar di gelombang ini
        if ($spmbGelombang->spmbPendaftars()->count() > 0) {
            return back()->with('error', 'Gelombang ini tidak dapat dihapus karena sudah memiliki data siswa terdaftar.');
        }

        $spmbGelombang->delete();

        return back()->with('success', 'Gelombang pendaftaran berhasil dihapus.');
    }
}
