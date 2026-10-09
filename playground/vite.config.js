import { fileURLToPath, URL } from 'node:url';
import vue from '@vitejs/plugin-vue';
import UnoCSS from 'unocss/vite';
import { defineConfig } from 'vite';
const pkg = (p) => fileURLToPath(new URL(`../packages/${p}/src`, import.meta.url));
export default defineConfig({
    plugins: [
        vue(),
        UnoCSS({
            configFile: fileURLToPath(new URL('../uno.config.ts', import.meta.url)),
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            // dev 时直连源码：UnoCSS 能扫描组件源文件生成图标/原子类，且改包源码即时热更
            '@yudream/yudream-webos-vue': pkg('vue'),
            '@yudream/yudream-webos-core': pkg('core'),
            '@yudream/yudream-webos-arco': pkg('arco'),
            '@yudream/yudream-webos-apps': pkg('apps'),
        },
    },
    server: {
        port: 5199,
        open: true,
    },
});
