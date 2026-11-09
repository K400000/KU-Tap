<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useScheduleStore } from '@/stores/scheduleStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { validateCourse, detectConflicts } from '@/lib/validation'
import { getThemeCourseColor, themes } from '@/lib/themes'
import type { Course, DayId } from '@/types'
import DayChipGroup from './DayChipGroup.vue'
import TimeSelect from './TimeSelect.vue'
import ColorSwatchPicker from './ColorSwatchPicker.vue'
import CreditStepper from './CreditStepper.vue'
import ConfirmInline from '@/components/ui/ConfirmInline.vue'
import { useToast } from '@/composables/useToast'

const { t } = useI18n()
const store = useScheduleStore()
const settings = useSettingsStore()
const { showToast } = useToast()

const defaultColor = computed(() => themes[settings.theme]?.palette?.[0] ?? '#6366F1')

// Form state
const code = ref('')
const name = ref('')
const instructor = ref('')
const room = ref('')
const labRoom = ref('')
const section = ref('')
const labSection = ref('')
const credits = ref<number | undefined>(undefined)
const labCredits = ref<number | undefined>(undefined)
const days = ref<DayId[]>([])
const startTime = ref(9 * 60)
const endTime = ref(11 * 60)
const hasLab = ref(false)
const labDays = ref<DayId[]>([])
const labStartTime = ref(9 * 60)
const labEndTime = ref(11 * 60)
const color = ref(defaultColor.value)
const textColor = ref<'auto' | 'white' | 'black'>('auto')

const errors = ref<Record<string, string>>({})
const touched = ref<Record<string, boolean>>({})

// Editing mode
const editingId = computed(() => store.selectedCourseId)
const isEditing = computed(() => !!editingId.value)

// Load course into form when selectedCourseId changes
watch(
  () => store.selectedCourseId,
  (id) => {
    if (!id) {
      resetForm()
      return
    }
    const course = store.courses.find((c) => c.id === id)
    if (!course) return
    code.value = course.code
    name.value = course.name
    instructor.value = course.instructor ?? ''
    room.value = course.room ?? ''
    labRoom.value = course.lab?.room ?? course.room ?? ''
    section.value = course.section ?? ''
    credits.value = course.credits
    labCredits.value = course.lab?.credits
    days.value = [...course.days]
    startTime.value = course.start
    endTime.value = course.end
    hasLab.value = !!course.lab
    labSection.value = course.lab?.section ?? ''
    labDays.value = [...(course.lab?.days ?? [])]
    labStartTime.value = course.lab?.start ?? 9 * 60
    labEndTime.value = course.lab?.end ?? 10 * 60
    color.value = getThemeCourseColor(course.color, settings.theme)
    textColor.value = course.textColor ?? 'auto'
    errors.value = {}
    touched.value = {}
  },
)

// Watch color default change with theme
watch(defaultColor, (c) => {
  if (!isEditing.value) color.value = c
})

function resetForm() {
  code.value = ''
  name.value = ''
  instructor.value = ''
  room.value = ''
  labRoom.value = ''
  section.value = ''
  labSection.value = ''
  credits.value = undefined
  labCredits.value = undefined
  days.value = []
  startTime.value = 9 * 60
  endTime.value = 11 * 60
  hasLab.value = false
  labDays.value = []
  labStartTime.value = 9 * 60
  labEndTime.value = 11 * 60
  color.value = defaultColor.value
  textColor.value = 'auto'
  errors.value = {}
  touched.value = {}
}

function buildPartialCourse(): Partial<Course> {
  return {
    code: code.value.trim().toUpperCase(),
    name: name.value.trim(),
    instructor: instructor.value.trim() || undefined,
    room: room.value.trim() || undefined,
    section: section.value.trim() || undefined,
    credits: credits.value,
    days: days.value,
    start: startTime.value,
    end: endTime.value,
    lab: hasLab.value
      ? {
          section: labSection.value.trim(),
          room: labRoom.value.trim() || undefined,
          credits: labCredits.value,
          days: labDays.value,
          start: labStartTime.value,
          end: labEndTime.value,
        }
      : undefined,
    color: color.value,
    textColor: textColor.value === 'auto' ? undefined : textColor.value,
  }
}

const currentData = computed(() => buildPartialCourse())
const conflicts = computed(() =>
  detectConflicts(currentData.value, store.courses, editingId.value ?? undefined),
)

