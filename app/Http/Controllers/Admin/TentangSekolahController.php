<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\ManagesPublicMedia;
use App\Http\Controllers\Controller;
use App\Models\TentangSekolah;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TentangSekolahController extends Controller
{
    use ManagesPublicMedia;

    /**
     * Tampilkan halaman pengelolaan Tentang Sekolah (singleton).
     */
    public function index()
    {
        return Inertia::render('Admin/TentangSekolah/Index', [
            'title'   => 'Tentang Sekolah',
            'tentang' => TentangSekolah::first(),
        ]);
    }

    /**
     * Perbarui Seksi 1: Profil & Pengenalan Sekolah.
     */
    public function updateProfil(Request $request)
    {
        $validated = $request->validate([
            'judul_halaman'       => ['required', 'string', 'max:200'],
            'sub_judul_halaman'   => ['required', 'string', 'max:3000'],
            'foto_gedung_sekolah' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:3072'],
        ], [
            'judul_halaman.required'     => 'Judul halaman wajib diisi.',
            'judul_halaman.max'          => 'Judul halaman maksimal 200 karakter.',
            'sub_judul_halaman.required' => 'Deskripsi pengenalan sekolah wajib diisi.',
            'sub_judul_halaman.max'      => 'Deskripsi pengenalan maksimal 3.000 karakter.',
            'foto_gedung_sekolah.image'  => 'File foto gedung harus berupa gambar.',
            'foto_gedung_sekolah.mimes'  => 'Format foto gedung harus jpg, jpeg, png, atau webp.',
            'foto_gedung_sekolah.max'    => 'Ukuran foto gedung maksimal 3 MB.',
        ]);

        $tentang = $this->firstOrNewTentang();

        $fotoGedung = $this->replacePublicPhoto(
            $request->file('foto_gedung_sekolah'),
            'tentang/gedung',
            $tentang->foto_gedung_sekolah
        );

        $tentang->fill([
            'judul_halaman'       => trim($validated['judul_halaman']),
            'sub_judul_halaman'   => trim($validated['sub_judul_halaman']),
            'foto_gedung_sekolah' => $fotoGedung,
        ]);
        $tentang->save();

        return redirect()
            ->route('admin.tentang-sekolah')
            ->with('success', 'Profil pengenalan sekolah berhasil diperbarui.');
    }

    /**
     * Perbarui Seksi 2: Statistik Ringkas Sekolah.
     */
    public function updateStatistik(Request $request)
    {
        $validated = $request->validate([
            'jumlah_jurusan'        => ['required', 'string', 'max:50'],
            'jumlah_siswa'          => ['required', 'string', 'max:50'],
            'jumlah_guru_staf'      => ['required', 'string', 'max:50'],
            'lama_tahun_beroperasi' => ['required', 'string', 'max:50'],
        ], [
            'jumlah_jurusan.required'        => 'Jumlah jurusan wajib diisi.',
            'jumlah_siswa.required'          => 'Jumlah siswa wajib diisi.',
            'jumlah_guru_staf.required'      => 'Jumlah guru & staf wajib diisi.',
            'lama_tahun_beroperasi.required' => 'Lama tahun beroperasi wajib diisi.',
        ]);

        $tentang = $this->firstOrNewTentang();
        $tentang->fill([
            'jumlah_jurusan'        => trim($validated['jumlah_jurusan']),
            'jumlah_siswa'          => trim($validated['jumlah_siswa']),
            'jumlah_guru_staf'      => trim($validated['jumlah_guru_staf']),
            'lama_tahun_beroperasi' => trim($validated['lama_tahun_beroperasi']),
        ]);
        $tentang->save();

        return redirect()
            ->route('admin.tentang-sekolah')
            ->with('success', 'Statistik ringkas sekolah berhasil diperbarui.');
    }

    /**
     * Perbarui Seksi 3a: Teks Visi Sekolah.
     */
    public function updateVisi(Request $request)
    {
        $validated = $request->validate([
            'teks_visi' => ['required', 'string', 'max:3000'],
        ], [
            'teks_visi.required' => 'Teks visi sekolah wajib diisi.',
            'teks_visi.max'      => 'Teks visi maksimal 3.000 karakter.',
        ]);

        $tentang = $this->firstOrNewTentang();
        $tentang->fill([
            'teks_visi' => trim($validated['teks_visi']),
        ]);
        $tentang->save();

        return redirect()
            ->route('admin.tentang-sekolah')
            ->with('success', 'Visi sekolah berhasil diperbarui.');
    }

    /**
     * Perbarui Seksi 3b: Daftar Poin Misi Sekolah (JSON).
     */
    public function updateMisi(Request $request)
    {
        $validated = $request->validate([
            'poin_misi'   => ['nullable', 'array', 'max:20'],
            'poin_misi.*' => ['required', 'string', 'max:500'],
        ], [
            'poin_misi.array'      => 'Format daftar misi tidak valid.',
            'poin_misi.max'        => 'Daftar misi maksimal 20 poin.',
            'poin_misi.*.required' => 'Setiap poin misi wajib diisi.',
            'poin_misi.*.max'      => 'Setiap poin misi maksimal 500 karakter.',
        ]);

        $misi = collect($validated['poin_misi'] ?? [])
            ->map(fn (string $item) => trim($item))
            ->filter(fn (string $item) => $item !== '')
            ->values()
            ->all();

        $tentang = $this->firstOrNewTentang();
        $tentang->fill([
            'poin_misi' => $misi,
        ]);
        $tentang->save();

        return redirect()
            ->route('admin.tentang-sekolah')
            ->with('success', 'Daftar misi sekolah berhasil diperbarui.');
    }

    /**
     * Perbarui Seksi 4: Legalitas & Izin Operasional.
     */
    public function updateLegalitas(Request $request)
    {
        $validated = $request->validate([
            'judul_legalitas'       => ['required', 'string', 'max:200'],
            'keterangan_legalitas'  => ['required', 'string', 'max:5000'],
            'nama_sekolah'          => ['nullable', 'string', 'max:200'],
            'npsn'                  => ['nullable', 'string', 'max:30'],
            'sk_izin_operasional'   => ['nullable', 'string', 'max:200'],
            'jenjang_status'        => ['nullable', 'string', 'max:100'],
            'yayasan_penyelenggara' => ['nullable', 'string', 'max:200'],
            'akreditasi'            => ['nullable', 'string', 'max:50'],
            'foto_legalitas'        => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:3072'],
        ], [
            'judul_legalitas.required'      => 'Judul legalitas wajib diisi.',
            'judul_legalitas.max'           => 'Judul legalitas maksimal 200 karakter.',
            'keterangan_legalitas.required' => 'Keterangan legalitas wajib diisi.',
            'keterangan_legalitas.max'      => 'Keterangan legalitas maksimal 5.000 karakter.',
            'nama_sekolah.max'              => 'Nama sekolah maksimal 200 karakter.',
            'npsn.max'                      => 'NPSN maksimal 30 karakter.',
            'sk_izin_operasional.max'       => 'SK izin operasional maksimal 200 karakter.',
            'jenjang_status.max'            => 'Jenjang / status maksimal 100 karakter.',
            'yayasan_penyelenggara.max'     => 'Yayasan penyelenggara maksimal 200 karakter.',
            'akreditasi.max'                => 'Akreditasi maksimal 50 karakter.',
            'foto_legalitas.image'          => 'File dokumen legalitas harus berupa gambar.',
            'foto_legalitas.mimes'          => 'Format dokumen legalitas harus jpg, jpeg, png, atau webp.',
            'foto_legalitas.max'            => 'Ukuran dokumen legalitas maksimal 3 MB.',
        ]);

        $tentang = $this->firstOrNewTentang();

        $fotoLegalitas = $this->replacePublicPhoto(
            $request->file('foto_legalitas'),
            'tentang/legalitas',
            $tentang->foto_legalitas
        );

        $tentang->fill([
            'judul_legalitas'       => trim($validated['judul_legalitas']),
            'keterangan_legalitas'  => trim($validated['keterangan_legalitas']),
            'nama_sekolah'          => trim((string) ($validated['nama_sekolah'] ?? '')),
            'npsn'                  => trim((string) ($validated['npsn'] ?? '')),
            'sk_izin_operasional'   => trim((string) ($validated['sk_izin_operasional'] ?? '')),
            'jenjang_status'        => trim((string) ($validated['jenjang_status'] ?? '')),
            'yayasan_penyelenggara' => trim((string) ($validated['yayasan_penyelenggara'] ?? '')),
            'akreditasi'            => trim((string) ($validated['akreditasi'] ?? '')),
            'foto_legalitas'        => $fotoLegalitas,
        ]);
        $tentang->save();

        return redirect()
            ->route('admin.tentang-sekolah')
            ->with('success', 'Informasi legalitas sekolah berhasil diperbarui.');
    }

    /**
     * Ambil record tentang sekolah pertama atau siapkan nilai default aman.
     */
    private function firstOrNewTentang(): TentangSekolah
    {
        return TentangSekolah::first() ?? new TentangSekolah([
            'judul_halaman'         => '',
            'sub_judul_halaman'     => '',
            'foto_gedung_sekolah'   => '',
            'teks_visi'             => '',
            'poin_misi'             => [],
            'jumlah_jurusan'        => '',
            'jumlah_siswa'          => '',
            'jumlah_guru_staf'      => '',
            'lama_tahun_beroperasi' => '',
            'judul_legalitas'       => '',
            'keterangan_legalitas'  => '',
            'nama_sekolah'          => '',
            'npsn'                  => '',
            'sk_izin_operasional'   => '',
            'jenjang_status'        => '',
            'yayasan_penyelenggara' => '',
            'akreditasi'            => '',
            'foto_legalitas'        => '',
        ]);
    }
}
