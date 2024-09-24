<template>
    <div class="DetailRoom" v-if="room">
      <h1 class="mb-3">{{ room.roomNumber }}</h1>
      
      <!-- Room Status Display -->
      <div class="DetailRoom--main">
        <!-- Show icon only if the room is available -->
        <div v-if="room.status === 'trống'" class="DetailRoom--header">
          <div class="d-flex">
            <i class="fa-solid fa-bed"></i>
            <p>Phòng trống</p>
          </div>
        </div>
        
        <!-- Show booking/check-in details if the room is booked or checked in -->
        <div v-else class="DetailRoom--header">
          <div class="d-flex">
            <i class="fa-solid fa-user"></i>
            <p>{{ room.bookings[0]?.customerName || 'Chưa có thông tin' }}</p>
          </div>
          <div class="d-flex">
            <i class="fa-regular fa-calendar-days"></i>
            <p>Checkin: {{ formatDate(room.bookings[0]?.checkin) || 'Chưa có thông tin' }}</p>
          </div>
          <div class="d-flex">
            <i class="fa-solid fa-calendar-day"></i>
            <p>Checkout:  {{ formatDate(room.bookings[0]?.checkout) || 'Chưa có thông tin' }}</p>
          </div>
          <div class="d-flex">
            <i class="fa-solid fa-user"></i>
            <p>{{ room.maxGuests }} khách</p>
          </div>
        </div>
  
         <!-- Room Amenities and Status Update -->
         <div class="DetailRoom--body d-flex">

          <div class="DetailRoom--service bg-white">
                 <div>
                     <h3>Dịch vụ đã đặt</h3>
                    <!-- Display the ordered services -->
                    <ul >
                      <li v-for="(order, index) in room.bookings" :key="index">
                        <ul>
                          <li v-for="(item, itemIndex) in order.orders" :key="itemIndex">
                            {{ item.itemName }} - {{ item.price }} VND - Số lượng: {{ item.quantity }}
                          </li>
                        </ul>
                      </li>
                      
                    </ul>
                    

                    <!-- <p v-else>Chưa có dịch vụ nào được đặt.</p> -->

                    <button @click="showModal = true" class="btn btn-success">Thêm dịch vụ</button>
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
              <select v-model="room.status" class="form-select" id="status" required>
                <option value="đã đặt">Phòng đã đặt</option>
                <option value="đã nhận">Phòng đã nhận</option>
                <option value="trống">Phòng trống</option>
              </select>
            </div>
  
            <div class="col-md-12">
              <label for="cleanStatus" class="form-label">Cập nhật tình trạng dọn dẹp</label>
              <select v-model="room.trangthai" class="form-select" id="cleanStatus" required>
                <option value="Đã dọn dẹp">Đã dọn dẹp</option>
                <option value="Chưa dọn dẹp">Chưa dọn dẹp</option>
              </select>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Buttons for Room Actions -->
      <div class="DetailRoom--button">
        <button v-if=" room.status === 'đã nhận'" type="submit">Thanh toán</button>
        <button v-else type="submit" @click.prevent="checkInRoom" >Nhận Phòng</button>
        <button type="submit" @click.prevent="saveChanges">Lưu</button>
        <router-link to="/rooms">
          <button class="btn text-white text-decoration-none">Thoát</button>
        </router-link>
      </div>
    </div>


    <!-- Phần modal thêm dịch vụ -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
        <div class="modal-content">
            <h2 class="modal-title">Thêm Dịch Vụ</h2>
            <form @submit.prevent="addMenu">

                <div class="menu d-flex text-center">
                    <!-- Danh sách món ăn trong menu -->
                    <div class="menu--1">
                        <h3>Menu</h3>
                        <ul>
                            <li v-for="item in menuItems" :key="item._id">
                                {{ item.name }} - {{ item.price }} VND
                                <button type="button" @click="selectItem(item)">Chọn</button>
                            </li>
                        </ul>
                    </div>

                    <!-- Danh sách món đã chọn -->
                    <div class="menu--2">
                        <h3>Menu đã chọn</h3>
                        <ul>
                            <li v-for="(item, index) in selectedItems" :key="index">
                                {{ item.name }} - {{ item.price }} VND
                                <button type="button" @click="removeItem(index)">Bỏ</button>
                            </li>
                        </ul>
                    </div>
                </div>

                <button type="submit" class="btn btn-primary">Thêm</button>
                <button type="button" class="btn btn-secondary ms-2" @click="showModal = false">Hủy</button>
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
    };
  },
  computed: {
    // formattedDate() {
    //   const date = new Date();
    //   return date.toLocaleString(); // Formats the current date as 11/01/2024 12:00:00 AM
    // }
    
  },
  async created() {
    try {
      const roomId = this.$route.params.id; // Get the room ID from the route
      const response = await api.get(`/rooms/${roomId}`); // Make the API call with the room ID
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
                // Tạo một đối tượng chứa trạng thái cập nhật
                const updateData = {
                    status: 'đã nhận',
                    // Bạn có thể thêm các thuộc tính khác nếu cần thiết
                };

                // Gửi yêu cầu cập nhật phòng với trạng thái mới
                const response = await api.put(`/rooms/${this.room._id}`, updateData);
                console.log('Nhận phòng thành công:', response.data);

                // Cập nhật trạng thái phòng trong UI
                this.room.status = 'đã nhận';

                // Thông báo thành công cho người dùng
                alert('Nhận phòng thành công!');
            } catch (error) {
                console.log('Lỗi khi nhận phòng:', error);
                alert('Đã xảy ra lỗi, vui lòng thử lại sau.');
            }
          },

        formatDate(dateString) {
            if (!dateString) return 'Chưa có thông tin';
            const date = new Date(dateString);
            return format(date, 'dd/MM/yyyy HH:mm:ss'); // Format date as "dd/MM/yyyy HH:mm:ss"
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
        selectItem(item) {
            const exists = this.selectedItems.find(selectedItem => selectedItem._id === item._id);
            if (!exists) {
              this.selectedItems.push(item); // Chỉ thêm nếu món chưa có trong danh sách đã chọn
            }
          },


        // Hàm xóa món khỏi danh sách đã chọn
        removeItem(index) {
          this.selectedItems.splice(index, 1); // Xóa món tại vị trí được chọn
        },


        // Hàm gửi đơn hàng đã chọn
        async addMenu() {
    if (this.selectedItems.length === 0) {
        alert('Vui lòng chọn ít nhất một món ăn!');
        return;
    }

    // Prepare order data based on room and booking details
    const orderData = {
        bookingId: this.room.bookings[0]?.bookingId, // Ensure the booking ID exists
        // roomId: this.room._id, // Include room ID for tracking
        items: this.selectedItems.map(item => ({
            id: item._id,
            itemName: item.name,  // Item name
            quantity: 1,          // Default quantity to 1 (can be modified as needed)
            price: item.price     // Item price
        }))
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

      // async getOrder() {
      //     try {
      //       const roomId = this.$route.params.id; // Get the room ID from the route
      //       const orderResponse = await api.get(`/orders/${roomId}`);
      //       console.log('Order Response:', orderResponse.data);
      //       this.orders = orderResponse.data || []; // Store the orders
      //     } catch (error) {
      //       console.log('Failed to load orders:', error);
      //     }
      //   },




    
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
