<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSettingsStore } from '@/stores/settingsStore'
import AppShell from '@/components/layout/AppShell.vue'
import ToastManager from '@/components/ui/ToastManager.vue'
import AnnouncementModal from '@/components/ui/AnnouncementModal.vue'

const { locale } = useI18n()
const settings = useSettingsStore()

function confirmBeforeLeaving(event: BeforeUnloadEvent) {
  event.preventDefault()
  event.returnValue = ''
}

onMounted(() => {
  locale.value = settings.locale
  document.documentElement.lang = settings.locale
  window.addEventListener('beforeunload', confirmBeforeLeaving)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', confirmBeforeLeaving)
})
</script>

<template>
  <AppShell />
  <ToastManager />
  <AnnouncementModal />
</template>
