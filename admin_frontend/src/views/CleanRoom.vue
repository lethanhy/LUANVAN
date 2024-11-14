<template>
  <div class="assign-room">
    <h2 class="text-center text-info">Phân công phòng dọn dẹp</h2>

    <!-- Thông báo khi không có phòng hoặc nhân viên -->
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

    <!-- Bảng hiển thị danh sách phòng chưa dọn dẹp -->
    <div v-if="rooms.length > 0">
      <h3>Danh sách phòng chưa dọn dẹp</h3>
      <table>
        <thead>
          <tr>
            <th>Phòng</th>
            <th>Tình trạng</th>
            <th>Nhân viên dọn dẹp</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(room, index) in rooms" :key="room._id">
            <td>{{ room.roomNumber }}</td>
            <td>
              <span :class="{
                'badge badge-in-progress': room.trangthai === 'Đang dọn dẹp',
                'badge badge-dirty': room.trangthai === 'Chưa dọn dẹp',
                'badge badge-clean': room.trangthai === 'Đã dọn dẹp',
              }">{{ room.trangthai }}</span>
            </td>
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
        </tbody>
      </table>
    </div>
    <p v-else>Không có phòng nào cần dọn dẹp.</p>

    <!-- Bảng hiển thị danh sách phòng đã được phân công -->
    <div v-if="cleanrooms.length > 0" class="mt-4">
      <h3>Danh sách phòng đã phân công</h3>
      <table>
        <thead>
          <tr>
            <th>Phòng</th>
            <th>Tình trạng</th>
            <th>Ngày</th>
            <th>Nhân viên dọn dẹp</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(cleanroom, index) in cleanrooms" :key="cleanroom._id">
            <td>{{ cleanroom.room.roomNumber }}</td>
            <td>
              <span :class="{
                'badge badge-in-progress': cleanroom.roomStatus === 'Đang dọn dẹp',
                'badge badge-dirty': cleanroom.roomStatus === 'Chưa dọn dẹp',
                'badge badge-clean': cleanroom.roomStatus === 'Đã dọn dẹp',
                'badge badge-assignment': cleanroom.roomStatus === 'Phân công',
              }">{{ cleanroom.roomStatus }}</span>
            </td>
            <td>
              {{ formatDate(cleanroom.lastUpdated) }}
            </td>
            <td>
              <select disabled>
                <option>{{ cleanroom.staff.name }}</option>
              </select>
            </td>
            <td>
              <button v-if="cleanroom.status === 'Phân công'" @click="updateStatus(cleanroom._id)" class="me-2">Tiến hành dọn dẹp</button>
              <button v-if="cleanroom.status === 'Đang dọn dẹp'" @click="updateRoomStatus(cleanroom._id)" :disabled="cleanroom.status === 'Đã dọn dẹp'">
                {{ cleanroom.status === 'Đã dọn dẹp' ? 'Đã dọn dẹp' : 'Dọn xong' }}
              </button>
              <button v-if="cleanroom.status === 'Hoàn thành' || cleanroom.status === 'Đã dọn dẹp'" disabled class="me-2">Hoàn thành</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else>Không có phòng nào đã được phân công.</p>
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
        const response = await api.get("/rooms/undeleted");
        this.rooms = JSON.parse(JSON.stringify(response.data));
        this.assignments = this.rooms.map(() => ({ staff: "" }));
      } catch (error) {
        this.errorMessage = "Lỗi khi lấy danh sách phòng.";
      }
    },
    async fetchStaff() {
      try {
        const response = await api.get("/staff/role");
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
        this.cleanrooms = JSON.parse(JSON.stringify(response.data));
      } catch (error) {
        this.errorMessage = "Lỗi khi lấy danh sách phòng đã phân công.";
      }
    },
    async updateRoomStatus(cleanroomId) {
      try {
        await api.put(`/cleanroom/${cleanroomId}/complete`);
        alert("Đã hoàn thành việc dọn phòng!");
        this.getCleanRoom();
      } catch (error) {
        this.errorMessage = "Lỗi khi cập nhật trạng thái phòng.";
      }
    },
    async updateStatus(cleanroomId) {
      try {
        await api.put(`/cleanroom/${cleanroomId}`, {
          status: "Đang dọn dẹp",
        });
        alert("Tiến hành dọn dẹp!");
        this.getCleanRoom();
      } catch (error) {
        this.errorMessage = "Lỗi khi cập nhật trạng thái phòng.";
        console.error(error);
      }
    },

    formatDate(dateString) {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return new Date(dateString).toLocaleDateString('vi-VN', options);
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

.assign-room h2,
h3 {
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
  border-radius: 12px;
  font-size: 14px;
}

.badge-dirty {
  background-color: #f44336;
  color: white;
}

.badge-in-progress {
  background-color: #ff9800;
  color: white;
}

.badge-clean {
  background-color: #4caf50;
  color: white;
}

.badge-assignment {
  background-color: rgb(122, 217, 224);
  color: white;
}

.assign-room button:hover {
  background-color: #45a049;
}
</style>
