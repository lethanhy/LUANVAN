<template>
  <div class="booking">
    <h3 class="text-center fw-bold text-dark">Quản lý đặt phòng</h3>
    <div class="d-grid gap-2 d-md-flex justify-content-md-end">
      <button class="btn btn-success me-md-2 mb-3 shadow" type="submit"><router-link to="/bookings/order" class="text-decoration-none text-white">Đặt phòng</router-link>
      </button>
    </div>
    <table class="table table-bordered text-center">
        <thead class="table-secondary">
          <tr>
            <th scope="col">STT</th>
            <th scope="col">Tên khách hàng</th>
            <th scope="col">Ngày lập phiếu</th>
            <th scope="col">Tên nhân viên</th>
            <th scope="col">Hóa đơn</th>
            <th scope="col">Chi tiết</th>
            <th scope="col">Xóa</th>
          </tr>
        </thead>
        <tbody >
          <tr v-for="(booking, index) in bookings" :key="index">
            <th scope="row" >{{ index + 1 }}</th>
            <td>{{ booking.customer.name }}</td>
            <td>{{ formatDate(booking.createdAt) }}</td>
            <td>Lê Thành Y</td>
            <td>
              <button class="bill">Đã thanh toán</button>
            </td>
            <td>
              <button type="submit" class="btn btn-warning shadow"><i class="fa-solid fa-circle-info text-white"></i></button>
            </td>
            <td>
              <button type="submit" class="btn btn-danger shadow"><i class="fa-solid fa-xmark"></i></button>
            </td>
          </tr>
        </tbody>
      </table>
  </div>

    
  </template>
  
  <script>
import api from '../api';

export default {
  components: {
   
  },
  data() {
    return {
      bookings: [],          // Tất cả phòng
      
    };
  },
  async created() {
    await this.getAllBooking();
  },
  methods: {
    async getAllBooking() {
      try {
        const response = await api.get('/bookings');
        this.bookings = response.data;
      } catch (error) {
        console.error('Failed to fetch rooms:', error);
      }
    },
     // Hàm để định dạng ngày tháng
     formatDate(dateString) {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return new Date(dateString).toLocaleDateString('vi-VN', options); // Định dạng theo kiểu VN
    }
  
  }
};
</script>


  
  <style>
  .booking{
    background: #fff;
    padding: 2rem;
    border-radius: 10px;
  }
  .bill {
    background: rgb(211, 255, 222);  /* Brighter green to white gradient */
    padding: 10px;
    border-radius: 12px;
    border: 2px solid rgb(117, 236, 48); /* Brighter lime green border */
    color: rgb(57, 216, 57); /* Stronger green color for text */
    font-weight: bold;
    box-shadow: 0 4px 8px rgba(50, 205, 50, 0.3); /* Brighter shadow color */
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}
  

  </style>
  