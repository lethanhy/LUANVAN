<template>
  <div class="container text-center">
    <h1>Kết quả thanh toán</h1>
    <div v-if="loading">Đang xử lý...</div>
    <div v-else-if="success">
      <p class="text-success fw-bold fs-4">Thanh toán thành công!</p>
      <p>Mã đơn đặt phòng: {{ bookingId }}</p>
    </div>
    <div v-else>
      <p class="text-danger fw-bold fs-4">Thanh toán thất bại. Vui lòng thử lại.</p>
    </div>
    <router-link to="/" class="btn btn-primary mt-4">Quay lại trang chủ</router-link>
  </div>
</template>

<script>
import api from '../api'; // Axios instance

export default {
  data() {
    return {
      success: false,
      loading: true,
      bookingId: null,
    };
  },
  async created() {
    try {
      const queryParams = new URLSearchParams(window.location.search);
      const response = await api.get(`/payment/vnpay/return?${queryParams.toString()}`);

      if (response.data.statusCode === 200) {
        this.success = true;
        this.bookingId = response.data.data.BookingID;
      } else {
        this.success = false;
      }
    } catch (error) {
      console.error('Error handling payment return:', error);
      this.success = false;
    } finally {
      this.loading = false;
    }
  },
};
</script>

<style scoped>
.container {
  margin-top: 7rem;
}
</style>
