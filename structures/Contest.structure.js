const { Round } = require("./Round.structure");

class Contest {
  constructor(contestId) {
    this._hasContestStarted = false;
    this._readyPlayers = new Set();
    this._score = new Map();
    this._blockedPlayers = new Set();
    this._rounds = [];
    this._id = contestId;
  }

  getId() {
    return this._id;
  }

  addPlayer(username) {
    this._score.set(username, 0);
  }

  removePlayer(username) {
    this._score.delete(username)
    this._readyPlayers.delete(username)
  }

  makeReady(username) {
    this._readyPlayers.add(username);
  }

  isReady(username) {
    return this._readyPlayers.has(username);
  }

  getReadyPlayersCount() {
    return this._readyPlayers.size;
  }

  startContest() {
    this._hasContestStarted = true;
  }

  hasContestStarted() {
    return this._hasContestStarted;
  }

  /**
   *
   * @param round The details of the round to be added
   */
  addRound(round) {
    this._rounds.push(round);
    this._hasContestStarted = true;
    this._blockedPlayers.clear();
  }

  getRoundsCount() {
    return this._rounds.length;
  }

  addPointToPlayer(username) {
    this._score.set(username, this._score.get(username) + 1);
  }

  isCorrectChoice(choice) {
    return (
      this._rounds[this._rounds.length - 1] &&
      this._rounds[this._rounds.length - 1].getCorrectChoice() === choice
    );
  }

  getScore() {
    let users = [];
    for (let [key, value] of this._score) {
      let user = {};
      user.name = key;
      user.score = value;
      users.push(user);
    }
    return users;
  }

  blockPlayer(username) {
    this._blockedPlayers.add(username);
  }

  isPlayerBlocked(username) {
    return this._blockedPlayers.has(username);
  }
  isPlayersBlocked() {
    return this._blockedPlayers.size == this._readyPlayers.size
  }
  getBlockedPlayersCount() {
    return this._blockedPlayers.size;
  }
}

module.exports = { Contest };
