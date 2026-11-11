import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { i18n } from '@/i18n'
import AnnouncementModal from '@/components/ui/AnnouncementModal.vue'

describe('AnnouncementModal.vue', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    Reflect.deleteProperty(HTMLDialogElement.prototype, 'showModal')
  })

  it('opens in Thai and lets the user switch the notice to English', async () => {
    const showModal = vi.fn()
    Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
      configurable: true,
      value: showModal,
    })
    const wrapper = mount(AnnouncementModal, { global: { plugins: [i18n] } })

    expect(showModal).toHaveBeenCalledOnce()
    expect(wrapper.text()).toContain('อ่านก่อน!')
    expect(wrapper.text()).toContain('เว็บนี้ทำขึ้นมาเพื่อช่วยวางแผนและจัดตารางเรียนรายสัปดาห์ด้วยตัวเอง')

    await wrapper.get('button[aria-pressed="false"]').trigger('click')

    expect(wrapper.text()).toContain('A quick note!')
    expect(wrapper.text()).toContain('This site was made to help you plan and organize your weekly class schedule.')
  })
})
