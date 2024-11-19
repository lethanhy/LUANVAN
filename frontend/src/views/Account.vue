<template>
  <div class="container account">
    <div class="account--body row">
      <!-- Profile Picture Section -->
      <div class="account--img col-lg-5" v-if="customers">
        <h4 class="p-2 bg-light text-center full-width fw-bold rounded-2 text-primary">Ảnh đại diện</h4>
        <div class="text-center mt-3">
          <img :src="`http://localhost:3000${customers.image}`" alt="Profile" class="profile-img" />
          <input type="file" @change="handleImageUpload" class="form-control-file mt-3" />
          <button class="btn btn-primary mt-3" @click="updateProfileImage">Update New Image</button>
        </div>
      </div>

      <!-- Account Details Section -->
      <div class="account--info col-lg-7">
        <h4 class="p-2 bg-light text-center full-width fw-bold rounded-2 text-primary">Thông tin tài khoản</h4>
        <div class="info-container" v-if="customers">
          <!-- User Name & Email -->
          <div class="row g-3 align-items-center mt-3">
            <div class="col-4 text-end">
              <label for="name" class="form-label">Tên người dùng:</label>
            </div>
            <div class="col-8">
              <input type="text" id="name" class="form-control" v-model="customers.name" aria-label="First name">
            </div>
          </div>

          <!-- Email -->
          <div class="row g-3 align-items-center mt-3">
            <div class="col-4 text-end">
              <label for="email" class="form-label">Email:</label>
            </div>
            <div class="col-8">
              <input type="email" id="email" class="form-control" v-model="customers.email" aria-label="Email">
            </div>
          </div>

          <!-- Phone Number -->
          <div class="row g-3 align-items-center mt-3">
            <div class="col-4 text-end">
              <label for="phone" class="form-label">Số điện thoại:</label>
            </div>
            <div class="col-8">
              <input type="text" id="phone" class="form-control" v-model="customers.phone" aria-label="Phone">
            </div>
          </div>

          <!-- Address -->
          <div class="row g-3 align-items-center mt-3">
            <div class="col-4 text-end">
              <label for="address" class="form-label">Địa chỉ:</label>
            </div>
            <div class="col-8">
              <input type="text" id="address" class="form-control" v-model="customers.address" aria-label="Address">
            </div>
          </div>

          <!-- Gender -->
          <div class="row g-3 align-items-center mt-3">
            <div class="col-4 text-end">
              <label for="gender" class="form-label">Giới tính:</label>
            </div>
            <div class="col-8">
              <input type="text" id="gender" class="form-control" v-model="customers.gioitinh" placeholder="Nam/Nữ">
            </div>
          </div>

          <!-- Cccd -->
          <div class="row g-3 align-items-center mt-3">
            <div class="col-4 text-end">
              <label for="nationality" class="form-label">Căn cước công dân:</label>
            </div>
            <div class="col-8">
              <input type="text" id="cccd" class="form-control" v-model="customers.cccd" placeholder="Việt Nam">
            </div>
          </div>

          <!-- Save Changes Button -->
          <div class="text-center">
            <button class="btn btn-primary mt-4 me-2" @click="saveChanges">Cập nhật</button>
            <button @click="showModal = true" class="btn btn-primary mt-4">Đổi mật khẩu</button>
          </div>
        </div>
      </div>
    </div>
  </div>

        <!-- Add Room Modal -->
        <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
            <div class="modal-content" role="dialog" aria-labelledby="modal-title" aria-modal="true">
              <h2 id="modal-title" class="modal-title text-center text-info fw-bold ">Đổi mật khẩu</h2>
              <form @submit.prevent="handleChangePassword">
                <div class="mb-3 text-start">
                  <label for="oldPassword" class="form-label">Mật khẩu cũ</label>
                  <input type="password" v-model="oldPassword" class="form-control" id="oldPassword" required>
                </div>
                <div class="mb-3 text-start">
                  <label for="newPassword" class="form-label">Mật khẩu mới</label>
                  <input type="password" v-model="newPassword" class="form-control" id="newPassword">
                </div>
                <button class="btn btn-primary ms-2">Đổi mật khẩu</button>
                <button type="button" class="btn btn-secondary ms-2" @click="showModal = false">Hủy</button>
              </form>
              <p v-if="message">{{ message }}</p>
            </div>
        </div>


