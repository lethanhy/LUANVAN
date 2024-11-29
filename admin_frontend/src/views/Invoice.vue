<template>
  <div class="invoice">
    <h2 class="text-info">Hóa đơn</h2>

    <div class="d-flex">
      <!-- Search Bar -->
      <div class="search-bar">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Tìm kiếm theo tên" 
          class="form-control mb-3" 
        />
      </div>

      <div class="search-bar">
        <input 
          type="date" 
          v-model="searchDate" 
          class="form-control mb-3" 
        />
      </div>

      <!-- Search Bar for Room Type -->
      <div class="search-bar">
        <select id="type" v-model="searchTotal" class="form-select">
          <option value="">Tổng tiền</option>
          <option value="single">Từ cao đến thấp</option>
          <option value="double">Từ thấp đến cao</option>
        </select>
      </div>

      
      <!-- Nút xuất file -->
      <button class="btn btn-primary mb-3 shadow" @click="exportToCSV">
        <i class="fas fa-file-export"></i> Xuất file CSV
      </button>
    </div>

    <!-- Thông báo khi không có phòng hoặc nhân viên -->
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

    <!-- Bảng hiển thị danh sách phòng và phân công -->
    <table>
      <thead>
        <tr>
          <th>STT</th>
          <th>Ngày</th>
          <th>Tên khách</th>
          <th>Phương thức</th>
          <th>Tổng tiền</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <!-- Hiển thị hóa đơn đã sắp xếp -->
        <tr v-for="(invoice, index) in paginatedInvoices" :key="invoice._id">
          <td>{{ index + 1 }}</td>
          <td>{{ formatDate(invoice.issuedDate) }}</td>
          <td>{{ invoice.booking.customer.name }}</td>
          <td>{{ invoice.booking?.payment.phuongthuc || 'không có' }}</td>
          <td>{{ formatCurrency(invoice.totalAmount) }} VND</td>
          <td><button class="bg-danger" @click="deleteInvoice(invoice._id)">Xóa</button></td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination Controls -->
    <nav class="mt-3"  aria-label="Page navigation">
      <ul class="pagination">
        <li class="page-item" :class="{ 'disabled': currentPage === 1 }">
          <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">Previous</a>
        </li>
        <li class="page-item" :class="{ 'active': currentPage === page }" v-for="page in totalPages" :key="page">
          <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
        </li>
        <li class="page-item" :class="{ 'disabled': currentPage === totalPages }">
          <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">Next</a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import api from "@/api";

export default {
  data() {
    return {
      invoices: [], // Danh sách hóa đơn
      searchQuery: "", // Tìm kiếm theo tên
      searchDate: "", // Tìm kiếm theo ngày
     searchTotal:"",
      errorMessage: "", // Thông báo lỗi
      currentPage: 1, // Current active page
      itemsPerPage: 5, // Number of items to show per page
    };
  },
  created() {
    this.fetchInvoices();
  },
  computed: {
      filteredInvoices() {
        let filtered = this.invoices
          .filter(invoice => {
            const matchesName = invoice.booking.customer.name.toLowerCase().includes(this.searchQuery.toLowerCase());
            const matchesDate = !this.searchDate || invoice.issuedDate.includes(this.searchDate);
            return matchesName && matchesDate;
          });

        // Sorting by totalAmount when searchTotal is selected
        if (this.searchTotal === "single") {
          // Sort from high to low (descending order)
          filtered.sort((a, b) => b.totalAmount - a.totalAmount);
        } else if (this.searchTotal === "double") {
          // Sort from low to high (ascending order)
          filtered.sort((a, b) => a.totalAmount - b.totalAmount);
        }

        return filtered || []; // Ensure it returns an empty array if undefined
      },
      paginatedInvoices() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return this.filteredInvoices.slice(start, end); // Ensure filteredInvoices is always an array
      },
      totalPages() {
        return Math.ceil(this.filteredInvoices.length / this.itemsPerPage);
      },
},

  methods: {
    async fetchInvoices() {
      try {
        const response = await api.get("/invoice"); // API lấy danh sách hóa đơn
        this.invoices = response.data;
      } catch (error) {
        this.errorMessage = "Lỗi khi lấy danh sách hóa đơn.";
      }
    },
    async deleteInvoice(id) {
      try {
        const isConfirmed = window.confirm('Bạn có chắc chắn muốn xóa hóa đơn này không?');
          if (!isConfirmed) {
            return; // Dừng hàm nếu người dùng chọn "Hủy"
          }
        const response =  await api.delete(`/invoice/${id}`);
        alert('Xóa thành công');

      } catch (error) {
        this.errorMessage = "Lỗi khi xóa hóa đơn.";
      }

    },

    formatDate(dateString) {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return new Date(dateString).toLocaleDateString('vi-VN', options);
    },
    formatCurrency(value) {
      if (value === null || value === undefined || isNaN(value)) {
        return "0";
      }
      const numberValue = typeof value === 'number' ? value : parseFloat(value);
      return `${numberValue.toLocaleString('vi-VN')}`;
    },
    exportToCSV() {
      const csvHeader = 'STT,Tên khách hàng,Địa chỉ,Eamil,Căn cước công dân,Giới tính,Số điện thoại,Số phòng,Loại phòng,Giá phòng,Ngày nhận phòng,Ngày trả phòng,Ngày lập phiếu,Tổng tiền\n';
      const csvRows = this.invoices.map((invoice, index) => {
        return `${index + 1},${invoice.booking.customer.name},${invoice.booking.customer.address},${invoice.booking.customer.email},${invoice.booking.customer.cccd},${invoice.booking.customer.gioitinh},${invoice.booking.customer.phone},${invoice.booking.room.roomNumber},${invoice.booking.room.type},${invoice.booking.room.price},${this.formatDate(invoice.booking.checkin)},${this.formatDate(invoice.booking.checkout)},${this.formatDate(invoice.issuedDate)},${invoice.totalAmount}`;
      });

      const csvContent = '\uFEFF' + csvHeader + csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', 'bookings.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    changePage(page) {
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;
    },
  },
};
</script>

<style scoped>
.invoice {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.invoice h2 {
  font-size: 24px;
  margin-bottom: 20px;
}
.error-message {
  color: red;
  margin-bottom: 20px;
}
.invoice table {
  width: 100%;
  border-collapse: collapse;
}
.invoice table th,
table td {
  padding: 12px;
  text-align: left;
  border: 1px solid #ddd;
}
.invoice button {
  padding: 6px 12px;
  background-color: #97bbf1;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.invoice button:hover {
  background-color: #45a049;
}
</style>
