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
      searchDate: this.getCurrentDate(), // Lưu trữ ngày tìm kiếm, mặc định là ngày hiện tại
      rooms: [],      // Tất cả phòng (dùng để lưu trữ ban đầu trước khi lọc)
      singleRooms: [],  // Phòng đơn (trống và đã đặt)
      doubleRooms: [],  // Phòng đôi (trống và đã đặt)
      familyRooms: []   // Phòng gia đình (trống và đã đặt)
    };
  },
  async created() {
    await this.getAllRooms();
    await this.fetchBookings(); // Lấy bookings cho ngày hiện tại
  },
  methods: {
    // Lấy ngày hiện tại dưới dạng chuỗi 'YYYY-MM-DD'
    getCurrentDate() {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
      const dd = String(today.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    },

    // Lấy toàn bộ danh sách phòng
    async getAllRooms() {
      try {
        const response = await api.get('/rooms');
        this.rooms = response.data;
        this.categorizeRooms(); // Phân loại phòng khi tải về
      } catch (error) {
        console.error('Lỗi khi lấy danh sách phòng:', error);
      }
    },

    // Phân loại phòng theo từng loại phòng (đơn, đôi, gia đình)
    categorizeRooms() {
      this.singleRooms = this.rooms.filter(room => room.type === 'single');
      this.doubleRooms = this.rooms.filter(room => room.type === 'Double');
      this.familyRooms = this.rooms.filter(room => room.type === 'family');
    },

    // Lấy danh sách booking cho một ngày cụ thể và cập nhật trạng thái phòng
    async fetchBookings() {
      if (!this.searchDate) {
        // Nếu chưa chọn ngày, hiển thị tất cả phòng với trạng thái trống
        this.categorizeRooms();
        this.singleRooms = this.singleRooms.map(room => ({ ...room, status: 'trống', bookings: [] }));
        this.doubleRooms = this.doubleRooms.map(room => ({ ...room, status: 'trống', bookings: [] }));
        this.familyRooms = this.familyRooms.map(room => ({ ...room, status: 'trống', bookings: [] }));
        return;
      }

      try {
        const response = await api.get(`/rooms?date=${this.searchDate}`);
        const bookedRooms = response.data.filter(room => room.status === 'đã đặt' || room.status === 'đã nhận'); // Lấy các phòng đã đặt hoặc đã nhận

        // Cập nhật từng loại phòng để bao gồm trạng thái
        this.singleRooms = this.rooms.filter(room => room.type === 'single').map(room => this.mapRoomStatus(room, bookedRooms));
        this.doubleRooms = this.rooms.filter(room => room.type === 'Double').map(room => this.mapRoomStatus(room, bookedRooms));
        this.familyRooms = this.rooms.filter(room => room.type === 'family').map(room => this.mapRoomStatus(room, bookedRooms));
      } catch (error) {
        console.error('Lỗi khi lấy danh sách phòng đã đặt:', error);
      }
     
    },

    mapRoomStatus(room, bookedRooms) {
      // Tìm booking cho phòng này từ danh sách bookings
      const bookingForRoom = bookedRooms.find(bookedRoom => bookedRoom._id === room._id);

      // Nếu có booking, kiểm tra trạng thái của booking
      const isReceived = bookingForRoom && bookingForRoom.status === 'đã nhận'; // Kiểm tra trạng thái là "đã nhận"

      return {
        ...room,
        status: bookingForRoom ? (isReceived ? 'đã nhận' : 'đã đặt') : 'trống', // Cập nhật trạng thái
        bookings: bookingForRoom ? [bookingForRoom] : [] // Gán bookings nếu có
      };
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
