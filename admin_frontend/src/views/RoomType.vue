<template>
    <div class="roomtype">
        <h1>Danh Mục Loại Phòng</h1>
        
        <!-- Form tạo loại phòng -->
        <form @submit.prevent="addRoomType">
            <div class="input-group">
                <label for="roomTypeInput" class="form-label">Loại phòng</label>
                <input type="text" class="form-control" id="roomTypeInput"  placeholder="Nhập loại phòng...">
            </div>
            <button type="submit" class="btn-create">Tạo</button>
        </form>

        <!-- Danh sách loại phòng -->
        <div class="roomtype-list">
            <h2>Danh sách loại phòng</h2>
            <ul>
                <li >Phòng đơn</li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            newRoomType: '',
            roomTypes: [] // Danh sách các loại phòng
        };
    },
    methods: {
        addRoomType() {
            if (this.newRoomType.trim()) {
                this.roomTypes.push(this.newRoomType.trim());
                this.newRoomType = ''; // Reset input
            }
        }
    }
};
</script>

<style scoped>
.roomtype {
    background: #f7f9fc;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    margin: auto;
}

.roomtype h1 {
    font-size: 1.5rem;
    color: #333;
    margin-bottom: 1.5rem;
    text-align: center;
}

.roomtype .input-group {
    margin-bottom: 1rem;
}

.roomtype .form-label {
    display: block;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #555;
}

.roomtype .form-control {
    width: 100%;
    padding: 0.8rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1rem;
}

.roomtype .form-control:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

.btn-create {
    display: block;
    width: 100%;
    padding: 0.8rem;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s;
}

.btn-create:hover {
    background-color: #0056b3;
}

.roomtype-list {
    margin-top: 2rem;
    padding: 1rem;
    background-color: #ffffff;
    border-radius: 5px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.roomtype-list h2 {
    font-size: 1.2rem;
    color: #333;
    margin-bottom: 1rem;
    text-align: center;
}

.roomtype-list ul {
    list-style: none;
    padding: 0;
}

.roomtype-list li {
    padding: 0.5rem;
    font-size: 1rem;
    color: #555;
    border-bottom: 1px solid #eee;
}

.roomtype-list li:last-child {
    border-bottom: none;
}
</style>
