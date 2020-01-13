/********* 
 * SETUP *
 *********/

var doUpdate = true;
var lastFrame = 0;
var lastSave = 0;

var pastGame;
var game = newGame();

/************* 
 * GAME LOOP *
 *************/

function nextFrame(timeStamp) {
	let sinceLastFrame = timeStamp - lastFrame;
	let sinceLastSave = timeStamp - lastSave;
	if (sinceLastFrame >= game.updateSpeed) {
		game.number = game.number.mul(game.mult.generation[1].root(1000/game.updateSpeed/game.speed));
		for (let i = 1; i < game.mult.maxMult; i++) {
			game.mult.amount[i] = game.mult.amount[i].mul(game.mult.generation[i+1].root(1000/game.updateSpeed/game.speed));
		}
		if (game.auto.on[0]) {
			maxAllMult();
		}
		if (game.auto.on[1]) {
			maxIterate();
		}
		if (doUpdate) {
			updateAll();
		}
		calcAll();
		lastFrame = timeStamp;
		game.permaStat.timePlayed += sinceLastFrame;
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

/**********
 * SAVING *
 **********/

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
		if (pastGame.permaStat != undefined) {
			if (pastGame.permaStat.version == undefined || pastGame.permaStat.version < newGame().permaStat.version) {
				setTimeout(function() {
					notify('Welcome to version ' + newGame().permaStat.version + '!');
				}, 1000)
			}
			if (pastGame.permaStat.endgame.notEquals(newGame().permaStat.endgame) && pastGame.achievement.normalCompleted.includes("endgame")) {
				pastGame.achievement.normalCompleted.splice(pastGame.achievement.normalCompleted.indexOf("endgame"), 1);
			}
		} else {
			setTimeout(function() {
				notify('Welcome to version ' + newGame().permaStat.version + '!');
			}, 1000)
		}
		merge(game, pastGame);
		game.permaStat.version = newGame().permaStat.version;
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
		let err = false;
		let secret = true;
		try {
			switch (save) {
				case "export text":
					setTimeout(function() {
						achievement.secret.followInstruction.complete();
					}, 500)
				break;
				case "Thank you!":
					if (game.achievement.normalCompleted.includes("startAuto")) {
						setTimeout(function() {
							achievement.secret.thanks.complete();
						}, 500)
					} else {
						secret = false;
					}
				break;
				default:
					localStorage.setItem('emsave', atob(save));
					load(true);
					secret = false;
				break;
			}
		}
		catch(why) {
			err = true;
			document.getElementById("importButton").innerHTML = "Invalid Save";
			
		}
		if (!err) {
			document.getElementById("importButton").innerHTML = "Imported!";
			if (secret) {
				document.getElementById("importButton").innerHTML = "Secret!";
			}
		}
		setTimeout(function(){
			document.getElementById("importButton").innerHTML = "Import"
		}, 1000);
	}
}

// totally didn't copy this from somewhere else
function objectToDecimal(object) { 
	for (let i in object) {
		if (typeof(object[i]) == "string" && !isNaN(new Decimal(object[i]).mag) && !(new Decimal(object[i]).sign == 0 && object[i] != "0")) {
			object[i] = new Decimal(object[i]);
		}
		if (typeof(object[i]) == "object") {
			objectToDecimal(object[i]);
		}
	}
}

function merge(base, source) {
	for (let i in base) {
		if (source[i] != undefined) {
			if (typeof(base[i]) == "object" && typeof(source[i]) == "object" && !isDecimal(base[i]) && !isDecimal(source[i]) && base[i] != game.achievement) {
				merge(base[i], source[i]);
			} else {
				if (isDecimal(base[i]) && !isDecimal(source[i])) {
					base[i] = new Decimal(source[i]);
				} else if (!isDecimal(base[i]) && isDecimal(source[i])) {
					base[i] = source[i].toNumber();
				} else {
					base[i] = source[i];
				}
			}
		}
	}
}

function isDecimal(x) {
	if (x.mag == undefined) {
		return false;
	} else {
		return true;
	}
}

function newGame() {
	let save = {
		permaStat: {
			version: 0.31,
			endgame: Decimal.fromComponents(1, 5, 1),
			timePlayed: 0,
			highestNum: new Decimal(10),
			totalReset: new Decimal(0),
			totalPlexal: new Decimal(0),
		},
		auto: {
			tabUnlocked: false,
			on: [false, false],
			unlocked: [false, false]
		},
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
			upgrade: {
				cost: ["lol", new Decimal(1), new Decimal(2), new Decimal(1), new Decimal(3), new Decimal(8), new Decimal(15), Decimal.fromComponents(1, 2, 200), Decimal.fromComponents(1, 3, 3), Decimal.fromComponents(1, 3, 4)],
				unlocked: [true, false, false, false, false, false, false, false, false, false],
				boost: ["lol", new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(0), new Decimal(1)]
			},
			unlocked: false
		},
		iterator: {
			iteration: new Decimal(0),
			baseBoost: new Decimal(1.1),
			boost: new Decimal(1.1),
			totalBoost: new Decimal(1),
			baseCost: new Decimal(10),
			cost: new Decimal(10),
			costIncrease: new Decimal(1e2),
			upgrade: {
				amount: new Decimal(0),
				baseBoost: new Decimal(1.1),
				boost: new Decimal(1.1),
				totalBoost: new Decimal(1),
				baseCost: new Decimal(10),
				cost: new Decimal(100),
				costIncrease: new Decimal(10)
			},
			unlocked: false
		},
		achievement: {
			normalCompleted: [],
			secretCompleted: [],
			hideCompleted: false
		},
		autoSave: true,
		autoSaveSpeed: 1000,
		updateSpeed: 50,
		theme: {
			themeList:["light", "dark"],
			currentTheme: 0
		},
		notation: {
			split: ["Layer-Mag", new Decimal(1000), "Scientific", new Decimal(1e100), "Logarithmic", Decimal.fromComponents(1, 5, 1), "Hyper E"],
			selected: 0,
			tetrationBase: new Decimal(2)
		},
		speed: 1
	}
	return save;
}

