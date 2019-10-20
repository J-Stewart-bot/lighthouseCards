class Goofspiel {
  constructor() {
    this.playerOne;
    this.playerTwo;
    this.prizes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    this.currentPrize = -1;
  }

  get getPlayerOne() {
    return this.playerOne;
  }

  get getPlayerTwo() {
    return this.playerTwo;
  }

  setPlayerOne(socket) {
    this.playerOne = socket;
  }

  setPlayerTwo(socket) {
    this.playerTwo = socket;
  }

  get getCurrentPrize() {
    return this.currentPrize;
  }

  newPrize() {
    let value = Math.round(Math.random() * (this.prizes.length - 1));
    this.currentPrize = this.prizes[value];
    this.prizes.splice(value, 1);
    return this.currentPrize;
  }

  gameOver() {
    if (this.prizes.length <= 0) {
      return true;
    }

    return false;
  }
}

module.exports = Goofspiel;
