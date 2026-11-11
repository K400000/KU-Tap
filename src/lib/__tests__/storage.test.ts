import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  createScheduleSerializer,
  createScheduleStorage,
  deserialize,
  getDefaultState,
  migrate,
  serialize,
  STORAGE_KEY,
  validate,
} from '@/lib/storage'
import type { Course } from '@/types'

const validCourse: Course = {
  id: 'course-1',
  code: 'CS101',
  name: 'Computer Science',
  days: [0, 2],
  start: 540,
  end: 660,
  color: '#6366F1',
}

afterEach(() => {
  vi.useRealTimers()
})

describe('schedule storage', () => {
  it('loads a valid schedule', () => {
    const state = {
      ...getDefaultState(),
      title: 'Fall term',
      courses: [validCourse],
      locale: 'th' as const,
      theme: 'earth' as const,
    }

    expect(deserialize(serialize(state))).toEqual(state)
  })

  it('returns defaults for corrupt JSON without throwing during hydration', () => {
    const onError = vi.fn()
    const serializer = createScheduleSerializer(onError)

    expect(serializer.deserialize('{broken json')).toEqual({
      courses: [],
      title: 'My Schedule',
      locale: 'en',
      timeFormat: '24h-intl',
      theme: 'minimal',
    })
    expect(onError).toHaveBeenCalledOnce()
  })

  it('repairs corrupt stored JSON with defaults', async () => {
    vi.useFakeTimers()
    const onError = vi.fn()
    const storage = {
      value: '{broken json',
      getItem() { return this.value },
      setItem(_key: string, value: string) { this.value = value },
    }
    const adapter = createScheduleStorage(onError, () => storage)

    expect(JSON.parse(adapter.getItem(STORAGE_KEY) ?? '{}')).toEqual(getDefaultState())
    await vi.advanceTimersByTimeAsync(300)

    expect(JSON.parse(storage.value)).toEqual(getDefaultState())
    expect(onError).toHaveBeenCalledOnce()
  })

  it('fills missing fields with defaults', () => {
    expect(validate({ schemaVersion: 1, title: 'My term' })).toEqual({
      schemaVersion: 1,
      courses: [],
      title: 'My term',
      locale: 'en',
      timeFormat: '24h-intl',
      theme: 'minimal',
    })
  })

  it('migrates schema version zero', () => {
    expect(migrate({ schemaVersion: 0, courses: [validCourse], title: 'Old term' })).toEqual({
      schemaVersion: 1,
      courses: [validCourse],
      title: 'Old term',
      locale: 'en',
      timeFormat: '24h-intl',
      theme: 'minimal',
    })
  })

  it('falls back to defaults for unsupported schema versions', () => {
    expect(migrate({ schemaVersion: 2, courses: [validCourse], title: 'Future term' })).toEqual(
      getDefaultState(),
    )
  })

  it('drops courses with invalid time ranges or empty days', () => {
    const invalidTime = { ...validCourse, id: 'invalid-time', end: 1441 }
    const invalidDays = { ...validCourse, id: 'invalid-days', days: [] }

    expect(validate({ courses: [validCourse, invalidTime, invalidDays] }).courses).toEqual([validCourse])
  })

  it('reports a storage error when a debounced write throws', () => {
    vi.useFakeTimers()
    const onError = vi.fn()
    const storage = {
      getItem: vi.fn(() => null),
      setItem: vi.fn(() => {
        throw new Error('quota exceeded')
      }),
    }
    const adapter = createScheduleStorage(onError, () => storage)

    adapter.setItem(STORAGE_KEY, serialize(getDefaultState()))
    vi.advanceTimersByTime(300)

    expect(storage.setItem).toHaveBeenCalledOnce()
    expect(onError).toHaveBeenCalledOnce()
  })
})
