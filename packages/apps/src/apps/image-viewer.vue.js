import { useVFS, useWebOS } from '@yudream/yudream-webos-vue';
import { computed, ref } from 'vue';
const props = defineProps();
const { vfs } = useVFS();
const { openUrl } = useWebOS();
const dataUrl = ref('');
const path = computed(() => {
    const files = props.win?.launchOptions?.files;
    return files?.[0] ?? '';
});
void (async () => {
    if (path.value) {
        const data = await vfs.read(path.value);
        dataUrl.value = typeof data === 'string' ? `data:image;base64,${btoa(data)}` : '';
    }
})();
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
__VLS_withDotValue(dataUrl, {});
void {};
/** @type {__VLS_StyleScopedClasses['yw-image-viewer']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-image-viewer-empty']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-image-viewer-empty']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "yw-image-viewer" },
});
/** @type {__VLS_StyleScopedClasses['yw-image-viewer']} */ ;
if (dataUrl.value) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
        src: (dataUrl.value),
        alt: (__VLS_unwrap(path, {})),
    });
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "yw-image-viewer-empty" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-image-viewer-empty']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.i)({
        ...{ class: "i-lucide-image" },
    });
    /** @type {__VLS_StyleScopedClasses['i-lucide-image']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "sub" },
    });
    /** @type {__VLS_StyleScopedClasses['sub']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: // @ts-ignore
            (...[$event]) => {
                void $event;
                if (!!(dataUrl.value))
                    throw 0;
                return (__VLS_unwrap(openUrl, {})('https://picsum.photos', 'browser'));
                // @ts-ignore
                [dataUrl, dataUrl, path, openUrl,];
            } },
    });
}
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
import { defineProps, } from 'vue';
