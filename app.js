var express = require('express');
var http = require('http');
var WebSocketServer = require('ws').Server;

var PORT = 8888;

var app = express();

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.render('index');
});

// app.listen(PORT);

var server = http.createServer(app).listen(PORT);

var wss = new WebSocketServer({server: server});

wss.on('connection', function connection(ws) {
	console.log('on connection!');

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    if (message === 'start') {
    	// ws.send('lets start');

    	wss.clients.forEach(function each(client) {
		    client.send(JSON.stringify({'message': 'start', 'time': 5000}));
		  });
    }
  });
 
  ws.send(JSON.stringify({message: 'something from server'}));

  ws.on('close', function(){
  	console.log('close!!!');
  })
});

// app.get('/start', function())
