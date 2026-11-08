<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import CourseForm from '@/components/form/CourseForm.vue'
import CourseList from '@/components/list/CourseList.vue'
import { useScheduleStore } from '@/stores/scheduleStore'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{ close: [] }>()
const { t } = useI18n()
const store = useScheduleStore()

function handleBackdropClick() {
  emit('close')
}
</script>

<template>
  <!-- Backdrop (mobile only) -->
  <Transition name="backdrop">
    <div
      v-if="open"
      class="fixed inset-0 bg-black/40 z-20 lg:hidden"
      @click="handleBackdropClick"
      aria-hidden="true"
    />
  </Transition>

  <!-- Sidebar panel -->
  <Transition name="sidebar">
    <aside
      v-show="open"
      :class="[
        'sidebar-panel',
        'fixed inset-y-3 left-3 z-30 w-[calc(100%-1.5rem)] sm:w-[356px] bg-slate-50 border border-slate-300 flex flex-col shrink-0 rounded-2xl p-3',
        'shadow-xl lg:static lg:inset-y-auto lg:my-3 lg:ml-3 lg:mr-3 lg:w-[376px] lg:translate-x-0 lg:shadow-sm',
      ]"
      :aria-label="t('nav.addCourse')"
    >
      <!-- Sidebar header -->
      <div class="mb-3 flex items-center justify-between px-4 py-4 border border-slate-200 rounded-xl shrink-0 bg-white shadow-sm">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full" :class="store.selectedCourseId ? 'bg-amber-500' : 'bg-indigo-600'" />
          <h2 class="text-sm font-bold text-gray-900 font-kanit">
            {{ store.selectedCourseId ? t('nav.editCourse') : t('nav.addCourse') }}
          </h2>
        </div>

        <button
          type="button"
          class="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition cursor-pointer"
          @click="emit('close')"
          :aria-label="t('aria.closeSidebar')"
        ><i class="bi bi-x-lg" aria-hidden="true" /></button>
      </div>

      <!-- Scrollable content -->
      <div class="flex-1 min-h-0 overflow-y-auto divide-y divide-slate-200/80">
        <CourseForm />

        <!-- Load sample data (empty state) -->
        <div v-if="store.courses.length === 0" class="px-1 py-3">
          <button
            type="button"
            @click="store.loadSampleData()"
            class="w-full py-2.5 text-xs font-semibold text-indigo-700 bg-indigo-50/80 border border-indigo-200 rounded-xl hover:bg-indigo-100 transition font-kanit flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <i class="bi bi-lightbulb" aria-hidden="true" />
            <span>{{ t('form.loadSample') }}</span>
          </button>
        </div>

        <CourseList />
      </div>
    </aside>
  </Transition>
</template>

<style scoped>
.sidebar-panel {
  border-radius: 4px;
}

.sidebar-panel :deep(.rounded-md),
.sidebar-panel :deep(.rounded-lg),
.sidebar-panel :deep(.rounded-xl),
.sidebar-panel :deep(.rounded-2xl) {
  border-radius: 4px;
}

.backdrop-enter-active, .backdrop-leave-active { transition: opacity 250ms ease }
.backdrop-enter-from, .backdrop-leave-to { opacity: 0 }

.sidebar-enter-active, .sidebar-leave-active { transition: transform 250ms ease }
.sidebar-enter-from, .sidebar-leave-to { transform: translateX(-100%) }

@media (min-width: 1024px) {
  .sidebar-enter-from, .sidebar-leave-to { transform: none }
}
</style>
