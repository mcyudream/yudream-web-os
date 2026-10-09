import { computed } from 'vue';
import { useWindowsStore } from '../../stores/windows';
const emit = defineEmits();
const windowsStore = useWindowsStore();
const tasks = computed(() => windowsStore.windows.filter(w => w.state !== 'minimized'));
const now = computed(() => new Date());
function fmt(d) {
    const p = (n) => String(n).padStart(2, '0');
    return `${p(d.getHours())}:${p(d.getMinutes())}`;
}
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
__VLS_withDotValue(windowsStore, {});
void {};
/** @type {__VLS_StyleScopedClasses['yw-taskbar-start']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-taskbar-search']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-taskbar-task']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-taskbar-task']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.footer, __VLS_intrinsics.footer)({
    ...{ class: "yw-taskbar" },
});
/** @type {__VLS_StyleScopedClasses['yw-taskbar']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: // @ts-ignore
        (...[$event]) => {
            void $event;
            return (__VLS_unwrap(emit, {})('showLaunchpad'));
            // @ts-ignore
            [emit,];
        } },
    ...{ class: "yw-taskbar-start" },
    title: "启动台",
});
/** @type {__VLS_StyleScopedClasses['yw-taskbar-start']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.i)({
    ...{ class: "i-lucide-grid-3x3" },
});
/** @type {__VLS_StyleScopedClasses['i-lucide-grid-3x3']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "yw-taskbar-tasks" },
});
/** @type {__VLS_StyleScopedClasses['yw-taskbar-tasks']} */ ;
const __VLS_0 = __VLS_tryAsConstant((__VLS_unwrap(tasks, {})));
for (const [win] of __VLS_vFor(__VLS_nonNull(__VLS_0))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: // @ts-ignore
            (...[$event]) => {
                void $event;
                return (windowsStore.value.focus(win.id));
                // @ts-ignore
                [tasks, windowsStore,];
            } },
        key: (win.id),
        ...{ class: "yw-taskbar-task" },
        ...{ class: ({ 'is-focused': win.id === windowsStore.value.focusedId }) },
    });
    /** @type {__VLS_StyleScopedClasses['yw-taskbar-task']} */ ;
    /** @type {__VLS_StyleScopedClasses['is-focused']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.i)({
        ...{ class: "i-lucide-app-window" },
    });
    /** @type {__VLS_StyleScopedClasses['i-lucide-app-window']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (win.title);
    // @ts-ignore
    [windowsStore,];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "yw-taskbar-tray" },
});
/** @type {__VLS_StyleScopedClasses['yw-taskbar-tray']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: // @ts-ignore
        (...[$event]) => {
            void $event;
            return (__VLS_unwrap(emit, {})('showQuicklaunch'));
            // @ts-ignore
            [emit,];
        } },
    ...{ class: "yw-taskbar-search" },
    title: "快速启动",
});
/** @type {__VLS_StyleScopedClasses['yw-taskbar-search']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.i)({
    ...{ class: "i-lucide-search" },
});
/** @type {__VLS_StyleScopedClasses['i-lucide-search']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "yw-taskbar-clock" },
});
/** @type {__VLS_StyleScopedClasses['yw-taskbar-clock']} */ ;
(fmt(__VLS_unwrap(now, {})));
// @ts-ignore
[now,];
const __VLS_export = (await import('vue')).defineComponent({
    __typeEmits: {},
});
export default {};
import { defineEmits, } from 'vue';
