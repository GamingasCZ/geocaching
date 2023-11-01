/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'geo': {
          50: 'var(--pozadi)',
          100: 'var(--tmavsi)',
          200: 'var(--tmavy)',
          300: 'var(--normal)',
          400: 'var(--svetly)',
          500: 'var(--svetlejsi)',
        }
      }
    },
  },
  plugins: [],
}

