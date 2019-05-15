var game = {
  number: new Decimal(10),
  mult: {
    amount:[1337, new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1)],
    cost:[420, new Decimal(10), new Decimal(1e10), Decimal.fromComponents(1, 2, 2), Decimal.fromComponents(1, 2, 3)],
    unlocked:[69, false, false, false, false]
  },
};
setInterval(function() {
  game.number = game.number.mul(game.mult.amount[1].root(100));
  game.mult.amount[1] = game.mult.amount[1].mul(game.mult.amount[2].root(100));
  game.mult.amount[2] = game.mult.amount[2].mul(game.mult.amount[3].root(100));
  game.mult.amount[3] = game.mult.amount[3].mul(game.mult.amount[4].root(100));
  updateStuff();
}, 10);
function updateStuff() {
  document.getElementById("number").innerHTML = findDisplayValue(game.number);
  document.getElementById("mult1").innerHTML = findDisplayValue(game.mult.amount[1]);
  document.getElementById("mult2").innerHTML = findDisplayValue(game.mult.amount[2]);
  document.getElementById("mult3").innerHTML = findDisplayValue(game.mult.amount[3]);
  document.getElementById("mult4").innerHTML = findDisplayValue(game.mult.amount[4]);
  if (game.mult.unlocked[1] == false) {
    document.getElementById("multButton1").innerHTML = "Unlock Multiplier 1 Cost: " + findDisplayValue(game.mult.cost[1]);
  } else {
    document.getElementById("multButton1").innerHTML = "Square Multiplier 1 Cost: " + findDisplayValue(game.mult.cost[1]);
  }
  if (game.mult.unlocked[2] == false) {
    document.getElementById("multButton2").innerHTML = "Unlock Multiplier 2 Cost: " + findDisplayValue(game.mult.cost[2]);
  } else {
    document.getElementById("multButton2").innerHTML = "Square Multiplier 2 Cost: " + findDisplayValue(game.mult.cost[2]);
  }
  if (game.mult.unlocked[3] == false) {
    document.getElementById("multButton3").innerHTML = "Unlock Multiplier 3 Cost: " + findDisplayValue(game.mult.cost[3]);
  } else {
    document.getElementById("multButton3").innerHTML = "Square Multiplier 3 Cost: " + findDisplayValue(game.mult.cost[3]);
  }
  if (game.mult.unlocked[4] == false) {
    document.getElementById("multButton4").innerHTML = "Unlock Multiplier 4 Cost: " + findDisplayValue(game.mult.cost[4]);
  } else {
    document.getElementById("multButton4").innerHTML = "Square Multiplier 4 Cost: " + findDisplayValue(game.mult.cost[4]);
  }
}
function buyMult(n) {
  if (game.number.greaterThanOrEqualTo(game.mult.cost[n])) {
    game.number = game.number.div(game.mult.cost[n]);
    if (game.mult.unlocked[n] == false) {
      game.mult.amount[n] = game.mult.amount[n].mul(1.5);
      game.mult.unlocked[n] = true;
    } else {
      game.mult.amount[n] = game.mult.amount[n].pow(2);
      game.mult.cost[n] = game.mult.cost[n].pow(1000);
    }
    updateStuff();
  }
}
function findDisplayValue(n) {
  if (n.lessThan(1000)) {
    return n.toFixed(2);
  } else if (n.lessThan(Decimal.fromComponents(1, 4, 1))) {
    return n.m.toFixed(2) + "e" + findDisplayValue(new Decimal(n.e));
  } else {
    return "E" + n.e + "#" + n.layer;
  }
}
