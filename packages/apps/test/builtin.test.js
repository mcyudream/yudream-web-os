import { AppRegistry } from '@yudream/yudream-webos-core';
import { describe, expect, it } from 'vitest';
import { browserApp, builtinApps, builtinWidgets, finderApp, settingsApp } from '../src/index';
describe('内置应用注册表', () => {
    it('builtinApps 全部可注册且 id 唯一', () => {
        const reg = new AppRegistry();
        expect(() => reg.registerAll(builtinApps)).not.toThrow();
        expect(reg.list()).toHaveLength(builtinApps.length);
    });
    it('关键应用可被宿主 override', () => {
        const reg = new AppRegistry();
        reg.registerAll(builtinApps);
        reg.override('finder', { name: 'MyFiles' });
        expect(reg.get('finder')?.name).toBe('MyFiles');
        expect(reg.get('finder')?.fileHandlers).toBeDefined();
    });
    it('fileHandlers 路由：txt → text-editor', () => {
        const reg = new AppRegistry();
        reg.registerAll(builtinApps);
        expect(reg.queryByFileType('txt').map(a => a.id)).toContain('text-editor');
        expect(reg.queryByFileType('png').map(a => a.id)).toContain('image-viewer');
    });
    it('browser/finder/settings 组件载荷存在', () => {
        expect(browserApp.component).toBeDefined();
        expect(finderApp.component).toBeDefined();
        expect(settingsApp.component).toBeDefined();
    });
    it('内置小组件可注册并实例化', () => {
        expect(builtinWidgets.length).toBeGreaterThanOrEqual(3);
        for (const w of builtinWidgets) {
            expect(w.component).toBeDefined();
            expect(w.sizes.length).toBeGreaterThan(0);
        }
    });
});
