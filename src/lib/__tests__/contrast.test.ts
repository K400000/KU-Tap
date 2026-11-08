import { describe, it, expect } from 'vitest'
import { relativeLuminance, contrastRatio, autoTextColor, hexToRgba } from '../contrast'

describe('contrast utilities', () => {
  it('calculates relative luminance correctly', () => {
    expect(relativeLuminance('#000000')).toBeCloseTo(0, 4)
    expect(relativeLuminance('#FFFFFF')).toBeCloseTo(1, 4)
  })

  it('calculates maximum contrast ratio (21:1) between black and white', () => {
    const ratio = contrastRatio('#FFFFFF', '#000000')
    expect(ratio).toBeCloseTo(21, 1)
  })

  it('selects #FFFFFF for dark backgrounds and #111111 for light backgrounds', () => {
    expect(autoTextColor('#000000')).toBe('#FFFFFF')
    expect(autoTextColor('#1E1B4B')).toBe('#FFFFFF')
    expect(autoTextColor('#1F4E79')).toBe('#FFFFFF')

    expect(autoTextColor('#FFFFFF')).toBe('#111111')
    expect(autoTextColor('#FFF8E7')).toBe('#111111')
    expect(autoTextColor('#FCD34D')).toBe('#111111')
  })

  it('converts hex to rgba string accurately', () => {
    expect(hexToRgba('#6366F1', 0.15)).toBe('rgba(99,102,241,0.15)')
  })
})

