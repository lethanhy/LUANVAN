<template>


  <div class="container order--room ">
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><router-link to="/">Home</router-link></li>
        <li class="breadcrumb-item active" aria-current="page"><router-link to="/rooms">Order</router-link></li>
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
                src="../assets/9+ Bold Wall Painting Ideas for a Dramatic Bedroom Look • 333k+ Inspiring Lifestyle Ideas.jpg"
                alt="Room Image"
                class="img-fluid border rounded-3 shadow-sm"
                style="height: 150px; width: 200px;"
              />
            </div>
            <div class="col-lg-9 ms-3 text-start">
              <p class="mb-1 fw-bold fs-5">Phòng {{rooms.roomNumber}}</p>
              <p class="mb-1 text-muted"><i class="fas fa-user"></i> {{ rooms.maxGuests }} khách</p>
              <p class="mb-1 text-success">{{ rooms.price }} VND/Đêm</p>
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
                <input type="text" class="form-control rounded-3" id="name" v-model="user.name">
              </div>
              <div class="col-md-6">
                <label for="address" class="form-label">Địa chỉ</label>
                <input type="text" class="form-control rounded-3" id="address" v-model="user.address">
              </div>
            </div>
            <div class="row g-3 mt-3">
              <div class="col-md-6">
                <label for="email" class="form-label">Email</label>
                <input type="email" class="form-control rounded-3" id="email"v-model="user.email">
              </div>
              <div class="col-md-6">
                <label for="phone" class="form-label">Số điện thoại</label>
                <input type="tel" class="form-control rounded-3" id="phone" v-model="user.phone">
              </div>
            </div>
            <div class="row g-3 mt-3">
              <div class="col-md-6">
                <label for="cccd" class="form-label">Căn cước công dân</label>
                <input type="text" class="form-control rounded-3" id="cccd" v-model="user.cccd">
              </div>
              <div class="col-md-6">
                <label for="phone" class="form-label">Giới tính</label>
                <select class="form-select" v-model="user.gioitinh" aria-label="Default select example">
                    <option selected>Giới tính</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                </select>
              </div>
            </div>

            <!-- Special Requests -->
            <!-- <div class="mt-4">
              <label for="specialRequests" class="form-label">Yêu cầu đặc biệt</label>
              <textarea class="form-control rounded-3" id="specialRequests" rows="3" placeholder="Nhập yêu cầu của bạn..."></textarea>
            </div> -->
          </div>
        </div>

        <!-- Payment Section -->
        <div class="col-lg-4 bg-light border border-secondary rounded-3 p-4 shadow-sm">
          <h2 class="text-info">Thanh toán</h2>

          <!-- Date Summary Section -->
          <div class="date d-flex justify-content-around border border-secondary rounded-3 p-3 mb-3 shadow-sm bg-white">
            <div>
              <p class="text-start fw-bold">Check-in</p>
              <p class="fs-6">Sun, 22 May 2022</p>
            </div>
            <div>
              <p class="text-start fw-bold">Check-out</p>
              <p class="fs-6">Wed, 25 May 2022</p>
            </div>
          </div>

          <!-- Price Summary Section -->
          <div class="text-start mt-2">
            <h3 class="mb-3">Tóm tắt giá của bạn</h3>
            <div class="d-flex justify-content-between my-2">
              <p>Phòng và các dịch vụ khác:</p>
              <p class="fw-bold text-success">500.000 VND</p>
            </div>
            <div class="d-flex justify-content-between my-2">
              <p>Thời gian:</p>
              <p class="fw-bold">4 Ngày</p>
            </div>
           
            <div class="d-flex justify-content-between my-2">
              <p>0% VAT:</p>
              <p>0 VND</p>
            </div>
            <div class="d-flex justify-content-between fw-bold my-3">
              <p>Tổng tiền:</p>
              <p class="text-danger">2.000.000 VND</p>
            </div>

            <!-- Payment Button -->
            <button class="btn btn-success w-100 rounded-3">Thanh toán</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import api from '../api';
import { useUserStore } from '../stores/userStore';

export default {
  name: 'OrderRoom',

  setup() {
    // Use the store
    const userStore = useUserStore();

    // Reactive properties
    const rooms = ref(null);

    // Restore user state on mounted
    onMounted(() => {
      userStore.restoreUser();
      getRoom(); // Fetch the room details on component mount
    });

    // Computed properties
    const isLoggedIn = computed(() => userStore.isLoggedIn);
    const user = computed(() => userStore.user);

    // Methods
    const getRoom = async () => {
      try {
        const roomId = window.location.pathname.split('/').pop(); // Extract room ID from the URL
        const response = await api.get(`/rooms/user/${roomId}`);
        rooms.value = response.data;
      } catch (error) {
        console.log('Failed to fetch room:', error);
      }
    };

    const logout = () => {
      userStore.clearUser();
    };

    // Return the properties and methods to the template
    return {
      rooms,
      isLoggedIn,
      user,
      getRoom,
      logout,
    };
  },
};
</script>



<style scoped>
.order--room {
  margin-top: 7rem;
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
