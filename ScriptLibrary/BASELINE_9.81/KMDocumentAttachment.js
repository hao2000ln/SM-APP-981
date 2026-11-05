function getGUIDs(docid)
{
	var guid = new SCDatum();
	guid.setType(8);
	var guidstr = "";
	var sysattach = new SCFile("SYSATTACHMENTS", SCFILE_READONLY);
	sysattach.setFields(["uid","mimetype"]);
	var query = "application=\"kmdocument\" and topic=\""+ docid +"\"";
	var ret = sysattach.doSelect(query);
	while (ret == RC_SUCCESS)
	{
		if (!funcs.index(sysattach.uid, guid))
		{
			guid.push(sysattach.uid);
			guidstr+=sysattach.uid+","+sysattach.mimetype+";";
		}
		ret = sysattach.getNext();
	}
	if (guidstr!="")
	{
		guidstr = guidstr.substr(0,funcs.lng(guidstr)-1);
	}
	return guidstr;
}