const { Server : SocketIOServer } = require('socket.io');

const setupSocket = (server) => {
  const io = new SocketIOServer(server , {
    cors : {
      origin : process.env.ORIGIN,
      method : ["GET" , "POST"],
      credentials : true,
    }
  });
   
  const userSocketMap = new Map();

  const disconnect = (socket) => {
    console.log(`Client disconnected : ${socket.id}`);
    for(const [userId , socketId] of userSocketMap.entries()){
      if(socketId == socket.id){
        userSocketMap.delete(userId);
        break;
      }
    }
  };

  io.on("connection" , (socket) => {
    const userId = socket.handshake.query.userId;

    if(userId){
      userSocketMap.set(userId , socket.id);
      console.log(`User connected : ${userId} with socket ID : ${socket.id}`);
    }
    else{
      console.log("User ID not provided during connection");
    }

    socket.on("disconnect" , () => disconnect(socket));
  });
   
  return io;
};

module.exports =  setupSocket;