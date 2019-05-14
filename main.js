var game = {
  number: new Decimal(10),
  mult: {
    amount:[1337, 1, 1],
    cost:[420, 10, 1e6],
    unlocked:[69, false, false]
  },
};
setInterval(function() {
  game.number = game.number.times(game.mult.amount[1]);
}, 1000);
function buyMult(n) {
  if (game.multUnlocked[n] == false) {
    game.mult.amount[n] = game.mult.amount[n].times(1.25);
    game.mult.unlocked = true;
  } else {
    game.number = game.number.div(game.mult.cost[n]);
    game.mult.amount[n] = game.mult.amount[n].pow(2);
  }
}
