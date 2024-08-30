const Staff = require("../models/staff.model.js");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config.js');


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




module.exports = {
    addStaff,
    getStaff,
    updateStaff,
    deleteStaff,
    
};