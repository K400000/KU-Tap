import { describe, it, expect } from 'vitest'
import { validateCourse, detectConflicts } from '../validation'
import type { Course } from '@/types'

describe('validateCourse', () => {
  const validData: Partial<Course> = {
    code: 'CS101',
    name: 'Data Structures',
    section: '800',
    days: [0, 2],
    start: 540, // 09:00
    end: 660,   // 11:00
  }

  it('passes for complete valid data', () => {
    const errors = validateCourse(validData, [])
    expect(errors).toHaveLength(0)
  })

  it('fails if code is missing or exceeds 12 chars', () => {
    expect(validateCourse({ ...validData, code: '' }, [])[0]?.field).toBe('code')
    expect(validateCourse({ ...validData, code: '1234567890123' }, [])[0]?.field).toBe('code')
  })

  it('fails if name is missing or exceeds 60 chars', () => {
    expect(validateCourse({ ...validData, name: '' }, [])[0]?.field).toBe('name')
    expect(validateCourse({ ...validData, name: 'a'.repeat(61) }, [])[0]?.field).toBe('name')
  })

  it('fails if days array is empty', () => {
    expect(validateCourse({ ...validData, days: [] }, [])[0]?.field).toBe('days')
  })

  it('fails if start >= end', () => {
    const errEqual = validateCourse({ ...validData, start: 600, end: 600 }, [])
    expect(errEqual.some((e) => e.field === 'end')).toBe(true)

    const errLess = validateCourse({ ...validData, start: 700, end: 600 }, [])
    expect(errLess.some((e) => e.field === 'end')).toBe(true)
  })

  it('fails if credits out of 0-8 range', () => {
    expect(validateCourse({ ...validData, credits: -1 }, [])[0]?.field).toBe('credits')
    expect(validateCourse({ ...validData, credits: 9 }, [])[0]?.field).toBe('credits')
    expect(validateCourse({ ...validData, credits: 8 }, [])).toHaveLength(0)
    expect(validateCourse({ ...validData, credits: 1.5 }, [])).toHaveLength(0)
  })

  it('requires at least two hours for lecture and lab schedules', () => {
    expect(validateCourse({ ...validData, end: 659 }, []).map((error) => error.message))
      .toContain('validation.durationMin')
    expect(validateCourse({
      ...validData,
      lab: { days: [4], start: 780, end: 899 },
    }, []).map((error) => error.message)).toContain('validation.durationMin')
  })

  it('accepts typed times at minute precision', () => {
    expect(validateCourse({ ...validData, start: 555, end: 675 }, [])).toHaveLength(0)
  })

  it('fails if section exceeds 20 characters', () => {
    expect(validateCourse({ ...validData, section: '1'.repeat(21) }, [])[0]?.field).toBe('section')
    expect(validateCourse({ ...validData, section: '800' }, [])).toHaveLength(0)
  })

  it('requires a section number', () => {
    expect(validateCourse({ ...validData, section: '' }, [])[0]?.field).toBe('section')
    expect(validateCourse({ ...validData, section: '  ' }, [])[0]?.message).toBe('validation.sectionRequired')
  })

  it('requires valid days and time range when a lab section is added', () => {
    const errors = validateCourse({
      ...validData,
      lab: { days: [], start: 600, end: 600 },
    }, [])

    expect(errors.map((error) => error.field)).toEqual(['labDays', 'labEnd'])
  })
})

describe('detectConflicts', () => {
  const existingCourses: Course[] = [
    {
      id: 'c1',
      code: 'MATH101',
      name: 'Calculus',
      days: [0, 2],
      start: 540, // 09:00
      end: 660,   // 11:00
      color: '#fff',
    },
  ]

  it('detects overlap on the same day', () => {
    const conflicts = detectConflicts(
      { days: [0], start: 600, end: 720 }, // 10:00 - 12:00
      existingCourses,
    )
    expect(conflicts).toHaveLength(1)
    expect(conflicts[0]?.code).toBe('MATH101')
  })

  it('does NOT conflict if touching endpoints (e.g. 11:00 start when existing ends 11:00)', () => {
    const conflicts = detectConflicts(
      { days: [0], start: 660, end: 780 },
      existingCourses,
    )
    expect(conflicts).toHaveLength(0)
  })

  it('does NOT conflict if on different days', () => {
    const conflicts = detectConflicts(
      { days: [1], start: 540, end: 660 }, // Tuesday vs Monday/Wed
      existingCourses,
    )
    expect(conflicts).toHaveLength(0)
  })

  it('ignores the course currently being edited', () => {
    const conflicts = detectConflicts(
      { days: [0], start: 540, end: 660 },
      existingCourses,
      'c1', // editing c1 itself
    )
    expect(conflicts).toHaveLength(0)
  })

  it('detects conflicts for lab sections against existing lecture and lab times', () => {
    const conflicts = detectConflicts({
      days: [],
      lab: { days: [0], start: 600, end: 720 },
    }, existingCourses)

    expect(conflicts.map((conflict) => conflict.code)).toEqual(['MATH101'])
  })
})
