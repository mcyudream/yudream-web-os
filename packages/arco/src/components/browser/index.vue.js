import { computed, onMounted, ref, watch } from 'vue';
import { resolveInput, useBrowserStore } from '../../stores/browser';
const props = defineProps();
const browser = useBrowserStore();
const session = computed(() => browser.sessionOf(props.win.id));
const addressInput = ref('');
const editing = ref(false);
const opts = computed(() => browser.options);
const iframeSrc = computed(() => session.value.url);
// iframe key：url 变化即重建（含 reload 场景）
const iframeKey = computed(() => `${props.win.id}:${session.value.history.slice(0, session.value.index + 1).length}:${session.value.url}`);
watch(() => session.value.url, (url) => {
    if (!editing.value) {
        addressInput.value = url;
    }
}, { immediate: true });
onMounted(() => {
    // 初始会话已有 url（openUrl 开窗场景）直接加载；否则停在起始页
    addressInput.value = session.value.url;
});
function go() {
    const url = resolveInput(addressInput.value, opts.value.searchEngine ?? 'https://www.bing.com/search?q={q}');
    if (url) {
        browser.navigate(props.win.id, url);
    }
}
function newWindow() {
    if (session.value.url) {
        browser.openUrl(session.value.url, 'browser');
    }
}
function openExternal() {
    if (session.value.url) {
        browser.openUrl(session.value.url, 'external');
    }
}
function onIframeLoad() {
    browser.setLoading(props.win.id, false);
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
__VLS_withDotValue(browser, {});
// @ts-ignore
__VLS_withDotValue(session, {});
// @ts-ignore
__VLS_withDotValue(editing, {});
// @ts-ignore
__VLS_withDotValue(opts, {});
void {};
/** @type {__VLS_StyleScopedClasses['yw-browser-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-browser-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-browser-address']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-browser-start']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "yw-browser" },
});
/** @type {__VLS_StyleScopedClasses['yw-browser']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "yw-browser-bar" },
});
/** @type {__VLS_StyleScopedClasses['yw-browser-bar']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: // @ts-ignore
        (...[$event]) => {
            void $event;
            return (browser.value.back(__VLS_ctx.win.id));
            // @ts-ignore
            [browser, win,];
        } },
    ...{ class: "yw-browser-btn" },
    disabled: (!browser.value.canBack(__VLS_ctx.win.id)),
    title: "后退",
});
/** @type {__VLS_StyleScopedClasses['yw-browser-btn']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.i)({
    ...{ class: "i-lucide-arrow-left" },
});
/** @type {__VLS_StyleScopedClasses['i-lucide-arrow-left']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: // @ts-ignore
        (...[$event]) => {
            void $event;
            return (browser.value.forward(__VLS_ctx.win.id));
            // @ts-ignore
            [browser, browser, win, win,];
        } },
    ...{ class: "yw-browser-btn" },
    disabled: (!browser.value.canForward(__VLS_ctx.win.id)),
    title: "前进",
});
/** @type {__VLS_StyleScopedClasses['yw-browser-btn']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.i)({
    ...{ class: "i-lucide-arrow-right" },
});
/** @type {__VLS_StyleScopedClasses['i-lucide-arrow-right']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: // @ts-ignore
        (...[$event]) => {
            void $event;
            return (browser.value.reload(__VLS_ctx.win.id));
            // @ts-ignore
            [browser, browser, win, win,];
        } },
    ...{ class: "yw-browser-btn" },
    disabled: (!session.value.url),
    title: "刷新",
});
/** @type {__VLS_StyleScopedClasses['yw-browser-btn']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.i)({
    ...{ class: "i-lucide-rotate-cw" },
});
/** @type {__VLS_StyleScopedClasses['i-lucide-rotate-cw']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.input)({
    ...{ onFocus: // @ts-ignore
        (...[$event]) => {
            void $event;
            return (editing.value = true);
            // @ts-ignore
            [session, editing,];
        } },
    ...{ onBlur: // @ts-ignore
        (...[$event]) => {
            void $event;
            return (editing.value = false);
            // @ts-ignore
            [editing,];
        } },
    ...{ onKeydown: // @ts-ignore
        (...[$event]) => {
            void $event;
            go();
            $event.target.blur();
            // @ts-ignore
            [];
        } },
    ...{ class: "yw-browser-address" },
    placeholder: "输入网址或搜索词，回车访问",
    spellcheck: "false",
});
(__VLS_unwrap(addressInput, {}));
/** @type {__VLS_StyleScopedClasses['yw-browser-address']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (newWindow) },
    ...{ class: "yw-browser-btn" },
    disabled: (!session.value.url),
    title: "在新窗口打开",
});
/** @type {__VLS_StyleScopedClasses['yw-browser-btn']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.i)({
    ...{ class: "i-lucide-copy-plus" },
});
/** @type {__VLS_StyleScopedClasses['i-lucide-copy-plus']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (openExternal) },
    ...{ class: "yw-browser-btn" },
    disabled: (!session.value.url),
    title: "系统浏览器打开",
});
/** @type {__VLS_StyleScopedClasses['yw-browser-btn']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.i)({
    ...{ class: "i-lucide-external-link" },
});
/** @type {__VLS_StyleScopedClasses['i-lucide-external-link']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "yw-browser-body" },
});
/** @type {__VLS_StyleScopedClasses['yw-browser-body']} */ ;
if (!session.value.url) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "yw-browser-start" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-browser-start']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.i)({
        ...{ class: "i-lucide-globe" },
    });
    /** @type {__VLS_StyleScopedClasses['i-lucide-globe']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.iframe)({
        ...{ onLoad: (onIframeLoad) },
        key: (__VLS_unwrap(iframeKey, {})),
        src: (__VLS_unwrap(iframeSrc, {})),
        ...{ class: "yw-browser-frame" },
        sandbox: ((opts.value.sandbox ?? ['allow-scripts', 'allow-same-origin', 'allow-forms', 'allow-popups-to-escape-sandbox']).join(' ')),
        allow: (opts.value.allow ? opts.value.allow.join('; ') : undefined),
        referrerpolicy: "no-referrer",
    });
    /** @type {__VLS_StyleScopedClasses['yw-browser-frame']} */ ;
    if (session.value.loading) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "yw-browser-loading" },
        });
        /** @type {__VLS_StyleScopedClasses['yw-browser-loading']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.i)({
            ...{ class: "yw-browser-spin i-lucide-loader-circle" },
        });
        /** @type {__VLS_StyleScopedClasses['yw-browser-spin']} */ ;
        /** @type {__VLS_StyleScopedClasses['i-lucide-loader-circle']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
        (session.value.url);
    }
}
// @ts-ignore
[session, session, session, session, session, addressInput, iframeKey, iframeSrc, opts, opts, opts,];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
import { defineProps, } from 'vue';
