<script setup lang="ts">
import type { DayLayout } from '@/types'
import ScheduleHeader from './ScheduleHeader.vue'
import DayGroup from './DayGroup.vue'

const props = defineProps<{
  rangeStart: number
  rangeEnd: number
  dayLayouts: DayLayout[]
  exportMode?: boolean
}>()
</script>

<template>
  <div
    class="flex flex-col"
    style="min-width: 600px;"
    role="grid"
    aria-label="Weekly schedule grid"
  >
    <ScheduleHeader :range-start="rangeStart" :range-end="rangeEnd" :export-mode="exportMode" />
    <DayGroup
      v-for="layout in dayLayouts"
      :key="layout.day"
      :layout="layout"
      :range-start="rangeStart"
      :range-end="rangeEnd"
      :export-mode="exportMode"
    />
  </div>
</template>
