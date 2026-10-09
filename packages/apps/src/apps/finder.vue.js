import { useFinder, useVFS, useWebOS } from '@yudream/yudream-webos-vue';
import { computed, ref } from 'vue';
const props = defineProps();
const { vfs } = useVFS();
const finder = useFinder();
const { registry, ui } = useWebOS();
const creating = ref(false);
const newName = ref('');
async function createFile(type) {
    creating.value = false;
    const name = newName.value.trim() || (type === 'folder' ? '新建文件夹' : '未命名.txt');
    const path = `${finder.state.path === '/' ? '' : finder.state.path}/${name}`;
    if (type === 'folder') {
        await vfs.mkdir(path);
    }
    else {
        await vfs.write(path, '');
    }
    newName.value = '';
}
function startCreate(defaultName) {
    creating.value = true;
    newName.value = defaultName;
}
function onContextmenu(ev) {
    ev.preventDefault();
    const handlers = registry.list().flatMap(a => a.fileHandlers ?? []);
    ui.menu({
        x: ev.clientX,
        y: ev.clientY,
        items: [
            { label: '新建文件', icon: 'i-lucide-file-plus', onSelect: () => startCreate('未命名.txt') },
            { label: '新建文件夹', icon: 'i-lucide-folder-plus', onSelect: () => startCreate('新建文件夹') },
            { separator: true, label: '' },
            { label: `可打开类型：${[...new Set(handlers)].join(', ') || '无'}`, disabled: true },
        ],
    });
}
const hint = computed(() => props.win?.launchOptions?.files ? '双击文件已在编辑器打开' : '');
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
__VLS_withDotValue(creating, {});
// @ts-ignore
__VLS_withDotValue(newName, {});
// @ts-ignore
__VLS_withDotValue(hint, {});
void {};
/** @type {__VLS_StyleScopedClasses['yw-finder-app-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-finder-app-actions']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ onContextmenu: (onContextmenu) },
    ...{ class: "yw-finder-app" },
});
/** @type {__VLS_StyleScopedClasses['yw-finder-app']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.YwFinder} */
YwFinder;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    // @ts-ignore
    win: (__VLS_ctx.win),
}));
const __VLS_2 = __VLS_1({
    win: (__VLS_ctx.win),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
if (creating.value) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onPointerdown: // @ts-ignore
            (...[$event]) => {
                void $event;
                if (!(creating.value))
                    throw 0;
                return (creating.value = false);
                // @ts-ignore
                [win, creating, creating,];
            } },
        ...{ class: "yw-finder-app-dialog" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-finder-app-dialog']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "yw-finder-app-dialog-card" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-finder-app-dialog-card']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.b, __VLS_intrinsics.b)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.input, __VLS_intrinsics.input)({
        ...{ onKeydown: // @ts-ignore
            (...[$event]) => {
                void $event;
                if (!(creating.value))
                    throw 0;
                return (createFile(newName.value.includes('.') ? 'file' : 'folder'));
                // @ts-ignore
                [newName,];
            } },
        ...{ class: "yw-finder-app-input" },
    });
    (newName.value);
    /** @type {__VLS_StyleScopedClasses['yw-finder-app-input']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "yw-finder-app-actions" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-finder-app-actions']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: // @ts-ignore
            (...[$event]) => {
                void $event;
                if (!(creating.value))
                    throw 0;
                return (creating.value = false);
                // @ts-ignore
                [creating, newName,];
            } },
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: // @ts-ignore
            (...[$event]) => {
                void $event;
                if (!(creating.value))
                    throw 0;
                return (createFile(newName.value.includes('.') ? 'file' : 'folder'));
                // @ts-ignore
                [newName,];
            } },
        ...{ class: "is-primary" },
    });
    /** @type {__VLS_StyleScopedClasses['is-primary']} */ ;
}
if (hint.value) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "yw-finder-app-hint" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-finder-app-hint']} */ ;
    (hint.value);
}
// @ts-ignore
[hint, hint,];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
import { defineProps, } from 'vue';
