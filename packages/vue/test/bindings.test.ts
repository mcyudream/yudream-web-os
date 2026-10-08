import { describe, expect, it } from 'vitest'
import { createWebOSInstance, shortcuts, uiRegistry } from '../src/index'

function makeInstance() {
  return createWebOSInstance({
    apps: [
      {
        id: 'demo',
        name: '演示',
        icon: 'i-lucide-app-window',
        component: { template: '<div/>' },
        singleton: true,
        defaultSize: { width: 720, height: 520 },
        fileHandlers: ['txt'],
      },
    ],
    persist: { adapter: 'memory' },
  })
}

describe('createWebOSInstance', () => {
  it('装配全部服务', () => {
    const os = makeInstance()
    expect(os.registry.get('demo')).toBeDefined()
    expect(os.appComponents.get('demo')).toBeDefined()
    expect(os.wm).toBeDefined()
    expect(os.desktop).toBeDefined()
    expect(os.dock).toBeDefined()
    expect(os.widgets).toBeDefined()
    expect(os.vfs).toBeDefined()
    expect(os.persist).toBeDefined()
    expect(os.ui.name).toBe('builtin')
  })

  it('openApp：单例开窗 + launch 事件', () => {
    const os = makeInstance()
    const events: string[] = []
    os.bus.on('webos:app:launch', ({ appId }) => events.push(appId))
    os.openApp('demo')
    os.openApp('demo')
    expect(os.wm.windowsOfApp('demo')).toHaveLength(1)
    expect(events).toEqual(['demo', 'demo'])
  })

  it('openApp 不存在的应用走 ui.message', () => {
    const os = makeInstance()
    const toasts: string[] = []
    os.ui.message = (type, content) => toasts.push(`${type}:${content}`)
    os.openApp('ghost')
    expect(toasts).toEqual(['error:应用不存在：ghost'])
  })

  it('openUrl external → window.open；browser → 开浏览器窗口', () => {
    const os = makeInstance()
    os.registry.register({ id: 'browser', name: '浏览器', icon: '' })
    os.appComponents.set('browser', { template: '<div/>' })
    os.wm.registerSpec('browser', { appId: 'browser', title: '浏览器' })
    const opened: string[] = []
    const origOpen = window.open
    window.open = ((url: string) => {
      opened.push(url)
      return null
    }) as typeof window.open
    os.openUrl('https://example.com', 'external')
    os.openUrl('https://vuejs.org', 'browser')
    window.open = origOpen
    expect(opened).toEqual(['https://example.com'])
    expect(os.wm.windowsOfApp('browser')).toHaveLength(1)
  })
})

describe('composables（无组件环境直接调 core 服务）', () => {
  it('useAppRegistry 语义（registry 直查）', () => {
    const os = makeInstance()
    expect(useAppRegistryCheck(os)).toBe(true)
  })

  it('useDesktop / useDock / useWidgets 实例透传', () => {
    const os = makeInstance()
    os.desktop.add({ type: 'app', refId: 'demo', name: '演示', position: { col: 0, row: 0 } })
    expect(os.desktop.list()).toHaveLength(1)
    os.dock.pin('demo')
    expect(os.dock.pinned).toEqual(['demo'])
    os.widgets.register({ id: 'clock', name: '时钟', sizes: ['small'], component: null })
    expect(os.widgets.addInstance('clock', 'small', { col: 0, row: 0 })).not.toBeNull()
  })
})

function useAppRegistryCheck(os: ReturnType<typeof createWebOSInstance>): boolean {
  return os.registry.queryByFileType('txt').length === 1
}

describe('uiRegistry（四级覆盖第②级）', () => {
  it('override/resolve：app 级 > 全局 > 默认', () => {
    const Default = { template: '<div/>' }
    const Global = { template: '<span/>' }
    const App = { template: '<b/>' }
    uiRegistry.clear()
    uiRegistry.override('DockItem', Global)
    expect(uiRegistry.resolve('DockItem', {}, Default)).toBe(Global)
    expect(uiRegistry.resolve('DockItem', { DockItem: App }, Default)).toBe(App)
    expect(uiRegistry.resolve('MenuBar', {}, undefined)).toBeUndefined()
  })
})

describe('shortcuts', () => {
  it('注册/规范化/分发/Cmd+Ctrl 双映射', () => {
    let fired = 0
    const off = shortcuts.register('Cmd/Ctrl+K', () => fired++)
    const ev = new KeyboardEvent('keydown', { ctrlKey: true, key: 'k' })
    expect(shortcuts.dispatch(ev)).toBe(true)
    expect(fired).toBe(1)
    const ev2 = new KeyboardEvent('keydown', { metaKey: true, key: 'K' })
    expect(shortcuts.dispatch(ev2)).toBe(true)
    expect(fired).toBe(2)
    off()
    expect(shortcuts.dispatch(ev)).toBe(false)
  })

  it('冲突覆盖并告警', () => {
    const warn = console.warn
    const warns: string[] = []
    console.warn = (m: string) => warns.push(m)
    const off1 = shortcuts.register('Cmd+Space', () => {})
    shortcuts.register('Ctrl+Space', () => {})
    console.warn = warn
    off1()
    expect(warns.some(w => w.includes('覆盖'))).toBe(true)
  })
})
