<script setup lang="ts">
import { useVFS, useWebOS } from '@yudream/yudream-webos-vue'
import { computed, ref, watch } from 'vue'

/** 文本编辑器：注册 .txt/.md fileHandler；launchOptions.files 打开，保存写回 VFS */
const props = defineProps<{
  win?: { id: string, launchOptions?: Record<string, unknown> }
}>()

const { vfs } = useVFS()
const { ui } = useWebOS()

const filePath = computed<string>(() => {
  const files = props.win?.launchOptions?.files as string[] | undefined
  return files?.[0] ?? ''
})

const content = ref('')
const dirty = ref(false)
const loadedFrom = ref('')

async function load() {
  if (filePath.value) {
    try {
      content.value = String(await vfs.read(filePath.value))
      loadedFrom.value = filePath.value
    }
    catch {
      content.value = ''
    }
  }
}
void load
void watch
watch(filePath, () => void load(), { immediate: true })

async function save() {
  const path = loadedFrom.value || `/Documents/未命名-${Date.now()}.txt`
  await vfs.write(path, content.value)
  loadedFrom.value = path
  dirty.value = false
  ui.message('success', `已保存 ${path}`)
}

function onInput() {
  dirty.value = true
}
</script>

<template>
  <div class="yw-editor">
    <header class="yw-editor-bar">
      <span class="yw-editor-path">{{ loadedFrom || '未命名' }}</span>
      <button class="yw-editor-save" :class="{ 'is-dirty': dirty }" @click="save">
        {{ dirty ? '保存 •' : '保存' }}
      </button>
    </header>
    <textarea
      v-model="content"
      class="yw-editor-text"
      spellcheck="false"
      placeholder="在此输入…"
      @input="onInput"
      @keydown.meta.s.prevent="save"
      @keydown.ctrl.s.prevent="save"
    />
  </div>
</template>

<style scoped>
.yw-editor {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--yw-window-bg);
}

.yw-editor-bar {
  display: flex;
  flex-shrink: 0;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
  height: 36px;
  padding: 0 12px;
  border-bottom: 1px solid var(--yw-separator);
}

.yw-editor-path {
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 12px;
  color: var(--yw-label-2);
  white-space: nowrap;
}

.yw-editor-save {
  flex-shrink: 0;
  padding: 4px 14px;
  font-size: 12px;
  color: oklch(var(--yw-foreground));
  cursor: default;
  background: var(--yw-label-4);
  border: none;
  border-radius: 7px;
}

.yw-editor-save.is-dirty {
  color: #fff;
  background: oklch(var(--yw-primary));
}

.yw-editor-text {
  flex: 1;
  padding: 14px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 13px;
  line-height: 1.6;
  color: oklch(var(--yw-foreground));
  resize: none;
  outline: none;
  background: transparent;
  border: none;
}
</style>
