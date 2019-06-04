function getInitPlayer() {
  var player = {
    save: true,
    number: new Decimal(10),
    mult: {
      amount:[0, new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1)],
      cost:[0, new Decimal(10), new Decimal(1e10), Decimal.fromComponents(1, 2, 2), Decimal.fromComponents(1, 2, 3)],
      unlocked:[0, false, false, false, false]
    }
  }
  return player;
}
var game = getInitPlayer();
setInterval(function() {
  game.number = game.number.mul(game.mult.amount[1].root(100));
  game.mult.amount[1] = game.mult.amount[1].mul(game.mult.amount[2].root(100));
  game.mult.amount[2] = game.mult.amount[2].mul(game.mult.amount[3].root(100));
  game.mult.amount[3] = game.mult.amount[3].mul(game.mult.amount[4].root(100));
  updateStuff();
}, 10);
setInterval(function() {
  if (autosave == true) {
    saveGame();
  }
}, 60000);
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
  } else if (n.lessThan(1e100)) {
    return n.m.toFixed(2) + "e" + findDisplayValue(new Decimal(n.e));
  } else if (n.lessThan(Decimal.fromComponents(1, 4, 1))) {
    return "e" + findDisplayValue(new Decimal(n.e));
  } else {
    return "E" + n.e + "#" + n.layer;
  }
}
function clone(obj) { //Handy Dandy clone function to get a copy of a layered object
	    var copy;
    	// Handle the 3 simple types, and null or undefined
    	if (null == obj || "object" != typeof obj) return obj;
    	// Handle Date
	if (obj instanceof Date) {
		copy = new Date();
	        copy.setTime(obj.getTime());
	        return copy;
	}
	// Handle Array
	if (obj instanceof Array) {
	        copy = [];
	        for (var i = 0, len = obj.length; i < len; i++) {
	            copy[i] = clone(obj[i]);
	        }
	        return copy;
	}
	// Handle Object
	if (obj instanceof Object) {
		copy = {};
	        for (var attr in obj) {
	            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
	        }
	        return copy;
	}
    throw new Error("Unable to copy obj! Its type isn't supported.");
}
function save(){ //Save the game in local storage
  	localStorage.setItem("geometryIdleSave",JSON.stringify(saveToString(player)));
	//Right here is just some code that allows a popup message when the game saves.
  	//document.getElementById("savedInfo").style.display="inline";
  	//function foo() {document.getElementById("savedInfo").style.display="none"}
  	//setTimeout(foo, 2000);
}
function load() { //Get the game from local storage if possible
  	if (localStorage.getItem("geometryIdleSave") == null) {
		player = getDefaultSave();
  	}
	else {	
  		var save = JSON.parse(localStorage.getItem("geometryIdleSave"));
    		player = stringToSave(save, getDefaultSave());
	}
  	return player;
}
function saveToString(save) { //Convert each Decimal to a string for easy JSON stringification
	var copy = clone(save);
	var keySet = Object.keys(save);
	for (var i = 0; i < keySet.length; i++){
		if(save[keySet[i]] instanceof Decimal) {
			copy[keySet[i]] = Decimal.toString(save[keySet[i]]);
		}
		else if(Object.keys(copy[keySet[i]]).length > 1) {
			copy[keySet[i]] = saveToString(copy[keySet[i]]);
		}
	}
	return copy;
}
function stringToSave(newSave, base) { //Compares a JSON stringify value to the default save.
	var keySet = Object.keys(base);
	for (var i = 0; i < keySet.length; i++){
		if(!newSave.hasOwnProperty(keySet[i])) { //If the default save has a value not present in the player save
			newSave[keySet[i]] = base[keySet[i]]; //aka, if something was added to the game,
		}					// it is added to the player save with default values.
		else {
			if(base[keySet[i]] instanceof Decimal) { //If the default save says a value should be a Decimal object
				newSave[keySet[i]] = new Decimal(newSave[keySet[i]]); //make a new Decimal with that value
			}
			else if(Object.keys(newSave[keySet[i]]).length > 1) { //If a value is itself an object, recursion!
				newSave[keySet[i]] = stringToSave(newSave[keySet[i]], base[keySet[i]]);
			}
		} //If a value is not supposed to be a Decimal, then it will have converted with JSON.stringify() just fine
	}		//and we don't need to take any further action.
	return newSave;
}
function exportSave() { //Saving something to the clipboard is a Mess.
	var tempInput = document.createElement("input"); //You have to create a new document element
	tempInput.style = "position: absolute; left: -1000px; top: -1000px"; //Say it's out of the window view
	tempInput.value = JSON.stringify(saveToString(player)); //Fill it with the player save file
	document.body.appendChild(tempInput); //Stick the window on the main document
	tempInput.select(); //Select the window
	document.execCommand("copy"); //Stick the contents of said window into the clipboard
	document.body.removeChild(tempInput); //Delete the go-between window
	alert("Save copied to clipboard"); //Tell the player it all worked
}
function importSave() { //Allow the player to import a save file. This is also where "secret codes" will go.
	var imp = prompt("Paste your save file here");
	if(imp==null) alert("That save file doesn't work, sorry.");
	else player = stringToSave(JSON.parse(imp), getDefaultSave());
}
function clearSave() { //Deletes the player save and clears the local storage.
	if (confirm("This is not reversible. Delete your save file?")) {
		localStorage.removeItem("geometryIdleSave");
		player = getDefaultSave();
		save();
		update();
	}
}
