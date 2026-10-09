import { YwBrowserApp, YwFinder, YwSettingsApp } from '@yudream/yudream-webos-arco';
import { defineAsyncComponent, defineComponent, h, markRaw } from 'vue';
import AppStore from './apps/app-store.vue';
import Calculator from './apps/calculator.vue';
import FinderApp from './apps/finder.vue';
import ImageViewer from './apps/image-viewer.vue';
import Notes from './apps/notes.vue';
import Terminal from './apps/terminal.vue';
import TextEditor from './apps/text-editor.vue';
import { builtinWidgets } from './widgets/builtin';
/** 访达 */
export const finderApp = {
    id: 'finder',
    name: '访达',
    icon: 'i-lucide-folder',
    iconBg: 'linear-gradient(135deg, #5FB3F9 0%, #1263E9 100%)',
    component: markRaw(YwFinder),
    singleton: false,
    defaultSize: { width: 920, height: 600 },
    minSize: { width: 640, height: 400 },
    keywords: 'fangda finder files wenjian',
    category: 'system',
    menus: {
        appMenus: [
            { id: 'file', label: '文件', submenu: [{ id: 'new-folder', label: '新建文件夹', shortcut: 'Cmd+N' }, { id: 'new-file', label: '新建文件' }] },
            { id: 'view', label: '显示', submenu: [{ id: 'as-icons', label: '图标' }, { id: 'as-list', label: '列表' }, { id: 'as-columns', label: '分栏' }] },
            { id: 'go', label: '前往' },
        ],
    },
    dock: { showInDock: true, contextMenu: [{ id: 'open-documents', label: '打开文稿' }] },
    launchpad: { show: true, order: 1 },
    fileHandlers: ['folder'],
};
/** 系统设置 */
export const settingsApp = {
    id: 'settings',
    name: '系统设置',
    icon: 'i-lucide-settings',
    iconBg: 'linear-gradient(135deg, #9A9AA5 0%, #5C5C66 100%)',
    component: markRaw(YwSettingsApp),
    singleton: true,
    defaultSize: { width: 880, height: 600 },
    minSize: { width: 720, height: 480 },
    keywords: 'shezhi settings system xitong',
    category: 'system',
    menus: { appMenus: [{ id: 'settings', label: '设置', submenu: [{ id: 'export', label: '导出布局 JSON' }] }] },
    dock: { showInDock: true },
    launchpad: { show: true, order: 90 },
};
/** 浏览器（多标签） */
export const browserApp = {
    id: 'browser',
    name: '浏览器',
    icon: 'i-lucide-globe',
    iconBg: 'linear-gradient(135deg, #41A8F8 0%, #0B63D8 100%)',
    component: markRaw(YwBrowserApp),
    singleton: false,
    multiInstance: true,
    defaultSize: { width: 1080, height: 720 },
    keywords: 'liulanqi browser web wangye',
    category: 'develop',
    dock: { showInDock: true },
    launchpad: { show: true, order: 20 },
};
/** 启动台（注册为应用以可从 Dock 启动；全屏覆盖层由 ui 层 YwLaunchpad 提供） */
export const launchpadApp = {
    id: 'launchpad',
    name: '启动台',
    icon: 'i-lucide-layout-grid',
    iconBg: 'linear-gradient(135deg, #B470F2 0%, #7B3FD4 100%)',
    component: markRaw(defineComponent({ render: () => h('div', { style: 'display:grid;place-items:center;height:100%' }, '启动台由 Dock/F4 呼出（覆盖层）') })),
    singleton: true,
    defaultSize: { width: 400, height: 300 },
    keywords: 'qidongtai launchpad',
    category: 'system',
    launchpad: { show: false },
};
/** 终端 */
export const terminalApp = {
    id: 'terminal',
    name: '终端',
    icon: 'i-lucide-square-terminal',
    iconBg: 'linear-gradient(135deg, #3A3A3C 0%, #1C1C1E 100%)',
    component: markRaw(Terminal),
    singleton: false,
    multiInstance: true,
    defaultSize: { width: 700, height: 440 },
    keywords: 'zhongduan terminal shell mingling',
    category: 'develop',
    launchpad: { show: true, order: 30 },
};
/** 备忘录（数据存 VFS /Documents/notes，附带日历小组件演示 widgets 注册） */
export const notesApp = {
    id: 'notes',
    name: '备忘录',
    icon: 'i-lucide-notebook-pen',
    iconBg: 'linear-gradient(135deg, #FFC600 0%, #F7821B 100%)',
    component: markRaw(Notes),
    singleton: false,
    defaultSize: { width: 760, height: 520 },
    keywords: 'beiwanglu notes biji',
    category: 'tool',
    launchpad: { show: true, order: 40 },
    widgets: [builtinWidgets[1]],
};
/** 文本编辑器（.txt/.md fileHandler 路由） */
export const textEditorApp = {
    id: 'text-editor',
    name: '文本编辑',
    icon: 'i-lucide-file-text',
    iconBg: 'linear-gradient(135deg, #E3E3E8 0%, #9898A1 100%)',
    component: markRaw(TextEditor),
    singleton: false,
    multiInstance: true,
    defaultSize: { width: 720, height: 520 },
    keywords: 'wenbenbianji text editor',
    category: 'tool',
    launchpad: { show: true, order: 50 },
    fileHandlers: ['txt', 'md'],
};
/** 图片查看器 */
export const imageViewerApp = {
    id: 'image-viewer',
    name: '图片查看',
    icon: 'i-lucide-image',
    iconBg: 'linear-gradient(135deg, #4ED4D4 0%, #1D9FA8 100%)',
    component: markRaw(ImageViewer),
    singleton: false,
    multiInstance: true,
    defaultSize: { width: 800, height: 560 },
    keywords: 'tupian image viewer',
    category: 'media',
    launchpad: { show: true, order: 60 },
    fileHandlers: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'],
};
/** 计算器（小窗口演示） */
export const calculatorApp = {
    id: 'calculator',
    name: '计算器',
    icon: 'i-lucide-calculator',
    iconBg: 'linear-gradient(135deg, #FFAD52 0%, #F2701D 100%)',
    component: markRaw(Calculator),
    singleton: true,
    defaultSize: { width: 300, height: 440 },
    minSize: { width: 260, height: 380 },
    keywords: 'jisuanqi calculator',
    category: 'tool',
    launchpad: { show: true, order: 70 },
};
/** 应用商店（动态注册演示） */
export const appStoreApp = {
    id: 'app-store',
    name: '应用商店',
    icon: 'i-lucide-store',
    iconBg: 'linear-gradient(135deg, #FF74B7 0%, #E93A8C 100%)',
    component: markRaw(AppStore),
    singleton: true,
    defaultSize: { width: 680, height: 520 },
    keywords: 'yingyongshangdian app store shangdian',
    category: 'system',
    launchpad: { show: true, order: 95 },
};
/** 懒加载示例：Finder 异步变体（宿主可替换 component 为 () => Promise） */
export const finderAppLazy = {
    ...finderApp,
    id: 'finder',
    component: markRaw(defineAsyncComponent(() => Promise.resolve(FinderApp))),
};
/** 全量内置应用 */
export const builtinApps = [
    finderApp,
    launchpadApp,
    terminalApp,
    notesApp,
    textEditorApp,
    imageViewerApp,
    calculatorApp,
    settingsApp,
    browserApp,
    appStoreApp,
];
/** 全量内置小组件 */
export { builtinWidgets, calendarWidget, clockWidget, systemMonitorWidget } from './widgets/builtin';
