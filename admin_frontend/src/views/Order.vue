<template>
    <div class="order--room">
      <h1 class="text-center text-primary fw-bold">Đặt phòng</h1>
      <form @submit.prevent="createBooking">
        <div class="order--body d-flex">
          <div class="col-6">
            <h2 class="text-primary fw-bold">Thông tin khách hàng</h2>
            <div class="form-group">
                <i class="fas fa-user"></i>
              <input type="text" v-model="customerName" placeholder="Nhập thông tin khách hàng"  />
            </div>
            <div class="form-group">
                <i class="fas fa-user"></i>
              <input type="text" v-model="email" placeholder="Nhập email"/>
            </div>
            <div class="form-group">
                <i class="fa-regular fa-id-card"></i>
              <input type="text" v-model="cccd" placeholder="Nhập CCCD"/>
            </div>
            <div class="form-group">
                <i class="fa-solid fa-phone"></i>
              <input type="text" v-model="phone" placeholder="Nhập số điện thoại"/>
            </div>
            <div class="form-group">
                <i class="fa-solid fa-location-dot"></i>
              <input type="text" v-model="address" placeholder="Nhập địa chỉ"/>
            </div>
            <div class="form-group">
                <i class="fa-solid fa-venus-mars"></i>
              <select class="form-select" v-model="gioitinh">
                <option value="" disabled selected>Nhập giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            </div>
          </div>
          <div class="col-6">
            <h2 class="text-primary fw-bold">Thông tin phòng</h2>
            <div class="form-group-date">
                <label for="start-date">Thời gian bắt đầu</label>
                <div class="input-wrapper">
                    <i class="fas fa-calendar-alt"></i>
                    <input type="date" v-model="checkin" :min="minDate" placeholder="Thời gian bắt đầu" required />
                </div>
            </div>
            <div class="form-group-date">
                <label for="start-date">Thời gian kết thúc</label>
                <div  class="input-wrapper">
                    <i class="fas fa-calendar-alt"></i>
                    <input type="date" v-model="checkout"  :min="checkin ? checkin : minDate" placeholder="Thời gian kết thúc" required />
                </div>
            </div>

            <div class="order--room--free">
                <div class="empty--room">
                    <h4 class="text-primary">Danh sách phòng trống</h4>
            <table class="table  table-borderless bg-white shadow">
              <thead >
                <tr class="table-info">
                  <th>Số phòng</th> 
                  <th>Loại phòng</th>
                  <th>Người lớn</th>
                  <th>Trẻ em</th>
                  <th>Thêm</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="rooms.length === 0">
                  <td colspan="3" class="text-center text-danger">Vui lòng chọn ngày</td>
                </tr>
              </tbody>
              <tbody>
                <tr v-for="room in rooms" :key="room.id">
                  <td>{{ room.roomNumber }}</td>
                  <td>{{ room.type }}</td>
                  <td>{{ room.adults }}</td>
                  <td>{{ room.children }}</td>
                  <td>
                    <button class="btn btn-success rounded" @click.prevent="addRoom(room)"><i class="fa-solid fa-plus"></i></button>
                  </td>
                </tr>
              </tbody>
            </table>

            </div>

            <div class="selected--room">
                <h4 class="text-primary">Phòng đã chọn</h4>
            <table class="table able-borderless bg-white shadow">
                <thead>
                    <tr class="table-info">
                        <th scope="col">Số phòng</th>
                        <th scope="col">Số người</th>
                        <th scope="col">Ngày bắt đầu</th>
                        <th scope="col">Ngày kết thúc</th>
                        <th scope="col">Xóa</th>
                    </tr>
                </thead>
                <tbody>
                <tr v-if="selectedRooms.length === 0">
                  <td colspan="5" class="text-center text-danger">Chưa chọn phòng nào</td>
                </tr>
              </tbody>
                
              <tbody>
                <tr v-for="(selectedRoom, index) in selectedRooms" :key="index">
                  <td>{{ selectedRoom.roomNumber }}</td>
                  <td>
                    <input type="number" id=""  class="num-people-input" v-model="selectedRoom.numPeople" min="1" />
                  </td>
                  <td>{{ selectedRoom.checkin }}</td>
                  <td>{{ selectedRoom.checkout }}</td>
                  <td>
                    <button class="btn btn-danger rounded" @click.prevent="removeRoom(index)"><i class="fa-solid fa-xmark"></i></button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

            </div>


            </div>
            
            
        <div class="order--footer pt-3">
            <div class="d-grid gap-2 d-md-flex justify-content-center">
                <button type="submit" class="btn btn-success">Tạo phòng</button>
                <button type="button" class="btn btn-danger" @click="resetForm"><router-link to="/bookings" class="text-decoration-none text-white">Thoát</router-link></button>
            </div>  
        </div>
      </form>
    </div>

     <!-- Success Message -->
     <div v-if="showSuccessMessage" class="booking-message">
        <div class="booking--success shadow">
              <div class="icon--check">
                <i class="fa-solid fa-check fs-2"></i>
              </div>
              <p class="fs-3 fw-bold mt-2">Tạo phòng thành công</p>
              <p class="m-2">Mọi thứ đều hoạt động bình thường.</p>
              <!-- <div class="success--input">
                <button  @click="$router.push('/')" class="btn border border-success text-success m-2">Tiếp tục</button>
              </div> -->
          </div>
      </div>
  </template>

