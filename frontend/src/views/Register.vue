<template>
  <div class="container signup">
    <div class="row shadow rounded">
      <div class="col-lg-6 bg-light d-flex align-items-center justify-content-center signup-image">
          <img 
            src="../assets/dangky.jpg" 
            alt="Hotel Reservations" 
            class=" img-fluid"
          />
        </div>
      <div class="col-lg-6 bg-white d-flex align-items-center justify-content-center">
        <div class="signup--body">
          <p class="text-start text-primary">Ocean Breeze Hotel</p>
          <h3 class="signup--title">Đăng ký tài khoản</h3>
          <p>Đặt phòng và ở thuận tiện</p>

          <!-- <div class="social-media">
            <div class=" border">
              <div class="d-flex align-items-center m-2">
                <img src="../assets/google.png" alt="Google" class="social-icon" />
                <p class="ms-2 mb-0">Sign Up with Google</p>
              </div>
              
            </div>
            <div class="border">
              <div class="d-flex align-items-center m-2">
                <img src="../assets/cfef5ce601689564e0a39b4773f20815.png" alt="Apple" class="social-icon" />
                <p class="ms-2 mb-0">Sign Up with Apple</p>
              </div>
              
            </div>
          </div> -->


          <form @submit.prevent="Register" class="mt-4">
            <input v-model="name" type="text" class="form-control mb-3" placeholder="Nhập họ và tên..." required />
            <input v-model="password" type="password" class="form-control mb-3" placeholder="Nhập mật khẩu..." required />
            <input v-model="email" type="email" class="form-control mb-3" placeholder="Nhập email..." required />
            <input v-model="address" type="text" class="form-control mb-3" placeholder="Nhập địa chỉ..." required />
            <input v-model="phone" type="text" class="form-control mb-3" placeholder="Nhập số điện thoại..." required />

            <div class="form-check">
              <input v-model="agreedToTerms" type="checkbox" class="form-check-input" id="terms" />
              <label class="form-check-label" for="terms">
                Tôi đồng ý với <a href="#">Điều khoản & Điều kiện</a>
              </label>
            </div>

            <button class="btn btn-primary w-100 mt-3" type="submit" :disabled="isSubmitting || !agreedToTerms">
              <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
              Đăng ký
            </button>
          </form>

          <div class="member mt-3">
            Đã có tài khoản? <router-link to="/customers/login">Đăng nhập</router-link>
          </div>
          <div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../api";
import { useUserStore } from "@/stores/userStore";

export default {
  data() {
    return {
      name: "",
      email: "",
      password: "",
      phone: "",
      address: "",
      agreedToTerms: false,
      isSubmitting: false,
      errorMessage: null,
    };
  },
  methods: {
    async Register() {
      this.isSubmitting = true;
      this.errorMessage = null;

      try {
        const response = await api.post("/customers/register", {
          name: this.name,
          email: this.email,
          password: this.password,
          phone: this.phone,
          address: this.address,
        });

        localStorage.setItem("authToken", response.data.token);

        const userStore = useUserStore();
        userStore.setUser(response.data.user);

        this.$router.push("/customers/login");
      } catch (error) {
        this.errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
        console.error("Registration failed:", error);
      } finally {
        this.isSubmitting = false;
      }
    },
  },
};
</script>

<style>
.signup {
  max-width: 1000px;
  margin-top: 1rem;
  margin-bottom: 2rem;
  border-radius: 12px;
  /* padding: 1.5rem; */
}

.signup--body {
  margin: 50px 50px;
}

.signup--title {
  color: #123f92;
  font-weight: bold;
}

.social-media {
  display: flex;
  /* flex-direction: column; */
  gap: 1rem;
  margin: 1rem 1rem;
  font-size: 10px;
}


.social-icon {
  width: 24px; /* Adjust size here */
  height: 24px;
}

/* p {
  margin: 0;
  font-size: 1rem;
} */


.spinner-border {
  width: 1rem;
  height: 1rem;
}

.alert {
  font-size: 0.9rem;
}
.signup-image img {
  max-height: 600px; /* Chỉnh chiều cao theo ý muốn */
  object-fit: cover; /* Giữ tỉ lệ hình ảnh */
}
</style>
