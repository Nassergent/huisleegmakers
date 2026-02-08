/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  safelist: [
    { pattern: /bg-brand-.*/ },
    { pattern: /text-brand-.*/ },
    { pattern: /border-brand-.*/ },
    { pattern: /from-brand-.*/ },
    { pattern: /via-brand-.*/ },
    { pattern: /to-brand-.*/ },
    { pattern: /ring-brand-.*/ },
    { pattern: /shadow-brand-.*/ },
    { pattern: /hover:bg-brand-.*/ },
    { pattern: /hover:text-brand-.*/ },
    { pattern: /hover:border-brand-.*/ },
    { pattern: /focus:ring-brand-.*/ },
    { pattern: /group-hover:bg-brand-.*/ },
    { pattern: /group-hover:text-brand-.*/ },
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#eff4ff',
          100: '#dbe6fe',
          200: '#bfd3fe',
          300: '#93b4fd',
          400: '#6090fa',
          500: '#3b6ff6',
          600: '#1e40af',
          700: '#1a3799',
          800: '#1b2f80',
          900: '#1c2b67',
          950: '#141c3f',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
