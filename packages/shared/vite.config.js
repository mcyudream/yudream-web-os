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
    },
    plugins: [
        dts({
            tsconfigPath: './tsconfig.json',
            entryRoot: 'src',
            exclude: ['test/**'],
        }),
    ],
    test: {
        include: ['test/**/*.test.ts'],
    },
});
