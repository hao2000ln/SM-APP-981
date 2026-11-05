/**
* This function generates readable description from SM query
* e.g. $L.incident.count>10 and not critical.ci in $L.file=true and active in $L.category=true
*/
function getDescriptionForQuery(query, filenName)
{
	if (query == "true" || query == true)
		return "Always";
	else if (query == "false" || query == false)
		return "Never";	
	if (query == null || query == "")
		return "";
	//seperate them by space
	var values = query.split(" ");
	var desc = "";
	for(var i=0;i<values.length;++i)
	{
		//see if it is one of the key word
		values[i] = processForFieldName(values[i],query, filenName)
		values[i] = processForTableName(values[i]);
		values[i] = processForComparison(values[i]);
		
		desc += values[i] + " ";		
	}	

	return desc;
}		
		
function processForComparison(compare)
{
	var compareTokens = ["=",">",">=","<=","<"];
	var compareValues = ["equals","gt","get","let","lt"];
	
	var lng = 0;
	var index = -1;
	var pos = -1;
	for (var i=0; i<compareTokens.length;++i)
	{
		if (compare.indexOf(compareTokens[i])>-1)
		{
			lng = compareTokens[i].length;
			index = i;
			pos = compare.indexOf(compareTokens[i]);
			break;			
		} 
	}
	
	if (index>-1) 
	{
		var compareStr = system.functions.scmsg(compareValues[index],"xmlFilter");
		return compare.substring(0,pos)+" "+compareStr+" "+compare.substring(pos+lng);
	}	
	return compare
	
}

function processForTableName(name)
{
	var tableVariables = ["$L.file","$L.file.save","$L.category","$L.phase","$L.fc","$L.env","$L.object"];
	var tableCaptions = ["CurrentFile","SavedFile","Category","Phase","FormatControl","Profile","Object"];
	
	var lng = 0;
	var index = -1;
	for (var i=0; i<tableVariables.length;++i)
	{
		if (name.indexOf(tableVariables[i])>-1)
		{
			lng = tableVariables[i].length;
			index = i;
			break;			
		} 
	}
	
	if (index>-1) {
		return system.functions.scmsg(tableCaptions[index],"xmlFilter")+name.substring(lng);
	}	
	else return name;	
}

function processForFieldName(field,query, fileName)
{
	if (field.indexOf("$")>-1)
		return field;
	if (field == "and" || field == "or" || field == "not" || field == "in")
		return field;
	
	
	var prefix = "";
	if(field.indexOf("(") == 0)
	{
		prefix="(";
		field = field.substring(1);
	}
		
	
	//seperate them by space
	var values = query.split(" ");
	var index = -1;
	//get the next next token	
	for (var i=0;i<values.length;++i)
	{
		if (values[i] == field)
		{
			index = i;
			break;
		}
	}	
	
	var tableSection = values[index+2];
	if(tableSection == null || tableSection.length == 0)
		return (prefix+field);
	var tableName = fileName;
	if (tableSection.indexOf("$L.file")>-1)
	{
		tableName = fileName;
	}
	else if (tableSection.indexOf("$L.file.save")>-1)
	{
		tableName = fileName;
	}
	else if (tableSection.indexOf("$L.category")>-1)
	{
		//get category file name based on Object record
		var object = new SCFile("Object");
		var sql = "file.name=\""+fileName+"\"";
		if (object.doSelect(sql) == RC_SUCCESS)
		{
			tableName = object.category_file_name;
		}
		else tableName = "cm3rcategory";
	}	
	else if (tableSection.indexOf("$L.object")>-1)
	{
		tableName = "Object";
	}	
	else if (tableSection.indexOf("$L.phase")>-1)
	{
		//get phaser file name based on Object record
		var object = new SCFile("Object");
		var sql = "file.name=\""+fileName+"\"";
		if (object.doSelect(sql) == RC_SUCCESS)
		{
			tableName = object.phase_file_name;
		}
		else tableName = "cm3rphase";
	}	
	else if (tableSection.indexOf("$L.env")>-1)
	{
		if (fileName == "cm3r" || fileName == "cm3t")
			tableName = "cm3profile";
		else if (fileName == "ocmq" || fileName == "ocml" || fileName=="ocmo")
			tableName = "ocmprofile";	
		else if (fileName == "incidents")
			tableName = "smenv";	
		else if (fileName == "probsummary")
			tableName = "pmenv";					
	}		
	
	//get caption based on table name and field name
	var caption = lib.tableFunctions.getFieldCaption(field,tableName);
	return prefix+caption;
}
