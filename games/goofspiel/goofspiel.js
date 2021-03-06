const Deck = require('../deck/deck');

class Goofspiel {
  constructor() {
    this.id;
    this.gamename = 'Goofspiel';
    this.inProgress = true;
    this.deck = new Deck();
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
    this.playerOne.cards = this.deck.spades;
    this.playerTwo.cards = this.deck.hearts;

    io.to(this.getPlayerOne.id).emit('prize', this.newPrize());
    io.to(this.getPlayerTwo.id).emit('prize', this.getCurrentPrize);
    io.to(this.getPlayerOne.id).emit('opponent', this.getPlayerTwo.username, this.getPlayerOne.cards.suit);
    io.to(this.getPlayerTwo.id).emit('opponent', this.getPlayerOne.username, this.playerTwo.cards.suit);

    io.to(this.getPlayerOne.id).emit('turn');
  }

  takeTurn(io, socket, card) {
    if (this.getPlayerOne.card === undefined) {
      this.getPlayerOne.card = card;
    } else {
      if (this.getPlayerOne.card > card) {
        this.getPlayerOne.score += this.getCurrentPrize;

      } else if (this.getPlayerOne.card < card) {
        this.getPlayerTwo.score += this.getCurrentPrize;
      } else {
        this.getPlayerOne.score += this.getCurrentPrize / 2;
        this.getPlayerTwo.score += this.getCurrentPrize / 2;
      }
      io.to(`${this.getPlayerOne.id}`).emit('score', this.getPlayerOne.score, this.getPlayerTwo.score);
      io.to(`${this.getPlayerTwo.id}`).emit('score', this.getPlayerTwo.score, this.getPlayerOne.score);
      io.to(`${this.getPlayerOne.id}`).emit('show', this.getPlayerOne.cards.suit[this.getPlayerOne.card - 1], this.getPlayerTwo.cards.suit[card - 1]);
      io.to(`${this.getPlayerTwo.id}`).emit('show', this.getPlayerTwo.cards.suit[card - 1], this.getPlayerOne.cards.suit[this.getPlayerOne.card - 1]);

      this.getPlayerOne.card = undefined;
      if (!this.isGameOver()) {
        io.to(`${this.getPlayerOne.id}`).emit('prize', this.newPrize());
        io.to(`${this.getPlayerTwo.id}`).emit('prize', this.getCurrentPrize);
      } else {
        if (this.getPlayerOne.score > this.getPlayerTwo.score) {
          io.to(`${this.getPlayerOne.id}`).emit('win', 'winner', 'loser');
          io.to(`${this.getPlayerTwo.id}`).emit('win', 'loser', 'winner');
        } else if (this.getPlayerOne.score < this.getPlayerTwo.score) {
          io.to(`${this.getPlayerOne.id}`).emit('win', 'loser', 'winner');
          io.to(`${this.getPlayerTwo.id}`).emit('win', 'winner', 'loser');
        } else {
          io.to(`${this.getPlayerOne.id}`).emit('win', 'tie', 'tie');
          io.to(`${this.getPlayerTwo.id}`).emit('win', 'tie', 'tie');
          io.to(`${this.getPlayerOne.id}`).emit('tie');
        }
        this.gameOver();
      }
    }
    socket.broadcast.to(socket.turn).emit('turn');
  }

  left(io, socket) {
    if (this.inProgress) {
      if (this.playerOne.id === socket.id) {
        io.to(`${this.getPlayerTwo.id}`).emit('win', 'winner', 'loser');
        io.to(`${this.getPlayerOne.id}`).emit('exit');
      } else {
        io.to(`${this.getPlayerOne.id}`).emit('win', 'winner', 'loser');
        io.to(`${this.getPlayerTwo.id}`).emit('exit');
      }

      this.gameOver();
    } else {
      io.to(socket.id).emit('exit');
    }
  }
}

module.exports = Goofspiel;
