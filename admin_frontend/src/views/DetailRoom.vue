<template>
    <div class="DetailRoom" v-if="room">
      <h1 class="mb-3 text-center">Phòng {{ room.roomNumber }}</h1>
      
      <!-- Room Status Display -->
      <div class="DetailRoom--main">
        <!-- Show icon only if the room is available -->
        <div v-if="room && Object.keys(room.booking).length === 0" class="DetailRoom--header">
          <div class="d-flex">
            <i class="fa-solid fa-bed"></i>
            <p>Phòng trống</p>
          </div>
        </div>
        
        <!-- Show booking/check-in details if the room is booked or checked in -->
        <div v-else class="DetailRoom--header">
          <div class="d-flex">
            <i class="fa-solid fa-user"></i>
            <p>{{ room.booking?.customerName || 'Chưa có thông tin' }}</p>
          </div>
          <div class="d-flex">
            <i class="fa-regular fa-calendar-days"></i>
            <p>Checkin: {{ formatDate(room.booking?.checkin) || 'Chưa có thông tin' }}</p>
            <span class="ms-2" v-if="room.booking.checkinTime">Giờ nhận phòng: {{ room.booking.checkinTime }} </span>
          </div>
          <div class="d-flex">
            <i class="fa-solid fa-calendar-day"></i>
            <p>Checkout:  {{ formatDate(room.booking?.checkout) || 'Chưa có thông tin' }} 12:00:00</p>
          </div>
          <div class="d-flex">
            <i class="fa-solid fa-users"></i>
            <p>{{ room.adults }} khách</p>
          </div>
          <div class="d-flex">
            <i class="fa-solid fa-user"></i>
            <p>{{ room.children }} Trẻ em</p>
          </div>
        </div>
  
         <!-- Room Amenities and Status Update -->
         <div class="DetailRoom--body d-flex">

          <div class="DetailRoom--service bg-white">
                 <div>
                      <!-- Kiểm tra nếu có đơn hàng dịch vụ trong booking -->
                      <ul v-if="room.booking.orders && room.booking.orders.length > 0">
                        <li v-for="(order, index) in room.booking.orders" :key="index">
                          {{ order.itemName }} - {{ order.price }} VND - Số lượng: {{ order.quantity }}
                        </li>
                      </ul>

                      <!-- Nếu không có dịch vụ nào được đặt -->
                      <p v-else>Chưa có dịch vụ nào được đặt.</p>
                    

                    <!-- <p v-else>Chưa có dịch vụ nào được đặt.</p> -->

                    <button @click="showModal = true" v-if="Object.keys(room.booking).length !== 0" class="btn btn-success">Thêm dịch vụ</button>
                  </div>
                </div>
                <!-- <div class="DetailRoom--service bg-white">
                    <div>
                        <h1>Dịch vụ</h1>
                       
                        <ul>
                            <li v-for="(item, index) in orders" :key="index">
                                {{ item.name }} - {{ item.price }} VND
                            </li>
                        </ul>
                        
                        <button @click="showModal = true" class="btn btn-success">Thêm dịch vụ</button>
                    </div>
                </div> -->

             
  
          <div class="DetailRoom--status bg-white">
            <div class="col-md-12 mb-3">
              <label for="status" class="form-label">Cập nhật tình trạng phòng</label>
              <select  v-model="roomStatus" class="form-select" id="status" required>
                <option value="đã đặt">Phòng đã đặt</option>
                <option value="đã nhận">Phòng đã nhận</option>
                <option value="trống">Phòng trống</option>
              </select>
            </div>

  
            <div class="col-md-12">
              <label for="cleanStatus" class="form-label">Cập nhật tình trạng dọn dẹp</label>
              <select v-model="room.trangthai" class="form-select" id="cleanStatus" @change="updateCleaningStatus" required>
                <option value="Đã dọn dẹp">Đã dọn dẹp</option>
                <option value="Chưa dọn dẹp">Chưa dọn dẹp</option>
              </select>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Room Actions -->
          <div class="DetailRoom--button">
            <!-- Check if bookings[0] exists before accessing its status -->
            <button v-if="room.booking?.status === 'đã đặt'" type="submit" @click.prevent="checkInRoom">
              Nhận Phòng
            </button>
            <button v-if="room.booking?.status === 'đã đặt'" type="submit" @click.prevent="updateDelete">Hủy</button>
            <button v-if="room.booking?.status ==='đã nhận'" class="" @click="earlyCheckout()">Trả phòng</button>
            <router-link to="/rooms">
              <button class="btn text-white text-decoration-none">Thoát</button>
            </router-link>
          </div>

    </div>


    <!-- Phần modal thêm dịch vụ -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
        <div class="modal-content">
            <h2 class="modal-title text-center">Thêm Dịch Vụ</h2>
            <form @submit.prevent="addMenu">

                <div class="menu d-flex text-center">
                    <!-- Danh sách món ăn trong menu -->
                    <div class="menu--1">
                        <h3>Menu</h3>
                        <ul>
                            <li v-for="item in menuItems" :key="item._id">
                                {{ item.name }} - {{ formatCurrency(item.price) }} - {{ item.quantity }}
                                <button type="button" class="btn btn-success" @click="selectItem(item, item.quantity)">Chọn</button>
                            </li>
                        </ul>
                    </div>

                    <!-- Danh sách món đã chọn -->
                    <div class="menu--2">
                        <h3>Menu đã chọn</h3>
                        <ul>
                            <li v-for="(item, index) in selectedItems" :key="index">
                                {{ item.name }} - {{ formatCurrency(item.price) }} - {{ item.quantity }}
                                <button type="button" class="btn btn-danger" @click="removeItem(index)">Bỏ</button>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="text-center">
                  <button type="submit" class="btn btn-primary">Thêm</button>
                  <button type="button" class="btn btn-secondary ms-2" @click="showModal = false">Hủy</button>
                </div>

                
            </form>
        </div>
    </div>
  </template>
  
