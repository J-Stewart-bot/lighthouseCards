class Card {
  constructor(suit, face, value) {
    this.suit = suit;
    this.face = face;
    this.value = value;
  }

  get img() {
    return `${this.face}${this.suit}.png`;
  }
}

module.exports = Card;

