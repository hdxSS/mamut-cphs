/** @type {import('tailwindcss').Config} */
  module.exports = {
    content: [
      './src/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  }

  And update src/app/globals.css:
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  :root {
    --background: #ffffff;
    --foreground: #171717;
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --background: #0a0a0a;
      --foreground: #ededed;
    }
  }

  body {
    background: var(--background);
    color: var(--foreground);
    font-family: Arial, Helvetica, sans-serif;
  }
