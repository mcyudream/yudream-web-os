# YudreamWebOS 开发规范（总纲）

> 专项规范：[package-management.md](./package-management.md)（包管理）、[app-adapter.md](./app-adapter.md)（App 适配器与内置浏览器）。

## 1. 技术栈

| 层 | 选型 | 说明 |
|---|---|---|
| 渲染框架 | Vue 3.5 + TS + Vite 8 | 与 YPanel 前端同源 |
| 包管理 | pnpm 12 monorepo + catalog 模式 | `pnpm-workspace.yaml` 统一锁版本 |
| 样式 | UnoCSS（presetWind4）+ shadcn 风格 oklch CSS 变量 | token 以 `--yw-*` 命名，亮/暗双主题 |
| 状态 | core：reducer 风格纯 TS 状态机（框架无关）；vue 层：Pinia 包装 | core 可被任意框架消费 |
| 拖拽 | 手写 Pointer Events | 禁止引入 sortablejs / dnd-kit |
| UI 适配 | `YwUiAdapter` 接口 | vue 层内置默认实现，arco 适配层优先，预留多 UI 库适配位 |
| 测试 | vitest | core 引擎与状态机必须单测覆盖 |
| 交付 | npm 分包（ESM + d.ts） | 元包 `@yudream/yudream-webos` + `-core`/`-vue`/`-arco` |

## 2. 仓库结构（目标态）

```
yudream-web-os/
├── AGENTS.md                # 本仓库 Agent 入口与硬规则
├── docs/                    # 全部文档（local.md 敏感信息，不提交）
│   ├── dev/                 # 开发规范（本目录）✅ 提交
│   ├── exp/                 # 经验之谈 ✅ 提交
│   └── plan/                # 阶段计划（不提交）
├── packages/
│   ├── core/                # @yudream/yudream-webos-core（框架无关）
│   ├── vue/                 # @yudream/yudream-webos-vue（渲染层）
│   └── arco/                # @yudream/yudream-webos-arco（UI 适配层）
├── playground/              # 演示应用（vite app）
└── reference/               # 参考项目源码（只读，不提交）
```

规则：

- 代码写入前必须先有对应 docs/plan/ 计划或经用户确认的方案。
- `reference/` 只读；严禁把其中代码复制进 packages/ 与 playground/（协议传染性，见 AGENTS.md）。
- 文档归属：长期事实与规范进 `docs/`（规范进 `docs/dev/`），阶段计划与拆解进 `docs/plan/`。

## 3. 分包职责与依赖方向

```
arco  ──依赖──▶  vue  ──依赖──▶  core
                        ▲
              playground ──依赖──┘
```

- **core**：纯 TS，零 UI/框架依赖。产出类型、窗口状态机、栅格化引擎、主题 token、应用注册表、事件总线、纯函数工具。全部 reducer 风格（state + action → new state），禁止框架 API（reactive/ref/onMounted 等）。
- **vue**：依赖 vue + core + pinia。产出 `Yw*` 组件、composables、Pinia stores（包装 core 状态机）、`createYudreamWebOS()` 插件、默认 `YwUiAdapter` 实现与基础样式。**不得依赖任何第三方 UI 组件库**。
- **arco**：依赖 `@arco-design/web-vue` + vue 层。仅实现 `YwUiAdapter` 接口（菜单/对话框/提示/搜索输入等），API 与默认实现对齐，宿主 `uiAdapter: arcoAdapter` 一键切换。
- 依赖方向单向，禁止反向依赖（core 不得依赖 vue，vue 不得依赖 arco）。

## 4. 编码约定

### 4.1 组件（vue 层）

- 组件一律 `Yw` 前缀（`YwWindow`/`YwDock`），文件名 PascalCase 与组件名一致，目录 `packages/vue/src/components/<name>/`。
- 组件内需要菜单/弹窗/提示/搜索输入等交互件时，一律通过 `inject(YW_UI_ADAPTER_KEY)` 取适配器，**禁止直写第三方 UI 库标签**。
- 复杂交互逻辑抽 composable（`packages/vue/src/composables/`），组件保持薄。
- 窗口/栅格拖拽缩放手写 Pointer Events：统一封装 `usePointerDrag` / `usePointerResize` composable，禁止散落手写 mouse 事件。
- 组件通信走 Pinia store / 事件总线，禁止跨组件直接引用内部实现。

### 4.2 core 状态机

- 全部纯函数：`transition(state, action) → new state`，状态对象不可变（immer 风格手写展开，不引 immer）。
- 无副作用：状态机不触碰 localStorage/DOM/定时器；序列化、持久化、钳制所需视口尺寸均由调用方（vue 层 store）传入。
- 每个 reducer 配 vitest 单测：覆盖状态迁移、边界输入（零尺寸/负坐标/越界）、z-order 焦点竞争。

### 4.3 样式

- token 唯一来源：`packages/core/src/theme/tokens.ts` 的亮/暗 oklch 变量（`--yw-*`），vue 层通过 UnoCSS preset 注入 `:root` / `.dark`。
- 组件样式：UnoCSS 原子类优先；复杂场景（毛玻璃层级、动画关键帧）用 scoped SCSS。
- 毛玻璃/阴影/圆角/动效数值统一引用 token，禁止魔法数。

### 4.4 类型

- 对外 API 全量 TS 类型；core 的类型定义在 `packages/core/src/types/`，vue/arco 只做 re-export 或扩展，禁止重复定义。
- 公开 API 变更必须同步更新 docs/dev/app-adapter.md 中的示例。

## 5. Git 规范

- 分支：`main` 稳定；功能分支 `feat/xxx`，修复 `fix/xxx`
- 提交信息：中文，格式 `类型: 描述`（feat/fix/docs/refactor/chore），如 `feat: 窗口状态机支持多实例`
- 禁止提交：`docs/local.md`、`reference/`、`.env*`、构建产物、真实凭证
- 提交前自查：无调试日志、无注释掉的死代码、无 TODO 无主的临时代码

## 6. 文档与计划

- 新模块开发前：docs/plan/ 下先有计划（目标/工作项/验收标准），经确认后动工
- 计划完成后在计划文档标注状态；长期结论沉淀回 docs/ 或 docs/dev/
- 对外 API（manifest 字段、插件选项、adapter 接口）变更同步更新 docs/dev/app-adapter.md
