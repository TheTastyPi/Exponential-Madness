var lastFrame = 0;
var lastSave = 0;
window.requestAnimationFrame(nextFrame);

var pastGame;
var game = newGame();
load(true);

function nextFrame(timeStamp) {
	let sinceLastFrame = timeStamp - lastFrame;
	let sinceLastSave = timeStamp - lastSave;
	if (sinceLastFrame >= game.updateSpeed) {
		game.number = game.number.mul(game.mult.generation[1].root(1000/game.updateSpeed/game.gameSpeed));
		for (let i = 1; i < game.mult.maxMult; i++) {
			game.mult.amount[i] = game.mult.amount[i].mul(game.mult.generation[i+1].root(1000/game.updateSpeed/game.gameSpeed));
		};
		game.mult.powerPerBuy = game.mult.powerPerBuy.mul(game.superMult.generation[1].root(1000/game.updateSpeed/game.gameSpeed))
		for (let i = 1; i < game.superMult.maxMult; i++) {
			game.superMult.amount[i] = game.superMult.amount[i].mul(game.superMult.generation[i+1].root(1000/game.updateSpeed/game.gameSpeed));
		};
		updateAll();
		lastFrame = timeStamp;
		game.timePlayed += sinceLastFrame;
	}
	if (sinceLastSave >= game.autoSaveSpeed) {
		if (game.autoSave) {
			save(true);
		}
		lastSave = timeStamp;
	}
	window.requestAnimationFrame(nextFrame);
}

function changeUpdateSpeed() {
	let newSpeed = prompt("Please enter new update speed in milliseconds.\n(Number from 33 to 2000, inclusive)");
	if (newSpeed != null) {
		newSpeed = Number(newSpeed);
		if (!isNaN(newSpeed) && newSpeed >= 33 && newSpeed <= 2000) {
			game.updateSpeed = newSpeed;
			document.getElementById("updateSpeedButton").innerHTML = "Update Speed: " + newSpeed + "ms";
		}
	}
}

function changeAutoSaveSpeed() {
	let newSpeed = prompt("Please enter new auto-save speed in seconds.\n(Number from 0.2 to 300, inclusive)");
	if (newSpeed != null) {
		newSpeed = Number(newSpeed);
		if (!isNaN(newSpeed) && newSpeed >= 0.2 && newSpeed <= 300) {
			let newSpeedMs = newSpeed * 1000
			game.autoSaveSpeed = newSpeedMs;
			document.getElementById("autoSaveSpeedButton").innerHTML = "Auto-Save Speed: " + newSpeed + "s";
		}
	}
}

function save(auto) {
	localStorage.setItem('emsave', JSON.stringify(game));
	if (!auto) {
		document.getElementById("saveButton").innerHTML = "Saved!";
		setTimeout(function(){
			document.getElementById("saveButton").innerHTML = "Save"
		}, 1000);
	}
}

function load(auto) {
	if (localStorage.getItem('emsave')) {
		pastGame = JSON.parse(localStorage.getItem('emsave'));
		objectToDecimal(pastGame);
		mergeToGame(pastGame, false);
		if(!auto) {
			document.getElementById("loadButton").innerHTML = "Loaded!";
			setTimeout(function(){
				document.getElementById("loadButton").innerHTML = "Load"
			}, 1000);
		}
	}
}

function exportSave() {
	document.getElementById("exportArea").classList.remove('hidden');
	document.getElementById("exportArea").innerHTML = btoa(JSON.stringify(game));
	document.getElementById("exportArea").select();
	document.execCommand("copy");
	document.getElementById("exportArea").classList.add('hidden');
	document.getElementById("exportButton").innerHTML = "Exported to Clipboard!";
	setTimeout(function(){
		document.getElementById("exportButton").innerHTML = "Export"
	}, 1000);
}

