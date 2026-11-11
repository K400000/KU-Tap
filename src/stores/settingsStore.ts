import { defineStore, storeToRefs } from 'pinia'
import type { ThemeId, Locale, TimeFormat } from '@/types'
import { useScheduleStore } from './scheduleStore'

export const useSettingsStore = defineStore(
  'settings',
  () => {
    const schedule = useScheduleStore()
    const { locale, timeFormat, theme } = storeToRefs(schedule)

    function setLocale(l: Locale) { locale.value = l }
    function setTimeFormat(f: TimeFormat) { timeFormat.value = f }
    function setTheme(t: ThemeId) { theme.value = t }

    return { locale, timeFormat, theme, setLocale, setTimeFormat, setTheme }
  },
)
