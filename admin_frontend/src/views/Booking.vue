<template>
  <div class="booking">
    <h3 class="text-center fw-bold text-dark">Quản lý đặt phòng</h3>
    <div class="d-grid gap-2 d-md-flex justify-content-md-end">
      <button class="btn btn-success me-md-2 mb-3 shadow" type="submit"><router-link to="/bookings/order" class="text-decoration-none text-white"><i class="fas fa-plus"></i> Đặt phòng</router-link>
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
              <button 
                :class="{ 'bill--false': booking.paid === false, 'bill--true': booking.paid === true }"
                @click="togglePayment(booking)"
              >
                {{ booking.paid ? 'Đã thanh toán' : 'Chưa thanh toán' }}
              </button>
            </td>
            <td>
              <button type="submit" class="btn btn-warning shadow"><router-link :to="{ name: 'DetailsBooking', params: { id: booking._id } }"><i class="fa-solid fa-circle-info text-white"></i></router-link></button>
            </td>
            <td>
              <button type="submit" class="btn btn-danger shadow"@click="deleteBooking(booking._id)"><i class="fa-solid fa-xmark"></i></button>
            </td>
          </tr>
        </tbody>
      </table>
  </div>

    <!-- Success Message -->
    <div v-if="showSuccessMessage" class="success-message">
      <span class="checkmark">✔️</span>
      <span>{{ successMessage }}</span>
    </div>

    
  </template>
  
  <script>
import api from '../api';

export default {
  components: {
   
  },
  data() {
    return {
      bookings: [], // Tất cả phòng
      showSuccessMessage: false,
      successMessage: '',
      
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
    },
    async deleteBooking(id) {
            try {
                const response = await api.delete(`/bookings/${id}`);
                if (response.status === 200) { // 200 OK status
                    await this.getAllBooking();
                    this.successMessage = 'Xóa thành công!';
                    this.showSuccessMessage = true;
                    setTimeout(() => this.showSuccessMessage = false, 3000);
                } else {
                    this.successMessage = 'Xóa thất bại';
                    this.showSuccessMessage = true;
                    setTimeout(() => this.showSuccessMessage = false, 3000);
                }
            } catch (error) {
                console.log('Error deleting menu:', error);
                this.successMessage = 'Có lỗi xảy ra khi xóa';
                this.showSuccessMessage = true;
                setTimeout(() => this.showSuccessMessage = false, 3000);
            }
        },
  
  }
};
</script>


  
  <style>
  .booking{
    background: #fff;
    padding: 2rem;
    border-radius: 10px;
  }
  .bill--false {
    background: rgb(255, 219, 211);  /* Brighter green to white gradient */
    padding: 5px;
    border-radius: 12px;
    border: 2px solid rgb(250, 119, 26); /* Brighter lime green border */
    color: rgb(222, 103, 34); /* Stronger green color for text */
    font-weight: bold;
    box-shadow: 0 4px 8px rgba(50, 205, 50, 0.3); /* Brighter shadow color */
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    font-size: 14px;
}
.bill--true {
    background: rgb(211, 255, 222);  /* Brighter green to white gradient */
    padding: 5px;
    border-radius: 12px;
    border: 2px solid rgb(117, 236, 48); /* Brighter lime green border */
    color: rgb(57, 216, 57); /* Stronger green color for text */
    font-weight: bold;
    box-shadow: 0 4px 8px rgba(50, 205, 50, 0.3); /* Brighter shadow color */
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    font-size: 14px;
}

.success-message {
    position: fixed;
    top: 10px;
    right: 10px;
    background: #7bef83;
    color: #155724;
    border: 1px solid #c3e6cb;
    border-radius: 5px;
    padding: 10px 20px;
    display: flex;
    align-items: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.checkmark {
    font-size: 20px;
    margin-right: 10px;
}
  

  </style>
  