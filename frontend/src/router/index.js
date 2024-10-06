// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Booking from '../views/Booking.vue';
import Customers from '../views/Account.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Room from '../views/Room.vue';
import Order from '../views/Order.vue';
import History from '../views/History.vue';


const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/rooms', name: 'Booking', component: Booking },
  { path: '/customers/login', name: 'Login', component: Login },
  { path: '/customers/register', name: 'Register', component: Register },
  { path: '/customers/:id', name: 'Customers', component: Customers },
  { path: '/room', name: 'Room', component: Room },
  { path: '/order', name: 'Order', component: Order },
  { path: '/history', name: 'History', component: History }
  
  
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
