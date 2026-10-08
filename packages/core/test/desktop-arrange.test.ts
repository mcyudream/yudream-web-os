import { describe, expect, it } from 'vitest'
import { DesktopModel } from '../src/index'

describe('桌面整理（autoArrange/sortBy）', () => {
  it('整理尊重 rowsPerColumn：满列换列而非一根竖条', () => {
    const dm = new DesktopModel()
    dm.rowsPerColumn = 3
    for (let i = 0; i < 5; i++) {
      dm.add({ type: 'app', refId: `app-${i}`, name: `App${i}`, icon: '', position: { col: 9, row: 9 } })
    }
    dm.autoArrange()
    const items = dm.list().filter(x => x.type === 'app')
    expect(items).toHaveLength(5)
    // 列优先：3+2 → 两列
    const cols = new Set(items.map(x => (x.position as { col: number }).col))
    expect(cols.size).toBe(2)
    const col0 = items.filter(x => (x.position as { col: number }).col === 0)
    expect(col0).toHaveLength(3)
  })

  it('rowsPerColumn=0（未量取视口）时不换列，行为向后兼容', () => {
    const dm = new DesktopModel()
    for (let i = 0; i < 3; i++) {
      dm.add({ type: 'app', refId: `app-${i}`, name: `App${i}`, icon: '', position: { col: 5, row: 5 } })
    }
    dm.autoArrange()
    const items = dm.list().filter(x => x.type === 'app')
    const cols = new Set(items.map(x => (x.position as { col: number }).col))
    expect(cols.size).toBe(1)
  })

  it('sortBy 同样尊重 rowsPerColumn', () => {
    const dm = new DesktopModel()
    dm.rowsPerColumn = 2
    for (const n of ['c', 'a', 'b', 'd', 'e']) {
      dm.add({ type: 'app', refId: n, name: n, icon: '', position: { col: 9, row: 9 } })
    }
    dm.sortBy('name')
    const items = dm.list().filter(x => x.type === 'app')
    expect(items[0]!.name).toBe('a')
    const cols = new Set(items.map(x => (x.position as { col: number }).col))
    expect(cols.size).toBe(3) // 5 项每列 2 → 3 列
  })
})
