<template>
    <div class="customer">
        <div class="customer--body">
            <h1 class="text-center text-info fw-bold">Quản lý nhân viên</h1>

            <div class="d-grid gap-2 d-md-flex justify-content-md-end mb-2">
                <button class="btn btn-success me-md-2" type="button"><i class="fas fa-plus "></i> <router-link to="/role" class="text-decoration-none text-white">Công Việc</router-link> </button>
                <button @click="showModal = true" class="btn btn-success me-md-2" type="button"><i class="fas fa-plus"></i> Thêm Nhân Viên</button>
                
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

                

                <!-- <div class="search-bar">
                    <input 
                        type="text" 
                        v-model="customerCccd" 
                        placeholder="Tìm kiếm theo cccd" 
                        class="form-control mb-3" 
                    />
                </div> -->

                

            </div>

            <table class="table table-striped table-hover text-center table-borderless">
                <thead class="">
                    <tr>
                        <th scope="col">STT</th>
                        <th scope="col">Họ và tên</th>
                        <th scope="col">Công việc</th>
                        <th scope="col">Email</th>
                        <th scope="col">Số điện thoại</th>
                        <th scope="col">Địa chỉ</th> 
                        <th scope="col">Sửa</th>
                        <th scope="col">Xóa</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(staff, index) in paginatedStaffs" :key="staff._id">
                        <th scope="row">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</th>
                        <td>{{ staff.name }}</td>
                        <td class="text-primary">
                            {{ staff.role }}
                        </td>
                        <td>{{ staff.email }}</td>
                        <td>{{ staff.phone }}</td>
                        <td>{{ staff.address }}</td>                      
                        <td>
                            <button @click="editStaffData(staff)" type="button" class="btn btn-warning shadow"><i class="fa-solid fa-pen-to-square text-white"></i></button>
                        </td>
                        <td>
                            <button type="button" class="btn btn-danger shadow" @click="deleteStaff(staff._id)"><i class="fa-solid fa-xmark"></i></button>
                        </td>
                    </tr>
                    <tr v-if="!filteredStaffs.length">
                        <td colspan="6">Không tìm thấy nhân viên</td>
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
                    <h2 class="modal-title text-info">Thêm Nhân Viên</h2>
                    <form @submit.prevent="addStaff">
                        <div class="mb-3">
                            <label for="name" class="form-label">Họ và tên</label>
                            <input type="text" id="name" v-model="newStaff.name" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label for="email" class="form-label">Email</label>
                            <input type="text" id="email" v-model="newStaff.email" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label for="password" class="form-label">Mật khẩu</label>
                            <input type="password" id="password" v-model="newStaff.password" class="form-control" required>
                        </div>
                        
                        <div class="mb-3">
                            <label for="phone" class="form-label">Số điện thoại</label>
                            <input type="text" id="phone" v-model="newStaff.phone" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label for="address" class="form-label">Địa chỉ</label>
                            <input type="text" id="address" v-model="newStaff.address" class="form-control" required>
                        </div>

                        <!-- Chỉnh sửa phần thêm nhân viên -->
                            <label for="role" class="form-label">Chức vụ</label>
                            <select id="role" v-model="newStaff.role" class="form-select" required>
                                <option v-for="role in roles" :key="role._id" :value="role.name">
                                    {{ role.name }}
                                </option>
                            </select>

                       
                        
                        
                        <button type="submit" class="btn btn-primary">Thêm</button>
                        <button type="button" class="btn btn-secondary ms-2" @click="showModal = false">Hủy</button>
                    </form>
                </div>
            </div>

           







            <!-- Edit Customer Modal -->
            <div v-if="showModalEdit" class="modal-overlay" @click.self="showModalEdit = false">
                <div class="modal-content">
                    <h2 class="modal-title text-info">Chỉnh sửa Nhân Viên</h2>
                    <form @submit.prevent="updateStaff">
                        <div class="mb-3">
                            <label for="editName" class="form-label">Họ và tên</label>
                            <input type="text" id="editName" v-model="editStaff.name" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label for="editEmail" class="form-label">Email</label>
                            <input type="text" id="editEmail" v-model="editStaff.email" class="form-control" required>
                        </div>
                       
                        <div class="mb-3">
                            <label for="editPhone" class="form-label">Số điện thoại</label>
                            <input type="text" id="editPhone" v-model="editStaff.phone" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label for="editAddress" class="form-label">Địa chỉ</label>
                            <input type="text" id="editAddress" v-model="editStaff.address" class="form-control" required>
                        </div>

                         <!-- Chỉnh sửa phần thêm nhân viên -->
                         <label for="role" class="form-label">Chức vụ</label>
                            <select id="role" v-model="editStaff.role" class="form-select" required>
                                <option v-for="role in roles" :key="role._id" :value="role.name">
                                    {{ role.name }}
                                </option>
                            </select>
                        
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
            newStaff: {
                name: '',
                email: '',
                phone: '',
                address: '',
                password:'',
                role:'',
            },
            editStaff: {
                _id: '',
                name: '',
                email: '',
                phone: '',
                address: '',
                role:'',
             
            },
           
            staffs: [], // Array to hold customers data
            roles:[],
            currentPage: 1, // Current active page
            itemsPerPage: 5, // Number of items to show per page
            totalItems: 0 ,// Total number of items (rooms)
            searchQuery: '', // Holds the search input for filtering by room number
            customerPhoneQuery: '',    // For room type search
           
        };
    },
    computed: {
        // Filter rooms based on the search query for both room number and room type
        filteredStaffs() {
        return this.staffs.filter(staff => {
            const matchesCustomerName = staff.name?.toString().includes(this.searchQuery);
            const matchesCustomerPhone = (staff.phone || '').toLowerCase().includes(this.customerPhoneQuery.toLowerCase());
            return matchesCustomerName && matchesCustomerPhone;
        });
    },
        paginatedStaffs() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredStaffs.slice(start, end); // Paginate only the filtered rooms
        },
        // Update total pages based on filtered rooms
        totalPages() {
            return Math.ceil(this.filteredStaffs.length / this.itemsPerPage); // Calculate total pages from filtered rooms
        }

    },
    methods: {
        async getAllStaff() {
            try {
        const response = await api.get('/staff');
        console.log(response.data); // Log data to check if it's correct
        this.staffs = response.data; // Set customers data
        this.totalItems = this.staffs.length; // Set total number of customers
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
        async addStaff() {
            try {
                const response = await api.post('/staff', this.newStaff);
                if (response.status === 201) { // 201 Created status
                    this.newStaff = {
                        name: '',
                        email: '',
                        phone: '',
                        address: '',
                        password:'',
                        role:'',
                       
                    };
                    this.showModal = false;
                    await this.getAllStaff();
                    this.successMessage = 'Thêm nhân viên thành công!';
                    this.showSuccessMessage = true;
                    setTimeout(() => this.showSuccessMessage = false, 3000);
                } else {
                    this.successMessage = 'Thêm nhân viên thất bại';
                    this.showSuccessMessage = true;
                    setTimeout(() => this.showSuccessMessage = false, 3000);
                }
            } catch (error) {
                console.log('Error adding customer:', error);
                this.successMessage = 'Có lỗi xảy ra khi thêm nhân viên';
                this.showSuccessMessage = true;
                setTimeout(() => this.showSuccessMessage = false, 3000);
            }
        },
        async deleteStaff(id) {
            try {
                const isConfirmed = window.confirm('Bạn có chắc chắn muốn xóa nhân viên này không?');
                if (!isConfirmed) {
                    return; // Dừng hàm nếu người dùng chọn "Hủy"
                }

                const response = await api.delete(`/staff/${id}`);
                if (response.status === 200) { // 200 OK status
                    await this.getAllStaff();
                    this.successMessage = 'Xóa nhân viên thành công!';
                    this.showSuccessMessage = true;
                    setTimeout(() => this.showSuccessMessage = false, 3000);
                } else {
                    this.successMessage = 'Xóa nhân viên thất bại';
                    this.showSuccessMessage = true;
                    setTimeout(() => this.showSuccessMessage = false, 3000);
                }
            } catch (error) {
                console.log('Error deleting staff:', error);
                this.successMessage = 'Có lỗi xảy ra khi xóa nhân viên';
                this.showSuccessMessage = true;
                setTimeout(() => this.showSuccessMessage = false, 3000);
            }
        },

        async updateStaff() {
            try {
                const response = await api.put(`/staff/${this.editStaff._id}`, this.editStaff);
                if (response.status === 200) { // 200 OK status
                    this.showModalEdit = false;
                    await this.getAllStaff();
                    this.successMessage = 'Cập nhật nhân viên thành công!';
                    this.showSuccessMessage = true;
                    setTimeout(() => this.showSuccessMessage = false, 3000);
                } else {
                    this.successMessage = 'Cập nhật nhân viên thất bại';
                    this.showSuccessMessage = true;
                    setTimeout(() => this.showSuccessMessage = false, 3000);
                }
            } catch (error) {
                console.log('Error updating customer:', error);
                this.successMessage = 'Có lỗi xảy ra khi cập nhật nhân viên';
                this.showSuccessMessage = true;
                setTimeout(() => this.showSuccessMessage = false, 3000);
            }
        },
        editStaffData(staff) {
            this.editStaff = { ...staff };
            this.showModalEdit = true;
        },
        async getRole() {
            try {
                const response = await api.get('/role');
                this.roles = response.data;
            } catch (error) {
                console.error('Error fetching customers:', error);
            }
        }
        
    },
    created() {
        this.getAllStaff();
        this.getRole();
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
    padding: 1.5rem; /* Giảm padding */
    border-radius: 10px;
    width: 80%; /* Giảm chiều rộng */
    max-width: 400px; /* Giảm kích thước tối đa */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
   
}


.modal-title {
    margin-bottom: 5px;
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

.role--list {
    margin-top: 2rem;
    padding: 1rem;
    background-color: #ffffff;
    border-radius: 5px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.role--list h2 {
    font-size: 1.2rem;
    color: #333;
    margin-bottom: 1rem;
    text-align: center;
}

.role--list ul {
    list-style: none;
    padding: 0;
}

.role--list li {
    padding: 0.5rem;
    font-size: 1rem;
    color: #555;
    border-bottom: 1px solid #eee;
}

.role--list li:last-child {
    border-bottom: none;
}
</style>
