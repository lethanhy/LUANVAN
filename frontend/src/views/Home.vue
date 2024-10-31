<template>

<header class="section__container header__container">
      <div class="header__image__container">
        <div class="header__content">
          <h1>Tận hưởng kỳ nghỉ mơ ước của bạn</h1>
          <p>Đặt khách sạn và các gói lưu trú với giá thấp nhất.</p>
        </div>
        <div class="booking__container">
          <form @submit.prevent="handleSubmit" action="" >
            <div class="form__group">
              <div class="input__group">
                <input type="date" v-model="checkin" :min="minDate">
                <!-- <label for="">Check In Date</label> -->
              </div>
              <p>Ngày nhận phòng</p>
            </div>

            <div class="form__group">
              <div class="input__group">
                <input type="date" v-model="checkout"  :min="checkin ? checkin : minDate">
                <!-- <label for="">Check Out Date</label> -->
              </div>
              <p>Ngày trả phòng</p>
            </div>

            <div class="form__group">
              <div class="input__group">
                <input type="number" placeholder="2 người" min="1">
                <!-- <label for="">Adults</label> -->
              </div>
              <p>Người lớn</p>
            </div>

            <div class="form__group">
              <div class="input__group">
                <input type="number" placeholder="0 người" min="0">
                <!-- <label for="">Children</label> -->
              </div>
              <p>Trẻ em</p>
            </div>
            <div class="">
              <button type="submit" class="btn"><i class="ri-search-line text-white"></i></button>
            </div>

            
          </form>

          
        </div>
      </div>

    </header>

    

  <section class="section__container popular__container">
    <!-- <h2 class="section__header">Popular Hotels </h2> -->
    <!-- <div class="popular__grid">
      <div v-for="room in limitedRooms" :key="room.id" class="popular__card">
        <img v-if="room.image" :src="`http://localhost:3000/uploads/${room.image}`" alt="popular hotel">
        <div class="popular__content">
          <div class="popular__card__header">
            <h4>{{ room.roomNumber }}</h4>
            <h4>{{ formatCurrency(room.price) }}/đêm</h4>
          </div>
          
          <div class="popular__card__main">
            <p>Max occupancy:</p>
            <p>{{ room.maxGuests }} adults</p>
          </div>
          <div class="popular__card__icon">
            <i class="fa-solid fa-wifi"></i>
            <i class="fa-solid fa-utensils"></i>
            <i class="fa-solid fa-mug-hot"></i>
            <i class="fa-solid fa-tv"></i>
          </div>
          <div class="popular__card__note">
            <i class="fa-solid fa-check"></i>
             <p>Pay at hotel or pay today</p>
          </div>
         
          <button>Xem thêm</button>
        </div>
      </div>
    </div> -->

    <!-- <div class="text-end mt-3 fs-5">
      Xem thêm <i class="fa-solid fa-arrow-right"></i>
    </div> -->

    

    <div class="best--offer text-start mt-3">
      <h3 class="fw-bold">Ưu đãi tốt nhất trong tháng này</h3>
      <div class="d-flex justify-content-between mb-3">
        <p>This can be detaled description or just a short text.</p>
        <div class="btn btn-info text-white">Xem Tất Cả</div>
      </div>

      <div class="offer">
        <div class=" offer--body bg-light rounded-3">
          <div class="offer--img " >
            <img src="../assets/Auberge Du Soleil _ Napa Valley California.jpg" alt="">
          </div>
          
          <div class="text-center">
            <h2 class="fw-bold text-danger">50% Off</h2>
            <p>Giảm đến 50%, kèm bữa sáng miễn phí và đưa đón sân bay. Đặt ngay để tận hưởng!</p>
            <div class="btn btn-info text-white">Đặt ngay</div>
          </div>
        </div>

        <div class=" offer--body bg-light rounded-3">
          <div class="offer--img " >
            <img src="../assets/Hotel Reservations _ Book Hotel Rooms Online.jpg" alt="">
          </div>
          
          <div class="text-center">
            <h2 class="fw-bold text-danger">30% Off</h2>
            <p>Giảm đến 30%, kèm bữa sáng miễn phí và đưa đón sân bay. Đặt ngay để tận hưởng!</p>
            <div class="btn btn-info  text-white">Đặt ngay</div>
          </div>
        </div>
      </div>
    </div>

    <div class="container popular--body">
      <div class="col-lg-6 ">
        <div class="room--info text-start">
          <h3>Phòng gia đình có giường đôi</h3>
          <p>15 - Bà rịa, Vũng Tàu</p>
          <p>Phòng Gia Đình mang đến không gian
             rộng rãi và thoải mái, lý tưởng cho những kỳ nghỉ của cả gia
              đình hoặc nhóm bạn. Với thiết kế hiện đại, nội thất tinh tế và 
              tông màu ấm áp, căn phòng tạo cảm giác ấm cúng như ở nhà.
          </p>

          <span class="me-3">Số lượng: 4 người</span>
          <span class="me-3">Diện tích: 100-150cm</span>
          <span><i class="fas fa-wifi"></i>  Wi-Fi</span>

          <h2 class="mt-2">800.000 VND</h2>

          <div class="d-inline-flex align-items-center">
            <button class="btn btn-info d-flex align-items-center">
              Đặt ngay <i class="fa-solid fa-arrow-right ms-2"></i>
            </button>
          </div>

        </div>
      </div>
      <div class="col-lg-6">
        <div class="room--img">
          <img src="../assets/bb5bc13f084d668ad95f432efba0d97d.jpg" alt="">
        </div>
      </div>
    </div>




    <div class="about-us container mt-3">
        <!-- <h1 class="fw-bold text-center">About Us</h1> -->
        <div class="row align-items-center mt-4">
          <div class="col-md-6 col-12 mb-4 about" >
            <img src="../assets/Villa Chinka by Astor Garden Hotel.jpg" alt="Ocean Breeze Hotel" class="about-us__image img-fluid shadow-lg">
          </div>
          <div class="col-md-6 col-12">
            <h2 class="fw-bold">Về Chúng Tôi</h2>
            <p>
              Chào mừng đến với khách sạn <strong>Ocean Breeze</strong>, thiên đường của sự sang trọng và yên bình.
              Ẩn mình dọc theo bờ biển thanh bình, khách sạn chúng tôi là điểm đến lý tưởng cho một kỳ nghỉ thư giãn
              hoàn hảo. Cho dù bạn đang tìm kiếm một nơi nghỉ ngơi thư giãn, một chuyến du lịch lãng mạn hay một kỳ nghỉ
              gia đình, Ocean Breeze mang đến sự kết hợp hoàn hảo giữa thoải mái và sang trọng để khiến kỳ nghỉ của bạn
              trở nên khó quên.
            </p>
            <h2 class="fw-bold">Câu Chuyện Của Chúng Tôi</h2>
            <p>
              Được thành lập dựa trên nguyên tắc hiếu khách và xuất sắc, khách sạn Ocean Breeze đã cung cấp dịch vụ hàng đầu
              cho du khách trong hơn một thập kỷ. Chúng tôi luôn mong muốn tạo ra một không gian ấm áp và đầy cảm hứng, nơi
              mà mỗi du khách đều cảm thấy được trân trọng và chăm sóc. Mọi chi tiết, từ kiến trúc đến các tiện nghi,
              đều được thiết kế để mang lại trải nghiệm liền mạch và tuyệt vời.
            </p>
          </div>
        </div>
      </div>


    


  </section>

