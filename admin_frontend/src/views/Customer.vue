<template>
    <div class="customer">
        <div class="customer--body">
            <h1 class="text-center text-info fw-bold">Quản lý khách hàng</h1>

            <div class="d-grid gap-2 d-md-flex justify-content-md-end mb-2">
                <button @click="showModal = true" class="btn btn-success me-md-2" type="button"><i class="fas fa-plus"></i> Thêm Khách hàng</button>
            </div>

            <div class="d-flex">

                <!-- Search Bar -->
                <div class="search-bar">
                    <input 
                        type="text" 
                        v-model="searchQuery" 
                        placeholder="Tìm theo tên" 
                        class="form-control mb-3" 
                    />
                </div>
                
                <!-- Search Bar -->
                <div class="search-bar">
                    <input 
                        type="text" 
                        v-model="customerPhoneQuery" 
                        placeholder="Tìm số điện thoại" 
                        class="form-control mb-3" 
                    />
                </div>

                

                <div class="search-bar">
                    <input 
                        type="text" 
                        v-model="customerCccd" 
                        placeholder="Tìm kiếm theo cccd" 
                        class="form-control mb-3" 
                    />
                </div>

                

            </div>

            <table class="table table-striped table-hover text-center table-borderless">
                <thead class="">
                    <tr>
                        <th scope="col">STT</th>
                        <th scope="col">Họ và tên</th>
                        <th scope="col">Căn cước công dân</th>
                        <th scope="col">Số điện thoại</th>
                        <th scope="col">Địa chỉ</th>
                        <th scope="col">Giới tính</th>
                        <th scope="col">Quốc tịch</th>
                        <th scope="col">Trạng thái</th>
                        <th scope="col">Sửa</th>
                        <th scope="col">Xóa</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(customer, index) in paginatedCustomers" :key="customer._id">
                        <th scope="row">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</th>
                        <td>{{ customer.name }}</td>
                        <td>{{ customer.cccd }}</td>
                        <td>{{ customer.phone }}</td>
                        <td>{{ customer.address }}</td>
                        <td>{{ customer.gioitinh }}</td>
                        <td>{{ customer.nationality }}</td>
                        <td v-if="customer.xoaCustomer == false">
                           <p class="xoaCustomerFalse fw-bold">Ngừng hoạt động</p>
                        </td>
                        <td v-else>
                           <p class="xoaCustomerTrue fw-bold">Hoạt động</p>
                        </td>
                        <td>
                            <button @click="editCustomerData(customer)" type="button" class="btn btn-warning shadow"><i class="fa-solid fa-pen-to-square text-white"></i></button>
                        </td>
                        <td>
                            <button type="button" class="btn btn-danger shadow" @click="deleteCustomer(customer._id)"><i class="fa-solid fa-xmark"></i></button>
                        </td>
                    </tr>
                    <tr v-if="!filteredCustomers.length">
                        <td colspan="9">Không tìm thấy khách hàng</td>
                    </tr>
                </tbody>
            </table>

            <!-- Pagination Controls -->
            <nav aria-label="Page navigation">
                    <ul class="pagination">
                        <li class="page-item" :class="{ 'disabled': currentPage === 1 }">
                            <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">Previous</a>
                        </li>
                        <li class="page-item" :class="{ 'active': currentPage === page }" v-for="page in totalPages" :key="page">
                            <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
                        </li>
                        <li class="page-item" :class="{ 'disabled': currentPage === totalPages }">
                            <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">Next</a>
                        </li>
                    </ul>
                </nav>

            <!-- Success Message -->
            <div v-if="showSuccessMessage" class="success-message">
                <span class="checkmark">✔️</span>
                <span>{{ successMessage }}</span>
            </div>

            <!-- Add Customer Modal -->
            <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
                <div class="modal-content">
                    <h2 class="modal-title text-info">Thêm Khách Hàng</h2>
                    <form @submit.prevent="addCustomer">

                        <div class="d-flex justify-content-between align-items-center ">
                            <div class="mb-3">
                                <label for="name" class="form-label">Họ và tên</label>
                                <input type="text" id="name" v-model="newCustomer.name" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label for="email" class="form-label">Email</label>
                                <input type="text" id="email" v-model="newCustomer.email" class="form-control" required>
                            </div>
                        </div>

                        <div class="d-flex justify-content-between align-items-center ">
                            <div class="mb-3">
                                <label for="cccd" class="form-label">Căn cước công dân</label>
                                <input type="text" id="cccd" v-model="newCustomer.cccd" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label for="phone" class="form-label">Số điện thoại</label>
                                <input type="text" id="phone" v-model="newCustomer.phone" class="form-control" required>
                            </div>
                        </div>

                       <div class="d-flex justify-content-between align-items-center">
                        <div class="mb-3">
                            <label for="address" class="form-label">Địa chỉ</label>
                            <input type="text" id="address" v-model="newCustomer.address" class="form-control" required>
                        </div>
                        
                        <div class="mb-3">
                            <label for="nationality" class="form-label">Quốc tịch</label>
                            <input type="text" id="nationality" v-model="newCustomer.nationality" class="form-control" required>
                        </div>
                       </div>
                        
                        
                        

                        <div class="mb-3">
                            <label for="gioitinh" class="form-label">Giới tính</label>
                            <select id="gioitinh" v-model="newCustomer.gioitinh" class="form-select" required>
                                <option value="">Chọn giới tính</option>
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                            </select>
                        </div>
                        <button type="submit" class="btn btn-primary">Thêm</button>
                        <button type="button" class="btn btn-secondary ms-2" @click="showModal = false">Hủy</button>
                    </form>
                </div>
            </div>

            <!-- Edit Customer Modal -->
            <div v-if="showModalEdit" class="modal-overlay" @click.self="showModalEdit = false">
                <div class="modal-content">
                    <h2 class="modal-title text-info">Chỉnh sửa Khách Hàng</h2>
                    <form @submit.prevent="updateCustomer">

                        <div class="d-flex justify-content-between align-items-center ">
                            <div class="mb-3">
                                <label for="editName" class="form-label">Họ và tên</label>
                                <input type="text" id="editName" v-model="editCustomer.name" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label for="editEmail" class="form-label">Email</label>
                                <input type="text" id="editEmail" v-model="editCustomer.email" class="form-control" required>
                            </div>
                        </div>

                        <div  class="d-flex justify-content-between align-items-center ">
                            <div class="mb-3">
                                <label for="editCccd" class="form-label">Căn cước công dân</label>
                                <input type="text" id="editCccd" v-model="editCustomer.cccd" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label for="editPhone" class="form-label">Số điện thoại</label>
                                <input type="text" id="editPhone" v-model="editCustomer.phone" class="form-control" required>
                            </div>
                        </div>

                        <div class="d-flex justify-content-between align-items-center " >
                            <div class="mb-3">
                                <label for="editAddress" class="form-label">Địa chỉ</label>
                                <input type="text" id="editAddress" v-model="editCustomer.address" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label for="editNationality" class="form-label">Quốc tịch</label>
                                <input type="text" id="editNationality" v-model="editCustomer.nationality" class="form-control" required>
                            </div>
                           
                        </div>

                        <div class="mb-3">
                                <label for="editGioitinh" class="form-label">Giới tính</label>
                                <select id="editGioitinh" v-model="editCustomer.gioitinh" class="form-select" required>
                                    <option value="">Chọn giới tính</option>
                                    <option value="Nam">Nam</option>
                                    <option value="Nữ">Nữ</option>
                                </select>
                            </div>
                       
                        
                        
                        
                        <button type="submit" class="btn btn-primary">Cập nhật</button>
                        <button type="button" class="btn btn-secondary ms-2" @click="showModalEdit = false">Hủy</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import api from '../api';
