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
      // Target browsers modernos — reduz o polyfill overhead no bundle
      target: ['es2020', 'chrome90', 'firefox88', 'safari14'],
      // Sourcemaps apenas em desenvolvimento
      sourcemap: !isProd,
      // Alertar se chunk > 400KB
      chunkSizeWarningLimit: 400,
      // Minificação extra: remove console.log e debugger em prod
      minify: 'esbuild',
      rollupOptions: {
        output: {
          // Garante que módulos críticos (React) sejam preloaded pelo browser
          experimentalMinChunkSize: 10_000,
          manualChunks: (id) => {
            // React core num chunk minúsculo e crítico
            if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
              return 'vendor-react';
            }
            // Framer-motion num chunk separado (só carregado quando componentes são montados)
            if (id.includes('framer-motion') || id.includes('/motion/')) {
              return 'vendor-motion';
            }
            // tsparticles (lazy-loaded via Suspense — zero impacto no LCP)
            if (
              id.includes('@tsparticles') ||
              id.includes('tsparticles')
            ) {
              return 'vendor-particles';
            }
            // Lucide icons num chunk separado (tree-shaken pelo Rollup)
            if (id.includes('lucide-react')) {
              return 'vendor-lucide';
            }
          },
        },
      },
    },
  };
});
