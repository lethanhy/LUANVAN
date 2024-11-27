<template>
  <div class="container order--room">

    <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                <!-- Thay <a> bằng <router-link> -->
                <li class="breadcrumb-item">
                    <router-link to="/"  class="text-decoration-none">Trang chủ</router-link>
                </li>
                <li class="breadcrumb-item">
                    <router-link to="/rooms"  class="text-decoration-none">Phòng</router-link>
                </li>
                <li class="breadcrumb-item" aria-current="page">Đặt phòng</li>
            </ol>
        </nav>
    
    <div class="row">
      <form class="d-flex flex-wrap">
        <!-- Information Section -->
        <div class="col-lg-8 bg-white p-4 shadow rounded-3 mb-4">
          <h2 class="mb-4 text-info">Thông tin phòng</h2>
          <div v-if="rooms" class="d-flex align-items-start mb-4 border border-secondary rounded-3 p-3">
            <div class="col-lg-3 col-sm-4">
              <img
                :src="`http://localhost:3000/uploads/${rooms.image}`"
                alt="Room Image"
                class="img-fluid border rounded-3 shadow-sm"
                style="height: 150px; width: 200px;"
              />
            </div>
            <div class="col-lg-9 ms-3 text-start">
              <p class="mb-2 fw-bold fs-5">{{ rooms.roomName }}</p>
              <!-- <p class="mb-1 fw-bold fs-5">Phòng {{ rooms.roomNumber }}</p> -->
              <p class="mb-2 text-muted"><i class="fas fa-users"></i> {{ rooms.adults }} khách</p>
              <p class="mb-1 text-success">{{ formatCurrency(rooms.price) }} VND/Đêm</p>
              <div class="room-features d-flex justify-content-start flex-wrap pt-3">
                <div class="me-4 mb-2"><i class="fa-solid fa-bed me-1"></i> King Size Bed</div>
                <div class="me-4 mb-2"><i class="fa-solid fa-water me-1"></i> Ocean View</div>
                <div class="me-4 mb-2"><i class="fa-solid fa-ruler-combined me-1"></i> 50m²</div>
                <div class="me-4 mb-2"><i class="fa-solid fa-utensils me-1"></i> Free Breakfast</div>
              </div>
            </div>
          </div>

          <h2 class="mt-4 text-info">Thông tin cá nhân</h2>
          <div class="text-start mt-3">
            <div class="row g-3">
              <div class="col-md-6">
                <label for="name" class="form-label">Tên</label>
                <input type="text" class="form-control rounded-3" id="name" v-model="user.name" required>
              </div>
              <div class="col-md-6">
                <label for="address" class="form-label">Địa chỉ</label>
                <input type="text" class="form-control rounded-3" id="address" v-model="user.address" required>
              </div>
            </div>
            <div class="row g-3 mt-3">
              <div class="col-md-6">
                <label for="phone" class="form-label">Số điện thoại</label>
                <input type="tel" class="form-control rounded-3" id="phone" v-model="user.phone" required>
              </div>
              <div class="col-md-6">
                  <label for="message" class="form-label">Thông tin</label>
                  <textarea class="form-control" id="message" v-model="user.message" rows="3"></textarea>
              </div>
              
            </div>

            <!-- <div class="row g-3 mt-3">
              <div class="mb-3">
                  
              </div>
            </div> -->
            <!-- <div class="row g-3 mt-3">
              <div class="col-md-6">
                <label for="cccd" class="form-label">Căn cước công dân</label>
                <input type="text" class="form-control rounded-3" id="cccd" v-model="user.cccd" required>
              </div>
              <div class="col-md-6">
                <label for="gender" class="form-label">Giới tính</label>
                <select class="form-select" v-model="user.gioitinh" id="gender" required>
                  <option disabled value="">Chọn giới tính</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>
            </div> -->

          </div>
        </div>

        <!-- Payment Section -->
        <div class="col-lg-4 bg-light border border-secondary rounded-3 p-4 shadow-sm">
          <h2 class="text-info">Thanh toán</h2>

          <!-- Date Summary Section -->
          <div class="date d-flex justify-content-around border border-secondary rounded-3 p-3 mb-3 shadow-sm bg-white">
            <div>
              <p class="text-start fw-bold">Thời gian nhận phòng</p>
              <p class="fs-6">{{ checkin }}</p>
            </div>
            <div>
              <p class="text-start fw-bold">Thời gian trả phòng</p>
              <p class="fs-6">{{ checkout }}</p>
            </div>
          </div>

          <!-- Price Summary Section -->
          <div class="text-start mt-2">
            <h3 class="mb-3">Tóm tắt giá của bạn</h3>
            <div class="d-flex justify-content-between my-2">
              <p>Phòng và các dịch vụ khác:</p>
              <p class="fw-bold text-success"></p>
            </div>
            <div class="d-flex justify-content-between my-2">
              <p class="fs-5">Thời gian:</p>
              <p class="fw-bold">{{ calculateDays() }} ngày</p>
            </div>
            <div class="d-flex justify-content-between my-2">
              <p>0% VAT:</p>
              <p>0 VND</p>
            </div>
            <div class="d-flex justify-content-between fw-bold my-3" v-if="rooms">
              <p class="fs-5">Tổng tiền:</p>
              <p class="text-danger">{{ formatCurrency(rooms.price * calculateDays()) }}</p>
            </div>

            <!-- Payment Button -->
            <!-- <button class="btn btn-success w-100 rounded-3" @click.prevent="createBooking" >Thanh toán</button> -->
            <button class="btn btn-primary w-100 rounded-3 mb-2" @click.prevent="payCheckin">
              Thanh toán khi nhận phòng
            </button>
            <button class="btn btn-success w-100 rounded-3" @click.prevent="handlePayment">
              Thanh toán ngân hàng
            </button>
          </div>

        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../api';
