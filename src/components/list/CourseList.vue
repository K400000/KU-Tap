<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useScheduleStore } from '@/stores/scheduleStore'
import { useTimeFormat } from '@/composables/useTimeFormat'
import { useToast } from '@/composables/useToast'
import { getThemeCourseColor, themes } from '@/lib/themes'
import { useSettingsStore } from '@/stores/settingsStore'
import type { DayId } from '@/types'

const { t } = useI18n()
const store = useScheduleStore()
const settings = useSettingsStore()
const { formatRange } = useTimeFormat()
const { showToast } = useToast()

function autoColorCourses() {
  const palette = [...(themes[settings.theme]?.palette ?? [])]
  for (let index = palette.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[palette[index], palette[swapIndex]] = [palette[swapIndex]!, palette[index]!]
  }

  store.courses.forEach((course, index) => {
    const color = palette[index % palette.length]
    if (color) store.updateCourse(course.id, { color })
  })

  showToast(t('courseList.autoColorApplied'), 'success')
}

function editCourse(id: string) {
  store.select(id)
}

function deleteCourse(id: string) {
  store.removeCourse(id)
  showToast(t('toast.courseDeleted'), 'info')
}

function onMouseEnter(id: string) {
  store.setHovered(id)
}

function onMouseLeave(id: string) {
  if (store.hoveredCourseId === id) {
    store.setHovered(null)
  }
}
</script>

<template>
  <div class="p-5 space-y-5">
    <!-- List Header with Count -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <h3 class="text-xs font-bold text-gray-700 uppercase tracking-wider font-kanit">
          {{ t('courseList.title') }}
        </h3>
        <span
          v-if="store.courses.length > 0"
          class="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-700 font-inter tabular-nums"
        >
          {{ store.courses.length }}
        </span>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-if="store.courses.length === 0"
      class="text-sm text-gray-500 font-inter text-center py-8 flex flex-col items-center gap-2 bg-white rounded-xl border border-dashed border-slate-300"
    >
      <i class="bi bi-journal-bookmark text-3xl opacity-40 text-gray-400" aria-hidden="true" />
      <p class="text-xs">{{ t('courseList.empty') }}</p>
    </div>

    <!-- Course items -->
    <ul v-else class="space-y-3">
      <li
        v-for="course in store.courses"
        :key="course.id"
        :class="[
          'relative flex items-center gap-3 p-4 rounded-xl border transition cursor-pointer overflow-hidden bg-white shadow-sm',
          store.selectedCourseId === course.id
            ? 'border-indigo-500 ring-2 ring-indigo-200 bg-indigo-50/40'
            : store.hoveredCourseId === course.id
            ? 'border-indigo-300 ring-1 ring-indigo-100 bg-indigo-50/20'
            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/60',
        ]"
        @mouseenter="onMouseEnter(course.id)"
        @mouseleave="onMouseLeave(course.id)"
        @click="editCourse(course.id)"
      >
        <!-- Accent color bar on left -->
        <span
          class="absolute inset-y-0 left-0 w-1.5"
          :style="{ backgroundColor: getThemeCourseColor(course.color, settings.theme) }"
        />

        <!-- Info content -->
        <div class="flex-1 min-w-0 pl-2.5">
          <div class="mb-2 flex min-w-0 items-center justify-between gap-2">
            <div class="min-w-0">
              <div class="truncate text-sm font-bold tracking-wide text-gray-900 font-kanit">{{ course.code }}</div>
              <div class="truncate text-sm text-gray-600 font-inter">{{ course.name }}</div>
            </div>
            <span
              class="shrink-0 rounded-sm px-2 py-1 font-inter text-[10px] font-extrabold uppercase tracking-wide text-white"
              :style="{ backgroundColor: getThemeCourseColor(course.color, settings.theme) }"
            >
              {{ t(course.lab ? 'courseType.lecAndLab' : 'courseType.lec') }}
            </span>
          </div>

          <div class="flex flex-col items-start gap-2.5">
            <div class="flex items-center gap-x-2.5 gap-y-1.5 flex-wrap">
              <span class="text-[10px] font-bold uppercase text-slate-500">{{ t('courseType.lec') }}</span>
              <span
                v-for="d in course.days"
                :key="d"
                class="px-2 py-1 rounded-md text-[11px] font-semibold font-kanit bg-gray-100 text-gray-700 border border-gray-200"
              >
                {{ t(`day.${d}`) }}
              </span>
              <span class="text-sm text-gray-700 font-inter tabular-nums">
                {{ formatRange(course.start, course.end) }}
              </span>
              <span v-if="course.room" class="text-xs text-gray-600 font-inter truncate">
                <i class="bi bi-geo-alt mr-1" aria-hidden="true" />{{ course.room }}
              </span>
            </div>
            <div v-if="course.lab" class="flex items-center gap-x-2.5 gap-y-1.5 flex-wrap">
              <span class="text-[10px] font-bold uppercase text-slate-500">{{ t('courseType.lab') }}</span>
              <span
                v-for="d in course.lab.days"
                :key="d"
                class="px-2 py-1 rounded-md text-[11px] font-semibold font-kanit bg-sky-50 text-sky-800 border border-sky-200"
              >
                {{ t(`day.${d}`) }}
              </span>
              <span class="text-sm text-gray-700 font-inter tabular-nums">
                {{ formatRange(course.lab.start, course.lab.end) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Action buttons -->
        <div class="flex items-center gap-1 shrink-0">
          <button
            type="button"
            class="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition cursor-pointer"
            :title="t('courseList.edit')"
            @click.stop="editCourse(course.id)"
          >
            <i class="bi bi-pencil" aria-hidden="true" />
          </button>
          <button
            type="button"
            class="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
            :title="t('courseList.delete')"
            @click.stop="deleteCourse(course.id)"
          >
            <i class="bi bi-x-lg" aria-hidden="true" />
          </button>
        </div>
      </li>
    </ul>

    <button
      type="button"
      class="flex w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
      :disabled="store.courses.length === 0"
      @click="autoColorCourses"
    >
      <i class="bi bi-shuffle" aria-hidden="true" />
      <span>{{ t('courseList.autoColor') }}</span>
    </button>
  </div>
</template>
