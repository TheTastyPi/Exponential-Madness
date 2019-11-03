
var game = {
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
setInterval(function() {
  game.number = game.number.mul(game.mult.generation[1].root(100));
  for (i = 2; i < game.mult.amount.length; i++) {
    game.mult.amount[i-1] = game.mult.amount[i-1].mul(game.mult.generation[i].root(100));
  };
  game.mult.powerPerBuy = game.mult.powerPerBuy.mul(game.superMult.generation[1].root(100))
  for (i = 2; i < game.superMult.amount.length; i++) {
    game.superMult.amount[i-1] = game.superMult.amount[i-1].mul(game.superMult.generation[i].root(100));
  };
  updateStuff();
}, 50);
setInterval(function() {
  if (player.autoSave == true) {
    saveGame();
  }
}, 60000);
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
