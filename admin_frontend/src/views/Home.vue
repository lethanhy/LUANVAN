<template>
  <div class="card--container">
    <div class="card--wrapper">
      <div class="payment--card light-red">
        <div class="card--header">
          <div class="amount">
            <span class="title">Phòng</span>
            <span class="amount--value">{{ totalRooms }}</span> <!-- Dynamic Value -->
          </div>
          <i class="fa-solid fa-calendar-days icon dark-red"></i>
        </div>
        <span class="card--detail">Tổng số phòng</span>
      </div>

      <div class="payment--card light-purple">
        <div class="card--header">
          <div class="amount">
            <span class="title">Đặt phòng</span>
            <span class="amount--value">{{ bookingRooms }}</span>
          </div>
          <i class="fa-regular fa-clipboard icon dark-purple"></i>
        </div>
        <span class="card--detail">Đơn đặt phòng hôm nay</span>
      </div>

      <div class="payment--card light-green">
        <div class="card--header">
          <div class="amount">
            <span class="title">Khách Hàng</span>
            <span class="amount--value">{{ totalCustomer }}</span>
          </div>
          <i class="fa-regular fa-address-book icon dark-green"></i>
        </div>
        <span class="card--detail">Khách hàng hiện tại</span>
      </div>

      <div class="payment--card light-blue">
        <div class="card--header">
          <div class="amount">
            <span class="title">Liên Hệ</span>
            <span class="amount--value">5</span>
          </div>
          <i class="fas fa-question-circle icon dark-blue"></i>
        </div>
        <span class="card--detail">Yêu cầu liên hệ</span>
      </div>
    </div>
  </div>

  <div class="main--content">
    <div class="content-wrapper">
      <div class="main--service">
        <BarChart />
      </div>

      <div class="main--table">
        <PieChart />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import BarChart from '@/components/BarChart.vue';
import PieChart from '@/components/PieChart.vue';
import api from '../api'; // Ensure this points to your axios instance
import { Filler } from 'chart.js';

export default defineComponent({
  name: 'Dashboard',
  components: { BarChart, PieChart },

  setup() {
    const totalRooms = ref(0); // Reactive state for room count
    const bookingRooms = ref(0); // Reactive state for today's bookings
    const totalCustomer = ref(0);
    const customers = ref(0);

    // Fetch all rooms
    const getAllRooms = async () => {
      try {
        const response = await api.get('/rooms');
        totalRooms.value = response.data.length; // Update totalRooms count
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    // Get current date in YYYY-MM-DD format
    const getCurrentDate = () => {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    };

    // Fetch bookings for today
    const getBookingRoomsToday = async () => {
      try {
        const date = getCurrentDate();
        const response = await api.get(`/bookings/date/${date}`);
        bookingRooms.value = response.data.length; // Update today's bookings count
      } catch (error) {
        console.error('Error fetching today', error);
      }
    };

    const getAllCustomer = async () => {
      try {
        const date = getCurrentDate(); // Get current date in 'YYYY-MM-DD' format
        const response = await api.get('/customers');
        
        customers.value = response.data;

        // Filter customers whose createdAt matches the current date (YYYY-MM-DD)
        const filteredCustomers = customers.value.filter(customer => {
          const createdDate = customer.createdAt.split('T')[0]; // Extract date part
          return createdDate === date;
        });

        totalCustomer.value = filteredCustomers.length; // Store the count of today's customers

      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };


    // Call API methods when the component is mounted
    onMounted(() => {
      getAllRooms();
      getBookingRoomsToday();
      getAllCustomer();
    });

    return { totalRooms, bookingRooms, totalCustomer };
  },
});
</script>

  
  <style>

  body {
  
  font-family: "Afacad Flux", sans-serif;
 
  }
  /* Sửa đổi tổng thể card */
  .card--container {
    background: #fff;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }
  
  .card--wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    justify-content: center;
  }
  
  .payment--card {
    background: #fff;
    border-radius: 12px;
    padding: 1.5rem;
    width: 300px;
    height: 160px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: all 0.3s ease;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .payment--card:hover {
    transform: translateY(-10px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }
  
  .card--header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }
  
  .amount {
    display: flex;
    flex-direction: column;
  }
  
  .title {
    font-size: 18px;
    font-weight: 600;
    color: #555;
  }
  
  .amount--value {
    font-size: 28px;
    font-weight: 700;
    color: #333;
  }
  
  .icon {
    color: #fff;
    padding: 1rem;
    height: 50px;
    width: 50px;
    text-align: center;
    border-radius: 50%;
    font-size: 1.2rem;
  }
  
  .light-red {
    background: rgb(251, 233, 233);
  }
  
  .light-purple {
    background: rgb(242, 226, 254);
  }
  
  .light-green {
    background: rgb(225, 255, 235);
  }
  
  .light-blue {
    background: rgb(226, 240, 254);
  }
  
  .dark-red {
    background: red;
  }
  
  .dark-purple {
    background: purple;
  }
  
  .dark-green {
    background: green;
  }
  
  .dark-blue {
    background: blue;
  }
  
  .main--content {
    margin-top: 20px; /* Space between card section and this section */
  }
  
  .content-wrapper {
    display: flex;
    justify-content: space-between; /* Aligns items horizontally */
  }
  
  .main--service, .main--table {
    flex: 1; /* Allows both sections to take equal space */
    margin: 0 10px; /* Adds space between the two sections */
    background: #fff;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .main--service h3, .main--table h3 {
    color: rgba(113, 99, 186, 255);
    margin-bottom: 1rem;
  }
  
  .service-list {
    display: grid; /* Use grid layout */
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); /* Responsive columns */
    gap: 10px; /* Space between service items */
  }
  
  .service-item {
    background: #f4f4f4; /* Background for individual services */
    padding: 10px; /* Padding */
    border-radius: 8px; /* Rounded corners */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Subtle shadow */
    text-align: center; /* Center text */
  }
  </style>
  