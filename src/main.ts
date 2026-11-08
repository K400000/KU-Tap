import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { i18n } from './i18n'
import App from './App.vue'

import './assets/styles/fonts.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './assets/styles/tokens.css'
import './assets/styles/base.css'
import './assets/main.css'

const pinia = createPinia()

const app = createApp(App)
app.use(pinia)
app.use(i18n)
app.mount('#app')
