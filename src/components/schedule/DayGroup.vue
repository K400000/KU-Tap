<script setup lang="ts">
import type { DayLayout } from '@/types'
import DayLabelCell from './DayLabelCell.vue'
import BlankCell from './BlankCell.vue'
import LaneRow from './LaneRow.vue'

const props = defineProps<{
  layout: DayLayout
  rangeStart: number
  rangeEnd: number
  exportMode?: boolean
}>()

function getLaneItems(lane: number) {
  return props.layout.items.filter((item) => item.lane === lane)
}
</script>

<template>
  <div
    class="flex flex-col"
    :style="{
      borderBottom: '1px solid var(--grid-line-strong)',
    }"
  >
    <div
      v-for="lane in layout.laneCount"
      :key="lane - 1"
      class="flex"
      :style="{
        borderBottom: lane < layout.laneCount ? '1px dashed var(--grid-line)' : 'none',
      }"
    >
      <!-- Left cell: day label for lane 0, blank gray cell for others -->
      <DayLabelCell v-if="lane === 1" :day="layout.day" :export-mode="exportMode" />
      <BlankCell v-else :export-mode="exportMode" />

      <!-- Timeline -->
      <LaneRow
        :lane="lane - 1"
        :items="getLaneItems(lane - 1)"
        :range-start="rangeStart"
        :range-end="rangeEnd"
      />
    </div>
  </div>
</template>
