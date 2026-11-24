import React from 'react';
import { Link } from '@inertiajs/react';
import { IconArrowLeft, IconCheck } from '@tabler/icons-react';

/**
 * Reusable Form Card Component for Admin CMS
 * Disesuaikan dengan token warna semantik INA Digital Design System (IDDS) & Gov Blue #0968F6.
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
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-xs overflow-hidden">
            {/* Header Form */}
            {(title || backUrl) && (
                <div className="p-4 sm:p-5 border-b border-[#e2e8f0] flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                        {backUrl && (
                            <Link
                                href={backUrl}
                                className="p-1.5 rounded-lg text-[#525252] hover:text-[#1f1f1f] hover:bg-[#f2f2f2] transition"
                                title="Kembali"
                            >
                                <IconArrowLeft size={17} />
                            </Link>
                        )}
                        <div>
                            {title && (
                                <h2 className="text-sm sm:text-base font-bold text-[#1f1f1f]">
                                    {title}
                                </h2>
                            )}
                            {description && (
                                <p className="text-xs text-[#525252] mt-0.5">{description}</p>
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
                <div className="p-5 sm:p-6 space-y-5 font-inter">
                    {children}
                </div>

                {/* Bottom Actions Bar */}
                <div className="p-4 sm:p-5 border-t border-[#e2e8f0] bg-[#f2f4f7]/60 flex items-center justify-end gap-2.5 font-inter">
                    {backUrl && (
                        <Link
                            href={backUrl}
                            className="px-3.5 py-2 rounded-lg text-xs font-semibold text-[#525252] hover:text-[#1f1f1f] hover:bg-[#f2f2f2] border border-[#e2e8f0] transition"
                        >
                            {cancelLabel}
                        </Link>
                    )}

                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#0968f6] hover:bg-[#0049b8] disabled:opacity-50 disabled:cursor-not-allowed transition shadow-xs"
                    >
                        {processing ? (
                            <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <IconCheck size={15} />
                        )}
                        <span>{processing ? 'Menyimpan...' : submitLabel}</span>
                    </button>
                </div>
            </form>
        </div>
    );
}
