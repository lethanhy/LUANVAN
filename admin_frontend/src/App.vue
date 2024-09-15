<!-- <script setup>
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
</script> -->

<template>
  <div id="app">
    <div class="body">
    <div class="sidebar">
        <div class="logo"></div>
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
                      <i class="fa-regular fa-clipboard"></i>
                        <span>Đặt phòng</span>
                    </router-link>
                </li>
                <li>
                    <a href="">
                    <i class="fa-regular fa-address-book"></i>
                        <span>Khách Hàng</span>
                    </a>
                </li>
                <li>
                    <router-link to="" class="menu-item">
                      <i class="fa-regular fa-clipboard"></i>
                        <span>QL phòng</span>
                    </router-link>
                </li>
                <li>
                    <router-link to="/" class="menu-item">
                      <i class="fa-regular fa-clipboard"></i>
                        <span>QL dịch vụ</span>
                    </router-link>
                </li>
                <li>
                    <a href="">
                        <i class="fas fa-question-circle"></i>
                        <span>FAQ</span>
                    </a>
                </li>
                
                <li class="logout">
                    <a href="" >
                        <i class="fas fa-sign-out-alt"></i>
                        <span>Logout</span>
                    </a>
                </li>
            </ul>
    </div>

      <div class="main--content">
          <div class="header--wrapper">
              <div class="header--title">
                  <span>Primary</span>
                  <h2>Dashboard</h2>
              </div>
              <div class="user--info">
                  <div class="searh--box">
                      <i class="fa-solid fa-search"></i>
                      <input type="text" placeholder="Search">
                  </div>
                  
                  <div class="dropdown">
                    <a class="nav-link dropdown-toggle d-flex" href="#" id="dropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      <img src="./assets/logo.jpg" alt="">
                      <p>Thành Y</p>
                    </a>

                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                      <li><a class="dropdown-item" href="#">Tài khoản</a></li>
                      <li><a class="dropdown-item" href="#">Lịch sử</a></li>
                      <li><a class="dropdown-item" href="#">Something else here</a></li>
                      <li><hr class="dropdown-divider"></li>
                      <li><a class="dropdown-item" href="#">Separated link</a></li>
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
</template>

<script>



// import { computed } from 'vue';
// import { useUserStore } from './stores/userStore';

// // Use the store
// const userStore = useUserStore();

// // Computed properties
// const isLoggedIn = computed(() => userStore.isLoggedIn);
// const user = computed(() => userStore.user);

// // Methods
// const logout = () => {
//   userStore.clearUser();
// };
</script>
<style>


@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap");

*{
    margin: 0;
    padding: 0;
    border: none;
    outline: none;
    box-sizing: border-box;
    font-family: "Poppins", sans-serif;
   
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
    height: 80px;
    padding: 16px;
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
.menu-item:hover, .active {
    background: #e0e0e058;
    border-radius: 8px;
    transition: all 0.5s ease-in-out;
}

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
    padding: 10px 2rem;
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


</style>


