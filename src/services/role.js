import { useAuth } from '@/stores/auth'

export const hasRole = role => {
  const auth = useAuth()
  return auth?.userData?.role === role
}
