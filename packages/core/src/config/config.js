import { deepMerge } from '@yudream/yudream-webos-shared';
export const defaultConfig = {
    desktop: { arrangeMode: 'grid', bindVFS: true, collision: 'swap' },
    dock: { position: 'bottom', magnification: true, autohide: false, showRecent: true, iconSize: 48 },
    widgets: { placement: 'sidebar' },
    menubar: { showControlCenter: true, showClock: true },
    windows: { snapToEdge: true, sessionRestore: true },
    persist: { adapter: 'indexeddb', prefix: 'webos' },
};
/** 配置合并：默认值 ← 宿主覆盖（深合并） */
export function resolveConfig(override) {
    return deepMerge(defaultConfig, override);
}
