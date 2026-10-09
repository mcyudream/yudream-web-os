import { computed } from 'vue';
import YwIconTile from '../icon-tile/index.vue';
const props = withDefaults(defineProps(), {
    size: 48,
    selected: false,
});
const emit = defineEmits();
const labelColorStyle = computed(() => props.labelColor ?? undefined);
const __VLS_defaults = {
    size: 48,
    selected: false,
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
void {};
/** @type {__VLS_StyleScopedClasses['yw-app-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-app-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-app-icon-label']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ onClick: // @ts-ignore
        (...[$event]) => {
            void $event;
            return (__VLS_unwrap(emit, {})('click', $event));
            // @ts-ignore
            [emit,];
        } },
    ...{ onDblclick: // @ts-ignore
        (...[$event]) => {
            void $event;
            return (__VLS_unwrap(emit, {})('dblclick', $event));
            // @ts-ignore
            [emit,];
        } },
    ...{ onContextmenu: // @ts-ignore
        (...[$event]) => {
            void $event;
            return (__VLS_unwrap(emit, {})('contextmenu', $event));
            // @ts-ignore
            [emit,];
        } },
    ...{ class: "yw-app-icon" },
    ...{ class: ({ 'is-selected': __VLS_ctx.selected }) },
});
/** @type {__VLS_StyleScopedClasses['yw-app-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['is-selected']} */ ;
const __VLS_0 = YwIconTile;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    // @ts-ignore
    appKey: (__VLS_ctx.appKey), icon: (__VLS_ctx.icon), size: (__VLS_ctx.size), iconBg: (__VLS_ctx.iconBg),
}));
const __VLS_2 = __VLS_1({
    appKey: (__VLS_ctx.appKey),
    icon: (__VLS_ctx.icon),
    size: (__VLS_ctx.size),
    iconBg: (__VLS_ctx.iconBg),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "yw-app-icon-label" },
    ...{ style: (__VLS_unwrap(labelColorStyle, {})) },
});
/** @type {__VLS_StyleScopedClasses['yw-app-icon-label']} */ ;
(__VLS_ctx.title);
// @ts-ignore
[selected, appKey, icon, size, iconBg, labelColorStyle, title,];
const __VLS_export = (await import('vue')).defineComponent({
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
export default {};
import { defineProps, defineEmits, withDefaults, } from 'vue';
