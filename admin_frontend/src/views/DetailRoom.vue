<template>
    <div class="DetailRoom" v-if="room">
        <h1 class="mb-3">{{ room.room.roomNumber }}</h1>
        <form action="">

            <div class="DetailRoom--main" >
                    <div class="DetailRoom--header">
                        <div class="d-flex">
                            <i class="fa-solid fa-user"></i>
                            <p class="">{{ room.room.bookingInFocustomerName  }}</p>
                        </div>
                        <div class="d-flex">
                            <i class="fa-regular fa-calendar-days"></i>
                            <p>11/01/2024 12:00:00 AM</p>
                        </div>
                        <div class="d-flex">
                            <i class="fa-solid fa-calendar-day"></i>
                            <p>4 ngày</p>
                        </div>
                        <div class="d-flex">
                            <i class="fa-solid fa-user"></i>
                            <p> 1 ngày</p>
                        </div>
                    </div>
                    <div class="DetailRoom--body d-flex">
                        <div class="DetailRoom--service bg-white">
                            <h1>Dịch vụ</h1>

                        </div>
                        <div class="DetailRoom--status bg-white">
                            
                            <div class=" col-md-12 mb-3">
                                <label for="validationCustom04" class="form-label">Cập nhật tình trạng phòng</label>
                                <select class="form-select" id="validationCustom04" required>
                                <option selected disabled value="">Choose...</option>
                                <option>Phòng đã đặt</option>
                                <option>Phòng trống</option>
                                </select>
                                <div class="invalid-feedback">
                                Please select a valid state.
                                </div>
                            </div>

                            <div class="col-md-12">
                                <label for="validationCustom04" class="form-label">Cập nhật tình trạng dọn dẹp</label>
                                <select class="form-select" id="validationCustom04" required>
                                <option selected disabled value="">Choose...</option>
                                <option>Đã dọn dẹp</option>
                                <option>Chưa dọn dẹp</option>
                                </select>
                                <div class="invalid-feedback">
                                Please select a valid state.
                                </div>
                            </div>

                        </div>
                    </div>
            </div>
            <div class="DetailRoom--button">
                <button type="submit" class="">Nhận phòng</button>
                <button type="submit">Lưu</button>
                <button type="submit" class=""><router-link to="/rooms" class="text-white text-decoration-none">Thoát</router-link></button>
            </div>


        </form>
        
    </div>
</template>

<script>
import api from '../api';
import { useUserStore } from '../stores/userStore';

export default {
  data() {
    return {
      room: null
    };
  },
  async created() {
    try {
      const roomId = this.$route.params.id; // Get the room ID from the route
      const response = await api.get(`/rooms/${roomId}`); // Make the API call with the room ID
      this.room = response.data; // Store the response data in the `room` object
    } catch (error) {
      console.log('Failed to load room details:', error);
    }
  }
};
//   computed: {
//     user() {
//       const userStore = useUserStore();
//       console.log(userStore.user); // Kiểm tra xem user có chứa thông tin đúng không
//       return userStore.user;
//     },
//     isLoggedIn() {
//       return !!this.user;
//     }
//   }
</script>


<style>
.DetailRoom{
    background: #fff;
    padding: 2rem;
    border-radius: 10px;
    text-align: center;
}
.DetailRoom--main{
    background: #eeecec;
    border-radius: 10px;
}
.DetailRoom--header{
    display: flex;
    text-align: center;
    justify-content: space-around;
    padding-top: 15px;
   
}
.DetailRoom--header .d-flex i{
    margin-right: 10px;
    margin-top: 4px;
  
}
.DetailRoom--body{
    /* flex-wrap: wrap; */
    gap: 1rem;
    justify-content: space-around;
    padding-bottom: 10px;
    
    
}
.DetailRoom--service,
.DetailRoom--status {
    flex-basis: 45%; /* Điều chỉnh để chiếm 45% chiều rộng mỗi ô */
    padding: 1rem;
    box-sizing: border-box;
    border-radius: 10px;
}
.DetailRoom--button {
    display: flex;
    justify-content: space-around; /* Space around the buttons */
    gap: 4px; /* Adds a small gap between the buttons */
    margin-top: 15px;
}

.DetailRoom--button button {
    flex-grow: 1; /* Make buttons stretch equally */
    padding: 10px; /* Adjust padding as needed */
    max-width: 150px;
    background-color: #30d366; /* Button color */
    color: white;
    border: none;
    border-radius: 5px;
}

.DetailRoom--button button:hover {
    background-color: #0056b3; /* Darker shade on hover */
}

</style>