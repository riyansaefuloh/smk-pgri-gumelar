import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            // Standar IDDS: Inter sebagai font tunggal ekosistem
            fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
                inter: ['Inter', 'sans-serif'],
            },
            colors: {
                // Token Gov Blue Resmi IDDS (Primary Brand Color)
                brand: {
                    50: '#fafcff',
                    100: '#ecf3fe',
                    200: '#dceafe',
                    300: '#84b4fb',
                    400: '#4d93fc',
                    500: '#0968f6', // Gov Blue IDDS
                    600: '#0049b8', // Hover / Darker Gov Blue
                    700: '#002a69',
                    800: '#0e192a',
                    900: '#070e17',
                    DEFAULT: '#0968f6',
                },
                // Token Semantik Konten (Teks & Ikon)
                content: {
                    primary: '#1f1f1f',   // Neutral-800: Teks Utama
                    secondary: '#525252', // Neutral-600: Teks Deskripsi
                    tertiary: '#737373',  // Neutral-500: Microcopy & Label
                    disabled: '#a3a3a3',  // Neutral-400: Placeholder / Nonaktif
                    guide: '#0968f6',     // Gov Blue Panduan
                    positive: '#288034',  // Hijau Sukses
                    negative: '#d50b0b',  // Merah Galat
                    warning: '#855f00',   // Jingga Peringatan
                },
                // Token Semantik Latar Belakang (Surface / Background)
                surface: {
                    primary: '#ffffff',   // Neutral-25: Kartu & Modal
                    secondary: '#f8f8f7', // Neutral-50: Kanvas Layar
                    tertiary: '#f2f2f2',  // Neutral-100: Hover Elemen
                },
                // Token Semantik Garis Batas (Stroke / Border)
                stroke: {
                    primary: '#e5e5e5',   // Neutral-200: Border Standar
                    secondary: '#a3a3a3', // Neutral-400: Border Fokus
                    tertiary: '#1f1f1f',  // Neutral-800: Border Tegas
                },
                // Token Sentimen Status Sistem
                positive: {
                    50: '#fafffa',
                    100: '#edfded',
                    500: '#3cc14e',
                    600: '#288034',
                },
                negative: {
                    50: '#fffafa',
                    100: '#fdeded',
                    500: '#f02d2d',
                    600: '#d50b0b',
                },
                warning: {
                    50: '#fffefa',
                    100: '#fff9eb',
                    500: '#eebb04',
                    600: '#855f00',
                },
                guide: {
                    50: '#fafcff',
                    100: '#ecf3fe',
                    500: '#0968f6',
                    600: '#0049b8',
                },
                admin: {
                    primary: '#0968f6',
                    hover: '#0049b8',
                    active: '#002a69',
                    light: '#ecf3fe',
                    bg: '#f8f8f7',
                    sidebar: '#ffffff',
                    border: '#e5e5e5',
                    borderLight: '#e5e5e5',
                    textDark: '#1f1f1f',
                    textMuted: '#525252',
                },
            },
            boxShadow: {
                admin: '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.02)',
                'admin-card': '0 2px 8px 0 rgba(0, 0, 0, 0.03)',
            },
        },
    },

    plugins: [forms],
};
