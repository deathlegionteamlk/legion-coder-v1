/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gh-bg': '#0d1117',
        'gh-bg-secondary': '#161b22',
        'gh-bg-tertiary': '#21262d',
        'gh-text': '#c9d1d9',
        'gh-text-secondary': '#8b949e',
        'gh-border': '#30363d',
        'gh-accent': '#58a6ff',
        'gh-success': '#238636',
        'gh-warning': '#f0883e',
        'gh-error': '#f85149',
      },
      fontFamily: {
        mono: ['Consolas', 'Monaco', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
}
