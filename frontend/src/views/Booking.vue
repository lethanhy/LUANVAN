<template>
  <div class="booking">
    <div class="sidebar__booking">
      <h1>Booking Details</h1>
      <form action="">
        <div class="group__booking">
          <div class="form__booking">
            <div class="input__booking">
              <label for="checkin">Ngày nhận phòng</label>
              <input type="date" v-model="checkin" :min="minDate" id="checkin">
            </div>
          </div>
          <div class="form__booking">
            <div class="input__booking">
              <label for="checkout">Ngày trả phòng</label>
              <input type="date" v-model="checkout" id="checkout" :min="getCheckoutMinDate()" @change="validateCheckout">
            </div>
          </div>
        </div>

        <div class="group__booking">
          <div class="form__booking">
          <div class="input__booking">
            <label for="adults">Người lớn</label>
            <input type="number" v-model="adults" id="adults" :min="1" value="1" placeholder="Nhập số người lớn">
          </div>
        </div>
        <div class="form__booking">
          <div class="input__booking">
            <label for="children">Trẻ em</label>
            <input type="number" v-model="children" id="children" :min="0" value="0" placeholder="Nhập số trẻ em">
          </div>
        </div>

        </div>

        
        <!-- <button type="submit" class="button__booking">Search</button> -->
      </form>

      <hr></hr>
      <h4>Filter By</h4>

     <!-- Filter by Rating
     <div class="rating">
        <label v-for="star in 5" :key="star" class="rating__filter">
          <input
            type="checkbox"
            :value="star"
            v-model="selectedRatings"
            @change="filterRooms"
          />
          <i v-for="n in star" :key="n" class="fa-solid fa-star"></i>
        </label>
      </div>
    </div> -->


    </div>


    <div class="main__booking">
      <div class="header__booking">
        <div class="filter__booking">
          <label for="price">Giá:</label>
          <select id="price" v-model="selectedPrice" @change="handleFilterChange">
            <option value="">Tất cả</option>
            <option value="low">Thấp đến cao</option>
            <option value="high">Cao đến thấp</option>
          </select>
        </div>

        <div class="filter__booking">
          <label for="popularity">Phổ biến:</label>
          <select id="popularity" v-model="selectedPopularity" @change="handleFilterChange">
            <option value="">Tất cả</option>
            <option value="most-popular">Phổ biến nhất</option>
            <option value="least-popular">Ít phổ biến nhất</option>
          </select>
        </div>

        <div class="filter__booking">
          <label for="roomType">Loại phòng:</label>
          <select id="roomType" v-model="selectedType" @change="handleFilterChange">
            <option value="">Tất cả</option>
            <option value="single">Phòng đơn</option>
            <option value="Double">Phòng đôi</option>
            <option value="family">Phòng gia đình</option>
          </select>
        </div>


      </div>

      <div>
        <p class="text-start fs-3">Tổng đang có {{ totalRooms }} phòng trống</p>
      </div>

      <div class="card__room">
        <div v-for="room in rooms" :key="room.id" class="popular__room">
          <img v-if="room.image" :src="`http://localhost:3000/uploads/${room.image}`" alt="popular hotel">
          <span v-else>Không có ảnh</span>
          <div class="room__content">
            <div class="room__card__header">
              <h4>{{ room.roomName }}</h4>
              <h4>{{ formatCurrency(room.price) }}/đêm</h4>
            </div>

             <!-- Star rating section -->
             <div class="room__card__rating">
                <i v-for="star in 5" :key="star" :class="getStarClass(room.rating, star)"></i>
              </div>
            
            <div class="room__card__main">
              <p>Số lượng:</p>
              <p>{{ room.maxGuests }} người</p>
            </div>

            <div class="room__card__icon">
              <i class="fa-solid fa-wifi"></i>
              <i class="fa-solid fa-utensils"></i>
              <i class="fa-solid fa-mug-hot"></i>
              <i class="fa-solid fa-tv"></i>
            </div>
            <!-- <div class="room__card__note">
              <i class="fa-solid fa-check"></i>
              <p>Pay at hotel or pay today</p>
              
            </div> -->
          
            <button class="mt-2"><router-link :to="{ name: 'Room', params: { id: room._id }, query: { checkin: checkin, checkout: checkout } }">Xem thêm</router-link></button>
            <!-- <p>New York City, USA</p> -->
          </div>
      </div>

      
      
      
      


      </div>

        <div v-if="rooms.length === 0" class="empty-state">
            <p class="fs-3 text-danger fw-bold">Vui lòng chọn ngày checkin và checkout!!!</p>
        </div>
    </div>

        
  </div>
