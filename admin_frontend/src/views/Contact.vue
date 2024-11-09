<template>
    <div class="contact">
      <h2 class="mb-3 text-info">Liên hệ</h2>
      <div class="contact--body">
        <table class="table align-middle mb-0 bg-white text-center ">
          <thead class="bg-light  table-dark ">
            <tr>
              <th>Tên</th>
              <th>Địa chỉ</th>
              <th>Số điện thoại</th>
              <th>Tin nhắn</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody v-for="contact in contacts" :key="contact._id" class="text-center">
            <tr>
              <td>
                <div class="d-flex align-items-center">
                  <img
                    src="https://mdbootstrap.com/img/new/avatars/8.jpg"
                    alt=""
                    style="width: 45px; height: 45px"
                    class="rounded-circle"
                  />
                  <div class="ms-3">
                    <p class="fw-bold mb-1">{{ contact.ten }}</p>
                    <p class="text-muted mb-0">{{ contact.email }}</p>
                  </div>
                </div>
              </td>
              <td>
                <p class="fw-normal mb-1">{{ contact.diachi }}</p>
              </td>
              <td>
                <p class="fw-normal mb-1">{{ contact.sodienthoai }}</p>
              </td>
              <td>{{ contact.tinnhan }}</td>
              <td>
                <button @click="confirmDeletion(contact._id)" type="button" class="btn btn-danger">
                  Xóa
                </button>
              </td>
            </tr>
        </tbody>
        </table>
      </div>
    </div>

    
  </template>
  
  <script>
  import api from '../api';
  import { computed, onMounted } from 'vue';
  import { useUserStore } from '../stores/userStore.js';
  
  export default {
    data() {
      return {
        contacts: [],
        errorMessage: '',
      };
    },
    setup() {
      const userStore = useUserStore();
  
      onMounted(() => {
        userStore.restoreUser();
      });
  
      const isLoggedIn = computed(() => userStore.isLoggedIn);
      const user = computed(() => userStore.user);
  
      const logout = () => {
        userStore.clearUser();
      };
  
      return {
        isLoggedIn,
        user,
        logout,
      };
    },
    methods: {
      async getAllContact() {
        try {
          const response = await api.get('/contact');
          this.contacts = response.data;
        } catch (error) {
          this.errorMessage = 'Không thể tải danh sách liên hệ';
          console.log('Error fetching contacts:', error);
        }
      },
      async confirmDeletion(contactId) {
        if (confirm('Bạn có chắc chắn muốn xóa liên hệ này?')) {
          try {
            await api.delete(`/contact/${contactId}`);
            this.contacts = this.contacts.filter(contact => contact._id !== contactId);
            alert('Xóa liên hệ thành công');
          } catch (error) {
            console.log('Error deleting contact:', error);
          }
        }
      },
    },
    created() {
      this.getAllContact();
    },
  };
  </script>
  
  <style>
  .contact {
    background: #fff;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
 
  </style>
  