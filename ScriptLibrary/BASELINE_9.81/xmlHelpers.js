/** @fileoverview xmlHelpers
*   @author Pete Budic
*/



/** This function adds a complete XML element to an existing element as a child.
*
*	@param {XML} element    - the XML element to add the child to
*	@param {XML} childElement - the child XML to add
*	@return The new element with child added
*   @type XML
*/
function addChildElement( element, childElement )
{
	if ( childElement != null )
		{
		
		var child = element.addElement( childElement.getName() );
		
		child = addAllAttributes( childElement, child);
		
		if ( childElement.getValue() != null && childElement.getValue() != "" && childElement.getValue() != "\n")
		{
			var rc = child.setText( childElement.getValue() );
		}
		
		
		
		var node = childElement.getFirstChildElement();
		var i = 1;
	
		while ( node != null )
		{
			
			child = addChildElement( child, node );
			node = node.getNextSiblingElement();
			i++;
			
		}
	}
	
	return element;

}

/** This function adds a complete XML element to an existing element as a child.
*
*	@param {File} fCatalogItem    - the svcCatalog record
*	@return The new element with child added
*   @type XML
*/
function addAllAttributes( element, childElement )
{
	var nodeAttribute = element.getFirstAttribute();
  				
	while ( nodeAttribute != null)
	{
		childElement.setAttributeValue( nodeAttribute.getName(), nodeAttribute.getValue() );
		nodeAttribute = element.getNextAttribute();
	}
	
	
	return childElement;
}

/** This function checks to see if a particular element has any child elements.
*
*	@param {XML} element    - the XML element in question
*	@return True if the element has children, otherwise false
*   @type Boolean
*/
function hasChildren( element )
{ 				
	if ( element != null )
	{
		if ( element.getFirstChildElement() != null )
			return true;
	}
	return false;
}

/** This function checks to see if a particular xml String has any child elements under the parent node.
*
*	@param {xmlString} element    - the XML String in question
*	@return True if the element has children, otherwise false
*   @type Boolean
*/
function xmlStringHasChildren( xmlString )
{
	var xml = new XML();
	if ( xmlString != null )
	{
		if (xml.setContent( xmlString ) )
			{
			var element = xml.getDocumentElement();
			if ( element != null )
			{	
				return hasChildren( element );
			}
		}
	}
	return false;
}

/** This function returns the XML element specified by either an attribute value or node name.
*	If no attributeName is specified, the value is used.
*
*	@param 	{XML} xml    - the xml that contains the dynamic form information
*   @param 	{String} id - The id of the node to be returned.
*	@param	{string} attributeName - The name of the attribute to check for id.  If none is specified the name of the node is used.
*	@return The element corresponding to the passed in ID.
*   @type 	XML
*/
function getElement( element, id, attributeName )
{
	var node = element.getFirstChildElement();
	
	while ( node != null)
	{
		if ( attributeName!= null)
		{
			if (node.getAttributeValue(attributeName) == id )
				return node;
		}
		else
			if (node.getName() == id )
				return node;
		node = node.getNextSiblingElement();
	}
	return null;
}

/** This function returns the XML element value specified by node name.
*
*
*	@param 	{XML} xml    - the xml that contains the dynamic form information
*   @param 	{String} id - The id of the node to be returned.
*	@return The element value corresponding to the passed in ID.
*   @type 	XML
*/
function getElementValue( element, id)
{
	var node = element.getFirstChildElement();
	
	while ( node != null)
	{
			if (node.getName() == id )
				return node.getValue();
		node = node.getNextSiblingElement();
	}
	return null;
}