function wipe() {
	doUpdate = false;
	setTimeout(function() {
		game = newGame();
		save(true);
		for (achieve in achievement.normal) {
			achievement.normal[achieve].hidden = true;
		}
		for (achieve in achievement.secret) {
			achievement.secret[achieve].hidden = true;
		}
		achievement.normal.openAchieve.hidden = false;
		achievement.normal.unlock1.hidden = false;
		achievement.normal.unlock2.hidden = false;
		achievement.normal.unlock3.hidden = false;
		achievement.normal.unlock4.hidden = false;
		doUpdate = true;
	}, 50);
}

function wipeConfirm() {
	if (confirm("Are you sure you want to wipe your save?")) {
		wipe();
	}
}

function toggleAutoSave() {
	game.autoSave = !game.autoSave;
}

/*********** 
 * DISPLAY *
 ***********/

function formatNum(n, notation, noPoint) {
	switch(notation) {
		case "Layer-Mag":
			if (noPoint) {
				if (n.layer == 0) {
					return n.mag.toFixed(0);
				} else {
					return findDisplay(new Decimal(n.layer), true) + "-" + n.mag.toFixed(0);
				}
			} else {
				if (n.layer == 0) {
					return n.mag.toFixed(2);
				} else {
					return findDisplay(new Decimal(n.layer), true) + "-" + n.mag.toFixed(2);
				}
			}
		break;
		case "Scientific":
			return n.m.toFixed(2) + "e" + findDisplay(n.log10().floor(), true);
		break;
		case "Logarithmic":
			return "e" + findDisplay(n.log10(), true);
		break;
		case "Hyper E":
			let x = new Decimal(n.mag).slog(10);
			return "E" + (new Decimal(n.mag)).iteratedlog(10,x.floor()).toFixed(2) + "#" + findDisplay((new Decimal(n.layer)).add(x.floor()), true);
		break;
		case "Tetration":
			return game.notation.tetrationBase + "^^" + findDisplay(n.slog(game.notation.tetrationBase).toFixed(2));
		break;
	}
}

function findDisplay(n, noPoint) {
	if (!noPoint) noPoint = false;
	if (n.lessThan(game.notation.split[1])) {
		return formatNum(n, game.notation.split[0], noPoint);
	} else if (n.lessThan(game.notation.split[3])) {
		return formatNum(n, game.notation.split[2], noPoint);
	} else if (n.lessThan(game.notation.split[5])) {
		return formatNum(n, game.notation.split[4], noPoint);
	} else {
		return formatNum(n, game.notation.split[6], noPoint);
	}
}

function unformatNum(str) {
	let num;
	if (!isNaN(new Decimal(object[i]).mag) && !(new Decimal(object[i]).sign == 0 && object[i] != "0")) {
		return new Decimal(str);
	} else if (str.includes("-") && str.charAt(0) != "-") {
		let split = str.split("-");
		return Decimal.fromComponents(1, split[0], split[1]);
	} else if (str.includes("#") && str.charAt(0) == "E") {
		let split = str.split("#");
		return Decimal.fromComponents(1, split[1], split[0].replace("E", ""));
	} else {
		return "INVALID VALUE";
	}
}

function findTimeDisplay(ms) {
	let s = ms/1000;
	let ds = mod(s, 60).toFixed(2);
	let m = Math.floor(s/60);
	let dm = mod(m, 60);
	let h = Math.floor(m/60);
	let dh = mod(h, 24);
	let d = Math.floor(h/24);
	let dd = mod(d, 30.43685);
	let mo = Math.floor(d/30.43685);
	let dmo = mod(mo, 12);
	let dy = Math.floor(mo/365.2422);
	let time = "";
	let seg = 0;
	if (s < 60) {
		time = ds + " second" + pluralCheck(ds);
		seg++;
	} else {
		time = "and " + ds + " second" + pluralCheck(ds);
		seg++;
	}
	if (dm >= 1) {
		time = dm + " minute" + pluralCheck(dm) + ", " + time;
		seg++;
	}
	if (dh >= 1) {
		time = dh + " hour" + pluralCheck(dh) + ", " + time;
		seg++;
	}
	if (dd >= 1) {
		time = dh + " day" + pluralCheck(dd) + ", " + time;
		seg++;
	}
	if (dmo >= 1) {
		time = dh + " month" + pluralCheck(dmo) + ", " + time;
		seg++;
	}
	if (dy >= 1) {
		time = dh + " year" + pluralCheck(dy) + ", " + time;
		seg++;
	}
	if (seg == 2) {
		time = time.replace(",", "");
	}
	return time;
}

