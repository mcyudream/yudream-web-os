# YudreamWebOS 包管理规范

> 适用范围：core / vue / arco 三包与 playground。
> 目标：依赖可审计、可复现、不被协议传染；core 零依赖可移植。

## 1. pnpm 与版本

- **pnpm 12** 强制（根 `package.json` `packageManager` 锁定 + `preinstall` 拦截 npm/yarn），`pnpm-lock.yaml` 必须提交；禁止混用产生多 lockfile
- Node 版本：最新 LTS（当前 24），写入 `.node-version` 与 `engines`
- 版本统一管理：`pnpm-workspace.yaml` 的 `catalog` 锁定全仓唯一版本，包内依赖一律 `catalog:` 引用，禁止包内手写版本号
- `dependencies`（运行时）与 `devDependencies`（构建/工具）严格分开；运行时代理新增需在 PR/任务说明中写明体积影响

## 2. 分包依赖红线

| 包 | 允许依赖 | 禁止 |
|---|---|---|
| core | 零运行时依赖（纯 TS 标准库）；dev 仅 vitest/typescript | 任何框架（vue/react）、任何 DOM/Node API 以外的环境假设、UI 组件库 |
| vue | vue、pinia、core、es-toolkit、mitt、clsx、tailwind-merge、class-variance-authority | 第三方 UI 组件库（arco/element/naive/tdesign 等） |
| arco | `@arco-design/web-vue`、vue 层 | vue 层未准入的新依赖 |
| playground | 三包 + arco + 任意演示依赖（dev 为主） | — |

## 3. 依赖准入（新增第三方库前必须过）

1. **许可证白名单**：MIT / BSD / Apache-2.0 / ISC ✅；**GPL/AGPL/SSPL ❌**（传染性）；自定义/未知许可证逐案评审
2. 维护状态：近一年有提交、无未修复的高危 CVE
3. 能用标准能力解决的不引库（如拖拽用 Pointer Events 而非 sortablejs）；能在现有依赖内解决的不加新库
4. 新增依赖需在 PR/任务说明中写明：用途、许可证、替代方案为何不行

## 4. 关键领域选型基线

| 领域 | 基线 | 备注 |
|---|---|---|
| 工具函数 | es-toolkit | 替代 lodash |
| 事件总线 | mitt | 类型化封装在 core |
| 类名组合 | clsx + tailwind-merge + class-variance-authority | shadcn 风格变体 |
| 浏览器应用 | 原生 iframe sandbox | 禁止引无头浏览器/引擎 |
| 图标 | @iconify/vue（宿主自备 icon 集） | 库内只内置少量系统图标 SVG |
| 拼音搜索 | 可选适配接口 | core/vue 不硬依赖 pinyin-pro，由宿主注入 |

## 5. 版本与审计

- 依赖升级：功能升级与安全升级分开提交，注明变更范围
- 定期 `pnpm audit`（后续进 CI）
- 发包前 `pnpm -r publish --dry-run` 验证文件清单（dist/d.ts/README/LICENSE）

## 6. 发布

- 版本统一由根 `bumpp` 管理，三包版本号随元包同步
- 仅发布 `dist/` + `README.md` + `LICENSE` + `package.json`；src/ 不发布（sourcemap 除外）
- npm `files` 白名单制，禁止 `files` 缺省（会把 tests/ 等打进包）
