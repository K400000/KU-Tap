import type { Course } from '@/types'

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

  if (!data.section?.trim()) {
    errors.push({ field: 'section', message: 'validation.sectionRequired' })
  } else if (data.section.trim().length > 20) {
    errors.push({ field: 'section', message: 'validation.sectionMaxLength' })
  }

  if (data.credits !== undefined && data.credits !== null) {
    if (!Number.isFinite(data.credits) || data.credits < 0 || data.credits > 8) {
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
  } else if (!Number.isInteger(start) || start < 0 || start >= 1440) {
    errors.push({ field: 'start', message: 'validation.startInvalid' })
  }

  if (end === undefined || end === null) {
    errors.push({ field: 'end', message: 'validation.endRequired' })
  } else if (!Number.isInteger(end) || end <= 0 || end > 1440) {
    errors.push({ field: 'end', message: 'validation.endInvalid' })
  }

  if (start !== undefined && end !== undefined && Number.isInteger(start) && Number.isInteger(end)) {
    if (end <= start) {
      errors.push({ field: 'end', message: 'validation.endAfterStart' })
    } else if (end - start < 120) {
      errors.push({ field: 'end', message: 'validation.durationMin' })
    }
  }

  if (data.lab) {
    if (data.lab.room && data.lab.room.length > 20) {
      errors.push({ field: 'labRoom', message: 'validation.roomMaxLength' })
    }
    if (!data.lab.section?.trim()) {
      errors.push({ field: 'labSection', message: 'validation.sectionRequired' })
    } else if (data.lab.section.trim().length > 20) {
      errors.push({ field: 'labSection', message: 'validation.sectionMaxLength' })
    }
    if (!data.lab.days.length) {
      errors.push({ field: 'labDays', message: 'validation.daysRequired' })
    }
    if (!Number.isInteger(data.lab.start) || data.lab.start < 0 || data.lab.start >= 1440) {
      errors.push({ field: 'labStart', message: 'validation.startInvalid' })
    }
    if (!Number.isInteger(data.lab.end) || data.lab.end <= 0 || data.lab.end > 1440) {
      errors.push({ field: 'labEnd', message: 'validation.endInvalid' })
    }
    if (Number.isInteger(data.lab.start) && Number.isInteger(data.lab.end)) {
      if (data.lab.end <= data.lab.start) {
        errors.push({ field: 'labEnd', message: 'validation.endAfterStart' })
      } else if (data.lab.end - data.lab.start < 120) {
        errors.push({ field: 'labEnd', message: 'validation.durationMin' })
      }
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
