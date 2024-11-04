<template>
  <div class="container text-center d-flex justify-content-center">
    
    <div v-if="loading">Đang xử lý...</div>
    <div v-else-if="success">
      <div class="message--success shadow">
            <div class="icon--check">
              <i class="fa-solid fa-check"></i>
            </div>
            <p class="fs-3 fw-bold mt-2">Thanh toán thành công</p>
            <p class="m-3">Mọi thứ đều hoạt động bình thường.</p>
            <div class="success--input">
              <button  @click="$router.push('/')" class="btn border border-success text-success m-2">Quay lại trang chủ</button>
            </div>
        </div>
    </div>
    <div v-else>
      <div class="message--false shadow">
        
        <div class="icon--check--error">
          <i class="fa-solid fa-xmark"></i>
        </div>
        <p class="fs-3 fw-bold mt-2">Thanh toán thất bại</p>
        <p class="m-3">Rất tiết!, Đã xảy ra lỗi!</p>
        <div class="success--input">
          <button @click="$router.push('/')"  class="btn border border-danger text-danger m-2">Quay lại trang chủ</button>
        </div>
      </div>
      
      

        
      
    </div>
    
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
  margin-top: 2rem;
  margin-bottom: 2rem;
}
.message--success {
    /* position: fixed; */
    background: white;
    padding: 2rem;
    border-radius: 12px;
    font-size: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center; /* Căn giữa icon và text theo chiều ngang */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.message--false {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    font-size: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center; /* Căn giữa icon và text theo chiều ngang */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
