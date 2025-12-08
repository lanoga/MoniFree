import { createApp } from 'vue'
import Toast from 'vue-toastification'
import App from './App.vue'
import router from './router'
import i18n from '@/plugins/i18n'
import pinia from '@/plugins/pinia'

import './index.css'
import './fonts.css'
import 'vue-toastification/dist/index.css'

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(Toast, { position: 'bottom-right' })
app.use(i18n)

app.mount('#app')
