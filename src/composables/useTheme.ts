import { watch, onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settingsStore'
import { themes } from '@/lib/themes'

export function useTheme(target: () => HTMLElement | null = () => document.documentElement) {
  const settings = useSettingsStore()

  function applyTheme() {
    const el = target() ?? document.documentElement
    const t = themes[settings.theme]
    if (!t) return

    el.style.setProperty('--bg', t.bg)
    el.style.setProperty('--surface', t.surface)
    el.style.setProperty('--grid-line', t.gridLine)
    el.style.setProperty('--grid-line-strong', t.gridLineStrong)
    el.style.setProperty('--header-bg', t.headerBg)
    el.style.setProperty('--header-text', t.headerText)
    el.style.setProperty('--day-label-bg', t.dayLabelBg)
    el.style.setProperty('--day-label-text', t.dayLabelText)
    el.style.setProperty('--text', t.text)
    el.style.setProperty('--text-muted', t.textMuted)
    el.style.setProperty('--title', t.title)
    el.style.setProperty('--break-bg', t.breakBg)
    el.style.setProperty('--break-text', t.breakText)
    el.style.setProperty('--collision-cell-bg', t.collisionCellBg)
    el.style.setProperty('--collision-cell-pattern', t.collisionCellPattern ?? 'none')
    el.style.setProperty('--radius', t.radius)
    el.style.setProperty('--shadow', t.shadow)
    el.style.setProperty('--border-width', t.borderWidth)
  }

  onMounted(applyTheme)
  watch(() => settings.theme, applyTheme)

  return { applyTheme }
}

