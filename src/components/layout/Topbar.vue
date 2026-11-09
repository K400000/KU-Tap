<script setup lang="ts">
import ThemePicker from '@/components/controls/ThemePicker.vue'
import LanguageSwitch from '@/components/controls/LanguageSwitch.vue'
import TimeFormatSelect from '@/components/controls/TimeFormatSelect.vue'
import ExportMenu from '@/components/controls/ExportMenu.vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  canvasEl: HTMLElement | null
  showMenuButton?: boolean
}>()

const emit = defineEmits<{ openSidebar: [] }>()
const { t } = useI18n()
</script>

<template>
  <header
    class="z-10 flex min-h-12 shrink-0 flex-col gap-2 border-b border-gray-200 bg-white px-2 py-2 sm:h-12 sm:min-h-0 sm:flex-row sm:items-center sm:gap-3 sm:px-3 sm:py-0"
  >
    <div class="flex w-full items-center justify-between gap-2 sm:flex-1">
      <button
        v-if="showMenuButton"
        type="button"
        @click="emit('openSidebar')"
        :aria-label="t('aria.openSidebar')"
        class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-600 transition hover:bg-gray-100 lg:hidden"
      >
        <i class="bi bi-list text-xl" aria-hidden="true" />
      </button>

      <div class="hidden sm:block sm:flex-1" />
      <ThemePicker />
    </div>

    <div class="flex w-full items-center justify-end gap-2 sm:w-auto sm:gap-3">
      <TimeFormatSelect />
      <div class="hidden h-5 w-px bg-gray-200 sm:block" />
      <LanguageSwitch />
      <div class="hidden h-5 w-px bg-gray-200 sm:block" />
      <ExportMenu :canvas-el="canvasEl" />
    </div>
  </header>
</template>
