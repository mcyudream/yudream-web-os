<script setup lang="ts">
import { useVFS } from '@yudream/yudream-webos-vue'
import { computed, ref } from 'vue'

/**
 * 终端：内置命令（help/ls/cd/cat/echo/open/clear/pwd），直接操作 VFS，命令注册表可扩展。
 */
const props = defineProps<{
  win?: { id: string }
}>()

const { vfs } = useVFS()

export interface TerminalCommand {
  name: string
  help: string
  run: (args: string[], ctx: { cwd: { value: string }, print: (s: string, type?: 'out' | 'err') => void }) => void | Promise<void>
}

const commands = ref<Map<string, TerminalCommand>>(new Map())

const cwd = ref('/')
const lines = ref<Array<{ type: 'in' | 'out' | 'err', text: string }>>([
  { type: 'out', text: 'YudreamWebOS 终端 — 输入 help 查看可用命令' },
])
const input = ref('')

const prompt = computed(() => `${cwd.value} $`)

function print(text: string, type: 'out' | 'err' = 'out') {
  lines.value.push({ type, text })
}

function register(cmd: TerminalCommand) {
  commands.value.set(cmd.name, cmd)
}

register({
  name: 'help',
  help: '列出可用命令',
  run: (_args, { print: p }) => {
    p([...commands.value.values()].map(c => `  ${c.name.padEnd(8)} ${c.help}`).join('\n'))
  },
})
register({ name: 'pwd', help: '当前目录', run: (_a, { cwd: c, print: p }) => p(c.value) })
register({
  name: 'ls',
  help: '列出目录内容',
  run: async (args, { cwd: c, print: p }) => {
    const target = args[0] ? `${c.value}/${args[0]}` : c.value
    const nodes = await vfs.readdir(target)
    p(nodes.map(n => `${n.kind === 'directory' ? 'd' : '-'}  ${n.name}`).join('\n') || '(空)')
  },
})
register({
  name: 'cd',
  help: '切换目录',
  run: async (args, { cwd: c }) => {
    const next = args[0] ?? '/'
    const target = next.startsWith('/') ? next : `${c.value}/${next}`
    await vfs.stat(target)
    c.value = target
  },
})
register({
  name: 'cat',
  help: '查看文件内容',
  run: async (args, { cwd: c, print: p }) => {
    if (!args[0]) {
      p('用法: cat <file>', 'err')

      return
    }
    p(String(await vfs.read(`${c.value}/${args[0]}`)))
  },
})
register({
  name: 'echo',
  help: '输出文本（echo hi > file.txt 写文件）',
  run: async (args, { cwd: c, print: p }) => {
    const gt = args.indexOf('>')
    if (gt > -1 && args[gt + 1]) {
      const file = `${c.value}/${args[gt + 1]}`
      await vfs.write(file, args.slice(0, gt).join(' '))

      p(`已写入 ${file}`)
    }
    else {
      p(args.join(' '))
    }
  },
})
register({
  name: 'open',
  help: '打开应用（open <appId>）',
  run: (args, { print: p }) => {
    void props
    if (!args[0]) {
      p('用法: open <appId>', 'err')

      return
    }
    window.dispatchEvent(new CustomEvent('webos:terminal:open', { detail: { appId: args[0] } }))

    p(`已请求打开 ${args[0]}`)
  },
})
register({
  name: 'clear',
  help: '清屏',
  run: (_a, { print: p }) => {
    lines.value = []
    p('')
  },
})

async function run() {
  const cmdline = input.value.trim()
  if (!cmdline) {
    return
  }
  lines.value.push({ type: 'in', text: `${prompt.value} ${cmdline}` })
  input.value = ''
  const [name, ...args] = cmdline.split(/\s+/)
  const cmd = commands.value.get(name!)
  if (!cmd) {
    print(`命令不存在：${name}（输入 help 查看可用命令）`, 'err')
    return
  }
  try {
    await cmd.run(args, { cwd, print })
  }
  catch (e) {
    print(String((e as Error).message ?? e), 'err')
  }
}

const rootEl = ref<HTMLElement | null>(null)
function focusInput() {
  rootEl.value?.querySelector('input')?.focus()
}
</script>

<template>
  <div ref="rootEl" class="yw-terminal" @click="focusInput">
    <div class="yw-terminal-lines">
      <p v-for="(line, i) in lines" :key="i" :class="`is-${line.type}`">
        {{ line.text }}
      </p>
      <div class="yw-terminal-input-row">
        <span class="yw-terminal-prompt">{{ prompt }}</span>
        <input v-model="input" class="yw-terminal-input" spellcheck="false" @keydown.enter="run">
      </div>
    </div>
  </div>
</template>

<style scoped>
.yw-terminal {
  height: 100%;
  padding: 10px 12px;
  overflow-y: auto;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 12.5px;
  line-height: 1.55;
  color: #e5e7eb;
  background: #0d1117;
}

.yw-terminal-lines {
  word-break: break-all;
  white-space: pre-wrap;
}

.yw-terminal-lines p.is-in {
  color: #7ee787;
}

.yw-terminal-lines p.is-err {
  color: #ff7b72;
}

.yw-terminal-input-row {
  display: flex;
  gap: 8px;
}

.yw-terminal-prompt {
  flex-shrink: 0;
  color: #79c0ff;
}

.yw-terminal-input {
  flex: 1;
  font: inherit;
  color: inherit;
  outline: none;
  background: transparent;
  border: none;
}
</style>
