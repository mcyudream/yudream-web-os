import { ref } from 'vue';
/** 计算器：frameless 变体演示（小窗口无标题栏自绘） */
const display = ref('0');
function press(k) {
    if (k === 'C') {
        display.value = '0';
    }
    else if (k === '=') {
        try {
            // 受限表达式求值：仅数字与运算符
            if (!/^[\d+\-*/.() ]+$/.test(display.value)) {
                throw new Error('bad');
            }
            // eslint-disable-next-line no-new-func
            display.value = String(new Function(`return (${display.value})`)());
        }
        catch {
            display.value = '错误';
        }
    }
    else if (k === '±') {
        display.value = display.value.startsWith('-') ? display.value.slice(1) : `-${display.value}`;
    }
    else {
        display.value = display.value === '0' || display.value === '错误' ? k : display.value + k;
    }
}
const keys = [
    ['C', '±', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '−'],
    ['1', '2', '3', '+'],
    ['0', '.', '='],
];
const __VLS_ctx = {};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
void __VLS_ctx, __VLS_components, __VLS_intrinsics, __VLS_directives;
void {};
/** @type {__VLS_StyleScopedClasses['yw-calculator-key']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-calculator-key']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-calculator-key']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "yw-calculator" },
});
/** @type {__VLS_StyleScopedClasses['yw-calculator']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "yw-calculator-display" },
});
/** @type {__VLS_StyleScopedClasses['yw-calculator-display']} */ ;
(__VLS_unwrap(display, {}));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "yw-calculator-keys" },
});
/** @type {__VLS_StyleScopedClasses['yw-calculator-keys']} */ ;
const __VLS_0 = __VLS_tryAsConstant((__VLS_unwrap(keys, {})));
for (const [row] of __VLS_vFor(__VLS_nonNull(__VLS_0))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.template)({
        key: (row.join()),
    });
    const __VLS_1 = __VLS_tryAsConstant((row));
    for (const [k] of __VLS_vFor(__VLS_nonNull(__VLS_1))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
            ...{ onClick: // @ts-ignore
                (...[$event]) => {
                    void $event;
                    return (press(k === '÷' ? '/' : k === '×' ? '*' : k === '−' ? '-' : k));
                    // @ts-ignore
                    [display, keys,];
                } },
            key: (k),
            ...{ class: "yw-calculator-key" },
            ...{ class: ({ 'is-op': ['÷', '×', '−', '+', '='].includes(k), 'is-zero': k === '0' }) },
        });
        /** @type {__VLS_StyleScopedClasses['yw-calculator-key']} */ ;
        /** @type {__VLS_StyleScopedClasses['is-op']} */ ;
        /** @type {__VLS_StyleScopedClasses['is-zero']} */ ;
        (k);
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
}
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
