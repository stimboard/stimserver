// var tcp = require("net");
// var mysql = require("mysql");
// var fs = require("fs");

// var users = {};

// //connection to the database
// var connection = mysql.createConnection({
// 	host: 'localhost',
// 	port: 3306,
// 	database: 'stimboard',
// 	user:'root',
// 	password:'root'
// });

// var server = tcp.createServer(function (socket) {
  
//   console.log("Server connected");
  
//   socket.on('auth', function(data){
//   	// who's connected? (student number)
//   	var stdnum = data.stdnum;
//   	// stdnum is an int
//   	// stdnum = parseInt(stdnum);

//   });

// });

// server.listen(8080, function(){
//   console.log("server bound");
// });

var net = require('net');
Object.size = function(arr) 
{
    var size = 0;
    for (var key in arr) 
    {
        if (arr.hasOwnProperty(key)) size++;
    }
    return size;
};

var PORT = 6969;
var sockets = {};


// Create a server instance, and chain the listen function to it
// The function passed to net.createServer() becomes the event handler for the 'connection' event
// The socket object the callback function receives UNIQUE for each connection
var server = net.createServer(function(socket) {
    var id = socket.remoteAddress + '' + socket.remotePort;
    sockets[id] = socket;
    console.log(Object.size(sockets));
    socket.setEncoding("utf-8");
    
    // Send a data on the socket
    var sendData = function(){
        socket.write(data + '\n', 'UTF-8', function(){
            console.log("Data sended: " + data);
        });    
    };

    // We have a connection - a socket object is assigned to the connection automatically
    console.log('CONNECTED: ' + id);
    
    // Add a 'data' event handler to t his instance of socket
    socket.on('data', function(data) { 
        console.log("Receiving message ..");
        console.log("DATA BRUT : " + data + ' length: ' + data.length);
        data = JSON.parse(data.trim());
        console.log("RESULT : " + data.id.stnb);
    });
    
    // Add a 'close' event handler to this instance of socket
    socket.on('close', function() {
        delete(sockets[id]);
        console.log(Object.size(sockets));
        console.log('CLOSED: ' + id);
    });   

}).listen(PORT);

address = server.address();
address = address.address;
console.log("Server listening on " + address );