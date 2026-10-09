import { computed } from 'vue';
import { tileBackground } from './colors';
const props = withDefaults(defineProps(), {
    size: 48,
});
const isImage = computed(() => /^(?:https?:|data:|\/|\.)/.test(props.icon));
const bg = computed(() => tileBackground(props.appKey, props.iconBg));
const iconFontSize = computed(() => `${Math.round(props.size * 0.5)}px`);
const style = computed(() => ({
    width: `${props.size}px`,
    height: `${props.size}px`,
    background: bg.value,
    borderRadius: '22.37%',
    boxShadow: `inset 0 1px 0 rgba(255, 255, 255, 0.4),
    inset 0 0 0 0.5px rgba(255, 255, 255, 0.25),
    inset 0 -6px 12px rgba(0, 0, 0, 0.18),
    0 3px 8px rgba(0, 0, 0, 0.3),
    0 1px 3px rgba(0, 0, 0, 0.2)`,
}));
const __VLS_defaults = {
    size: 48,
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
// @ts-ignore
__VLS_withDotValue(isImage, {});
void {};
/** @type {__VLS_StyleScopedClasses['yw-icon-tile']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-icon-tile']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-icon-tile']} */ ;
(__VLS_unwrap(iconFontSize, {}));
// @ts-ignore
[iconFontSize,];
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "yw-icon-tile" },
    ...{ style: (__VLS_unwrap(style, {})) },
});
/** @type {__VLS_StyleScopedClasses['yw-icon-tile']} */ ;
if (isImage.value) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
        src: (__VLS_ctx.icon),
        alt: "",
        draggable: "false",
    });
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span)({
        ...{ class: "yw-icon-tile-gloss" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-icon-tile-gloss']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.i)({
        ...{ class: (__VLS_ctx.icon) },
    });
}
// @ts-ignore
[style, isImage, icon, icon,];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
    props: {},
});
export default {};
import { defineProps, withDefaults, } from 'vue';
