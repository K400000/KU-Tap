<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useWindowSize } from '@vueuse/core'
import Topbar from './Topbar.vue'
import SidebarDrawer from './SidebarDrawer.vue'
import ScheduleCanvas from '@/components/schedule/ScheduleCanvas.vue'

const { width } = useWindowSize()
const isDesktop = computed(() => width.value >= 1024)

const sidebarOpen = ref(true)
const scheduleCanvasRef = ref<InstanceType<typeof ScheduleCanvas> | null>(null)
const exportCanvasRef = ref<InstanceType<typeof ScheduleCanvas> | null>(null)

// Prefer the dedicated 1600px off-screen export clone; fallback to live canvas
const canvasEl = computed(() => exportCanvasRef.value?.canvasEl ?? scheduleCanvasRef.value?.canvasEl ?? null)

function openSidebar() { sidebarOpen.value = true }
function closeSidebar() { sidebarOpen.value = false }

// Auto-open on desktop
watch(isDesktop, (d) => { if (d) sidebarOpen.value = true })
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-slate-100">
    <!-- Sidebar -->
    <SidebarDrawer :open="isDesktop || sidebarOpen" @close="closeSidebar" />

    <!-- Main area -->
    <div class="flex-1 flex flex-col min-w-0 relative">
      <Topbar :canvas-el="canvasEl" :show-menu-button="!isDesktop" @open-sidebar="openSidebar" />
      <main class="flex-1 min-h-0 overflow-hidden relative p-4 lg:p-6">
        <div class="h-full overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-sm">
          <ScheduleCanvas ref="scheduleCanvasRef" />
        </div>

        <!-- Floating action button on mobile/tablet to open sidebar -->
        <button
          v-if="!isDesktop && !sidebarOpen"
          type="button"
          @click="openSidebar"
          aria-label="Add course"
          class="fixed bottom-6 right-6 z-20 w-14 h-14 rounded-full bg-indigo-600 text-white shadow-xl hover:bg-indigo-700 active:scale-95 flex items-center justify-center text-xl transition-all focus:outline-none focus:ring-4 focus:ring-indigo-300"
        >
          <i class="bi bi-plus-lg" aria-hidden="true" />
        </button>
      </main>
    </div>

    <!-- Dedicated off-screen export clone (Section 9.3: fixed 1600px width) -->
    <div
      style="position: fixed; left: -99999px; top: 0; width: 1600px; height: auto; pointer-events: none; z-index: -999;"
      aria-hidden="true"
    >
      <ScheduleCanvas ref="exportCanvasRef" export-mode />
    </div>
  </div>
</template>
