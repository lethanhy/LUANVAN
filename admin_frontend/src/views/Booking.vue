<template>
  <div class="booking">
    <div class="d-grid gap-2 d-md-flex justify-content-md-end">
  <button class="btn btn-success me-md-2 mb-3" type="submit"><router-link to="/bookings/order" class="text-decoration-none text-white">Đặt phòng</router-link>
  </button>
</div>
    <table class="table  rounded-2 text-center ">
        <thead>
          <tr class="table-primary">
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
              <button type="submit" class="btn btn-warning"><i class="fa-solid fa-circle-info text-white"></i></button>
            </td>
            <td>
              <button type="submit" class="btn btn-danger"><i class="fa-solid fa-xmark"></i></button>
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
  .bill{
    background: rgb(175, 255, 223);
    padding: 5px;
    border-radius: 10px;
    
  }
  

  </style>
  