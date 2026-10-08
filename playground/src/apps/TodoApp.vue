<script setup lang="ts">
import { computed, ref } from 'vue'

/** 待办清单 —— 宿主自定义应用最小示例（30 行注册，见 App.vue） */
interface Todo {
  id: number
  text: string
  done: boolean
}

const todos = ref<Todo[]>([
  { id: 1, text: '体验窗口拖拽与八向缩放', done: false },
  { id: 2, text: '双击访达打开文件（fileHandlers 路由）', done: false },
  { id: 3, text: 'F4 打开启动台、Ctrl+K 快速搜索', done: true },
])

const newText = ref('')
let seq = 4

const remaining = computed(() => todos.value.filter(t => !t.done).length)

function add() {
  const text = newText.value.trim()
  if (!text) {
    return
  }
  todos.value.push({ id: seq++, text, done: false })
  newText.value = ''
}

function toggle(todo: Todo) {
  todo.done = !todo.done
}

function remove(todo: Todo) {
  todos.value = todos.value.filter(t => t.id !== todo.id)
}
</script>

<template>
  <div class="yw-todo">
    <form class="yw-todo-form" @submit.prevent="add">
      <input v-model="newText" placeholder="添加待办，回车确认…">
      <button type="submit">
        添加
      </button>
    </form>
    <ul class="yw-todo-list">
      <li v-for="todo in todos" :key="todo.id" :class="{ 'is-done': todo.done }">
        <button class="check" @click="toggle(todo)">
          <i :class="todo.done ? 'i-lucide-check-circle-2' : 'i-lucide-circle'" />
        </button>
        <span class="text">{{ todo.text }}</span>
        <button class="del" @click="remove(todo)">
          <i class="i-lucide-x" />
        </button>
      </li>
    </ul>
    <footer class="yw-todo-footer">
      剩余 {{ remaining }} 项 · 共 {{ todos.length }} 项
    </footer>
  </div>
</template>

<style scoped>
.yw-todo {
  display: flex;
  flex-direction: column;
  height: 100%;
  font-size: 13px;
  color: oklch(var(--yw-foreground));
  background: var(--yw-window-bg);
}

.yw-todo-form {
  display: flex;
  flex-shrink: 0;
  gap: 8px;
  padding: 12px;
}

.yw-todo-form input {
  flex: 1;
  height: 30px;
  padding: 0 12px;
  color: oklch(var(--yw-foreground));
  outline: none;
  background: rgb(120 120 128 / 14%);
  border: none;
  border-radius: 7px;
}

.yw-todo-form button {
  padding: 0 16px;
  font-size: 12px;
  color: #fff;
  cursor: default;
  background: oklch(var(--yw-primary));
  border: none;
  border-radius: 7px;
}

.yw-todo-list {
  flex: 1;
  padding: 0 12px;
  margin: 0;
  overflow-y: auto;
  list-style: none;
}

.yw-todo-list li {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 7px 4px;
  border-bottom: 0.5px solid var(--yw-separator);
}

.yw-todo-list li.is-done .text {
  color: var(--yw-label-3);
  text-decoration: line-through;
}

.check,
.del {
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  font-size: 15px;
  color: var(--yw-label-2);
  cursor: default;
  background: transparent;
  border: none;
}

.text {
  flex: 1;
}

.yw-todo-footer {
  flex-shrink: 0;
  padding: 8px 12px;
  font-size: 11px;
  color: var(--yw-label-2);
  border-top: 1px solid var(--yw-separator);
}
</style>
