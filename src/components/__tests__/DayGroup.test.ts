import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { i18n } from '@/i18n'
import DayGroup from '../schedule/DayGroup.vue'
import DayLabelCell from '../schedule/DayLabelCell.vue'
import BlankCell from '../schedule/BlankCell.vue'
import type { DayLayout } from '@/types'

describe('DayGroup.vue', () => {
  it('renders DayLabelCell for lane 0 and BlankCell for lanes >= 1', () => {
    setActivePinia(createPinia())

    const layoutWithCollisions: DayLayout = {
      day: 0, // Monday
      laneCount: 3,
      items: [
        { courseId: 'c1', day: 0, start: 540, end: 660, lane: 0 },
        { courseId: 'c2', day: 0, start: 600, end: 720, lane: 1 },
        { courseId: 'c3', day: 0, start: 630, end: 750, lane: 2 },
      ],
    }

    const wrapper = mount(DayGroup, {
      props: {
        layout: layoutWithCollisions,
        rangeStart: 480,
        rangeEnd: 1200,
      },
      global: {
        plugins: [i18n],
      },
    })

    // Exactly one DayLabelCell (lane 0)
    const dayLabelCells = wrapper.findAllComponents(DayLabelCell)
    expect(dayLabelCells).toHaveLength(1)

    // Exactly two BlankCell components (lane 1 and 2)
    const blankCells = wrapper.findAllComponents(BlankCell)
    expect(blankCells).toHaveLength(2)
  })

  it('renders only DayLabelCell and 0 BlankCell for days without collisions (laneCount = 1)', () => {
    setActivePinia(createPinia())

    const layoutSingle: DayLayout = {
      day: 1, // Tuesday
      laneCount: 1,
      items: [{ courseId: 'c1', day: 1, start: 540, end: 660, lane: 0 }],
    }

    const wrapper = mount(DayGroup, {
      props: {
        layout: layoutSingle,
        rangeStart: 480,
        rangeEnd: 1200,
      },
      global: {
        plugins: [i18n],
      },
    })

    expect(wrapper.findAllComponents(DayLabelCell)).toHaveLength(1)
    expect(wrapper.findAllComponents(BlankCell)).toHaveLength(0)
  })
})

