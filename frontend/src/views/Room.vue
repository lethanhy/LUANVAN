<template>
  <div class="container room--details">
    <div class="row" v-if="rooms">
      <!-- Room Image Section -->
      <div class="col-lg-5 d-flex justify-content-center align-items-center ">
        <img :src="`http://localhost:3000/uploads/${rooms.image}`" alt="Room Image" class="img-fluid">
      </div>

      <!-- Room Details Section -->
      <div class="col-lg-7 ">
        <div class="ml-4">

          <h1 class="fw-bold fst-italic text-start">Phòng đôi hướng biển</h1>
          <p class=" text-start fs-4">{{ formatCurrency(rooms.price) }}/Đêm</p>
          <p class="text-start">{{ rooms.description }}</p>

          <hr>

          
          <!-- Features Section -->
          <div class="d-flex justify-content-around pt-2">
            <div>
              <p><i class="fa-solid fa-bed"></i> King Size Bed</p>
            </div>
            <div>
              <p><i class="fa-solid fa-water"></i> Ocean View</p>
            </div>
          </div>
          <hr>
          
          <div class="d-flex justify-content-around">
            <div>
              <p><i class="fa-solid fa-ruler-combined"></i> 50m² in size</p>
            </div>
            <div>
              <p><i class="fa-solid fa-utensils"></i> Free Breakfast</p>
            </div>
          </div>
          <hr>
          
          <!-- Contact Section -->
          <div class="d-flex justify-content-around align-items-center">
            <div class="d-flex">
              <p class="mt-3">0939 834 780</p>
              <button class="btn btn-info ms-2">
                <i class="fa-solid fa-arrow-right"></i>
              </button>
            </div>
            <div>
              <button @click.prevent="goToOrder"  class="btn btn-info">Đặt phòng ngay</button>
            </div>
          </div>

        </div>
        
      </div>
    </div>

    <div class="room--body">
      
    </div>

    <div class="service mt-3">
      <h2 class="mb-3 text-dark">Tiện Nghi</h2>
      <div class="service--body text-start">
        <div class="service--info">
          <div class="m-3">
            <i class="fa-solid fa-spa"></i>
            <p>SPA</p>
            <p> Lorem Ipsum has been the industry's
              standard dummy text ever since the 1500s,
                when an unknown printer took a galley of.
              
            </p>
          </div>
        </div>

        <div class="service--info">
          <div class="m-3">
            <i class="fa-solid fa-bowl-food"></i>
            <p>FOOD</p>
            <p> Lorem Ipsum has been the industry's
              standard dummy text ever since the 1500s,
                when an unknown printer took a galley of.
               
            </p>
          </div>
        </div>

        <div class="service--info">
          <div class="m-3">
            <i class="fa-solid fa-users"></i>
            <p>ACTIVITIES</p>
            <p> Lorem Ipsum has been the industry's
              standard dummy text ever since the 1500s,
                when an unknown printer took a galley of.
                
            </p>
          </div>
        </div>

        <div class="service--info">
          <div class="m-3">
            <i class="fa-solid fa-car"></i>
            <p>TRANSPORTATION</p>
            <p> Lorem Ipsum has been the industry's
              standard dummy text ever since the 1500s,
                when an unknown printer took a galley of. 
            </p>
          </div>
        </div>

        <div class="service--info">
          <div class="m-3">
            <i class="fa-solid fa-wifi"></i>
            <p>WIFI</p>
            <p> Lorem Ipsum has been the industry's
              standard dummy text ever since the 1500s,
                when an unknown printer took a galley of. 
            </p>
          </div>
        </div>

        <div class="service--info">
          <div class="m-3">
            <i class="fa-solid fa-dumbbell"></i>
            <p>GYM</p>
            <p> Lorem Ipsum has been the industry's
              standard dummy text ever since the 1500s,
                when an unknown printer took a galley of. 
            </p>
          </div>
        </div>

      </div>
    </div>

    <div class="policy mt-4 text-dark fs-5">
      <h2 class="text-dark text-center">Chính Sách</h2>
      <p class="mb-2">Ocean Breeze Hotel có các chính sách khách sạn chung. Vì những chính sách
        này có thể thay đổi tùy theo từng loại phòng, hãy đồng thời kiểm tra điều kiện phòng.
      </p>
      <hr>
      
      <div>
        <span class="me-2"><i class="fa-regular fa-clock"></i></span>
        <span>Thời gian nhận/trả phòng</span>
        <p class="">Nhận phòng từ 14:00 đến 23:00</p>
        <p>Trả phòng từ 6:00 đến 12:00</p>
      </div>
        <hr>
      <div>
        <span class="me-2"><i class="fa-solid fa-wifi"></i></span>
        <span>Internet</span>
        <p class="">Wifi có ở toàn bộ khách sạn và miễn phí.</p>
      </div>
      <hr>
      <div>
        <span class="me-2"><i class="fa-solid fa-dog"></i></span>
        <span>Vật nuôi</span>
        <p class="">Vật nuôi không được cho phép.</p>
      </div>
      <hr>
      <div>
        <span class="me-2"><i class="fa-solid fa-square-parking"></i></span>
        <span>Đậu xe</span>
        <p class="">Có chỗ đậu xe riêng miễn phí tại chỗ( không cần đặt chỗ trước).</p>
      </div>
      <hr>

     

    </div>

    <div class="suggest">
      <h3 class="text-dark text-start mb-3 mt-3 "> YOU MAY ALSO LIKE</h3>
      <div class="suggest--room">
        <div class="bg-white shadow border rounded-3">
          <div class="m-2">
            <img src="../assets/Hotel Review_ An Ocean View Room at the Grand Wailea, Maui - The Points Guy.jpg" alt="">
          </div>
          
          <p>Double Deluxe with Ocean View</p>
          <button class="btn btn-success mb-3">Xem thêm</button>
        </div>
        <div class="bg-white shadow border rounded-3">
          <div class="m-2">
            <img src="../assets/Hotel Review_ An Ocean View Room at the Grand Wailea, Maui - The Points Guy.jpg" alt="">
          </div>
          
          <p>Double Deluxe with Ocean View</p>
          <button class="btn btn-success mb-3">Xem thêm</button>
        </div>
        <div class="bg-white shadow border rounded-3">
          <div class="m-2">
            <img src="../assets/Hotel Review_ An Ocean View Room at the Grand Wailea, Maui - The Points Guy.jpg" alt="">
          </div>
          
          <p>Double Deluxe with Ocean View</p>
          <button class="btn btn-success">Xem thêm</button>
        </div>
        <div class="bg-white shadow border rounded-3">
          <div class="m-2">
            <img src="../assets/Hotel Review_ An Ocean View Room at the Grand Wailea, Maui - The Points Guy.jpg" alt="">
          </div>
          
          <p>Double Deluxe with Ocean View</p>
          <button class="btn btn-success">Xem thêm</button>
        </div>
      </div>
    </div>

    <!-- <div class="comment mt-3">
      <h3 class="text-dark  mb-3 mt-3 ">COMMENT</h3>
      <form action="">
        <div class="mb-3">
          
          <input  type="text" class="form-control" id="note" placeholder="Nhập bình luận">
        </div>
      </form>

      <div class="d-flex">
        <div class="avata">
          <img src="../assets/unnamed.png" alt="" >
        </div>
        <div class="text-start">
          <p class="fw-bold">Lê Thành Y</p>
          <p>i just want to say all you're pulling up over here is spectacular. i appreciate.</p>
          <div class="icon--like d-flex">
            <div class="">
              <i class="fa-regular fa-thumbs-up"></i>
            </div>
            <div>
              <i class="fa-regular fa-thumbs-down"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="d-flex mt-2">
        <div class="avata">
          <img src="../assets/unnamed.png" alt="" >
        </div>
        <div class="text-start">
          <p class="fw-bold">Lê Thành Y</p>
          <p>i just want to say all you're pulling up over here is spectacular. i appreciate.</p>
          <div class="icon--like d-flex">
            <div class="">
              <i class="fa-regular fa-thumbs-up"></i>
            </div>
            <div>
              <i class="fa-regular fa-thumbs-down"></i>
            </div>
          </div>
        </div>
      </div>


    </div> -->


  </div>

  <div class="notification" v-if="showNotification">
  <p>Please log in to book a room.</p>
  <button @click="closeNotification">Close</button>
