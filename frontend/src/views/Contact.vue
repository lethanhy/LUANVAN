<template>
    <div class="contact container">
        <div class="row shadow rounded-3">
            <div class="col-lg-6 bg-light">
                <div class="m-4 text-start">
                    <h2 class="contact--title fw-bold">Hãy liên lạc</h2>
                    <p>Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7. Nếu có bất kỳ câu hỏi hoặc yêu cầu nào, 
                        đừng ngần ngại liên hệ với chúng tôi qua thông tin bên dưới:
                    </p>
                    <div class="contact--body">
                        <!-- Contact details here -->
                        <div class="d-flex align-items-center mb-1">
                            <div class="icon-circle">
                                <i class="fa-solid fa-location-dot"></i>
                            </div>
                            <div class="ms-3">
                                <p class="contact--title">Head Office</p>
                                <p>28 Đường Thi Sách, Phường Thắng Tám, TP Vũng Tàu, BR-VT</p>
                                <p>Việt Nam</p>
                            </div>
                        </div>
                        <!-- Email and Phone Info here -->

                        <div class="d-flex align-items-center mb-3">
                            <div class="icon-circle">
                                <i class="fa-solid fa-envelope"></i>
                            </div>
                            <div class="ms-3">
                                <p class="contact--title">Email Us</p>
                                <p>lethanhy@gmail.com</p>
                                <p>y@gmail.com</p>
                            </div>
                        </div>

                        <div class="d-flex align-items-center mb-3">
                            <div class="icon-circle">
                                <i class="fa-solid fa-phone"></i>
                            </div>
                            <div class="ms-3">
                                <p class="contact--title">Cell Us</p>
                                <p>Phone: 0912763567</p>
                                <p>+123456789</p>
                            </div>
                        </div>
                    </div>
                    
                    <hr>
                    <div class="mt-3">
                        <p class="contact--title">Follow our social media</p>
                        <div class="d-flex gap-3">
                            <!-- Social media icons here -->
                            <div class="icon-circle">
                                <i class="fa-brands fa-facebook"></i>
                            </div>

                            <div class="icon-circle">
                                <i class="fa-brands fa-twitter"></i>
                            </div>
                            <div class="icon-circle">
                                <i class="fa-brands fa-youtube"></i>
                            </div>
                            <div class="icon-circle">
                                <i class="fa-brands fa-instagram"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-lg-6 d-flex align-items-center justify-content-center">
                <div class="contact--send">
                    <h2 class="contact--title">Gửi tin nhắn cho chúng tôi</h2>
                    <form @submit.prevent="createContact" class="row g-3">
                        <div class="col-md-6">
                            <input v-model="contactForm.ten" type="text" class="form-control" placeholder="Tên">
                        </div>
                        <div class="col-md-6">
                            <input v-model="contactForm.diachi" type="text" class="form-control" placeholder="Địa chỉ">
                        </div>
                        <div class="col-md-6">
                            <input v-model="contactForm.sodienthoai" type="text" class="form-control" placeholder="Số điện thoại">
                        </div>
                        <div class="col-md-6">
                            <input v-model="contactForm.email" type="email" class="form-control" placeholder="Email">
                        </div>
                        <div class="form-floating">
                            <textarea v-model="contactForm.tinnhan" class="form-control bg-light" placeholder="Leave a comment here" style="height: 100px"></textarea>
                            <label for="floatingTextarea2">Tin nhắn</label>
                        </div>
                        <div class="d-grid mx-auto rounded-3">
                            <button type="submit" class="btn btn-primary">Gửi ngay</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '../api';
import { useUserStore } from '../stores/userStore';

export default {
  name: 'Contact',

  setup() {
    const userStore = useUserStore();
    const route = useRoute();
    
    // Reactive form data
    const contactForm = ref({
      ten: '',
      diachi: '',
      sodienthoai: '',
      email: '',
      tinnhan: ''
    });

    onMounted(() => {
      userStore.restoreUser();
    });

    const createContact = async () => {
      const contactData = {
        customerId: userStore.user && userStore.user.id ? userStore.user.id : null,
        ...contactForm.value // Include form values in contact data
      };

      try {
        const response = await api.post('/contact', contactData);
        console.log('API response:', response.data);
        alert('Gửi liên hệ thành công!');
        // Reset form after submission
        contactForm.value = { ten: '', daichi: '', sodienthoai: '', email: '', tinnhan: '' };
      } catch (error) {
        console.error('Lỗi khi tạo booking:', error);
        alert('Có lỗi xảy ra khi gửi liên hệ. Vui lòng thử lại.');
      }
    };

    return {
      user: userStore.user,
      contactForm,
      createContact
    };
  },
};
</script>

<style>
.contact {
    max-width: 1000px;
    margin-top: 1rem;
    margin-bottom: 2rem;
    /* background: #fff; */
    border-radius: 12px;
    /* padding: 1.5rem; */
    /* box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1); */
}
.contact--title {
    color:  #11366d;
    font-weight: bold;
}
.contact--body {
    margin: 0px 10px;

}
.contact--send {
    width: 100%; /* Để form chiếm toàn bộ chiều rộng có thể */
    max-width: 500px; /* Đặt giới hạn chiều rộng */
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 1rem; /* Khoảng cách giữa các phần tử */
    margin: 0px 25px;
}
.contact--send input {
    background: rgb(239, 239, 239);
}

.icon-circle {
    background-color: #0f62df; /* Màu xanh */
    color: white; /* Màu icon */
    width: 35px;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%; /* Vòng tròn */
    font-size: 20px;
}
.contact p {
    margin-top: 0; /* Xóa margin-top */
    margin-bottom: 0.5rem; /* Thêm chút khoảng cách ở dưới nếu cần */
}




</style>

