// alert('hello');

var ws = new WebSocket('ws://172.18.139.30:8888');

ws.onmessage = function(e){
	var message = JSON.parse(e.data);
	var element = document.createElement('div');
	element.innerText = message;
	document.body.appendChild(element);


	console.log('something from server received: ' + message);


	if (message.message === 'start') {
		var time = message.time;
		setInterval(function() {
			var element = document.createElement('div');
			element.innerText = time;
			document.body.appendChild(element);
			time = time - 100;
		}, 100)
	}
}

