<script setup lang="ts">
const props = defineProps<{
  modelValue: number | undefined
  min?: number
  max?: number
  step?: number
  id?: string
  required?: boolean
}>()

const emit = defineEmits<{ 'update:modelValue': [v: number | undefined] }>()

function decrement() {
  const current = props.modelValue ?? 0
  const step = props.step ?? 0.5
  const min = props.min ?? 0
  const val = Math.max(min, Math.round((current - step) * 10) / 10)
  emit('update:modelValue', val)
}

function increment() {
  const current = props.modelValue ?? 0
  const step = props.step ?? 0.5
  const max = props.max ?? 8
  const val = Math.min(max, Math.round((current + step) * 10) / 10)
  emit('update:modelValue', val)
}

function onChange(e: Event) {
  const v = (e.target as HTMLInputElement).value
  if (v === '') { emit('update:modelValue', undefined); return }
  const n = parseFloat(v)
  if (!isNaN(n)) emit('update:modelValue', n)
}
</script>

<template>
  <div class="inline-flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white shadow-xs focus-within:ring-2 focus-within:ring-indigo-400 focus-within:border-indigo-400">
    <button
      type="button"
      @click="decrement"
      class="w-8 h-9 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600 transition font-mono text-base disabled:opacity-40 disabled:cursor-not-allowed select-none"
      :disabled="(modelValue ?? 0) <= (min ?? 0)"
    >−</button>
    <input
      :id="id"
      type="number"
      :value="modelValue ?? ''"
      :min="min ?? 0"
      :max="max ?? 8"
      :step="step ?? 0.5"
      :required="required"
      @change="onChange"
      class="w-12 text-center h-9 text-sm font-inter text-gray-800 focus:outline-none tabular-nums bg-transparent border-x border-gray-200"
      placeholder="—"
    />
    <button
      type="button"
      @click="increment"
      class="w-8 h-9 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600 transition font-mono text-base disabled:opacity-40 disabled:cursor-not-allowed select-none"
      :disabled="(modelValue ?? 0) >= (max ?? 12)"
    >+</button>
  </div>
</template>
