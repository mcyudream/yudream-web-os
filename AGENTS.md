# YudreamWebOS Agent Entry

- 项目名称：**YudreamWebOS**
- 开发团队：**YuDream**

YudreamWebOS：YuDream 团队自研的独立 WebOS 前端 UI 库（npm 分包发布），内置主题、窗口管理、桌面、栅格化磁贴、卡片、Dock 栏、快速启动、启动台与沙箱浏览器，通过 App 适配器（manifest 声明式注册）接入第三方应用，与 YPanel 面板功能完全剥离，可嵌入任意 Vue 3 应用。

- 渲染框架：Vue 3.5 + TS + Vite 8（多 UI 库适配：core 框架无关，vue 层零 UI 依赖，arco 适配层优先）
- 包管理：pnpm 12 monorepo + catalog 模式
- 接入规范：[docs/dev/app-adapter.md](./docs/dev/app-adapter.md)

## 开始工作前

在分析、设计、修改代码、补测试、写文档之前，先阅读：

1. [docs/dev/conventions.md](./docs/dev/conventions.md)（开发规范总纲）
2. 按任务范围选读：
   - [docs/dev/package-management.md](./docs/dev/package-management.md)（包管理规范）
   - [docs/dev/app-adapter.md](./docs/dev/app-adapter.md)（App 适配器与浏览器接入规范）
   - [docs/exp/](./docs/exp/)（经验之谈：坑与经验，遇问题先查这里）
3. 任务相关的 [docs/plan/](./docs/plan/) 计划与 [docs/](./docs/) 文档

每次开始新任务，都必须重新完整阅读以上文件及当前任务范围内适用的专用规范，并在首次工作进展中明确说明本次已读取的文件。不得以历史会话、已有摘要或此前的读取结果代替；未完成阅读前，不得分析、设计、给出修改方案或进行任何实质性代码写入。

## 硬规则

- 修改代码前，先给出可选方案并等待确认。
- 默认使用中文沟通、说明和评审。
- 未经确认，不进行实质性代码写入、删除、迁移、重构。
- 不得覆盖、回滚或污染用户已有未提交改动。
- 新发现的稳定约定，需要提示是否沉淀到 docs/dev/ 规范。
- **踩坑与非显然经验必须补充到 [docs/exp/](./docs/exp/)**（格式见该目录 README）；排查超过半小时的问题、环境/版本/平台差异坑、从源码或试错得出的结论都算。
- **组件强约束**：
  - 所有组件以 **`Yw` 前缀**命名（如 `YwWindow`/`YwDock`/`YwLaunchpad`），文件名 PascalCase 与组件名一致。
  - 渲染层（`@yudream/yudream-webos-vue`）**禁止依赖任何第三方 UI 组件库**；需要菜单/弹窗/提示等交互件时，一律走 `YwUiAdapter` 接口，默认内置轻量实现，arco 适配层（`@yudream/yudream-webos-arco`）提供 Arco Design Vue 实现。
  - **禁止在组件内直写裸 Arco / Element Plus / Naive UI 等组件标签**；适配层内部允许使用对应 UI 库原语，但必须包成适配器接口实现，不向外暴露第三方 API。
  - 视觉体系唯一来源是 `--yw-*` CSS 变量 token（oklch，亮/暗双主题），禁止引入第二套视觉体系；组件样式以 UnoCSS 原子类优先，复杂场景用 SCSS。
- **拖拽/缩放强约束**：窗口拖拽缩放与栅格重排一律手写 Pointer Events 实现，禁止引入 sortablejs / dnd-kit 等拖拽库（核心包零依赖原则同样适用：能用标准能力解决的不引库）。
- **core 框架无关强约束**：`@yudream/yudream-webos-core` 不得依赖 Vue/React/任何框架运行时，只产出纯 TS 类型、reducer 风格状态机与纯函数算法；框架绑定全部下沉到 vue 层。

## 敏感信息

本地敏感信息（测试账密、代理配置、临时 token）统一放 [docs/local.md](./docs/local.md)（已被 gitignore）：

- 禁止提交、禁止外发；代码/配置/规范文档中一律用占位符。
- 调试任务可读取使用，但不得在回复或日志中完整复述密钥内容。

## reference/ 参考源码

[reference/](./reference/) 下是若干第三方参考项目的浅克隆源码，**只读对照、已被 gitignore**：

- 各项目协议各异（自定义 EULA / AGPL / GPL 均有）——复制代码存在授权或传染性风险。
- 原则：**参考架构与逻辑、重手写实现**；严禁把其中代码复制进 packages/ 与 playground/。

## 文档组织（全部在 docs/ 下）

- `docs/` — 长期文档（调研、local.md 敏感信息）
- `docs/dev/` — 开发规范（总纲、包管理、App 适配器）✅ 提交
- `docs/exp/` — 经验之谈（坑与经验库）✅ 提交
- `docs/plan/` — 阶段计划与任务拆解（不提交）
- 其余文档不提交；git 提交范围以 .gitignore 为准
