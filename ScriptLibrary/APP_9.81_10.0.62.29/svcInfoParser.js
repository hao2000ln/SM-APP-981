/**  @fileoverview svcInfoParser - A collection of functions that are used to parse the XML
*   information in a Service Catalog item.
*	@author	Pete Budic
*/

/**  This function is used to take an XML information block and create the ServiceCenter thread
*	variables that can then be displayed to the user by a wizard.
*
*	@param {String}	xmlString	- A string that contains the XML filter.
*	@return	True if the arrays are set successfully.
*	@type	Boolean
*/

/* This is the original version that does not display the children nodes 
function setInfoArrays( xmlString )
{
	var xmlObject = new XML();
	var element;
	var attribute;
	var name;
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
				value = element.getValue();
				
				lib.svcInfoParser.writeInfoArrays( name, value, position )
				
				element = element.getNextSiblingElement();
				position++;
			}
			while ( element != null );
		}
		
	}
	return true;
}
*/
function setInfoArrays( xmlString )
{
  var xmlObject = new XML();
  var element;
  var attribute;
  var name;
  var value;
  var position = 1;

  if ( xmlString != null )
  {
	xmlObject.setContent(xmlString);
	
	var xml = xmlObject.getDocumentElement();
		
	element = xml.getFirstChildElement();
    while ( element != null )
    {
	  name = element.getName();
	  value = element.getValue();
	  lib.svcInfoParser.writeInfoArrays( name, value, position );

      var childElement = element.getFirstChildElement();
      if ( childElement == null )
      {
        childElement = element.getNextSiblingElement();
        while ( childElement == null )
        {
          element = element.getParentNode();
          if ( element == null )
          {
            return null;
          }  
          childElement = element.getNextSiblingElement();    
        } 
        element = childElement;
      }
      else
      {
        element = childElement;
      }  
      position++;
    }      
  }
  return true;
}

/** This function is used to take specific values at a specific position and insert them
*	into the correct thread variable for display.
*
*	@param	{String}	fname	-  The name of the field or variable that is going to be populated
*	@param	{String}	fvalue	-  The value that the field is going to be populated with.
*	@param	{Integer}	fposition 	- The position in the ServiceCenter array variables that the values are inserted into.
*/
function writeInfoArrays( fname, fvalue, fposition )
{
	vars.$field_name 		= system.functions.insert(vars.$field_name, fposition, 1, fname);
	vars.$field_value 		= system.functions.insert(vars.$field_value, fposition, 1, fvalue);
}


/**  This function is used to convert the ServiceCenter thread variables back into
*	a String representation of XML that can be written to a record.
*	@param	{Array}		name	- The array of names for the filter
*	@param	{Array}		value	- The array containing the values to be compared.
*
*	@return The XML String representation of the XML Filter.
*	@type String
*/
function writeInfo( name, value )
{
	var xml = new XML();
	var startString = "<info> </info>"
	xml.setContent( startString );
	
	var filter = xml.getDocumentElement();
	
	var lng = name.length();
	
	for (var i = 0; i < lng; i++ )
	{	
		if ( name[i] != null )
		{
			var elementName = name[i];
			var element = xml.addElement( elementName );
			element.setValue(value[i]);
		}
		
	}

	return xml.toXMLString();
}
