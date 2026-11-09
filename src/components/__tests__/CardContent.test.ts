import { beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { i18n } from '@/i18n'
import type { Course, PlacedOccurrence } from '@/types'
import CardContent from '../schedule/CardContent.vue'
import CourseCard from '../schedule/CourseCard.vue'
import CourseList from '../list/CourseList.vue'
import { useScheduleStore } from '@/stores/scheduleStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { useContrast } from '@/composables/useContrast'

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
      section: '800',
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
      props: { course, occurrence },
      global: { plugins: [i18n] },
    })

    expect(wrapper.text()).toContain('3 Credits')
    expect(wrapper.text()).toContain('301')
    expect(wrapper.text()).toContain('Dr. Smith')
    const header = wrapper.find('.schedule-card-content > div:first-child')
    expect(header.text()).toContain('3 Credits')
    expect(header.text()).not.toContain('CS101')
    expect(header.findAll('span')[0]?.classes()).toContain('text-base')
    const sectionBadge = wrapper.findAll('span').find((badge) => badge.text() === '800')
    expect(sectionBadge?.text()).toBe('800')
    expect(sectionBadge?.classes()).toContain('border')
    expect(sectionBadge?.classes()).toContain('text-[10px]')
    expect(wrapper.text()).toContain('Lec')
    const detailsRow = wrapper.find('.schedule-card-details')
    expect(detailsRow.text()).toContain('301')
    expect(detailsRow.text()).toContain('Dr. Smith')
    expect(detailsRow?.classes()).toContain('justify-center')
    expect(detailsRow?.classes()).toContain('font-bold')
    expect(wrapper.find('.bi-clock').exists()).toBe(false)
    const courseIdentity = wrapper.find('.schedule-card-content > div:nth-child(2)')
    expect(courseIdentity.text()).toContain('CS101')
    expect(courseIdentity.text()).toContain('Data Structures')
    expect(courseIdentity.classes()).toContain('text-lg')
    expect(courseIdentity.classes()).toContain('font-bold')
  })

  it('uses Contact Teacher when no room is provided', () => {
    const course: Course = {
      id: 'cs101',
      code: 'CS101',
      name: 'Data Structures',
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
    }
    const wrapper = mount(CardContent, {
      props: { course, occurrence },
      global: { plugins: [i18n] },
    })

    expect(wrapper.text()).toContain('Contact Teacher')
    expect(wrapper.text()).toContain('—')
    expect(wrapper.text()).toContain('Not specified')
  })

  it('shows the lab section and lab room on a lab schedule card', () => {
    const course: Course = {
      id: 'cs101',
      code: 'CS101',
      name: 'Data Structures',
      room: 'SC2-401',
      section: '800',
      lab: {
        section: '830',
        room: 'SC2-402',
        credits: 1,
        days: [4],
        start: 780,
        end: 900,
      },
      days: [0],
      start: 540,
      end: 660,
      color: '#123456',
    }
    const occurrence: PlacedOccurrence = {
      courseId: course.id,
      day: 4,
      start: 780,
      end: 900,
      lane: 0,
      section: 'lab',
    }
    const wrapper = mount(CardContent, {
      props: { course, occurrence },
      global: { plugins: [i18n] },
    })

    expect(wrapper.findAll('span').some((span) => span.text() === '830')).toBe(true)
    expect(wrapper.findAll('span').some((span) => span.text() === '1 Credits')).toBe(true)
    expect(wrapper.find('.schedule-card-details').text()).toContain('SC2-402')
    expect(wrapper.find('.schedule-card-details').text()).not.toContain('SC2-401')
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

  it('uses a white background with the course color as border in the outline theme', () => {
    useSettingsStore().setTheme('outline')
    const styles = useContrast().getCardStyles('#2563EB')

    expect(styles.background).toBe('#FFFFFF')
    expect(styles.border).toBe('2px solid #2563EB')
  })
})
