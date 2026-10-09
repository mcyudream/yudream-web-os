import { YW_CORE_VERSION } from '@yudream/yudream-webos-core';
import { useWebOS } from '@yudream/yudream-webos-vue';
import { computed, ref } from 'vue';
import { useAppsStore } from '../../stores/apps';
import { useThemeStore } from '../../stores/theme';
import { useWindowsStore } from '../../stores/windows';
const props = withDefaults(defineProps(), {
    sections: () => ['appearance', 'wallpaper', 'dock', 'about'],
    user: null,
});
const theme = useThemeStore();
const apps = useAppsStore();
const windows = useWindowsStore();
const SECTION_META = {
    appearance: { label: '外观', icon: 'i-lucide-paintbrush', from: '#3A3A3C', to: '#1C1C1E' },
    wallpaper: { label: '壁纸', icon: 'i-lucide-image', from: '#30B0C7', to: '#12688E' },
    dock: { label: '桌面与 Dock', icon: 'i-lucide-layout-grid', from: '#5FB3F9', to: '#1263E9' },
    about: { label: '关于', icon: 'i-lucide-info', from: '#8E8E93', to: '#48484A' },
};
const active = ref(props.sections[0] ?? 'appearance');
/* 外观 */
const modeOptions = [
    { value: 'light', label: '浅色' },
    { value: 'dark', label: '深色' },
    { value: 'auto', label: '自动' },
];
/* 强调色（苹果系，22px 圆点） */
const accents = [
    { value: null, color: '#007AFF', label: '蓝色' },
    { value: '#A550A7', color: '#A550A7', label: '紫色' },
    { value: '#F74F9E', color: '#F74F9E', label: '粉色' },
    { value: '#FF5257', color: '#FF5257', label: '红色' },
    { value: '#F7821B', color: '#F7821B', label: '橙色' },
    { value: '#FFC600', color: '#FFC600', label: '黄色' },
    { value: '#62BA46', color: '#62BA46', label: '绿色' },
    { value: '#8E8E93', color: '#8E8E93', label: '石墨' },
];
/* 壁纸预设 */
const wallpapers = [
    { label: '海景', src: 'https://images.unsplash.com/photo-1439405326854-014607f694d7?w=2560&q=80', thumb: 'https://images.unsplash.com/photo-1439405326854-014607f694d7?w=320&q=60' },
    { label: '山脉', src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=2560&q=80', thumb: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=320&q=60' },
    { label: '湖泊', src: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=2560&q=80', thumb: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=320&q=60' },
    { label: '极光', src: 'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=2560&q=80', thumb: 'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=320&q=60' },
    { label: '暮色', src: 'linear-gradient(160deg, #0b3b66 0%, #1265a8 38%, #2d8fd0 68%, #6db6e8 100%)', thumb: 'linear-gradient(160deg, #0b3b66 0%, #1265a8 38%, #2d8fd0 68%, #6db6e8 100%)' },
    { label: '无', src: '', thumb: '' },
];
const currentWallpaperSrc = computed(() => theme.wallpaper?.src ?? '');
function pickWallpaper(src) {
    theme.setWallpaper(src ? { src } : null);
}
/* Dock 管理 */
const { dock } = useWebOS();
const dockPinned = computed(() => dock.pinned.map((id) => apps.all[id]).filter((a) => Boolean(a)));
function unpin(key) {
    dock.unpin(key);
}
function pin(key) {
    dock.pin(key);
}
const runningKeys = computed(() => new Set(windows.runningApps));
const __VLS_defaults = {
    sections: () => ['appearance', 'wallpaper', 'dock', 'about'],
    user: null,
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
// @ts-ignore
__VLS_withDotValue(active, {});
// @ts-ignore
__VLS_withDotValue(SECTION_META, {});
// @ts-ignore
__VLS_withDotValue(theme, {});
// @ts-ignore
__VLS_withDotValue(currentWallpaperSrc, {});
// @ts-ignore
__VLS_withDotValue(dockPinned, {});
// @ts-ignore
__VLS_withDotValue(runningKeys, {});
// @ts-ignore
__VLS_withDotValue(apps, {});
// @ts-ignore
__VLS_withDotValue(dock, {});
void {};
/** @type {__VLS_StyleScopedClasses['yw-settings-user']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-settings-user']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-settings-user-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-settings-user-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-settings-nav-item']} */ ;
/** @type {__VLS_StyleScopedClasses['is-active']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-settings-nav-item']} */ ;
/** @type {__VLS_StyleScopedClasses['is-active']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-settings-nav-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-settings-mode-art']} */ ;
/** @type {__VLS_StyleScopedClasses['is-active']} */ ;
/** @type {__VLS_StyleScopedClasses['art-chrome']} */ ;
/** @type {__VLS_StyleScopedClasses['art-chrome']} */ ;
/** @type {__VLS_StyleScopedClasses['art-chrome']} */ ;
/** @type {__VLS_StyleScopedClasses['is-dark']} */ ;
/** @type {__VLS_StyleScopedClasses['art-chrome']} */ ;
/** @type {__VLS_StyleScopedClasses['is-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['art-chrome']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-settings-mode-art']} */ ;
/** @type {__VLS_StyleScopedClasses['is-dark']} */ ;
/** @type {__VLS_StyleScopedClasses['art-pane--light']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-settings-mode-art']} */ ;
/** @type {__VLS_StyleScopedClasses['is-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['art-pane--light']} */ ;
/** @type {__VLS_StyleScopedClasses['art-pane--dark']} */ ;
/** @type {__VLS_StyleScopedClasses['art-doc']} */ ;
/** @type {__VLS_StyleScopedClasses['art-pane--dark']} */ ;
/** @type {__VLS_StyleScopedClasses['art-line']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-settings-accent']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-settings-accent']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-settings-accent']} */ ;
/** @type {__VLS_StyleScopedClasses['is-active']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-settings-wallpaper']} */ ;
/** @type {__VLS_StyleScopedClasses['is-active']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-settings-wallpaper-thumb']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-settings-row']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-settings-row-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-settings-row-btn']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "yw-settings" },
});
/** @type {__VLS_StyleScopedClasses['yw-settings']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.aside, __VLS_intrinsics.aside)({
    ...{ class: "yw-settings-sidebar" },
});
/** @type {__VLS_StyleScopedClasses['yw-settings-sidebar']} */ ;
if (__VLS_ctx.user) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onClick: // @ts-ignore
            (...[$event]) => {
                void $event;
                if (!(__VLS_ctx.user))
                    throw 0;
                return (active.value = 'about');
                // @ts-ignore
                [user, active,];
            } },
        ...{ class: "yw-settings-user" },
        ...{ class: ({ 'is-active': active.value === 'about' }) },
    });
    /** @type {__VLS_StyleScopedClasses['yw-settings-user']} */ ;
    /** @type {__VLS_StyleScopedClasses['is-active']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "yw-settings-avatar" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-settings-avatar']} */ ;
    (__VLS_ctx.user.name.slice(0, 1));
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "yw-settings-user-meta" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-settings-user-meta']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.b, __VLS_intrinsics.b)({});
    (__VLS_ctx.user.name);
    if (__VLS_ctx.user.subtitle) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.small, __VLS_intrinsics.small)({});
        (__VLS_ctx.user.subtitle);
    }
}
__VLS_asFunctionalElement1(__VLS_intrinsics.nav, __VLS_intrinsics.nav)({
    ...{ class: "yw-settings-nav" },
});
/** @type {__VLS_StyleScopedClasses['yw-settings-nav']} */ ;
const __VLS_0 = __VLS_tryAsConstant((__VLS_ctx.sections));
for (const [s] of __VLS_vFor(__VLS_nonNull(__VLS_0))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: // @ts-ignore
            (...[$event]) => {
                void $event;
                return (active.value = s);
                // @ts-ignore
                [user, user, user, user, active, active, sections,];
            } },
        key: (s),
        ...{ class: "yw-settings-nav-item" },
        ...{ class: ({ 'is-active': active.value === s }) },
    });
    /** @type {__VLS_StyleScopedClasses['yw-settings-nav-item']} */ ;
    /** @type {__VLS_StyleScopedClasses['is-active']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "yw-settings-nav-icon" },
        ...{ style: ({ background: `linear-gradient(180deg, ${SECTION_META.value[s].from}, ${SECTION_META.value[s].to})` }) },
    });
    /** @type {__VLS_StyleScopedClasses['yw-settings-nav-icon']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.i)({
        ...{ class: (SECTION_META.value[s].icon) },
    });
    (SECTION_META.value[s].label);
    // @ts-ignore
    [active, SECTION_META, SECTION_META, SECTION_META, SECTION_META,];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "yw-settings-body" },
});
/** @type {__VLS_StyleScopedClasses['yw-settings-body']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "yw-settings-pane" },
});
/** @type {__VLS_StyleScopedClasses['yw-settings-pane']} */ ;
if (active.value === 'appearance') {
    __VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({
        ...{ class: "yw-settings-h1" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-settings-h1']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "yw-settings-card" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-settings-card']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "yw-settings-modes" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-settings-modes']} */ ;
    const __VLS_1 = __VLS_tryAsConstant((__VLS_unwrap(modeOptions, {})));
    for (const [m] of __VLS_vFor(__VLS_nonNull(__VLS_1))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
            ...{ onClick: // @ts-ignore
                (...[$event]) => {
                    void $event;
                    if (!(active.value === 'appearance'))
                        throw 0;
                    theme.value.setMode(m.value === 'auto' ? 'system' : m.value);
                    theme.value.apply();
                    // @ts-ignore
                    [active, modeOptions, theme, theme,];
                } },
            key: (m.value),
            ...{ class: "yw-settings-mode" },
        });
        /** @type {__VLS_StyleScopedClasses['yw-settings-mode']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "yw-settings-mode-art" },
            ...{ class: ([`is-${m.value}`, { 'is-active': theme.value.mode === m.value || (m.value === 'auto' && theme.value.mode === 'system') }]) },
        });
        /** @type {__VLS_StyleScopedClasses['yw-settings-mode-art']} */ ;
        /** @type {__VLS_StyleScopedClasses['is-active']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "art-chrome" },
        });
        /** @type {__VLS_StyleScopedClasses['art-chrome']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.i)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.i)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.i)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "art-pane art-pane--light" },
        });
        /** @type {__VLS_StyleScopedClasses['art-pane']} */ ;
        /** @type {__VLS_StyleScopedClasses['art-pane--light']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "art-doc" },
        });
        /** @type {__VLS_StyleScopedClasses['art-doc']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.i)({
            ...{ class: "art-line" },
            ...{ style: {} },
        });
        /** @type {__VLS_StyleScopedClasses['art-line']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.i)({
            ...{ class: "art-line" },
            ...{ style: {} },
        });
        /** @type {__VLS_StyleScopedClasses['art-line']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.i)({
            ...{ class: "art-line" },
            ...{ style: {} },
        });
        /** @type {__VLS_StyleScopedClasses['art-line']} */ ;
        if (m.value !== 'light') {
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "art-pane art-pane--dark" },
            });
            /** @type {__VLS_StyleScopedClasses['art-pane']} */ ;
            /** @type {__VLS_StyleScopedClasses['art-pane--dark']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "art-doc" },
            });
            /** @type {__VLS_StyleScopedClasses['art-doc']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.i)({
                ...{ class: "art-line" },
                ...{ style: {} },
            });
            /** @type {__VLS_StyleScopedClasses['art-line']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.i)({
                ...{ class: "art-line" },
                ...{ style: {} },
            });
            /** @type {__VLS_StyleScopedClasses['art-line']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.i)({
                ...{ class: "art-line" },
                ...{ style: {} },
            });
            /** @type {__VLS_StyleScopedClasses['art-line']} */ ;
        }
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "yw-settings-mode-label" },
        });
        /** @type {__VLS_StyleScopedClasses['yw-settings-mode-label']} */ ;
        (m.label);
        // @ts-ignore
        [theme, theme,];
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "yw-settings-label" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-settings-label']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "yw-settings-card" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-settings-card']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "yw-settings-accents" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-settings-accents']} */ ;
    const __VLS_2 = __VLS_tryAsConstant((__VLS_unwrap(accents, {})));
    for (const [a] of __VLS_vFor(__VLS_nonNull(__VLS_2))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
            ...{ onClick: // @ts-ignore
                (...[$event]) => {
                    void $event;
                    if (!(active.value === 'appearance'))
                        throw 0;
                    return (theme.value.setAccent(a.value));
                    // @ts-ignore
                    [theme, accents,];
                } },
            key: (a.label),
            ...{ class: "yw-settings-accent" },
            ...{ class: ({ 'is-active': theme.value.accent === a.value }) },
            ...{ style: ({ background: a.color }) },
            title: (a.label),
        });
        /** @type {__VLS_StyleScopedClasses['yw-settings-accent']} */ ;
        /** @type {__VLS_StyleScopedClasses['is-active']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.i)({
            ...{ class: "i-lucide-check" },
        });
        /** @type {__VLS_StyleScopedClasses['i-lucide-check']} */ ;
        // @ts-ignore
        [theme,];
    }
}
else if (active.value === 'wallpaper') {
    __VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({
        ...{ class: "yw-settings-h1" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-settings-h1']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "yw-settings-label" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-settings-label']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "yw-settings-card" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-settings-card']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "yw-settings-wallpapers" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-settings-wallpapers']} */ ;
    const __VLS_3 = __VLS_tryAsConstant((__VLS_unwrap(wallpapers, {})));
    for (const [w] of __VLS_vFor(__VLS_nonNull(__VLS_3))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
            ...{ onClick: // @ts-ignore
                (...[$event]) => {
                    void $event;
                    if (!!(active.value === 'appearance'))
                        throw 0;
                    if (!(active.value === 'wallpaper'))
                        throw 0;
                    return (pickWallpaper(w.src));
                    // @ts-ignore
                    [active, wallpapers,];
                } },
            key: (w.label),
            ...{ class: "yw-settings-wallpaper" },
            ...{ class: ({ 'is-active': currentWallpaperSrc.value === w.src }) },
        });
        /** @type {__VLS_StyleScopedClasses['yw-settings-wallpaper']} */ ;
        /** @type {__VLS_StyleScopedClasses['is-active']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span)({
            ...{ class: "yw-settings-wallpaper-thumb" },
            ...{ style: (w.thumb.startsWith('linear') ? { background: w.thumb } : { backgroundImage: `url(${w.thumb})` }) },
        });
        /** @type {__VLS_StyleScopedClasses['yw-settings-wallpaper-thumb']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (w.label);
        // @ts-ignore
        [currentWallpaperSrc,];
    }
}
else if (active.value === 'dock') {
    __VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({
        ...{ class: "yw-settings-h1" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-settings-h1']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "yw-settings-label" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-settings-label']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "yw-settings-card" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-settings-card']} */ ;
    const __VLS_4 = __VLS_tryAsConstant((dockPinned.value));
    for (const [app, i] of __VLS_vFor(__VLS_nonNull(__VLS_4))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            key: (app.id),
            ...{ class: "yw-settings-row" },
            ...{ class: ({ 'is-last': i === dockPinned.value.length - 1 }) },
        });
        /** @type {__VLS_StyleScopedClasses['yw-settings-row']} */ ;
        /** @type {__VLS_StyleScopedClasses['is-last']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "yw-settings-row-icon" },
            ...{ style: ({ background: app.iconBg ?? 'linear-gradient(135deg, #5FB3F9, #1263E9)' }) },
        });
        /** @type {__VLS_StyleScopedClasses['yw-settings-row-icon']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.i)({
            ...{ class: (app.icon) },
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "yw-settings-row-main" },
        });
        /** @type {__VLS_StyleScopedClasses['yw-settings-row-main']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "row-label" },
        });
        /** @type {__VLS_StyleScopedClasses['row-label']} */ ;
        (app.name);
        if (runningKeys.value.has(app.id)) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "row-sub" },
            });
            /** @type {__VLS_StyleScopedClasses['row-sub']} */ ;
        }
        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
            ...{ onClick: // @ts-ignore
                (...[$event]) => {
                    void $event;
                    if (!!(active.value === 'appearance'))
                        throw 0;
                    if (!!(active.value === 'wallpaper'))
                        throw 0;
                    if (!(active.value === 'dock'))
                        throw 0;
                    return (unpin(app.id));
                    // @ts-ignore
                    [active, dockPinned, dockPinned, runningKeys,];
                } },
            ...{ class: "yw-settings-row-btn" },
        });
        /** @type {__VLS_StyleScopedClasses['yw-settings-row-btn']} */ ;
        // @ts-ignore
        [];
    }
    if (!dockPinned.value.length) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
            ...{ class: "yw-settings-empty" },
        });
        /** @type {__VLS_StyleScopedClasses['yw-settings-empty']} */ ;
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "yw-settings-label" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-settings-label']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "yw-settings-card" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-settings-card']} */ ;
    const __VLS_5 = __VLS_tryAsConstant((apps.value.apps.filter(a => !dock.value.pinned.includes(a.id))));
    for (const [app, i] of __VLS_vFor(__VLS_nonNull(__VLS_5))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            key: (app.id),
            ...{ class: "yw-settings-row" },
            ...{ class: ({ 'is-last': i === apps.value.apps.filter(a => !dock.value.pinned.includes(a.id)).length - 1 }) },
        });
        /** @type {__VLS_StyleScopedClasses['yw-settings-row']} */ ;
        /** @type {__VLS_StyleScopedClasses['is-last']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "yw-settings-row-icon" },
            ...{ style: ({ background: app.iconBg ?? 'linear-gradient(135deg, #5FB3F9, #1263E9)' }) },
        });
        /** @type {__VLS_StyleScopedClasses['yw-settings-row-icon']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.i)({
            ...{ class: (app.icon) },
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "yw-settings-row-main" },
        });
        /** @type {__VLS_StyleScopedClasses['yw-settings-row-main']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "row-label" },
        });
        /** @type {__VLS_StyleScopedClasses['row-label']} */ ;
        (app.name);
        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
            ...{ onClick: // @ts-ignore
                (...[$event]) => {
                    void $event;
                    if (!!(active.value === 'appearance'))
                        throw 0;
                    if (!!(active.value === 'wallpaper'))
                        throw 0;
                    if (!(active.value === 'dock'))
                        throw 0;
                    return (pin(app.id));
                    // @ts-ignore
                    [dockPinned, apps, apps, dock, dock,];
                } },
            ...{ class: "yw-settings-row-btn" },
        });
        /** @type {__VLS_StyleScopedClasses['yw-settings-row-btn']} */ ;
        // @ts-ignore
        [];
    }
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({
        ...{ class: "yw-settings-h1" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-settings-h1']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "yw-settings-card" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-settings-card']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "yw-settings-row is-last" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-settings-row']} */ ;
    /** @type {__VLS_StyleScopedClasses['is-last']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "yw-settings-row-main" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-settings-row-main']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "row-label" },
    });
    /** @type {__VLS_StyleScopedClasses['row-label']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "row-sub" },
    });
    /** @type {__VLS_StyleScopedClasses['row-sub']} */ ;
    (__VLS_unwrap(YW_CORE_VERSION, {}));
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "yw-settings-row is-last" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-settings-row']} */ ;
    /** @type {__VLS_StyleScopedClasses['is-last']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "yw-settings-row-main" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-settings-row-main']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "row-label" },
    });
    /** @type {__VLS_StyleScopedClasses['row-label']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "row-sub" },
    });
    /** @type {__VLS_StyleScopedClasses['row-sub']} */ ;
}
// @ts-ignore
[YW_CORE_VERSION,];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
    props: {},
});
export default {};
import { defineProps, withDefaults, } from 'vue';
