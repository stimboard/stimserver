/*
*   getICS.js 
*   Fetch ics files corresponding to each habilitation code registered in the database,
*   convert ICS to JSON format and write the result in a file in the json/ folder.
*/

var net = require('net');
var mysql = require('mysql');
var fs = require('fs');
var config = require('./config/global.js');
var http = require('http');

function getDateHour(strStplit, beginParam, endParam)
{
    var my_date = '';
    for(i = beginParam; i < endParam; i++)
    {
        my_date += strStplit[i];
    }
    return my_date;
}

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

Object.size = function(arr) 
{
    var size = 0;
    for (var key in arr) 
    {
        if (arr.hasOwnProperty(key)) size++;
    }
    return size;
};

// Connection to the database
var connection = mysql.createConnection({
    host: config.db_host,
    port: config.db_port,
    database: config.db_name,
    user: config.db_user,
    password: config.db_password
});

connection.connect(function(err){
    if(err != null) console.log(err);
}); 
// SQL Request
var sql = 'SELECT code FROM habilitationCode';
connection.query(sql, function(err, rows){
    if(err != null) {
        res.end("Query error: " + err)
    }else{
        funcs = [];
        console.log(rows);
        function getICS(i){
            return function(){
                console.log(rows[i].code);
                console.log('HABILITATION CODE: ' + rows[i].code);
                console.log("GET ICAL URL... [ work in progress ]");
                var options = {
                    host: 'wapps.univ-reunion.fr',
                    path: '/ical/get_diplome_semestre.php?q=' + rows[i].code,
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
                        console.log("Download " + rows[i].code + " RESPONSE: " + res.statusCode);
                        console.log("GET ICS FILE FOR CODE: " + rows[i].code + " ... [ work in progress ]");
                        var date = new Date();
                        var fd = fs.createWriteStream(__dirname + "/tmp/tmpcalendar" + i + '.ics');
                        res.pipe(fd).on('finish', function(){
                            var jsonFeed = icalToJson(__dirname + "/tmp/tmpcalendar" + i + ".ics");
                            fs.writeFile(__dirname + '/json/json_' + rows[i].code + '.json', 
                                jsonFeed, function(err){
                                    if (err) throw err;
                                    console.log('json_' + rows[i].code + ' It\'s saved!');
                                })
                            // console.log(icalToJson(__dirname + "/tmp/tmpcalendar" + i + ".ics"));
                            console.log("Create json for " + rows[i].code);
                        });
                        console.log("Download " + rows[i].code + " DONE");                        
                    });
              });

            }).on('error', function(e) {
              console.log("Got error: " + e.message);
            });
            };
        }
        for(index in rows){
            funcs[index] = getICS(index);    
        }
        for(index in rows){
            funcs[index]();   
        }
    }
});

return 0;
