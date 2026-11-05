function hasTrigger(name)
{
	var trigger = new SCFile("triggers");
	var sql = "trigger.name=\""+name+"\"";
	var rc = trigger.doSelect(sql);
	if (rc == RC_SUCCESS)
		return true;
	else return false;	
}