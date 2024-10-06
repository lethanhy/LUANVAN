const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const CustomerSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Username field is required'],
            // unique: true,
        },

        // password: {
        //     type: String,
        //     required: [ true, 'Password field is required'],
        // },
        email: {
            type: String,
            require: [true, 'Email field is required'],

        },
        phone: {
            type: String,
            required: true,
            validate: {
                validator: function(v) {
                    return /^\d{10,11}$/.test(v); // Kiểm tra số điện thoại có 10 hoặc 11 chữ số
                },
                message: props => `${props.value} is not a valid phone number!`
            }
        },
        address: {
            type: String,
            // required: true
        },
        cccd: {
            type: String,
            // required: true
        },
        gioitinh: {
            type: String,
            // required: true
        },
        nationality: {
            type: String,
        },
        
        // refreshToken: {
        //     type: String,
        // }
    },
    {
        timestamps: true,
    }
);


// Mã hóa mật khẩu trước khi lưu
CustomerSchema.pre('save', async function(next) {
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
const Customer = mongoose.model("Customer", CustomerSchema);

module.exports = Customer;