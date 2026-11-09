<script setup lang="ts">
import { onMounted, ref } from 'vue'

const dialog = ref<HTMLDialogElement | null>(null)

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
    aria-labelledby="announcement-title"
    aria-describedby="announcement-description"
    @cancel.prevent
  >
    <div class="p-8 sm:p-12">
      <h2
        id="announcement-title"
        class="mb-8 text-center text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl"
      >
        อ่านก่อน!
      </h2>

      <p id="announcement-description" class="px-1 text-lg leading-relaxed text-slate-700 sm:px-2 sm:text-xl">
        เว็บไซต์นี้เป็นเพียงการสร้างตารางการเรียนเพื่อวางแผนและจัดตารางเรียน
        เป็นการทำงานลวก ๆ และไม่ได้เชื่อมต่อฐานข้อมูลใด ๆ
        ดังนั้นเพิ่มรายวิชาเอาเอง นะ จ๊ะ จุ๊บ ๆ
        <br><br>(และอย่ากดรีหน้าจอหากเขียนไปแล้ว เพราะมันไม่เซฟนะจั๊บ)
      </p>

      <p class="mt-9 px-1 text-base font-semibold leading-relaxed text-slate-700 sm:px-2 sm:text-lg">
        หากต้องการสอบถามเพิ่มเติมหรือแก้บัค เพิ่มข้อมูล สามารถติดต่อได้ที่
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
        ตกลง
      </button>
    </div>
  </dialog>
</template>
