import { useFinder, useVFS, useWebOS } from '@yudream/yudream-webos-vue';
import { computed, onMounted, ref, watch } from 'vue';
const __VLS_props = withDefaults(defineProps(), {});
const { vfs } = useVFS();
const { state, navigate, back, forward, setView, select } = useFinder();
const { registry, openApp } = useWebOS();
const nodes = ref([]);
const loading = ref(false);
const keyword = ref('');
const SIDEBAR_SECTIONS = [
    {
        title: '收藏',
        items: [
            { label: '文稿', path: '/Documents', icon: 'i-lucide-file-text' },
            { label: '下载', path: '/Downloads', icon: 'i-lucide-download' },
            { label: '图片', path: '/Pictures', icon: 'i-lucide-image' },
            { label: '桌面', path: '/Desktop', icon: 'i-lucide-monitor' },
        ],
    },
    {
        title: '位置',
        items: [
            { label: '系统', path: '/system', icon: 'i-lucide-hard-drive' },
            { label: '根目录', path: '/', icon: 'i-lucide-database' },
        ],
    },
];
async function load() {
    loading.value = true;
    try {
        // 确保常用目录存在
        for (const p of ['/Documents', '/Downloads', '/Pictures', '/Desktop']) {
            await vfs.mkdir(p).catch(() => { });
        }
        nodes.value = await vfs.readdir(state.path);
    }
    catch {
        nodes.value = [];
    }
    finally {
        loading.value = false;
    }
}
onMounted(load);
watch(() => state.path, load);
const filtered = computed(() => {
    const kw = keyword.value.trim().toLowerCase();
    const list = [...nodes.value].sort((a, b) => (a.kind === b.kind ? a.name.localeCompare(b.name) : a.kind === 'directory' ? -1 : 1));
    return kw ? list.filter(n => n.name.toLowerCase().includes(kw)) : list;
});
const breadcrumbs = computed(() => {
    const parts = state.path.split('/').filter(Boolean);
    const crumbs = [{ name: '根目录', path: '/' }];
    let acc = '';
    for (const p of parts) {
        acc += `/${p}`;
        crumbs.push({ name: p, path: acc });
    }
    return crumbs;
});
const selectedIds = computed(() => new Set(state.selection));
function openNode(node) {
    if (node.kind === 'directory') {
        navigate(node.path);
        return;
    }
    // fileHandlers 路由：双击文件 → registry 查应用 → 透传 launchOptions
    const ext = node.name.split('.').pop()?.toLowerCase() ?? '';
    const handler = registry.queryByFileType(ext)[0];
    if (handler) {
        openApp(handler.id, { files: [node.path] });
    }
    else {
        openApp('text-editor', { files: [node.path] });
    }
}
function onItemContextmenu(ev, node) {
    ev.preventDefault();
    const { ui } = useWebOS();
    ui.menu({
        x: ev.clientX,
        y: ev.clientY,
        items: [
            { label: '打开', icon: 'i-lucide-external-link', onSelect: () => openNode(node) },
            { label: '重命名', disabled: true },
            { separator: true, label: '' },
            { label: '移到废纸篓', icon: 'i-lucide-trash-2', danger: true, onSelect: () => { void vfs.move(node.path, `/.Trash/${node.name}`); } },
        ],
    });
}
const __VLS_defaults = {};
void __VLS_defaults;
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
__VLS_withDotValue(state, {});
// @ts-ignore
__VLS_withDotValue(loading, {});
// @ts-ignore
__VLS_withDotValue(filtered, {});
// @ts-ignore
__VLS_withDotValue(selectedIds, {});
// @ts-ignore
__VLS_withDotValue(nodes, {});
void {};
/** @type {__VLS_StyleScopedClasses['yw-finder-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-finder-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-finder-view-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-finder-side-item']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-finder-side-item']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-finder-side-item']} */ ;
/** @type {__VLS_StyleScopedClasses['is-active']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-finder-side-item']} */ ;
/** @type {__VLS_StyleScopedClasses['is-active']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-finder-crumb']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-finder-crumb']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-finder-item']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-finder-table']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-finder-table']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-finder-table']} */ ;
/** @type {__VLS_StyleScopedClasses['is-selected']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-finder-col-item']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "yw-finder" },
});
/** @type {__VLS_StyleScopedClasses['yw-finder']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "yw-finder-toolbar" },
});
/** @type {__VLS_StyleScopedClasses['yw-finder-toolbar']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "yw-finder-nav" },
});
/** @type {__VLS_StyleScopedClasses['yw-finder-nav']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (__VLS_unwrap(back, {})) },
    ...{ class: "yw-finder-btn" },
    disabled: (state.value.historyIndex === 0),
    title: "返回",
});
/** @type {__VLS_StyleScopedClasses['yw-finder-btn']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.i)({
    ...{ class: "i-lucide-chevron-left" },
});
/** @type {__VLS_StyleScopedClasses['i-lucide-chevron-left']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (__VLS_unwrap(forward, {})) },
    ...{ class: "yw-finder-btn" },
    disabled: (state.value.historyIndex >= state.value.history.length - 1),
    title: "前进",
});
/** @type {__VLS_StyleScopedClasses['yw-finder-btn']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.i)({
    ...{ class: "i-lucide-chevron-right" },
});
/** @type {__VLS_StyleScopedClasses['i-lucide-chevron-right']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "yw-finder-views" },
});
/** @type {__VLS_StyleScopedClasses['yw-finder-views']} */ ;
const __VLS_0 = __VLS_tryAsConstant(['icon', 'list', 'column', 'gallery']);
for (const [v] of __VLS_vFor(__VLS_nonNull(__VLS_0))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: // @ts-ignore
            (...[$event]) => {
                void $event;
                return (__VLS_unwrap(setView, {})(v));
                // @ts-ignore
                [back, state, state, state, forward, setView,];
            } },
        key: (v),
        ...{ class: "yw-finder-view-btn" },
        ...{ class: ({ 'is-active': state.value.view === v }) },
        title: (v),
    });
    /** @type {__VLS_StyleScopedClasses['yw-finder-view-btn']} */ ;
    /** @type {__VLS_StyleScopedClasses['is-active']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.i)({
        ...{ class: (`i-lucide-layout-${v}`) },
    });
    // @ts-ignore
    [state,];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.input)({
    ...{ class: "yw-finder-search" },
    placeholder: "搜索",
    spellcheck: "false",
});
(__VLS_unwrap(keyword, {}));
/** @type {__VLS_StyleScopedClasses['yw-finder-search']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "yw-finder-main" },
});
/** @type {__VLS_StyleScopedClasses['yw-finder-main']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.aside, __VLS_intrinsics.aside)({
    ...{ class: "yw-finder-sidebar" },
});
/** @type {__VLS_StyleScopedClasses['yw-finder-sidebar']} */ ;
const __VLS_1 = __VLS_tryAsConstant((__VLS_unwrap(SIDEBAR_SECTIONS, {})));
for (const [sec] of __VLS_vFor(__VLS_nonNull(__VLS_1))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        key: (sec.title),
        ...{ class: "yw-finder-side-sec" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-finder-side-sec']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "yw-finder-side-title" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-finder-side-title']} */ ;
    (sec.title);
    const __VLS_2 = __VLS_tryAsConstant((sec.items));
    for (const [item] of __VLS_vFor(__VLS_nonNull(__VLS_2))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
            ...{ onClick: // @ts-ignore
                (...[$event]) => {
                    void $event;
                    return (__VLS_unwrap(navigate, {})(item.path));
                    // @ts-ignore
                    [keyword, SIDEBAR_SECTIONS, navigate,];
                } },
            key: (item.path),
            ...{ class: "yw-finder-side-item" },
            ...{ class: ({ 'is-active': state.value.path === item.path }) },
        });
        /** @type {__VLS_StyleScopedClasses['yw-finder-side-item']} */ ;
        /** @type {__VLS_StyleScopedClasses['is-active']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.i)({
            ...{ class: (item.icon) },
        });
        (item.label);
        // @ts-ignore
        [state,];
    }
    // @ts-ignore
    [];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "yw-finder-content" },
});
/** @type {__VLS_StyleScopedClasses['yw-finder-content']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "yw-finder-breadcrumbs" },
});
/** @type {__VLS_StyleScopedClasses['yw-finder-breadcrumbs']} */ ;
const __VLS_3 = __VLS_tryAsConstant((__VLS_unwrap(breadcrumbs, {})));
for (const [crumb, i] of __VLS_vFor(__VLS_nonNull(__VLS_3))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.template)({
        key: (crumb.path),
    });
    if (i > 0) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.i)({
            ...{ class: "yw-finder-crumb-sep i-lucide-chevron-right" },
        });
        /** @type {__VLS_StyleScopedClasses['yw-finder-crumb-sep']} */ ;
        /** @type {__VLS_StyleScopedClasses['i-lucide-chevron-right']} */ ;
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: // @ts-ignore
            (...[$event]) => {
                void $event;
                return (__VLS_unwrap(navigate, {})(crumb.path));
                // @ts-ignore
                [navigate, breadcrumbs,];
            } },
        ...{ class: "yw-finder-crumb" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-finder-crumb']} */ ;
    (crumb.name);
    // @ts-ignore
    [];
}
if (loading.value) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "yw-finder-status" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-finder-status']} */ ;
}
else if (!filtered.value.length) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "yw-finder-empty" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-finder-empty']} */ ;
}
else if (state.value.view === 'icon' || state.value.view === 'gallery') {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "yw-finder-grid" },
        ...{ class: ({ 'is-gallery': state.value.view === 'gallery' }) },
    });
    /** @type {__VLS_StyleScopedClasses['yw-finder-grid']} */ ;
    /** @type {__VLS_StyleScopedClasses['is-gallery']} */ ;
    const __VLS_4 = __VLS_tryAsConstant((filtered.value));
    for (const [node] of __VLS_vFor(__VLS_nonNull(__VLS_4))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
            ...{ onClick: // @ts-ignore
                (...[$event]) => {
                    void $event;
                    if (!!(loading.value))
                        throw 0;
                    if (!!(!filtered.value.length))
                        throw 0;
                    if (!(state.value.view === 'icon' || state.value.view === 'gallery'))
                        throw 0;
                    return (__VLS_unwrap(select, {})([node.path]));
                    // @ts-ignore
                    [state, state, state, loading, filtered, filtered, select,];
                } },
            ...{ onDblclick: // @ts-ignore
                (...[$event]) => {
                    void $event;
                    if (!!(loading.value))
                        throw 0;
                    if (!!(!filtered.value.length))
                        throw 0;
                    if (!(state.value.view === 'icon' || state.value.view === 'gallery'))
                        throw 0;
                    return (openNode(node));
                    // @ts-ignore
                    [];
                } },
            ...{ onContextmenu: // @ts-ignore
                (...[$event]) => {
                    void $event;
                    if (!!(loading.value))
                        throw 0;
                    if (!!(!filtered.value.length))
                        throw 0;
                    if (!(state.value.view === 'icon' || state.value.view === 'gallery'))
                        throw 0;
                    return (onItemContextmenu($event, node));
                    // @ts-ignore
                    [];
                } },
            key: (node.path),
            ...{ class: "yw-finder-item" },
            ...{ class: ({ 'is-selected': selectedIds.value.has(node.path) }) },
        });
        /** @type {__VLS_StyleScopedClasses['yw-finder-item']} */ ;
        /** @type {__VLS_StyleScopedClasses['is-selected']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.i)({
            ...{ class: (node.kind === 'directory' ? 'i-lucide-folder' : 'i-lucide-file') },
            ...{ class: "yw-finder-item-icon" },
        });
        /** @type {__VLS_StyleScopedClasses['yw-finder-item-icon']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "yw-finder-item-name" },
        });
        /** @type {__VLS_StyleScopedClasses['yw-finder-item-name']} */ ;
        (node.name);
        // @ts-ignore
        [selectedIds,];
    }
}
else if (state.value.view === 'list') {
    __VLS_asFunctionalElement1(__VLS_intrinsics.table, __VLS_intrinsics.table)({
        ...{ class: "yw-finder-table" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-finder-table']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.thead, __VLS_intrinsics.thead)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.tr, __VLS_intrinsics.tr)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.th, __VLS_intrinsics.th)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.th, __VLS_intrinsics.th)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.th, __VLS_intrinsics.th)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.tbody, __VLS_intrinsics.tbody)({});
    const __VLS_5 = __VLS_tryAsConstant((filtered.value));
    for (const [node] of __VLS_vFor(__VLS_nonNull(__VLS_5))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.tr, __VLS_intrinsics.tr)({
            ...{ onClick: // @ts-ignore
                (...[$event]) => {
                    void $event;
                    if (!!(loading.value))
                        throw 0;
                    if (!!(!filtered.value.length))
                        throw 0;
                    if (!!(state.value.view === 'icon' || state.value.view === 'gallery'))
                        throw 0;
                    if (!(state.value.view === 'list'))
                        throw 0;
                    return (__VLS_unwrap(select, {})([node.path]));
                    // @ts-ignore
                    [state, filtered, select,];
                } },
            ...{ onDblclick: // @ts-ignore
                (...[$event]) => {
                    void $event;
                    if (!!(loading.value))
                        throw 0;
                    if (!!(!filtered.value.length))
                        throw 0;
                    if (!!(state.value.view === 'icon' || state.value.view === 'gallery'))
                        throw 0;
                    if (!(state.value.view === 'list'))
                        throw 0;
                    return (openNode(node));
                    // @ts-ignore
                    [];
                } },
            key: (node.path),
            ...{ class: ({ 'is-selected': selectedIds.value.has(node.path) }) },
        });
        /** @type {__VLS_StyleScopedClasses['is-selected']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.td, __VLS_intrinsics.td)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.i)({
            ...{ class: (node.kind === 'directory' ? 'i-lucide-folder' : 'i-lucide-file') },
            ...{ class: "yw-finder-row-icon" },
        });
        /** @type {__VLS_StyleScopedClasses['yw-finder-row-icon']} */ ;
        (node.name);
        __VLS_asFunctionalElement1(__VLS_intrinsics.td, __VLS_intrinsics.td)({});
        (new Date(node.modifiedAt).toLocaleString('zh-CN'));
        __VLS_asFunctionalElement1(__VLS_intrinsics.td, __VLS_intrinsics.td)({});
        (node.kind === 'directory' ? '—' : `${node.size} B`);
        // @ts-ignore
        [selectedIds,];
    }
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "yw-finder-columns" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-finder-columns']} */ ;
    const __VLS_6 = __VLS_tryAsConstant((__VLS_unwrap(breadcrumbs, {})));
    for (const [crumb] of __VLS_vFor(__VLS_nonNull(__VLS_6))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            key: (crumb.path),
            ...{ class: "yw-finder-column" },
        });
        /** @type {__VLS_StyleScopedClasses['yw-finder-column']} */ ;
        const __VLS_7 = __VLS_tryAsConstant((nodes.value.filter(n => n.path !== crumb.path)));
        for (const [node] of __VLS_vFor(__VLS_nonNull(__VLS_7))) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
                ...{ onClick: // @ts-ignore
                    (...[$event]) => {
                        void $event;
                        if (!!(loading.value))
                            throw 0;
                        if (!!(!filtered.value.length))
                            throw 0;
                        if (!!(state.value.view === 'icon' || state.value.view === 'gallery'))
                            throw 0;
                        if (!!(state.value.view === 'list'))
                            throw 0;
                        __VLS_unwrap(navigate, {})(node.kind === 'directory' ? node.path : crumb.path);
                        if (node.kind !== 'directory')
                            openNode(node);
                        // @ts-ignore
                        [navigate, breadcrumbs, nodes,];
                    } },
                key: (node.path),
                ...{ class: "yw-finder-col-item" },
            });
            /** @type {__VLS_StyleScopedClasses['yw-finder-col-item']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.i)({
                ...{ class: (node.kind === 'directory' ? 'i-lucide-folder' : 'i-lucide-file') },
            });
            (node.name);
            // @ts-ignore
            [];
        }
        // @ts-ignore
        [];
    }
}
__VLS_asFunctionalElement1(__VLS_intrinsics.footer, __VLS_intrinsics.footer)({
    ...{ class: "yw-finder-statusbar" },
});
/** @type {__VLS_StyleScopedClasses['yw-finder-statusbar']} */ ;
(filtered.value.length);
// @ts-ignore
[filtered,];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
    props: {},
});
export default {};
import { defineProps, withDefaults, } from 'vue';
