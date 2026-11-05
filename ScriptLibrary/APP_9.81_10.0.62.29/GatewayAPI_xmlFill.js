/** This function reads the validation XML and returns the proper query.
*	If the field does not have a match table/field, the query will be returned as "false"
*
*	@param {xmlString} 	-	the xml String containing the validation information
*	@param {string} id    - the xml field name to be used
*	@param {string} value - the value of the xml field
*	@return The proper query ofr the xml field
*   @type String
*/
function getQuery( xmlString, id, value, optionXML )
{
	var blank = "false";
	var all = "true";
	var xml = new XML();
	
	
	if ( xml.setContent( xmlString ) );
	{
		var sql;
		var element = lib.xmlHelpers.getElement( xml, id, "id" );
		if ( element != null)
		{
			var field = element.getAttributeValue( "matchField" );
			var table = element.getAttributeValue( "matchTable" );
			var query = element.getAttributeValue( "query" );

			var type = lib.tableFunctions.getFieldType( field, table );

			if ( value == null )
				return all;

			if(type == 1){
				sql = field + "=" + value;
			} else if (type == 2 && value != ""){
				sql = field + "#\"" + value + "\"";
			} else if (type == 3){
				sql = field + "='" + value + "'";
			}			
			
			if ( sql == null) sql = all;
			if (query != null && query != ""){
				query = replaceElementValue(optionXML, xmlString, query);
				sql = sql + " and " + query;
			}
			return sql;	
		}
	}

	return blank;
}

/** This function reads the options XML and returns the contents of the specified field
*
*	@param {xmlString} 	-	the xml String containing the validation information
*	@param {string} id    - the xml field name to be checked
*	@return The value of the xml field
*   @type String
*/
function getValue( xmlString, id )
{
	var xml = new XML();
	if ( xml.setContent( xmlString ) );
	{
		var element = lib.xmlHelpers.getElement( xml, id, "id" );
		if ( element == null )
			return null;
		var value = element.getValue();
		
		return value;
	}
	
}

/** This function reads the options XML and returns the nodeName, value, type of the specified field
*
*	@param {xmlString} 	-	the xml String containing the validation information
*	@param {string} id    - the xml field name to be checked
*	@return An array of NodeName, Value, Type
*   @type Array [nodeName], [value], [type]
*/
function getNodeValueType( optionXML, validationXML, id )
{
	var xml = new XML();
	var value, nodeName, type;
	if ( xml.setContent( optionXML ) );
	{
		var node = lib.xmlHelpers.getElement(xml, id, "id");
        if (node != null)
        {
        	value = node.getValue();
        	nodeName = node.getName();
        	type = "string";
        	var xmlValidation = new XML();
        	if (xmlValidation.setContent(validationXML))
        	{
            	var id = node.getAttributeValue("id");
	            var rules = lib.xmlHelpers.getElement(xmlValidation, id, "id");
    	        if (rules != null)
        	    {
                	type = rules.getName();
            	}
            	else
            	{
            		if (nodeName == "checkbox"){
            			type = "checkbox";
            		}
            	}
        	}
        }
	}
	return([nodeName, value, type]);
	
}

/** This function reads the validation XML and returns the correct filename
*
*	@param {xmlString} 	-	the xml String containing the validation information
*	@param {string} id    - the xml field name to be checked
*	@return The table name
*   @type String
*/
function getTableName( xmlString, id )
{
	var xml = new XML();
	if ( xml.setContent( xmlString ) );
	{
		var element = lib.xmlHelpers.getElement( xml, id, "id" );
		if ( element == null )
			return null;
		var value = element.getAttributeValue( "matchTable" );
		
		return value;
	}
	
}

/** This function reads the validation XML and returns the correct field name
*
*	@param {xmlString} 	-	the xml String containing the validation information
*	@param {string} id    - the xml field name to be checked
*	@return The field name
*   @type String
*/
function getFieldName( xmlString, id )
{
	var xml = new XML();
	if ( xml.setContent( xmlString ) );
	{
		var element = lib.xmlHelpers.getElement( xml, id, "id" );
		if ( element == null )
			return null;
		var value = element.getAttributeValue( "matchField" );
		
		return value;
	}
	
}

/** This function sets a field value in the options XML
*
*	@param {xmlString} 	-	the xml String containing the option information
*	@param {string} id    - the xml field name to be set
*	@param {string} value -	the value to set the field to
*	@return the resulting XML String
*   @type XMLString
*/
function setFieldValue( xmlString, id, value )
{
	var xml = new XML();
	
	if ( xml.setContent( xmlString ) );
	{
		var element = lib.xmlHelpers.getElement( xml, id, "id" );
		
		if ( element == null )
			return xmlString;
		if (value != null) {
			element.setValue( value );
		}
		
		return xml.toXMLString();
	}
	return xmlString;
}

/** This function reads the option xml and gets the field name from the button value
*
*	@param {xmlString} 	-	the xml String containing the validation information
*	@param {string} button    - the button to be checked
*	@return The field name
*   @type String
*/
function getFieldFromButton( xmlString, button )
{
	var xml = new XML();
	if ( xml.setContent( xmlString ) );
	{
		var element = lib.xmlHelpers.getElement( xml, button, "button" );
		if ( element == null )
			return null;
		var value = element.getAttributeValue( "id" );
		
		return value;
	}
	
}

