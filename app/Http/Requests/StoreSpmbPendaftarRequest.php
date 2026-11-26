<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSpmbPendaftarRequest extends FormRequest
{
    /**
     * Tentukan apakah pengguna memiliki otorisasi untuk membuat permintaan ini.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Dapatkan aturan validasi yang berlaku untuk permintaan ini.
     */
    public function rules(): array
    {
        return [
            'spmb_gelombang_id'         => ['required', 'exists:spmb_gelombangs,id'],
            'nama_lengkap_siswa'        => ['required', 'string', 'max:255'],
            'jenis_kelamin'             => ['required', 'in:L,P'],
            'nisn_siswa'                => ['required', 'string', 'size:10', 'unique:spmb_pendaftars,nisn_siswa'],
            'nik_siswa'                 => ['required', 'string', 'size:16', 'unique:spmb_pendaftars,nik_siswa'],
            'tempat_lahir_siswa'        => ['required', 'string', 'max:100'],
            'tanggal_lahir_siswa'       => ['required', 'date'],
            'asal_sekolah_smp'          => ['required', 'string', 'max:255'],
            'alamat_domisili_siswa'     => ['required', 'string'],
            'nomor_whatsapp_siswa'      => ['required', 'string', 'max:20'],
            
            // Kolom orang tua / wali dibuat nullable (ramah anak yatim/piatu)
            'nama_ayah'                 => ['nullable', 'string', 'max:255'],
            'nama_ibu_kandung'          => ['nullable', 'string', 'max:255'],
            'nama_wali'                 => ['nullable', 'string', 'max:255'],
            'pekerjaan_orang_tua_wali'  => ['required', 'string', 'max:255'],
            'nomor_whatsapp_wali'       => ['required', 'string', 'max:20'],
            
            // Jurusan default TSM
            'pilihan_program_keahlian'  => ['nullable', 'string', 'max:255'],
            
            // Upload berkas dokumen fisik (Maksimal 3MB per file)
            'file_kartu_keluarga'       => ['required', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:3072'],
            'file_akta_kelahiran'       => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:3072'],
            'file_ijazah_atau_skl'      => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:3072'],
        ];
    }

    /**
     * Kustomisasi pesan error validasi dalam Bahasa Indonesia.
     */
    public function messages(): array
    {
        return [
            'spmb_gelombang_id.required'  => 'Pilih gelombang pendaftaran yang aktif.',
            'nama_lengkap_siswa.required' => 'Nama lengkap calon siswa wajib diisi.',
            'jenis_kelamin.required'      => 'Jenis kelamin wajib dipilih (L atau P).',
            'nisn_siswa.required'         => 'NISN wajib diisi.',
            'nisn_siswa.size'             => 'NISN harus tepat berjumlah 10 digit angka.',
            'nisn_siswa.unique'           => 'NISN ini sudah terdaftar sebelumnya.',
            'nik_siswa.required'          => 'NIK wajib diisi.',
            'nik_siswa.size'              => 'NIK harus tepat berjumlah 16 digit angka.',
            'nik_siswa.unique'            => 'NIK ini sudah pernah didaftarkan.',
            'tempat_lahir_siswa.required' => 'Tempat lahir wajib diisi.',
            'tanggal_lahir_siswa.required'=> 'Tanggal lahir wajib diisi.',
            'asal_sekolah_smp.required'   => 'Asal sekolah SMP/MTs wajib diisi.',
            'alamat_domisili_siswa.required' => 'Alamat tempat tinggal lengkap wajib diisi.',
            'nomor_whatsapp_siswa.required'  => 'Nomor WhatsApp siswa wajib diisi.',
            'pekerjaan_orang_tua_wali.required' => 'Pekerjaan orang tua / wali wajib diisi.',
            'nomor_whatsapp_wali.required'   => 'Nomor WhatsApp orang tua / wali wajib diisi.',
            'file_kartu_keluarga.required'=> 'File Kartu Keluarga (KK) wajib diunggah.',
            'file_kartu_keluarga.mimes'   => 'Format file KK harus berupa PDF, JPG, atau PNG.',
            'file_kartu_keluarga.max'     => 'Ukuran file KK maksimal 3 MB.',
            'file_akta_kelahiran.mimes'   => 'Format file Akta harus berupa PDF, JPG, atau PNG.',
            'file_akta_kelahiran.max'     => 'Ukuran file Akta maksimal 3 MB.',
            'file_ijazah_atau_skl.mimes'  => 'Format file Ijazah/SKL harus berupa PDF, JPG, atau PNG.',
            'file_ijazah_atau_skl.max'    => 'Ukuran file Ijazah/SKL maksimal 3 MB.',
        ];
    }
}
