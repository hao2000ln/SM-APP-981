var VALID_FALSE="<root><model><instance>false</instance></model></root>";
var VALID_TRUE="<root><model><instance>true</instance></model></root>";

/* Get Left Phases for a change
 * return the doc formatted string to client packaged by instance
 */
function getLeftPhases(changeId)
{
	var startString = "<root><model>";
	var endString = "</model></root>";
	var retstring = startString;
    var leftPhases = getLeftPhasesArray(changeId, null);
	for (var i=0;i<system.functions.lng(leftPhases);i++)
	{
		retstring = retstring + "<instance><fromPhase>" + leftPhases[i] + "</fromPhase></instance>";
	}
	retstring = retstring +  endString;
	return retstring;
}

/* Get Left Phases for a change from fromPhase 
 * return the Phase Array
 */
function getLeftPhasesArray(changeId, fromPhase)
{
	var leftPhases = new Array();
    var change = new SCFile("cm3r");
    var query = "number=\""+ changeId +"\"";
    if (change.doSelect(query)==RC_SUCCESS)
    {
        var phase = change.current_phase;
        if (fromPhase!=null)
        {
        	phase = fromPhase;
        }
        var category = change.category;
        var cmcategory = new SCFile("cm3rcategory");
        var query = "name=\""+ category +"\"";
        if (cmcategory.doSelect(query) == RC_SUCCESS)
        {
              var workflow = cmcategory.workflow;
              getToPhases(workflow,phase,leftPhases);
        }
    }
    return leftPhases;
}

/* Get Left Phases from phaseName in the workflow  
 * return the Phase Array saved in the totalPhases
 */
function getToPhases(workflow, phaseName, totalPhases)
{
      if (phaseName != null && phaseName!="" && !lib.ArrayUtil.contains(totalPhases,phaseName))
      {                       
            var wfPhase = new SCFile("WorkflowPhase");
            var query = "workflowName=\""+ workflow +"\" and phaseName=\""+ phaseName +"\"";
            if (wfPhase.doSelect(query) == RC_SUCCESS)
            {     
                  //only add active phases
                  if(wfPhase.active==true)
                  {
                        totalPhases.push(phaseName);      
                  }
                  //check all the auto tranistion
                  var lng = system.functions.lng(wfPhase.autoTransition);
                  for (var i=0; i < lng;i++)
                  {                       
                        var toPhase = wfPhase.autoTransition[i].atToPhase;
                        getToPhases(workflow, toPhase, totalPhases);
                  }
                  //check all the manual tranistion
                  var lng = system.functions.lng(wfPhase.manualTransition);
                  for (var i=0; i < lng; i++)
                  {                 
                        var toPhase = wfPhase.manualTransition[i].mtToPhase;
                        getToPhases(workflow, toPhase, totalPhases);
                  }                             
            } 
      }
}

/* This function validate the data filled in webitier 
 * js in jsp page will send ajax request to invoke this function 
 * check if endPhase is valid (type is 'changeplan' or ''...)
 * check if change valid for open task editor (type is 'change')
 * the args is a string for params combined with "^^^^^"
 */
function validateEndPhase(args)
{
	var params = args.split("^^^^^");
	var type = params[0];
	var changeId = params[1];
	var startPhase = params[2];
	var endPhase = params[3];
	if (changeId==null || changeId=="")
	{
		return VALID_FALSE;
	}
	if (type=="change")
	{
		var change = new SCFile("cm3r");
	    var query = "number=\""+ changeId +"\"";
	    if (change.doSelect(query)==RC_SUCCESS)
	    {
	        if (change.open==null || change.open==false)
	        {
	        	return VALID_FALSE;
	        }
	        else 
	        {
	        	return VALID_TRUE;
	        }
	    }
	    else 
	    {
	    	return VALID_FALSE;
	    }
	}
	else if (type=="changeplan")
	{
		var change = new SCFile("cm3r");
	    var query = "number=\""+ changeId +"\"";
	    if (change.doSelect(query)==RC_SUCCESS)
	    {
	        if (change.open==null || change.open==false)
	        {
	        	return VALID_FALSE;
	        }
	    }
	    else 
	    {
	    	return VALID_FALSE;
	    }
	    if (endPhase=="")
	    {
	    	return VALID_TRUE;
	    }
		var leftPhases = getLeftPhasesArray(changeId, startPhase);
		if (lib.ArrayUtil.contains(leftPhases,endPhase))
	    {
	        return VALID_TRUE;
	    }
	}
	else 
	{
		var changeModel = new SCFile("changeModel");
		var query = "id=\""+ changeId +"\"";
		var ret = changeModel.doSelect(query);
		if (ret == RC_SUCCESS)
		{
			var leftPhases = new Array();
			var category = changeModel.category;
			var cmcategory = new SCFile("cm3rcategory");
	        var query = "name=\""+ category +"\"";
	        if (cmcategory.doSelect(query) == RC_SUCCESS)
	        {
	              var workflow = cmcategory.workflow;
	              getToPhases(workflow,startPhase,leftPhases);
	        }
	        else 
	        {
	        	return VALID_FALSE;
	        }
	        if (endPhase=="")
	        {
	        	return VALID_TRUE;
	        }
	        if (lib.ArrayUtil.contains(leftPhases,endPhase))
	        {
	        	return VALID_TRUE;
	        }
		}
		else 
		{
			return VALID_FALSE;
		}
	}
	return VALID_FALSE;
}

//Post Implementation Review
//Execution
