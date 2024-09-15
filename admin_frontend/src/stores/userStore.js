// src/stores/userStore.js
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,   // Stores the user object when logged in
  }),
  getters: {
    isLoggedIn: (state) => !!state.user,  // A computed property to check if the user is logged in
  },
  actions: {
    setUser(user) {
      this.user = user;  // Sets the user data
    },
    clearUser() {
      this.user = null;  // Clears the user data, effectively logging out the user
    }
  }
});
