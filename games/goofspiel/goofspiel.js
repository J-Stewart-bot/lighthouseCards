class Goofspiel {
  constructor() {
    this.id;
    this.gamename = 'Goofspiel';
    this.inProgress = true;
    this.playerOne;
    this.playerTwo;
    this.prizes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    this.currentPrize = -1;
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

  gameOver() {
    this.inProgress = false;
  }

  start(io) {
    io.to(this.getPlayerOne.id).emit('prize', this.newPrize());
    io.to(this.getPlayerTwo.id).emit('prize', this.getCurrentPrize);
    io.to(this.getPlayerOne.id).emit('opponent', this.getPlayerTwo.username);
    io.to(this.getPlayerTwo.id).emit('opponent', this.getPlayerOne.username);

    io.to(this.getPlayerOne.id).emit('turn', this.getPlayerTwo.username);
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
        this.gameOver();
      }
    }
  socket.broadcast.to(socket.turn).emit('turn', username);
  }

  left(io, socket) {
    if (this.inProgress) {
      if (this.playerOne.id === socket.id) {
        io.to(`${this.getPlayerTwo.id}`).emit('score', 'winner', 'loser');
        io.to(`${this.getPlayerOne.id}`).emit('exit');
      } else {
        io.to(`${this.getPlayerOne.id}`).emit('score', 'winner', 'loser');
        io.to(`${this.getPlayerTwo.id}`).emit('exit');
      }

      this.gameOver();
    } else {
      io.to(socket.id).emit('exit');
    }

  }

}

module.exports = Goofspiel;
