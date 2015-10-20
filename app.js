var express = require('express');
var http = require('http');
var WebSocketServer = require('ws').Server;

var PORT = 8888;

var app = express();

var _ = require('underscore');

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.render('index');
});

// app.listen(PORT);

var server = http.createServer(app).listen(PORT);

var wss = new WebSocketServer({server: server});

var registeredPlayers = {};

var broadcast = function (data){
  wss.clients.forEach(function each(client) {
    client.send(JSON.stringify(data));
  });
}

var getReadyCount = function() {
  return _.size(_.filter(registeredPlayers, function(player) {
    return player.ready
  }));
}

var setPlayerData = function(playerData) {
  registeredPlayers[playerData.playerName] = playerData;
  console.log(registeredPlayers);
  broadcast({
    type: 'readyState',
    registeredNumber: _.size(registeredPlayers),
    readyNumber: getReadyCount(), 
    registeredPlayers: registeredPlayers
  })
}

wss.on('connection', function connection(ws) {
	console.log('on connection!');

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
        setPlayerData(playerData);
        break;
      case 'ready': 
        var playerData = {
          playerName: data.playerName,
          ready: data.ready,
          zombie: false
        }
        setPlayerData(playerData);
        break;
      case 'chat': 
        if (registeredPlayers[data.playerName]) {
          broadcast({
            type: 'chat',
            playerName: data.playerName,
            zombie: registeredPlayers[data.playerName].zombie,
            text: data.text
          });
        }
        break;
      defaut: 
        break;
    }
  });
 
  ws.send(JSON.stringify({message: 'something from server'}));

  ws.on('close', function(){
  	console.log('close!!!');
  })
});

