<template>
    <div class="contact container">
        <div class="row">
            <div class="col-lg-6 mt-3">
                <h1 class="text-dark">Thông tin liên hệ</h1>
                <p class="text-dark fs-5"><strong>Địa chỉ:</strong> Phường thắng tám,Thành Phố Vũng Tàu</p>
                <p class="text-dark fs-5"><strong>Số điện thoại:</strong> +0939 834 780</p>
                <p class="text-dark fs-5"><strong>Địa chỉ email: </strong>lethanhy@gmail.com</p>

               

            </div>
            <div class="col-lg-6 border border-primary rounded-2">
                <h1 class="mt-3 text-dark">Liên hệ</h1>
                <form action="" class="row g-3 m-3">
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
                        <textarea class="form-control" placeholder="Leave a comment here" id="floatingTextarea2" style="height: 100px"></textarea>
                        <label for="floatingTextarea2">Tin nhắn</label>
                    </div>

                    <div>
                        <button class="btn btn-primary">Gửi ngay</button>
                    </div>

                </form>
               

            </div>
        </div>

    </div>
</template>
<style>
.contact {
    margin-top: 7rem;
    margin-bottom: 2rem;
    background: #fff;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}
</style>