import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { i18n } from '@/i18n'
import CourseForm from '../form/CourseForm.vue'
import TimeSelect from '../form/TimeSelect.vue'
import CourseList from '../list/CourseList.vue'
import { useScheduleStore } from '@/stores/scheduleStore'
import { themes } from '@/lib/themes'

describe('CourseForm.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders fields and submits new course when valid', async () => {
    const store = useScheduleStore()
    const wrapper = mount(CourseForm, {
      global: {
        plugins: [i18n],
      },
    })

    // Fill code and name
    await wrapper.find('#field-code').setValue('CS101')
    await wrapper.find('#field-name').setValue('Data Structures')
    expect(wrapper.find('#field-section').attributes('required')).toBeDefined()
    expect(wrapper.find('#field-section').element.parentElement?.textContent).not.toContain('Optional')
    await wrapper.find('#field-section').setValue('800')
    expect(wrapper.find('#field-credits').attributes('max')).toBe('8')
    expect(wrapper.find('#field-credits').attributes('required')).toBeDefined()
    await wrapper.find('#field-credits').setValue('3')
    const whiteTextButton = wrapper.findAll('button').find((button) => button.text().trim() === 'White')
    if (!whiteTextButton) throw new Error('White text color option was not rendered')
    await whiteTextButton.trigger('click')

    // Click Monday chip (Day 0)
    const mondayBtn = wrapper.find('button[aria-label="Monday"], button[aria-label="วันจันทร์"]')
    expect(mondayBtn.exists()).toBe(true)
    await mondayBtn.trigger('click')

    // Submit
    await wrapper.find('form').trigger('submit.prevent')

    // Expect store to have the course
    expect(store.courses).toHaveLength(1)
    expect(store.courses[0]?.code).toBe('CS101')
    expect(store.courses[0]?.name).toBe('Data Structures')
    expect(store.courses[0]?.days).toEqual([0])
    expect(store.courses[0]?.section).toBe('800')
    expect(store.courses[0]?.textColor).toBe('white')
  })

  it('shows soft conflict notice when time overlaps an existing course', async () => {
    const store = useScheduleStore()
    store.addCourse({
      code: 'MATH101',
      name: 'Calculus',
      days: [0],
      start: 540, // 09:00
      end: 660,   // 11:00
      color: '#6366F1',
    })

    const wrapper = mount(CourseForm, {
      global: {
        plugins: [i18n],
      },
    })

    // Select Monday
    const mondayBtn = wrapper.find('button[aria-label="Monday"], button[aria-label="วันจันทร์"]')
    await mondayBtn.trigger('click')

    // Default start is 09:00 (540) and end is 11:00 (660), which overlaps MATH101 (09:00-11:00)
    await wrapper.vm.$nextTick()

    // Conflict banner should appear
    expect(wrapper.text()).toContain('MATH101')
  })

  it('adds a lab schedule as part of the same course', async () => {
    const store = useScheduleStore()
    const wrapper = mount(CourseForm, {
      global: {
        plugins: [i18n],
      },
    })

    await wrapper.find('#field-code').setValue('CS101')
    await wrapper.find('#field-name').setValue('Data Structures')
    await wrapper.find('#field-section').setValue('800')
    await wrapper.find('#field-credits').setValue('3')
    await wrapper.find('#field-room').setValue('SC2-401')
    await wrapper.find('button[aria-label="Monday"], button[aria-label="วันจันทร์"]').trigger('click')
    const addLabButton = wrapper.findAll('button').find((button) => /Add Lab|เพิ่ม Lab/.test(button.text()))
    if (!addLabButton) throw new Error('Add Lab button was not rendered')
    await addLabButton.trigger('click')
    expect((wrapper.find('#field-lab-room').element as HTMLInputElement).value).toBe('SC2-401')
    await wrapper.find('#field-lab-room').setValue('SC2-402')
    expect(wrapper.find('#field-lab-section').attributes('required')).toBeDefined()
    await wrapper.find('#field-lab-section').setValue('830')
    expect(wrapper.find('#field-labCredits').attributes('required')).toBeDefined()
    await wrapper.find('#field-labCredits').setValue('1')
    const fridayButtons = wrapper.findAll('button[aria-label="Friday"], button[aria-label="วันศุกร์"]')
    await fridayButtons[1]?.trigger('click')
    await wrapper.find('#field-lab-end').setValue('15')
    await wrapper.find('#field-lab-start').setValue('13')
    await wrapper.find('form').trigger('submit.prevent')

    expect(store.courses).toHaveLength(1)
    expect(store.courses[0]?.lab).toEqual({
      section: '830',
      room: 'SC2-402',
      credits: 1,
      days: [4],
      start: 780,
      end: 900,
    })
  })

  it('randomizes course colors from the active theme palette', async () => {
    const store = useScheduleStore()
    store.addCourse({
      code: 'CS101',
      name: 'Data Structures',
      days: [0],
      start: 540,
      end: 600,
      color: '#123456',
    })
    const wrapper = mount(CourseList, {
      global: {
        plugins: [i18n],
      },
    })
    const autoColorButton = wrapper.findAll('button').find((button) => /Auto color|สุ่มสีอัตโนมัติ/.test(button.text()))
    if (!autoColorButton) throw new Error('Auto color button was not rendered')

    await autoColorButton.trigger('click')

    expect(themes.minimal.palette).toContain(store.courses[0]?.color)
    expect(store.courses[0]?.color).not.toBe('#123456')
  })

  it('selects hours from 00 to 24 and minutes in 30-minute increments', async () => {
    const wrapper = mount(TimeSelect, {
      props: {
        modelValue: 600,
        allowEndOfDay: true,
        id: 'field-start',
      },
      global: {
        plugins: [i18n],
      },
    })

    const hourSelect = wrapper.find('#field-start')
    const minuteSelect = wrapper.find('#field-start-minute')
    expect(hourSelect.findAll('option')).toHaveLength(25)
    expect(hourSelect.findAll('option')[0]?.text()).toBe('00')
    expect(hourSelect.findAll('option')[24]?.text()).toBe('24')
    expect(minuteSelect.findAll('option').map((option) => option.text())).toEqual(['00', '30'])

    await hourSelect.setValue('9')
    await minuteSelect.setValue('30')
    const updates = wrapper.emitted('update:modelValue') ?? []
    expect(updates[updates.length - 1]).toEqual([570])
  })

  it('only allows 24:00 as the end-of-day time', async () => {
    const wrapper = mount(TimeSelect, {
      props: { modelValue: 1440, allowEndOfDay: true, id: 'end-time' },
    })

    const hourSelect = wrapper.find('#end-time')
    const minuteSelect = wrapper.find('#end-time-minute')
    expect((hourSelect.element as HTMLSelectElement).value).toBe('24')
    expect((minuteSelect.element as HTMLSelectElement).value).toBe('0')
    expect(minuteSelect.find('option[value="30"]').attributes('disabled')).toBeDefined()
  })

  it('loads mock courses with sections and white text', () => {
    const store = useScheduleStore()
    store.loadSampleData()

    expect(store.courses.length).toBeGreaterThan(0)
    expect(store.courses.every((course) => course.section && course.textColor === 'white')).toBe(true)
    expect(store.courses.every((course) => course.end - course.start >= 120)).toBe(true)
  })
})
