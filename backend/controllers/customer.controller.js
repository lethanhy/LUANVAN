const Customer = require("../models/customer.model.js");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config.js');


const register = async (req, res) => {
    try {
        const customer = new Customer(req.body);
        await customer.save();
        res.status(201).send(customer);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const customer = await Customer.findOne({ email });
        if (!customer) {
            return res.status(400).send({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, customer.password);
        if (!isMatch) {
            return res.status(400).send({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: customer._id }, config.jwtSecret, { expiresIn: '1h' });

        // Tạo refresh token
        const refresToken = jwt.sign({ id: customer._id }, config.jwtSecret, { expiresIn: '7d'});

        // Lưu refresh token vào cơ sở dữ liệu
        customer.refresToken = refresToken;
        await customer.save();
        res.send({ user: { name: customer.name, email: customer.email }, token }); // Trả về thông tin user
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
}






module.exports = {
    register,
    login,
    refreshToken,
    logout,
    me
    
};