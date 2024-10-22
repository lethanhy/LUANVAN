<!-- <script setup>
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
</script> -->

<template>
  <div id="app">
    <!-- <header>
      <nav>
        <router-link to="/">Home</router-link> |
        <router-link to="/customers/login">Login</router-link> |
        <router-link to="/customers/register">Register</router-link>
      </nav>
    </header> -->

    <nav class="nav">
      <div class="nav__logo">Ocean Breeze Hotel</div>

      <div class="nav__menu">
          <ul class="nav__links">
            <li class="link"><a href="#"><router-link to="/">Home</router-link></a></li>
            <li class="link"><a href="#"><router-link to="/rooms">Room</router-link></a></li>
            <li class="link"><a href="#"><router-link to="/review">Review</router-link></a></li>
            <li class="link"><a href="#"><router-link to="/contact">Contact Us</router-link></a></li>
          </ul>

     
            <div class="nav__button" v-if="!isLoggedIn">
              <button><a href=""><router-link to="/customers/login">Đăng nhập</router-link></a></button>
            </div>
            <div v-else class="nav__button" id="dropdown">
              <button class="dropbtn">Welcome, {{ user.name }}</button>
              <div class="dropdown-content">
                <a href="#"><router-link :to="{ name: 'Customers', params: { id: user.id } }">Tài khoản</router-link></a>
                <a href="#"><router-link :to="{ name: 'History', params: { id: user.id } }">Lịch sử</router-link></a>
                <a href="" @click="logout">Đăng xuất</a>
              </div>
              <!-- <p>Welcome, {{ user.name }}</p> -->
            
            </div>
          

      </div>
    </nav>
    

    
    <main>
      <router-view></router-view>
    </main>

    <footer class="footer">
      <div class="section__container footer__container">
        <div class="footer__col">
          <h3 class="text-primary">Ocen Breeze Hotel</h3>
          <p>
            Ocen Breeze Hotel is a premier hotel booking website that offers a seamless and
            convenient way to find and book accommodations worldwide.
          </p>
          <p>
            With a user-friendly interface and a vast aelection of hotels,
            Ocen Breeze Hotel aims to provide a stress-free experience for travelers
            seeking the perfect stay.
          </p>
        </div>
        <div class="footer__col">
          <h4>Company</h4>
          <p>About Us</p>
          <p>Our Team</p>
          <p>Blog</p>
          <p>Book</p>
          <p>Contact Us</p>
        </div>

        <div class="footer__col">
          <h4>Legal</h4>
          <p>FAQs</p>
          <p>Terms & Conditions</p>
          <p>Privacy Policy</p>
        </div>

        <div class="footer__col">
          <h4>Resources</h4>
          <p>Social Media</p>
          <p>Our Team</p>
          <p>Help Center</p>
          <p>Partnerships</p>
        </div>

        
      </div>

      <!-- <div class="footer__bar">
        Copyright @ 2024 Thanh Y.
      </div> -->

    </footer>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useUserStore } from './stores/userStore';

// Use the store
const userStore = useUserStore();

// Khôi phục trạng thái người dùng khi ứng dụng tải lại
onMounted(() => {
  userStore.restoreUser();
});

// Computed properties
const isLoggedIn = computed(() => userStore.isLoggedIn);
const user = computed(() => userStore.user);

// Methods
const logout = () => {
  userStore.clearUser();
};
</script>

<style>
:root{
  --primary-color: #2c3855;
  --primary-color-dark: #435681;
  --text-dark: #333333;
  --text-light: #767268;
  --extra-light: #f3f4f6;
  --white: #ffffff;
  --max-width: 1200px;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  /* margin-top: 60px; */
}

/* header nav {
  background-color: #34495e;
  padding: 15px;
  color: white;
}

header nav a {
  color: white;
  text-decoration: none;
  margin: 0 15px;
}

main {
  padding: 20px;
} */
.section__container{
  max-width: var(--max-width);
  margin: auto;
  padding: 5rem 1rem;
}

.section__header {
  font-size: 2rem;
  font-weight: 600;
  color: var(--text-dark);
  text-align: center;
}

a {
  text-decoration: none;
}

img{
  width: 100%;
  display: flex;
}

.nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  /* max-width: 100%; */
  margin: auto;
  padding: 1rem 2rem;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: space-around;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}
/* nav{
  max-width: var(--max-width);
  margin: auto;
  padding: 2rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
} */

.nav__logo{
  font-size: 1.8rem;
  font-weight: 700;
  color: rgb(0, 166, 255);
}
.nav__menu {
  display: flex;
  align-items: center;
  justify-content: center;
}
.nav__links{
  list-style: none ;
  display: flex;
  align-items: center;
  gap: 3rem;
  margin-top: 1rem;
}

.dropbtn {
  padding: 16px;
  border: none;
  cursor: pointer;
}

#dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: white;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
}

.dropdown-content a {
  color: black;
  padding: 5px 16px;
  text-decoration: none;
  display: block;
}

.dropdown-content a:hover {background-color: #f1f1f1}

#dropdown:hover .dropdown-content {
  display: block;
}



.nav__button {
  padding-left: 1rem;
}
.nav__button button {
  padding: 0.5rem 1rem;
  background-color: rgb(174, 245, 250);
  border: none;
  border-radius: 5px;
  font-weight: 600;
  cursor: pointer;
  /* transition: background-color 0.3s; */
}
.nav__button button a{
  color: var(--text-dark);
}

.nav__button button:hover {
  background-color: #43E8E4;
}

.link a {
  font-weight: 500;
  color: var(--text-light);
  transition: 0.3s;
}
.link a:hover{
  color: var(--primary-color);
}



.footer {
  background-color: var(--extra-light);
}

.footer__container{
  display: grid;
  grid-template-columns: 2fr repeat(3, 1fr);
  gap: 5rem;
}

.footer__col h3{
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-dark);
}

.footer__col h4{
  margin-bottom: 1rem;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-dark);
}

.footer__col p{
  margin-bottom: 1rem;
  color: var(--text-light);
  cursor: pointer;
  transition: .3s;
}

.footer__col p:hover{
  color: var(--text-dark);
}

.footer__bar{
  position: relative;
  max-width: var(--max-width);
  margin: auto;
  padding: 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-light);
  text-align: right;
  overflow: hidden;

}

.footer__bar::before{
  position: absolute;
  content: " ";
  top: 50%;
  right: 28rem;
  transform: translateY(-50%);
  width: 20rem;
  background-color: var(--text-light);
}

</style>
