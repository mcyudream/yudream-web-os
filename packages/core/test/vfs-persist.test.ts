import { describe, expect, it, vi } from 'vitest'
import { LocalStoragePersistence, MemoryAdapter, MemoryPersistence, migrate, VFS } from '../src/index'

describe('vFS', () => {
  it('写入/读取/目录遍历（含父目录自动创建）', async () => {
    const vfs = new VFS()
    vfs.mount('/', new MemoryAdapter())
    await vfs.write('/Documents/notes/readme.md', 'hello')
    const content = await vfs.read('/Documents/notes/readme.md')
    expect(content).toBe('hello')
    const nodes = await vfs.readdir('/Documents/notes')
    expect(nodes).toHaveLength(1)
    expect(nodes[0]!.name).toBe('readme.md')
    const dir = await vfs.stat('/Documents/notes')
    expect(dir.kind).toBe('directory')
  })

  it('mount 路由与最长前缀匹配', async () => {
    const vfs = new VFS()
    const root = new MemoryAdapter({ '/root-file.txt': 'root' })
    const system = new MemoryAdapter({ '/system-file.txt': 'system' })
    vfs.mount('/', root)
    vfs.mount('/system', system)
    expect(await vfs.read('/root-file.txt')).toBe('root')
    expect(await vfs.read('/system/system-file.txt')).toBe('system')
    // 写入 system 盘落在 system adapter（root 盘不可见）
    await vfs.write('/system/new.txt', 'x')
    const rootNodes = await vfs.readdir('/')
    expect(rootNodes.some(n => n.name === 'new.txt')).toBe(false)
  })

  it('mkdir/move/copy/remove 事件', async () => {
    const vfs = new VFS()
    vfs.mount('/', new MemoryAdapter())
    const events: string[] = []
    vfs.onChange(e => events.push(`${e.type}:${e.path}`))
    await vfs.mkdir('/tmp')
    await vfs.write('/tmp/a.txt', '1')
    await vfs.copy('/tmp/a.txt', '/tmp/b.txt')
    await vfs.move('/tmp/b.txt', '/tmp/c.txt')
    await vfs.remove('/tmp/c.txt')
    expect(events).toEqual([
      'create:/tmp',
      'write:/tmp/a.txt',
      'create:/tmp/b.txt',
      'move:/tmp/b.txt',
      'remove:/tmp/c.txt',
    ])
    await expect(vfs.read('/tmp/c.txt')).rejects.toThrow(/ENOENT/)
  })

  it('normalizePath 防穿越（.. 压回根内）', async () => {
    const vfs = new VFS()
    vfs.mount('/', new MemoryAdapter({ '/safe.txt': 'x' }))
    await vfs.write('/../evil.txt', 'y')
    // '..' 被清洗：写入根目录 /evil.txt，而非逃逸到根之外
    const nodes = await vfs.readdir('/')
    expect(nodes.some(n => n.name === 'evil.txt')).toBe(true)
    expect(nodes.some(n => n.name === '..')).toBe(false)
  })
})

describe('持久化', () => {
  it('memoryPersistence get/set/remove/clear(scope)', async () => {
    const p = new MemoryPersistence()
    await p.set('desktop.layout', { items: [1] })
    await p.set('dock', { pinned: [] })
    expect(await p.get('desktop.layout')).toEqual({ items: [1] })
    await p.clear('desktop')
    expect(await p.get('desktop.layout')).toBeNull()
    expect(await p.get('dock')).toEqual({ pinned: [] })
  })

  it('localStoragePersistence 防抖落盘（fake timerged）', async () => {
    const store = new Map<string, string>()
    const fakeStorage = {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
      removeItem: (k: string) => void store.delete(k),
    }
    vi.useFakeTimers()
    const p = new LocalStoragePersistence(fakeStorage, 'webos', 300)
    await p.set('dock', { pinned: ['a'] })
    expect(store.has('webos.dock')).toBe(false) // 未到防抖窗口
    vi.advanceTimersByTime(310)
    expect(JSON.parse(store.get('webos.dock')!)).toEqual({ pinned: ['a'] })
    vi.useRealTimers()
  })

  it('flushNow 跳过防抖窗口立即落盘（页面隐藏/卸载兜底）', async () => {
    const store = new Map<string, string>()
    const fakeStorage = {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
      removeItem: (k: string) => void store.delete(k),
    }
    vi.useFakeTimers()
    const p = new LocalStoragePersistence(fakeStorage, 'webos', 300)
    await p.set('system', { mode: 'dark' })
    expect(store.has('webos.system')).toBe(false) // 防抖窗口内
    p.flushNow()
    expect(JSON.parse(store.get('webos.system')!)).toEqual({ mode: 'dark' })
    vi.useRealTimers()
  })

  it('migrate 版本迁移链', async () => {
    const p = new MemoryPersistence()
    await p.set('system', { version: 0, data: { theme: 'dark', oldField: 1 } })
    const result = await migrate<{ theme: string, newField: number }>(
      p,
      'system',
      2,
      {
        0: (d: any) => ({ ...d, newField: (d as any).oldField }),
        1: (d: any) => ({ ...d, migrated: true }),
      },
      { theme: 'light', newField: 0 },
    )
    expect(result.newField).toBe(1)
    const stored = await p.get<{ version: number }>('system')
    expect(stored!.version).toBe(2)
  })
})

it('set 接受不可 structuredClone 的对象（Vue reactive Proxy 场景）', async () => {
  const p = new MemoryPersistence()
  const reactiveLike = new Proxy({ mode: 'dark', wallpaper: { src: 'x' } }, {})
  await p.set('system', { mode: 'system', accent: null, wallpaper: reactiveLike })
  // JSON 化后比较：get 返回的 wallpaper 仍是存入前的同一 Proxy 引用，toEqual 对 Proxy 判不等
  expect(JSON.parse(JSON.stringify(await p.get('system')))).toEqual({ mode: 'system', accent: null, wallpaper: { mode: 'dark', wallpaper: { src: 'x' } } })
})
