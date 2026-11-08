<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTimeFormat } from '@/composables/useTimeFormat'
import type { PlacedOccurrence, Course } from '@/types'

const props = defineProps<{
  occurrence: PlacedOccurrence
  course: Course
  widthPct: number  // used to determine content tier
}>()

const { formatRange } = useTimeFormat()
const { t } = useI18n()
const range = computed(() => formatRange(props.occurrence.start, props.occurrence.end))

// Content tier is approximated by widthPct relative to the full range
// We use a reactive container approach: render all and CSS clamps the rest
// Approximate: total grid is ~1200px, so 1% ~ 12px
const approxPx = computed(() => props.widthPct * 12)
const tier = computed(() => {
  const px = approxPx.value
  if (px >= 160) return 'full'
  if (px >= 100) return 'mid'
  if (px >= 56)  return 'compact'
  return 'tiny'
})
</script>

<template>
  <div
    class="flex h-full min-w-0 flex-col justify-center gap-0.5 overflow-hidden px-2.5 py-1 text-left"
    style="line-height: 1.15"
  >
    <div class="flex min-w-0 items-center justify-between gap-1.5">
      <span class="min-w-0 truncate whitespace-nowrap font-kanit text-xs font-bold leading-none">
        {{ course.code }}
      </span>
      <span
        class="shrink-0 rounded-sm border border-white/70 bg-slate-950/45 px-1.5 py-0.5 font-inter text-[10px] font-extrabold uppercase leading-none tracking-wide text-white"
      >
        {{ t(`courseType.${occurrence.section ?? 'lec'}`) }}
      </span>
    </div>
    <div
      v-if="tier !== 'tiny'"
      class="truncate whitespace-nowrap font-inter text-[11px] leading-tight"
      :title="course.name"
    >
      {{ course.name }}
    </div>
    <div
      v-if="tier === 'full' || tier === 'mid'"
      class="truncate whitespace-nowrap font-inter text-[11px] font-bold leading-tight tabular-nums"
    >
      {{ range }}
    </div>
  </div>
</template>