<script>
import api from '../api';
import { computed, onMounted } from 'vue';
import { useUserStore } from '../stores/userStore.js'; // Pinia store

export default {
  data() {
    return {
      showSuccessMessage: null,
      successMessage: '',
      rooms: [],
      selectedRooms: [],
      checkin: '',
      checkout: '',
      customerName: '',
      email:'',
      cccd: '',
      phone: '',
      address: '',
      gioitinh: '',
      minDate: new Date().toISOString().split('T')[0], // Lấy ngày hiện tại
    };
  },

  setup() {
    const userStore = useUserStore();

    // Restore user session when the component is mounted
    onMounted(() => {
      userStore.restoreUser();
    });

    // Computed properties
    const isLoggedIn = computed(() => userStore.isLoggedIn);
    const user = computed(() => userStore.user);

    // Methods
    const logout = () => {
      userStore.clearUser();
    };

    // Return the properties and methods to the template
    return {
      isLoggedIn,
      user,
      logout
    };
  },
  async mounted() {
    await this.getRoomAvailable();
  },
  methods: {
    async getRoomAvailable() {
  console.log('Check-in date:', this.checkin);
  console.log('Check-out date:', this.checkout);
  
  if (this.checkin && this.checkout) {
    try {
      const response = await api.get('/bookings/order', {
        params: {
          checkin: this.checkin,
          checkout: this.checkout
        }
      });
      this.rooms = response.data;
    } catch (error) {
      console.log('Failed to load room details:', error);
      alert('Lỗi khi tải thông tin phòng. Vui lòng thử lại sau.');
    }
  }
},
    addRoom(room) {
      const exists = this.selectedRooms.find(selectedRoom => selectedRoom.roomNumber === room.roomNumber);
      if (!exists) {
        this.selectedRooms.push({
          id: room._id,
          roomNumber: room.roomNumber,
          type: room.type,
          checkin: this.checkin,
          checkout: this.checkout,
          numPeople: 1,
        });
      } else {
        alert('Phòng đã được chọn!');
      }
    },
    removeRoom(index) {
      this.selectedRooms.splice(index, 1);
    },
          async createBooking() {
            const roomsToBook = this.selectedRooms.map(selectedRoom => ({
              id: selectedRoom.id,
              checkin: selectedRoom.checkin,
              checkout: selectedRoom.checkout,
            }));
            // console.log()

            const bookingData = {
              staff: this.user.id,
              email: this.email,
              customerName: this.customerName,
              cccd: this.cccd,
              phone: this.phone,
              address: this.address,
              gioitinh: this.gioitinh,
              rooms: roomsToBook,
            };

            try {
              const response = await api.post('/bookings/order', bookingData);
              console.log('Bookings created:', response.data);
              // Thông báo thành công cho người dùng
              // this.successMessage = 'Tạo phòng thành công!';
              this.showSuccessMessage = true;
              setTimeout(() => this.showSuccessMessage = false, 3000);
              this.resetForm();
            } catch (error) {
              console.log('Error creating bookings:', error.response.data);
              // Thông báo lỗi cho người dùng
            }
      },


    resetForm() {
      // Reset tất cả dữ liệu về giá trị ban đầu
      this.selectedRooms = [];
      this.customerName = '';
      this.cccd = '';
      this.phone = '';
      this.address = '';
      this.gender = '';
      this.checkin = '';
      this.checkout = '';
    },
  },
  watch: {
    checkin() {
        this.getRoomAvailable();
    },
    checkout() {
        this.getRoomAvailable();
    },
},

};
</script>

