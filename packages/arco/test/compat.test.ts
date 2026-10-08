/**
 * compat stores 回归：
 * ① 单例契约——同一 WebOSInstance 下多次调用 use*Store 返回同一对象（bus 订阅只挂一次）；
 * ② 载荷归一化——异步 loader 组件经 attachPayload/payloadOf 取出后为缓存的异步组件而非裸 loader。
 */
import type { WebOSInstance } from '@yudream/yudream-webos-vue'
import { createWebOSInstance, WEBOS_KEY } from '@yudream/yudream-webos-vue'
import { describe, expect, it } from 'vitest'
import { createApp, defineComponent, h } from 'vue'
import { useAppsStore, useWindowsStore } from '../src/stores/compat'

const DEMO_APP = {
  id: 'demo',
  name: '演示',
  icon: 'i-lucide-app-window',
  component: () => Promise.resolve({ template: '<div/>' }),
  singleton: true,
  defaultSize: { width: 720, height: 520 },
}

function makeInstance() {
  return createWebOSInstance({ apps: [DEMO_APP], persist: { adapter: 'memory' } })
}

/** 在组件 setup 上下文内执行（use*Store 依赖 inject） */
function withSetup<T>(os: WebOSInstance, fn: () => T): T {
  let result!: T
  const app = createApp(defineComponent({
    setup() {
      result = fn()
      return () => h('div')
    },
  }))
  app.provide(WEBOS_KEY, os)
  app.mount(document.createElement('div'))
  app.unmount()
  return result
}

describe('compat stores 单例契约', () => {
  it('同一实例下两次调用返回同一对象', () => {
    const os = makeInstance()
    const a = withSetup(os, () => useWindowsStore())
    const b = withSetup(os, () => useWindowsStore())
    expect(a).toBe(b)
  })

  it('apps store 同样单例', () => {
    const os = makeInstance()
    const a = withSetup(os, () => useAppsStore())
    const b = withSetup(os, () => useAppsStore())
    expect(a).toBe(b)
  })

  it('不同实例互不共享', () => {
    const os1 = makeInstance()
    const os2 = makeInstance()
    const a = withSetup(os1, () => useWindowsStore())
    const b = withSetup(os2, () => useWindowsStore())
    expect(a).not.toBe(b)
  })
})

describe('窗口内容载荷', () => {
  it('attachPayload 写入的异步 loader 归一化为异步组件且引用稳定', () => {
    const os = makeInstance()
    const store = withSetup(os, () => useWindowsStore())
    const loader = () => Promise.resolve({ template: '<div/>' })
    const win = os.wm.open('demo')
    store.attachPayload(win.id, { appId: 'demo', component: loader, title: '演示' })
    const p1 = store.payloadOf(win.id)
    const p2 = store.payloadOf(win.id)
    expect(p1).toBeDefined()
    // 归一化：不再是裸函数 loader，而是 defineAsyncComponent 产物
    expect(typeof p1!.component).not.toBe('function')
    // 引用稳定：多次读取同一对象（防每次渲染重建导致反复挂载）
    expect(p1!.component).toBe(p2!.component)
  })

  it('注册表组件兜底路径同样归一化并回写缓存', () => {
    const os = makeInstance()
    const store = withSetup(os, () => useWindowsStore())
    // openComponent 不带 component：走 appComponents 兜底
    const winId = String(store.openComponent({ appKey: 'demo', title: '演示' }))
    const p = store.payloadOf(winId)
    expect(p).toBeDefined()
    expect(typeof p!.component).not.toBe('function')
  })
})
