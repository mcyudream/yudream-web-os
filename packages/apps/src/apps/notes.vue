<script setup lang="ts">
import { useVFS } from '@yudream/yudream-webos-vue'
import { onMounted, ref } from 'vue'

/** 备忘录：多便签列表，数据存 VFS /Documents/notes */
const { vfs } = useVFS()

interface Note {
  path: string
  title: string
  content: string
}

const notes = ref<Note[]>([])
const activePath = ref('')
const draft = ref('')

async function loadAll() {
  await vfs.mkdir('/Documents/notes').catch(() => {})
  const nodes = await vfs.readdir('/Documents/notes')
  const list: Note[] = []
  for (const n of nodes) {
    const content = String(await vfs.read(n.path))
    list.push({ path: n.path, title: n.name.replace(/\.txt$/, ''), content })
  }
  notes.value = list
  if (!activePath.value && list[0]) {
    select(list[0].path)
  }
}

function select(path: string) {
  activePath.value = path
  draft.value = notes.value.find(n => n.path === path)?.content ?? ''
}

async function create() {
  const path = `/Documents/notes/便签-${Date.now()}.txt`
  await vfs.write(path, '')
  await loadAll()
  select(path)
}

async function save() {
  if (activePath.value) {
    await vfs.write(activePath.value, draft.value)
  }
}

async function remove() {
  if (activePath.value) {
    await vfs.remove(activePath.value)
    activePath.value = ''
    draft.value = ''
    await loadAll()
  }
}

onMounted(() => void loadAll())
</script>

<template>
  <div class="yw-notes">
    <aside class="yw-notes-list">
      <button class="yw-notes-new" @click="create">
        <i class="i-lucide-plus" />
        新建便签
      </button>
      <button
        v-for="note in notes"
        :key="note.path"
        class="yw-notes-item"
        :class="{ 'is-active': note.path === activePath }"
        @click="select(note.path)"
      >
        {{ note.title }}
      </button>
    </aside>
    <div class="yw-notes-editor">
      <textarea v-model="draft" spellcheck="false" placeholder="记录点什么…" />
      <footer class="yw-notes-actions">
        <button :disabled="!activePath" @click="remove">
          删除
        </button>
        <button class="is-primary" :disabled="!activePath" @click="save">
          保存
        </button>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.yw-notes {
  display: flex;
  height: 100%;
  background: var(--yw-window-bg);
}

.yw-notes-list {
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  gap: 2px;
  width: 170px;
  padding: 8px;
  overflow-y: auto;
  background: oklch(var(--yw-popover) / 45%);
  border-right: 1px solid var(--yw-separator);
}

.yw-notes-new {
  display: flex;
  gap: 6px;
  align-items: center;
  height: 30px;
  padding: 0 10px;
  margin-bottom: 6px;
  font-size: 12px;
  color: oklch(var(--yw-primary));
  cursor: default;
  background: transparent;
  border: 1px dashed oklch(var(--yw-primary) / 40%);
  border-radius: 7px;
}

.yw-notes-item {
  height: 28px;
  padding: 0 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 12px;
  color: oklch(var(--yw-foreground));
  text-align: left;
  white-space: nowrap;
  cursor: default;
  background: transparent;
  border: none;
  border-radius: 6px;
}

.yw-notes-item:hover {
  background: var(--yw-label-4);
}

.yw-notes-item.is-active {
  color: #fff;
  background: oklch(var(--yw-primary));
}

.yw-notes-editor {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.yw-notes-editor textarea {
  flex: 1;
  padding: 14px;
  font-size: 13px;
  line-height: 1.7;
  color: oklch(var(--yw-foreground));
  resize: none;
  outline: none;
  background: transparent;
  border: none;
}

.yw-notes-actions {
  display: flex;
  flex-shrink: 0;
  gap: 8px;
  justify-content: flex-end;
  padding: 10px 14px;
  border-top: 1px solid var(--yw-separator);
}

.yw-notes-actions button {
  padding: 5px 16px;
  font-size: 12px;
  color: oklch(var(--yw-foreground));
  cursor: default;
  background: var(--yw-label-4);
  border: none;
  border-radius: 7px;
}

.yw-notes-actions button.is-primary {
  color: #fff;
  background: oklch(var(--yw-primary));
}

.yw-notes-actions button:disabled {
  opacity: 0.4;
}
</style>
