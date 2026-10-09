import { useWebOS as useWebOSLocal } from '@yudream/yudream-webos-vue';
import { computed, ref } from 'vue';
/**
 * 应用商店：演示动态注册 —— 「安装」即运行时 registerApp，安装后出现在桌面/启动台。
 */
const { registry, openApp } = useStore();
const catalog = ref([
    { id: 'todo-demo', name: '待办清单', icon: 'i-lucide-check-square', iconBg: 'linear-gradient(135deg,#62BA46,#3D8B2F)', subtitle: '极简待办', size: '1.2 MB' },
    { id: 'pomodoro-demo', name: '番茄钟', icon: 'i-lucide-timer', iconBg: 'linear-gradient(135deg,#F74F9E,#C2186B)', subtitle: '专注计时', size: '0.8 MB' },
    { id: 'dice-demo', name: '骰子', icon: 'i-lucide-dices', iconBg: 'linear-gradient(135deg,#A550A7,#6B2F8E)', subtitle: '随机决策', size: '0.3 MB' },
]);
const installed = computed(() => new Set(catalog.value.filter(a => registry.get(a.id)).map(a => a.id)));
function install(app) {
    // 动态注册：AppDefinition 与宿主应用同通道
    registry.register({
        id: app.id,
        name: app.name,
        icon: app.icon,
        iconBg: app.iconBg,
        component: { template: `<div style="display:grid;place-items:center;height:100%;font-size:15px">${app.name} 已就绪</div>` },
        defaultSize: { width: 420, height: 320 },
        launchpad: { order: 60 },
    });
}
function useStore() {
    // 延迟取容器（应用在 Provider 内渲染）
    const { registry, openApp } = useWebOSLocal();
    return { registry, openApp };
}
const __VLS_ctx = {};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
void __VLS_ctx, __VLS_components, __VLS_intrinsics, __VLS_directives;
// @ts-ignore
__VLS_withDotValue(installed, {});
void {};
/** @type {__VLS_StyleScopedClasses['yw-appstore-head']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-appstore-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-appstore-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-appstore-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-appstore-btn']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "yw-appstore" },
});
/** @type {__VLS_StyleScopedClasses['yw-appstore']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.header, __VLS_intrinsics.header)({
    ...{ class: "yw-appstore-head" },
});
/** @type {__VLS_StyleScopedClasses['yw-appstore-head']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "yw-appstore-list" },
});
/** @type {__VLS_StyleScopedClasses['yw-appstore-list']} */ ;
const __VLS_0 = __VLS_tryAsConstant((__VLS_unwrap(catalog, {})));
for (const [app] of __VLS_vFor(__VLS_nonNull(__VLS_0))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        key: (app.id),
        ...{ class: "yw-appstore-item" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-appstore-item']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "yw-appstore-icon" },
        ...{ style: ({ background: app.iconBg }) },
    });
    /** @type {__VLS_StyleScopedClasses['yw-appstore-icon']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.i)({
        ...{ class: (app.icon) },
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "yw-appstore-meta" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-appstore-meta']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.b, __VLS_intrinsics.b)({});
    (app.name);
    __VLS_asFunctionalElement1(__VLS_intrinsics.small, __VLS_intrinsics.small)({});
    (app.subtitle);
    (app.size);
    if (!installed.value.has(app.id)) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
            ...{ onClick: // @ts-ignore
                (...[$event]) => {
                    void $event;
                    if (!(!installed.value.has(app.id)))
                        throw 0;
                    return (install(app));
                    // @ts-ignore
                    [catalog, installed,];
                } },
            ...{ class: "yw-appstore-btn" },
        });
        /** @type {__VLS_StyleScopedClasses['yw-appstore-btn']} */ ;
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
            ...{ onClick: // @ts-ignore
                (...[$event]) => {
                    void $event;
                    if (!!(!installed.value.has(app.id)))
                        throw 0;
                    return (__VLS_unwrap(openApp, {})(app.id));
                    // @ts-ignore
                    [openApp,];
                } },
            ...{ class: "yw-appstore-btn is-open" },
        });
        /** @type {__VLS_StyleScopedClasses['yw-appstore-btn']} */ ;
        /** @type {__VLS_StyleScopedClasses['is-open']} */ ;
    }
    // @ts-ignore
    [];
}
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
