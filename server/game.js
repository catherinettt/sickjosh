var _ = require('underscore');
var Parse = require('parse/node');

var Game = function(wss) {
	this.wss = wss;
	this.registeredPlayers = {};
  this.countdown = 10000;
  this.gameDuration = 3000000;
  this.timers = {};
}

Game.prototype.broadcast = function (data){
  this.wss.clients.forEach(function each(client) {
    client.send(JSON.stringify(data));
  });
}

Game.prototype.broadcastPlayerUpdate = function () {
  this.broadcast({
    'type': 'playerUpdate',
    'players': this.registeredPlayers
  });
}

Game.prototype.getReadyCount = function() {
  return _.size(_.filter(this.registeredPlayers, function(player) {
    return player.ready
  }));
}

Game.prototype.setPlayerData = function(playerData) {
  if (playerData.playerName !== 'ADMIN') {
      this.registeredPlayers[playerData.playerName] = playerData;
      this.broadcastPlayerUpdate(); 
    }
  }

Game.prototype.updatePlayerData = function(data){
  var self = this;
  // data = {playerName: 'abc', fields: {zombie: true}};
  _.each(data.fields, function(value, key) {
    if (self.registeredPlayers[data.playerName]) {
      self.registeredPlayers[data.playerName][key] = value;
    }
  });
  this.broadcastPlayerUpdate();
}

Game.prototype.removePlayerData = function(playerName) {
  if (this.registeredPlayers[playerName]) {
    delete this.registeredPlayers[playerName];
  }
  this.broadcastPlayerUpdate();
}

Game.prototype.setInitialZombies = function(initialNumberOfZombies) {
  if (_.isUndefined(initialNumberOfZombies) || !_.isNumber(initialNumberOfZombies)) {
    initialNumberOfZombies = 1;
  }

  var playerNames = _.keys(this.registeredPlayers);
  while(initialNumberOfZombies > 0) {
    var randomZombie = Math.floor(Math.random() * playerNames.length);
    if (!this.registeredPlayers[playerNames[randomZombie]].zombie && playerNames[randomZombie].toUpperCase() != 'ADMIN') {
      this.registeredPlayers[playerNames[randomZombie]].zombie = true;
      this.registerParseZombie(playerNames[randomZombie]);
      initialNumberOfZombies--;
    }
  }

  this.broadcast({
    type: 'start',
    players: this.registeredPlayers
  });
}

Game.prototype.getParseUser = function(playerName){
  return new Promise(function(resolve, reject) {
    var query = new Parse.Query(Parse.User);
    query.equalTo('username', playerName);
    query.find().then(function(results) {
      if (results.length) {
        resolve(results[0])
      } else {
        reject()
      }
    }, reject);
  });
}

Game.prototype.getZombiePINs = function() {
  return new Promise(function(resolve, reject) {
    var Zombie = Parse.Object.extend("Zombie");
    var query = new Parse.Query(Zombie);
    query.find().then(function(resolve, reject) {
      if (results.length) {
        var pins = [];
        _.each(results, function(z) {
          pins.push(z.get('PIN'))
        })
        resolve(pins);
      } else {
        resolve([]);
      }
    }, reject)
  });
}


Game.prototype.registerParseZombie = function(playerName) {
  this.getParseUser(playerName).then(function(player){ 
    var Zombie = Parse.Object.extend("Zombie");
    var newZombie = new Zombie();
    newZombie.set('user', player);
    var PIN = _.random(1000, 9999);
    newZombie.set('PIN', PIN);
    newZombie.save();
  });
}

Game.prototype.resetSurvivors = function() {
  for(var player in this.registeredPlayers) {
      player.zombie = false;
  }
}

Game.prototype.shouldStartGame = function () {
  var readyPlayers = this.getReadyCount();
  var percentReady = readyPlayers / _.size(this.registeredPlayers);

  // Allow game start if > 50% players ready
  var shouldStart = percentReady >= 0.5;
  return shouldStart;
}

Game.prototype.startCountdown = function () {

  this.toggleTimer('lobbyTimer', null, 'kill');
  this.toggleTimer('lobbyTimer', this.countdown);
  this.setInitialZombies();
}

Game.prototype.toggleTimer = function (timerName, msRemaining, status) {
  console.log('toggle timer: ', timerName, msRemaining, status);
  var self = this;

  if (this.timers[timerName] && status === 'kill') {
    clearInterval(this.timers[timerName].interval);
    this.broadcast({
      type: 'timer',
      timerName: timerName,
      time: 0
    });
  } else {

    this.timers[timerName] = {
      msRemaining: msRemaining
    };
    this.timers[timerName].interval = setInterval(function () {
      if (self.timers[timerName].msRemaining >= 0) {
        self.broadcast({
          type: 'timer',
          timerName: timerName,
          time: self.timers[timerName].msRemaining,
        });
        self.timers[timerName].msRemaining -= 1000;
      } else {
        clearInterval(self.timers[timerName].interval);
      }
    }, 1000);
  }
};


module.exports = Game;