import { useUserStore } from '../stores/userStore';


export default {
  name: 'OrderRoom',

  setup() {
    const userStore = useUserStore();
    const route = useRoute();
    const router = useRouter(); // Initialize useRouter
    const user = ref({ ...userStore.user }); // Tạo một đối tượng user có thể chỉnh sửa

    const rooms = ref(null);
    const checkin = ref('');
    const checkout = ref('');

    // Khôi phục user và lấy thông tin phòng khi component mount
    onMounted(() => {
      userStore.restoreUser();
      getRoom();
      formatDates();
    });

    const formatDates = () => {
      const checkinQuery = route.query.checkin;
      const checkoutQuery = route.query.checkout;

      if (checkinQuery && checkoutQuery) {
        checkin.value = new Date(checkinQuery).toLocaleDateString('vi-VN');
        checkout.value = new Date(checkoutQuery).toLocaleDateString('vi-VN');
      } else {
        console.error('Check-in hoặc Check-out không hợp lệ.');
      }
    };

    const calculateDays = () => {
      const checkinDate = new Date(route.query.checkin);
      const checkoutDate = new Date(route.query.checkout);

      if (isNaN(checkinDate) || isNaN(checkoutDate)) {
        console.error('Ngày không hợp lệ:', checkin.value, checkout.value);
        return 0;
      }

      const timeDiff = checkoutDate - checkinDate;
      const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      return days > 0 ? days : 0;
    };

    const formatCurrency = (amount) => `${amount.toLocaleString('vi-VN')} VND`;

    const getRoom = async () => {
      try {
        const roomId = route.params.id;
        const response = await api.get(`/rooms/user/${roomId}`);
        rooms.value = response.data;
      } catch (error) {
        console.error('Failed to fetch room:', error);
      }
    };

    const handlePayment = async () => {
  try {
    const bookingId = await createBooking(); // Tạo booking và lấy ID
    console.log('Booking ID:', bookingId); // Kiểm tra giá trị bookingId
    if (bookingId) {
      await createPayment(bookingId); // Thanh toán với booking ID
    }
  } catch (error) {
    console.error('Có lỗi xảy ra:', error);
    alert('Thanh toán thất bại. Vui lòng thử lại!');
  }
};



const createBooking = async () => {
  if (!checkin.value || !checkout.value || !userStore.user.id || !rooms.value?._id) {
    alert('Vui lòng điền đầy đủ thông tin!');
    return;
  }

  const bookingData = {
    checkin: new Date(route.query.checkin).toISOString(),
    checkout: new Date(route.query.checkout).toISOString(),
    room: rooms.value._id,
    customer: userStore.user.id,
    infomation: {
        name: user.value.name, // Sử dụng thông tin từ user có thể chỉnh sửa
        address: user.value.address,
        phone: user.value.phone,
        message: user.value.message,
      }
  };

  try {
    const response = await api.post('/bookings/order/user', bookingData);
    console.log('API response:', response.data); // Thêm dòng này để xem phản hồi
    const bookingId = response.data.bookingId; // Lấy ID booking từ phản hồi
    alert('Đặt phòng thành công!');
    return bookingId; // Trả về bookingId để dùng trong thanh toán
  } catch (error) {
    console.error('Lỗi khi tạo booking:', error);
    alert('Có lỗi xảy ra khi đặt phòng. Vui lòng thử lại.');
    throw error; // Ném lỗi để xử lý ngoài hàm nếu cần
  }
};


const createPayment = async (bookingId) => {
  try {
    const TotalPrice = rooms.value.price * calculateDays(); // Tính tổng tiền
    console.log('Total Price:', TotalPrice); // Kiểm tra tổng tiền
    console.log('Booking ID:', bookingId); // Kiểm tra booking ID

    const response = await api.post('/payment/vnpay/create_payment_url', {
      BookingID: bookingId, // Sử dụng bookingId cho thanh toán
      TotalPrice,
    });

    console.log('Payment API response:', response.data); // Thêm dòng này để xem phản hồi
    const paymentUrl = response.data?.data?.url;
    if (paymentUrl) {
      window.location.href = paymentUrl; // Redirect đến URL thanh toán
    } else {
      console.error('Payment URL not found in the response:', response.data);
      alert('Không tìm thấy URL thanh toán. Vui lòng thử lại.');
    }
  } catch (error) {
    console.error('Error during VNPay payment creation:', error);
    alert(`Có lỗi xảy ra: ${error.response?.data?.msg || 'Yêu cầu không hợp lệ'}`);
  }
};

const payCheckin = async () => {
 
  if (!checkin.value || !checkout.value || !userStore.user.id || !rooms.value?._id) {
    alert('Vui lòng điền đầy đủ thông tin!');
    return;
  }

  const bookingData = {
    checkin: new Date(route.query.checkin).toISOString(),
    checkout: new Date(route.query.checkout).toISOString(),
    room: rooms.value._id,
    customer: userStore.user.id,
    infomation: {
        name: user.value.name, // Sử dụng thông tin từ user có thể chỉnh sửa
        address: user.value.address,
        phone: user.value.phone,
        message: user.value.message,
      }
  };

  try {
    const response = await api.post('/bookings/order/user/checkin', bookingData);
    console.log('API response:', response.data); // Thêm dòng này để xem phản hồi
    const bookingId = response.data.bookingId; // Lấy ID booking từ phản hồi
    alert('Đặt phòng thành công!');
    router.push('/');

   
  } catch (error) {
    console.error('Lỗi khi tạo booking:', error);
    alert('Có lỗi xảy ra khi đặt phòng. Vui lòng thử lại.');
    throw error; // Ném lỗi để xử lý ngoài hàm nếu cần
  }
}









   


    return {
      user,
      rooms,
      checkin,
      checkout,
      formatCurrency,
      calculateDays,
      createBooking,
      createPayment,
      handlePayment,
      payCheckin
      
    };
  },
};
</script>



<style scoped>
.order--room {
  margin-top: 1rem;
}

.order--room h2 {
  font-size: 1.5rem;
  font-weight: 600;
}

.room-features {
  gap: 1rem;
}

@media (max-width: 576px) {
  form .d-flex {
    flex-direction: column;
  }
  .order--room .col-lg-3, .order--room .col-lg-9 {
    width: 100%;
    margin-bottom: 1rem;
  }
  .room-features {
    justify-content: center;
  }
}
</style>
