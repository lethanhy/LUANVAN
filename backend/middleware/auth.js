const jwt = require('jsonwebtoken');
const Customer = require('../models/customer.model.js');
const config = require('../config/config.js');

const auth = async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        const customer = await Customer.findById(decoded.id);
        if (!customer) {
            throw new Error();
        }
        req.token = token;
        req.customer = customer;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Please authenticate.' });
    }
};

module.exports = auth;
