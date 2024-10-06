<template>
    <div class="container history">
        <div class="history--body">
            <h1 class="text-start fw-bold text-primary">Lịch sử đặt phòng</h1>
            <div class="history--order border rounded-2">
                <div class="row d-flex m-2 ">
                    <div class="col-lg-4">
                        <img src="../assets/Hotel Review_ An Ocean View Room at the Grand Wailea, Maui - The Points Guy.jpg" alt="">
                    </div>
                    <div class="col-lg-8 text-start">
                        <p class="text-info">Đã đặt vào Thứ Hai, ngày 12 tháng 11 năm 2024, 7:18 PM</p>
                        <p>Phòng 102</p>
                        <p>Tổng ngày ở: 3 Ngày</p>
                        <p>Tổng người ở: 2 Người</p>
                        <p>Cuộn Masala chay x 1, Burger chay x 1, Mì ống Penne chay sốt đỏ x 1</p>
                        <hr>
                        <div class="d-flex justify-content-between">
                            <p class="text-primary">Tổng tiền thanh toán: 500.000 VND</p>
                            <button class="btn btn-primary">Hoàn Thành</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="history--order border rounded-2 mt-2">
                <div class="row d-flex m-2 ">
                    <div class="col-lg-4">
                        <img src="../assets/Hotel Review_ An Ocean View Room at the Grand Wailea, Maui - The Points Guy.jpg" alt="">
                    </div>
                    <div class="col-lg-8 text-start">
                        <p>Đã đặt vào Thứ Hai, ngày 12 tháng 11 năm 2024, 7:18 PM</p>
                        <p>Phòng 102</p>
                        <p>Tổng ngày ở: 3 Ngày</p>
                        <p>Tổng người ở: 2 Người</p>
                        <p>Cuộn Masala chay x 1, Burger chay x 1, Mì ống Penne chay sốt đỏ x 1</p>
                        <hr>
                        <div class="d-flex justify-content-between">
                            <p>Tổng tiền thanh toán: 500.000 VND</p>
                            <button class="btn btn-primary">Hoàn Thành</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    </div>
</template>
<style>
.history {
  margin-top: 7rem;
  margin-bottom: 2rem;
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.history--body {
  display: flex;
  flex-direction: column;
  gap: 1rem; /* Thêm khoảng cách giữa các phần tử bên trong */
}

.history--order {
  background: #f8f9fa; /* Màu nền cho thẻ lịch sử */
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease-in-out; /* Thêm hiệu ứng chuyển động */
}

.history--order:hover {
  background: #e9ecef; /* Đổi màu nền khi hover */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); /* Thêm hiệu ứng bóng */
}

.history--order img {
  width: 80%; /* Giảm kích thước chiều rộng xuống 80% của cột */
  height: auto; /* Chiều cao sẽ tự động điều chỉnh theo tỉ lệ */
  object-fit: cover; /* Đảm bảo hình ảnh không bị méo */
  border-radius: 8px; /* Bo tròn góc */
  border: 1px solid #ddd; /* Thêm viền nhẹ */
  margin: 0 auto; /* Căn giữa hình ảnh */
}


.history--order h1 {
  color: #007bff; /* Màu xanh chủ đạo */
  margin-bottom: 1rem;
  font-weight: bold;
}

.history--order p {
  margin-bottom: 0.5rem;
  color: #495057; /* Màu xám đậm cho nội dung */
  font-size: 1rem; /* Cỡ chữ vừa phải */
}

.history--order hr {
  border-top: 1px solid #ced4da; /* Màu viền nhẹ */
}

.history--order .btn {
  background-color: #007bff;
  border: none;
  border-radius: 6px;
  transition: background-color 0.3s ease;
}

.history--order .btn:hover {
  background-color: #0056b3; /* Đổi màu khi hover */
}

.text-start {
  text-align: left;
}

</style>