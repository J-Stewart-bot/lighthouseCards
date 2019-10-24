const checkCards = function(playerCard, pileCard) {
  if (Math.abs(playerCard.value - pileCard.value) === 1) {
    return true;
  } else if (playerCard.face === 'K' && pileCard.face === 'A') {
    return true;
  } else if (playerCard.face === 'A' && pileCard.face === 'K') {
    return true;
  } else {
    return false;
  }
};

const checkPiles = function(hand, piles) {
  for (const playerCard of hand) {
    for (const pileCard of piles) {
      if (checkCards(playerCard, pileCard)) {
        return true;
      }
    }
  }
  return false;
};

module.exports = {checkPiles, checkCards};