</template>

<script>
import api from '../api';
export default {

  data() {
    return {
     minDate: new Date().toISOString().split('T')[0], // Lấy ngày hiện tại
     checkin:'',
     checkout:'',
    };

  },
  computed: {

  },
  methods: {

    handleSubmit() {
      // Check if checkout date is after checkin date
      if (this.checkout <= this.checkin) {
        alert('Vui lòng nhập ngày nhận phòng và ngày trả phòng');
        return;
      }

      this.$router.push({ 
        name: 'Booking', 
        query: { checkin: this.checkin, checkout: this.checkout, adults: this.adults, children: this.children } 
      });
    }

  
  },
  mounted() {
   
    const checkinDate = this.$route.query.checkin;
    const checkoutDate = this.$route.query.checkout;
    this.checkin = checkinDate || this.checkin;
    this.checkout = checkoutDate || this.checkout;
  },
  watch: {
   
  },
  mounted() {
   
  },
};
</script>

<style>

.header__container{
  padding: 5rem 1rem 2rem 1rem;
  margin-top: 5rem;
}

.header__image__container{
  position: relative;
  min-height: 500px;
  background-image: linear-gradient(
    to right,
    rgba(44,56,85, 0.9),
    rgba(100, 125, 187, 0.1)
  ),
  url("../assets/tải xuống.jpg");
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
  border-radius: 2rem;
}