/** This function returns the XML element specified by  an node value or node name.
*	
*
*	@param 	{XML} element    - the xml that contains part of dynamic form information
*   @param 	{String} value - The value of the node to be returned.
*	@return The element corresponding to the passed in value.
*   @type 	XML
*/
function getElementByValue( element, value )
{
	var node = element.getFirstChildElement();
	
	while ( node != null)
	{
			if (node.getValue() == value )
				return node;
		node = node.getNextSiblingElement();
	}
	return null;
}
/** This function removes a specified child node from an existing XML element.
*
*	@param {XML} xml    - the existing XML
*   @param {String} id - The id of the node to be deleted.
*	@param {String} attributeName - The attribute name the contains the ID, if none the name is used.
*	@return Boolean success or failure
*   @type Boolean
*/
function removeChild( xml, id, attributeName )
{
	// We don't have a node.removeChild() function, so we have to rebuild the entire
  	// XML and leave out what we are removing.
	var testId;
	if ( xml != null )
	{
		var newXml = new XML( xml.getDocumentElement().getName() );
		newXml = addAllAttributes( xml, newXml );
		newXml.setText( xml.getText());
		
  		var node = xml.getFirstChildElement();
  		
  		
  		while ( node != null )
  		{
  			if ( attributeName != null )
  				testId = node.getAttributeValue( attributeName );
  			else
  				testId = node.getName();
  			if ( testId != id )
  			{
  				newXml = lib.xmlHelpers.addChildElement( newXml, node );
  			}
  			node = node.getNextSiblingElement();	
  		}
  		
  		return newXml;
		
	}
	
	return null;
}

/** This function either adds or replaces a specified child node from an existing XML element.
*
*	@param {XML} xml    - the existing XML
*	@param {XML} child  - the child node to be added or replaced
*	@param {String} attributeName - The attribute name that contains the ID of
*					the node to be added/replaced, if none the name is used.
*	@return The new XML
*   @type XML
*/
function addReplaceChild( xml, child, attributeName )
{
	var testId;
	var id;
	var replace = false;
	
	if ( child != null )
	{
		if ( attributeName != null )
		{
			id = child.getAttributeValue( attributeName )
		}
		else
			id = child.getName();
	}
	
	if ( xml != null )
	{
		var newXml = new XML( xml.getDocumentElement().getName() );
		newXml = addAllAttributes( xml, newXml );
		newXml.setText( xml.getText());
		
  		var node = xml.getFirstChildElement();
  		while ( node != null )
  		{
  			if ( attributeName != null )
  				testId = node.getAttributeValue( attributeName );
  			else
  				testId = node.getName();
  			if ( testId != id )
  			{
  				newXml = addChildElement( newXml, node );
  			}
  			else
  			{
  				newXml = addChildElement( newXml, child );
  				
  				replace = true;
  			}
  			
  			node = node.getNextSiblingElement();	
  		}
  		
  		if (replace == false)
  		{
  			newXML = addChildElement( newXml, child);
  			
  		}
  			
  		
  		return newXml; 	
  	}
}

/** This function replaces the special characters in an XML string with the proper characters
*
*	@param {XML} xmlString    - the existing XML String
*	@return string - The new String
*   @type String
*/
function parseXMLString( xmlString )
{
	var string = xmlString;
	if ( string == null )
		return "";
	
	var regExp = /&lt;/g;
	string = string.replace(regExp, "<");
	
	regExp = /&gt;/g;
	string = string.replace(regExp, ">");
	
	regExp = /&quot;/g;
	string = string.replace(regExp, "\\\"");
	
	regExp = /&#39;/g;
	string = string.replace(regExp, "'");
	
	//QCCR1E68512 move &amp parse in the last, other wise &amp;quot will be parsed to \" instead of &quot
	regExp = /&amp;/g;
	string = string.replace(regExp, "&");	
	
	return string;
}

