<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { onClickOutside } from '@vueuse/core'
import { useExport } from '@/composables/useExport'
import type { ExportFormat, ExportScale } from '@/types'

const props = defineProps<{
  canvasEl: HTMLElement | null
}>()

const { t } = useI18n()
const { isExporting, exportError, exportSchedule } = useExport()

const scale = ref<ExportScale>(2)
const open = ref(false)
const menuRef = ref<HTMLElement | null>(null)

onClickOutside(menuRef, () => {
  open.value = false
})

async function doExport(format: ExportFormat) {
  if (!props.canvasEl) return
  open.value = false
  await exportSchedule(props.canvasEl, format, scale.value)
}
</script>

<template>
  <div ref="menuRef" class="relative">
    <button
      type="button"
      @click="open = !open"
      :disabled="isExporting"
      :aria-label="t('aria.exportMenu')"
      class="flex items-center gap-1.5 h-8 px-3 text-sm font-kanit font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 active:bg-indigo-800 transition disabled:opacity-60 disabled:cursor-wait"
    >
      <span v-if="isExporting" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      <i v-else class="bi bi-download" aria-hidden="true" />
      <span class="hidden sm:inline">{{ isExporting ? t('export.exporting') : t('export.label') }}</span>
    </button>

    <!-- Dropdown -->
    <Transition name="dropdown">
      <div
        v-if="open && !isExporting"
        class="absolute right-0 top-full mt-1.5 z-50 bg-white border border-gray-200 rounded-xl shadow-xl p-3 min-w-[200px]"
      >
        <!-- Scale -->
        <div class="mb-3">
          <div class="text-xs font-medium text-gray-500 mb-1.5 font-inter">{{ t('export.scale') }}</div>
          <div class="flex gap-1.5">
            <button
              v-for="s in [2, 3]"
              :key="s"
              type="button"
              @click="scale = s as ExportScale"
              :class="[
                'flex-1 py-1 text-xs rounded-lg border font-inter transition',
                scale === s ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50',
              ]"
            >{{ t(`export.scale${s}x`) }}</button>
          </div>
        </div>

        <!-- Format buttons -->
        <div class="space-y-1">
          <button
            v-for="fmt in ['png', 'jpg', 'pdf']"
            :key="fmt"
            type="button"
            @click="doExport(fmt as ExportFormat)"
            class="w-full text-left px-3 py-2 text-sm font-inter rounded-lg hover:bg-indigo-50 hover:text-indigo-700 transition"
          >{{ t(`export.${fmt}`) }}</button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.dropdown-enter-active, .dropdown-leave-active { transition: opacity 150ms, transform 150ms }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-6px) }
</style>
