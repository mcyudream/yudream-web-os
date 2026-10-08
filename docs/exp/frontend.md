# 前端经验（frontend.md）

### Vite lib 模式的 CSS 默认拆分为独立 asset，组件库「引包即带样式」需要 libInjectCss

- **现象**：vue 包构建出 `dist/index.js` + `dist/index.css`，宿主只 import js 时组件全部裸奔（无样式，Dock/毛玻璃/窗口全部塌掉）。
- **根因**：Vite lib mode 默认把 CSS 提取为独立 asset；`injectCss: true`（vite 8 build.lib 选项）只对 CSS-in-JS chunk 生效，vite lib 的 CSS 是 rolldown 处理的 asset，入口 chunk 里没有任何注入代码。
- **规避/解决**：使用 `vite-plugin-lib-inject-css`（MIT，v2.2+）——它按 chunk 把对应 CSS 以 `document.createElement('style')` 内联到每个入口。自研 generateBundle 插件行不通：lib 模式下 CSS 已被编译成 JS chunk（`styles-xxx.js`）而非 CSS asset，遍历 bundle 拿不到 `.css`。
- **来源**：2026-10-07 M4 桌面渲染验证；packages/vue/vite.config.ts。

### UnoCSS presetIcons 图标集合必须显式配置 loader（pnpm 严格依赖下）

- **现象**：`i-lucide-info` 类名出现在 DOM，但元素 `width/height=0`、无 mask-image，图标全空白。
- **根因**：presetIcons 默认从 `@iconify-json/*` 或 `@iconify/json` 解析集合数据；monorepo 根 devDeps 未装对应数据集（或装了但集合名未注册）时，规则生成不出 mask；pnpm 严格 node_modules 下不像 npm 有提升兜底。
- **规避/解决**：根安装 `@iconify-json/lucide` 并在 uno.config 的 `presetIcons({ collections: { lucide: () => import('@iconify-json/lucide/icons.json').then(m => m.default) } })` 显式注册；改配置后必须清 `node_modules/.vite` 缓存并重启 dev server（UnoCSS 配置有缓存）。
- **来源**：2026-10-07 M4 图标空白排查；uno.config.ts。

### Pinia store 在组件外调用而 pinia 未安装 → 静默白屏（无报错）

- **现象**：playground 打开页面空白，`#app` innerHTML 为空，console 无错误。
- **根因**：`useAppsStore()` 等在 `createYudreamWebOS().install` 内被调用；宿主忘装 Pinia（`app.use(createPinia())`）时 getActivePinia 为空，Pinia 内部抛错被 Vue 吞掉或未冒泡，表现为挂载即白屏。
- **规避/解决**：宿主必须先 `app.use(createPinia())` 再 `app.use(createYudreamWebOS())`；README 快速上手已写明。后续可在 install 里检测 `getActivePinia()` 为空时给出明确报错（V2）。
- **来源**：2026-10-07 M4 白屏排查；playground/src/main.ts。

### pnpm-workspace.yaml catalog 版本号不能靠记忆写，必须查 registry 实况

- **现象**：`pnpm install` 报 `ERR_PNPM_NO_MATCHING_VERSION`（stylelint-config-standard-vue@^14.0.0 不存在）。
- **根因**：凭 ypanel 记忆写的 catalog 版本（stylelint 14 系、vitest 4、vite-plugin-dts 4）全部过时——stylelint-config-standard-vue 实际最新 2.0.0，vitest 已到 5，vite-plugin-dts 到 5。
- **规避/解决**：初建仓库时批量 `npm view <pkg> version` 核实；另注意 eslint 插件 `pnpm/yaml-no-unused-catalog-item` 会强制清理未使用 catalog 项（ypanel 有 `pnpm/yaml-enforce-settings: off` 豁免，本仓未豁免）。
- **来源**：2026-10-07 M0 install 失败；pnpm-workspace.yaml。

### vite-plugin-dts 在 monorepo 包里生成 dist/src/*.d.ts 嵌套目录

