import { autoTextColor, hexToRgba } from '@/lib/contrast'
import { useSettingsStore } from '@/stores/settingsStore'
import { getThemeCourseColor, themes } from '@/lib/themes'
import { computed } from 'vue'

export function useContrast() {
  const settings = useSettingsStore()
  const cardStyle = computed(() => themes[settings.theme]?.cardStyle ?? 'solid')

  function getCardStyles(courseColor: string, textColor?: 'white' | 'black') {
    const style = cardStyle.value
    const color = getThemeCourseColor(courseColor, settings.theme)
    const text = textColor === 'white'
      ? '#FFFFFF'
      : textColor === 'black'
        ? '#111111'
        : undefined
    if (style === 'solid') {
      return {
        background: color,
        color: text ?? autoTextColor(color),
        borderLeft: 'none',
      }
    }
    if (style === 'tint-edge') {
      const theme = themes[settings.theme]
      return {
        background: hexToRgba(color, 0.15),
        color: text ?? theme.text,
        borderLeft: `4px solid ${color}`,
      }
    }
    // outline
    const theme = themes[settings.theme]
    return {
      background: theme.surface,
      color: text ?? theme.text,
      borderLeft: `4px solid ${color}`,
      border: `var(--border-width) solid ${color}`,
    }
  }

  return { getCardStyles }
}
