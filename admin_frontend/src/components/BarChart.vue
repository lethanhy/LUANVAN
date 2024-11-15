<template>
  <div class="bar-chart-container">

    <!-- <h1 class="">Số lượng phòng được đặt</h1> -->
    
    <!-- Menu lựa chọn khoảng thời gian -->
    <div class="timeframe-selector">
      <label for="timeframe">Chọn khoảng thời gian:</label>
      <select id="timeframe" v-model="timeframe">
        <option value="weekly">Theo tuần</option>
        <option value="daily">Theo ngày</option>
        <option value="monthly">Theo tháng</option>
      </select>
    </div>
    <!-- Biểu đồ -->
    <Bar :data="data" :options="options" :key="JSON.stringify(data)" />


  </div>
</template>

<script>
import { defineComponent, onMounted, ref, watch } from 'vue';
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import api from '../api';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default defineComponent({
  name: 'BarChart',
  components: { Bar },
  setup() {
    const timeframe = ref('weekly'); // Giá trị mặc định là 'weekly'

    const data = ref({
      labels: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'],
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
          data: [0, 0, 0, 0, 0, 0, 0],
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
          text: 'Số lượng phòng được đặt',
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

    const fetchData = async () => {
  try {
    let response;

    // Gọi API và cập nhật labels theo khoảng thời gian được chọn
    if (timeframe.value === 'weekly') {
      response = await api.get('/bookings/weekly');
      data.value.labels = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];
    } else if (timeframe.value === 'daily') {
      response = await api.get('/bookings/daily');
      data.value.labels = ['0h','1h','2h','3h','4h','5h','6h','7h','8h','9h','10h','11h',
        '12h','13h','14h','15h','16h','17h','18h','19h','20h','21h','22h','23h'
      ]
    } else if (timeframe.value === 'monthly') {
      response = await api.get('/bookings/monthly');
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      const getDaysInMonth = new Date(currentYear, currentMonth, 0).getDate();
      data.value.labels = Array.from({ length: getDaysInMonth }, (_, i) => `Ngày ${i + 1}`);
    }

    // Cập nhật datasets với dữ liệu nhận được
    const bookingsData = response.data.data;

    data.value = {
      labels: data.value.labels, // Đảm bảo gán đúng labels đã được cập nhật
      datasets: [
        {
          ...data.value.datasets[0],
          data: bookingsData,
        },
      ],
    };

    console.log('Updated labels:', data.value.labels);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};


    watch(timeframe, fetchData); // Theo dõi giá trị của timeframe để gọi API khi thay đổi
    onMounted(fetchData); // Gọi fetchData khi component được tải

    return { data, options, timeframe };
  },
});
</script>

<style scoped>
.bar-chart-container {
  width: 100%;
  height: 500px;
  padding: 50px;
  background: #f5f5f5;
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* margin-top: 20px; */
}

.timeframe-selector {
  margin-top: 2rem ;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.timeframe-selector label {
  font-weight: 600;
  color: #424242;

}

.timeframe-selector select {
  padding: 5px 10px;
  font-size: 1rem;
  border-radius: 5px;
  border: 1px solid #ddd;
}

.bar-chart-container canvas {
  max-width: 100%;
  height: 100%;
}
</style>
