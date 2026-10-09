import { useWebOS, useWebOSEvents } from '@yudream/yudream-webos-vue';
import { onMounted, onUnmounted, ref } from 'vue';
const emit = defineEmits();
const { ui } = useWebOS();
const notices = ref([]);
let seq = 1;
function push(title, body) {
    notices.value.unshift({
        id: seq++,
        title,
        body,
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    });
    if (notices.value.length > 20) {
        notices.value.pop();
    }
}
const { on } = useWebOSEvents();
let offs = [];
onMounted(() => {
    offs = [
        on('webos:window:open', ({ appId }) => push('应用启动', `${appId} 已打开`)),
        on('webos:app:relaunch', ({ appId }) => push('应用聚焦', `${appId} 已在运行`)),
        on('webos:vfs:change', ({ path, type }) => push('文件系统', `${type}: ${path}`)),
    ];
    push('欢迎', '通知中心已就绪');
});
onUnmounted(() => {
    for (const off of offs) {
        off();
    }
});
function clearAll() {
    notices.value = [];
    void ui;
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
__VLS_withDotValue(notices, {});
void {};
/** @type {__VLS_StyleScopedClasses['yw-nc-clear']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-nc-item-head']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-nc-item']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ onPointerdown: // @ts-ignore
        (...[$event]) => {
            void $event;
            return (__VLS_unwrap(emit, {})('close'));
            // @ts-ignore
            [emit,];
        } },
    ...{ class: "yw-nc-overlay" },
});
/** @type {__VLS_StyleScopedClasses['yw-nc-overlay']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "yw-nc" },
    role: "dialog",
    'aria-label': "通知中心",
});
/** @type {__VLS_StyleScopedClasses['yw-nc']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.header, __VLS_intrinsics.header)({
    ...{ class: "yw-nc-header" },
});
/** @type {__VLS_StyleScopedClasses['yw-nc-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.b, __VLS_intrinsics.b)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (clearAll) },
    ...{ class: "yw-nc-clear" },
});
/** @type {__VLS_StyleScopedClasses['yw-nc-clear']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "yw-nc-list" },
});
/** @type {__VLS_StyleScopedClasses['yw-nc-list']} */ ;
const __VLS_0 = __VLS_tryAsConstant((notices.value));
for (const [n] of __VLS_vFor(__VLS_nonNull(__VLS_0))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        key: (n.id),
        ...{ class: "yw-nc-item" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-nc-item']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "yw-nc-item-head" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-nc-item-head']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.b, __VLS_intrinsics.b)({});
    (n.title);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (n.time);
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    (n.body);
    // @ts-ignore
    [notices,];
}
if (!notices.value.length) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "yw-nc-empty" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-nc-empty']} */ ;
}
// @ts-ignore
[notices,];
const __VLS_export = (await import('vue')).defineComponent({
    __typeEmits: {},
});
export default {};
import { defineEmits, } from 'vue';
