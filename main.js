var lastFrame = 0;
var lastSave = 0;
window.requestAnimationFrame(nextFrame);

var pastGame;
var game = newGame();
load();

function nextFrame(timeStamp) {
	let sinceLastFrame = timeStamp - lastFrame;
	let sinceLastSave = timeStamp - lastSave;
	if (sinceLastFrame >= game.updateSpeed) {
		game.number = game.number.mul(game.mult.generation[1].root(1000/game.updateSpeed));
		for (let i = 1; i < game.mult.maxMult; i++) {
			game.mult.amount[i] = game.mult.amount[i].mul(game.mult.generation[i+1].root(1000/game.updateSpeed));
		};
		game.mult.powerPerBuy = game.mult.powerPerBuy.mul(game.superMult.generation[1].root(1000/game.updateSpeed))
		for (let i = 1; i < game.superMult.maxMult; i++) {
			game.superMult.amount[i] = game.superMult.amount[i].mul(game.superMult.generation[i+1].root(1000/game.updateSpeed));
		};
		updateAll();
		lastFrame = timeStamp;
		game.timePlayed += sinceLastFrame;
	}
	if (sinceLastSave >= game.autoSaveSpeed) {
		if (game.autoSave) {
			save();
		}
		lastSave = timeStamp;
	}
	window.requestAnimationFrame(nextFrame);
}

function changeUpdateSpeed() {
	let newSpeed = prompt("Please enter new update speed in milliseconds.\n(integer from 33 to 1000)");
	if (newSpeed != null) {
		newSpeed = Number(newSpeed);
		if (!isNaN(newSpeed) && newSpeed >= 33 && newSpeed <= 1000) {
			game.updateSpeed = newSpeed;
		}
	}
}

function changeAutoSaveSpeed() {
	let newSpeed = prompt("Please enter new auto-save speed in milliseconds.\n(integer from 200 to 60000)");
	if (newSpeed != null) {
		newSpeed = Number(newSpeed);
		if (!isNaN(newSpeed) && newSpeed >= 200 && newSpeed <= 60000) {
			game.autoSaveSpeed = newSpeed;
		}
	}
}

function save() {
	localStorage.setItem('emsave', JSON.stringify(game));
}

function load() {
	if (localStorage.getItem('emsave')) {
		pastGame = JSON.parse(localStorage.getItem('emsave'));
		objectToDecimal(pastGame);
		mergeToGame(pastGame, false);
	}
}

function exportSave() {
	document.getElementById("exportArea").classList.remove('hidden');
	document.getElementById("exportArea").innerHTML = btoa(JSON.stringify(game));
	document.getElementById("exportArea").select();
	document.execCommand("copy");
	document.getElementById("exportArea").classList.add('hidden');
	document.getElementById("exportButton").innerHTML = "Copied to Clipboard!";
	setTimeout(function(){
		document.getElementById("exportButton").innerHTML = "Export"
	}, 1000);
}

function importSave() {
	let save = prompt("Please enter export text.\nWarning: Your current save will be over-written.");
	if (save != null) {
		localStorage.setItem('emsave', atob(save));
		load();
	}
}

// totally didn't copy this from somewhere else
function objectToDecimal(object) { 
	for (i in object) {
		if (typeof(object[i]) == "string" && !isNaN(new Decimal(object[i]).mag)) {
			object[i] = new Decimal(object[i]);
		}
		if (typeof(object[i]) == "object") {
			objectToDecimal(object[i]);
		}
	}
}

function mergeToGame(object, parent) {
	if (parent) {
		for (i in game[parent]) {
			if (object[i] != undefined) {
				if (typeof(game[i]) == "object") {
					mergeToGame(object[i], parent[i]);
				} else {
					game[parent][i] = object[i];
				}
			}
		}
	} else {
		for (i in game) {
			if (object[i] != undefined) {
				if (typeof(game[i]) == "object") {
					mergeToGame(object[i], i);
				} else {
					game[i] = object[i];
				}
			}
		}
	}
}

