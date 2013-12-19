/*
*	Test client for tested the server
*/

var net = require('net');

// Server Connection information
var HOST = 'localhost';
var PORT = 6969;

// Create a new TCP socket
var client = new net.Socket();

// Connection to the server socket 
client.connect(PORT, HOST, function() {
	console.log('CONNECTED TO: ' + HOST + ':' + PORT);
	
	// Write a message to the socket as soon as the client is connected, the server will receive it as message from the client 
	client.write('29000628', 'UTF-8', function(){
		console.log("Data has been sended ...");
	});
});

// Add a 'data' event handler for the client socket
// data is what the server sent to this socket
client.on('data', function(data) {
	console.log('DATA: ' + data);
});

// Add a 'close' event handler for the client socket
client.on('close', function() {
	console.log('Connection closed');
});

// Error handler
client.on('error',function(){
    console.log("%j", arguments);
});