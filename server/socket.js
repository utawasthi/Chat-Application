const { Server : SocketIOServer } = require('socket.io');
const Messages = require('./models/MessageModel');

const setupSocket = (server) => {
  
  const io = new SocketIOServer(server , {
    cors : {
      origin : process.env.ORIGIN,
      methods : ["GET" , "POST"],
      credentials : true,
    }
  });
   
  const userSocketMap = new Map();

  const disconnect = (socket) => {
    console.log(`Client disconnected : ${socket.id}`);
    for(const [userId , socketId] of userSocketMap.entries()){
      if(socketId === socket.id){
        userSocketMap.delete(userId);
        break;
      }
    }
  };

  const sendMsg = async (msg) => {
    const senderSocketId = userSocketMap.get(msg.sender);
    const recipientSocketId = userSocketMap.get(msg.recipient);

    const createMsg = await Messages.create(msg);
    const msgData = await Messages.findById(createMsg._id).populate('sender' , "id email firstName , lastName image color ").populate('recipient' , "id email firstName lastName image color");

    // console.log(createMsg);

    if(recipientSocketId){
      io.to(recipientSocketId).emit("receiveMsg" , msgData);
    }
    if(senderSocketId){
      io.to(senderSocketId).emit("receiveMsg" , msgData);
    }
  }

  io.on("connection" , (socket) => {
    const userId = socket.handshake.query.userId;

    if(userId){
      userSocketMap.set(userId , socket.id);
      console.log(`User connected : ${userId} with socket ID : ${socket.id}`);
    }
    else{
      console.log("User ID not provided during connection");
    }

    socket.on("sendMsg" , sendMsg);
    socket.on("disconnect" , () => disconnect(socket));
  });
   
  return io;
};

module.exports =  setupSocket;