import React from 'react';

const TONE_CLASSES = {
    default: {
        primary: 'bg-brand-500 text-white hover:bg-brand-600 focus-visible:ring-brand-500/30 font-semibold shadow-xs',
        secondary: 'border border-stroke-input bg-surface-primary text-content-primary hover:bg-surface-secondary hover:border-brand-300 focus-visible:ring-brand-500/20 font-medium shadow-xs',
        tertiary: 'bg-transparent text-content-secondary hover:bg-surface-tertiary hover:text-content-primary focus-visible:ring-brand-500/20 font-medium',
        link: 'bg-transparent text-brand-500 hover:text-brand-600 hover:underline focus-visible:ring-brand-500/20 font-semibold',
    },
    brand: {
        primary: 'bg-brand-500 text-white hover:bg-brand-600 focus-visible:ring-brand-500/30 font-semibold shadow-xs',
        secondary: 'border border-brand-200 bg-surface-primary text-brand-600 hover:bg-brand-500/10 focus-visible:ring-brand-500/20 font-medium shadow-xs',
        tertiary: 'bg-transparent text-brand-600 hover:bg-brand-500/10 hover:text-brand-600 focus-visible:ring-brand-500/20 font-medium',
        link: 'bg-transparent text-brand-500 hover:text-brand-600 hover:underline focus-visible:ring-brand-500/20 font-semibold',
    },
    warning: {
        primary: 'bg-warning-600 text-white hover:bg-warning-500 focus-visible:ring-warning-500/30 font-semibold shadow-xs',
        secondary: 'border border-warning-500/40 bg-surface-primary text-content-warning hover:bg-warning-100 focus-visible:ring-warning-500/20 font-medium shadow-xs',
        tertiary: 'bg-transparent text-content-warning hover:bg-warning-100 hover:text-content-warning focus-visible:ring-warning-500/20 font-medium',
        link: 'bg-transparent text-content-warning hover:underline focus-visible:ring-warning-500/20 font-semibold',
    },
    danger: {
        primary: 'bg-negative-600 text-white hover:bg-negative-500 focus-visible:ring-negative-500/30 font-semibold shadow-xs',
        secondary: 'border border-negative-500/40 bg-surface-primary text-content-negative hover:bg-negative-100 focus-visible:ring-negative-500/20 font-medium shadow-xs',
        tertiary: 'bg-transparent text-content-negative hover:bg-negative-100 hover:text-content-negative focus-visible:ring-negative-500/20 font-medium',
        link: 'bg-transparent text-content-negative hover:underline focus-visible:ring-negative-500/20 font-semibold',
    },
};

const SIZE_CLASSES = {
    sm: 'h-8 px-3 text-xs gap-1.5',
    md: 'h-10 px-4 text-sm gap-2',
    'icon-sm': 'w-8 h-8 p-0 text-xs',
};

/**
 * Tombol standar modul TEFA mengikuti skala (32px/40px), hierarki, dan token warna IDDS.
 */
export default function CmsButton({
    type = 'button',
    hierarchy = 'primary',
    tone = 'default',
    size = 'md',
    prefixIcon,
    suffixIcon,
    loading = false,
    disabled = false,
    className = '',
    children,
    ...rest
}) {
    const palette = TONE_CLASSES[tone] || TONE_CLASSES.default;
    const hierarchyCls = palette[hierarchy] || palette.primary;
    const sizeCls = hierarchy === 'link' ? 'text-xs gap-1' : (SIZE_CLASSES[size] || SIZE_CLASSES.md);

    return (
        <button
            type={type}
            disabled={disabled || loading}
            className={`inline-flex items-center justify-center rounded-md transition select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:opacity-40 disabled:pointer-events-none ${hierarchyCls} ${sizeCls} ${className}`}
            {...rest}
        >
            {loading ? (
                <span
                    className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin shrink-0"
                    aria-hidden="true"
                />
            ) : (
                prefixIcon && <span className="inline-flex shrink-0">{prefixIcon}</span>
            )}
            {children && <span>{children}</span>}
            {!loading && suffixIcon && <span className="inline-flex shrink-0">{suffixIcon}</span>}
        </button>
    );
}
