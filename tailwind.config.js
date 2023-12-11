/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    colors: {
      'geo': {
        50: 'var(--pozadi)',
        100: 'var(--tmavsi)',
        200: 'var(--tmavy)',
        300: 'var(--normal)',
        400: 'var(--svetly)',
        500: 'var(--svetlejsi)',
        600: 'var(--vyrazny)',
      },
      'ext': {
        fia: 'var(--fialova)'
      },
      black: '#000',
      white: '#fff',
      inherit: 'inherit',
      transparent: '#00000000',
      },
      dropShadow: {
          sharp: "4px 4px 0px var(--tmavy)"
      }
    },
    plugins: [],
  }

