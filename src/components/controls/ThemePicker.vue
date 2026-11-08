<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useSettingsStore } from '@/stores/settingsStore'
import { themeList } from '@/lib/themes'
import type { ThemeId } from '@/types'

const { t } = useI18n()
const settings = useSettingsStore()

function selectTheme(id: ThemeId) {
  settings.setTheme(id)
}
</script>

<template>
  <div class="flex items-center gap-1.5">
    <span class="text-xs text-gray-500 font-inter mr-1 hidden lg:inline">{{ t('theme.label') }}</span>
    <button
      v-for="theme in themeList"
      :key="theme.id"
      type="button"
      :title="t(theme.name)"
      :aria-label="t(theme.name)"
      :aria-pressed="settings.theme === theme.id"
      @click="selectTheme(theme.id)"
      :class="[
        'w-7 h-7 rounded-lg border transition-all duration-150 hover:scale-110 active:scale-95 overflow-hidden shadow-2xs cursor-pointer relative',
        settings.theme === theme.id ? 'border-indigo-600 ring-2 ring-indigo-300 scale-105' : 'border-gray-300 hover:border-gray-400',
      ]"
      :style="{ background: theme.bg }"
    >
      <!-- Mini swatch preview -->
      <div class="w-full h-full relative pointer-events-none">
        <div class="absolute inset-x-0 top-0 h-2.5" :style="{ background: theme.headerBg }" />
        <div class="absolute bottom-1 left-1 w-2.5 h-2.5 rounded-xs" :style="{ background: theme.palette[0] }" />
      </div>
    </button>
  </div>
</template>
