const fs = require("fs");
const { Round } = require("../structures/Round.structure");

/**
 * This class should not be instantiated directly
 * Instead, use the static method getInstance()
 */
class Dictionary {
  static instance = null;
  static getInstance() {
    if (Dictionary.instance === null) Dictionary.instance = new Dictionary();
    return Dictionary.instance;
  }

  _words = [];
  _images = [];

  constructor() {
    let lines = fs.readFileSync("nouns.txt", "utf-8").split("\n");
    lines.forEach((line) => {
      let tokens = line.split(" ");
      this._words.push(tokens[0]);
      this._images.push(tokens[1]);
    });
  }

  generateRound() {
    let choices = [];
    while (choices.length < 4) {
      let minimum = 1;
      let maximum = this._words.length;
      let randomIdx =
        Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
      if (!choices.includes(randomIdx)) choices.push(randomIdx);
    }
    let correctChoice = Math.floor(Math.random() * 4);
    let image = this._images[choices[correctChoice]];
    choices = choices.map((choice) => this._words[choice]);
    return new Round(image, choices, correctChoice);
  }
}

module.exports = { Dictionary };
