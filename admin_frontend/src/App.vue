<!-- <script setup>
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
</script> -->

<template>
  <div id="app">
    <div  v-if="isLoggedIn">
    <div class="body">
    <div class="sidebar">
        <div class="logo">OCEAN BREEZE</div>
            <ul class="menu">
                <li class="active">
                    <a href="#" >
                        <i class="fas fa-tachometer-alt"></i>
                        <span>Dashboard</span>
                    </a>
                </li>
                <li>
                    <router-link to="/" class="menu-item">
                        <i class="fas fa-house"></i>
                        <span>Trang Chủ</span>
                    </router-link>
                </li>
                <li>
                    <router-link to="/rooms" class="menu-item">
                        <i class="fa-solid fa-calendar-days"></i>
                        <span>Phòng</span>
                    </router-link>
                </li>
                <li>
                    <router-link to="/bookings" class="menu-item">
                      <i class="fa-solid fa-file-invoice-dollar"></i>
                        <span>Đặt phòng</span>
                    </router-link>
                </li>
                <li>
                    <router-link to="/bill" class="menu-item">
                        <i class="fa-regular fa-clipboard"></i>
                        <span>Nhân viên</span>
                    </router-link>
                </li>
                <li>
                    <router-link to="/customers" class="menu-item">
                    <i class="fa-regular fa-address-book"></i>
                        <span>Khách Hàng</span>
                    </router-link>
                   
                </li>
                <li>
                    <router-link to="/rooms/manager" class="menu-item">
                      <i class="fa-regular fa-clipboard"></i>
                        <span>QL phòng</span>
                    </router-link>
                </li>
                <li>
                    <router-link to="/menu" class="menu-item">
                      <i class="fa-regular fa-clipboard"></i>
                        <span>QL dịch vụ</span>
                    </router-link>
                </li>
                <li>
                      <router-link to="/review" class="menu-item">
                        <i class="fas fa-question-circle"></i>
                        <span>Đánh giá</span>
                      </router-link>
                </li>
                
                
                <!-- <li class="logout">
                    <a href="" >
                        <i class="fas fa-sign-out-alt"></i>
                        <span>Logout</span>
                    </a>
                </li> -->
            </ul>
    </div>

      <div class="main--content">
          <div class="header--wrapper">
              <div class="header--title">
                  <span>Primary</span>
                  <h2>Dashboard</h2>
              </div>
              <div class="user--info">

                  <div class="bell-contact">
                    <div>{{ totalContact }}</div>
                    <router-link to="/contact" class="text-dark"><i class="fa-solid fa-bell"></i></router-link>
                    
                  </div>
                  <!-- <div class="searh--box">
                      <i class="fa-solid fa-search"></i>
                      <input type="text" placeholder="Search">
                  </div> -->
                  
                  <div class="dropdown">
                    <a class="nav-link dropdown-toggle d-flex" href="#" id="dropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      <img src="./assets/logo.jpg" alt="">
                      <p class="fs-5">{{ user.name }}</p>
                     <!-- <p>{{ user.role }}</p> -->
                    </a>

                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                      <li><a class="dropdown-item" href="#"><router-link :to="{ name: 'Profile', params: { id: user.id } }" class="fs-6 menu-item text-dark">Tài khoản</router-link></a></li>
                      <li><a class="dropdown-item" href="#">Lịch sử</a></li>
                      <li><hr class="dropdown-divider"></li>
                      <li><a class="dropdown-item"  @click="logout" href="#">Đăng xuất</a></li>
                    </ul>
                  </div>

                  <p></p>
              </div>
          </div>
          <main>
            <router-view></router-view>
          </main>
      </div>
      </div>
 </div>

 <div v-else class="login-container">
  <div class="login">
    <form @submit.prevent="login">
      <h2>Đăng Nhập</h2>
      
      <div class="mb-3">
        <label for="name" class="form-label">Nhập tên</label>
        <input type="name" v-model="name" class="form-control" id="name" required />
      </div>

      <div class="mb-3">
        <label for="password" class="form-label">Nhập mật khẩu</label>
        <input type="password" v-model="password" class="form-control" id="password" required />
      </div>

      <button type="submit" class="btn btn-primary">Login</button>
    </form>
  </div>
</div>



</div>
</template>
<script>
import api from './api'; // Assuming you have an API setup
import { computed, onMounted } from 'vue';
import { useUserStore } from './stores/userStore'; // Pinia store

export default {
  data() {
    return {
      name: '',
      password: '',
      contacts:[],
      totalContact: 0 // Add this line
    };
  },
  setup() {
    const userStore = useUserStore();

    // Restore user session when the component is mounted
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

    // Return the properties and methods to the template
    return {
      isLoggedIn,
      user,
      logout
    };
  },
  
  methods: {
    async login() {
      try {
        const response = await api.post('/staff/login', { name: this.name, password: this.password });

        // Save the token in localStorage
        localStorage.setItem('authToken', response.data.token);

        // Save user info in the Pinia store
        const userStore = useUserStore();
        userStore.setUser(response.data.user);

        // Redirect to the homepage after successful login
        this.$router.push('/');
      } catch (error) {
        console.log('Login failed:', error);
      }
    },
    async getCurrentDate() {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    },


    async getContact() {
  try {
    const date = await this.getCurrentDate();
    console.log('Ngày hiện tại:', date); // Kiểm tra ngày hiện tại
    const response = await api.get('/contact');
    this.contacts = response.data;

    console.log('Danh sách liên hệ:', this.contacts); // Kiểm tra danh sách liên hệ

    const filteredContacts = this.contacts.filter(contact => {
      const createdDate = contact.createdAt.split('T')[0];
      console.log('Ngày tạo liên hệ:', createdDate); // Kiểm tra từng ngày tạo liên hệ
      return createdDate === date;
    });

    this.totalContact = filteredContacts.length;
    console.log('Số lượng liên hệ theo ngày:', this.totalContact); // Kiểm tra tổng số liên hệ theo ngày
  } catch (error) {
    console.log('Error fetching contacts:', error);
  }
}


  },
  created() {
    this.getContact();
  }
};
</script>

