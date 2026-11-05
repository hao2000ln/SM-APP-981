function RADResults()
{
	this.results;
	this.messages;
}

function run( applicationName, parmNames, parmValues, parmTypes, resultNames )
{
	var ERROR = "####ERROR IN APPLICATION####"
	var rteReturnValue = new SCDatum();
	var rteNames = new SCDatum();
	var rteValues = new SCDatum();
	var argNames = new SCDatum();
	var argVals = new SCDatum();
	
	rteNames.push("name");
	rteNames.push("names"); 
	rteNames.push("values");
	rteNames.push("numbers");
	rteNames.push("description")

	rteValues.push(applicationName);
	rteValues.push(parmNames);
	rteValues.push(parmValues);
	rteValues.push(parmTypes);
	rteValues.push(resultNames);
	
	var rc = system.functions.rtecall("callrad", 
								rteReturnValue, 
								"js.runRad", //RAD app name
								rteNames, 
								rteValues,
								false); //false to run in same thread, true to run in new thread	
			
	var radResults = new RADResults();				
	radResults.results = vars.$smtestresult;
	radResults.messages = vars.$smtestmessages
	if ( radResults.results.length() >0 && radResults.results[0] == ERROR )
	{
		throw new Error("RAD Exception");
	}
	
	return radResults;					
}

function getObject(filename, objectType){
	var argNames = new SCDatum();
	var argVals = new SCDatum();
	var argTypes = new SCDatum();
	var results = new SCDatum();
			
	argNames.setType(8); 
	argVals.setType(8);      
	argTypes.setType(8);
	results.setType(8);

	argNames.push("name");  //object name
	argVals.push(filename);
	argTypes.push(2);

	argNames.push("condition"); //special object type
	argVals.push(objectType);
	argTypes.push(2);
	
	argNames.push("file");
	argVals.push(null);
	argTypes.push(6);
			
	argNames.push("second.record");
	argVals.push(null);
	argTypes.push(6);

	argNames.push("boolean1");  //background?
	argVals.push(true);
	argTypes.push(4);
	
	argNames.push("cond.input");  //background?
	argVals.push(null);
	argTypes.push(4);

	results.push("file");  //object file
	results.push("second.record");  //env file
	results.push("cond.input");  //authorized?
	
	var ret;	
	system.functions.rtecall("msgonoff", ret, 1);
	var radResults = lib.RAD.run("se.get.object", argNames, argVals, argTypes, results);
	system.functions.rtecall("msgonoff", ret, 0);
		
	return {object: system.functions.val(radResults.results[0], 6),
			 env: system.functions.val(radResults.results[1], 6),
			 authorized: system.functions.val(radResults.results[2], 4)}
}

