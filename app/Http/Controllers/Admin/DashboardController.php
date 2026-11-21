<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SpmbPendaftar;
use App\Models\AlumniTracer;
use App\Models\Berita;
use App\Models\Guru;
use App\Models\LowonganKerja;
use App\Models\MitraDudi;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Dashboard Ringkasan Statistik CMS
     */
    public function index()
    {
        return Inertia::render('Dashboard', [
            'stats' => [
                'total_pendaftar_spmb' => SpmbPendaftar::count(),
                'pendaftar_baru'       => SpmbPendaftar::where('status_pendaftaran', 'menunggu_verifikasi')->count(),
                'total_alumni_tracer'  => AlumniTracer::count(),
                'total_berita'         => Berita::count(),
                'total_guru'           => Guru::count(),
                'total_mitra'          => MitraDudi::count(),
                'lowongan_aktif'       => LowonganKerja::where('status_aktif', true)->count(),
            ],
            'pendaftar_terbaru' => SpmbPendaftar::orderBy('id', 'desc')->take(5)->get(),
            'tracer_terbaru'    => AlumniTracer::orderBy('id', 'desc')->take(5)->get(),
        ]);
    }
}
