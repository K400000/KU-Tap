import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { nanoid } from 'nanoid'
import type { Course, DayId } from '@/types'
import { computeRange } from '@/lib/range'
import { computeDayLayouts } from '@/lib/layout'

export const useScheduleStore = defineStore(
  'schedule',
  () => {
    const title = ref('My Schedule')
    const courses = ref<Course[]>([])
    const selectedCourseId = ref<string | null>(null)
    const hoveredCourseId = ref<string | null>(null)

    // ─── Derived ───────────────────────────────────────────────────────────
    const range = computed(() => computeRange(courses.value))
    const dayLayouts = computed(() => computeDayLayouts(courses.value))

    // ─── Actions ───────────────────────────────────────────────────────────
    function addCourse(data: Omit<Course, 'id'>): Course {
      const course: Course = { id: nanoid(), ...data }
      courses.value.push(course)
      return course
    }

    function updateCourse(id: string, data: Partial<Omit<Course, 'id'>>): void {
      const idx = courses.value.findIndex((c) => c.id === id)
      if (idx !== -1) {
        courses.value[idx] = { ...courses.value[idx], ...data }
      }
    }

    function removeCourse(id: string): void {
      courses.value = courses.value.filter((c) => c.id !== id)
      if (selectedCourseId.value === id) selectedCourseId.value = null
      if (hoveredCourseId.value === id) hoveredCourseId.value = null
    }

    function select(id: string | null): void {
      selectedCourseId.value = id
    }

    function clearSelection(): void {
      selectedCourseId.value = null
    }

    function setHovered(id: string | null): void {
      hoveredCourseId.value = id
    }

    function setTitle(newTitle: string): void {
      title.value = newTitle
    }

    function loadSampleData(): void {
      courses.value = []
      const samples: Omit<Course, 'id'>[] = [
        {
          code: 'CS101',
          name: 'Data Structures',
          instructor: 'Dr. Smith',
          room: '301',
          credits: 3,
          days: [0, 2, 4] as DayId[],
          start: 9 * 60 + 30,
          end: 11 * 60,
          color: '#6366F1',
        },
        {
          code: 'MATH201',
          name: 'Calculus II',
          instructor: 'Prof. Johnson',
          room: '102',
          credits: 3,
          days: [1, 3] as DayId[],
          start: 13 * 60,
          end: 14 * 60 + 30,
          color: '#10B981',
        },
        {
          code: 'ENG101',
          name: 'Academic English',
          instructor: 'Ms. Williams',
          room: 'A201',
          credits: 2,
          days: [0, 3] as DayId[],
          start: 11 * 60,
          end: 12 * 60,
          color: '#F59E0B',
        },
        {
          code: 'PHYS101',
          name: 'Physics Lab',
          instructor: 'Dr. Lee',
          room: 'Lab B',
          credits: 1,
          days: [4] as DayId[],
          start: 13 * 60,
          end: 16 * 60,
          color: '#EC4899',
        },
        {
          code: 'CS201',
          name: 'Algorithms',
          instructor: 'Dr. Brown',
          room: '305',
          credits: 3,
          days: [2, 4] as DayId[],
          start: 9 * 60 + 30,
          end: 11 * 60,
          color: '#8B5CF6',
        },
      ]
      samples.forEach((s) => addCourse(s))
    }

    return {
      title,
      courses,
      selectedCourseId,
      hoveredCourseId,
      range,
      dayLayouts,
      addCourse,
      updateCourse,
      removeCourse,
      select,
      clearSelection,
      setHovered,
      setTitle,
      loadSampleData,
    }
  },
)
