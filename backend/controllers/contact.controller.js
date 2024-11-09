const Contact = require("../models/contact.models.js");
const Booking = require("../models/booking.model")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config.js');


const createContact = async (req, res) => {
    try {
        const contact = new Contact(req.body);
        await contact.save();
        res.status(201).send(contact);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

const getAllContact = async (req, res) => {
    try {
        const contact = await Contact.find();
        res.status(200).json(contact)
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};
const deleteById = async (req, res) => {
    try {
        const { id } = req.params;
        const contact = await Contact.findByIdAndDelete(id);
        res.status(200).json({message:"Xóa thành công"})
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
}


module.exports = {
   createContact,
   getAllContact,
   deleteById,
    
};