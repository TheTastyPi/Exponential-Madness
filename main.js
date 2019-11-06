function save() {
	localStorage.setItem('emsave', JSON.stringify(game));
}

function load() {
	if (localStorage.getItem('emsave')) {
		let dat = JSON.parse(localStorage.getItem('emsave'));
		let g = {};
		g.number = new Decimal(dat.number);
		g.mult = {
			amount:[0, new Decimal(dat.mult.amount[1]), new Decimal(dat.mult.amount[2]), new Decimal(dat.mult.amount[3]), new Decimal(dat.mult.amount[4])],
			power:[0, new Decimal(dat.mult.power[1]), new Decimal(dat.mult.power[2]), new Decimal(dat.mult.power[3]), new Decimal(dat.mult.power[4])],
			generation:[0, new Decimal(dat.mult.generation[1]), new Decimal(dat.mult.generation[2]), new Decimal(dat.mult.generation[3]), new Decimal(dat.mult.generation[4])],
			powerPerBuy:new Decimal(dat.mult.powerPerBuy),
			upgradeAmount:[0, new Decimal(dat.mult.upgradeAmount[1]), new Decimal(dat.mult.upgradeAmount[2]), new Decimal(dat.mult.upgradeAmount[3]), new Decimal(dat.mult.upgradeAmount[4])],
			baseCost:[0, new Decimal(dat.mult.baseCost[1]), new Decimal(dat.mult.baseCost[2]), new Decimal(dat.mult.baseCost[3]), new Decimal(dat.mult.baseCost[4])],
			cost:[0, new Decimal(dat.mult.cost[1]), new Decimal(dat.mult.cost[2]), new Decimal(dat.mult.cost[3]), new Decimal(dat.mult.cost[4])],
			costIncrease:[0, new Decimal(dat.mult.costIncrease[1]), new Decimal(dat.mult.costIncrease[2]), new Decimal(dat.mult.costIncrease[3]), new Decimal(dat.mult.costIncrease[4])],
			unlocked:[0, dat.mult.unlocked[1], dat.mult.unlocked[2], dat.mult.unlocked[3], dat.mult.unlocked[4]]
		}
		g.superMult = {
			amount:[0, new Decimal(dat.superMult.amount[1]), new Decimal(dat.superMult.amount[2]), new Decimal(dat.superMult.amount[3]), new Decimal(dat.superMult.amount[4])],
			power:[0, new Decimal(dat.superMult.power[1]), new Decimal(dat.superMult.power[2]), new Decimal(dat.superMult.power[3]), new Decimal(dat.superMult.power[4])],
			generation:[0, new Decimal(dat.superMult.generation[1]), new Decimal(dat.superMult.generation[2]), new Decimal(dat.superMult.generation[3]), new Decimal(dat.superMult.generation[4])],
			powerPerBuy:new Decimal(dat.superMult.powerPerBuy),
			upgradeAmount:[0, new Decimal(dat.superMult.upgradeAmount[1]), new Decimal(dat.superMult.upgradeAmount[2]), new Decimal(dat.superMult.upgradeAmount[3]), new Decimal(dat.superMult.upgradeAmount[4])],
			baseCost:[0, new Decimal(dat.superMult.baseCost[1]), new Decimal(dat.superMult.baseCost[2]), new Decimal(dat.superMult.baseCost[3]), new Decimal(dat.superMult.baseCost[4])],
			cost:[0, new Decimal(dat.superMult.cost[1]), new Decimal(dat.superMult.cost[2]), new Decimal(dat.superMult.cost[3]), new Decimal(dat.superMult.cost[4])],
			costIncrease:[0, dat.superMult.costIncrease[1], dat.superMult.costIncrease[2], dat.superMult.costIncrease[3], dat.superMult.costIncrease[4]],
			unlocked:[0, dat.superMult.unlocked[1], dat.superMult.unlocked[2], dat.superMult.unlocked[3], dat.superMult.unlocked[4]]
		}
		g.autoSave = dat.autoSave;
		return g;
	} else {
		return false;
	}
}

