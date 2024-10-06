const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const StaffSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
        },
         password: {
            type: String,
            required: [ true, 'Password field is required'],
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


// Mã hóa mật khẩu trước khi lưu
StaffSchema.pre('save', async function(next) {
    if(!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    } 
})

const Staff = mongoose.model("Staff", StaffSchema);

module.exports = Staff;