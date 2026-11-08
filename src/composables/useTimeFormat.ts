import { computed } from 'vue'
import { useSettingsStore } from '@/stores/settingsStore'
import { formatTime, formatRange } from '@/lib/time'

export function useTimeFormat() {
  const settings = useSettingsStore()
  const fmt = computed(() => settings.timeFormat)

  return {
    fmt,
    format: (min: number) => formatTime(min, fmt.value),
    formatWithSuffix: (min: number) => formatTime(min, fmt.value, { suffix: true }),
    formatRange: (start: number, end: number) => formatRange(start, end, fmt.value),
  }
}

