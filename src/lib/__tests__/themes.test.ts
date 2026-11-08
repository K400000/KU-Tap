import { describe, expect, it } from 'vitest'
import { getThemeCourseColor, themes } from '../themes'

describe('theme course colors', () => {
  it('uses the corresponding palette color when the schedule theme changes', () => {
    const color = themes.minimal.palette[0]!

    expect(getThemeCourseColor(color, 'dark')).toBe(themes.dark.palette[0])
    expect(getThemeCourseColor(color, 'earth')).toBe(themes.earth.palette[0])
  })

  it('keeps custom colors unchanged', () => {
    expect(getThemeCourseColor('#123456', 'dark')).toBe('#123456')
  })
})
