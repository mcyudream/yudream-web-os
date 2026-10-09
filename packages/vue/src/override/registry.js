import { inject, provide } from 'vue';
/** 可覆盖组件 key 全量清单（首版） */
export const UI_COMPONENT_KEYS = [
    'WindowFrame',
    'WindowTitleBar',
    'DesktopItem',
    'DesktopFolder',
    'Dock',
    'DockItem',
    'Launchpad',
    'LaunchpadItem',
    'MenuBar',
    'MenuBarExtra',
    'ControlCenter',
    'NotificationCenter',
    'FinderSidebar',
    'FinderToolbar',
    'FinderView',
    'WidgetHost',
    'WidgetGallery',
    'ContextMenu',
];
export const UI_REGISTRY_KEY = Symbol('yw-ui-registry');
/** 全局注册表（供 ui-arco 渲染时查询；app 级 provide 合并） */
const globalRegistry = {};
export const uiRegistry = {
    /** 覆盖组件（连窗口边框都能换） */
    override(key, comp) {
        globalRegistry[key] = comp;
    },
    /** 取生效组件：app 级覆盖 > 全局覆盖 > 默认实现 */
    resolve(key, appOverrides, fallback) {
        return appOverrides?.[key] ?? globalRegistry[key] ?? fallback;
    },
    clear() {
        for (const key of Object.keys(globalRegistry)) {
            delete globalRegistry[key];
        }
    },
};
/** Provider 内提供 app 级覆盖（与全局 uiRegistry 合并生效） */
export function provideUIRegistry(overrides) {
    provide(UI_REGISTRY_KEY, { overrides });
}
export function useUIRegistry() {
    return inject(UI_REGISTRY_KEY, { overrides: {} });
}
