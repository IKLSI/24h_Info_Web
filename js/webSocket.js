const wsUrl = 'wss://24hweb.iutv.univ-paris13.fr/server';
const socket = new WebSocket(wsUrl);

socket.addEventListener('open', function (event) {
	console.log('WebSocket is open now.');
	socket.send(JSON.stringify({ action: "register",teamPassword: 'wQwJPoMI8v', teamPlayerNb: 8 }));
});

socket.addEventListener('message', function (event) {
	console.log('Message from server:', event.data);
});

socket.addEventListener('close', function (event) {
	console.log('WebSocket is closed now.');
});

socket.addEventListener('error', function (event) {
	console.error('WebSocket error:', event);
});