function newGame() {
	let save = {
		timePlayed: 0,
		number: new Decimal(10),
		mult: {
			amount:[0, new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1)],
			power:[0, new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1)],
			generation:[0, new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1)],
			powerPerBuy:new Decimal(2),
			upgradeAmount:[0, new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0)],
			baseCost:[0, new Decimal(10), new Decimal(1e10), Decimal.fromComponents(1, 2, 2), Decimal.fromComponents(1, 2, 4), Decimal.fromComponents(1, 2, 9), Decimal.fromComponents(1, 2, 15)],
			cost:[0, new Decimal(10), new Decimal(1e10), Decimal.fromComponents(1, 2, 2), Decimal.fromComponents(1, 2, 4), Decimal.fromComponents(1, 2, 9), Decimal.fromComponents(1, 2, 15)],
			costIncrease:[0, new Decimal(1e3), new Decimal(1e4), new Decimal(1e5), new Decimal(1e6), new Decimal(1e8), new Decimal(1e11)],
			unlocked:[0, false, false, false, false, false],
			maxMult: 4
		},
		reset: {
			amount: new Decimal(0),
			boost: new Decimal(2),
			totalBoost: new Decimal(1),
			baseCost: Decimal.fromComponents(1, 2, 11),
			cost: Decimal.fromComponents(1, 2, 11),
			costIncrease: new Decimal(1e14)
		},
		superMult: {
			amount:[0, new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1)],
			power:[0, new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1)],
			generation:[0, new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1)],
			powerPerBuy:new Decimal(2),
			upgradeAmount:[0, new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0)],
			baseCost:[0, Decimal.fromComponents(1, 2, 9), Decimal.fromComponents(1, 2, 15), Decimal.fromComponents(1, 2, 25), Decimal.fromComponents(1, 2, 69)],
			cost:[0, Decimal.fromComponents(1, 2, 9), Decimal.fromComponents(1, 2, 15), Decimal.fromComponents(1, 2, 25), Decimal.fromComponents(1, 2, 69)],
			costIncrease:[0, new Decimal(1e2), new Decimal(1e3), new Decimal(1e4), new Decimal(1e5)],
			unlocked:[0, false, false, false, false],
			maxMult: 4
		},
		autoSave: true,
		autoSaveSpeed: 1000,
		updateSpeed: 50
	}
	return save;
}

