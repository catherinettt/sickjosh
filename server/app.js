var express = require('express');
var http = require('http');
var WebSocketServer = require('ws').Server;
var constants = require('./constants');
var app = express();
var _ = require('underscore');
var Game = require('./game');

app.use(express.static('public'));
app.get('/', function (req, res) {
  res.render('index');
});

var server = http.createServer(app).listen(constants.PORT);
var wss = new WebSocketServer({server: server});
var game = new Game(wss);

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    var data = JSON.parse(message);
    switch (data.type) {
      case 'register': 
        var playerData = {
          playerName: data.playerName, 
          ready: false,
          zombie: false
        }
        game.setPlayerData(playerData);
        break;
      case 'ready': 
        var playerData = {
          playerName: data.playerName,
          ready: data.ready,
          zombie: false
        }
        game.setPlayerData(playerData);
        break;
      case 'chat': 
        if (game.registeredPlayers[data.playerName]) {
          game.broadcast({
            type: 'chat',
            playerName: data.playerName,
            zombie: game.registeredPlayers[data.playerName].zombie,
            text: data.text
          });
        }
        break;
      defaut: 
        break;
    }
  });
 
  ws.on('close', function(){
  	console.log('close!!!');
  })
});

