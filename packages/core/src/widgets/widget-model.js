import { shortId } from '@yudream/yudream-webos-shared';
/** 小组件注册表 + 实例布局（编辑模式状态由 core 管，动画在 ui 层） */
export class WidgetStore {
    definitions = new Map();
    instances = [];
    listeners = new Set();
    editing = false;
    placement = 'sidebar';
    constructor(instances) {
        this.instances = [...(instances ?? [])];
    }
    onChange(fn) {
        this.listeners.add(fn);
        return () => this.listeners.delete(fn);
    }
    register(def) {
        this.definitions.set(def.id, def);
    }
    getDefinition(widgetId) {
        return this.definitions.get(widgetId);
    }
    listDefinitions() {
        return [...this.definitions.values()];
    }
    listInstances() {
        return [...this.instances];
    }
    /** 持久化恢复：整体替换实例布局 */
    loadInstances(instances) {
        this.instances = instances.map(x => ({ ...x, config: { ...x.config } }));
        this.notify('restore');
    }
    /** addInstance 别名（composables 便捷入口） */
    add(widgetId, size, position, config) {
        return this.addInstance(widgetId, size, position, config);
    }
    addInstance(widgetId, size, position, config = {}) {
        const def = this.definitions.get(widgetId);
        if (!def || !def.sizes.includes(size)) {
            return null;
        }
        const inst = { instanceId: shortId('widget'), widgetId, size, position, config };
        this.instances.push(inst);
        this.notify('add');
        return inst;
    }
    removeInstance(instanceId) {
        const idx = this.instances.findIndex(x => x.instanceId === instanceId);
        if (idx > -1) {
            this.instances.splice(idx, 1);
            this.notify('remove');
        }
    }
    moveInstance(instanceId, position) {
        const inst = this.instances.find(x => x.instanceId === instanceId);
        if (inst) {
            inst.position = { ...position };
            this.notify('move');
        }
    }
    resizeInstance(instanceId, size) {
        const inst = this.instances.find(x => x.instanceId === instanceId);
        const def = inst && this.definitions.get(inst.widgetId);
        if (inst && def?.sizes.includes(size)) {
            inst.size = size;
            this.notify('resize');
        }
    }
    setConfig(instanceId, config) {
        const inst = this.instances.find(x => x.instanceId === instanceId);
        if (inst) {
            inst.config = { ...inst.config, ...config };
            this.notify('config');
        }
    }
    setEditing(editing) {
        this.editing = editing;
        this.notify('editing');
    }
    notify(reason) {
        this.listeners.forEach(fn => fn(reason));
    }
}
