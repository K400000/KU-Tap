import { ref } from 'vue'

export interface ToastItem {
  id: number
  message: string
  type: 'info' | 'success' | 'error' | 'warning'
  duration?: number
}

const toasts = ref<ToastItem[]>([])
let counter = 0

export function useToast() {
  function showToast(message: string, type: ToastItem['type'] = 'info', duration = 3500) {
    const id = ++counter
    toasts.value.push({ id, message, type, duration })
  }

  function removeToast(id: number) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  return { toasts, showToast, removeToast }
}