</div>



</template>

<script>
import api from '../api';
import { useUserStore } from '../stores/userStore';
import { computed, onMounted } from 'vue';
export default {
  data() {
    return {
      rooms: null,
      newProfileImage: null,
      checkin: null,
      checkout: null,
      showNotification: false // Add this property
    };
  },
  setup() {
    const userStore = useUserStore();
    
    // Retrieve user info on load
    onMounted(() => {
      userStore.restoreUser();
    });

    // Computed properties
    const isLoggedIn = computed(() => userStore.isLoggedIn);
    const user = computed(() => userStore.user);

    return { isLoggedIn, user };
  },
  methods: {
    async getRoom() {
      try {
        const roomId = this.$route.params.id;
        const response = await api.get(`/rooms/${roomId}`);
        this.rooms = response.data;
      } catch (error) {
        console.log('Failed to fetch room:', error);
      }
    },
    handleImageUpload(event) {
      this.newProfileImage = event.target.files[0];
    },
     // Format currency to VND without leading zero
    formatCurrency(value) {
      // Convert to integer if the value is a number
        const numberValue = typeof value === 'number' ? value : parseFloat(value);
        return `${numberValue.toLocaleString('it-IT')} VND`;
    },

    goToOrder() {
        if (!this.isLoggedIn) {
          this.showNotification = true;
          return;
        }
      this.$router.push({
        name: 'Order',
        params: { id: this.rooms._id },
        query: { checkin: this.checkin, checkout: this.checkout }
      });
    },
    closeNotification() {
    this.showNotification = false;
  }
    // async updateProfileImage() {
    //   if (!this.newProfileImage) {
    //     alert('Please select an image first!');
    //     return;
    //   }
    //   try {
    //     const formData = new FormData();
    //     formData.append('image', this.newProfileImage);
    //     const response = await api.put(`/customers/${this.customers._id}/upload-image`, formData);
    //     this.customers.image = response.data.imageUrl;
    //   } catch (error) {
    //     console.log('Failed to update image:', error);
    //   }
    // },
    // async saveChanges() {
    //   try {
    //     await api.put(`/customers/${this.customers._id}`, this.customers);
    //     alert('Customer details updated successfully');
    //   } catch (error) {
    //     console.log('Failed to save changes:', error);
    //     alert('Failed to update customer details');
    //   }
    // },
  },
  mounted() {
    this.getRoom();

    // Retrieve checkin and checkout from query parameters
    this.checkin = this.$route.query.checkin;
    this.checkout = this.$route.query.checkout;

    console.log(`Check-in: ${this.checkin}, Check-out: ${this.checkout}`);
   
  },
};
</script>

