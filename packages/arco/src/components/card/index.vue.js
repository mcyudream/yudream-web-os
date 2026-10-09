import { computed } from 'vue';
const props = withDefaults(defineProps(), {
    title: '',
    glass: false,
    compact: false,
    tile: false,
});
const cls = computed(() => [
    'yw-card',
    props.glass && 'is-glass',
    props.compact && 'is-compact',
    props.tile && 'is-tile',
]);
const __VLS_defaults = {
    title: '',
    glass: false,
    compact: false,
    tile: false,
};
void __VLS_defaults;
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
void __VLS_ctx, __VLS_components, __VLS_intrinsics, __VLS_directives;
void {};
/** @type {__VLS_StyleScopedClasses['yw-card']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-card']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-card']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-card']} */ ;
/** @type {__VLS_StyleScopedClasses['is-tile']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-card-body']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-card-body']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)({
    ...{ class: (__VLS_unwrap(cls, {})) },
});
if (__VLS_ctx.title || __VLS_ctx.$slots.actions) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.header, __VLS_intrinsics.header)({
        ...{ class: "yw-card-header" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-card-header']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)({
        ...{ class: "yw-card-title" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-card-title']} */ ;
    (__VLS_ctx.title);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "yw-card-actions" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-card-actions']} */ ;
    var __VLS_0 = {};
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "yw-card-body" },
});
/** @type {__VLS_StyleScopedClasses['yw-card-body']} */ ;
var __VLS_2 = {};
if (__VLS_ctx.$slots.footer) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.footer, __VLS_intrinsics.footer)({
        ...{ class: "yw-card-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-card-footer']} */ ;
    var __VLS_4 = {};
}
var __VLS_1 = __VLS_0, __VLS_3 = __VLS_2, __VLS_5 = __VLS_4;
// @ts-ignore
[cls, title, title, $slots, $slots,];
const __VLS_base = (await import('vue')).defineComponent({
    __typeProps: {},
    props: {},
});
const __VLS_export = {};
export default {};
import { defineProps, withDefaults, } from 'vue';