- **现象**：package.json `types: ./dist/index.d.ts` 报找不到声明，实际生成在 `dist/src/index.d.ts`。
- **根因**：dts 插件默认按 tsconfig include 的根目录映射输出结构，include 含 `src/**` 与 `test/**` 时输出保留 `src/` 层级。
- **规避/解决**：`dts({ entryRoot: 'src', exclude: ['test/**'] })`；否则声明文件位置与 exports 不匹配。
- **来源**：2026-10-07 M0 构建修正；packages/*/vite.config.ts。

### iframe 加载态不能做成 v-else-if 分支（@load 死锁）

- **现象**：内置浏览器输入网址后永远停在「正在加载」，iframe 从未出现。
- **根因**：`v-if="loading"` 显示加载层、`v-else` 渲染 iframe——loading 为 true 时 iframe 不存在，`@load` 永远不会触发把 loading 置回 false，形成死锁。
- **规避/解决**：iframe 常驻渲染（有 url 就渲染），loading 作为覆盖层叠在上面；`@load` 只负责去掉覆盖层。凡是「异步事件驱动状态」的 UI 都不要把事件源元素条件卸载。
- **来源**：2026-10-07 M7 浏览器调试；packages/vue/src/components/browser/index.vue。

### 窗口布局持久化恢复后组件载荷丢失（内存态 vs 快照态）

- **现象**：刷新后恢复的窗口显示「该应用未提供组件内容」。
- **根因**：localStorage 快照只含窗口几何（core 状态机可序列化部分），组件载荷存在内存 Map 里，刷新即失。
- **规避/解决**：挂载后从应用注册表按 appKey 重建载荷（watch appsStore.all——宿主注册发生在桌面组件挂载之后，子组件 onMounted 先于父组件 onMounted 执行，不能只在 mount 时做一次）；无法重建的（url/route 类窗口）直接关闭。
- **来源**：2026-10-07 M7 恢复验证；packages/vue/src/components/desktop/index.vue（reconcilePayloads）。

### setAccent 覆盖 --yw-primary 为 hex 会让 oklch(var(--yw-primary) / alpha) 全部失效

- **现象**：系统设置里选了强调色后，侧栏选中项、模式卡片选中框等所有 `oklch(var(--yw-primary) / 0.9)` 写法的背景全部变透明。
- **根因**：`oklch()` 的通道参数只接受数字/L/C/H，不接受 hex 字符串；`oklch(#FF5257 / 90%)` 是非法值，整条声明被丢弃。token 的两种消费形态（`oklch(var(--x))` 与 `oklch(var(--x) / a)`）要求变量必须保持通道三元组格式。
- **规避/解决**：Accent 接口对外收 hex（友好），内部用 `hexToOklchChannels()`（sRGB→线性→OKLab→LCH 标准数学，core/utils/color.ts）转成 `"L C H"` 通道再 setProperty。任何要覆盖 oklch 通道型 token 的 API 都要做同样转换。
- **来源**：2026-10-07 系统设置 Accent Color 联调；packages/core/src/utils/color.ts。

### playground 直连 workspace 包的 dist，UnoCSS 扫描不到组件源码里的图标类

- **现象**：manifest 字符串里的 `i-lucide-globe` 图标空白，但 .vue 模板里的图标正常。
- **根因**：playground import '@yudream/yudream-webos-vue' 解析到 packages/vue/dist/index.js；uno.config 的 content.pipeline 只 include 了 `packages/vue/src/**`，dist 中的图标类扫描不到。
- **规避/解决**：playground/vite.config.ts 给三个 workspace 包加 resolve.alias 直指 `packages/*/src`——UnoCSS 扫描源文件、包源码改动也能热更（monorepo playground 标准做法）。
- **来源**：2026-10-07 图标缺失排查；playground/vite.config.ts。

### 子组件 onMounted 早于父组件 onMounted：恢复类逻辑不能只挂在 mount 上

- **现象**：刷新后恢复的窗口内容偶发为空，且注册表 watch 时序不定。
- **根因**：Vue 挂载顺序是子先父后；YwDesktop（子）onMounted 时宿主（父）的 apps.register 尚未执行，恢复的窗口查不到 manifest。
- **规避/解决**：`watch(appsStore.all, reconcilePayloads, { deep: true })` 等注册表变化后补齐；appKey 尚未注册的窗口保留等待，确认存在但非 component 类型才关闭。
- **来源**：2026-10-07 持久化恢复联调；packages/vue/src/components/desktop/index.vue。

### 照抄风格的正确姿势：把参考站的前端资产拉下来逐行提取，而不是凭截图目测

- **现象**：凭截图“目测对齐”参考站风格，两轮返工仍被指出窗口/设置面板丑（侧栏贴边无材质、卡片无层次、模式选择图简陋）。
- **根因**：截图只能看到最终像素，拿不到布局数值（宽度/margin/圆角/字号/阴影层数）与组件结构（谁包谁、hover 态、选中态变量）。
- **规避/解决**：参考站 DOM 带有源码路径标注（`code-path` 属性）；直接下载其 `assets/*.css` 与 `assets/*.js` 到 reference/（已 gitignore），从 CSS 提取 `:root` 变量表与 `.{class}` 规则，从 JS bundle 搜索组件实现（`className` 字符串 + inline style 对象）。本次据此拿到精确规格：侧栏 216px/margin 10px/radius 12/glass blur(30)、内容 640px 居中列、卡片 `bg var(--control-bg) + 0 0 0 0.5px var(--separator)`、行 38px/0.5px 分隔线、模式艺术图 76x52 双 pane 结构、暗色 `--window-bg:#2B2B2D / --control-bg:#3A3A3C`。一次迁移到位。
- **来源**：2026-10-07 系统设置逐行迁移；reference/macos27/。

### 按架构文档重写的三层踩坑实录（vue binding / arco ui / apps）

- **事件桥接断裂**：`WindowManager` 构造参数 `events` 是 private，`createWebOSInstance` 里 `new WindowManager()` 没传 → `wmWatch` 读到 undefined 直接 return → `webos:window:*` 事件全部丢失 → compat store 的 `sync()` 永不触发 → 窗口开了但 UI 不渲染（`windows=0`）。修：构造后立即覆写 `wm.events = {}` 再桥接。教训：桥接类包装必须断言内部状态非空。
- **运行时注册绕过规格登记**：宿主 `registry.register(todoApp)` 只进注册表，没登记 `wm.registerSpec` → 开窗标题 fallback 到 appId、defaultSize 失效。修：`useAppRegistry().register` 与 compat store 同构登记（spec + appComponents + widgets）。
- **覆盖层吞点击**：WidgetHost 透明容器 `pointer-events: auto` 挡住右侧全部桌面图标双击；且它默认放右上与图标网格重叠。修：容器 `pointer-events: none` 仅卡片/按钮 auto；位置改左侧（对齐参考站）。
- **vitest HMR 假阴性**：浏览器长连页面经多次热更后模块状态混乱（快捷键 hit:true 但 handler 不跑），刷新页面后同代码全部正常。排查这类"时灵时不灵"先刷新再定位。
- **来源**：2026-10-07 按架构文档重写全库联调；packages/vue/src/provider.ts、packages/arco/src/stores/compat.ts。

### vite 8 oxc 在 Windows monorepo 下 tsconfig 自动发现失败的绕过

- **现象**：`vite build` 报 `[TSCONFIG_ERROR] Failed to load tsconfig '../../../tsconfig.json': Tsconfig not found`，失败的 .vue 文件集合随 import 图漂移、数量恒定（= worker 数），重试/串行均无效。
- **根因**：vite 8 的 oxc transform（rust 侧）对 `lang="ts"` 源文件自动向上探测 tsconfig，在 pnpm monorepo + Windows 组合下探测基准目录错位（上一级工作区目录无 tsconfig 即炸）。
- **规避/解决**：在 **工作区父目录**（workspace 根的上一级）放一份项目 tsconfig 副本，恰好命中 oxc 的 3 级向上探测；或给每个包 `vite.config` 顶层设 `tsconfig: './tsconfig.json'`（vite 8 新选项）。另注意 `vite-plugin-dts` 需显式 `include: ['src/**/*.ts', 'src/**/*.vue']` 否则 .vue 声明文件可能不生成。
- **来源**：2026-10-07 六包构建联调；packages/*/vite.config.ts。

### 运行时字符串图标类的扫描链：alias 到 dist 会漏扫；git index 可当"无 commit 恢复源"

- **现象**：11 个桌面图标只有 7 个有图形，终端/计算器/应用商店等是纯色 tile。
- **根因**：缺的 4 个类名只存在于 packages/apps/src/index.ts；playground vite alias 漏配 apps 包 → 解析到 dist/index.js → dist 不在 UnoCSS content.pipeline.include（packages/*/src）→ 类名永不提取。图标类是运行时字符串，**必须让"定义它的源文件"进入扫描范围**。
- **规避/解决**：alias 补 apps → src；uno.config include 覆盖所有包 src（正则用 `[/\\]` 兼容 Windows 分隔符，避免 eslint e18e 静态正则规则报错）。新增内置应用后若图标缺失，先查"定义类名的文件是否在扫描链"。
- **git 技巧**：无 commit 仓库中已 `git add` 的旧版源码可用 `git cat-file -p ":path"` 恢复——本次组件从 vue 包迁 arco 包时靠它找回全部文件。
- **来源**：2026-10-07 图标缺失修复；playground/vite.config.ts、uno.config.ts。

