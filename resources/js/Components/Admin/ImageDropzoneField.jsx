import React, { useEffect, useRef, useState } from 'react';
import { IconUpload } from '@tabler/icons-react';
import CmsButton from '@/Components/Admin/CmsButton';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_BYTES = 3 * 1024 * 1024;

/**
 * Komponen reusable dropzone upload gambar mengikuti standar CMS IDDS & modul TEFA.
 */
export default function ImageDropzoneField({
    id,
    label,
    helperText,
    aspectClass = 'aspect-video',
    previewMaxWidthClass = 'max-w-[320px]',
    previewUrl,
    selectedFile,
    serverError,
    onFileSelect,
    onClearFile,
}) {
    const inputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [clientError, setClientError] = useState('');
    const [imgFailed, setImgFailed] = useState(false);

    useEffect(() => {
        setImgFailed(false);
    }, [previewUrl]);

    const validateAndSelect = (file) => {
        if (!file) {
            return;
        }
        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            setClientError('Format gambar harus JPG, PNG, atau WebP.');
            return;
        }
        if (file.size > MAX_IMAGE_BYTES) {
            setClientError('Ukuran gambar maksimal 3 MB.');
            return;
        }
        setClientError('');
        onFileSelect(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer?.files?.[0];
        validateAndSelect(file);
    };

    const combinedError = clientError || serverError;
    const hasPreview = Boolean(previewUrl) && !imgFailed;

    return (
        <div className="flex flex-col h-full">
            <span className="block text-sm font-medium text-content-primary mb-1.5">
                {label}
            </span>

            <div
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`flex-1 p-5 rounded-lg border border-dashed flex flex-col justify-center items-center text-center transition-colors ${
                    isDragging
                        ? 'border-brand-500 bg-brand-50'
                        : combinedError
                            ? 'border-negative-600 bg-surface-primary'
                            : 'border-stroke-input bg-surface-primary hover:border-brand-300'
                }`}
            >
                {hasPreview ? (
                    <div className="w-full space-y-3">
                        <div className={`w-full ${previewMaxWidthClass} mx-auto ${aspectClass} rounded-md border border-stroke-card bg-surface-secondary overflow-hidden`}>
                            <img
                                src={previewUrl}
                                alt={label}
                                className="w-full h-full object-cover"
                                onError={() => setImgFailed(true)}
                            />
                        </div>

                        <p className="text-xs text-content-secondary">
                            Unggah atau seret file baru ke kotak ini untuk mengganti.
                        </p>

                        <div className="space-y-2">
                            <CmsButton
                                hierarchy="secondary"
                                size="md"
                                prefixIcon={<IconUpload size={16} className="text-brand-500" />}
                                onClick={() => inputRef.current?.click()}
                                className="w-full"
                            >
                                Ganti File
                            </CmsButton>

                            {selectedFile && (
                                <CmsButton
                                    hierarchy="tertiary"
                                    size="sm"
                                    onClick={() => {
                                        setClientError('');
                                        onClearFile();
                                    }}
                                    className="w-full"
                                >
                                    Batal Ganti
                                </CmsButton>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="w-full space-y-3">
                        <div className="w-10 h-10 mx-auto rounded-lg bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-500">
                            <IconUpload size={18} stroke={1.8} />
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm font-bold text-content-primary">
                                Unggah File
                            </p>
                            <p className="text-xs text-content-secondary">
                                Unggah atau seret dan lepas ke dalam kotak ini.
                            </p>
                        </div>

                        <CmsButton
                            hierarchy="primary"
                            size="md"
                            onClick={() => inputRef.current?.click()}
                            className="w-full"
                        >
                            Pilih File
                        </CmsButton>
                    </div>
                )}

                <input
                    ref={inputRef}
                    id={id}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => {
                        validateAndSelect(e.target.files?.[0]);
                        e.target.value = '';
                    }}
                />

                {helperText && (
                    <p className="mt-3 text-xs text-content-tertiary">{helperText}</p>
                )}

                {selectedFile && (
                    <p className="mt-1.5 text-xs font-medium text-brand-600 truncate max-w-full">
                        Dipilih: {selectedFile.name}
                    </p>
                )}

                {combinedError && (
                    <p className="mt-1.5 text-xs font-medium text-content-negative">
                        {combinedError}
                    </p>
                )}
            </div>
        </div>
    );
}
