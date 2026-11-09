import type { TimeFormat } from '@/types'

export const TIME_STEP = 30 // minutes
export const DAY_START_DEFAULT = 8 * 60   // 480
export const DAY_END_DEFAULT   = 17 * 60  // 1020

/**
 * Format minutes-since-midnight to a display string.
 * 1440 is accepted as a valid end time (displays as 24:00 / 24.00 น. / 12 AM).
 */
export function formatTime(
  min: number,
  fmt: TimeFormat,
  opts: { suffix?: boolean } = {},
): string {
  const h = Math.floor(min / 60) % 24
  const m = min % 60
  const mm = m.toString().padStart(2, '0')

  if (fmt === '24h-intl') {
    const hh = (min === 1440 ? 24 : h).toString().padStart(2, '0')
    return `${hh}:${mm}`
  }

  if (fmt === '24h-th') {
    const hh = (min === 1440 ? 24 : h).toString().padStart(2, '0')
    const base = `${hh}.${mm}`
    return opts.suffix ? `${base} น.` : base
  }

  // 12h
  if (min === 1440) return '12 AM'
  const period = h < 12 ? 'AM' : 'PM'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return m === 0 ? `${h12} ${period}` : `${h12}:${mm} ${period}`
}

/**
 * Format a time range (start..end) according to the active format.
 * Thai format puts น. once at the end.
 */
export function formatRange(start: number, end: number, fmt: TimeFormat): string {
  if (fmt === '24h-th') {
    return `${formatTime(start, fmt)} - ${formatTime(end, fmt, { suffix: true })}`
  }
  return `${formatTime(start, fmt)} - ${formatTime(end, fmt)}`
}

/** Generate all 30-minute time options as minute values */
export function generateTimeOptions(): number[] {
  const opts: number[] = []
  for (let m = 0; m <= 1440; m += TIME_STEP) {
    opts.push(m)
  }
  return opts
}
