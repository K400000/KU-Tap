import type { Course } from '@/types'
import { TIME_STEP } from './time'

export interface ValidationError {
  field: string
  message: string // key for i18n
}

export function validateCourse(
  data: Partial<Course>,
  existingCourses: Course[],
  editingId?: string,
): ValidationError[] {
  const errors: ValidationError[] = []

  if (!data.code?.trim()) {
    errors.push({ field: 'code', message: 'validation.codeRequired' })
  } else if (data.code.trim().length > 12) {
    errors.push({ field: 'code', message: 'validation.codeMaxLength' })
  }

  if (!data.name?.trim()) {
    errors.push({ field: 'name', message: 'validation.nameRequired' })
  } else if (data.name.trim().length > 60) {
    errors.push({ field: 'name', message: 'validation.nameMaxLength' })
  }

  if (data.instructor && data.instructor.length > 40) {
    errors.push({ field: 'instructor', message: 'validation.instructorMaxLength' })
  }

  if (data.room && data.room.length > 20) {
    errors.push({ field: 'room', message: 'validation.roomMaxLength' })
  }

  if (data.credits !== undefined && data.credits !== null) {
    if (data.credits < 0 || data.credits > 12) {
      errors.push({ field: 'credits', message: 'validation.creditsRange' })
    }
  }

  if (!data.days || data.days.length === 0) {
    errors.push({ field: 'days', message: 'validation.daysRequired' })
  }

  const start = data.start
  const end   = data.end

  if (start === undefined || start === null) {
    errors.push({ field: 'start', message: 'validation.startRequired' })
  } else if (start % TIME_STEP !== 0 || start < 0 || start >= 1440) {
    errors.push({ field: 'start', message: 'validation.startInvalid' })
  }

  if (end === undefined || end === null) {
    errors.push({ field: 'end', message: 'validation.endRequired' })
  } else if (end % TIME_STEP !== 0 || end <= 0 || end > 1440) {
    errors.push({ field: 'end', message: 'validation.endInvalid' })
  }

  if (start !== undefined && end !== undefined && end <= start) {
    errors.push({ field: 'end', message: 'validation.endAfterStart' })
  }

  if (data.lab) {
    if (!data.lab.days.length) {
      errors.push({ field: 'labDays', message: 'validation.daysRequired' })
    }
    if (data.lab.start % TIME_STEP !== 0 || data.lab.start < 0 || data.lab.start >= 1440) {
      errors.push({ field: 'labStart', message: 'validation.startInvalid' })
    }
    if (data.lab.end % TIME_STEP !== 0 || data.lab.end <= 0 || data.lab.end > 1440) {
      errors.push({ field: 'labEnd', message: 'validation.endInvalid' })
    }
    if (data.lab.end <= data.lab.start) {
      errors.push({ field: 'labEnd', message: 'validation.endAfterStart' })
    }
  }

  return errors
}

export interface ConflictWarning {
  courseId: string
  code: string
  days: number[]
}

/** Returns courses that overlap the given time/days (informational) */
export function detectConflicts(
  data: Partial<Course>,
  existingCourses: Course[],
  editingId?: string,
): ConflictWarning[] {
  const conflicts: ConflictWarning[] = []
  const newSections = [
    ...(data.days?.length && data.start !== undefined && data.end !== undefined
      ? [{ days: data.days, start: data.start, end: data.end }]
      : []),
    ...(data.lab ? [data.lab] : []),
  ]

  for (const course of existingCourses) {
    if (course.id === editingId) continue
    const existingSections = [
      { days: course.days, start: course.start, end: course.end },
      ...(course.lab ? [course.lab] : []),
    ]
    const overlappingDays = new Set<number>()
    for (const newSection of newSections) {
      for (const existingSection of existingSections) {
        if (newSection.start >= existingSection.end || existingSection.start >= newSection.end) continue
        for (const day of newSection.days) {
          if (existingSection.days.includes(day)) overlappingDays.add(day)
        }
      }
    }
    if (overlappingDays.size) {
      conflicts.push({ courseId: course.id, code: course.code, days: [...overlappingDays] })
    }
  }
  return conflicts
}
