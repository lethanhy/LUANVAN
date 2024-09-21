// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Booking from '../views/Booking.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Room from '../views/Room.vue';
import RoomDetails from '@/views/DetailRoom.vue';
import Order from '@/views/Order.vue';
import Customer from '@/views/Customer.vue';
import RoomManager from '@/views/RoomManager.vue';
import Service from '@/views/Service.vue';


const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/bookings', name: 'Booking', component: Booking },
  { path: '/bookings/order', name: 'Order', component: Order },
  { path: '/customers/login', name: 'Login', component: Login },
  { path: '/customers/register', name: 'Register', component: Register },
  { path: '/rooms', name: 'Room', component: Room },
  { path: '/rooms/:id', name: 'roomDetails', component: RoomDetails },
  { path: '/customers', name: 'Customer', component: Customer },
  { path: '/rooms/manager', name: 'RoomManager', component: RoomManager },
  { path: '/menu', name: 'Service', component: Service },
  
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
