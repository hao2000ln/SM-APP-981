//////////////////////////////////////////////////////////////////////////////////////
//               for SM Collaboration 1.1 Notifcations 
//////////////////////////////////////////////////////////////////////////////////////

/*
  get ConversationInfo of objects(incident/interaction)
  
  arg : list of conversation ids
  
  returns : array of ConversationInfo(conversationId, ObjectInfo)
  
*/
function getConversationInfo(arg)
{
  var args = arg.split("^^^^^"); 
  var result = [];

  for(var i = 0; i < args.length; i++)
  {
    var convId = args[i];
    var objectInfo = getObjectInfo(convId);
    if(objectInfo == null)
    {
      var conversationInfo = {conversationId: convId, objectInfo: null};
      result.push(conversationInfo);
      continue;
    }

    var conversationInfo = {conversationId: convId, objectInfo: objectInfo};
    result.push(conversationInfo);
  }
  return lib.JSON2.toJSON(result);
}

function getObjectInfo(convId)
{
    var dbFile = new SCFile('conversation');
	var sql = "conversationid=\"" + convId + "\"";
	
	if(dbFile.doSelect( sql ) == RC_SUCCESS)
	{
		var objectName = dbFile['object'];
		var objectId = dbFile['objectid'];
		var objectDisplayId = dbFile['objectdisplayid'];		
		var objectTitle = dbFile['objecttitle']
		return {name: objectName, 
		         id: objectId,
		         displayId: objectDisplayId,
		         title: objectTitle};
	}
	return null;
}


