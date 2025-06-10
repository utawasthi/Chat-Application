const express = require('express');
const verifyToken = require('../middlewares/authMiddleware');
const { searchContacts, getContactForDmList } = require('../controllers/contactController');
const contactRoutes = express.Router();

contactRoutes.post("/search" , verifyToken , searchContacts);
contactRoutes.get("/get-contacts-for-dm-list" , verifyToken , getContactForDmList);

module.exports = contactRoutes;