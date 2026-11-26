<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTefaBengkelRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'judul_header'                       => ['required', 'string', 'max:200'],
            'subjudul_header'                    => ['nullable', 'string', 'max:1000'],
            'nama_unit_bengkel'                  => ['required', 'string', 'max:200'],
            'deskripsi_bengkel'                  => ['required', 'string', 'max:20000'],
            'jadwal_operasional'                 => ['required', 'string', 'max:200'],
            'foto_bengkel'                       => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:3072'],
            'daftar_layanan'                     => ['nullable', 'array', 'max:20'],
            'daftar_layanan.*.nama_layanan'      => ['required', 'string', 'max:100'],
            'daftar_layanan.*.deskripsi_layanan' => ['nullable', 'string', 'max:500'],
        ];
    }

    /**
     * Pesan validasi khusus bahasa Indonesia.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'judul_header.required'                  => 'Judul header halaman TEFA wajib diisi.',
            'judul_header.max'                       => 'Judul header maksimal 200 karakter.',
            'subjudul_header.max'                    => 'Subjudul header maksimal 1.000 karakter.',
            'nama_unit_bengkel.required'             => 'Nama unit bengkel wajib diisi.',
            'nama_unit_bengkel.max'                  => 'Nama unit bengkel maksimal 200 karakter.',
            'deskripsi_bengkel.required'             => 'Deskripsi bengkel wajib diisi.',
            'deskripsi_bengkel.max'                  => 'Deskripsi bengkel maksimal 20.000 karakter.',
            'jadwal_operasional.required'            => 'Jadwal operasional wajib diisi.',
            'jadwal_operasional.max'                 => 'Jadwal operasional maksimal 200 karakter.',
            'foto_bengkel.image'                     => 'File foto bengkel harus berupa gambar.',
            'foto_bengkel.mimes'                     => 'Format foto bengkel harus jpg, jpeg, png, atau webp.',
            'foto_bengkel.max'                       => 'Ukuran foto bengkel maksimal 3 MB.',
            'daftar_layanan.array'                   => 'Format daftar layanan tidak valid.',
            'daftar_layanan.max'                     => 'Daftar layanan maksimal 20 item.',
            'daftar_layanan.*.nama_layanan.required' => 'Nama layanan pada setiap item wajib diisi.',
            'daftar_layanan.*.nama_layanan.max'      => 'Nama layanan maksimal 100 karakter.',
            'daftar_layanan.*.deskripsi_layanan.max' => 'Deskripsi layanan maksimal 500 karakter.',
        ];
    }
}