<script>
import api from '../api';
import { format } from 'date-fns';

export default {
  data() {
    return {
      room: null,
      showModal: false, // Điều khiển hiển thị modal
      menuItems: [], // Danh sách món ăn từ menu
      selectedItems: [], // Danh sách món đã chọn
      bookingId: null, // Lưu booking ID
      orders: [],
      currentTime: this.getCurrentTime()
    };
  },
  computed: {
    roomStatus: {
    get() {
      return this.room.booking.length === 0 ? 'trống' : this.room.booking.status;
    },
    set(newStatus) {
      if (this.room.booking.length > 0) {
        this.room.booking.status = newStatus;
      } else if (newStatus !== 'trống') {
        // Nếu phòng đang trống và người dùng cập nhật thành "đã đặt" hoặc "đã nhận"
        this.room.booking.push({ status: newStatus });
      }
    }
  },
    // formattedDate() {
    //   const date = new Date();
    //   return date.toLocaleString(); // Formats the current date as 11/01/2024 12:00:00 AM
    // }
    
  },
    async created() {
      try {
        const roomId = this.$route.params.id; // Get the room ID from the route
        const searchDate = this.$route.query.date; // Get the date from query parameters
        const response = await api.get(`/rooms/datebooking/${roomId}?date=${searchDate}`); // Make the API call with the room ID
        this.room = response.data; // Store the response data in the `room` object
        console.log('Room ID:', roomId);

        // Fetch the orders after getting the room details
        // await this.getOrder(); // Call getOrder here to fetch orders

      } catch (error) {
        console.log('Failed to load room details:', error);
      }
    },


  methods: {
    async checkInRoom() {
        try {
            // Kiểm tra xem có booking ID hợp lệ không
            const bookingId = this.room.booking?.bookingId;
            if (!bookingId) {
                alert('Không tìm thấy ID đặt phòng.');
                return;
            }
            console.log(bookingId)

            // Tạo đối tượng dữ liệu cập nhật
            const updateData = {
                status: 'đã nhận',
                checkinTime: this.currentTime
            };

            // // Hiển thị trạng thái tải
            // this.loading = true;

            // Gửi yêu cầu cập nhật trạng thái phòng
            const response = await api.put(`/bookings/rooms/${bookingId}`, updateData);
            console.log('Nhận phòng thành công:', response.data);

            // Cập nhật trạng thái phòng trong giao diện người dùng
            this.room.booking.status = 'đã nhận';

            // Hiển thị thông báo thành công cho người dùng
            alert('Nhận phòng thành công!');
            window.location.reload(); // Reload trang sau khi thêm thành công
        } catch (error) {
            console.log('Lỗi khi nhận phòng:', error);
            alert('Đã xảy ra lỗi khi nhận phòng, vui lòng thử lại sau.');
        } finally {
            // // Tắt trạng thái tải
            // this.loading = false;
        }
    },
    getCurrentTime() {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    },

            async updateDelete() {
            try {
                const confirmed = confirm('Bạn có chắc chắn muốn hủy phòng này?');
                if (!confirmed) return;

                const bookingId = this.room.booking?.bookingId;
                console.log(bookingId);

                const updateData = { status: 'đã hủy' };

                await api.put(`bookings/rooms/booking/${bookingId}`, updateData);
                this.room.booking.status = 'đã hủy';
                alert('Hủy phòng thành công!');
            } catch (error) {
                console.log('Lỗi khi hủy phòng:', error);
            }
        },



        // Format currency to VND without leading zero
        formatCurrency(value) {
              // Convert to integer if the value is a number
              const numberValue = typeof value === 'number' ? value : parseFloat(value);
              return `${numberValue.toLocaleString('it-IT')} VND`;
        },

    



        formatDate(dateString) {
            if (!dateString) return 'Chưa có thông tin';
            const date = new Date(dateString);
            return format(date, 'dd/MM/yyyy'); // Format date as "dd/MM/yyyy HH:mm:ss"
        },
        async saveChanges() {
            try {
              const response = await api.put(`/rooms/${this.room._id}`, this.room);
              console.log('Room updated successfully:', response.data);
            } catch (error) {
              console.log('Failed to save changes:', error);
            }
        },

        // Hàm để gọi API và lấy danh sách menu
        async fetchMenuItems() {
            try {
              const response = await api.get('/menu'); // API gọi danh sách món ăn
              this.menuItems = response.data;
            } catch (error) {
              console.error('Lỗi khi lấy danh sách món ăn:', error);
            }
        },
         // Hàm thêm món vào danh sách đã chọn
    selectItem(item, quantity) {
        const exists = this.selectedItems.find(selectedItem => selectedItem._id === item._id);
        
        // Kiểm tra nếu món đã có trong danh sách và số lượng chưa vượt quá số lượng có sẵn
        if (exists) {
            if (exists.quantity < quantity) {
                exists.quantity += 1;  // Tăng số lượng món nếu chưa vượt quá số lượng có sẵn
            } else {
                alert('Không thể chọn thêm món này, đã đủ quá số lượng'); // Thông báo nếu số lượng đã đủ
            }
        } else {
            if (1 <= quantity) {
                this.selectedItems.push({ ...item, quantity: 1 }); // Thêm món vào danh sách với số lượng ban đầu là 1
            } else {
                alert('Không thể chọn món này, hết hàng'); // Thông báo nếu không có sẵn món
            }
        }
    },

    // Hàm xóa món khỏi danh sách đã chọn
    removeItem(index) {
        const item = this.selectedItems[index];
        if (item.quantity > 1) {
            item.quantity -= 1;  // Giảm số lượng nếu lớn hơn 1
        } else {
            this.selectedItems.splice(index, 1);  // Xóa món nếu số lượng là 1
        }
    },
        // Hàm gửi đơn hàng đã chọn
        async addMenu() {
          if (this.selectedItems.length === 0) {
              alert('Vui lòng chọn ít nhất một món ăn!');
              return;
          }

          // Prepare order data based on room and booking details
          const orderData = {
              bookingId: this.room.booking.bookingId,
              // Ensure the booking ID exists
             
              // roomId: this.room._id, // Include room ID for tracking
              items: this.selectedItems.map(item => {
                console.log('Item ID in order:', item._id);
                return {
                  _id: item._id,
                  itemName: item.name,  // Item name
                  quantity: item.quantity,          // Default quantity to 1 (can be modified as needed)
                  price: item.price     // Item price
              };
          })
          };

          // Log order data for debugging
          console.log('Order Data:', orderData);

          try {
              // Make the API call to create the order
              const response = await api.post('/orders', orderData);
              alert('Đơn hàng đã được tạo thành công!');

              // Reset modal and selection
              this.showModal = false;
              this.selectedItems = [];
              window.location.reload(); // Reload trang sau khi thêm thành công
          } catch (error) {
              console.log('Lỗi khi tạo đơn hàng:', error);
              if (error.response) {
                  console.log('Error Response:', error.response.data);
                  alert('Có lỗi xảy ra khi tạo đơn hàng: ' + error.response.data.message);
              } else {
                  alert('Có lỗi xảy ra, vui lòng thử lại sau.');
              }
          }
      },

      async updateCleaningStatus() {
          try {
            const updateData = { trangthai: this.room.trangthai };
            await api.put(`/rooms/${this.room._id}`, updateData);
            alert('Cập nhật tình trạng dọn dẹp thành công!');
          } catch (error) {
            console.log('Failed to update cleaning status:', error);
          }
      },

      // async earlyCheckout() {
      //   try {
      //       // const newCheckoutDate = prompt('Nhập ngày trả phòng mới (YYYY-MM-DD):');
      //       const id = this.room.booking?.bookingId;

      //       // Lấy ngày hiện tại theo định dạng YYYY-MM-DD
      //       const currentDate = new Date().toISOString().slice(0, 10); 

      //         const response = await api.put(`/bookings/checkout/${id}`, {
      //           checkoutDate: currentDate,
      //         });

      //         alert('Trả phòng thành công')

      //         // this.showSuccessMessage = true;
      //         // this.successMessage = response.data.message;
      //         // setTimeout(() => this.showSuccessMessage = false, 3000);

      //         window.location.reload(); // Reload trang sau khi thêm thành công
      //   } catch (error) {
      //      // Kiểm tra nếu có response từ backend
      //       if (error.response && error.response.data && error.response.data.message) {
      //         console.error('Failed to update checkout:', error.response.data.message);
      //         alert(`${error.response.data.message}`);
      //       } else {
      //         // Nếu không có response hoặc message cụ thể, log lỗi chung
      //         console.error('Failed to update checkout:', error);
      //         alert('Có lỗi xảy ra. Vui lòng thử lại.');
      //       }
      //   }
      // }

      async earlyCheckout() {
        try {
            // Kiểm tra xem có booking ID hợp lệ không
            const id = this.room.booking?.bookingId;
            if (!id) {
                alert('Không tìm thấy ID đặt phòng.');
                return;
            }
            console.log(id)

                   // Lấy ngày hiện tại theo định dạng YYYY-MM-DD
            const currentDate = new Date().toISOString().slice(0, 10); 

            // Tạo đối tượng dữ liệu cập nhật
            const updateData = {
                status: 'hoàn thành',
                checkoutDate: currentDate,
                checkoutTime: this.currentTime,
                
            };

            // // Hiển thị trạng thái tải
            // this.loading = true;

            // Gửi yêu cầu cập nhật trạng thái phòng
            const response = await api.put(`/bookings/checkout/${id}`, updateData);
            console.log('Nhận phòng thành công:', response.data);

            // Cập nhật trạng thái phòng trong giao diện người dùng
            this.room.booking.status = 'hoàn thành';

            // Hiển thị thông báo thành công cho người dùng
            alert('Trả phòng thành công!');
            window.location.reload(); // Reload trang sau khi thêm thành công
        } catch (error) {
            console.log('Lỗi khi nhận phòng:', error);
            alert('Đã xảy ra lỗi khi nhận phòng, vui lòng thử lại sau.');
        } finally {
            // // Tắt trạng thái tải
            // this.loading = false;
        }
    },
    
  },
  createdHours() {
    // Cập nhật giờ hiện tại mỗi phút
    setInterval(() => {
      this.currentTime = this.getCurrentTime();
    }, 60000);
  },
    mounted() {
      // Tự động lấy danh sách món ăn khi component được khởi tạo
      this.fetchMenuItems();
        
}
};
</script>

