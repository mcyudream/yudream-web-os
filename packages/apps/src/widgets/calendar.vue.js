import { computed, ref } from 'vue';
/** 日历小组件：真实月历网格，今日高亮 */
const now = new Date();
const year = now.getFullYear();
const month = now.getMonth();
const today = now.getDate();
/** 当月第一天是星期几（0=周日） */
const firstDay = new Date(year, month, 1).getDay();
/** 当月天数 */
const daysInMonth = new Date(year, month + 1, 0).getDate();
const cells = computed(() => {
    const out = [];
    for (let i = 0; i < firstDay; i++) {
        out.push({ day: null });
    }
    for (let d = 1; d <= daysInMonth; d++) {
        out.push({ day: d });
    }
    return out;
});
const WEEK = ['日', '一', '二', '三', '四', '五', '六'];
const selected = ref(today);
const __VLS_ctx = {};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
void __VLS_ctx, __VLS_components, __VLS_intrinsics, __VLS_directives;
// @ts-ignore
__VLS_withDotValue(selected, {});
// @ts-ignore
__VLS_withDotValue(today, {});
// @ts-ignore
__VLS_withDotValue(WEEK, {});
// @ts-ignore
__VLS_withDotValue(now, {});
void {};
/** @type {__VLS_StyleScopedClasses['yw-calendar-day']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "yw-calendar" },
});
/** @type {__VLS_StyleScopedClasses['yw-calendar']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.header, __VLS_intrinsics.header)({
    ...{ class: "yw-widget-head" },
});
/** @type {__VLS_StyleScopedClasses['yw-widget-head']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.i)({
    ...{ class: "yw-widget-head-icon i-lucide-calendar-days" },
});
/** @type {__VLS_StyleScopedClasses['yw-widget-head-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['i-lucide-calendar-days']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "yw-widget-head-title" },
});
/** @type {__VLS_StyleScopedClasses['yw-widget-head-title']} */ ;
(__VLS_unwrap(year, {}));
(__VLS_unwrap(month, {}) + 1);
__VLS_asFunctionalElement1(__VLS_intrinsics.i)({
    ...{ class: "yw-widget-dot" },
});
/** @type {__VLS_StyleScopedClasses['yw-widget-dot']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "yw-calendar-grid" },
});
/** @type {__VLS_StyleScopedClasses['yw-calendar-grid']} */ ;
const __VLS_0 = __VLS_tryAsConstant((WEEK.value));
for (const [w] of __VLS_vFor(__VLS_nonNull(__VLS_0))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        key: (w),
        ...{ class: "yw-calendar-week" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-calendar-week']} */ ;
    (w);
    // @ts-ignore
    [year, month, WEEK,];
}
const __VLS_1 = __VLS_tryAsConstant((__VLS_unwrap(cells, {})));
for (const [cell, i] of __VLS_vFor(__VLS_nonNull(__VLS_1))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ onClick: // @ts-ignore
            (...[$event]) => {
                void $event;
                return (cell.day && (selected.value = cell.day));
                // @ts-ignore
                [cells, selected,];
            } },
        key: (i),
        ...{ class: "yw-calendar-day" },
        ...{ class: ({ 'is-today': cell.day === today.value, 'is-empty': !cell.day }) },
    });
    /** @type {__VLS_StyleScopedClasses['yw-calendar-day']} */ ;
    /** @type {__VLS_StyleScopedClasses['is-today']} */ ;
    /** @type {__VLS_StyleScopedClasses['is-empty']} */ ;
    (cell.day ?? '');
    // @ts-ignore
    [today,];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.footer, __VLS_intrinsics.footer)({
    ...{ class: "yw-calendar-foot" },
});
/** @type {__VLS_StyleScopedClasses['yw-calendar-foot']} */ ;
(today.value);
(WEEK.value[now.value.getDay()]);
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "yw-calendar-selected" },
});
/** @type {__VLS_StyleScopedClasses['yw-calendar-selected']} */ ;
(selected.value || '—');
// @ts-ignore
[WEEK, selected, today, now,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
