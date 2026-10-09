import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
/** 时钟小组件：标题栏 + 大号时间 + 日期块（秒级刷新） */
const now = ref(new Date());
let timer = null;
const time = computed(() => {
    const p = (n) => String(n).padStart(2, '0');
    return `${p(now.value.getHours())}:${p(now.value.getMinutes())}:${p(now.value.getSeconds())}`;
});
const dateLines = computed(() => {
    const d = now.value;
    const week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][d.getDay()];
    return { main: `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`, week };
});
onMounted(() => {
    timer = setInterval(() => {
        now.value = new Date();
    }, 1000);
});
onBeforeUnmount(() => {
    if (timer) {
        clearInterval(timer);
    }
});
const __VLS_ctx = {};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
void __VLS_ctx, __VLS_components, __VLS_intrinsics, __VLS_directives;
// @ts-ignore
__VLS_withDotValue(dateLines, {});
void {};
/** @type {__VLS_StyleScopedClasses['yw-clock-date']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-clock-date']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "yw-clock" },
});
/** @type {__VLS_StyleScopedClasses['yw-clock']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.header, __VLS_intrinsics.header)({
    ...{ class: "yw-widget-head" },
});
/** @type {__VLS_StyleScopedClasses['yw-widget-head']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.i)({
    ...{ class: "yw-widget-head-icon i-lucide-clock" },
});
/** @type {__VLS_StyleScopedClasses['yw-widget-head-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['i-lucide-clock']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "yw-widget-head-title" },
});
/** @type {__VLS_StyleScopedClasses['yw-widget-head-title']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.i)({
    ...{ class: "yw-widget-dot" },
});
/** @type {__VLS_StyleScopedClasses['yw-widget-dot']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "yw-clock-body" },
});
/** @type {__VLS_StyleScopedClasses['yw-clock-body']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "yw-clock-time" },
});
/** @type {__VLS_StyleScopedClasses['yw-clock-time']} */ ;
(__VLS_unwrap(time, {}));
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "yw-clock-date" },
});
/** @type {__VLS_StyleScopedClasses['yw-clock-date']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.b, __VLS_intrinsics.b)({});
(dateLines.value.main);
__VLS_asFunctionalElement1(__VLS_intrinsics.em, __VLS_intrinsics.em)({});
(dateLines.value.week);
// @ts-ignore
[time, dateLines, dateLines,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
