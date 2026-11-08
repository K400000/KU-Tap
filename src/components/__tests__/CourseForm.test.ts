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

    // Default start is 09:00 (540) and end is 10:00 (600), which overlaps MATH101 (09:00-11:00)
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
    await wrapper.find('button[aria-label="Monday"], button[aria-label="วันจันทร์"]').trigger('click')
    const addLabButton = wrapper.findAll('button').find((button) => /Add Lab|เพิ่ม Lab/.test(button.text()))
    if (!addLabButton) throw new Error('Add Lab button was not rendered')
    await addLabButton.trigger('click')
    const fridayButtons = wrapper.findAll('button[aria-label="Friday"], button[aria-label="วันศุกร์"]')
    await fridayButtons[1]?.trigger('click')
    await wrapper.find('#field-lab-end').setValue('900')
    await wrapper.find('#field-lab-start').setValue('780')
    await wrapper.find('form').trigger('submit.prevent')

    expect(store.courses).toHaveLength(1)
    expect(store.courses[0]?.lab).toEqual({ days: [4], start: 780, end: 900 })
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

  it('disables end times earlier than or equal to start time', () => {
    const wrapper = mount(TimeSelect, {
      props: {
        modelValue: 600, // 10:00
        min: 540,        // Start is 09:00 (540), so options <= 540 are disabled
      },
      global: {
        plugins: [i18n],
      },
    })

    const options = wrapper.findAll('option')
    const opt0900 = options.find((o) => o.attributes('value') === '540')
    const opt0830 = options.find((o) => o.attributes('value') === '510')
    const opt0930 = options.find((o) => o.attributes('value') === '570')

    expect(opt0900?.attributes('disabled')).toBeDefined()
    expect(opt0830?.attributes('disabled')).toBeDefined()
    expect(opt0930?.attributes('disabled')).toBeUndefined()
  })
})
