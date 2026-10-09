/**
 * YudreamWebOS Core — 框架无关核心。
 * 事件总线 / 应用注册表 / 窗口管理器 / 桌面布局 / Dock / 小组件 / 菜单 / VFS / 持久化 / 配置 / 主题 token。
 */
export const YW_CORE_VERSION = '0.2.0';
// 配置
export { defaultConfig, resolveConfig } from './config/config';
// 桌面布局
export { DesktopModel } from './desktop/desktop-model';
// Dock
export { DockModel } from './dock/dock-model';
// 事件总线
export { createEventBus } from './events/bus';
// 菜单
export { mergeMenuItems, mergeMenus } from './menu/menu-model';
// 持久化
export { LocalStoragePersistence, MemoryPersistence, migrate, } from './persist/persistence';
// 应用注册表
export { AppRegistry } from './registry/registry';
export { darkTheme, lightTheme, mergeTheme, tokensToStyle } from './theme/tokens';
export { GLASS_LEVELS } from './types/theme';
// 颜色工具
export { hexToOklchChannels } from './utils/color';
// VFS
export { IndexedDBAdapter, LocalStorageAdapter, MemoryAdapter, VFS, } from './vfs/vfs';
// 小组件
export { WidgetStore } from './widgets/widget-model';
// 窗口管理器
export { cascadeRect, detectSnapZone, snapBounds, WindowManager, } from './window/window-manager';
