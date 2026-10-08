import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { libInjectCss } from 'vite-plugin-lib-inject-css'

export default defineConfig({
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
})
