import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { libInjectCss } from 'vite-plugin-lib-inject-css';
export default defineConfig({
    // 显式指定：绕过 vite8 oxc 在 Windows monorepo 下的 tsconfig 自动发现路径 bug
    tsconfig: './tsconfig.json',
    plugins: [
        vue(),
        dts({
            include: ['src/**/*.ts', 'src/**/*.vue', 'src/**/*.d.ts'],
            tsconfigPath: './tsconfig.json',
            entryRoot: 'src',
            exclude: ['test/**'],
            rollupTypes: false,
        }),
        libInjectCss(),
    ],
    build: {
        lib: {
            entry: 'src/index.ts',
            formats: ['es'],
            fileName: 'index',
        },
        sourcemap: true,
        minify: false,
        rollupOptions: {
            external: [
                'vue',
                /^@yudream\/yudream-webos-(core|shared|vue|arco)/,
            ],
        },
    },
    test: {
        environment: 'happy-dom',
        include: ['test/**/*.test.ts'],
    },
});
