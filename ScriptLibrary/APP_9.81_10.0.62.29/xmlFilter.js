/**  @fileoverview xmlFilter - A collection of functions that are used to allow an alternate method 
*		of constructing a RAD expression to be used as a filter.
*	@author	Pete Budic
*/

/**  This function is used to take an XML Filtering block and create the ServiceCenter thread
*	variables that can then be displayed to the user by a wizard.
*
*	@param {String}	xmlString	- A string that contains the XML filter.
*	@return	True if the arrays are set successfully.
*	@type	Boolean
*/
function setFilterArrays( xmlString )
{
	var xmlObject = new XML();
	var element;
	var attribute;
	var name;
	var type;
	var variable;
	var condition;
	var value;
	var position = 0;

	if ( xmlString != null )
	{
		xmlObject.setContent(xmlString);
	
		var xml = xmlObject.getDocumentElement();
		
		element = xml.getFirstChildElement();
		if ( element != null )
		{
			do
			{
				name = element.getName();
				attribute = element.getFirstAttribute();
				type = null;
				variable = null;
				condition = null;
				value = null;
				
				do
				{
					temp = attribute.getName();
					switch( temp )
					{
						case "type":
							type = attribute.getValue();
							break;
						case "variable":
							variable = attribute.getValue();
							break;
						case "condition":
							condition = attribute.getValue();
							break;
						case "fullname":
							name = attribute.getValue();
							break;	
					}
					
					attribute = element.getNextAttribute()
					
				}
				while ( attribute != null );
				position++;
				value = lib.xmlHelpers.parseXMLString( element.getValue() );
				
				lib.xmlFilter.writeCollectionArrays( name, type, variable, condition, value, position )
				
				element = element.getNextSiblingElement();
			}
			while ( element != null );
		}
		
	}
	return true;
}

/** This function is used to take specific values at a specific position and insert them
*	into the correct thread variable for display.
*
*	@param	{String}	fname	-  The name of the field or variable that is going to be used in this filter condition
*	@param	{String}	ftype	-  The data type of the field
*	@param	{String}	fvariable	- Contains "true" if the field is a variable, "false" if it is a field in a file.
*	@param	{String}	fcondition - The operator that is going to be used for the comparison.
*	@param	{String}	fvalue	-  The value that the field is going to be compared to.
*	@param	{Integer}	fposition 	- The position in the ServiceCenter array variables that the values are inserted into.
*/
function writeCollectionArrays( fname, ftype, fvariable, fcondition, fvalue, fposition )
{
	vars.$field_name 		= system.functions.insert(vars.$field_name, fposition, 1, fname);
	vars.$field_type 		= system.functions.insert(vars.$field_type, fposition, 1, ftype);
	vars.$field_variable 	= system.functions.insert(vars.$field_variable, fposition, 1, fvariable);
	vars.$field_condition 	= system.functions.insert(vars.$field_condition, fposition, 1, fcondition);
	vars.$field_value 		= system.functions.insert(vars.$field_value, fposition, 1, fvalue);
}


/**  This function is used to convert the ServiceCenter thread variables back into
*	a String representation of XML that can be written to a record.
*	@param	{Array}		name	- The array of names for the filter
*	@param	{Array}		type	- The array containing the field types for the filter
*	@param	{Array}		variable	- The array containing information on whether the field is a variable
*	@param	{Array}		condition	- The array containing the comparison operator for the filter condition
*	@param	{Array}		value	- The array containing the values to be compared.
*
*	@return The XML String representation of the XML Filter.
*	@type String
*/
function writeFilter( name, type, variable, condition, value )
{
	var xml = new XML();
	var startString = "<filter> </filter>"
	xml.setContent( startString );
	
	var filter = xml.getDocumentElement();
	
	var lng = name.length();
	
	for (var i = 0; i < lng; i++ )
	{	
		if ( name[i] != null )
		{
			var elementName = name[i];
			elementName = elementName.substring(elementName.indexOf(",") + 1);
			var element = xml.addElement( elementName );
			element.addAttribute("type", system.functions._null(type[i])? "" : type[i]);
			element.addAttribute("condition", condition[i]);
			element.addAttribute("variable", system.functions._null(variable[i])? "" : variable[i]);
			element.addAttribute("fullname", name[i]);
			element.setValue(value[i]);
		}
		
	}

	return xml.toXMLString();
}


/** This function takes the string representation of an XML Filter and converts it into
*	a ServiceCenter RAD expression.
*
*	@param	{String}	xmlString - The string representation of the XML Filter.
*	@return	The ServiceCenter RAD expression created from the XML filter.
*	@type	String	
*
*/
function getRadFilter( xmlString, fileOff )
{
    if (xmlString == null || xmlString == "") {
       return "true";
    }

	var cond;
	var xml = new XML();
	xml.setContent(xmlString);
	
	var filter = xml.getDocumentElement();
	
	var element;
	var nextElement;
	var prevElement;
	
	if ( fileOff == null )
		fileOff = false
	
	element = filter.getFirstChildElement();
	
	if ( element == null )
		return "true";
	nextElement = element.getNextSiblingElement();
	cond = "(";
	
	do
	{
		var thisCond = "";
		var temp;
		var c;
		var type = 2;
		var variable;
		var condition;
		var name = element.getName();
		var value = element.getValue();

		value = lib.xmlHelpers.parseXMLString(value);
		
		if ( prevElement != null)
		{
			if ( prevElement != name  )
				thisCond=") and (";
			else
				thisCond=" or ";
		}
		var attribute = element.getFirstAttribute();
		do
		{
			temp = attribute.getName();
			switch( temp )
			{
				case "type":
					type = attribute.getValue();
					break;
				case "variable":
					variable = attribute.getValue();
					break;
				case "condition":
					condition = attribute.getValue();
					break;
			}
			
			attribute = element.getNextAttribute()
			
		}
		while ( attribute != null );
		
		if ( variable != "true" && fileOff == false )
			name = name + " in $L.file";
		else if (  variable == "true" )
			name = "$"+name;
		
		switch( type )
		{
			case "2":
				if ( value != "NULL" )
					value = "\"" + value + "\"";
				break;
			case "3":
				value = "'" + value + "'";
				break;
			case "82":
				value = "\"" + value + "\"";
				break;
			case "83":
				value = "'" + value + "'";
				break;
		}

		switch( condition )
		{
			case "eq":
				c = name +"="+value;
				break;
			case "neq":
				c = name +"~=" + value;
				break;
			case "gt":
				c = name +">" + value;
				break;
			case "lt":
				c = name +"<" + value;
				break;
			case "gte":
				c = name + ">=" + value;
				break;
			case "lte":
				c = name + "<=" + value;
				break;
			case "isin":
				c = "index("+value+","+name+")>0";
				break;
			case "isnotin":
				c = "index("+value+","+name+")=0";
				break;
			case "startswith":
				c = name +"#" + value;
				break;
			case "notstartswith":
				c = name +"~#" + value;
				break;				
		}
		thisCond+= c;
		cond += thisCond;
		prevElement = element.getName();
		element = element.getNextSiblingElement();
		
	}
	while ( element != null);
	
	cond+=")";
	
	if (cond == null )
		return "true";
	return cond;
}