<template>
    <div class="container review">
      <h1 class="mb-4 fw-bold text-primary">Tất cả đánh giá của tôi</h1>
      <div v-if="reviews && reviews.length" v-for="review in reviews" :key="review._id" class="review--user">
        <div class="review--header">
          <img src="../assets/unnamed.png" alt="User Avatar" />
          <div>
            <p>{{ review.customer.name }}</p>
            <div class="d-flex align-items-center">
              <i v-for="star in 5" :key="star" :class="getStarClass(review.rating, star)"></i>
              <strong class="ms-2">{{ review.rating }}</strong>
            </div>
          </div>
        </div>
        <div class="review--boody">
          <p>{{ review.noidung }}</p>
        </div>
        <div class="review--footer mt-3">
          <!-- <div class="review--icon">
            <i class="fa-regular fa-thumbs-up fs-3 me-3"></i>
            <i class="fa-regular fa-thumbs-down fs-3 "></i>
          </div> -->
  
          <button
            v-if="review.phanhoi"
            class="btn btn-outline-secondary btn-sm reply-toggle-btn text-primary"
            type="button"
            :data-bs-toggle="'collapse'"
            :data-bs-target="'#replySection' + review._id"
            aria-expanded="false"
            :aria-controls="'replySection' + review._id"
          >
            Phản hồi <i class="fa-solid fa-chevron-up ms-1"></i>
          </button>
        </div>
  
        <!-- Reply Section -->
        <div class="collapse mt-3" :id="'replySection' + review._id">
          <div class="d-flex align-items-start mb-3">
            <img src="../assets/unnamed.png" class="rounded-circle me-2" width="40" alt="Admin Avatar" />
            <div>
              <p class="mb-1 fw-semibold">{{ review.phanhoi?.staff?.name }}</p>
              <small class="text-muted">Quản lý</small>
            </div>
          </div>
          <ul class="list-group mb-2">
            <li class="list-group-item">{{ review.phanhoi?.noidung }}</li>
          </ul>
        </div>
      </div>
  
      <p v-else class="text-center text-muted mt-5">Chưa có đánh giá nào.</p>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '../api';
import { useUserStore } from '../stores/userStore';

export default {
  name: 'Review',

  setup() {
    const userStore = useUserStore();
    const route = useRoute();

    const reviews = ref([]);

    // Restore user session and fetch reviews
    onMounted(() => {
      userStore.restoreUser();
      getReviews();
    });

    const getReviews = async () => {
      try {
        const customerId = userStore.user.id;
        const response = await api.get(`/review/${customerId}`);
        reviews.value = response.data;
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      }
    };

    const getStarClass = (rating, star) => {
      return star <= rating ? 'fa-solid fa-star text-warning' : 'fa-regular fa-star';
    };

    return {
      reviews,
      getStarClass,
    };
  },
};
</script>

<style>
.review {
  margin-top: 1rem;
  margin-bottom: 2rem;
  background: #fff;
}

.review--user {
  text-align: start;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 1.5rem 2rem;
  margin-bottom: 1rem;
}

.review--user p{
    margin-bottom: 0px;
}

.review--header {
  display: flex;
  padding-bottom: 0.5rem;
}

.review--header img {
  width: 40px;
  margin-right: 10px;
}

.review--footer {
  display: flex;
  margin-top: 0.5rem;
}

.review--icon {
  padding-right: 1rem;
}

.collapse {
  padding-left: 2rem;
}

.collapse img {
  width: 40px;
  margin-right: 10px;
}

</style>
