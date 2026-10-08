<script setup lang="ts">
import type { AppDefinition } from '@yudream/yudream-webos-vue'
import { builtinWidgets } from '@yudream/yudream-webos-apps'
import {
  YwControlCenter,
  YwDesktop,
  YwDock,
  YwLaunchpad,
  YwMenubar,
  YwNotificationCenter,
  YwQuickLaunch,
  YwSettingsApp,
  YwWidgetGallery,
  YwWidgetHost,
} from '@yudream/yudream-webos-arco'
import {
  shortcuts,
  useAppRegistry,
  useMenuBar,
  useSystemSettings,
  useWebOS,
  WebOSProvider,
} from '@yudream/yudream-webos-vue'
import { h, onBeforeUnmount, onMounted, ref } from 'vue'

import TodoApp from './apps/TodoApp.vue'

const registry = useAppRegistry()
const { setSystemMenus } = useMenuBar()
const theme = useSystemSettings()
const os = useWebOS()

const showQuickLaunch = ref(false)
const showLaunchpad = ref(false)
const showControlCenter = ref(false)
const showNotificationCenter = ref(false)
const showWidgetGallery = ref(false)

/** 自定义应用示例（文档 §13：注册一个应用 + 它的菜单） */
const todoApp: AppDefinition = {
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
}

const settingsWithUser = () => h(YwSettingsApp, { user: { name: 'YuDream', subtitle: '本地账户' } })

onMounted(() => {
  registry.register(todoApp)
  os.appComponents.set('settings', settingsWithUser())

  for (const id of ['finder', 'browser', 'terminal', 'notes', 'calculator', 'settings']) {
    os.dock.pin(id)
  }

  for (const w of builtinWidgets) {
    os.widgets.register(w)
  }
  os.widgets.add('clock', 'small', { col: 0, row: 0 })
  os.widgets.add('calendar', 'small', { col: 0, row: 1 })
  os.widgets.add('system-monitor', 'medium', { col: 0, row: 2 })

  setSystemMenus([
    { id: 'file', label: '文件' },
    { id: 'edit', label: '编辑' },
    { id: 'view', label: '显示' },
    { id: 'window', label: '窗口' },
    { id: 'help', label: '帮助' },
  ])
  void theme.load()
  theme.apply()

  shortcuts.register('Cmd/Ctrl+K', () => {
    showQuickLaunch.value = !showQuickLaunch.value
  })
  shortcuts.register('F4', () => {
    showLaunchpad.value = !showLaunchpad.value
  })
})

onBeforeUnmount(() => {
  shortcuts.unregister('Cmd/Ctrl+K')
  shortcuts.unregister('F4')
})

function onDesktopContextmenu(_ev: MouseEvent) {
  // 桌面右键菜单由 YwDesktop 内置（新建/删除/整理/排序实功能），此处仅作宿主通知点
}

const wallpaper = ref({ src: 'https://images.unsplash.com/photo-1439405326854-014607f694d7?w=2560&q=80' })
</script>

<template>
  <WebOSProvider :wallpaper="theme.settings.wallpaper ?? wallpaper">
    <YwMenubar title="YudreamWebOS" :show-clock="true" @logoclick="showLaunchpad = true">
      <template #tray>
        <i
          class="i-lucide-search"
          title="聚焦搜索 (Ctrl+K)"
          style=" font-size: 14px;cursor: default;"
          @click="showQuickLaunch = true"
        />
        <i
          class="i-lucide-layout-grid"
          title="控制中心"
          style=" font-size: 14px;cursor: default;"
          @click="showControlCenter = !showControlCenter"
        />
      </template>
    </YwMenubar>

    <YwDesktop :wallpaper="theme.settings.wallpaper ?? wallpaper" @desktop-contextmenu="onDesktopContextmenu" />

    <YwWidgetHost @open-gallery="showWidgetGallery = true">
      <template #widget="{ instance }">
        <component :is="os.widgets.getDefinition(instance.widgetId)?.component" :config="instance.config" />
      </template>
    </YwWidgetHost>

    <YwDock @show-quicklaunch="showQuickLaunch = true" />

    <YwQuickLaunch v-if="showQuickLaunch" @close="showQuickLaunch = false" />
    <YwLaunchpad v-if="showLaunchpad" @close="showLaunchpad = false" />
    <YwControlCenter v-if="showControlCenter" @close="showControlCenter = false" />
    <YwNotificationCenter v-if="showNotificationCenter" @close="showNotificationCenter = false" />
    <YwWidgetGallery v-if="showWidgetGallery" @close="showWidgetGallery = false" />
  </WebOSProvider>
</template>

<style scoped>
.pg-root {
  position: fixed;
  inset: 0;
  overflow: hidden;
}
</style>
