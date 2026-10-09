/**
 * 持久化抽象 + localStorage 实现（默认 IndexedDB，fallback localStorage）。
 * 所有写入防抖合并 300ms；schema 带 version，升级走 migrations。
 */
import { debounce } from '@yudream/yudream-webos-shared';
/**
 * JSON 安全克隆：持久化值的最终形态就是 JSON（flush 走 JSON.stringify），克隆语义与之对齐。
 *  不用 structuredClone——宿主（Vue reactive 等 Proxy 包装对象）传入时会抛 DataCloneError。
 */
function jsonClone(value) {
    return JSON.parse(JSON.stringify(value));
}
/** 内存实现（测试/降级） */
export class MemoryPersistence {
    store = new Map();
    async get(key) {
        return this.getSync(key);
    }
    /** 同步读取（防抖 flush 等同步路径用） */
    getSync(key) {
        return this.store.get(key) ?? null;
    }
    async set(key, value) {
        this.store.set(key, jsonClone(value));
    }
    async remove(key) {
        this.store.delete(key);
    }
    async clear(scope) {
        if (!scope) {
            this.store.clear();
            return;
        }
        for (const key of [...this.store.keys()]) {
            if (key.startsWith(scope)) {
                this.store.delete(key);
            }
        }
    }
}
/** localStorage 实现（写入防抖 300ms） */
export class LocalStoragePersistence {
    storage;
    prefix;
    mem = new MemoryPersistence();
    debouncedFlush;
    dirty = new Set();
    constructor(storage = localStorage, prefix = 'webos', debounceMs = 300) {
        this.storage = storage;
        this.prefix = prefix;
        this.debouncedFlush = debounce(() => this.flush(), debounceMs);
    }
    fullKey(key) {
        return `${this.prefix}.${key}`;
    }
    async get(key) {
        // storage 访问失败（隐私模式/iframe 限制）静默降级到内存
        try {
            const raw = this.storage.getItem(this.fullKey(key));
            if (raw !== null) {
                return JSON.parse(raw);
            }
        }
        catch {
            /* 降级到 mem */
        }
        return this.mem.get(key);
    }
    async set(key, value) {
        await this.mem.set(key, value);
        this.dirty.add(key);
        this.debouncedFlush();
    }
    async remove(key) {
        await this.mem.remove(key);
        this.dirty.add(key);
        this.debouncedFlush();
    }
    async clear(scope) {
        await this.mem.clear(scope);
        for (const key of [...this.dirty]) {
            if (!scope || key.startsWith(scope)) {
                this.storage.removeItem(this.fullKey(key));
                this.dirty.delete(key);
            }
        }
        if (!scope) {
            for (const key of [...this.dirty]) {
                this.storage.removeItem(this.fullKey(key));
            }
        }
    }
    /** 立即落盘（beforeunload 用） */
    flushNow() {
        this.debouncedFlush.cancel();
        this.flush();
    }
    flush() {
        for (const key of this.dirty) {
            const value = this.mem.getSync(key);
            if (value === null) {
                this.storage.removeItem(this.fullKey(key));
            }
            else {
                this.storage.setItem(this.fullKey(key), JSON.stringify(value));
            }
        }
        this.dirty.clear();
    }
}
/** 版本迁移：migrations[fromVersion] = (data) => nextData */
export async function migrate(adapter, key, currentVersion, migrations, fallback) {
    const raw = await adapter.get(key);
    if (!raw) {
        return fallback;
    }
    const versioned = raw;
    if (typeof versioned !== 'object' || versioned === null || !('version' in versioned)) {
        // 无版本旧数据：按 0 处理
        let data = raw;
        for (let v = 0; v < currentVersion; v++) {
            data = migrations[v]?.(data) ?? data;
        }
        await adapter.set(key, { version: currentVersion, data });
        return data;
    }
    let version = versioned.version;
    let data = versioned.data;
    while (version < currentVersion) {
        data = migrations[version]?.(data) ?? data;
        version++;
    }
    if (version !== versioned.version) {
        await adapter.set(key, { version, data });
    }
    return data;
}
