<template>
    <div class="billManager">
        <div class="billManager--body">
            <h1 class="text-center fw-bold">Quản lý hóa đơn</h1>

            <!-- <div class="d-grid gap-2 d-md-flex justify-content-md-end mb-2">
                <button @click="showModal = true" class="btn btn-success me-md-2" type="button">Thêm sản phẩm</button>
            </div> -->

            <div class="d-flex">
                <!-- Search Bar -->
                <div class="search-bar">
                    <input 
                        type="text" 
                        v-model="searchQuery" 
                        placeholder="Tìm kiếm theo tên" 
                        class="form-control mb-3" 
                    />
                </div>

               

                

            </div>

            <table class="table table-bordered text-center">
                <thead class="table-secondary">
                    <tr>
                        <th scope="col">STT</th>
                        <th scope="col">Ngày lập</th>
                        <th scope="col">Tên nhân viên</th>
                        <th scope="col">Chi tiết</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(menu, index) in paginatedMenu" :key="menu._id">
                        <th scope="row">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</th>
                        <td>{{ menu.name }}</td>
                        <td>{{ formatCurrency(menu.price) }}</td>
                        <td>
                            <button @click="editMenuData(menu)" type="button" class="btn btn-warning">Sửa</button>
                        </td>
                    </tr>
                    <tr v-if="!filteredMenus.length">
                        <td colspan="6">Không tìm thấy sản phẩm</td>
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

            <!-- Edit Room Modal -->
            <div v-if="showModalEdit" class="modal-overlay" @click.self="showModalEdit = false">
                <div class="modal-content">
                    <h2 class="modal-title">Sửa Phòng</h2>
                    <form @submit.prevent="updateMenu">
                        <div class="mb-3">
                            <label for="editName" class="form-label">Tên</label>
                            <input type="text" id="editName" v-model="editMenu.name" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label for="editQuantity" class="form-label">Số lượng</label>
                            <input type="text" id="editQuantity" v-model="editMenu.quantity" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label for="editPrice" class="form-label">Giá sản phẩm</label>
                            <input type="text" id="editPrice" v-model="editMenu.price" class="form-control">
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
            newMenu: {
                name: '',
                price: '',
                quantity: '',
            },
            editMenu: {
                _id: '',
                name: '',
                price: '',
                quantity: '',
            },
            menuitems: [],// Array to hold rooms data
            currentPage: 1, // Current active page
            itemsPerPage: 5, // Number of items to show per page
            totalItems: 0 ,// Total number of items (rooms)
            searchQuery: '', // Holds the search input for filtering by room number
            menuPriceQuery: '',    // For room type search
            menuQuantity: '', 
        };
    },
    computed: {
        // Filter rooms based on the search query for both room number and room type
        filteredMenus() {
            return this.menuitems.filter(menu => {
                const matchesName = menu.name.toString().includes(this.searchQuery);
                return matchesName; // Match both room number and room type
            });
        },
        paginatedMenu() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredMenus.slice(start, end); // Paginate only the filtered rooms
        },
        // Update total pages based on filtered rooms
    totalPages() {
        return Math.ceil(this.filteredMenus.length / this.itemsPerPage); // Calculate total pages from filtered rooms
    }

    },
    methods: {
        async getAllMenu() {
            try {
                const response = await api.get('/menu');
                this.menuitems = response.data; // Set rooms data
                this.totalItems = this.menuitems.length; // Set total number of rooms for pagination
            } catch (error) {
                console.log('Error fetching rooms:', error);
            }
        },
         // ... existing methods
        changePage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
            }
        },
        // Format currency to VND without leading zero
            formatCurrency(value) {
                // Convert to integer if the value is a number
                const numberValue = typeof value === 'number' ? value : parseFloat(value);
                return `${numberValue.toLocaleString('it-IT')} VND`;
            },
        async addMenu() {
            try {
                const response = await api.post('/menu', this.newMenu);
                if (response.status === 201) { // 201 Created status
                    this.newMenu = {
                        name: '',
                        quantity: '',
                        price: '',
                    };
                    this.showModal = false;
                    await this.getAllMenu();
                    this.successMessage = 'Thêm sản phẩm thành công!';
                    this.showSuccessMessage = true;
                    setTimeout(() => this.showSuccessMessage = false, 3000);
                } else {
                    this.successMessage = 'Thêm sản phẩm thất bại';
                    this.showSuccessMessage = true;
                    setTimeout(() => this.showSuccessMessage = false, 3000);
                }
            } catch (error) {
                console.log('Error adding room:', error);
                this.successMessage = 'Có lỗi xảy ra khi thêm sp';
                this.showSuccessMessage = true;
                setTimeout(() => this.showSuccessMessage = false, 3000);
            }
        },
        async deleteMenu(id) {
            try {
                const response = await api.delete(`/menu/${id}`);
                if (response.status === 200) { // 200 OK status
                    await this.getAllMenu();
                    this.successMessage = 'Xóa sản phẩm thành công!';
                    this.showSuccessMessage = true;
                    setTimeout(() => this.showSuccessMessage = false, 3000);
                } else {
                    this.successMessage = 'Xóa sản phẩm thất bại';
                    this.showSuccessMessage = true;
                    setTimeout(() => this.showSuccessMessage = false, 3000);
                }
            } catch (error) {
                console.log('Error deleting menu:', error);
                this.successMessage = 'Có lỗi xảy ra khi xóa sản phẩm';
                this.showSuccessMessage = true;
                setTimeout(() => this.showSuccessMessage = false, 3000);
            }
        },
        async updateMenu() {
            try {
                const response = await api.put(`/menu/${this.editMenu._id}`, this.editMenu);
                if (response.status === 200) { // 200 OK status
                    this.showModalEdit = false;
                    await this.getAllMenu();
                    this.successMessage = 'Cập nhật sản phẩm thành công!';
                    this.showSuccessMessage = true;
                    setTimeout(() => this.showSuccessMessage = false, 3000);
                } else {
                    this.successMessage = 'Cập nhật sản phẩm thất bại';
                    this.showSuccessMessage = true;
                    setTimeout(() => this.showSuccessMessage = false, 3000);
                }
            } catch (error) {
                console.log('Error updating room:', error);
                this.successMessage = 'Có lỗi xảy ra khi cập nhật phòng';
                this.showSuccessMessage = true;
                setTimeout(() => this.showSuccessMessage = false, 3000);
            }
        },
        editMenuData(menu) {
            this.editMenu = { ...menu };
            this.showModalEdit = true;
        }
    },
    created() {
        this.getAllMenu();
    }
}
</script>

<style scoped>
.billManager {
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
    background: #7bef83;
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
    margin-right: 10px;
}
.search-bar input {
    max-width: 300px;
    margin-bottom: 15px;
}
</style>
