<template>
  <div class="card--container">
    <div class="card--wrapper">
      <div class="payment--card light-red">
        <div class="card--header">
          <div class="amount">
            <span class="title">Phòng</span>
            <span class="amount--value">{{ totalRooms }}</span>
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
            <span class="amount--value">{{ totalContacts }}</span>
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
        <div class="bg-light shadow">

          <div class="admin-dashboard">
              <h2 class="text-primary fw-bold">Thống kê doanh thu</h2>
               <!-- Bảng Doanh thu theo ngày -->
  <div class="m-4">
    <h4>Doanh thu theo ngày</h4>
    <table class="table table-bordered m-2">
      <thead>
        <tr>
          <th>Ngày</th>
          <th>Doanh thu (VND)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="revenue in paginatedDailyRevenue" :key="revenue._id">
          <td>{{ revenue._id }}</td>
          <td>{{ revenue.totalRevenue.toLocaleString('vi-VN') }}</td>
        </tr>
      </tbody>
    </table>
    <div class="pagination">
      <button 
        :disabled="dailyPage === 1" 
        @click="dailyPage--"
        class="btn btn-primary">
        Prev
      </button>
      <span>Trang {{ dailyPage }} / {{ dailyTotalPages }}</span>
      <button 
        :disabled="dailyPage === dailyTotalPages" 
        @click="dailyPage++"
        class="btn btn-primary">
        Next
      </button>
    </div>
  </div>
              <!-- Bảng Doanh thu theo tháng -->
  <div class="m-4">
    <h4>Doanh thu theo tháng</h4>
    <table class="table table-bordered m-2">
      <thead>
        <tr>
          <th>Tháng</th>
          <th>Doanh thu (VND)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="revenue in paginatedMonthlyRevenue" :key="revenue._id">
          <td>{{ revenue._id }}</td>
          <td>{{ revenue.totalRevenue.toLocaleString('vi-VN') }}</td>
        </tr>
      </tbody>
    </table>
    <div class="pagination">
      <button 
        :disabled="monthlyPage === 1" 
        @click="monthlyPage--"
        class="btn btn-primary">
        Prev
      </button>
      <span>Trang {{ monthlyPage }} / {{ monthlyTotalPages }}</span>
      <button 
        :disabled="monthlyPage === monthlyTotalPages" 
        @click="monthlyPage++"
        class="btn btn-primary">
        Next
      </button>
    </div>
  </div>

        </div>
         


        </div>
        
        
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted,computed } from 'vue';
import BarChart from '@/components/BarChart.vue';
import api from '../api'; // Ensure this points to your axios instance

export default defineComponent({
  name: 'Dashboard',
  components: { BarChart },

  setup() {
    const totalRooms = ref(0);
    const bookingRooms = ref(0);
    const totalCustomer = ref(0);
    const customers = ref([]);
    const totalContacts = ref(0);
    const bookings = ref([]);
    const dailyRevenue = ref([]);
    const monthlyRevenue = ref([]);
   

    const getAllRooms = async () => {
      try {
        const response = await api.get('/rooms');
        totalRooms.value = response.data.length;
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    const getAllContacts = async () => {
      try {
        const response = await api.get('/contact');
        totalContacts.value = response.data.length;
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };

    const getAllBooking = async () => {
      try {
        const response = await api.get('/bookings');
        bookings.value = response.data;
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    const getCurrentDate = () => {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    };

    const getBookingRoomsToday = async () => {
      try {
        const date = getCurrentDate();
        const response = await api.get(`/bookings/date/${date}`);
        bookingRooms.value = response.data.length;
      } catch (error) {
        console.error('Error fetching today\'s bookings:', error);
      }
    };

    const getAllCustomer = async () => {
      try {
        const date = getCurrentDate();
        const response = await api.get('/customers');
        customers.value = response.data;

        const filteredCustomers = customers.value.filter(customer => {
          const createdDate = customer.createdAt.split('T')[0];
          return createdDate === date;
        });

        totalCustomer.value = filteredCustomers.length;
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    const formatDate = (dateString) => {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return new Date(dateString).toLocaleDateString('vi-VN', options);
    };

    const dailyResponse = async () => {
      try {
        const response = await api.get('/invoice/daily-revenue');
        dailyRevenue.value = response.data;
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    const monthlyResponse = async () => {
      try {
        const response = await api.get('/invoice/monthly-revenue');
        monthlyRevenue.value = response.data;
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    }

      // Phân trang Doanh thu theo ngày
      const dailyPage = ref(1);
    const dailyItemsPerPage = 3; // Số mục trên mỗi trang
    const dailyTotalPages = computed(() =>
      Math.ceil(dailyRevenue.value.length / dailyItemsPerPage)
    );
    const paginatedDailyRevenue = computed(() => {
      const start = (dailyPage.value - 1) * dailyItemsPerPage;
      const end = start + dailyItemsPerPage;
      return dailyRevenue.value.slice(start, end);
    });

    // Phân trang Doanh thu theo tháng
    const monthlyPage = ref(1);
    const monthlyItemsPerPage = 5; // Số mục trên mỗi trang
    const monthlyTotalPages = computed(() =>
      Math.ceil(monthlyRevenue.value.length / monthlyItemsPerPage)
    );
    const paginatedMonthlyRevenue = computed(() => {
      const start = (monthlyPage.value - 1) * monthlyItemsPerPage;
      const end = start + monthlyItemsPerPage;
      return monthlyRevenue.value.slice(start, end);
    });

    

    onMounted(async () => {
      await Promise.all([
        getAllRooms(),
        getBookingRoomsToday(),
        getAllCustomer(),
        getAllContacts(),
        getAllBooking(),
        dailyResponse(),
        monthlyResponse(),
      ]);
    });

    return { totalRooms, bookings, totalContacts, bookingRooms, totalCustomer, formatDate, dailyRevenue,
      monthlyRevenue, dailyPage,
      dailyTotalPages,
      paginatedDailyRevenue,
      monthlyPage,
      monthlyTotalPages,
      paginatedMonthlyRevenue,
       };
  }
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
    margin-top: 10px; /* Space between card section and this section */
  }
  
  .content-wrapper {
    display: flex;
    justify-content: space-between; /* Aligns items horizontally */
  }
  
  .main--service, .main--table {
    flex: 1; /* Allows both sections to take equal space */
    margin: 0 10px; /* Adds space between the two sections */
    background: #fff;
    padding: 1rem;
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


.admin-dashboard {
  padding: 20px;
}
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 10px;
}

.pagination button {
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

.pagination button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}

.pagination span {
  font-weight: bold;
}

/* .main--table .admin-dashboard table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}
.main--table .admin-dashboard th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
.main--table .admin-dashboard th {
  background-color: #f2f2f2;
} */
  </style>
  