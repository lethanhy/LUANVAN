const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const StaffSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
        },

        role: {
            type: String,
            required: [ true, 'Role is required'],
            enum: ["Manager", "Receptionist", "Housekeeping", "Maintenance", "Chef"] // Quản lý, Nhân viên, Lễ tân, Bảo trì, Đầu bếp ...
        },
        phone: {
            type: String,
            require: [true, 'Phone is required'],
           
        },
    },
    {
        timestamps: true,
    }
);

const Staff = mongoose.model("Staff", StaffSchema);

module.exports = Staff;