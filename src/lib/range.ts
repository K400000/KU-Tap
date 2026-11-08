import type { Course } from '@/types'
import { DAY_START_DEFAULT, DAY_END_DEFAULT } from './time'

export function computeRange(courses: Course[]): { rangeStart: number; rangeEnd: number } {
  if (courses.length === 0) {
    return { rangeStart: DAY_START_DEFAULT, rangeEnd: DAY_END_DEFAULT }
  }
  const starts = courses.flatMap((course) => [course.start, ...(course.lab ? [course.lab.start] : [])])
  const ends = courses.flatMap((course) => [course.end, ...(course.lab ? [course.lab.end] : [])])
  const minStart = Math.min(...starts)
  const maxEnd = Math.max(...ends)
  const rangeStart = Math.min(DAY_START_DEFAULT, Math.floor(minStart / 60) * 60)
  const rangeEnd   = Math.max(DAY_END_DEFAULT,   Math.ceil(maxEnd  / 60) * 60)
  return { rangeStart, rangeEnd }
}

export function computePosition(
  start: number,
  end: number,
  rangeStart: number,
  rangeEnd: number,
): { leftPct: number; widthPct: number } {
  const span = rangeEnd - rangeStart
  return {
    leftPct:  ((start - rangeStart) / span) * 100,
    widthPct: ((end   - start)       / span) * 100,
  }
}

export function computeHourLines(rangeStart: number, rangeEnd: number): number[] {
  const lines: number[] = []
  for (let m = rangeStart; m <= rangeEnd; m += 60) {
    lines.push(m)
  }
  return lines
}

export function computeHalfHourTicks(rangeStart: number, rangeEnd: number): number[] {
  const ticks: number[] = []
  for (let m = rangeStart + 30; m < rangeEnd; m += 60) {
    if (m % 60 !== 0) ticks.push(m)
  }
  // half-hour ticks that are not on the hour
  const result: number[] = []
  for (let m = rangeStart; m <= rangeEnd; m += 30) {
    if (m % 60 !== 0) result.push(m)
  }
  return result
}
