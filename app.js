const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { Contest } = require("./structures/Contest.structure");
const { generateUUID } = require("./util/UUID.util");
const { Dictionary } = require("./util/Dictionary.util");
const { CONTEST_PLAYERS, CONTEST_ROUNDS } = require("./constant");

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

    if (playersQueue.size === CONTEST_PLAYERS) {
      let contestId = generateUUID();
      let contest = new Contest(contestId);
      contests.set(contestId, contest);
      let cnt = CONTEST_PLAYERS;

      console.log(`Contest ${contestId} has been created with the following players: `);

      for (let [username, currentPlayer] of playersQueue) {
        currentPlayer.join(contestId);
        currentPlayer.contestId = contestId;
        contest.addPlayer(username);
        playersQueue.delete(username);
        usernameStore.delete(username);
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
      if (contest.getReadyPlayersCount() === CONTEST_PLAYERS) {
        contest.startContest();
        console.log(`Contest ${contestId} has started!`);
        startRound(contest);
      }
    }
  });

  socket.on("select", choice => {
    choice = parseInt(choice);
    let { username, contestId } = socket;
    let contest = contests.get(contestId);
    if (contest.isPlayerBlocked(username)) return;

    let isCorrectChoice = contest.isCorrectChoice(choice);
    if (isCorrectChoice) {
      contest.addPointToPlayer(username);
      console.log(`Correct answer for player ${username} in contest ${contestId} round ${contest.getRoundsCount()}`);
    } else {
      console.log(`Wrong answer for player ${username} in contest ${contestId} round ${contest.getRoundsCount()}`);
      contest.blockPlayer(username);
    }

    if (isCorrectChoice || contest.getBlockedPlayersCount() === CONTEST_PLAYERS) {
      if (contest.getRoundsCount() === CONTEST_ROUNDS) {
        console.log(`Contest ${contestId} has ended`);
        contests.delete(contestId);
        io.to(contestId).emit("end", contest.getScore());
      } else {
        startRound(contest);
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

function startRound (contest) {
  let round = Dictionary.getInstance().generateRound();
  contest.addRound(round);
  io.to(contest.getId()).emit("round", {
    id: contest.getRoundsCount(),
    image: round.getImage(),
    choices: round.getChoices(),
    score: contest.getScore()
  });
  console.log(`Round ${contest.getRoundsCount()} in contest ${contest.getId()} began`);
}

module.exports = { httpServer };
