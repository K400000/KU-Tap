import { computed } from 'vue'
import { useScheduleStore } from '@/stores/scheduleStore'

export function useScheduleLayout() {
  const store = useScheduleStore()

  return {
    range: computed(() => store.range),
    dayLayouts: computed(() => store.dayLayouts),
  }
}

