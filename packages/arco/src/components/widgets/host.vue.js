import { useWebOS, useWidgets } from '@yudream/yudream-webos-vue';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
const emit = defineEmits();
const { widgets, instances, editing, setEditing, remove, move, resize } = useWidgets();
const os = useWebOS();
const isDesktop = computed(() => widgets.placement === 'desktop');
const hasInstances = computed(() => instances.value.length > 0);
/* ── 桌面平铺：网格常量与布局 ── */
const UNIT = 84;
const GAP = 8;
const STEP = UNIT + GAP;
/** 卡片首行顶部 = 菜单栏高 + 呼吸间距（与层 inset 一致） */
const WIDGET_TOP = 38;
const SPAN = { small: [2, 2], medium: [4, 2], large: [4, 4] };
function spanOf(inst) {
    return (SPAN[inst.size] ?? [2, 2]);
}
function cardStyle(inst) {
    const [w, h] = spanOf(inst);
    return {
        left: `${inst.position.col * STEP}px`,
        top: `${inst.position.row * STEP}px`,
        width: `${w * UNIT + (w - 1) * GAP}px`,
        height: `${h * UNIT + (h - 1) * GAP}px`,
    };
}
/* 拖拽换位（仅编辑模式）：pointer capture + 抬起时吸附网格 */
const dragId = ref(null);
const dragStart = ref({ x: 0, y: 0, left: 0, top: 0 });
function nextSize(inst) {
    const def = widgets.getDefinition(inst.widgetId);
    const sizes = def?.sizes ?? [];
    if (sizes.length < 2) {
        return null;
    }
    return sizes[(sizes.indexOf(inst.size) + 1) % sizes.length] ?? null;
}
function cycleSize(inst) {
    const next = nextSize(inst);
    if (next) {
        resize(inst.instanceId, next);
    }
}
function onCardContextmenu(inst, e) {
    e.preventDefault();
    const next = nextSize(inst);
    os.ui.menu({
        x: e.clientX,
        y: e.clientY,
        items: [
            ...(next ? [{ label: `切换为${next === 'small' ? '小' : next === 'medium' ? '中' : '大'}尺寸`, icon: 'i-lucide-scaling', onSelect: () => resize(inst.instanceId, next) }] : []),
            { label: '移除小组件', icon: 'i-lucide-trash-2', danger: true, onSelect: () => remove(inst.instanceId) },
        ],
    });
}
function onDragStart(inst, e) {
    if (!editing.value || e.button !== 0) {
        return;
    }
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    dragId.value = inst.instanceId;
    dragStart.value = { x: e.clientX, y: e.clientY, left: r.left, top: r.top };
    el.setPointerCapture(e.pointerId);
}
function onDragMove(inst, e) {
    if (dragId.value !== inst.instanceId) {
        return;
    }
    const el = e.currentTarget;
    const dx = e.clientX - dragStart.value.x;
    const dy = e.clientY - dragStart.value.y;
    el.style.transform = `translate(${dx}px, ${dy})`;
}
function onDragEnd(inst, e) {
    if (dragId.value !== inst.instanceId) {
        return;
    }
    dragId.value = null;
    const el = e.currentTarget;
    el.style.transform = '';
    const [w, h] = spanOf(inst);
    const dx = e.clientX - dragStart.value.x;
    const dy = e.clientY - dragStart.value.y;
    const newLeft = dragStart.value.left + dx;
    const newTop = dragStart.value.top + dy;
    const maxCol = Math.max(0, Math.floor((window.innerWidth - w * UNIT - (w - 1) * GAP) / STEP));
    const maxRow = Math.max(0, Math.floor((window.innerHeight - WIDGET_TOP - h * UNIT - (h - 1) * GAP) / STEP));
    const col = Math.min(maxCol, Math.max(0, Math.round(newLeft / STEP)));
    const row = Math.min(maxRow, Math.max(0, Math.round((newTop - WIDGET_TOP) / STEP)));
    move(inst.instanceId, { col, row });
}
function toggleEdit() {
    setEditing(!editing.value);
}
onMounted(() => {
    window.addEventListener('webos:widgets:edit', toggleEdit);
});
onBeforeUnmount(() => {
    window.removeEventListener('webos:widgets:edit', toggleEdit);
});
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
void __VLS_ctx, __VLS_components, __VLS_intrinsics, __VLS_directives;
// @ts-ignore
__VLS_withDotValue(isDesktop, {});
// @ts-ignore
__VLS_withDotValue(dragId, {});
// @ts-ignore
__VLS_withDotValue(editing, {});
// @ts-ignore
__VLS_withDotValue(hasInstances, {});
void {};
/** @type {__VLS_StyleScopedClasses['yw-widget-host']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-widget-host']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-widget-host']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-widget-card']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-widget-card']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-widget-gallery-hint']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-widget-edit-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-widget-edit-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-widget-desktop']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-widget-card']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-widget-desktop']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-widget-card']} */ ;
/** @type {__VLS_StyleScopedClasses['is-editing']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-widget-desktop']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-widget-card']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-widget-desktop']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-widget-remove']} */ ;
if (isDesktop.value) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.aside, __VLS_intrinsics.aside)({
        ...{ class: "yw-widget-desktop" },
        'data-editing': (editing.value),
    });
    /** @type {__VLS_StyleScopedClasses['yw-widget-desktop']} */ ;
    const __VLS_0 = __VLS_tryAsConstant((__VLS_unwrap(instances, {})));
    for (const [inst] of __VLS_vFor(__VLS_nonNull(__VLS_0))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ onPointerdown: // @ts-ignore
                (...[$event]) => {
                    void $event;
                    if (!(isDesktop.value))
                        throw 0;
                    return (onDragStart(inst, $event));
                    // @ts-ignore
                    [isDesktop, editing, instances,];
                } },
            ...{ onPointermove: // @ts-ignore
                (...[$event]) => {
                    void $event;
                    if (!(isDesktop.value))
                        throw 0;
                    return (onDragMove(inst, $event));
                    // @ts-ignore
                    [];
                } },
            ...{ onPointerup: // @ts-ignore
                (...[$event]) => {
                    void $event;
                    if (!(isDesktop.value))
                        throw 0;
                    return (onDragEnd(inst, $event));
                    // @ts-ignore
                    [];
                } },
            ...{ onContextmenu: // @ts-ignore
                (...[$event]) => {
                    void $event;
                    if (!(isDesktop.value))
                        throw 0;
                    return (onCardContextmenu(inst, $event));
                    // @ts-ignore
                    [];
                } },
            key: (inst.instanceId),
            ...{ class: "yw-widget-card is-desktop" },
            ...{ class: ([`is-${inst.size}`, { 'is-editing': editing.value, 'is-dragging': dragId.value === inst.instanceId }]) },
            ...{ style: (cardStyle(inst)) },
        });
        /** @type {__VLS_StyleScopedClasses['yw-widget-card']} */ ;
        /** @type {__VLS_StyleScopedClasses['is-desktop']} */ ;
        /** @type {__VLS_StyleScopedClasses['is-editing']} */ ;
        /** @type {__VLS_StyleScopedClasses['is-dragging']} */ ;
        if (editing.value) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
                ...{ onClick: // @ts-ignore
                    (...[$event]) => {
                        void $event;
                        if (!(isDesktop.value))
                            throw 0;
                        if (!(editing.value))
                            throw 0;
                        return (__VLS_unwrap(remove, {})(inst.instanceId));
                        // @ts-ignore
                        [editing, editing, dragId, remove,];
                    } },
                ...{ class: "yw-widget-remove" },
                title: "移除",
            });
            /** @type {__VLS_StyleScopedClasses['yw-widget-remove']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.i)({
                ...{ class: "i-lucide-minus" },
            });
            /** @type {__VLS_StyleScopedClasses['i-lucide-minus']} */ ;
        }
        if (editing.value && nextSize(inst)) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
                ...{ onClick: // @ts-ignore
                    (...[$event]) => {
                        void $event;
                        if (!(isDesktop.value))
                            throw 0;
                        if (!(editing.value && nextSize(inst)))
                            throw 0;
                        return (cycleSize(inst));
                        // @ts-ignore
                        [editing,];
                    } },
                ...{ class: "yw-widget-resize" },
                title: "切换尺寸",
            });
            /** @type {__VLS_StyleScopedClasses['yw-widget-resize']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.i)({
                ...{ class: "i-lucide-scaling" },
            });
            /** @type {__VLS_StyleScopedClasses['i-lucide-scaling']} */ ;
        }
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "yw-widget-body" },
        });
        /** @type {__VLS_StyleScopedClasses['yw-widget-body']} */ ;
        var __VLS_1 = {
            instance: (inst),
        };
        // @ts-ignore
        [];
    }
    if (editing.value) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
            ...{ onClick: // @ts-ignore
                (...[$event]) => {
                    void $event;
                    if (!(isDesktop.value))
                        throw 0;
                    if (!(editing.value))
                        throw 0;
                    return (toggleEdit());
                    // @ts-ignore
                    [editing,];
                } },
            ...{ class: "yw-widget-edit-btn yw-widget-desktop-done" },
        });
        /** @type {__VLS_StyleScopedClasses['yw-widget-edit-btn']} */ ;
        /** @type {__VLS_StyleScopedClasses['yw-widget-desktop-done']} */ ;
    }
    if (editing.value) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
            ...{ onClick: // @ts-ignore
                (...[$event]) => {
                    void $event;
                    if (!(isDesktop.value))
                        throw 0;
                    if (!(editing.value))
                        throw 0;
                    return (__VLS_unwrap(emit, {})('openGallery'));
                    // @ts-ignore
                    [editing, emit,];
                } },
            ...{ class: "yw-widget-edit-btn yw-widget-desktop-add" },
        });
        /** @type {__VLS_StyleScopedClasses['yw-widget-edit-btn']} */ ;
        /** @type {__VLS_StyleScopedClasses['yw-widget-desktop-add']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.i)({
            ...{ class: "i-lucide-plus" },
        });
        /** @type {__VLS_StyleScopedClasses['i-lucide-plus']} */ ;
    }
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.aside, __VLS_intrinsics.aside)({
        ...{ class: "yw-widget-host" },
        'data-editing': "false",
    });
    /** @type {__VLS_StyleScopedClasses['yw-widget-host']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "yw-widget-list" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-widget-list']} */ ;
    if (!hasInstances.value) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
            ...{ class: "yw-widget-empty" },
        });
        /** @type {__VLS_StyleScopedClasses['yw-widget-empty']} */ ;
        (editing.value ? '从下方画廊添加小组件' : '小组件将显示在这里');
    }
    const __VLS_3 = __VLS_tryAsConstant((__VLS_unwrap(instances, {})));
    for (const [inst] of __VLS_vFor(__VLS_nonNull(__VLS_3))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            key: (inst.instanceId),
            ...{ class: "yw-widget-card" },
            ...{ class: ([`is-${inst.size}`, { 'is-editing': editing.value }]) },
        });
        /** @type {__VLS_StyleScopedClasses['yw-widget-card']} */ ;
        /** @type {__VLS_StyleScopedClasses['is-editing']} */ ;
        if (editing.value) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
                ...{ onClick: // @ts-ignore
                    (...[$event]) => {
                        void $event;
                        if (!!(isDesktop.value))
                            throw 0;
                        if (!(editing.value))
                            throw 0;
                        return (__VLS_unwrap(remove, {})(inst.instanceId));
                        // @ts-ignore
                        [editing, editing, editing, instances, remove, hasInstances,];
                    } },
                ...{ class: "yw-widget-remove" },
                title: "移除",
            });
            /** @type {__VLS_StyleScopedClasses['yw-widget-remove']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.i)({
                ...{ class: "i-lucide-minus" },
            });
            /** @type {__VLS_StyleScopedClasses['i-lucide-minus']} */ ;
        }
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "yw-widget-body" },
        });
        /** @type {__VLS_StyleScopedClasses['yw-widget-body']} */ ;
        var __VLS_4 = {
            instance: (inst),
        };
        // @ts-ignore
        [];
    }
    if (editing.value) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "yw-widget-gallery-hint" },
        });
        /** @type {__VLS_StyleScopedClasses['yw-widget-gallery-hint']} */ ;
        var __VLS_6 = {};
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.footer, __VLS_intrinsics.footer)({
        ...{ class: "yw-widget-host-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-widget-host-footer']} */ ;
    if (editing.value) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
            ...{ onClick: // @ts-ignore
                (...[$event]) => {
                    void $event;
                    if (!!(isDesktop.value))
                        throw 0;
                    if (!(editing.value))
                        throw 0;
                    return (__VLS_unwrap(emit, {})('openGallery'));
                    // @ts-ignore
                    [editing, editing, emit,];
                } },
            ...{ class: "yw-widget-edit-btn" },
        });
        /** @type {__VLS_StyleScopedClasses['yw-widget-edit-btn']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.i)({
            ...{ class: "i-lucide-plus" },
        });
        /** @type {__VLS_StyleScopedClasses['i-lucide-plus']} */ ;
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: // @ts-ignore
            (...[$event]) => {
                void $event;
                if (!!(isDesktop.value))
                    throw 0;
                __VLS_unwrap(setEditing, {})(!editing.value);
                if (!editing.value)
                    __VLS_unwrap(emit, {})('openGallery');
                // @ts-ignore
                [editing, editing, emit, setEditing,];
            } },
        ...{ class: "yw-widget-edit-btn" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-widget-edit-btn']} */ ;
    (editing.value ? '完成' : '编辑小组件');
}
var __VLS_2 = __VLS_1, __VLS_5 = __VLS_4, __VLS_7 = __VLS_6;
// @ts-ignore
[editing,];
const __VLS_base = (await import('vue')).defineComponent({
    __typeEmits: {},
});
const __VLS_export = {};
export default {};
import { defineEmits, } from 'vue';
