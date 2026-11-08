<script setup lang="ts">
import { computed } from 'vue'
import { computePosition, computeHourLines } from '@/lib/range'
import type { PlacedOccurrence } from '@/types'
import CourseCard from './CourseCard.vue'
import BreakBand from './BreakBand.vue'
import { useScheduleStore } from '@/stores/scheduleStore'

const props = defineProps<{
  lane: number
  items: PlacedOccurrence[]  // items for this lane
  rangeStart: number
  rangeEnd: number
}>()

const store = useScheduleStore()

const hourLines = computed(() => computeHourLines(props.rangeStart, props.rangeEnd))

function getPct(m: number) {
  return ((m - props.rangeStart) / (props.rangeEnd - props.rangeStart)) * 100
}

function getPosition(item: PlacedOccurrence) {
  return computePosition(item.start, item.end, props.rangeStart, props.rangeEnd)
}

function selectCard(courseId: string) {
  store.select(courseId)
}
</script>

<template>
  <div
    class="flex-1 relative overflow-hidden"
    style="height: var(--lane-height, 72px); background: var(--surface);"
  >
    <!-- Break band (12:00 - 13:00) -->
    <BreakBand :range-start="rangeStart" :range-end="rangeEnd" />

    <!-- Whole-hour lines only (no .30 half-hour ticks to keep grid clean) -->
    <div
      v-for="line in hourLines"
      :key="line"
      class="absolute inset-y-0 w-px pointer-events-none"
      :style="{
        left: `${getPct(line)}%`,
        background: 'var(--grid-line-strong)',
      }"
      aria-hidden="true"
    />

    <!-- Course cards for this lane -->
    <TransitionGroup name="card">
      <CourseCard
        v-for="item in items"
        :key="item.courseId + '-' + item.day + '-' + (item.section ?? 'lec')"
        :occurrence="item"
        :left-pct="getPosition(item).leftPct"
        :width-pct="getPosition(item).widthPct"
        @select="selectCard"
      />
    </TransitionGroup>
  </div>
</template>

<style scoped>
.card-enter-active {
  transition: opacity 180ms ease, transform 180ms ease;
}
.card-enter-from {
  opacity: 0;
  transform: translateY(4px);
}
.card-leave-active {
  transition: opacity 150ms ease, transform 150ms ease;
}
.card-leave-to {
  opacity: 0;
  transform: scale(0.96);
}
</style>
