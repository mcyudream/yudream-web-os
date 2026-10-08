<script setup lang="ts">
import { computed, ref } from 'vue'

/** 日历小组件：真实月历网格，今日高亮 */
const now = new Date()
const year = now.getFullYear()
const month = now.getMonth()
const today = now.getDate()

/** 当月第一天是星期几（0=周日） */
const firstDay = new Date(year, month, 1).getDay()
/** 当月天数 */
const daysInMonth = new Date(year, month + 1, 0).getDate()

interface Cell { day: number | null }
const cells = computed<Cell[]>(() => {
  const out: Cell[] = []
  for (let i = 0; i < firstDay; i++) {
    out.push({ day: null })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    out.push({ day: d })
  }
  return out
})

const WEEK = ['日', '一', '二', '三', '四', '五', '六']
const selected = ref(today)
</script>

<template>
  <div class="yw-calendar">
    <header class="yw-widget-head">
      <i class="yw-widget-head-icon i-lucide-calendar-days" />
      <span class="yw-widget-head-title">{{ year }}年{{ month + 1 }}月</span>
      <i class="yw-widget-dot" />
    </header>
    <div class="yw-calendar-grid">
      <span v-for="w in WEEK" :key="w" class="yw-calendar-week">{{ w }}</span>
      <span
        v-for="(cell, i) in cells"
        :key="i"
        class="yw-calendar-day"
        :class="{ 'is-today': cell.day === today, 'is-empty': !cell.day }"
        @click="cell.day && (selected = cell.day)"
      >
        {{ cell.day ?? '' }}
      </span>
    </div>
    <footer class="yw-calendar-foot">
      今天 {{ today }} 日 · {{ WEEK[now.getDay()] }}
      <span class="yw-calendar-selected">选中 {{ selected || '—' }}</span>
    </footer>
  </div>
</template>

<style scoped>
.yw-calendar {
  display: flex;
  flex-direction: column;
  gap: 6px;
  height: 100%;
}

.yw-calendar-grid {
  display: grid;
  flex: 1;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  align-content: start;
}

.yw-calendar-week {
  font-size: 10px;
  font-weight: 600;
  color: var(--yw-label-2);
  text-align: center;
}

.yw-calendar-day {
  display: grid;
  place-items: center;
  height: 20px;
  font-size: 11px;
  color: var(--yw-foreground);
  border-radius: 5px;
}

.yw-calendar-day.is-today {
  font-weight: 600;
  color: #fff;
  background: oklch(var(--yw-primary));
}

.yw-calendar-foot {
  padding-top: 6px;
  font-size: 11px;
  color: var(--yw-label-2);
  border-top: 0.5px solid var(--yw-separator);
}

.yw-calendar-selected {
  float: right;
}
</style>
