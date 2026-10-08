import type { AppDefinition } from '../src/index'
import { describe, expect, it } from 'vitest'
import { AppRegistry } from '../src/index'

const finder: AppDefinition = {
  id: 'finder',
  name: '访达',
  icon: 'i-lucide-folder',
  component: { template: '<div/>' },
  singleton: true,
  defaultSize: { width: 960, height: 620 },
  minSize: { width: 640, height: 400 },
  fileHandlers: ['txt', 'md'],
  menus: { appMenus: [{ id: 'file', label: '文件', submenu: [{ id: 'new-folder', label: '新建文件夹' }] }] },
}

describe('appRegistry', () => {
  it('register / get / list / unregister', () => {
    const reg = new AppRegistry()
    reg.register(finder)
    expect(reg.get('finder')?.name).toBe('访达')
    expect(reg.list()).toHaveLength(1)
    reg.unregister('finder')
    expect(reg.get('finder')).toBeUndefined()
  })

  it('override 深合并：只替换菜单不丢其它字段', () => {
    const reg = new AppRegistry()
    reg.register(finder)
    reg.override('finder', { name: 'Finder', menus: { appMenus: [{ id: 'file', label: '文件', submenu: [{ id: 'new-tab', label: '新建标签页' }] }] } })
    const app = reg.get('finder')!
    expect(app.name).toBe('Finder')
    expect(app.defaultSize?.width).toBe(960)
    expect(app.menus?.appMenus?.[0]?.submenu?.map(s => s.label)).toEqual(['新建文件夹', '新建标签页'])
  })

  it('override 未注册应用抛错', () => {
    const reg = new AppRegistry()
    expect(() => reg.override('ghost', { name: 'x' })).toThrow(/not registered/)
  })

  it('queryByFileType 文件路由', () => {
    const reg = new AppRegistry()
    reg.register(finder)
    reg.register({ id: 'editor', name: '编辑器', icon: '', fileHandlers: ['txt'] })
    expect(reg.queryByFileType('TXT').map(a => a.id)).toEqual(['finder', 'editor'])
    expect(reg.queryByFileType('png')).toEqual([])
  })

  it('dock/launchpad 派生与 order 排序', () => {
    const reg = new AppRegistry()
    reg.register(finder)
    reg.register({ id: 'settings', name: '设置', icon: '', dock: { showInDock: false }, launchpad: { order: 1 } })
    expect(reg.dockApps().map(a => a.id)).toEqual(['finder'])
    expect(reg.launchpadApps().map(a => a.id)).toEqual(['settings', 'finder'])
  })

  it('onChange 通知', () => {
    const reg = new AppRegistry()
    const events: string[] = []
    reg.onChange((id, action) => events.push(`${id}:${action}`))
    reg.register(finder)
    reg.override('finder', { name: 'F' })
    reg.unregister('finder')
    expect(events).toEqual(['finder:register', 'finder:override', 'finder:unregister'])
  })
})
