<template>
  <div class="bar-chart-container">
    <Bar :data="data" :options="options" />
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue';
import { Bar } from 'vue-chartjs'; // Import Bar component từ vue-chartjs
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import api from '../api'; // API đã được cấu hình sẵn

// Đăng ký các components cần thiết từ chart.js
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default defineComponent({
  name: 'BarChart', // Tên của component
  components: { Bar },
  setup() {
    const data = ref({
      labels: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'], // Nhãn cho các ngày trong tuần
      datasets: [
        {
          label: 'Số lượng phòng được đặt',
          backgroundColor: '#42A5F5',
          borderColor: '#1E88E5',
          hoverBackgroundColor: '#64B5F6',
          hoverBorderColor: '#2196F3',
          borderWidth: 2,
          borderRadius: 5,
          barPercentage: 0.5,
          data: [0, 0, 0, 0, 0, 0, 0], // Dữ liệu khởi tạo (cập nhật sau)
        },
      ],
    });

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: { size: 14, family: "'Poppins', sans-serif", weight: '600' },
            color: '#424242',
          },
        },
        title: {
          display: true,
          text: 'Số lượng phòng được đặt trong tuần',
          font: { size: 24, family: "'Poppins', sans-serif", weight: 'bold' },
          color: '#1E88E5',
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#424242', font: { size: 12, family: "'Poppins', sans-serif" } },
        },
        y: {
          grid: { color: '#e0e0e0', borderDash: [5, 5] },
          ticks: {
            color: '#424242',
            font: { size: 12, family: "'Poppins', sans-serif" },
            beginAtZero: true,
          },
        },
      },
    };

    // Hàm lấy dữ liệu phòng đã đặt trong tuần
    const getWeeklyBookings = async () => {
      try {
        const response = await api.get('/bookings/weekly'); // Gọi API
        const bookingsData = response.data.data; // Lấy mảng dữ liệu từ API

        // Cập nhật reactive bằng cách tạo đối tượng mới
        data.value = {
          ...data.value,
          datasets: [
            {
              ...data.value.datasets[0],
              data: bookingsData, // Cập nhật dữ liệu mới
            },
          ],
        };
        // console.log('Bookings data:', bookingsData); // Debugging
      } catch (error) {
        console.error('Error fetching weekly bookings:', error);
      }
    };


    onMounted(() => {
      getWeeklyBookings(); // Lấy dữ liệu khi component được tải
    });

    return { data, options };
  },
});
</script>

<style scoped>
.bar-chart-container {
  width: 100%;
  height: 500px;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.bar-chart-container canvas {
  max-width: 100%;
  height: 100%;
}
</style>
