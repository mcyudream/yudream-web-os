import { fileURLToPath } from 'node:url'
import { defineConfig, presetAttributify, presetIcons, presetWind4 } from 'unocss'
import presetAnimations from 'unocss-preset-animations'

/**
 * YudreamWebOS UnoCSS 配置（playground 与文档站共用）。
 * 组件库本身不强制 UnoCSS（样式以 --yw-* token + scoped 样式交付），
 * 但 token 注入依赖本配置中的 theme 映射，宿主可直接复用。
 * M1 完成后：亮/暗 token 值从 @yudream/yudream-webos-core 的 theme/tokens 导入。
 */
export default defineConfig({
  presets: [
    presetWind4(),
    presetAttributify(),
    presetAnimations(),
    presetIcons({
      scale: 1.2,
      warn: true,
      collections: {
        // 按需加载 lucide 图标集（@iconify-json/lucide）
        lucide: () => import('@iconify-json/lucide/icons.json').then(m => m.default as never),
      },
    }),
  ],
  theme: {
    // --yw-* token 映射（oklch），M1 起与 core 的 tokens.ts 对齐
    colors: {
      'yw-background': 'oklch(var(--yw-background) / <alpha-value>)',
      'yw-foreground': 'oklch(var(--yw-foreground) / <alpha-value>)',
      'yw-card': 'oklch(var(--yw-card) / <alpha-value>)',
      'yw-popover': 'oklch(var(--yw-popover) / <alpha-value>)',
      'yw-primary': 'oklch(var(--yw-primary) / <alpha-value>)',
      'yw-secondary': 'oklch(var(--yw-secondary) / <alpha-value>)',
      'yw-muted': 'oklch(var(--yw-muted) / <alpha-value>)',
      'yw-accent': 'oklch(var(--yw-accent) / <alpha-value>)',
      'yw-destructive': 'oklch(var(--yw-destructive) / <alpha-value>)',
      'yw-border': 'oklch(var(--yw-border) / <alpha-value>)',
      'yw-input': 'oklch(var(--yw-input) / <alpha-value>)',
      'yw-ring': 'oklch(var(--yw-ring) / <alpha-value>)',
      'yw-glass': 'oklch(var(--yw-glass) / <alpha-value>)',
    },
    borderRadius: {
      'yw-lg': 'var(--yw-radius-lg)',
      'yw-md': 'var(--yw-radius-md)',
      'yw-sm': 'var(--yw-radius-sm)',
    },
  },
  content: {
    pipeline: {
      include: [
        // 扫描所有包源码（图标类多为运行时字符串，需全量扫描）
        /packages[/\\]vue[/\\]src[/\\].*\.(?:vue|ts)/,
        /packages[/\\]arco[/\\]src[/\\].*\.(?:vue|ts)/,
        /packages[/\\]apps[/\\]src[/\\].*\.(?:vue|ts)/,
        /playground[/\\]src[/\\].*\.(?:vue|ts)/,
      ],
    },
  },
  configDeps: [
    fileURLToPath(new URL('./packages/core/src/theme/tokens.ts', import.meta.url)),
  ],
})