### 拖拽系统联调三层坑：getter-only 注入失效、window 级监听、pointerId 配对

- **现象**：拖拽 ghost 不出现 / move 不跟手 / up 不提交换位，三种症状各有根因。
- **根因与修**：① `Object.defineProperty(handle, 'container', { get })` 只读——mounted 里 `handle.container = dom` 在严格模式静默失败，DOM 永远是 null（需给 setter）。② pointermove/up 监听在容器上，拖出图标后目标变成兄弟层，事件不冒泡进容器 → 监听必须挂 window。③ onPointerUp 校验 `pointerId === down.pointerId`——合成测试时 down/up 用不同 id 会静默 early-return。
- **调试法**：状态机类 bug 用"计数埋点 + 二分"快速定位断点（__pdCount → __setStateCalled → __moveTo 三级埋点一次锁定）。
- **来源**：2026-10-07 桌面拖拽联调；packages/arco/src/components/desktop/drag.ts。

### 双击被拖拽吞掉：pointerdown 无阈值进入拖拽态是桌面图标交互的经典错误

- **现象**：桌面图标双击打不开应用，反而"和旁边应用换位置"。
- **根因**：pointerdown 立即进入拖拽态（设置 ghost 并激活），pointerup 无条件提交 moveTo。双击序列中微小的鼠标位移会让落点算到相邻格 → swap 换位 + onChange 触发重建；重建后两次 click 目标不同 → 浏览器不合成 dblclick → 打不开。
- **规避/解决**：① 拖拽激活阈值（位移 >5px 才 setState 激活，pending 模式），未激活的 pointerup 不提交；② DesktopModel.moveTo 同位移动 no-op 不通知（避免 pointerup 原位提交触发重建）；③ 桌面默认排布要有 rowsPerColumn（每列行数上限按视口高计算），列满换列，否则图标一列到底。
- **来源**：2026-10-07 桌面双击/拖拽联调；packages/arco/src/components/desktop/drag.ts、packages/core/src/desktop/desktop-model.ts。


