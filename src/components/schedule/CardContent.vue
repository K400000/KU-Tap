<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { PlacedOccurrence, Course } from '@/types'

const props = defineProps<{
  occurrence: PlacedOccurrence
  course: Course
}>()

const { t } = useI18n()
const sectionNumber = computed(() => props.occurrence.section === 'lab'
  ? props.course.lab?.section
  : props.course.section)
const room = computed(() => props.occurrence.section === 'lab'
  ? props.course.lab?.room ?? props.course.room
  : props.course.room)
</script>

<template>
  <div
    class="schedule-card-content grid h-full min-w-0 grid-rows-[auto_1fr_auto] overflow-hidden px-2.5 py-1 text-left"
  >
    <div class="flex min-w-0 items-center justify-between gap-1.5">
      <span
          v-if="course.credits !== undefined"
          class="truncate font-inter text-base font-bold leading-none"
          :title="`${t('form.credits')}: ${course.credits}`"
        >
          {{ course.credits }} {{ t('form.credits') }}
      </span>
      <div class="flex shrink-0 items-center gap-2">
        <span
          class="shrink-0 rounded-sm border border-white/60 bg-slate-950/45 px-1 py-0.5 font-inter text-[10px] font-extrabold leading-none tracking-wide text-white"
          :title="`${t('scheduleCard.section')}: ${sectionNumber || '—'}`"
        >
          {{ sectionNumber || '—' }}
        </span>
        <span
          class="rounded-sm border border-white/60 bg-slate-950/45 px-1 py-0.5 font-inter text-[10px] font-extrabold uppercase leading-none tracking-wide text-white"
        >
          {{ t(`courseType.${occurrence.section ?? 'lec'}`) }}
        </span>
      </div>
    </div>
    <div class="flex min-h-0 flex-col items-center justify-center gap-0.5 overflow-hidden text-center font-inter text-lg font-bold">
      <div class="max-w-full truncate whitespace-nowrap" :title="course.code">
        {{ course.code }}
      </div>
      <div class="max-w-full truncate whitespace-nowrap" :title="course.name">
        {{ course.name }}
      </div>
    </div>
    <div class="schedule-card-details flex min-w-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap text-center font-inter text-sm font-bold">
      <span
        class="min-w-0 truncate"
        :title="`${t('scheduleCard.room')}: ${room || t('scheduleCard.contactTeacher')}`"
      >
        <i class="bi bi-geo-alt" aria-hidden="true" />
        {{ room || t('scheduleCard.contactTeacher') }}
      </span>
      <span class="shrink-0">|</span>
      <span
        class="min-w-0 truncate"
        :title="`${t('scheduleCard.instructor')}: ${course.instructor || t('scheduleCard.notSpecified')}`"
      >
        <i class="bi bi-person" aria-hidden="true" />
        {{ course.instructor || t('scheduleCard.notSpecified') }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.schedule-card-content,
.schedule-card-content * {
  line-height: 1.2;
}

.schedule-card-content .bi {
  -webkit-text-stroke: 0.6px currentColor;
}
</style>
