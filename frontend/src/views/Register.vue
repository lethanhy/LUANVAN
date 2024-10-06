// src/views/Register.vue
<!-- <template>
  <div>
    <h1>Register</h1>
    <form @submit.prevent="Register">
        <input v-model="name" type="text" placeholder="Name" required />
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <input v-model="phone" type="text" placeholder="Phone" required />
      <input v-model="address" type="text" placeholder="Address" required />
      <button type="submit">Register</button>
    </form>
  </div>
</template> -->

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
        <h1>Sign Up</h1>
        <form action=""  @submit.prevent="Register" class="form">
          <input v-model="name" type="text" placeholder="Username">
          <input v-model="password" type="password" placeholder="Password">
          <input v-model="email" type="email" placeholder="Email">
          <input v-model="address" type="text" placeholder="Address">
          <input v-model="phone" type="text" placeholder="Phone">


          <div class="terms">
          <input type="checkbox" id="checkbox">
          <label for="checkbox">I agree to these <a href="#">Terms & Conditions</a></label>
        </div>
        <button class="button__signup" type="submit">Sign Up</button>

        </form>

        
        <div class="member">
          Not a member? <router-link to="/customers/login"> Login Here</router-link>
          
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
        name:'',
      email: '',
      password: '',
      phone:'',
      address:''
    };
  },
  methods: {
    // ...mapActions(['login']),
    async Register() {
      try {
        const response = await api.post('/customers/register', { name: this.name, email: this.email, password: this.password, phone: this.phone, address: this.address });

        // Lưu token vào localStorage
        localStorage.setItem('authToken', response.data.token);

        //Lưu thông tin người dùng vào Pinia store
        const userStore = useUserStore();
        userStore.setUser(response.data.user);

        // Điều hướng đến trang chủ sau khi đăng nhập thành công
        this.$router.push('/customers/login');
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
</style>

