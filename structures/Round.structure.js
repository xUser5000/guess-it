class Round {
    constructor (image, choices, correctChoice) {
        this._image = image;
        this._choices = choices;
        this._correctChoice = correctChoice;
    }

    getImage () {
        return this._image;
    }

    getChoices () {
        return this._choices;
    }

    getCorrectChoice () {
        return this._correctChoice;
    }
}

module.exports = { Round };
