import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useWindowsStore } from '../../stores/windows';
const __VLS_props = withDefaults(defineProps(), {
    title: '',
    showLogo: true,
    showClock: true,
    fallbackMenus: () => ['文件', '编辑', '显示', '窗口', '帮助'],
});
const emit = defineEmits();
const windowsStore = useWindowsStore();
/** 有窗口时菜单栏变实底毛玻璃（macOS：壁纸直出透明，窗口内容滚到下方时起雾） */
const isSolid = computed(() => windowsStore.windows.length > 0);
/* 实时时钟（30s 粒度足够分钟级显示） */
const now = ref(new Date());
let clockTimer = null;
const clockText = computed(() => {
    const d = now.value;
    const week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][d.getDay()];
    const p = (n) => String(n).padStart(2, '0');
    return `${week} ${d.getMonth() + 1}月${d.getDate()}日 ${p(d.getHours())}:${p(d.getMinutes())}`;
});
onMounted(() => {
    clockTimer = setInterval(() => {
        now.value = new Date();
    }, 30_000);
});
onBeforeUnmount(() => {
    if (clockTimer) {
        clearInterval(clockTimer);
    }
});
const __VLS_defaults = {
    title: '',
    showLogo: true,
    showClock: true,
    fallbackMenus: () => ['文件', '编辑', '显示', '窗口', '帮助'],
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
/** @type {__VLS_StyleScopedClasses['yw-menubar']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-menubar-logo']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-menubar-item']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-menubar']} */ ;
/** @type {__VLS_StyleScopedClasses['is-solid']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-menubar-logo']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-menubar']} */ ;
/** @type {__VLS_StyleScopedClasses['is-solid']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-menubar-item']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.header, __VLS_intrinsics.header)({
    ...{ class: "yw-menubar" },
    ...{ class: ({ 'is-solid': __VLS_unwrap(isSolid, {}) }) },
});
/** @type {__VLS_StyleScopedClasses['yw-menubar']} */ ;
/** @type {__VLS_StyleScopedClasses['is-solid']} */ ;
if (__VLS_ctx.showLogo) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: // @ts-ignore
            (...[$event]) => {
                void $event;
                if (!(__VLS_ctx.showLogo))
                    throw 0;
                return (__VLS_unwrap(emit, {})('logoclick'));
                // @ts-ignore
                [isSolid, showLogo, emit,];
            } },
        ...{ class: "yw-menubar-logo" },
        title: "系统菜单",
    });
    /** @type {__VLS_StyleScopedClasses['yw-menubar-logo']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.i)({
        ...{ class: "i-lucide-command" },
    });
    /** @type {__VLS_StyleScopedClasses['i-lucide-command']} */ ;
}
if (__VLS_ctx.title) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "yw-menubar-title" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-menubar-title']} */ ;
    (__VLS_ctx.title);
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "yw-menubar-menus" },
});
/** @type {__VLS_StyleScopedClasses['yw-menubar-menus']} */ ;
var __VLS_0 = {};
const __VLS_2 = __VLS_tryAsConstant((__VLS_ctx.fallbackMenus));
for (const [name] of __VLS_vFor(__VLS_nonNull(__VLS_2))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: // @ts-ignore
            (...[$event]) => {
                void $event;
                return (__VLS_unwrap(emit, {})('menuclick', name));
                // @ts-ignore
                [emit, title, title, fallbackMenus,];
            } },
        key: (name),
        ...{ class: "yw-menubar-item" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-menubar-item']} */ ;
    (name);
    // @ts-ignore
    [];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "yw-menubar-tray" },
});
/** @type {__VLS_StyleScopedClasses['yw-menubar-tray']} */ ;
var __VLS_3 = {};
__VLS_asFunctionalElement1(__VLS_intrinsics.i)({
    ...{ class: "yw-menubar-tray-icon i-lucide-wifi" },
    title: "Wi-Fi",
});
/** @type {__VLS_StyleScopedClasses['yw-menubar-tray-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['i-lucide-wifi']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.i)({
    ...{ class: "yw-menubar-tray-icon i-lucide-battery-medium" },
    title: "电池",
});
/** @type {__VLS_StyleScopedClasses['yw-menubar-tray-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['i-lucide-battery-medium']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.i)({
    ...{ class: "yw-menubar-tray-icon i-lucide-search" },
    title: "聚焦搜索",
});
/** @type {__VLS_StyleScopedClasses['yw-menubar-tray-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['i-lucide-search']} */ ;
if (__VLS_ctx.showClock) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "yw-menubar-clock" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-menubar-clock']} */ ;
    (__VLS_unwrap(clockText, {}));
}
var __VLS_1 = __VLS_0, __VLS_4 = __VLS_3;
// @ts-ignore
[showClock, clockText,];
const __VLS_base = (await import('vue')).defineComponent({
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
const __VLS_export = {};
export default {};
import { defineProps, defineEmits, withDefaults, } from 'vue';
