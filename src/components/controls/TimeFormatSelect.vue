<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useSettingsStore } from '@/stores/settingsStore'
import type { TimeFormat } from '@/types'

const { t } = useI18n()
const settings = useSettingsStore()

const formats: TimeFormat[] = ['24h-intl', '12h', '24h-th']

function select(f: TimeFormat) {
  settings.setTimeFormat(f)
}
</script>

<template>
  <select
    :value="settings.timeFormat"
    @change="select(($event.target as HTMLSelectElement).value as TimeFormat)"
    class="h-8 max-w-36 px-2 text-xs font-inter bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer sm:max-w-none"
    :aria-label="t('timeFormat.label')"
  >
    <option v-for="f in formats" :key="f" :value="f">{{ t(`timeFormat.${f}`) }}</option>
  </select>
</template>