.header__content{
  max-width: 600px;
  padding: 5rem 2rem;
}

.header__content h1{
  margin-bottom: 1rem ;
  font-size: 3.5rem;
  line-height: 4rem;
  font-weight: 600;
  color: var(--white);
}

.header__content p{
  color: var(--extra-light);
}

.booking__container{
  position: absolute;
  bottom: -5rem;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 6rem);
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 3rem 2rem;
  border-radius: 2rem;
  background-color: rgba(255, 255, 255, 0.7);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  box-shadow: 5px 5px 30px rgba(0, 0, 0, 0.1);
}

.booking__container form{
  width: 100%;
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 0.5fr; /* Four equal columns and one half-width column */
  gap: 1rem;
}

.booking__container .input__group{
  width: 100%;
  position: relative;
}

.booking__container label{
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  font-size: 1.2rem;
  font-weight: 500;
  color: var(--text-dark);
  pointer-events: none;
  transition: 0.3s;
}

.booking__container input{
  width: 100%;
  padding: 10px 0;
  font-size: 1rem;
  outline: none;
  border: none;
  background-color: transparent;
  border-bottom: 1px solid var(--primary-color);
  color: var(--text-dark);
}

.booking__container input:focus ~ label{
  font-size: 0.8rem;
  top: 0;
}

.booking__container .form__group p{
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: var(--text-light);
}

.booking__container .btn{
  padding: 0.5rem;
  outline: none;
  border: none;
  font-size: 1.5rem;
  color: var(--white);
  background-color: var(--primary-color);
  border-radius: 100%;
  cursor: pointer;
  transition: 0.3s;
}

.booking__container .btn:hover{
  background-color: var(--primary-color-dark);
}
.popular__grid {
  margin-top: 4rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.popular__card{
  overflow: hidden;
  border-radius: 1rem;
  box-shadow: 5px 5px 20px rgb(0, 0, 0,0.1) ;
}

.popular__content{
  padding: 1rem;
}

.popular__card__header{
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  /* margin-bottom: 0.5rem; */
}

.popular__card__header h4{
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-dark);
}

.popular__card__main{
  display: flex;
  align-items: center;
  /* justify-content: space-between; */
  /* gap: 1rem; */
  
}

.popular__card__main p{
  padding-right: 10px ;
  color: rgb(84, 224, 84);

}
.popular__card__icon{
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}
.popular__card__icon i{
  padding-right: 10px;

}
.popular__card__note {
  display: flex;
  align-items: center;
  /* justify-content: center; */
  margin-bottom: 0.5rem;
}

.popular__card__note i {
  margin-right: 10px;
  color: rgb(84, 224, 84);
}
.popular__card__note p {
  color: rgb(84, 224, 84);
  margin: 0;
}

.popular__content button{
  color: var(--text-dark);
  padding: 0.5rem;
  /* background-color: aqua; */
  border: none;
  border-radius: 10px;
  width: 100%;
  
}
.popular__content button:hover{
  background-color: rgb(150, 240, 234);
}

.popular--body {
  display: flex;
  margin: 3rem;
}

.about-us {
  padding: 2rem 0;
}

.about img {
  border-radius: 60% 60% 0% 0%;
}

.about-us p {
  line-height: 1.6;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

.about-us h2 {
  margin-top: 1.5rem;
  color: #007bff;
}
.offer--img {
  width: 250px;
}
.offer--img img {
  border-radius: 25% 10%;
}
.offer {
  display: flex;
  gap: 20px;
}
.offer--body {
  display: flex;
  gap: 10px;
  padding: 1rem;
  border-radius: 40% ;
  
}

.room--info {
  margin: 2rem 3rem;
}

.room--img {
  margin: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.room--img img{
  width: 360px;
  height: 350px;
}


</style>
