class War {
    constructor() {
      this.id;
      this.gamename = 'War';
      this.inProgress = true;
      this.playerOne;
      this.playerTwo;
    }

    get gameName() {
      return this.gamename;
    }

    get gameId() {
      return this.id;
    }

    setGameId(id) {
      this.id = id;
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

}

module.exports = War;