<style>


/* @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap"); */

*{
    margin: 0;
    padding: 0;
    border: none;
    outline: none;
    box-sizing: border-box;
    font-family: "Afacad Flux", sans-serif;
    font-size: 17px;
   
}
.body{
    display: flex;

}
.sidebar{
    position: sticky;
    top:0;
    left: 0;
    bottom: 0;
    width: 110px;
    height: 100vh;
    padding: 0 1.7rem;
    color: #fff;
    overflow: hidden;
    transition: all 0.5s linear;
    background: rgb(113,99,186,255);

}
.sidebar:hover{
    width: 240px;
    transition: 0.5s;
}
.logo{
    height: 55px;
    margin-top: 10px ;
    padding: 6px;
    font-weight: normal;
}
.menu{
    height: 88%;
    position: relative;
    list-style: none;
    padding: 0;
}
.menu li{
    padding: 1rem;
    margin: 8px 0;
    border-radius: 8px;
    transition: all 0.5s ease-in-out;
}
.menu li:hover, .active{
    background: #e0e0e058;
}
.menu a{
    color: #fff;
    font-size: 14px;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 1.5rem;
}
.menu a span{
    overflow: hidden;
}
.menu a i{
    font-size: 1.2rem;
}

.menu-item {
    color: #fff;
    font-size: 14px;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 1.5rem;
}

.menu-item span {
    overflow: hidden;
}

.menu-item i {
    font-size: 1.2rem;
}

/* Hover effect for the link */
/* .menu-item:hover, .active {
    background: #e0e0e058;
    border-radius: 8px;
    transition: all 0.5s ease-in-out;
} */

.logout{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
}



/***main body**/
.main--content{
    position: relative;
    background: #ebe9e9;
    width: 100%;
    padding: 1rem;
}
.header--wrapper img{
    width: 50px;
    height: 50px;
    cursor: pointer;
    border-radius: 50%;

}
.header--wrapper{
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    background: #fff;
    border-radius: 10px;
    padding: 3px 2rem;
    margin-bottom: 1rem;
}
.header--title{
    color: rgb(113,99,186,255);
}
.user--info{
    display: flex;
    align-items: center;
    gap: 1rem;
}
.user--info p{
    margin-bottom: 0;
}
.searh--box{
    background: rgb(237, 237,237);
    border-radius: 15px;
    color: rgb(113,99,186,255);
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 4px 12px;
}
.searh--box input{
    background: transparent;
    padding: 10px;

}
.searh--box i{
    font-size: 1.2rem;
    cursor: pointer;
    transition: all 0.5s ease-in-out;
}
.searh--box i:hover{
    transform: scale(1.2);
}

/******** trang chủ ****/

.dropdown-toggle {
  display: flex;
  align-items: center;
  gap: 10px; /* Khoảng cách giữa ảnh và chữ */
  cursor: pointer;
}

.dropdown-toggle img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.dropdown-toggle p {
  margin-bottom: 0;
  font-size: 14px;
  color: #333;
}

.dropdown-menu {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.dropdown-item {
  padding: 10px 20px;
  transition: background-color 0.3s ease;
}

.dropdown-item:hover {
  background-color: rgb(113,99,186,255);
  color: #fff;
}
.login {
  background: #ffffff; /* Màu nền của form */
  padding: 2rem;
  border-radius: 10px;
  width: 500px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  position: relative; /* Đảm bảo form nằm trên lớp nền mờ */
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Chiều cao toàn màn hình */
  background-image: url(https://cdn5.f-cdn.com/contestentries/1578585/21468461/5d62b49ac544b_thumb900.jpg);
  background-size: cover; /* Đảm bảo hình nền bao phủ toàn bộ màn hình */
  background-position: center; /* Đặt hình nền ở giữa */
  background-repeat: no-repeat;
}
/* Làm mờ phần nền nếu muốn */
.login-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Thêm lớp phủ đen với độ trong suốt */
  z-index: -1; /* Đảm bảo rằng lớp phủ nằm dưới form */
}

.login h2 {
  text-align: center;
  margin-bottom: 1.5rem;
}

.login .mb-3 {
  width: 100%; /* Full width for form controls */
}

.login .btn-primary {
  width: 100%;
  padding: 0.75rem;
  font-size: 16px;
}
.bell-contact {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px; /* Adjust width to fit the icon size */
    height: 40px; /* Adjust height to fit the icon size */
    cursor: pointer;
}

.bell-contact i {
  padding-top: 9px;
  font-size: 24px; /* Adjust the icon size as needed */
   
}

.bell-contact div {
    position: absolute;
    top: -4px; /* Position the badge above the bell */
    right: -5px; /* Position the badge to the right of the bell */
    background-color: #ff3b3b; /* Badge color */
    color: white; /* Text color */
    border-radius: 50%;
    padding: 4px 8px; /* Adjust padding for badge size */
    font-size: 12px; /* Font size for the badge */
    font-weight: bold;
    min-width: 20px; /* Minimum width to make sure it's a circle */
    text-align: center;
}



</style>


