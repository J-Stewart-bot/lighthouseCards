const Deck = require('../deck/deck');
const {checkCards} = require('../deck/orderCheck');

class Speed {
  constructor() {
    this.id;
    this.gamename = 'Speed';
    this.inProgress = true;
    this.deck = new Deck();
    this.playerOne;
    this.playerTwo;
    this.ready = false;
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

  shuffleDeck() {
    this.deck.shuffleDeck();
  }

  isGameOver() {
    if (this.prizes.length <= 0) {
      return true;
    }

    return false;
  }

  gameOver(io, socket) {
    if (socket.id === this.getPlayerOne.id) {
      io.to(`${this.getPlayerOne.id}`).emit('win', 'winner', 'loser');
      io.to(`${this.getPlayerTwo.id}`).emit('win', 'loser', 'winner');
    } else {
      io.to(`${this.getPlayerOne.id}`).emit('win', 'loser', 'winner');
      io.to(`${this.getPlayerTwo.id}`).emit('win', 'winner', 'loser');
    }
  }

  start(io) {
    this.shuffleDeck();
    this.getPlayerOne.cards = this.deck.getDeck.splice(0, 5);
    this.getPlayerTwo.cards = this.deck.getDeck.splice(0, 5);

    this.getPlayerOne.deck = this.deck.getDeck.splice(0, 15);
    this.getPlayerTwo.deck = this.deck.getDeck.splice(0, 15);

    this.getPlayerOne.draw = this.deck.getDeck.splice(0, 6);
    this.getPlayerTwo.draw = this.deck.getDeck.splice(0, 6);

    io.to(this.getPlayerOne.id).emit('opponent', this.getPlayerTwo.username, this.getPlayerOne.cards);
    io.to(this.getPlayerTwo.id).emit('opponent', this.getPlayerOne.username, this.playerTwo.cards);

    io.to(`${this.getPlayerOne.id}`).emit('ready');
    io.to(`${this.getPlayerTwo.id}`).emit('ready');

    io.to(this.getPlayerOne.id).emit('turn', true);
    io.to(this.getPlayerTwo.id).emit('turn', true);
  }

  bothReady(io) {
    if (this.ready) {
      this.getPlayerOne.display = this.getPlayerOne.draw.pop();
      this.getPlayerTwo.display = this.getPlayerTwo.draw.pop();

      io.to(`${this.getPlayerOne.id}`).emit('show', this.getPlayerOne.display, this.getPlayerTwo.display);
      io.to(`${this.getPlayerTwo.id}`).emit('show', this.getPlayerTwo.display, this.getPlayerOne.display);

      this.ready = false;
    } else {
      this.ready = true;
    }
  }

  pickUp(io, socket) {
    io.to(socket.id).emit('draw', socket.deck.pop());
  }

  takeTurn(io, socket, card, display) {
    // if display one off card
    if (checkCards(card, display)) {
      io.to(socket.id).emit('remove', card);
      if (display.img === this.getPlayerOne.display.img) {
        io.to(`${this.getPlayerOne.id}`).emit('show', card, this.getPlayerTwo.display);
        io.to(`${this.getPlayerTwo.id}`).emit('show', this.getPlayerTwo.display, card);

        this.getPlayerOne.display = card;
      } else {
        io.to(`${this.getPlayerOne.id}`).emit('show', this.getPlayerOne.display, card);
        io.to(`${this.getPlayerTwo.id}`).emit('show', card, this.getPlayerOne.display);

        this.getPlayerTwo.display = card;
      }

      if (socket.id === this.getPlayerOne.id) {
        io.to(`${this.getPlayerOne.id}`).emit('score', 1, 0);
        io.to(`${this.getPlayerTwo.id}`).emit('score', 0, 1);
      } else {
        io.to(`${this.getPlayerOne.id}`).emit('score', 0, 1);
        io.to(`${this.getPlayerTwo.id}`).emit('score', 1, 0);
      }

      this.ready = false;
    } else {
      io.to(socket.id).emit('invalid');
    }



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
    } else {
      io.to(socket.id).emit('exit');
    }
  }
}

module.exports = Speed;
