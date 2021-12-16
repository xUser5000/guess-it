const fs = require("fs");

/**
 * This class should not be instantiated directly
 * Instead, use the static method getInstance() 
 */
class Dictionary {

    static instance = null;
    static getInstance () {
        if (instance === null) instance = new Dictionary();
        return instance;
    }

    _words = [];
    _images = [];

    constructor () {
        let lines = fs.readFileSync("nouns.txt", "utf-8").split("\n");
        lines.forEach(line => {
            let tokens = line.split(" ");
            this._words.push(tokens[0]);
            this._images.push(tokens[1]);
        });
    }

    generateRound () {
        let choices = [];
        while (choices.length < 4) {
            let idx = Math.floor(Math.random() * this._words.length);
            if (!choices.includes(idx)) choices.push(idx);
        }
        let correctChoice = Math.random() * 4;
        let image = this._images[ choices[correctChoice] ];
        choices = choices.map(choice => this._words[choice]);
        return {image, choices, correctChoice};
    }
}

module.exports = { Dictionary };
