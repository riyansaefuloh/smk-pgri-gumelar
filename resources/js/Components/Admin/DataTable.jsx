import React from 'react';
import { IconSearch, IconPlus, IconDatabaseOff } from '@tabler/icons-react';
import { Link } from '@inertiajs/react';

/**
 * Reusable DataTable Component for Admin CMS
 * Disesuaikan dengan token warna semantik INA Digital Design System (IDDS) & Gov Blue #0968F6.
 */
export default function DataTable({
    title,
    description,
    searchValue = '',
    onSearchChange,
    searchPlaceholder = 'Cari data...',
    actionButton, // { label, href, onClick, icon }
    filterSlot,
    columns = [], // [{ header: 'Nama', key: 'name', render: (row) => ... }]
    data = [],
    pagination, // Laravel Pagination Object
    loading = false,
}) {
    return (
        <div className="bg-white rounded-xl border border-[#e5e5e5] shadow-xs overflow-hidden">
            {/* Table Header Controls */}
            {(title || actionButton || onSearchChange || filterSlot) && (
                <div className="p-4 sm:p-5 border-b border-[#e5e5e5] flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        {title && (
                            <h2 className="text-sm sm:text-base font-bold text-[#1f1f1f] font-poppins">
                                {title}
                            </h2>
                        )}
                        {description && (
                            <p className="text-xs text-[#525252] mt-0.5 font-inter">{description}</p>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                        {/* Search Input Bar */}
                        {onSearchChange && (
                            <div className="relative min-w-[200px] sm:w-60">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#737373]">
                                    <IconSearch size={15} />
                                </div>
                                <input
                                    type="text"
                                    value={searchValue}
                                    onChange={(e) => onSearchChange(e.target.value)}
                                    placeholder={searchPlaceholder}
                                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-[#e5e5e5] focus:border-[#0968f6] focus:ring-2 focus:ring-[#0968f6]/15 outline-none transition font-inter text-[#1f1f1f]"
                                />
                            </div>
                        )}

                        {/* Extra Filter Elements */}
                        {filterSlot}

                        {/* Primary Action Button (Tambah Data dengan Gov Blue #0968F6) */}
                        {actionButton && (
                            actionButton.href ? (
                                <Link
                                    href={actionButton.href}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#0968f6] hover:bg-[#0049b8] transition shadow-xs font-inter"
                                >
                                    {actionButton.icon || <IconPlus size={15} />}
                                    <span>{actionButton.label}</span>
                                </Link>
                            ) : (
                                <button
                                    type="button"
                                    onClick={actionButton.onClick}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#0968f6] hover:bg-[#0049b8] transition shadow-xs font-inter"
                                >
                                    {actionButton.icon || <IconPlus size={15} />}
                                    <span>{actionButton.label}</span>
                                </button>
                            )
                        )}
                    </div>
                </div>
            )}

            {/* Table Area */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#525252] border-collapse font-inter">
                    <thead className="bg-[#f8f8f7] text-[#1f1f1f] font-semibold uppercase text-[11px] tracking-wider border-b border-[#e5e5e5]">
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
                    <tbody className="divide-y divide-[#e5e5e5]">
                        {data.length > 0 ? (
                            data.map((row, rIdx) => (
                                <tr
                                    key={row.id || rIdx}
                                    className="h-[48px] hover:bg-[#fafcff] transition-colors"
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
                                    <div className="flex flex-col items-center justify-center text-[#737373] space-y-1.5">
                                        <IconDatabaseOff size={34} stroke={1.5} className="text-[#a3a3a3]" />
                                        <span className="text-xs font-medium text-[#737373]">
                                            Belum ada data yang tersedia
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer */}
            {pagination && pagination.links && (
                <div className="p-3.5 sm:p-4 border-t border-[#e5e5e5] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#737373] font-inter">
                    <div>
                        Menampilkan <span className="font-semibold text-[#1f1f1f]">{pagination.from || 0}</span> sampai{' '}
                        <span className="font-semibold text-[#1f1f1f]">{pagination.to || 0}</span> dari{' '}
                        <span className="font-semibold text-[#1f1f1f]">{pagination.total || 0}</span> total data
                    </div>

                    <div className="flex items-center gap-1 overflow-x-auto">
                        {pagination.links.map((link, lIdx) => {
                            if (!link.url) {
                                return (
                                    <span
                                        key={lIdx}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className="px-2.5 py-1 rounded-md text-[#a3a3a3] text-xs cursor-not-allowed select-none"
                                    />
                                );
                            }
                            return (
                                <Link
                                    key={lIdx}
                                    href={link.url}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                                        link.active
                                            ? 'bg-[#0968f6] text-white font-bold shadow-xs'
                                            : 'text-[#525252] hover:text-[#1f1f1f] hover:bg-[#f2f2f2] border border-[#e5e5e5]'
                                    }`}
                                />
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
