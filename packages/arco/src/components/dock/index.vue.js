import { useWebOS } from '@yudream/yudream-webos-vue';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useAppsStore, useWindowsStore } from '../../stores/compat';
import YwIconTile from '../icon-tile/index.vue';
const props = withDefaults(defineProps(), {
    position: 'bottom',
    magnification: true,
    iconSize: 48,
    dropApps: () => [],
});
const emit = defineEmits();
const appsStore = useAppsStore();
const windowsStore = useWindowsStore();
const { dock, ui } = useWebOS();
const horizontal = computed(() => props.position === 'bottom');
/** 运行中的 appId 集合 */
const running = computed(() => new Set(windowsStore.runningApps));
/** 有最大化/全屏窗口时抑制 Dock（全屏应用独占屏幕，Dock 滑出避让） */
const suppressed = computed(() => windowsStore.windows.some(w => w.state === 'maximized' || w.state === 'fullscreen'));
/** 避让中的贴边呼出：鼠标压到 Dock 所在侧边缘时临时滑入，移开自动缩回 */
const dockEl = ref(null);
const peek = ref(false);
const EDGE = 8;
onMounted(() => {
    window.addEventListener('mousemove', onMouseMove);
});
onBeforeUnmount(() => {
    window.removeEventListener('mousemove', onMouseMove);
});
function onMouseMove(e) {
    if (!suppressed.value) {
        peek.value = false;
        return;
    }
    const atEdge = props.position === 'left'
        ? e.clientX <= EDGE
        : props.position === 'right'
            ? e.clientX >= window.innerWidth - EDGE
            : e.clientY >= window.innerHeight - EDGE;
    if (atEdge) {
        peek.value = true;
        return;
    }
    // 已呼出时：鼠标离开 Dock 区域（上方留 24px 余量）才缩回，避免中途误缩
    if (peek.value) {
        const dockTop = props.position === 'bottom'
            ? (dockEl.value?.getBoundingClientRect().top ?? window.innerHeight)
            : window.innerWidth;
        const away = props.position === 'bottom'
            ? e.clientY < dockTop - 24
            : e.clientX < dockTop - 24;
        if (away) {
            peek.value = false;
        }
    }
}
/** 文件拖放悬停的图标（结构化拖拽 MIME 命中且应用接受时高亮） */
const dropHoverApp = ref(null);
const STRUCTURED_MIME_PREFIX = 'application/x-';
function acceptsDrop(appId) {
    return props.dropApps.includes(appId);
}
function onItemDragOver(appId, e) {
    if (!acceptsDrop(appId) || !(e.dataTransfer?.types ?? []).some(t => t.startsWith(STRUCTURED_MIME_PREFIX))) {
        return;
    }
    e.preventDefault();
    if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'copy';
    }
    dropHoverApp.value = appId;
}
function onItemDragLeave(appId) {
    if (dropHoverApp.value === appId) {
        dropHoverApp.value = null;
    }
}
function onItemDrop(appId, e) {
    dropHoverApp.value = null;
    if (!acceptsDrop(appId) || !e.dataTransfer) {
        return;
    }
    e.preventDefault();
    emit('fileDrop', { appId, dataTransfer: e.dataTransfer });
}
/** Dock 项：固定应用 + 运行中的非固定应用 */
const items = computed(() => {
    const pinnedApps = dock.pinned
        .map(id => appsStore.all[id])
        .filter((a) => Boolean(a));
    const pinnedIds = new Set(pinnedApps.map(a => a.id));
    const runningUnpinned = appsStore.apps.filter(a => running.value.has(a.id) && !pinnedIds.has(a.id));
    return [...pinnedApps, ...runningUnpinned];
});
/** 分隔符：固定区与运行区之间 */
const separatorIndex = computed(() => dock.pinned.length);
const hoverKey = ref(null);
const launchingKey = ref(null);
function onItemClick(appId) {
    const wins = windowsStore.windows.filter(w => w.appId === appId);
    if (!wins.length) {
        launchingKey.value = appId;
        setTimeout(() => {
            launchingKey.value = null;
        }, 700);
        appsStore.openApp(appId);
        return;
    }
    const win = wins[0];
    if (windowsStore.focusedId === win.id && win.state !== 'minimized') {
        windowsStore.toggleMinimize(win.id);
    }
    else {
        windowsStore.focus(win.id);
    }
}
function onItemContextMenu(ev, appId) {
    ev.preventDefault();
    const appWins = windowsStore.windows.filter(w => w.appId === appId);
    const pinnedIdx = dock.pinned.indexOf(appId);
    const multi = appsStore.all[appId]?.multiInstance;
    ui.menu({
        x: ev.clientX,
        y: ev.clientY - 10,
        items: [
            // 新窗口：直接走 openApp（multiInstance 每次开新窗；聚焦已有窗走 onItemClick）
            ...(multi
                ? [{ label: '新窗口', icon: 'i-lucide-app-window', onSelect: () => appsStore.openApp(appId) }]
                : []),
            // 该应用全部已开窗口：点击聚焦（最小化的经 core focus 自动还原置顶）
            ...appWins.map(w => ({
                label: w.state === 'minimized' ? `${w.title}（最小化）` : (w.title ?? w.id),
                icon: w.id === windowsStore.focusedId ? 'i-lucide-circle-dot' : undefined,
                onSelect: () => windowsStore.focus(w.id),
            })),
            ...(appWins.length ? [{ separator: true, label: '' }] : []),
            ...(appWins.length
                ? [{ label: '关闭窗口', icon: 'i-lucide-x', danger: true, onSelect: () => windowsStore.close(appWins[0].id) }]
                : []),
            ...(pinnedIdx > -1
                ? [{ label: '从 Dock 移除', icon: 'i-lucide-minus-circle', onSelect: () => dock.unpin(appId) }]
                : [{ label: '固定到 Dock', icon: 'i-lucide-pin', onSelect: () => dock.pin(appId) }]),
        ],
    });
}
const __VLS_defaults = {
    position: 'bottom',
    magnification: true,
    iconSize: 48,
    dropApps: () => [],
};
void __VLS_defaults;
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
__VLS_withDotValue(suppressed, {});
// @ts-ignore
__VLS_withDotValue(peek, {});
// @ts-ignore
__VLS_withDotValue(horizontal, {});
// @ts-ignore
__VLS_withDotValue(hoverKey, {});
// @ts-ignore
__VLS_withDotValue(separatorIndex, {});
// @ts-ignore
__VLS_withDotValue(items, {});
// @ts-ignore
__VLS_withDotValue(running, {});
// @ts-ignore
__VLS_withDotValue(windowsStore, {});
// @ts-ignore
__VLS_withDotValue(launchingKey, {});
// @ts-ignore
__VLS_withDotValue(dropHoverApp, {});
void {};
/** @type {__VLS_StyleScopedClasses['yw-dock']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-dock']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-dock']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-dock']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-dock-item']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-dock']} */ ;
/** @type {__VLS_StyleScopedClasses['has-magnification']} */ ;
/** @type {__VLS_StyleScopedClasses['is-bottom']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-dock-item']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-dock-item']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-dock']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-dock']} */ ;
/** @type {__VLS_StyleScopedClasses['is-bottom']} */ ;
/** @type {__VLS_StyleScopedClasses['is-suppressed']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-dock']} */ ;
/** @type {__VLS_StyleScopedClasses['is-left']} */ ;
/** @type {__VLS_StyleScopedClasses['is-suppressed']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-dock']} */ ;
/** @type {__VLS_StyleScopedClasses['is-right']} */ ;
/** @type {__VLS_StyleScopedClasses['is-suppressed']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-dock-item']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-dock-item']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-dock-tip']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-dock']} */ ;
/** @type {__VLS_StyleScopedClasses['is-left']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-dock-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-dock']} */ ;
/** @type {__VLS_StyleScopedClasses['is-right']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-dock-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-dock-item']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-dock-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-dock']} */ ;
/** @type {__VLS_StyleScopedClasses['is-left']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-dock-sep']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-dock']} */ ;
/** @type {__VLS_StyleScopedClasses['is-right']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-dock-sep']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.nav, __VLS_intrinsics.nav)({
    ref: "dockEl",
    ...{ class: "yw-dock" },
    ...{ class: ([`is-${__VLS_ctx.position}`, { 'has-magnification': __VLS_ctx.magnification, 'is-suppressed': suppressed.value && !peek.value }]) },
    'aria-orientation': (horizontal.value ? 'horizontal' : 'vertical'),
});
/** @type {__VLS_StyleScopedClasses['yw-dock']} */ ;
/** @type {__VLS_StyleScopedClasses['has-magnification']} */ ;
/** @type {__VLS_StyleScopedClasses['is-suppressed']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: // @ts-ignore
        (...[$event]) => {
            void $event;
            return (__VLS_unwrap(emit, {})('showQuicklaunch'));
            // @ts-ignore
            [position, magnification, suppressed, peek, horizontal, emit,];
        } },
    ...{ onMouseenter: // @ts-ignore
        (...[$event]) => {
            void $event;
            return (hoverKey.value = 'yw-quicklaunch');
            // @ts-ignore
            [hoverKey,];
        } },
    ...{ onMouseleave: // @ts-ignore
        (...[$event]) => {
            void $event;
            return (hoverKey.value = null);
            // @ts-ignore
            [hoverKey,];
        } },
    ...{ class: "yw-dock-item" },
});
/** @type {__VLS_StyleScopedClasses['yw-dock-item']} */ ;
const __VLS_0 = YwIconTile;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    // @ts-ignore
    appKey: "yw-quicklaunch", icon: "i-lucide-search", size: (__VLS_ctx.iconSize),
}));
const __VLS_2 = __VLS_1({
    appKey: "yw-quicklaunch",
    icon: "i-lucide-search",
    size: (__VLS_ctx.iconSize),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
if (hoverKey.value === 'yw-quicklaunch') {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "yw-dock-tip" },
        ...{ class: ({ 'is-vertical': !horizontal.value }) },
    });
    /** @type {__VLS_StyleScopedClasses['yw-dock-tip']} */ ;
    /** @type {__VLS_StyleScopedClasses['is-vertical']} */ ;
}
const __VLS_5 = __VLS_tryAsConstant((items.value));
for (const [app, i] of __VLS_vFor(__VLS_nonNull(__VLS_5))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.template)({
        key: (app.id),
    });
    if (i === separatorIndex.value && separatorIndex.value < items.value.length && separatorIndex.value > 0) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span)({
            ...{ class: "yw-dock-sep" },
        });
        /** @type {__VLS_StyleScopedClasses['yw-dock-sep']} */ ;
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: // @ts-ignore
            (...[$event]) => {
                void $event;
                return (onItemClick(app.id));
                // @ts-ignore
                [horizontal, hoverKey, iconSize, items, items, separatorIndex, separatorIndex, separatorIndex,];
            } },
        ...{ onContextmenu: // @ts-ignore
            (...[$event]) => {
                void $event;
                return (onItemContextMenu($event, app.id));
                // @ts-ignore
                [];
            } },
        ...{ onMouseenter: // @ts-ignore
            (...[$event]) => {
                void $event;
                return (hoverKey.value = app.id);
                // @ts-ignore
                [hoverKey,];
            } },
        ...{ onMouseleave: // @ts-ignore
            (...[$event]) => {
                void $event;
                return (hoverKey.value = null);
                // @ts-ignore
                [hoverKey,];
            } },
        ...{ onDragover: // @ts-ignore
            (...[$event]) => {
                void $event;
                return (onItemDragOver(app.id, $event));
                // @ts-ignore
                [];
            } },
        ...{ onDragleave: // @ts-ignore
            (...[$event]) => {
                void $event;
                return (onItemDragLeave(app.id));
                // @ts-ignore
                [];
            } },
        ...{ onDrop: // @ts-ignore
            (...[$event]) => {
                void $event;
                return (onItemDrop(app.id, $event));
                // @ts-ignore
                [];
            } },
        ...{ class: "yw-dock-item" },
        ...{ class: ({
                'is-running': running.value.has(app.id),
                'is-focused': windowsStore.value.windows.some(w => w.appId === app.id && w.id === windowsStore.value.focusedId),
                'is-launching': launchingKey.value === app.id,
                'is-drop-hover': dropHoverApp.value === app.id,
            }) },
    });
    /** @type {__VLS_StyleScopedClasses['yw-dock-item']} */ ;
    /** @type {__VLS_StyleScopedClasses['is-running']} */ ;
    /** @type {__VLS_StyleScopedClasses['is-focused']} */ ;
    /** @type {__VLS_StyleScopedClasses['is-launching']} */ ;
    /** @type {__VLS_StyleScopedClasses['is-drop-hover']} */ ;
    const __VLS_6 = YwIconTile;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
        // @ts-ignore
        appKey: (app.id), icon: (app.icon), iconBg: (app.iconBg), size: (__VLS_ctx.iconSize),
    }));
    const __VLS_8 = __VLS_7({
        appKey: (app.id),
        icon: (app.icon),
        iconBg: (app.iconBg),
        size: (__VLS_ctx.iconSize),
    }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    if (hoverKey.value === app.id) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "yw-dock-tip" },
            ...{ class: ({ 'is-vertical': !horizontal.value }) },
        });
        /** @type {__VLS_StyleScopedClasses['yw-dock-tip']} */ ;
        /** @type {__VLS_StyleScopedClasses['is-vertical']} */ ;
        (app.name);
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.span)({
        ...{ class: "yw-dock-dot" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-dock-dot']} */ ;
    // @ts-ignore
    [horizontal, hoverKey, iconSize, running, windowsStore, windowsStore, launchingKey, dropHoverApp,];
}
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
export default {};
import { defineProps, defineEmits, withDefaults, } from 'vue';
