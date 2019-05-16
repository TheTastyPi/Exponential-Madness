var game = {
  number: new Decimal(10),
  mult: {
    amount:[0, new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1)],
    power:[0, new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1)],
    powerPerBuy:new Decimal(2),
    cost:[0, new Decimal(10), new Decimal(1e10), Decimal.fromComponents(1, 2, 2), Decimal.fromComponents(1, 2, 3)],
    unlocked:[0, false, false, false, false]
  },
  superMult: {
    amount:[0, new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1)],
    power:[0, new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1)],
    powerPerBuy:new Decimal(2),
    cost:[0, Decimal.fromComponents(1, 2, 7), Decimal.fromComponents(1, 3, 1), Decimal.fromComponents(1, 3, 1), Decimal.fromComponents(1, 3, 1)],
    unlocked:[0, false, false, false, false]
  }
};
setInterval(function() {
  game.number = game.number.mul(game.mult.amount[1].root(100));
  game.mult.amount[1] = game.mult.amount[1].mul(game.mult.amount[2].root(100));
  game.mult.amount[2] = game.mult.amount[2].mul(game.mult.amount[3].root(100));
  game.mult.amount[3] = game.mult.amount[3].mul(game.mult.amount[4].root(100));
  updateStuff();
}, 10);
function updateStuff() {
  game.mult.amount.forEach(function(a, n) {
    game.mult.amount[n] = a.pow(game.mult.power[n]); 
    document.getElementById("mult" + n).innerHTML = findDisplayValue(a);
  });
  game.mult.power.forEach(function(p, n) {
    document.getElementById("multPower" + n).innerHTML = findDisplayValue(p);
  }
  document.getElementById("number").innerHTML = findDisplayValue(game.number);
  game.mult.cost.forEach(function(c, n) {
    if (game.mult.unlocked[n] == false) {
      document.getElementById("multButton" + n).innerHTML = "Unlock Multiplier " + n + " Cost: " + findDisplayValue(c);
    } else {
      document.getElementById("multButton" + n).innerHTML = "Square Multiplier " + n + " Cost: " + findDisplayValue(c);
    }
  });
}
function buyMult(n) {
  if (game.number.greaterThanOrEqualTo(game.mult.cost[n])) {
    game.number = game.number.div(game.mult.cost[n]);
    if (game.mult.unlocked[n] == false) {
      game.mult.amount[n] = game.mult.amount[n].mul(1.5);
      game.mult.unlocked[n] = true;
    } else {
      game.mult.power[n] = game.mult.power[n].mul(game.mult.powerPerBuy);
      game.mult.cost[n] = game.mult.cost[n].pow(1000);
    }
    updateStuff();
  }
}
function findDisplayValue(n) {
  if (n.lessThan(1000)) {
    return n.toFixed(2);
  } else if (n.lessThan(1e100)) {
    return n.m.toFixed(2) + "e" + findDisplayValue(new Decimal(n.e));
  } else if (n.lessThan(Decimal.fromComponents(1, 4, 1))) {
    return "e" + findDisplayValue(new Decimal(n.e));
  } else {
    return "E" + n.e + "#" + n.layer;
  }
}
