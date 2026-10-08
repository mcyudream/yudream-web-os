<script setup lang="ts">
import { ref } from 'vue'

/** 计算器：frameless 变体演示（小窗口无标题栏自绘） */
const display = ref('0')

function press(k: string) {
  if (k === 'C') {
    display.value = '0'
  }
  else if (k === '=') {
    try {
      // 受限表达式求值：仅数字与运算符
      if (!/^[\d+\-*/.() ]+$/.test(display.value)) {
        throw new Error('bad')
      }
      // eslint-disable-next-line no-new-func
      display.value = String(new Function(`return (${display.value})`)())
    }
    catch {
      display.value = '错误'
    }
  }
  else if (k === '±') {
    display.value = display.value.startsWith('-') ? display.value.slice(1) : `-${display.value}`
  }
  else {
    display.value = display.value === '0' || display.value === '错误' ? k : display.value + k
  }
}

const keys = [
  ['C', '±', '%', '÷'],
  ['7', '8', '9', '×'],
  ['4', '5', '6', '−'],
  ['1', '2', '3', '+'],
  ['0', '.', '='],
]
</script>

<template>
  <div class="yw-calculator">
    <div class="yw-calculator-display">
      {{ display }}
    </div>
    <div class="yw-calculator-keys">
      <template v-for="row in keys" :key="row.join()">
        <button
          v-for="k in row"
          :key="k"
          class="yw-calculator-key"
          :class="{ 'is-op': ['÷', '×', '−', '+', '='].includes(k), 'is-zero': k === '0' }"
          @click="press(k === '÷' ? '/' : k === '×' ? '*' : k === '−' ? '-' : k)"
        >
          {{ k }}
        </button>
      </template>
    </div>
  </div>
</template>

<style scoped>
.yw-calculator {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--yw-window-bg);
}

.yw-calculator-display {
  display: flex;
  flex-shrink: 0;
  align-items: flex-end;
  justify-content: flex-end;
  height: 72px;
  padding: 0 18px 8px;
  overflow: hidden;
  font-size: 40px;
  font-weight: 300;
  font-variant-numeric: tabular-nums;
  color: oklch(var(--yw-foreground));
}

.yw-calculator-keys {
  display: grid;
  flex: 1;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: var(--yw-separator);
}

.yw-calculator-key {
  font-size: 18px;
  color: oklch(var(--yw-foreground));
  cursor: default;
  background: oklch(var(--yw-card));
  border: none;
}

.yw-calculator-key:active {
  background: var(--yw-label-4);
}

.yw-calculator-key.is-op {
  color: #fff;
  background: oklch(var(--yw-primary));
}

.yw-calculator-key.is-zero {
  grid-column: span 2;
}
</style>
