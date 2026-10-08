<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

/** 系统监视小组件：CPU/内存/运行时长（数据源为浏览器可得信息，adapter 可换） */
const cpuLoad = ref(0.27)
const memUsed = ref(3.1)
const memTotal = ref(11.6)
const uptime = ref(11 * 86400 + 8 * 3600)

let timer: ReturnType<typeof setInterval> | null = null

/** 运行时长格式化：X 天 X 小时 */
const uptimeText = computed(() => {
  const days = Math.floor(uptime.value / 86400)
  const hours = Math.floor((uptime.value % 86400) / 3600)
  return `${days} 天 ${hours} 小时`
})

/** 模拟波动（真实数据源由宿主 adapter 注入） */
onMounted(() => {
  timer = setInterval(() => {
    cpuLoad.value = Math.min(0.95, Math.max(0.05, cpuLoad.value + (Math.random() - 0.5) * 0.08))
    memUsed.value = Math.min(memTotal.value, Math.max(1, memUsed.value + (Math.random() - 0.5) * 0.3))
    uptime.value += 5
  }, 2000)
})

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer)
  }
})

const memPct = computed(() => Math.round((memUsed.value / memTotal.value) * 100))
const cpuPct = computed(() => Math.round(cpuLoad.value * 100))
</script>

<template>
  <div class="yw-monitor">
    <header class="yw-widget-head">
      <i class="yw-widget-head-icon i-lucide-activity" />
      <span class="yw-widget-head-title">系统监视</span>
      <i class="yw-widget-dot" />
    </header>

    <div class="yw-monitor-row">
      <span class="yw-monitor-label"><i class="i-lucide-cpu" /> CPU</span>
      <b class="yw-monitor-value">{{ cpuPct }}%</b>
      <span class="yw-monitor-bar"><i :style="{ width: `${cpuPct}%` }" /></span>
    </div>
    <div class="yw-monitor-row">
      <span class="yw-monitor-label"><i class="i-lucide-memory-stick" /> 内存</span>
      <b class="yw-monitor-value">{{ memUsed.toFixed(1) }} GB</b>
      <span class="yw-monitor-bar"><i :style="{ width: `${memPct}%` }" /></span>
    </div>
    <div class="yw-monitor-row">
      <span class="yw-monitor-label"><i class="i-lucide-timer" /> 运行时长</span>
      <b class="yw-monitor-value sm">{{ uptimeText }}</b>
    </div>
  </div>
</template>

<style scoped>
.yw-monitor {
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
}

.yw-monitor-row {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.yw-monitor-label {
  display: flex;
  gap: 5px;
  align-items: center;
  font-size: 11px;
  color: var(--yw-label-2);
}

.yw-monitor-label i {
  font-size: 12px;
}

.yw-monitor-value {
  font-size: 15px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--yw-foreground);
}

.yw-monitor-value.sm {
  font-size: 13px;
}

.yw-monitor-bar {
  display: block;
  height: 3px;
  overflow: hidden;
  background: var(--yw-label-4);
  border-radius: 999px;
}

.yw-monitor-bar i {
  display: block;
  height: 100%;
  background: oklch(var(--yw-primary));
  border-radius: 999px;
  transition: width 0.5s ease;
}
</style>
