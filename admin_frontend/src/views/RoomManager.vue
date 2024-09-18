<template>
    <div class="roomManager">
        <div class="roomManager--body">
            <h1 class="text-center fw-bold">Quản lý phòng</h1>

            <div class="d-grid gap-2 d-md-flex justify-content-md-end mb-2">
                <button @click="showModal = true" class="btn btn-success me-md-2" type="button">Thêm phòng</button>
            </div>

            <div class="d-flex">
                <!-- Search Bar -->
                <div class="search-bar">
                    <input 
                        type="text" 
                        v-model="searchQuery" 
                        placeholder="Tìm kiếm theo số phòng" 
                        class="form-control mb-3" 
                    />
                </div>

                <!-- Search Bar for Room Type -->
                <div class="search-bar">
                    <!-- <label for="type" class="form-label">Loại phòng</label> -->
                    <select id="type" v-model="roomTypeQuery" class="form-select" required>
                        <option value="">Chọn loại phòng</option>
                        <option value="single">Phòng đơn</option>
                        <option value="Double">Phòng đôi</option>
                        <option value="family">Phòng gia đình</option>
                    </select>
                </div>

                <!-- Search Bar for Room Type -->
                <div class="search-bar">
                    <!-- <label for="type" class="form-label">Loại phòng</label> -->
                     <select id="type" v-model="roomTrangthai" class="form-select" required>
                        <option value="">Trạng thái phòng</option>
                        <option value="Đã dọn dẹp">Đã dọn dẹp</option>
                        <option value="Chưa dọn dẹp">Chưa dọn dẹp</option>
                    </select>
                </div>

            </div>

            <table class="table table-bordered text-center">
                <thead class="table-secondary">
                    <tr>
                        <th scope="col">STT</th>
                        <th scope="col">Số phòng</th>
                        <th scope="col">Tình trạng</th>
                        <th scope="col">Loại phòng</th>
                        <th scope="col">Sửa</th>
                        <th scope="col">Xóa</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(room, index) in paginatedRooms" :key="room._id">
                        <th scope="row">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</th>
                        <td>{{ room.roomNumber }}</td>
                        <td>{{ room.trangthai }}</td>
                        <td>{{ room.type }}</td>
                        <td>
                            <button @click="editRoomData(room)" type="button" class="btn btn-warning">Sửa</button>
                        </td>
                        <td>
                            <button type="button" class="btn btn-danger" @click="deleteRoom(room._id)">Xóa</button>
                        </td>
                    </tr>
                    <tr v-if="!filteredRooms.length">
                        <td colspan="6">Không tìm thấy phòng</td>
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

            <!-- Add Room Modal -->
            <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
                <div class="modal-content">
                    <h2 class="modal-title">Thêm phòng</h2>
                    <form @submit.prevent="addRoom">
                        <div class="mb-3">
                            <label for="roomNumber" class="form-label">Số phòng</label>
                            <input type="text" id="roomNumber" v-model="newRoom.roomNumber" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label for="type" class="form-label">Loại phòng</label>
                            <select id="type" v-model="newRoom.type" class="form-select" required>
                                <option value="">Chọn loại phòng</option>
                                <option value="single">Phòng đơn</option>
                                <option value="Double">Phòng đôi</option>
                                <option value="family">Phòng gia đình</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="price" class="form-label">Giá phòng</label>
                            <input type="text" id="price" v-model="newRoom.price" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label for="status" class="form-label">Trạng thái phòng trống</label>
                            <input type="text" id="status" v-model="newRoom.status" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label for="trangthai" class="form-label">Trạng thái</label>
                            <select id="trangthai" v-model="newRoom.trangthai" class="form-select" required>
                                <option value="">Chọn trạng thái</option>
                                <option value="Đã dọn dẹp">Đã dọn dẹp</option>
                                <option value="Chưa dọn dẹp">Chưa dọn dẹp</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="maxGuests" class="form-label">Số lượng khách</label>
                            <input type="text" id="maxGuests" v-model="newRoom.maxGuests" class="form-control" required>
                        </div>
                        <button type="submit" class="btn btn-primary">Thêm</button>
                        <button type="button" class="btn btn-secondary ms-2" @click="showModal = false">Hủy</button>
                    </form>
                </div>
            </div>

            <!-- Edit Room Modal -->
            <div v-if="showModalEdit" class="modal-overlay" @click.self="showModalEdit = false">
                <div class="modal-content">
                    <h2 class="modal-title">Sửa Phòng</h2>
                    <form @submit.prevent="updateRooms">
                        <div class="mb-3">
                            <label for="editRoomNumber" class="form-label">Số phòng</label>
                            <input type="text" id="editRoomNumber" v-model="editRoom.roomNumber" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label for="editType" class="form-label">Loại phòng</label>
                            <select id="editType" v-model="editRoom.type" class="form-select" required>
                                <option value="">Chọn loại phòng</option>
                                <option value="single">Phòng đơn</option>
                                <option value="double">Phòng đôi</option>
                                <option value="family">Phòng gia đình</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="editPrice" class="form-label">Giá phòng</label>
                            <input type="text" id="editPrice" v-model="editRoom.price" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label for="editStatus" class="form-label">Trạng thái phòng trống</label>
                            <input type="text" id="editStatus" v-model="editRoom.status" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label for="editTrangthai" class="form-label">Trạng thái</label>
                            <select id="editTrangthai" v-model="editRoom.trangthai" class="form-select" required>
                                <option value="">Chọn trạng thái</option>
                                <option value="Đã dọn dẹp">Đã dọn dẹp</option>
                                <option value="Chưa dọn dẹp">Chưa dọn dẹp</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="editMaxGuests" class="form-label">Số lượng khách</label>
                            <input type="text" id="editMaxGuests" v-model="editRoom.maxGuests" class="form-control" required>
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
            newRoom: {
                roomNumber: '',
                type: '',
                price: '',
                status: '',
                trangthai: '',
                maxGuests: '',
            },
            editRoom: {
                _id: '',
                roomNumber: '',
                type: '',
                price: '',
                status: '',
                trangthai: '',
                maxGuests: '',
            },
            rooms: [],// Array to hold rooms data
            currentPage: 1, // Current active page
            itemsPerPage: 5, // Number of items to show per page
            totalItems: 0 ,// Total number of items (rooms)
            searchQuery: '', // Holds the search input for filtering by room number
            roomTypeQuery: '',    // For room type search
            roomTrangthai: '', 
        };
    },
    computed: {
        // Filter rooms based on the search query for both room number and room type
        filteredRooms() {
            return this.rooms.filter(room => {
                const matchesRoomNumber = room.roomNumber.toString().includes(this.searchQuery);
                const matchesRoomType = room.type.toLowerCase().includes(this.roomTypeQuery.toLowerCase());
                const matchesRoomTrangthai = room.trangthai.toLowerCase().includes(this.roomTrangthai.toLowerCase());
                return matchesRoomNumber && matchesRoomType && matchesRoomTrangthai; // Match both room number and room type
            });
        },
        paginatedRooms() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredRooms.slice(start, end); // Paginate only the filtered rooms
        },
        // Update total pages based on filtered rooms
    totalPages() {
        return Math.ceil(this.filteredRooms.length / this.itemsPerPage); // Calculate total pages from filtered rooms
    }

    },
    methods: {
        async getAllRooms() {
            try {
                const response = await api.get('/rooms/manager');
                this.rooms = response.data; // Set rooms data
                this.totalItems = this.rooms.length; // Set total number of rooms for pagination
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
        async addRoom() {
            try {
                const response = await api.post('/rooms/manager', this.newRoom);
                if (response.status === 201) { // 201 Created status
                    this.newRoom = {
                        roomNumber: '',
                        type: '',
                        price: '',
                        status: '',
                        trangthai: '',
                        maxGuests: '',
                    };
                    this.showModal = false;
                    await this.getAllRooms();
                    this.successMessage = 'Thêm phòng thành công!';
                    this.showSuccessMessage = true;
                    setTimeout(() => this.showSuccessMessage = false, 3000);
                } else {
                    this.successMessage = 'Thêm phòng thất bại';
                    this.showSuccessMessage = true;
                    setTimeout(() => this.showSuccessMessage = false, 3000);
                }
            } catch (error) {
                console.log('Error adding room:', error);
                this.successMessage = 'Có lỗi xảy ra khi thêm phòng';
                this.showSuccessMessage = true;
                setTimeout(() => this.showSuccessMessage = false, 3000);
            }
        },
        async deleteRoom(id) {
            try {
                const response = await api.delete(`/rooms/manager/${id}`);
                if (response.status === 200) { // 200 OK status
                    await this.getAllRooms();
                    this.successMessage = 'Xóa phòng thành công!';
                    this.showSuccessMessage = true;
                    setTimeout(() => this.showSuccessMessage = false, 3000);
                } else {
                    this.successMessage = 'Xóa phòng thất bại';
                    this.showSuccessMessage = true;
                    setTimeout(() => this.showSuccessMessage = false, 3000);
                }
            } catch (error) {
                console.log('Error deleting room:', error);
                this.successMessage = 'Có lỗi xảy ra khi xóa phòng';
                this.showSuccessMessage = true;
                setTimeout(() => this.showSuccessMessage = false, 3000);
            }
        },
        async updateRooms() {
            try {
                const response = await api.put(`/rooms/manager/${this.editRoom._id}`, this.editRoom);
                if (response.status === 200) { // 200 OK status
                    this.showModalEdit = false;
                    await this.getAllRooms();
                    this.successMessage = 'Cập nhật phòng thành công!';
                    this.showSuccessMessage = true;
                    setTimeout(() => this.showSuccessMessage = false, 3000);
                } else {
                    this.successMessage = 'Cập nhật phòng thất bại';
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
        editRoomData(room) {
            this.editRoom = { ...room };
            this.showModalEdit = true;
        }
    },
    created() {
        this.getAllRooms();
    }
}
</script>

<style scoped>
.roomManager {
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
