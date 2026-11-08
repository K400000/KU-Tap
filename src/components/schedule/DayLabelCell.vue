<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { DayId } from '@/types'

defineProps<{
  day: DayId
  exportMode?: boolean
}>()

const { t } = useI18n()
</script>

<template>
  <div
    :class="['left-0 z-10 flex items-center justify-center font-kanit font-semibold text-sm select-none shrink-0', !exportMode && 'sticky']"
    :style="{
      background: 'var(--day-label-bg)',
      color: 'var(--day-label-text)',
      minWidth: '52px',
      width: '52px',
      borderRight: '1px solid var(--grid-line-strong)',
    }"
  >
    {{ t(`day.${day}`) }}
  </div>
</template>
