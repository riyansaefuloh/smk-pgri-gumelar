import React from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@idds/react';
import { IconArrowLeft, IconCheck } from '@tabler/icons-react';

/**
 * Reusable Form Card Component for Admin CMS
 * Token warna semantik IDDS & Gov Blue #0968F6.
 */
export default function FormCard({
    title,
    description,
    backUrl,
    onSubmit,
    processing = false,
    submitLabel = 'Simpan Perubahan',
    cancelLabel = 'Batal',
    children,
    extraActions,
}) {
    return (
        <div className="bg-surface-primary rounded-xl border border-stroke-card shadow-xs overflow-hidden">
            {/* Header Form */}
            {(title || backUrl) && (
                <div className="p-4 sm:p-5 border-b border-stroke-card flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                        {backUrl && (
                            <Link
                                href={backUrl}
                                className="p-1.5 rounded-md text-content-secondary hover:text-content-primary hover:bg-surface-tertiary transition"
                                title="Kembali"
                            >
                                <IconArrowLeft size={17} />
                            </Link>
                        )}
                        <div>
                            {title && (
                                <h2 className="text-sm sm:text-base font-bold text-content-primary">
                                    {title}
                                </h2>
                            )}
                            {description && (
                                <p className="text-xs text-content-secondary mt-0.5">{description}</p>
                            )}
                        </div>
                    </div>

                    {extraActions && (
                        <div className="flex items-center gap-2">
                            {extraActions}
                        </div>
                    )}
                </div>
            )}

            {/* Form Content */}
            <form onSubmit={onSubmit}>
                <div className="p-5 sm:p-6 space-y-5">
                    {children}
                </div>

                {/* Bottom Actions Bar — IDDS Button components */}
                <div className="p-4 sm:p-5 border-t border-stroke-card bg-surface-secondary/60 flex items-center justify-end gap-2.5">
                    {backUrl && (
                        <Link href={backUrl}>
                            <Button type="button" hierarchy="secondary" size="sm">
                                {cancelLabel}
                            </Button>
                        </Link>
                    )}

                    <Button
                        type="submit"
                        hierarchy="primary"
                        size="sm"
                        disabled={processing}
                        prefixIcon={
                            processing ? (
                                <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <IconCheck size={15} />
                            )
                        }
                    >
                        {processing ? 'Menyimpan...' : submitLabel}
                    </Button>
                </div>
            </form>
        </div>
    );
}
