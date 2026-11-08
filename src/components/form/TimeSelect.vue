<script setup lang="ts">
import { computed } from 'vue'
import { useTimeFormat } from '@/composables/useTimeFormat'
import { generateTimeOptions } from '@/lib/time'

const props = defineProps<{
  modelValue: number
  min?: number  // options below this are disabled (for end time)
  max?: number
  id?: string
}>()

const emit = defineEmits<{ 'update:modelValue': [v: number] }>()
const { format } = useTimeFormat()
const options = generateTimeOptions()

const filteredOptions = computed(() => {
  return options.filter((o) => {
    if (props.max !== undefined && o > props.max) return false
    return true
  })
})

function isDisabled(opt: number) {
  if (props.min !== undefined && opt <= props.min) return true
  return false
}

function onChange(e: Event) {
  emit('update:modelValue', Number((e.target as HTMLSelectElement).value))
}
</script>

<template>
  <div class="relative w-full">
    <select
      :id="id"
      :value="modelValue"
      @change="onChange"
      class="w-full h-9 pl-3 pr-8 text-sm font-inter text-gray-800 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition tabular-nums cursor-pointer shadow-xs appearance-none"
    >
      <option
        v-for="opt in filteredOptions"
        :key="opt"
        :value="opt"
        :disabled="isDisabled(opt)"
      >
        {{ format(opt) }}
      </option>
    </select>
    <div class="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-gray-400">
      <i class="bi bi-chevron-down text-xs" aria-hidden="true" />
    </div>
  </div>
</template>
