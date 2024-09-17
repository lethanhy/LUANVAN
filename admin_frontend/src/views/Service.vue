<template>
    <div class="service">
        <div class="service--body">
            <h1 class="text-center fw-bold">Quản lý dịch vụ</h1>

            <div class="d-grid gap-2 d-md-flex justify-content-md-end mb-2">
                <button @click="showModal = true" class="btn btn-success me-md-2" type="button">Thêm dịch vụ</button>
            </div>

            <table class="table table-bordered text-center">
                <thead class="table-secondary">
                    <tr>
                        <th scope="col">STT</th>
                        <th scope="col">Tên dịch vụ</th>
                        <th scope="col">Loại</th>
                        <th scope="col">Đơn giá</th>
                        <th scope="col">Sửa</th>
                        <th scope="col">Xóa</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row">1</th>
                        <td>Pepsi</td>
                        <td>Nước uống</td>
                        <td>12.000 VND</td>
                        <td>
                            <button type="button" class="btn btn-warning">Sửa</button>
                        </td>
                        <td>
                            <button type="button" class="btn btn-danger">Xóa</button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- Modal -->
            <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
                <div class="modal-content">
                    <h2 class="modal-title">Thêm dịc vụ</h2>
                    <form @submit.prevent="addCustomer">
                        <div class="mb-3">
                            <label for="name" class="form-label">Họ và tên</label>
                            <input type="text" id="name" v-model="newCustomer.name" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label for="idCard" class="form-label">Căn cước công dân</label>
                            <input type="text" id="idCard" v-model="newCustomer.idCard" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label for="phone" class="form-label">Số điện thoại</label>
                            <input type="text" id="phone" v-model="newCustomer.phone" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label for="address" class="form-label">Địa chỉ</label>
                            <input type="text" id="address" v-model="newCustomer.address" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label for="gender" class="form-label">Giới tính</label>
                            <select id="gender" v-model="newCustomer.gender" class="form-select" required>
                                <option value="">Chọn giới tính</option>
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="nationality" class="form-label">Quốc tịch</label>
                            <input type="text" id="nationality" v-model="newCustomer.nationality" class="form-control" required>
                        </div>
                        <button type="submit" class="btn btn-primary">Thêm</button>
                        <button type="button" class="btn btn-secondary ms-2" @click="showModal = false">Hủy</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            showModal: false,
            newCustomer: {
                name: '',
                idCard: '',
                phone: '',
                address: '',
                gender: '',
                nationality: ''
            }
        };
    },
    methods: {
        addCustomer() {
            // Handle the form submission logic here
            console.log(this.newCustomer);
            this.showModal = false; // Close the modal after submission
        }
    }
}
</script>

<style scoped>
.service {
    background: #fff;
    padding: 2rem;
    border-radius: 10px;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-content {
    background: #fff;
    padding: 2rem;
    border-radius: 10px;
    width: 90%;
    max-width: 500px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.modal-title {
    margin-bottom: 1rem;
}

.form-label {
    margin-bottom: 0.5rem;
    font-weight: bold;
}

.form-control, .form-select {
    margin-bottom: 1rem;
}

/* .btn-primary {
    background-color: #007bff;
    border: none;
    color: #fff;
}

.btn-primary:hover {
    background-color: #0056b3;
} */

.btn-secondary {
    background-color: #6c757d;
    border: none;
    color: #fff;
}

.btn-secondary:hover {
    background-color: #5a6268;
}
</style>
