import { computed, onBeforeUnmount, ref } from 'vue';
import { usePointerDrag, usePointerResize } from '../../composables/usePointerDrag';
import { useWindowsStore } from '../../stores/windows';
const props = defineProps();
const windowsStore = useWindowsStore();
/** 拖拽起始矩形（相对位移，结束提交 store） */
const dragOrigin = ref(props.win.bounds);
/** 拖拽/缩放进行中：禁用过渡动画 */
const interacting = ref(false);
/** Snap 布局选择器：悬停最大化按钮 400ms 弹出，鼠标离开 500ms 收起（Win11 式） */
const SNAP_ZONES_HALF = ['left', 'top', 'right'];
const SNAP_ZONES_QUARTER = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
const showSnapPicker = ref(false);
let armTimer = null;
let hideTimer = null;
function armSnapPicker() {
    if (armTimer) {
        clearTimeout(armTimer);
    }
    if (hideTimer) {
        clearTimeout(hideTimer);
        hideTimer = null;
    }
    armTimer = setTimeout(() => {
        showSnapPicker.value = true;
    }, 400);
}
function disarmSnapPicker() {
    if (armTimer) {
        clearTimeout(armTimer);
        armTimer = null;
    }
    hideTimer = setTimeout(() => {
        showSnapPicker.value = false;
    }, 500);
}
function cancelHide() {
    if (hideTimer) {
        clearTimeout(hideTimer);
        hideTimer = null;
    }
}
function applySnap(zone) {
    showSnapPicker.value = false;
    windowsStore.snap(props.win.id, zone);
}
onBeforeUnmount(() => {
    if (armTimer) {
        clearTimeout(armTimer);
    }
    if (hideTimer) {
        clearTimeout(hideTimer);
    }
});
const titleDrag = usePointerDrag({
    onMove: (dx, dy) => {
        windowsStore.moveTo(props.win.id, dragOrigin.value.x + dx, dragOrigin.value.y + dy);
    },
    onEnd: () => {
        interacting.value = false;
        dragOrigin.value = { ...windowsStore.wm.get(props.win.id).bounds };
    },
});
function beginDrag(ev) {
    if (props.win.state === 'maximized' || props.win.state === 'fullscreen') {
        return;
    }
    interacting.value = true;
    dragOrigin.value = { ...props.win.bounds };
    titleDrag.start(ev);
}
function beginResize(direction, ev) {
    if (props.win.state === 'maximized' || props.win.state === 'fullscreen') {
        return;
    }
    interacting.value = true;
    const start = { ...props.win.bounds };
    const resize = usePointerResize({
        direction,
        rect: start,
        minWidth: 320,
        minHeight: 240,
        onResize: (rect) => {
            windowsStore.resizeTo(props.win.id, rect);
        },
        onEnd: () => {
            interacting.value = false;
            dragOrigin.value = { ...windowsStore.wm.get(props.win.id).bounds };
        },
    });
    resize.start(ev);
}
const style = computed(() => {
    if (props.win.state === 'maximized' || props.win.state === 'fullscreen') {
        return {
            left: '0px',
            top: 'var(--yw-menubar-h)',
            width: '100%',
            height: 'calc(100% - var(--yw-menubar-h))',
            zIndex: props.win.zIndex,
        };
    }
    const b = props.win.bounds;
    return {
        left: `${b.x}px`,
        top: `${b.y}px`,
        width: `${b.width}px`,
        height: `${b.height}px`,
        zIndex: props.win.zIndex,
    };
});
const isFocused = computed(() => windowsStore.focusedId === props.win.id);
const payload = computed(() => windowsStore.payloadOf(props.win.id));
function onFocus() {
    if (!isFocused.value) {
        windowsStore.focus(props.win.id);
    }
}
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
void __VLS_ctx, __VLS_components, __VLS_intrinsics, __VLS_directives;
// @ts-ignore
__VLS_withDotValue(windowsStore, {});
// @ts-ignore
__VLS_withDotValue(showSnapPicker, {});
// @ts-ignore
__VLS_withDotValue(isFocused, {});
// @ts-ignore
__VLS_withDotValue(payload, {});
void {};
/** @type {__VLS_StyleScopedClasses['yw-window']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-window']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-window']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-tl']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-tl-group']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-tl']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-tl']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-tl']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-window']} */ ;
/** @type {__VLS_StyleScopedClasses['is-focused']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-tl']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-window']} */ ;
/** @type {__VLS_StyleScopedClasses['is-focused']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-tl']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-window-title']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-snap-cell']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-snap-shape']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-snap-shape']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-snap-shape']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-snap-shape']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-snap-shape']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-snap-shape']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-snap-shape']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)({
    ...{ onPointerdown: (onFocus) },
    ...{ class: "yw-window" },
    ...{ class: ({ 'is-focused': isFocused.value, 'is-maximized': __VLS_ctx.win.state === 'maximized', 'is-interacting': __VLS_unwrap(interacting, {}) }) },
    ...{ style: (__VLS_unwrap(style, {})) },
    role: "dialog",
    'aria-label': (__VLS_ctx.win.title),
    'data-window-id': (__VLS_ctx.win.id),
});
/** @type {__VLS_StyleScopedClasses['yw-window']} */ ;
/** @type {__VLS_StyleScopedClasses['is-focused']} */ ;
/** @type {__VLS_StyleScopedClasses['is-maximized']} */ ;
/** @type {__VLS_StyleScopedClasses['is-interacting']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.header, __VLS_intrinsics.header)({
    ...{ onPointerdown: (beginDrag) },
    ...{ onDblclick: // @ts-ignore
        (...[$event]) => {
            void $event;
            return (windowsStore.value.toggleMaximize(__VLS_ctx.win.id));
            // @ts-ignore
            [isFocused, win, win, win, win, interacting, style, windowsStore,];
        } },
    ...{ class: "yw-window-titlebar" },
});
/** @type {__VLS_StyleScopedClasses['yw-window-titlebar']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "yw-tl-group" },
});
/** @type {__VLS_StyleScopedClasses['yw-tl-group']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onPointerdown: () => { } },
    ...{ onClick: // @ts-ignore
        (...[$event]) => {
            void $event;
            return (windowsStore.value.close(__VLS_ctx.win.id));
            // @ts-ignore
            [win, windowsStore,];
        } },
    ...{ class: "yw-tl yw-tl--close" },
    title: "关闭",
});
/** @type {__VLS_StyleScopedClasses['yw-tl']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-tl--close']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
    viewBox: "0 0 12 12",
    'aria-hidden': "true",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.path)({
    d: "M3.5 3.5 L8.5 8.5 M8.5 3.5 L3.5 8.5",
    stroke: "currentColor",
    'stroke-width': "1.6",
    'stroke-linecap': "round",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onPointerdown: () => { } },
    ...{ onClick: // @ts-ignore
        (...[$event]) => {
            void $event;
            return (windowsStore.value.toggleMinimize(__VLS_ctx.win.id));
            // @ts-ignore
            [win, windowsStore,];
        } },
    ...{ class: "yw-tl yw-tl--min" },
    title: "最小化",
});
/** @type {__VLS_StyleScopedClasses['yw-tl']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-tl--min']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
    viewBox: "0 0 12 12",
    'aria-hidden': "true",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.path)({
    d: "M3 6 H9",
    stroke: "currentColor",
    'stroke-width': "1.6",
    'stroke-linecap': "round",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ onPointerenter: (armSnapPicker) },
    ...{ onPointerleave: (disarmSnapPicker) },
    ...{ class: "yw-tl-zoom-wrap" },
});
/** @type {__VLS_StyleScopedClasses['yw-tl-zoom-wrap']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onPointerdown: () => { } },
    ...{ onClick: // @ts-ignore
        (...[$event]) => {
            void $event;
            return (windowsStore.value.toggleMaximize(__VLS_ctx.win.id));
            // @ts-ignore
            [win, windowsStore,];
        } },
    ...{ class: "yw-tl yw-tl--zoom" },
    title: "最大化（悬停选布局）",
});
/** @type {__VLS_StyleScopedClasses['yw-tl']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-tl--zoom']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
    viewBox: "0 0 12 12",
    'aria-hidden': "true",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.path)({
    d: "M4.2 3 H8.2 V7 M7.8 9 H3.8 V5",
    stroke: "currentColor",
    'stroke-width': "1.4",
    'stroke-linecap': "round",
    fill: "none",
});
if (showSnapPicker.value) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onPointerenter: (cancelHide) },
        ...{ class: "yw-snap-picker" },
        role: "menu",
        'aria-label': "窗口布局",
    });
    /** @type {__VLS_StyleScopedClasses['yw-snap-picker']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "yw-snap-row" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-snap-row']} */ ;
    const __VLS_0 = __VLS_tryAsConstant((__VLS_unwrap(SNAP_ZONES_HALF, {})));
    for (const [zone] of __VLS_vFor(__VLS_nonNull(__VLS_0))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
            ...{ onPointerdown: () => { } },
            ...{ onClick: // @ts-ignore
                (...[$event]) => {
                    void $event;
                    if (!(showSnapPicker.value))
                        throw 0;
                    return (applySnap(zone));
                    // @ts-ignore
                    [showSnapPicker, SNAP_ZONES_HALF,];
                } },
            key: (zone),
            ...{ class: "yw-snap-cell" },
            title: ({ left: '左半屏', top: '全屏', right: '右半屏' }[zone]),
        });
        /** @type {__VLS_StyleScopedClasses['yw-snap-cell']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span)({
            ...{ class: "yw-snap-shape" },
            ...{ class: (`is-${zone}`) },
        });
        /** @type {__VLS_StyleScopedClasses['yw-snap-shape']} */ ;
        // @ts-ignore
        [];
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "yw-snap-row" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-snap-row']} */ ;
    const __VLS_1 = __VLS_tryAsConstant((__VLS_unwrap(SNAP_ZONES_QUARTER, {})));
    for (const [zone] of __VLS_vFor(__VLS_nonNull(__VLS_1))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
            ...{ onPointerdown: () => { } },
            ...{ onClick: // @ts-ignore
                (...[$event]) => {
                    void $event;
                    if (!(showSnapPicker.value))
                        throw 0;
                    return (applySnap(zone));
                    // @ts-ignore
                    [SNAP_ZONES_QUARTER,];
                } },
            key: (zone),
            ...{ class: "yw-snap-cell" },
            title: ({ 'top-left': '左上 1/4', 'top-right': '右上 1/4', 'bottom-left': '左下 1/4', 'bottom-right': '右下 1/4' }[zone]),
        });
        /** @type {__VLS_StyleScopedClasses['yw-snap-cell']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span)({
            ...{ class: "yw-snap-shape" },
            ...{ class: (`is-${zone}`) },
        });
        /** @type {__VLS_StyleScopedClasses['yw-snap-shape']} */ ;
        // @ts-ignore
        [];
    }
}
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "yw-window-title" },
    ...{ class: ({ 'is-dim': !isFocused.value }) },
});
/** @type {__VLS_StyleScopedClasses['yw-window-title']} */ ;
/** @type {__VLS_StyleScopedClasses['is-dim']} */ ;
(__VLS_ctx.win.title);
__VLS_asFunctionalElement1(__VLS_intrinsics.div)({
    ...{ class: "yw-window-spacer" },
});
/** @type {__VLS_StyleScopedClasses['yw-window-spacer']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "yw-window-body" },
});
/** @type {__VLS_StyleScopedClasses['yw-window-body']} */ ;
var __VLS_2 = {
    win: (__VLS_ctx.win),
    payload: (payload.value),
};
if (payload.value?.component) {
    const __VLS_4 = (payload.value?.component);
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent1(__VLS_4, new __VLS_4({
        // @ts-ignore
        win: (__VLS_ctx.win),
    }));
    const __VLS_6 = __VLS_5({
        win: (__VLS_ctx.win),
    }, ...__VLS_functionalComponentArgsRest(__VLS_5));
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "yw-window-empty" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-window-empty']} */ ;
}
if (__VLS_ctx.win.state !== 'maximized' && __VLS_ctx.win.state !== 'fullscreen') {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span)({
        ...{ onPointerdown: // @ts-ignore
            (...[$event]) => {
                void $event;
                if (!(__VLS_ctx.win.state !== 'maximized' && __VLS_ctx.win.state !== 'fullscreen'))
                    throw 0;
                return (beginResize('e', $event));
                // @ts-ignore
                [isFocused, win, win, win, win, win, payload, payload, payload,];
            } },
        ...{ class: "yw-resize yw-resize--e" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-resize']} */ ;
    /** @type {__VLS_StyleScopedClasses['yw-resize--e']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span)({
        ...{ onPointerdown: // @ts-ignore
            (...[$event]) => {
                void $event;
                if (!(__VLS_ctx.win.state !== 'maximized' && __VLS_ctx.win.state !== 'fullscreen'))
                    throw 0;
                return (beginResize('s', $event));
                // @ts-ignore
                [];
            } },
        ...{ class: "yw-resize yw-resize--s" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-resize']} */ ;
    /** @type {__VLS_StyleScopedClasses['yw-resize--s']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span)({
        ...{ onPointerdown: // @ts-ignore
            (...[$event]) => {
                void $event;
                if (!(__VLS_ctx.win.state !== 'maximized' && __VLS_ctx.win.state !== 'fullscreen'))
                    throw 0;
                return (beginResize('se', $event));
                // @ts-ignore
                [];
            } },
        ...{ class: "yw-resize yw-resize--se" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-resize']} */ ;
    /** @type {__VLS_StyleScopedClasses['yw-resize--se']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span)({
        ...{ onPointerdown: // @ts-ignore
            (...[$event]) => {
                void $event;
                if (!(__VLS_ctx.win.state !== 'maximized' && __VLS_ctx.win.state !== 'fullscreen'))
                    throw 0;
                return (beginResize('w', $event));
                // @ts-ignore
                [];
            } },
        ...{ class: "yw-resize yw-resize--w" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-resize']} */ ;
    /** @type {__VLS_StyleScopedClasses['yw-resize--w']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span)({
        ...{ onPointerdown: // @ts-ignore
            (...[$event]) => {
                void $event;
                if (!(__VLS_ctx.win.state !== 'maximized' && __VLS_ctx.win.state !== 'fullscreen'))
                    throw 0;
                return (beginResize('n', $event));
                // @ts-ignore
                [];
            } },
        ...{ class: "yw-resize yw-resize--n" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-resize']} */ ;
    /** @type {__VLS_StyleScopedClasses['yw-resize--n']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span)({
        ...{ onPointerdown: // @ts-ignore
            (...[$event]) => {
                void $event;
                if (!(__VLS_ctx.win.state !== 'maximized' && __VLS_ctx.win.state !== 'fullscreen'))
                    throw 0;
                return (beginResize('ne', $event));
                // @ts-ignore
                [];
            } },
        ...{ class: "yw-resize yw-resize--ne" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-resize']} */ ;
    /** @type {__VLS_StyleScopedClasses['yw-resize--ne']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span)({
        ...{ onPointerdown: // @ts-ignore
            (...[$event]) => {
                void $event;
                if (!(__VLS_ctx.win.state !== 'maximized' && __VLS_ctx.win.state !== 'fullscreen'))
                    throw 0;
                return (beginResize('nw', $event));
                // @ts-ignore
                [];
            } },
        ...{ class: "yw-resize yw-resize--nw" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-resize']} */ ;
    /** @type {__VLS_StyleScopedClasses['yw-resize--nw']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span)({
        ...{ onPointerdown: // @ts-ignore
            (...[$event]) => {
                void $event;
                if (!(__VLS_ctx.win.state !== 'maximized' && __VLS_ctx.win.state !== 'fullscreen'))
                    throw 0;
                return (beginResize('sw', $event));
                // @ts-ignore
                [];
            } },
        ...{ class: "yw-resize yw-resize--sw" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-resize']} */ ;
    /** @type {__VLS_StyleScopedClasses['yw-resize--sw']} */ ;
}
var __VLS_3 = __VLS_2;
// @ts-ignore
[];
const __VLS_base = (await import('vue')).defineComponent({
    __typeProps: {},
});
const __VLS_export = {};
export default {};
import { defineProps, } from 'vue';
