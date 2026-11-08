<script setup lang="ts">
import { computed } from 'vue'
import { useTimeFormat } from '@/composables/useTimeFormat'
import { computeHourLines, computePosition } from '@/lib/range'

const props = defineProps<{
  rangeStart: number
  rangeEnd: number
  exportMode?: boolean
}>()

const { format } = useTimeFormat()

const hourLines = computed(() => computeHourLines(props.rangeStart, props.rangeEnd))

function getPct(m: number) {
  return ((m - props.rangeStart) / (props.rangeEnd - props.rangeStart)) * 100
}

</script>

<template>
  <div
    class="relative flex"
    :style="{
      background: 'var(--header-bg)',
      borderBottom: '2px solid var(--grid-line-strong)',
      minHeight: '36px',
    }"
  >
    <!-- Day-label column spacer (sticky on horizontal scroll) -->
    <div
      :class="['left-0 z-10 shrink-0', !exportMode && 'sticky']"
      :style="{
        width: '52px',
        background: 'var(--header-bg)',
        borderRight: '1px solid var(--grid-line-strong)',
      }"
    />

    <!-- Hour labels & lunch indicator -->
    <div class="flex-1 relative">
      <!-- Hourly markers -->
      <div
        v-for="line in hourLines"
        :key="line"
        class="absolute top-0 bottom-0 flex items-center pointer-events-none"
        :style="{ left: `${getPct(line)}%` }"
      >
        <span
          class="text-xs font-inter tabular-nums font-bold translate-x-1"
          :style="{ color: 'var(--header-text)' }"
        >
          {{ format(line) }}
        </span>
        <!-- Vertical rule -->
        <div
          class="absolute top-0 bottom-0 w-px"
          :style="{ left: '0', background: 'var(--grid-line-strong)' }"
          aria-hidden="true"
        />
      </div>
    </div>
  </div>
</template>
