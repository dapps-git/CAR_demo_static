/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#06111D',
          900: '#0B1F33', // Primary Navy Sidebar
          850: '#10273F',
          800: '#163352',
          700: '#22486F',
        },
        primary: {
          DEFAULT: '#1677C8', // Premium Blue
          hover: '#1263A8',
          light: '#EAF4FC', // Soft Blue
        },
        ink: {
          main: '#172033', // Main Text / Headings
          muted: '#667085', // Secondary Text
        },
        status: {
          success: '#16A36A',
          warning: '#F59E0B',
          error: '#DC3545',
        },
        canvas: '#F5F7FA', // Main Background
        border: '#E2E8F0', // Border Light Gray
      },
      fontFamily: {
        sans: [
          'Manrope',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(16, 24, 40, 0.06), 0 1px 2px 0 rgba(16, 24, 40, 0.04)',
        'card-hover': '0 4px 12px 0 rgba(16, 24, 40, 0.08)',
        'glow-primary': '0 2px 10px 0 rgba(22, 119, 200, 0.25)',
      },
    },
  },
  plugins: [],
};
