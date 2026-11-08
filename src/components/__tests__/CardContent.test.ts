import { beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { i18n } from '@/i18n'
import type { Course, PlacedOccurrence } from '@/types'
import CardContent from '../schedule/CardContent.vue'
import CourseCard from '../schedule/CourseCard.vue'
import CourseList from '../list/CourseList.vue'
import { useScheduleStore } from '@/stores/scheduleStore'

describe('CardContent.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('shows credits, room, and instructor on a schedule card', () => {
    const course: Course = {
      id: 'cs101',
      code: 'CS101',
      name: 'Data Structures',
      instructor: 'Dr. Smith',
      room: '301',
      credits: 3,
      days: [0],
      start: 540,
      end: 660,
      color: '#123456',
    }
    const occurrence: PlacedOccurrence = {
      courseId: course.id,
      day: 0,
      start: course.start,
      end: course.end,
      lane: 0,
      section: 'lec',
    }
    const wrapper = mount(CardContent, {
      props: { course, occurrence, widthPct: 25 },
      global: { plugins: [i18n] },
    })

    expect(wrapper.text()).toContain('3 Credits')
    expect(wrapper.text()).toContain('301')
    expect(wrapper.text()).toContain('Dr. Smith')
    expect(wrapper.find('.font-kanit').element.parentElement?.textContent).toContain('3 Credits')
    const timeRow = wrapper.find('.bi-clock').element.parentElement
    expect(timeRow?.textContent).toContain('09:00 - 11:00')
    expect(timeRow?.textContent?.indexOf('09:00 - 11:00')).toBeLessThan(timeRow?.textContent?.indexOf('301') ?? -1)
    expect(timeRow?.querySelector('.bi-geo-alt')).not.toBeNull()
    const instructorRow = wrapper.find('.bi-person').element.parentElement
    expect(instructorRow?.textContent).toContain('Dr. Smith')
    const instructorPrecedesTime = instructorRow && timeRow
      ? (instructorRow.compareDocumentPosition(timeRow) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0
      : false
    expect(instructorPrecedesTime).toBe(true)
    expect(instructorRow?.className).toContain('text-xs')
  })

  it('shows credits after the course code in the subject box', () => {
    const store = useScheduleStore()
    store.addCourse({
      code: 'CS101',
      name: 'Data Structures',
      credits: 3,
      days: [0],
      start: 540,
      end: 660,
      color: '#123456',
    })
    const wrapper = mount(CourseList, {
      global: { plugins: [i18n] },
    })
    const courseCode = wrapper.find('li .font-kanit')

    expect(courseCode.text()).toContain('CS101')
    expect(courseCode.text()).toContain('3 Credits')
  })

  it('applies the selected font color to the schedule card', () => {
    const store = useScheduleStore()
    const course = store.addCourse({
      code: 'CS101',
      name: 'Data Structures',
      days: [0],
      start: 540,
      end: 660,
      color: '#123456',
      textColor: 'black',
    })
    const occurrence: PlacedOccurrence = {
      courseId: course.id,
      day: 0,
      start: course.start,
      end: course.end,
      lane: 0,
      section: 'lec',
    }
    const wrapper = mount(CourseCard, {
      props: { occurrence, leftPct: 0, widthPct: 25 },
      global: { plugins: [i18n] },
    })

    expect((wrapper.element as HTMLElement).style.color).toBe('rgb(17, 17, 17)')
  })
})
