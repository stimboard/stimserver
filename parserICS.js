var fs = require('fs');

function parseICS(ical_file){
	var results 			= [];	

	        var data = fs.readFileSync(ical_file);

		var text 				= data.toString();

		var SplitEvents			= text.split('BEGIN:VEVENT');

		var lines 				= '';

		var parts 				= '';

		var attribute 			= '';

		var value 				= ''; 

		var part_start 			= '';

		var part_end			= '';

		var start_date_hour 	= '';

		var end_date_hour		= '';



		for(var i = 0; i < SplitEvents.length ; i++)
		{
			SplitEvent = SplitEvents[i];

			var eventCalendar	= 
			{
				allDay				: false,
				editable			: false,
				startEditable 		: false,
				durationEditable 	: false,
				color				: '#0033FF',
				backgroundColor		: '#FFFFFF',
				borderColor			: '#000000',
				textColor			: '#FFFFFF'

			};

			lines = SplitEvent.split('\n');
			for(var j = 0; j < lines.length ; j ++)
			{
				line = lines[j];				

				parts 		= line.split(':');
				attribute 	= parts[0];
				value 		= parts[1];

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
						part_start 		= parts[1].split("");
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
						part_start 		= parts[1].split("");
						end_date_hour 	= getDateHour(part_start,0,4);
						end_date_hour 	+= '-' + getDateHour(part_start,4,6);
						end_date_hour 	+= '-' + getDateHour(part_start,6,9);
						end_date_hour 	+= getDateHour(part_start,9,11);
						end_date_hour 	+= ':' + getDateHour(part_start,11,13);
						end_date_hour 	+= ':' + getDateHour(part_start,13,15);
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

function getDateHour(strStplit, beginParam, endParam)
{
	var my_date = '';
	for(i = beginParam; i < endParam; i++)
	{
		my_date += strStplit[i];
	}
	return my_date;
}

		
// console.log(results);
console.log(parseICS('calendar.ics'));
