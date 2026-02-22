<?php

namespace App\Traits;

use App\Models\StorageUsage;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

trait TracksStorage
{
    /**
     * Increment storage when a new file is uploaded.
     */
    public function trackFileUpload(int $userId, UploadedFile $file)
    {
        $sizeInMb = $file->getSize() / 1048576;

        $usage = StorageUsage::firstOrCreate(
            ['user_id' => $userId],
            ['used_space_mb' => 0]
        );

        $usage->increment('used_space_mb', $sizeInMb);
    }

    /**
     * Decrement storage when a file is deleted.
     * Pass the relative path (e.g., 'products/filename.jpg')
     */
    public function trackFileDeletion(int $userId, ?string $filePath)
    {
        if (!$filePath) return;

        // Convert full URL back to relative path if necessary
        // asset('storage/products/1.jpg') -> 'products/1.jpg'
        $relativePath = str_replace(asset('storage/'), '', $filePath);

        if (Storage::disk('public')->exists($relativePath)) {
            $sizeInBytes = Storage::disk('public')->size($relativePath);
            $sizeInMb = $sizeInBytes / 1048576;

            StorageUsage::where('user_id', $userId)->decrement('used_space_mb', $sizeInMb);
        }
    }

    /**
     * Update storage usage when replacing an old file with a new one.
     */
    public function trackFileUpdate(int $userId, ?string $oldFilePath, UploadedFile $newFile)
    {
        // 1. Remove old file size from usage
        $this->trackFileDeletion($userId, $oldFilePath);

        // 2. Add new file size to usage
        $this->trackFileUpload($userId, $newFile);
    }
}