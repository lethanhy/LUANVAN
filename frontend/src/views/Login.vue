// src/views/Login.vue
<template>
  <div class="container login">
    <div class="row shadow rounded">
      <div class="col-lg-6 bg-white d-flex align-items-center justify-content-center">
        <div class="login--body text-center">
          <p class="text-start text-primary">Ocean Breeze Hotel</p>
          <h4 class="login--title">Đăng nhập vào tài khoản của bạn</h4>
          <!-- <p>Chào mừng quay trở lại, chọn phương thức đăng nhập</p> -->

          <!-- Social Login Inputs -->
          <!-- <div class="social-input">
            <div class=" border rounded">
              <div class="d-flex align-items-center m-1">
                <img src="../assets/google.png" alt="Google" class="social-icon" />
                <p class="ms-2 mb-0">Google</p>
              </div>
              
            </div>
            <div class="border rounded">
              <div class="d-flex align-items-center m-1">
                <img src="../assets/facebook-com-logo.avif" alt="Apple" class="social-icon" />
                <p class="ms-2 mb-0">Facebook</p>
              </div>
            </div>
          </div> -->

          <!-- <hr /><span>or continue with email</span> -->

          <!-- Login Form -->
          <form @submit.prevent="login" class="mt-4">
            <input
              v-model="phone"
              type="text"
              class="form-control mb-3"
              placeholder="Nhập số điện thoại..."
            />
            <!-- <div v-if="errors.email" class="text-start rounded error">
              <p class="p-2">{{ errors.email }}</p>
            </div> -->

            <input
              v-model="password"
              type="password"
              class="form-control mb-3"
              placeholder="Nhập mật khẩu..."
              @blur="validatePassword"
            />
            <!-- <div v-if="errors.password" class="text-start rounded error">
              <p class="p-2">{{ errors.password }}</p>
            </div> -->

            <div class="recover text-end">
              <a href="#">Quên mật khẩu?</a>
            </div>

            <button class="btn btn-primary w-100 mt-3" type="submit">Đăng nhập</button>
          </form>

          <div class="member mt-3">
            Không phải là thành viên?
            <router-link to="/customers/register">Đăng ký ngay bây giờ ?</router-link>
          </div> 

          <div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
        </div>
      </div>

      <div class="col-lg-6 bg-light d-flex align-items-center justify-content-center">
        <img
          src="../assets/Villa Chinka by Astor Garden Hotel.jpg"
          alt="Hotel Reservations"
          class="login-image img-fluid"
        />
      </div>
    </div>

    
    
  </div>

  
</template>


<script>
import api from '../api';
import { useUserStore } from '@/stores/userStore';

export default {
  data() {
    return {
      phone: '',
      password: '',
      errorMessage: null,
      // errors: { email: '', password: '' }, // Store errors for validation
      // touched: { email: false, password: false } // Track if fields have been touched
    };
  },
  methods: {
    
    async login() {
      try {
        const response = await api.post('/customers/login', {
          phone: this.phone,
          password: this.password
        });

        localStorage.setItem('authToken', response.data.token);

        const userStore = useUserStore();
        userStore.setUser(response.data.user);
        this.$router.push('/');

      } catch (error) {
        this.errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
        console.error("Registration failed:", error);
      }
    }
  }
};

</script>

<style>
.login {
  max-width: 1000px;
  /* max-height: 800px; */
  margin-top: 1rem;
  margin-bottom: 2rem;
  border-radius: 12px;
  /* padding: 1.5rem; */
}
.login--body {
  margin: 50px 50px;
}
.login--title {
  color: #123f92;
  font-weight: bold;
}

.hotel-name {
  font-size: 1.5rem;
  font-weight: bold;
  color: #11366d;
}

.social-input {
  display: flex;
  /* flex-direction: column; */
  gap: 1rem;
  margin: 1rem 3rem;
  font-size: 10px;
  
}


.social-icon {
  width: 24px; /* Adjust size here */
  height: 24px;
}

.error {
  background: #ffc2c2;
  border-radius: 8px;
  color: #ea4141;
}
.icon--check {
    background-color: rgb(29, 183, 15); /* Màu xanh cho icon */
    color: white; /* Màu của icon */
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%; /* Bo tròn icon */
    font-size: 2rem; /* Tăng kích thước icon */
    margin-bottom: 1rem; /* Tạo khoảng cách giữa icon và text */
}
.icon--check--error {
    background-color: rgb(227, 35, 38); /* Màu xanh cho icon */
    color: white; /* Màu của icon */
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%; /* Bo tròn icon */
    font-size: 2rem; /* Tăng kích thước icon */
    margin-bottom: 1rem; /* Tạo khoảng cách giữa icon và text */
}



