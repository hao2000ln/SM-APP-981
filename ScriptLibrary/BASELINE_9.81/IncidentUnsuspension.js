function unsuspendincident(kid, oldstatus){

	var im= new SCFile("probsummary");
	var query="number=\""+kid +"\" and problem.status=\"Suspended\"";
	var rc = im.doSelect(query);
	if ( rc == RC_SUCCESS )	{
		im.problem_status=oldstatus;
		im.doUpdate();
	
		
		var activity=new SCFile("activity");
		activity.datestamp=new Date();
		activity.type=system.functions.scmsg( 11, "imIncident");
		activity.description[0]=system.functions.scmsg(12,"imIncident");
		activity.description[1]=system.functions.scmsg(13,"imIncident");
		activity.number=kid;
		activity.doInsert();

  
  
  
	
		//send notification
		var rteReturnValue = new SCDatum();
  		var rteNames = new SCDatum();
  		var rteVals = new SCDatum();
	  	rteNames.setType(8); //type array
	    rteNames.push("file");      //Current File   
	    rteNames.push("name");      //RuleSet Name 
	    rteVals.setType(8);
	    rteVals.push(im); // Incident Record
	    rteVals.push("im.unsuspend.notification");	//RuleSet Name
  
	    system.functions.rtecall("callrad",rteReturnValue,"Ruleset.run",rteNames,rteVals,false); //false to run in the same thread, true to run in new one.  
  	}
}

