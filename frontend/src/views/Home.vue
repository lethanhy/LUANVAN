<template>

<header class="section__container header__container">
      <div class="header__image__container">
        <div class="header__content">
          <h1>Enjoy Your Dream Vacation</h1>
          <p>Book Hotels, Flights and stay packages at lowest price.</p>
        </div>
        <div class="booking__container">
          <form action="">
            <div class="form__group">
              <div class="input__group">
                <input type="text">
                <label for="">Check In Date</label>
              </div>
              <p>Add date</p>
            </div>

            <div class="form__group">
              <div class="input__group">
                <input type="text">
                <label for="">Check Out Date</label>
              </div>
              <p>Add date</p>
            </div>

            <div class="form__group">
              <div class="input__group">
                <input type="text">
                <label for="">Adults</label>
              </div>
              <p>Add adults</p>
            </div>

            <div class="form__group">
              <div class="input__group">
                <input type="text">
                <label for="">Children</label>
              </div>
              <p>Add children</p>
            </div>
          </form>

          <button class="btn"><i class="ri-search-line"></i></button>
        </div>
      </div>

    </header>

  <section class="section__container popular__container">
    <h2 class="section__header">Popular Hotels </h2>
    <div class="popular__grid">
      <div class="popular__card">
        <img src="../assets/Hotel Ristorante Grotta Palazzese.jpg" alt="popular hotel">
        <div class="popular__content">
          <div class="popular__card__header">
            <h4>The Plaza Hotel</h4>
            <h4>500.000 VND/Night</h4>
          </div>
          
          <div class="popular__card__main">
            <p>Max occupancy:</p>
            <p>4 adults</p>
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
          <!-- <p>New York City, USA</p> -->
        </div>
      </div>

      <div class="popular__card">
        <img src="../assets/Auberge Du Soleil _ Napa Valley California.jpg" alt="popular hotel">
        <div class="popular__content">
          <div class="popular__card__header">
            <h4>The Plaza Hotel</h4>
            <h4>$499</h4>
          </div>
          <div class="popular__card__main">
            <p>Max occupancy:</p>
            <p>2 adults</p>
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

      <div class="popular__card">
        <img src="../assets/Auberge Du Soleil _ Napa Valley California.jpg" alt="popular hotel">
        <div class="popular__content">
          <div class="popular__card__header">
            <h4>The Plaza Hotel</h4>
            <h4>$499</h4>
          </div>
          <div class="popular__card__main">
            <p>Max occupancy:</p>
            <p>5 adults</p>
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

      <div class="popular__card">
        <img src="../assets/Hotel Review_ An Ocean View Room at the Grand Wailea, Maui - The Points Guy.jpg" alt="popular hotel">
        <div class="popular__content">
          <div class="popular__card__header">
            <h4>The Plaza Hotel</h4>
            <h4>$499</h4>
          </div>

          <button>Xem thêm</button>
        </div>
      </div>

      <div class="popular__card">
        <img src="../assets/Auberge Du Soleil _ Napa Valley California.jpg" alt="popular hotel">
        <div class="popular__content">
          <div class="popular__card__header">
            <h4>The Plaza Hotel</h4>
            <h4>$499</h4>
          </div>
          <p>New York City, USA</p>
        </div>
      </div>
    </div>

    


  </section>

</template>



<!-- <template>
  <div>
    <h1>Welcome to Our Hotel <span v-if="isLoggedIn">Logged in as {{ user.name }}</span></h1>
    <div v-if="rooms.length">
      <h2>Available Rooms</h2>
      <div v-for="room in rooms" :key="room._id">
        <h3>{{ room.roomNumber }}</h3>
        <p>Type: {{ room.type }}</p>
        <p>Price: {{ room.price }} USD/night</p>
        <p>Available: {{ room.available }}</p>
        <p>Max Guests: {{ room.maxGuests }}</p>
      </div>
    </div>
  </div>

  <div>
    <button type="submit" >Đăng xuất</button>
  </div>
</template>

<script>
import api from '../api';
import { useUserStore } from '../stores/userStore';

export default {
  data() {
    return {
      rooms: []
    };
  },
  async created() {
    try {
      const response = await api.get('/rooms');
      this.rooms = response.data;
    } catch (error) {
      console.log('Failed to load rooms:', error);
    }
  },
  computed: {
    user() {
      const userStore = useUserStore();
      console.log(userStore.user); // Kiểm tra xem user có chứa thông tin đúng không
      return userStore.user;
    },
    isLoggedIn() {
      return !!this.user;
    }
  }
};
</script> -->

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
  grid-template-columns: repeat(4, 1fr);
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
</style>
