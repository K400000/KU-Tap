<script setup lang="ts">
import { computed } from 'vue'
import { computePosition } from '@/lib/range'

const props = defineProps<{
  rangeStart: number
  rangeEnd: number
}>()

// 12:00-13:00 lunch band
const lunchStart = 12 * 60 // 720
const lunchEnd   = 13 * 60 // 780

const bandVisible = computed(() => {
  const start = Math.max(props.rangeStart, lunchStart)
  const end   = Math.min(props.rangeEnd,   lunchEnd)
  return start < end ? { start, end } : null
})

const bandStyle = computed(() => {
  if (!bandVisible.value) return {}
  const { leftPct, widthPct } = computePosition(
    bandVisible.value.start, bandVisible.value.end,
    props.rangeStart, props.rangeEnd,
  )
  return { left: `${leftPct}%`, width: `${widthPct}%` }
})
</script>

<template>
  <div
    v-if="bandVisible"
    :style="bandStyle"
    class="absolute inset-y-0 pointer-events-none z-0"
    style="background: var(--break-bg); transition: left 200ms ease, width 200ms ease;"
    aria-hidden="true"
  />
</template>

