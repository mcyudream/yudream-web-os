import { computed, onBeforeUnmount, onMounted } from 'vue';
import { provideUIRegistry, useUIRegistry } from './override/registry';
import { useWebOS } from './provider';
import { shortcuts } from './shortcuts';
import { applySettings } from './system/settings';
const props = withDefaults(defineProps(), {
    wallpaper: null,
});
const os = useWebOS();
const uiRegistryCtx = useUIRegistry();
// 合并全局 uiRegistry（provide 供 ui-arco 层解析）
provideUIRegistry(uiRegistryCtx.overrides);
const settings = os.settings;
const effectiveDark = computed(() => settings.mode === 'system' ? settings.systemDark : settings.mode === 'dark');
const wallpaperStyle = computed(() => {
    const w = props.wallpaper ?? settings.wallpaper;
    if (!w) {
        return { background: 'linear-gradient(160deg, #0b3b66 0%, #1265a8 38%, #2d8fd0 68%, #6db6e8 100%)' };
    }
    if (w.src.startsWith('linear-gradient') || w.src.startsWith('radial-gradient')) {
        return { background: w.src };
    }
    return {
        backgroundImage: `url(${w.src})`,
        backgroundSize: w.fit === 'tile' ? 'auto' : (w.fit ?? 'cover'),
        backgroundRepeat: w.fit === 'tile' ? 'repeat' : 'no-repeat',
        backgroundPosition: 'center',
    };
});
let mediaQuery = null;
let detachShortcuts = null;
function apply() {
    applySettings(settings);
    os.bus.emit('webos:system:theme-change', { mode: effectiveDark.value ? 'dark' : 'light' });
}
function syncViewport() {
    os.wm.setViewport({ width: window.innerWidth, height: window.innerHeight, menubarHeight: 24 });
}
onMounted(() => {
    syncViewport();
    window.addEventListener('resize', syncViewport);
    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    settings.systemDark = mediaQuery.matches;
    const onMedia = (e) => {
        settings.systemDark = e.matches;
        apply();
    };
    mediaQuery.addEventListener('change', onMedia);
    apply();
    detachShortcuts = shortcuts.attach(window);
    // 会话恢复（可选，scope: windows.session）
    if (os.config.windows.sessionRestore) {
        void os.persist.get(`windows.session`).then((snaps) => {
            if (snaps?.length) {
                os.wm.restoreSession(snaps);
            }
        });
    }
});
onBeforeUnmount(() => {
    window.removeEventListener('resize', syncViewport);
    mediaQuery?.removeEventListener('change', () => { });
    detachShortcuts?.();
});
const __VLS_exposed = { apply, os };
defineExpose(__VLS_exposed);
const __VLS_defaults = {
    wallpaper: null,
};
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
void {};
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "yw-provider" },
    ...{ style: (__VLS_unwrap(wallpaperStyle, {})) },
});
/** @type {__VLS_StyleScopedClasses['yw-provider']} */ ;
var __VLS_0 = {};
var __VLS_1 = __VLS_0;
// @ts-ignore
[wallpaperStyle,];
const __VLS_base = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    __typeProps: {},
    props: {},
});
const __VLS_export = {};
export default {};
import { defineProps, defineExpose, withDefaults, } from 'vue';
