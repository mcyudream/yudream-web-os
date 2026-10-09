import { useWebOS } from '@yudream/yudream-webos-vue';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useAppsStore } from '../../stores/apps';
import YwIconTile from '../icon-tile/index.vue';
const props = withDefaults(defineProps(), {
    rows: 4,
    columns: 7,
});
const emit = defineEmits();
const appsStore = useAppsStore();
const os = useWebOS();
const keyword = ref('');
const page = ref(0);
/** 过滤后的应用（title/keywords/category 匹配） */
const filtered = computed(() => {
    const kw = keyword.value.trim().toLowerCase();
    if (!kw) {
        return appsStore.launchpad;
    }
    return appsStore.launchpad.filter(a => a.name.toLowerCase().includes(kw)
        || (a.keywords ?? '').toLowerCase().includes(kw)
        || a.category?.toLowerCase().includes(kw));
});
/** 分页 */
const pages = computed(() => {
    const size = props.rows * props.columns;
    const out = [];
    for (let i = 0; i < filtered.value.length; i += size) {
        out.push(filtered.value.slice(i, i + size));
    }
    return out.length ? out : [[]];
});
watch(filtered, () => {
    page.value = 0;
});
function open(app) {
    appsStore.openApp(app.id);
    emit('close');
}
/** 右键：打开 / 添加到桌面（落点由 DesktopModel 自动找可见空位） */
function onAppContextmenu(ev, app) {
    ev.preventDefault();
    os.ui.menu({
        x: ev.clientX,
        y: ev.clientY,
        items: [
            { label: '打开', icon: 'i-lucide-external-link', onSelect: () => open(app) },
            {
                label: '添加到桌面',
                icon: 'i-lucide-monitor-plus',
                onSelect: () => {
                    os.desktop.add({ type: 'app', refId: app.id, name: app.name, icon: app.icon, position: { col: 0, row: 0 } });
                    os.ui.message('success', `«${app.name}» 已添加到桌面`);
                },
            },
        ],
    });
}
const inputEl = ref(null);
onMounted(() => inputEl.value?.focus());
function onKeydown(ev) {
    if (ev.key === 'Escape') {
        emit('close');
    }
    else if (ev.key === 'ArrowRight' && page.value < pages.value.length - 1) {
        page.value++;
    }
    else if (ev.key === 'ArrowLeft' && page.value > 0) {
        page.value--;
    }
}
/* ── 滚轮 / 横向拖动换页 ── */
let wheelLockUntil = 0;
function onWheel(ev) {
    const now = Date.now();
    if (now < wheelLockUntil || pages.value.length < 2) {
        return;
    }
    const d = Math.abs(ev.deltaX) > Math.abs(ev.deltaY) ? ev.deltaX : ev.deltaY;
    if (Math.abs(d) < 24) {
        return;
    }
    wheelLockUntil = now + 450;
    if (d > 0 && page.value < pages.value.length - 1) {
        page.value++;
    }
    else if (d < 0 && page.value > 0) {
        page.value--;
    }
}
/** 横向拖动换页：超过阈值即翻页，并在 click 捕获段吞掉这次点击（防止误开应用） */
const swipe = reactive({ active: false, x: 0, y: 0, done: false });
let suppressClick = false;
function onGridPointerDown(ev) {
    if (ev.button !== 0) {
        return;
    }
    swipe.active = true;
    swipe.x = ev.clientX;
    swipe.y = ev.clientY;
    swipe.done = false;
}
function onGridPointerMove(ev) {
    if (!swipe.active) {
        return;
    }
    const dx = ev.clientX - swipe.x;
    const dy = ev.clientY - swipe.y;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.4) {
        swipe.done = true;
    }
}
function onGridPointerUp(ev) {
    if (!swipe.active) {
        return;
    }
    const dx = ev.clientX - swipe.x;
    swipe.active = false;
    if (!swipe.done) {
        return;
    }
    suppressClick = true;
    setTimeout(() => {
        suppressClick = false;
    }, 100);
    if (dx < 0 && page.value < pages.value.length - 1) {
        page.value++;
    }
    else if (dx > 0 && page.value > 0) {
        page.value--;
    }
}
function onClickCapture(ev) {
    if (suppressClick) {
        ev.stopPropagation();
        ev.preventDefault();
        suppressClick = false;
    }
}
const __VLS_defaults = {
    rows: 4,
    columns: 7,
};
void __VLS_defaults;
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
__VLS_withDotValue(pages, {});
// @ts-ignore
__VLS_withDotValue(page, {});
void {};
/** @type {__VLS_StyleScopedClasses['yw-launchpad-search']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-launchpad-app']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-launchpad-app']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-launchpad-dot']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ onPointerdown: // @ts-ignore
        (...[$event]) => {
            void $event;
            return (__VLS_unwrap(emit, {})('close'));
            // @ts-ignore
            [emit,];
        } },
    ...{ onKeydown: (onKeydown) },
    ...{ onWheel: (onWheel) },
    ...{ class: "yw-launchpad" },
    role: "dialog",
    'aria-label': "启动台",
});
/** @type {__VLS_StyleScopedClasses['yw-launchpad']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.input, __VLS_intrinsics.input)({
    ref: "inputEl",
    ...{ class: "yw-launchpad-search" },
    placeholder: "搜索应用…",
});
(__VLS_unwrap(keyword, {}));
/** @type {__VLS_StyleScopedClasses['yw-launchpad-search']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.Transition | typeof __VLS_components.Transition} */
Transition;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    // @ts-ignore
    name: "yw-lp-page", mode: "out-in",
}));
const __VLS_2 = __VLS_1({
    name: "yw-lp-page",
    mode: "out-in",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_5 } = __VLS_nonNull(__VLS_3.slots);
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ onPointerdown: (onGridPointerDown) },
    ...{ onPointermove: (onGridPointerMove) },
    ...{ onPointerup: (onGridPointerUp) },
    ...{ onPointercancel: (onGridPointerUp) },
    ...{ onClick: (onClickCapture) },
    key: (page.value),
    ...{ class: "yw-launchpad-grid" },
    ...{ style: ({ gridTemplateColumns: `repeat(${__VLS_ctx.columns}, 1fr)`, gridTemplateRows: `repeat(${__VLS_ctx.rows}, 1fr)` }) },
});
/** @type {__VLS_StyleScopedClasses['yw-launchpad-grid']} */ ;
const __VLS_6 = __VLS_tryAsConstant((pages.value[page.value]));
for (const [app] of __VLS_vFor(__VLS_nonNull(__VLS_6))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: // @ts-ignore
            (...[$event]) => {
                void $event;
                return (open(app));
                // @ts-ignore
                [keyword, page, page, columns, rows, pages,];
            } },
        ...{ onContextmenu: // @ts-ignore
            (...[$event]) => {
                void $event;
                return (onAppContextmenu($event, app));
                // @ts-ignore
                [];
            } },
        key: (app.id),
        ...{ class: "yw-launchpad-app" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-launchpad-app']} */ ;
    const __VLS_7 = YwIconTile;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
        // @ts-ignore
        appKey: (app.id), icon: (app.icon), iconBg: (app.iconBg), size: (64),
    }));
    const __VLS_9 = __VLS_8({
        appKey: (app.id),
        icon: (app.icon),
        iconBg: (app.iconBg),
        size: (64),
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "yw-launchpad-label" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-launchpad-label']} */ ;
    (app.name);
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
if (pages.value.length > 1) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "yw-launchpad-dots" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-launchpad-dots']} */ ;
    const __VLS_12 = __VLS_tryAsConstant((pages.value));
    for (const [_, i] of __VLS_vFor(__VLS_nonNull(__VLS_12))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.button)({
            ...{ onClick: // @ts-ignore
                (...[$event]) => {
                    void $event;
                    if (!(pages.value.length > 1))
                        throw 0;
                    return (page.value = i);
                    // @ts-ignore
                    [page, pages, pages,];
                } },
            key: (i),
            ...{ class: "yw-launchpad-dot" },
            ...{ class: ({ 'is-active': i === page.value }) },
        });
        /** @type {__VLS_StyleScopedClasses['yw-launchpad-dot']} */ ;
        /** @type {__VLS_StyleScopedClasses['is-active']} */ ;
        // @ts-ignore
        [page,];
    }
}
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
export default {};
import { defineProps, defineEmits, withDefaults, } from 'vue';
