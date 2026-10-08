<div align="center">

# YudreamWebOS

**A Web Desktop OS foundation library for Vue 3**

Window management · Desktop · Dock · Launchpad · Finder · Widgets · Menu bar · Sandboxed browser — everything overridable

[![npm version](https://img.shields.io/npm/v/@yudream/yudream-webos?color=cb3837&logo=npm)](https://www.npmjs.com/package/@yudream/yudream-webos)
[![License: MIT](https://img.shields.io/badge/License-MIT-3da639.svg)](./LICENSE)
[![Vue 3](https://img.shields.io/badge/Vue-3.5+-4fc08d.svg?logo=vuedotjs)](https://vuejs.org)

[Quick Start](#-quick-start) · [4-Level Overrides](#-4level-override-system) · [Built-in Apps](#-built-in-apps) · [Roadmap](#-roadmap)

</div>

---

## ✨ Why YudreamWebOS

Building desktop-grade experiences on the web is not about drawing UI — it's about the OS-level foundations: window management, layout engines, file systems, multi-window state sync. YudreamWebOS ships them all:

- **Full desktop in one line**: `<WebOSProvider>` boots a complete desktop environment
- **Progressive adoption**: use only the window manager, or only the Dock
- **Everything overridable**: from a Dock icon to the entire window frame, via a 4-level override system
- **Swap UI skins, keep the foundation**: framework-agnostic zero-dependency core (first skin: Arco Design Vue)

## 📦 Packages

| Package | Description |
|---|---|
| `@yudream/yudream-webos` | Meta package (installs everything) |
| `@yudream/yudream-webos-core` | Framework-agnostic core: window manager / VFS / registry / desktop layout / dock / widgets / menu / persistence |
| `@yudream/yudream-webos-vue` | Vue binding: WebOSProvider / createWebOS / composables / uiRegistry / shortcuts |
| `@yudream/yudream-webos-arco` | UI layer (Arco Design Vue skin): desktop / windows / dock / launchpad / Finder / menu bar / widgets |
| `@yudream/yudream-webos-apps` | Built-in apps: Finder / Settings / Browser / Launchpad / Terminal / Notes / Text Editor / Image Viewer / Calculator / App Store |
| `@yudream/yudream-webos-shared` | Shared types & utilities |

## 🚀 Quick Start

```ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createWebOS } from '@yudream/yudream-webos'
import { arcoAdapter } from '@yudream/yudream-webos-arco'
import { builtinApps } from '@yudream/yudream-webos-apps'

app.use(createPinia())
app.use(createWebOS({
  ui: arcoAdapter,
  apps: builtinApps,
  persist: { adapter: 'localstorage', prefix: 'myapp' },
}))
app.mount('#app')
```

Register your own app:

```ts
import { useAppRegistry } from '@yudream/yudream-webos'

const { register } = useAppRegistry()
register({
  id: 'todo',
  name: 'Todo',
  icon: 'i-lucide-check-square',
  component: () => import('./TodoApp.vue'),
  singleton: false,
  multiInstance: true,
})
```

## 🧩 4-Level Override System

1. **Service swap** — `webos.vfs.mount('/', myRemoteAdapter)`
2. **Component swap** — `uiRegistry.override('FinderSidebar', MySidebar)`
3. **Slot injection** — `<template #menubar-right><MyAvatar /></template>`
4. **Config pipeline** — `overrides: { finder: { name: 'Files' } }`

## 💾 Persistence

All desktop state persists out of the box (desktop layout, window session, dock, widgets, settings) with 300ms write debounce and schema migrations. Bring your own backend:

```ts
persist: {
  adapter: {
    get: async key => myApi.load(key),
    set: async (key, value) => myApi.save(key, value),
    remove: async key => myApi.del(key),
    clear: async scope => myApi.wipe(scope),
  },
}
```

## 🗺 Roadmap

- [x] M1 Window manager / registry / event bus / persistence
- [x] M2 VFS + Finder 4-view / launchpad / trash
- [x] M3 Menu bar / control center / notification center / widgets / shortcuts
- [ ] M4 Docs site / 80% core coverage / second UI adapter (Naive UI)

## License

[MIT](./LICENSE) © 2026 YuDream
