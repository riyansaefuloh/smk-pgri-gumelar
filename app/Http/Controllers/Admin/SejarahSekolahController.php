<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\ManagesPublicMedia;
use App\Http\Controllers\Controller;
use App\Models\SejarahSekolah;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SejarahSekolahController extends Controller
{
    use ManagesPublicMedia;

    /**
     * Tampilkan halaman pengelolaan Sejarah Sekolah (singleton).
     */
    public function index()
    {
        return Inertia::render('Admin/SejarahSekolah/Index', [
            'title'   => 'Sejarah Sekolah',
            'sejarah' => SejarahSekolah::first(),
        ]);
    }

    /**
     * Perbarui Seksi 1: Narasi & Foto Sejarah Sekolah.
     */
    public function updateNarasi(Request $request)
    {
        $validated = $request->validate([
            'judul_sejarah'     => ['required', 'string', 'max:200'],
            'deskripsi_sejarah' => ['required', 'string', 'max:10000'],
            'foto_sekolah'      => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:3072'],
        ], [
            'judul_sejarah.required'     => 'Judul sejarah wajib diisi.',
            'judul_sejarah.max'          => 'Judul sejarah maksimal 200 karakter.',
            'deskripsi_sejarah.required' => 'Deskripsi sejarah wajib diisi.',
            'deskripsi_sejarah.max'      => 'Deskripsi sejarah maksimal 10.000 karakter.',
            'foto_sekolah.image'         => 'File foto sekolah harus berupa gambar.',
            'foto_sekolah.mimes'         => 'Format foto sekolah harus jpg, jpeg, png, atau webp.',
            'foto_sekolah.max'           => 'Ukuran foto sekolah maksimal 3 MB.',
        ]);

        $sejarah = $this->firstOrNewSejarah();

        $fotoSekolah = $this->replacePublicPhoto(
            $request->file('foto_sekolah'),
            'sejarah/foto',
            $sejarah->foto_sekolah
        );

        $sejarah->fill([
            'judul_sejarah'     => trim($validated['judul_sejarah']),
            'subjudul_sejarah'  => $sejarah->subjudul_sejarah ?? '',
            'deskripsi_sejarah' => trim($validated['deskripsi_sejarah']),
            'foto_sekolah'      => $fotoSekolah,
        ]);
        $sejarah->save();

        return redirect()
            ->route('admin.sejarah-sekolah')
            ->with('success', 'Narasi sejarah sekolah berhasil diperbarui.');
    }

    /**
     * Perbarui Seksi 2: Daftar Milestone Linimasa Sejarah (JSON).
     */
    public function updateMilestone(Request $request)
    {
        $validated = $request->validate([
            'daftar_milestone'             => ['nullable', 'array', 'max:30'],
            'daftar_milestone.*.tahun'     => ['required', 'string', 'max:30'],
            'daftar_milestone.*.judul'     => ['required', 'string', 'max:150'],
            'daftar_milestone.*.deskripsi' => ['nullable', 'string', 'max:1000'],
        ], [
            'daftar_milestone.array'              => 'Format daftar milestone tidak valid.',
            'daftar_milestone.max'                => 'Daftar milestone maksimal 30 item.',
            'daftar_milestone.*.tahun.required'   => 'Tahun/periode pada setiap milestone wajib diisi.',
            'daftar_milestone.*.tahun.max'        => 'Tahun/periode maksimal 30 karakter.',
            'daftar_milestone.*.judul.required'   => 'Judul peristiwa pada setiap milestone wajib diisi.',
            'daftar_milestone.*.judul.max'        => 'Judul peristiwa maksimal 150 karakter.',
            'daftar_milestone.*.deskripsi.max'    => 'Deskripsi peristiwa maksimal 1.000 karakter.',
        ]);

        $milestones = collect($validated['daftar_milestone'] ?? [])
            ->map(fn (array $item) => [
                'tahun'     => trim($item['tahun']),
                'judul'     => trim($item['judul']),
                'deskripsi' => trim((string) ($item['deskripsi'] ?? '')),
            ])
            ->values()
            ->all();

        $sejarah = $this->firstOrNewSejarah();
        $sejarah->fill([
            'daftar_milestone' => $milestones,
        ]);
        $sejarah->save();

        return redirect()
            ->route('admin.sejarah-sekolah')
            ->with('success', 'Linimasa milestone sejarah berhasil diperbarui.');
    }

    /**
     * Ambil record sejarah pertama atau siapkan nilai default aman.
     */
    private function firstOrNewSejarah(): SejarahSekolah
    {
        return SejarahSekolah::first() ?? new SejarahSekolah([
            'judul_sejarah'     => '',
            'subjudul_sejarah'  => '',
            'deskripsi_sejarah' => '',
            'foto_sekolah'      => '',
            'daftar_milestone'  => [],
        ]);
    }
}
