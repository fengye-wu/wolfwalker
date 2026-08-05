import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    open: false,
    host: true,
    port: 8888,
    strictPort: true
  }
});
