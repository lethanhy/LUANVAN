const Staff = require("../models/staff.model.js");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config.js');
const { sendCreateStaffConfirmationEmail } = require('../utils/mailer');

const register = async (req, res) => {
    try {
        const staff = new Staff(req.body);
        await staff.save();
        res.status(201).send(staff);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};



const login = async (req, res) => {
    try {
        const { phone, password } = req.body;
        const staff = await Staff.findOne({ phone });
        if (!staff) {
            return res.status(400).send({ message: 'Không tìm thấy số điện thoại' });
        }

        const isMatch = await bcrypt.compare(password, staff.password);
        if (!isMatch) {
            return res.status(400).send({ message: 'Sai mật khẩu' });
        }

        const token = jwt.sign({ id: staff._id }, config.jwtSecret, { expiresIn: '1h' });

        // Tạo refresh token
        const refresToken = jwt.sign({ id: staff._id }, config.jwtSecret, { expiresIn: '7d'});

        // Lưu refresh token vào cơ sở dữ liệu
        staff.refresToken = refresToken;
        await staff.save();
        res.send({ user: { name: staff.name, id:staff._id, role: staff.role}, token }); // Trả về thông tin user
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};


const addStaff = async (req, res) => {
    try {
        const staff = new Staff(req.body);

         // Gửi email xác nhận khi thanh toán thành công
         sendCreateStaffConfirmationEmail(
            staff.email, // Email của khách hàng
            {
              name: staff.name,
              password: staff.password,
              phone: staff.phone,
              role: staff.role,
            }
          );
        await staff.save();

         
        res.status(201).send(staff);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

const getStaff = async (req, res) => {
    try {
        const staff = await Staff.find();
        res.send(staff);

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

const updateStaff = async (req, res) => {
    try {
        const { id } = req.params;
        const staff = await Staff.findByIdAndUpdate(id, req.body, {new: true});
        if( !staff ) {
            return res.status(404).send({message: "Room not found"});
        }
        res.send(staff);

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

const deleteStaff = async (req, res) => {
    try {
        const { id } = req.params;
        const staff = await Staff.findByIdAndDelete(id);

        if(!staff) {
            return res.status(404).send({ message: "Staff not found"});
        }
        res.send({ message: "Staff deleted successfully"});
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

const getStaffById = async (req, res) => {
    try {
        const { id } = req.params;
        const staff = await Staff.findById(id);
        if(!staff) {
            return res.status(404).send({ message: "Staff not found"});
        }
        res.send(staff);

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

// GET: Lấy danh sách nhân viên
const getStaffByRole =  async (req, res) => {
    try {
        const staff = await Staff.find({ role: 'Dọn phòng' });
        res.status(200).json(staff);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách nhân viên.' });
    }
};

const changePassword = async (req, res) => {
    try {
        const { staffId, oldPassword, newPassword } = req.body;

        // Tìm khách hàng trong cơ sở dữ liệu
        const staff = await Staff.findById(staffId);
        if (!staff) {
            return res.status(404).send('Người dùng không tồn tại.');
        }

        // So sánh mật khẩu cũ với mật khẩu đã mã hóa trong cơ sở dữ liệu
        const isMatch = await bcrypt.compare(oldPassword, staff.password);
        if (!isMatch) {
            return res.status(404).send('Mật khẩu cũ không đúng.');
        }

        // Cập nhật mật khẩu mới, hệ thống sẽ tự động mã hóa mật khẩu mới khi lưu
        staff.password = newPassword;

        // Lưu tài liệu (middleware sẽ tự động mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu)
        await staff.save();

        res.status(200).send('Đổi mật khẩu thành công.');
    } catch (error) {
        console.log(error); // Log chi tiết lỗi để dễ dàng debug
        res.status(500).send('Có lỗi xảy ra.');
    }
}

// Handle image upload
const uploadProfileImage = async (req, res) => {
    try {
      // Make sure the file is uploaded
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded!' });
      }
  
      // Find the customer by ID and update the profile image
      const staff = await Staff.findById(req.params.staffId);
      if (!staff) {
        return res.status(404).json({ message: 'Staff not found' });
      }
  
      // Save the image URL (path of the uploaded image)
      staff.image = `/uploads/${req.file.filename}`;
  
      // Save the customer record
      await staff.save();
  
      res.status(200).json({ message: 'Profile image updated successfully', imageUrl: staff.image });
    } catch (error) {
      console.error('Error uploading profile image:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  




module.exports = {
    addStaff,
    getStaff,
    updateStaff,
    deleteStaff,
    login,
    register,
    getStaffById,
    getStaffByRole,
    changePassword,
    uploadProfileImage
    
};