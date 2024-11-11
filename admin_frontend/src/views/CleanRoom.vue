<template>
    <div class="assign-room">
      <h2>Phân công phòng dọn dẹp</h2>
  
      <!-- Thông báo khi không có phòng hoặc nhân viên -->
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
  
      <!-- Bảng hiển thị danh sách phòng và phân công -->
      <table v-if="rooms.length > 0 || cleanrooms.length > 0">
        <thead>
          <tr>
            <th>Phòng</th>
            <th>Tình trạng</th>
            <th>Nhân viên dọn dẹp</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <!-- Hiển thị phòng chưa dọn dẹp -->
          <tr v-for="(room, index) in rooms" :key="room._id">
            <td>{{ room.roomNumber }}</td>
            <td><span :class="{
                    'badge badge-in-progress': room.trangthai === 'Đang dọn dẹp', 
                    'badge badge-dirty': room.trangthai === 'Chưa dọn dẹp',
                    'badge badge-clean': room.trangthai === 'Đã dọn dẹp',

                  }">{{ room.trangthai }}</span></td>
            <td>
              <select v-model="assignments[index].staff">
                <option v-for="staff in staffMembers" :key="staff._id" :value="staff._id">
                  {{ staff.name }}
                </option>
              </select>
            </td>
            <td>
              <button @click="assignRoom(index)">Phân công</button>
            </td>
          </tr>
  
          <!-- Hiển thị phòng đã phân công -->
          <tr v-for="(cleanroom, index) in cleanrooms" :key="cleanroom._id">
            <td>{{ cleanroom.room.roomNumber }}</td>
            <td>
                <span :class="{
                    'badge badge-in-progress': cleanroom.room.trangthai === 'Đang dọn dẹp', 
                    'badge badge-dirty': cleanroom.room.trangthai === 'Chưa dọn dẹp',
                    'badge badge-clean': cleanroom.room.trangthai === 'Đã dọn dẹp',

                  }">{{ cleanroom.room.trangthai }}</span>
                </td>
            <td>
              <select disabled>
                <option>
                  {{ cleanroom.staff.name }}
                </option>
              </select>
            </td>
            <td>
              <button disabled class="me-2">Đã phân công</button>
              <button @click="updateRoomStatus(cleanroom._id)" :disabled="cleanroom.room.trangthai === 'Đã dọn dẹp'">
              {{ cleanroom.room.trangthai === 'Đã dọn dẹp' ? 'Đã dọn dẹp' : 'Dọn xong' }}
            </button>
            </td>
            
          </tr>
        </tbody>
      </table>
  
      <!-- Thông báo nếu không có phòng -->
      <p v-else>Không có phòng nào cần dọn dẹp.</p>
    </div>
  </template>
  
  <script>
  import api from "@/api";
  
  export default {
    data() {
      return {
        cleanrooms: [], // Danh sách phòng đã phân công
        rooms: [], // Danh sách phòng chưa dọn dẹp
        staffMembers: [], // Danh sách nhân viên dọn phòng
        assignments: [], // Danh sách phân công
        errorMessage: "", // Thông báo lỗi
      };
    },
    created() {
      this.fetchRooms();
      this.fetchStaff();
      this.getCleanRoom();
    },
    methods: {
      async fetchRooms() {
        try {
          const response = await api.get("/rooms/undeleted"); // API lấy danh sách phòng chưa dọn
          this.rooms = response.data;
          this.assignments = this.rooms.map(() => ({ staff: "" })); // Khởi tạo danh sách phân công
        } catch (error) {
          this.errorMessage = "Lỗi khi lấy danh sách phòng.";
        }
      },
      async fetchStaff() {
        try {
          const response = await api.get("/staff/role"); // API lấy danh sách nhân viên
          this.staffMembers = response.data;
        } catch (error) {
          this.errorMessage = "Lỗi khi lấy danh sách nhân viên.";
        }
      },
      async assignRoom(index) {
        const assignment = this.assignments[index];
        if (!assignment.staff) {
          alert("Vui lòng chọn nhân viên dọn dẹp.");
          return;
        }
  
        try {
          await api.post("/cleanroom", {
            staffId: assignment.staff,
            roomId: this.rooms[index]._id,
          });
          alert("Phân công thành công!");
          this.fetchRooms(); // Cập nhật lại danh sách phòng
          this.getCleanRoom(); // Lấy lại danh sách phòng đã phân công
        } catch (error) {
          this.errorMessage = "Lỗi khi phân công dọn phòng.";
        }
      },
  
      async getCleanRoom() {
        try {
          const response = await api.get("/cleanroom");
          this.cleanrooms = response.data;
        } catch (error) {
          this.errorMessage = "Lỗi khi lấy danh sách nhân viên.";
        }
      },

       // Hàm cập nhật trạng thái phòng
    async updateRoomStatus(cleanroomId) {
      try {
        // Cập nhật trạng thái phòng thành "hoàn thành"
        await api.put(`/cleanroom/${cleanroomId}/complete`);
        alert("Đã hoàn thành việc dọn phòng!");

        // Lấy lại danh sách phòng đã phân công
        this.getCleanRoom();
      } catch (error) {
        this.errorMessage = "Lỗi khi cập nhật trạng thái phòng.";
      }
    }
    
    },
  };
  </script>
  
  <style scoped>
  .assign-room {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .assign-room h2 {
    font-size: 24px;
    margin-bottom: 20px;
  }
  
  .error-message {
    color: red;
    margin-bottom: 20px;
  }
  
  .assign-room table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .assign-room table th,
  table td {
    padding: 12px;
    text-align: left;
    border: 1px solid #ddd;
  }
  
  .assign-room button {
    padding: 6px 12px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  .badge {
    padding: 5px 10px;
    border: 12px;
    font-size: 14px;
  }
  .badge-dirty {background-color: #f44336; color:white;}
  .badge-in-progress {background-color: #ff9800; color:white;}
  .badge-clean {background-color: #4caf50; color:white;}
  
  .assign-room button:hover {
    background-color: #45a049;
  }
  </style>
  