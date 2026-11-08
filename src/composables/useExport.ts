import { ref } from 'vue'
import { useSettingsStore } from '@/stores/settingsStore'
import { useScheduleStore } from '@/stores/scheduleStore'
import { themes } from '@/lib/themes'
import { useToast } from '@/composables/useToast'
import { useI18n } from 'vue-i18n'
import type { ExportFormat, ExportScale } from '@/types'

export function useExport() {
  const isExporting = ref(false)
  const exportError = ref<string | null>(null)
  const settings = useSettingsStore()
  const schedule = useScheduleStore()
  const { showToast } = useToast()
  const { t } = useI18n()

  async function exportSchedule(
    canvasEl: HTMLElement,
    format: ExportFormat,
    scale: ExportScale = 2,
  ) {
    isExporting.value = true
    exportError.value = null

    try {
      // 1. Lazy-load libraries
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import('html2canvas-pro'),
        import('jspdf'),
      ])

      // 2. Wait for fonts
      await document.fonts.ready
      await Promise.all([
        document.fonts.load('16px Kanit'),
        document.fonts.load('16px Inter'),
      ]).catch(() => {}) // Don't block if font loading fails

      // 3. Clamp scale for device limits
      let effectiveScale = scale
      const maxDim = 16000
      const maxPixels = 16_700_000
      const rect = canvasEl.getBoundingClientRect()
      const w = rect.width * effectiveScale
      const h = rect.height * effectiveScale
      if (w > maxDim || h > maxDim || w * h > maxPixels) {
        effectiveScale = Math.floor(
          Math.min(maxDim / rect.width, maxDim / rect.height, Math.sqrt(maxPixels / (rect.width * rect.height))),
        ) as ExportScale
        exportError.value = 'export.reduced'
      }

      const theme = themes[settings.theme]
      const canvas = await html2canvas(canvasEl, {
        scale: effectiveScale,
        backgroundColor: theme.bg,
        useCORS: true,
        logging: false,
        windowWidth: 1600,
      })

      const slug = schedule.title
        ? schedule.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        : null
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '')
      const filename = slug ? `${slug}-${dateStr}` : `schedule-${dateStr}`

      if (format === 'png') {
        await downloadBlob(canvas, 'image/png', 1, `${filename}.png`)
      } else if (format === 'jpg') {
        await downloadBlob(canvas, 'image/jpeg', 0.92, `${filename}.jpg`)
      } else if (format === 'pdf') {
        const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
        const pageW = 297
        const pageH = 210
        const margin = 10
        const contentW = pageW - margin * 2
        const contentH = pageH - margin * 2
        const imgW = canvas.width
        const imgH = canvas.height
        const ratio = Math.min(contentW / imgW, contentH / imgH)
        const drawW = imgW * ratio
        const drawH = imgH * ratio
        const x = margin + (contentW - drawW) / 2
        const y = margin + (contentH - drawH) / 2
        const imgData = canvas.toDataURL('image/jpeg', 0.95)
        pdf.addImage(imgData, 'JPEG', x, y, drawW, drawH, undefined, 'FAST')
        pdf.save(`${filename}.pdf`)
      }
    } catch (err) {
      console.error('Export error:', err)
      exportError.value = 'export.error'
      showToast(t('export.error'), 'error')
    } finally {
      isExporting.value = false
    }
  }

  return { isExporting, exportError, exportSchedule }
}

function downloadBlob(
  canvas: HTMLCanvasElement,
  mime: string,
  quality: number,
  filename: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) { reject(new Error('toBlob returned null')); return }
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        a.click()
        setTimeout(() => { URL.revokeObjectURL(url); resolve() }, 100)
      },
      mime,
      quality,
    )
  })
}

