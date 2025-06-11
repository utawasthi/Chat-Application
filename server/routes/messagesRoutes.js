const { Router } = require("express");
const verifyToken = require("../middlewares/authMiddleware");
const { getAllMessages, uploadFile } = require("../controllers/messagesController");
const multer = require("multer");

const messagesRoutes = Router();
const upload = multer({dest : "uploads/files"});

messagesRoutes.get('/get-messages' , verifyToken , getAllMessages);
messagesRoutes.post('/upload-file' , verifyToken , upload.single('file') , uploadFile);

module.exports = messagesRoutes;