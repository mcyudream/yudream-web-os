<div align="center">

# YudreamWebOS

**一套 Vue 3 的 Web 桌面操作系统基础组件库**

窗口管理 · 桌面 · Dock · 启动台 · Finder · 小组件 · 菜单栏 · 沙箱浏览器 —— 一切皆可覆盖替换

[![npm version](https://img.shields.io/npm/v/@yudream/yudream-webos?color=cb3837&logo=npm)](https://www.npmjs.com/package/@yudream/yudream-webos)
[![License: MIT](https://img.shields.io/badge/License-MIT-3da639.svg)](./LICENSE)
[![Vue 3](https://img.shields.io/badge/Vue-3.5+-4fc08d.svg?logo=vuedotjs)](https://vuejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-3178c6.svg?logo=typescript)](https://www.typescriptlang.org)

[快速开始](#-快速开始) · [四级覆盖](#-四级覆盖体系) · [内置应用](#-内置应用) · [Composables](#-composables) · [Roadmap](#-roadmap)

</div>

---

## ✨ 为什么选择 YudreamWebOS

在 Web 里构建桌面级体验，最难的不是画 UI，而是**窗口管理、布局引擎、文件系统、多窗口状态同步**这些操作系统级的地基。YudreamWebOS 把这些全部内置：

- **一行代码起整个桌面**：`<WebOSProvider>` 开箱即得完整桌面环境
- **渐进式采用**：只用窗口管理器？只用 Dock？都可以单独引入
- **一切皆可覆盖**：从 Dock 图标到整个窗口边框，四级定制体系层层递进
- **换 UI 库不动地基**：core 层纯 TypeScript 零依赖，UI 皮肤层可整体替换（首版 Arco Design Vue）

## 📦 包结构

```text
你的业务应用
─────────────────────────────────────────────
@yudream/yudream-webos-apps    内置应用：访达/设置/浏览器/启动台/终端/备忘录/编辑器/图片查看/计算器/应用商店
@yudream/yudream-webos-arco    UI 层（Arco Design Vue 皮肤）：桌面/窗口/Dock/启动台/Finder/菜单栏/小组件
@yudream/yudream-webos-vue     Vue 绑定层：WebOSProvider / createWebOS / composables / uiRegistry / 快捷键
@yudream/yudream-webos-core    框架无关核心（纯 TS 零依赖）：窗口管理器/VFS/注册表/桌面布局/Dock/小组件/菜单/持久化
@yudream/yudream-webos-shared  公共类型与工具
─────────────────────────────────────────────
@yudream/yudream-webos         元包（一次安装，全部能力）
```

依赖严格单向：core 不 import vue，vue 不 import arco，arco 不 import apps —— 换 UI 库只是「重新画一遍皮」。

## 🚀 快速开始

### 安装

```bash
pnpm add @yudream/yudream-webos
# 或
npm i @yudream/yudream-webos
```

> 图标基于 [Iconify](https://iconify.design)，请自行安装数据集（如 `@iconify-json/lucide`）并配置 UnoCSS `presetIcons`。

### 一行起整个桌面

```ts
// main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createWebOS } from '@yudream/yudream-webos'
import { arcoAdapter } from '@yudream/yudream-webos-arco'
import { builtinApps } from '@yudream/yudream-webos-apps'
import App from './App.vue'

const app = createApp(App)
app.use(createPinia())
app.use(createWebOS({
  ui: arcoAdapter,                       // 缺省内置轻量适配器
  apps: builtinApps,                     // 内置应用（可挑选/覆盖/移除）
  persist: { adapter: 'localstorage', prefix: 'myapp' },
  dock: { position: 'bottom', magnification: true },
  widgets: { placement: 'sidebar' },
}))
app.mount('#app')
```

```vue
<!-- App.vue -->
<template>
  <WebOSProvider>
    <!-- 完整桌面已就绪：桌面/Dock/启动台/菜单栏/小组件/右键菜单 -->
  </WebOSProvider>
</template>
```

### 注册你的应用

```ts
import { useAppRegistry } from '@yudream/yudream-webos'

const { register } = useAppRegistry()

register({
  id: 'todo',
  name: '待办清单',
  icon: 'i-lucide-check-square',
  component: () => import('./TodoApp.vue'),   // 支持异步懒加载
  singleton: false,                            // 允许同时存在多个窗口
  multiInstance: true,                         // 多开时标题自动编号 #2 #3…
  defaultSize: { width: 720, height: 480 },
  menus: { appMenus: [{ id: 'file', label: '文件' }] },
  launchpad: { order: 10 },
})
```

注册后自动出现在桌面、启动台、Dock，获得完整窗口能力（拖拽/八向缩放/最大化/最小化/会话恢复）。

### 多窗口

```ts
const { wm } = useWebOS()
wm.open('terminal')   // 每次调用开新窗（非单例应用）
```

## 🧩 四级覆盖体系

以「替换 Finder 侧边栏」为例，定制手段由轻到重：

| 级别 | 手段 | 示例 |
|---|---|---|
| ① 服务替换 | 换存储/文件后端 | `webos.vfs.mount('/', myRemoteAdapter)` |
| ② 组件替换 | 整体换掉 UI 区块 | `uiRegistry.override('FinderSidebar', MySidebar)` |
| ③ 插槽注入 | 局部嵌入内容 | `<template #menubar-right><MyAvatar /></template>` |
| ④ 配置管道 | 函数式改默认结果 | `overrides: { finder: { name: '文件' } }` |

可覆盖组件 key 清单（公共契约）：`WindowFrame` `WindowTitleBar` `DesktopItem` `DesktopFolder` `Dock` `DockItem` `Launchpad` `LaunchpadItem` `MenuBar` `MenuBarExtra` `ControlCenter` `NotificationCenter` `FinderSidebar` `FinderToolbar` `FinderView` `WidgetHost` `WidgetGallery` `ContextMenu`。

## 🪝 Composables

| Composable | 用途 |
|---|---|
| `useWindowManager()` | 打开/关闭/聚焦/最小化/最大化/全屏/吸附分屏 |
| `useAppRegistry()` | 注册/覆盖/卸载应用，按文件类型路由 |
| `useDesktop()` | 图标增删、拖拽换位、文件夹成组、整理排序 |
| `useDock()` | 固定/角标/重排/自动隐藏 |
| `useVFS()` | 多后端虚拟文件系统（内存/LocalStorage/IndexedDB/自定义远程） |
| `useFinder()` | 导航状态、选中集、四视图切换 |
| `useWidgets()` | 小组件实例增删/布局/配置/编辑模式 |
| `useMenuBar()` | 菜单栏状态、应用菜单合并 |
| `useSystemSettings()` | 亮暗主题、强调色、壁纸，自动持久化 |
| `useWebOSEvents()` | 订阅全部 `webos:*` 事件（埋点/联动/自动化） |

## 📱 内置应用与小组件

访达（四视图 + 文件类型路由）· 系统设置（外观/强调色/壁纸/Dock）· 沙箱浏览器 · 启动台 · 终端（`ls` `cd` `cat` `echo` `open` 命令可扩展）· 备忘录 · 文本编辑 · 图片查看 · 计算器 · 应用商店（运行时动态注册演示）

内置小组件：时钟（秒级走字）· 日历（真实月历）· 系统监视（CPU/内存/运行时长，数据源 adapter 可替换）

## 🎨 主题与持久化

macOS 风格 Liquid Glass 设计体系，`--yw-*` oklch 语义令牌，亮/暗双主题，强调色实时联动：

```ts
const { setMode, setAccent, setWallpaper } = useSystemSettings()
setAccent('#0A84FF')                                  // 全局强调色
setWallpaper({ src: '/wallpapers/mountain.jpg' })     // 壁纸
setMode('dark')                                       // 亮 / 暗 / 跟随系统
```

所有桌面状态开箱持久化（桌面布局、窗口会话、Dock、小组件、系统设置），写入 300ms 防抖合并，schema 带版本迁移。接你自己的存储后端只需实现 4 个方法：

```ts
createWebOS({
  persist: {
    adapter: {
      get: async key => myApi.load(key),
      set: async (key, value) => myApi.save(key, value),
      remove: async key => myApi.del(key),
      clear: async scope => myApi.wipe(scope),
    },
  },
})
```

## ⌨️ 快捷键

`Ctrl/Cmd+K` 聚焦搜索 · `F4` 启动台 · `Ctrl/Cmd+W` 关窗 · `Ctrl/Cmd+M` 最小化 —— 全局注册表可扩展，冲突自动告警。

## 🛠 本地开发

```bash
git clone https://github.com/mcyudream/yudream-web-os.git
cd yudream-web-os
pnpm install
pnpm dev        # Playground：完整桌面演示
pnpm build      # 六包构建（ESM + d.ts）
pnpm test       # vitest（56 用例）
pnpm lint       # eslint(antfu) + stylelint + vue-tsc
```

## 🗺 Roadmap

- [x] M1 窗口管理器 / 应用注册表 / 事件总线 / 持久化
- [x] M2 VFS + Finder 四视图 / 启动台 / 废纸篓
- [x] M3 菜单栏 / 控制中心 / 通知中心 / 小组件 / 快捷键
- [ ] M4 文档站 / 单测覆盖率 80% / 第二 UI 适配包（Naive UI）验证
- [ ] 应用间通信总线 / 远程应用加载 / 多桌面 Spaces

## 🤝 贡献

欢迎 Issue 与 PR。提交信息遵循 [Conventional Commits](https://www.conventionalcommits.org)（中文描述），提交前请确保 `pnpm lint && pnpm test` 通过。

## License

[MIT](./LICENSE) © 2026 YuDream
