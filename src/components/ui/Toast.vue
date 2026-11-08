<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Props {
  message: string
  type?: 'info' | 'success' | 'error' | 'warning'
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  duration: 3500,
})

const emit = defineEmits<{ close: [] }>()
const visible = ref(false)

onMounted(() => {
  visible.value = true
  setTimeout(() => {
    visible.value = false
    setTimeout(() => emit('close'), 300)
  }, props.duration)
})
</script>

<template>
  <Transition name="toast">
    <div
      v-if="visible"
      role="status"
      aria-live="polite"
      :class="[
        'flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-inter max-w-sm w-full',
        type === 'success' && 'bg-emerald-600 text-white',
        type === 'error' && 'bg-red-600 text-white',
        type === 'warning' && 'bg-amber-500 text-white',
        type === 'info' && 'bg-gray-900 text-white',
      ]"
    >
      <span class="flex-1">{{ message }}</span>
      <button
        class="opacity-70 hover:opacity-100 transition-opacity text-current"
        @click="visible = false"
        aria-label="Close"
      ><i class="bi bi-x-lg" aria-hidden="true" /></button>
    </div>
  </Transition>
</template>

<style scoped>
.toast-enter-active, .toast-leave-active {
  transition: all 0.25s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
