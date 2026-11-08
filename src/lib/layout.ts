import type { Course, DayId, Occurrence, PlacedOccurrence, DayLayout } from '@/types'

/** Expand courses into one Occurrence per selected day */
export function expandOccurrences(courses: Course[]): Occurrence[] {
  const result: Occurrence[] = []
  for (const course of courses) {
    for (const day of course.days) {
      result.push({ courseId: course.id, day, start: course.start, end: course.end, section: 'lec' })
    }
    if (course.lab) {
      for (const day of course.lab.days) {
        result.push({
          courseId: course.id,
          day,
          start: course.lab.start,
          end: course.lab.end,
          section: 'lab',
        })
      }
    }
  }
  return result
}

/**
 * Assign each occurrence on a given day to the lowest-numbered lane
 * with no overlap. Two courses that merely touch (a.end === b.start) do NOT collide.
 */
export function layoutDay(occurrences: Occurrence[]): { items: PlacedOccurrence[]; laneCount: number } {
  // Stable sort: start asc, then end desc (longer first), then courseId for determinism
  const sorted = [...occurrences].sort(
    (a, b) => a.start - b.start || b.end - a.end || a.courseId.localeCompare(b.courseId) || (a.section ?? 'lec').localeCompare(b.section ?? 'lec'),
  )

  const laneEnds: number[] = [] // laneEnds[i] = end time of the last item placed in lane i
  const items: PlacedOccurrence[] = []

  for (const occ of sorted) {
    let lane = laneEnds.findIndex((end) => end <= occ.start)
    if (lane === -1) {
      lane = laneEnds.length
      laneEnds.push(occ.end)
    } else {
      laneEnds[lane] = occ.end
    }
    items.push({ ...occ, lane })
  }

  return { items, laneCount: Math.max(1, laneEnds.length) }
}

/** Compute layout for all 7 days */
export function computeDayLayouts(courses: Course[]): DayLayout[] {
  const occurrences = expandOccurrences(courses)
  const days: DayId[] = [0, 1, 2, 3, 4, 5, 6]

  return days.map((day) => {
    const dayOccs = occurrences.filter((o) => o.day === day)
    const { items, laneCount } = layoutDay(dayOccs)
    return { day, laneCount, items }
  })
}
