/** 数值钳制 */
export function clamp(v, min, max) {
    return Math.min(Math.max(v, min), max);
}
/**
 * VFS 路径清洗：解析相对段、吞掉 `.` 与 `..`，杜绝越权（防 ../ 穿越）。
 * 始终返回以 / 开头的绝对路径。
 */
export function normalizePath(path) {
    const p = path.replaceAll('\\', '/').trim();
    const parts = p.split('/');
    const out = [];
    for (const seg of parts) {
        if (!seg || seg === '.') {
            continue;
        }
        if (seg === '..') {
            out.pop();
            continue;
        }
        out.push(seg);
    }
    return `/${out.join('/')}`;
}
/** 解析相对路径（基于基准目录） */
export function resolvePath(base, relative) {
    if (relative.startsWith('/')) {
        return normalizePath(relative);
    }
    return normalizePath(`${base}/${relative}`);
}
/** 父目录（根目录返回自身） */
export function dirname(path) {
    const p = normalizePath(path);
    const idx = p.lastIndexOf('/');
    return idx <= 0 ? '/' : p.slice(0, idx);
}
/** 文件名 */
export function basename(path) {
    const p = normalizePath(path);
    return p.slice(p.lastIndexOf('/') + 1);
}
/** 扩展名（小写、不含点；无扩展名返回 ''） */
export function extname(path) {
    const name = basename(path);
    const idx = name.lastIndexOf('.');
    return idx <= 0 ? '' : name.slice(idx + 1).toLowerCase();
}
/**
 * 深合并（override 用）：数组与普通对象递归合并，其余按 src 覆盖；src 为 undefined 保留 dst。
 */
export function deepMerge(dst, src) {
    if (src === undefined) {
        return dst;
    }
    if (Array.isArray(dst) || Array.isArray(src)) {
        return src;
    }
    if (typeof dst === 'object' && typeof src === 'object' && dst !== null && src !== null) {
        const out = { ...dst };
        for (const [k, v] of Object.entries(src)) {
            if (v === undefined) {
                continue;
            }
            out[k] = k in dst
                ? deepMerge(dst[k], v)
                : v;
        }
        return out;
    }
    return src;
}
/** 短随机 id */
export function shortId(prefix = '') {
    const rand = Math.random().toString(36).slice(2, 8);
    return prefix ? `${prefix}-${rand}` : rand;
}
/** 单调递增 id 工厂 */
export function createIdFactory(start = 1) {
    let n = start;
    return () => n++;
}
/** 防抖（persist 300ms 合并写） */
export function debounce(fn, ms) {
    let timer = null;
    const wrapped = (...args) => {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            timer = null;
            fn(...args);
        }, ms);
    };
    wrapped.cancel = () => {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
    };
    return wrapped;
}
