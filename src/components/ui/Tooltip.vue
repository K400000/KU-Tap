<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps<{
  content: string
}>()

const show = ref(false)
const tooltipEl = ref<HTMLElement | null>(null)
let timeout: ReturnType<typeof setTimeout> | null = null

function open() {
  timeout = setTimeout(() => { show.value = true }, 400)
}
function close() {
  if (timeout) clearTimeout(timeout)
  show.value = false
}

onBeforeUnmount(() => { if (timeout) clearTimeout(timeout) })
</script>

<template>
  <span class="relative inline-flex" @mouseenter="open" @mouseleave="close" @focusin="open" @focusout="close">
    <slot />
    <Transition name="tt">
      <span
        v-if="show"
        ref="tooltipEl"
        role="tooltip"
        class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 px-2 py-1 rounded bg-gray-900 text-white text-xs whitespace-nowrap shadow-lg pointer-events-none font-inter"
      >
        {{ content }}
      </span>
    </Transition>
  </span>
</template>

<style scoped>
.tt-enter-active, .tt-leave-active { transition: opacity 0.15s }
.tt-enter-from, .tt-leave-to { opacity: 0 }
</style>

