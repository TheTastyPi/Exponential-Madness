function getInitPlayer() {
  var player = {
    autoSave: true,
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
  game.number = game.number.mul(game.mult.amount[1].root(20));
  game.mult.amount[1] = game.mult.amount[1].mul(game.mult.amount[2].root(20));
  game.mult.amount[2] = game.mult.amount[2].mul(game.mult.amount[3].root(20));
  game.mult.amount[3] = game.mult.amount[3].mul(game.mult.amount[4].root(20));
  updateStuff();
}, 50);
setInterval(function() {
  if (player.autoSave == true) {
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
let saveName = "expMadnessSave"
let initPlayerFunctionName = "getInitPlayer"
let playerVarName = "game"

function onImportError() {
    alert("Error: Imported save is in invalid format, please make sure you've copied the save correctly and isn't just typing gibberish.")
}

function onLoadError() {
    alert("I think you got your save messed up so bad we can't load it, the save have been exported automatically to your clipboard for debug purpose, please send it to the developer(Nyan cat) to see what's wrong!")
    copyStringToClipboard(save)
}

function onImportSuccess() {
    alert("Save imported successfully.")
}
// Only change things above to fit your game UNLESS you know what you're doing

Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};

function saveGame() {
  localStorage.setItem(saveName,btoa(JSON.stringify(window[playerVarName])))
}

function loadGame(save,imported=false) {
  let reference = window[initPlayerFunctionName]()
  try {
    save = JSON.parse(atob(save))
  } catch(err) {
    if (imported) {
      onImportError()
      return
    } else {
      onLoadError()
      return
    }
  }
  let temp = listItems(reference)
  let decimalList = temp[0]
  let itemList = temp[1]
  let missingItem = itemList.diff(listItems(save)[1])
  if (missingItem.includes("save")) {
      console.log("Unrecoverable corrupted save detected, loading default save...")
      return
  }
  if (missingItem.length != 0 && imported) {
    if (!confirm("Your imported save seems to be missing some values, which means importing this save might be destructive, if you have made a backup of your current save and are sure about importing this save please press OK, if not, press cancel and the save will not be imported.")) {
      return
    }
  }
  missingItem.forEach(function(value) {
    eval(`save.${value} = reference.${value}`) // No one will exploit their browser with localStorage right
  })
  
  decimalList.forEach(function(value) {
    eval(`save.${value} = new Decimal(save.${value})`)
  })
  
  window[playerVarName] = save
  if (imported) onImportSuccess()
}

function listItems(data,nestIndex="") {
  let decimalList = []
  let itemList = []
  Object.keys(data).forEach(function (index) {
    let value = data[index]
    itemList.push(nestIndex + (nestIndex===""?"":".") + index)
    if (typeof value == 'object') {
      if (value instanceof Decimal) {
        decimalList.push(nestIndex + (nestIndex===""?"":".") + index)
      } else {
        let temp = listItems(value, nestIndex + (nestIndex===""?"":".") + index)
        decimalList = decimalList.concat(temp[0])
        itemList = itemList.concat(temp[1])
      }
    }
  });
  return [decimalList,itemList]
};
