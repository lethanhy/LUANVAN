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
      <div class="nav__logo d-flex justify-content-center align-items-center">
        <img src="./assets/Thiết kế chưa có tên.png" alt="" style="width: 70px;">
       
        <p>Ocean Breeze Hotel</p>
      </div>

      <div class="nav__menu">
          <ul class="nav__links">
            <li class="link"><a href="#"><router-link to="/">Trang Chủ</router-link></a></li>
            <li class="link"><a href="#"><router-link to="/rooms">Phòng</router-link></a></li>
            <li class="link"><a href="#"><router-link to="/review">Đánh Giá</router-link></a></li>
            <li class="link"><a href="#"><router-link to="/contact">Liên Hệ</router-link></a></li>
          </ul>

     
            <div class="nav__button" v-if="!isLoggedIn">
              <button><a href=""><router-link to="/customers/login">Đăng nhập</router-link></a></button>
            </div>
            <div v-else class="nav__button" id="dropdown">
              <button class="dropbtn" style="display: flex; align-items: center; gap: 0.5rem;"><img 
                :src="customers.image ? `http://localhost:3000${customers.image}` : '/default-profile.png'"
                :alt="`image`"
                class="profile-image"> 
                <span>{{ user.name }}</span>
              </button>
              <div class="dropdown-content">
                <a href="#"><router-link :to="{ name: 'Customers', params: { id: user.id } }">Tài khoản</router-link></a>
                <a href="#"><router-link :to="{ name: 'History', params: { id: user.id } }">Lịch sử</router-link></a>
                <a href="" @click="logout">Đăng xuất</a>
              </div>
              <!-- <p>Welcome, {{ user.name }}</p> -->
            
            </div>
          

      </div>
    </nav>

      <!-- Nút mở Box Chat -->
    <!-- <div class="chatbox-button" @click="toggleChat">
      <i class="fa-solid fa-comments"></i> Chat
    </div> -->

    <!-- Box Chat -->
    <div v-if="showChat" class="chatbox-container">
      <div class="chatbox-content">
        <div class="chatbox-header">
          <div class="chatbox-title">Ocean Breeze AI</div>
          <button class="chatbox-close" @click="toggleChat">✖</button>
        </div>
        <div class="chatbox-messages">
          <p>Xin chào! Hôm nay tôi có thể giúp gì cho bạn?</p>
          <!-- Tin nhắn từ Ocean AI và người dùng -->
        </div>
        <form @submit.prevent="sendMessage" class="chatbox-input">
          <input type="text" v-model="userMessage" placeholder="Nhập tin nhắn..." required />
          <button type="submit">Gửi</button>
        </form>
      </div>
    </div>

   

   

    

    
    <main>
      <router-view></router-view>
    </main>

    <footer class="footer">
      <div class="section__container footer__container">
        <div class="footer__col">
          <h3 class="text-primary">Ocen Breeze Hotel</h3>
          <p>
            Ocen Breeze Hotel là trang web đặt phòng khách sạn hàng
             đầu cung cấp một cách liền mạch và thuận tiện để tìm và đặt chỗ ở trên toàn thế giới.
          </p>
          <p>
            Với giao diện thân thiện với người dùng và nhiều lựa chọn khách sạn, Ocen Breeze Hotel
             mong muốn mang lại trải nghiệm thoải mái cho du khách đang tìm kiếm kỳ nghỉ hoàn hảo.
          </p>
        </div>
        <div class="footer__col">
          <h4  class="text-primary">Menu</h4>
          <p>Trang chủ</p>
          <p>Phòng</p>
          <p>Đánh giá</p>
          <p>Liên hệ</p>
        </div>

        <div class="footer__col">
          <h4  class="text-primary">Legal</h4>
          <p>FAQs</p>
          <p>Terms & Conditions</p>
          <p>Privacy Policy</p>
        </div>

        <div class="footer__col">
          <h4  class="text-primary">Địa chỉ</h4>
          <p>28 Đường Thi Sách, Phường Thắng Tám, TP Vũng Tàu, BR-VT</p>
          <p>📞 Hotline: +840939834780</p>
          <p>✉️ Email: lethanhy107@gmail.com</p>
        </div>  
      </div>

      <div class="footer__bar">
        <p>© 2024 Hotel Deluxe. All Rights Reserved.</p>
      </div>

    </footer>
  </div>
</template>

<script setup>
import { ref,computed, onMounted } from 'vue';
import { useUserStore } from './stores/userStore';
import api from './api';

// Use the store
const userStore = useUserStore();

const showChat = ref(false);
const userMessage = ref("");
const customers = ref([])

// Khôi phục trạng thái người dùng khi ứng dụng tải lại
onMounted(() => {
  userStore.restoreUser();
  getCustomer()

});

// Computed properties
const isLoggedIn = computed(() => userStore.isLoggedIn);
const user = computed(() => userStore.user);

const toggleChat = () => {
  showChat.value = !showChat.value;
};

const sendMessage = () => {
  if (userMessage.value.trim() !== "") {
    // Xử lý gửi tin nhắn (như lưu hoặc gửi lên server)
    console.log("User message:", userMessage.value);
    userMessage.value = ""; // Clear input field
  }
};

const getCustomer = async () => {
  try {
    const id = user.value.id;
    if (!id) {
      console.warn("User ID is undefined or null.");
      return;
    }

    const response = await api.get(`/customers/${id}`);
    customers.value = response.data; // Ensure this matches your API's response structure
    
  } catch (error) {
    console.error("Error fetching customer data:", error.message);
    // You can add more error handling logic here (e.g., show a notification to the user)
  }
};




// Methods
const logout = () => {
  userStore.clearUser();
  router.push('/customers/login'); // Thay '/path-to-new-page' bằng đường dẫn bạn muốn chuyển đến
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
  /* font-family: Avenir, Helvetica, Arial, sans-serif; */
  font-family: "Afacad Flux", sans-serif;
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
  /* position: sticky; */
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
  z-index: 1000 !important;
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
  background-color:white;
  border: none;
  border-radius: 5px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid rgb(62, 68, 72);
  /* transition: background-color 0.3s; */
}
.nav__button button a{
  color: var(--text-dark);
}

/* .nav__button button:hover {
  background-color: #43E8E4;
} */

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
  top: 30%;
  right: 28rem;
  transform: translateY(-50%);
  width: 20rem;
  background-color: var(--text-light);
}

.chatbox-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 10px 15px;
  background-color: #1f2da7;
  color: white;
  border-radius: 50px;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

/* Chatbox container to position chatbox on the bottom right */
.chatbox-container {
  position: fixed;
  bottom: 80px; /* Adjust for space above chat button */
  right: 20px;
  width: 300px;
  height: 400px;
  z-index: 1001;
}

/* Content of the chatbox */
.chatbox-content {
  background-color: #ffffff;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chatbox-header {
  background-color: #1f2da7;
  color: white;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.chatbox-title {
  font-size: 1.2rem;
  font-weight: bold;
}

.chatbox-close {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
}

.chatbox-messages {
  padding: 1rem;
  flex: 1;
  overflow-y: auto;
  background-color: #f3f4f6;
}

.chatbox-input {
  display: flex;
  padding: 0.5rem;
  border-top: 1px solid #ddd;
}

.chatbox-input input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.chatbox-input button {
  padding: 0.5rem 1rem;
  margin-left: 0.5rem;
  background-color: #1f2da7;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.profile-image {
  width: 40px;
  border-radius: 50%; /* Makes the image circular */
}


</style>
