<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { Locale } from '@/types'
import en from '@/i18n/en.json'
import th from '@/i18n/th.json'

const dialog = ref<HTMLDialogElement | null>(null)
const modalLocale = ref<Locale>('th')
const notice = computed(() => (modalLocale.value === 'th' ? th : en).storage.notice)
const languageOptions: { locale: Locale; label: string }[] = [
  { locale: 'th', label: 'ไทย' },
  { locale: 'en', label: 'English' },
]

onMounted(() => {
  dialog.value?.showModal()
})

function acknowledge() {
  dialog.value?.close()
}
</script>

<template>
  <dialog
    ref="dialog"
    class="fixed left-1/2 top-1/2 m-0 w-[min(92vw,52rem)] max-h-[90vh] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border-4 border-[#647d8e] bg-[#eef3f6] p-0 text-slate-800 shadow-2xl backdrop:bg-slate-950/65"
    aria-labelledby="storage-notice-title"
    aria-describedby="storage-notice-body"
    @cancel.prevent="acknowledge"
  >
    <div class="p-8 sm:p-12">
      <div class="mb-6 flex justify-end gap-1" role="group" aria-label="Modal language">
        <button
          v-for="option in languageOptions"
          :key="option.locale"
          type="button"
          :aria-pressed="modalLocale === option.locale"
          class="rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          :class="modalLocale === option.locale ? 'bg-indigo-600 text-white' : 'bg-white/70 text-slate-700 hover:bg-white'"
          @click="modalLocale = option.locale"
        >
          {{ option.label }}
        </button>
      </div>
      <h2 id="storage-notice-title" class="mb-8 text-center text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
        {{ notice.title }}
      </h2>
      <div id="storage-notice-body" class="px-1 text-lg leading-relaxed text-slate-700 sm:px-2 sm:text-xl">
        <p>{{ notice.intro }}</p>
        <p class="mt-3">{{ notice.storage }}</p>
      </div>
      <p class="mt-9 px-1 text-base font-semibold leading-relaxed text-slate-700 sm:px-2 sm:text-lg">
        {{ notice.contact }}
      </p>
      <div class="mt-2 flex flex-wrap gap-4">
        <a
          href="https://www.instagram.com/K400000_pf/"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 rounded-md px-2 py-1.5 font-semibold text-slate-700 transition-colors hover:text-sky-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
        >
          <i class="bi bi-instagram text-lg" aria-hidden="true" />
          <span>IG: K400000_pf</span>
        </a>
      </div>
      <button
        type="button"
        class="mt-10 w-full rounded-xl bg-amber-400 px-6 py-4 text-lg font-bold text-slate-900 shadow-sm transition hover:bg-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
        @click="acknowledge"
      >
        {{ notice.dismiss }}
      </button>
    </div>
  </dialog>
</template>
