import { computed, onMounted, ref } from 'vue';
import { useAppsStore } from '../../stores/apps';
import { useWindowsStore } from '../../stores/windows';
import YwIconTile from '../icon-tile/index.vue';
const props = withDefaults(defineProps(), {
    limit: 9,
});
const emit = defineEmits();
const appsStore = useAppsStore();
const windowsStore = useWindowsStore();
const keyword = ref('');
const activeIndex = ref(0);
/** 最近使用（localStorage） */
const RECENT_KEY = 'yw.quicklaunch.recent';
const recent = ref(JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]'));
function pushRecent(key) {
    recent.value = [key, ...recent.value.filter(k => k !== key)].slice(0, 8);
    localStorage.setItem(RECENT_KEY, JSON.stringify(recent.value));
}
/** 过滤匹配（title + keywords，小写包含） */
const filtered = computed(() => {
    const kw = keyword.value.trim().toLowerCase();
    const pool = kw
        ? appsStore.apps.filter(a => a.name.toLowerCase().includes(kw) || (a.keywords ?? '').toLowerCase().includes(kw))
        : [...appsStore.apps].sort((a, b) => {
            const ra = recent.value.indexOf(a.id);
            const rb = recent.value.indexOf(b.id);
            return (ra === -1 ? 999 : ra) - (rb === -1 ? 999 : rb);
        });
    return pool.slice(0, props.limit);
});
function open(app) {
    pushRecent(app.id);
    appsStore.openApp(app.id);
    emit('close');
}
function onKeydown(ev) {
    if (ev.key === 'ArrowDown') {
        ev.preventDefault();
        activeIndex.value = Math.min(activeIndex.value + 1, filtered.value.length - 1);
    }
    else if (ev.key === 'ArrowUp') {
        ev.preventDefault();
        activeIndex.value = Math.max(activeIndex.value - 1, 0);
    }
    else if (ev.key === 'Enter') {
        const app = filtered.value[activeIndex.value];
        if (app) {
            open(app);
        }
    }
    else if (ev.key === 'Escape') {
        emit('close');
    }
}
const inputEl = ref(null);
onMounted(() => inputEl.value?.focus());
/** 应用是否运行中 */
const running = computed(() => new Set(windowsStore.runningApps));
const __VLS_defaults = {
    limit: 9,
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
__VLS_withDotValue(filtered, {});
// @ts-ignore
__VLS_withDotValue(activeIndex, {});
// @ts-ignore
__VLS_withDotValue(running, {});
// @ts-ignore
__VLS_withDotValue(recent, {});
// @ts-ignore
__VLS_withDotValue(keyword, {});
void {};
/** @type {__VLS_StyleScopedClasses['yw-quicklaunch-item']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-quicklaunch-recent']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ onPointerdown: // @ts-ignore
        (...[$event]) => {
            void $event;
            return (__VLS_unwrap(emit, {})('close'));
            // @ts-ignore
            [emit,];
        } },
    ...{ class: "yw-quicklaunch-overlay" },
});
/** @type {__VLS_StyleScopedClasses['yw-quicklaunch-overlay']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "yw-quicklaunch" },
    role: "dialog",
    'aria-label': "快速启动",
});
/** @type {__VLS_StyleScopedClasses['yw-quicklaunch']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.input, __VLS_intrinsics.input)({
    ...{ onKeydown: (onKeydown) },
    ref: "inputEl",
    ...{ class: "yw-quicklaunch-input" },
    placeholder: "搜索应用（名称 / 拼音首字母）…",
});
(keyword.value);
/** @type {__VLS_StyleScopedClasses['yw-quicklaunch-input']} */ ;
if (filtered.value.length) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "yw-quicklaunch-list" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-quicklaunch-list']} */ ;
    const __VLS_0 = __VLS_tryAsConstant((filtered.value));
    for (const [app, i] of __VLS_vFor(__VLS_nonNull(__VLS_0))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
            ...{ onMouseenter: // @ts-ignore
                (...[$event]) => {
                    void $event;
                    if (!(filtered.value.length))
                        throw 0;
                    return (activeIndex.value = i);
                    // @ts-ignore
                    [keyword, filtered, filtered, activeIndex,];
                } },
            ...{ onClick: // @ts-ignore
                (...[$event]) => {
                    void $event;
                    if (!(filtered.value.length))
                        throw 0;
                    return (open(app));
                    // @ts-ignore
                    [];
                } },
            key: (app.id),
            ...{ class: "yw-quicklaunch-item" },
            ...{ class: ({ 'is-active': i === activeIndex.value }) },
        });
        /** @type {__VLS_StyleScopedClasses['yw-quicklaunch-item']} */ ;
        /** @type {__VLS_StyleScopedClasses['is-active']} */ ;
        const __VLS_1 = YwIconTile;
        // @ts-ignore
        const __VLS_2 = __VLS_asFunctionalComponent1(__VLS_1, new __VLS_1({
            // @ts-ignore
            appKey: (app.id), icon: (app.icon), iconBg: (app.iconBg), size: (30),
        }));
        const __VLS_3 = __VLS_2({
            appKey: (app.id),
            icon: (app.icon),
            iconBg: (app.iconBg),
            size: (30),
        }, ...__VLS_functionalComponentArgsRest(__VLS_2));
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "yw-quicklaunch-title" },
        });
        /** @type {__VLS_StyleScopedClasses['yw-quicklaunch-title']} */ ;
        (app.name);
        if (running.value.has(app.id)) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "yw-quicklaunch-running" },
            });
            /** @type {__VLS_StyleScopedClasses['yw-quicklaunch-running']} */ ;
        }
        if (recent.value.includes(app.id) && !keyword.value) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "yw-quicklaunch-recent" },
            });
            /** @type {__VLS_StyleScopedClasses['yw-quicklaunch-recent']} */ ;
        }
        // @ts-ignore
        [keyword, activeIndex, running, recent,];
    }
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "yw-quicklaunch-empty" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-quicklaunch-empty']} */ ;
    (keyword.value);
}
__VLS_asFunctionalElement1(__VLS_intrinsics.footer, __VLS_intrinsics.footer)({
    ...{ class: "yw-quicklaunch-hint" },
});
/** @type {__VLS_StyleScopedClasses['yw-quicklaunch-hint']} */ ;
// @ts-ignore
[keyword,];
const __VLS_export = (await import('vue')).defineComponent({
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
export default {};
import { defineProps, defineEmits, withDefaults, } from 'vue';
