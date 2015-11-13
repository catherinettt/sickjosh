var express = require('express');
var http = require('http');
var WebSocketServer = require('ws').Server;
var constants = require('./constants');
var app = express();
var _ = require('underscore');
var Game = require('./game');

var Parse = require('parse/node');
Parse.initialize("7G1t2t49i4pEZtkh7b8KfMUgqxCtJr4uS1YrP1gU", "HVYShhVkTZkj3eQJnN1ExJgEnxyyS8syiT89X5bP");

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
      case 'status':
        ws.send(JSON.stringify({
          type: 'status',
          status: 'good',
          registeredPlayers: game.registeredPlayers
        }));
        break;
      case 'update':
        // data.fields: {zombie: true}
        if (data.fields && data.playerName) {
          game.updatePlayerData(data);
        }
      case 'register':
        var playerData = {
          playerName: data.playerName,
          ready: false,
          zombie: false
        };
        game.setPlayerData(playerData);
        break;
      case 'unregister':
        game.removePlayerData(data.playerName);
        break;
      case 'ready':
        var data = {
          playerName: data.playerName,
          fields: {
            ready: data.ready
          }
        };
        game.updatePlayerData(data);
        break;
      case 'startGame':
        console.log('Received startGame message.');
        game.startCountdown(data.zombieCount);
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
      case 'setObjective':
        game.broadcast({
          type: 'updateObjective'
        });
        break;
      case 'updateObjective':
        game.broadcast({
          type: 'updateObjective'
        });
        break;
      case 'infected':
        console.log(data);
        var updatePayload = {
          playerName: data.playerName,
          fields: {
            zombie: true
          }
        };
        game.registerParseZombie(data.playerName);
        game.updatePlayerData(updatePayload);
        break;
      case 'endGame': 
        var Game = Parse.Object.extend("Game");
        var query = new Parse.Query(Game);
        query.first().then(function(game) {
          if (game) {
            game.set('inProgress', false);
            game.save();
          }
        });
        game.broadcast({
          type: 'endGame',
          winner: data.winner || 'human'
        });
        break;
      default:
        break;
    }
  });

  ws.on('close', function () {
    console.log('close!!!');
  })
});
