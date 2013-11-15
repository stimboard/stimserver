var net = require('net');
var mysql = require('mysql');
var fs = require('fs');
var config = require('./config/global.js');

Object.size = function(arr) 
{
    var size = 0;
    for (var key in arr) 
    {
        if (arr.hasOwnProperty(key)) size++;
    }
    return size;
};


var sockets = {};

// Connection to the database
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    database: 'stimboard',
    user:'root',
    password:'root'
});

// Create a server instance, and chain the listen function to it
// The function passed to net.createServer() becomes the event handler for the 'connection' event
// The socket object the callback function receives UNIQUE for each connection
var server = net.createServer(function(socket) {
    var id = socket.remoteAddress + ':' + socket.remotePort;
    sockets[id] = socket;
    console.log('NUMBER OF USERS CONNECTED: ' + Object.size(sockets));
    socket.setEncoding("utf-8");
    
    // Send a data on the socket
    var sendData = function(data){
        socket.write(data + '\n', 'UTF-8', function(){
            console.log("DATA SENDED: " + data);
        });    
    };

    // We have a connection - a socket object is assigned to the connection automatically
    console.log('CONNECTION: ' + id);
    
    // Add a 'data' event handler to t his instance of socket
    socket.on('data', function(data) { 
        console.log("Receiving message from " + id);
        console.log("DATA BRUT : " + data + ' length: ' + data.length);
        data = JSON.parse(data.trim());
        console.log("RESULT : " + data.id.stnb);

        // SQL Request
        var sql = 'SELECT * FROM ?? WHERE ?? = ?';
        var inserts = ['students', 'stdnum', data.id.stnb];
        sql = connection.format(sql, inserts);
        
        connection.connect(function(err){
            if(err != null) res.end("Connection error: " + err);
        });

        connection.query(sql, function(err, rows){
            if(err != null) {
                res.end("Query error: " + err)
            }else{
                console.log(config.habilitationCode[rows[0].level]);
                sendData(config.habilitationCode[rows[0].level]);
            }
        });
    });
    
    // Add a 'close' event handler to this instance of socket
    socket.on('close', function() { 
        delete(sockets[id]);
        console.log(Object.size(sockets));
        console.log('CLOSED: ' + id);
        console.log('NUMBER OF USERS CONNECTED: ' + Object.size(sockets));
    });   

}).listen(config.app["port"]);

address = server.address();
address = address.address;
console.log("Server listening on " + address );