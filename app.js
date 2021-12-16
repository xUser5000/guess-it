const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { Contest } = require("./structures/Contest.structure");
const { generateUUID } = require("./util/UUID.util");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

let usernameStore = new Set();
let playersQueue = new Map();
let contests = new Map();

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

    console.log(`Player ${socket.username} is in queue`);

    if (playersQueue.size === 3) {
      let contestId = generateUUID();
      let cnt = 3;

      console.log(`Contest ${contestId} has been created with the following players: `);

      for (let [username, currentPlayer] of playersQueue) {
        if (cnt === 0) break;
        currentPlayer.join(contestId);
        currentPlayer.contestId = contestId;
        contests.set(contestId, new Contest());
        playersQueue.delete(username);
        --cnt;
        currentPlayer.emit("matched");

        console.log(`   - ${username}`);
      }
    }

  });

  socket.on("ready", () => {
    let { username, contestId } = socket;
    let contest = contests.get(contestId);
    if (!contest.isReady(username)) {
      console.log(`Player ${username} is ready`);
      contest.makeReady(username);
      if (contest.getReadyPlayersCount() === 3) {
        contest.startContest();
        console.log(`Contest ${contestId} has started!`);
      }
    }
  });

  socket.on("disconnect", () => {
    if (usernameStore.has(socket.username)) {
      usernameStore.delete(socket.username);
    }

    if (playersQueue.has(socket.username)) {
      playersQueue.delete(socket.username);
    }
    
    socket.username = null;
    socket.contestId = null;
    console.log(`${socket.id} disconnected`);
  });

});

module.exports = { httpServer };
