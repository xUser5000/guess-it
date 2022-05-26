const express = require("express");
const cors = require("cors");
const { createServer, http } = require("http");
const request = require("request")
const { Server } = require("socket.io");
const { Contest } = require("./structures/Contest.structure");
const { generateUUID } = require("./util/UUID.util");
const { Dictionary } = require("./util/Dictionary.util");
const { CONTEST_PLAYERS, CONTEST_ROUNDS, CORS_ORIGINS } = require("./constant");
const imgmin = require("imagemin")
const imageminJpegtran = require("imagemin-jpegtran")
const imageminPngquant = require("imagemin-pngquant")
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [CORS_ORIGINS],
    credentials: true,
  },
});

app.use(
  cors({
    origin: [CORS_ORIGINS],
    credentials: true,
  })
);

app.get("/compress", (req, res) => {
  let url = req.query.url
  console.log("compressing " + url)
  request({ url, encoding: null }, async (_err, _resp, buffer) => {
    let buff = await imgmin.buffer(buffer, {
      plugins: [
        imageminJpegtran({ quality: 20 }),
        imageminPngquant({
          quality: [0.6, 0.8]
        })
      ]
    })

    res.end(buff, "binary")
  });
})

let usernameStore = new Set();
let playersQueue = new Map();
let contests = new Map();

io.on("connection", (socket) => {
  console.log(`${socket.id} connected`);

  socket.on("enqueue", (username) => {
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

      console.log(
        `Contest ${contestId} has been created with the following players: `
      );

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

  socket.on("select", (choice) => {
    choice = parseInt(choice);
    let { username, contestId } = socket;
    let contest = contests.get(contestId);
    if (!username || !contestId || !contest) return;
    if (contest.isPlayerBlocked(username)) return;
    if (contest.isPlayersBlocked()) {
      startRound(contest);
    }
    let isCorrectChoice = contest.isCorrectChoice(choice);
    socket.emit("isCorrect", isCorrectChoice)
    if (isCorrectChoice) {
      contest.addPointToPlayer(username);
      console.log(
        `Correct answer for player ${username} in contest ${contestId} round ${contest.getRoundsCount()}`
      );
    } else {
      console.log(
        `Wrong answer for player ${username} in contest ${contestId} round ${contest.getRoundsCount()}`
      );
      contest.blockPlayer(username);
    }

    if (
      isCorrectChoice ||
      contest.getBlockedPlayersCount() === CONTEST_PLAYERS
    ) {
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

    let { contestId, username } = socket
    let contest = contests.get(contestId)

    if (contest) {
      contest.removePlayer(username)
      if (contest.getReadyPlayersCount() == 1) {
        console.log(`Contest ${contestId} has ended`);
        contests.delete(contestId);
        io.to(contestId).emit("end", contest.getScore());
      }
    }

    socket.username = null;
    socket.contestId = null;
    console.log(`${socket.id} disconnected`);
  });
});

function startRound(contest) {
  let round = Dictionary.getInstance().generateRound();
  contest.addRound(round);
  io.to(contest.getId()).emit("round", {
    id: contest.getRoundsCount(),
    image: round.getImage(),
    choices: round.getChoices(),
    users: contest.getScore(),
    maxRounds: CONTEST_ROUNDS,
  });
  console.log(
    `Round ${contest.getRoundsCount()} in contest ${contest.getId()} began`
  );
}

module.exports = { httpServer };
