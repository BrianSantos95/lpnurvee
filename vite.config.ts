import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  const isProd = mode === 'production';
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    build: {
      // Sourcemaps apenas em desenvolvimento
      sourcemap: !isProd,
      // Alertar se chunk > 400KB
      chunkSizeWarningLimit: 400,
      rollupOptions: {
        output: {
          manualChunks: {
            // Separa React do resto do vendor
            'vendor-react': ['react', 'react-dom'],
            // Framer-motion num chunk separado (lazy-loadable)
            'vendor-motion': ['framer-motion', 'motion'],
            // tsparticles (carregado só quando o componente é montado)
            'vendor-particles': [
              '@tsparticles/react',
              '@tsparticles/engine',
              '@tsparticles/slim',
            ],
            // Lucide num chunk separado (tree-shaken pelo Rollup)
            'vendor-lucide': ['lucide-react'],
          },
        },
      },
    },
  };
});
