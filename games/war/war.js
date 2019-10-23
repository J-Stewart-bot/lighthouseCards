const Deck = require('../deck/deck');

class War {
  constructor() {
    this.id;
    this.gamename = 'War';
    this.inProgress = true;
    this.playerOne;
    this.playerTwo;
    this.deck = new Deck();
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

  gameOver() {
    this.inProgress = false;
  }

  isGameOver() {
    if (this.getPlayerOne.cards.length === 0 || this.getPlayerTwo.cards.length === 0) {
      return true;
    }

    return false;
  }

  shuffleDeck() {
    this.deck.shuffleDeck();
  }

  start(io) {
    this.shuffleDeck();
    this.getPlayerOne.cards = this.deck.getDeck.splice(0, this.deck.getDeck.length / 2);
    this.getPlayerTwo.cards = this.deck.getDeck;


    io.to(this.getPlayerOne.id).emit('opponent', this.getPlayerTwo.username);
    io.to(this.getPlayerTwo.id).emit('opponent', this.getPlayerOne.username);

    io.to(`${this.getPlayerOne.id}`).emit('score', this.getPlayerOne.cards.length, this.getPlayerTwo.cards.length);
    io.to(`${this.getPlayerTwo.id}`).emit('score', this.getPlayerTwo.cards.length, this.getPlayerOne.cards.length);

    io.to(this.getPlayerOne.id).emit('turn', this.getPlayerTwo.username);
  }

  takeTurn(io, socket, username) {
    if (this.getPlayerOne.card === undefined) {
      this.getPlayerOne.card = this.getPlayerOne.cards.shift();
      this.getPlayerOne.bet.unshift(this.getPlayerOne.card);

    } else {
      this.getPlayerTwo.card = this.getPlayerTwo.cards.shift();
      this.getPlayerTwo.bet.unshift(this.getPlayerTwo.card);

      if (this.getPlayerOne.bet[0].value > this.getPlayerTwo.bet[0].value) {
        this.getPlayerOne.cards = this.getPlayerOne.cards.concat(this.getPlayerOne.bet);
        this.getPlayerOne.cards = this.getPlayerOne.cards.concat(this.getPlayerTwo.bet);

        this.getPlayerOne.bet = [];
        this.getPlayerTwo.bet = [];
      } else if (this.getPlayerOne.bet[0].value < this.getPlayerTwo.bet[0].value) {
        this.getPlayerTwo.cards = this.getPlayerTwo.cards.concat(this.getPlayerOne.bet);
        this.getPlayerTwo.cards = this.getPlayerTwo.cards.concat(this.getPlayerTwo.bet);
        this.getPlayerOne.bet = [];
        this.getPlayerTwo.bet = [];
      }

      io.to(`${this.getPlayerOne.id}`).emit('score', this.getPlayerOne.cards.length, this.getPlayerTwo.cards.length);
      io.to(`${this.getPlayerTwo.id}`).emit('score', this.getPlayerTwo.cards.length, this.getPlayerOne.cards.length);
      io.to(`${this.getPlayerOne.id}`).emit('show', this.getPlayerOne.card.img, this.getPlayerTwo.card.img);
      io.to(`${this.getPlayerTwo.id}`).emit('show', this.getPlayerTwo.card.img, this.getPlayerOne.card.img);
      this.getPlayerOne.card = undefined;
      if (this.isGameOver()) {
        if (this.getPlayerOne.score > this.getPlayerTwo.score) {
          io.to(`${this.getPlayerOne.id}`).emit('win', 'winner', 'loser');
          io.to(`${this.getPlayerTwo.id}`).emit('win', 'loser', 'winner');
        } else {
          io.to(`${this.getPlayerOne.id}`).emit('win', 'loser', 'winner');
          io.to(`${this.getPlayerTwo.id}`).emit('win', 'winner', 'loser');
        }
        this.gameOver();
      }
    }
    socket.broadcast.to(socket.turn).emit('turn', username);
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

module.exports = War;
