import { defineStore } from 'pinia'

import httpClient from '@/services/httpClient'

export const COLLECTION_TYPES = {
  COUNTRIES: 'countries',
}

export const COLLECTIONS = [COLLECTION_TYPES.COUNTRIES]

export const useCollections = defineStore('collections', {
  state: () => {
    return {
      items: {
        countries: [],
      },
    }
  },
  getters: {
    getCollectionByKey: state => {
      return collectionKey => state.items[collectionKey]
    },
  },
  actions: {
    async getCollection(collectionName) {
      if (this.items[collectionName].length) {
        return Promise.resolve(this.items[collectionName])
      } else {
        const response = await httpClient.get(collectionName)
        const data = response?.data || []
        this.items[collectionName] = data

        return Promise.resolve(data)
      }
    },
    getAllCollections(collections) {
      return Promise.all(collections.map(collectionName => this.getCollection(collectionName)))
    },
  },
  persist: {
    paths: ['items'],
  },
})
