// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import api from './api';
import { createPinia } from 'pinia';
import { useUserStore } from '@/stores/userStore'; // Import userStore

// Tạo ứng dụng Vue
const app = createApp(App);

// Cấu hình Axios
app.config.globalProperties.$http = api;

// Sử dụng Pinia
app.use(createPinia());

  // Khôi phục trạng thái người dùng từ localStorage nếu có
const userStore = useUserStore();
const savedUser = localStorage.getItem('user');
if (savedUser) {
  userStore.setUser(JSON.parse(savedUser));
}


// Sử dụng Router
app.use(router);

// Mount ứng dụng vào phần tử DOM
app.mount('#app');
