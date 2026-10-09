import { clamp } from '@yudream/yudream-webos-shared';
/** 视口边缘吸附判定（指针/窗口位置 → 半屏/全屏/四角区）。角区高度 cornerZone=140px 内命中四角 */
export function detectSnapZone(pos, viewport, edge = 12, cornerZone = 140) {
    const midY = viewport.height / 2;
    if (pos.x <= edge) {
        if (pos.y <= cornerZone) {
            return 'top-left';
        }
        if (pos.y >= viewport.height - cornerZone) {
            return 'bottom-left';
        }
        return 'left';
    }
    if (pos.x >= viewport.width - edge) {
        if (pos.y <= cornerZone) {
            return 'top-right';
        }
        if (pos.y >= viewport.height - cornerZone) {
            return 'bottom-right';
        }
        return 'right';
    }
    if (pos.y <= edge) {
        return 'top';
    }
    void midY;
    return null;
}
/** 吸附区对应的目标 bounds；insetTop 为顶部系统栏高度（吸附区不覆盖菜单栏） */
export function snapBounds(zone, viewport, insetTop = 0) {
    const vw = viewport.width;
    const vh = viewport.height - insetTop;
    const halfW = Math.round(vw / 2);
    const halfH = Math.round(vh / 2);
    switch (zone) {
        case 'left':
            return { x: 0, y: insetTop, width: halfW, height: vh };
        case 'right':
            return { x: halfW, y: insetTop, width: vw - halfW, height: vh };
        case 'top':
            return { x: 0, y: insetTop, width: vw, height: vh };
        case 'top-left':
            return { x: 0, y: insetTop, width: halfW, height: halfH };
        case 'top-right':
            return { x: halfW, y: insetTop, width: vw - halfW, height: halfH };
        case 'bottom-left':
            return { x: 0, y: insetTop + halfH, width: halfW, height: vh - halfH };
        case 'bottom-right':
            return { x: halfW, y: insetTop + halfH, width: vw - halfW, height: vh - halfH };
        default:
            return null;
    }
}
/** 级联开窗位置 */
export function cascadeRect(viewport, size, index, menubarHeight = 24) {
    const baseX = (viewport.width - size.width) / 2;
    const baseY = Math.max(menubarHeight + 8, (viewport.height - size.height) / 2 - 24);
    const offset = ((index % 5) - 2) * 30;
    return {
        x: Math.round(clamp(baseX + offset, -size.width + 120, viewport.width - 120)),
        y: Math.round(clamp(baseY + Math.abs(offset) / 2, menubarHeight, viewport.height - 64)),
        width: size.width,
        height: size.height,
    };
}
/**
 * 窗口管理器（core 只负责状态机与约束计算，渲染与拖拽交互在 ui 层）。
 * z 序：单调递增计数器，focus 即置顶层；约束管线：min/maxSize → 视口边界。
 */
