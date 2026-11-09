import type { ThemeId } from '@/types'

export interface ThemeTokens {
  id: ThemeId
  name: string // i18n key
  // Surface
  bg: string
  surface: string
  // Grid
  gridLine: string
  gridLineStrong: string
  // Header and day labels
  headerBg: string
  headerText: string
  dayLabelBg: string
  dayLabelText: string
  // Text
  text: string
  textMuted: string
  title: string
  // Special regions
  breakBg: string
  breakText: string
  collisionCellBg: string
  collisionCellPattern?: string
  // Shape and style
  radius: string
  cardStyle: 'solid' | 'tint-edge' | 'outline' | 'soft-outline'
  borderWidth: string
  shadow: string
  // Swatches
  palette: string[]
}

export const themes: Record<ThemeId, ThemeTokens> = {
  minimal: {
    id: 'minimal',
    name: 'theme.minimal',
    bg: '#FFFFFF',
    surface: '#FFFFFF',
    gridLine: '#CBD5E1',
    gridLineStrong: '#64748B',
    headerBg: '#F1F5F9',
    headerText: '#0F172A',
    dayLabelBg: '#E2E8F0',
    dayLabelText: '#0F172A',
    text: '#0F172A',
    textMuted: '#475569',
    title: '#0F172A',
    breakBg: '#F1F5F9',
    breakText: '#64748B',
    collisionCellBg: '#E2E8F0',
    collisionCellPattern:
      'repeating-linear-gradient(45deg, #CBD5E1 0px, #CBD5E1 1px, transparent 1px, transparent 7px)',
    radius: '8px',
    cardStyle: 'solid',
    borderWidth: '1px',
    shadow: '0 2px 4px rgba(0,0,0,0.06)',
    palette: [
      '#2563EB', '#4F46E5', '#7C3AED', '#9333EA',
      '#DC2626', '#EA580C', '#D97706', '#059669',
      '#0D9488', '#0284C7', '#475569', '#1E293B',
    ],
  },
  dark: {
    id: 'dark',
    name: 'theme.dark',
    bg: '#0B0F19',
    surface: '#111827',
    gridLine: '#1F2937',
    gridLineStrong: '#374151',
    headerBg: '#111827',
    headerText: '#F9FAFB',
    dayLabelBg: '#1F2937',
    dayLabelText: '#F3F4F6',
    text: '#F9FAFB',
    textMuted: '#9CA3AF',
    title: '#FFFFFF',
    breakBg: '#161F30',
    breakText: '#6B7280',
    collisionCellBg: '#151D2C',
    collisionCellPattern:
      'repeating-linear-gradient(45deg, #1F2937 0px, #1F2937 2px, transparent 2px, transparent 8px)',
    radius: '10px',
    cardStyle: 'solid',
    borderWidth: '1px',
    shadow: '0 4px 10px rgba(0,0,0,0.4)',
    palette: [
      '#6366F1', '#8B5CF6', '#EC4899', '#EF4444',
      '#F97316', '#F59E0B', '#10B981', '#06B6D4',
      '#3B82F6', '#A78BFA', '#34D399', '#FB923C',
    ],
  },
  earth: {
    id: 'earth',
    name: 'theme.earth',
    bg: '#F5EFEB',
    surface: '#FDFBF7',
    gridLine: '#DECFC1',
    gridLineStrong: '#BCA893',
    headerBg: '#594031',
    headerText: '#FDFBF7',
    dayLabelBg: '#E8DBCF',
    dayLabelText: '#3B291D',
    text: '#3B291D',
    textMuted: '#786253',
    title: '#3B291D',
    breakBg: '#EDE2D7',
    breakText: '#9A8270',
    collisionCellBg: '#E3D4C4',
    collisionCellPattern:
      'repeating-linear-gradient(45deg, #D4C1AE 0px, #D4C1AE 2px, transparent 2px, transparent 8px)',
    radius: '8px',
    cardStyle: 'solid',
    borderWidth: '1px',
    shadow: '0 2px 4px rgba(59,41,29,0.1)',
    palette: [
      '#854D0E', '#78350F', '#9A3412', '#A16207',
      '#365314', '#166534', '#155E75', '#3B291D',
      '#B45309', '#C2410C', '#4D443D', '#635348',
    ],
  },
  candy: {
    id: 'candy',
    name: 'theme.candy',
    bg: '#F0F9FF',
    surface: '#FFFFFF',
    gridLine: '#CFE3EF',
    gridLineStrong: '#7AA2B8',
    headerBg: '#0C4A6E',
    headerText: '#FFFFFF',
    dayLabelBg: '#DCEEF7',
    dayLabelText: '#123B52',
    text: '#102A43',
    textMuted: '#486A7D',
    title: '#075985',
    breakBg: '#EAF5FA',
    breakText: '#52798E',
    collisionCellBg: '#E5F0F5',
    collisionCellPattern:
      'repeating-linear-gradient(45deg, #CFE3EF 0px, #CFE3EF 1px, transparent 1px, transparent 7px)',
    radius: '10px',
    cardStyle: 'solid',
    borderWidth: '1px',
    shadow: '0 3px 6px rgba(12,74,110,0.12)',
    palette: [
      '#2563EB', '#0F766E', '#0284C7', '#059669',
      '#D97706', '#DC2626', '#1D4ED8', '#475569',
      '#0D9488', '#166534', '#EA580C', '#4B5563',
    ],
  },
  office: {
    id: 'office',
    name: 'theme.office',
    bg: '#F8FAFC',
    surface: '#FFFFFF',
    gridLine: '#CBD5E1',
    gridLineStrong: '#64748B',
    headerBg: '#0F3460',
    headerText: '#FFFFFF',
    dayLabelBg: '#E2E8F0',
    dayLabelText: '#0F2942',
    text: '#0F2942',
    textMuted: '#475569',
    title: '#0F3460',
    breakBg: '#F1F5F9',
    breakText: '#64748B',
    collisionCellBg: '#E2E8F0',
    collisionCellPattern:
      'repeating-linear-gradient(45deg, #CBD5E1 0px, #CBD5E1 2px, transparent 2px, transparent 7px)',
    radius: '4px',
    cardStyle: 'solid',
    borderWidth: '1px',
    shadow: 'none',
    palette: [
      '#0F3460', '#1E3A8A', '#1E40AF', '#065F46',
      '#991B1B', '#92400E', '#374151', '#111827',
      '#0284C7', '#0D9488', '#B45309', '#4B5563',
    ],
  },
  outline: {
    id: 'outline',
    name: 'theme.outline',
    bg: '#FFFFFF',
    surface: '#FFFFFF',
    gridLine: '#E2E8F0',
    gridLineStrong: '#94A3B8',
    headerBg: '#F8FAFC',
    headerText: '#1E293B',
    dayLabelBg: '#F1F5F9',
    dayLabelText: '#1E293B',
    text: '#1E293B',
    textMuted: '#64748B',
    title: '#0F172A',
    breakBg: '#F8FAFC',
    breakText: '#94A3B8',
    collisionCellBg: '#F1F5F9',
    collisionCellPattern:
      'repeating-linear-gradient(45deg, #E2E8F0 0px, #E2E8F0 1px, transparent 1px, transparent 7px)',
    radius: '6px',
    cardStyle: 'soft-outline',
    borderWidth: '2px',
    shadow: '0 2px 5px rgba(15,23,42,0.08)',
    palette: [
      '#2563EB', '#4F46E5', '#7C3AED', '#9333EA',
      '#DC2626', '#EA580C', '#D97706', '#059669',
      '#0D9488', '#0284C7', '#475569', '#1E293B',
    ],
  },
}

export const themeList = Object.values(themes)

export function getThemeCourseColor(color: string, themeId: ThemeId): string {
  const activeTheme = themes[themeId]
  if (activeTheme.palette.some((paletteColor) => paletteColor.toUpperCase() === color.toUpperCase())) {
    return color
  }

  const paletteIndex = themeList
    .map((theme) => theme.palette.indexOf(color.toUpperCase()))
    .find((index) => index >= 0)

  return paletteIndex === undefined
    ? color
    : activeTheme.palette[paletteIndex] ?? color
}
