<template>
    <div class="roomManager">
        <div class="roomManager--body">
            <h1 class="text-center text-info fw-bold">Quản lý phòng</h1>

            <div class="d-grid gap-2 d-md-flex justify-content-md-end mb-2">
                <button class="btn btn-success me-md-2" type="button"><i class="fas fa-plus "></i> <router-link to="/roomtype" class="text-decoration-none text-white">Loại phòng</router-link> </button>
                <button @click="showModal = true" class="btn btn-success me-md-2" type="button"><i class="fas fa-plus "></i> Thêm phòng</button>
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

            <table class="table table-striped table-hover text-center table-borderless">
                <thead class="">
                    <tr class=" text-center">
                        <th scope="col">STT</th>
                        <th scope="col">Số phòng</th>
                        <th scope="col">Ảnh</th>
                        <th scope="col">Tình trạng</th>
                        <th scope="col">Giá phòng</th>
                        <th scope="col">Loại phòng</th>
                        <th scope="col">Sửa</th>
                        <th scope="col">Xóa</th>
                    </tr>
                </thead>
                <tbody class="text-center">
                    <tr v-for="(room, index) in paginatedRooms" :key="room._id">
                        <th scope="row">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</th>
                        <td>{{ room.roomNumber }}</td>
                        <td>
                            <img v-if="room.image" :src="`http://localhost:3000/uploads/${room.image}`" alt="Room Image" style="width: 100px; height: 100px; object-fit: cover;" />
                            <span v-else>Không có ảnh</span>
                        </td>
                        <td>{{ room.trangthai }}</td>
                        <td>{{ formatCurrency(room.price) }}</td>
                        <td>{{ room.type }}</td>
                        <td>
                            <button @click="editRoomData(room)" type="button" class="btn btn-warning"><i class="fa-solid fa-pen-to-square text-white"></i></button>
                        </td>
                        <td>
                            <button type="button" class="btn btn-danger" @click="deleteRoom(room._id)"><i class="fa-solid fa-xmark"></i></button>
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
                    <h2 class="modal-title text-center text-info">Thêm phòng</h2>
                    <form @submit.prevent="addRoom" class="addRoom">

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
                                <label for="roomName" class="form-label">Tên phòng</label>
                                <input type="text" id="roomName" v-model="newRoom.roomName" class="form-control" required>
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
                                <label for="adults" class="form-label">Người lớn</label>
                                <input type="text" id="adults" v-model="newRoom.adults" class="form-control" required>
                            </div>
                        

                        <div class="mb-3">
                                <label for="children" class="form-label">Trẻ em</label>
                                <input type="text" id="children" v-model="newRoom.children" class="form-control" required>
                            </div>

                        <div class="mb-3">
                            <label for="description" class="form-label">Thông tin</label>
                            <textarea class="form-control" id="description" v-model="newRoom.description" rows="3"></textarea>
                        </div>
                        
                        
                        
                        <div class="mb-3">
                            <label for="image">Room Image:</label>
                            <input type="file" id="image" accept="image/*" required><br><br>
                        </div>
                        <button type="submit" class="btn btn-primary">Thêm</button>
                        <button type="button" class="btn btn-secondary ms-2" @click="showModal = false">Hủy</button>
                    </form>
                </div>
            </div>

            <!-- Edit Room Modal -->
            <div v-if="showModalEdit" class="modal-overlay" @click.self="showModalEdit = false">
                <div class="modal-content">
                    <h2 class="modal-title text-center text-info">Chỉnh Sửa Phòng</h2>
                    <form @submit.prevent="updateRooms" class="editRoom">
                       
                        
                            <div class="mb-3">
                                <label for="editRoomNumber" class="form-label">Số phòng</label>
                                <input type="text" id="editRoomNumber" v-model="editRoom.roomNumber" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label for="editType" class="form-label">Loại phòng</label>
                                <select id="editType" v-model="editRoom.type" class="form-select" required>
                                    <option value="">Chọn loại phòng</option>
                                    <option value="single">Phòng đơn</option>
                                    <option value="Double">Phòng đôi</option>
                                    <option value="family">Phòng gia đình</option>
                                </select>
                            </div>

                            
                       

                      
                        
                            <div class="mb-3">
                                <label for="editPrice" class="form-label">Giá phòng</label>
                                <input type="text" id="editPrice" v-model="editRoom.price" class="form-control" required>
                            </div>
                            
                            <div class="mb-3">
                                <label for="editRoomName" class="form-label">Tên phòng</label>
                                <input type="text" id="editRoomName" v-model="editRoom.roomName" class="form-control" required>
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
                                <label for="editAdults" class="form-label">Người lớn</label>
                                <input type="text" id="editAdults" v-model="editRoom.adults" class="form-control" required>
                            </div>
                      

                        
                            <div class="mb-3">
                                <label for="editChildren" class="form-label">Trẻ em</label>
                                <input type="text" id="editChildren" v-model="editRoom.children" class="form-control" required>
                            </div>

                        
                            <div class="mb-3">
                                <label for="editDescription" class="form-label">Thông tin</label>
                                <textarea class="form-control" id="editDescription" v-model="editRoom.description" rows="3"></textarea>
                            </div>
                        
                        
                        <div class="mb-2">
                            <label for="image">Ảnh phòng hiện tại:</label>
                            <img v-if="editRoom.image" :src="`http://localhost:3000/uploads/${editRoom.image}`" alt="Room Image" style="width: 100px; height: 100px; object-fit: cover;" />
                            <br />
                            <label for="image">Cập nhật ảnh mới:</label>
                            <input type="file" id="image" accept="image/*"><br><br>
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
                roomName:'',
                type: '',
                price: '',
                children:'',
                trangthai: '',
                adults:'',
                description:'',
                image: '' // Add this line to store image filename
            },
            editRoom: {
                _id: '',
                roomNumber: '',
                roomName:'',
                type: '',
                price: '',
                children:'',
                trangthai: '',
                maxGuests: '',
                description:'',
                image: '' // Add this line to store image filename
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
                const response = await api.get('/rooms');
                this.rooms = response.data; // Set rooms data
                this.totalItems = this.rooms.length; // Set total number of rooms for pagination
            } catch (error) {
                console.log('Error fetching rooms:', error);
            }
        },
        // Format currency to VND without leading zero
            formatCurrency(value) {
                // Convert to integer if the value is a number
                const numberValue = typeof value === 'number' ? value : parseFloat(value);
                return `${numberValue.toLocaleString('it-IT')} VND`;
            },
         // ... existing methods
        changePage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
            }
        },
        async addRoom() {
    try {
        const formData = new FormData();
        formData.append('roomNumber', this.newRoom.roomNumber);
        formData.append('roomName', this.newRoom.roomName);
        formData.append('type', this.newRoom.type);
        formData.append('price', this.newRoom.price);
        formData.append('adults', this.newRoom.adults);
        formData.append('children', this.newRoom.children);
        formData.append('trangthai', this.newRoom.trangthai);
        formData.append('maxGuests', this.newRoom.maxGuests);
        formData.append('description', this.newRoom.description);


        // Get the image file
        const imageFile = document.getElementById('image').files[0];
        if (imageFile) {
            formData.append('image', imageFile);
        } else {
            console.warn('No image file selected.');
        }

        const response = await api.post('/rooms/manager', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        // Handle the response
        if (response.status === 201) {
            this.newRoom = { roomNumber: '', roomName:'', children:'', adults:'', type: '', price: '', trangthai: '', maxGuests: '',description:'' };
            this.showModal = false;
            await this.getAllRooms(); // Refresh the room list
            this.successMessage = 'Thêm phòng thành công!';
            this.showSuccessMessage = true;

            setTimeout(() => {
                this.showSuccessMessage = false;
            }, 3000);
        }
    } catch (error) {
        console.error('Error adding room:', error);
        this.successMessage = 'Có lỗi xảy ra khi thêm phòng';
        this.showSuccessMessage = true;

        setTimeout(() => {
            this.showSuccessMessage = false;
        }, 3000);
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
                this.successMessage = error.response.data.message;
                this.showSuccessMessage = true;
                setTimeout(() => this.showSuccessMessage = false, 3000);

        //         if (error.response && error.response.data) {
        //     console.error(error.response.data.message); // Lấy thông báo lỗi từ server
        //     // Hiển thị thông báo lỗi trong giao diện người dùng
        //     alert(error.response.data.message); // "Phòng đang có người đặt, không thể xóa"
        // } else {
        //     console.error('Đã xảy ra lỗi không xác định');
        // }
            }
        },
            async updateRooms() {
                try {
                    const formData = new FormData();
                    formData.append('roomNumber', this.editRoom.roomNumber);
                    formData.append('roomName', this.editRoom.roomName);
                    formData.append('type', this.editRoom.type);
                    formData.append('price', this.editRoom.price);
                    formData.append('adults', this.editRoom.adults);
                    formData.append('children', this.editRoom.children);
                    formData.append('trangthai', this.editRoom.trangthai);
                    formData.append('maxGuests', this.editRoom.maxGuests);
                    formData.append('description', this.editRoom.description);

                    // Get the image file
                    const imageFile = document.getElementById('image').files[0];
                    if (imageFile) {
                        formData.append('image', imageFile);
                    }

                    const response = await api.put(`/rooms/manager/${this.editRoom._id}`, formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });

                    if (response.status === 200) { // 200 OK status
                        this.showModalEdit = false;
                        await this.getAllRooms(); // Refresh the room list
                        this.successMessage = 'Cập nhật phòng thành công!';
                        this.showSuccessMessage = true;
                        setTimeout(() => this.showSuccessMessage = false, 3000);
                    } else {
                        this.successMessage = 'Cập nhật phòng thất bại';
                        this.showSuccessMessage = true;
                        setTimeout(() => this.showSuccessMessage = false, 3000);
                    }
                } catch (error) {
                    console.error('Error updating room:', error);
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
    padding: 1rem; /* Reduced padding */
    border-radius: 8px; /* Slightly smaller border radius */
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6); /* Slightly darker overlay */
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-content {
    background: #fff;
    padding: 1.5rem; /* Reduced padding */
    border-radius: 8px; /* Slightly smaller border radius */
    width: 100%; /* Adjusted for smaller screens */
    max-width: 700px; /* Smaller max width */
    /* height: 600px; */
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1); /* Smaller shadow */
}

