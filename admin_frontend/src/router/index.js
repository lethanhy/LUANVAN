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
import DetailsBooking from '@/views/DetailsBooking.vue';
import Profile from '@/views/Profile.vue';
import Bill from '@/views/Bill.vue';
import Review from '@/views/Review.vue';
import RoomType from '@/views/RoomType.vue';
import Contact from '@/views/Contact.vue';
import Role from '@/views/Role.vue';
import CleanRoom from '@/views/CleanRoom.vue';
import Invoice from '@/views/Invoice.vue';
import { isVNode } from 'vue';
import { useUserStore } from '@/stores/userStore';


const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/bookings', name: 'Booking', component: Booking, meta: { requiresRole: ['Quản lý','Lễ tân'] } },
  { path: '/bookings/:id', name: 'DetailsBooking', component: DetailsBooking, meta: { requiresRole: ['Quản lý','Lễ tân'] } },
  { path: '/bookings/order', name: 'Order', component: Order, meta: { requiresRole: ['Quản lý','Lễ tân'] } },
  { path: '/customers/login', name: 'Login', component: Login, meta: { requiresRole: 'Quản lý' } },
  { path: '/customers/register', name: 'Register', component: Register, meta: { requiresRole: 'Quản lý' } },
  { path: '/rooms', name: 'Room', component: Room, meta: { requiresRole: ['Quản lý','Lễ tân'] } },
  { path: '/rooms/:id', name: 'roomDetails', component: RoomDetails, meta: { requiresRole: ['Quản lý','Lễ tân'] } },
  { path: '/customers', name: 'Customer', component: Customer, meta: { requiresRole: 'Quản lý' } },
  { path: '/rooms/manager', name: 'RoomManager', component: RoomManager,meta: { requiresRole: 'Quản lý' } },
  { path: '/menu', name: 'Service', component: Service, meta: { requiresRole: 'Quản lý' } },
  { path: '/profile/:id', name: 'Profile', component: Profile },
  { path: '/bill', name: 'Bill', component: Bill, meta: { requiresRole: 'Quản lý' } },
  { path: '/review', name: 'Review', component: Review, meta: { requiresRole: ['Quản lý', 'Lễ tân'] } },
  { path: '/roomtype', name: 'RoomType', component: RoomType, meta: { requiresRole: 'Quản lý' } },
  { path: '/contact', name: 'Contact', component: Contact, meta: { requiresRole: ['Quản lý', 'Lễ tân'] } },
  { path: '/role', name: 'Role', component: Role},
  { path: '/cleanroom', name: 'CleanRoom', component: CleanRoom, meta: { requiresRole: 'Quản lý' }},
  { path: '/invoice', name: 'Invoice', component: Invoice, meta: { requiresRole: ['Quản lý', 'Lễ tân'] }},
  
];



const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();  // Lấy dữ liệu người dùng từ Pinia store
  const userRole = userStore.getUserRole;  // Lấy vai trò người dùng
  const requiresRole = to.meta.requiresRole;  // Lấy vai trò yêu cầu cho route

  // Kiểm tra xem route có yêu cầu vai trò hay không, và nếu vai trò người dùng không có trong danh sách các vai trò được phép
  if (requiresRole && !requiresRole.includes(userRole)) {
    next({ name: 'Login' });  // Nếu vai trò không khớp, chuyển hướng đến trang đăng nhập
  } else {
    next();  // Cho phép điều hướng nếu vai trò khớp
  }
});

export default router;
