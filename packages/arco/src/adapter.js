/**
 * Arco 适配器 — YwUiAdapter 的 Arco 实现。
 * message/confirm/alert 走 Arco 服务式 API；menu 用内置实现（--yw token 视觉与 WebOS 一致）。
 */
import { Message, Modal } from '@arco-design/web-vue';
import { builtinAdapter } from '@yudream/yudream-webos-vue';
function confirm(options) {
    return new Promise((resolve) => {
        Modal.confirm({
            title: options.title,
            content: options.content ?? '',
            okText: options.okText ?? '确定',
            cancelText: options.cancelText ?? '取消',
            hideCancel: false,
            onOk: () => resolve(true),
            onCancel: () => resolve(false),
            onClose: () => resolve(false),
        });
    });
}
function alert(options) {
    return new Promise((resolve) => {
        Modal.info({
            title: options.title,
            content: options.content ?? '',
            okText: options.okText ?? '确定',
            hideCancel: true,
            onOk: () => resolve(),
            onClose: () => resolve(),
        });
    });
}
export const arcoAdapter = {
    name: 'arco',
    menu: options => builtinAdapter.menu(options),
    confirm,
    alert,
    message: (type, content) => Message[type]?.(content),
};
export default arcoAdapter;
