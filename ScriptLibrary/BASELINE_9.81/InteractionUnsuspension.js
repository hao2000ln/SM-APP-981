function unsuspendinteraction(kid, oldstatus){
	
	var sd= new SCFile("incidents");
	var query="incident.id=\""+kid +"\" and open=\"Suspended\"";
	var rc = sd.doSelect(query);
	if ( rc == RC_SUCCESS )	{
		sd.open=oldstatus;
		sd.doUpdate();
		print(sd);
		var activity=new SCFile("activityservicemgt");
		activity.datestamp=new Date();
		activity.type=system.functions.scmsg( 21, "sdInteraction");
		activity.operator="Background";
		activity.description[0]=system.functions.scmsg( 22, "sdInteraction");
		activity.number=kid;
		activity.doInsert();
		
		
		//send notification
		
		var rteReturnValue = new SCDatum();
  		var rteNames = new SCDatum();
  		var rteVals = new SCDatum();
	  	rteNames.setType(8); //type array
	    rteNames.push("file");        //Notification Name - INTO.NAME
	    rteNames.push("name");      //Current File - INTO.FILE
	    rteVals.setType(8);
	    rteVals.push(sd); // Interaction Record
	    rteVals.push("sd.notification.unSuspended");	//RuleSet Name
  
	    system.functions.rtecall("callrad",rteReturnValue,"Ruleset.run",rteNames,rteVals,false); //false to run in the same thread, true to run in new one.  
  	
	}
}

