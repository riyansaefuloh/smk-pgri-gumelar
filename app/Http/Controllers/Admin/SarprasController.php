<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\ManagesPublicMedia;
use App\Http\Controllers\Controller;
use App\Models\HalamanHeader;
use App\Models\KategoriSarpras;
use App\Models\Sarpras;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class SarprasController extends Controller
{
    use ManagesPublicMedia;

    /**
     * Tampilkan daftar sarana & prasarana beserta filter status, kategori, dan pagination.
     */
    public function index(Request $request)
    {
        $rawSearch = $request->query('search');
        $search = is_string($rawSearch) ? mb_substr(trim($rawSearch), 0, 100) : '';

        $rawKategori = $request->query('kategori');
        $kategori = is_scalar($rawKategori) && ctype_digit((string) $rawKategori)
            ? (int) $rawKategori
            : null;

        $rawStatus = $request->query('status');
        $status = is_scalar($rawStatus) ? (string) $rawStatus : '';

        $allowedPerPage = [10, 20, 50, 100];
        $rawPerPage = $request->query('per_page');
        $perPage = is_scalar($rawPerPage) && in_array((int) $rawPerPage, $allowedPerPage, true)
            ? (int) $rawPerPage
            : 10;

        $sarpras = Sarpras::query()
            ->with('kategoriSarpras')
            ->when($search !== '', function ($query) use ($search) {
                $escaped = addcslashes($search, '%_\\');
                $query->where(function ($sub) use ($escaped) {
                    $sub->where('nama_fasilitas', 'like', "%{$escaped}%")
                        ->orWhere('deskripsi_fasilitas', 'like', "%{$escaped}%");
                });
            })
            ->when($kategori !== null, function ($query) use ($kategori) {
                $query->where('kategori_sarpras_id', $kategori);
            })
            ->when($status !== '', function ($query) use ($status) {
                $isPublished = filter_var($status, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
                if ($isPublished !== null) {
                    $query->where('status_publikasi', $isPublished);
                }
            })
            ->orderBy('urutan_tampil')
            ->orderByDesc('id')
            ->paginate($perPage)
            ->withQueryString();

        $kategoris = KategoriSarpras::withCount('sarpras')
            ->orderBy('nama_kategori')
            ->get();

        return Inertia::render('Admin/Sarpras/Index', [
            'title'     => 'Sarana & Prasarana',
            'sarpras'   => $sarpras,
            'kategoris' => $kategoris,
            'header'    => HalamanHeader::where('kode_halaman', 'sarpras')->first(),
            'filters'   => [
                'search'   => $search,
                'kategori' => $kategori,
                'status'   => $status,
                'per_page' => $perPage,
            ],
            'stats'     => [
                'total'     => Sarpras::count(),
                'published' => Sarpras::where('status_publikasi', true)->count(),
                'draft'     => Sarpras::where('status_publikasi', false)->count(),
            ],
        ]);
    }

    /**
     * Perbarui judul & subjudul header halaman publik Sarana & Prasarana.
     */
    public function updateHeader(Request $request)
    {
        $validated = $request->validate([
            'judul_header'    => ['required', 'string', 'max:200'],
            'subjudul_header' => ['nullable', 'string', 'max:1000'],
        ], [
            'judul_header.required' => 'Judul header halaman Sarana & Prasarana wajib diisi.',
            'judul_header.max'      => 'Judul header maksimal 200 karakter.',
            'subjudul_header.max'   => 'Subjudul header maksimal 1.000 karakter.',
        ]);

        HalamanHeader::updateOrCreate(
            ['kode_halaman' => 'sarpras'],
            [
                'judul_header'    => trim($validated['judul_header']),
                'subjudul_header' => trim((string) ($validated['subjudul_header'] ?? '')),
            ]
        );

        return redirect()
            ->route('admin.sarpras')
            ->with('success', 'Header halaman Sarana & Prasarana berhasil diperbarui.');
    }

    /**
     * Simpan data fasilitas baru.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'kategori_sarpras_id' => ['required', 'integer', 'exists:kategori_sarpras,id'],
            'nama_fasilitas'      => ['required', 'string', 'max:200'],
            'deskripsi_fasilitas' => ['required', 'string', 'max:5000'],
            'status_publikasi'    => ['nullable', 'boolean'],
            'urutan_tampil'       => ['nullable', 'integer', 'min:0', 'max:100000'],
            'foto_fasilitas'      => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:3072'],
        ], [
            'kategori_sarpras_id.required' => 'Kategori fasilitas wajib dipilih.',
            'kategori_sarpras_id.exists'   => 'Kategori fasilitas yang dipilih tidak valid.',
            'nama_fasilitas.required'      => 'Nama fasilitas wajib diisi.',
            'nama_fasilitas.max'           => 'Nama fasilitas maksimal 200 karakter.',
            'deskripsi_fasilitas.required' => 'Deskripsi fasilitas wajib diisi.',
            'deskripsi_fasilitas.max'      => 'Deskripsi fasilitas maksimal 5.000 karakter.',
            'urutan_tampil.integer'        => 'Urutan tampil harus berupa angka.',
            'foto_fasilitas.required'      => 'Foto fasilitas wajib diunggah.',
            'foto_fasilitas.image'         => 'File foto fasilitas harus berupa gambar.',
            'foto_fasilitas.mimes'         => 'Format foto fasilitas harus jpg, jpeg, png, atau webp.',
            'foto_fasilitas.max'           => 'Ukuran foto fasilitas maksimal 3 MB.',
        ]);

        $kategori = KategoriSarpras::find($validated['kategori_sarpras_id']);
        $fotoPath = $this->storePublicPhoto($request->file('foto_fasilitas'), 'sarpras/foto');

        Sarpras::create([
            'kategori_sarpras_id' => $validated['kategori_sarpras_id'],
            'kategori_fasilitas'  => $kategori?->nama_kategori ?? '',
            'nama_fasilitas'      => trim($validated['nama_fasilitas']),
            'deskripsi_fasilitas' => trim($validated['deskripsi_fasilitas']),
            'foto_fasilitas'      => $fotoPath,
            'status_publikasi'    => (bool) ($validated['status_publikasi'] ?? true),
            'urutan_tampil'       => (int) ($validated['urutan_tampil'] ?? 0),
        ]);

        return redirect()
            ->route('admin.sarpras')
            ->with('success', 'Data fasilitas berhasil ditambahkan.');
    }

    /**
     * Perbarui data fasilitas yang sudah ada.
     */
    public function update(Request $request, Sarpras $sarpras)
    {
        $validated = $request->validate([
            'kategori_sarpras_id' => ['required', 'integer', 'exists:kategori_sarpras,id'],
            'nama_fasilitas'      => ['required', 'string', 'max:200'],
            'deskripsi_fasilitas' => ['required', 'string', 'max:5000'],
            'status_publikasi'    => ['nullable', 'boolean'],
            'urutan_tampil'       => ['nullable', 'integer', 'min:0', 'max:100000'],
            'foto_fasilitas'      => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:3072'],
        ], [
            'kategori_sarpras_id.required' => 'Kategori fasilitas wajib dipilih.',
            'kategori_sarpras_id.exists'   => 'Kategori fasilitas yang dipilih tidak valid.',
            'nama_fasilitas.required'      => 'Nama fasilitas wajib diisi.',
            'nama_fasilitas.max'           => 'Nama fasilitas maksimal 200 karakter.',
            'deskripsi_fasilitas.required' => 'Deskripsi fasilitas wajib diisi.',
            'deskripsi_fasilitas.max'      => 'Deskripsi fasilitas maksimal 5.000 karakter.',
            'urutan_tampil.integer'        => 'Urutan tampil harus berupa angka.',
            'foto_fasilitas.image'         => 'File foto fasilitas harus berupa gambar.',
            'foto_fasilitas.mimes'         => 'Format foto fasilitas harus jpg, jpeg, png, atau webp.',
            'foto_fasilitas.max'           => 'Ukuran foto fasilitas maksimal 3 MB.',
        ]);

        $kategori = KategoriSarpras::find($validated['kategori_sarpras_id']);
        $fotoPath = $this->replacePublicPhoto(
            $request->file('foto_fasilitas'),
            'sarpras/foto',
            $sarpras->foto_fasilitas
        );

        $sarpras->update([
            'kategori_sarpras_id' => $validated['kategori_sarpras_id'],
            'kategori_fasilitas'  => $kategori?->nama_kategori ?? '',
            'nama_fasilitas'      => trim($validated['nama_fasilitas']),
            'deskripsi_fasilitas' => trim($validated['deskripsi_fasilitas']),
            'foto_fasilitas'      => $fotoPath,
            'status_publikasi'    => (bool) ($validated['status_publikasi'] ?? true),
            'urutan_tampil'       => (int) ($validated['urutan_tampil'] ?? 0),
        ]);

        return redirect()
            ->route('admin.sarpras')
            ->with('success', 'Data fasilitas berhasil diperbarui.');
    }

    /**
     * Hapus data fasilitas beserta fotonya.
     */
    public function destroy(Sarpras $sarpras)
    {
        $this->deletePublicPhoto($sarpras->foto_fasilitas);
        $sarpras->delete();

        return redirect()
            ->route('admin.sarpras')
            ->with('success', 'Data fasilitas berhasil dihapus.');
    }

    /**
     * Ubah cepat status publikasi (Tayang <-> Draft).
     */
    public function toggleStatus(Sarpras $sarpras)
    {
        $sarpras->update([
            'status_publikasi' => ! $sarpras->status_publikasi,
        ]);

        $statusLabel = $sarpras->status_publikasi ? 'ditayangkan ke publik' : 'disimpan sebagai draft';

        return back()->with('success', "Fasilitas \"{$sarpras->nama_fasilitas}\" berhasil {$statusLabel}.");
    }

    /**
     * Tambah kategori fasilitas baru.
     */
    public function storeKategori(Request $request)
    {
        $validated = $request->validate([
            'nama_kategori' => ['required', 'string', 'max:100', 'unique:kategori_sarpras,nama_kategori'],
        ], [
            'nama_kategori.required' => 'Nama kategori wajib diisi.',
            'nama_kategori.max'      => 'Nama kategori maksimal 100 karakter.',
            'nama_kategori.unique'   => 'Nama kategori tersebut sudah terdaftar.',
        ]);

        $nama = trim($validated['nama_kategori']);
        KategoriSarpras::create([
            'nama_kategori' => $nama,
            'slug_kategori' => $this->generateUniqueSlug($nama),
        ]);

        return back()->with('success', 'Kategori fasilitas baru berhasil ditambahkan.');
    }

    /**
     * Perbarui nama kategori fasilitas.
     */
    public function updateKategori(Request $request, KategoriSarpras $kategori)
    {
        $validated = $request->validate([
            'nama_kategori' => [
                'required',
                'string',
                'max:100',
                Rule::unique('kategori_sarpras', 'nama_kategori')->ignore($kategori->id),
            ],
        ], [
            'nama_kategori.required' => 'Nama kategori wajib diisi.',
            'nama_kategori.max'      => 'Nama kategori maksimal 100 karakter.',
            'nama_kategori.unique'   => 'Nama kategori tersebut sudah terdaftar.',
        ]);

        $nama = trim($validated['nama_kategori']);
        $kategori->update([
            'nama_kategori' => $nama,
            'slug_kategori' => $this->generateUniqueSlug($nama, $kategori->id),
        ]);

        Sarpras::where('kategori_sarpras_id', $kategori->id)
            ->update(['kategori_fasilitas' => $nama]);

        return back()->with('success', 'Nama kategori fasilitas berhasil diperbarui.');
    }

    /**
     * Hapus kategori fasilitas bila belum digunakan oleh fasilitas mana pun.
     */
    public function destroyKategori(KategoriSarpras $kategori)
    {
        if ($kategori->sarpras()->exists()) {
            return back()->with('error', 'Kategori tidak dapat dihapus karena masih digunakan oleh fasilitas.');
        }

        $kategori->delete();

        return back()->with('success', 'Kategori fasilitas berhasil dihapus.');
    }

    private function generateUniqueSlug(string $source, ?int $ignoreId = null): string
    {
        $base = Str::slug($source) ?: 'kategori-fasilitas';
        $slug = $base;
        $counter = 2;

        while (
            KategoriSarpras::query()
                ->where('slug_kategori', $slug)
                ->when($ignoreId !== null, fn ($q) => $q->where('id', '!=', $ignoreId))
                ->exists()
        ) {
            $slug = "{$base}-{$counter}";
            $counter++;
        }

        return $slug;
    }
}