.input-group-text {
  background-color: #0f62df;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  border-radius: 5px 0 0 5px;
  font-size: 20px;
}

.input-group .form-control {
  border-radius: 0 5px 5px 0;
}

.recover a {
  color: #464647;
  text-decoration: none;
}

.member a {
  color: rgb(17, 107, 143);
  text-decoration: none;
}
/* Căn chỉnh hình ảnh và đảm bảo tính linh hoạt */
.login-image {
  width: 100%;  /* Đặt chiều rộng hình ảnh 100% cột */
  height: 100%; /* Đặt chiều cao hình ảnh 100% cột */
  object-fit: cover; /* Giúp hình ảnh được cắt vừa khung mà không bị biến dạng */
  border-radius: 0 10px 10px 0; /* Bo góc bên phải của hình ảnh */
}
.success-message {
    position: fixed;
    top: 50%; /* Đặt ở giữa theo chiều dọc */
    left: 50%; /* Đặt ở giữa theo chiều ngang */
    transform: translate(-50%, -50%); /* Dịch chuyển để căn giữa chính xác */
    background: white;
    padding: 2rem;
    border-radius: 12px;
    font-size: 1rem;
    z-index: 9999; /* Đảm bảo thông báo nằm trên các phần tử khác */
    display: flex;
    flex-direction: column;
    align-items: center; /* Căn giữa icon và text theo chiều ngang */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    animation: fadeInOut 3s ease-in-out;
}
.error-message {
    position: fixed;
    top: 50%; /* Đặt ở giữa theo chiều dọc */
    left: 50%; /* Đặt ở giữa theo chiều ngang */
    transform: translate(-50%, -50%); /* Dịch chuyển để căn giữa chính xác */
    background: white;
    padding: 2rem;
    border-radius: 12px;
    font-size: 1rem;
    z-index: 9999; /* Đảm bảo thông báo nằm trên các phần tử khác */
    display: flex;
    flex-direction: column;
    align-items: center; /* Căn giữa icon và text theo chiều ngang */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    animation: fadeInOut 3s ease-in-out;
}
@keyframes fadeInOut {
  0%, 100% { opacity: 0; }
  10%, 90% { opacity: 1; }
}

/* Đảm bảo layout không bị phá trên các màn hình nhỏ */
@media (max-width: 768px) {
  .login {
    margin-top: 3rem;
  }
  .col-lg-6 {
    display: block;
    width: 100%;
    margin-top: 1rem;
  }
}


</style>

<!-- <style>

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  
}

.body{
  background: #dfe9f5;
}

.wrapper{
  width: 330px;
  padding: 2rem 1rem;
  margin: 100px auto;
  background-color: #fff;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 20px 35px rgba(0, 0, 0, 0.1);
}
h1{
  font-size: 2rem;
  color: #07001f;
  margin-bottom: 1.2rem;
}
.form input{
  width: 92%;
  outline: none;
  border: 5px solid #fff;
  padding: 12px;
  background: #e4e4e4;
  border-radius: 20px;
}
.button__signup{
  font-size: 1rem;
  margin-top: 1.8rem;
  padding: 10px 0;
  border-radius: 20px;
  outline: none;
  border: none;
  width: 90%;
  color: #fff;
  cursor: pointer;
  background: rgb(17, 107, 143);

}
.button__signup:hover{
  background: rgba(17, 107, 143, 0.877);
}
input:focus{
  border: 1px solid rgb(192, 192, 192);
}
.terms{
  margin-top: 0.2rem;
}
.terms input{
  height: 1em;
  width: 1em;
  vertical-align: middle;
  cursor: pointer;
}
.terms label{
  font-size: 0.7rem;
}
.terms a{
  color: rgb(17, 107, 143);
  text-decoration: none ;
}
.member{
  font-size: 0.8rem;
  margin-top: 1.4rem;
  color: #636363;
}
.member a{
  color: rgb(17, 107, 143);
}
.recover{
  text-align: right;
  font-size: 0.7rem;
  margin: 0.3rem 1.4rem 0 0;
}

.recover a{
  text-decoration: none;
  color: #464647;
}
</style> -->
