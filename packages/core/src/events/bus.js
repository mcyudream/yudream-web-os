export function createEventBus() {
    const handlers = new Map();
    function on(event, handler) {
        let set = handlers.get(event);
        if (!set) {
            set = new Set();
            handlers.set(event, set);
        }
        set.add(handler);
        return () => off(event, handler);
    }
    function once(event, handler) {
        const wrap = (p) => {
            off(event, wrap);
            handler(p);
        };
        return on(event, wrap);
    }
    function off(event, handler) {
        handlers.get(event)?.delete(handler);
    }
    function emit(event, payload) {
        handlers.get(event)?.forEach(h => h(payload));
    }
    function clear() {
        handlers.clear();
    }
    return { on, once, off, emit, clear };
}