function pluralCheck(x) {
	if ((x)) {
		if (x.equals(1)) {
			return "";
		} else {
			return "s";
		}
	} else {
		if (x == 1) {
			return "";
		} else {
			return "s";
		}
	}
}

function mod(x, y) {
	let a = Math.floor(x / y);
	let b = a * y;
	return x - b;
}

function notify(message, subMessage, bgColor) {
	let note = document.createElement("button");
	let big = document.createElement("span");
	let bigText = document.createTextNode(message);
	document.body.appendChild(note);
	note.appendChild(big);
	big.appendChild(bigText);
	if (subMessage != undefined) {
		note.appendChild(document.createElement("br"));
		let text = document.createTextNode(subMessage);
		note.appendChild(text);
	}
	big.style.fontSize = "20px";
	if (bgColor != undefined) {
		note.style.backgroundColor = bgColor;
	}
	note.classList.add('notification');
	setTimeout(function() {
		note.remove();
	}, 3800)
}

/*********
 * UPDATE*
 *********/

function updateTab() {
	if (game.plexal.amount.greaterThanOrEqualTo(1)) {
		document.getElementById("plexalStatTabButton").classList.remove('hidden');
	} else {
		document.getElementById("plexalStatTabButton").classList.add('hidden');
		if (!document.getElementById("plexalStat").classList.contains('hidden')) {
			toTab('normalStat');
		}
	}
	if (game.auto.tabUnlocked) {
		document.getElementById("autoTabButton").classList.remove('hidden');
		achievement.normal.startAuto.complete();
	} else {
		document.getElementById("autoTabButton").classList.add('hidden');
	}
}

function getPower(n) {
	let power = game.mult.powerPerBuy.pow(game.mult.upgradeAmount[n]).mul(game.reset.totalBoost).mul(game.iterator.totalBoost)
	if (game.plexal.upgrade.unlocked[1]) {
		power = power.mul(game.plexal.upgrade.boost[1])
	}
	if (game.plexal.upgrade.unlocked[3]) {
		power = power.mul(game.plexal.upgrade.boost[3]);
	}
	return power;
}

function calcMult() {
	let m = game.mult;
	for (let i = 1; i <= game.mult.actualMaxMult; i++) {
		m.powerPerBuy = (new Decimal(2))
		if (game.plexal.upgrade.unlocked[2]) {
			m.powerPerBuy = m.powerPerBuy.mul(game.plexal.upgrade.boost[2]);
		}
		m.generation[i] = m.amount[i].pow(m.power[i]); 
		m.cost[i] = m.baseCost[i].pow(m.costIncrease[i].pow(m.upgradeAmount[i]));
		m.power[i] = getPower(i);
		m.maxMult = (new Decimal(4)).add(game.reset.amount);
		if ((new Decimal(game.mult.maxMult)).greaterThan(game.mult.actualMaxMult)) {
			m.maxMult = m.actualMaxMult;
		}
		if (m.unlocked[i] != false) {
			achievement.normal["unlock" + i].complete();
		}
	}
}

function updateMult() {
	let m = game.mult;
	for (let i = 1; i <= game.mult.actualMaxMult; i++) {
		document.getElementById("multAmount" + i).innerHTML = findDisplay(m.amount[i]);
		document.getElementById("multPower" + i).innerHTML = "^" + findDisplay(m.power[i]);
		if (m.unlocked[i] == false) {
			document.getElementById("multButton" + i).innerHTML = "Unlock Multiplier " + i + " Cost: " + findDisplay(m.cost[i]);
			if (i != m.actualMaxMult) {
				document.getElementById("mult"+(i+1)).classList.add('hidden');
			}
		} else {
			document.getElementById("multButton" + i).innerHTML = "Boost Multiplier " + i + " by ^" + findDisplay(m.powerPerBuy) + " Cost: " + findDisplay(m.cost[i]);
			if (i != m.maxMult) {
				document.getElementById("mult"+(i+1)).classList.remove('hidden');
			}
		}
		if (game.number.greaterThanOrEqualTo(m.cost[i])) {
			document.getElementById("multButton" + i).classList.remove('disabled');
			document.getElementById("multButton" + i).classList.add('enabled');
		} else {
			document.getElementById("multButton" + i).classList.remove('enabled');
			document.getElementById("multButton" + i).classList.add('disabled');  
		}
	}
}

function calcReset() {
	let r = game.reset;
	r.boost = new Decimal(3);
	if (game.plexal.upgrade.unlocked[4]) {
		r.boost = r.boost.mul(game.plexal.upgrade.boost[4]);
	}
	r.totalBoost = r.boost.pow(r.amount);
	r.costIncrease = r.baseCostIncrease.mul(r.costScaling.pow(r.amount));
	r.cost = r.baseCost.pow(r.costIncrease.pow(r.amount))
	if (r.amount.greaterThan(0)
	   || game.number.greaterThan(Decimal.fromComponents(1, 2, 8))) {
		r.unlocked = true;
		achievement.normal.reset.hidden = false;
		achievement.normal.unlock5.hidden = false;
	}
	for (let i = 0; i < 5; i++) {
		if (r.amount.greaterThan(new Decimal(i))) {
			achievement.normal["unlock" + (i+6)].hidden = false;
		}
	}
}

