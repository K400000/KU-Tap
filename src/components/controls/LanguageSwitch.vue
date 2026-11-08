<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useSettingsStore } from '@/stores/settingsStore'
import type { Locale } from '@/types'

const { t, locale } = useI18n()
const settings = useSettingsStore()

function toggle() {
  const next: Locale = settings.locale === 'th' ? 'en' : 'th'
  settings.setLocale(next)
  locale.value = next
  document.documentElement.lang = next
}
</script>

<template>
  <button
    type="button"
    @click="toggle"
    :title="t('language.label')"
    :aria-label="t('aria.toggleLanguage')"
    class="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition font-inter"
  >
    <i class="bi bi-globe2 text-sm" aria-hidden="true" />
    <span>{{ settings.locale === 'th' ? 'TH' : 'EN' }}</span>
  </button>
</template>