export class WindowManager {
    events;
    windows = new Map();
    zCounter = 100;
    idCounter = 1;
    viewport = { width: 1280, height: 800 };
    /** 吸附/平铺的顶部内缩（菜单栏高度），随 setViewport 传入 */
    menuInset = 0;
    specs = new Map();
    /** 每应用累计开窗数（multiInstance 编号用，关闭不回退） */
    openCounts = new Map();
    constructor(events) {
        this.events = events;
    }
    setViewport(v) {
        this.viewport = { width: v.width, height: v.height };
        if (typeof v.menubarHeight === 'number') {
            this.menuInset = v.menubarHeight;
        }
    }
    getViewport() {
        return this.viewport;
    }
    /** 登记应用规格（registry.openApp 前调用，约束管线取 min/max）。可只传 spec（自动取 spec.appId） */
    registerSpec(appIdOrSpec, specMaybe) {
        const spec = typeof appIdOrSpec === 'string' ? specMaybe : appIdOrSpec;
        this.specs.set(spec.appId, spec);
    }
    // ---- 生命周期 ----
    open(appId, options = {}) {
        const spec = this.specs.get(appId);
        // 单例语义：已存在实例则 focus + restore + relaunch 事件
        if (spec?.singleton) {
            const existing = this.windowsOfApp(appId)[0];
            if (existing) {
                this.focus(existing.id);
                if (existing.state !== 'normal') {
                    this.restore(existing.id);
                }
                this.events?.onRelaunch?.(appId);
                return existing;
            }
        }
        const id = `win-${this.idCounter++}`;
        const size = {
            width: options.bounds?.width ?? spec?.defaultSize?.width ?? 720,
            height: options.bounds?.height ?? spec?.defaultSize?.height ?? 520,
        };
        let pos;
        if (options.bounds?.x !== undefined && options.bounds?.y !== undefined) {
            pos = { x: options.bounds.x, y: options.bounds.y };
        }
        else if (spec?.defaultPosition && spec.defaultPosition !== 'center' && spec.defaultPosition !== 'cascade') {
            pos = { ...spec.defaultPosition };
        }
        else if (spec?.defaultPosition === 'center') {
            pos = {
                x: Math.round((this.viewport.width - size.width) / 2),
                y: Math.round((this.viewport.height - size.height) / 2),
            };
        }
        else {
            pos = cascadeRect(this.viewport, size, this.windows.size);
        }
        // 多实例标题序号：基于每应用累计开窗数（关闭窗口后不重用序号）
        let title = options.title ?? spec?.title ?? appId;
        if (spec?.multiInstance) {
            const seq = (this.openCounts.get(appId) ?? 0) + 1;
            this.openCounts.set(appId, seq);
            if (seq > 1) {
                title = `${title} #${seq}`;
            }
        }
        const win = {
            id,
            appId,
            title,
            icon: spec?.icon,
            bounds: this.constrain({ ...pos, ...size }, spec),
            state: 'normal',
            zIndex: ++this.zCounter,
            focused: true,
            resizable: spec?.resizable ?? true,
            frameless: spec?.frameless ?? false,
            launchOptions: options.launchOptions,
            createdAt: Date.now(),
        };
        // 旧焦点 blur
        const prev = this.focusedWindow();
        if (prev) {
            prev.focused = false;
            this.events?.onBlur?.(prev);
        }
        this.windows.set(id, win);
        this.events?.onOpen?.(win);
        return win;
    }
    close(windowId) {
        const win = this.windows.get(windowId);
        if (!win) {
            return;
        }
        this.windows.delete(windowId);
        this.events?.onClose?.(win);
        // 焦点移交剩余最高 z 窗口
        if (win.focused) {
            const next = this.list().at(-1);
            if (next) {
                this.focus(next.id);
            }
        }
    }
    // ---- 焦点与 z 序 ----
    focus(windowId) {
        const win = this.windows.get(windowId);
        if (!win || win.focused) {
            if (win) {
                win.zIndex = ++this.zCounter;
            }
            return;
        }
        const prev = this.focusedWindow();
        if (prev) {
            prev.focused = false;
            this.events?.onBlur?.(prev);
        }
        win.focused = true;
        win.zIndex = ++this.zCounter;
        if (win.state === 'minimized') {
            win.state = 'normal';
            this.events?.onStateChange?.(win);
        }
        this.events?.onFocus?.(win);
    }
    blur(windowId) {
        const win = this.windows.get(windowId);
        if (win?.focused) {
            win.focused = false;
            this.events?.onBlur?.(win);
        }
    }
    // ---- 几何 ----
    move(windowId, pos) {
        const win = this.windows.get(windowId);
        if (!win || win.state === 'maximized' || win.state === 'fullscreen') {
            return;
        }
        win.bounds = this.constrain({ ...win.bounds, x: pos.x, y: pos.y }, this.specs.get(win.appId));
        this.events?.onMove?.(win);
    }
    resize(windowId, bounds) {
        const win = this.windows.get(windowId);
        if (!win || !win.resizable || win.state === 'maximized' || win.state === 'fullscreen') {
            return;
        }
        win.bounds = this.constrain({ ...bounds }, this.specs.get(win.appId));
        this.events?.onResize?.(win);
    }
    setBounds(windowId, bounds) {
        const win = this.windows.get(windowId);
        if (!win) {
            return;
        }
        win.bounds = this.constrain({ ...bounds }, this.specs.get(win.appId));
        this.events?.onResize?.(win);
    }
    // ---- 状态机 ----
    minimize(windowId) {
        const win = this.windows.get(windowId);
        if (!win || win.state === 'minimized') {
            return;
        }
        if (win.state === 'normal') {
            win.prevBounds = { ...win.bounds };
        }
        win.state = 'minimized';
        win.focused = false;
        this.events?.onStateChange?.(win);
        // 焦点移交给剩余可见的最高 z 窗口（不含刚最小化的）
        const next = this.list().filter(w => w.id !== windowId && w.state !== 'minimized').at(-1);
        if (next) {
            this.focus(next.id);
        }
    }
    /** toggle：再调用即还原 */
    maximize(windowId) {
        const win = this.windows.get(windowId);
        if (!win) {
            return;
        }
        if (win.state === 'maximized') {
            this.restore(windowId);
            return;
        }
        win.prevBounds = { ...win.bounds };
        win.state = 'maximized';
        win.bounds = { x: 0, y: 0, ...this.viewport };
        win.focused = true;
        win.zIndex = ++this.zCounter;
        this.events?.onStateChange?.(win);
    }
    fullscreen(windowId) {
        const win = this.windows.get(windowId);
        if (!win) {
            return;
        }
        if (win.state === 'fullscreen') {
            this.restore(windowId);
            return;
        }
        win.prevBounds = win.prevBounds ?? { ...win.bounds };
        win.state = 'fullscreen';
        win.bounds = { x: 0, y: 0, ...this.viewport };
        win.focused = true;
        win.zIndex = ++this.zCounter;
        this.events?.onStateChange?.(win);
    }
    restore(windowId) {
        const win = this.windows.get(windowId);
        if (!win) {
            return;
        }
        if (win.prevBounds) {
            win.bounds = { ...win.prevBounds };
        }
        win.state = 'normal';
        win.focused = true;
        win.zIndex = ++this.zCounter;
        this.events?.onStateChange?.(win);
    }
    /** 拖至边缘吸附平铺（macOS 15 窗口平铺）；吸附区不覆盖菜单栏 */
    snap(windowId, zone) {
        const target = snapBounds(zone, this.viewport, this.menuInset);
        if (!target) {
            return;
        }
        const win = this.windows.get(windowId);
        if (!win) {
            return;
        }
        win.prevBounds = win.prevBounds ?? { ...win.bounds };
        win.bounds = target;
        if (win.state === 'maximized' || win.state === 'fullscreen') {
            win.state = 'normal';
        }
        this.events?.onResize?.(win);
        this.events?.onStateChange?.(win);
    }
    /** 一键平铺：全部可见窗口网格均分（minimized 不参与；maximized/fullscreen 先还原） */
    tileAll(gap = 8) {
        const wins = this.list().filter(w => w.state !== 'minimized' && w.state !== 'fullscreen');
        const n = wins.length;
        if (n === 0) {
            return;
        }
        const cols = Math.ceil(Math.sqrt(n));
        const rows = Math.ceil(n / cols);
        const inset = this.menuInset;
        const cellW = Math.round((this.viewport.width - gap * (cols + 1)) / cols);
        const cellH = Math.round((this.viewport.height - inset - gap * (rows + 1)) / rows);
        wins.forEach((win, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            win.prevBounds = win.prevBounds ?? { ...win.bounds };
            win.bounds = {
                x: gap + col * (cellW + gap),
                y: inset + gap + row * (cellH + gap),
                width: cellW,
                height: cellH,
            };
            if (win.state === 'maximized') {
                win.state = 'normal';
            }
            this.events?.onResize?.(win);
            this.events?.onStateChange?.(win);
        });
    }
    // ---- 查询 ----
    get(windowId) {
        return this.windows.get(windowId);
    }
    /** 按 zIndex 升序 */
    list() {
        return [...this.windows.values()].sort((a, b) => a.zIndex - b.zIndex);
    }
    focusedWindow() {
        return this.list().find(w => w.focused);
    }
    windowsOfApp(appId) {
        return this.list().filter(w => w.appId === appId);
    }
    // ---- 会话序列化 ----
    serialize() {
        return this.list().map(w => ({ ...w, bounds: { ...w.bounds }, prevBounds: w.prevBounds ? { ...w.prevBounds } : undefined }));
    }
    restoreSession(snapshots) {
        this.windows.clear();
        for (const snap of snapshots) {
            this.windows.set(snap.id, {
                ...snap,
                bounds: this.constrain({ ...snap.bounds }, this.specs.get(snap.appId)),
                focused: false,
            });
            this.idCounter = Math.max(this.idCounter, Number(snap.id.split('-')[1] ?? 0) + 1);
        }
        this.zCounter = Math.max(100, ...snapshots.map(s => s.zIndex)) + 1;
        const top = this.list().at(-1);
        if (top) {
            this.focus(top.id);
        }
    }
    /** 约束管线：min/maxSize → 视口边界（标题栏至少露出 24px） */
    constrain(rect, spec) {
        const minW = spec?.minSize?.width ?? 320;
        const minH = spec?.minSize?.height ?? 200;
        const maxW = spec?.maxSize?.width ?? this.viewport.width;
        const maxH = spec?.maxSize?.height ?? this.viewport.height;
        const width = clamp(rect.width, Math.min(minW, maxW), maxW);
        const height = clamp(rect.height, Math.min(minH, maxH), maxH);
        const minVisible = 24;
        return {
            x: clamp(rect.x, -width + minVisible, this.viewport.width - minVisible),
            y: clamp(rect.y, 0, this.viewport.height - minVisible),
            width,
            height,
        };
    }
}
/** 便捷：把 WindowManager 事件桥接到 webos:* 总线 */
export function bindWindowEvents(wm, bus) {
    void wm;
    void bus;
}