function updateReset() {
	let r = game.reset;
	if (r.unlocked) {
		document.getElementById("reset").classList.remove('hidden');
	}
	document.getElementById("resetPower").innerHTML = "^" + findDisplay(r.totalBoost);
	document.getElementById("resetAmount").innerHTML = findDisplay(new Decimal(r.amount));
	if (game.mult.maxMult < game.mult.actualMaxMult) {
		document.getElementById("resetButton").innerHTML = "Reset the game for a new multiplier and a ^" + findDisplay(r.boost) + " boost to all multipliers Requires: " + findDisplay(r.cost);
	} else {
		document.getElementById("resetButton").innerHTML = "Reset the game for a ^" + findDisplay(r.boost) + " boost to all multipliers Requires: " + findDisplay(r.cost);
	}
	if (game.number.greaterThanOrEqualTo(r.cost)) {
		document.getElementById("resetButton").classList.remove('disabled');
		document.getElementById("resetButton").classList.add('enabled');
	} else {
		document.getElementById("resetButton").classList.remove('enabled');
		document.getElementById("resetButton").classList.add('disabled');  
	}
	if (game.plexal.upgrade.unlocked[9]) {
		document.getElementById("maxResetButton").classList.remove('hidden');
	} else {
		document.getElementById("maxResetButton").classList.add('hidden');
	}
}

function getPlexalGain() {
	let gain = game.number.log(Decimal.fromComponents(1, 2, 100)).root(666);
	if (game.plexal.upgrade.unlocked[6]) {
		gain = gain.mul(game.plexal.upgrade.boost[6]);
	}
	return gain.floor();
}

function calcPlexal() {
	game.plexal.gain = getPlexalGain();
	if (game.number.greaterThan(Decimal.fromComponents(1, 2, 80))) {
		game.plexal.unlocked = true;
	}
	if (game.plexal.amount.greaterThan(new Decimal(0))) {
		achievement.normal.inflate.hidden = false;
		achievement.normal.startAuto.hidden = false;
		achievement.normal.googolduplex.hidden = false;
	}
	if (game.plexal.unlocked) {
		achievement.normal.plexal.hidden = false;
	}
}

