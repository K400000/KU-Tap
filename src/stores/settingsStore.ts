import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ThemeId, Locale, TimeFormat } from '@/types'

export const useSettingsStore = defineStore(
  'settings',
  () => {
    const locale = ref<Locale>('en')
    const timeFormat = ref<TimeFormat>('24h-intl')
    const theme = ref<ThemeId>('minimal')

    function setLocale(l: Locale) { locale.value = l }
    function setTimeFormat(f: TimeFormat) { timeFormat.value = f }
    function setTheme(t: ThemeId) { theme.value = t }

    return { locale, timeFormat, theme, setLocale, setTimeFormat, setTheme }
  },
)
