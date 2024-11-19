<template>
    <div class="review">
      <h1 class="text-center mb-4 text-info fw-bold">Đánh Giá</h1>
      <div class="review--body">
        <div v-if="isLoading" class="text-center">
          <p>Đang tải đánh giá...</p>
        </div>
        <div v-if="errorMessage" class="alert alert-danger text-center">
          {{ errorMessage }}
        </div>
  
        <table
          v-if="!isLoading && reviews.length > 0"
          class="table table-striped table-hover text-center table-borderless"
        >
          <thead>
            <tr>
              <th scope="col">STT</th>
              <th scope="col">Ngày</th>
              <th scope="col">Khách hàng</th>
              <th scope="col">Địa chỉ</th>
              <th scope="col">Đánh giá</th>
              <th scope="col">Nội dung</th>
              <th scope="col">Trạng thái</th>
              <th scope="col">Phản hồi</th>
              <th scope="col">Xóa</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(review, index) in reviews" :key="review._id">
              <th scope="row">{{ index + 1 }}</th>
              <td>{{ formatDate(review.createdAt) }}</td>
              <td>{{ review.customer.name }}</td>
              <td>{{ review.customer.address }}</td>
              <td>
                <i
                  v-for="star in 5"
                  :key="star"
                  :class="getStarClass(review.rating, star)"
                ></i>
                <strong class="ms-2">{{ review.rating }}</strong>
              </td>
              <td class="review-content">
                {{ truncateText(review.noidung, 50) }}
              </td>
              <td>
                <div :class="{ 'review--true': review.phanhoi, 'review--false': !review.phanhoi }">
                  <p class="m-1">{{ review.phanhoi ? 'Đã phản hồi' : 'Chưa phản hồi' }}</p>
                  <!-- <small v-if="review.phanhoi" class="text-muted">
                    {{ formatDateTime(review.phanhoi.phanhoiAt) }}
                  </small> -->
                </div>
              </td>
              <td>
                <button
                  @click="openModal(review)"
                  type="button"
                  class="btn"
                  :class="review.phanhoi ? 'btn-info' : 'btn-warning'"
                >
                  <i :class="review.phanhoi ? 'fa-solid fa-eye' : 'fa-solid fa-pen-to-square'" class="text-white"></i>
                </button>
              </td>
              <td>
                <button
                  @click="confirmDeletion(review._id)"
                  type="button"
                  class="btn btn-danger"
                >
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
  
        <p v-if="!isLoading && reviews.length === 0" class="text-danger">Không tìm thấy đánh giá nào...</p>
      </div>
  
      <!-- Modal hiển thị thông tin và thêm phản hồi -->
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">
          <h1 class="modal-title text-center text-info fw-bold mb-3">Đánh giá</h1>
  
          <div v-if="selectedReview" class="review--user">
            <h4 class="pb-2 fw-bold text-success">Đánh giá của khách</h4>
            <div class="review--header">
              <img src="../assets/logo.jpg" alt="User Avatar" />
              <div>
                <p>{{ selectedReview.customer.name }}</p>
                <div class="d-flex align-items-center">
                  <i
                    v-for="star in 5"
                    :key="star"
                    :class="getStarClass(selectedReview.rating, star)"
                  ></i>
                  <strong class="ms-2">{{ selectedReview.rating }}</strong>
                </div>
              </div>
            </div>
            <div class="review--boody">
              <p>{{ selectedReview.noidung }}</p>
            </div>
          </div>
  
          <!-- Phản hồi của admin -->
          <div v-if="selectedReview.phanhoi" class="m-4">
            <h4 class="pb-2 fw-bold text-success">Phản hồi của mình</h4>
            <div class="d-flex align-items-start mb-3">
              <img src="../assets/logo.jpg" class="rounded-circle me-2" width="40" alt="Admin Avatar" />
              <div>
                <p class="mb-1 fw-semibold">{{ selectedReview.phanhoi.staff.name }}</p>
                <small class="text-muted">{{ selectedReview.phanhoi.staff.role }}</small>
                <br />
                <small class="text-muted">
                  {{ formatDateTime(selectedReview.phanhoi.phanhoiAt) }}
                </small>

              </div>
            </div>
            <ul class="list-group mb-2">
              <li class="list-group-item">{{ selectedReview.phanhoi.noidung }}</li>
            </ul>
          </div>
  
          <!-- Thêm phản hồi nếu chưa có -->
          <div v-else class="reply-section">
            <h4 class="pb-2 fw-bold text-danger">Thêm phản hồi</h4>
            <textarea
              v-model="replyContent"
              class="form-control mb-2"
              rows="3"
              placeholder="Nhập phản hồi..."
            ></textarea>
            <button
              @click="submitReply"
              class="btn btn-primary w-100"
            >
              Gửi phản hồi
            </button>
          </div>
  
          <button class="btn btn-secondary mt-3" @click="closeModal">Đóng</button>
        </div>
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
        reviews: [],
        isLoading: false,
        errorMessage: '',
        showModal: false,
        selectedReview: null,
        replyContent: '', // Nội dung phản hồi
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
    methods: {
      async getAllReviews() {
        this.isLoading = true;
        try {
          const response = await api.get('/review');
          this.reviews = response.data;
        } catch (error) {
          this.errorMessage = 'Không thể tải đánh giá';
          console.log('Error fetching reviews:', error);
        } finally {
          this.isLoading = false;
        }
      },
      getStarClass(rating, star) {
        return star <= rating ? 'fa-solid fa-star text-warning' : 'fa-regular fa-star';
      },
      truncateText(text, maxLength) {
        return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
      },
      formatDate(dateString) {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
      },
      openModal(review) {
        this.selectedReview = review;
        this.showModal = true;
      },
      closeModal() {
        this.selectedReview = null;
        this.showModal = false;
        this.replyContent = ''; // Reset nội dung phản hồi
      },
      async submitReply() {
        if (!this.replyContent.trim()) {
          alert('Vui lòng nhập nội dung phản hồi');
          return;
        }
        try {
          const date = new Date(); // Lấy thời gian hiện tại
          const response = await api.post(`/review/${this.selectedReview._id}/reply`, {
            staff: this.user.id,
            phanhoiAt: date,
            noidung: this.replyContent,
          });
          this.selectedReview.phanhoi = response.data;
          alert('Gửi phản hồi thành công');
          this.closeModal();
        } catch (error) {
          console.log('Error submitting reply:', error);
        }
      },
      async confirmDeletion(reviewId) {
        if (confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) {
          try {
            await api.delete(`/review/${reviewId}`);
            this.reviews = this.reviews.filter((review) => review._id !== reviewId);
            alert('Xóa đánh giá thành công');
          } catch (error) {
            console.log('Error deleting review:', error);
          }
        }
      },

      formatDateTime(dateString) {
      const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      };
      return new Date(dateString).toLocaleString('vi-VN', options);
    },
    },

   
    created() {
      this.getAllReviews();
    },
  };
  </script>
  
  
  
  <style>
  .review {
    background: #fff;
    padding: 1rem;
    border-radius: 8px;
  }
  .review-content {
    max-width: 200px;
    word-wrap: break-word;
  }
  .review--true {
    background: rgb(211, 255, 222);
    border: 2px solid rgb(117, 236, 48);
    border-radius: 30px;
  }
  .review--true p {
    margin: 0px;
  }
  .review--false {
    background: rgb(255, 219, 211);
    border: 2px solid rgb(250, 119, 26);
    border-radius: 30px;
  }
  .review--false p {
    margin: 0px;
  }
  .review--header {
    display: flex;
    margin-bottom: 10px;
  }
  .review--header p {
    margin: 0px;
  }
  .review--header img {
    width: 50px;
    height: 50px;
    margin-right: 10px;
  }
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .modal-content {
    background: #fff;
    padding: 1rem 2rem;
    border-radius: 10px;
    width: 80%;
    max-width: 500px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  .reply-section {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
}
.collapse {
    padding-left: 2rem;
}
.collapse img {
  width: 40px;
  margin-right: 10px;
}

  </style>
  