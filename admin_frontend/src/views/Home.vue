<template>
    <div class="card--container">
      <div class="card--wrapper">
        <div class="payment--card light-red">
          <div class="card--header">
            <div class="amount">
              <span class="title">Phòng</span>
              <span class="amount--value">25</span>
            </div>
            <i class="fa-solid fa-calendar-days icon dark-red"></i>
          </div>
          <span class="card--detail">Tổng số phòng</span>
        </div>
  
        <div class="payment--card light-purple">
          <div class="card--header">
            <div class="amount">
              <span class="title">Đặt phòng</span>
              <span class="amount--value">15</span>
            </div>
            <i class="fa-regular fa-clipboard icon dark-purple"></i>
          </div>
          <span class="card--detail">Đơn đặt phòng hôm nay</span>
        </div>
  
        <div class="payment--card light-green">
          <div class="card--header">
            <div class="amount">
              <span class="title">Khách Hàng</span>
              <span class="amount--value">35</span>
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
          <!-- <h3>Danh sách dịch vụ</h3>
          <div class="service-list">
            <div class="service-item">Wi-Fi miễn phí</div>
            <div class="service-item">Đưa đón sân bay</div>
            <div class="service-item">Phòng gym</div>
            <div class="service-item">Hồ bơi ngoài trời</div>
          </div> -->

          <BarChart :chartData="data" :chartOptions="options" />
        </div>
  
        <div class="main--table">
          <!-- <h3>Bảng thống kê</h3>
          <table class="table table-bordered text-center">
            <thead class="table-secondary">
              <tr>
                <th scope="col">STT</th>
                <th scope="col">Tên</th>
                <th scope="col">Số điện thoại</th>
                <th scope="col">Địa chỉ</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>1</th>
                <td>Lê Thành Y</td>
                <td>0939 834 780</td>
                <td>Cần Thơ</td>
              </tr>
            </tbody>
          </table> -->
         <PieChart :chartData="data" :chartOptions="options"/>
        </div>
      </div>
    </div>
  </template>

<script>
import { defineComponent, ref } from 'vue';
import BarChart from '../components/Barchart.vue';
import PieChart from '@/components/PieChart.vue';

export default defineComponent({
  name: 'Dashboard',
  components: {
    BarChart,
    PieChart
  },
});
</script>
  
  <style>
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
  