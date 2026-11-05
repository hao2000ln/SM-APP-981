//manage caches
var vizRelationList = new Array();
var vizLabelList = new Array();
var vizLineList = new Array();
var vizDecoratorList = new Array();


//get relation data based on type and subtype
function getRelation(type, subtype)
{
	if(vizRelationList.length == 0)
		populateCache("civisualizationrelationship");
	
	if(subtype != null && subtype != "")
	{
		var match = false;
		
		for(var i=0;i<vizRelationList.length;++i)
		{		
			if(vizRelationList[i].relationship_type == type && vizRelationList[i].relationship_subtype == subtype) 
			{
				match = true;
				return vizRelationList[i];
			}	
		}
		
		if(!match)
		{
			for(var i=0;i<vizRelationList.length;++i)
			{		
				if(vizRelationList[i].relationship_type == type) 
				{					
					return vizRelationList[i];
				}	
			}
		}
	}
	
	else 
	{
		for(var i=0;i<vizRelationList.length;++i)
		{		
			if(vizRelationList[i].relationship_type == type)
				return vizRelationList[i];
		}
	}
	
	return null;
}


//get line style based on line style name
function getLine(name)
{	
	if(vizLineList.length == 0)
		populateCache("civisualizationline");
	
	for(var i=0;i<vizLineList.length;++i)
	{			
		if(vizLineList[i].line_name == name)
			return vizLineList[i];
	}
	
	return null;	
}


//get label based on label name
function getLabel(name)
{	
	if(vizLabelList.length == 0)
		populateCache("civisualizationlabel");
		
	for(var i=0;i<vizLabelList.length;++i)
	{	
		if(vizLabelList[i].label_name == name)
			return vizLabelList[i];
	}
	
	return null;	
}


function getDecorators()
{
	if (vizDecoratorList.length == 0)
		populateCache("civisualizationdecorator");
		
	return vizDecoratorList;
}


function populateCache(tableName)
{
	var fRecord = new SCFile(tableName);
	var rc = fRecord.doSelect("true");

	if(tableName == "civisualizationrelationship")
	{
		while (rc == RC_SUCCESS)
		{
			var obj = new Object();
			
			obj.relationship_type = fRecord.relationship_type;
			obj.relationship_subtype = fRecord.relationship_subtype;
			obj.line_name = fRecord.line_name;
			
			vizRelationList.push(obj);
			
			rc = fRecord.getNext();
		}
	}

	else if (tableName == "civisualizationline")	
	{
		while (rc == RC_SUCCESS)
		{	
			var obj = new Object();
			
			obj.line_name = fRecord.line_name;
			obj.line_color = fRecord.line_color;
			obj.line_style = fRecord.line_style;
			obj.line_weight = fRecord.line_weight;
			
			vizLineList.push(obj);
			
			rc = fRecord.getNext();
		}	
	}
	
	else if (tableName == "civisualizationlabel")	
	{
		while (rc == RC_SUCCESS)
		{	
			var obj = new Object();
			
			obj.label_name = fRecord.label_name;
			obj.label_font = fRecord.label_font;
			obj.label_style = fRecord.label_style;
			obj.label_size = fRecord.label_size;
			
			vizLabelList.push(obj);
					
			rc = fRecord.getNext();
		}	
	}
	
	else if (tableName == "civisualizationdecorator")
	{
		while (rc == RC_SUCCESS)
		{
			if (!fRecord.disabled_flag)
			{
				var obj = new Object();
				
				obj.name = fRecord.name;
				obj.filter_criteria = fRecord.filter_criteria;
				obj.change_link_type = fRecord.change_link_type;
				obj.strSysAttach = fRecord.strSysAttach;
				obj.priority = fRecord.priority;
				obj.highlight_upstream = fRecord.highlight_upstream;
				obj.highlight_downstream = fRecord.highlight_downstream;
				obj.position = fRecord.position;
				obj.external_table_name = fRecord.external_table_name;
				obj.change_link_type = fRecord.change_link_type;
				obj.days_in_advance = fRecord.days_in_advance;
				obj.balloon_display_field = copyArray(fRecord.balloon_display_field);
				obj.balloon_display_label = copyArray(fRecord.balloon_display_label);	
				obj.category = fRecord.category;	
				obj.group_label = fRecord.group_label;
				
				vizDecoratorList.push(obj);
			}
			
			rc = fRecord.getNext();
		}
	}
}


function copyArray(arrayA)
{
	var arrayB = new Array();
	
	for ( i in arrayA )
	{
		arrayB[i] = arrayA[i];		
	}
	
	return arrayB;
}