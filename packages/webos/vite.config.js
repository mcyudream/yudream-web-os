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
            external: [
                'vue',
                'pinia',
                /^@yudream\/yudream-webos-(core|vue|arco)/,
            ],
        },
    },
    plugins: [
        dts({
            tsconfigPath: './tsconfig.json',
            entryRoot: 'src',
            rollupTypes: false,
        }),
    ],
});