<style scoped>
.DetailRoom {
    background: #fff;
    padding: 2rem;
    border-radius: 10px;
    text-align: center;
}
.DetailRoom--main {
    background: #eeecec;
    border-radius: 10px;
}
.DetailRoom--header {
    display: flex;
    justify-content: space-around;
    padding-top: 15px;
}
.DetailRoom--header .d-flex i {
    margin-right: 10px;
    margin-top: 4px;
}
.DetailRoom--body {
    gap: 1rem;
    justify-content: space-around;
    padding-bottom: 10px;
}
.DetailRoom--service,
.DetailRoom--status {
    flex-basis: 45%;
    padding: 1rem;
    border-radius: 10px;
}
.DetailRoom--button {
    display: flex;
    justify-content: space-around;
    gap: 4px;
    margin-top: 15px;
}
.DetailRoom--button button {
    flex-grow: 1;
    padding: 10px;
    max-width: 150px;
    background-color: #30d366;
    color: white;
    border: none;
    border-radius: 5px;
}
.DetailRoom--button button:hover {
    background-color: #0056b3;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 600px;
  width: 100%;
}

/* .d-flex {
  display: flex;
  justify-content: space-between;
} */

.menu--1, .menu--2 {
  width: 45%;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin-bottom: 10px;
}

button {
  margin-left: 10px;
}

</style>
