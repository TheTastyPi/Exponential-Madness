function save() {
	localStorage.setItem('emsave', JSON.stringify(game));
}

function load() {
	if (localStorage.getItem('emsave')) {
		let dat = JSON.parse(localStorage.getItem('emsave'));
		let g = {};
		g.number = new Decimal(dat.number);
		g.mult = {
			amount:[dat.mult.amount[0], new Decimal(dat.mult.amount[1]), new Decimal(dat.mult.amount[2]), new Decimal(dat.mult.amount[3]), new Decimal(dat.mult.amount[4])],
			power:[dat.mult.power[0], new Decimal(dat.mult.power[1]), new Decimal(dat.mult.power[2]), new Decimal(dat.mult.power[3]), new Decimal(dat.mult.power[4])],
			generation:[dat.mult.generation[0], new Decimal(dat.mult.generation[1]), new Decimal(dat.mult.generation[2]), new Decimal(dat.mult.generation[3]), new Decimal(dat.mult.generation[4])],
			powerPerBuy:new Decimal(dat.mult.powerPerBuy),
			upgradeAmount:[dat.mult.upgradeAmount[0], new Decimal(dat.mult.upgradeAmount[1]), new Decimal(dat.mult.upgradeAmount[2]), new Decimal(dat.mult.upgradeAmount[3]), new Decimal(dat.mult.upgradeAmount[4])],
			cost:[dat.mult.cost[0], new Decimal(dat.mult.cost[1]), new Decimal(dat.mult.cost[2]), new Decimal(dat.mult.cost[3]), new Decimal(dat.mult.cost[4])],
			costIncrease:[dat.mult.costIncrease[0], 1e3, 1e4, 1e5, 1e6],
			unlocked:[dat.mult.unlocked[0], false, false, false, false]
		}
		g.superMult = {
			amount:[dat.superMult.amount[0], new Decimal(dat.superMult.amount[1]), new Decimal(dat.superMult.amount[2]), new Decimal(dat.superMult.amount[3]), new Decimal(dat.superMult.amount[4])],
			power:[dat.superMult.power[0], new Decimal(dat.superMult.power[1]), new Decimal(dat.superMult.power[2]), new Decimal(dat.superMult.power[3]), new Decimal(dat.superMult.power[4])],
			generation:[dat.superMult.generation[0], new Decimal(dat.superMult.generation[1]), new Decimal(dat.superMult.generation[2]), new Decimal(dat.superMult.generation[3]), new Decimal(dat.superMult.generation[4])],
			powerPerBuy:new Decimal(dat.superMult.powerPerBuy),
			upgradeAmount:[dat.superMult.upgradeAmount[0], new Decimal(dat.superMult.upgradeAmount[1]), new Decimal(dat.superMult.upgradeAmount[2]), new Decimal(dat.superMult.upgradeAmount[3]), new Decimal(dat.superMult.upgradeAmount[4])],
			cost:[dat.superMult.cost[0], new Decimal(dat.superMult.cost[1]), new Decimal(dat.superMult.cost[2]), new Decimal(dat.superMult.cost[3]), new Decimal(dat.superMult.cost[4])],
			costIncrease:[dat.superMult.costIncrease[0], 1e3, 1e4, 1e5, 1e6],
			unlocked:[dat.superMult.unlocked[0], false, false, false, false]
		}
		return g;
	} else {
		return false;
	}
}

