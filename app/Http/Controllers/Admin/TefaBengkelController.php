<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\ManagesPublicMedia;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateTefaBengkelRequest;
use App\Models\HalamanHeader;
use App\Models\TefaBengkel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TefaBengkelController extends Controller
{
    use ManagesPublicMedia;

    /**
     * Tampilkan halaman profil & pengaturan layanan Bengkel TEFA (singleton).
     */
    public function index()
    {
        return Inertia::render('Admin/TefaBengkel/Index', [
            'title'   => 'Profil Bengkel TEFA',
            'bengkel' => TefaBengkel::first(),
            'header'  => HalamanHeader::where('kode_halaman', 'tefa')->first(),
        ]);
    }

    /**
     * Perbarui khusus Header Halaman Publik TEFA (Seksi 1).
     */
    public function updateHeader(Request $request)
    {
        $validated = $request->validate([
            'judul_header'    => ['required', 'string', 'max:200'],
            'subjudul_header' => ['nullable', 'string', 'max:1000'],
        ], [
            'judul_header.required' => 'Judul header halaman TEFA wajib diisi.',
            'judul_header.max'      => 'Judul header maksimal 200 karakter.',
            'subjudul_header.max'   => 'Subjudul header maksimal 1.000 karakter.',
        ]);

        HalamanHeader::updateOrCreate(
            ['kode_halaman' => 'tefa'],
            [
                'judul_header'    => trim($validated['judul_header']),
                'subjudul_header' => trim((string) ($validated['subjudul_header'] ?? '')),
            ]
        );

        return redirect()
            ->route('admin.tefa-bengkel')
            ->with('success', 'Header halaman TEFA berhasil diperbarui.');
    }

    /**
     * Perbarui khusus Profil & Operasional Unit Bengkel TEFA (Seksi 2).
     */
    public function updateProfil(Request $request)
    {
        $validated = $request->validate([
            'nama_unit_bengkel'  => ['required', 'string', 'max:200'],
            'jadwal_operasional' => ['required', 'string', 'max:200'],
            'deskripsi_bengkel'  => ['required', 'string', 'max:20000'],
            'foto_bengkel'       => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:3072'],
        ], [
            'nama_unit_bengkel.required'  => 'Nama unit bengkel wajib diisi.',
            'nama_unit_bengkel.max'       => 'Nama unit bengkel maksimal 200 karakter.',
            'jadwal_operasional.required' => 'Jadwal operasional wajib diisi.',
            'jadwal_operasional.max'      => 'Jadwal operasional maksimal 200 karakter.',
            'deskripsi_bengkel.required'  => 'Deskripsi bengkel wajib diisi.',
            'deskripsi_bengkel.max'       => 'Deskripsi bengkel maksimal 20.000 karakter.',
            'foto_bengkel.image'          => 'File foto bengkel harus berupa gambar.',
            'foto_bengkel.mimes'          => 'Format foto bengkel harus jpg, jpeg, png, atau webp.',
            'foto_bengkel.max'            => 'Ukuran foto bengkel maksimal 3 MB.',
        ]);

        $bengkel = TefaBengkel::first() ?? new TefaBengkel();

        $fotoPath = $this->replacePublicPhoto(
            $request->file('foto_bengkel'),
            'tefa/bengkel',
            $bengkel->foto_bengkel
        );

        $bengkel->fill([
            'foto_bengkel'       => $fotoPath,
            'nama_unit_bengkel'  => trim($validated['nama_unit_bengkel']),
            'jadwal_operasional' => trim($validated['jadwal_operasional']),
            'deskripsi_bengkel'  => trim($validated['deskripsi_bengkel']),
            'daftar_layanan'     => $bengkel->daftar_layanan ?? [],
        ]);
        $bengkel->save();

        return redirect()
            ->route('admin.tefa-bengkel')
            ->with('success', 'Profil unit bengkel TEFA berhasil diperbarui.');
    }

    /**
     * Perbarui khusus Katalog Layanan Bengkel TEFA (Seksi 3).
     */
    public function updateLayanan(Request $request)
    {
        $validated = $request->validate([
            'daftar_layanan'                     => ['nullable', 'array', 'max:20'],
            'daftar_layanan.*.nama_layanan'      => ['required', 'string', 'max:100'],
            'daftar_layanan.*.deskripsi_layanan' => ['nullable', 'string', 'max:500'],
        ], [
            'daftar_layanan.array'                  => 'Format daftar layanan tidak valid.',
            'daftar_layanan.max'                    => 'Daftar layanan maksimal 20 item.',
            'daftar_layanan.*.nama_layanan.required' => 'Nama layanan pada setiap item wajib diisi.',
            'daftar_layanan.*.nama_layanan.max'      => 'Nama layanan maksimal 100 karakter.',
            'daftar_layanan.*.deskripsi_layanan.max' => 'Deskripsi layanan maksimal 500 karakter.',
        ]);

        $layanan = collect($validated['daftar_layanan'] ?? [])
            ->map(fn (array $item) => [
                'nama_layanan'      => trim($item['nama_layanan']),
                'deskripsi_layanan' => trim((string) ($item['deskripsi_layanan'] ?? '')),
            ])
            ->values()
            ->all();

        $bengkel = TefaBengkel::first() ?? new TefaBengkel();

        $bengkel->fill([
            'foto_bengkel'       => $bengkel->foto_bengkel ?? '',
            'nama_unit_bengkel'  => $bengkel->nama_unit_bengkel ?? '',
            'deskripsi_bengkel'  => $bengkel->deskripsi_bengkel ?? '',
            'jadwal_operasional' => $bengkel->jadwal_operasional ?? '',
            'daftar_layanan'     => $layanan,
        ]);
        $bengkel->save();

        return redirect()
            ->route('admin.tefa-bengkel')
            ->with('success', 'Katalog layanan bengkel TEFA berhasil diperbarui.');
    }

    /**
     * Simpan seluruh perubahan sekaligus (kompatibilitas endpoint gabungan).
     */
    public function update(UpdateTefaBengkelRequest $request)
    {
        $validated = $request->validated();
        $bengkel = TefaBengkel::first() ?? new TefaBengkel();

        $fotoPath = $this->replacePublicPhoto(
            $request->file('foto_bengkel'),
            'tefa/bengkel',
            $bengkel->foto_bengkel
        );

        $layanan = collect($validated['daftar_layanan'] ?? [])
            ->map(fn (array $item) => [
                'nama_layanan'      => trim($item['nama_layanan']),
                'deskripsi_layanan' => trim((string) ($item['deskripsi_layanan'] ?? '')),
            ])
            ->values()
            ->all();

        DB::transaction(function () use ($bengkel, $fotoPath, $validated, $layanan) {
            HalamanHeader::updateOrCreate(
                ['kode_halaman' => 'tefa'],
                [
                    'judul_header'    => trim($validated['judul_header']),
                    'subjudul_header' => trim((string) ($validated['subjudul_header'] ?? '')),
                ]
            );

            $bengkel->fill([
                'foto_bengkel'       => $fotoPath,
                'nama_unit_bengkel'  => $validated['nama_unit_bengkel'],
                'deskripsi_bengkel'  => $validated['deskripsi_bengkel'],
                'jadwal_operasional' => $validated['jadwal_operasional'],
                'daftar_layanan'     => $layanan,
            ]);
            $bengkel->save();
        });

        return redirect()
            ->route('admin.tefa-bengkel')
            ->with('success', 'Profil Bengkel TEFA berhasil diperbarui.');
    }
}
