// pinia useAuthStore.js
import axios from 'axios'
import { defineStore } from 'pinia'

export const useDataDukungStore = defineStore({
  id: 'dataDukung',
  actions: {
    // CRUD data dukung to local json file
    async getDataDukung() {
      const url = `${import.meta.env.VITE_APP_URL}/data/data-dukung`

      try {
        return await axios.get(url).then((res) => {
          this.dataDukung = res.data
        })

      } catch (error) {
        console.error(error)
      }
    },

    async saveDataDukung(data) {
      const url = `${import.meta.env.VITE_APP_URL}/data/data-dukung`

      try {
        return await axios.post(url, data).then((res) => {
          this.dataDukung = res.data
        })

      } catch (error) {
        console.error(error)
      }
    },
  },
  state: () => ({
    dataDukung: [],
  }),

})
