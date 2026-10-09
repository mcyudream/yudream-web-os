import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
export default defineConfig({
    build: {
        lib: {
            entry: 'src/index.ts',
            formats: ['es'],
            fileName: 'index',
        },
        sourcemap: true,
        minify: false,
        rollupOptions: {
            // core 零运行时依赖：无需 external，保持纯净即不可误引
            external: [],
        },
    },
    plugins: [
        dts({
            tsconfigPath: './tsconfig.json',
            entryRoot: 'src',
            exclude: ['test/**'],
            rollupTypes: false,
        }),
    ],
    test: {
        include: ['test/**/*.test.ts'],
    },
});
