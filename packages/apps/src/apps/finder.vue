<script setup lang="ts">
import { useFinder, useVFS, useWebOS } from '@yudream/yudream-webos-vue'
import { computed, ref } from 'vue'

/** FinderApp 内容壳：复用 ui-arco 的 YwFinder，右键菜单/新建文件等应用级能力在此层 */
const props = defineProps<{
  win?: { id: string, launchOptions?: Record<string, unknown> }
}>()

const { vfs } = useVFS()
const finder = useFinder()
const { registry, ui } = useWebOS()

const creating = ref(false)
const newName = ref('')

async function createFile(type: 'file' | 'folder') {
  creating.value = false
  const name = newName.value.trim() || (type === 'folder' ? '新建文件夹' : '未命名.txt')
  const path = `${finder.state.path === '/' ? '' : finder.state.path}/${name}`
  if (type === 'folder') {
    await vfs.mkdir(path)
  }
  else {
    await vfs.write(path, '')
  }
  newName.value = ''
}

function startCreate(defaultName: string) {
  creating.value = true
  newName.value = defaultName
}

function onContextmenu(ev: MouseEvent) {
  ev.preventDefault()
  const handlers = registry.list().flatMap(a => a.fileHandlers ?? [])
  ui.menu({
    x: ev.clientX,
    y: ev.clientY,
    items: [
      { label: '新建文件', icon: 'i-lucide-file-plus', onSelect: () => startCreate('未命名.txt') },
      { label: '新建文件夹', icon: 'i-lucide-folder-plus', onSelect: () => startCreate('新建文件夹') },
      { separator: true, label: '' },
      { label: `可打开类型：${[...new Set(handlers)].join(', ') || '无'}`, disabled: true },
    ],
  })
}

const hint = computed(() => props.win?.launchOptions?.files ? '双击文件已在编辑器打开' : '')
</script>

<template>
  <div class="yw-finder-app" @contextmenu="onContextmenu">
    <YwFinder :win="win" />
    <div v-if="creating" class="yw-finder-app-dialog" @pointerdown.self="creating = false">
      <div class="yw-finder-app-dialog-card">
        <b>新建</b>
        <input v-model="newName" class="yw-finder-app-input" @keydown.enter="createFile(newName.includes('.') ? 'file' : 'folder')">
        <div class="yw-finder-app-actions">
          <button @click="creating = false">
            取消
          </button>
          <button class="is-primary" @click="createFile(newName.includes('.') ? 'file' : 'folder')">
            创建
          </button>
        </div>
      </div>
    </div>
    <span v-if="hint" class="yw-finder-app-hint">{{ hint }}</span>
  </div>
</template>

<style scoped>
.yw-finder-app {
  position: relative;
  height: 100%;
}

.yw-finder-app-dialog {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: grid;
  place-items: center;
  background: rgb(0 0 0 / 25%);
}

.yw-finder-app-dialog-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 280px;
  padding: 16px;
  font-size: 13px;
  background: oklch(var(--yw-popover));
  border-radius: var(--yw-radius-window);
  box-shadow: var(--yw-shadow-window);
}

.yw-finder-app-input {
  height: 28px;
  padding: 0 10px;
  color: oklch(var(--yw-foreground));
  outline: none;
  background: rgb(120 120 128 / 14%);
  border: none;
  border-radius: 7px;
}

.yw-finder-app-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.yw-finder-app-actions button {
  padding: 5px 14px;
  font-size: 12px;
  color: oklch(var(--yw-foreground));
  cursor: default;
  background: var(--yw-label-4);
  border: none;
  border-radius: 7px;
}

.yw-finder-app-actions button.is-primary {
  color: #fff;
  background: oklch(var(--yw-primary));
}

.yw-finder-app-hint {
  position: absolute;
  right: 10px;
  bottom: 8px;
  font-size: 11px;
  color: var(--yw-label-3);
}
</style>
