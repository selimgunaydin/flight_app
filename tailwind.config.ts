import type { Config } from "tailwindcss";

export default {
  content: [ 
    "./app/**/*.{js,ts,jsx,tsx}", 
    "./pages/**/*.{js,ts,jsx,tsx}", 
    "./components/**/*.{js,ts,jsx,tsx}", 
      
    "./src/**/*.{js,ts,jsx,tsx}", 
  ], 
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3A0CA3",
          50: "#F3E8FF",
          100: "#E3CFFF",
          200: "#C7A3FF",
          300: "#AB77FF",
          400: "#8F4BFF",
          500: "#730FFF",
          600: "#5A0CDB",
          700: "#4009A3",
          800: "#2B0673",
          900: "#1A044D",
        },
        secondary: "#4361EE",
        dark: "#0B090A",
        gray: {
          100: "#F5F5F5",
          200: "#E5E5E5",
          300: "#D4D4D4",
          400: "#A3A3A3",
          500: "#2B2B2B",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
        },
        blue: {
          100: "#D7EEFF",
          200: "#119BFF",

          500: "#4361EE"
        },
        red:{
          100: "#FFE1E1",
          500: "#FF1111"
        },
        green:{
          100: "#F1FFF1",
          200: "#00CE3A"
        }
      }
    },
    fontFamily: {
      sans: ['Poppins', 'sans-serif'],
    },
    fontSize: {
      sm: "0.8125rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      '2xl': "1.5rem",
      '3xl': "1.875rem",
      '4xl': "2.25rem",
    },
    screens: {
      '2xs': '375px',
      xs: '480px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    container: {
      center: true,
      screens: {
        sm: '640px',
        md: '768px',    
        lg: '1024px',   
        xl: '1120px',   
        '2xl': '1120px', 
      },
      padding: {
        DEFAULT: '1.875rem',
        sm: '0',
      }
    },
  },
  plugins: [],
} satisfies Config;
