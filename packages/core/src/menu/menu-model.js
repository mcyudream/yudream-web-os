/**
 * 菜单模型与合并器。
 * 一套 MenuItem 模型复用于：顶部菜单栏、Dock 右键、桌面右键、Finder 右键/工具栏下拉。
 * 合并规则：系统默认菜单 → 应用 appMenus → 宿主全局 overrides → 应用 overrides（按 id 深合并）。
 */
/** 按 id 深合并菜单项数组（dst 为基，src 覆盖；src 新条目追加） */
export function mergeMenuItems(dst, src) {
    if (!src?.length) {
        return dst;
    }
    const out = dst.map(item => ({ ...item }));
    for (const patch of src) {
        const idx = out.findIndex(x => x.id === patch.id);
        if (idx === -1) {
            out.push(patch);
            continue;
        }
        const current = out[idx];
        const merged = { ...current, ...patch };
        if (patch.submenu || current.submenu) {
            merged.submenu = mergeMenuItems(current.submenu ?? [], patch.submenu);
        }
        out[idx] = merged;
    }
    return out;
}
/**
 * 菜单合并器：系统默认 → 应用 → 宿主全局 → 应用级 overrides。
 */
export function mergeMenus(options) {
    let menus = mergeMenuItems(options.systemMenus, options.app?.appMenus);
    // 宿主全局 overrides（按顶层菜单 id 深合并）
    menus = mergeMenuItems(menus, Object.entries(options.hostOverrides ?? {}).map(([id, patch]) => ({ id, ...patch })));
    // 应用级 overrides
    menus = mergeMenuItems(menus, Object.entries(options.app?.overrides ?? {}).map(([id, patch]) => ({ id, ...patch })));
    return menus;
}
