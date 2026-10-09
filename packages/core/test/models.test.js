import { describe, expect, it } from 'vitest';
import { DesktopModel, DockModel, mergeMenuItems, mergeMenus, WidgetStore } from '../src/index';
describe('desktopModel', () => {
    it('add 自动找空格（列优先向下）', () => {
        const dm = new DesktopModel();
        const a = dm.add({ type: 'app', refId: 'a', name: 'A', position: { col: 0, row: 0 } });
        const b = dm.add({ type: 'app', refId: 'b', name: 'B', position: { col: 0, row: 0 } });
        expect(a.position.row).toBe(0);
        expect(b.position.row).toBe(1);
    });
    it('moveTo swap 换位', () => {
        const dm = new DesktopModel();
        const a = dm.add({ type: 'app', refId: 'a', name: 'A', position: { col: 0, row: 0 } });
        const b = dm.add({ type: 'app', refId: 'b', name: 'B', position: { col: 1, row: 0 } });
        const result = dm.moveTo(a.id, { col: 1, row: 0 });
        expect(result.ok).toBe(true);
        expect(result.swappedWith).toBe(b.id);
        expect(a.position.col).toBe(1);
        expect(b.position.col).toBe(0);
    });
    it('moveTo shift 顺移', () => {
        const dm = new DesktopModel();
        dm.collision = 'shift';
        const a = dm.add({ type: 'app', refId: 'a', name: 'A', position: { col: 0, row: 0 } });
        dm.add({ type: 'app', refId: 'b', name: 'B', position: { col: 0, row: 1 } });
        dm.moveTo(a.id, { col: 0, row: 1 });
        const b = dm.get; // 占位
        void b;
        const items = dm.list().filter(x => x.refId === 'b');
        expect(items[0].position.row).toBe(2);
    });
    it('createFolder / dissolveFolder / folderChildren', () => {
        const dm = new DesktopModel();
        const a = dm.add({ type: 'app', refId: 'a', name: 'A', position: { col: 0, row: 0 } });
        const b = dm.add({ type: 'app', refId: 'b', name: 'B', position: { col: 0, row: 1 } });
        const folder = dm.createFolder('新建文件夹', [a.id, b.id]);
        expect(folder.type).toBe('folder');
        expect(dm.list().filter(x => x.type === 'app')).toHaveLength(0);
        expect(dm.folderChildren(folder.id)).toHaveLength(2);
        dm.dissolveFolder(folder.id);
        expect(dm.list()).toHaveLength(2);
    });
    it('sortBy / autoArrange', () => {
        const dm = new DesktopModel();
        dm.add({ type: 'app', refId: 'c', name: 'C', position: { col: 0, row: 0 } });
        dm.add({ type: 'app', refId: 'a', name: 'A', position: { col: 0, row: 1 } });
        dm.add({ type: 'app', refId: 'b', name: 'B', position: { col: 0, row: 2 } });
        dm.sortBy('name');
        const names = dm.list().map(x => x.name);
        expect(names).toEqual(['A', 'B', 'C']);
    });
});
describe('dockModel', () => {
    it('pin/unpin/reorder/setBadge', () => {
        const dock = new DockModel({ pinned: ['finder'] });
        let reason = '';
        dock.onChange((r) => {
            reason = r;
        });
        dock.pin('settings');
        expect(dock.pinned).toEqual(['finder', 'settings']);
        dock.pin('settings');
        expect(dock.pinned).toHaveLength(2);
        dock.reorder(1, 0);
        expect(dock.pinned).toEqual(['settings', 'finder']);
        dock.setBadge('settings', 3);
        expect(dock.getBadge('settings')).toBe(3);
        dock.setBadge('settings', null);
        expect(dock.getBadge('settings')).toBeNull();
        dock.unpin('finder');
        expect(dock.pinned).toEqual(['settings']);
        expect(reason).toBe('unpin');
    });
});
describe('菜单合并器', () => {
    const system = [
        { id: 'app', label: 'Finder' },
        { id: 'file', label: '文件', submenu: [{ id: 'close', label: '关闭窗口' }] },
        { id: 'edit', label: '编辑' },
    ];
    it('mergeMenuItems 按 id 深合并 submenu', () => {
        const out = mergeMenuItems(system, [
            { id: 'file', submenu: [{ id: 'new-tab', label: '新建标签页' }] },
            { id: 'view', label: '显示' },
        ]);
        const file = out.find(m => m.id === 'file');
        expect(file.submenu?.map(s => s.id)).toEqual(['close', 'new-tab']);
        expect(out.find(m => m.id === 'view')?.label).toBe('显示');
    });
    it('mergeMenus 四级优先：系统 → 应用 → 宿主 → 应用 overrides', () => {
        const out = mergeMenus({
            systemMenus: system,
            app: {
                appMenus: [{ id: 'go', label: '前往' }],
                overrides: { file: { label: '文件(F)' } },
            },
            hostOverrides: { edit: { label: '编辑(E)' } },
        });
        expect(out.find(m => m.id === 'go')).toBeDefined();
        expect(out.find(m => m.id === 'file')?.label).toBe('文件(F)');
        expect(out.find(m => m.id === 'edit')?.label).toBe('编辑(E)');
    });
});
describe('widgetStore', () => {
    const clock = { id: 'clock', name: '时钟', sizes: ['small', 'medium'], component: null };
    it('register/addInstance/resize 校验 sizes', () => {
        const ws = new WidgetStore();
        ws.register(clock);
        const inst = ws.addInstance('clock', 'small', { col: 0, row: 0 });
        expect(inst).not.toBeNull();
        expect(ws.addInstance('clock', 'large', { col: 0, row: 0 })).toBeNull();
        ws.resizeInstance(inst.instanceId, 'medium');
        expect(ws.listInstances()[0].size).toBe('medium');
    });
    it('remove/move/setConfig/editing', () => {
        const ws = new WidgetStore();
        ws.register(clock);
        const inst = ws.addInstance('clock', 'small', { col: 0, row: 0 });
        ws.setEditing(true);
        expect(ws.editing).toBe(true);
        ws.moveInstance(inst.instanceId, { col: 2, row: 0 });
        expect(ws.listInstances()[0].position.col).toBe(2);
        ws.setConfig(inst.instanceId, { city: '北京' });
        expect(ws.listInstances()[0].config.city).toBe('北京');
        ws.removeInstance(inst.instanceId);
        expect(ws.listInstances()).toHaveLength(0);
    });
});
