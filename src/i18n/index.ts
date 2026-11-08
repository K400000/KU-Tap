import { createI18n } from 'vue-i18n'
import type { Locale } from '@/types'
import en from './en.json'
import th from './th.json'

function detectLocale(): Locale {
  const lang = navigator.language || ''
  return lang.startsWith('th') ? 'th' : 'en'
}

export const i18n = createI18n({
  legacy: false,
  locale: detectLocale(),
  fallbackLocale: 'en',
  messages: { en, th },
})

export type MessageSchema = typeof en

