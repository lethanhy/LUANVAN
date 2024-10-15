<template>
  <div>
    <!-- Thanh tìm kiếm ngày -->
    <div>
      <input 
        type="date" 
        class="form-date mb-3" 
        v-model="searchDate" 
        @change="fetchBookings"
      />
    </div>

    <!-- Phòng đơn -->
    <RoomType :roomType="'Phòng đơn'" :rooms="singleRooms" :searchDate="searchDate" />

    <!-- Phòng đôi -->
    <RoomType :roomType="'Phòng đôi'" :rooms="doubleRooms" :searchDate="searchDate" />

    <!-- Phòng gia đình -->
    <RoomType :roomType="'Phòng gia đình'" :rooms="familyRooms" :searchDate="searchDate" />
  </div>
</template>

<script>
import api from '../api'; // Import hàm API
import RoomType from '../components/RoomType.vue'; // Import RoomType component

export default {
  components: {
    RoomType
  },
  data() {
    return {
      searchDate: this.getCurrentDate(), // Lưu ngày tìm kiếm (mặc định là ngày hiện tại)
      rooms: [], // Tất cả phòng
      singleRooms: [], // Phòng đơn
      doubleRooms: [], // Phòng đôi
      familyRooms: [], // Phòng gia đình
    

    };
  },
  mounted() {
    const selectedDate = this.$route.query.date; // Lấy ngày từ query
    if (selectedDate) {
      this.searchDate = selectedDate; // Cập nhật searchDate nếu có trong query
      this.fetchBookings(); // Gọi lại hàm fetchBookings để cập nhật phòng
    }
  },
  async created() {
    await this.fetchBookings(); // Lấy bookings cho ngày hiện tại
  },
  methods: {
    // Hàm lấy ngày hiện tại (YYYY-MM-DD)
    getCurrentDate() {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0'); 
      const dd = String(today.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    },

    // Hàm lấy bookings từ API và phân loại phòng
    async fetchBookings() {
      try {
        const response = await api.get(`/rooms?date=${this.searchDate}`); // Gọi API với ngày đã chọn
        const rooms = response.data; // Lấy dữ liệu từ API

        // Phân loại phòng dựa trên loại
        this.singleRooms = rooms.filter(room => room.type === 'single');
        this.doubleRooms = rooms.filter(room => room.type === 'Double');
        this.familyRooms = rooms.filter(room => room.type === 'family');
      } catch (error) {
        console.error('Lỗi khi lấy danh sách phòng:', error);
      }
    }
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
</style>
