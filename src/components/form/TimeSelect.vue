<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: number
  allowEndOfDay?: boolean
  id?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
  invalid: [value: boolean]
  blur: []
}>()

const hours = computed(() => {
  const lastHour = props.allowEndOfDay ? 24 : 23
  return Array.from({ length: lastHour + 1 }, (_, hour) => hour)
})

const hourValue = computed(() => props.modelValue === 1440 ? 24 : Math.floor(props.modelValue / 60))
const minuteValue = computed(() => props.modelValue % 60)

function updateTime(hour: number, minute: number) {
  const adjustedMinute = hour === 24 ? 0 : minute
  const value = hour * 60 + adjustedMinute
  emit('update:modelValue', value)
  emit('invalid', false)
}

function onHourChange(event: Event) {
  updateTime(Number((event.target as HTMLSelectElement).value), minuteValue.value)
}

function onMinuteChange(event: Event) {
  updateTime(hourValue.value, Number((event.target as HTMLSelectElement).value))
}
</script>

<template>
  <div class="flex w-full items-center gap-1.5">
    <select
      :id="id"
      :value="hourValue"
      aria-label="Hour"
      class="h-9 min-w-0 flex-1 appearance-none rounded-lg border border-gray-300 bg-white px-2 text-center text-sm font-inter tabular-nums text-gray-800 shadow-xs transition focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      @change="onHourChange"
      @blur="emit('blur')"
    >
      <option v-for="hour in hours" :key="hour" :value="hour">
        {{ String(hour).padStart(2, '0') }}
      </option>
    </select>
    <span class="font-inter text-sm font-semibold text-gray-500" aria-hidden="true">:</span>
    <select
      :id="id ? `${id}-minute` : undefined"
      :value="minuteValue"
      aria-label="Minute"
      class="h-9 min-w-0 flex-1 appearance-none rounded-lg border border-gray-300 bg-white px-2 text-center text-sm font-inter tabular-nums text-gray-800 shadow-xs transition focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      @change="onMinuteChange"
      @blur="emit('blur')"
    >
      <option :value="0">00</option>
      <option :value="30" :disabled="hourValue === 24">30</option>
    </select>
  </div>
</template>
