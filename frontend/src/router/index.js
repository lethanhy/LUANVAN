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
import Contact from '../views/Contact.vue';
import Review from '../views/Review.vue';


const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/rooms', name: 'Booking', component: Booking },
  { path: '/customers/login', name: 'Login', component: Login },
  { path: '/customers/register', name: 'Register', component: Register },
  { path: '/customers/:id', name: 'Customers', component: Customers },
  { path: '/rooms/:id', name: 'Room', component: Room },
  { path: '/order/:id', name: 'Order', component: Order },
  { path: '/history/:id', name: 'History', component: History },
  { path: '/contact', name: 'Contact', component: Contact },
  { path: '/review', name: 'Review', component: Review },
  
  
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
