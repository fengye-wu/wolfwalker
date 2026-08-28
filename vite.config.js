import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const stylesDir = path.resolve(rootDir, 'src/styles');

export default defineConfig({
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      scss: {
        // 给每个组件的 <style lang="scss"> 自动注入变量和 mixin，省掉逐个手写 @use。
        // src/styles 下的文件要跳过：_core 转发 _mixins，注入进去会变成循环依赖，
        // 这些文件请自行写 `@use 'core' as *;`。
        additionalData: (source, filename) =>
          filename.replace(/\\/g, '/').includes('/src/styles/')
            ? source
            : `@use 'core' as *;\n${source}`,
        // 让 `@use 'core'` 这类裸模块名从 src/styles 解析。
        // includePaths 给 legacy API，loadPaths 给 modern API，两个都给以防 Vite 换实现。
        includePaths: [stylesDir],
        loadPaths: [stylesDir]
      }
    }
  },
  server: {
    open: false,
    host: true,
    port: 8888,
    strictPort: true
  }
});
