const { Router } = require("express");
const verifyToken = require("../middlewares/authMiddleware");
const { getAllMessages } = require("../controllers/messagesController");

const messagesRoutes = Router();
messagesRoutes.get('/get-messages' , verifyToken , getAllMessages);

module.exports = messagesRoutes;