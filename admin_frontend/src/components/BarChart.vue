<template>
    <div class="bar-chart-container">
      <Bar :data="data" :options="options" />
    </div>
  </template>
  
  <script>
  import { defineComponent } from 'vue';
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
  
  // Đăng ký các components cần thiết từ chart.js
  ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);
  
  export default defineComponent({
    name: 'BarChart', // Tên của component
    components: { Bar }, // Đăng ký component Bar từ vue-chartjs
    data() {
      return {
        data: {
          labels: ['January', 'February', 'March', 'April', 'May', 'June'],
          datasets: [
            {
              label: 'Monthly Sales',
              backgroundColor: '#42A5F5',
              borderColor: '#1E88E5',
              hoverBackgroundColor: '#64B5F6',
              hoverBorderColor: '#2196F3',
              borderWidth: 2,
              borderRadius: 5,
              barPercentage: 0.5,
              data: [30, 50, 80, 40, 100, 60],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
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
              text: 'Monthly Sales Overview',
              font: {
                size: 24,
                family: "'Poppins', sans-serif",
                weight: 'bold',
              },
              color: '#1E88E5',
            },
          },
          scales: {
            x: {
              grid: {
                display: false,
              },
              ticks: {
                color: '#424242',
                font: {
                  size: 12,
                  family: "'Poppins', sans-serif",
                },
              },
            },
            y: {
              grid: {
                color: '#e0e0e0',
                borderDash: [5, 5],
              },
              ticks: {
                color: '#424242',
                font: {
                  size: 12,
                  family: "'Poppins', sans-serif",
                },
                beginAtZero: true,
              },
            },
          },
        },
      };
    },
  });
  </script>
  
  <style scoped>
  .bar-chart-container {
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
  
  .bar-chart-container canvas {
    max-width: 100%;
    height: 100%; /* Đảm bảo biểu đồ chiếm toàn bộ chiều cao */
  }
  </style>
  