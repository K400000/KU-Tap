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
  <header class="h-12 flex items-center px-3 gap-3 bg-white border-b border-gray-200 shrink-0 z-10">
    <!-- Mobile menu button -->
    <button
      v-if="showMenuButton"
      type="button"
      @click="emit('openSidebar')"
      :aria-label="t('aria.openSidebar')"
      class="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition text-gray-600"
    >
      <i class="bi bi-list text-xl" aria-hidden="true" />
    </button>

    <!-- Spacer -->
    <div class="flex-1" />

    <!-- Controls -->
    <ThemePicker />
    <div class="w-px h-5 bg-gray-200" />
    <TimeFormatSelect />
    <div class="w-px h-5 bg-gray-200" />
    <LanguageSwitch />
    <div class="w-px h-5 bg-gray-200" />
    <ExportMenu :canvas-el="canvasEl" />
  </header>
</template>
