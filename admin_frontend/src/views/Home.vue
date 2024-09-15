<template>
    <div class="card--container">
    <h3 class="main--title">Today</h3>
    <div class="card--wrapper">
        <div class="payment--card light-red">
            <div class="card--header">
                <div class="amount">
                    <span class="title">
                        Phòng
                    </span>
                     
                    <span class="amount--value"></span>
                </div>
                <i class="fa-solid fa-calendar-days icon"></i>
            </div>
            <span class="card--detail"></span>
        </div>

        <div class="payment--card light-purple">
            <div class="card--header">
                <div class="amount">
                    <span class="title">
                        Đặt phòng
                    </span>
                    
                    <span class="amount--value"></span>
                </div>
                <i class="fa-regular fa-clipboard icon dark-purple"></i>
            </div>
            <span class="card--detail"></span>
        </div>

        <div class="payment--card light-green">
            <div class="card--header">
                <div class="amount">
                    <span class="title">
                        Khách Hàng
                    </span>
                    
                    <span class="amount--value"></span>
                </div>
                <i class="fa-regular fa-address-book icon dark-green"></i>
            </div>
            <span class="card--detail"></span>
        </div>

        <div class="payment--card light-blue">
            <div class="card--header">
                <div class="amount">
                    <span class="title">
                        Liên Hệ
                    </span>
                   
                    <span class="amount--value"></span>
                </div>
                <i class="fas fa-question-circle icon dark-blue"></i>
            </div>
            <span class="card--detail"></span>
        </div>
    </div>

    
</div>

<div class="main--table">
  <h3>Thông tin khách hàng</h3>
  <table class="table border rounded">
  <thead class="table-dark">
    <tr>
      <th scope="col">STT</th>
      <th scope="col">Tên</th>
      <th scope="col">Số điện thoại</th>
      <th scope="col">Địa chỉ</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Jacob</td>
      <td>Thornton</td>
      <td>@fat</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td colspan="2">Larry the Bird</td>
      <td>@twitter</td>
    </tr>
  </tbody>
</table>
</div>


    
</template>

<style>
    /******** trang chủ ****/
    .card--container{
        background: #fff;
        padding: 2rem;
        border-radius: 10px;
    }

    .card--wrapper{
        display: flex;
        flex-wrap: wrap;
        gap:1rem;
    }
    .main--title{
        color: rgba(113, 99, 186, 255);
        padding-top: 10px;
        font-size: 15px;
    }

    .payment--card{
        background: rgb(229, 223,223);
        border-radius:10px;
        padding: 1.2rem;
        width: 290px;
        height: 150px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        transition: all 0.5s ease-in-out;

    }

    .payment-card:hover{
        transform: translateY(-5px);
    }
    .card--header{
        display:flex;
        flex-direction:row;
        justify-content:space-between;
        align-items: center;
        margin-bottom:20px;
        

    }
    .amount{
        display: flex;
        flex-direction: column;
    }
    .title{
        font-size: 20px;
        font-weight: 200;
    }

    .amount--value{
        font-size: 24px;
        font-family: "Poppins", sans-serif;
        font-weight: 600;
    }

    .icon{
        color: #fff;
        padding: 1rem;
        height: 60px;
        width: 60px;
        text-align: center;
        border-radius: 50%;
        font-size: 1.5rem;
        background: red;
    }

    .light-red{
        background: rgb(251,233,233);
    }
    .light-purple{
        background: rgb(254,226,254);
    }
    .light-green{
        background: rgb(235,254,235);
    }
    .light-blue{
        background: rgb(236,236,254);
    }
    .dark-red{
        background: red;
    }
    .dark-purple{
        background: purple;
    }
    .dark-green{
        background: green;
    }
    .dark-blue{
        background: blue;
    }

    .main--table{
        margin-top: 10px;
        background: #fff;
        padding: 2rem;
        border-radius: 10px;
    }

</style>
