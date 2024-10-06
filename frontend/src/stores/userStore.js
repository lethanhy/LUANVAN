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
      localStorage.setItem('user', JSON.stringify(user));  // Save user data to localStorage
    },
    clearUser() {
      this.user = null;  // Clears the user data, effectively logging out the user
      localStorage.removeItem('user');  // Remove user data from localStorage
    },
    restoreUser() {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        this.user = JSON.parse(storedUser);  // Restore user data from localStorage
      }
    }
  }
});
