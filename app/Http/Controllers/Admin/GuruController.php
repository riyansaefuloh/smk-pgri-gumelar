<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\ManagesPublicMedia;
use App\Http\Controllers\Controller;
use App\Models\Guru;
use App\Models\HalamanHeader;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GuruController extends Controller
{
    use ManagesPublicMedia;

    /**
     * Tampilkan daftar direktori guru & staf beserta pencarian dan pagination.
     */
    public function index(Request $request)
    {
        $rawSearch = $request->query('search');
        $search = is_string($rawSearch) ? mb_substr(trim($rawSearch), 0, 100) : '';

        $allowedPerPage = [10, 20, 50, 100];
        $rawPerPage = $request->query('per_page');
        $perPage = is_scalar($rawPerPage) && in_array((int) $rawPerPage, $allowedPerPage, true)
            ? (int) $rawPerPage
            : 10;

        $gurus = Guru::query()
            ->when($search !== '', function ($query) use ($search) {
                $escaped = addcslashes($search, '%_\\');
                $query->where(function ($sub) use ($escaped) {
                    $sub->where('nama_lengkap_gelar', 'like', "%{$escaped}%")
                        ->orWhere('jabatan', 'like', "%{$escaped}%")
                        ->orWhere('mata_pelajaran', 'like', "%{$escaped}%");
                });
            })
            ->orderBy('urutan_tampil')
            ->orderByDesc('id')
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('Admin/Guru/Index', [
            'title'     => 'Direktori Guru & Staf',
            'gurus'     => $gurus,
            'header'    => HalamanHeader::where('kode_halaman', 'guru')->first(),
            'totalGuru' => Guru::count(),
            'filters'   => [
                'search'   => $search,
                'per_page' => $perPage,
            ],
        ]);
    }

    /**
     * Perbarui judul & subjudul header halaman publik Direktori Guru & Staf.
     */
    public function updateHeader(Request $request)
    {
        $validated = $request->validate([
            'judul_header'    => ['required', 'string', 'max:200'],
            'subjudul_header' => ['nullable', 'string', 'max:1000'],
        ], [
            'judul_header.required' => 'Judul header halaman Guru & Staf wajib diisi.',
            'judul_header.max'      => 'Judul header maksimal 200 karakter.',
            'subjudul_header.max'   => 'Subjudul header maksimal 1.000 karakter.',
        ]);

        HalamanHeader::updateOrCreate(
            ['kode_halaman' => 'guru'],
            [
                'judul_header'    => trim($validated['judul_header']),
                'subjudul_header' => trim((string) ($validated['subjudul_header'] ?? '')),
            ]
        );

        return redirect()
            ->route('admin.guru')
            ->with('success', 'Header halaman Direktori Guru & Staf berhasil diperbarui.');
    }

    /**
     * Simpan data guru atau staf baru.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_lengkap_gelar' => ['required', 'string', 'max:200'],
            'jabatan'            => ['required', 'string', 'max:200'],
            'mata_pelajaran'     => ['nullable', 'string', 'max:200'],
            'urutan_tampil'      => ['nullable', 'integer', 'min:0', 'max:9999'],
            'foto_profil'        => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:3072'],
        ], [
            'nama_lengkap_gelar.required' => 'Nama lengkap & gelar wajib diisi.',
            'nama_lengkap_gelar.max'      => 'Nama lengkap & gelar maksimal 200 karakter.',
            'jabatan.required'            => 'Jabatan wajib diisi.',
            'jabatan.max'                 => 'Jabatan maksimal 200 karakter.',
            'mata_pelajaran.max'          => 'Mata pelajaran maksimal 200 karakter.',
            'urutan_tampil.integer'       => 'Urutan tampil harus berupa angka.',
            'foto_profil.required'        => 'Foto profil guru/staf wajib diunggah.',
            'foto_profil.image'           => 'File foto profil harus berupa gambar.',
            'foto_profil.mimes'           => 'Format foto profil harus jpg, jpeg, png, atau webp.',
            'foto_profil.max'             => 'Ukuran foto profil maksimal 3 MB.',
        ]);

        $fotoPath = $this->storePublicPhoto($request->file('foto_profil'), 'guru/profil');

        Guru::create([
            'nama_lengkap_gelar' => trim($validated['nama_lengkap_gelar']),
            'jabatan'            => trim($validated['jabatan']),
            'mata_pelajaran'     => trim((string) ($validated['mata_pelajaran'] ?? '')),
            'foto_profil'        => $fotoPath,
            'urutan_tampil'      => (int) ($validated['urutan_tampil'] ?? 0),
        ]);

        return redirect()
            ->route('admin.guru')
            ->with('success', 'Data guru / staf berhasil ditambahkan.');
    }

    /**
     * Perbarui data guru atau staf yang sudah ada.
     */
    public function update(Request $request, Guru $guru)
    {
        $validated = $request->validate([
            'nama_lengkap_gelar' => ['required', 'string', 'max:200'],
            'jabatan'            => ['required', 'string', 'max:200'],
            'mata_pelajaran'     => ['nullable', 'string', 'max:200'],
            'urutan_tampil'      => ['nullable', 'integer', 'min:0', 'max:9999'],
            'foto_profil'        => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:3072'],
        ], [
            'nama_lengkap_gelar.required' => 'Nama lengkap & gelar wajib diisi.',
            'nama_lengkap_gelar.max'      => 'Nama lengkap & gelar maksimal 200 karakter.',
            'jabatan.required'            => 'Jabatan wajib diisi.',
            'jabatan.max'                 => 'Jabatan maksimal 200 karakter.',
            'mata_pelajaran.max'          => 'Mata pelajaran maksimal 200 karakter.',
            'urutan_tampil.integer'       => 'Urutan tampil harus berupa angka.',
            'foto_profil.image'           => 'File foto profil harus berupa gambar.',
            'foto_profil.mimes'           => 'Format foto profil harus jpg, jpeg, png, atau webp.',
            'foto_profil.max'             => 'Ukuran foto profil maksimal 3 MB.',
        ]);

        $fotoPath = $this->replacePublicPhoto(
            $request->file('foto_profil'),
            'guru/profil',
            $guru->foto_profil
        );

        $guru->update([
            'nama_lengkap_gelar' => trim($validated['nama_lengkap_gelar']),
            'jabatan'            => trim($validated['jabatan']),
            'mata_pelajaran'     => trim((string) ($validated['mata_pelajaran'] ?? '')),
            'foto_profil'        => $fotoPath,
            'urutan_tampil'      => (int) ($validated['urutan_tampil'] ?? 0),
        ]);

        return redirect()
            ->route('admin.guru')
            ->with('success', 'Data guru / staf berhasil diperbarui.');
    }

    /**
     * Hapus data guru atau staf beserta foto profilnya.
     */
    public function destroy(Guru $guru)
    {
        $this->deletePublicPhoto($guru->foto_profil);
        $guru->delete();

        return redirect()
            ->route('admin.guru')
            ->with('success', 'Data guru / staf berhasil dihapus.');
    }
}