### 语义色 token 双包断裂：tokensToStyle 包 oklch() 导致全部 oklch(var()) 消费失效

- **现象**：右键菜单/设置侧栏选中/Dock tooltip 背景透明、白字看不清、选中无高亮——大量 color/background 声明静默失效。
- **根因**：token 注入时语义色被包成完整值（--yw-primary: oklch(0.624 …)），而消费端写的是 oklch(var(--yw-primary) / 30%)——展开成 oklch(oklch(…) / 30%) 非法，整条声明被浏览器丢弃。且失效是静默的（无任何报错），组件看起来只是丑。
- **规避/解决**：**契约统一为：语义色 token = oklch 通道三元组（不包 oklch）**。tokensToStyle 原样输出；消费端两种合法形式：oklch(var(--x)) / oklch(var(--x) / a)。实体值 token（--yw-control-bg/--yw-window-bg/--yw-label-*/--yw-shadow-* 等）保持完整值、直接 var() 消费。批量审计脚本：grep var(--yw-(通道名单)) 排除 oklch( 前缀，逐处包 oklch()。改完后浏览器验证菜单实底/侧栏高亮/tooltip 全部恢复。
- **教训**：设计 token 系统时必须先写死「每个 token 的输出格式契约」和「每种消费形式的期望输入」，否则两边各自演化必然断裂且无报错。
- **来源**：2026-10-07 视觉问题批量修复；packages/core/src/theme/tokens.ts、packages/vue/src/system/settings.ts。

### compat store 每次调用创建独立副本——多组件状态不同步的隐形墙（已单例化）

- **现象**：窗口拖拽时 wm 内部 bounds 已正确变化，但 UI 完全不动；moveTo 逐帧调用全部成功却只有首帧生效。
- **根因**：`useWindowsStore()`（compat 层）**每次调用都 `reactive({...})` 创建新 store**——desktop、dock、YwWindow 各持独立副本。desktop 的副本监听了 bus 事件做 sync，但事件列表漏了 `window:move/resize`；其它副本（如 YwWindow 拖拽回调里的）更新的是自己的副本，desktop 渲染的是自己的——状态墙。另外每次调用还会**重复挂 7 个 bus 监听**，组件越多 sync 风暴越重。
- **规避/解决**：①（2026-10-08 已落地）四个 compat store 全部改为 **per-instance 单例**：`WeakMap<WebOSInstance, store>` 缓存，同实例所有组件共享同一份状态与订阅，bus 监听只挂一次；工厂函数保持独立可测。② sync 事件列表必须覆盖**所有**会改变渲染状态的 wm 操作（open/close/focus/blur/move/resize/state-change 缺一不可）。③ sync 时浅拷贝每个窗口对象（wm 直接 mutate bounds，不拷贝新引用 Vue 检测不到）。
- **来源**：2026-10-07 窗口拖拽联调；2026-10-08 YPanel M29 接入前重构；packages/arco/src/stores/compat.ts。

### 「主题持久化不恢复」结案：不是 load 卡死，是防抖写入在刷新/后台节流下丢失

- **现象**：2026-10-07 记录为「settings.load() 在 await persist.get 后静默不执行，刷新后主题不恢复」。2026-10-08 浏览器实证（playground + IAB）：load/恢复链路**完全正常**（种入 `{mode:'light'}` + 系统深色偏好 → 刷新后 light 生效，持久化值压过系统偏好）；真正的坑是**切完主题立刻刷新时，300ms 防抖写还没落盘**，数据根本没进 localStorage——表象酷似「恢复失败」。遮挡/后台窗口里 setTimeout 节流会把这笔写再拖长（实测漂移 100ms~分钟级），放大丢失窗口。
- **根因**：防抖写入没有「页面要走」兜底；之前的「await 卡死」判断是插桩误诊。
- **规避/解决**：`PersistenceAdapter` 增加可选 `flushNow()`；`createWebOS().install` 自动接线 `visibilitychange(hidden)` + `pagehide` → 强制落盘（WeakSet 防重复挂）。回归方法：切主题后 **0 等待立即 reload**，localStorage 应有刚写的值。自动化切换主题用合成指针序列（trusted input 见下条）。
- **来源**：2026-10-08 主题持久化实证排查（YPanel M29 前置修复）；packages/core/src/persist/persistence.ts、packages/vue/src/provider.ts。

### 遮挡/后台的 IAB 里 CUA 可信输入不到达页面：交互自动化一律走合成指针序列

- **现象**：`tab.cua.click()`「成功」返回但页面零 click 事件（capture 监听证实），控制中心点不开；同坐标合成 `dispatchEvent` 一次到位。
- **根因**：遮挡/后台状态的 IAB 不把可信输入路由进渲染进程（与 rAF 冻结同族）；elementFromPoint 命中链干净也不代表输入能到达。
- **规避/解决**：点击一律 `evaluate` 内对目标派发完整序列 `pointerdown → mousedown → pointerup → mouseup → click`（自绘组件足够；reka 组件见 ypanel exp 同款条目）；验证事件是否到达先挂 `document.addEventListener(..., true)` 计数。另注意 domSnapshot 的无障碍树**不含**控制中心等无 role 的覆盖层，判断「面板开没开」用 `querySelector('.yw-cc-overlay')` 而非快照。
- **来源**：2026-10-08 playground 联调；浏览器自动化环境限制，非库缺陷。

### scope 键双前缀：调用方拼 prefix + PersistenceAdapter 内部又拼一次

- **现象**：localStorage 出现 `playground.playground.dock` 双前缀键，读取方按单前缀查 → 永远 null，持久化"看似接了实则不工作"。
- **根因**：scopeKey() 在调用方拼了 `${storagePrefix}.dock`，而 LocalStoragePersistence.fullKey 又拼一次 prefix。读写双方对「key 是否含 prefix」约定不一致。
- **规避/解决**：**契约统一——调用方 key 只传 scope 名（'dock' / 'widgets' / 'system' / 'windows.session' / 'desktop.layout'），prefix 隔离完全由 PersistenceAdapter 内部管理**（§8 设计：key 前缀即 scope）。写入 provider.ts 统一装配，各组件/调用方不再自己拼 storagePrefix。
- **来源**：2026-10-07 全 scope 持久化接线；packages/vue/src/provider.ts。
