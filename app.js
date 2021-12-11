const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

let usernameStore = new Set();

io.on("connection", (socket) => {
  console.log(`${socket.id} connected`);

  socket.on("enqueue", username => {

    if (usernameStore.has(username)) {
      socket.emit("error", "Username is already taken");
      return;
    }

    if (socket.username) {
      usernameStore.delete(socket.username);
    }

    usernameStore.add(username);
    socket.username = username;
    socket.emit("in_queue");
  });

  socket.on("disconnect", () => {
    if (socket.username) {
      usernameStore.delete(socket.username);
      socket.username = null;
    }
    console.log(`${socket.id} disconnected`);
  });

});

module.exports = { httpServer };
