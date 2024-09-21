<template>
    <div class="order--room">
        <div class="order--main">
            <h1 class="text-center text-primary fw-bold">Đặt phòng</h1>
            <form action="">
                    <div class="order--body d-flex">
                        <div class="col-6">
                            <h2 class="text-primary fw-bold">Thông tin khách hàng</h2>
                                <div class="form-group">
                                    <i class="fas fa-user"></i>
                                    <input type="text" v-model="customerName" placeholder="Nhập thông tin khách hàng">
                                </div>
                                <div class="form-group">
                                    <i class="fa-regular fa-id-card"></i>
                                    <input type="text" v-model="cccd" placeholder="Nhập CCCD">
                                </div>
                                <div class="form-group">
                                    <i class="fa-solid fa-phone"></i>
                                    <input type="text" v-model="phone" placeholder="Nhập số điện thoại">
                                </div>
                                <div class="form-group">
                                    <i class="fa-solid fa-location-dot"></i>
                                    <input type="text" v-model="address" placeholder="Nhập địa chỉ">
                                </div>
                                <div class="form-group">
                                    <i class="fa-solid fa-venus-mars"></i>
                                    <select class="form-select" v-model="gioitinh" aria-label="Default select example">
                                        <option value="" selected>Nhập giới tính</option>
                                        <option value="1">Nam</option>
                                        <option value="2">Nữ</option>
                                        
                                    </select>
                                </div>
                        </div>
                        
                        <div class="col-6">
                            
                            <h2 class="text-primary fw-bold">Thông tin phòng</h2>
                            <div class="form-group-date">
                                <label for="start-date">Thời gian bắt đầu</label>
                                <div class="input-wrapper">
                                    <i class="fas fa-calendar-alt"></i>
                                    <input  type="date" v-model="checkin" id="start-date" placeholder="Thời gian bắt đầu">
                                </div>
                            </div>
                            <div class="form-group-date">
                                <label for="start-date">Thời gian kết thúc</label>
                                <div class="input-wrapper">
                                    <i class="fas fa-calendar-alt"></i>
                                    <input  type="date" v-model="checkout" id="start-date" placeholder="Thời gian bắt đầu">
                                </div>
                            </div>
                            <div class="order--room--free">
                                <div class="empty--room">
                                    <h4 class="pb-2 text-primary">Danh sách phòng trống</h4>
                                    <table class="table table-borderless bg-white shadow" >
                                        <thead>
                                            <tr class="table-info">
                                                <th scope="col">Số phòng</th>
                                                <th scope="col">Loại phòng</th>
                                                <th scope="col">Thêm</th>
                                            </tr>
                                        </thead>
                                        <tbody v-for="room in rooms" :key="room.id">
                                            <tr>
                                                <th scope="row">{{ room.roomNumber }}</th>
                                                <td>{{ room.type }}</td>
                                                <td>
                                                    <button class="btn btn-success rounded" @click="addCart(room)"><i class="fa-solid fa-plus"></i></button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>


                                </div>
                                <div class="selected--room">
                                    <h4 class="text-primary">Phòng đã chọn</h4>
                                    <table class="table table-borderless bg-white shadow">
                                        <thead>
                                            <tr class="table-info">
                                                <th scope="col">Số phòng</th>
                                                <th scope="col">Số người</th>
                                                <th scope="col">Ngày bắt đầu</th>
                                                <th scope="col">Ngày kết thúc</th>
                                                <th scope="col">Xóa</th>
                                            </tr>
                                        </thead>
                                        <tbody v-for="(cart, index) in carts" :key="index">
                                            <tr v-for="(rooms, index) in cart.rooms">
                                                <th scope="row">{{ rooms.roomId.roomNumber }}</th> <!-- Access room number -->
                                                <td>
                                                    <input type="number" id="num-people" class="num-people-input" placeholder="Nhập số người" min="1" />
                                                </td>

                                                <td>{{ new Date(rooms.checkin).toLocaleDateString() }}</td> <!-- Access checkin -->
                                                <td>{{ new Date(rooms.checkout).toLocaleDateString() }}</td> <!-- Access checkout -->
                                                <td>
                                                <button class="btn btn-danger rounded" @click="deleteCart(rooms.roomId._id)">
                                                    <i class="fa-solid fa-xmark"></i>
                                                </button>
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
                            <button class="btn btn-success me-md-2" type="button" @click="createBooking">Lưu</button>
                            <button class="btn btn-light" type="button">Hủy</button>
                        </div>
                    </div>
            </form>
        </div>
    </div>
</template>

<script>
import api from '../api';
import { useUserStore } from '../stores/userStore';

