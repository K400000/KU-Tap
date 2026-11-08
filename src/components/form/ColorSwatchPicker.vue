<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useSettingsStore } from '@/stores/settingsStore'
import { themes } from '@/lib/themes'
import { computed } from 'vue'

const props = defineProps<{
  modelValue: string
}>()
const emit = defineEmits<{ 'update:modelValue': [v: string] }>()

const { t } = useI18n()
const settings = useSettingsStore()
const palette = computed(() => themes[settings.theme]?.palette ?? [])

function select(color: string) {
  emit('update:modelValue', color)
}

function onCustom(e: Event) {
  const val = (e.target as HTMLInputElement).value
  emit('update:modelValue', val)
}
</script>

<template>
  <div class="grid grid-cols-7 gap-2 w-full place-items-center">
    <button
      v-for="color in palette"
      :key="color"
      type="button"
      :aria-label="color"
      :title="color"
      @click="select(color)"
      :style="{ backgroundColor: color }"
      :class="[
        'w-8 h-8 rounded-full transition-all duration-150 hover:scale-110 active:scale-95 flex items-center justify-center relative cursor-pointer',
        modelValue === color
          ? 'ring-2 ring-indigo-600 ring-offset-2 scale-105 shadow-md'
          : 'ring-1 ring-black/10 hover:ring-black/25',
      ]"
    >
      <i v-if="modelValue === color" class="bi bi-check-lg text-white text-xs drop-shadow" aria-hidden="true" />
    </button>

    <!-- Custom color picker -->
    <label
      :title="t('form.customColor')"
      class="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 hover:border-indigo-500 cursor-pointer flex items-center justify-center transition-all hover:scale-105 relative"
      :style="modelValue && !palette.includes(modelValue) ? { backgroundColor: modelValue, borderColor: 'transparent', boxShadow: '0 0 0 2px #4F46E5, 0 0 0 4px #fff' } : {}"
    >
      <span
        class="text-xs font-bold leading-none"
        :style="{ color: modelValue && !palette.includes(modelValue) ? '#fff' : '#6B7280' }"
      >+</span>
      <input type="color" class="sr-only" :value="modelValue" @input="onCustom" />
    </label>
  </div>
</template>
