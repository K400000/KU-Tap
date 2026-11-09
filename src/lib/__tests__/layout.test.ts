import { describe, it, expect } from 'vitest'
import { layoutDay, expandOccurrences, computeDayLayouts } from '../layout'
import type { Occurrence, Course } from '@/types'

describe('layoutDay (Collision resolution & interval partitioning)', () => {
  it('assigns single course to lane 0 (laneCount = 1)', () => {
    const occs: Occurrence[] = [
      { courseId: 'c1', day: 0, start: 540, end: 660 },
    ]
    const { items, laneCount } = layoutDay(occs)
    expect(laneCount).toBe(1)
    expect(items[0]?.lane).toBe(0)
  })

  it('keeps touching endpoints (A ends 11:00, B starts 11:00) in the same lane (no collision)', () => {
    const occs: Occurrence[] = [
      { courseId: 'c1', day: 0, start: 540, end: 660 }, // 09:00 - 11:00
      { courseId: 'c2', day: 0, start: 660, end: 780 }, // 11:00 - 13:00
    ]
    const { items, laneCount } = layoutDay(occs)
    expect(laneCount).toBe(1)
    expect(items.find((i) => i.courseId === 'c1')?.lane).toBe(0)
    expect(items.find((i) => i.courseId === 'c2')?.lane).toBe(0)
  })

  it('resolves 2-way overlap into lane 0 and lane 1', () => {
    const occs: Occurrence[] = [
      { courseId: 'c1', day: 0, start: 540, end: 660 }, // 09:00 - 11:00
      { courseId: 'c2', day: 0, start: 600, end: 720 }, // 10:00 - 12:00
    ]
    const { items, laneCount } = layoutDay(occs)
    expect(laneCount).toBe(2)
    expect(items.find((i) => i.courseId === 'c1')?.lane).toBe(0)
    expect(items.find((i) => i.courseId === 'c2')?.lane).toBe(1)
  })

  it('resolves 3-way simultaneous overlap into 3 lanes', () => {
    const occs: Occurrence[] = [
      { courseId: 'c1', day: 0, start: 540, end: 720 },
      { courseId: 'c2', day: 0, start: 570, end: 690 },
      { courseId: 'c3', day: 0, start: 600, end: 660 },
    ]
    const { items, laneCount } = layoutDay(occs)
    expect(laneCount).toBe(3)
    const lanes = items.map((i) => i.lane).sort()
    expect(lanes).toEqual([0, 1, 2])
  })

  it('reuses freed lanes greedily', () => {
    const occs: Occurrence[] = [
      { courseId: 'c1', day: 0, start: 540, end: 660 }, // 09:00 - 11:00 -> lane 0
      { courseId: 'c2', day: 0, start: 600, end: 720 }, // 10:00 - 12:00 -> lane 1
      { courseId: 'c3', day: 0, start: 660, end: 780 }, // 11:00 - 13:00 -> should reuse lane 0!
    ]
    const { items, laneCount } = layoutDay(occs)
    expect(laneCount).toBe(2)
    expect(items.find((i) => i.courseId === 'c3')?.lane).toBe(0)
  })

  it('is deterministic regardless of input order', () => {
    const occsA: Occurrence[] = [
      { courseId: 'c1', day: 0, start: 540, end: 660 },
      { courseId: 'c2', day: 0, start: 600, end: 720 },
      { courseId: 'c3', day: 0, start: 540, end: 600 },
    ]
    const occsB = [...occsA].reverse()

    const resA = layoutDay(occsA)
    const resB = layoutDay(occsB)

    expect(resA.laneCount).toBe(resB.laneCount)
    expect(resA.items.map((i) => ({ id: i.courseId, l: i.lane }))).toEqual(
      resB.items.map((i) => ({ id: i.courseId, l: i.lane })),
    )
  })
})

describe('expandOccurrences & computeDayLayouts', () => {
  it('expands multi-day course into occurrences on each day', () => {
    const courses: Course[] = [
      {
        id: 'c1',
        code: 'CS101',
        name: 'Intro',
        days: [0, 2, 4],
        start: 540,
        end: 660,
        color: '#6366F1',
      },
    ]
    const occs = expandOccurrences(courses)
    expect(occs.length).toBe(3)
    expect(occs.map((o) => o.day)).toEqual([0, 2, 4])
  })

  it('expands the optional lab schedule as part of the same course', () => {
    const course: Course = {
      id: 'c1',
      code: 'CS101',
      name: 'Intro',
      days: [0],
      start: 540,
      end: 600,
      lab: { section: '830', days: [4], start: 780, end: 900 },
      color: '#6366F1',
    }

    expect(expandOccurrences([course])).toEqual([
      { courseId: 'c1', day: 0, start: 540, end: 600, section: 'lec' },
      { courseId: 'c1', day: 4, start: 780, end: 900, section: 'lab' },
    ])
  })

  it('computes 7 day layouts (Mon-Sun) always', () => {
    const layouts = computeDayLayouts([])
    expect(layouts.length).toBe(7)
    expect(layouts[0]?.day).toBe(0)
    expect(layouts[6]?.day).toBe(6)
    expect(layouts.every((l) => l.laneCount >= 1)).toBe(true)
  })
})
