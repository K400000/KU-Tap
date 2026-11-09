<script setup lang="ts">
import { ref, computed } from 'vue'
import { useScheduleStore } from '@/stores/scheduleStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { useTheme } from '@/composables/useTheme'
import { useI18n } from 'vue-i18n'
import ScheduleGrid from './ScheduleGrid.vue'
import type { DayLayout } from '@/types'

const props = defineProps<{
  exportMode?: boolean
}>()

const { t } = useI18n()
const store = useScheduleStore()
const settings = useSettingsStore()

const canvasEl = ref<HTMLElement | null>(null)
useTheme(() => canvasEl.value)

const range = computed(() => store.range)
const dayLayouts = computed(() => store.dayLayouts)
const isEditable = computed(() => !props.exportMode)

const editingTitle = ref(false)
const titleInput = ref<HTMLInputElement | null>(null)

function startEditTitle() {
  if (!isEditable.value) return
  editingTitle.value = true
  setTimeout(() => titleInput.value?.focus(), 10)
}

function saveTitle(e: Event) {
  store.setTitle((e.target as HTMLInputElement).value.trim() || t('schedule.title'))
  editingTitle.value = false
}

defineExpose({ canvasEl })
</script>

<template>
  <div
    ref="canvasEl"
    :class="[
      'flex flex-col',
      exportMode ? 'w-[1600px] h-auto overflow-visible select-none' : 'h-full',
    ]"
    :style="{
      background: 'var(--bg)',
      color: 'var(--text)',
      fontFamily: '\'Inter\', \'Kanit\', sans-serif',
      transition: exportMode ? 'none' : 'background 250ms ease, color 250ms ease',
    }"
  >
    <!-- Title bar -->
    <div
      class="px-4 py-3 flex items-center gap-2"
      :style="{ borderBottom: '1px solid var(--grid-line-strong)' }"
    >
      <!-- Editable title -->
      <input
        v-if="editingTitle && isEditable"
        ref="titleInput"
        :value="store.title"
        @blur="saveTitle"
        @keydown.enter="saveTitle"
        @keydown.escape="editingTitle = false"
        class="flex-1 text-xl font-bold font-kanit bg-transparent border-b-2 border-indigo-400 outline-none"
        :style="{ color: 'var(--title)' }"
        :placeholder="t('schedule.titlePlaceholder')"
      />
      <h1
        v-else
        class="flex-1 text-xl font-bold font-kanit select-none"
        :class="isEditable ? 'cursor-pointer hover:opacity-70 transition-opacity' : ''"
        :style="{ color: 'var(--title)' }"
        @click="startEditTitle"
        :title="isEditable ? 'Click to edit title' : undefined"
      >
        {{ store.title || t('schedule.title') }}
      </h1>
      <span class="shrink-0 text-sm font-semibold font-inter text-right opacity-75 sm:text-base">
        KU-TaP | Table Planning
      </span>
    </div>

    <!-- Empty state -->
    <div
      v-if="store.courses.length === 0 && !exportMode"
      class="flex-1 flex items-center justify-center flex-col gap-3 py-16"
    >
      <i class="bi bi-calendar-week text-6xl opacity-20" aria-hidden="true" />
      <p class="text-sm font-inter opacity-40">{{ t('schedule.empty') }}</p>
      <p class="text-sm font-kanit opacity-50">{{ t('schedule.emptyPrompt') }}</p>
    </div>

    <!-- The grid -->
    <div
      v-else
      :class="exportMode ? 'overflow-visible' : 'flex-1 overflow-x-auto overflow-y-auto'"
    >
      <ScheduleGrid
        :range-start="range.rangeStart"
        :range-end="range.rangeEnd"
        :day-layouts="dayLayouts"
        :export-mode="exportMode"
      />
    </div>
  </div>
</template>