function wipe() {
	game = newGame();
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

function maxAll(type) {
	switch (type) {
		case "normal":
			for(let i = 1; i <= game.mult.maxMult; i++) {
				let num = game.number.log10().log10().mul(0.99999);
				let increase = game.mult.costIncrease[i].log10();
				let startCost = game.mult.cost[i].log10().log10();
				let buyAmount = num.sub(startCost).div(increase).ceil();
				let endCost = startCost.add(increase.mul(buyAmount));
				let totalCost = endCost.sub(increase);
				if (num.greaterThanOrEqualTo(game.mult.cost[i])) {
					if (game.mult.unlocked[i] == false) {
						game.mult.amount[i] = new Decimal(1.25);
						game.mult.unlocked[i] = true;
						game.number = game.number.div(game.mult.cost[i]);
					} else {
						game.number = game.number.div((new Decimal(10)).pow((new Decimal(10)).pow(totalCost)));
						game.mult.upgradeAmount[i] = game.mult.upgradeAmount[i].add(buyAmount);
					}
					updateAll();
				}
			}
		break;
		case "super":
			for(let i = 1; i < game.superMult.amount.length; i++) {
				while (game.superMult.cost[i].lessThan(game.number) 
				       && !(document.getElementById("superMult" + i).classList.contains('hidden'))) {
					buyMult(i, "super");
				}
			}
		break;
	}
}

function findDisplay(n) {
	if (n.lessThan(1000)) {
		return n.toFixed(2);
	} else if (n.lessThan(1e100)) {
		return n.m.toFixed(2) + "e" + findDisplay(new Decimal(n.e));
	} else if (n.lessThan(Decimal.fromComponents(1, 5, 1))) {
		return "e" + findDisplay(n.log10());
	} else {
		let x = new Decimal(n.mag).slog(10);
		return "E" + (new Decimal(n.mag)).iteratedlog(10,x.floor()).toFixed(2) + "#" + (new Decimal(n.layer)).add(x.floor());
	}
}

function updateMult() {
	for (let i = 1; i <= game.mult.maxMult; i++) {
		game.mult.generation[i] = game.mult.amount[i].pow(game.mult.power[i].mul(game.reset.totalBoost)); 
		game.mult.cost[i] = game.mult.baseCost[i].pow(game.mult.costIncrease[i].pow(game.mult.upgradeAmount[i]));
		game.mult.power[i] = game.mult.powerPerBuy.pow(game.mult.upgradeAmount[i]);
		document.getElementById("multAmount" + i).innerHTML = findDisplay(game.mult.amount[i]);
		document.getElementById("multPower" + i).innerHTML = "^" + findDisplay(game.mult.power[i]);
		if (game.mult.unlocked[i] == false) {
			document.getElementById("multButton" + i).innerHTML = "Unlock Multiplier " + i + " Cost: " + findDisplay(game.mult.cost[i]);
			if (i != game.mult.maxMult) {
				document.getElementById("mult"+(i+1)).classList.add('hidden');
			}
		} else {
			document.getElementById("multButton" + i).innerHTML = "Square Multiplier " + i + " Cost: " + findDisplay(game.mult.cost[i]);
			if (i != game.mult.maxMult) {
				document.getElementById("mult"+(i+1)).classList.remove('hidden');
			}
		}
		if (game.number.greaterThanOrEqualTo(game.mult.cost[i])) {
			document.getElementById("multButton" + i).classList.remove('disabled');
			document.getElementById("multButton" + i).classList.add('enabled');
		} else {
			document.getElementById("multButton" + i).classList.remove('enabled');
			document.getElementById("multButton" + i).classList.add('disabled');  
		}
	}
}

function updateSuperMult() {
	for (let i = 1; i <= game.superMult.maxMult; i++) {
		game.superMult.generation[i] = game.superMult.amount[i].pow(game.superMult.power[i]);
		game.superMult.power[i] = game.superMult.powerPerBuy.pow(game.superMult.upgradeAmount[i]);
		document.getElementById("superMultAmount" + i).innerHTML = findDisplay(game.superMult.amount[i]);
		document.getElementById("superMultPower" + i).innerHTML = "^" + findDisplay(game.superMult.power[i]);
		if (game.superMult.unlocked[i] == false) {
			document.getElementById("superMultButton" + i).innerHTML = "Unlock Super Multiplier " + i + " Cost: " + findDisplay(game.superMult.cost[i]);
			if (i != 4) {
				document.getElementById("superMult"+(i+1)).classList.add('hidden');
			}
		} else {
			document.getElementById("superMultButton" + i).innerHTML = "Square Multiplier " + i + " Cost: " + findDisplay(game.superMult.cost[i]);
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
	}
}

function updateReset() {
	let r = game.reset;
	r.totalBoost = r.boost.pow(r.amount);
	r.cost = r.baseCost.pow(r.costIncrease.pow(r.amount))
	if (game.number.greaterThan(Decimal.fromComponents(1, 2, 8))) {
		document.getElementById("reset").classList.remove('hidden');
	}
	document.getElementById("resetButton").innerHTML = "Reset the game for a new multiplier and a boost to all multipliers Requires: " + findDisplay(game.reset.cost);
	if (game.number.greaterThanOrEqualTo(r.cost)) {
		document.getElementById("resetButton").classList.remove('disabled');
		document.getElementById("resetButton").classList.add('enabled');
	} else {
		document.getElementById("resetButton").classList.remove('enabled');
		document.getElementById("resetButton").classList.add('disabled');  
	}
}

function updateAll() {
	document.getElementById("multPerSecond").innerHTML = findDisplay(game.mult.generation[1]);
	document.getElementById("number").innerHTML = findDisplay(game.number);
	updateMult();
	updateSuperMult();
	updateReset();
	if (game.autoSave) {
		document.getElementById("autoSaveButton").innerHTML = "Auto Save: ON";
	} else {
		document.getElementById("autoSaveButton").innerHTML = "Auto Save: OFF";
	}
}

function buyMult(n, type) {
	switch (type) {
		case "normal":
			if (game.number.greaterThanOrEqualTo(game.mult.cost[n])) {
				game.number = game.number.div(game.mult.cost[n]);
				if (game.mult.unlocked[n] == false) {
					game.mult.amount[n] = new Decimal(1.25);
					game.mult.unlocked[n] = true;
				} else {
					game.mult.upgradeAmount[n] = game.mult.upgradeAmount[n].add(1);
				}
				updateAll();
			}
		break;
		case "super":
			if (game.number.greaterThanOrEqualTo(game.superMult.cost[n])) {
				game.number = game.number.div(game.superMult.cost[n]);
				if (game.superMult.unlocked[n] == false) {
					game.superMult.amount[n] = new Decimal(1.25);
					game.superMult.unlocked[n] = true;
				} else {
					game.superMult.upgradeAmount[n] = game.superMult.upgradeAmount[n].add(1);
					game.superMult.cost[n] = game.superMult.cost[n].pow(game.superMult.costIncrease[n].tetrate(game.superMult.costIncrease[n].log10()));
				}
				updateAll();
			}
		break;
	}
}

//:O New mechanic
function reset(level) {
	switch (level) {
		case 0:
			if (game.number.greaterThanOrEqualTo(game.reset.cost)
			   && game.mult.maxMult.lessThan(new Decimal(6))) {
				game.mult.amount = newGame().mult.amount;
				game.mult.upgradeAmount = newGame().mult.upgradeAmount;
				game.mult.unlocked = newGame().mult.unlocked;
				game.mult.maxMult++;
				game.reset.amount++;
				updateAll();
			}
		break;
		case 1:
			//nothin'
		break;
	}
}