/** This function gets the group by fields if they exist
*
*	@param {xmlString} 	-	the xml String containing the validation information
*	@param {string} id    - the xml field name to be checked
*	@return The group field names
*   @type Array
*/
function getGroupFields( xmlString, id  )
{
	var fields = new SCDatum();
	fields.setType( 8 );
	var xml = new XML();

	if ( xml.setContent( xmlString ) );
	{
		var element = lib.xmlHelpers.getElement( xml, id, "id" );
		if ( element == null )
			return null;
		var groupNode = lib.xmlHelpers.getElement(element, "matchGroup", null);
		if ( groupNode != null )
		{

			var groupField = groupNode.getFirstChildElement();
			while ( groupField != null )
			{
				if (groupField.getValue() != null && groupField.getValue() != "null" )
				{
					fields = system.functions.insert( fields, 0, 1 , groupField.getValue() );
				}
				groupField = groupField.getNextSiblingElement();
			}
		}
	}
	return fields;
}

/** This function is to replace the brackets [] in query with the real value
*	Brackets in double quotation mark should not be replaced

*	@param {xmlString} 	-	the xml user filled in
*	@param {xmlValidation}    - the xml String containing the validation information
*	@param {query} - query statement defined in user option
*	@return The group field names
*   @type Array
*/
function replaceElementValue(xmlString, xmlValidation, query){
	var reg = /\"(.*?)\"/gi; //regular expression for finding out double quotation mark ""
	var subStringArr = [];
	var tmp;
	var firstBracketIndex = 0;
	var secondBracketIndex = 0;
	var result = '';
	while((tmp = reg.exec(query)) != null){
		firstBracketIndex = tmp.index;
		if (firstBracketIndex > 0){
			subStringArr.push(query.substring(secondBracketIndex, firstBracketIndex));
		}
		secondBracketIndex = firstBracketIndex + tmp[0].length;
		subStringArr.push(query.substring(firstBracketIndex, secondBracketIndex));
	}
	if (secondBracketIndex != query.length){
		subStringArr.push(query.substring(secondBracketIndex, query.length));
	}

	for(var i = 0; i < subStringArr.length; i++){
		var tempstr = subStringArr[i];
		if(tempstr.charAt(0) != '"'){
			tempstr = replaceBracketsValue(xmlString, xmlValidation, tempstr);
		}
		result += tempstr;
	}
	return result;
}

/** This function is to replace the brackets [] in query with the real value

*	@param {xmlString} 	-	the xml user filled in
*	@param {xmlValidation}    - the xml String containing the validation information
*	@param {query} - query statement defined in user option
*	@return The group field names
*   @type Array
*/
function replaceBracketsValue(xmlString, xmlValidation, query){
	var reg = /\[(.*?)\]/gi; //regular expression for find out brackets []
	var subStringArr = [];
	var tmp;
	var firstBracketIndex = 0;
	var secondBracketIndex = 0;
	var result = '';
	while((tmp = reg.exec(query)) != null){
		firstBracketIndex = tmp.index;
		if (firstBracketIndex > 0){
			subStringArr.push(query.substring(secondBracketIndex, firstBracketIndex));
		}
		secondBracketIndex = firstBracketIndex + tmp[0].length;
		subStringArr.push(query.substring(firstBracketIndex, secondBracketIndex));
	}
	if (secondBracketIndex != query.length){
		subStringArr.push(query.substring(secondBracketIndex, query.length));
	}

	for(var i = 0; i < subStringArr.length; i++){
		var tempstr = subStringArr[i];
		if(tempstr.charAt(0) == '['){
			tempstr = tempstr.substring(1, tempstr.length - 1);

			var element = getNodeValueType(xmlString, xmlValidation, tempstr);
			var nodeName = element[0];
			var nodeValue = element[1];
			var nodeType = element[2];
			// if the depended field is a string or picklist, doulbe quotation mark should be added automatically
			if (nodeType == "string" || nodeType == "multitext" || nodeType == "picklist" || nodeType == "combo" || nodeType == "radio"){
				tempstr = '"' + nodeValue + '"';
			} else if(nodeType == "date") {
				tempstr = nodeValue == "" ? "NULL" : "'" + lib.tzFunctions.convertDateStringToLocal(nodeValue, 6) + "'";
			} else {
				if (nodeType == "checkbox") {
					tempstr = nodeValue;
					if (tempstr == "") {
						tempstr = "false";
					}
				} else if (nodeType == "number") {
					tempstr = nodeValue == "" ? "NULL" : nodeValue;
				}
				query = nodeValue;
			}
            //In a double quoted string escape the double quote and backslash
            if ( tempstr[0] == '"' && tempstr[tempstr.length - 1] == '"' ) {
                tempstr = tempstr.substring( 1, tempstr.length - 1 );
                tempstr = tempstr.replace(/\\/g, '\\\\');
                tempstr = tempstr.replace(/"/g, '\\"');
                tempstr = '"' + tempstr + '"';
            }
		}
		result += tempstr;
	}
	return result;
}