<style scoped>
.room--details {
  margin-top: 7rem;
  margin-bottom: 2rem;
  max-width: 900px;
}
.room--details img {
  width: 100%;
  border-radius: 8px;
}
.room--details .room--body {
  padding-top: 50px;
}
.suggest--room {
  display: grid;
  gap: 2rem;
  grid-template-columns: 1fr 1fr 1fr 1fr;
}
.suggest h3 {
  border-bottom: 4px solid orange; /* Đường gạch chân màu cam */
  display: inline-block; /* Để đường gạch chân chỉ áp dụng cho phần nội dung */
  padding-bottom: 5px; /* Khoảng cách giữa chữ và đường gạch */


}
.comment h3 {
  border-bottom: 4px solid orange; /* Đường gạch chân màu cam */
  display: inline-block; /* Để đường gạch chân chỉ áp dụng cho phần nội dung */
  padding-bottom: 5px; /* Khoảng cách giữa chữ và đường gạch */

}
.avata {
  width: 80px;
  margin-right: 1rem;
}

.icon--like {
  align-items: center; /* Căn giữa các icon theo chiều dọc */
}

.icon--like > div {
  margin-right: 10px; /* Khoảng cách giữa các icon */
}

.icon--like i {
  font-size: 1.5rem; /* Điều chỉnh kích thước icon nếu cần */
  cursor: pointer; /* Hiển thị biểu tượng con trỏ khi hover */
}

.icon--like i:hover {
  color: orange; /* Đổi màu khi hover (nếu muốn) */
}

.service--body {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr 1fr 1fr;
}
.service--info {
  border: 3px solid rgb(210, 210, 222);

}
.service--info p {
  margin: 0px;
  font-size: 18px;
  color: black;
}
.service--info i {
  font-size: 30px;
  margin-bottom: 10px;
  color: rgb(65, 124, 243);
}
.policy {
  text-align: start;
}
.policy p {
  margin: 0px;
}
.img-fluid {

  height: 350px;
}

.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 25px;
  background-color: #f44336;
  color: white;
  border-radius: 5px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  animation: fadeIn 0.5s ease;
}

.notification p {
  margin: 0;
  font-size: 16px;
}

.notification button {
  background: none;
  border: none;
  color: white;
  font-weight: bold;
  font-size: 14px;
  margin-left: 10px;
  cursor: pointer;
}

.notification button:hover {
  color: #ddd;
}

/* Fade-in animation */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}


</style>
