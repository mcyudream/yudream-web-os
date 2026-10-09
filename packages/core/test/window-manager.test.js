import { describe, expect, it } from 'vitest';
import { detectSnapZone, snapBounds, WindowManager } from '../src/index';
function makeWM() {
    const wm = new WindowManager();
    wm.setViewport({ width: 1280, height: 800 });
    return wm;
}
function spec(overrides = {}) {
    return { appId: 'demo', title: '演示', defaultSize: { width: 640, height: 480 }, ...overrides };
}
describe('windowManager', () => {
    it('open：级联位置/zIndex 递增/注册规格约束', () => {
        const wm = makeWM();
        wm.registerSpec('demo', spec());
        const a = wm.open('demo');
        const b = wm.open('demo');
        expect(a.id).not.toBe(b.id);
        expect(b.zIndex).toBeGreaterThan(a.zIndex);
        expect(b.focused).toBe(true);
        expect(a.focused).toBe(false);
    });
    it('singleton：重复 open 聚焦还原并触发 relaunch', () => {
        let relaunched = 0;
        const wm = new WindowManager({ onRelaunch: () => relaunched++ });
        wm.setViewport({ width: 1280, height: 800 });
        wm.registerSpec('solo', { appId: 'solo', title: 'S', singleton: true });
        const a = wm.open('solo');
        wm.minimize(a.id);
        const b = wm.open('solo');
        expect(b.id).toBe(a.id);
        expect(b.state).toBe('normal');
        expect(relaunched).toBe(1);
    });
    it('close：焦点移交最高 z', () => {
        const wm = makeWM();
        wm.registerSpec('demo', spec());
        const a = wm.open('demo');
        const b = wm.open('demo');
        wm.close(b.id);
        expect(wm.focusedWindow()?.id).toBe(a.id);
        expect(wm.get(b.id)).toBeUndefined();
    });
    it('minimize/maximize/fullscreen/restore 状态机与 prevBounds', () => {
        const wm = makeWM();
        wm.registerSpec('demo', spec());
        const win = wm.open('demo');
        const orig = { ...win.bounds };
        wm.maximize(win.id);
        expect(win.state).toBe('maximized');
        expect(win.bounds.width).toBe(1280);
        wm.restore(win.id);
        expect(win.state).toBe('normal');
        expect(win.bounds).toEqual(orig);
        wm.fullscreen(win.id);
        expect(win.state).toBe('fullscreen');
        wm.restore(win.id);
        wm.minimize(win.id);
        expect(win.state).toBe('minimized');
        expect(wm.focusedWindow()).toBeUndefined();
    });
    it('move/resize 约束管线（minSize 与视口）', () => {
        const wm = makeWM();
        wm.registerSpec('demo', { appId: 'demo', title: 'D', defaultSize: { width: 400, height: 300 }, minSize: { width: 320, height: 200 } });
        const win = wm.open('demo');
        wm.move(win.id, { x: -9999, y: -9999 });
        expect(win.bounds.x).toBeGreaterThanOrEqual(-win.bounds.width + 24);
        expect(win.bounds.y).toBeGreaterThanOrEqual(0);
        wm.resize(win.id, { x: 0, y: 0, width: 10, height: 10 });
        expect(win.bounds.width).toBe(320);
        expect(win.bounds.height).toBe(200);
        wm.resize(win.id, { x: 0, y: 0, width: 99999, height: 99999 });
        expect(win.bounds.width).toBe(1280);
    });
    it('snap：拖至边缘半屏/全屏', () => {
        const wm = makeWM();
        wm.registerSpec('demo', spec());
        const win = wm.open('demo');
        wm.snap(win.id, 'left');
        expect(win.bounds).toEqual({ x: 0, y: 0, width: 640, height: 800 });
        wm.snap(win.id, 'top');
        expect(win.bounds).toEqual({ x: 0, y: 0, width: 1280, height: 800 });
        expect(detectSnapZone({ x: 5, y: 300 }, { width: 1280, height: 800 })).toBe('left');
        expect(snapBounds('right', { width: 1000, height: 800 })).toEqual({ x: 500, y: 0, width: 500, height: 800 });
    });
    it('serialize/restoreSession 会话恢复', () => {
        const wm = makeWM();
        wm.registerSpec('demo', spec());
        const a = wm.open('demo', { bounds: { x: 100, y: 100 } });
        wm.open('demo', { title: '第二窗' });
        const snaps = wm.serialize();
        expect(snaps).toHaveLength(2);
        const wm2 = makeWM();
        wm2.registerSpec('demo', spec());
        wm2.restoreSession(snaps);
        expect(wm2.list()).toHaveLength(2);
        expect(wm2.get(a.id).bounds.x).toBe(100);
        expect(wm2.focusedWindow()).toBeDefined();
        // 新开窗口 id 不冲突
        const next = wm2.open('demo');
        expect(wm2.get(next.id)).toBeDefined();
    });
    it('windowsOfApp', () => {
        const wm = makeWM();
        wm.registerSpec('demo', spec());
        wm.open('demo');
        wm.open('demo');
        wm.registerSpec('other', { appId: 'other', title: 'O' });
        wm.open('other');
        expect(wm.windowsOfApp('demo')).toHaveLength(2);
    });
});
describe('多实例窗口', () => {
    function makeWM() {
        const wm = new WindowManager();
        wm.setViewport({ width: 1280, height: 800 });
        return wm;
    }
    it('multiInstance：多开自动编号 #2 #3', () => {
        const wm = makeWM();
        wm.registerSpec({ appId: 'term', title: '终端', multiInstance: true, singleton: false });
        const a = wm.open('term');
        const b = wm.open('term');
        const c = wm.open('term');
        expect(wm.windowsOfApp('term')).toHaveLength(3);
        expect(a.title).toBe('终端');
        expect(b.title).toBe('终端 #2');
        expect(c.title).toBe('终端 #3');
    });
    it('关闭中间窗口后编号继续递增（不重用）', () => {
        const wm = makeWM();
        wm.registerSpec({ appId: 'term', title: '终端', multiInstance: true, singleton: false });
        const a = wm.open('term');
        const b = wm.open('term');
        expect(b.title).toBe('终端 #2');
        wm.close(a.id);
        const c = wm.open('term');
        // b 存活（#2），a 已关（#1 不复活），新窗口 c 用累计序号 #3
        expect(c.title).toBe('终端 #3');
        expect(wm.windowsOfApp('term')).toHaveLength(2);
    });
});
describe('吸附与平铺（Snap & Tile）', () => {
    const vp = { width: 1280, height: 800 };
    it('snapBounds 七档：半屏/全屏/四角，含菜单栏内缩', () => {
        expect(snapBounds('left', vp, 24)).toEqual({ x: 0, y: 24, width: 640, height: 776 });
        expect(snapBounds('right', vp, 24)).toEqual({ x: 640, y: 24, width: 640, height: 776 });
        expect(snapBounds('top', vp, 24)).toEqual({ x: 0, y: 24, width: 1280, height: 776 });
        expect(snapBounds('top-left', vp, 24)).toEqual({ x: 0, y: 24, width: 640, height: 388 });
        expect(snapBounds('top-right', vp, 24)).toEqual({ x: 640, y: 24, width: 640, height: 388 });
        expect(snapBounds('bottom-left', vp, 24)).toEqual({ x: 0, y: 412, width: 640, height: 388 });
        expect(snapBounds('bottom-right', vp, 24)).toEqual({ x: 640, y: 412, width: 640, height: 388 });
        expect(snapBounds(null, vp)).toBeNull();
    });
    it('wm.snap 写入目标 bounds 且保留 prevBounds；吸附区不覆盖菜单栏', () => {
        const wm = makeWM();
        wm.setViewport({ width: 1280, height: 800, menubarHeight: 24 });
        const w = wm.open('demo', { title: '演示' });
        const original = { ...w.bounds };
        wm.snap(w.id, 'right');
        expect(w.bounds).toEqual({ x: 640, y: 24, width: 640, height: 776 });
        expect(w.prevBounds).toEqual(original);
    });
    it('wm.tileAll 网格均分：2 窗左右对半、5 窗 3 列两行', () => {
        const wm = makeWM();
        wm.setViewport({ width: 1280, height: 800, menubarHeight: 24 });
        const a = wm.open('demo', { title: 'A' });
        const b = wm.open('demo', { title: 'B' });
        wm.tileAll();
        expect(a.bounds).toEqual({ x: 8, y: 32, width: 628, height: 760 });
        expect(b.bounds).toEqual({ x: 644, y: 32, width: 628, height: 760 });
        const wm2 = makeWM();
        wm2.setViewport({ width: 1280, height: 800, menubarHeight: 24 });
        for (let i = 0; i < 5; i++) {
            wm2.open('demo', { title: `W${i}` });
        }
        wm2.tileAll();
        const all = wm2.list();
        // 3 列 2 行：第 5 窗（i=4）在第 2 行第 2 格
        expect(all[4].bounds.x).toBe(8 + (416 + 8) * 1);
        expect(all[4].bounds.y).toBe(24 + 8 + (376 + 8) * 1);
        // minimized 不参与重排
        const minimizedBounds = { ...all[0].bounds };
        wm2.minimize(all[0].id);
        wm2.tileAll();
        expect(all[0].bounds).toEqual(minimizedBounds);
        expect(all[1].bounds.x).toBe(8);
    });
    it('detectSnapZone：左右缘半屏、角区四分、顶部全屏', () => {
        expect(detectSnapZone({ x: 5, y: 300 }, vp)).toBe('left');
        expect(detectSnapZone({ x: 1275, y: 300 }, vp)).toBe('right');
        expect(detectSnapZone({ x: 5, y: 60 }, vp)).toBe('top-left');
        expect(detectSnapZone({ x: 1275, y: 60 }, vp)).toBe('top-right');
        expect(detectSnapZone({ x: 5, y: 760 }, vp)).toBe('bottom-left');
        expect(detectSnapZone({ x: 1275, y: 760 }, vp)).toBe('bottom-right');
        expect(detectSnapZone({ x: 640, y: 5 }, vp)).toBe('top');
        expect(detectSnapZone({ x: 640, y: 400 }, vp)).toBeNull();
    });
});
