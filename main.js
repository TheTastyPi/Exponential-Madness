var game = {
  number: new Decimal(10),
  mult: {
    1: new Decimal(1),
    2: new Decimal(1)
  },
  multCost: {
    1: new Decimal(10),
    2: new Decimal(1e6)
  },
  multUnlocked: {
    1: false,
    2: false
  }
};
setInterval(function() {
  game.number = game.number.times(game.mult.1);
}, 1000);
function buyMult1() {
  if (game.multUnlocked.1 == false) {
    game.mult.1.times(1.25);
  } else {
    game.number = game.number.div(game.multCost.1);
    game.mult.1 = game.mult.1.pow(2);
  }
}
