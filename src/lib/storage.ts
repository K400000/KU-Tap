import type { Serializer, StorageLike } from 'pinia-plugin-persistedstate'
import type { Course, DayId, LabSection, Locale, ThemeId, TimeFormat } from '@/types'

export const STORAGE_KEY = 'schedule-builder:v1'
export const STORAGE_WRITE_DELAY = 300

export interface PersistedSchedule {
  schemaVersion: 1
  courses: Course[]
  title: string
  locale: Locale
  timeFormat: TimeFormat
  theme: ThemeId
}

type PrimaryState = Omit<PersistedSchedule, 'schemaVersion'>
type StorageProvider = () => StorageLike

let storageErrorHandler = () => {}
let storageErrorReported = false

const defaultState: PrimaryState = {
  courses: [],
  title: 'My Schedule',
  locale: 'en',
  timeFormat: '24h-intl',
  theme: 'minimal',
}

export function configureStorageErrorHandler(handler: () => void): void {
  storageErrorHandler = handler
  storageErrorReported = false
}

export function reportStorageError(): void {
  if (storageErrorReported) return
  storageErrorReported = true
  storageErrorHandler()
}

export function requestPersistentStorage(): void {
  if (typeof navigator === 'undefined' || !navigator.storage?.persist) return
  try {
    void navigator.storage.persist().catch(() => {})
  } catch {
    // Persistent storage is a best-effort browser request.
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isDayId(value: unknown): value is DayId {
  return Number.isInteger(value) && Number(value) >= 0 && Number(value) <= 6
}

function isTimeRange(start: unknown, end: unknown): start is number {
  return Number.isInteger(start)
    && Number(start) >= 0
    && Number(start) <= 1440
    && Number.isInteger(end)
    && Number(end) >= 0
    && Number(end) <= 1440
    && Number(start) < Number(end)
}

function isValidDays(value: unknown): value is DayId[] {
  return Array.isArray(value) && value.length > 0 && value.every(isDayId)
}

function isValidLab(value: unknown): value is LabSection {
  if (!isRecord(value)) return false
  return typeof value.section === 'string'
    && value.section.trim().length > 0
    && isValidDays(value.days)
    && isTimeRange(value.start, value.end)
    && (value.room === undefined || typeof value.room === 'string')
    && (value.credits === undefined || (typeof value.credits === 'number' && Number.isFinite(value.credits)))
}

function isValidCourse(value: unknown): value is Course {
  if (!isRecord(value)) return false
  return typeof value.id === 'string'
    && value.id.length > 0
    && typeof value.code === 'string'
    && value.code.trim().length > 0
    && typeof value.name === 'string'
    && value.name.trim().length > 0
    && typeof value.color === 'string'
    && value.color.trim().length > 0
    && isValidDays(value.days)
    && isTimeRange(value.start, value.end)
    && (value.instructor === undefined || typeof value.instructor === 'string')
    && (value.room === undefined || typeof value.room === 'string')
    && (value.section === undefined || typeof value.section === 'string')
    && (value.credits === undefined || (typeof value.credits === 'number' && Number.isFinite(value.credits)))
    && (value.textColor === undefined || value.textColor === 'white' || value.textColor === 'black')
    && (value.lab === undefined || isValidLab(value.lab))
}

function isLocale(value: unknown): value is Locale {
  return value === 'th' || value === 'en'
}

function isTimeFormat(value: unknown): value is TimeFormat {
  return value === '12h' || value === '24h-intl' || value === '24h-th'
}

function isTheme(value: unknown): value is ThemeId {
  return value === 'dark'
    || value === 'minimal'
    || value === 'earth'
    || value === 'candy'
    || value === 'office'
    || value === 'outline'
}

export function getDefaultState(): PersistedSchedule {
  return { schemaVersion: 1, ...defaultState, courses: [] }
}

export function validate(raw: unknown): PersistedSchedule {
  if (!isRecord(raw)) return getDefaultState()

  return {
    schemaVersion: 1,
    courses: Array.isArray(raw.courses) ? raw.courses.filter(isValidCourse) : [],
    title: typeof raw.title === 'string' ? raw.title : defaultState.title,
    locale: isLocale(raw.locale) ? raw.locale : defaultState.locale,
    timeFormat: isTimeFormat(raw.timeFormat) ? raw.timeFormat : defaultState.timeFormat,
    theme: isTheme(raw.theme) ? raw.theme : defaultState.theme,
  }
}

export function migrate(raw: unknown): PersistedSchedule {
  if (!isRecord(raw)) return getDefaultState()

  const version = raw.schemaVersion === undefined ? 0 : raw.schemaVersion
  if (!Number.isInteger(version) || Number(version) < 0 || Number(version) > 1) {
    return getDefaultState()
  }

  return validate(raw)
}

export function serialize(state: unknown): string {
  const validated = validate(state)
  return JSON.stringify(validated)
}

export function deserialize(raw: string): PersistedSchedule {
  return migrate(JSON.parse(raw) as unknown)
}

export function createScheduleSerializer(onError: () => void): Serializer {
  return {
    serialize,
    deserialize(raw) {
      try {
        const { schemaVersion: _schemaVersion, ...state } = deserialize(raw)
        return state
      } catch {
        onError()
        return getDefaultStateWithoutVersion()
      }
    },
  }
}

function getDefaultStateWithoutVersion(): PrimaryState {
  const { schemaVersion: _schemaVersion, ...state } = getDefaultState()
  return state
}

export function createScheduleStorage(
  onError: () => void,
  getStorage: StorageProvider = () => window.localStorage,
): StorageLike {
  const timers = new Map<string, ReturnType<typeof setTimeout>>()

  function queueWrite(key: string, value: string): void {
    const previousTimer = timers.get(key)
    if (previousTimer) clearTimeout(previousTimer)

    const timer = setTimeout(() => {
      timers.delete(key)
      try {
        getStorage().setItem(key, value)
      } catch {
        onError()
      }
    }, STORAGE_WRITE_DELAY)

    timers.set(key, timer)
  }

  return {
    getItem(key) {
      try {
        const raw = getStorage().getItem(key)
        if (raw === null) return null

        try {
          const parsed: unknown = JSON.parse(raw)
          const migrated = migrate(parsed)
          const normalized = serialize(migrated)
          if (
            isRecord(parsed)
            && (parsed.schemaVersion === undefined || parsed.schemaVersion === 0 || parsed.schemaVersion === 1)
            && normalized !== raw
          ) {
            queueWrite(key, normalized)
          }
          return normalized
        } catch {
          onError()
          const defaults = serialize(getDefaultState())
          queueWrite(key, defaults)
          return defaults
        }
      } catch {
        onError()
        return null
      }
    },
    setItem(key, value) {
      queueWrite(key, value)
    },
  }
}
