import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from '@/plugins/pinia'
import Toast from 'vue-toastification'
import i18n from '@/plugins/i18n'
import './index.css'
import './fonts.css'
import 'vue-toastification/dist/index.css'
const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(Toast, { position: 'bottom-right' })
app.use(i18n)
if (typeof i18n.global.locale.value !== 'string') {
  i18n.global.locale.value = 'hu'
}
app.mount('#app')
