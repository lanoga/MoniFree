import { defineStore } from 'pinia'

import httpClient from '@/services/httpClient'

export const useAuth = defineStore('auth', {
  state: () => {
    return {
      userData: null,
      accessToken: null,
      menus: [],
      loading: false,
      permissions: [],
    }
  },
  getters: {
    isLoggedIn: state => !!(state.userData && state.accessToken),
  },
  actions: {
    setAuthUser({ userData, accessToken }) {
      this.userData = userData
      this.accessToken = accessToken
    },
    removeAuthUser() {
      this.userData = null
      this.accessToken = null
      this.menus = []
    },
    getMenus() {
      return httpClient.get('/menus').then(response => {
        const data = response?.data || []
        this.menus = data
      })
    },
    getPermissions() {
      return httpClient.get('/permissions').then(response => {
        const data = response?.data || []
        this.permissions = data
      })
    },
  },
  persist: {
    paths: ['userData', 'accessToken', 'menus', 'permissions'],
  },
})
