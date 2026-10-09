import { useVFS } from '@yudream/yudream-webos-vue';
import { onMounted, ref } from 'vue';
/** 备忘录：多便签列表，数据存 VFS /Documents/notes */
const { vfs } = useVFS();
const notes = ref([]);
const activePath = ref('');
const draft = ref('');
async function loadAll() {
    await vfs.mkdir('/Documents/notes').catch(() => { });
    const nodes = await vfs.readdir('/Documents/notes');
    const list = [];
    for (const n of nodes) {
        const content = String(await vfs.read(n.path));
        list.push({ path: n.path, title: n.name.replace(/\.txt$/, ''), content });
    }
    notes.value = list;
    if (!activePath.value && list[0]) {
        select(list[0].path);
    }
}
function select(path) {
    activePath.value = path;
    draft.value = notes.value.find(n => n.path === path)?.content ?? '';
}
async function create() {
    const path = `/Documents/notes/便签-${Date.now()}.txt`;
    await vfs.write(path, '');
    await loadAll();
    select(path);
}
async function save() {
    if (activePath.value) {
        await vfs.write(activePath.value, draft.value);
    }
}
async function remove() {
    if (activePath.value) {
        await vfs.remove(activePath.value);
        activePath.value = '';
        draft.value = '';
        await loadAll();
    }
}
onMounted(() => void loadAll());
const __VLS_ctx = {};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
void __VLS_ctx, __VLS_components, __VLS_intrinsics, __VLS_directives;
// @ts-ignore
__VLS_withDotValue(activePath, {});
void {};
/** @type {__VLS_StyleScopedClasses['yw-notes-item']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-notes-item']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-notes-editor']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-notes-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-notes-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-notes-actions']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "yw-notes" },
});
/** @type {__VLS_StyleScopedClasses['yw-notes']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.aside, __VLS_intrinsics.aside)({
    ...{ class: "yw-notes-list" },
});
/** @type {__VLS_StyleScopedClasses['yw-notes-list']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (create) },
    ...{ class: "yw-notes-new" },
});
/** @type {__VLS_StyleScopedClasses['yw-notes-new']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.i)({
    ...{ class: "i-lucide-plus" },
});
/** @type {__VLS_StyleScopedClasses['i-lucide-plus']} */ ;
const __VLS_0 = __VLS_tryAsConstant((__VLS_unwrap(notes, {})));
for (const [note] of __VLS_vFor(__VLS_nonNull(__VLS_0))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: // @ts-ignore
            (...[$event]) => {
                void $event;
                return (select(note.path));
                // @ts-ignore
                [notes,];
            } },
        key: (note.path),
        ...{ class: "yw-notes-item" },
        ...{ class: ({ 'is-active': note.path === activePath.value }) },
    });
    /** @type {__VLS_StyleScopedClasses['yw-notes-item']} */ ;
    /** @type {__VLS_StyleScopedClasses['is-active']} */ ;
    (note.title);
    // @ts-ignore
    [activePath,];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "yw-notes-editor" },
});
/** @type {__VLS_StyleScopedClasses['yw-notes-editor']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.textarea)({
    value: (__VLS_unwrap(draft, {})),
    spellcheck: "false",
    placeholder: "记录点什么…",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.footer, __VLS_intrinsics.footer)({
    ...{ class: "yw-notes-actions" },
});
/** @type {__VLS_StyleScopedClasses['yw-notes-actions']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (remove) },
    disabled: (!activePath.value),
});
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (save) },
    ...{ class: "is-primary" },
    disabled: (!activePath.value),
});
/** @type {__VLS_StyleScopedClasses['is-primary']} */ ;
// @ts-ignore
[activePath, activePath, draft,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
