/**
 * 内置小组件：时钟 / 日历 / 系统监视。
 * 视觉规范对齐 macOS 桌面小组件卡片：白底实底卡 + 标题栏（图标/标题/状态点）+ 大数字排版。
 * 卡片外壳（圆角/阴影/内边距）由 ui-arco 的 YwWidgetHost 提供，组件只负责内容。
 */
import type { WidgetDefinition } from '@yudream/yudream-webos-core'
import { markRaw } from 'vue'
import CalendarWidget from './calendar.vue'
import ClockWidget from './clock.vue'
import SystemMonitorWidget from './system-monitor.vue'

export const clockWidget: WidgetDefinition = {
  id: 'clock',
  name: '时钟',
  sizes: ['small'],
  component: markRaw(ClockWidget),
}

export const calendarWidget: WidgetDefinition = {
  id: 'calendar',
  name: '日历',
  sizes: ['small', 'medium'],
  component: markRaw(CalendarWidget),
}

export const systemMonitorWidget: WidgetDefinition = {
  id: 'system-monitor',
  name: '系统监视',
  sizes: ['medium'],
  component: markRaw(SystemMonitorWidget),
}

export const builtinWidgets: WidgetDefinition[] = [clockWidget, calendarWidget, systemMonitorWidget]

/** 小组件通用标题栏样式（图标+标题+状态点）——组件 scoped 样式只写内容区 */
export const builtinWidgetsCss = `
.yw-widget-head {
  display: flex;
  gap: 6px;
  align-items: center;
  margin-bottom: 10px;
}

.yw-widget-head-icon {
  font-size: 13px;
  color: oklch(var(--yw-primary));
}

.yw-widget-head-title {
  flex: 1;
  font-size: 12px;
  font-weight: 600;
  color: var(--yw-foreground);
}

.yw-widget-dot {
  flex-shrink: 0;
  width: 6px;
  height: 6px;
  background: #62ba46;
  border-radius: 50%;
  box-shadow: 0 0 4px rgb(98 186 70 / 60%);
}
`
