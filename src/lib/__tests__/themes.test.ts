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

  it('does not remap an exact color available in the active palette', () => {
    expect(getThemeCourseColor('#DC2626', 'candy')).toBe('#DC2626')
  })

  it('adds a white outlined theme with the same course colors', () => {
    expect(themes.outline.bg).toBe('#FFFFFF')
    expect(themes.outline.cardStyle).toBe('soft-outline')
    expect(themes.outline.palette).toEqual(themes.minimal.palette)
  })
})
