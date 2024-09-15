<template>
  <div class="booking">
    <div class="d-grid gap-2 d-md-flex justify-content-md-end">
  <button class="btn btn-success me-md-2 mb-3" type="submit"><router-link to="/bookings/order" class="text-decoration-none text-white">Đặt phòng</router-link>
  </button>
</div>
    <table class="table  rounded-2  ">
        <thead >
          <tr class="table-primary">
            <th scope="col">STT</th>
            <th scope="col">Tên khách hàng</th>
            <th scope="col">Ngày lập phiếu</th>
            <th scope="col">Tên nhân viên</th>
            <th scope="col">Chi tiết</th>
            <th scope="col">Xóa</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">1</th>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
            <td>
              <button type="submit" class="btn btn-warning"><i class="fa-solid fa-circle-info text-white"></i></button>
            </td>
            <td>
              <button type="submit" class="btn btn-danger"><i class="fa-solid fa-xmark"></i></button>
            </td>
          </tr>
          <tr>
            <th scope="row">1</th>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
            <td>
              <button type="submit" class="btn btn-warning"><i class="fa-solid fa-circle-info text-white"></i></button>
            </td>
            <td>
              <button type="submit" class="btn btn-danger"><i class="fa-solid fa-xmark"></i></button>
            </td>
          </tr>
        </tbody>
      </table>
  </div>

    
  </template>
  
  <script>
  export default {
    name: 'Booking'
  };
  </script>
  
  <style>
  .booking{
    background: #fff;
    padding: 2rem;
    border-radius: 10px;
  }
  

  </style>
  