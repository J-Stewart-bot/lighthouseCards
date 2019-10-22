const Suit = require('./suit');

class Deck {
  constructor() {
    this.deck = [];
    this.diamonds = new Suit('diamonds', 'D');
    this.clubs = new Suit('clubs', 'C');
    this.hearts = new Suit('hearts', 'H');
    this.spades = new Suit('spades', 'S');

    this.deck = this.deck.concat(this.diamonds.suit);
    this.deck = this.deck.concat(this.clubs.suit);
    this.deck = this.deck.concat(this.hearts.suit);
    this.deck = this.deck.concat(this.spades.suit);
  }

  get getDeck() {
    return this.deck;
  }

  setDeck(deck) {
    this.deck = deck;
  }

  shuffleDeck() {
    let newDeck = [];

    while (this.deck.length > 0) {
      let num = Math.round(Math.random() * (this.deck.length - 1))

      newDeck = newDeck.concat(this.deck.splice(num, 1));
    }

    this.deck = newDeck;
  }
};

module.exports = Deck;

