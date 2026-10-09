import { useVFS, useWebOS } from '@yudream/yudream-webos-vue';
import { computed, ref, watch } from 'vue';
const props = defineProps();
const { vfs } = useVFS();
const { ui } = useWebOS();
const filePath = computed(() => {
    const files = props.win?.launchOptions?.files;
    return files?.[0] ?? '';
});
const content = ref('');
const dirty = ref(false);
const loadedFrom = ref('');
async function load() {
    if (filePath.value) {
        try {
            content.value = String(await vfs.read(filePath.value));
            loadedFrom.value = filePath.value;
        }
        catch {
            content.value = '';
        }
    }
}
void load;
void watch;
watch(filePath, () => void load(), { immediate: true });
async function save() {
    const path = loadedFrom.value || `/Documents/未命名-${Date.now()}.txt`;
    await vfs.write(path, content.value);
    loadedFrom.value = path;
    dirty.value = false;
    ui.message('success', `已保存 ${path}`);
}
function onInput() {
    dirty.value = true;
}
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
__VLS_withDotValue(loadedFrom, {});
// @ts-ignore
__VLS_withDotValue(dirty, {});
void {};
/** @type {__VLS_StyleScopedClasses['yw-editor-save']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "yw-editor" },
});
/** @type {__VLS_StyleScopedClasses['yw-editor']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.header, __VLS_intrinsics.header)({
    ...{ class: "yw-editor-bar" },
});
/** @type {__VLS_StyleScopedClasses['yw-editor-bar']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "yw-editor-path" },
});
/** @type {__VLS_StyleScopedClasses['yw-editor-path']} */ ;
(loadedFrom.value || '未命名');
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (save) },
    ...{ class: "yw-editor-save" },
    ...{ class: ({ 'is-dirty': dirty.value }) },
});
/** @type {__VLS_StyleScopedClasses['yw-editor-save']} */ ;
/** @type {__VLS_StyleScopedClasses['is-dirty']} */ ;
(dirty.value ? '保存 •' : '保存');
__VLS_asFunctionalElement1(__VLS_intrinsics.textarea)({
    ...{ onInput: (onInput) },
    ...{ onKeydown: (save) },
    ...{ onKeydown: (save) },
    value: (__VLS_unwrap(content, {})),
    ...{ class: "yw-editor-text" },
    spellcheck: "false",
    placeholder: "在此输入…",
});
/** @type {__VLS_StyleScopedClasses['yw-editor-text']} */ ;
// @ts-ignore
[loadedFrom, dirty, dirty, content,];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
import { defineProps, } from 'vue';
