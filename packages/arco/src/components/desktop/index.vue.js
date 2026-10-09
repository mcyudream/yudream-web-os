import { useWebOS } from '@yudream/yudream-webos-vue';
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { resolveBrowserComponent, useAppsStore, useWindowsStore } from '../../stores/compat';
import { useThemeStore } from '../../stores/theme';
import YwAppIcon from '../app-icon/index.vue';
import YwWindow from '../window/index.vue';
import { bindDesktopDrag } from './drag';
import { tileBackground } from '../icon-tile/colors';
const props = withDefaults(defineProps(), {
    wallpaper: null,
    iconColumns: 0,
    iconGravity: 'top-right',
});
const emit = defineEmits();
const appsStore = useAppsStore();
const windowsStore = useWindowsStore();
const themeStore = useThemeStore();
const os = useWebOS();
const rootEl = ref(null);
const gridEl = ref(null);
const selectedKey = ref(null);
/** 拖拽 ghost 状态 */
const dragState = ref(null);
function metrics() {
    return {
        cellWidth: 84,
        cellHeight: 92,
        gap: 4,
        width: gridEl.value?.clientWidth ?? 1200,
        height: gridEl.value?.clientHeight ?? 800,
        gravity: props.iconGravity,
        menubarHeight: 24,
    };
}
/** ── 壁纸 ── */
const wallpaperStyle = computed(() => {
    const w = props.wallpaper ?? themeStore.wallpaper;
    if (!w) {
        return {
            background: 'linear-gradient(160deg, #0b3b66 0%, #1265a8 38%, #2d8fd0 68%, #6db6e8 100%)',
        };
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
const desktopItems = ref([]);
const visualCols = ref(12);
/** 自动重排守卫：一轮 out-of-range 只触发一次重排（防极端窄面板循环） */
let repackGuard = false;
function childIcon(child) {
    const app = child.type === 'app' ? appsStore.all[child.refId] : undefined;
    return { icon: child.icon || app?.icon || (child.type === 'folder' ? 'i-lucide-folder' : 'i-lucide-file-text'), iconBg: app?.iconBg };
}
function syncFromModel() {
    const width = gridEl.value?.clientWidth ?? 1200;
    const height = gridEl.value?.clientHeight ?? 800;
    visualCols.value = props.iconColumns || Math.max(1, Math.floor((width + 4) / (84 + 4)));
    // 每列行数上限交给模型（firstFreeCell 换列排布）
    os.desktop.rowsPerColumn = Math.max(1, Math.floor((height + 4) / (92 + 4)));
    // 面板收窄后，落在可见列之外的项会变成「看不见的洞」——自动重排进可见区。
    // 守卫位防止极端窄面板下（放不下全部项）syncFromModel ↔ autoArrange 循环。
    const outOfRange = os.desktop.list().some((x) => {
        const s = x.span ?? { w: 1, h: 1 };
        return x.position.col + s.w - 1 > visualCols.value - 1;
    });
    if (outOfRange && os.desktop.list().length && !repackGuard) {
        repackGuard = true;
        os.desktop.autoArrange();
        return;
    }
    if (!outOfRange) {
        repackGuard = false;
    }
    const out = [];
    for (const item of os.desktop.list()) {
        const pos = item.position;
        const span = item.span ?? { w: 1, h: 1 };
        if (item.type === 'app') {
            const app = appsStore.all[item.refId];
            out.push({
                id: item.id,
                kind: 'app',
                appId: item.refId,
                name: item.name || app?.name || item.refId,
                icon: item.icon || app?.icon || 'i-lucide-circle',
                iconBg: app?.iconBg,
                col: pos.col,
                row: pos.row,
                spanW: span.w,
                spanH: span.h,
                children: [],
            });
        }
        else if (item.type === 'folder') {
            out.push({
                id: item.id,
                kind: 'folder',
                name: item.name,
                icon: 'i-lucide-folder',
                col: pos.col,
                row: pos.row,
                spanW: span.w,
                spanH: span.h,
                children: (item.children ?? []).map(c => ({
                    id: c.id,
                    kind: c.type === 'app' ? 'app' : 'file',
                    appId: c.type === 'app' ? c.refId : undefined,
                    name: c.name,
                    ...childIcon(c),
                })),
            });
        }
        else if (item.type === 'file') {
            out.push({ id: item.id, kind: 'file', name: item.name, icon: 'i-lucide-file-text', col: pos.col, row: pos.row, spanW: span.w, spanH: span.h, children: [] });
        }
        else if (item.type === 'widget') {
            const inst = os.widgets.listInstances().find(i => i.instanceId === item.refId);
            const def = inst ? os.widgets.getDefinition(inst.widgetId) : undefined;
            out.push({ id: item.id, kind: 'widget', name: def?.name ?? item.name, icon: 'i-lucide-puzzle', col: pos.col, row: pos.row, spanW: span.w, spanH: span.h, children: [], instanceId: item.refId, widgetId: inst?.widgetId });
        }
    }
    desktopItems.value = out;
}
/** 小组件实例 ↔ 桌面模型项双向对账（widget 项为真实占格项） */
const WIDGET_SPAN = { small: { w: 2, h: 2 }, medium: { w: 4, h: 2 }, large: { w: 4, h: 4 } };
let widgetSyncing = false;
function syncWidgets() {
    if (widgetSyncing) {
        return;
    }
    widgetSyncing = true;
    try {
        const instances = os.widgets.listInstances();
        for (const mw of os.desktop.list().filter(x => x.type === 'widget')) {
            if (!instances.some(i => i.instanceId === mw.refId)) {
                os.desktop.remove(mw.id);
            }
        }
        for (const inst of instances) {
            const id = `yww-${inst.instanceId}`;
            const span = WIDGET_SPAN[inst.size] ?? { w: 2, h: 2 };
            const existing = os.desktop.get(id);
            if (!existing) {
                const def = os.widgets.getDefinition(inst.widgetId);
                os.desktop.add({ id, type: 'widget', refId: inst.instanceId, name: def?.name ?? inst.widgetId, span, position: inst.position });
            }
            else {
                existing.span = span;
            }
        }
    }
    finally {
        widgetSyncing = false;
    }
}
function widgetInst(item) {
    return os.widgets.listInstances().find(i => i.instanceId === item.instanceId);
}
function widgetComp(item) {
    const inst = widgetInst(item);
    return inst ? os.widgets.getDefinition(inst.widgetId)?.component : undefined;
}
/** 把已注册应用播种进 DesktopModel（已有 app 项跳过；启动台是覆盖层不落桌面） */
function seedApps() {
    const existing = new Set(os.desktop.list().filter(x => x.type === 'app').map(x => x.refId));
    for (const app of appsStore.apps) {
        if (existing.has(app.id) || app.id === 'launchpad') {
            continue;
        }
        // desktop.show=false = 不上桌面（仅 Dock/启动台/搜索可达）；dock+launchpad 双隐藏 = 彻底隐藏应用
        if (app.desktop?.show === false) {
            continue;
        }
        if (app.dock?.showInDock === false && app.launchpad?.show === false) {
            continue;
        }
        os.desktop.add({ type: 'app', refId: app.id, name: app.name, icon: app.icon, position: { col: 0, row: 0 } });
    }
}
/** 卡片右下把手拖拽调大小的预览跨度（声明前置供 cellStyle 引用） */
const resizePreview = ref(null);
let resizeCleanup = null;
/** gravity=right 时模型列向左增长：跨格项的视觉左缘 = 其覆盖的最后一个模型列的视觉列 */
function visualLeftOf(item) {
    const w = item.spanW ?? 1;
    const lastModelCol = item.col + w - 1;
    return props.iconGravity === 'top-right' ? visualCols.value - 1 - lastModelCol : item.col;
}
/** 模型坐标 → 渲染像素；span 决定格子尺寸（拖拽调大小时用预览跨度） */
function cellStyle(item) {
    const p = resizePreview.value?.id === item.id ? resizePreview.value : null;
    const w = p ? p.w : item.spanW;
    const h = p ? p.h : item.spanH;
    return {
        left: `${(p ? p.leftVisual : visualLeftOf(item)) * (84 + 4)}px`,
        top: `${item.row * (92 + 4)}px`,
        width: `${w * 84 + (w - 1) * 4}px`,
        height: `${h * 92 + (h - 1) * 4}px`,
    };
}
/** 卡片右下把手拖拽调大小：pointermove 实时预览跨度，pointerup 提交（resizeItem 挤开占位者） */
function startCardResize(ev, item) {
    ev.preventDefault();
    ev.stopPropagation();
    const grid = gridEl.value?.getBoundingClientRect();
    if (!grid) {
        return;
    }
    // rtl：向视觉右扩大 = 基列左移，视觉左缘固定；最多扩到 col 0
    const leftVisual = props.iconGravity === 'top-right'
        ? visualCols.value - 1 - (item.col + item.spanW - 1)
        : item.col;
    const maxW = Math.min(4, props.iconGravity === 'top-right' ? item.spanW + item.col : visualCols.value - item.col);
    const maxH = Math.min(4, os.desktop.rowsPerColumn || 4);
    const onMove = (e) => {
        const vcol = Math.floor((e.clientX - grid.left) / (84 + 4));
        const row = Math.floor((e.clientY - grid.top) / (92 + 4));
        resizePreview.value = {
            id: item.id,
            w: Math.max(1, Math.min(maxW, vcol - leftVisual + 1)),
            h: Math.max(1, Math.min(maxH, row - item.row + 1)),
            leftVisual,
        };
    };
    const onUp = () => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        window.removeEventListener('pointercancel', onUp);
        resizeCleanup = null;
        const p = resizePreview.value;
        resizePreview.value = null;
        if (p && (p.w !== item.spanW || p.h !== item.spanH)) {
            os.desktop.resizeItem(p.id, { w: p.w, h: p.h });
        }
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    resizeCleanup = onUp;
}
const dragGhost = computed(() => {
    const s = dragState.value;
    if (!s) {
        return null;
    }
    // ghost 跟随被拖项的跨度（跨格卡拖动时不再是 1×1 小图）
    const d = desktopItems.value.find(x => x.id === s.id);
    const w = d ? d.spanW * 84 + (d.spanW - 1) * 4 : 84;
    const h = d ? d.spanH * 92 + (d.spanH - 1) * 4 : 92;
    return { transform: `translate(${s.x}px, ${s.y}px)`, width: `${w}px`, height: `${h}px` };
});
const draggingItem = computed(() => {
    const s = dragState.value;
    return s ? desktopItems.value.find(x => x.id === s.id) : null;
});
/** 拖拽悬停命中的文件夹（高亮反馈 + 落点移入） */
const hoverFolderId = ref(null);
/** 落点格指示（随被拖项跨度） */
const dropHint = ref(null);
function dropHintStyle(h) {
    const d = draggingItem.value;
    const w = d?.spanW ?? 1;
    const hh = d?.spanH ?? 1;
    const left = props.iconGravity === 'top-right' ? visualCols.value - 1 - (h.col + w - 1) : h.col;
    return {
        left: `${left * (84 + 4)}px`,
        top: `${h.row * (92 + 4)}px`,
        width: `${w * 84 + (w - 1) * 4}px`,
        height: `${hh * 92 + (hh - 1) * 4}px`,
    };
}
function resolveDropTarget(id, col, row) {
    for (const item of desktopItems.value) {
        if (item.kind !== 'folder' || item.id === id) {
            continue;
        }
        if (col >= item.col && col < item.col + item.spanW && row >= item.row && row < item.row + item.spanH) {
            return item.id;
        }
    }
    return null;
}
const drag = bindDesktopDrag({
    container: null,
    model: null,
    metrics,
    getState: () => dragState.value,
    setState: v => (dragState.value = v),
    onCommit: (id) => {
        const it = os.desktop.get(id);
        if (it?.type === 'widget') {
            os.widgets.moveInstance(it.refId, it.position);
        }
        syncFromModel();
    },
    resolveDropTarget: (id, col, row) => resolveDropTarget(id, col, row),
    setHoverFolder: (id) => { hoverFolderId.value = id; },
    setDropHint: (h) => { dropHint.value = h; },
});
/** 多格应用大卡：图标砖铺满整卡（图标字形随卡缩放），底色沿用 icon-tile 色板 */
function largeTileStyle(item) {
    return { background: tileBackground(item.appId ?? item.id, item.iconBg) };
}
function isImageIcon(item) {
    return /^(?:https?:|data:|\/|\.)/.test(item.icon);
}
/** 文件夹卡：末格「打开」之外能外露的子项数 */
function folderMore(item) {
    return item.children.length - (item.spanW * item.spanH - 1);
}
function onCellPointerDown(ev, item) {
    drag.onPointerDown(ev, item);
}
let detachDrag = null;
/** 恢复窗口无组件载荷时从注册表重建 */
function reconcilePayloads() {
    for (const w of [...windowsStore.windows]) {
        if (windowsStore.payloadOf(w.id)) {
            continue;
        }
        const app = appsStore.all[w.appId];
        if (!app) {
            continue;
        }
        if (app.component !== undefined) {
            const comp = app.id === 'browser' ? resolveBrowserComponent() : app.component;
            windowsStore.attachPayload(w.id, { appId: app.id, component: comp, title: app.name });
        }
        else {
            windowsStore.close(w.id);
        }
    }
}
function syncViewport() {
    windowsStore.setViewport({ width: window.innerWidth, height: window.innerHeight, menubarHeight: 24 });
    syncFromModel();
}
let mediaQuery = null;
let detachWidgetsWatch = null;
onMounted(async () => {
    syncViewport();
    window.addEventListener('resize', syncViewport);
    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    themeStore.setSystemDark(mediaQuery.matches);
    themeStore.apply();
    windowsStore.restore();
    // 布局持久化由 provider 统一装配（desktop.layout scope）；此处等它恢复后播种应用
    void os.persist.get(`desktop.layout`).then((saved) => {
        if (Array.isArray(saved)) {
            for (const item of saved) {
                os.desktop.add(item);
            }
        }
        seedApps();
        syncWidgets();
        syncFromModel();
    });
    os.desktop.onChange(() => {
        syncFromModel();
    });
    // 小组件增删/尺寸变化 → 对账出模型项（真实占格）+ 重渲染
    detachWidgetsWatch = os.widgets.onChange(() => {
        syncWidgets();
        syncFromModel();
    });
    watch(() => appsStore.apps.length, () => seedApps());
    if (gridEl.value) {
        drag.container = gridEl.value;
        drag.model = os.desktop;
        drag.attach();
        detachDrag = drag.detach;
    }
});
watch(() => appsStore.all, reconcilePayloads, { deep: true });
onBeforeUnmount(() => {
    window.removeEventListener('resize', syncViewport);
    mediaQuery?.removeEventListener('change', () => { });
    detachDrag?.();
    detachWidgetsWatch?.();
    resizeCleanup?.();
});
/** ── 交互 ── */
function onIconClick(item) {
    selectedKey.value = item.id;
}
function onIconOpen(item) {
    selectedKey.value = null;
    if (item.kind === 'app') {
        appsStore.openApp(item.appId);
    }
    else if (item.kind === 'folder') {
        openFolder(item);
    }
    else {
        openFileItem(item.id, item.name);
    }
}
/** 桌面文本文件 → 内置编辑器：同一文件只开一窗（已开则聚焦还原），窗口标题=文件名 */
function openFileItem(id, name) {
    const existing = os.wm.windowsOfApp('text-editor').find(w => w.launchOptions?.desktopId === id);
    if (existing) {
        os.wm.focus(existing.id);
        return;
    }
    os.wm.open('text-editor', { title: name, launchOptions: { desktopId: id } });
}
function openChild(child) {
    if (child.kind === 'app') {
        appsStore.openApp(child.appId);
    }
    else {
        openFileItem(child.id, child.name);
    }
}
function onIconContextmenu(ev, item) {
    ev.preventDefault();
    ev.stopPropagation();
    selectedKey.value = item.id;
    if (item.kind === 'widget') {
        const inst = widgetInst(item);
        const def = inst ? os.widgets.getDefinition(inst.widgetId) : undefined;
        const sizeItems = (def?.sizes ?? []).map(sz => ({
            label: sz === 'small' ? '小（2×2）' : sz === 'medium' ? '中（4×2）' : '大（4×4）',
            onSelect: () => os.widgets.resizeInstance(inst.instanceId, sz),
        }));
        os.ui.menu({
            x: ev.clientX,
            y: ev.clientY,
            items: [
                ...(sizeItems.length ? [{ label: '大小 ▸', icon: 'i-lucide-scaling', onSelect: () => os.ui.menu({ x: ev.clientX, y: ev.clientY, items: sizeItems }) }] : []),
                { separator: true, label: '' },
                { label: '移除小组件', icon: 'i-lucide-trash-2', danger: true, disabled: !inst, onSelect: () => os.widgets.removeInstance(inst.instanceId) },
            ],
        });
        emit('iconContextmenu', { event: ev, appId: item.id });
        return;
    }
    const items = [{ label: '打开', icon: 'i-lucide-external-link', onSelect: () => onIconOpen(item) }];
    if (item.kind === 'folder' && item.spanW * item.spanH > 1) {
        items.push({
            label: '整理此文件夹',
            icon: 'i-lucide-square-stack',
            onSelect: () => {
                openFolder(item);
            },
        });
    }
    if (item.kind !== 'app') {
        items.push({ label: '重命名', icon: 'i-lucide-pencil', onSelect: () => startRename(item) });
    }
    // 大小：文件夹卡片 1×1/2×2/3×2/4×3；应用图标 1×1/2×1/1×2/2×2/4×2
    const presets = item.kind === 'folder'
        ? [
            { label: '1 × 1（普通图标）', w: 1, h: 1 },
            { label: '2 × 2', w: 2, h: 2 },
            { label: '3 × 2', w: 3, h: 2 },
            { label: '4 × 3', w: 4, h: 3 },
        ]
        : [
            { label: '1 × 1（普通图标）', w: 1, h: 1 },
            { label: '2 × 1（宽）', w: 2, h: 1 },
            { label: '1 × 2（高）', w: 1, h: 2 },
            { label: '2 × 2', w: 2, h: 2 },
            { label: '4 × 2（大卡）', w: 4, h: 2 },
        ];
    items.push({
        label: '大小 ▸',
        icon: 'i-lucide-scaling',
        onSelect: () => {
            os.ui.menu({
                x: ev.clientX,
                y: ev.clientY,
                items: presets.map(p => ({
                    label: p.label,
                    onSelect: () => {
                        const res = os.desktop.resizeItem(item.id, { w: p.w, h: p.h });
                        if (!res.ok) {
                            os.ui.message('error', '该区域被占用（图标或小组件），换个位置再试');
                        }
                    },
                })),
            });
        },
    });
    if (item.kind === 'folder' && item.children.length) {
        items.push({
            label: '解散文件夹',
            icon: 'i-lucide-folder-open',
            onSelect: () => { os.desktop.dissolveFolder(item.id); },
        });
    }
    items.push({ separator: true, label: '' }, { label: item.kind === 'folder' ? '移到废纸篓（含内容）' : '移到废纸篓', icon: 'i-lucide-trash-2', danger: true, disabled: item.kind === 'app', onSelect: () => void trashItem(item) });
    os.ui.menu({ x: ev.clientX, y: ev.clientY, items });
    emit('iconContextmenu', { event: ev, appId: item.appId ?? item.id });
}
async function trashItem(item) {
    if (os.config.desktop.bindVFS && item.kind !== 'app') {
        await os.vfs.mkdir('/.Trash').catch(() => { });
        await os.vfs.move(`/Desktop/${item.name}`, `/.Trash/${item.name}`).catch(() => { });
    }
    if (item.kind === 'folder') {
        closeFolder();
    }
    os.desktop.remove(item.id);
}
function onDesktopPointerDown(ev) {
    if (ev.target === rootEl.value || ev.target.classList?.contains('yw-desktop-icons')) {
        selectedKey.value = null;
    }
}
/** ── 新建（文件夹 / 文本文件）── */
const creating = reactive({ open: false, kind: 'folder', name: '' });
function startCreate(kind) {
    creating.open = true;
    creating.kind = kind;
    creating.name = kind === 'folder' ? '新建文件夹' : '新建文本.txt';
}
async function confirmCreate() {
    const name = creating.name.trim();
    creating.open = false;
    if (!name) {
        return;
    }
    if (os.config.desktop.bindVFS) {
        const path = `/Desktop/${name}`;
        if (creating.kind === 'folder') {
            await os.vfs.mkdir(path).catch(() => { });
        }
        else {
            await os.vfs.write(path, '').catch(() => { });
        }
    }
    // 位置交给模型：firstFreeCell 会避开其它图标与小组件占格
    os.desktop.add({ type: creating.kind, refId: creating.kind === 'folder' ? `/Desktop/${name}` : '', name, position: { col: 0, row: 0 } });
}
/** 重命名 */
const renaming = reactive({ id: '', name: '' });
function startRename(item) {
    renaming.id = item.id;
    renaming.name = item.name;
}
async function confirmRename() {
    const item = os.desktop.get(renaming.id);
    const old = item?.name;
    const next = renaming.name.trim();
    renaming.id = '';
    if (!item || !next || next === old) {
        return;
    }
    if (os.config.desktop.bindVFS && item.type !== 'app' && old) {
        await os.vfs.move(`/Desktop/${old}`, `/Desktop/${next}`).catch(() => { });
    }
    item.name = next;
    syncFromModel();
}
/** ── 文件夹浮层：完整子项网格 ── */
const openFolderId = ref(null);
const openFolderStyle = ref({});
function openFolder(item) {
    const root = rootEl.value?.getBoundingClientRect();
    const grid = gridEl.value?.getBoundingClientRect();
    if (root && grid) {
        const x = grid.left - root.left + visualLeftOf(item) * 88;
        const y = grid.top - root.top + item.row * 96;
        const width = Math.min(3 * 88 + 16, root.width - 24);
        openFolderStyle.value = {
            left: `${Math.max(12, Math.min(x - 8, root.width - width - 12))}px`,
            top: `${Math.max(12, Math.min(y, root.height - 320))}px`,
            width: `${width}px`,
        };
    }
    openFolderId.value = item.id;
}
function closeFolder() {
    openFolderId.value = null;
}
const openFolderItem = computed(() => {
    if (!openFolderId.value) {
        return null;
    }
    return desktopItems.value.find(x => x.id === openFolderId.value && x.kind === 'folder') ?? null;
});
function onChildContextmenu(ev, folder, child) {
    ev.preventDefault();
    ev.stopPropagation();
    os.ui.menu({
        x: ev.clientX,
        y: ev.clientY,
        items: [
            { label: '打开', icon: 'i-lucide-external-link', onSelect: () => openChild(child) },
            { label: '移出文件夹', icon: 'i-lucide-log-out', onSelect: () => { os.desktop.removeFromFolder(folder.id, child.id); } },
        ],
    });
}
/** 桌面右键菜单（带实功能，供模板与宿主复用） */
function showDesktopMenu(ev) {
    os.ui.menu({
        x: ev.clientX,
        y: ev.clientY,
        items: [
            { label: '新建文件夹', icon: 'i-lucide-folder-plus', onSelect: () => startCreate('folder') },
            { label: '新建文本文件', icon: 'i-lucide-file-plus', onSelect: () => startCreate('file') },
            { separator: true, label: '' },
            { label: '整理图标', icon: 'i-lucide-layout-grid', onSelect: () => os.desktop.autoArrange() },
            { label: '按名称排序', icon: 'i-lucide-arrow-down-a-z', onSelect: () => os.desktop.sortBy('name') },
            { separator: true, label: '' },
            { label: '平铺全部窗口', icon: 'i-lucide-layout-panel-left', onSelect: () => windowsStore.tileAll() },
            { separator: true, label: '' },
            { label: '编辑小组件', icon: 'i-lucide-puzzle', onSelect: () => window.dispatchEvent(new CustomEvent('webos:widgets:edit')) },
            { label: '系统设置…', icon: 'i-lucide-settings', onSelect: () => os.openApp('settings') },
        ],
    });
}
const __VLS_exposed = { showDesktopMenu };
defineExpose(__VLS_exposed);
const __VLS_defaults = {
    wallpaper: null,
    iconColumns: 0,
    iconGravity: 'top-right',
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
__VLS_withDotValue(os, {});
// @ts-ignore
__VLS_withDotValue(hoverFolderId, {});
// @ts-ignore
__VLS_withDotValue(dragState, {});
// @ts-ignore
__VLS_withDotValue(selectedKey, {});
// @ts-ignore
__VLS_withDotValue(dropHint, {});
// @ts-ignore
__VLS_withDotValue(dragGhost, {});
// @ts-ignore
__VLS_withDotValue(draggingItem, {});
// @ts-ignore
__VLS_withDotValue(openFolderItem, {});
// @ts-ignore
__VLS_withDotValue(creating, {});
// @ts-ignore
__VLS_withDotValue(renaming, {});
// @ts-ignore
__VLS_withDotValue(windowsStore, {});
void {};
/** @type {__VLS_StyleScopedClasses['yw-desktop-cell']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-desktop-cell']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-desktop-cell']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-widget-item-card']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-desktop-cell']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-desktop-cell']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-desktop-cell']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-card-resize']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-card-resize']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-desktop-cell']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-folder-card']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-folder-mini']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-app-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-folder-mini']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-folder-open']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-folder-open']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-large-tile']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-large-tile']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-large-tile']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-folder-flyout-head']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-desktop-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-desktop-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-desktop-dim']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-desktop-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-desktop-cell']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-desktop-windows']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ onPointerdown: (onDesktopPointerDown) },
    ...{ onContextmenu: // @ts-ignore
        (...[$event]) => {
            void $event;
            showDesktopMenu($event);
            __VLS_unwrap(emit, {})('desktopContextmenu', $event);
            // @ts-ignore
            [emit,];
        } },
    ref: "rootEl",
    ...{ class: "yw-desktop" },
    ...{ style: (__VLS_unwrap(wallpaperStyle, {})) },
});
/** @type {__VLS_StyleScopedClasses['yw-desktop']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div)({
    ...{ class: "yw-desktop-dim" },
});
/** @type {__VLS_StyleScopedClasses['yw-desktop-dim']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ref: "gridEl",
    ...{ class: "yw-desktop-icons" },
});
/** @type {__VLS_StyleScopedClasses['yw-desktop-icons']} */ ;
const __VLS_0 = __VLS_tryAsConstant((__VLS_unwrap(desktopItems, {})));
for (const [item] of __VLS_vFor(__VLS_nonNull(__VLS_0))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onPointerdown: // @ts-ignore
            (...[$event]) => {
                void $event;
                return (onCellPointerDown($event, os.value.desktop.get(item.id)));
                // @ts-ignore
                [wallpaperStyle, desktopItems, os,];
            } },
        ...{ onClick: // @ts-ignore
            (...[$event]) => {
                void $event;
                return (onIconClick(item));
                // @ts-ignore
                [];
            } },
        ...{ onDblclick: // @ts-ignore
            (...[$event]) => {
                void $event;
                return (onIconOpen(item));
                // @ts-ignore
                [];
            } },
        ...{ onContextmenu: // @ts-ignore
            (...[$event]) => {
                void $event;
                return (onIconContextmenu($event, item));
                // @ts-ignore
                [];
            } },
        key: (item.id),
        ...{ class: "yw-desktop-cell" },
        ...{ class: ({
                'is-folder-card': item.kind === 'folder' && item.spanW * item.spanH > 1,
                'is-hover-folder': hoverFolderId.value === item.id,
                'is-large-app': item.kind === 'app' && item.spanW * item.spanH > 1,
                'is-dragging': dragState.value?.id === item.id,
            }) },
        ...{ style: (cellStyle(item)) },
    });
    /** @type {__VLS_StyleScopedClasses['yw-desktop-cell']} */ ;
    /** @type {__VLS_StyleScopedClasses['is-folder-card']} */ ;
    /** @type {__VLS_StyleScopedClasses['is-hover-folder']} */ ;
    /** @type {__VLS_StyleScopedClasses['is-large-app']} */ ;
    /** @type {__VLS_StyleScopedClasses['is-dragging']} */ ;
    if (item.kind === 'folder' && item.spanW * item.spanH > 1) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "yw-folder-card" },
        });
        /** @type {__VLS_StyleScopedClasses['yw-folder-card']} */ ;
        if (item.children.length) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "yw-folder-badge" },
            });
            /** @type {__VLS_StyleScopedClasses['yw-folder-badge']} */ ;
            (item.children.length);
        }
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "yw-folder-grid" },
            ...{ style: ({ gridTemplateColumns: `repeat(${item.spanW}, 1fr)` }) },
        });
        /** @type {__VLS_StyleScopedClasses['yw-folder-grid']} */ ;
        const __VLS_1 = __VLS_tryAsConstant((item.children.slice(0, item.spanW * item.spanH - 1)));
        for (const [child] of __VLS_vFor(__VLS_nonNull(__VLS_1))) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
                ...{ onClick: // @ts-ignore
                    (...[$event]) => {
                        void $event;
                        if (!(item.kind === 'folder' && item.spanW * item.spanH > 1))
                            throw 0;
                        return (openChild(child));
                        // @ts-ignore
                        [hoverFolderId, dragState,];
                    } },
                ...{ onDblclick: () => { } },
                ...{ onContextmenu: // @ts-ignore
                    (...[$event]) => {
                        void $event;
                        if (!(item.kind === 'folder' && item.spanW * item.spanH > 1))
                            throw 0;
                        return (onChildContextmenu($event, item, child));
                        // @ts-ignore
                        [];
                    } },
                key: (child.id),
                ...{ class: "yw-folder-mini" },
                title: (child.name),
            });
            /** @type {__VLS_StyleScopedClasses['yw-folder-mini']} */ ;
            const __VLS_2 = YwAppIcon;
            // @ts-ignore
            const __VLS_3 = __VLS_asFunctionalComponent1(__VLS_2, new __VLS_2({
                // @ts-ignore
                appKey: (child.appId ?? child.id), icon: (child.icon), iconBg: (child.iconBg), title: (child.name),
            }));
            const __VLS_4 = __VLS_3({
                appKey: (child.appId ?? child.id),
                icon: (child.icon),
                iconBg: (child.iconBg),
                title: (child.name),
            }, ...__VLS_functionalComponentArgsRest(__VLS_3));
            // @ts-ignore
            [];
        }
        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
            ...{ onClick: // @ts-ignore
                (...[$event]) => {
                    void $event;
                    if (!(item.kind === 'folder' && item.spanW * item.spanH > 1))
                        throw 0;
                    return (openFolder(item));
                    // @ts-ignore
                    [];
                } },
            ...{ onDblclick: () => { } },
            ...{ class: "yw-folder-open" },
            title: (`打开 ${item.name}`),
        });
        /** @type {__VLS_StyleScopedClasses['yw-folder-open']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.i)({
            ...{ class: "i-lucide-folder-open" },
        });
        /** @type {__VLS_StyleScopedClasses['i-lucide-folder-open']} */ ;
        if (folderMore(item) > 0) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "yw-folder-open-more" },
            });
            /** @type {__VLS_StyleScopedClasses['yw-folder-open-more']} */ ;
            (folderMore(item));
        }
        else if (!item.children.length) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "yw-folder-open-more" },
            });
            /** @type {__VLS_StyleScopedClasses['yw-folder-open-more']} */ ;
        }
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "yw-folder-label" },
        });
        /** @type {__VLS_StyleScopedClasses['yw-folder-label']} */ ;
        (item.name);
    }
    else if (item.kind === 'widget') {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "yw-widget-item" },
        });
        /** @type {__VLS_StyleScopedClasses['yw-widget-item']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "yw-widget-item-card" },
        });
        /** @type {__VLS_StyleScopedClasses['yw-widget-item-card']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "yw-widget-item-body" },
        });
        /** @type {__VLS_StyleScopedClasses['yw-widget-item-body']} */ ;
        if (widgetComp(item)) {
            const __VLS_7 = (widgetComp(item));
            // @ts-ignore
            const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
                // @ts-ignore
                config: (widgetInst(item)?.config ?? {}),
            }));
            const __VLS_9 = __VLS_8({
                config: (widgetInst(item)?.config ?? {}),
            }, ...__VLS_functionalComponentArgsRest(__VLS_8));
        }
    }
    else if (item.kind === 'app' && item.spanW * item.spanH > 1) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "yw-large-tile" },
            ...{ style: (largeTileStyle(item)) },
        });
        /** @type {__VLS_StyleScopedClasses['yw-large-tile']} */ ;
        if (isImageIcon(item)) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
                src: (item.icon),
                alt: "",
                draggable: "false",
            });
        }
        else {
            __VLS_asFunctionalElement1(__VLS_intrinsics.i)({
                ...{ class: (item.icon) },
            });
        }
    }
    else {
        const __VLS_12 = YwAppIcon;
        // @ts-ignore
        const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({
            // @ts-ignore
            appKey: (item.kind === 'app' ? item.appId : item.id), icon: (item.icon), iconBg: (item.iconBg), title: (item.name), selected: (selectedKey.value === item.id),
        }));
        const __VLS_14 = __VLS_13({
            appKey: (item.kind === 'app' ? item.appId : item.id),
            icon: (item.icon),
            iconBg: (item.iconBg),
            title: (item.name),
            selected: (selectedKey.value === item.id),
        }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    }
    if (item.spanW * item.spanH > 1 && item.kind !== 'widget') {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ onPointerdown: // @ts-ignore
                (...[$event]) => {
                    void $event;
                    if (!(item.spanW * item.spanH > 1 && item.kind !== 'widget'))
                        throw 0;
                    return (startCardResize($event, item));
                    // @ts-ignore
                    [selectedKey,];
                } },
            ...{ class: "yw-card-resize" },
            ...{ class: ({ 'is-on-label': item.kind === 'folder' }) },
            title: "拖拽调整大小",
        });
        /** @type {__VLS_StyleScopedClasses['yw-card-resize']} */ ;
        /** @type {__VLS_StyleScopedClasses['is-on-label']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.i)({});
    }
    // @ts-ignore
    [];
}
if (dropHint.value && dragState.value) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div)({
        ...{ class: "yw-drop-hint" },
        ...{ style: (dropHintStyle(dropHint.value)) },
    });
    /** @type {__VLS_StyleScopedClasses['yw-drop-hint']} */ ;
}
if (dragGhost.value && draggingItem.value) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "yw-desktop-cell yw-desktop-ghost" },
        ...{ style: (dragGhost.value) },
    });
    /** @type {__VLS_StyleScopedClasses['yw-desktop-cell']} */ ;
    /** @type {__VLS_StyleScopedClasses['yw-desktop-ghost']} */ ;
    const __VLS_17 = YwAppIcon;
    // @ts-ignore
    const __VLS_18 = __VLS_asFunctionalComponent1(__VLS_17, new __VLS_17({
        // @ts-ignore
        appKey: (draggingItem.value.kind === 'app' ? draggingItem.value.appId : draggingItem.value.id), icon: (draggingItem.value.icon), iconBg: (draggingItem.value.iconBg), title: (draggingItem.value.name),
    }));
    const __VLS_19 = __VLS_18({
        appKey: (draggingItem.value.kind === 'app' ? draggingItem.value.appId : draggingItem.value.id),
        icon: (draggingItem.value.icon),
        iconBg: (draggingItem.value.iconBg),
        title: (draggingItem.value.name),
    }, ...__VLS_functionalComponentArgsRest(__VLS_18));
}
if (openFolderItem.value) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div)({
        ...{ onPointerdown: (closeFolder) },
        ...{ class: "yw-folder-flyout-backdrop" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-folder-flyout-backdrop']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "yw-folder-flyout" },
        ...{ style: (__VLS_unwrap(openFolderStyle, {})) },
    });
    /** @type {__VLS_StyleScopedClasses['yw-folder-flyout']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "yw-folder-flyout-head" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-folder-flyout-head']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.i)({
        ...{ class: "i-lucide-folder" },
    });
    /** @type {__VLS_StyleScopedClasses['i-lucide-folder']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.b, __VLS_intrinsics.b)({});
    (openFolderItem.value.name);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (openFolderItem.value.children.length);
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (closeFolder) },
        ...{ class: "yw-folder-flyout-close" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-folder-flyout-close']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.i)({
        ...{ class: "i-lucide-x" },
    });
    /** @type {__VLS_StyleScopedClasses['i-lucide-x']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "yw-folder-flyout-grid" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-folder-flyout-grid']} */ ;
    const __VLS_22 = __VLS_tryAsConstant((openFolderItem.value.children));
    for (const [child] of __VLS_vFor(__VLS_nonNull(__VLS_22))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
            ...{ onClick: // @ts-ignore
                (...[$event]) => {
                    void $event;
                    if (!(openFolderItem.value))
                        throw 0;
                    return (openChild(child));
                    // @ts-ignore
                    [dragState, dropHint, dropHint, dragGhost, dragGhost, draggingItem, draggingItem, draggingItem, draggingItem, draggingItem, draggingItem, draggingItem, openFolderItem, openFolderItem, openFolderItem, openFolderItem, openFolderStyle,];
                } },
            ...{ onContextmenu: // @ts-ignore
                (...[$event]) => {
                    void $event;
                    if (!(openFolderItem.value))
                        throw 0;
                    return (onChildContextmenu($event, openFolderItem.value, child));
                    // @ts-ignore
                    [openFolderItem,];
                } },
            key: (child.id),
            ...{ class: "yw-folder-mini" },
            title: (child.name),
        });
        /** @type {__VLS_StyleScopedClasses['yw-folder-mini']} */ ;
        const __VLS_23 = YwAppIcon;
        // @ts-ignore
        const __VLS_24 = __VLS_asFunctionalComponent1(__VLS_23, new __VLS_23({
            // @ts-ignore
            appKey: (child.appId ?? child.id), icon: (child.icon), iconBg: (child.iconBg), title: (child.name),
        }));
        const __VLS_25 = __VLS_24({
            appKey: (child.appId ?? child.id),
            icon: (child.icon),
            iconBg: (child.iconBg),
            title: (child.name),
        }, ...__VLS_functionalComponentArgsRest(__VLS_24));
        // @ts-ignore
        [];
    }
    if (!openFolderItem.value.children.length) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "yw-folder-flyout-empty" },
        });
        /** @type {__VLS_StyleScopedClasses['yw-folder-flyout-empty']} */ ;
    }
}
if (creating.value.open) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onPointerdown: // @ts-ignore
            (...[$event]) => {
                void $event;
                if (!(creating.value.open))
                    throw 0;
                return (creating.value.open = false);
                // @ts-ignore
                [openFolderItem, creating, creating,];
            } },
        ...{ class: "yw-desktop-dialog" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-desktop-dialog']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "yw-desktop-dialog-card" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-desktop-dialog-card']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.b, __VLS_intrinsics.b)({});
    (creating.value.kind === 'folder' ? '新建文件夹' : '新建文本文件');
    __VLS_asFunctionalElement1(__VLS_intrinsics.input, __VLS_intrinsics.input)({
        ...{ onKeydown: (confirmCreate) },
        ...{ class: "yw-desktop-input" },
    });
    (creating.value.name);
    /** @type {__VLS_StyleScopedClasses['yw-desktop-input']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "yw-desktop-actions" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-desktop-actions']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: // @ts-ignore
            (...[$event]) => {
                void $event;
                if (!(creating.value.open))
                    throw 0;
                return (creating.value.open = false);
                // @ts-ignore
                [creating, creating, creating,];
            } },
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (confirmCreate) },
        ...{ class: "is-primary" },
    });
    /** @type {__VLS_StyleScopedClasses['is-primary']} */ ;
}
if (renaming.value.id) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onPointerdown: // @ts-ignore
            (...[$event]) => {
                void $event;
                if (!(renaming.value.id))
                    throw 0;
                return (renaming.value.id = '');
                // @ts-ignore
                [renaming, renaming,];
            } },
        ...{ class: "yw-desktop-dialog" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-desktop-dialog']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "yw-desktop-dialog-card" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-desktop-dialog-card']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.b, __VLS_intrinsics.b)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.input, __VLS_intrinsics.input)({
        ...{ onKeydown: (confirmRename) },
        ...{ class: "yw-desktop-input" },
    });
    (renaming.value.name);
    /** @type {__VLS_StyleScopedClasses['yw-desktop-input']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "yw-desktop-actions" },
    });
    /** @type {__VLS_StyleScopedClasses['yw-desktop-actions']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: // @ts-ignore
            (...[$event]) => {
                void $event;
                if (!(renaming.value.id))
                    throw 0;
                return (renaming.value.id = '');
                // @ts-ignore
                [renaming, renaming,];
            } },
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (confirmRename) },
        ...{ class: "is-primary" },
    });
    /** @type {__VLS_StyleScopedClasses['is-primary']} */ ;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "yw-desktop-windows" },
});
/** @type {__VLS_StyleScopedClasses['yw-desktop-windows']} */ ;
const __VLS_28 = __VLS_tryAsConstant((windowsStore.value.visible));
for (const [win] of __VLS_vFor(__VLS_nonNull(__VLS_28))) {
    const __VLS_29 = YwWindow;
    // @ts-ignore
    const __VLS_30 = __VLS_asFunctionalComponent1(__VLS_29, new __VLS_29({
        // @ts-ignore
        ...{ 'onFocus': {} }, key: (win.id), win: (win),
    }));
    const __VLS_31 = __VLS_30({
        ...{ 'onFocus': {} },
        key: (win.id),
        win: (win),
    }, ...__VLS_functionalComponentArgsRest(__VLS_30));
    let __VLS_34;
    const __VLS_35 = {
        /** @type {typeof __VLS_34.focus} */
        onFocus: (windowsStore.value.focus),
    };
    void __VLS_35;
    var __VLS_32;
    var __VLS_33;
    // @ts-ignore
    [windowsStore, windowsStore,];
}
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
export default {};
import { defineProps, defineEmits, defineExpose, withDefaults, } from 'vue';