function importSave() {
	let save = prompt("Please enter export text.\nWarning: Your current save will be over-written.");
	if (save != null) {
		localStorage.setItem('emsave', atob(save));
		load();
		document.getElementById("importButton").innerHTML = "Imported!";
		setTimeout(function(){
			document.getElementById("ImportButton").innerHTML = "Import"
		}, 1000);
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
			amount:[0, new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1)],
			power:[0, new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1)],
			generation:[0, new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1)],
			powerPerBuy:new Decimal(2),
			upgradeAmount:[0, new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0)],
			baseCost:[0, new Decimal(10), new Decimal(1e10), Decimal.fromComponents(1, 2, 2), Decimal.fromComponents(1, 2, 4), Decimal.fromComponents(1, 2, 9), Decimal.fromComponents(1, 2, 15), Decimal.fromComponents(1, 2, 21), Decimal.fromComponents(1, 2, 30), Decimal.fromComponents(1, 2, 41), Decimal.fromComponents(1, 2, 54)],
			cost:[0, new Decimal(10), new Decimal(1e10), Decimal.fromComponents(1, 2, 2), Decimal.fromComponents(1, 2, 4), Decimal.fromComponents(1, 2, 9), Decimal.fromComponents(1, 2, 15), Decimal.fromComponents(1, 2, 21), Decimal.fromComponents(1, 2, 30), Decimal.fromComponents(1, 2, 41), Decimal.fromComponents(1, 2, 54)],
			costIncrease:[0, new Decimal(1e3), new Decimal(1e4), new Decimal(1e5), new Decimal(1e6), new Decimal(1e7), new Decimal(1e9), new Decimal(1e11), new Decimal(1e14), new Decimal(1e17), new Decimal(1e21)],
			unlocked:[0, false, false, false, false, false, false, false, false, false, false],
			maxMult: 4,
			actualMaxMult: 10
		},
		reset: {
			amount: new Decimal(0),
			boost: new Decimal(3),
			totalBoost: new Decimal(1),
			baseCost: Decimal.fromComponents(1, 2, 11),
			cost: Decimal.fromComponents(1, 2, 11),
			baseCostIncrease: new Decimal(1e6),
			costIncrease: new Decimal(1e6),
			costScaling: new Decimal(1e1),
			unlocked: false
		},
		plexal: {
			amount: new Decimal(0),
			gain: new Decimal(0),
			essence: new Decimal(0),
			upgrade: [],
			unlocked: false
		},
		iterator: {
			iteration: new Decimal(0),
			boost: new Decimal(2),
			totalBoost: new Decimal(1),
			baseCost: new Decimal(100),
			cost: new Decimal(100),
			costIncrease: new Decimal(1e5),
			upgrade: {
				amount: new Decimal(0),
				boost: new Decimal(1.5),
				totalBoost: new Decimal(1),
				baseCost: new Decimal(10),
				cost: new Decimal(10),
				costIncrease: new Decimal(10)
			},
			unlocked: false
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
		updateSpeed: 50,
		gameSpeed: 1
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

function toTab(tab) {
	document.getElementById(tab).parentNode.querySelectorAll(":scope > .tab").forEach(function(element) {
		element.classList.add('hidden');
	});
	document.getElementById(tab).classList.remove('hidden');
}

function updateTab() {
	if (game.superMult.unlocked[1]) {
		document.getElementById("normalMultTabButton").classList.remove('hidden');
		document.getElementById("superMultTabButton").classList.remove('hidden');
	} else {
		document.getElementById("normalMultTabButton").classList.add('hidden');
		document.getElementById("superMultTabButton").classList.add('hidden');
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
	for (let i = 1; i <= game.mult.actualMaxMult; i++) {
		game.mult.generation[i] = game.mult.amount[i].pow(game.mult.power[i]); 
		game.mult.cost[i] = game.mult.baseCost[i].pow(game.mult.costIncrease[i].pow(game.mult.upgradeAmount[i]));
		game.mult.power[i] = game.mult.powerPerBuy.pow(game.mult.upgradeAmount[i]).mul(game.reset.totalBoost).mul(game.iterator.totalBoost);
		game.mult.maxMult = (new Decimal(4)).add(game.reset.amount);
		if ((new Decimal(game.mult.maxMult)).greaterThan(game.mult.actualMaxMult)) {
			game.mult.maxMult = game.mult.actualMaxMult;
		}
		document.getElementById("multAmount" + i).innerHTML = findDisplay(game.mult.amount[i]);
		document.getElementById("multPower" + i).innerHTML = "^" + findDisplay(game.mult.power[i]);
		if (game.mult.unlocked[i] == false) {
			document.getElementById("multButton" + i).innerHTML = "Unlock Multiplier " + i + " Cost: " + findDisplay(game.mult.cost[i]);
			if (i != game.mult.actualMaxMult) {
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
	r.costIncrease = r.baseCostIncrease.mul(r.costScaling.pow(r.amount.div(2).floor()));
	r.cost = r.baseCost.pow(r.costIncrease.pow(r.amount))
	if (game.reset.amount.greaterThan(new Decimal(0))
	   || game.number.greaterThan(Decimal.fromComponents(1, 2, 8))) {
		game.reset.unlocked = true;
	}
	if (game.reset.unlocked == true) {
		document.getElementById("reset").classList.remove('hidden');
	}
	document.getElementById("resetPower").innerHTML = "^" + findDisplay(r.totalBoost);
	document.getElementById("resetAmount").innerHTML = findDisplay(new Decimal(r.amount));
	if (game.mult.maxMult < game.mult.actualMaxMult) {
		document.getElementById("resetButton").innerHTML = "Reset the game for a new multiplier and a boost to all multipliers Requires: " + findDisplay(game.reset.cost);
	} else {
		document.getElementById("resetButton").innerHTML = "Reset the game for a boost to all multipliers Requires: " + findDisplay(game.reset.cost);
	}
	if (game.number.greaterThanOrEqualTo(r.cost)) {
		document.getElementById("resetButton").classList.remove('disabled');
		document.getElementById("resetButton").classList.add('enabled');
	} else {
		document.getElementById("resetButton").classList.remove('enabled');
		document.getElementById("resetButton").classList.add('disabled');  
	}
}

function updatePlexal() {
	game.plexal.gain = game.number.log(Decimal.fromComponents(1, 2, 100)).log10().add(1).root(6.66).floor();
	if (game.plexal.amount.greaterThan(new Decimal(0))
	   || game.number.greaterThan(Decimal.fromComponents(1, 2, 80))) {
		game.plexal.unlocked = true;
	}
	if (game.plexal.amount.greaterThan(new Decimal(0))) {
		document.getElementById("plexalTabButton").classList.remove('hidden');
	}
	if (game.plexal.unlocked == true) {
		document.getElementById("plexButton").classList.remove('hidden');
	}
	if (game.number.greaterThanOrEqualTo(Decimal.fromComponents(1, 2, 100))) {
		document.getElementById("plexButton").innerHTML = "Reset all of your progress so far to gain " + findDisplay(game.plexal.gain) + " Plexal Essence";
		document.getElementById("plexButton").classList.remove('disabled');
		document.getElementById("plexButton").classList.add('plexal');
	} else {
		document.getElementById("plexButton").innerHTML = "Requires: ee100";
		document.getElementById("plexButton").classList.remove('plexal');
		document.getElementById("plexButton").classList.add('disabled');  
	}
	document.getElementById("plexalEssenceAmount").innerHTML = findDisplay(game.plexal.essence);
}

function updateIterator() {
	let it = game.iterator;
	let upg = it.upgrade;
	it.totalBoost = it.boost.pow(it.iteration);
	it.cost = it.baseCost.pow(it.costIncrease.pow(it.iteration));
	upg.totalBoost = upg.boost.pow(upg.amount);
	upg.cost = upg.baseCost.mul(upg.costIncrease.pow(upg.amount))
	document.getElementById("iteratorTotalBoost").innerHTML = "^" + findDisplay(it.totalBoost);
	document.getElementById("iteration").innerHTML = findDisplay(it.iteration);
	document.getElementById("iterationCost").innerHTML = findDisplay(it.cost);
	document.getElementById("iteratorBoost").innerHTML = "^" + findDisplay(it.boost);
	document.getElementById("iteratorUpgradeBoost").innerHTML = findDisplay(upg.boost);
	document.getElementById("iteratorUpgradeCost").innerHTML = findDisplay(upg.cost);
	if (it.unlocked = true) {
		document.getElementById("iteratorUnlock").classList.add('hidden');
		document.getElementById("iteratorUpgrade").classList.remove('hidden');
		document.getElementById("iterate").classList.remove('hidden');
	} else {
		document.getElementById("iteratorUnlock").classList.remove('hidden');
		document.getElementById("iteratorUpgrade").classList.add('hidden');
		document.getElementById("iterate").classList.add('hidden');
	}
	if (game.number.greaterThanOrEqualTo(it.cost)) {
		document.getElementById("iterateButton").classList.remove('disabled');
		document.getElementById("iterateButton").classList.add('enabled');
	} else {
		document.getElementById("iterateButton").classList.remove('enabled');
		document.getElementById("iterateButton").classList.add('disabled');  
	}
	if (game.plexal.essence.greaterThanOrEqualTo(1)) {
		document.getElementById("iteratorUnlock").classList.remove('disabled');
		document.getElementById("iteratorUnlock").classList.add('enabled');
	} else {
		document.getElementById("iteratorUnlock").classList.remove('enabled');
		document.getElementById("iteratorUnlock").classList.add('disabled');  
	}
	if (game.plexal.essence.greaterThanOrEqualTo(upg.cost)) {
		document.getElementById("iteratorUpgradeButton").classList.remove('disabled');
		document.getElementById("iteratorUpgradeButton").classList.add('enabled');
	} else {
		document.getElementById("iteratorUpgradeButton").classList.remove('enabled');
		document.getElementById("iteratorUpgradeButton").classList.add('disabled');  
	}
}

function updateAll() {
	document.getElementById("multPerSecond").innerHTML = findDisplay(game.mult.generation[1]);
	document.getElementById("number").innerHTML = findDisplay(game.number);
	updateTab();
	updateMult();
	updateSuperMult();
	updateReset();
	updatePlexal();
	updateIterator();
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
			}
		break;
	}
}

function maxMult(n, type) {
	switch (type) {
		case "normal":
			let num = game.number.log10().log10().mul(0.99999);
			let startCost = game.mult.cost[n].log10().log10();
			if (num.greaterThanOrEqualTo(startCost)) {
				let increase = game.mult.costIncrease[n].log10();
				let buyAmount = num.sub(startCost).div(increase).ceil();
				let endCost = startCost.add(increase.mul(buyAmount));
				let totalCost = endCost.sub(increase);
				if (game.mult.unlocked[n] == false) {
					game.mult.amount[n] = new Decimal(1.25);
					game.mult.unlocked[n] = true;
					game.number = game.number.div(game.mult.cost[n]);
					maxAll("normal");
				} else {
					game.number = game.number.div((new Decimal(10)).pow((new Decimal(10)).pow(totalCost)));
					game.mult.upgradeAmount[n] = game.mult.upgradeAmount[n].add(buyAmount);
				}
			}
		break;
		case "super":
			while (game.superMult.cost[n].lessThan(game.number) 
			       && !(document.getElementById("superMult" + n).classList.contains('hidden'))) {
				buyMult(n, "super");
			}
		break;
	}
}

function maxAll(type) {
	switch (type) {
		case "normal":
			for(let i = 1; i <= game.mult.maxMult; i++) {
				maxMult(i, "normal");
			}
			maxIterate();
		break;
		case "super":
			for(let i = 1; i < game.superMult.amount.length; i++) {
				maxMult(i, "super");
			}
		break;
	}
}

function reset(level) {
	switch (level) {
		case 0:
			if (game.number.greaterThanOrEqualTo(game.reset.cost)) {
				game.number = newGame().number;
				game.mult = newGame().mult;
				game.reset.amount = game.reset.amount.add(1);
			}
		break;
		case 1:
			if (game.number.greaterThanOrEqualTo(Decimal.fromComponents(1, 2, 100))) {
				game.number = newGame().number;
				game.mult = newGame().mult;
				game.reset = newGame().reset;
				game.iterator.iteration = newGame().iterator.iteration;
				game.plexal.amount = game.plexal.amount.add(1);
				game.plexal.essence = game.plexal.essence.add(game.plexal.gain);
			}
		break;
	}
}

function maxReset() {
	if (game.reset.unlocked == true) {
		let startCost = game.reset.cost.log10().log10();
		if (num.greaterThanOrEqualTo(startCost)) {
			let costChange = num.sub(startCost);
			let scaling = game.reset.costScaling.log10().div(2);
			let startIncrease = game.reset.costIncrease.log10();
			let endIncrease = startIncrease.pow(2).add(scaling.mul(costChange).mul(2)).sqrt();
			let increaseChange = endIncrease.sub(startIncrease);
			let buyAmount = increaseChange.div(scaling);
			let avgIncrease = startIncrease.add(endIncrease).div(2);
			let endCost = startCost.add(avgIncrease.mul(buyAmount.sub(1)));
			game.number = game.number.div((new Decimal(10)).pow((new Decimal(10)).pow(endCost)));
			game.reset.amount = game.reset.amount.add(buyAmount);
	}
}

function unlockIterator() {
	if (game.plexal.essence.greaterThanOrEqualTo(1)) {
		game.plexal.essence = game.plexal.essence.sub(1);
		game.iterator.unlocked = true;
	}
}

function iterate() {
	if (game.number.greaterThanOrEqualTo(game.iterator.cost)) {
		game.number = game.number.div(game.iterator.cost);
		game.iterator.iteration = game.iterator.iteration.add(1);
	}
}

function maxIterate() {
	if (game.iterator.unlocked == true) {
		let num = game.number.log10().log10().mul(0.99999);
		let startCost = game.iterator.cost.log10().log10();
		if (num.greaterThanOrEqualTo(startCost)) {
			let increase = game.iterator.costIncrease.log10();
			let buyAmount = num.sub(startCost).div(increase).ceil();
			let endCost = startCost.add(increase.mul(buyAmount));
			let totalCost = endCost.sub(increase);
			game.number = game.number.div((new Decimal(10)).pow((new Decimal(10)).pow(totalCost)));
			game.iterator.iteration = game.iterator.iteration.add(buyAmount);
		}
	}
}

function upgradeIteratior() {
	if (game.plexal.essence.greaterThanOrEqualTo(game.iterator.upgrade.cost)) {
		game.plexal.essence = game.plexal.essence.sub(game.iterator.upgrade.cost)
		game.iterator.upgrade.amount = game.iterator.upgrade.amount.add(1);
	}
}

