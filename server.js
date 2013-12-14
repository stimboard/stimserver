var net = require('net');
var mysql = require('mysql');
var fs = require('fs');
var config = require('./config/global.js');
var http = require('http');


// Return the size of a Javascript object
Object.size = function(arr) 
{
    var size = 0;
    for (var key in arr) 
    {
        if (arr.hasOwnProperty(key)) size++;
    }
    return size;
};

// TODO: describe this function
function getDateHour(strStplit, beginParam, endParam)
{
    var my_date = '';
    for(i = beginParam; i < endParam; i++)
    {
        my_date += strStplit[i];
    }
    return my_date;
}

// Parse the ics file and convert it in JSON format
function icalToJson(ical_file){    
        var results             = [];   
        var data = fs.readFileSync(ical_file);
        var text                = data.toString();
        var SplitEvents         = text.split('BEGIN:VEVENT');
        var lines               = '';
        var parts               = '';
        var attribute           = '';
        var value               = ''; 
        var part_start          = '';
        var part_end            = '';
        var start_date_hour     = '';
        var end_date_hour       = '';

        for(var i = 0; i < SplitEvents.length ; i++)
        {
            SplitEvent = SplitEvents[i];
            var eventCalendar   = 
            {
                allDay              : false,
                editable            : false,
                startEditable       : false,
                durationEditable    : false,
                color               : '#0033FF',
                backgroundColor     : '#FFFFFF',
                borderColor         : '#000000',
                textColor           : '#FFFFFF'

            };
            lines = SplitEvent.split('\n');
            for(var j = 0; j < lines.length ; j ++)
            {
                line = lines[j];                

                parts       = line.split(':');
                attribute   = parts[0];
                value       = parts[1];

                switch(parts[0])
                {
                    case 'UID':
                        eventCalendar.id = parts[1].toString().trim();
                        break;
                    case 'SUMMARY':
                        if(parts[2] != undefined)
                        {
                            eventCalendar.title = parts[1].toString().trim() + parts[2].toString().trim();
                        }else
                        {
                            parts[2] = "salle indéterminée...";
                            eventCalendar.title = parts[1].toString().trim() + parts[2].toString().trim();
                        }
                        break;
                    case 'DTSTART;VALUE=DATE-TIME':
                        part_start      = parts[1].split("");
                        start_date_hour = getDateHour(part_start,0,4);
                        start_date_hour += '-' + getDateHour(part_start,4,6);
                        start_date_hour += '-' + getDateHour(part_start,6,9);
                        start_date_hour += getDateHour(part_start,9,11);
                        start_date_hour += ':' + getDateHour(part_start,11,13);
                        start_date_hour += ':' + getDateHour(part_start,13,15);
                        //console.log(start_date_hour);
                        eventCalendar.start = start_date_hour.toString().trim();
                        break;
                    case 'DTEND;VALUE=DATE-TIME':
                        part_start      = parts[1].split("");
                        end_date_hour   = getDateHour(part_start,0,4);
                        end_date_hour   += '-' + getDateHour(part_start,4,6);
                        end_date_hour   += '-' + getDateHour(part_start,6,9);
                        end_date_hour   += getDateHour(part_start,9,11);
                        end_date_hour   += ':' + getDateHour(part_start,11,13);
                        end_date_hour   += ':' + getDateHour(part_start,13,15);
                        //console.log(end_date_hour);
                        eventCalendar.end = end_date_hour.toString().trim();
                        break;
                    case 'END':
                        results.push(eventCalendar);
                        break;
                }
            
            }
            
        }
    return JSON.stringify(results);
}

function feeding(i){
    return function(){
        
    };
}

// List of sockets connected 
var sockets = {};

// Connection to the database
var connection = mysql.createConnection({
    host: config.db_host,
    port: config.db_port,
    database: config.db_name,
    user: config.db_user,
    password: config.db_password
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
            console.log("DATA SENDED: ");
        });
    };

    // We have a connection - a socket object is assigned to the connection automatically
    console.log('CONNECTION: ' + id);
    
    // Add a 'data' event handler to this instance of socket
    socket.on('data', function(data) { 
        // Start a connection to the database
        connection.connect(function(err){
            if(err != null) console.log(err);
        }); 
        // Request the user habilitation code.
        var sql = 'SELECT habilitationCode.code FROM habilitationCode, students WHERE students.stdnum=? AND students.habilitationCode=habilitationCode.id';
        connection.query(sql, [data], function(err, rows){
            if(err != null) {
                res.end("Query error: " + err)
            }else{
                console.log(rows[0].code);
                console.log('HABILITATION CODE: ' + rows[0].code);
                console.log("GET ICAL URL... [ work in progress ]");
                var options = {
                    host: 'wapps.univ-reunion.fr',
                    path: '/ical/get_diplome_semestre.php?q=' + rows[0].code,
                    port: 80
                };
                http.get(options, function(res) {
                    console.log("RESPONSE: " + res.statusCode);
                    res.on('data', function(chunk){
                        var urlMatched = chunk.toString().match(/(<a href=)(.*?)(>)/);
                        urlIcal = urlMatched[2];
                        urlIcal = urlIcal.split('/ical/')[1];
                        console.log(urlIcal);
                        var optionDownload = {
                                host : 'wapps.univ-reunion.fr',
                                path : '/ical/' + urlIcal,
                                port:80
                        };
                        http.get(optionDownload, function(res) {
                            console.log("Download " + rows[0].code + " RESPONSE: " + res.statusCode);
                            console.log("GET ICS FILE FOR CODE: " + rows[0].code + " ... [ work in progress ]");
                            var date = new Date();
                            var fd = fs.createWriteStream(__dirname + "/tmp/tmpcalendar.ics");
                            res.pipe(fd).on('finish', function(){
                                var jsonFeed = icalToJson(__dirname + "/tmp/tmpcalendar.ics");
                                console.log("Sending data ...");
                                sendData(jsonFeed);
                            });
                        });
                    });
                }).on('error', function(e) {
                  console.log("Got error: " + e.message);
                });
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

