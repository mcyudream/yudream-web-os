import { useSystemSettings } from '@yudream/yudream-webos-vue';
import { computed } from 'vue';
const props = defineProps();
const emit = defineEmits();
const { settings, setMode, setAccent, setWallpaper } = useSystemSettings();
/** 强调色候选（写入 settings.accent，全主题 --yw-primary/--yw-ring 跟随并持久化） */
const ACCENTS = [
    { id: 'blue', value: '#0a84ff' },
    { id: 'purple', value: '#bf5af2' },
    { id: 'pink', value: '#ff375f' },
    { id: 'orange', value: '#ff9f0a' },
    { id: 'green', value: '#32d74b' },
    { id: 'graphite', value: '#8e8e93' },
];
/** 深色生效态（system 模式下按系统暗色折算） */
const isDarkEff = computed(() => settings.mode === 'system' ? settings.systemDark : settings.mode === 'dark');
const currentAccent = computed(() => settings.accent ?? null);
function toggleDark() {
    setMode(settings.mode === 'dark' ? 'light' : 'dark');
}
function isCurrentWallpaper(src) {
    const cur = props.currentWallpaper ?? settings.wallpaper?.src ?? null;
    return cur === src;
}
function pickWallpaper(src) {
    setWallpaper(src === null ? null : { src });
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
__VLS_withDotValue(isDarkEff, {});
// @ts-ignore
__VLS_withDotValue(currentAccent, {});
// @ts-ignore
__VLS_withDotValue(settings, {});
void {};
/** @type {__VLS_StyleScopedClasses['yw-cc-row-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-cc-row-text']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-cc-row-text']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-cc-switch']} */ ;
/** @type {__VLS_StyleScopedClasses['is-on']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-cc-switch']} */ ;
/** @type {__VLS_StyleScopedClasses['is-on']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-cc-switch-knob']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-cc-section-head']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-cc-swatch']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-cc-swatch']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-cc-wallpaper-thumb']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-cc-wallpaper-thumb']} */ ;
/** @type {__VLS_StyleScopedClasses['is-active']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ onPointerdown: // @ts-ignore
        (...[$event]) => {
            void $event;
            return (__VLS_unwrap(emit, {})('close'));
            // @ts-ignore
            [emit,];
        } },
    ...{ class: "yw-cc-overlay" },
});
/** @type {__VLS_StyleScopedClasses['yw-cc-overlay']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "yw-cc" },
    role: "dialog",
    'aria-label': "控制中心",
});
/** @type {__VLS_StyleScopedClasses['yw-cc']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "yw-cc-row" },
});
/** @type {__VLS_StyleScopedClasses['yw-cc-row']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "yw-cc-row-icon" },
    ...{ class: ({ 'is-on': isDarkEff.value }) },
});
/** @type {__VLS_StyleScopedClasses['yw-cc-row-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['is-on']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.i)({
    ...{ class: "i-lucide-moon" },
});
/** @type {__VLS_StyleScopedClasses['i-lucide-moon']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "yw-cc-row-text" },
});
/** @type {__VLS_StyleScopedClasses['yw-cc-row-text']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.b, __VLS_intrinsics.b)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.small, __VLS_intrinsics.small)({});
(isDarkEff.value ? '深色界面' : '浅色界面');
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (toggleDark) },
    ...{ class: "yw-cc-switch" },
    ...{ class: ({ 'is-on': isDarkEff.value }) },
    role: "switch",
    'aria-checked': (isDarkEff.value),
    'aria-label': "深色模式",
});
/** @type {__VLS_StyleScopedClasses['yw-cc-switch']} */ ;
/** @type {__VLS_StyleScopedClasses['is-on']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span)({
    ...{ class: "yw-cc-switch-knob" },
});
/** @type {__VLS_StyleScopedClasses['yw-cc-switch-knob']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "yw-cc-section" },
});
/** @type {__VLS_StyleScopedClasses['yw-cc-section']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "yw-cc-section-head" },
});
/** @type {__VLS_StyleScopedClasses['yw-cc-section-head']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.i)({
    ...{ class: "i-lucide-palette" },
});
/** @type {__VLS_StyleScopedClasses['i-lucide-palette']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "yw-cc-swatch-row" },
});
/** @type {__VLS_StyleScopedClasses['yw-cc-swatch-row']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: // @ts-ignore
        (...[$event]) => {
            void $event;
            return (__VLS_unwrap(setAccent, {})(null));
            // @ts-ignore
            [isDarkEff, isDarkEff, isDarkEff, isDarkEff, setAccent,];
        } },
    ...{ class: "yw-cc-swatch" },
    ...{ class: ({ 'is-active': currentAccent.value === null }) },
    title: "默认",
});
/** @type {__VLS_StyleScopedClasses['yw-cc-swatch']} */ ;
/** @type {__VLS_StyleScopedClasses['is-active']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.i)({
    ...{ class: "i-lucide-rotate-ccw" },
});
/** @type {__VLS_StyleScopedClasses['i-lucide-rotate-ccw']} */ ;
const __VLS_0 = __VLS_tryAsConstant((__VLS_unwrap(ACCENTS, {})));
for (const [a] of __VLS_vFor(__VLS_nonNull(__VLS_0))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.button)({
        ...{ onClick: // @ts-ignore
            (...[$event]) => {
                void $event;
                return (__VLS_unwrap(setAccent, {})(a.value));
                // @ts-ignore
                [setAccent, currentAccent, ACCENTS,];
            } },
        key: (a.id),
        ...{ class: "yw-cc-swatch" },
        ...{ class: ({ 'is-active': currentAccent.value?.toLowerCase() === a.value.toLowerCase() }) },
        title: (a.id),
        ...{ style: ({ background: a.value }) },
    });
    /** @type {__VLS_StyleScopedClasses['yw-cc-swatch']} */ ;
    /** @type {__VLS_StyleScopedClasses['is-active']} */ ;
    // @ts-ignore
    [currentAccent,];
}
if (__VLS_ctx.wallpapers?.length) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "yw-cc-section" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-cc-section']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "yw-cc-section-head" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-cc-section-head']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.i)({
        ...{ class: "i-lucide-image" },
    });
    /** @type {__VLS_StyleScopedClasses['i-lucide-image']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "yw-cc-wallpaper-row" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-cc-wallpaper-row']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button)({
        ...{ onClick: // @ts-ignore
            (...[$event]) => {
                void $event;
                if (!(__VLS_ctx.wallpapers?.length))
                    throw 0;
                return (pickWallpaper(null));
                // @ts-ignore
                [wallpapers,];
            } },
        ...{ class: "yw-cc-wallpaper-thumb is-default" },
        ...{ class: ({ 'is-active': (__VLS_ctx.currentWallpaper ?? settings.value.wallpaper?.src ?? null) === null }) },
        title: "默认渐变",
    });
    /** @type {__VLS_StyleScopedClasses['yw-cc-wallpaper-thumb']} */ ;
    /** @type {__VLS_StyleScopedClasses['is-default']} */ ;
    /** @type {__VLS_StyleScopedClasses['is-active']} */ ;
    const __VLS_1 = __VLS_tryAsConstant((__VLS_ctx.wallpapers));
    for (const [w] of __VLS_vFor(__VLS_nonNull(__VLS_1))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.button)({
            ...{ onClick: // @ts-ignore
                (...[$event]) => {
                    void $event;
                    if (!(__VLS_ctx.wallpapers?.length))
                        throw 0;
                    return (pickWallpaper(w.src));
                    // @ts-ignore
                    [wallpapers, currentWallpaper, settings,];
                } },
            key: (w.id),
            ...{ class: "yw-cc-wallpaper-thumb" },
            ...{ class: ({ 'is-active': isCurrentWallpaper(w.src) }) },
            title: (w.name ?? w.id),
            ...{ style: ({ backgroundImage: `url(${w.src})` }) },
        });
        /** @type {__VLS_StyleScopedClasses['yw-cc-wallpaper-thumb']} */ ;
        /** @type {__VLS_StyleScopedClasses['is-active']} */ ;
        // @ts-ignore
        [];
    }
}
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeEmits: {},
    __typeProps: {},
});
export default {};
import { defineProps, defineEmits, } from 'vue';
