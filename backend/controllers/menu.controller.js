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

const updateMenu = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body; // Get the update data from the request body

        // Ensure that update data is present
        if (!updateData || Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: 'No update data provided' });
        }

        // Update Menu data
        const result = await MenuItem.findByIdAndUpdate(id, updateData, { new: true });

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

const deleteMenuById = async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete the customer by ID
        const result = await MenuItem.findByIdAndDelete(id);

        if (result) {
            res.status(200).json({ message: 'Menu deleted successfully' });
        } else {
            res.status(404).json({ message: 'menu not found' });
        }
    } catch (error) {
        console.error('Error deleting menu:', error);
        res.status(500).json({ message: 'Error deleting menu', error });
    }
};








module.exports = {
   getMenu,
   createMenu,
   updateMenu,
   deleteMenuById,


};