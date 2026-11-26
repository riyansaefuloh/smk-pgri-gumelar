import React, { useEffect, useState } from 'react';
import {
    IconChevronLeft,
    IconChevronRight,
    IconChevronsLeft,
    IconChevronsRight,
} from '@tabler/icons-react';

/**
 * Komponen pagination Tailwind murni mengikuti standar CMS IDDS & modul Karya & Inovasi.
 */
export default function TailwindPagination({
    currentPage = 1,
    totalPages = 1,
    pageSize = 10,
    pageSizeOptions = [10, 20, 50, 100],
    onPageChange,
    onPageSizeChange,
    disabled = false,
}) {
    const [pageInput, setPageInput] = useState(String(currentPage));

    useEffect(() => {
        setPageInput(String(currentPage));
    }, [currentPage]);

    if (totalPages <= 0) {
        return null;
    }

    const commitPageInput = () => {
        const parsed = parseInt(pageInput.replace(/\D/g, ''), 10);
        const clamped = Number.isNaN(parsed)
            ? currentPage
            : Math.min(totalPages, Math.max(1, parsed));
        setPageInput(String(clamped));
        if (clamped !== currentPage && !disabled) {
            onPageChange?.(clamped);
        }
    };

    const startPage =
        currentPage === 1
            ? 1
            : currentPage === totalPages
                ? Math.max(1, totalPages - 2)
                : currentPage - 1;
    const endPage =
        currentPage === 1
            ? Math.min(3, totalPages)
            : currentPage === totalPages
                ? totalPages
                : Math.min(totalPages, currentPage + 1);

    const visiblePages = [];
    for (let p = startPage; p <= endPage; p += 1) {
        visiblePages.push(p);
    }

    const navBtnClass = (isDisabled) =>
        `w-8 h-8 rounded-md inline-flex items-center justify-center transition ${isDisabled
            ? 'text-content-disabled opacity-50 cursor-not-allowed'
            : 'text-content-secondary hover:bg-surface-secondary hover:text-content-primary focus:outline-none focus:ring-2 focus:ring-brand-500/20'
        }`;

    return (
        <nav
            aria-label="Navigasi halaman"
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm text-content-secondary"
        >
            <div className="flex items-center gap-2.5">
                <span className="font-medium text-content-primary">Baris per halaman</span>
                <select
                    value={pageSize}
                    disabled={disabled}
                    aria-label="Baris per halaman"
                    onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
                    style={{ backgroundImage: 'none' }}
                    className="appearance-none bg-none min-w-[44px] h-8 px-2.5 text-center text-sm font-medium rounded-md border border-stroke-input bg-surface-primary text-content-primary shadow-xs cursor-pointer transition focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 disabled:opacity-50"
                >
                    {pageSizeOptions.map((opt) => (
                        <option key={opt} value={opt}>
                            {opt}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 sm:gap-4">
                <div className="flex items-center gap-2">
                    <span>Halaman</span>
                    <input
                        type="text"
                        inputMode="numeric"
                        aria-label="Halaman saat ini"
                        disabled={disabled}
                        value={pageInput}
                        onChange={(e) => setPageInput(e.target.value.replace(/\D/g, ''))}
                        onBlur={commitPageInput}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                commitPageInput();
                            }
                        }}
                        className="w-11 h-8 px-1.5 text-center text-sm font-medium rounded-md border border-stroke-input bg-surface-primary text-content-primary shadow-xs transition focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 disabled:opacity-50"
                    />
                    <span>dari {totalPages}</span>
                </div>

                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        disabled={disabled || currentPage === 1}
                        onClick={() => onPageChange?.(1)}
                        aria-label="Halaman pertama"
                        className={navBtnClass(disabled || currentPage === 1)}
                    >
                        <IconChevronsLeft size={16} />
                    </button>
                    <button
                        type="button"
                        disabled={disabled || currentPage === 1}
                        onClick={() => onPageChange?.(currentPage - 1)}
                        aria-label="Halaman sebelumnya"
                        className={navBtnClass(disabled || currentPage === 1)}
                    >
                        <IconChevronLeft size={16} />
                    </button>

                    {visiblePages.map((page) => {
                        const isActive = page === currentPage;
                        return (
                            <button
                                key={page}
                                type="button"
                                disabled={disabled}
                                onClick={() => page !== currentPage && onPageChange?.(page)}
                                aria-current={isActive ? 'page' : undefined}
                                className={`min-w-[32px] h-8 px-2 rounded-md text-sm transition inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${isActive
                                    ? 'text-brand-600 font-bold'
                                    : 'text-content-secondary hover:bg-surface-secondary hover:text-content-primary font-medium'
                                }`}
                            >
                                {page}
                            </button>
                        );
                    })}

                    <button
                        type="button"
                        disabled={disabled || currentPage === totalPages}
                        onClick={() => onPageChange?.(currentPage + 1)}
                        aria-label="Halaman berikutnya"
                        className={navBtnClass(disabled || currentPage === totalPages)}
                    >
                        <IconChevronRight size={16} />
                    </button>
                    <button
                        type="button"
                        disabled={disabled || currentPage === totalPages}
                        onClick={() => onPageChange?.(totalPages)}
                        aria-label="Halaman terakhir"
                        className={navBtnClass(disabled || currentPage === totalPages)}
                    >
                        <IconChevronsRight size={16} />
                    </button>
                </div>
            </div>
        </nav>
    );
}
