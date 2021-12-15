const { Round } = require("./round");

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

    addPointToPlayer (username) {
        this._score.set(username, this._score.get(username) + 1);
    }

    ready (username) {
        this._readyPlayers.add(username);
    }

    getReadyPlayersCount () {
        return this._readyPlayers.size;
    }

    hasContestStarted () {
        return this._hasContestStarted;
    }

    addRound (image, choices, correctChoice) {
        let round = new Round(image, choices, correctChoice);
        this._rounds.push(round);
        this._hasContestStarted = true;
    }

    getRoundsCount () {
        return this._rounds.length;
    }
}

module.exports = { Contest };
