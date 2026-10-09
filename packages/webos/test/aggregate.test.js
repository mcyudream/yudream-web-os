import { AppRegistry } from '@yudream/yudream-webos-core';
import { describe, expect, it } from 'vitest';
import { arcoAdapter, builtinApps, builtinWidgets, createWebOS, useAppsStore } from '../src/index';
describe('元包聚合导出', () => {
    it('导出插件/适配器/内置应用/小组件', () => {
        expect(typeof createWebOS).toBe('function');
        expect(arcoAdapter.name).toBe('arco');
        expect(builtinApps.length).toBe(10);
        expect(builtinWidgets.length).toBeGreaterThanOrEqual(3);
        expect(typeof useAppsStore).toBe('function');
    });
    it('builtinApps 注册进 AppRegistry 并可 override', () => {
        const reg = new AppRegistry();
        reg.registerAll(builtinApps);
        reg.override('finder', { name: 'MyFiles' });
        expect(reg.get('finder')?.name).toBe('MyFiles');
    });
});
