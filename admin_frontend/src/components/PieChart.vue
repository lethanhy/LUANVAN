<template>
    <div class="pie-chart-container">
      <Pie :data="data" :options="options" />
    </div>
  </template>
  
  <script>
  import { defineComponent } from 'vue';
  import { Pie } from 'vue-chartjs'; // Import Pie component từ vue-chartjs
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    CategoryScale,
  } from 'chart.js';
  
  // Đăng ký các components cần thiết từ chart.js
  ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);
  
  export default defineComponent({
    name: 'PieChart', // Tên của component
    components: { Pie }, // Đăng ký component Pie từ vue-chartjs
    data() {
      return {
        data: {
          labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
          datasets: [
            {
              label: 'Colors',
              backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0',
                '#9966FF',
                '#FF9F40',
              ],
              data: [12, 19, 3, 5, 2, 3],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                font: {
                  size: 14,
                  family: "'Poppins', sans-serif",
                  weight: '600',
                },
                color: '#424242',
              },
            },
            title: {
              display: true,
              text: 'Color Distribution',
              font: {
                size: 24,
                family: "'Poppins', sans-serif",
                weight: 'bold',
              },
              color: '#1E88E5',
            },
          },
        },
      };
    },
  });
  </script>
  
  <style scoped>
  .pie-chart-container {
    width: 100%;
    height: 500px; /* Đặt chiều cao cho container */
    padding: 20px; /* Thêm khoảng đệm xung quanh */
    background: #f5f5f5; /* Màu nền của biểu đồ */
    border-radius: 15px; /* Bo tròn các góc */
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); /* Tạo hiệu ứng đổ bóng */
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
  }
  
  .pie-chart-container canvas {
    max-width: 100%;
    height: 100%; /* Đảm bảo biểu đồ chiếm toàn bộ chiều cao */
  }
  </style>
  