</template>

<script>
import api from '../api';
export default {

  data() {
    return {
     rooms:[],
     originalRooms: [], // Store the original rooms list here
     minDate: new Date().toISOString().split('T')[0], // Lấy ngày hiện tại
     checkin:'',
     checkout:'',
     adults:'',
     children:'',
    
     selectedPrice: '', // State for price filter
    selectedPopularity: '', // State for popularity filter
    selectedType:'',
    };

  },
  computed: {
    totalRooms() {
      return this.rooms.length;
    },
  },
  methods: {

    validateCheckout() {
    // Ensure checkout date is after check-in date
    if (this.checkout && this.checkin && this.checkout <= this.checkin) {
      alert('Ngày trả phòng phải sau ngày nhận phòng và lớn hơn ngày nhận phòng!');
      this.checkout = ''; // Reset the checkout date
    }
  },

  // Ensure the checkout date's min date is dynamically updated based on the check-in date
  getCheckoutMinDate() {
    return this.checkin ? this.checkin : this.minDate;
  },

     // Format currency to VND without leading zero
     formatCurrency(value) {
                // Convert to integer if the value is a number
                const numberValue = typeof value === 'number' ? value : parseFloat(value);
                return `${numberValue.toLocaleString('it-IT')} VND`;
            },
    // async getRooms() {
    //   try {
    //     const response = await api.get('/rooms');
    //     this.rooms = response.data;

       
    //   } catch (error) {
    //     console.log('Failed to fetch rooms:', error);
    //   }
    // },

    async getRoomAvailable() {

      const adults = this.adults || 1;
      const children = this.children || 0;
      console.log('Check-in date:', this.checkin);
      console.log('Check-out date:', this.checkout);
      console.log('Check-out date:', adults);
      console.log('Check-out date:', children);
  
      if (this.checkin && this.checkout) {
        try {
          const response = await api.get('/bookings/Online', {
            params: {
              checkin: this.checkin,
              checkout: this.checkout,
              adults: this.adults,
              children: this.children,

            }
          });
          this.rooms = response.data;
          this.originalRooms = [...response.data]; // Store a copy of all rooms
        } catch (error) {
          console.log('Failed to load room details:', error);
          alert('Lỗi khi tải thông tin phòng. Vui lòng thử lại sau.');
        }
      }
    },
      getStarClass(rating, star) {
      // If the star number is less than or equal to the rating, show a filled star
      return star <= rating ? 'fa-solid fa-star' : 'fa-regular fa-star';
    },

    handleFilterChange() {
      // Implement your filter logic here based on selectedPrice and selectedPopularity
      let filteredRooms =  [...this.originalRooms];

      if (this.selectedPrice) {
        filteredRooms = filteredRooms.sort((a, b) => {
          return this.selectedPrice === 'low' ? a.price - b.price : b.price - a.price;
        });
      }

      if (this.selectedPopularity) {
        filteredRooms = filteredRooms.sort((a, b) => {
          return this.selectedPopularity === 'most-popular' ? b.rating - a.rating : a.rating - b.rating;
        });
      }

      // Filter by room type
      if (this.selectedType) {
        filteredRooms = filteredRooms.filter(
          room => room.type.toLowerCase() === this.selectedType.toLowerCase()
        );
      }

      this.rooms = filteredRooms;
    },


  },
  mounted() {
   // Lấy checkin và checkout từ query nếu có
  const checkinDate = this.$route.query.checkin;
  const checkoutDate = this.$route.query.checkout;

  // Kiểm tra và gán giá trị
  if (checkinDate) {
    this.checkin = checkinDate;
  }
  if (checkoutDate) {
    this.checkout = checkoutDate;
  }

  console.log('Checkin Date:', this.checkin);
  console.log('Checkout Date:', this.checkout);

  // Gọi hàm để lấy phòng có sẵn
  this.getRoomAvailable();
  },
  watch: {
  // Watch for changes in adults or children
  adults(newValue) {
    this.getRoomAvailable(); // Reload room availability when adults change
  },
  children(newValue) {
    this.getRoomAvailable(); // Reload room availability when children change
  },
  checkin(newValue) {
    this.getRoomAvailable(); // Reload room availability when checkin date changes
  },
  checkout(newValue) {
    this.getRoomAvailable(); // Reload room availability when checkout date changes
  },
},
};
</script>

