class Goofspiel {
  constructor() {
    this.id;
    this.gameType = 1;
    this.playerOne;
    this.playerTwo;
    this.prizes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    this.currentPrize = -1;
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

  get getCurrentPrize() {
    return this.currentPrize;
  }

  newPrize() {
    let value = Math.round(Math.random() * (this.prizes.length - 1));
    this.currentPrize = this.prizes[value];
    this.prizes.splice(value, 1);
    return this.currentPrize;
  }

  isGameOver() {
    if (this.prizes.length <= 0) {
      return true;
    }

    return false;
  }

  takeTurn(io, socket, username, card) {
    if (this.getPlayerOne.card === undefined) {
      this.getPlayerOne.card = card;
    } else {
      if (this.getPlayerOne.card > card) {
        this.getPlayerOne.score += this.getCurrentPrize;
        io.to(`${this.getPlayerOne.id}`).emit('score', this.getPlayerOne.score, this.getPlayerTwo.score);
        io.to(`${this.getPlayerTwo.id}`).emit('score', this.getPlayerTwo.score, this.getPlayerOne.score);

      } else if (this.getPlayerOne.card < card) {
        this.getPlayerTwo.score += this.getCurrentPrize;
        io.to(`${this.getPlayerOne.id}`).emit('score', this.getPlayerOne.score, this.getPlayerTwo.score);
        io.to(`${this.getPlayerTwo.id}`).emit('score', this.getPlayerTwo.score, this.getPlayerOne.score);
      } else {
        this.getPlayerOne.score += this.getCurrentPrize / 2;
        this.getPlayerTwo.score += this.getCurrentPrize / 2;
        io.to(`${this.getPlayerOne.id}`).emit('score', this.getPlayerOne.score, this.getPlayerTwo.score);
        io.to(`${this.getPlayerTwo.id}`).emit('score', this.getPlayerTwo.score, this.getPlayerOne.score);
      }
      io.to(`${this.getPlayerOne.id}`).emit('show', this.getPlayerOne.card, card);
      io.to(`${this.getPlayerTwo.id}`).emit('show', card, this.getPlayerOne.card);
      this.getPlayerOne.card = undefined;
      if (!this.isGameOver()) {
        io.to(`${this.getPlayerOne.id}`).emit('prize', this.newPrize());
        io.to(`${this.getPlayerTwo.id}`).emit('prize', this.getCurrentPrize);
      } else {
        if (this.getPlayerOne.score > this.getPlayerTwo.score) {
          io.to(`${this.getPlayerOne.id}`).emit('score', 'winner', 'loser');
          io.to(`${this.getPlayerTwo.id}`).emit('score', 'loser', 'winner');
        } else {
          io.to(`${this.getPlayerOne.id}`).emit('score', 'loser', 'winner');
          io.to(`${this.getPlayerTwo.id}`).emit('score', 'winner', 'loser');
        }

      }
    }
  socket.broadcast.to(socket.turn).emit('turn', username);
  }

}

module.exports = Goofspiel;