function updatePlexal() {
	if (game.plexal.amount.greaterThan(new Decimal(0))) {
		document.getElementById("plexalTabButton").classList.remove('hidden');
	} else {
		document.getElementById("plexalTabButton").classList.add('hidden');
	}
	if (game.plexal.unlocked == true) {
		document.getElementById("plexButton").classList.remove('hidden');
	} else {
		document.getElementById("plexButton").classList.add('hidden');
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

function calcIterator() {
	let it = game.iterator;
	let upg = it.upgrade;
	it.boost = it.baseBoost.mul(upg.totalBoost);
	it.totalBoost = it.boost.pow(it.iteration);
	it.cost = it.baseCost.pow(it.costIncrease.pow(it.iteration));
}

function updateIterator() {
	let it = game.iterator;
	document.getElementById("iteratorTotalBoost").innerHTML = "^" + findDisplay(it.totalBoost);
	document.getElementById("iteration").innerHTML = findDisplay(it.iteration);
	document.getElementById("iterationCost").innerHTML = findDisplay(it.cost);
	document.getElementById("iteratorBoost").innerHTML = "^" + findDisplay(it.boost);
	if (it.unlocked == true && game.mult.amount[1].greaterThan(1)) {
		document.getElementById("iterate").classList.remove('hidden');
	} else {
		document.getElementById("iterate").classList.add('hidden');
	}
	if (game.number.greaterThanOrEqualTo(it.cost)) {
		document.getElementById("iterateButton").classList.remove('disabled');
		document.getElementById("iterateButton").classList.add('enabled');
	} else {
		document.getElementById("iterateButton").classList.remove('enabled');
		document.getElementById("iterateButton").classList.add('disabled');  
	}
}

function calcIteratorUpg() {
	let it = game.iterator;
	let upg = it.upgrade;
	if (game.plexal.upgrade.unlocked[8]) {
		upg.boost = upg.baseBoost.mul(game.reset.totalBoost);
	}
	upg.totalBoost = upg.boost.pow(upg.amount);
	if (upg.amount.lessThan(1)) {
		upg.cost = new Decimal(100);
	} else {
		upg.cost = upg.baseCost.pow(upg.costIncrease.pow(upg.amount));
	}
}

function updateIteratorUpg() {
	let it = game.iterator;
	let upg = it.upgrade;
	document.getElementById("iteratorUpgradeBoost").innerHTML = findDisplay(upg.boost);
	document.getElementById("iteratorUpgradeCost").innerHTML = findDisplay(upg.cost);
	if (it.unlocked == true) {
		document.getElementById("iteratorUnlock").classList.add('hidden');
		document.getElementById("iteratorUpgrade").classList.remove('hidden');
	} else {
		document.getElementById("iteratorUnlock").classList.remove('hidden');
		document.getElementById("iteratorUpgrade").classList.add('hidden');
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

function calcPlexalUpg() {
	game.plexal.upgrade.boost[1] = game.plexal.amount.add(1);
	game.plexal.upgrade.boost[2] = game.iterator.boost;
	game.plexal.upgrade.boost[3] = game.plexal.essence.pow(1.1).add(1);
	game.plexal.upgrade.boost[4] = game.reset.amount.root(8);
	game.plexal.upgrade.boost[5] = game.permaStat.totalReset.root(3.5).floor();
	game.plexal.upgrade.boost[6] = game.plexal.essence.root(2);
	if (game.plexal.upgrade.boost[4].lessThan(1)) {
		game.plexal.upgrade.boost[4] = new Decimal(1);
	}
	if (game.plexal.upgrade.boost[6].lessThan(1)) {
		game.plexal.upgrade.boost[6] = new Decimal(1);
	}
}

function updatePlexalUpg() {
	for (let i = 1; i < game.plexal.upgrade.boost.length; i++) {
		document.getElementById("plexalUpg" + i + "Boost").innerHTML = findDisplay(game.plexal.upgrade.boost[i]);
	}
	for (let i = 1; i < game.plexal.upgrade.unlocked.length; i++) {
		if (game.plexal.upgrade.unlocked[i] == false) {
			document.getElementById("plexalUpg" + i).classList.remove('noHover');
			if (game.plexal.essence.greaterThanOrEqualTo(game.plexal.upgrade.cost[i]) && game.plexal.upgrade.unlocked[i-1] == true) {
				document.getElementById("plexalUpg" + i).classList.add('enabled');
				document.getElementById("plexalUpg" + i).classList.remove('disabled');
			} else {
				document.getElementById("plexalUpg" + i).classList.add('disabled');
				document.getElementById("plexalUpg" + i).classList.remove('enabled');
			}
		} else {
			document.getElementById("plexalUpg" + i).classList.remove('disabled');
			document.getElementById("plexalUpg" + i).classList.remove('enabled');
			document.getElementById("plexalUpg" + i).classList.add('plexal');
			document.getElementById("plexalUpg" + i).classList.add('noHover');
		}
	}
}

function updateStat() {
	document.getElementById("timePlayed").innerHTML = findTimeDisplay(game.permaStat.timePlayed);
	document.getElementById("highestNum").innerHTML = findDisplay(game.permaStat.highestNum);
	document.getElementById("totalReset").innerHTML = "You have reseted a total of " + findDisplay(game.permaStat.totalReset) + " time" + pluralCheck(game.permaStat.totalReset);
	document.getElementById("plexalAmount").innerHTML = findDisplay(game.plexal.amount) + " time" + pluralCheck(game.plexal.amount);
	if (game.permaStat.totalReset.greaterThan(0)) {
		document.getElementById("totalReset").classList.remove('hidden');
	} else {
		document.getElementById("totalReset").classList.add('hidden');
	}
}

function calcAuto() {
	if (game.plexal.upgrade.unlocked[7]) {
		game.auto.tabUnlocked = true;
		game.auto.unlocked[0] = true;
		game.auto.unlocked[1] = true;
	} else {
		game.auto.tabUnlocked = false;
		game.auto.unlocked[0] = false;
		game.auto.unlocked[1] = false;
	}
}

function updateAuto() {
	if (game.auto.on[0]) {
		document.getElementById("autoMultButton").innerHTML ="Auto Multiplier: ON"
	} else {
		document.getElementById("autoMultButton").innerHTML ="Auto Multiplier: OFF"
	}
	if (game.auto.on[1]) {
		document.getElementById("autoIterateButton").innerHTML ="Auto Iterate: ON"
	} else {
		document.getElementById("autoIterateButton").innerHTML ="Auto Iterate: OFF"
	}
}

function updateAchievement() {
	for (achieve in achievement.normal) {
		let a = achievement.normal[achieve];
		if (game.achievement.normalCompleted.includes(a.alias)) {
			a.hidden = false;
			document.getElementById(a.alias + "AchieveBox").classList.remove('disabled');
			document.getElementById(a.alias + "AchieveBox").classList.add('enabled');
		} else {
			document.getElementById(a.alias + "AchieveBox").classList.remove('enabled');
			document.getElementById(a.alias + "AchieveBox").classList.add('disabled');
		}
		if (a.hidden || (game.achievement.normalCompleted.includes(a.alias) && game.achievement.hideCompleted)) {
			document.getElementById(a.alias + "Achieve").classList.add('hidden');
		} else {
			document.getElementById(a.alias + "Achieve").classList.remove('hidden');
		}
	}
	for (achieve in achievement.secret) {
		let a = achievement.secret[achieve];
		if (game.achievement.secretCompleted.includes(a.alias)) {
			a.hidden = false;
			document.getElementById(a.alias + "AchieveBox").classList.remove('disabled');
			document.getElementById(a.alias + "AchieveBox").classList.add('enabled');
		} else {
			document.getElementById(a.alias + "AchieveBox").classList.remove('enabled');
			document.getElementById(a.alias + "AchieveBox").classList.add('disabled');
		}
		if (a.hidden || (game.achievement.secretCompleted.includes(a.alias) && game.achievement.hideCompleted)) {
			document.getElementById(a.alias + "Achieve").classList.add('hidden');
		} else {
			document.getElementById(a.alias + "Achieve").classList.remove('hidden');
		}
	}
	if (game.achievement.hideCompleted) {
		document.getElementById("hideCompletedButton").innerHTML = "Show Completed Achievements";
	} else {
		document.getElementById("hideCompletedButton").innerHTML = "Hide Completed Achievements";
	}
	document.getElementById("normalAchieveCount").innerHTML = game.achievement.normalCompleted.length + "/" + Object.keys(achievement.normal).length;
	document.getElementById("secretAchieveCount").innerHTML = game.achievement.secretCompleted.length + "/" + Object.keys(achievement.secret).length;
}

function updateOption() {
	if (game.autoSave) {
		document.getElementById("autoSaveButton").innerHTML = "Auto Save: ON";
	} else {
		document.getElementById("autoSaveButton").innerHTML = "Auto Save: OFF";
	}
	document.getElementById("themeButton").innerHTML = game.theme.themeList[game.theme.currentTheme].charAt(0).toUpperCase() + game.theme.themeList[game.theme.currentTheme].slice(1) + " Theme";
}

function updateHotkey() {
	if (game.reset.unlocked) {
		document.getElementById("hotkeyReset").classList.remove('hidden');
	} else {
		document.getElementById("hotkeyReset").classList.add('hidden');
	}
	if (game.plexal.amount.greaterThan(0)) {
		document.getElementById("hotkeyPlexal").classList.remove('hidden');
	} else {
		document.getElementById("hotkeyPlexal").classList.add('hidden');
	}
}

function calcNotation() {
	
}

function updateNotation() {
	for (let i = 0; i < 7; i += 2) {
		document.getElementById("split" + i).innerHTML = game.notation.split[i];
	}
	for (let i = 1; i < 6; i += 2) {
		unformatNum(document.getElementById("split" + i).value);
		document.getElementById("split" + i).value = game.notation.split[i];
	}
}

function calcAll() {
	if (game.number.lessThan(1)) {
		game.number = new Decimal(10);
	}
	if (game.number.greaterThan(game.permaStat.highestNum)){
		game.permaStat.highestNum = game.number;
	}
	if (game.number.greaterThan(game.permaStat.endgame)) {
		achievement.normal.endgame.complete();
	}
	if (game.number.greaterThan(Decimal.fromComponents(1, 3, 20))) {
		achievement.normal.inflate.complete();
	}
	if (game.number.greaterThan(Decimal.fromComponents(1, 3, 100))) {
		achievement.normal.googolduplex.complete();
	}
	calcMult();
	calcReset();
	calcPlexal();
	calcIterator();
	calcIteratorUpg();
	calcPlexalUpg();
	calcAuto();
}

function updateAll() {
	document.getElementById("title").innerHTML = "Exponential Madness v" + game.permaStat.version;
	document.getElementById("multPerSecond").innerHTML = findDisplay(game.mult.generation[1]);
	document.getElementById("number").innerHTML = findDisplay(game.number);
	updateTab();
	updatePlexal();
	if (!document.getElementById("mult").classList.contains("hidden")) {
		updateMult();
		updateReset();
		updateIterator();
	}
	if (!document.getElementById("iterator").classList.contains("hidden")) {
		updateIteratorUpg();
	}
	if (!document.getElementById("plexalUpgrade").classList.contains("hidden")) {
		updatePlexalUpg();
	}
	if (!document.getElementById("stat").classList.contains("hidden")) {
		updateStat();
	}
	if (!document.getElementById("auto").classList.contains("hidden")) {
		updateAuto();
	}
	if (!document.getElementById("achievement").classList.contains("hidden")) {
		updateAchievement();
	}
	if (!document.getElementById("option").classList.contains("hidden")) {
		updateOption();
		updateHotkey();
	}
	document.querySelectorAll("*").forEach(function(element) {
		element.classList.add(game.theme.themeList[game.theme.currentTheme]);
	});
}

/*****************
 * PLAYER ACTION *
 *****************/

function toTab(tab) {
	document.getElementById(tab).parentNode.querySelectorAll("#" + document.getElementById(tab).parentNode.id + " > .tab").forEach(function(element) {
		element.classList.add('hidden');
	});
	document.getElementById(tab).classList.remove('hidden');
	if (tab == 'achievement') {
		achievement.normal.openAchieve.complete();
	}
}

function cycleTheme(){
	document.querySelectorAll("*").forEach(function(element) {
		element.classList.remove(game.theme.themeList[game.theme.currentTheme]);
	});
	game.theme.currentTheme++;
	if (game.theme.currentTheme >= game.theme.themeList.length) {
		game.theme.currentTheme = 0;
	}
}

function buyMult(n) {
	if (!document.getElementById("mult" + n).classList.contains('hidden')) {
		if (game.number.greaterThanOrEqualTo(game.mult.cost[n])) {
			game.number = game.number.div(game.mult.cost[n]);
			if (game.mult.unlocked[n] == false) {
				game.mult.amount[n] = new Decimal(1.25);
				game.mult.unlocked[n] = true;
			} else {
				game.mult.upgradeAmount[n] = game.mult.upgradeAmount[n].add(1);
			}
		}
	}
}

function maxMult(n) {
	if (!document.getElementById("mult" + n).classList.contains('hidden')) {
		let num = game.number.log10().log10();
		num.mag = num.mag*0.999;
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
				maxMult(n, "normal");
			} else {
				game.number = game.number.div((new Decimal(10)).pow((new Decimal(10)).pow(totalCost)));
				game.mult.upgradeAmount[n] = game.mult.upgradeAmount[n].add(buyAmount);
			}
		}
	}
}

function maxAllMult() {
	maxMult(1);
	maxMult(2);
	maxMult(3);
	maxMult(4);
	maxMult(5);
	maxMult(6);
	maxMult(7);
	maxMult(8);
	maxMult(9);
	maxMult(10);
}

function maxAll() {
	maxAllMult();
	maxIterate();
}

function reset() {
	if (game.number.greaterThanOrEqualTo(game.reset.cost)) {
		game.number = newGame().number;
		game.mult = newGame().mult;
		game.reset.amount = game.reset.amount.add(1);
		game.permaStat.totalReset = game.permaStat.totalReset.add(1);
		achievement.normal.reset.complete();
	}
}

function maxReset() {
	if (game.reset.unlocked == true) {
		let num = game.number.log10().log10();
		num.mag = num.mag*0.99999;
		let startCost = game.reset.cost.log10().log10();
		if (num.greaterThanOrEqualTo(startCost)) {
			let baseCost = game.reset.baseCost.log10().log10();
			let costChange = num.sub(startCost);
			let scaling = game.reset.costScaling.log10().mul(2);
			let startIncrease = game.reset.costIncrease.log10();
			let endIncrease = startIncrease.pow(2).add(scaling.mul(costChange).mul(2)).sqrt();
			let increaseChange = endIncrease.sub(startIncrease);
			let buyAmount = increaseChange.div(scaling).add(1).floor();
			game.number = newGame().number;
			game.mult = newGame().mult;
			game.reset.amount = game.reset.amount.add(buyAmount);
			game.permaStat.totalReset = game.permaStat.totalReset.add(buyAmount);
			achievement.normal.reset.complete();
		}
	}
}

function plexal() {
	if (game.number.greaterThanOrEqualTo(Decimal.fromComponents(1, 2, 100))) {
		game.number = newGame().number;
		game.mult = newGame().mult;
		game.reset = newGame().reset;
		if (game.plexal.upgrade.unlocked[5]) {
			game.reset.amount = game.plexal.upgrade.boost[5];
		}
		game.iterator.iteration = newGame().iterator.iteration;
		game.plexal.amount = game.plexal.amount.add(1);
		game.permaStat.totalPlexal = game.permaStat.totalPlexal.add(1);
		game.plexal.essence = game.plexal.essence.add(game.plexal.gain);
		achievement.normal.plexal.complete();
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
		let num = game.number.log10().log10();
		num.mag = num.mag*0.99999;
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

function upgradeIterator() {
	if (game.plexal.essence.greaterThanOrEqualTo(game.iterator.upgrade.cost)) {
		game.plexal.essence = game.plexal.essence.sub(game.iterator.upgrade.cost)
		game.iterator.upgrade.amount = game.iterator.upgrade.amount.add(1);
	}
}

function maxUpgradeIterator() {
	let PE = game.plexal.essence.log10().log10();
	PE.mag = PE.mag*0.99999;
	let startCost = game.iterator.upgrade.cost.log10().log10();
	if (PE.greaterThanOrEqualTo(startCost)) {
		let increase = game.iterator.upgrade.costIncrease.log10();
		let buyAmount = PE.sub(startCost).div(increase).ceil();
		let endCost = startCost.add(increase.mul(buyAmount));
		let totalCost = endCost.sub(increase);
		game.plexal.essence = game.plexal.essence.sub((new Decimal(10)).pow(totalCost));
		game.iterator.upgrade.amount = game.iterator.upgrade.amount.add(buyAmount);
	}
}

function buyUpgrade(n, type) {
	switch (type) {
		case "plexal":
			if (game.plexal.essence.greaterThanOrEqualTo(game.plexal.upgrade.cost[n]) &&
			   game.plexal.upgrade.unlocked[n-1] == true && game.plexal.upgrade.unlocked[n] == false) {
				game.plexal.essence = game.plexal.essence.sub(game.plexal.upgrade.cost[n]);
				game.plexal.upgrade.unlocked[n] = true;
			}
		break;
	}
}

function toggleAuto(n) {
	game.auto.on[n] = !game.auto.on[n];
}

function toggleGrayout() {
	let grayout = document.getElementById("grayout");
	if (grayout.classList.contains("hidden")) {
		grayout.classList.remove('hidden');
	} else {
		grayout.classList.add('hidden');
	}
}

window.onclick = function(event) {
	if (event.target == document.getElementById("grayout")) {
		closeAllModal();
	}
}

function closeAllModal() {
	toggleGrayout();
	document.querySelectorAll(".modal").forEach(function(element) {
		element.classList.add('hidden');
	});
}

function openNotation() {
	toggleGrayout();
	document.getElementById("notationMenu").classList.remove('hidden')
}

function selectSplit(n) {
	game.notation.selected = n;
}

function changeSplit(x) {
	game.notation.split[game.notation.selected] = x;
}

/*********** 
 * HOTKEYS *
 ***********/

document.addEventListener("keydown", function(input){
	let key = input.key;
	switch(key) {
		case "1":
		case "2":
		case "3":
		case "4":
		case "5":
		case "6":
		case "7":
		case "8":
		case "9":
			buyMult(Number(key));
		break;
		case "0":
			buyMult(10);
		break;
		case "!":
			maxMult(1);
		break;
		case "@":
			maxMult(2);
		break;
		case "#":
			maxMult(3);
		break;
		case "$":
			maxMult(4);
		break;
		case "%":
			maxMult(5);
		break;
		case "^":
			maxMult(6);
		break;
		case "&":
			maxMult(7);
		break;
		case "*":
			maxMult(8);
		break;
		case "(":
			maxMult(9);
		break;
		case ")":
			maxMult(10);
		break;
		case "i":
			iterate();
		break;
		case "I":
			maxIterate();
		break;
		case "m":
			maxAll();
		break;
		case "r":
			reset();
		break;
		case "R":
			if (game.plexal.upgrade.unlocked[9]) {
				maxReset();
			}
		break;
		case "p":
			plexal();
		break;
	}
});

/****************
 * ACHIEVEMENTS *
 ****************/

const achievement = {
	normal:{},
	secret:{}
};

function Achievement(name, desc, alias, hidden, secret) {
	this.name = name;
	this.desc = desc;
	this.alias = alias;
	this.secret = false;
	this.hidden = true;
	if (secret == true) {
		this.secret = true;
	}
	if (hidden == false) {
		this.hidden = false;
	}
	if (this.secret) {
		achievement.secret[alias] = this;
		this.complete = function() {
			if (!game.achievement.secretCompleted.includes(this.alias)) {
				game.achievement.secretCompleted.push(this.alias);
				notify("Achievement Completed:", this.name);
			}
		}
	} else {
		achievement.normal[alias] = this;
		this.complete = function() {
			if (!game.achievement.normalCompleted.includes(this.alias)) {
				game.achievement.normalCompleted.push(this.alias);
				notify("Achievement Completed:", this.name);
			}
		}
	}
	
	let ach = document.createElement("span");
	ach.id = this.alias + "Achieve";
	ach.classList.add('achieve');
	if (this.secret) {
		document.getElementById("secretAchieve").appendChild(ach);
	} else {
		document.getElementById("normalAchieve").appendChild(ach);
	}
	
	ach.appendChild(document.createElement("br"));
	let achBox = document.createElement("button");
	achBox.id = this.alias + "AchieveBox";
	achBox.classList.add('noHover');
	achBox.classList.add('achievement');
	ach.appendChild(achBox);
	
	let nameText = document.createTextNode(this.name);
	let big = document.createElement("span");
	achBox.appendChild(big);
	big.appendChild(nameText);
	big.id = this.alias + "AchieveName";
	
	achBox.appendChild(document.createElement("br"));
	let descText = document.createTextNode(this.desc); 
	let small = document.createElement("span");
	achBox.appendChild(small);
	small.appendChild(descText);
	small.id = this.alias + "AchieveDesc";
	small.style.fontSize = "10px";
}

function hideCompleted() {
	game.achievement.hideCompleted = !game.achievement.hideCompleted;
}

function createAchievements() {
	// (name, desc, alias, [hidden?](default: true), [secret?](default: false))
	new Achievement("Open the Achievements Tab", "Hi, this exist.", "openAchieve", false);
	new Achievement("Unlock Multiplier 1", "It begins.", "unlock1", false);
	new Achievement("Unlock Multiplier 2", "This is getting out of hand already.", "unlock2", false);
	new Achievement("Unlock Multiplier 3", "Many people don't know how to count to three, so good thing you do know.", "unlock3", false);
	new Achievement("Unlock Multiplier 4", "Wait where's the fifth one?", "unlock4", false);
	new Achievement("Unlock Multiplier 5", "So this is where it was!", "unlock5");
	new Achievement("Unlock Multiplier 6", "Six is sexy. I think nine agrees", "unlock6");
	new Achievement("Unlock Multiplier 7", "Seven is a number cannibal. That's why everyone's scared of him/her.", "unlock7");
	new Achievement("Unlock Multiplier 8", "Ninty degrees to infini- wait we're already there.", "unlock8");
	new Achievement("Unlock Multiplier 9", "Good thing these aren't dimensions.", "unlock9");
	new Achievement("Unlock Multiplier 10", "You have hit the ceiling. That must have hurt.", "unlock10");
	new Achievement("Reset", "Don't worry, this isn't a hard reset.", "reset");
	new Achievement("Plexal", "You've reached a googolplex. It perplexes many, but not you of course.", "plexal");
	new Achievement("Inflate", "It's fine! It's fine! Stay calm! I said stay calm god dammit!", "inflate");
	new Achievement("Start Automation", "I've finally added automation. You better thank me now.", "startAuto");
	new Achievement('Import "export text"', "You... did what I said... I guess?", "followInstruction", true, true);
	new Achievement("Thank Me", "I didn't expect that. Thank you.", "thanks", true, true);
	new Achievement("Reach a Googolduplex", "Super-duper-duplex.", "googolduplex");
	// new Achievement("Reach a Googoltriplex", "Thri", "googoltriplex");
	new Achievement("Reach the current endgame", "You will lose this achievement if the endgame gets changed, but anyway, this is the endgame now.", "endgame", false);
}

createAchievements();
load(true);
window.requestAnimationFrame(nextFrame);
