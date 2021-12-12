const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { generateUUID } = require("./util/UUID.util");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

let usernameStore = new Set();
let playersQueue = new Map();

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
    playersQueue.set(username, socket);
    socket.emit("in_queue");

    if (playersQueue.size === 3) {
      let contestId = generateUUID();
      let cnt = 3;
      for (let [username, currentPlayer] of playersQueue) {
        if (cnt === 0) break;
        currentPlayer.join(contestId);
        currentPlayer.emit("matched");
        playersQueue.delete(username);
        --cnt;
      }
    }

    console.log(io.sockets.adapter.rooms);
  });

  socket.on("disconnect", () => {
    if (usernameStore.has(username)) {
      usernameStore.delete(socket.username);
    }

    if (playersQueue.has(username)) {
      playersQueue.delete(socket.username);
    }
    
    socket.username = null;
    console.log(`${socket.id} disconnected`);
  });

});

module.exports = { httpServer };
