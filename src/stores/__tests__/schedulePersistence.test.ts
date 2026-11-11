import { afterEach, describe, expect, it, vi } from 'vitest'
import { createApp } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import { createScheduleStorage, STORAGE_KEY } from '@/lib/storage'
import { useScheduleStore } from '@/stores/scheduleStore'
import type { Course } from '@/types'

afterEach(() => {
  vi.useRealTimers()
})

describe('schedule persistence plugin', () => {
  it('persists only primary state and restores it on a new Pinia instance', async () => {
    vi.useFakeTimers()
    const data = new Map<string, string>()
    const storage = {
      getItem: (key: string) => data.get(key) ?? null,
      setItem: (key: string, value: string) => data.set(key, value),
    }

    function createTestPinia() {
      const pinia = createPinia()
      pinia.use(createPersistedState({
        storage: createScheduleStorage(vi.fn(), () => storage),
      }))
      createApp({}).use(pinia)
      return pinia
    }

    const firstPinia = createTestPinia()
    const firstStore = useScheduleStore(firstPinia)
    const course: Omit<Course, 'id'> = {
      code: 'CS101',
      name: 'Computer Science',
      days: [0],
      start: 540,
      end: 660,
      color: '#6366F1',
    }

    firstStore.setTitle('Fall term')
    firstStore.addCourse(course)
    firstStore.locale = 'th'
    firstStore.selectedCourseId = 'temporary-selection'
    await vi.advanceTimersByTimeAsync(300)

    const persisted = JSON.parse(data.get(STORAGE_KEY) ?? '{}') as Record<string, unknown>
    expect(Object.keys(persisted).sort()).toEqual([
      'courses',
      'locale',
      'schemaVersion',
      'theme',
      'timeFormat',
      'title',
    ])
    expect(persisted).not.toHaveProperty('selectedCourseId')
    expect(persisted).not.toHaveProperty('range')
    expect(persisted).not.toHaveProperty('dayLayouts')

    const secondPinia = createTestPinia()
    const restoredStore = useScheduleStore(secondPinia)

    expect(restoredStore.title).toBe('Fall term')
    expect(restoredStore.courses).toHaveLength(1)
    expect(restoredStore.locale).toBe('th')
    expect(restoredStore.selectedCourseId).toBeNull()
  })
})
