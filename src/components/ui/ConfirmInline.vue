<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  label: string
  confirmLabel?: string
  cancelLabel?: string
}>()

const emit = defineEmits<{ confirm: [] }>()
const confirming = ref(false)

function handleClick() {
  if (!confirming.value) {
    confirming.value = true
    setTimeout(() => { confirming.value = false }, 3500)
  } else {
    confirming.value = false
    emit('confirm')
  }
}
</script>

<template>
  <button
    type="button"
    @click="handleClick"
    :class="[
      'h-9 px-3 text-xs font-kanit font-medium rounded-lg transition-all duration-150 inline-flex items-center justify-center gap-1.5 cursor-pointer',
      confirming
        ? 'bg-red-600 text-white shadow-sm ring-2 ring-red-400'
        : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200',
    ]"
  >
    <span v-if="!confirming"><i class="bi bi-trash3 mr-1" aria-hidden="true" />{{ label }}</span>
    <span v-else class="font-semibold animate-pulse"><i class="bi bi-exclamation-triangle-fill mr-1" aria-hidden="true" />{{ confirmLabel ?? 'Confirm Delete?' }}</span>
  </button>
</template>