export default {
  data() {
    return {
      rooms:[],
      carts:[],
      selectedRooms: [], // Danh sách phòng đã chọn
      checkin:'',
      checkout:'',
      customerName:'',
      cccd:'',
      phone:'',
      address:'',
      gioitinh:'',

    };
  },
  async mounted() {
    // Gọi getRoomAvailable sau khi component được mount
    await this.getRoomAvailable();
    await this.getCart();
  },
  methods: {
    async getRoomAvailable() {
        try {
        
            const response = await api.get(`/bookings/order`); 
            this.rooms = response.data; // Store the response data in the `room` object
        } catch (error) {
            console.log('Failed to load room details:', error);
        }
    },
    async getCart() {
        try {
        
            const response = await api.get(`/bookings/order/cart`); 
            this.carts = response.data || []; // Store the response data in the `room` object
        } catch (error) {
            console.log('Failed to load room details:', error);
        }
    },
    


        async addCart(room) {
    try {
        const { checkin, checkout } = this;

        if (!checkin || !checkout) {
        alert('Vui lòng chọn thời gian check-in và check-out.');
        return;
        }

        // Create the cartData object
        const cartData = {
        roomId: room._id,
        checkin,
        checkout
        };

        // Send the request to the server to add the room to the cart
        const response = await api.post('/bookings/order/cart', cartData);
        console.log('Room added to cart successfully:', response.data);

        // Update the carts array with the new room
        this.carts.push({
        room: room,  // This stores the room object with its _id
        checkin,
        checkout
        });

        alert('Phòng đã được thêm vào giỏ hàng!');
    } catch (error) {
        console.error('Failed to add room to cart:', error);
        alert('Failed to add cart. ' + error.message);
    }
    },



   

    async deleteCart(roomId) {
        try {
            // Gửi yêu cầu đến API để xóa phòng khỏi giỏ hàng
            const response = await api.delete(`/bookings/order/${roomId}`);
            
            if (response.status === 200) {
                // Xóa phòng khỏi giỏ hàng trong frontend
                this.carts = this.carts.map(cart => {
                    return {
                        ...cart,
                        rooms: cart.rooms.filter(room => room.roomId._id !== roomId)
                    };
                }).filter(cart => cart.rooms.length > 0); // Loại bỏ giỏ hàng rỗng
                
                alert('Phòng đã được xóa khỏi giỏ hàng và trạng thái phòng đã được cập nhật thành công!');
            } else {
                alert('Không thể xóa phòng khỏi giỏ hàng. Mã trạng thái: ' + response.status);
            }
        } catch (error) {
            console.error('Lỗi khi xóa phòng khỏi giỏ hàng:', error.response ? error.response.data : error.message);
            alert('Lỗi khi xóa phòng khỏi giỏ hàng. ' + (error.response ? error.response.data.message : error.message));
        }
    },



    async createBooking() {
  try {
    // Log carts to debug
    console.log('Carts:', this.carts);

    const email = 'Nguyenthibesau@gmail.com';
    // Prepare the data to send to the backend
    const bookingData = {
      customerName: this.customerName,
      cccd: this.cccd,
      gioitinh: this.gioitinh,
      phone: this.phone,
      address: this.address,
      email: email,
      // Flatten the room data from the nested rooms array
      rooms: this.carts.flatMap(cart => 
        cart.rooms.map(room => ({
          roomId: room.roomId._id || room.roomId, // Adjust based on structure
          checkin: room.checkin,
          checkout: room.checkout
        }))
      )
    };

    // Log the data to check if it's correct before sending the request
    console.log('Booking data:', bookingData);

    // Send the request to the backend API to create the booking
    const response = await api.post('/bookings/order', bookingData);

    // Check if the booking was successfully created
    if (response && response.status === 201) {
      alert('Booking created successfully');
      // Optionally, redirect to a bookings page or clear form fields
      // Clear the carts
      this.carts = [];
      this.$router.push('/bookings/order');
    } else {
      alert('Failed to create booking. Status code: ' + response.status);
    }
  } catch (error) {
    console.log('Failed to create booking:', error.response ? error.response.data : error.message);
    alert('Error creating booking. ' + (error.response ? error.response.data.message : error.message));
  }
}


  }
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




/* Thiết kế responsive cho màn hình nhỏ */
@media (max-width: 768px) {
    .order--body {
        flex-direction: column;
        gap: 1.5rem; /* Tăng khoảng cách giữa các phần khi cột bị xếp chồng */
    }

    h1 {
        font-size: 2rem;
    }

    h2 {
        font-size: 1.5rem;
    }
}

</style>