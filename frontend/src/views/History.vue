<template>
  <div class="container history">
    <div class="history--body">
      <h1 class="text-start fw-bold text-primary m-3">Lịch sử đặt phòng</h1>

      <div v-if="loading">
        <p>Loading...</p> <!-- Loading indicator -->
      </div>

      <div v-else-if="!bookings || bookings.length === 0">
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
              class="img-fluid"
            />
          </div>
          <div class="col-lg-8 text-start">
            <p class="text-success">Ngày nhận phòng: {{ formatDate(booking.checkin) }} {{ booking.checkinTime }}</p>
            <p class="text-success">Ngày trả phòng: {{ formatDate(booking.checkout) }} {{ booking.checkoutTime }}</p>
            <p>Phòng {{ booking.room?.roomNumber || 'N/A' }}</p>
            <p>Tổng ngày ở: {{ calculateDays(booking.checkin, booking.checkout) }} Ngày</p>
            <p>Tổng người lớn: {{ booking.room?.adults || 0 }} Người</p>
            <p>Tổng trẻ em: {{ booking.room?.children || 0 }} Người</p>
            <div v-if="booking.orders.length > 0">
              <p v-for="order in booking.orders" :key="order.id">
                {{ order.itemName }} - {{ order.quantity }} x {{ order.price }} VND
              </p>
            </div>


            <hr>
            <div class="d-flex justify-content-between align-items-center">
              <p class="text-primary fs-5">
                Tổng tiền thanh toán: 
                {{ formatCurrency(booking.room?.price * calculateDays(booking.checkin, booking.checkout)) }}
              </p>

              <div v-if=" booking.status === 'chờ xác nhận' " class="button-group d-flex gap-2"> <!-- Custom button group with spacing -->
                <button class="btn btn-warning text-white">Chờ xác nhận</button>
                <button class="btn btn-danger" @click="deleteBooking(booking._id)">Hủy đặt phòng</button>
              </div>
              
              <div v-else-if="booking.status === 'hoàn thành'" class="button-group d-flex gap-2"> <!-- Custom button group with spacing -->
                <button  @click="openReviewModal(booking)"  v-if="!hasReview(booking._id)"  class="btn btn-warning">Đánh Giá</button>
                <button class="btn btn-primary">Hoàn Thành</button>
              </div>

              <div v-if=" booking.status === 'đã hủy' " class="button-group d-flex gap-2"> <!-- Custom button group with spacing -->
                <button class="btn btn-danger text-white">Thanh toán thất bại</button>
                <!-- <button class="btn btn-danger" @click="deleteBooking(booking._id)">Hủy đặt phòng</button> -->
              </div>

              <div v-if=" booking.status === 'đã đặt' " class="button-group d-flex gap-2"> <!-- Custom button group with spacing -->
                <button class="btn btn-primary text-white">Đã xác nhận đặt thành công</button>
                <!-- <button class="btn btn-danger" @click="deleteBooking(booking._id)">Hủy đặt phòng</button> -->
              </div>

              
            </div>
          </div>
        </div>

        <!-- Add Room Modal -->
        <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
          <div class="modal-content" role="dialog" aria-labelledby="modal-title" aria-modal="true">
            <h2 id="modal-title" class="modal-title text-center text-info fw-bold ">Đánh Giá</h2>
            <form @submit.prevent="addReview">
              <label class="text-dark m-2" for="review-content">Trải nghiệm của bạn như thế nào?</label>
              <div class="form-floating">
                <textarea 
                  class="form-control bg-light" 
                  v-model="newReview.noidung" 
                  placeholder="Leave a comment here" 
                  id="review-content" 
                  style="height: 100px" 
                  required
                ></textarea>
                <label for="review-content">Nội dung</label>
              </div>
              <label class="m-2 text-dark" for="rating-buttons">Đánh giá trải nghiệm của bạn với khách sạn của chúng tôi</label>
              <div class="button-group mb-4" id="rating-buttons">
                <button 
                  v-for="n in 5" 
                  :key="n" 
                  :value="n" 
                  class="btn border me-2" 
                  :class="{ 'button-active': newReview.rating === n }" 
                  @click.prevent="newReview.rating = n"
                >
                  {{ n }}
                </button>
                <i class="fa-solid fa-star text-warning"></i> Stars
              </div>
              <button
                 
                type="submit" 
                class="btn btn-primary" 
                :disabled="!newReview.rating" 
              >Đánh giá</button>
              <button type="button" class="btn btn-secondary ms-2" @click="showModal = false">Hủy</button>
            </form>
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
      showModal: false,
      loading: true, // Add loading state
      reviews: [],
      newReview: {
        noidung: '',
        rating: '',
      },
      currentBookingId: null, // Track the ID of the current booking
      currentCustomerId: null, // Track the ID of the current customer
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
        console.error('Failed to fetch bookings:', error);
        this.bookings = []; // Set to empty array on error
      } finally {
        this.loading = false; // Stop loading regardless of success or error
      }
    },

    // Kiểm tra xem đã có đánh giá cho đặt phòng hay chưa
    hasReview(bookingId) {
      return this.reviews.some(review => review.booking === bookingId);
    },

    async getReviews() {
      try {
        const customerId = this.$route.params.id;
        const response = await api.get(`/review/${customerId}`);
        this.reviews = response.data;
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      }
    },

    // Open the review modal and set the current booking information
    openReviewModal(booking) {
      this.currentBookingId = booking._id; // Store the current booking ID
      this.currentCustomerId = booking.customer ? booking.customer._id : null; // Store customer ID if it exists
      this.newReview = { noidung: '', rating: '' }; // Reset review data
      this.showModal = true; // Show the modal
    },

    async addReview() {
      if (!this.currentBookingId) {
        alert('Không có thông tin đặt phòng hiện tại!'); // Alert for no booking
        return;
      }

      try {
        const reviewData = {
          booking: this.currentBookingId, // Use the ID of the current booking
          customer: this.currentCustomerId, // Use customer ID if exists
          noidung: this.newReview.noidung,
          rating: this.newReview.rating,
        };

        const response = await api.post('/review', reviewData);

        // Handle the response
        if (response.status === 201) {
          alert('Thêm đánh giá thành công!');
          this.newReview = { noidung: '', rating: '' };
          this.showModal = false;
        }
      } catch (error) {
        console.error('Error adding review:', error);
        alert('Có lỗi xảy ra khi thêm đánh giá. Vui lòng thử lại sau.'); // User-friendly error message
      }
    },

     async deleteBooking(id) {
      const response = await api.delete(`/bookings/${id}`);
      alert('Xóa thành công!');
      this.getReviews();
      
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
    this.getReviews();
  },
};
</script>

<style>
.button-group {
  gap: 10px; /* Adjust the gap between buttons */
}

.history {
  margin-top: 1rem;
  margin-bottom: 2rem;
  background: #fff;
  border-radius: 12px;
  /* padding: 1.5rem; */
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
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6); /* Slightly darker overlay */
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: #fff;
  padding: 1.5rem; /* Reduced padding for better fit */
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
  max-width: 500px; /* Added max width */
  width: 100%; /* Responsive width */
}
.button-active {
  background-color: #ffc107; /* Màu nền khi button được nhấn */
  color: #fff; /* Màu chữ khi button được nhấn */
}
</style>
