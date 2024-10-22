<template>
  <div class="container room--details">
    <div class="row" v-if="rooms">
      <!-- Room Image Section -->
      <div class="col-lg-4">
        <img src="../assets/9+ Bold Wall Painting Ideas for a Dramatic Bedroom Look • 333k+ Inspiring Lifestyle Ideas.jpg" alt="Room Image" class="img-fluid">
      </div>

      <!-- Room Details Section -->
      <div class="col-lg-8 ">
        <div class="ml-4">

          <h1 class="fw-bold fst-italic text-start">Double Deluxe with Ocean View</h1>
          <p class="text-danger text-start fs-4">{{ formatCurrency(rooms.price) }}/Đêm</p>
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
              <button class="btn btn-success ms-2">
                <i class="fa-solid fa-arrow-right"></i>
              </button>
            </div>
            <div>
              <button class="btn btn-success"><router-link :to="{ name: 'Order', params: { id: rooms._id }, query: { checkin, checkout }}" class="text-decoration-none text-white">Đặt phòng ngay</router-link></button>
            </div>
          </div>

        </div>
        
      </div>
    </div>

    <div class="room--body">
      
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

    <div class="comment mt-3">
      <h3 class="text-dark  mb-3 mt-3 ">COMMENT</h3>
      <form action="">
        <div class="mb-3">
          <!-- <label for="note" class="form-label">Password</label> -->
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


    </div>


  </div>


</template>

<script>
import api from '../api';
export default {
  data() {
    return {
      rooms: null,
      newProfileImage: null,
      checkin: null,
      checkout: null,
    };
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
    async updateProfileImage() {
      if (!this.newProfileImage) {
        alert('Please select an image first!');
        return;
      }
      try {
        const formData = new FormData();
        formData.append('image', this.newProfileImage);
        const response = await api.put(`/customers/${this.customers._id}/upload-image`, formData);
        this.customers.image = response.data.imageUrl;
      } catch (error) {
        console.log('Failed to update image:', error);
      }
    },
    async saveChanges() {
      try {
        await api.put(`/customers/${this.customers._id}`, this.customers);
        alert('Customer details updated successfully');
      } catch (error) {
        console.log('Failed to save changes:', error);
        alert('Failed to update customer details');
      }
    },
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


</style>
