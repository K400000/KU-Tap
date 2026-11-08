<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { DayId } from '@/types'

const props = defineProps<{
  modelValue: DayId[]
}>()

const emit = defineEmits<{
  'update:modelValue': [days: DayId[]]
}>()

const { t } = useI18n()
const days: DayId[] = [0, 1, 2, 3, 4, 5, 6]

function toggle(day: DayId) {
  const current = [...props.modelValue]
  const idx = current.indexOf(day)
  if (idx === -1) {
    current.push(day)
  } else {
    current.splice(idx, 1)
  }
  emit('update:modelValue', current.sort((a, b) => a - b) as DayId[])
}

function isSelected(day: DayId) {
  return props.modelValue.includes(day)
}
</script>

<template>
  <div class="grid grid-cols-7 gap-1.5 w-full" role="group" :aria-label="t('form.days')">
    <button
      v-for="day in days"
      :key="day"
      type="button"
      :aria-pressed="isSelected(day)"
      :aria-label="t(`day.full.${day}`)"
      @click="toggle(day)"
      :class="[
        'h-9 w-full flex items-center justify-center rounded-lg text-xs font-kanit font-semibold transition-all duration-150 active:scale-95 select-none',
        isSelected(day)
          ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-400 ring-offset-1'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 border border-transparent',
      ]"
    >
      {{ t(`day.${day}`) }}
    </button>
  </div>
</template>
