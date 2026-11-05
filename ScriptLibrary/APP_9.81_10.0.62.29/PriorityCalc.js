/**
*  	This function is used to generate the priority.code value from 
*	the initial impact, and the urgency.  This can be used by any 
*	module that has "priority.code", "initial.impact" and "severity" fields in the 
*	dbdict file.  
*	
*
*  @return  A boolean value representation of sucess or failure.
*  @type Boolean
*/


function getPriorityCalc()
{
  if ((vars.$L_file==null) || (vars.$L_file.initial_impact==null) || (vars.$L_file.severity==null) )
  {
    return false;
  }
	
  var iX = parseInt(vars.$L_file.initial_impact);
  var iY = parseInt(vars.$L_file.severity);

  if ((iX!=null) && (iY!=null))
  {
    var priority = Math.floor(((iX+iY)/2));
    vars.$L_file.priority_code=priority.toString();
  }
	
  return true;		
}
