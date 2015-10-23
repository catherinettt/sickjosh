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
	if (message.type) {
		var func = message.type + 'Receiver'; // chatReceiver;
		if (ws[func]) {
			ws[func](message);
		}

		//pass more things to admin
		if (message.type === 'status') {
			if (ws.adminReceiver) {
				ws.adminReceiver(message);
			}
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
module.exports = ws;
