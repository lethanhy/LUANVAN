<template>
    <div>

        <!-- Search Bar -->
    <div>
      <input 
        type="date" 
        class="form-date mb-3" 
        v-model="searchDate" 
        @change="fetchBookings"
      />
    </div>

    <div v-if="bookedRooms.length > 0">
      <h4>Phòng đã đặt vào {{ searchDate }}</h4>
      <RoomType 
        v-for="room in bookedRooms" 
        :key="room._id" 
        :roomType="room.type" 
        :rooms="[room]" 
      />
    </div>
    
    <div v-else-if="searchDate">
      <p>Không có phòng nào đã đặt vào {{ searchDate }}</p>
    </div>

      <!-- Phòng đơn -->
      <RoomType :roomType="'Phòng đơn'" :rooms="singleRooms" />
      
      <!-- Phòng đôi -->
      <RoomType :roomType="'Phòng đôi'" :rooms="doubleRooms" />

      <!-- Phòng gia đình -->
      <RoomType :roomType="'Phòng gia đình'" :rooms="familyRooms" />
    </div>
  </template>

<script>
import api from '../api';
import RoomType from '../components/RoomType.vue'; // Import RoomType component

export default {
  components: {
    RoomType
  },
  data() {
    return {
      searchDate: '', // To hold the date input
      bookedRooms: [], // To hold the rooms booked on the searched date
      rooms: [],          // Tất cả phòng
      singleRooms: [],    // Phòng đơn
      doubleRooms: [],      // Phòng đôi
      familyRooms: []   // Phòng gia đình
    };
  },
  async created() {
    await this.getAllRooms();
  },
  methods: {
    async getAllRooms() {
      try {
        const response = await api.get('/rooms');
        this.rooms = response.data;

        // Phân loại các phòng đơn và phòng đôi và phòng gia đình
        this.singleRooms = this.rooms.filter(room => room.type === 'single');
        this.doubleRooms = this.rooms.filter(room => room.type === 'Double');
        this.familyRooms = this.rooms.filter(room => room.type === 'family');
      } catch (error) {
        console.error('Failed to fetch rooms:', error);
      }
    },
    async fetchBookings() {
      if (!this.searchDate) return; // Exit if no date is selected
      try {
        const response = await api.get(`/bookings/date/${this.searchDate}`);
        this.bookedRooms = response.data; // Assign booked rooms based on the searched date
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      }
    },

  }
};
</script>


<style>
.form-date {
    width: 20%;
    padding: 0.5rem 0.75rem;
    border-radius: 5px;
    border: 1px solid #ccc;
    margin-left: 0.5rem;
}
/* Thẻ chính bao bọc toàn bộ nội dung */
.card--room {
    background: #fff;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Container chứa các phòng */
.room {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: space-between;
}

/* Phòng cụ thể */
.main--room {
    background: #e0f7e9;
    border-radius: 15px;
    flex-basis: calc(20% - 1rem);
    padding: 1.5rem;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    transition: transform 0.2s ease-in-out;
}

/* Hiệu ứng hover cho phòng */
.main--room:hover {
    transform: translateY(-5px);
}

/* Phòng đã đặt */
.room-booked {
  background: #f8d7da; /* Light red background for booked rooms */
}

/* Phòng trống */
.room-available {
  background: #e0f7e9; /* Light green background for available rooms */
}
/* Phòng nhận */
.room-checkin {
  background: #758ff8; /* Light green background for available rooms */
}
/* Phần đầu của phòng */
.header--room {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

/* Mã phòng */
.room-code {
    font-weight: bold;
    font-size: 18px;
    color: #333;
}

/* Trạng thái phòng */
.room-status {
    font-size: 14px;
    color: #666;
}

/* Phần chính của phòng */
.body--room {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 40px;
    gap: 10px;
    margin-top: -15px;
}
.body--room p {
    font-size: 20px;
}
.body--room .text-dark{
    text-decoration: none;
}
/* Vòng tròn icon */
.icon-circle {
    background-color: white;
    border-radius: 50%;
    width: 35px;
    height: 35px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

/* Icon bên trong */
.icon-circle i {
    font-size: 20px;
    color: #28a745;
}

/* Footer của phòng */
.footer--room {
    background-color: #d9d9d9;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    border-radius: 0 0 10px 10px;
}

/* Nội dung bên trong footer */
.footer--room--time {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

/* Căn chỉnh chữ */
.footer--room--time p {
    margin: 0;
}

.footer--room--type {
    display: flex;
    align-items: center;
}

/* Khoảng cách và căn chỉnh icon */
.footer--room--type i {
    margin-right: 5px;
    color: #28a745;
}
</style>
