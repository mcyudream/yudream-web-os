/** 生成 pointerdown 处理器；返回的 start 绑定到把手元素 */
export function usePointerDrag(options) {
    function start(ev) {
        if (ev.button !== 0) {
            return;
        }
        ev.preventDefault();
        ev.stopPropagation();
        const sx = ev.clientX;
        const sy = ev.clientY;
        let dx = 0;
        let dy = 0;
        const onMove = (e) => {
            dx = e.clientX - sx;
            dy = e.clientY - sy;
            options.onMove(dx, dy, e);
        };
        const onUp = (e) => {
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', onUp);
            options.onEnd?.(dx, dy, e);
        };
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
    }
    return { start };
}
/** 缩放处理器：根据方向调整矩形，min 尺寸约束 */
export function usePointerResize(options) {
    function start(ev) {
        if (ev.button !== 0) {
            return;
        }
        ev.preventDefault();
        ev.stopPropagation();
        document.body.style.userSelect = 'none';
        const { direction, rect: r0 } = options;
        const minW = options.minWidth ?? 240;
        const minH = options.minHeight ?? 160;
        const sx = ev.clientX;
        const sy = ev.clientY;
        let last = { ...r0 };
        const onMove = (e) => {
            const dx = e.clientX - sx;
            const dy = e.clientY - sy;
            let { x, y, width, height } = r0;
            if (direction.includes('e')) {
                width = Math.max(minW, r0.width + dx);
            }
            if (direction.includes('s')) {
                height = Math.max(minH, r0.height + dy);
            }
            if (direction.includes('w')) {
                width = Math.max(minW, r0.width - dx);
                x = r0.x + (r0.width - width);
            }
            if (direction.includes('n')) {
                height = Math.max(minH, r0.height - dy);
                y = r0.y + (r0.height - height);
            }
            last = { x, y, width, height };
            options.onResize(last, e);
        };
        const onUp = (e) => {
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', onUp);
            document.body.style.userSelect = '';
            options.onEnd?.(last, e);
        };
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
    }
    return { start };
}
/** 视口尺寸跟踪（窗口管理机依赖） */
export function useViewport(target) {
    function sync() {
        target?.value?.valueOf();
        return { width: window.innerWidth, height: window.innerHeight };
    }
    return { sync };
}
