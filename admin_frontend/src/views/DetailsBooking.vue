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

              <button @click="handleChangeRoom" class="btn btn-info mt-2 text-white ">Đổi phòng</button>
            </div>

            <div
              
              class="room-details"
              v-if="bookings"
            >
              <div class="">
                <p class="room-number">Thanh toán</p>
              </div>
              <div class="room-info">
                <p><strong>Phương thức: </strong> {{ bookings.payment.phuongthuc }}</p>
                <p><strong>Trạng thái giao dịch: </strong> {{ bookings.payment.paymentStatus }}</p>
              </div>
            </div>
            <!-- <p v-else>Không có phòng đặt nào.</p> -->
          </div>

          
        </div>
  
        <!-- Ordered Products Section (Below the two top sections) -->
        <div class="user--body p-3 bg-light border rounded-3">
          <h4 class="section-title">Dịch vụ đã đặt</h4>
          <div v-if="bookings && bookings.orders.length">
            <div
              v-for="(order, orderIndex) in bookings.orders"
              :key="orderIndex"
            >
              <div>
                <p>{{ order.itemName }} - Số lượng: {{ order.quantity }}</p>
              </div>
              <p>Tổng tiền: {{ formatCurrency(order.price * order.quantity) }}</p>
            </div>
          </div>
          <p v-else>Không có sản phẩm đặt nào.</p>
        </div>
      </div>

      <div class="total-amount p-3">
            <div>
              <h4 class="section-title">Tổng tiền</h4>
              <p class="total-text">Tổng tiền: {{ calculateTotal() }}</p>
            </div>
            <!-- <button @click="generateExcel" class="btn ">In</button> -->
            <div class="text-center" v-if="bookings && bookings.status !== 'đã hủy'" :class="{ 'btn-success': bookings.paid, 'btn-danger': !bookings.paid }">
              <button 
                 v-if="bookings.paid"
                @click="handlePayment" 
                class="btn text-white"
              >
                Xem hóa đơn
              </button>
              <button 
                v-if="!bookings.paid && bookings.status !== 'đã hủy'"
                @click="handlePayment" 
                class="btn text-white"
              >
                Chưa thanh toán
              </button>
              
            </div>
      </div>


    </div>

              <div v-if="showChangeRoom" class="modal-overlay" @click.self="showChangeRoom = false">
                <div v-if="bookings" class="modal-content p-3 modal-sm">
                  <!-- Hotel Info -->
                  <h2 class="modal-title text-center mb-2 text-info">Đổi Phòng</h2>

                  <p>Thời gian nhận phòng: {{ formatDate(bookings.checkin) }}</p>
                  <p>Thời gian nhận phòng: {{ formatDate(bookings.checkout) }}</p>

                  <!-- <div class="form-group-date">
                    <label for="start-date">Thời gian nhận phòng</label>
                    <div class="input-wrapper">
                      <i class="fas fa-calendar-alt"></i>
                      <input type="date" v-model="bookings.checkin"  />
                    </div>
                  </div>
                  <div class="form-group-date">
                    <label for="start-date">Thời gian trả phòng</label>
                    <div class="input-wrapper">
                      <i class="fas fa-calendar-alt"></i>
                      <input type="date" v-model="bookings.checkout" />
                    </div>
                  </div> -->

                  <div v-if="rooms.length">
                    <h2>Phòng trống</h2>
                    <ul>
                      <li v-for="room in rooms" :key="room.id">
                        phòng {{ room.roomNumber }} - {{ room.type }} - số lượng {{ room.maxGuests }} - {{ room.price.toLocaleString() }} VND

                       
                      </li>
                    </ul>
                  </div>

                  <!-- Close Button -->
                  <div class="text-center">
                    <button type="button" class="btn btn-secondary me-2" @click="showChangeRoom = false">Hủy</button>
                    <button class="btn btn-primary">In Hóa Đơn</button>
                  </div>
                </div>
              </div>

              <!-- Thanh toán Modal -->
                <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
                    <div class="modal-content p-3 modal-sm">
                        <!-- Hotel Info -->
                        <h5 class="modal-title text-center mb-2">Ocean Breeze Hotel</h5>
                        <p class="text-center mb-1">ĐC: 28 Đường Thi Sách, Phường Thắng Tám, TP Vũng Tàu, BR-VT</p>
                        <p class="text-center mb-3">ĐT: 0939 834 780</p>

                        <!-- Invoice Title -->
                        <h4 class="text-center fw-bold mb-3">HÓA ĐƠN</h4>

                        <!-- Room and Customer Info -->
                        <p class="text-center fw-bold mb-3" v-if="bookings">Phòng {{ bookings.room.roomNumber }}</p>
                        <div class="d-flex justify-content-between mb-3" v-if="bookings">
                            <div>
                                <p class="mb-1">{{ bookings.customer.name }}</p>
                                <p class="mb-1">Ngày tạo: {{ currentDate }}</p>
                                <p class="mb-1">Số hóa đơn: 2</p>
                                <p class="mb-1">Nhân viên: <span v-if="bookings.staff">{{ bookings.staff.name }}</span>
                                  <span v-else>Đặt phòng online</span></p>
                            </div>
                            <div>
                                <p class="mb-1">Số người: {{ bookings.adults }}</p>
                                <p class="mb-1">Số ngày: {{ calculateDays(bookings.checkin, bookings.checkout) }}</p>
                            </div>
                        </div>

                        <!-- Invoice Table -->
                        <table class="table table-sm table-bordered">
                            <thead class="table-light">
                                <tr>
                                    <th>Dịch vụ</th>
                                    <th>Số lượng/Ngày</th>
                                    <th>Giá (VND)</th>
                                    <th>Thành tiền (VND)</th>
                                </tr>
                            </thead>
                            <tbody class="text-center">
                                <tr v-for="order in bookings.orders">
                                    <td>{{ order.itemName }}</td>
                                    <td>{{ order.quantity }}</td>
                                    <td>{{ order.price }}</td>
                                    <td>{{ order.price * order.quantity }}</td>
                                </tr>
                                <tr v-if="bookings">
                                    <td>Thuê phòng</td>
                                    <td>{{ calculateDays(bookings.checkin, bookings.checkout) }}</td>
                                    <td>{{ bookings.room.price }}</td>
                                    <td>{{ calculateDays(bookings.checkin, bookings.checkout) * bookings.room.price }}</td>
                                </tr>
                                <tr v-if="bookings">
                                    <td colspan="3" class="fw-bold text-end">Tổng tiền:</td>
                                    <td class="fw-bold">{{ calculateTotal() }}</td>
                                </tr>
                            </tbody>
                        </table>

                        <!-- Thank You Message -->
                        <div class="text-center mb-3">
                            <p><i class="fa-solid fa-heart heart-icon"></i> Cảm ơn quý khách!!!</p>
                        </div>

                        <!-- Close Button -->
                        <div class="text-center">
                            <button type="button" class="btn btn-secondary me-2" @click="showModal = false">Hủy</button>
                            <button @click="printInvoice" class="btn btn-primary">In Hóa Đơn</button>
                        </div>
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
        showChangeRoom: false,
        currentDate: '',
        rooms: [],
        

      };
    },
    mounted() {
    this.getCurrentDate();
    this.getRoomAvailable();
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

      handleChangeRoom() {
    if (this.bookings) {
      this.showChangeRoom = true;
      this.getRoomAvailable(); // Fetch available rooms whenever the modal is opened
    } else {
      console.error('Bookings data is not available.');
    }
  },

      async getRoomAvailable() {
        console.log('Check-in date:', this.bookings.checkin);
        console.log('Check-out date:', this.bookings.checkout);
  
 
    try {
      const response = await api.get('/bookings/order', {
        params: {
          checkin: this.bookings.checkin,
          checkout: this.bookings.checkout
        }
      });
      this.rooms = response.data;
    } catch (error) {
      console.log('Failed to load room details:', error);
      alert('Lỗi khi tải thông tin phòng. Vui lòng thử lại sau.');
    }
},

      getCurrentDate() {
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, '0');
      const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
      const yyyy = today.getFullYear();

      this.currentDate = `${dd}/${mm}/${yyyy}`;
    },
     // Handle payment and update booking status
     async handlePayment() {
      try {
        await api.put(`/bookings/${this.bookings._id}`, { paid: true }); // Update the paid status
        this.showModal = true; // Show the modal after payment is successful
      } catch (error) {
        console.log('Failed to update booking status:', error);
        // Handle error appropriately (e.g., show a notification)
      }
    },
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

        calculateTotal() {
                  let total = 0;

                  // Tính tổng tiền phòng
                  if (this.bookings && this.bookings.room) {
                      const roomPrice = parseFloat(this.bookings.room.price);
                      // console.log('Room Price:', roomPrice);
                      
                      // Tính số ngày ở
                      if (!isNaN(roomPrice) && this.bookings.checkin && this.bookings.checkout) {
                          const checkinDate = new Date(this.bookings.checkin);
                          const checkoutDate = new Date(this.bookings.checkout);
                          const timeDiff = checkoutDate - checkinDate; // Tính thời gian chênh lệch
                          const days = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Chuyển đổi sang số ngày

                          // console.log('Days:', days);
                          const roomTotal = roomPrice * days; // Tính tổng tiền phòng
                          // console.log('Room Total:', roomTotal);
                          total += roomTotal; // Cộng vào tổng
                      }
                  }

                  // Tính tổng tiền dịch vụ đã đặt
                  if (this.bookings && Array.isArray(this.bookings.orders)) {
                      const ordersTotal = this.bookings.orders.reduce((orderTotal, order) => {
                          const orderPrice = parseFloat(order.price) || 0; // Đảm bảo giá trị là số
                          const orderQuantity = order.quantity || 0; // Sử dụng giá trị mặc định là 0 nếu không có
                          // console.log(`Order Price: ${orderPrice}, Quantity: ${orderQuantity}`);
                          return orderTotal + (orderPrice * orderQuantity); // Cộng dồn
                      }, 0);
                      total += ordersTotal; 
                  }

                  // console.log('Total:', total); // Kiểm tra tổng
                  return this.formatCurrency(total); // Định dạng cuối cùng
              },



            formatCurrency(value) {
              // Kiểm tra xem giá trị có hợp lệ không
              if (value === null || value === undefined || isNaN(value)) {
                  return "0 VND"; // Hoặc bạn có thể xử lý theo cách khác
              }

              // Chuyển đổi giá trị sang số nếu cần
              const numberValue = typeof value === 'number' ? value : parseFloat(value);

              // Định dạng và trả về giá trị
              return `${numberValue.toLocaleString('it-IT')} VND`;
          },


        printInvoice() {
        this.showModal = true; // Hiển thị modal trước khi in

        this.$nextTick(() => {
          const printContents = document.querySelector('.modal-content').outerHTML; // Lấy nội dung phần modal để in
          const originalContents = document.body.innerHTML;

          document.body.innerHTML = printContents; // Thay thế toàn bộ nội dung trang bằng nội dung hóa đơn
          window.print(); // Thực hiện in

          document.body.innerHTML = originalContents; // Khôi phục lại trang gốc sau khi in
          window.location.reload(); // Tải lại trang để khôi phục các sự kiện Vue
        });
      },




  // async generateExcel() {
  //   try {
  //       // Check if booking data is available
  //       if (!this.bookings || !this.bookings.customer || !this.bookings.room || !this.bookings.orders) {
  //           alert('Dữ liệu đặt phòng không đầy đủ');
  //           return;
  //       }

  //       // Prepare the invoice data with improved styling
  //       const invoiceData = [
  //           ['Thông tin khách hàng'],  // Section title
  //           ['Tên:', this.bookings.customer.name],
  //           ['Email:', this.bookings.customer.email],
  //           ['Số điện thoại:', this.bookings.customer.phone],
  //           ['Địa chỉ:', this.bookings.customer.address],
  //           ['CCCD:', this.bookings.customer.cccd],

  //           [''], // Empty row for separation
  //           ['Thông tin phòng đã đặt'],  // Section title
  //           ['Số phòng:', this.bookings.room.roomNumber],
  //           ['Loại phòng:', this.bookings.room.type],
  //           ['Giá phòng:', `${this.bookings.room.price.toLocaleString()} VND`],
  //           ['Ngày nhận phòng:', this.formatDate(this.bookings.checkin)],
  //           ['Ngày trả phòng:', this.formatDate(this.bookings.checkout)],
  //           ['Số ngày:', this.calculateDays(this.bookings.checkin, this.bookings.checkout)],
  //           ['Tổng tiền phòng:', `${this.calculateRoomTotal(this.bookings.room.price, this.bookings.checkin, this.bookings.checkout).toLocaleString()} VND`],

  //           [''], // Empty row for separation
  //           ['Sản phẩm đã đặt'],  // Section title for ordered items
  //           ['Tên sản phẩm', 'Số lượng', 'Đơn giá (VND)', 'Tổng tiền (VND)'], // Column headers
  //           ...this.bookings.orders.map(order => [
  //               order.itemName,
  //               order.quantity,
  //               `${order.price.toLocaleString()} VND`,
  //               `${(order.price * order.quantity).toLocaleString()} VND`,
  //           ]),

  //           [''], // Empty row for separation
  //           ['Tổng tiền hóa đơn', this.calculateTotal().toLocaleString() + ' VND']
  //       ];

  //       // Create a new workbook and worksheet
  //       const ws = XLSX.utils.aoa_to_sheet(invoiceData);
        
  //       // Styling options for column widths
  //       ws['!cols'] = [
  //           { wch: 30 }, // Wider columns for item names
  //           { wch: 20 },
  //           { wch: 15 },
  //           { wch: 20 }
  //       ];

  //       // Add borders to each cell (optional, requires modifying cell style)
  //       for (let cell in ws) {
  //           if (cell[0] === '!') continue; // Skip metadata like column width
  //           ws[cell].s = {
  //               border: {
  //                   top: { style: "thin", color: { auto: 1 } },
  //                   right: { style: "thin", color: { auto: 1 } },
  //                   bottom: { style: "thin", color: { auto: 1 } },
  //                   left: { style: "thin", color: { auto: 1 } },
  //               },
  //               alignment: { vertical: "center", horizontal: "center" } // Center align for better appearance
  //           };
  //       }

  //       const wb = XLSX.utils.book_new();
  //       XLSX.utils.book_append_sheet(wb, ws, 'Invoice');

  //       // Generate Excel file and trigger download
  //       XLSX.writeFile(wb, `HoaDon_${this.bookings.customer.name}.xlsx`);
  //       alert('Xuất hóa đơn thành công!');
  //   } catch (error) {
  //       console.error('Lỗi khi tạo file Excel:', error);
  //       alert('Có lỗi xảy ra khi xuất hóa đơn. Vui lòng thử lại.');
  //   }
  // }

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
  color: #2c86f4; /* Màu xanh cho giá trị */
}
.heart-icon {
  color: red;
}



/* show modal */

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background-color: white;
    border-radius: 8px;
    padding: 16px;
    max-width: 400px; /* Điều chỉnh chiều rộng của modal */
    width: 100%; /* Đảm bảo modal không vượt quá màn hình */
}

.modal-sm {
    padding: 1rem;
    font-size: 0.9rem; /* Thu nhỏ font chữ */
}

.table-sm th, .table-sm td {
    padding: 0.4rem; /* Thu gọn khoảng cách trong bảng */
}

.heart-icon {
    color: red;
}

button {
    font-size: 0.9rem; /* Thu nhỏ kích thước chữ trên nút */
}

h4, h5 {
    font-size: 1.1rem; /* Thu nhỏ tiêu đề */
}

@media print {
  body * {
    visibility: hidden;
  }

  .modal-content, .modal-content * {
    visibility: visible;
  }

  .modal-content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    margin: 0 auto;
  }

  .btn {
    display: none; /* Ẩn các nút khi in */
  }
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
  