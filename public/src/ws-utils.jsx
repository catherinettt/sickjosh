var host = window.document.location.host.replace(/:.*/, '');
var ws = new WebSocket('ws://' + host + ':8888');

ws.onmessage = function(e){
	var message = JSON.parse(e.data);
	if (message.type) {
		var func = message.type + 'Receiver'; // chatReceiver;
		if (ws[func]) {
			ws[func](message);
		}
	}
}

ws.registerPlayer = function(){
	var user = Parse.User.current();
	if (!user) return;
	var message = {
		type: 'register',
		playerName: user.getUsername()
	}
	setTimeout(function(){
		ws.send(JSON.stringify(message));
	}, 500);
}

ws.readyPlayer = function(ready) {
	var user = Parse.User.current();
	if (!user) return;
	var message = {
		type: 'ready',
		ready: ready,
		playerName: user.getUsername()
	}
	setTimeout(function(){
		ws.send(JSON.stringify(message));
	}, 500);
}

ws.sendChat = function(text) {
	var user = Parse.User.current();
	if (!user) return;
	var message = {
		type: 'chat',
		text: text,
		playerName: user.getUsername()
	}
	setTimeout(function(){
		ws.send(JSON.stringify(message));
	}, 500);
}

module.exports = ws;
