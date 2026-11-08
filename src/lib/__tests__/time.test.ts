import { describe, it, expect } from 'vitest'
import { formatTime, formatRange, generateTimeOptions } from '../time'

describe('formatTime', () => {
  describe('24h-intl format', () => {
    it('formats standard times', () => {
      expect(formatTime(570, '24h-intl')).toBe('09:30')
      expect(formatTime(780, '24h-intl')).toBe('13:00')
      expect(formatTime(0, '24h-intl')).toBe('00:00')
    })

    it('formats 1440 as 24:00', () => {
      expect(formatTime(1440, '24h-intl')).toBe('24:00')
    })
  })

  describe('24h-th format', () => {
    it('formats standard times with dot separator', () => {
      expect(formatTime(570, '24h-th')).toBe('09.30')
      expect(formatTime(780, '24h-th')).toBe('13.00')
    })

    it('includes suffix " น." when suffix: true', () => {
      expect(formatTime(570, '24h-th', { suffix: true })).toBe('09.30 น.')
      expect(formatTime(1440, '24h-th', { suffix: true })).toBe('24.00 น.')
    })
  })

  describe('12h format', () => {
    it('formats AM times', () => {
      expect(formatTime(480, '12h')).toBe('8 AM')
      expect(formatTime(570, '12h')).toBe('9:30 AM')
    })

    it('formats PM times', () => {
      expect(formatTime(720, '12h')).toBe('12 PM')
      expect(formatTime(780, '12h')).toBe('1 PM')
      expect(formatTime(870, '12h')).toBe('2:30 PM')
    })

    it('handles midnight 00:00 and 24:00 as 12 AM', () => {
      expect(formatTime(0, '12h')).toBe('12 AM')
      expect(formatTime(1440, '12h')).toBe('12 AM')
    })
  })
})

describe('formatRange', () => {
  it('formats range in 24h-intl', () => {
    expect(formatRange(570, 660, '24h-intl')).toBe('09:30 - 11:00')
  })

  it('formats range in 24h-th with suffix placed once at the end', () => {
    expect(formatRange(570, 660, '24h-th')).toBe('09.30 - 11.00 น.')
  })

  it('formats range in 12h', () => {
    expect(formatRange(570, 660, '12h')).toBe('9:30 AM - 11 AM')
  })
})

describe('generateTimeOptions', () => {
  it('generates options at 30-min intervals from 0 to 1440 inclusive', () => {
    const opts = generateTimeOptions()
    expect(opts[0]).toBe(0)
    expect(opts[opts.length - 1]).toBe(1440)
    expect(opts.length).toBe(49) // 24 * 2 + 1
    expect(opts[1]! - opts[0]!).toBe(30)
  })
})

