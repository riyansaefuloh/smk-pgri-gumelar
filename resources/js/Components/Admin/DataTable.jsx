import React from 'react';
import { Button } from '@idds/react';
import { IconSearch, IconDatabaseOff, IconPlus, IconLoader2 } from '@tabler/icons-react';
import { Link } from '@inertiajs/react';

/**
 * Reusable DataTable Component for Admin CMS
 * Token warna semantik IDDS & Gov Blue #0968F6.
 */
export default function DataTable({
    title,
    description,
    searchValue = '',
    onSearchChange,
    searchPlaceholder = 'Cari data...',
    actionButton, // { label, href, onClick, icon }
    filterSlot,
    columns = [], // [{ header, key, render, className }]
    data = [],
    pagination, // Laravel Pagination Object
    loading = false,
    emptyTitle,
    emptyDescription,
    emptyMessage = 'Belum ada data yang tersedia',
    emptyAction,
}) {
    // Format label pagination HTML entitas Laravel menjadi plain text aman (tanpa dangerouslySetInnerHTML)
    const formatPaginationLabel = (rawLabel) => {
        if (!rawLabel) {
            return '';
        }
        if (/Previous/i.test(rawLabel)) {
            return '‹ Sebelumnya';
        }
        if (/Next/i.test(rawLabel)) {
            return 'Selanjutnya ›';
        }
        return rawLabel
            .replace(/&laquo;/g, '‹')
            .replace(/&raquo;/g, '›')
            .trim();
    };

    return (
        <div className="bg-surface-primary rounded-xl border border-stroke-card shadow-xs overflow-hidden">
            {/* Table Header Controls */}
            {(title || actionButton || onSearchChange || filterSlot) && (
                <div className="p-4 sm:p-5 border-b border-stroke-card flex flex-col md:flex-row md:items-center justify-between gap-4">
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

                    <div className="flex flex-wrap items-center gap-2">
                        {/* Search Input — 32px di mobile, 40px di desktop (selaras dengan SelectDropdown sm & Button md) */}
                        {onSearchChange && (
                            <div className="relative w-full sm:w-60">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-content-tertiary">
                                    <IconSearch size={15} />
                                </div>
                                <input
                                    type="text"
                                    value={searchValue}
                                    onChange={(e) => onSearchChange(e.target.value)}
                                    placeholder={searchPlaceholder}
                                    aria-label={searchPlaceholder}
                                    className="w-full h-8 sm:h-10 pl-8 pr-3 text-xs sm:text-sm rounded-md border border-stroke-input shadow-xs focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 outline-none transition text-content-primary bg-surface-primary"
                                />
                            </div>
                        )}

                        {/* Extra Filter Elements */}
                        {filterSlot}

                        {/* Primary Action Button — IDDS Button md (32px mobile, 40px desktop) */}
                        {actionButton && (
                            actionButton.href ? (
                                <Link href={actionButton.href}>
                                    <Button
                                        type="button"
                                        hierarchy="primary"
                                        size="md"
                                        prefixIcon={actionButton.icon || <IconPlus size={15} />}
                                    >
                                        {actionButton.label}
                                    </Button>
                                </Link>
                            ) : (
                                <Button
                                    type="button"
                                    hierarchy="primary"
                                    size="md"
                                    prefixIcon={actionButton.icon || <IconPlus size={15} />}
                                    onClick={actionButton.onClick}
                                >
                                    {actionButton.label}
                                </Button>
                            )
                        )}
                    </div>
                </div>
            )}

            {/* Table Area */}
            <div className="overflow-x-auto relative">
                {loading && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface-primary/70 backdrop-blur-[1px]">
                        <div className="flex items-center gap-2 text-sm text-content-secondary">
                            <IconLoader2 size={18} className="animate-spin text-brand-500" />
                            <span>Memuat data...</span>
                        </div>
                    </div>
                )}
                <table className="w-full text-left text-xs text-content-secondary border-collapse">
                    <thead className="bg-surface-secondary text-content-primary font-semibold uppercase text-xs tracking-wider border-b border-stroke-card">
                        <tr>
                            {columns.map((col, cIdx) => (
                                <th
                                    key={cIdx}
                                    className={`px-4 py-3 ${col.className || ''}`}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stroke-card">
                        {data.length > 0 ? (
                            data.map((row, rIdx) => (
                                <tr
                                    key={row.id || rIdx}
                                    className="h-[48px] hover:bg-brand-50 transition-colors"
                                >
                                    {columns.map((col, cIdx) => (
                                        <td
                                            key={cIdx}
                                            className={`px-4 py-2.5 align-middle ${col.className || ''}`}
                                        >
                                            {col.render ? col.render(row, rIdx) : row[col.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="py-12 text-center">
                                    <div className="flex flex-col items-center justify-center text-center px-4 space-y-2.5 max-w-md mx-auto">
                                        <div className="w-11 h-11 rounded-full bg-surface-secondary border border-stroke-card flex items-center justify-center text-content-disabled">
                                            <IconDatabaseOff size={22} stroke={1.6} />
                                        </div>
                                        {emptyTitle && (
                                            <h3 className="text-sm font-semibold text-content-primary">
                                                {emptyTitle}
                                            </h3>
                                        )}
                                        <p className="text-xs text-content-secondary leading-relaxed">
                                            {emptyDescription || emptyMessage}
                                        </p>
                                        {emptyAction && <div className="pt-1">{emptyAction}</div>}
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer */}
            {pagination && pagination.links && (
                <div className="p-3.5 sm:p-4 border-t border-stroke-card bg-surface-primary flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-content-tertiary">
                    <div>
                        Menampilkan{' '}
                        <span className="font-semibold text-content-primary">{pagination.from || 0}</span>{' '}
                        sampai{' '}
                        <span className="font-semibold text-content-primary">{pagination.to || 0}</span>{' '}
                        dari{' '}
                        <span className="font-semibold text-content-primary">{pagination.total || 0}</span>{' '}
                        total data
                    </div>

                    <div className="flex items-center gap-1 overflow-x-auto">
                        {pagination.links.map((link, lIdx) => {
                            const label = formatPaginationLabel(link.label);
                            if (!link.url) {
                                return (
                                    <span
                                        key={lIdx}
                                        className="px-2.5 py-1 rounded-md text-content-disabled text-xs cursor-not-allowed select-none"
                                    >
                                        {label}
                                    </span>
                                );
                            }
                            return (
                                <Link
                                    key={lIdx}
                                    href={link.url}
                                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                                        link.active
                                            ? 'bg-brand-500 text-white font-bold shadow-xs'
                                            : 'text-content-secondary hover:text-content-primary hover:bg-surface-tertiary border border-stroke-card'
                                    }`}
                                >
                                    {label}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