function wipe() {
	game = {
		number: new Decimal(10),
		mult: {
			amount:[0, new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1)],
			power:[0, new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1)],
			generation:[0, new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1)],
			powerPerBuy:new Decimal(2),
			upgradeAmount:[0, new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0)],
			baseCost:[0, new Decimal(10), new Decimal(1e10), Decimal.fromComponents(1, 2, 2), Decimal.fromComponents(1, 2, 4)],
			cost:[0, new Decimal(10), new Decimal(1e10), Decimal.fromComponents(1, 2, 2), Decimal.fromComponents(1, 2, 4)],
			costIncrease:[0, new Decimal(1e3), new Decimal(1e4), new Decimal(1e5), new Decimal(1e6)],
			unlocked:[0, false, false, false, false]
		},
		superMult: {
			amount:[0, new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1)],
			power:[0, new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1)],
			generation:[0, new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1)],
			powerPerBuy:new Decimal(2),
			upgradeAmount:[0, new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0)],
			baseCost:[0, Decimal.fromComponents(1, 2, 9), Decimal.fromComponents(1, 2, 15), Decimal.fromComponents(1, 2, 25), Decimal.fromComponents(1, 2, 69)],
			cost:[0, Decimal.fromComponents(1, 2, 9), Decimal.fromComponents(1, 2, 15), Decimal.fromComponents(1, 2, 25), Decimal.fromComponents(1, 2, 69)],
			costIncrease:[0, new Decimal(2), new Decimal(3), new Decimal(4), new Decimal(5)],
			unlocked:[0, false, false, false, false]
		},
		autoSave: true
	}
	save();
}

function wipeConfirm() {
	if (confirm("Are you sure you want to wipe your save?")) {
		wipe();
	}
}

function toggleAutoSave() {
	game.autoSave = !game.autoSave;
}

function maxAllMult() {
	for(let i = 1; i < game.mult.amount.length; i++) {
		let buyAmount = game.number.div(100).log10.log10.mul(2).div(game.mult.costIncrease[i].log10).root(2).floor();
		game.number = game.number.mul(0.99);
		game.mult.upgradeAmount[i] = game.mult.upgradeAmount[i].add(buyAmount);
		updateStuff();
	}
}

function maxAllSuperMult() {
	for(let i = 1; i < game.superMult.amount.length; i++) {
		while (game.superMult.cost[i].lessThan(game.number) 
		       && !(document.getElementById("superMult" + i).classList.contains('hidden'))) {
			buySuperMult(i);
		}
	}
}

