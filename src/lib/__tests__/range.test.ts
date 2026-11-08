import { describe, it, expect } from 'vitest'
import { computeRange, computePosition, computeHourLines, computeHalfHourTicks } from '../range'
import type { Course } from '@/types'

describe('computeRange', () => {
  it('returns default 08:00 to 16:00 (480-960) when courses is empty', () => {
    const res = computeRange([])
    expect(res).toEqual({ rangeStart: 480, rangeEnd: 960 })
  })

  it('keeps default range if courses fall within 08:00 - 16:00', () => {
    const courses: Course[] = [
      {
        id: '1',
        code: 'CS101',
        name: 'Intro',
        days: [0],
        start: 9 * 60, // 09:00
        end: 11 * 60,  // 11:00
        color: '#fff',
      },
    ]
    const res = computeRange(courses)
    expect(res).toEqual({ rangeStart: 480, rangeEnd: 960 })
  })

  it('expands to include the lab schedule', () => {
    const courses: Course[] = [
      {
        id: '1',
        code: 'CS101',
        name: 'Intro',
        days: [0],
        start: 9 * 60,
        end: 11 * 60,
        lab: { days: [4], start: 7 * 60, end: 21 * 60 + 30 },
        color: '#fff',
      },
    ]

    expect(computeRange(courses)).toEqual({ rangeStart: 420, rangeEnd: 1320 })
  })

  it('expands start to floor of early course (e.g. 07:15 -> 07:00 / 420)', () => {
    const courses: Course[] = [
      {
        id: '1',
        code: 'EARLY',
        name: 'Morning',
        days: [0],
        start: 7 * 60 + 15, // 07:15
        end: 9 * 60,
        color: '#fff',
      },
    ]
    const res = computeRange(courses)
    expect(res.rangeStart).toBe(7 * 60) // 420
    expect(res.rangeEnd).toBe(960)
  })

  it('expands end to ceil of late course (e.g. 21:30 -> 22:00 / 1320)', () => {
    const courses: Course[] = [
      {
        id: '1',
        code: 'LATE',
        name: 'Evening',
        days: [0],
        start: 19 * 60,
        end: 21 * 60 + 30, // 21:30
        color: '#fff',
      },
    ]
    const res = computeRange(courses)
    expect(res.rangeStart).toBe(480)
    expect(res.rangeEnd).toBe(22 * 60) // 1320
  })

  it('handles edge boundaries 00:00 and 24:00 (1440)', () => {
    const courses: Course[] = [
      {
        id: '1',
        code: 'ALL',
        name: 'Midnight',
        days: [0],
        start: 0,
        end: 1440,
        color: '#fff',
      },
    ]
    const res = computeRange(courses)
    expect(res).toEqual({ rangeStart: 0, rangeEnd: 1440 })
  })
})

describe('computePosition', () => {
  it('calculates accurate left and width percentages (worked example 09:30-11:00 on 480-960)', () => {
    // 08:00 - 16:00, span = 480
    // start 570 (09:30), end 660 (11:00)
    // left = (570 - 480)/480 * 100 = 18.75%
    // width = (660 - 570)/480 * 100 = 18.75%
    const pos = computePosition(570, 660, 480, 960)
    expect(pos.leftPct).toBeCloseTo(18.75, 4)
    expect(pos.widthPct).toBeCloseTo(18.75, 4)
  })

  it('calculates 14:30-16:00 (870-960) on 480-960', () => {
    // left = (870-480)/480 = 81.25%
    const pos = computePosition(870, 960, 480, 960)
    expect(pos.leftPct).toBeCloseTo(81.25, 3)
    expect(pos.widthPct).toBeCloseTo(18.75, 4)
  })
})

describe('computeHourLines & computeHalfHourTicks', () => {
  it('generates hour marks from rangeStart to rangeEnd inclusive', () => {
    const lines = computeHourLines(480, 600)
    expect(lines).toEqual([480, 540, 600])
  })

  it('generates half-hour ticks strictly between whole hours', () => {
    const ticks = computeHalfHourTicks(480, 600)
    expect(ticks).toEqual([510, 570])
  })
})
