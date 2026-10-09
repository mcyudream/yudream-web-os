import { useVFS } from '@yudream/yudream-webos-vue';
import { computed, ref } from 'vue';
const props = defineProps();
const { vfs } = useVFS();
const commands = ref(new Map());
const cwd = ref('/');
const lines = ref([
    { type: 'out', text: 'YudreamWebOS 终端 — 输入 help 查看可用命令' },
]);
const input = ref('');
const prompt = computed(() => `${cwd.value} $`);
function print(text, type = 'out') {
    lines.value.push({ type, text });
}
function register(cmd) {
    commands.value.set(cmd.name, cmd);
}
register({
    name: 'help',
    help: '列出可用命令',
    run: (_args, { print: p }) => {
        p([...commands.value.values()].map(c => `  ${c.name.padEnd(8)} ${c.help}`).join('\n'));
    },
});
register({ name: 'pwd', help: '当前目录', run: (_a, { cwd: c, print: p }) => p(c.value) });
register({
    name: 'ls',
    help: '列出目录内容',
    run: async (args, { cwd: c, print: p }) => {
        const target = args[0] ? `${c.value}/${args[0]}` : c.value;
        const nodes = await vfs.readdir(target);
        p(nodes.map(n => `${n.kind === 'directory' ? 'd' : '-'}  ${n.name}`).join('\n') || '(空)');
    },
});
register({
    name: 'cd',
    help: '切换目录',
    run: async (args, { cwd: c }) => {
        const next = args[0] ?? '/';
        const target = next.startsWith('/') ? next : `${c.value}/${next}`;
        await vfs.stat(target);
        c.value = target;
    },
});
register({
    name: 'cat',
    help: '查看文件内容',
    run: async (args, { cwd: c, print: p }) => {
        if (!args[0]) {
            p('用法: cat <file>', 'err');
            return;
        }
        p(String(await vfs.read(`${c.value}/${args[0]}`)));
    },
});
register({
    name: 'echo',
    help: '输出文本（echo hi > file.txt 写文件）',
    run: async (args, { cwd: c, print: p }) => {
        const gt = args.indexOf('>');
        if (gt > -1 && args[gt + 1]) {
            const file = `${c.value}/${args[gt + 1]}`;
            await vfs.write(file, args.slice(0, gt).join(' '));
            p(`已写入 ${file}`);
        }
        else {
            p(args.join(' '));
        }
    },
});
register({
    name: 'open',
    help: '打开应用（open <appId>）',
    run: (args, { print: p }) => {
        void props;
        if (!args[0]) {
            p('用法: open <appId>', 'err');
            return;
        }
        window.dispatchEvent(new CustomEvent('webos:terminal:open', { detail: { appId: args[0] } }));
        p(`已请求打开 ${args[0]}`);
    },
});
register({
    name: 'clear',
    help: '清屏',
    run: (_a, { print: p }) => {
        lines.value = [];
        p('');
    },
});
async function run() {
    const cmdline = input.value.trim();
    if (!cmdline) {
        return;
    }
    lines.value.push({ type: 'in', text: `${prompt.value} ${cmdline}` });
    input.value = '';
    const [name, ...args] = cmdline.split(/\s+/);
    const cmd = commands.value.get(name);
    if (!cmd) {
        print(`命令不存在：${name}（输入 help 查看可用命令）`, 'err');
        return;
    }
    try {
        await cmd.run(args, { cwd, print });
    }
    catch (e) {
        print(String(e.message ?? e), 'err');
    }
}
const rootEl = ref(null);
function focusInput() {
    rootEl.value?.querySelector('input')?.focus();
}
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
void __VLS_ctx, __VLS_components, __VLS_intrinsics, __VLS_directives;
void {};
/** @type {__VLS_StyleScopedClasses['yw-terminal-lines']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-terminal-lines']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ onClick: (focusInput) },
    ref: "rootEl",
    ...{ class: "yw-terminal" },
});
/** @type {__VLS_StyleScopedClasses['yw-terminal']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "yw-terminal-lines" },
});
/** @type {__VLS_StyleScopedClasses['yw-terminal-lines']} */ ;
const __VLS_0 = __VLS_tryAsConstant((__VLS_unwrap(lines, {})));
for (const [line, i] of __VLS_vFor(__VLS_nonNull(__VLS_0))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        key: (i),
        ...{ class: (`is-${line.type}`) },
    });
    (line.text);
    // @ts-ignore
    [lines,];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "yw-terminal-input-row" },
});
/** @type {__VLS_StyleScopedClasses['yw-terminal-input-row']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "yw-terminal-prompt" },
});
/** @type {__VLS_StyleScopedClasses['yw-terminal-prompt']} */ ;
(__VLS_unwrap(prompt, {}));
__VLS_asFunctionalElement1(__VLS_intrinsics.input, __VLS_intrinsics.input)({
    ...{ onKeydown: (run) },
    ...{ class: "yw-terminal-input" },
    spellcheck: "false",
});
(__VLS_unwrap(input, {}));
/** @type {__VLS_StyleScopedClasses['yw-terminal-input']} */ ;
// @ts-ignore
[prompt, input,];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
import { defineProps, } from 'vue';
