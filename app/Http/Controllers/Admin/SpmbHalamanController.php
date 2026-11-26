<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SpmbHalaman;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SpmbHalamanController extends Controller
{
    /**
     * Form Pengaturan Halaman SPMB & Brosur
     */
    public function index()
    {
        $halaman = SpmbHalaman::firstOrCreate(
            ['id' => 1],
            [
                'judul_hero_spmb'          => 'Wujudkan Masa Depanmu Bersama SMK PGRI Gumelar',
                'subjudul_hero_spmb'       => 'Pusat keahlian teknik otomotif berwawasan industri.',
                'gambar_hero_spmb'         => '/images/spmb-hero.jpg',
                'file_brosur_pdf'          => null,
                'judul_biaya'              => 'Informasi Biaya Pendidikan',
                'subjudul_biaya'           => 'Biaya transparan dan terjangkau bagi seluruh lapisan masyarakat.',
                'daftar_rincian_biaya'     => [],
                'judul_alur_pendaftaran'   => 'Alur Pendaftaran Calon Siswa Baru',
                'subjudul_alur_pendaftaran'=> 'Ikuti langkah mudah pendaftaran online berikut.',
                'daftar_alur_pendaftaran'  => [],
                'judul_banner_bawah_spmb'  => 'Siap Bergabung dengan SMK PGRI Gumelar?',
                'subjudul_banner_bawah_spmb'=> 'Daftarkan dirimu sekarang sebelum kuota gelombang terpenuhi.',
                'gambar_banner_bawah_spmb' => '/images/spmb-cta.jpg',
            ]
        );

        return Inertia::render('Admin/SpmbHalaman/Index', [
            'title'   => 'Pengaturan Halaman SPMB',
            'halaman' => $halaman,
        ]);
    }

    /**
     * Perbarui Khusus Seksi 1: Hero Utama & Brosur PDF SPMB
     */
    public function updateHero(Request $request)
    {
        $halaman = SpmbHalaman::firstOrFail();

        $validated = $request->validate([
            'judul_hero_spmb'    => ['required', 'string', 'max:255'],
            'subjudul_hero_spmb' => ['required', 'string'],
            'gambar_hero_spmb'   => ['nullable'],
            'file_brosur_pdf'    => ['nullable'],
        ], [
            'judul_hero_spmb.required'    => 'Judul hero SPMB wajib diisi.',
            'subjudul_hero_spmb.required' => 'Subjudul hero SPMB wajib diisi.',
        ]);

        if ($request->hasFile('file_brosur_pdf')) {
            $request->validate([
                'file_brosur_pdf' => ['file', 'mimes:pdf', 'max:10240'],
            ], [
                'file_brosur_pdf.mimes' => 'File brosur wajib berupa dokumen PDF.',
                'file_brosur_pdf.max'   => 'Ukuran brosur maksimal 10 MB.',
            ]);

            if ($halaman->file_brosur_pdf) {
                $oldPath = str_replace('/storage/', '', $halaman->file_brosur_pdf);
                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }

            $storedPdf = $request->file('file_brosur_pdf')->store('documents/spmb', 'public');
            $validated['file_brosur_pdf'] = '/storage/' . $storedPdf;
        } else {
            unset($validated['file_brosur_pdf']);
        }

        if ($request->hasFile('gambar_hero_spmb')) {
            $request->validate([
                'gambar_hero_spmb' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:3072'],
            ], [
                'gambar_hero_spmb.image' => 'File gambar hero harus berupa gambar valid.',
                'gambar_hero_spmb.max'   => 'Ukuran gambar hero maksimal 3 MB.',
            ]);

            if ($halaman->gambar_hero_spmb && str_starts_with($halaman->gambar_hero_spmb, '/storage/')) {
                $oldHero = str_replace('/storage/', '', $halaman->gambar_hero_spmb);
                if (Storage::disk('public')->exists($oldHero)) {
                    Storage::disk('public')->delete($oldHero);
                }
            }

            $storedHero = $request->file('gambar_hero_spmb')->store('images/spmb', 'public');
            $validated['gambar_hero_spmb'] = '/storage/' . $storedHero;
        } else {
            unset($validated['gambar_hero_spmb']);
        }

        $halaman->update($validated);

        return back()->with('success', 'Hero utama dan brosur resmi SPMB berhasil disimpan.');
    }

    /**
     * Perbarui Khusus Seksi 2: Informasi Biaya Pendidikan
     */
    public function updateBiaya(Request $request)
    {
        $halaman = SpmbHalaman::firstOrFail();

        $validated = $request->validate([
            'judul_biaya'          => ['required', 'string', 'max:255'],
            'subjudul_biaya'       => ['required', 'string'],
            'daftar_rincian_biaya' => ['nullable', 'array'],
        ], [
            'judul_biaya.required'    => 'Judul seksi biaya wajib diisi.',
            'subjudul_biaya.required' => 'Subjudul seksi biaya wajib diisi.',
        ]);

        $halaman->update($validated);

        return back()->with('success', 'Informasi dan rincian biaya pendidikan berhasil disimpan.');
    }

    /**
     * Perbarui Khusus Seksi 3: Alur & Tahapan Pendaftaran
     */
    public function updateAlur(Request $request)
    {
        $halaman = SpmbHalaman::firstOrFail();

        $validated = $request->validate([
            'judul_alur_pendaftaran'    => ['required', 'string', 'max:255'],
            'subjudul_alur_pendaftaran' => ['required', 'string'],
            'daftar_alur_pendaftaran'   => ['nullable', 'array'],
        ], [
            'judul_alur_pendaftaran.required'    => 'Judul seksi alur pendaftaran wajib diisi.',
            'subjudul_alur_pendaftaran.required' => 'Subjudul seksi alur pendaftaran wajib diisi.',
        ]);

        $halaman->update($validated);

        return back()->with('success', 'Alur dan tahapan pendaftaran berhasil disimpan.');
    }

    /**
     * Perbarui Khusus Seksi 4: Banner Ajakan Bawah (CTA)
     */
    public function updateBanner(Request $request)
    {
        $halaman = SpmbHalaman::firstOrFail();

        $validated = $request->validate([
            'judul_banner_bawah_spmb'    => ['required', 'string', 'max:255'],
            'subjudul_banner_bawah_spmb' => ['required', 'string'],
            'gambar_banner_bawah_spmb'   => ['nullable'],
        ], [
            'judul_banner_bawah_spmb.required'    => 'Judul banner ajakan wajib diisi.',
            'subjudul_banner_bawah_spmb.required' => 'Subjudul banner ajakan wajib diisi.',
        ]);

        if ($request->hasFile('gambar_banner_bawah_spmb')) {
            $request->validate([
                'gambar_banner_bawah_spmb' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:3072'],
            ], [
                'gambar_banner_bawah_spmb.image' => 'File gambar banner harus berupa gambar valid.',
                'gambar_banner_bawah_spmb.max'   => 'Ukuran gambar banner maksimal 3 MB.',
            ]);

            if ($halaman->gambar_banner_bawah_spmb && str_starts_with($halaman->gambar_banner_bawah_spmb, '/storage/')) {
                $oldBanner = str_replace('/storage/', '', $halaman->gambar_banner_bawah_spmb);
                if (Storage::disk('public')->exists($oldBanner)) {
                    Storage::disk('public')->delete($oldBanner);
                }
            }

            $storedBanner = $request->file('gambar_banner_bawah_spmb')->store('images/spmb', 'public');
            $validated['gambar_banner_bawah_spmb'] = '/storage/' . $storedBanner;
        } else {
            unset($validated['gambar_banner_bawah_spmb']);
        }

        $halaman->update($validated);

        return back()->with('success', 'Banner ajakan SPMB berhasil disimpan.');
    }

    /**
     * Simpan Perubahan Pengaturan SPMB (Fallback Keseluruhan)
     */
    public function update(Request $request)
    {
        $halaman = SpmbHalaman::firstOrFail();

        $validated = $request->validate([
            'judul_hero_spmb'           => ['required', 'string', 'max:255'],
            'subjudul_hero_spmb'        => ['required', 'string'],
            'gambar_hero_spmb'          => ['nullable'],
            'file_brosur_pdf'           => ['nullable'],
            'judul_biaya'               => ['required', 'string', 'max:255'],
            'subjudul_biaya'            => ['required', 'string'],
            'daftar_rincian_biaya'      => ['nullable', 'array'],
            'judul_alur_pendaftaran'    => ['required', 'string', 'max:255'],
            'subjudul_alur_pendaftaran' => ['required', 'string'],
            'daftar_alur_pendaftaran'   => ['nullable', 'array'],
            'judul_banner_bawah_spmb'   => ['required', 'string', 'max:255'],
            'subjudul_banner_bawah_spmb'=> ['required', 'string'],
            'gambar_banner_bawah_spmb'  => ['nullable'],
        ]);

        // Upload Brosur PDF baru jika ada
        if ($request->hasFile('file_brosur_pdf')) {
            $request->validate([
                'file_brosur_pdf' => ['file', 'mimes:pdf', 'max:10240'], // maks 10MB
            ], [
                'file_brosur_pdf.mimes' => 'File brosur wajib berupa dokumen PDF.',
                'file_brosur_pdf.max'   => 'Ukuran brosur maksimal 10 MB.',
            ]);

            if ($halaman->file_brosur_pdf) {
                $oldPath = str_replace('/storage/', '', $halaman->file_brosur_pdf);
                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }

            $storedPdf = $request->file('file_brosur_pdf')->store('documents/spmb', 'public');
            $validated['file_brosur_pdf'] = '/storage/' . $storedPdf;
        } else {
            unset($validated['file_brosur_pdf']);
        }

        // Upload Gambar Hero jika ada file baru
        if ($request->hasFile('gambar_hero_spmb')) {
            $request->validate([
                'gambar_hero_spmb' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:3072'],
            ]);

            if ($halaman->gambar_hero_spmb && str_starts_with($halaman->gambar_hero_spmb, '/storage/')) {
                $oldHero = str_replace('/storage/', '', $halaman->gambar_hero_spmb);
                if (Storage::disk('public')->exists($oldHero)) {
                    Storage::disk('public')->delete($oldHero);
                }
            }

            $storedHero = $request->file('gambar_hero_spmb')->store('images/spmb', 'public');
            $validated['gambar_hero_spmb'] = '/storage/' . $storedHero;
        } else {
            unset($validated['gambar_hero_spmb']);
        }

        // Upload Gambar Banner Bawah jika ada file baru
        if ($request->hasFile('gambar_banner_bawah_spmb')) {
            $request->validate([
                'gambar_banner_bawah_spmb' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:3072'],
            ]);

            if ($halaman->gambar_banner_bawah_spmb && str_starts_with($halaman->gambar_banner_bawah_spmb, '/storage/')) {
                $oldBanner = str_replace('/storage/', '', $halaman->gambar_banner_bawah_spmb);
                if (Storage::disk('public')->exists($oldBanner)) {
                    Storage::disk('public')->delete($oldBanner);
                }
            }

            $storedBanner = $request->file('gambar_banner_bawah_spmb')->store('images/spmb', 'public');
            $validated['gambar_banner_bawah_spmb'] = '/storage/' . $storedBanner;
        } else {
            unset($validated['gambar_banner_bawah_spmb']);
        }

        $halaman->update($validated);

        return back()->with('success', 'Pengaturan teks, brosur, dan alur SPMB berhasil disimpan.');
    }
}
