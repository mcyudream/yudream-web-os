# 经验之谈（docs/exp/）

沉淀开发与调试中踩过的坑。规范（docs/dev/）说「必须怎么做」，这里说「为什么、别再踩」。

## 何时必须新增条目

- 排查超过半小时才定位的问题
- 环境/版本/平台差异坑（Windows/Linux、Node/pnpm 版本、浏览器行为差异）
- 从源码阅读或试错得出的、文档里没有的结论
- reference/ 参考项目里的坑及其规避方式

## 组织方式

一个主题一个文件，按需新增：`frontend.md`（Vue/UnoCSS/构建）、`release.md`（npm 发布）、`browser-iframe.md`（内置浏览器/iframe 沙箱）等。文件太多时按主题拆分子目录。

## 条目模板

```markdown
### 标题（一句话说清坑）

- **现象**：怎么表现出来的
- **根因**：为什么会这样
- **规避/解决**：正确做法
- **来源**：日期 + 任务/文件位置
```

## 与 docs/dev/ 的关系

经验稳定为「必须/禁止」的规则后，升级为 docs/dev/ 规范条目（规范中引用经验原文，原文保留不改）。

## 索引

- [frontend.md](./frontend.md) — Vite lib 样式注入、UnoCSS 图标集合、Pinia 缺 pinia 白屏、pnpm catalog 版本
