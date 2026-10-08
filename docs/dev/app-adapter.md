# App 适配器接入规范

> 适用范围：宿主应用（如 YPanel 工作台）向 WebOS 注册自有应用；内置应用与内置浏览器的配置。
> 实现位置：`@yudream/yudream-webos-core`（`registry/`）、`@yudream/yudream-webos-vue`（`createWebOS` / `useAppRegistry`）、`@yudream/yudream-webos-arco`（UI 层）。
> 本文以当前实现为准（0.2.0，与 playground 实测代码同步；2026-10-08 按实现重写，清理了早期草案 API 的漂移）。

## 1. 设计目标

- 接入方只写 **AppDefinition**（声明式），桌面图标、Dock、启动台、快速启动、窗口打开行为全部由注册表单一数据源派生。
- 应用主入口为**组件**（同步组件或异步 loader）；url 打开走 `openUrl`（内置浏览器应用承载）。
- 内置应用与宿主应用走**同一条注册通道**（`register` / `override`），无特权区别。

## 2. AppDefinition 字段

定义见 `@yudream/yudream-webos-core`（`registry/types.ts`）：

```ts
interface AppDefinition {
  /** 全局唯一 id（kebab-case），如 'file-manager' */
  id: string
  name: string
  /** 图标：iconify 类名 / 图片 URL / data URI */
  icon: string
  /** 图标底座背景（CSS background 值）；缺省按 id 从色板稳定取色 */
  iconBg?: string
  version?: string
  /** 启动台分类 */
  category?: string
  /** 搜索关键词（含拼音，空格分隔），快速启动/启动台搜索用 */
  keywords?: string
  /** 应用主组件：同步组件或异步 loader（`() => import('./X.vue')`） */
  component?: unknown

  // ---- 窗口行为 ----
  /** 单例：默认 true，重复打开聚焦已有窗口 */
  singleton?: boolean
  /** 非单例多开时窗口标题追加 #2 #3… */
  multiInstance?: boolean
  defaultSize?: Size
  minSize?: Size
  maxSize?: Size
  /** 默认 true */
  resizable?: boolean
  /** 无系统标题栏（应用自绘） */
  frameless?: boolean
  defaultPosition?: { x: number, y: number } | 'center' | 'cascade'

  // ---- 桌面生态挂载点 ----
  /** 应用聚焦时的顶部菜单（MenuContribution） */
  menus?: MenuContribution
  dock?: { showInDock?: boolean, contextMenu?: MenuItem[] }
  launchpad?: { show?: boolean, order?: number }
  /** 桌面图标挂载点：show=false 时不播种桌面网格（仅 Dock/启动台/搜索可达），默认 true */
  desktop?: { show?: boolean, contextMenu?: MenuItem[] }
  /** 应用附带的小组件 */
  widgets?: WidgetDefinition[]
  /** 声明可打开的文件类型（Finder 双击路由），如 ['txt', 'md'] */
  fileHandlers?: string[]

  // ---- 生命周期 ----
  onLaunch?: (ctx: AppLaunchContext) => void
  onTerminate?: () => void
}
```

规则：

- `id` 全库唯一（含内置应用）；重复注册同 id 视为更新（dev 热更场景）。
- `component` 支持**异步 loader**：注册层自动 `defineAsyncComponent` 归一化并缓存（同一 loader 引用只建一次组件，窗口重复渲染不会反复挂载）。
- 组件载荷由 ui 层经 `appComponents` 表消费；窗口内容区读取不到组件时显示「该应用未提供组件内容」。

## 3. 打开动作

| 动作 | 行为 |
|---|---|
| `os.openApp(id, launchOptions?)` | 归一化入口：注册表查应用 → `webos:app:launch` 事件 → `onLaunch` → `wm.open`（单例应用自动聚焦） |
| `os.openUrl(url, target?)` | `target: 'browser'`（默认）经内置浏览器应用开窗；`'external'` 直接 `window.open` |
| `wm.open(id, { launchOptions? })` | 命令式开窗（绕过单例聚焦语义时慎用） |

Dock、桌面图标、启动台、快速启动全部收敛到 `openApp` / `openUrl`。`launchOptions` 挂在窗口实例上，应用组件经 `win.launchOptions` 读取。

## 4. 注册通道

