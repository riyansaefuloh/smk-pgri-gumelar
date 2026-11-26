<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\ManagesPublicMedia;
use App\Http\Controllers\Controller;
use App\Models\StrukturOrganisasi;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StrukturOrganisasiController extends Controller
{
    use ManagesPublicMedia;

    /**
     * Tampilkan halaman pengelolaan Struktur Organisasi (singleton).
     */
    public function index()
    {
        return Inertia::render('Admin/StrukturOrganisasi/Index', [
            'title'    => 'Struktur Organisasi',
            'struktur' => StrukturOrganisasi::first(),
        ]);
    }

    /**
     * Perbarui informasi & bagan Struktur Organisasi.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'judul_halaman'         => ['required', 'string', 'max:200'],
            'subjudul_halaman'      => ['required', 'string', 'max:3000'],
            'gambar_bagan_struktur' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:3072'],
        ], [
            'judul_halaman.required'         => 'Judul halaman wajib diisi.',
            'judul_halaman.max'              => 'Judul halaman maksimal 200 karakter.',
            'subjudul_halaman.required'      => 'Deskripsi pengantar struktur organisasi wajib diisi.',
            'subjudul_halaman.max'           => 'Deskripsi pengantar maksimal 3.000 karakter.',
            'gambar_bagan_struktur.image'    => 'File bagan struktur harus berupa gambar.',
            'gambar_bagan_struktur.mimes'    => 'Format bagan struktur harus jpg, jpeg, png, atau webp.',
            'gambar_bagan_struktur.max'      => 'Ukuran bagan struktur maksimal 3 MB.',
        ]);

        $struktur = StrukturOrganisasi::first() ?? new StrukturOrganisasi([
            'judul_halaman'         => '',
            'subjudul_halaman'      => '',
            'gambar_bagan_struktur' => '',
        ]);

        $baganPath = $this->replacePublicPhoto(
            $request->file('gambar_bagan_struktur'),
            'struktur/bagan',
            $struktur->gambar_bagan_struktur
        );

        $struktur->fill([
            'judul_halaman'         => trim($validated['judul_halaman']),
            'subjudul_halaman'      => trim($validated['subjudul_halaman']),
            'gambar_bagan_struktur' => $baganPath,
        ]);
        $struktur->save();

        return redirect()
            ->route('admin.struktur-organisasi')
            ->with('success', 'Struktur organisasi sekolah berhasil diperbarui.');
    }
}
