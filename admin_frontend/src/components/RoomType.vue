<template>
  <div class="card--room">
    <h3 class="mb-3">{{ roomType }}</h3>
    <div class="room">
      <div 
        class="main--room" 
        v-for="room in rooms" 
        :key="room._id" 
        :class="{
          'room-booked': room.bookings[0]?.booking?.status === 'đã đặt',
          'room-available': room.bookings.length === 0 || room.bookings[0]?.booking?.status === 'trống',
          'room-checkin': room.bookings[0]?.booking?.status === 'đã nhận'
        }"
      >
        <div class="header--room">
          <p class="room-code">{{ room.roomNumber }}</p>
          <p class="room-status">Phòng {{ room.bookings[0]?.booking?.status || 'trống' }}</p>
        </div>
        <div class="body--room">
          <div class="icon-circle mt-2">
            <i :class="room.bookings[0]?.booking?.status === 'đã đặt' || room.bookings[0]?.booking?.status === 'đã nhận' ? 'fa-solid fa-users' : 'fa-solid fa-check'"></i>
          </div>
          <router-link :to="{ name: 'roomDetails', params: { id: room._id } }" tag="p" class="text-dark no-underline">
            <p class="mt-3">
              <span v-if="room.bookings[0]?.booking?.status === 'đã đặt' || room.bookings[0]?.booking?.status === 'đã nhận'">
                <span v-for="(item, index) in room.bookings" :key="index">
                  {{ item.booking.customer.name }}<span v-if="index < room.bookings.length - 1">, </span>
                </span>
              </span>
              <span v-else>Phòng trống</span>
            </p>
          </router-link>
        </div>
        <div class="footer--room" :class="{'trangthai1':room.trangthai === 'Đã dọn dẹp','trangthai2':room.trangthai === 'Chưa dọn dẹp' }">
          <div class="footer--room--time">
            <div 
              v-if="room.bookings[0]?.booking?.status === 'đã đặt' || room.bookings[0]?.booking?.status === 'đã nhận'" 
              class="footer--room--type d-flex" 
              v-for="(item, index) in room.bookings" 
              :key="index"
            >
              <i class="fa-regular fa-clock m-2"></i>
              <p>{{ calculateDaysBetween(item.booking.checkin, item.booking.checkout) }} day</p>
            </div>
            <div v-else class="footer--room--type d-flex">
              <i class="fa-regular fa-clock m-2"></i>
            </div>
            <div class="footer--room--type d-flex" >
              <i class="fa-solid fa-gear m-2"></i>
              <p>{{ room.trangthai || 'N/A' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    roomType: String,
    rooms: Array
  },
  methods: {
    // Function to calculate days between two dates
    calculateDaysBetween(startDate, endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      // Calculate the time difference in milliseconds
      const differenceInTime = end.getTime() - start.getTime();
      
      // Convert milliseconds to days
      const differenceInDays = differenceInTime / (1000 * 3600 * 24);
      
      return differenceInDays;
    },
  }
}
</script>

<style>
.card--room {
    background: #fff;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.room {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: space-between;
}

.main--room {
    background: #e0f7e9;
    border-radius: 15px;
    flex-basis: calc(20% - 1rem);
    padding: 1.5rem;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    transition: transform 0.2s ease-in-out;
}

.main--room:hover {
    transform: translateY(-5px);
}

.room-booked {
    background: #f8d7da; /* Light red background for booked rooms */
}

.room-available {
    background: #e0f7e9; /* Light green background for available rooms */
}

.room-checkin {
    background: #758ff8; /* Different color for check-in rooms */
}

.header--room {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.room-code {
    font-weight: bold;
    font-size: 18px;
    color: #333;
}

.room-status {
    font-size: 14px;
    color: #666;
}

.body--room {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 40px;
    gap: 10px;
    margin-top: -15px;
}

.body--room p {
    font-size: 20px;
}

.body--room .text-dark {
    text-decoration: none;
}

.icon-circle {
    background-color: white;
    border-radius: 50%;
    width: 35px;
    height: 35px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

.icon-circle i {
    font-size: 20px;
    color: #28a745;
}

.footer--room {
    background-color: #d9d9d9;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    border-radius: 0 0 10px 10px;
}

.footer--room--time {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.footer--room--time p {
    margin: 0;
}

.footer--room--type {
    display: flex;
    align-items: center;
}

.footer--room--type i {
    margin-right: 5px;
    color: #28a745;
}
.trangthai1 {
  background:#d9d9d9;
}
.trangthai2 {
  background: #f7ed60;
}
</style>
