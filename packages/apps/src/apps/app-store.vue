<script setup lang="ts">
import { useWebOS as useWebOSLocal } from '@yudream/yudream-webos-vue'

import { computed, ref } from 'vue'

/**
 * 应用商店：演示动态注册 —— 「安装」即运行时 registerApp，安装后出现在桌面/启动台。
 */
const { registry, openApp } = useStore()

interface StoreApp {
  id: string
  name: string
  icon: string
  iconBg: string
  subtitle: string
  size: string
}

const catalog = ref<StoreApp[]>([
  { id: 'todo-demo', name: '待办清单', icon: 'i-lucide-check-square', iconBg: 'linear-gradient(135deg,#62BA46,#3D8B2F)', subtitle: '极简待办', size: '1.2 MB' },
  { id: 'pomodoro-demo', name: '番茄钟', icon: 'i-lucide-timer', iconBg: 'linear-gradient(135deg,#F74F9E,#C2186B)', subtitle: '专注计时', size: '0.8 MB' },
  { id: 'dice-demo', name: '骰子', icon: 'i-lucide-dices', iconBg: 'linear-gradient(135deg,#A550A7,#6B2F8E)', subtitle: '随机决策', size: '0.3 MB' },
])

const installed = computed(() => new Set(catalog.value.filter(a => registry.get(a.id)).map(a => a.id)))

function install(app: StoreApp) {
  // 动态注册：AppDefinition 与宿主应用同通道
  registry.register({
    id: app.id,
    name: app.name,
    icon: app.icon,
    iconBg: app.iconBg,
    component: { template: `<div style="display:grid;place-items:center;height:100%;font-size:15px">${app.name} 已就绪</div>` },
    defaultSize: { width: 420, height: 320 },
    launchpad: { order: 60 },
  })
}

function useStore() {
  // 延迟取容器（应用在 Provider 内渲染）
  const { registry, openApp } = useWebOSLocal()
  return { registry, openApp }
}
</script>

<template>
  <div class="yw-appstore">
    <header class="yw-appstore-head">
      <h2>应用商店</h2>
      <p>「安装」= 运行时动态注册 AppDefinition —— 演示可扩展性</p>
    </header>
    <div class="yw-appstore-list">
      <div v-for="app in catalog" :key="app.id" class="yw-appstore-item">
        <span class="yw-appstore-icon" :style="{ background: app.iconBg }">
          <i :class="app.icon" />
        </span>
        <span class="yw-appstore-meta">
          <b>{{ app.name }}</b>
          <small>{{ app.subtitle }} · {{ app.size }}</small>
        </span>
        <button v-if="!installed.has(app.id)" class="yw-appstore-btn" @click="install(app)">
          安装
        </button>
        <button v-else class="yw-appstore-btn is-open" @click="openApp(app.id)">
          打开
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.yw-appstore {
  height: 100%;
  padding: 20px;
  overflow-y: auto;
  background: var(--yw-window-bg);
}

.yw-appstore-head h2 {
  margin: 0 0 4px;
  font-size: 22px;
  color: oklch(var(--yw-foreground));
}

.yw-appstore-head p {
  margin: 0 0 18px;
  font-size: 12px;
  color: var(--yw-label-2);
}

.yw-appstore-item {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 12px;
  margin-bottom: 8px;
  background: var(--yw-control-bg);
  border-radius: var(--yw-radius-md);
  box-shadow: 0 0 0 0.5px var(--yw-separator);
}

.yw-appstore-icon {
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: 46px;
  height: 46px;
  border-radius: 22.37%;
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 35%);
}

.yw-appstore-icon i {
  font-size: 24px;
  color: #fff;
}

.yw-appstore-meta {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}

.yw-appstore-meta b {
  font-size: 13px;
  color: oklch(var(--yw-foreground));
}

.yw-appstore-meta small {
  font-size: 11px;
  color: var(--yw-label-2);
}

.yw-appstore-btn {
  flex-shrink: 0;
  padding: 5px 18px;
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  cursor: default;
  background: oklch(var(--yw-primary));
  border: none;
  border-radius: var(--yw-radius-capsule);
}

.yw-appstore-btn.is-open {
  color: oklch(var(--yw-primary));
  background: var(--yw-accent-selection);
}
</style>
