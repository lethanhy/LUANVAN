const Room = require("../models/room.model.js");
const MenuItem = require("../models/menu.model.js");


const getMenu = async (req, res) => {
    try {
        const menu = await MenuItem.find();
        res.json(menu);
    } catch (error) {
        res.status(500).json({ messgae: error.message});
    }
};

const createMenu = async (req, res) => {
    try {
        const { name , price } = req.body;

        const newMenu = await MenuItem({ name, price});
        await newMenu.save();
        res.status(201).json(newMenu);
    } catch (error) {
        res.status(500).json({ message: err.message });
    }
}








module.exports = {
   getMenu,
   createMenu,


};