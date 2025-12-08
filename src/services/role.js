import { useAuth } from '@/stores/auth'

export const hasPermission = permission => {
  const auth = useAuth()
  return auth.permissions.find(data => data.title === permission)
}

export const hasRole = role => {
  const auth = useAuth()
  return auth?.userData?.role === role
}