var game;
if (load()) {
	game = load();
} else {
	game = {
	  number: new Decimal(10),
	  mult: {
		amount:[0, new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1)],
		power:[0, new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1)],
		generation:[0, new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1)],
		powerPerBuy:new Decimal(2),
		upgradeAmount:[0, new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0)],
		cost:[0, new Decimal(10), new Decimal(1e10), Decimal.fromComponents(1, 2, 2), Decimal.fromComponents(1, 2, 3)],
		costIncrease:[0, 1e3, 1e4, 1e5, 1e6],
		unlocked:[0, false, false, false, false]
	  },
	  superMult: {
		amount:[0, new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1)],
		power:[0, new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1)],
		generation:[0, new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1)],
		powerPerBuy:new Decimal(2),
		upgradeAmount:[0, new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0)],
		cost:[0, Decimal.fromComponents(1, 2, 9), Decimal.fromComponents(1, 3, 1), Decimal.fromComponents(1, 3, 1), Decimal.fromComponents(1, 3, 1)],
		costIncrease:[0, 1e3, 1e4, 1e5, 1e6],
		unlocked:[0, false, false, false, false]
	  }
	};
}
setInterval(function() {
  game.number = game.number.mul(game.mult.generation[1].root(20));
  for (i = 2; i < game.mult.amount.length; i++) {
    game.mult.amount[i-1] = game.mult.amount[i-1].mul(game.mult.generation[i].root(20));
  };
  game.mult.powerPerBuy = game.mult.powerPerBuy.mul(game.superMult.generation[1].root(20))
  for (i = 2; i < game.superMult.amount.length; i++) {
    game.superMult.amount[i-1] = game.superMult.amount[i-1].mul(game.superMult.generation[i].root(20));
  };
  updateStuff();
}, 50);
setInterval(function() {
  save();
}, 1000);
function updateStuff() {
  for (i = 1; i < game.mult.amount.length; i++) {
    game.mult.generation[i] = game.mult.amount[i].pow(game.mult.power[i]); 
    document.getElementById("mult" + i).innerHTML = findDisplayValue(game.mult.amount[i]);
  };
  document.getElementById("multPerSecond").innerHTML = findDisplayValue(game.mult.generation[1]);
  document.getElementById("number").innerHTML = findDisplayValue(game.number);
  for (i = 1; i < game.mult.cost.length; i++) {
    if (game.mult.unlocked[i] == false) {
      document.getElementById("multButton" + i).innerHTML = "Unlock Multiplier " + i + " Cost: " + findDisplayValue(game.mult.cost[i]);
    } else {
      document.getElementById("multButton" + i).innerHTML = "Square Multiplier " + i + " Cost: " + findDisplayValue(game.mult.cost[i]);
    }
  };
  for (i = 1; i < game.mult.power.length; i++) {
    document.getElementById("multPower" + i).innerHTML = "^" + findDisplayValue(game.mult.power[i]);
    game.mult.power[i] = game.mult.powerPerBuy.pow(game.mult.upgradeAmount[i]);
  };
  for (i = 1; i < game.superMult.amount.length; i++) {
    game.superMult.generation[i] = game.superMult.amount[i].pow(game.superMult.power[i]); 
    document.getElementById("superMult" + i).innerHTML = findDisplayValue(game.superMult.amount[i]);
  };
  for (i = 1; i < game.superMult.cost.length; i++) {
    if (game.superMult.unlocked[i] == false) {
      document.getElementById("superMultButton" + i).innerHTML = "Unlock Super Multiplier " + i + " Cost: " + findDisplayValue(game.superMult.cost[i]);
    } else {
      document.getElementById("superMultButton" + i).innerHTML = "Square Multiplier " + i + " Cost: " + findDisplayValue(game.superMult.cost[i]);
    }
  };
  for (i = 1; i < game.superMult.power.length; i++) {
    document.getElementById("superMultPower" + i).innerHTML = "^" + findDisplayValue(game.superMult.power[i]);
    game.superMult.power[i] = game.superMult.powerPerBuy.pow(game.superMult.upgradeAmount[i]);
  };
}
function buyMult(n) {
  if (game.number.greaterThanOrEqualTo(game.mult.cost[n])) {
    game.number = game.number.div(game.mult.cost[n]);
    if (game.mult.unlocked[n] == false) {
      game.mult.amount[n] = new Decimal(1.5);
      game.mult.unlocked[n] = true;
    } else {
      game.mult.upgradeAmount[n] = game.mult.upgradeAmount[n].add(1);
      game.mult.cost[n] = game.mult.cost[n].pow(game.mult.costIncrease[n]);
    }
    updateStuff();
  }
}
function buySuperMult(n) {
  if (game.number.greaterThanOrEqualTo(game.superMult.cost[n])) {
    game.number = game.number.div(game.superMult.cost[n]);
    if (game.superMult.unlocked[n] == false) {
      game.superMult.amount[n] = new Decimal(1.25);
      game.superMult.unlocked[n] = true;
    } else {
      game.superMult.upgradeAmount[n] = game.superMult.upgradeAmount[n].add(1);
      game.superMult.cost[n] = game.superMult.cost[n].pow(game.superMult.costIncrease[n]);
    }
    updateStuff();
  }
}
function findDisplayValue(n) {
  if (n.lessThan(1000)) {
    return n.toFixed(2);
  } else if (n.lessThan(1e100)) {
    return n.m.toFixed(2) + "e" + findDisplayValue(new Decimal(n.e));
  } else if (n.lessThan(Decimal.fromComponents(1, 10, 1))) {
    return "e" + findDisplayValue(new Decimal(n.e));
  } else {
    return "E" + n.mag.toFixed(2) + "#" + n.layer;
  }
}
