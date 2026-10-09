import { useWidgets } from '@yudream/yudream-webos-vue';
import { computed } from 'vue';
const emit = defineEmits();
const { widgets, add, setEditing } = useWidgets();
const definitions = computed(() => widgets.listDefinitions());
function addWidget(widgetId, size) {
    add(widgetId, size, { col: 0, row: 0 });
    setEditing(true);
    emit('close');
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
__VLS_withDotValue(definitions, {});
void {};
/** @type {__VLS_StyleScopedClasses['yw-widget-gallery']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-widget-size-btn']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ onPointerdown: // @ts-ignore
        (...[$event]) => {
            void $event;
            return (__VLS_unwrap(emit, {})('close'));
            // @ts-ignore
            [emit,];
        } },
    ...{ class: "yw-widget-gallery-overlay" },
});
/** @type {__VLS_StyleScopedClasses['yw-widget-gallery-overlay']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "yw-widget-gallery" },
    role: "dialog",
    'aria-label': "小组件画廊",
});
/** @type {__VLS_StyleScopedClasses['yw-widget-gallery']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "yw-widget-gallery-list" },
});
/** @type {__VLS_StyleScopedClasses['yw-widget-gallery-list']} */ ;
const __VLS_0 = __VLS_tryAsConstant((definitions.value));
for (const [def] of __VLS_vFor(__VLS_nonNull(__VLS_0))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        key: (def.id),
        ...{ class: "yw-widget-gallery-item" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-widget-gallery-item']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "yw-widget-gallery-name" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-widget-gallery-name']} */ ;
    (def.name);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "yw-widget-gallery-sizes" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-widget-gallery-sizes']} */ ;
    const __VLS_1 = __VLS_tryAsConstant((def.sizes));
    for (const [size] of __VLS_vFor(__VLS_nonNull(__VLS_1))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
            ...{ onClick: // @ts-ignore
                (...[$event]) => {
                    void $event;
                    return (addWidget(def.id, size));
                    // @ts-ignore
                    [definitions,];
                } },
            key: (size),
            ...{ class: "yw-widget-size-btn" },
        });
        /** @type {__VLS_StyleScopedClasses['yw-widget-size-btn']} */ ;
        (size === 'small' ? '小' : size === 'medium' ? '中' : '大');
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
}
if (!definitions.value.length) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "yw-widget-gallery-empty" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-widget-gallery-empty']} */ ;
}
// @ts-ignore
[definitions,];
const __VLS_export = (await import('vue')).defineComponent({
    __typeEmits: {},
});
export default {};
import { defineEmits, } from 'vue';
