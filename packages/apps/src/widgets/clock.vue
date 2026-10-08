<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

/** 时钟小组件：标题栏 + 大号时间 + 日期块（秒级刷新） */
const now = ref(new Date())
let timer: ReturnType<typeof setInterval> | null = null

const time = computed(() => {
  const p = (n: number) => String(n).padStart(2, '0')
  return `${p(now.value.getHours())}:${p(now.value.getMinutes())}:${p(now.value.getSeconds())}`
})

const dateLines = computed(() => {
  const d = now.value
  const week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][d.getDay()]
  return { main: `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`, week }
})

onMounted(() => {
  timer = setInterval(() => {
    now.value = new Date()
  }, 1000)
})

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<template>
  <div class="yw-clock">
    <header class="yw-widget-head">
      <i class="yw-widget-head-icon i-lucide-clock" />
      <span class="yw-widget-head-title">本地时间</span>
      <i class="yw-widget-dot" />
    </header>
    <div class="yw-clock-body">
      <span class="yw-clock-time">{{ time }}</span>
      <span class="yw-clock-date">
        <b>{{ dateLines.main }}</b>
        <em>{{ dateLines.week }}</em>
      </span>
    </div>
  </div>
</template>

<style scoped>
.yw-clock {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.yw-clock-body {
  display: flex;
  flex: 1;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
}

.yw-clock-time {
  font-size: 34px;
  font-weight: 200;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  color: var(--yw-foreground);
  letter-spacing: 0.02em;
}

.yw-clock-date {
  display: flex;
  flex-direction: column;
  gap: 2px;
  text-align: right;
}

.yw-clock-date b {
  font-size: 12px;
  font-weight: 500;
  color: var(--yw-foreground);
}

.yw-clock-date em {
  font-size: 12px;
  font-style: normal;
  color: var(--yw-label-2);
}
</style>
