<template>
    <div class="role container">
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                <!-- Thay <a> bằng <router-link> -->
                <li class="breadcrumb-item">
                    <router-link to="/bill"  class="text-decoration-none">Quản lý nhân viên</router-link>
                </li>
                <li class="breadcrumb-item" aria-current="page">Công việc</li>
            </ol>
        </nav>

        <div class="row">
            <div class="col-lg-4">
                <h2>Tạo công việc</h2>
                <form @submit.prevent="addRole">
                    <div class="mb-3">
                        <label for="name" class="form-label">Tên công việc</label>
                        <input type="text" id="name" v-model="newRole.name" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label for="description" class="form-label">Nội dung công việc</label>
                        <textarea class="form-control" id="description" v-model="newRole.description" rows="3" required></textarea>
                    </div>
                    <div class="d-grid gap-2">
                        <button class="btn btn-primary" type="submit">Tạo</button>
                    </div>
                </form>
            </div>

            <div class="col-lg-8">
                <div class="rolelist">
                    <h2>Danh sách công việc</h2>
                    <table class="table text-center shadow">
                        <thead>
                            <tr>
                                <th scope="col">STT</th>
                                <th scope="col">Tên</th>
                                <th scope="col">Nội dung</th>
                                <th scope="col">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(role, index) in roles" :key="role._id">
                                <th scope="row">{{ index + 1 }}</th>
                                <td>{{ role.name }}</td>
                                <td>{{ role.description }}</td>
                                <td>
                                    <button @click="deleteRole(role._id)" class="btn btn-danger">Xóa</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import api from '@/api';
export default {
    data() {
        return {
            newRole: {
                name: '',
                description: ''
            },
            roles: [] // Danh sách các công việc
        };
    },
    created() {
        this.getRole();
    },
    methods: {
       async addRole() {
           if (!this.newRole.name || !this.newRole.description) {
               alert('Vui lòng điền đầy đủ thông tin.');
               return;
           }
           try {
               const response = await api.post('/role', this.newRole);
               console.log('Công việc đã được tạo:', response.data);
               alert('Công việc đã được tạo thành công!');
               this.newRole = { name: '', description: '' };
               this.getRole(); // Cập nhật danh sách sau khi thêm
           } catch (error) {
               console.error('Lỗi khi tạo công việc:', error);
               alert('Có lỗi xảy ra khi tạo công việc.');
           }
       },
       async getRole() {
           try {
               const response = await api.get('/role');
               this.roles = response.data;
           } catch (error) {
               console.error('Lỗi khi lấy danh sách công việc:', error);
           }
       },
       async deleteRole(id) {
           try {
               await api.delete(`/role/${id}`);
               alert('Công việc đã được xóa!');
               this.getRole(); // Cập nhật danh sách sau khi xóa
           } catch (error) {
               console.error('Lỗi khi xóa công việc:', error);
               alert('Có lỗi xảy ra khi xóa công việc.');
           }
       }
    }
};
</script>

<style>
.role {
    background: #fff;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.rolelist {
    margin-left: 2rem;
}
</style>
