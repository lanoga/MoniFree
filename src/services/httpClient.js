import axios from 'axios'
import router from '@/router'
import { useToast } from 'vue-toastification'
import { useAuth } from '@/stores/auth'
import i18n from '@/plugins/i18n'

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

httpClient.interceptors.request.use(config => {
  const auth = useAuth()

  if (auth.accessToken) {
    config.headers = config.headers || {}
    config.headers.Authorization = auth.accessToken ? `Bearer ${auth.accessToken}` : ''
  }

  return config
})

httpClient.interceptors.response.use(
  response => {
    return response
  },
  error => {
    const auth = useAuth()
    const toast = useToast()
    const { t } = i18n.global

    console.error(`[StartVue3] ApiService ${error}`)

    switch (error.response.status) {
      case 401:
        auth.removeAuthUser()
        toast.warning(t('generalError.sessionExpired'))
        router.push('/login')
        break
      case 403:
        auth.removeAuthUser()
        toast.error(t('generalError.notAuthorized'))
        router.push('/not-authorized')
        break
      case 500:
        toast.error(t('generalError.server'))
        break
      default:
        return Promise.reject(error)
    }
  },
)

export default httpClient
