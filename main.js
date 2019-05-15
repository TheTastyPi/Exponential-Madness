var game = {
  number: new Decimal(10),
  mult: {
    amount:[1337, new Decimal(1), new Decimal(1)],
    cost:[420, new Decimal(10), new Decimal(100)],
    unlocked:[69, false, false]
  },
};
setInterval(function() {
  game.number = game.number.mul(game.mult.amount[1]);
  updateStuff();
}, 1000);
function updateStuff() {
  document.getElementById("number").innerHTML = findDisplayValue(game.number);
  document.getElementById("mult1").innerHTML = findDisplayValue(game.mult.amount[1]);
  if (game.mult.unlocked[1] == false) {
    document.getElementById("multButton1").innerHTML = "Unlock Multiplier 1 Cost: " + findDisplayValue(game.mult.cost[1]);
  } else {
    document.getElementById("multButton1").innerHTML = "Square Multiplier 1 Cost: " + findDisplayValue(game.mult.cost[1]);
  }
}
function buyMult(n) {
  if (game.number.greaterThanOrEqualTo(game.mult.cost[n])) {
    if (game.mult.unlocked[n] == false) {
      game.mult.amount[n] = game.mult.amount[n].mul(1.25);
      game.mult.unlocked[n] = true;
    } else {
      game.number = game.number.div(game.mult.cost[n]);
      game.mult.amount[n] = game.mult.amount[n].pow(2);
      game.mult.cost[n] = game.mult.cost[n].pow(1000);
    }
    updateStuff();
  }
}
function findDisplayValue(n) {
  if (n.lessThan(1000)) {
    return Math.round(n*100)/100;
  } else if (n.lessThan(Decimal.fromComponents(1, 4, 1))) {
    return Math.round(n.m*100)/100 + "e" + n.e;
  } else {
    return "E" + n.e + "#" + n.layer;
  }
}