<style>
.booking {
  margin-top: 1rem;
  display: flex;
  padding: 0 40px;
  gap: 2rem;
  /* flex-wrap: wrap; */
}

.sidebar__booking {
  background: whitesmoke;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 20%;
  min-width: 300px; /* Ensures sidebar doesn't get too small */
}

.group__booking {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.booking h1 {
  color: #333;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
}

.form__booking {
  margin-bottom: 1rem;
  width: 100%;
}

.input__booking label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-size: 1rem;
}

.input__booking input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.input__booking input:focus {
  border-color: #66afe9;
  outline: none;
}

.button__booking {
  background-color: #007bff;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
  width: 100%;
}

.button__booking:hover {
  background-color: #0056b3;
}

.main__booking {
 
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 80%;
  min-width: 300px; /* Ensures content area doesn't get too small */
}
.header__booking {
  display: flex;
  justify-content: flex-start;
  gap: 2rem;
  margin-bottom: 2rem;
}

.filter__booking {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter__booking label {
  font-weight: 600;
  color: #333;
}

.filter__booking select {
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 1rem;
  background-color: #f9f9f9;
  transition: border-color 0.3s ease;
}

.filter__booking select:focus {
  border-color: #66afe9;
  outline: none;
}
/* .header__booking p {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  text-align: center;
} */

.card__room {
  margin-top: 4rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.popular__room {
  overflow: hidden;
  border-radius: 1rem;
  box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.1);
}

.room__content {
  padding: 1rem;
}

.room__card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.room__card__header h4 {
  text-align: start;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-dark);
}

.room__card__main {
  display: flex;
  align-items: center;
  
}

.room__card__main p {
  padding-right: 10px;
}

.room__card__rating {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.room__card__rating i {
  color: #FFD700; /* Màu vàng cho ngôi sao */
  margin-right: 5px;
}



.room__card__icon {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}


.room__card__icon i {
  padding-right: 10px;
}

.room__card__note {
  display: flex;
  align-items: center;
  /* justify-content: center; */
  margin-bottom: 0.5rem;
}

.room__card__note i {
  margin-right: 10px;
  color: rgb(84, 224, 84);
}
.room__card__note p {
  color: rgb(84, 224, 84);
  margin: 0;
}


.room__content p {
  color: rgb(84, 224, 84);
}

.room__content button {
  color: var(--text-dark);
  padding: 0.5rem;
  border: none;
  border-radius: 10px;
  width: 100%;
}

.room__content button:hover {
  background-color: rgb(150, 240, 234);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .card__room {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .booking {
    flex-direction: column;
    padding: 0 20px;
  }
  .header__booking {
    flex-direction: column;
    gap: 1rem;
  }

  .sidebar__booking,
  .main__booking {
    width: 100%;
    margin-bottom: 2rem;
  }

  .card__room {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {

  .booking h1 {
    font-size: 1.5rem;
  }

  .input__booking input {
    font-size: 0.9rem;
    padding: 0.4rem;
  }

  .button__booking {
    font-size: 0.9rem;
    padding: 0.6rem 1rem;
  }
  .header__booking {
    gap: 0.5rem;
  }

  .filter__booking select {
    font-size: 0.9rem;
    padding: 0.4rem;
  }

  .room__card__header h4 {
    font-size: 1rem;
  }

  .room__card__main p {
    font-size: 0.9rem;
  }

  .room__content button {
    font-size: 0.9rem;
  }
}

@media (max-width: 360px) {
  .booking h1 {
    font-size: 1.2rem;
  }

  .input__booking input {
    font-size: 0.8rem;
    padding: 0.3rem;
  }

  .button__booking {
    font-size: 0.8rem;
    padding: 0.5rem 0.8rem;
  }

  .room__card__header h4 {
    font-size: 0.9rem;
  }

  .room__content button {
    font-size: 0.8rem;
  }
}


</style>
