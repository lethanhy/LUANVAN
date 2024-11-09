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
        },
        phone: {
            type: String,
            require: [true, 'Phone is required'],
           
        },
        address: {
            type: String,
           
        },
        email: {
            type: String,
          
           
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