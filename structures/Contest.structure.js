const { Round } = require("./Round.structure");

class Contest {
    
    constructor () {
        this._hasContestStarted = false;
        this._readyPlayers = new Set();
        this._score = new Map();
        this._rounds = [];
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
    }

    getRoundsCount () {
        return this._rounds.length;
    }

    addPointToPlayer (username) {
        this._score.set(username, this._score.get(username) + 1);
    }
}

module.exports = { Contest };
