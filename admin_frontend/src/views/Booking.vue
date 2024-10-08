<template>
  <div class="booking">
    <h3 class="text-center fw-bold text-info">Quản lý đặt phòng</h3>
    <div class="d-grid gap-2 d-md-flex justify-content-md-end">
      <button class="btn btn-success me-md-2 mb-3 shadow" type="submit">
        <router-link to="/bookings/order" class="text-decoration-none text-white">
          <i class="fas fa-plus"></i> Đặt phòng
        </router-link>
      </button>
    </div>

    <div class="d-flex">
      <!-- Search Bar -->
      <div class="search-bar">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Tìm kiếm theo tên khách hàng" 
          class="form-control" 
        />
      </div>

      <!-- Search Bar for Payment Status -->
      <div class="search-bar">
        <select v-model="searchHoaDon" class="form-select" required>
          <option value="">Tình trạng hóa đơn</option>
          <option value="true">Đã thanh toán</option>
          <option value="false">Chưa thanh toán</option>
        </select>
      </div>

      <!-- Search Bar -->
      <div class="search-bar">
        <input 
          type="date" 
          v-model="searchDate"
          placeholder="Tìm kiếm theo tên ngày" 
          class="form-control" 
        />
      </div>
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
      <tbody>
        <tr v-for="(booking, index) in paginatedBookings" :key="booking._id">
          <th scope="row">{{ index + 1 + (currentPage - 1) * itemsPerPage }}</th>
          <td>{{ booking.customer.name }}</td>
          <td>{{ formatDate(booking.createdAt) }}</td>
          <td>Lê Thành Y</td>
          <td>
            <button 
              :class="{ 'bill--false': !booking.paid, 'bill--true': booking.paid }"
              @click="togglePayment(booking)"
            >
              {{ booking.paid ? 'Đã thanh toán' : 'Chưa thanh toán' }}
            </button>
          </td>
          <td>
            <button type="submit" class="btn btn-warning shadow">
              <router-link :to="{ name: 'DetailsBooking', params: { id: booking._id } }">
                <i class="fa-solid fa-circle-info text-white"></i>
              </router-link>
            </button>
          </td>
          <td>
            <button type="submit" class="btn btn-danger shadow" @click="deleteBooking(booking._id)">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination Controls -->
    <nav aria-label="Page navigation">
      <ul class="pagination">
        <li class="page-item" :class="{ 'disabled': currentPage === 1 }">
          <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">Previous</a>
        </li>
        <li 
          class="page-item" 
          :class="{ 'active': currentPage === page }" 
          v-for="page in totalPages" 
          :key="page"
        >
          <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
        </li>
        <li class="page-item" :class="{ 'disabled': currentPage === totalPages }">
          <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">Next</a>
        </li>
      </ul>
    </nav>
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
  data() {
    return {
      bookings: [], // Danh sách tất cả các đơn đặt phòng
      showSuccessMessage: false,
      successMessage: '',
      currentPage: 1, // Trang hiện tại
      itemsPerPage: 5, // Số mục hiển thị mỗi trang
      searchQuery: '', // Dữ liệu tìm kiếm theo tên khách hàng
      searchHoaDon: '', // Tìm kiếm theo tình trạng hóa đơn
      searchDate:'',
    };
  },
  async created() {
    await this.getAllBooking();
  },
  computed: {
    // Lọc danh sách đặt phòng theo tên khách hàng và tình trạng hóa đơn
    filteredBookings() {
      return this.bookings.filter(booking => {
        const matchesName = booking.customer.name.toLowerCase().includes(this.searchQuery.toLowerCase());
        const matchesStatus = this.searchHoaDon === '' || String(booking.paid) === this.searchHoaDon;
        const matchesDate = booking.createdAt.toLowerCase().includes(this.searchDate.toLowerCase());
        return matchesName && matchesStatus && matchesDate;
      });
    },
    // Chia danh sách đã lọc theo trang
    paginatedBookings() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredBookings.slice(start, end);
    },
    // Tính tổng số trang dựa trên số mục lọc được
    totalPages() {
      return Math.ceil(this.filteredBookings.length / this.itemsPerPage);
    }
  },
  methods: {
    async getAllBooking() {
      try {
        const response = await api.get('/bookings');
        this.bookings = response.data;
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      }
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return new Date(dateString).toLocaleDateString('vi-VN', options);
    }
  }
};
</script>


<style>
.booking {
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
}
/* Styles for payment button */
.bill--false {
  background: rgb(255, 219, 211);
  padding: 5px;
  border-radius: 12px;
  border: 2px solid rgb(250, 119, 26);
  color: rgb(222, 103, 34);
  font-weight: bold;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  font-size: 14px;
}
.bill--true {
  background: rgb(211, 255, 222);
  padding: 5px;
  border-radius: 12px;
  border: 2px solid rgb(117, 236, 48);
  color: rgb(57, 216, 57);
  font-weight: bold;
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

.search-bar{
    margin-right: 15px;
}
.search-bar input {
    max-width: 300px;
    margin-bottom: 15px;
}
</style>
