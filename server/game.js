var _ = require('underscore');

var Game = function(wss) {
	this.wss = wss;
	this.registeredPlayers = {};
  this.countdown = 10000;
  this.gameDuration = 3000000;
}

Game.prototype.broadcast = function (data){
  this.wss.clients.forEach(function each(client) {
    client.send(JSON.stringify(data));
  });
}

Game.prototype.getReadyCount = function() {
  return _.size(_.filter(this.registeredPlayers, function(player) {
    return player.ready
  }));
}

Game.prototype.setPlayerData = function(playerData) {
  this.registeredPlayers[playerData.playerName] = playerData;
  this.broadcast({
    type: 'readyState',
    registeredNumber: _.size(this.registeredPlayers),
    readyNumber: this.getReadyCount(), 
    registeredPlayers: this.registeredPlayers
  })
}

Game.prototype.updatePlayerData = function(data){
  var self = this;
  // data = {playerName: 'abc', fields: {zombie: true}};
  _.each(data.fields, function(value, key) {
    if (self.registeredPlayers[data.playerName]) {
      self.registeredPlayers[data.playerName][key] = value;
    }
  });

  this.broadcast({
    type: 'gameState',
    registeredNumber: _.size(this.registeredPlayers),
    readyNumber: this.getReadyCount(), 
    registeredPlayers: this.registeredPlayers
  })
}

Game.prototype.removePlayerData = function(playerName) {
  if (this.registeredPlayers[playerName]) {
    delete this.registeredPlayers[playerName];
  }
  this.broadcast({
    type: 'readyState',
    registeredNumber: _.size(this.registeredPlayers),
    readyNumber: this.getReadyCount(), 
    registeredPlayers: this.registeredPlayers
  })
}

Game.prototype.setInitialZombies = function(initialNumberOfZombies) {
  if (_.isUndefined(initialNumberOfZombies) || !_.isNumber(initialNumberOfZombies)) {
    initialNumberOfZombies = 1;
  }

  var playerNames = _.keys(this.registeredPlayers);
  while(initialNumberOfZombies > 0) {
    var randomZombie = Math.floor(Math.random() * playerNames.length);
    if (!this.registeredPlayers[playerNames[randomZombie]].zombie) {
      this.registeredPlayers[playerNames[randomZombie]].zombie = true;
      initialNumberOfZombies--;
    }
  }

  this.broadcast({
    type: 'start',
    players: this.registeredPlayers
  });
}

Game.prototype.resetSurvivors = function() {
  for(var player in this.registeredPlayers) {
      player.zombie = false;
  }
}

Game.prototype.shouldStartGame = function () {
  var readyPlayers = this.getReadyCount();
  return readyPlayers === _.size(this.registeredPlayers);
}

Game.prototype.startCountdown = function () {
  this.broadcast({
    type: 'startCountdown',
    time: this.countdown
  });

  setTimeout(function () {
    this.setInitialZombies();
  }.bind(this), this.countdown);
}

module.exports = Game;