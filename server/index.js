var express = require('express')
const http = require("http");
var app = express();
const server = http.createServer(app);

const socketIo = require("socket.io")(server, {
    cors: {
        origin: "*",
    }
  });

console.log(socketIo)

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

socketIo.on("connection", (socket) => {
  console.log("New client connected" + socket.id);
  // console.log("a user connected.", socket);
  // console.log(1111, socket.handshake.headers.idroom);
  // socket.id = socket.handshake.headers.idroom
  socket.emit("getId", socket.id);

  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);

    console.log(111, users)
    socket.emit("getUsers", users);
  });

  

  socket.on("sendDataClient", function(data) {//client gửi lên
    const { id } = data;
    socketIo.to(socket.id).emit("sendDataServer", { data }); //sever gửi xuống
  })

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(3000, () => {
    console.log('Server đang chay tren cong 3000');
});
