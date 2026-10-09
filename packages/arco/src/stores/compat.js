import * as core0 from '@yudream/yudream-webos-core';
import { useSystemSettings, useWebOS } from '@yudream/yudream-webos-vue';
import { computed, defineAsyncComponent, markRaw, reactive, ref, watch } from 'vue';
let require0Cache = null;
function require0Impl() {
    return core0;
}
function require0() {
    return require0Cache ?? (require0Cache = require0Impl());
}
/** 异步 loader → 异步组件缓存（keyed by loader 引用，避免每次渲染重建组件导致反复挂载） */
const asyncCompCache = new WeakMap();
/** 注册载荷归一化：函数 loader 归一化为 defineAsyncComponent（缓存），组件原样返回 */
function normalizeComponent(comp) {
    if (typeof comp !== 'function') {
        return comp;
    }
    let cached = asyncCompCache.get(comp);
    if (!cached) {
        cached = markRaw(defineAsyncComponent(comp));
        asyncCompCache.set(comp, cached);
    }
    return cached;
}
/** ── windows ── */
function createWindowsStore(os) {
    const { wm, appComponents, bus, config, persist } = os;
    const viewport = ref({ ...wm.getViewport() });
    /** 窗口内容载荷（windowId → 载荷）；恢复的窗口由 reconcile 从注册表重建 */
    const payloads = reactive(new Map());
    const persistSession = () => {
        void persist.set(`windows.session`, wm.serialize());
    };
    const store = reactive({
        wm,
        state: {},
        viewport,
        windows: new Proxy([], {}),
        visible: [],
        focusedId: null,
        runningApps: [],
        setViewport(v) {
            viewport.value = { ...v };
            wm.setViewport(v);
        },
        restore() {
            void persist.get(`windows.session`).then((snaps) => {
                if (snaps?.length) {
                    wm.restoreSession(snaps);
                    sync();
                }
            });
        },
        openComponent(payload) {
            // 单例聚焦
            const existing = wm.windowsOfApp(payload.appKey)[0];
            if (payload.singleton && existing) {
                wm.focus(existing.id);
                sync();
                return existing.zIndex;
            }
            const win = wm.open(payload.appKey, { title: payload.title });
            if (payload.component !== undefined) {
                payloads.set(win.id, { appId: payload.appKey, component: normalizeComponent(payload.component), title: payload.title });
            }
            void payload.multiInstance;
            void payload.defaultSize;
            sync();
            return win.id;
        },
        focus(id) {
            wm.focus(id);
            sync();
        },
        close(id) {
            wm.close(id);
            payloads.delete(id);
            sync();
        },
        toggleMinimize(id) {
            const win = wm.get(id);
            if (win?.state === 'minimized') {
                wm.restore(id);
            }
            else {
                wm.minimize(id);
            }
            sync();
        },
        toggleMaximize(id) {
            wm.maximize(id);
            sync();
        },
        moveTo(id, x, y) {
            wm.move(id, { x, y });
            sync();
        },
        resizeTo(id, rect) {
            wm.resize(id, rect);
            sync();
        },
        snap(id, zone) {
            wm.snap(id, zone);
            sync();
        },
        tileAll() {
            wm.tileAll();
            sync();
        },
        payloadOf(id) {
            const win = wm.get(id);
            if (!win) {
                return undefined;
            }
            // ① 窗口级载荷（openComponent / reconcile 写入）优先
            const attached = payloads.get(id);
            if (attached !== undefined) {
                return attached;
            }
            // ② 注册表组件载荷兜底（恢复会话 / 未走 openComponent 的路径），归一化后回写缓存
            const comp = appComponents.get(win.appId);
            if (comp === undefined) {
                return undefined;
            }
            const payload = { appId: win.appId, component: normalizeComponent(comp), title: win.title };
            payloads.set(id, payload);
            return payload;
        },
        attachPayload(id, payload) {
            payloads.set(id, {
                appId: payload.appId,
                title: payload.title,
                component: payload.component !== undefined ? normalizeComponent(payload.component) : undefined,
            });
        },
    });
    /** persist=false 用于创建时的首次同步：此时恢复流程尚未发生，写入会把空列表固化为会话 */
    function sync(persist = true) {
        if (persist) {
            persistSession();
        }
        const list = wm.list();
        // 关键：浅拷贝每个窗口（wm 直接 mutate bounds，不拷贝新引用 Vue 检测不到）
        store.windows = list.map(w => ({ ...w, bounds: { ...w.bounds } }));
        store.visible = store.windows.filter(w => w.state !== 'minimized');
        store.focusedId = wm.focusedWindow()?.id ?? null;
        store.runningApps = [...new Set(list.map(w => w.appId))];
        store.state = { windows: store.windows };
    }
    // 订阅 bus 事件同步（webos:window:*）——单例下只挂一次
    for (const ev of ['webos:window:open', 'webos:window:close', 'webos:window:focus', 'webos:window:blur', 'webos:window:move', 'webos:window:resize', 'webos:window:state-change']) {
        bus.on(ev, () => sync());
    }
    void config;
    sync(false);
    return store;
}
const windowsStores = new WeakMap();
export function useWindowsStore() {
    const os = useWebOS();
    let s = windowsStores.get(os);
    if (!s) {
        s = createWindowsStore(os);
        windowsStores.set(os, s);
    }
    return s;
}
/** ── apps ── */
function createAppsStore(os) {
    const { registry, openApp, ui, wm, appComponents, widgets } = os;
    const appsRef = ref(registry.list());
    registry.onChange(() => {
        appsRef.value = registry.list();
    });
    const store = reactive({
        state: {},
        apps: appsRef,
        dock: computed(() => registry.dockApps()),
        launchpad: computed(() => registry.launchpadApps()),
        all: {},
        register(app) {
            registry.register(app);
            // 运行时注册：登记窗口规格、组件载荷与附带小组件（与 createWebOSInstance 初始化同构）
            if (app.component !== undefined) {
                appComponents.set(app.id, app.component);
            }
            for (const w of app.widgets ?? []) {
                widgets.register(w);
            }
            wm.registerSpec(app.id, {
                appId: app.id,
                title: app.name,
                icon: app.icon,
                defaultSize: app.defaultSize,
                minSize: app.minSize,
                maxSize: app.maxSize,
                resizable: app.resizable,
                frameless: app.frameless,
                singleton: app.singleton,
                multiInstance: app.multiInstance,
                defaultPosition: app.defaultPosition,
            });
        },
        unregister(id) {
            registry.unregister(id);
        },
        setEnabled(id, enabled) {
            if (!enabled) {
                // 简化：禁用 = 从启动台隐藏（dock 保留）——完整 enable/disable 状态在持久化层
                void id;
                void enabled;
            }
        },
        openApp(id) {
            if (!registry.get(id)) {
                ui.message('error', '应用不存在');
                return false;
            }
            openApp(id);
            return true;
        },
    });
    const syncAll = () => {
        const map = {};
        for (const app of registry.list()) {
            map[app.id] = app;
        }
        store.all = map;
        store.state = { apps: map, disabled: [] };
    };
    registry.onChange(syncAll);
    syncAll();
    return store;
}
const appsStores = new WeakMap();
export function useAppsStore() {
    const os = useWebOS();
    let s = appsStores.get(os);
    if (!s) {
        s = createAppsStore(os);
        appsStores.set(os, s);
    }
    return s;
}
/** ── theme（系统设置包装） ── */
function createThemeStore(os) {
    const settings = os.settings;
    const { persist, bus } = os;
    const sys = useSystemSettings();
    const store = reactive({
        mode: computed(() => settings.mode),
        effectiveMode: computed(() => sys.effectiveMode.value),
        systemDark: computed(() => settings.systemDark),
        wallpaper: computed(() => settings.wallpaper),
        accent: computed(() => settings.accent),
        setMode(m) {
            sys.setMode(m);
            applyNow();
        },
        setSystemDark(v) {
            settings.systemDark = v;
            applyNow();
        },
        setWallpaper(w) {
            sys.setWallpaper(w);
            applyNow();
        },
        setAccent(color) {
            sys.setAccent(color);
            applyNow();
        },
        apply: applyNow,
    });
    function applyNow() {
        const root = document.documentElement;
        const dark = settings.mode === 'system' ? settings.systemDark : settings.mode === 'dark';
        root.classList.toggle('dark', dark);
        root.style.colorScheme = dark ? 'dark' : 'light';
        if (settings.accent) {
            const { hexToOklchChannels } = require0();
            const ch = settings.accent.startsWith('#') ? hexToOklchChannels(settings.accent) : settings.accent;
            root.style.setProperty('--yw-primary', ch);
            root.style.setProperty('--yw-ring', ch);
        }
        else {
            root.style.removeProperty('--yw-primary');
            root.style.removeProperty('--yw-ring');
        }
        bus.emit?.('webos:system:theme-change', { mode: dark ? 'dark' : 'light' });
    }
    watch(() => settings.mode, applyNow);
    void persist;
    return store;
}
const themeStores = new WeakMap();
export function useThemeStore() {
    const os = useWebOS();
    let s = themeStores.get(os);
    if (!s) {
        s = createThemeStore(os);
        themeStores.set(os, s);
    }
    return s;
}
const DEFAULT_SANDBOX = ['allow-scripts', 'allow-same-origin', 'allow-forms', 'allow-popups-to-escape-sandbox'];
/** 地址栏输入解析：URL / 补协议 / 搜索引擎回退 */
export function resolveInput(input, searchEngine) {
    const v = input.trim();
    if (!v) {
        return '';
    }
    if (/^https?:\/\//i.test(v)) {
        return v;
    }
    if (!/\s/.test(v) && /^[\w-]+(?:\.[\w-]+)+(?:\/\S*)?$/.test(v)) {
        return `https://${v}`;
    }
    return searchEngine.replace('{q}', encodeURIComponent(v));
}
function createBrowserStore(os) {
    const { openApp, wm } = os;
    const options = ref({});
    const sessions = reactive(new Map());
    const store = reactive({
        options,
        sessions,
        configure(opts) {
            options.value = { ...opts };
        },
        sessionOf(windowId) {
            let s = sessions.get(windowId);
            if (!s) {
                s = { url: '', history: [], index: -1, loading: false };
                sessions.set(windowId, s);
            }
            return s;
        },
        navigate(windowId, url) {
            const s = store.sessionOf(windowId);
            if (!url || s.url === url) {
                return;
            }
            s.history = [...s.history.slice(0, s.index + 1), url];
            s.index = s.history.length - 1;
            s.url = url;
            s.loading = true;
        },
        back(windowId) {
            const s = store.sessionOf(windowId);
            if (s.index > 0) {
                s.index--;
                s.url = s.history[s.index];
                s.loading = true;
            }
        },
        forward(windowId) {
            const s = store.sessionOf(windowId);
            if (s.index < s.history.length - 1) {
                s.index++;
                s.url = s.history[s.index];
                s.loading = true;
            }
        },
        reload(windowId) {
            const s = store.sessionOf(windowId);
            if (s.url) {
                s.loading = true;
            }
        },
        setLoading(windowId, loading) {
            store.sessionOf(windowId).loading = loading;
        },
        canBack(id) {
            return store.sessionOf(id).index > 0;
        },
        canForward(id) {
            return store.sessionOf(id).index < store.sessionOf(id).history.length - 1;
        },
        openUrl(url, target = 'browser') {
            if (target === 'external') {
                window.open(url, '_blank', 'noopener');
                return;
            }
            const existing = wm.list().find(w => w.appId === 'browser');
            if (existing) {
                wm.focus(existing.id);
                store.navigate(existing.id, url);
            }
            else {
                const win = wm.open('browser');
                store.navigate(win.id, url);
            }
        },
    });
    void openApp;
    void DEFAULT_SANDBOX;
    return store;
}
const browserStores = new WeakMap();
export function useBrowserStore() {
    const os = useWebOS();
    let s = browserStores.get(os);
    if (!s) {
        s = createBrowserStore(os);
        browserStores.set(os, s);
    }
    return s;
}
/** 浏览器窗口内容组件引用（apps 层注册） */
let browserComponent = null;
export function registerBrowserComponent(comp) {
    browserComponent = comp;
}
export function resolveBrowserComponent() {
    return browserComponent;
}
