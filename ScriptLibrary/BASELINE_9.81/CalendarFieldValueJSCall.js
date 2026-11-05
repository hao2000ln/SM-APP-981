var json = system.library.JSON.json();
function getBoolenValues()
{
  return json.stringify({"values":["true","false"], "labels":[system.functions.scmsg( 1, "global"),system.functions.scmsg( 0, "global")]});
}

function getValuesFromArrays(valueArray,displayArray)
{
  var retObj = {};
  retObj.values = [];
  retObj.labels = [];
  for (var i = 0; i < system.functions.lng(valueArray); i++)
  {
    retObj.values.push(valueArray[i]);
    retObj.labels.push(displayArray[i]);
  }
  return json.stringify(retObj);  
}

function getValuesFromArray(charArray)
{
  var retObj = {};
  retObj.values = [];
  retObj.labels = [];
  for (var i = 0; i < system.functions.lng(charArray); i++)
  {
    retObj.values.push(charArray[i]);
    retObj.labels.push(charArray[i]);
  }
  return json.stringify(retObj);  
}

function getMyAssignmentGroupOperators()
{
	var assignment = new SCFile("assignment");
	var query = "operators=\"" + vars.$lo_user_name + "\"";
	var rc = assignment.doSelect(query);
	var ret = new Array();
	if (rc == RC_SUCCESS)
	{
		do 
		{			
			var operators = assignment.operators;
			if(operators != null)
			{
				for(var i =0 ; i < operators.length(); i ++)
				{
					var operator = operators[i];
					if(!lib.ArrayUtil.contains(ret, operator))
					{
						ret.push(operator);	
					}
				}		
			rc=assignment.getNext();
			}
		}
		while (rc == RC_SUCCESS)
	}
	return getValuesFromArray(ret);
}
