<template>
  <div class="container history">
    <div class="history--body">
      <h1 class="text-start fw-bold text-primary">Lịch sử đặt phòng</h1>

      <div v-if="!bookings">
        <p>Loading...</p> <!-- Loading indicator -->
      </div>

      <div v-else-if="bookings.length === 0">
        <p class="text-danger">Không có lịch sử đặt phòng nào!</p> <!-- No bookings message -->
      </div>

      <div 
        class="history--order border rounded-2" 
        v-for="booking in bookings" 
        :key="booking._id"
      >
        <div class="row d-flex m-2">
          <div class="col-lg-4">
            <img 
              :src="getImageUrl(booking.room?.image)" 
              alt="Room Image"
            />
          </div>
          <div class="col-lg-8 text-start">
            <p class="text-success">Ngày nhận phòng: {{ formatDate(booking.checkin) }}</p>
            <p class="text-success">Ngày trả phòng: {{ formatDate(booking.checkout) }}</p>
            <p>Phòng {{ booking.room?.roomNumber || 'N/A' }}</p>
            <p>Tổng ngày ở: {{ calculateDays(booking.checkin, booking.checkout) }} Ngày</p>
            <p>Tổng người ở: {{ booking.room?.maxGuests || 0 }} Người</p>
            <p>Cuộn Masala chay x 1, Burger chay x 1, Mì ống Penne chay sốt đỏ x 1</p>
            <hr>
            <div class="d-flex justify-content-between align-items-center">
              <p class="text-primary">
                Tổng tiền thanh toán: 
                {{ formatCurrency(booking.room?.price * calculateDays(booking.checkin, booking.checkout)) }}
              </p>
              <div class="button-group d-flex gap-2"> <!-- Custom button group with spacing -->
                <button class="btn btn-warning">Đánh Giá</button>
                <button class="btn btn-primary">Hoàn Thành</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api';
import { format } from 'date-fns'; // Import format from date-fns

export default {
  data() {
    return {
      bookings: null, // Stores bookings data
    };
  },
  methods: {
    // Fetch bookings for the user
    async getBookingId() {
      try {
        const id = this.$route.params.id;
        const response = await api.get(`/bookings/user/${id}`);
        this.bookings = response.data;
      } catch (error) {
        console.error('Failed to fetch customer:', error);
        this.bookings = []; // Set to empty array on error
      }
    },

    // Calculate the number of days between check-in and check-out
    calculateDays(checkin, checkout) {
      const checkinDate = new Date(checkin);
      const checkoutDate = new Date(checkout);
      const timeDiff = checkoutDate - checkinDate;
      return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    },

    // Format date as dd/MM/yyyy
    formatDate(dateString) {
      if (!dateString) return 'Chưa có thông tin';
      const date = new Date(dateString);
      return format(date, 'dd/MM/yyyy');
    },

    // Format currency in VND
    formatCurrency(value) {
      const numberValue = typeof value === 'number' ? value : parseFloat(value);
      return `${numberValue.toLocaleString('it-IT')} VND`;
    },

    // Generate a safe image URL
    getImageUrl(image) {
      return image 
        ? `http://localhost:3000/uploads/${image}` 
        : 'https://via.placeholder.com/150'; // Fallback image
    },
  },
  mounted() {
    this.getBookingId(); // Fetch bookings when component mounts
  },
};

</script>

<style>
.button-group {
  gap: 10px; /* Adjust the gap between buttons */
}

.history {
  margin-top: 7rem;
  margin-bottom: 2rem;
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.history--body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.history--order {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease-in-out;
}

.history--order:hover {
  background: #e9ecef;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.history--order img {
  width: 80%;
  height: auto;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #ddd;
  margin: 0 auto;
}


</style>