.modal-title {
    margin-bottom: 0.5rem; /* Reduced margin */
}

.form-label {
    margin-bottom: 0.3rem; /* Reduced margin */
    font-weight: bold;
    font-size: 0.9rem; /* Slightly smaller font size */
}

.form-control, .form-select {
    margin-bottom: 0.5rem; /* Reduced margin */
    font-size: 0.9rem; /* Slightly smaller font size */
}

.btn-primary {
    background-color: #007bff;
    border: none;
    color: #fff;
    font-size: 0.9rem; /* Slightly smaller font size */
    padding: 0.4rem 0.8rem; /* Reduced padding */
}

.btn-primary:hover {
    background-color: #0056b3;
}

.btn-secondary {
    background-color: #6c757d;
    border: none;
    color: #fff;
    font-size: 0.9rem; /* Slightly smaller font size */
    padding: 0.4rem 0.8rem; /* Reduced padding */
}

.btn-secondary:hover {
    background-color: #5a6268;
}

.success-message {
    position: fixed;
    top: 5px; /* Reduced distance from the top */
    right: 5px; /* Reduced distance from the right */
    background: #7bef83; /* You can keep or adjust the color */
    padding: 0.5rem; /* Reduced padding */
    border-radius: 5px; /* Smaller border radius */
    font-size: 0.9rem; /* Slightly smaller font size */
}

.table {
    font-size: 0.9rem; /* Smaller font size for table */
}

.table img {
    width: 80px; /* Reduced image width */
    height: 80px; /* Reduced image height */
    object-fit: cover;
}
.addRoom,
.editRoom {
    display: grid;
  grid-template-columns: repeat(3, 1fr); /* Creates three equal columns */
  grid-template-rows: auto; /* Adjusts row height automatically */
  gap: 20px; 
}



</style>
