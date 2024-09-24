<template>
    <div class="detailsBooking">
      <div class="detailsBooking--main">
        <div class="top-sections">
          <!-- Customer Information Section -->
          <div class="user--body  p-3">
            <h4 class="section-title">Thông tin khách hàng</h4>
            <div v-if="bookings">
              <div class="form-group">
                <i class="fas fa-user"></i>
                <input type="text" v-model="bookings.customer.name" class="form-control" disabled />
              </div>
              <div class="form-group">
                <i class="fas fa-envelope"></i>
                <input type="email" v-model="bookings.customer.email" class="form-control" disabled />
              </div>
              <div class="form-group">
                <i class="fas fa-phone"></i>
                <input type="tel" v-model="bookings.customer.phone" class="form-control" disabled />
              </div>
              <div class="form-group">
                <i class="fa-solid fa-location-dot"></i>
                <input type="text" v-model="bookings.customer.address" class="form-control" disabled />
              </div>
              <div class="form-group">
                <i class="fa-solid fa-id-card"></i>
                <input type="text" v-model="bookings.customer.cccd" class="form-control" disabled />
              </div>
            </div>
          </div>
  
          <!-- Booked Room Section -->
          <div class="room--body p-3">
            <h4 class="section-title">Phòng đã đặt</h4>
            <div
              
              class="room-details"
              v-if="bookings"
            >
              <div class="room-header">
                <p class="room-number">Phòng {{ bookings.room.roomNumber }}</p>
                <div class="room-dates">
                  <p>Ngày nhận phòng: <span>{{ formatDate(bookings.checkin) }}</span></p>
                  <p>Ngày trả phòng: <span>{{ formatDate(bookings.checkout) }}</span></p>
                </div>
              </div>
              <div class="room-info">
                <p><strong>Thời gian:</strong> {{ calculateDays(bookings.checkin, bookings.checkout) }} ngày</p>
                <p><strong>Tổng tiền phòng:</strong> {{ calculateRoomTotal(bookings.room.price, bookings.checkin, bookings.checkout) }}</p>
              </div>
            </div>
            <!-- <p v-else>Không có phòng đặt nào.</p> -->
          </div>
        </div>
  
        <!-- Ordered Products Section (Below the two top sections) -->
        <div class="user--body p-3 bg-light border rounded-3">
          <h4 class="section-title">Sản phẩm đã đặt</h4>
          <div v-if="bookings && bookings.orders.length">
            <div
              v-for="(order, orderIndex) in bookings.orders"
              :key="orderIndex"
            >
              <div>
                <p>{{ order.itemName }} - Số lượng: {{ order.quantity }}</p>
              </div>
              <p>Tổng tiền: {{ order.price * order.quantity }} VND</p>
            </div>
          </div>
          <p v-else>Không có sản phẩm đặt nào.</p>
        </div>
      </div>

      <div class="total-amount p-3 ">
        <div>
          <h4 class="section-title">Tổng tiền</h4>
          <p class="total-text">Tổng tiền: {{ calculateTotal() }}</p>
        </div>
        <div class="text-center">
          <button  @click="showModal = true"  class="btn btn-success">Thanh toán</button>
          <button @click="generateExcel">Tạo Hóa Đơn Excel</button>
        </div>
      </div>


    </div>

    <!-- Add Room Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
                <div class="modal-content">
                    <h2 class="modal-title text-center">Hóa đơn</h2>
                    <div>
                      <P class="">KHÁCH SẠN SÓNG BÊN BIỂN</p>
                    </div>
                    
                    <form @submit.prevent="addMenu">
                        <div class="mb-3">
                            <label for="name" class="form-label">Tên</label>
                            <input type="text" id="name"  class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label for="quantity" class="form-label">Số lượng</label>
                            <input type="text" id="quantity" class="form-control" required>
                        </div>
                       
                        <div class="mb-3">
                            <label for="price" class="form-label">Giá sản phẩm</label>
                            <input type="text" id="price" class="form-control" required>
                        </div>
                        <button type="submit" class="btn btn-primary">Thêm</button>
                        <button type="button" class="btn btn-secondary ms-2" @click="showModal = false">Hủy</button>
                    </form>
                </div>
            </div>
  </template>
  
  <script>
  import api from '../api';
  import * as XLSX from 'xlsx'; // Import the xlsx library
  
  export default {
    data() {
      return {
        bookings: null,
        showModal: false,
      };
    },
    async created() {
      try {
        const bookingId = this.$route.params.id;
        const response = await api.get(`/bookings/${bookingId}`);
        this.bookings = response.data;
      } catch (error) {
        console.log('Failed to load booking details:', error);
      }
    },
    methods: {
  // Format date
  formatDate(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  },

  // Calculate the number of days between check-in and check-out
  calculateDays(checkin, checkout) {
    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);
    const timeDiff = checkoutDate - checkinDate;
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  },

  // Calculate the total price for rooms
  calculateRoomTotal(price, checkin, checkout) {
    const days = this.calculateDays(checkin, checkout);
    return this.formatCurrency(price * days);
  },

  // Calculate the grand total including both rooms and products
  calculateTotal() {
    let total = 0;

    // Total for rooms
    if (this.bookings && this.bookings.room.length) {
      total += this.bookings.room.reduce((roomTotal, roomBooking) => {
        return roomTotal + this.calculateRoomTotal(roomBooking.roomId.price, roomBooking.checkin, roomBooking.checkout);
      }, 0);
    }

    // Total for ordered products
    if (this.bookings && this.bookings.orders.length) {
      total += this.bookings.orders.reduce((orderTotal, order) => {
        return orderTotal + (order.price * order.quantity);
      }, 0);
    }

    return this.formatCurrency(total);
  },

  // Format currency to VND
  formatCurrency(value) {
    return value.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
  },



  generateExcel() {
      // Prepare the invoice data
      const invoiceData = [
        ['Thông tin khách hàng'],
        ['Tên', this.bookings.customer.name],
        ['Email', this.bookings.customer.email],
        ['Số điện thoại', this.bookings.customer.phone],
        ['Địa chỉ', this.bookings.customer.address],
        ['CCCD', this.bookings.customer.cccd],

        [''], // Empty row for separation
        ['Thông tin phòng đã đặt'],
        ['Số phòng', this.bookings.room.roomNumber],
        ['Loại phòng', this.bookings.room.type],
        ['Giá phòng', `${this.bookings.room.price} VND`],
        ['Ngày nhận phòng', this.formatDate(this.bookings.checkin)],
        ['Ngày trả phòng', this.formatDate(this.bookings.checkout)],
        ['Số ngày', this.calculateDays(this.bookings.checkin, this.bookings.checkout)],
        ['Tổng tiền phòng', `${this.calculateRoomTotal(this.bookings.room.price, this.bookings.checkin, this.bookings.checkout)} VND`],

        [''], // Another empty row for separation
        ['Sản phẩm đã đặt'],
        ...this.bookings.orders.map(order => [
          `Sản phẩm: ${order.itemName}`,
          `Số lượng: ${order.quantity}`,
          `Đơn giá: ${order.price} VND`,
          `Tổng tiền: ${order.price * order.quantity} VND`,
        ]),
        
        [''], // Empty row for separation
        ['Tổng tiền hóa đơn', this.calculateTotal() + ' VND']
      ];

      // Create a new workbook and worksheet
      const ws = XLSX.utils.aoa_to_sheet(invoiceData); // Create sheet from array of arrays
      const wb = XLSX.utils.book_new(); // Create a new workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Invoice'); // Append worksheet to workbook

      // Generate Excel file and trigger download
      XLSX.writeFile(wb, `HoaDon_${this.bookings.customer.name}.xlsx`);
    },

    // Method to format date
    formatDate(dateString) {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return new Date(dateString).toLocaleDateString('vi-VN', options);
    },

    // Calculate the number of days between check-in and check-out
    calculateDays(checkin, checkout) {
      const checkinDate = new Date(checkin);
      const checkoutDate = new Date(checkout);
      const timeDiff = checkoutDate - checkinDate;
      return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    },

    // Calculate total room price
    calculateRoomTotal(price, checkin, checkout) {
      const days = this.calculateDays(checkin, checkout);
      return price * days;
    },

    // Calculate the total of the entire invoice
    calculateTotal() {
      let total = this.calculateRoomTotal(this.bookings.room.price, this.bookings.checkin, this.bookings.checkout);
      
      // Add total for ordered products
      total += this.bookings.orders.reduce((sum, order) => sum + (order.price * order.quantity), 0);
      
      return total;
    }
}

  };
  </script>
  
  <style>
  .detailsBooking {
    background-color: #fff;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-width: 900px;
    margin: auto;
  }
  
  .detailsBooking--main {
    padding: 1rem;
  }
  
  .top-sections {
    display: flex;
    justify-content: space-between;
  }
  
  .section-title {
    font-size: 1.3rem;
    margin-bottom: 1.5rem;
    color: #333;
    font-weight: bold;
    border-bottom: 3px solid #ddd;
    padding-bottom: 0.75rem;
  }
  
  .user--body,
  .room--body {
    width: 48%;
  }
  
  .form-group {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
  }
  
  .form-control {
    width: 100%;
    padding: 0.5rem 0.75rem;
    border-radius: 5px;
    border: 1px solid #ccc;
    margin-left: 0.5rem;
  }
  
  .room-details {
    background-color: #f5f5f5;
    padding: 1.5rem;
    border-radius: 10px;
    border: 1px solid #e0e0e0;
    margin-bottom: 1.5rem;
    transition: box-shadow 0.3s ease;
   
  }
  
  .room-details:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  .room-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
  }
  
  .room-number {
    font-size: 1.25rem;
    font-weight: bold;
    color: #007bff;
  }
  
  .room-dates p {
    margin: 0;
    color: #555;
    font-size: 15px;
  }
  
  .room-info {
    background-color: #fff;
    padding: 0.5rem;
    border-radius: 5px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    font-size: 1rem;
  }
  
  .room-info p {
    margin: 0.5rem 0;
    font-size: 14px;
  }
  .total-amount {
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 1rem;
  margin-top: 1rem;
}
.total-text {
  font-size: 1.5rem;
  font-weight: bold;
  color: #28a745; /* Màu xanh cho giá trị */
}



/* show modal */

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-content {
    background: #fff;
    padding: 2rem;
    border-radius: 10px;
    width: 90%;
    max-width: 500px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.modal-title {
    margin-bottom: 1rem;
}

.form-label {
    margin-bottom: 0.5rem;
    font-weight: bold;
}

.form-control, .form-select {
    margin-bottom: 1rem;
}

  
  @media (max-width: 768px) {
    .top-sections {
      flex-direction: column;
    }
    .user--body,
    .room--body {
      width: 100%;
      margin-bottom: 2rem;
    }
  }
  </style>
  