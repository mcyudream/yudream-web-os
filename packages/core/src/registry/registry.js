import { deepMerge } from '@yudream/yudream-webos-shared';
import { mergeMenuItems } from '../menu/menu-model';
/**
 * 应用注册表：register / registerAll / unregister / override（深合并） / get / list / queryByFileType。
 * override 是「可重载一切」的根基：宿主可只替换 Finder 的菜单而不重写整个应用。
 */
export class AppRegistry {
    apps = new Map();
    listeners = new Set();
    register(app) {
        this.apps.set(app.id, app);
        this.notify(app.id, 'register');
    }
    registerAll(apps) {
        for (const app of apps) {
            this.register(app);
        }
    }
    unregister(id) {
        if (this.apps.delete(id)) {
            this.notify(id, 'unregister');
        }
    }
    /**
     * 深合并覆盖已注册应用的任意字段（内置应用也能被宿主重载）。
     * menus 特殊处理：数组按条目 id 深合并（而非整体替换），覆盖单条菜单不丢其它项。
     */
    override(id, patch) {
        const existing = this.apps.get(id);
        if (!existing) {
            throw new Error(`[webos] override: app "${id}" not registered`);
        }
        const merged = deepMerge(existing, patch);
        const pm = patch.menus;
        if (existing.menus && pm) {
            merged.menus = {
                appMenus: mergeMenuItems(existing.menus.appMenus ?? [], pm.appMenus),
                overrides: { ...existing.menus.overrides, ...pm.overrides },
            };
        }
        this.apps.set(id, merged);
        this.notify(id, 'override');
    }
    get(id) {
        return this.apps.get(id);
    }
    list() {
        return [...this.apps.values()];
    }
    /** 按扩展名查可打开该类型文件的应用（fileHandlers 路由） */
    queryByFileType(ext) {
        const e = ext.toLowerCase().replace(/^\./, '');
        return this.list().filter(app => app.fileHandlers?.includes(e));
    }
    /** 桌面生态派生：Dock 显示项 */
    dockApps() {
        return this.list()
            .filter(app => app.dock?.showInDock !== false)
            .sort((a, b) => (a.launchpad?.order ?? 100) - (b.launchpad?.order ?? 100));
    }
    /** 启动台派生 */
    launchpadApps() {
        return this.list()
            .filter(app => app.launchpad?.show !== false)
            .sort((a, b) => (a.launchpad?.order ?? 100) - (b.launchpad?.order ?? 100));
    }
    onChange(fn) {
        this.listeners.add(fn);
        return () => this.listeners.delete(fn);
    }
    notify(appId, action) {
        this.listeners.forEach(fn => fn(appId, action));
    }
}
