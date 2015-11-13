var host = window.document.location.host.replace(/:.*/, '');
var ws = new WebSocket('ws://' + host + ':8888');

// ws.onopen = function(){
// 	if (!ws.pingPong) {
// 		ws.pingPong = setInterval(() => {
// 			ws.send(JSON.stringify({
// 				type: 'ping'
// 			}))
// 		}, 1000);
// 	};
// };

ws.onerror = function() {
	if (ws.statusReceiver) {
		ws.statusReceiver({
			type: 'status',
			status: false
		});
	}
}

ws.onclose = function() {
	if (ws.statusReceiver) {
		ws.statusReceiver({
			type: 'status',
			status: false
		});
	}
}

ws.onmessage = function(e){
	var message = JSON.parse(e.data);
	console.log('ws.onmessage: '+JSON.stringify(message));
	if (message.type) {
		var func = message.type + 'Receiver'; // chatReceiver;
		if (ws[func]) {
			ws[func](message);
		}

		//pass more things to admin && game status
		if (ws.adminReceiver && func !== 'adminReceiver') {
			ws.adminReceiver(message);
		}
		if (ws.gameReceiver && func !== 'gameReceiver') {
			ws.gameReceiver(message);
		}
		if (ws.zombieStateReceiver && func !== 'zombieStateReceiver') {
			ws.zombieStateReceiver(message);
		}

		if (message.type === 'playerUpdate') {
			if (ws.adminReceiver) ws.adminReceiver(message);
			if (ws.readyStateReceiver) ws.readyStateReceiver(message);
		}

		if (message.type === 'updateObjective' && message.type === 'endGame') {
			if (ws.gameReceiver) ws.gameReceiver(message);
		}
	}
}

ws.statusPing = function(){
	var message = {
		type: 'status',
		time: new Date().getTime()
	}
	ws.send(JSON.stringify(message));
}

ws.registerPlayer = function(){
	var user = Parse.User.current();
	if (!user) return;
	var message = {
		type: 'register',
		playerName: user.getUsername()
	}
	ws.send(JSON.stringify(message));
}

ws.readyPlayer = function(ready) {
	var user = Parse.User.current();
	if (!user) return;
	var message = {
		type: 'ready',
		ready: ready,
		playerName: user.getUsername()
	}
	ws.send(JSON.stringify(message));
}

ws.updatePlayer = function(fields) {
	var user = Parse.User.current();
	if (!user) return;
	var message = {
		type: 'update',
		fields: fields,
		playerName: user.getUsername()
	}
	ws.send(JSON.stringify(message));
}

ws.startGame = function() {
	var message = {
		type: 'startGame'
	};
	ws.send(JSON.stringify(message));
}

ws.playerInfected = function() {
	var user = Parse.User.current();
	if (!user) return;
	var name = user.getUsername();
	console.log(name+" infected");
	var message = {
		type: 'infected',
		playerName: name
	};

	ws.send(JSON.stringify(message));
}

ws.sendChat = function(text) {
	var user = Parse.User.current();
	if (!user) return;
	var message = {
		type: 'chat',
		text: text,
		playerName: user.getUsername()
	}
	ws.send(JSON.stringify(message));
}

ws.unregisterPlayer = function(playerName) {
	var message = {
		type: 'unregister',
		playerName: playerName
	}
	ws.send(JSON.stringify(message));
}

ws.submitPIN = function (data) {
	var user = Parse.User.current();
	var message = {
		type: 'pinEntry',
		playerName: user.getUsername(),
		data: data
	};
	ws.send(JSON.stringify(message));
};

ws.objectiveUpdate = function () {
	var message = {
		type: 'updateObjective'
	}
	ws.send(JSON.stringify(message));
}

ws.endGame = function(winner) {
	var message = {
		type: 'endGame',
		winner: winner
	}
	ws.send(JSON.stringify(message));
}

module.exports = ws;
