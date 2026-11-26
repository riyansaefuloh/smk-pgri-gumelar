<?php

namespace App\Exports;

use App\Models\SpmbPendaftar;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Database\Query\Builder;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithCustomValueBinder;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Cell\Cell;
use PhpOffice\PhpSpreadsheet\Cell\DataType;
use PhpOffice\PhpSpreadsheet\Cell\DefaultValueBinder;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class SpmbPendaftarExport extends DefaultValueBinder implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize, WithStyles, WithCustomValueBinder
{
    protected ?string $search;
    protected ?string $gelombangId;
    protected ?string $status;
    protected int $rowNumber = 0;

    public function __construct(?string $search = null, ?string $gelombangId = null, ?string $status = null)
    {
        $this->search = $search;
        $this->gelombangId = $gelombangId;
        $this->status = $status;
    }

    /**
     * Query data pendaftar siswa sesuai filter pencarian, gelombang, dan status verifikasi.
     */
    public function query(): Builder|EloquentBuilder|Relation
    {
        $query = SpmbPendaftar::with('spmbGelombang');

        if (!empty($this->search)) {
            $s = $this->search;
            $query->where(function ($q) use ($s) {
                $q->where('nama_lengkap_siswa', 'like', "%{$s}%")
                    ->orWhere('nomor_registrasi', 'like', "%{$s}%")
                    ->orWhere('nisn_siswa', 'like', "%{$s}%")
                    ->orWhere('nik_siswa', 'like', "%{$s}%")
                    ->orWhere('asal_sekolah_smp', 'like', "%{$s}%");
            });
        }

        if (!empty($this->gelombangId) && is_numeric($this->gelombangId)) {
            $query->where('spmb_gelombang_id', $this->gelombangId);
        }

        if (!empty($this->status)) {
            $query->where('status_pendaftaran', $this->status);
        }

        return $query->orderBy('spmb_gelombang_id', 'asc')->orderBy('id', 'asc');
    }

    /**
     * Judul Kolom (Header) Excel.
     */
    public function headings(): array
    {
        return [
            'NO',
            'NO. REGISTRASI',
            'GELOMBANG',
            'TAHUN AJARAN',
            'NAMA LENGKAP SISWA',
            'JENIS KELAMIN',
            'NISN',
            'NIK',
            'TEMPAT LAHIR',
            'TANGGAL LAHIR',
            'ASAL SEKOLAH (SMP/MTs)',
            'PILIHAN JURUSAN / KEAHLIAN',
            'ALAMAT DOMISILI',
            'NO. WHATSAPP SISWA',
            'NAMA AYAH',
            'NAMA IBU KANDUNG',
            'NAMA WALI',
            'PEKERJAAN ORANG TUA / WALI',
            'NO. WHATSAPP ORANG TUA / WALI',
            'STATUS PENDAFTARAN',
            'CATATAN VERIFIKASI',
            'TANGGAL DAFTAR',
        ];
    }

    /**
     * Mapping tiap baris data siswa ke baris Excel.
     */
    public function map(mixed $row): array
    {
        $this->rowNumber++;

        $statusLabels = [
            'menunggu_verifikasi' => 'Menunggu Verifikasi',
            'berkas_lengkap'      => 'Berkas Lengkap',
            'perlu_perbaikan'     => 'Perlu Perbaikan',
            'diterima'            => 'Diterima',
            'ditolak'             => 'Ditolak',
        ];

        return [
            $this->rowNumber,
            $row->nomor_registrasi,
            $row->spmbGelombang?->nama_gelombang ?? '-',
            $row->spmbGelombang?->tahun_ajaran ?? '-',
            $row->nama_lengkap_siswa,
            $row->jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan',
            (string) $row->nisn_siswa,
            (string) $row->nik_siswa,
            $row->tempat_lahir_siswa,
            $row->tanggal_lahir_siswa ? $row->tanggal_lahir_siswa->format('d/m/Y') : '-',
            $row->asal_sekolah_smp,
            $row->pilihan_program_keahlian,
            $row->alamat_domisili_siswa,
            (string) $row->nomor_whatsapp_siswa,
            $row->nama_ayah ?: '-',
            $row->nama_ibu_kandung ?: '-',
            $row->nama_wali ?: '-',
            $row->pekerjaan_orang_tua_wali ?: '-',
            (string) $row->nomor_whatsapp_wali,
            $statusLabels[$row->status_pendaftaran] ?? $row->status_pendaftaran,
            $row->catatan_verifikasi ?: '-',
            $row->created_at ? $row->created_at->format('d/m/Y H:i') : '-',
        ];
    }

    /**
     * Pastikan NIK, NISN, dan Nomor HP tetap berformat teks agar angka 0 dan panjang digit tidak terpotong.
     */
    public function bindValue(Cell $cell, mixed $value): bool
    {
        if (is_numeric($value) && (strlen((string) $value) >= 10 || str_starts_with((string) $value, '0'))) {
            $cell->setValueExplicit((string) $value, DataType::TYPE_STRING);
            return true;
        }

        return parent::bindValue($cell, $value);
    }

    /**
     * Styling Header Excel (Background Biru, Huruf Putih Tebal, Rata Tengah).
     */
    public function styles(Worksheet $sheet): ?array
    {
        return [
            1 => [
                'font' => [
                    'bold'  => true,
                    'color' => ['rgb' => 'FFFFFF'],
                    'size'  => 11,
                ],
                'fill' => [
                    'fillType'   => Fill::FILL_SOLID,
                    'startColor' => ['rgb' => '1E40AF'], // Royal Navy Blue
                ],
                'alignment' => [
                    'horizontal' => Alignment::HORIZONTAL_CENTER,
                    'vertical'   => Alignment::VERTICAL_CENTER,
                ],
            ],
        ];
    }
}
