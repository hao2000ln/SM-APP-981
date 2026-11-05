function isNormalAction(action)
{
	var normalActions = ["added", "normal", "resetrec", "restart", "refresh", "refreshjoinfile", "newstate", "deleted", "unlock","reeval","newcat"];
	for (var i=0;i<normalActions.length;++i)
	{
		if(action == normalActions[i])
			return true;
	}
	return false;
}