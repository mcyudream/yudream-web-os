import { computed, ref } from 'vue';
const todos = ref([
    { id: 1, text: '体验窗口拖拽与八向缩放', done: false },
    { id: 2, text: '双击访达打开文件（fileHandlers 路由）', done: false },
    { id: 3, text: 'F4 打开启动台、Ctrl+K 快速搜索', done: true },
]);
const newText = ref('');
let seq = 4;
const remaining = computed(() => todos.value.filter(t => !t.done).length);
function add() {
    const text = newText.value.trim();
    if (!text) {
        return;
    }
    todos.value.push({ id: seq++, text, done: false });
    newText.value = '';
}
function toggle(todo) {
    todo.done = !todo.done;
}
function remove(todo) {
    todos.value = todos.value.filter(t => t.id !== todo.id);
}
const __VLS_ctx = {};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
void __VLS_ctx, __VLS_components, __VLS_intrinsics, __VLS_directives;
// @ts-ignore
__VLS_withDotValue(todos, {});
void {};
/** @type {__VLS_StyleScopedClasses['yw-todo-form']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-todo-form']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-todo-list']} */ ;
/** @type {__VLS_StyleScopedClasses['yw-todo-list']} */ ;
/** @type {__VLS_StyleScopedClasses['text']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "yw-todo" },
});
/** @type {__VLS_StyleScopedClasses['yw-todo']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.form, __VLS_intrinsics.form)({
    ...{ onSubmit: (add) },
    ...{ class: "yw-todo-form" },
});
/** @type {__VLS_StyleScopedClasses['yw-todo-form']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.input)({
    placeholder: "添加待办，回车确认…",
});
(__VLS_unwrap(newText, {}));
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    type: "submit",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.ul, __VLS_intrinsics.ul)({
    ...{ class: "yw-todo-list" },
});
/** @type {__VLS_StyleScopedClasses['yw-todo-list']} */ ;
const __VLS_0 = __VLS_tryAsConstant((todos.value));
for (const [todo] of __VLS_vFor(__VLS_nonNull(__VLS_0))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.li, __VLS_intrinsics.li)({
        key: (todo.id),
        ...{ class: ({ 'is-done': todo.done }) },
    });
    /** @type {__VLS_StyleScopedClasses['is-done']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: // @ts-ignore
            (...[$event]) => {
                void $event;
                return (toggle(todo));
                // @ts-ignore
                [newText, todos,];
            } },
        ...{ class: "check" },
    });
    /** @type {__VLS_StyleScopedClasses['check']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.i)({
        ...{ class: (todo.done ? 'i-lucide-check-circle-2' : 'i-lucide-circle') },
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "text" },
    });
    /** @type {__VLS_StyleScopedClasses['text']} */ ;
    (todo.text);
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: // @ts-ignore
            (...[$event]) => {
                void $event;
                return (remove(todo));
                // @ts-ignore
                [];
            } },
        ...{ class: "del" },
    });
    /** @type {__VLS_StyleScopedClasses['del']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.i)({
        ...{ class: "i-lucide-x" },
    });
    /** @type {__VLS_StyleScopedClasses['i-lucide-x']} */ ;
    // @ts-ignore
    [];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.footer, __VLS_intrinsics.footer)({
    ...{ class: "yw-todo-footer" },
});
/** @type {__VLS_StyleScopedClasses['yw-todo-footer']} */ ;
(__VLS_unwrap(remaining, {}));
(todos.value.length);
// @ts-ignore
[todos, remaining,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
