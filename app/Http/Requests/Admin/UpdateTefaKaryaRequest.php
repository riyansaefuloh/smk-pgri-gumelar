<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTefaKaryaRequest extends FormRequest
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
            'kategori_karya_id' => ['required', 'integer', 'exists:kategori_karyas,id'],
            'judul_karya'       => ['required', 'string', 'max:200'],
            'foto_karya'        => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:3072'],
            'deskripsi_karya'   => ['required', 'string', 'max:20000'],
            'status_publikasi'  => ['sometimes', 'boolean'],
            'urutan_tampil'     => ['nullable', 'integer', 'min:0', 'max:100000'],
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
            'kategori_karya_id.required' => 'Kategori karya wajib dipilih.',
            'kategori_karya_id.exists'   => 'Kategori karya yang dipilih tidak ditemukan.',
            'judul_karya.required'       => 'Judul karya wajib diisi.',
            'judul_karya.max'            => 'Judul karya maksimal 200 karakter.',
            'foto_karya.image'           => 'File foto karya harus berupa gambar.',
            'foto_karya.mimes'           => 'Format foto karya harus jpg, jpeg, png, atau webp.',
            'foto_karya.max'             => 'Ukuran foto karya maksimal 3 MB.',
            'deskripsi_karya.required'   => 'Deskripsi karya wajib diisi.',
            'deskripsi_karya.max'        => 'Deskripsi karya maksimal 20.000 karakter.',
            'urutan_tampil.integer'      => 'Urutan tampil harus berupa angka bulat.',
            'urutan_tampil.min'          => 'Urutan tampil minimal bernilai 0.',
            'urutan_tampil.max'          => 'Urutan tampil maksimal bernilai 100.000.',
        ];
    }
}
