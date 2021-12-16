const { Round } = require("./Round.structure");

class Contest {
    
    constructor (contestId) {
        this._hasContestStarted = false;
        this._readyPlayers = new Set();
        this._score = new Map();
        this._blockedPlayers = new Set();
        this._rounds = [];
        this._id = contestId;
    }

    getId () {
        return this._id;
    }

    addPlayer (username) {
        this._score.set(username, 0);
    }

    makeReady (username) {
        this._readyPlayers.add(username);
    }

    isReady (username) {
        return this._readyPlayers.has(username);
    }

    getReadyPlayersCount () {
        return this._readyPlayers.size;
    }

    startContest () {
        this._hasContestStarted = true;
    }

    hasContestStarted () {
        return this._hasContestStarted;
    }

    /**
     * 
     * @param {String} image Image url
     * @param {String[]} choices Words that can be chosen by the players 
     * @param {Number} correctChoice The index of the correct choice
     */
    addRound (image, choices, correctChoice) {
        let round = new Round(image, choices, correctChoice);
        this._rounds.push(round);
        this._hasContestStarted = true;
        this._blockedPlayers.clear();
    }

    getRoundsCount () {
        return this._rounds.length;
    }

    addPointToPlayer (username) {
        this._score.set(username, this._score.get(username) + 1);
    }

    isCorrectChoice (choice) {
        return this._rounds[this._rounds.length - 1].getCorrectChoice() === choice;
    }

    getScore () {
        let obj = {};
        for (let [key, value] of this._score) {
            obj[key] = value;
        }
        return obj;
    }

    blockPlayer (username) {
        this._blockedPlayers.add(username);
    }

    isPlayerBlocked (username) {
        return this._blockedPlayers.has(username);
    }
}

module.exports = { Contest };
