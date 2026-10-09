import { describe, expect, it } from 'vitest';
import { arcoAdapter } from '../src/index';
describe('arco 适配器冒烟', () => {
    it('导出 adapter 对象', () => {
        expect(arcoAdapter.name).toBe('arco');
    });
});
