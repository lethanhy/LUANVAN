const Role = require("../models/role.model");
const Booking = require("../models/booking.model")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config.js');


const createRole = async (req, res) => {
    try {
        const role = new Role(req.body);
        await role.save();
        res.status(201).send(role);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

const getAllRole = async (req, res) => {
    try {
        const role = await Role.find();
        res.status(200).json(role)
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};
const deleteById = async (req, res) => {
    try {
        const { id } = req.params;
        const role = await Role.findByIdAndDelete(id);
        res.status(200).json({message:"Xóa thành công"})
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
}


module.exports = {
   createRole,
   getAllRole,
   deleteById,
    
};