// ─── Types ───────────────────────────────────────────────────────────────────

export type DayId = 0 | 1 | 2 | 3 | 4 | 5 | 6 // 0 = Monday … 6 = Sunday

export interface LabSection {
  section: string
  days: DayId[]
  start: number
  end: number
}

export interface Course {
  id: string
  code: string
  name: string
  instructor?: string
  room?: string
  section?: string
  credits?: number
  textColor?: 'white' | 'black'
  days: DayId[]
  start: number // integer minutes since 00:00
  end: number   // minutes since 00:00, > start, <= 1440
  lab?: LabSection
  color: string // hex e.g. "#F59E0B"
}

export interface Occurrence {
  courseId: string
  day: DayId
  start: number
  end: number
  section?: 'lec' | 'lab'
}

export interface PlacedOccurrence extends Occurrence {
  lane: number // 0-based lane index within the day
}

export interface DayLayout {
  day: DayId
  laneCount: number // >= 1
  items: PlacedOccurrence[]
}

export type TimeFormat = '12h' | '24h-intl' | '24h-th'
export type ThemeId = 'dark' | 'minimal' | 'earth' | 'candy' | 'office' | 'outline'
export type Locale = 'th' | 'en'
export type ExportFormat = 'png' | 'jpg' | 'pdf'
export type ExportScale = 2 | 3
