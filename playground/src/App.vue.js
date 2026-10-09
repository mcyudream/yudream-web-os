import { builtinWidgets } from '@yudream/yudream-webos-apps';
import { YwControlCenter, YwDesktop, YwDock, YwLaunchpad, YwMenubar, YwNotificationCenter, YwQuickLaunch, YwSettingsApp, YwWidgetGallery, YwWidgetHost, } from '@yudream/yudream-webos-arco';
import { shortcuts, useAppRegistry, useMenuBar, useSystemSettings, useWebOS, WebOSProvider, } from '@yudream/yudream-webos-vue';
import { h, onBeforeUnmount, onMounted, ref } from 'vue';
import TodoApp from './apps/TodoApp.vue';
const registry = useAppRegistry();
const { setSystemMenus } = useMenuBar();
const theme = useSystemSettings();
const os = useWebOS();
const showQuickLaunch = ref(false);
const showLaunchpad = ref(false);
const showControlCenter = ref(false);
const showNotificationCenter = ref(false);
const showWidgetGallery = ref(false);
/** 自定义应用示例（文档 §13：注册一个应用 + 它的菜单） */
const todoApp = {
    id: 'todo',
    name: '待办清单',
    icon: 'i-lucide-check-square',
    iconBg: 'linear-gradient(135deg, #62BA46 0%, #3D8B2F 100%)',
    component: TodoApp,
    singleton: true,
    defaultSize: { width: 520, height: 480 },
    keywords: 'daiban todo',
    category: 'tool',
    menus: {
        appMenus: [{ id: 'file', label: '文件', submenu: [{ id: 'clear-done', label: '清除已完成' }] }],
    },
    launchpad: { show: true, order: 25 },
};
const settingsWithUser = () => h(YwSettingsApp, { user: { name: 'YuDream', subtitle: '本地账户' } });
onMounted(() => {
    registry.register(todoApp);
    os.appComponents.set('settings', settingsWithUser());
    for (const id of ['finder', 'browser', 'terminal', 'notes', 'calculator', 'settings']) {
        os.dock.pin(id);
    }
    for (const w of builtinWidgets) {
        os.widgets.register(w);
    }
    os.widgets.add('clock', 'small', { col: 0, row: 0 });
    os.widgets.add('calendar', 'small', { col: 0, row: 1 });
    os.widgets.add('system-monitor', 'medium', { col: 0, row: 2 });
    setSystemMenus([
        { id: 'file', label: '文件' },
        { id: 'edit', label: '编辑' },
        { id: 'view', label: '显示' },
        { id: 'window', label: '窗口' },
        { id: 'help', label: '帮助' },
    ]);
    void theme.load();
    theme.apply();
    shortcuts.register('Cmd/Ctrl+K', () => {
        showQuickLaunch.value = !showQuickLaunch.value;
    });
    shortcuts.register('F4', () => {
        showLaunchpad.value = !showLaunchpad.value;
    });
});
onBeforeUnmount(() => {
    shortcuts.unregister('Cmd/Ctrl+K');
    shortcuts.unregister('F4');
});
function onDesktopContextmenu(_ev) {
    // 桌面右键菜单由 YwDesktop 内置（新建/删除/整理/排序实功能），此处仅作宿主通知点
}
const wallpaper = ref({ src: 'https://images.unsplash.com/photo-1439405326854-014607f694d7?w=2560&q=80' });
const __VLS_ctx = {};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
void __VLS_ctx, __VLS_components, __VLS_intrinsics, __VLS_directives;
// @ts-ignore
__VLS_withDotValue(theme, {});
// @ts-ignore
__VLS_withDotValue(showLaunchpad, {});
// @ts-ignore
__VLS_withDotValue(showQuickLaunch, {});
// @ts-ignore
__VLS_withDotValue(showControlCenter, {});
// @ts-ignore
__VLS_withDotValue(showWidgetGallery, {});
// @ts-ignore
__VLS_withDotValue(os, {});
// @ts-ignore
__VLS_withDotValue(showNotificationCenter, {});
void {};
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.WebOSProvider | typeof __VLS_components.WebOSProvider} */
WebOSProvider;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    // @ts-ignore
    wallpaper: (theme.value.settings.wallpaper ?? __VLS_unwrap(wallpaper, {})),
}));
const __VLS_2 = __VLS_1({
    wallpaper: (theme.value.settings.wallpaper ?? __VLS_unwrap(wallpaper, {})),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_5 } = __VLS_nonNull(__VLS_3.slots);
let __VLS_6;
/** @ts-ignore @type { | typeof __VLS_components.YwMenubar | typeof __VLS_components.YwMenubar} */
YwMenubar;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
    // @ts-ignore
    ...{ 'onLogoclick': {} }, title: "YudreamWebOS", showClock: (true),
}));
const __VLS_8 = __VLS_7({
    ...{ 'onLogoclick': {} },
    title: "YudreamWebOS",
    showClock: (true),
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
let __VLS_11;
const __VLS_12 = {
    /** @type {typeof __VLS_11.logoclick} */
    onLogoclick: // @ts-ignore
    (...[$event]) => {
        void $event;
        return (showLaunchpad.value = true);
        // @ts-ignore
        [theme, wallpaper, showLaunchpad,];
    },
};
void __VLS_12;
const { default: __VLS_13 } = __VLS_nonNull(__VLS_9.slots);
{
    const { tray: __VLS_14 } = __VLS_nonNull(__VLS_9.slots);
    __VLS_asFunctionalElement1(__VLS_intrinsics.i)({
        ...{ onClick: // @ts-ignore
            (...[$event]) => {
                void $event;
                return (showQuickLaunch.value = true);
                // @ts-ignore
                [showQuickLaunch,];
            } },
        ...{ class: "i-lucide-search" },
        title: "聚焦搜索 (Ctrl+K)",
        ...{ style: {} },
    });
    /** @type {__VLS_StyleScopedClasses['i-lucide-search']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.i)({
        ...{ onClick: // @ts-ignore
            (...[$event]) => {
                void $event;
                return (showControlCenter.value = !showControlCenter.value);
                // @ts-ignore
                [showControlCenter, showControlCenter,];
            } },
        ...{ class: "i-lucide-layout-grid" },
        title: "控制中心",
        ...{ style: {} },
    });
    /** @type {__VLS_StyleScopedClasses['i-lucide-layout-grid']} */ ;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_9;
var __VLS_10;
let __VLS_15;
/** @ts-ignore @type { | typeof __VLS_components.YwDesktop} */
YwDesktop;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent1(__VLS_15, new __VLS_15({
    // @ts-ignore
    ...{ 'onDesktopContextmenu': {} }, wallpaper: (theme.value.settings.wallpaper ?? __VLS_unwrap(wallpaper, {})),
}));
const __VLS_17 = __VLS_16({
    ...{ 'onDesktopContextmenu': {} },
    wallpaper: (theme.value.settings.wallpaper ?? __VLS_unwrap(wallpaper, {})),
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
let __VLS_20;
const __VLS_21 = {
    /** @type {typeof __VLS_20.desktopContextmenu} */
    onDesktopContextmenu: (onDesktopContextmenu),
};
void __VLS_21;
var __VLS_18;
var __VLS_19;
let __VLS_22;
/** @ts-ignore @type { | typeof __VLS_components.YwWidgetHost | typeof __VLS_components.YwWidgetHost} */
YwWidgetHost;
// @ts-ignore
const __VLS_23 = __VLS_asFunctionalComponent1(__VLS_22, new __VLS_22({
    // @ts-ignore
    ...{ 'onOpenGallery': {} },
}));
const __VLS_24 = __VLS_23({
    ...{ 'onOpenGallery': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_23));
let __VLS_27;
const __VLS_28 = {
    /** @type {typeof __VLS_27.openGallery} */
    onOpenGallery: // @ts-ignore
    (...[$event]) => {
        void $event;
        return (showWidgetGallery.value = true);
        // @ts-ignore
        [theme, wallpaper, showWidgetGallery,];
    },
};
void __VLS_28;
const { default: __VLS_29 } = __VLS_nonNull(__VLS_25.slots);
{
    const { widget: __VLS_30 } = __VLS_nonNull(__VLS_25.slots);
    const [{ instance }] = __VLS_vSlot(__VLS_nonNull(__VLS_30));
    const __VLS_31 = (os.value.widgets.getDefinition(instance.widgetId)?.component);
    // @ts-ignore
    const __VLS_32 = __VLS_asFunctionalComponent1(__VLS_31, new __VLS_31({
        // @ts-ignore
        config: (instance.config),
    }));
    const __VLS_33 = __VLS_32({
        config: (instance.config),
    }, ...__VLS_functionalComponentArgsRest(__VLS_32));
    // @ts-ignore
    [os,];
}
// @ts-ignore
[];
var __VLS_25;
var __VLS_26;
let __VLS_36;
/** @ts-ignore @type { | typeof __VLS_components.YwDock} */
YwDock;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent1(__VLS_36, new __VLS_36({
    // @ts-ignore
    ...{ 'onShowQuicklaunch': {} },
}));
const __VLS_38 = __VLS_37({
    ...{ 'onShowQuicklaunch': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
let __VLS_41;
const __VLS_42 = {
    /** @type {typeof __VLS_41.showQuicklaunch} */
    onShowQuicklaunch: // @ts-ignore
    (...[$event]) => {
        void $event;
        return (showQuickLaunch.value = true);
        // @ts-ignore
        [showQuickLaunch,];
    },
};
void __VLS_42;
var __VLS_39;
var __VLS_40;
if (showQuickLaunch.value) {
    let __VLS_43;
    /** @ts-ignore @type { | typeof __VLS_components.YwQuickLaunch} */
    YwQuickLaunch;
    // @ts-ignore
    const __VLS_44 = __VLS_asFunctionalComponent1(__VLS_43, new __VLS_43({
        // @ts-ignore
        ...{ 'onClose': {} },
    }));
    const __VLS_45 = __VLS_44({
        ...{ 'onClose': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_44));
    let __VLS_48;
    const __VLS_49 = {
        /** @type {typeof __VLS_48.close} */
        onClose: // @ts-ignore
        (...[$event]) => {
            void $event;
            if (!(showQuickLaunch.value))
                throw 0;
            return (showQuickLaunch.value = false);
            // @ts-ignore
            [showQuickLaunch, showQuickLaunch,];
        },
    };
    void __VLS_49;
    var __VLS_46;
    var __VLS_47;
}
if (showLaunchpad.value) {
    let __VLS_50;
    /** @ts-ignore @type { | typeof __VLS_components.YwLaunchpad} */
    YwLaunchpad;
    // @ts-ignore
    const __VLS_51 = __VLS_asFunctionalComponent1(__VLS_50, new __VLS_50({
        // @ts-ignore
        ...{ 'onClose': {} },
    }));
    const __VLS_52 = __VLS_51({
        ...{ 'onClose': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_51));
    let __VLS_55;
    const __VLS_56 = {
        /** @type {typeof __VLS_55.close} */
        onClose: // @ts-ignore
        (...[$event]) => {
            void $event;
            if (!(showLaunchpad.value))
                throw 0;
            return (showLaunchpad.value = false);
            // @ts-ignore
            [showLaunchpad, showLaunchpad,];
        },
    };
    void __VLS_56;
    var __VLS_53;
    var __VLS_54;
}
if (showControlCenter.value) {
    let __VLS_57;
    /** @ts-ignore @type { | typeof __VLS_components.YwControlCenter} */
    YwControlCenter;
    // @ts-ignore
    const __VLS_58 = __VLS_asFunctionalComponent1(__VLS_57, new __VLS_57({
        // @ts-ignore
        ...{ 'onClose': {} },
    }));
    const __VLS_59 = __VLS_58({
        ...{ 'onClose': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_58));
    let __VLS_62;
    const __VLS_63 = {
        /** @type {typeof __VLS_62.close} */
        onClose: // @ts-ignore
        (...[$event]) => {
            void $event;
            if (!(showControlCenter.value))
                throw 0;
            return (showControlCenter.value = false);
            // @ts-ignore
            [showControlCenter, showControlCenter,];
        },
    };
    void __VLS_63;
    var __VLS_60;
    var __VLS_61;
}
if (showNotificationCenter.value) {
    let __VLS_64;
    /** @ts-ignore @type { | typeof __VLS_components.YwNotificationCenter} */
    YwNotificationCenter;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent1(__VLS_64, new __VLS_64({
        // @ts-ignore
        ...{ 'onClose': {} },
    }));
    const __VLS_66 = __VLS_65({
        ...{ 'onClose': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_65));
    let __VLS_69;
    const __VLS_70 = {
        /** @type {typeof __VLS_69.close} */
        onClose: // @ts-ignore
        (...[$event]) => {
            void $event;
            if (!(showNotificationCenter.value))
                throw 0;
            return (showNotificationCenter.value = false);
            // @ts-ignore
            [showNotificationCenter, showNotificationCenter,];
        },
    };
    void __VLS_70;
    var __VLS_67;
    var __VLS_68;
}
if (showWidgetGallery.value) {
    let __VLS_71;
    /** @ts-ignore @type { | typeof __VLS_components.YwWidgetGallery} */
    YwWidgetGallery;
    // @ts-ignore
    const __VLS_72 = __VLS_asFunctionalComponent1(__VLS_71, new __VLS_71({
        // @ts-ignore
        ...{ 'onClose': {} },
    }));
    const __VLS_73 = __VLS_72({
        ...{ 'onClose': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_72));
    let __VLS_76;
    const __VLS_77 = {
        /** @type {typeof __VLS_76.close} */
        onClose: // @ts-ignore
        (...[$event]) => {
            void $event;
            if (!(showWidgetGallery.value))
                throw 0;
            return (showWidgetGallery.value = false);
            // @ts-ignore
            [showWidgetGallery, showWidgetGallery,];
        },
    };
    void __VLS_77;
    var __VLS_74;
    var __VLS_75;
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
