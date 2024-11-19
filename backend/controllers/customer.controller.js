const Customer = require("../models/customer.model.js");
const Booking = require("../models/booking.model")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config.js');


const register = async (req, res) => {
    try {
        // Kiểm tra email đã tồn tại chưa
        const existingCustomerEmail = await Customer.findOne({ email: req.body.email });
         if (existingCustomerEmail) {
             return res.status(400).send({ message: 'Email đang được sử dụng.' });
         }
         // Kiểm tra phone đã tồn tại chưa
         const existingCustomerPhone = await Customer.findOne({ phone: req.body.phone });
         if (existingCustomerPhone) {
             return res.status(400).send({ message: 'Số điện thoại đã được sử dụng.' });
         }
         
        // Tạo và lưu khách hàng mới
        const customer = new Customer(req.body);
        await customer.save();
        res.status(201).send(customer);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { phone, password } = req.body;
        const customer = await Customer.findOne({ phone });
        if (!customer) {
            return res.status(400).send({ message: 'Không tìm thấy số điện thoại' });
        }

        const isMatch = await bcrypt.compare(password, customer.password);
        if (!isMatch) {
            return res.status(400).send({ message: 'Sai mật khẩu' });
        }

        const token = jwt.sign({ id: customer._id }, config.jwtSecret, { expiresIn: '1h' });

        // Tạo refresh token
        const refresToken = jwt.sign({ id: customer._id }, config.jwtSecret, { expiresIn: '7d'});

        // Lưu refresh token vào cơ sở dữ liệu
        customer.refresToken = refresToken;
        await customer.save();
        res.send({ user: { id: customer._id,name: customer.name, email: customer.email, cccd:customer.cccd,phone:customer.phone, gioitinh:customer.gioitinh, address:customer.address }, token }); // Trả về thông tin user
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

const refreshToken = async (req, res) => {
    const { refresToken } = req.body;

    if(! refresToken) {
        return res.status(403).send({ message: 'Refresh token is required'});
    }

    try {
        const decoded = jwt.verify(refreshToken, config.jwtRefreshSecret);
        const customer = await Customer.findById(decoded.id);

        if (!customer || customer.refreshToken !== refreshToken) {
            return res.status(403).send({ message: 'Invalid refresh token' });
        }

        // Tạo mới JWT
        const newToken = jwt.sign({ id: customer._id }, config.jwtSecret, { expiresIn: '1h' });

        res.send({ token: newToken });
    } catch (error) {
        return res.status(403).send({ message: 'Invalid refresh token' });
    }
};

const logout = async (req, res) => {
    try {
        const { email } = req.body;
        const customer = await Customer.findOne({ email });
        if (!customer) {
            return res.status(400).send({ message: 'Invalid email' });
        }

        customer.refreshToken = null;
        await customer.save();

        res.send({ message: 'Logout successful' });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

const me = async (req, res) => {
    try{
        const user = await Customer.findById(req.user.id);
        req.json({ user });

    } catch (error) {
    res.status(500).json({ message: 'Error fetching user details' });
    }
};

const getAllCustomer = async (req, res) => {
    try {
        // Fetch all customers from the database
        const customers = await Customer.find();
        
        // Send the list of customers in the response
        res.status(200).json(customers);
    } catch (error) {
        // Log the error for debugging purposes
        console.error('Error fetching customers:', error);
        
        // Send an error response
        res.status(500).json({ message: 'Failed to fetch customers', error });
    }
};

const deleteCustomerById = async (req, res) => {
    try {
        const { id } = req.params;

        // Kiểm tra xem phòng có bản ghi đặt với trạng thái khác 'đã hủy' và 'hoàn thành' không
        const bookingExists = await Booking.findOne({ 
            customer: id, 
            status: { $nin: ['đã hủy', 'hoàn thành'] } 
        });

        if (bookingExists) {
            return res.status(400).json({ message: 'Khách đang ở, không thể xóa' });
        }

        // Nếu không có bản ghi đặt nào, tiến hành cập nhật phòng
        const result = await Customer.findByIdAndUpdate(
            id,
            { xoaCustomer: false },  // Cập nhật trường xoaRoom thành false
            { new: true }  // Trả về document mới đã được cập nhật
        );

        if (result) {
            res.status(200).json({ message: 'Cập nhật khách thành công', customer: result });
        } else {
            res.status(404).json({ message: 'Không tìm thấy khách' });
        }
    } catch (error) {
        console.error('Lỗi khi cập nhật khách:', error);
        res.status(500).json({ message: 'Lỗi khi cập nhật khách', error });
    }
};

// Express route
const createCustomer = async (req, res) => {
    try {
        const { name, email, cccd, phone, address, gioitinh, nationality } = req.body;

        // Xác nhận dữ liệu đầu vào
        if (!name || !email || !cccd || !phone || !address || !gioitinh || !nationality) {
            return res.status(400).json({ message: 'Thiếu thông tin cần thiết' });
        }

        const newCustomer = new Customer({
            name,
            email,
            cccd,
            phone,
            address,
            gioitinh,
            nationality
        });

        await newCustomer.save();
        res.status(201).json(newCustomer);
    } catch (error) {
        console.error('Error adding customer:', error);
        res.status(500).json({ message: 'Có lỗi xảy ra khi thêm khách hàng' });
    }
}

const updateCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body; // Get the update data from the request body

        // Ensure that update data is present
        if (!updateData || Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: 'No update data provided' });
        }

        // Update customer data
        const result = await Customer.findByIdAndUpdate(id, updateData, { new: true });

        if (result) {
            res.status(200).json({ message: 'Customer updated successfully', data: result });
        } else {
            res.status(404).json({ message: 'Customer not found' });
        }

    } catch (error) {
        console.error('Error updating customer:', error); // Log the error for debugging
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getCustomerById = async (req, res) => {
    try {
        const { id } = req.params;
        const customer = await Customer.findById(id);
        if(!customer) {
            return res.status(400).send({ message: 'sai' });
        }
        res.send(customer);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
        
    }
}

const changePassword = async (req, res) => {
    try {
        const { customerId, oldPassword, newPassword } = req.body;

        // Tìm khách hàng trong cơ sở dữ liệu
        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).send('Người dùng không tồn tại.');
        }

        // So sánh mật khẩu cũ với mật khẩu đã mã hóa trong cơ sở dữ liệu
        const isMatch = await bcrypt.compare(oldPassword, customer.password);
        if (!isMatch) {
            return res.status(404).send('Mật khẩu cũ không đúng.');
        }

        // Cập nhật mật khẩu mới, hệ thống sẽ tự động mã hóa mật khẩu mới khi lưu
        customer.password = newPassword;

        // Lưu tài liệu (middleware sẽ tự động mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu)
        await customer.save();

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
      const customer = await Customer.findById(req.params.customerId);
      if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
      }
  
      // Save the image URL (path of the uploaded image)
      customer.image = `/uploads/${req.file.filename}`;
  
      // Save the customer record
      await customer.save();
  
      res.status(200).json({ message: 'Profile image updated successfully', imageUrl: customer.image });
    } catch (error) {
      console.error('Error uploading profile image:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  










module.exports = {
    register,
    login,
    refreshToken,
    logout,
    me,
    getAllCustomer,
    deleteCustomerById,
    createCustomer,
    updateCustomer,
    getCustomerById,
    changePassword,
    uploadProfileImage
    
};