const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        enum: ['Lễ tân', 'Quản lý', 'Dọn phòng', 'Bảo trì', 'Bảo vệ', 'Đầu bếp', 'Quản trị viên']
    },
    description: {
        type: String,
        trim: true
    },
    permissions: [{
        type: String  // Ví dụ: ["view bookings", "edit rooms", "access reports"]
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Role = mongoose.model('Role', RoleSchema);

module.exports = Role;
