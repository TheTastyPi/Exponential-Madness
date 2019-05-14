var game = {
  number: new Decimal(10),
  mult: {
    amount:[1337, new Decimal(1), new Decimal(1)],
    cost:[420, new Decimal(10), new Decimal(100)],
    unlocked:[69, false, false]
  },
};
setInterval(function() {
  game.number = game.number.times(game.mult.amount[1]);
}, 1000);
function updateStuff() {
  document.getElementById("number").innerHTML = findDisplayValue(game.number);
  document.getElementById("mult1").innerHTML = findDisplayValue(game.mult.amount[1]);
  document.getElementById("multCost1").innerHTML = findDisplayValue(game.mult.cost[1]);
}
function buyMult(n) {
  if (game.mult.unlocked[n] == false && game.number > game.mult.cost[n]) {
    game.mult.amount[n] = game.mult.amount[n].times(1.25);
    game.mult.unlocked = true;
  } else {
    game.number = game.number.div(game.mult.cost[n]);
    game.mult.amount[n] = game.mult.amount[n].pow(2);
  }
}
function findDisplayValue(n) {
  if (n < 1000) {
    return n.e;
  } else if (n < 1e100) {
    return "e" + n.e;
  } else {
    return "E" + n.e + "#" + n.layer;
  }
}
