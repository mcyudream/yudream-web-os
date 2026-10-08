# Changelog

All notable changes to YudreamWebOS are documented here. Format follows [Keep a Changelog](https://keepachangelog.com/); versioning follows [SemVer](https://semver.org/).

## [0.1.0] - 2026-10-07

### Added（M0–M9 全里程碑）

**core（`@yudream/yudream-webos-core`，框架无关零依赖）**
- 类型体系：窗口（WindowRect/WindowState/Viewport）、应用（AppManifest/AppEntry/AppPermission/OpenRequest）、栅格（GridTile/GridConfig/断点）、主题（ThemeTokens/GlassLevel/WallpaperMeta）、UI 适配器（YwUiAdapter 及菜单/对话框/提示类型）
- 窗口状态机：reducer 纯函数（open/close/focus/minimize/toggle-maximize/move/resize/restore），z-order 焦点、级联开窗、视口钳制、快照序列化
- 栅格化引擎：16 种磁贴规格（1x1~4x4）、碰撞检测、紧凑布局、交换重排、跨度调整、响应式断点列数
- 主题：亮/暗 oklch token（`--yw-*`）、合并覆盖、CSS 声明输出、毛玻璃档位映射
- 应用适配器：注册表 reducer（register/unregister/set-enabled/reorder）、dock/launchpad 派生、权限判定（prompt/allow-all/deny-all/custom）、openRequest 归一化
- 类型化事件总线（零依赖实现，替代 mitt）；几何/ID 纯函数工具

**vue（`@yudream/yudream-webos-vue`）**
- 组件：YwDesktop（壁纸/图标网格/窗口层/持久化恢复与载荷重建）、YwWindow（macOS 三色点/八向缩放手柄/焦点态/动画）、YwAppIcon、YwDock（毛玻璃/悬停放大/运行指示/固定管理/三向位置）、YwTaskbar、YwMenubar、YwQuickLaunch（Ctrl/Cmd+K 搜索+最近+键盘导航）、YwLaunchpad（F4 全屏网格/搜索/分页）、YwCard（四槽位+玻璃/widget 模式）、YwBrowserApp（内置沙箱浏览器）
- 内置浏览器：地址栏（URL 解析/搜索引擎回退）、前进/后退/刷新、新窗口、系统浏览器打开、iframe sandbox 可配、每窗口会话历史
- stores：windows（持久化+载荷管理）、apps（注册表+统一 openApp）、theme（亮暗注入/系统跟随/壁纸）、browser（会话/历史/openUrl）
- 内置轻量 UI 适配器（菜单/确认/警告/toast，--yw token 视觉）；Pointer Events 手写拖拽/缩放 composable
- `createYudreamWebOS()` 插件（适配器注入/路由解析/openUrl 接管/持久化/主题/浏览器配置/内置应用注册）；样式随包注入（vite-plugin-lib-inject-css）

**arco（`@yudream/yudream-webos-arco`）**
- `arcoAdapter`：Message/Modal 服务式 API 实现 message/confirm/alert；menu 复用内置实现（视觉统一）

**工程化**
- pnpm 12 monorepo + catalog 版本锁定；vite lib 构建（ESM + d.ts）；vitest 54 用例（core 38 / vue 15 / arco 1）；antfu eslint + stylelint 17 + cz-git；playground 演示（含内置浏览器/启动台/快速启动全交互）
- 规范全套：AGENTS.md 硬规则、docs/dev 三篇（总纲/包管理/App 适配器）、docs/exp 经验库、docs/plan 里程碑

[0.1.0]: https://github.com/yudream/yudream-web-os/releases/tag/v0.1.0
