<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\ManagesPublicMedia;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreKategoriKaryaRequest;
use App\Http\Requests\Admin\StoreTefaKaryaRequest;
use App\Http\Requests\Admin\UpdateTefaKaryaRequest;
use App\Models\HalamanHeader;
use App\Models\KategoriKarya;
use App\Models\TefaKarya;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class TefaKaryaController extends Controller
{
    use ManagesPublicMedia;

    /**
     * Tampilkan daftar karya & inovasi siswa beserta filter dan kategori.
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

        $karyas = TefaKarya::query()
            ->with('kategoriKarya')
            ->when($search !== '', function ($query) use ($search) {
                $escaped = addcslashes($search, '%_\\');
                $query->where(function ($sub) use ($escaped) {
                    $sub->where('judul_karya', 'like', "%{$escaped}%")
                        ->orWhere('deskripsi_karya', 'like', "%{$escaped}%");
                });
            })
            ->when($kategori !== null, function ($query) use ($kategori) {
                $query->where('kategori_karya_id', $kategori);
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

        $kategoris = KategoriKarya::withCount('tefaKaryas')
            ->orderBy('nama_kategori')
            ->get();

        return Inertia::render('Admin/TefaKarya/Index', [
            'title'     => 'Karya & Inovasi',
            'karyas'    => $karyas,
            'kategoris' => $kategoris,
            'header'    => HalamanHeader::where('kode_halaman', 'karya')->first(),
            'filters'   => [
                'search'   => $search,
                'kategori' => $kategori,
                'status'   => $status,
                'per_page' => $perPage,
            ],
            'stats'     => [
                'total'     => TefaKarya::count(),
                'published' => TefaKarya::where('status_publikasi', true)->count(),
                'draft'     => TefaKarya::where('status_publikasi', false)->count(),
            ],
        ]);
    }

    /**
     * Perbarui judul & subjudul header halaman publik Karya & Inovasi.
     */
    public function updateHeader(Request $request)
    {
        $validated = $request->validate([
            'judul_header'    => ['required', 'string', 'max:200'],
            'subjudul_header' => ['nullable', 'string', 'max:1000'],
        ], [
            'judul_header.required' => 'Judul header halaman Karya wajib diisi.',
            'judul_header.max'      => 'Judul header maksimal 200 karakter.',
            'subjudul_header.max'   => 'Subjudul header maksimal 1.000 karakter.',
        ]);

        HalamanHeader::updateOrCreate(
            ['kode_halaman' => 'karya'],
            [
                'judul_header'    => trim($validated['judul_header']),
                'subjudul_header' => trim((string) ($validated['subjudul_header'] ?? '')),
            ]
        );

        return redirect()
            ->route('admin.tefa-karya')
            ->with('success', 'Header halaman Karya & Inovasi berhasil diperbarui.');
    }

    /**
     * Simpan data karya siswa baru.
     */
    public function store(StoreTefaKaryaRequest $request)
    {
        $validated = $request->validated();
        $fotoPath = $this->storePublicPhoto($request->file('foto_karya'), 'tefa/karya');

        TefaKarya::create([
            'kategori_karya_id' => $validated['kategori_karya_id'],
            'judul_karya'       => $validated['judul_karya'],
            'slug_karya'        => $this->generateUniqueSlug(TefaKarya::class, 'slug_karya', $validated['judul_karya'], 'karya-siswa'),
            'foto_karya'        => $fotoPath,
            'deskripsi_karya'   => $validated['deskripsi_karya'],
            'status_publikasi'  => (bool) ($validated['status_publikasi'] ?? true),
            'urutan_tampil'     => (int) ($validated['urutan_tampil'] ?? 0),
        ]);

        return redirect()
            ->route('admin.tefa-karya')
            ->with('success', 'Karya siswa berhasil ditambahkan.');
    }

    /**
     * Perbarui data karya siswa yang sudah ada.
     */
    public function update(UpdateTefaKaryaRequest $request, TefaKarya $karya)
    {
        $validated = $request->validated();

        $fotoPath = $this->replacePublicPhoto(
            $request->file('foto_karya'),
            'tefa/karya',
            $karya->foto_karya
        );

        $slug = $karya->judul_karya !== $validated['judul_karya']
            ? $this->generateUniqueSlug(TefaKarya::class, 'slug_karya', $validated['judul_karya'], 'karya-siswa', $karya->id)
            : $karya->slug_karya;

        $karya->update([
            'kategori_karya_id' => $validated['kategori_karya_id'],
            'judul_karya'       => $validated['judul_karya'],
            'slug_karya'        => $slug,
            'foto_karya'        => $fotoPath,
            'deskripsi_karya'   => $validated['deskripsi_karya'],
            'status_publikasi'  => array_key_exists('status_publikasi', $validated)
                ? (bool) $validated['status_publikasi']
                : $karya->status_publikasi,
            'urutan_tampil'     => (int) ($validated['urutan_tampil'] ?? $karya->urutan_tampil),
        ]);

        return redirect()
            ->route('admin.tefa-karya')
            ->with('success', 'Data karya siswa berhasil diperbarui.');
    }

    /**
     * Hapus karya siswa beserta file fotonya dari penyimpanan.
     */
    public function destroy(TefaKarya $karya)
    {
        $this->deletePublicPhoto($karya->foto_karya);
        $karya->delete();

        return redirect()
            ->route('admin.tefa-karya')
            ->with('success', 'Karya siswa berhasil dihapus.');
    }

    /**
     * Ubah status publikasi (Tayang / Draft) secara cepat.
     */
    public function toggleStatus(Request $request, TefaKarya $karya)
    {
        $karya->update([
            'status_publikasi' => ! $karya->status_publikasi,
        ]);

        $message = $karya->status_publikasi
            ? 'Karya berhasil ditayangkan.'
            : 'Karya dipindahkan ke draft.';

        if ($request->expectsJson()) {
            return response()->json([
                'status_publikasi' => $karya->status_publikasi,
                'message'          => $message,
            ]);
        }

        return back()->with('success', $message);
    }

    /**
     * Tambahkan kategori karya baru.
     */
    public function storeKategori(StoreKategoriKaryaRequest $request)
    {
        $nama = trim($request->validated('nama_kategori'));

        $kategori = KategoriKarya::create([
            'nama_kategori' => $nama,
            'slug_kategori' => $this->generateUniqueSlug(KategoriKarya::class, 'slug_kategori', $nama, 'kategori'),
        ]);

        if ($request->expectsJson()) {
            return response()->json([
                'kategori' => $kategori->loadCount('tefaKaryas'),
                'message'  => 'Kategori karya berhasil ditambahkan.',
            ], 201);
        }

        return back()->with('success', 'Kategori karya berhasil ditambahkan.');
    }

    /**
     * Perbarui nama kategori karya yang sudah ada.
     */
    public function updateKategori(Request $request, KategoriKarya $kategori)
    {
        $request->merge([
            'nama_kategori' => trim((string) $request->input('nama_kategori', '')),
        ]);

        $validated = $request->validate([
            'nama_kategori' => [
                'required',
                'string',
                'max:100',
                Rule::unique('kategori_karyas', 'nama_kategori')->ignore($kategori->id),
            ],
        ], [
            'nama_kategori.required' => 'Nama kategori wajib diisi.',
            'nama_kategori.max'      => 'Nama kategori maksimal 100 karakter.',
            'nama_kategori.unique'   => 'Kategori karya dengan nama tersebut sudah ada.',
        ]);

        $nama = $validated['nama_kategori'];
        $slug = $kategori->nama_kategori !== $nama
            ? $this->generateUniqueSlug(KategoriKarya::class, 'slug_kategori', $nama, 'kategori', $kategori->id)
            : $kategori->slug_kategori;

        $kategori->update([
            'nama_kategori' => $nama,
            'slug_kategori' => $slug,
        ]);

        if ($request->expectsJson()) {
            return response()->json([
                'kategori' => $kategori->loadCount('tefaKaryas'),
                'message'  => 'Nama kategori berhasil diperbarui.',
            ]);
        }

        return back()->with('success', 'Nama kategori berhasil diperbarui.');
    }

    /**
     * Hapus kategori karya bila tidak lagi digunakan oleh data karya.
     */
    public function destroyKategori(Request $request, KategoriKarya $kategori)
    {
        if ($kategori->tefaKaryas()->exists()) {
            $errorMessage = 'Kategori tidak dapat dihapus karena masih digunakan oleh karya siswa.';

            if ($request->expectsJson()) {
                return response()->json(['message' => $errorMessage], 422);
            }

            return back()->with('error', $errorMessage);
        }

        $kategori->delete();

        if ($request->expectsJson()) {
            return response()->json(['message' => 'Kategori karya berhasil dihapus.']);
        }

        return back()->with('success', 'Kategori karya berhasil dihapus.');
    }

    /**
     * Buat slug unik untuk model target.
     *
     * @param  class-string<\Illuminate\Database\Eloquent\Model>  $modelClass
     */
    private function generateUniqueSlug(
        string $modelClass,
        string $column,
        string $source,
        string $fallback,
        ?int $ignoreId = null
    ): string {
        $baseSlug = Str::slug($source) ?: $fallback;
        $slug = $baseSlug;
        $counter = 2;

        while (
            $modelClass::where($column, $slug)
                ->when($ignoreId, fn ($query) => $query->where('id', '!=', $ignoreId))
                ->exists()
        ) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
        }

        return $slug;
    }
}
