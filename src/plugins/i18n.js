import { createI18n } from 'vue-i18n'
import messages from '@/i18n'

export default createI18n({
  legacy: false,
  locale: 'hu',
  fallbackLocale: 'hu',
  messages,
})