</template>

<script>
import api from '../api';
export default {
  data() {
    return {
      showModal: false,
      customers: null,
      newProfileImage: null,
      oldPassword: '',
      newPassword: '',
      message: ''
    };
  },
  methods: {
    async getCustomer() {
      try {
        const customerId = this.$route.params.id;
        const response = await api.get(`/customers/${customerId}`);
        this.customers = response.data;
      } catch (error) {
        console.log('Failed to fetch customer:', error);
      }
    },
    handleImageUpload(event) {
      this.newProfileImage = event.target.files[0];
    },
    async updateProfileImage() {
      if (!this.newProfileImage) {
        alert('Please select an image first!');
        return;
      }
      try {
        const formData = new FormData();
        formData.append('image', this.newProfileImage);
        const response = await api.put(`/customers/${this.customers._id}/upload-image`, formData);
        this.customers.image = response.data.imageUrl;
      } catch (error) {
        console.log('Failed to update image:', error);
      }
    },
    async saveChanges() {
      try {
        await api.put(`/customers/${this.customers._id}`, this.customers);
        alert('Customer details updated successfully');
      } catch (error) {
        console.log('Failed to save changes:', error);
        alert('Failed to update customer details');
      }
    },

    async handleChangePassword() {
    if (!this.oldPassword || !this.newPassword) {
      this.message = 'Cả hai mật khẩu cũ và mới đều phải được điền.';
      return;
    }
    
    try {
      const customerId = this.$route.params.id;
      const response = await api.post('/customers/changePassword', {
        customerId,
        oldPassword: this.oldPassword,
        newPassword: this.newPassword
      });
      this.message = 'Đổi mật khẩu thành công!';
      this.showModal = false;  // Close modal after successful password change
    } catch (error) {
      this.message = error.response?.data || 'Có lỗi xảy ra.';
    }
  },
      closeModal() {
      this.showModal = false;
      this.oldPassword = '';
      this.newPassword = '';
    },


    
  },
  mounted() {
    this.getCustomer();
  },
};
</script>

<style>
.account {
  margin-top: 1rem;
  margin-bottom: 2rem;
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.account--body {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.account--img {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-right: 2px solid #f0f0f0;
  padding: 1rem;
}

.profile-img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 2px solid #ddd;
}

.account--info {
  padding: 1rem;
}

.info-container {
  margin-top: 1rem;
}

/* Input Styling */
.form-control {
  border: 1px solid #ced4da; /* Viền nhạt hơn */
  border-radius: 6px; /* Bo tròn viền */
  transition: border-color 0.3s ease-in-out; /* Hiệu ứng chuyển màu viền */
}
.form-control:focus {
  border-color: #007bff; /* Màu viền khi focus */
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.3); /* Hiệu ứng khi focus */
}

/* Button Styling */
.btn-primary {
  background-color: #007bff;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  transition: background-color 0.3s ease;
}


.btn-primary:hover {
  background-color: #0056b3; /* Màu khi hover */
}
/* Heading */
.text-primary {
  color: #007bff;
}
.h4-title {
  font-weight: bold;
  color: #212529; /* Màu chữ đậm hơn */
  border-bottom: 2px solid #007bff; /* Đường viền dưới tiêu đề */
  padding-bottom: 5px;
}

.row.g-3 > .col {
  padding-left: 0;
  padding-right: 0;
}

.text-end {
  text-align: right;
}

.mt-3 {
  margin-top: 1rem !important;
}

.mt-4 {
  margin-top: 1.5rem !important;
}

.fw-bold {
  font-weight: 700;
}

.rounded-2 {
  border-radius: 8px;
}
  /* Full-width background for h4 */
  .full-width {
    width: 100%;
    margin: 0;
  }
</style>