var game;
if (load()) {
	game = load();
} else {
	wipe();
}
setInterval(function() {
  game.number = game.number.mul(game.mult.generation[1].root(20));
  for (let i = 2; i < game.mult.amount.length; i++) {
    game.mult.amount[i-1] = game.mult.amount[i-1].mul(game.mult.generation[i].root(20));
  };
  game.mult.powerPerBuy = game.mult.powerPerBuy.mul(game.superMult.generation[1].root(20))
  for (let i = 2; i < game.superMult.amount.length; i++) {
    game.superMult.amount[i-1] = game.superMult.amount[i-1].mul(game.superMult.generation[i].root(20));
  };
  updateStuff();
}, 50);
setInterval(function() {
	if (game.autoSave) {
  		save();
	}
}, 1000);
function updateStuff() {
  for (let i = 1; i < game.mult.amount.length; i++) {
	game.mult.generation[i] = game.mult.amount[i].pow(game.mult.power[i]); 
	game.mult.cost[i] = game.mult.baseCost[i].pow(game.mult.costIncrease[i].pow(game.mult.upgradeAmount[i]));
	document.getElementById("multAmount" + i).innerHTML = findDisplayValue(game.mult.amount[i]);
  };
  document.getElementById("multPerSecond").innerHTML = findDisplayValue(game.mult.generation[1]);
  document.getElementById("number").innerHTML = findDisplayValue(game.number);
  for (let i = 1; i < game.mult.cost.length; i++) {
    if (game.mult.unlocked[i] == false) {
	document.getElementById("multButton" + i).innerHTML = "Unlock Multiplier " + i + " Cost: " + findDisplayValue(game.mult.cost[i]);
	if (i != 4) {
		document.getElementById("mult"+(i+1)).classList.add('hidden');
	} else {
		document.getElementById("superMult1").classList.add('hidden');
	}
    } else {
	document.getElementById("multButton" + i).innerHTML = "Square Multiplier " + i + " Cost: " + findDisplayValue(game.mult.cost[i]);
	if (i != 4) {
		document.getElementById("mult"+(i+1)).classList.remove('hidden');
	} else {
		document.getElementById("superMult1").classList.remove('hidden');
	}
    }
    if (game.number.greaterThanOrEqualTo(game.mult.cost[i])) {
	document.getElementById("multButton" + i).classList.remove('disabled');
	document.getElementById("multButton" + i).classList.add('enabled');
    } else {
	document.getElementById("multButton" + i).classList.remove('enabled');
	document.getElementById("multButton" + i).classList.add('disabled');  
    }
  };
  for (let i = 1; i < game.mult.power.length; i++) {
    document.getElementById("multPower" + i).innerHTML = "^" + findDisplayValue(game.mult.power[i]);
    game.mult.power[i] = game.mult.powerPerBuy.pow(game.mult.upgradeAmount[i]);
  };
  for (let i = 1; i < game.superMult.amount.length; i++) {
    game.superMult.generation[i] = game.superMult.amount[i].pow(game.superMult.power[i]); 
    document.getElementById("superMultAmount" + i).innerHTML = findDisplayValue(game.superMult.amount[i]);
  };
  for (let i = 1; i < game.superMult.cost.length; i++) {
    if (game.superMult.unlocked[i] == false) {
	document.getElementById("superMultButton" + i).innerHTML = "Unlock Super Multiplier " + i + " Cost: " + findDisplayValue(game.superMult.cost[i]);
	if (i != 4) {
		document.getElementById("superMult"+(i+1)).classList.add('hidden');
	}
    } else {
	document.getElementById("superMultButton" + i).innerHTML = "Square Multiplier " + i + " Cost: " + findDisplayValue(game.superMult.cost[i]);
	if (i != 4) {
		document.getElementById("superMult"+(i+1)).classList.remove('hidden');
	}
    }
    if (game.number.greaterThanOrEqualTo(game.superMult.cost[i])) {
	document.getElementById("superMultButton" + i).classList.remove('disabled');
	document.getElementById("superMultButton" + i).classList.add('enabled');
    } else {
	document.getElementById("superMultButton" + i).classList.remove('enabled');
	document.getElementById("superMultButton" + i).classList.add('disabled');  
    }
  };
  for (let i = 1; i < game.superMult.power.length; i++) {
    document.getElementById("superMultPower" + i).innerHTML = "^" + findDisplayValue(game.superMult.power[i]);
    game.superMult.power[i] = game.superMult.powerPerBuy.pow(game.superMult.upgradeAmount[i]);
  };
  if (game.autoSave) {
	  document.getElementById("autoSaveButton").innerHTML = "Auto Save: ON";
  } else {
	  document.getElementById("autoSaveButton").innerHTML = "Auto Save: OFF";
  }
}
function buyMult(n) {
  if (game.number.greaterThanOrEqualTo(game.mult.cost[n])) {
    game.number = game.number.div(game.mult.cost[n]);
    if (game.mult.unlocked[n] == false) {
      game.mult.amount[n] = new Decimal(1.25);
      game.mult.unlocked[n] = true;
    } else {
      game.mult.upgradeAmount[n] = game.mult.upgradeAmount[n].add(1);
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
      game.superMult.cost[n] = game.superMult.cost[n].tetrate(game.superMult.costIncrease[n]);
    }
    updateStuff();
  }
}
function findDisplayValue(n) {
  if (n.lessThan(1000)) {
	return n.toFixed(2);
  } else if (n.lessThan(1e100)) {
	return n.m.toFixed(2) + "e" + findDisplayValue(new Decimal(n.e));
  } else if (n.lessThan(Decimal.fromComponents(1, 5, 1))) {
	return "e" + findDisplayValue(n.log10());
  } else {
	let x = new Decimal(n.mag).slog(10);
	return "E" + (new Decimal(n.mag)).iteratedlog(10,x.floor()).toFixed(2) + "#" + (new Decimal(n.layer)).add(x.floor());
  }
}
