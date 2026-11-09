<script setup lang="ts">
import { computed } from 'vue'
import { useContrast } from '@/composables/useContrast'
import { useTimeFormat } from '@/composables/useTimeFormat'
import { useScheduleStore } from '@/stores/scheduleStore'
import type { PlacedOccurrence } from '@/types'
import { useI18n } from 'vue-i18n'
import CardContent from './CardContent.vue'

const props = defineProps<{
  occurrence: PlacedOccurrence
  leftPct: number
  widthPct: number
}>()

const emit = defineEmits<{ select: [courseId: string] }>()
const { t } = useI18n()
const store = useScheduleStore()
const { getCardStyles } = useContrast()
const { formatRange } = useTimeFormat()

const course = computed(() => store.courses.find((c) => c.id === props.occurrence.courseId))

const cardStyle = computed(() => {
  if (!course.value) return {}
  return getCardStyles(course.value.color, course.value.textColor)
})

const isSelected = computed(() => store.selectedCourseId === props.occurrence.courseId)
const isHovered = computed(() => store.hoveredCourseId === props.occurrence.courseId)

const tooltipTitle = computed(() => {
  const c = course.value
  if (!c) return ''
  const day = t(`day.full.${props.occurrence.day}`)
  const range = formatRange(props.occurrence.start, props.occurrence.end)
  const section = t(`courseType.${props.occurrence.section ?? 'lec'}`)
  const sectionNumber = props.occurrence.section === 'lab' ? c.lab?.section : c.section
  const parts = [`${c.code}${sectionNumber ? ` (${sectionNumber})` : ''} — ${c.name}`, `${section}: ${day} ${range}`]
  if (c.credits !== undefined) parts.push(`${t('form.credits')}: ${c.credits}`)
  parts.push(`${t('scheduleCard.room')}: ${c.room || t('scheduleCard.contactTeacher')}`)
  parts.push(`${t('scheduleCard.section')}: ${sectionNumber || '—'}`)
  parts.push(`${t('scheduleCard.instructor')}: ${c.instructor || t('scheduleCard.notSpecified')}`)
  return parts.join('\n')
})

const ariaLabel = computed(() => {
  const c = course.value
  if (!c) return ''
  const day = t(`day.full.${props.occurrence.day}`)
  const range = formatRange(props.occurrence.start, props.occurrence.end)
  const section = t(`courseType.${props.occurrence.section ?? 'lec'}`)
  const sectionNumber = props.occurrence.section === 'lab' ? c.lab?.section : c.section
  const details = [
    c.credits !== undefined ? `${t('form.credits')}: ${c.credits}` : '',
    `${t('scheduleCard.room')}: ${c.room || t('scheduleCard.contactTeacher')}`,
    `${t('scheduleCard.section')}: ${sectionNumber || '—'}`,
    `${t('scheduleCard.instructor')}: ${c.instructor || t('scheduleCard.notSpecified')}`,
  ].filter(Boolean)
  return [`${c.code}${sectionNumber ? ` (${sectionNumber})` : ''} ${section} ${c.name}, ${day} ${range}`, ...details].join(', ')
})

function onMouseEnter() {
  if (course.value) store.setHovered(course.value.id)
}

function onMouseLeave() {
  if (course.value && store.hoveredCourseId === course.value.id) {
    store.setHovered(null)
  }
}
</script>

<template>
  <div
    v-if="course"
    :title="tooltipTitle"
    :style="{
      position: 'absolute',
      left: `${leftPct}%`,
      width: `${widthPct}%`,
      top: '0',
      bottom: '0',
      marginInline: '1px',
      borderRadius: 'var(--radius)',
      boxShadow: isHovered ? '0 4px 12px rgba(0,0,0,0.22)' : 'var(--shadow)',
      transform: isHovered ? 'translateY(-1px)' : 'none',
      cursor: 'pointer',
      transition: 'transform 150ms ease, box-shadow 150ms ease, left 200ms ease, width 200ms ease',
      zIndex: isSelected ? 20 : isHovered ? 15 : 2,
      ...cardStyle,
    }"
    :class="[
      'overflow-hidden select-none group/card',
      isSelected && 'ring-2 ring-offset-1 ring-indigo-500',
      isHovered && !isSelected && 'ring-2 ring-indigo-400/70',
    ]"
    role="button"
    tabindex="0"
    :aria-label="ariaLabel"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    @click="emit('select', course!.id)"
    @keydown.enter="emit('select', course!.id)"
    @keydown.space.prevent="emit('select', course!.id)"
  >
    <CardContent :occurrence="occurrence" :course="course" />
  </div>
</template>
