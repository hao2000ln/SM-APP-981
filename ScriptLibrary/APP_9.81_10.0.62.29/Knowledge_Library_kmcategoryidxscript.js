function getGroupsforCategory( groups ,category )
{	// From KMDocument_Index, only if SRC mode... split the categories first on ";".  Loop through array elements and call this function.
	// build a comma seperated list of groups.  Add a new field to schemastub.xml for groups.  Add the final group string to this field during indexing.
	// SRC will check user's group or groups against this list to find what doc view to load.
	if (groups==null)
	{
		groups = [];
	}
	var catArray = category.split(":");
	var cat;
	for (cat = 0; cat < catArray.length; cat++)
	{
		var sclibFile = new SCFile("kmcategory", SCFILE_READONLY);
		sclibFile.setFields(["permission"]);
		var query = "id = \""+catArray[cat]+"\"";
		var scFind = sclibFile.doSelect(query);
		if ( scFind == RC_SUCCESS )
		{	
			if (sclibFile.permission != null && funcs.lng(sclibFile.permission)!=0) // permissions is an array of structure, get all groups 
			{
			    var i;
			    var length = funcs.lng(sclibFile.permission);
				for (i=0; i<length;i++ )
				{
					if (sclibFile.permission[i].kmgroup!=null && !funcs.index(sclibFile.permission[i].kmgroup, groups))
					{
						groups.push(sclibFile.permission[i].kmgroup);
					}
				}
			}
		}
		if (cat==catArray.length-1 && groups.length==0)
		{
			groups.push("KMG01");
		}
	}
	return groups;
}

function getCategoryStr(record) {
    if (!record.categories) {
        return "";
    }
    
    return record.categories.toArray().join(';');
}