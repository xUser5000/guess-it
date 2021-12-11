const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

let usernames = [];

io.on("connection", (socket) => {
  console.log(`${socket.id} connected`);
  
  socket.on("enqueue", data => {
    let { username } = data;
    
    if (usernames.indexOf(username) !== -1) {
      socket.emit("error", "Username is already taken");
      return;
    }

    usernames.push(username);
    socket.emit("in_queue");
  });

});

module.exports = { httpServer };
