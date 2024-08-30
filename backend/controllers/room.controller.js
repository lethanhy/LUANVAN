const Room = require("../models/room.model.js");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config.js');


const addRoom = async (req, res) => {
    try {
        const room = new Room(req.body);
        await room.save();
        res.status(201).send(room);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

const updateRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const room = await Room.findByIdAndUpdate(id, req.body, {new: true});

        if( !room ) {
            return res.status(404).send({message: "Room not found"});
        }
        res.send(room);
    } catch (error) {
        res.status(404).send({message: error.message});
    }
};

const getRooms = async (req, res) => {
    try {
        const rooms = await Room.find();
        res.send(rooms);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

const deleteRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const room = await Room.findByIdAndDelete(id);
        if(!room) {
            return res.status(404).send({ message: "Room not found"});
        }
        res.send({ message: "Room deleted successfully"});
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}




module.exports = {
   addRoom,
   updateRoom,
   getRooms,
   deleteRoom,
};