import { describe, expect, it } from 'vitest';
import { basename, clamp, deepMerge, dirname, extname, normalizePath, resolvePath } from '../src/index';
describe('路径工具', () => {
    it('normalizePath 清洗与防穿越', () => {
        expect(normalizePath('/a/b/../c')).toBe('/a/c');
        expect(normalizePath('a/./b//')).toBe('/a/b');
        expect(normalizePath('/../../etc')).toBe('/etc');
        expect(normalizePath('\\a\\b')).toBe('/a/b');
        expect(normalizePath('/')).toBe('/');
    });
    it('resolvePath / dirname / basename / extname', () => {
        expect(resolvePath('/Documents', './readme.md')).toBe('/Documents/readme.md');
        expect(resolvePath('/Documents', '/other')).toBe('/other');
        expect(dirname('/Documents/readme.md')).toBe('/Documents');
        expect(dirname('/root')).toBe('/');
        expect(basename('/a/b/c.txt')).toBe('c.txt');
        expect(extname('/a/b/c.TXT')).toBe('txt');
        expect(extname('/a/b/noext')).toBe('');
        expect(extname('/a/.hidden')).toBe('');
    });
});
describe('deepMerge（override 深合并）', () => {
    it('嵌套对象递归合并，undefined 保留 dst', () => {
        const dst = { a: 1, b: { c: 2, d: 3 }, e: [1, 2] };
        const out = deepMerge(dst, { b: { c: 9 }, e: [3] });
        expect(out).toEqual({ a: 1, b: { c: 9, d: 3 }, e: [3] });
    });
    it('数组与标量直接替换', () => {
        expect(deepMerge({ a: 'x' }, { a: 'y' })).toEqual({ a: 'y' });
    });
    it('undefined src 返回原对象', () => {
        const dst = { a: 1 };
        expect(deepMerge(dst, undefined)).toBe(dst);
    });
});
describe('clamp', () => {
    it('边界钳制', () => {
        expect(clamp(5, 0, 10)).toBe(5);
        expect(clamp(-1, 0, 10)).toBe(0);
        expect(clamp(11, 0, 10)).toBe(10);
    });
});
