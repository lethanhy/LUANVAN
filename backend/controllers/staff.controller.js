const Staff = require("../models/staff.model.js");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config.js');

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
        const { name, password } = req.body;
        const staff = await Staff.findOne({ name });
        if (!staff) {
            return res.status(400).send({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, staff.password);
        if (!isMatch) {
            return res.status(400).send({ message: 'Invalid email or password' });
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




module.exports = {
    addStaff,
    getStaff,
    updateStaff,
    deleteStaff,
    login,
    register,
    getStaffById,
    
};