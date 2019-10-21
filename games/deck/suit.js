const Card = require('./card');

class Suit {
  constructor(name, symbol) {
    this.name = name;
    this.symbol = symbol;
    this.face = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    this.suit = []

    for (let i = 1; i < 14; i++) {
      this.suit.push(new Card(this.symbol, this.face[i - 1], i));
    }
  }
}

module.exports = Suit;
