/**
 * Compute relative luminance of a hex color per WCAG 2.1
 */
export function relativeLuminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255

  const toLinear = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)

  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
}

/**
 * Contrast ratio between two colors (WCAG)
 */
export function contrastRatio(hex1: string, hex2: string): number {
  const l1 = relativeLuminance(hex1)
  const l2 = relativeLuminance(hex2)
  const lighter = Math.max(l1, l2)
  const darker  = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Returns '#FFFFFF' or '#111111' — whichever gives higher contrast against bg.
 * If neither meets 4.5:1, we nudge by returning the best available.
 */
export function autoTextColor(bgHex: string): string {
  const onWhite = contrastRatio(bgHex, '#FFFFFF')
  const onBlack = contrastRatio(bgHex, '#111111')
  return onWhite >= onBlack ? '#FFFFFF' : '#111111'
}

/**
 * Returns a low-alpha tint of the color for use in tint-edge/outline card styles.
 * alpha is 0-1.
 */
export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

