<?php

namespace App\Http\Controllers\Admin\Concerns;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

trait ManagesPublicMedia
{
    /**
     * Simpan file gambar ke disk public dan kembalikan path URL /storage/...
     */
    protected function storePublicPhoto(UploadedFile $file, string $directory): string
    {
        $path = $file->store($directory, 'public');

        return '/storage/' . $path;
    }

    /**
     * Ganti foto lama dengan foto baru bila ada file diunggah, atau pertahankan yang lama.
     */
    protected function replacePublicPhoto(
        ?UploadedFile $newFile,
        string $directory,
        ?string $oldPath,
        string $fallback = ''
    ): string {
        if (! $newFile) {
            return $oldPath ?: $fallback;
        }

        $newPath = $this->storePublicPhoto($newFile, $directory);
        $this->deletePublicPhoto($oldPath);

        return $newPath;
    }

    /**
     * Hapus file media di disk public jika path berasal dari /storage/...
     */
    protected function deletePublicPhoto(?string $photoPath): void
    {
        if (! $photoPath || ! str_starts_with($photoPath, '/storage/')) {
            return;
        }

        $relativePath = substr($photoPath, strlen('/storage/'));
        if ($relativePath !== '' && Storage::disk('public')->exists($relativePath)) {
            Storage::disk('public')->delete($relativePath);
        }
    }
}
