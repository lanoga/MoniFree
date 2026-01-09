import { defineStore } from 'pinia'
import httpClient from '@/services/httpClient'

export const useAuth = defineStore('auth', {
  state: () => ({
    accessToken: null,
    menus: [],
    loading: false,
    userData: null,
  }),

  getters: {
    isLoggedIn: state => !!(state.userData && state.accessToken),
  },

  actions: {
    setAuthUser({ accessToken }) {
      this.accessToken = accessToken
      const savedData = {
        accessToken: this.accessToken,
        menus: this.menus,
      }

      localStorage.setItem('auth', JSON.stringify(savedData))
    },
    setUser({ userData  }) {
      this.userData = userData
    },

    removeAuthUser() {
      this.accessToken = null
      this.menus = []
      this.userData = null

      localStorage.removeItem('auth')
    },

    getMenus() {
      return httpClient.get('/get-menus').then(r => {
        this.menus = (r.data ?? []).filter(m => m.href)
        console.log('Menus fetched:', this.menus)
      })
    }

  },
})
