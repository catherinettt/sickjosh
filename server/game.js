var _ = require('underscore');

var Game = function(wss) {
	this.wss = wss;
	this.registeredPlayers = {};
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
  _.each(data.fields, function(value, key) {
    if (self.registeredPlayers[data.playerName]) {
      self.registeredPlayers[data.playerName][key] = value;
    }
  });

  this.broadcast({
    type: 'readyState',
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

module.exports = Game;