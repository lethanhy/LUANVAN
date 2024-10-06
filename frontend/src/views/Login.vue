// src/views/Login.vue
<template>
  <!-- <div>
    <h1>Login</h1>
    <form @submit.prevent="login">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  </div> -->

 
    <div class="body">
      <div class="wrapper">
        <h1>Login</h1>
        <form action="#" class="form" @submit.prevent="login">
          <input v-model="email"  type="email" placeholder="Email">
          <input  v-model="password" type="password" name="" id="" placeholder="Password">
          <div class="recover">
            <a href="">Forgot Password?</a>
          </div>
          <button class="button__signup" type="submit">Login</button>
        </form>
        <div class="member">
          Not a member? <router-link to="/customers/register">Register Now</router-link>
           
        </div>
      </div>
    </div>
</template>

<script>
import api from '../api';
// import { mapActions } from 'vuex';
import { useUserStore } from '@/stores/userStore';

export default {
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    // ...mapActions(['login']),
    async login() {
      try {
        const response = await api.post('/customers/login', { email: this.email, password: this.password });

        // Lưu token vào localStorage
        localStorage.setItem('authToken', response.data.token);

        //Lưu thông tin người dùng vào Pinia store
        const userStore = useUserStore();
        userStore.setUser(response.data.user);

        // Điều hướng đến trang chủ sau khi đăng nhập thành công
        this.$router.push('/');
      } catch (error) {
        console.log('Login failed:', error);
      }
    }
  }
};
</script>

<style>

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
</style>
