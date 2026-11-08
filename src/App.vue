<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSettingsStore } from '@/stores/settingsStore'
import AppShell from '@/components/layout/AppShell.vue'
import ToastManager from '@/components/ui/ToastManager.vue'
import AnnouncementModal from '@/components/ui/AnnouncementModal.vue'

const { locale } = useI18n()
const settings = useSettingsStore()

onMounted(() => {
  locale.value = settings.locale
  document.documentElement.lang = settings.locale

  try {
    localStorage.removeItem('schedule-builder:v1')
    localStorage.removeItem('schedule-builder:v1:settings')
  } catch (error) {
    console.warn('Could not remove data saved by an earlier version:', error)
  }
})
</script>

<template>
  <AppShell />
  <ToastManager />
  <AnnouncementModal />
</template>
