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

//   	// SQL Request
//   	var sql = 'SELECT * FROM ?? WHERE ?? = ?';
//     var inserts = ['students', 'stdnum', connection.escape(stdnum)];
//     sql = mysql.format(sql, inserts);
  	
//   	connection.connect(function(err){
//   		if(err != null) res.end("Connection error: " + err);
//   	});

//   	connection.query(sql, function(err, rows){
//   		if(err != null) {
//   			res.end("Query error: " + err)
//   		}else{
//   			console.log(rows);
//   		}
//   	});
//   });

// });

// server.listen(8080, function(){
//   console.log("server bound");
// });

var net = require('net');

var HOST = '10.230.130.60';
var PORT = 6969;



// Create a server instance, and chain the listen function to it
// The function passed to net.createServer() becomes the event handler for the 'connection' event
// The socket object the callback function receives UNIQUE for each connection
net.createServer(function(socket) {

    socket.setEncoding("utf-8");
    // Send a data on the socket
    var sendData = function(){
        socket.write(data + '\n', 'UTF-8', function(){
            console.log("Data sended: " + data);
        });    
    };

    var fetchData = function(data){        
        // Parse to delete control characters
        for(var i = 0; i<data.length;i++){
            if (data[i] == '{'){
                data = data.slice(i, data.length);
                break;
            }
        }
        return JSON.parse(data);
    }

    // We have a connection - a socket object is assigned to the connection automatically
    console.log('CONNECTED: ' + socket.remoteAddress +':'+ socket.remotePort);
    
    // Add a 'data' event handler to t his instance of socket
    socket.on('data', function(data) {
        console.log("DATA BRUT : " + data);
        data = fetchData(data);
        console.log("RESULT : " + data);
    });
    
    // Add a 'close' event handler to this instance of socket
    socket.on('close', function() {
        console.log('CLOSED: ' + users[id].remoteAddress + ':' + users[id].remotePort);
        delete users[id];
        console.log(users.length);
    });   

}).listen(PORT, HOST);

console.log('Server listening on ' + HOST +':'+ PORT);