```ts
// main.ts —— 插件装配（Pinia 非必需；本库为普通 reactive 架构，不依赖 Pinia）
import { createWebOS } from '@yudream/yudream-webos-vue'
import { arcoAdapter } from '@yudream/yudream-webos-arco'

app.use(createWebOS({
  ui: arcoAdapter,                       // 缺省用内置轻量实现
  apps: [/* 批量预注册（AppDefinition[]） */],
  overrides: { finder: { name: '访达' } }, // 运行前预覆盖（appId → patch 深合并）
  persist: { adapter: 'localstorage', prefix: 'myapp' },
  desktop: { arrangeMode: 'grid', collision: 'swap' },
  dock: { position: 'bottom', magnification: true },
  widgets: { placement: 'sidebar' },
  menubar: { showControlCenter: true },
  windows: { snapToEdge: true, sessionRestore: true },
}))
```

```ts
// 任意宿主模块 —— 运行时注册（推荐组件 setup 内或 onMounted）
import { useAppRegistry } from '@yudream/yudream-webos-vue'
import FileManager from './apps/FileManager.vue'

const registry = useAppRegistry()

registry.register({
  id: 'file-manager',
  name: '文件管理',
  icon: 'i-lucide-folder-open',
  component: () => import('./apps/FileManager.vue'),   // 异步 loader 同样支持
  category: 'tool',
  keywords: 'wenjian wjg file',
  defaultSize: { width: 960, height: 640 },
})

registry.register({
  id: 'docs',
  name: '开发文档',
  icon: 'i-lucide-book-open',
  component: DocsViewer,
})
```

运行时 `register` 与批量 `apps` 走同一装配：登记注册表、窗口规格（wm.registerSpec）、组件载荷表（appComponents）与附带小组件。

## 5. 持久化

- `persist.adapter`：`'localstorage'`（默认）/ `'indexeddb'` / `'memory'` / 自定义 `PersistenceAdapter` 对象；`prefix` 隔离命名空间。
- **key 即 scope 名**（`'dock'` / `'widgets'` / `'desktop.layout'` / `'windows.session'` / `'system'`），前缀拼接完全由适配器内部管理，调用方不要再拼 prefix（历史坑：双前缀导致读写错位）。
- 写入防抖 300ms 合并；安装插件时自动接线 `visibilitychange(hidden)` / `pagehide` → `flushNow()` 强制落盘——遮挡/后台窗口的定时器节流可达分钟级，没有这个兜底「改完立刻刷新」会丢最后一次写入。
- 自定义适配器可选实现 `flushNow?: () => void`。

## 6. 内置浏览器应用

- 内置 app `id: 'browser'`（`@yudream/yudream-webos-apps` 的 builtinApps 内）；不装 apps 包或从 `apps` 列表剔除即不注册。
- 窗口形态：地址栏 + 工具按钮（后退/前进/刷新）+ iframe 内容区 + 加载覆盖层（iframe 常驻渲染，loading 只是覆盖层——见 exp：条件卸载事件源会死锁）。
- 地址栏输入非 URL 时按搜索引擎模板拼接；`useBrowserStore().configure({...})` 可配 `searchEngine` / `openExternalTargets` 等。
- 沙箱默认 `allow-scripts allow-same-origin allow-forms allow-popups-to-escape-sandbox`；**跨域限制如实存在**（无法读取异源 iframe DOM）。

## 7. 未来扩展（V2 路线，尚未实现，接口预留中）

- `route` / `url` 声明式入口类型与 `routeResolver`（当前 url 经 openUrl 走浏览器应用）。
- 权限模型（AppPermission 声明 + permissionsPolicy 授权策略）。
- `remoteLoader`：远程 manifest 获取 + 异步组件远程加载，配合应用市场。
- 应用分组文件夹进注册表（当前文件夹为 UI 层纯视图态）。

## 8. 多窗口（多实例）

应用可同时存在多个窗口的能力由两个互补字段声明：

| 字段 | 语义 | 默认 |
|---|---|---|
| `singleton` | 单例：重复打开聚焦已有窗口 | `true` |
| `multiInstance` | 多实例：非单例应用多开时窗口标题自动追加 `#2 #3…`（编号基于累计开窗数，关闭不重用） | `false` |

典型组合：

```ts
// 多实例应用：每次双击都开新窗口
registry.register({
  id: 'terminal',
  singleton: false,
  multiInstance: true,
  // ...
})

// 单实例应用：重复打开只聚焦
registry.register({
  id: 'settings',
  singleton: true,   // 默认即 true
})
```

命令式多窗口（不经过 Dock/桌面，代码直接开）：

```ts
const { wm } = useWebOS()
const win = wm.open('terminal')          // 每次调用都开新窗（除非 spec.singleton）
wm.open('terminal', { launchOptions: { cwd: '/var' } })
```

注意：`launchOptions` 挂在每个窗口实例上，应用组件通过 `win.launchOptions` 读取（如浏览器初始 URL、编辑器待打开文件）。
