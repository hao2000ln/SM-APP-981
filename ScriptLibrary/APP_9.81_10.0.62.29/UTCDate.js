/**
 * Utility Function. Takes an XMLDate object and returns a new XMLDate object with the date offset to UTC.
 * @param {XMLDate} Date in the current time zone 
 * @function
 */
function convertToUTC( xmlDateObjet )
{
    var date = xmlDateObjet.getDate();
//    var utcdate = date.getTime() + (date.getTimezoneOffset() * 60000);
    var utcdate = date.getTime();
    return new XMLDate(new Date(utcdate));
}

/**
 jscall for calendar.calc.date
 */
function calcDate(startDate,interval,timezone,duty,holiday){

	var argNames = new SCDatum();
	var argVals = new SCDatum();
	var argTypes = new SCDatum();
	var results = new SCDatum();          
          
    argNames.setType(8); 
	argVals.setType(8);      
	argTypes.setType(8);
	results.setType(8); 
          
    argNames.push("query");     
	argNames.push("times,1"); 
	argNames.push("times,2"); 
	argNames.push("prompt");  
	argNames.push("name");
	argNames.push("times,3");     
			
	argVals.push(holiday);	 	
	argVals.push(startDate);
    argVals.push(interval);            
	argVals.push(duty);
	argVals.push(timezone);
		 
	argTypes.push(2); 
	argTypes.push(3);
	argTypes.push(3);
	argTypes.push(2);
    argTypes.push(2);
    argTypes.push(3);
         	
    results.push("times,3");

	var radResults = lib.RAD.run( "calendar.calc.date", argNames, argVals, argTypes, results );
	return radResults.results[0]; 
}
