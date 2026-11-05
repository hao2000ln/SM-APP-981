function setPriority( problem )
{
	var urgency;
	var impact;
	var futureImpact;
	
	var priority = 3;
	
	if ( problem.severity != null && problem.severity != "" )
	  	urgency = parseInt(problem.severity) ;
	if ( urgency == null )
	 	urgency = 3;
	if ( problem.initial_impact != null && problem.initial_impact != "" )
	  	impact = parseInt(problem.initial_impact);
	if ( impact == null )
	 	impact = 3;
	 if ( problem.future_impact != null && problem.future_impact != "" )
	  	futureImpact = parseInt(problem.future_impact);
	if ( impact == null )
	 	futureImpact = 3;
	 
	priority = Math.round(( urgency + impact + futureImpact ) / 3);
	
	if ( problem.incident_count > 10 )
	  priority++;
	
	if ( priority > 5 )
	  priority = 5;
	
	problem.priority_code = priority.toString();
	
}




