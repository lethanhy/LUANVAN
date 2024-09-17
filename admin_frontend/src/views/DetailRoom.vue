<template>
    <div class="DetailRoom" v-if="room">
      <h1 class="mb-3">{{ room.roomNumber }}</h1>
      
      <!-- Room Status Display -->
      <div class="DetailRoom--main">
        <!-- Show icon only if the room is available -->
        <div v-if="room.status === 'trống'" class="DetailRoom--header">
          <div class="d-flex">
            <i class="fa-solid fa-bed"></i>
            <p>Phòng trống</p>
          </div>
        </div>
        
        <!-- Show booking/check-in details if the room is booked or checked in -->
        <div v-else class="DetailRoom--header">
          <div class="d-flex">
            <i class="fa-solid fa-user"></i>
            <p>{{ room.bookings[0]?.customerName || 'Chưa có thông tin' }}</p>
          </div>
          <div class="d-flex">
            <i class="fa-regular fa-calendar-days"></i>
            <p>Checkin: {{ formatDate(room.bookings[0]?.checkin) || 'Chưa có thông tin' }}</p>
          </div>
          <div class="d-flex">
            <i class="fa-solid fa-calendar-day"></i>
            <p>Checkout:  {{ formatDate(room.bookings[0]?.checkout) || 'Chưa có thông tin' }}</p>
          </div>
          <div class="d-flex">
            <i class="fa-solid fa-user"></i>
            <p>{{ room.maxGuests }} khách</p>
          </div>
        </div>
  
        <!-- Room Amenities and Status Update -->
        <div class="DetailRoom--body d-flex">
          <div class="DetailRoom--service bg-white">
            <h1>Dịch vụ</h1>
            <ul>
              <li v-for="amenity in room.amenities" :key="amenity">{{ amenity }}</li>
            </ul>
          </div>
  
          <div class="DetailRoom--status bg-white">
            <div class="col-md-12 mb-3">
              <label for="status" class="form-label">Cập nhật tình trạng phòng</label>
              <select v-model="room.status" class="form-select" id="status" required>
                <option value="đã đặt">Phòng đã đặt</option>
                <option value="đã nhận">Phòng đã nhận</option>
                <option value="trống">Phòng trống</option>
              </select>
            </div>
  
            <div class="col-md-12">
              <label for="cleanStatus" class="form-label">Cập nhật tình trạng dọn dẹp</label>
              <select v-model="room.trangthai" class="form-select" id="cleanStatus" required>
                <option value="Đã dọn dẹp">Đã dọn dẹp</option>
                <option value="Chưa dọn dẹp">Chưa dọn dẹp</option>
              </select>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Buttons for Room Actions -->
      <div class="DetailRoom--button">
        <button v-if=" room.status === 'đã nhận'" type="submit">Thanh toán</button>
        <button v-else type="submit" @click.prevent="checkInRoom" >Nhận Phòng</button>
        <button type="submit" @click.prevent="saveChanges">Lưu</button>
        <router-link to="/rooms">
          <button class="btn text-white text-decoration-none">Thoát</button>
        </router-link>
      </div>
    </div>
  </template>
  
<script>
import api from '../api';
import { format } from 'date-fns';

export default {
  data() {
    return {
      room: null
    };
  },
  computed: {
    // formattedDate() {
    //   const date = new Date();
    //   return date.toLocaleString(); // Formats the current date as 11/01/2024 12:00:00 AM
    // }
    
  },
  async created() {
    try {
      const roomId = this.$route.params.id; // Get the room ID from the route
      const response = await api.get(`/rooms/${roomId}`); // Make the API call with the room ID
      this.room = response.data; // Store the response data in the `room` object
    } catch (error) {
      console.log('Failed to load room details:', error);
    }
  },
  methods: {
    async checkInRoom() {
    try {
        // Tạo một đối tượng chứa trạng thái cập nhật
        const updateData = {
            status: 'đã nhận',
            // Bạn có thể thêm các thuộc tính khác nếu cần thiết
        };

        // Gửi yêu cầu cập nhật phòng với trạng thái mới
        const response = await api.put(`/rooms/${this.room._id}`, updateData);
        console.log('Nhận phòng thành công:', response.data);

        // Cập nhật trạng thái phòng trong UI
        this.room.status = 'đã nhận';

        // Thông báo thành công cho người dùng
        alert('Nhận phòng thành công!');
    } catch (error) {
        console.log('Lỗi khi nhận phòng:', error);
        alert('Đã xảy ra lỗi, vui lòng thử lại sau.');
    }
},

    formatDate(dateString) {
      if (!dateString) return 'Chưa có thông tin';
      const date = new Date(dateString);
      return format(date, 'dd/MM/yyyy HH:mm:ss'); // Format date as "dd/MM/yyyy HH:mm:ss"
    },
    async saveChanges() {
      try {
        const response = await api.put(`/rooms/${this.room._id}`, this.room);
        console.log('Room updated successfully:', response.data);
      } catch (error) {
        console.log('Failed to save changes:', error);
      }
    },
    
  }
};
</script>

<style scoped>
.DetailRoom {
    background: #fff;
    padding: 2rem;
    border-radius: 10px;
    text-align: center;
}
.DetailRoom--main {
    background: #eeecec;
    border-radius: 10px;
}
.DetailRoom--header {
    display: flex;
    justify-content: space-around;
    padding-top: 15px;
}
.DetailRoom--header .d-flex i {
    margin-right: 10px;
    margin-top: 4px;
}
.DetailRoom--body {
    gap: 1rem;
    justify-content: space-around;
    padding-bottom: 10px;
}
.DetailRoom--service,
.DetailRoom--status {
    flex-basis: 45%;
    padding: 1rem;
    border-radius: 10px;
}
.DetailRoom--button {
    display: flex;
    justify-content: space-around;
    gap: 4px;
    margin-top: 15px;
}
.DetailRoom--button button {
    flex-grow: 1;
    padding: 10px;
    max-width: 150px;
    background-color: #30d366;
    color: white;
    border: none;
    border-radius: 5px;
}
.DetailRoom--button button:hover {
    background-color: #0056b3;
}
</style>
