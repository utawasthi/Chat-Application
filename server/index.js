require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express();
const PORT = process.env.PORT || 3000;
const connectToDB = require('./config/db');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');
const messagesRoutes = require('./routes/messagesRoutes');

const setupSocket = require('./socket');

const corsOptions = {
  origin: [process.env.ORIGIN],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
};

app.use(cors(corsOptions));

app.use("/uploads/profiles" , express.static("uploads/profiles"));

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/contacts" , contactRoutes);
app.use("/api/messages" , messagesRoutes);

connectToDB();

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});

setupSocket(server);