function toggleLab() {
  hasLab.value = !hasLab.value
  if (hasLab.value) {
    labRoom.value = room.value
  }
  if (!hasLab.value) {
    labSection.value = ''
    labRoom.value = ''
    labCredits.value = undefined
    labDays.value = []
    delete errors.value.labSection
    delete touched.value.labSection
    delete errors.value.labDays
    delete errors.value.labStart
    delete errors.value.labEnd
  }
}

function getError(field: string): string {
  if (!touched.value[field]) return ''
  return errors.value[field] ?? ''
}

function touch(field: string) {
  touched.value[field] = true
  validateField(field)
}

function validateField(field: string) {
  const data = buildPartialCourse()
  const allErrors = validateCourse(data, store.courses, editingId.value ?? undefined)
  const fieldError = allErrors.find((e) => e.field === field)
  if (fieldError) {
    errors.value[field] = t(fieldError.message)
  } else {
    delete errors.value[field]
  }
}

function setTimeInvalid(field: string, invalid: boolean) {
  if (invalid) {
    touched.value[field] = true
    errors.value[field] = t('validation.timeInvalid')
  } else if (touched.value[field]) {
    validateField(field)
  }
}

function submit() {
  const fields = ['code', 'name', 'section', 'days', 'start', 'end']
  if (hasLab.value) fields.push('labSection', 'labCredits', 'labDays', 'labStart', 'labEnd')
  fields.forEach((f) => { touched.value[f] = true })

  const data = buildPartialCourse()
  const allErrors = validateCourse(data, store.courses, editingId.value ?? undefined)

  if (allErrors.length > 0) {
    errors.value = {}
    allErrors.forEach((e) => { errors.value[e.field] = t(e.message) })
    const firstField = allErrors[0]?.field
    const el = document.getElementById(`field-${firstField}`)
    el?.focus()
    return
  }

  const courseData = data as Omit<Course, 'id'>

  if (isEditing.value && editingId.value) {
    store.updateCourse(editingId.value, courseData)
    store.clearSelection()
    showToast(t('toast.courseUpdated'), 'success')
  } else {
    store.addCourse(courseData)
    showToast(t('toast.courseAdded'), 'success')
  }

  resetForm()
}

function cancel() {
  store.clearSelection()
  resetForm()
}

function deleteCourse() {
  if (editingId.value) {
    store.removeCourse(editingId.value)
    showToast(t('toast.courseDeleted'), 'info')
    resetForm()
  }
}
</script>