<style>
.order--room {
    background: #fff;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* Thêm bóng đổ để tạo chiều sâu */
    max-width: 1200px; /* Giới hạn chiều rộng của khung */
    margin: 2rem auto; /* Căn giữa khung */
}

.order--main {
    text-align: center;
    margin-bottom: 2rem; /* Tạo khoảng cách dưới tiêu đề */
}

h1 {
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
    color: #333;
}

.order--body {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 2rem; /* Tạo khoảng cách giữa hai cột */
}

.col-6 {
    flex: 1;
    background: #f9f9f9;
    padding: 1.5rem;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); /* Thêm bóng đổ nhẹ cho từng phần */
}
/* Thông tin khách hàng nhỏ hơn */
.col-6:first-child {
    flex: 0.6; /* Chiếm 60% của toàn bộ chiều rộng */
}

/* Thông tin phòng lớn hơn */
.col-6:last-child {
    flex: 1.4; /* Chiếm 140% của toàn bộ chiều rộng */
}


h2 {
    font-size: 1.75rem;
    color: #555;
    margin-bottom: 1rem;
}

/* Style cho form */
form {
    margin-top: 1rem;
}

.form-group {
    display: flex;
    align-items: center;
    background-color: #fff;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    border: 1px solid #ddd;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    margin-bottom: 1.5rem;
}

.form-group i {
    font-size: 1.25rem;
    color: #555;
    margin-right: 0.75rem;
}

.form-group input {
    border: none;
    outline: none;
    font-size: 1rem;
    width: 100%;
    padding: 0.5rem;
    color: #333;
}

.form-group-date {
    margin-bottom: 1.5rem;
}

.form-group-date label {
    display: block;
    font-size: 1rem;
    color: #333;
    margin-bottom: 0.5rem;
}
/* Cấu trúc flex cho biểu tượng và trường nhập */
.input-wrapper {
    display: flex;
    align-items: center;
    background-color: #fff;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    border: 1px solid #ddd;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.input-wrapper i {
    font-size: 1.25rem;
    color: #555;
    margin-right: 0.75rem;
}

.input-wrapper input[type="date"] {
    border: none;
    outline: none;
    font-size: 1rem;
    width: 100%;
    padding: 0.5rem;
    color: #333;
}
.order--room--free{
    display: flex;
    justify-content: space-between;
    gap: 1rem;


}
.empty--room table {
    max-height: 300px; /* Set the maximum height for the table */
    overflow-y: auto;  /* Enable vertical scrolling */
    display: block;    /* This is important for overflow to work on the table */
    width: 100%;       /* Ensure the table takes the full width */
}
.selected--room table {
    max-height: 300px; /* Set the maximum height for the table */
    overflow-y: auto;  /* Enable vertical scrolling */
    display: block;    /* This is important for overflow to work on the table */
    width: 100%;       /* Ensure the table takes the full width */
}
.num-people-input {
    width: 80px; /* Adjust width as needed */
    padding: 0.5rem; /* Adjust padding if needed */
    box-sizing: border-box; /* Ensure padding and border are included in width */
}

.booking-message {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000; /* Đảm bảo nằm trên các phần tử khác */
    width: 90%; /* Đáp ứng tốt trên thiết bị di động */
    max-width: 400px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    border-radius: 15px;
    background-color: #fff;
    overflow: hidden;
}
.booking--success {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    font-size: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center; /* Căn giữa icon và text theo chiều ngang */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.icon--check {
    background-color: rgb(29, 183, 15);
    color: white;
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-size: 2rem;
    margin-bottom: 1rem;
}

.checkmark {
    font-size: 20px;
    margin-right: 10px;
}




/* Thiết kế responsive cho màn hình nhỏ */
@media (max-width: 768px) {
    .order--body {
        flex-direction: column;
        gap: 1.5rem; /* Tăng khoảng cách giữa các phần khi cột bị xếp chồng */
    }
    .col-6 {
      width: 100%;
    }

    h1 {
        font-size: 2rem;
    }

    h2 {
        font-size: 1.5rem;
    }
}

</style>

