const Deck = require('../deck/deck');

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

  gameOver() {
    this.inProgress = false;
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

    io.to(`${this.getPlayerOne.id}`).emit('score', this.getPlayerOne.cards.length + this.getPlayerOne.deck.length, this.getPlayerTwo.cards.length + this.getPlayerTwo.deck.length);
    io.to(`${this.getPlayerTwo.id}`).emit('score', this.getPlayerTwo.cards.length + this.getPlayerTwo.deck.length, this.getPlayerOne.cards.length + this.getPlayerOne.deck.length);

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
    } else {
      this.ready = true;
    }
  }

  pickUp(io, socket) {
    io.to(socket.id).emit('draw', socket.deck.pop());
    console.log(socket.deck);
  }

  takeTurn(io, socket, card, display) {
    // if display one off card

    io.to(socket.id).emit('remove', card);
    // io.to(`${this.getPlayerOne.id}`).emit('show', this.getPlayerOne.display, this.getPlayerTwo.display);
    // io.to(`${this.getPlayerTwo.id}`).emit('show', this.getPlayerTwo.display, this.getPlayerOne.display);




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

module.exports = Speed;
