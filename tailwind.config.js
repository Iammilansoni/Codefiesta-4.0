/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // maps the class `font-loadfont` to our custom font
        loadfont: ['loadfont', 'ui-sans-serif', 'system-ui'],
      },
      // Responsive breakpoints optimized for performance
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        // Device-specific breakpoints
        'mobile': { 'max': '639px' },
        'tablet': { 'min': '640px', 'max': '1023px' },
        'desktop': { 'min': '1024px' },
      },
      // Optimized animations with reduced motion support
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-in-fast': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-up-fast': 'slideUp 0.15s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(59, 130, 246, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.8)' },
        },
      },
      // Performance-optimized utilities
      willChange: {
        'transform': 'transform',
        'opacity': 'opacity',
        'auto': 'auto',
        'scroll': 'scroll-position',
      },
      // 3D perspective utilities
      perspective: {
        '500': '500px',
        '1000': '1000px',
        '1500': '1500px',
        '2000': '2000px',
      },
      // Enhanced backdrop blur options
      backdropBlur: {
        'xs': '2px',
        'lg': '24px',
        'xl': '40px',
        '2xl': '80px',
        '3xl': '100px',
      },
      // Mobile-first spacing
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
      },
      // Extended color palette for better theming
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        }
      },
      // Performance-optimized transitions
      transitionDuration: {
        '0': '0ms',
        '50': '50ms',
        '100': '100ms',
        '200': '200ms',
        '300': '300ms',
        '400': '400ms',
        '500': '500ms',
        '600': '600ms',
        '700': '700ms',
        '800': '800ms',
        '900': '900ms',
        '1000': '1000ms',
        '1200': '1200ms',
        '1500': '1500ms',
      }
    },
  },
  plugins: [
    // Add plugin for better animations
    function({ addUtilities, addBase }) {
      addBase({
        // Optimize animations for reduced motion preference
        '@media (prefers-reduced-motion: reduce)': {
          '*': {
            'animation-duration': '0.01ms !important',
            'animation-iteration-count': '1 !important',
            'transition-duration': '0.01ms !important',
          },
        },
        // Optimize font rendering
        'html': {
          '-webkit-font-smoothing': 'antialiased',
          '-moz-osx-font-smoothing': 'grayscale',
        },
        // GPU acceleration for transforms
        '.gpu-accelerated': {
          'transform': 'translateZ(0)',
          'backface-visibility': 'hidden',
          'perspective': '1000px',
        }
      });
      
      addUtilities({
        // GPU acceleration utilities
        '.gpu': {
          'transform': 'translateZ(0)',
          'backface-visibility': 'hidden',
        },
        '.smooth-scroll': {
          'scroll-behavior': 'smooth',
        },
        '.no-scroll': {
          'overflow': 'hidden',
        },
        // Performance-optimized container queries
        '.container-performance': {
          'contain': 'layout style paint',
        }
      });
    }
  ],
}