/** This function encodes the contents of a tag in an XML string.
*
*	@param {XML} 	strXML    - the existing XML String
*	@param {String} strTag    - the tag of the contents to be encoded
*	@return string - The new String
*   @type String
*/
function encodeTagContent( strXML, strTag )
{
	var iStart=strXML.indexOf("<" + strTag);
	
	if (iStart == -1)
	{
		return strXML;
	}
	
	iStart=strXML.indexOf(">", iStart) + 1;
	var iEnd=strXML.lastIndexOf("</" + strTag + ">");
	
	var xmlContent = new XML("content");
	
	xmlContent.setText(strXML.slice(iStart, iEnd));
	
	var strEncoded = xmlContent.toXMLString();
	var iEncStart = strEncoded.indexOf("<content>") + 9;
	var iEncEnd = strEncoded.indexOf("</content>");
	
	strEncoded = strEncoded.slice(iEncStart, iEncEnd);
	
	var strStart = strXML.slice(0, iStart);
	var strEnd = strXML.slice(iEnd);
	
	return (strStart + strEncoded + strEnd);
}

/** This function properly encodes the instance of \" in an XML string.
*
*	@param {XML} 	strXML    - the existing XML String
*	@return string - The new String
*   @type String
*/
function fixQuotes( strXML )
{
	var string = strXML;
	if ( string == null )
		return "";
		

	var regExp = /\\"/g;
	string = string.replace(regExp, "\\&quot;");
	
	return string;
}


function getXmlFromRecord( strFileName, strQuery )
{
	var fFile = new SCFile( strFileName );
	var rc = fFile.doSelect( strQuery );
	
	if (rc == RC_SUCCESS)
	{
		return fFile.getXml();
	}
	
	return null;
}

function removePrefixFromXML ( strPrefix, strXML )
{
	var iIndex = strXML.indexOf(strPrefix);
	var iEnd = iIndex+strPrefix.length;
	var strReturn = strXML;
	
	while (iIndex != -1)
	{
		strReturn = strXML.slice(0, iIndex);
		strReturn = strReturn + strXML.slice(iEnd);
		strXML = strReturn;
		
		iIndex = strXML.indexOf(strPrefix, iEnd);
		iEnd = iIndex + strPrefix.length;
	}
	return strReturn;
}

function getTargetXML( strXML )
{
	var iStart=strXML.indexOf("<target");
	iStart=strXML.indexOf(">", iStart) + 1;
	var iEnd=strXML.lastIndexOf("</target>");

	var sliced = strXML.slice(iStart, iEnd);
	
	// if nothing modified, the slice like &lt;, if modified, it will be use < block.
	if(sliced.indexOf("<") != 0){
		return parseXMLString(sliced);
	}
	
	return sliced;
}

function saveMergeXML( strFileName, strTargetQuery, strMergeXML )
{
	var strTargetXML = getTargetXML( strMergeXML );
    /*QCCR1E68512 no need encode script block for the script in xml already been encoded, this means script block should not have < > " character
    **customer should not add such "number > 10" code for the source/targe xml using "number &gt; 10"*/
	strTargetXML = fixQuotes( strTargetXML );	
	strTargetXML = strTargetXML.replace(/>\n</g, "><");
	
	var fFile = new SCFile(strFileName);
	
	fFile.doSelect(strTargetQuery);
	fFile.setRecord(strTargetXML);
	var rc = fFile.doUpdate();
	
	switch (rc)
	{
		case RC_SUCCESS:
			return "SUCCESS";
		
		case RC_CANT_HAVE:
			return "LOCKED";
		
		case RC_MODIFIED:
			return "MODIFIED";
		
		case RC_NOT_AUTHORIZED:
			return "NOT AUTHORIZED";
			
		case RC_VALIDATION_FAILED:
			return "NOT VALID";
			
		case RC_DELETED:
			return "DELETED";
	}
	
	return "ERROR";
}

/** This function set value to the XML object
 *  when the xmlObj has child, it need to creat a text node and insert as its first child.
 *	@param {xmlObj} XML    - the XML Object
 *	@param {value} string    - the value
 */
function setValue(xmlObj, value) {
    if (!value) value = "";
    var oldValue = xmlObj.getValue();
    var nodeChild = xmlObj.getFirstChildElement();
    if (nodeChild && (!oldValue || oldValue == "")) {
        var valueNode = xmlObj.createNode(3, null, value);
        xmlObj.insertBefore(valueNode, nodeChild);
    } else {
        xmlObj.setValue(value);

    }
}
