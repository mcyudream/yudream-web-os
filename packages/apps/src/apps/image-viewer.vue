<script setup lang="ts">
import { useVFS, useWebOS } from '@yudream/yudream-webos-vue'
import { computed, ref } from 'vue'

/** 图片查看器：fileHandlers 图片类型；launchOptions.files 打开 */
const props = defineProps<{
  win?: { id: string, launchOptions?: Record<string, unknown> }
}>()

const { vfs } = useVFS()
const { openUrl } = useWebOS()

const dataUrl = ref('')
const path = computed(() => {
  const files = props.win?.launchOptions?.files as string[] | undefined
  return files?.[0] ?? ''
})

void (async () => {
  if (path.value) {
    const data = await vfs.read(path.value)
    dataUrl.value = typeof data === 'string' ? `data:image;base64,${btoa(data)}` : ''
  }
})()
</script>

<template>
  <div class="yw-image-viewer">
    <img v-if="dataUrl" :src="dataUrl" :alt="path">
    <div v-else class="yw-image-viewer-empty">
      <i class="i-lucide-image" />
      <p>图片查看器</p>
      <p class="sub">
        从访达双击图片打开，或
        <button @click="openUrl('https://picsum.photos', 'browser')">
          浏览示例图库
        </button>
      </p>
    </div>
  </div>
</template>

<style scoped>
.yw-image-viewer {
  display: grid;
  place-items: center;
  height: 100%;
  overflow: hidden;
  background: var(--yw-window-bg);
}

.yw-image-viewer img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.yw-image-viewer-empty {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  font-size: 13px;
  color: var(--yw-label-2);
}

.yw-image-viewer-empty i {
  font-size: 44px;
  opacity: 0.4;
}

.yw-image-viewer-empty button {
  color: oklch(var(--yw-primary));
  text-decoration: underline;
  cursor: default;
  background: transparent;
  border: none;
}
</style>
