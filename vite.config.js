import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ mode }) => ({
  plugins: [
    react({
      // Optimize React for performance
      jsxRuntime: 'automatic',
      babel: {
        plugins: [
          // Remove prop-types in production
          mode === 'production' && ['babel-plugin-transform-remove-console', { exclude: ['error', 'warn'] }],
        ].filter(Boolean),
      },
    })
  ],
  resolve: {
    alias: { 
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    // Enable code splitting and tree shaking
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          'react-vendor': ['react', 'react-dom'],
          'animation-vendor': ['framer-motion'],
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei', '@react-three/postprocessing'],
          'ui-vendor': ['react-icons', 'lucide-react'],
          'utils-vendor': ['zustand', 'canvas-confetti']
        },
        // Optimize chunk names
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId 
            ? chunkInfo.facadeModuleId.split('/').pop().replace('.jsx', '').replace('.js', '')
            : 'chunk';
          return `js/${facadeModuleId}-[hash].js`;
        },
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(assetInfo.name)) {
            return `media/[name]-[hash].${ext}`;
          }
          if (/\.(png|jpe?g|gif|svg|webp|avif)(\?.*)?$/i.test(assetInfo.name)) {
            return `img/[name]-[hash].${ext}`;
          }
          if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(assetInfo.name)) {
            return `fonts/[name]-[hash].${ext}`;
          }
          return `assets/[name]-[hash].${ext}`;
        }
      }
    },
    // Optimize build settings
    cssCodeSplit: true,
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info'],
        unused: true,
        dead_code: true
      },
      mangle: {
        toplevel: true
      }
    },
    // Set reasonable chunk size limits
    chunkSizeWarningLimit: 1000,
    assetsInlineLimit: 4096, // Inline assets smaller than 4kb
    // Enable build optimization
    target: 'esnext',
    cssTarget: 'chrome80'
  },
  // Optimize dependencies for performance
  optimizeDeps: {
    include: [
      'react', 
      'react-dom',
      'framer-motion', 
      'react-icons/fa',
      'react-icons/md', 
      'react-icons/hi',
      'canvas-confetti',
      '@react-three/fiber',
      '@react-three/drei',
      '@react-three/postprocessing',
      'three',
      'zustand'
    ],
    exclude: ['@splinetool/react-spline'], // Exclude heavy optional dependencies
    esbuildOptions: {
      target: 'esnext',
      // Enable tree shaking
      treeShaking: true
    }
  },
  define: {
    global: 'globalThis',
    // Enable production optimizations
    __DEV__: mode !== 'production'
  },
  // Server configuration for development
  server: {
    port: 5173,
    host: true,
    open: false,
    hmr: {
      overlay: true
    }
  },
  // Preview configuration
  preview: {
    port: 4173,
    host: true
  },
  // Asset optimization
  assetsInclude: ['**/*.webp', '**/*.avif', '**/*.woff2'],
  // Performance optimizations
  esbuild: {
    target: 'esnext',
    drop: mode === 'production' ? ['console', 'debugger'] : [],
    legalComments: 'none'
  },
  // CSS optimizations
  css: {
    devSourcemap: false,
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`
      }
    }
  }
}))