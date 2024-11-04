<template>
    <div class="contact container">
        <div class="row shadow rounded-3">
            <div class="col-lg-6 bg-light">
                <div class="m-4 text-start">
                    <h2 class="contact--title fw-bold">Hãy liên lạc</h2>
                    <p>Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7. Nếu có bất kỳ câu hỏi hoặc yêu cầu nào, 
                        đừng ngần ngại liên hệ với chúng tôi qua thông tin bên dưới:
                        
                    </p>
                    <div class="contact--body">
                        <div class="d-flex align-items-center mb-1">
                            <div class="icon-circle">
                                <i class="fa-solid fa-location-dot"></i>
                            </div>
                            
                            <div class="ms-3">
                                <p class="contact--title">Head Office</p>
                                <p>28 Đường Thi Sách, Phường Thắng Tám, TP Vũng Tàu, BR-VT</p>
                                <p>Việt Nam</p>
                            </div>
                        </div>

                        <div class="d-flex align-items-center mb-3">
                            <div class="icon-circle">
                                <i class="fa-solid fa-envelope"></i>
                            </div>
                            <div class="ms-3">
                                <p class="contact--title">Email Us</p>
                                <p>lethanhy@gmail.com</p>
                                <p>y@gmail.com</p>
                            </div>
                        </div>

                        <div class="d-flex align-items-center mb-3">
                            <div class="icon-circle">
                                <i class="fa-solid fa-phone"></i>
                            </div>
                            <div class="ms-3">
                                <p class="contact--title">Cell Us</p>
                                <p>Phone: 0912763567</p>
                                <p>+123456789</p>
                            </div>
                        </div>

                    </div>
                    
                    <hr>
                    <div class="mt-3">
                        <p class="contact--title">Follow our social media</p>
                        <div class="d-flex gap-3">
                            <div class="icon-circle">
                                <i class="fa-brands fa-facebook"></i>
                            </div>
                            <div class="icon-circle">
                                <i class="fa-brands fa-twitter"></i>
                            </div>
                            <div class="icon-circle">
                                <i class="fa-brands fa-youtube"></i>
                            </div>
                            <div class="icon-circle">
                                <i class="fa-brands fa-instagram"></i>
                            </div>
                        </div>
                    </div>
                </div>
                
               

            </div>
            <div class="col-lg-6 d-flex align-items-center justify-content-center">
                <div class="contact--send">

                    <h2 class="contact--title">Gửi tin nhắn cho chúng tôi</h2>
                    <form action="" class="row g-3">
                        <div class="col-md-6">
                            <!-- <label for="name" class="form-label">Tên</label> -->
                            <input type="text" class="form-control" id="name" placeholder="Tên">
                        </div>
                        <div class="col-md-6">
                            <!-- <label for="address" class="form-label">Địa chỉ</label> -->
                            <input type="text" class="form-control" id="address" placeholder="Địa chỉ">
                        </div>
                        <div class="col-md-6">
                            <!-- <label for="phone" class="form-label">Số điện thoại</label> -->
                            <input type="text" class="form-control" id="phone" placeholder="Số điện thoại">
                        </div>
                        <div class="col-md-6">
                            <!-- <label for="inputPassword4" class="form-label">Password</label> -->
                            <input type="password" class="form-control" id="inputPassword4" placeholder="Mật khẩu">
                        </div>

                        <div class="form-floating">
                            <textarea class="form-control bg-light" placeholder="Leave a comment here" id="floatingTextarea2" style="height: 100px"></textarea>
                            <label for="floatingTextarea2">Tin nhắn</label>
                        </div>

                        <div class=" d-grid mx-auto rounded-3">
                            <button class="btn btn-primary ">Gửi ngay</button>
                        </div>

                    </form>

                </div>
                
               

            </div>
        </div>

    </div>
</template>
<style>
.contact {
    max-width: 1000px;
    margin-top: 1rem;
    margin-bottom: 2rem;
    /* background: #fff; */
    border-radius: 12px;
    /* padding: 1.5rem; */
    /* box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1); */
}
.contact--title {
    color:  #11366d;
    font-weight: bold;
}
.contact--body {
    margin: 0px 10px;

}
.contact--send {
    width: 100%; /* Để form chiếm toàn bộ chiều rộng có thể */
    max-width: 500px; /* Đặt giới hạn chiều rộng */
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 1rem; /* Khoảng cách giữa các phần tử */
    margin: 0px 25px;
}
.contact--send input {
    background: rgb(239, 239, 239);
}

.icon-circle {
    background-color: #0f62df; /* Màu xanh */
    color: white; /* Màu icon */
    width: 35px;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%; /* Vòng tròn */
    font-size: 20px;
}
.contact p {
    margin-top: 0; /* Xóa margin-top */
    margin-bottom: 0.5rem; /* Thêm chút khoảng cách ở dưới nếu cần */
}




</style>

