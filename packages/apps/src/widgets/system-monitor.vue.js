import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
/** 系统监视小组件：CPU/内存/运行时长（数据源为浏览器可得信息，adapter 可换） */
const cpuLoad = ref(0.27);
const memUsed = ref(3.1);
const memTotal = ref(11.6);
const uptime = ref(11 * 86400 + 8 * 3600);
let timer = null;
/** 运行时长格式化：X 天 X 小时 */
const uptimeText = computed(() => {
    const days = Math.floor(uptime.value / 86400);
    const hours = Math.floor((uptime.value % 86400) / 3600);
    return `${days} 天 ${hours} 小时`;
});
/** 模拟波动（真实数据源由宿主 adapter 注入） */
onMounted(() => {
    timer = setInterval(() => {
        cpuLoad.value = Math.min(0.95, Math.max(0.05, cpuLoad.value + (Math.random() - 0.5) * 0.08));
        memUsed.value = Math.min(memTotal.value, Math.max(1, memUsed.value + (Math.random() - 0.5) * 0.3));
        uptime.value += 5;
    }, 2000);
});
onBeforeUnmount(() => {
    if (timer) {
        clearInterval(timer);
    }
});
const memPct = computed(() => Math.round((memUsed.value / memTotal.value) * 100));
const cpuPct = computed(() => Math.round(cpuLoad.value * 100));
const __VLS_ctx = {};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
void __VLS_ctx, __VLS_components, __VLS_intrinsics, __VLS_directives;
// @ts-ignore
__VLS_withDotValue(memUsed, {});
void {};
/** @type {__VLS_StyleScopedClasses['yw-monitor-label']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-monitor-value']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-monitor-bar']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "yw-monitor" },
});
/** @type {__VLS_StyleScopedClasses['yw-monitor']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.header, __VLS_intrinsics.header)({
    ...{ class: "yw-widget-head" },
});
/** @type {__VLS_StyleScopedClasses['yw-widget-head']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.i)({
    ...{ class: "yw-widget-head-icon i-lucide-activity" },
});
/** @type {__VLS_StyleScopedClasses['yw-widget-head-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['i-lucide-activity']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "yw-widget-head-title" },
});
/** @type {__VLS_StyleScopedClasses['yw-widget-head-title']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.i)({
    ...{ class: "yw-widget-dot" },
});
/** @type {__VLS_StyleScopedClasses['yw-widget-dot']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "yw-monitor-row" },
});
/** @type {__VLS_StyleScopedClasses['yw-monitor-row']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "yw-monitor-label" },
});
/** @type {__VLS_StyleScopedClasses['yw-monitor-label']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.i)({
    ...{ class: "i-lucide-cpu" },
});
/** @type {__VLS_StyleScopedClasses['i-lucide-cpu']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.b, __VLS_intrinsics.b)({
    ...{ class: "yw-monitor-value" },
});
/** @type {__VLS_StyleScopedClasses['yw-monitor-value']} */ ;
(__VLS_unwrap(cpuPct, {}));
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "yw-monitor-bar" },
});
/** @type {__VLS_StyleScopedClasses['yw-monitor-bar']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.i)({
    ...{ style: ({ width: `${__VLS_unwrap(cpuPct, {})}%` }) },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "yw-monitor-row" },
});
/** @type {__VLS_StyleScopedClasses['yw-monitor-row']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "yw-monitor-label" },
});
/** @type {__VLS_StyleScopedClasses['yw-monitor-label']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.i)({
    ...{ class: "i-lucide-memory-stick" },
});
/** @type {__VLS_StyleScopedClasses['i-lucide-memory-stick']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.b, __VLS_intrinsics.b)({
    ...{ class: "yw-monitor-value" },
});
/** @type {__VLS_StyleScopedClasses['yw-monitor-value']} */ ;
(memUsed.value.toFixed(1));
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "yw-monitor-bar" },
});
/** @type {__VLS_StyleScopedClasses['yw-monitor-bar']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.i)({
    ...{ style: ({ width: `${__VLS_unwrap(memPct, {})}%` }) },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "yw-monitor-row" },
});
/** @type {__VLS_StyleScopedClasses['yw-monitor-row']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "yw-monitor-label" },
});
/** @type {__VLS_StyleScopedClasses['yw-monitor-label']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.i)({
    ...{ class: "i-lucide-timer" },
});
/** @type {__VLS_StyleScopedClasses['i-lucide-timer']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.b, __VLS_intrinsics.b)({
    ...{ class: "yw-monitor-value sm" },
});
/** @type {__VLS_StyleScopedClasses['yw-monitor-value']} */ ;
/** @type {__VLS_StyleScopedClasses['sm']} */ ;
(__VLS_unwrap(uptimeText, {}));
// @ts-ignore
[cpuPct, cpuPct, memUsed, memPct, uptimeText,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
