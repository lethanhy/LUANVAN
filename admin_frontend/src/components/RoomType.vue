<template>
    <div class="card--room">
        <h3 class="mb-3">{{ roomType }}</h3>
        <div class="room" >
            <div class="main--room" v-for="room in rooms" :key="room.id" :class="{ 'room-booked': room.status === 'đã đặt', 'room-available': room.status === 'trống', 'room-checkin': room.status === 'đã nhận' }" >
                <div class="header--room">
                    <p class="room-code">{{ room.roomNumber }}</p>
                    <p class="room-status">Phòng {{ room.status }}</p>
                </div>
                <div class="body--room">
                    <div class="icon-circle mt-2">
                        <i :class="(room.status === 'đã đặt' || room.status === 'đã nhận') ? 'fa-solid fa-users' : 'fa-solid fa-check'"></i>
                    </div>
                    <router-link :to="{ name: 'roomDetails', params: { id: room._id } }" tag="p" class="text-dark no-underline">
                        <p class="mt-3">
                            <span v-if="room.status === 'đã đặt' || room.status === 'đã nhận'">
                                <!-- Handle multiple bookings for a room -->
                                <span v-for="(booking, index) in room.bookings" :key="index">
                                {{ booking.customerName }}<span v-if="index < room.bookings.length - 1">, </span>
                                </span>
                            </span>
                            <span v-else>Phòng trống</span>
                        </p>
                    </router-link>
                </div>
                <div class="footer--room">
                    <div class="footer--room--time">
                        <!-- If room is booked, show the days booked and status -->
                        <div 
                            v-if="room.status === 'đã đặt' || room.status === 'đã nhận'" 
                            class="footer--room--type d-flex" 
                            v-for="(booking, index) in room.bookings" 
                            :key="index"
                        >
                        <i class="fa-regular fa-clock m-2"></i>
                        <p>{{ booking.daysBooked }} day</p>
                        </div>

                        <!-- If room is available, show only the icon -->
                        <div v-else class="footer--room--type d-flex">
                        <i class="fa-regular fa-clock m-2"></i>
                        </div>
                        
                        <!-- Show the room status in both cases -->
                        <div class="footer--room--type d-flex">
                            <i class="fa-solid fa-gear m-2"></i>
                        <p>{{ room.trangthai }}</p>
                        </div>
                    </div>
                </div>

            </div>

            

            
            
            <!-- Các phòng khác có thể tương tự -->

           
    

        </div>



    </div>

    
</template>

<script>
export default {
  props: {
    roomType: String,
    rooms: Array
  }
}
</script>


<style>
/* Thẻ chính bao bọc toàn bộ nội dung */
.card--room {
    background: #fff;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Container chứa các phòng */
.room {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: space-between;
}

/* Phòng cụ thể */
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

/* Hiệu ứng hover cho phòng */
.main--room:hover {
    transform: translateY(-5px);
}

/* Phòng đã đặt */
.room-booked {
  background: #f8d7da; /* Light red background for booked rooms */
}

/* Phòng trống */
.room-available {
  background: #e0f7e9; /* Light green background for available rooms */
}
/* Phòng nhận */
.room-checkin {
  background: #758ff8; /* Light green background for available rooms */
}
/* Phần đầu của phòng */
.header--room {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

/* Mã phòng */
.room-code {
    font-weight: bold;
    font-size: 18px;
    color: #333;
}

/* Trạng thái phòng */
.room-status {
    font-size: 14px;
    color: #666;
}

/* Phần chính của phòng */
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
.body--room .text-dark{
    text-decoration: none;
}
/* Vòng tròn icon */
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

/* Icon bên trong */
.icon-circle i {
    font-size: 20px;
    color: #28a745;
}

/* Footer của phòng */
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

/* Nội dung bên trong footer */
.footer--room--time {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

/* Căn chỉnh chữ */
.footer--room--time p {
    margin: 0;
}

.footer--room--type {
    display: flex;
    align-items: center;
}

/* Khoảng cách và căn chỉnh icon */
.footer--room--type i {
    margin-right: 5px;
    color: #28a745;
}
</style>
