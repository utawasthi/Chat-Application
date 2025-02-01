const express = require('express');
const verifyToken = require('../middlewares/authMiddleware');
const { searchContacts } = require('../controllers/contactController');
const contactRoutes = express.Router();

contactRoutes.post("/search" , verifyToken , searchContacts);

module.exports = contactRoutes;