<template>
    <div class="container profile">
      <form>
        <div class="row d-flex" v-if="staff">
          <div class="col-lg-4 d-flex flex-column align-items-center border-end">
            <div class="img-container text-center m-3">
              <img src="../assets/logo.jpg" alt="Avatar" class="img--avata mb-3" />
              <h3 class="fw-bold fst-italic">{{ staff.name }}</h3>
              <p>{{ staff.role }}</p>
              <button class="btn btn-primary">Chỉnh sửa ảnh</button>
            </div>
          </div>
          <div class="col-lg-8">
              <h3 class="text-info fw-bold">Thông tin</h3>
              <div class="pt-3">
                <div class="mb-3">
                  <label class="form-label fw-bold">Tên nhân viên</label>
                  <input type="text" v-model="staff.name" class="form-control" />
                </div>
                <div class="mb-3">
                  <label class="form-label fw-bold ">Tên email</label>
                  <input type="email" v-model="staff.email" class="form-control"/>
                </div>
                <div class="mb-3">
                  <label class="form-label fw-bold">Địa chỉ</label>
                  <input type="text" v-model="staff.address" class="form-control" />
                </div>
                <div class="mb-3">
                  <label class="form-label fw-bold">Số điện thoại</label>
                  <input type="text" v-model="staff.phone" class="form-control" />
                </div>
              </div>
              <button class="btn btn-primary m-2" @click.prevent="update">Cập nhật</button>
              <button class="btn btn-primary m-2" @click.prevent="showModal = true" >Đổi mật khẩu</button>
              <button class="btn btn-primary"><router-link to="/" class="text-decoration-none text-white">Thoát</router-link></button>
          </div>
        </div>
      </form>
    </div>

          <!-- Add Room Modal -->
          <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
              <div class="modal-content" role="dialog" aria-labelledby="modal-title" aria-modal="true" @click.stop>
                  <h2 id="modal-title" class="modal-title text-center text-info fw-bold">Đổi mật khẩu</h2>
                  <form @submit.prevent="handleChangePassword">
                      <div class="mb-3">
                          <label for="oldPassword" class="form-label">Mật khẩu cũ</label>
                          <input type="password" v-model="oldPassword" class="form-control" id="oldPassword" required>
                      </div>
                      <div class="mb-3">
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
        staff: null,
        showModal: false,
        oldPassword:'',
        newPassword:'',
        message:'',
      };
    },
    async created() {
      try {
        const staffId = this.$route.params.id; // Lấy ID của nhân viên từ route
        const response = await api.get(`/staff/${staffId}`); // Gọi API với ID của nhân viên
        this.staff = response.data; // Lưu dữ liệu phản hồi vào đối tượng `staff`
        console.log('Staff ID:', staffId);
      } catch (error) {
        console.log('Failed to load staff details:', error);
      }
    },
    methods: {
        async update() {
      try {
        const staffId = this.$route.params.id; // Lấy ID của nhân viên từ route
        const response = await api.put(`/staff/${staffId}`, this.staff); // Gửi dữ liệu `staff` đã chỉnh sửa
        console.log('Updated staff:', response.data);
        alert('Thông tin nhân viên đã được cập nhật thành công!');
      } catch (error) {
        console.log('Failed to update staff:', error);
      }
    },
    editImage() {
      // Thêm logic chỉnh sửa ảnh ở đây
      alert('Chỉnh sửa ảnh đang được thực hiện...');
    },

    async handleChangePassword() {
          if (!this.oldPassword || !this.newPassword) {
            this.message = 'Cả hai mật khẩu cũ và mới đều phải được điền.';
            return;
          }
          
          try {
            const staffId = this.$route.params.id;
            const response = await api.post('/staff/changePassword', {
              staffId,
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
    }
  };
  </script>
  
  <style scoped>
  .profile {
    background: #fff;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }
  
  .img-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: ease-in-out;
  }
  
  .img--avata {
    width: 120px;
    border-radius: 50%;
  }
  
  .text-center {
    text-align: center;
  }
  
  </style>
  