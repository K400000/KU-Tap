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
    class="schedule-card-content flex h-full min-w-0 flex-col justify-center gap-0.5 overflow-hidden px-2.5 py-0.5 text-left"
  >
    <div class="flex min-w-0 items-center justify-between gap-1.5">
      <div class="flex min-w-0 items-center gap-1.5 overflow-hidden whitespace-nowrap">
        <span class="shrink-0 font-kanit text-sm font-bold leading-none">
          {{ course.code }}
        </span>
        <span
          v-if="course.credits !== undefined"
          class="truncate font-inter text-xs font-semibold leading-none"
          :title="`${t('form.credits')}: ${course.credits}`"
        >
          {{ course.credits }} {{ t('form.credits') }}
        </span>
      </div>
      <span
        class="shrink-0 rounded-sm border border-white/70 bg-slate-950/45 px-1.5 py-0.5 font-inter text-[11px] font-extrabold uppercase leading-none tracking-wide text-white"
      >
        {{ t(`courseType.${occurrence.section ?? 'lec'}`) }}
      </span>
    </div>
    <div
      v-if="tier !== 'tiny'"
      class="truncate whitespace-nowrap font-inter text-[13px]"
      :title="course.name"
    >
      {{ course.name }}
    </div>
    <div
      v-if="(tier === 'full' || tier === 'mid') && course.instructor"
      class="min-w-0 truncate whitespace-nowrap font-inter text-xs font-medium"
      :title="`${t('form.instructor')}: ${course.instructor}`"
    >
      <i class="bi bi-person" aria-hidden="true" />
      {{ course.instructor }}
    </div>
    <div
      v-if="tier === 'full' || tier === 'mid'"
      class="flex min-w-0 items-center gap-1.5 overflow-hidden whitespace-nowrap font-inter text-[13px] font-bold tabular-nums"
    >
      <i class="bi bi-clock shrink-0" aria-hidden="true" />
      <span class="shrink-0">{{ range }}</span>
      <span
        v-if="course.room"
        class="min-w-0 truncate font-normal"
        :title="`${t('form.room')}: ${course.room}`"
      >
        <i class="bi bi-geo-alt" aria-hidden="true" />
        {{ course.room }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.schedule-card-content,
.schedule-card-content * {
  line-height: 1.2;
}
</style>
