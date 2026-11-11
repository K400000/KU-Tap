import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import { i18n } from './i18n'
import App from './App.vue'
import {
  configureStorageErrorHandler,
  createScheduleStorage,
  reportStorageError,
  requestPersistentStorage,
} from './lib/storage'
import { useToast } from './composables/useToast'

import './assets/styles/fonts.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './assets/styles/tokens.css'
import './assets/styles/base.css'
import './assets/main.css'

const pinia = createPinia()
const { showToast } = useToast()
configureStorageErrorHandler(() => {
  showToast(i18n.global.t('storage.error'), 'error')
})
pinia.use(createPersistedState({ storage: createScheduleStorage(() => reportStorageError()) }))

const app = createApp(App)
app.use(pinia)
app.use(i18n)
requestPersistentStorage()
app.mount('#app')
