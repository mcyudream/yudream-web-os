import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { libInjectCss } from 'vite-plugin-lib-inject-css';
export default defineConfig({
    tsconfig: './tsconfig.json',
    plugins: [
        vue(),
        dts({
            tsconfigPath: './tsconfig.json',
            entryRoot: 'src',
            exclude: ['test/**'],
            rollupTypes: false,
        }),
        libInjectCss(),
    ],
    build: {
        lib: {
            entry: {
                index: 'src/index.ts',
                styles: 'src/styles.ts',
            },
            formats: ['es'],
        },
        sourcemap: true,
        minify: false,
        rollupOptions: {
            external: [
                'vue',
                'pinia',
                'mitt',
                'clsx',
                'es-toolkit',
                /^@yudream\/yudream-webos-core/,
            ],
        },
    },
    test: {
        environment: 'happy-dom',
        include: ['test/**/*.test.ts'],
    },
});