<template>
  <form @submit.prevent="submit" novalidate class="p-4 pt-5 space-y-6">
    <!-- Edit Mode Indicator Banner -->
    <div
      v-if="isEditing"
      class="flex items-center justify-between p-2.5 bg-indigo-50 border border-indigo-200 rounded-xl text-xs font-kanit"
    >
      <div class="flex items-center gap-1.5 text-indigo-800 font-medium truncate">
        <span class="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
        <span>{{ t('nav.editCourse') }}:</span>
        <span class="font-bold font-mono">{{ code || '...' }}</span>
      </div>
      <button
        type="button"
        @click="cancel"
        class="text-xs text-indigo-600 hover:text-indigo-800 underline font-medium cursor-pointer"
      >
        {{ t('form.cancel') }}
      </button>
    </div>

    <!-- Group 1: Course Identification (Code + Name) -->
    <div class="space-y-5 p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
      <!-- Subject Code -->
      <div>
        <label for="field-code" class="block text-xs font-semibold text-gray-700 mb-1.5 font-kanit">
          {{ t('form.subjectCode') }} <span class="text-red-500">*</span>
        </label>
        <input
          id="field-code"
          v-model="code"
          type="text"
          maxlength="12"
          autocomplete="off"
          @blur="touch('code')"
          @input="code = (code as string).toUpperCase(); touch('code')"
          :class="[
            'w-full h-10 px-4 text-sm font-inter text-gray-900 rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white shadow-2xs',
            getError('code') ? 'border-red-400 bg-red-50/50' : 'border-gray-300',
          ]"
          placeholder="e.g. 01418113"
        />
        <p v-if="getError('code')" role="alert" aria-live="polite" class="mt-1 text-xs text-red-600 font-inter">
          {{ getError('code') }}
        </p>
      </div>

      <!-- Subject Name -->
      <div>
        <label for="field-name" class="block text-xs font-semibold text-gray-700 mb-1.5 font-kanit">
          {{ t('form.subjectName') }} <span class="text-red-500">*</span>
        </label>
        <input
          id="field-name"
          v-model="name"
          type="text"
          maxlength="60"
          autocomplete="off"
          @blur="touch('name')"
          @input="touch('name')"
          :class="[
            'w-full h-10 px-4 text-sm font-inter text-gray-900 rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white shadow-2xs',
            getError('name') ? 'border-red-400 bg-red-50/50' : 'border-gray-300',
          ]"
          placeholder="e.g. Computer Programming"
        />
        <p v-if="getError('name')" role="alert" aria-live="polite" class="mt-1 text-xs text-red-600 font-inter">
          {{ getError('name') }}
        </p>
      </div>
    </div>

    <!-- Group 2: Instructor, Room & Credits -->
    <div class="space-y-5 p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
      <!-- Instructor -->
      <div>
        <label for="field-instructor" class="block text-xs font-semibold text-gray-700 mb-1.5 font-kanit">
          {{ t('form.instructor') }}
          <span class="text-gray-400 text-xs font-normal">({{ t('form.optional') }})</span>
        </label>
        <input
          id="field-instructor"
          v-model="instructor"
          type="text"
          maxlength="40"
          autocomplete="off"
          @blur="touch('instructor')"
          class="w-full h-10 px-4 text-sm font-inter text-gray-900 rounded-lg border border-gray-300 bg-white shadow-2xs transition focus:outline-none focus:ring-2 focus:ring-indigo-400"
          placeholder="e.g. Dr. John"
        />
        <p v-if="getError('instructor')" role="alert" aria-live="polite" class="mt-1 text-xs text-red-600 font-inter">
          {{ getError('instructor') }}
        </p>
      </div>

      <!-- Room, Section & Credits -->
      <div class="grid grid-cols-2 gap-3 items-start">
        <div>
          <label for="field-room" class="block text-xs font-semibold text-gray-700 mb-1.5 font-kanit">
            {{ t('form.room') }}
            <span class="text-gray-400 text-xs font-normal">({{ t('form.optional') }})</span>
          </label>
          <input
            id="field-room"
            v-model="room"
            type="text"
            maxlength="20"
            autocomplete="off"
            @blur="touch('room')"
            class="w-full h-10 px-4 text-sm font-inter text-gray-900 rounded-lg border border-gray-300 bg-white shadow-2xs transition focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="e.g. SC2-401"
          />
        </div>

        <div>
          <label for="field-section" class="block text-xs font-semibold text-gray-700 mb-1.5 font-kanit">
            {{ t('form.section') }} <span class="text-red-500">*</span>
          </label>
          <input
            id="field-section"
            v-model="section"
            type="text"
            maxlength="20"
            autocomplete="off"
            required
            @blur="touch('section')"
            @input="touch('section')"
            class="w-full h-10 px-4 text-sm font-inter text-gray-900 rounded-lg border border-gray-300 bg-white shadow-2xs transition focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="e.g. 800"
          />
          <p v-if="getError('section')" role="alert" aria-live="polite" class="mt-1 text-xs text-red-600 font-inter">
            {{ getError('section') }}
          </p>
        </div>

        <div class="col-span-2">
          <label for="field-credits" class="block text-xs font-semibold text-gray-700 mb-1.5 font-kanit">
            {{ t('form.credits') }} <span class="text-red-500">*</span>
          </label>
          <CreditStepper v-model="credits" id="field-credits" required :min="0" :max="8" :step="0.5" />
          <p v-if="getError('credits')" role="alert" class="mt-1 text-xs text-red-600 font-inter">
            {{ getError('credits') }}
          </p>
        </div>
      </div>
    </div>

    <!-- Group 3: Schedule Day & Time -->
    <div class="space-y-5 p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
      <!-- Days Chips -->
      <div>
        <label class="block text-xs font-semibold text-gray-700 mb-1.5 font-kanit">
          {{ t('form.days') }} <span class="text-red-500">*</span>
        </label>
        <DayChipGroup v-model="days" @update:model-value="touch('days')" />
        <p v-if="getError('days')" role="alert" aria-live="polite" class="mt-1.5 text-xs text-red-600 font-inter">
          {{ getError('days') }}
        </p>
      </div>

      <!-- Start and End Time -->
      <div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label for="field-start" class="block text-xs font-semibold text-gray-700 mb-1.5 font-kanit">
              {{ t('form.startTime') }} <span class="text-red-500">*</span>
            </label>
            <TimeSelect
              id="field-start"
              v-model="startTime"
              @update:model-value="touch('start')"
              @invalid="setTimeInvalid('start', $event)"
              @blur="touch('start')"
            />
            <p v-if="getError('start')" role="alert" aria-live="polite" class="mt-1 text-xs text-red-600 font-inter">
              {{ getError('start') }}
            </p>
          </div>

          <div>
            <label for="field-end" class="block text-xs font-semibold text-gray-700 mb-1.5 font-kanit">
              {{ t('form.endTime') }} <span class="text-red-500">*</span>
            </label>
            <TimeSelect
              id="field-end"
              v-model="endTime"
              allow-end-of-day
              @update:model-value="touch('end')"
              @invalid="setTimeInvalid('end', $event)"
              @blur="touch('end')"
            />
            <p v-if="getError('end')" role="alert" aria-live="polite" class="mt-1 text-xs text-red-600 font-inter">
              {{ getError('end') }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Lab is an optional schedule section of this course, not a separate course. -->
    <section class="space-y-4 p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
      <div class="flex items-center justify-between gap-3">
        <div>
          <h3 class="text-sm font-bold text-gray-800 font-kanit">{{ t('courseType.title') }}</h3>
          <p class="mt-1 text-xs text-gray-500 font-inter">
            {{ t(hasLab ? 'courseType.lecAndLab' : 'courseType.lec') }}
          </p>
        </div>
        <button
          type="button"
          class="inline-flex h-9 items-center gap-2 rounded-md border border-slate-300 bg-slate-50 px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          :aria-pressed="hasLab"
          @click="toggleLab"
        >
          <i :class="hasLab ? 'bi bi-dash-lg' : 'bi bi-plus-lg'" aria-hidden="true" />
          {{ t(hasLab ? 'form.removeLab' : 'form.addLab') }}
        </button>
      </div>

      <div v-if="hasLab" class="space-y-4 border-t border-slate-200 pt-4">
        <h4 class="text-sm font-semibold text-gray-700 font-kanit">{{ t('courseType.lab') }}</h4>
        <div>
          <label for="field-lab-room" class="block text-xs font-semibold text-gray-700 mb-1.5 font-kanit">
            {{ t('form.room') }}
            <span class="text-gray-400 text-xs font-normal">({{ t('form.optional') }})</span>
          </label>
          <input
            id="field-lab-room"
            v-model="labRoom"
            type="text"
            maxlength="20"
            autocomplete="off"
            @blur="touch('labRoom')"
            class="w-full h-10 px-4 text-sm font-inter text-gray-900 rounded-lg border border-gray-300 bg-white shadow-2xs transition focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="e.g. SC2-401"
          />
          <p v-if="getError('labRoom')" role="alert" class="mt-1 text-xs text-red-600 font-inter">
            {{ getError('labRoom') }}
          </p>
        </div>
        <div>
          <label for="field-lab-section" class="block text-xs font-semibold text-gray-700 mb-1.5 font-kanit">
            {{ t('form.section') }} <span class="text-red-500">*</span>
          </label>
          <input
            id="field-lab-section"
            v-model="labSection"
            type="text"
            maxlength="20"
            autocomplete="off"
            required
            @blur="touch('labSection')"
            @input="touch('labSection')"
            class="w-full h-10 px-4 text-sm font-inter text-gray-900 rounded-lg border border-gray-300 bg-white shadow-2xs transition focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="e.g. 800"
          />
          <p v-if="getError('labSection')" role="alert" class="mt-1 text-xs text-red-600 font-inter">
            {{ getError('labSection') }}
          </p>
        </div>
        <div>
          <label for="field-labCredits" class="block text-xs font-semibold text-gray-700 mb-1.5 font-kanit">
            {{ t('form.credits') }} <span class="text-red-500">*</span>
          </label>
          <CreditStepper
            v-model="labCredits"
            id="field-labCredits"
            required
            :min="0"
            :max="8"
            :step="0.5"
          />
          <p v-if="getError('labCredits')" role="alert" class="mt-1 text-xs text-red-600 font-inter">
            {{ getError('labCredits') }}
          </p>
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1.5 font-kanit">
            {{ t('form.days') }} <span class="text-red-500">*</span>
          </label>
          <DayChipGroup v-model="labDays" @update:model-value="touch('labDays')" />
          <p v-if="getError('labDays')" role="alert" class="mt-1.5 text-xs text-red-600 font-inter">
            {{ getError('labDays') }}
          </p>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label for="field-lab-start" class="block text-xs font-semibold text-gray-700 mb-1.5 font-kanit">
              {{ t('form.startTime') }} <span class="text-red-500">*</span>
            </label>
            <TimeSelect
              id="field-lab-start"
              v-model="labStartTime"
              @update:model-value="touch('labStart')"
              @invalid="setTimeInvalid('labStart', $event)"
              @blur="touch('labStart')"
            />
            <p v-if="getError('labStart')" role="alert" class="mt-1 text-xs text-red-600 font-inter">
              {{ getError('labStart') }}
            </p>
          </div>
          <div>
            <label for="field-lab-end" class="block text-xs font-semibold text-gray-700 mb-1.5 font-kanit">
              {{ t('form.endTime') }} <span class="text-red-500">*</span>
            </label>
            <TimeSelect
              id="field-lab-end"
              v-model="labEndTime"
              allow-end-of-day
              @update:model-value="touch('labEnd')"
              @invalid="setTimeInvalid('labEnd', $event)"
              @blur="touch('labEnd')"
            />
            <p v-if="getError('labEnd')" role="alert" class="mt-1 text-xs text-red-600 font-inter">
              {{ getError('labEnd') }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Group 4: Accent Color -->
    <div class="p-4 bg-white border border-slate-200 rounded-xl shadow-sm space-y-3">
      <label class="block text-xs font-semibold text-gray-700 font-kanit">
        {{ t('form.accentColor') }}
      </label>
      <ColorSwatchPicker v-model="color" />

      <fieldset class="space-y-2 border-t border-slate-100 pt-3">
        <legend class="block text-xs font-semibold text-gray-700 font-kanit">
          {{ t('form.cardTextColor') }}
        </legend>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="option in ['auto', 'white', 'black'] as const"
            :key="option"
            type="button"
            :aria-pressed="textColor === option"
            :class="[
              'inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition',
              textColor === option
                ? 'border-indigo-500 bg-indigo-50 text-indigo-800 ring-1 ring-indigo-200'
                : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50',
            ]"
            @click="textColor = option"
          >
            <span
              v-if="option !== 'auto'"
              class="h-4 w-4 rounded-full border border-slate-300"
              :class="option === 'white' ? 'bg-white' : 'bg-black'"
              aria-hidden="true"
            />
            <i v-else class="bi bi-magic" aria-hidden="true" />
            {{ t(`form.textColorOptions.${option}`) }}
          </button>
        </div>
      </fieldset>
    </div>

    <!-- Soft Conflict Warning -->
    <div
      v-if="conflicts.length > 0"
      class="rounded-xl bg-amber-50 border border-amber-200/80 p-3 text-xs text-amber-900 font-inter flex items-start gap-2 shadow-2xs"
    >
      <i class="bi bi-exclamation-triangle-fill text-amber-500 text-sm leading-none shrink-0" aria-hidden="true" />
      <div class="space-y-1">
        <p v-for="c in conflicts" :key="c.courseId">
          {{ t('conflict.overlapsWith', { code: c.code }) }}
        </p>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="pt-1 space-y-2">
      <!-- Add mode: Single full-width button -->
      <template v-if="!isEditing">
        <button
          type="submit"
          class="w-full h-10 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-kanit font-medium rounded-xl shadow-xs transition duration-150 flex items-center justify-center gap-1.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1"
        >
          <i class="bi bi-plus-lg" aria-hidden="true" />
          <span>{{ t('form.addCourse') }}</span>
        </button>
      </template>

      <!-- Edit mode: Save button on top, Cancel & Delete below -->
      <template v-else>
        <button
          type="submit"
          class="w-full h-10 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-kanit font-medium rounded-xl shadow-xs transition duration-150 flex items-center justify-center gap-1.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1"
        >
          <i class="bi bi-check-lg" aria-hidden="true" />
          <span>{{ t('form.saveChanges') }}</span>
        </button>

        <div class="grid grid-cols-2 gap-2">
          <button
            type="button"
            @click="cancel"
            class="h-9 px-3 text-xs font-kanit font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition cursor-pointer"
          >
            {{ t('form.cancel') }}
          </button>
          <ConfirmInline
            :label="t('form.delete')"
            :confirm-label="t('form.confirmDelete')"
            @confirm="deleteCourse"
          />
        </div>
      </template>
    </div>
  </form>
</template>