export default {
    data() {
        return {
            showSuccessMessage: false,
            successMessage: '',
            showModal: false,
            showModalEdit: false,
            newCustomer: {
                name: '',
                email: '',
                cccd: '',
                phone: '',
                address: '',
                gioitinh: '',
                nationality: ''
            },
            editCustomer: {
                _id: '',
                name: '',
                email: '',
                cccd: '',
                phone: '',
                address: '',
                gioitinh: '',
                nationality: ''
            },
            customers: [], // Array to hold customers data
            currentPage: 1, // Current active page
            itemsPerPage: 5, // Number of items to show per page
            totalItems: 0 ,// Total number of items (rooms)
            searchQuery: '', // Holds the search input for filtering by room number
            customerPhoneQuery: '',    // For room type search
            customerCccd: '', 
        };
    },
    computed: {
        // Filter rooms based on the search query for both room number and room type
        filteredCustomers() {
        return this.customers.filter(customer => {
            const matchesCustomerName = customer.name?.toString().includes(this.searchQuery);
            const matchesCustomerPhone = (customer.phone || '').toLowerCase().includes(this.customerPhoneQuery.toLowerCase());
            const matchesCustomerCccd = (customer.cccd || '').toLowerCase().includes(this.customerCccd.toLowerCase());

            return matchesCustomerName && matchesCustomerPhone && matchesCustomerCccd;
        });
    },
        paginatedCustomers() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredCustomers.slice(start, end); // Paginate only the filtered rooms
        },
        // Update total pages based on filtered rooms
        totalPages() {
            return Math.ceil(this.filteredCustomers.length / this.itemsPerPage); // Calculate total pages from filtered rooms
        }

    },
    methods: {
        async getAllCustomer() {
            try {
        const response = await api.get('/customers');
        console.log(response.data); // Log data to check if it's correct
        this.customers = response.data; // Set customers data
        this.totalItems = this.customers.length; // Set total number of customers
    } catch (error) {
        console.error('Error fetching customers:', error);
    }
        },
         // ... existing methods
         changePage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
            }
        },
        async addCustomer() {
            try {
                const response = await api.post('/customers', this.newCustomer);
                if (response.status === 201) { // 201 Created status
                    this.newCustomer = {
                        name: '',
                        email: '',
                        cccd: '',
                        phone: '',
                        address: '',
                        gioitinh: '',
                        nationality: ''
                    };
                    this.showModal = false;
                    await this.getAllCustomer();
                    this.successMessage = 'Thêm khách hàng thành công!';
                    this.showSuccessMessage = true;
                    setTimeout(() => this.showSuccessMessage = false, 3000);
                } else {
                    this.successMessage = 'Thêm khách hàng thất bại';
                    this.showSuccessMessage = true;
                    setTimeout(() => this.showSuccessMessage = false, 3000);
                }
            } catch (error) {
                console.log('Error adding customer:', error);
                this.successMessage = 'Có lỗi xảy ra khi thêm khách hàng';
                this.showSuccessMessage = true;
                setTimeout(() => this.showSuccessMessage = false, 3000);
            }
        },
        async deleteCustomer(id) {
            try {
                const response = await api.delete(`/customers/${id}`);
                if (response.status === 200) { // 200 OK status
                    await this.getAllCustomer();
                    this.successMessage = 'Xóa khách hàng thành công!';
                    this.showSuccessMessage = true;
                    setTimeout(() => this.showSuccessMessage = false, 3000);
                } else {
                    this.successMessage = 'Xóa khách hàng thất bại';
                    this.showSuccessMessage = true;
                    setTimeout(() => this.showSuccessMessage = false, 3000);
                }
            } catch (error) {
                console.log('Error deleting customer:', error);
                this.successMessage = 'Có lỗi xảy ra khi xóa khách hàng';
                this.showSuccessMessage = true;
                setTimeout(() => this.showSuccessMessage = false, 3000);
            }
        },
        async updateCustomer() {
            try {
                const response = await api.put(`/customers/${this.editCustomer._id}`, this.editCustomer);
                if (response.status === 200) { // 200 OK status
                    this.showModalEdit = false;
                    await this.getAllCustomer();
                    this.successMessage = 'Cập nhật khách hàng thành công!';
                    this.showSuccessMessage = true;
                    setTimeout(() => this.showSuccessMessage = false, 3000);
                } else {
                    this.successMessage = 'Cập nhật khách hàng thất bại';
                    this.showSuccessMessage = true;
                    setTimeout(() => this.showSuccessMessage = false, 3000);
                }
            } catch (error) {
                console.log('Error updating customer:', error);
                this.successMessage = 'Có lỗi xảy ra khi cập nhật khách hàng';
                this.showSuccessMessage = true;
                setTimeout(() => this.showSuccessMessage = false, 3000);
            }
        },
        editCustomerData(customer) {
            this.editCustomer = { ...customer };
            this.showModalEdit = true;
        }
    },
    created() {
        this.getAllCustomer();
    }
}
</script>

<style scoped>
.customer {
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

.btn-primary {
    background-color: #007bff;
    border: none;
    color: #fff;
}

.btn-primary:hover {
    background-color: #0056b3;
}

.btn-secondary {
    background-color: #6c757d;
    border: none;
    color: #fff;
}

.btn-secondary:hover {
    background-color: #5a6268;
}

.success-message {
    position: fixed;
    top: 10px;
    right: 10px;
    background: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
    border-radius: 5px;
    padding: 10px 20px;
    display: flex;
    align-items: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.checkmark {
    font-size: 20px;
    margin-right: 10px;
}
.search-bar{
    margin-left: 10px;
}
.xoaCustomerFalse {
    color: #ff9375;
}
.xoaCustomerTrue {
    color: #2def5a;
}
</style>
