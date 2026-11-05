function toJSON(obj) {
	if (obj == null) return "null";
	
	//if (obj.getJsonStr) return obj.getJsonStr();
	
	var type = typeof(obj);
	if (type == "string") return "\"" + obj + "\"";
	if (type == "number" || type == "boolean") return "" + obj;
	
	if (isArray(obj)) {
		var results = [];
		for (var i = 0; i < arrayLen(obj); i++)
			results.push(toJSON(obj[i]));
		
		return "[" + results.join(", ") + "]";
	} else if (isDate(obj)) {
		return obj.toString();
	}

  var results = [];
  for(var i in obj)
  {	  	  	      
	  var elem = obj[i];
	  var type = typeof(elem);
	  if(type =="string"){
  		results.push("\"" + i + "\"" +": \""+elem.toString()+"\"");
	  }	else if(type=="number" || type=="boolean") {
    	results.push("\"" + i + "\"" +": "+elem)
	  } else if(type=="object") {
	    results.push("\"" + i + "\"" +":" + toJSON(elem));
	  }
  }
  
  return "{" + results.join(", ") + "}";  	
}

function findTargetElement( node, targetElem )
{
    while (node != null && node.getNodeName() != targetElem )
    {
        var childNode = node.getFirstChildElement();
        if (childNode == null)
        {
            childNode = node.getNextSiblingElement();
            while (childNode == null)
            {
                node = node.getParentNode();
                if ( node == null )
                {
                    return null;
                }
                childNode = node.getNextSiblingElement();
            }
            node = childNode;
         }
         else
         {
             node = childNode;
         }
    }
    return node;
}

function getClosureMeaning(closureComments)
{
    var closureMeaning = new Array();
    var i=0;
    while(i<closureComments.length())
    {
        closureMeaning[i] = closureComments[i];
        i++;
    }
    return closureMeaning;        
}

function parseClosureComments(closureComments)
{
    var closureMeaning = "";  
    var i=0;
    while(i<closureComments.length)
    {
      if(closureComments[i]!=null)
      {          
          closureMeaning = closureMeaning+closureComments[i]+"\r\n";
      }
      else
      {
          closureMeaning = closureMeaning+"\r\n";
      }
      i++;
    }
    return closureMeaning;
}

function getTableLength(tableName)
{
    var queueLength = 0;
    var table = new SCFile(tableName);	
    var findRecord = table.doSelect("true");
            
        while (findRecord == RC_SUCCESS)
        {
           queueLength++;
           findRecord = table.getNext();
        }
    
    return queueLength;
}

function isArray(object) {
	if (_isArrayDataType(object)) return true;
	
	return object != null && typeof object == "object" &&
  		'splice' in object && 'join' in object;
}

function _isArrayDataType(value) {
    try {
		var type = value.getType();
		if(type == "ARRAY") return true;
	} catch(ex) {
	   //print("isIncidentArrayDataType:"+ex);
	}
	return false;
}

function isDate(object) {
	//if (_isArrayDataType(object)) return true;
	
	return object != null && typeof object == "object" &&
  		'getDate' in object && 'getTime' in object;
}

function arrayLen(array) {
	if (!isArray(array)) throw new Error("Not a Array.");
	
	if (typeof array.length == "function") return array.length();
	else return array.length;
}