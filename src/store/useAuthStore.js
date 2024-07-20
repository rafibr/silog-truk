// pinia useAuthStore.js

import { defineStore } from 'pinia'

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    // based on localStorage
    username: JSON.parse(localStorage.getItem('username')) || null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.username,
  },
  actions: {
    login(username) {
      this.username = username

      // set in localStorage
      localStorage.setItem('username', JSON.stringify(username))
    },
    logout() {
      this.username = null

      // remove from localStorage
      localStorage.removeItem('username')
    },
  },
})

