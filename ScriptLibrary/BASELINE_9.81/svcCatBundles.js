/** @fileoverview svcCatalog - contains functions used by the Service Catalog module
*   @author Pete Budic
*/

/**  This function is called to check for an existing form definition in the bundle options for a specific component.  
*	If there is one it will be returned, otherwise the form from the catalog record is returned.
*
*	@param {String} options	-  The bundle options of the record
*	@param {Number} id - The id of the current bundle component to be checked.
*	@param {record}	catalog	-	The catalog record for this component
*	@return  xml - the string containing the form xml 
*	@type String
*/
function getForm(options, id, catalog)
{
    var rtnOptions = catalog.options;
	var bundleXML = new XML();

	if ( options != null )
	{
		if ( bundleXML.setContent(options) )
		{
			
			var itemXML = lib.xmlHelpers.getElement( bundleXML, id, "id" );

			if ( itemXML != null )
			{
                var options = itemXML.getFirstChildElement();

                if (options != null)
                {
                    rtnOptions = options.toXMLString();
                }
			}
		}
	}	
	return rtnOptions;	
}


/**  This function is called to get the array of bundle option costs
*
*	@param {String} form			- The XML representation of the options costs
*	@return Array containing costs
*	@type Array
*/
function getCostArray (form)
{	
	if (form == null || form == "")
	{
		return null;
	}	

	var retVal = new SCDatum();
	var formXML = new XML();	
	formXML.setContent(form);
	var strRawCost;
	
	var node = formXML.getFirstChildElement();
	var nextnode;
		
	while (node != null)
	{
		if ( node.getName() == "option" )
		{
			strRawCost = node.getAttributeValue("costadj");
			if (strRawCost != "" && strRawCost != null && parseFloat( strRawCost ) != 0
			        && !isNaN(parseFloat( strRawCost )))
				retVal.push(Number(strRawCost));
		}
		
		nextnode = node.getFirstChildElement();
		if (nextnode == null)
		{
			nextnode = node.getNextSiblingElement();
		}
		
		if (nextnode == null)
		{	
			node = node.getParentNode();

			if (node != null)
				node = node.getNextSiblingElement();
		}
		else 
		{
			node = nextnode;
		}
	}
	return retVal;
}	

/**  This function is called to replace the bundle option costs with the array of costs passed in
*
*	@param {String} form	- The XML representation of the bundle options
*	@param {Array} newCosts	- The new bundle option costs
*	@return String containing the new form XML
*	@type String
*/
function replaceCosts (form, newCosts)
{	
	var formXML = new XML();
	
	formXML.setContent(form);
	
	var strForm = formXML.toXMLString();

	var iEnd = 0;
	var iCurIdx = strForm.indexOf("[+");
	var strStart;
	var strEnd;
	var iCostCount=0;
	
	if (iCurIdx == -1)
	{
		return form;
	}
		
	for (iCostCount = 0; iCostCount < newCosts.length(); iCostCount++)
	{
		iEnd=strForm.indexOf("]", iCurIdx);
		strStart = strForm.slice(0, iCurIdx + 2);
		strEnd = strForm.slice(iEnd);
		strForm = strStart + newCosts[iCostCount] + strEnd;
		iEnd++;
		iCurIdx = strForm.indexOf("[+", iEnd);
	}	
	return strForm;		
}

/**  This function is called to check and see if the options have already been processed.
*
*	@param {String} form - The XML representation of the bundle options
*	@return Boolean true if processed previously, false otherwise
*	@type Boolean
*/
function checkIfProcessed (form)
{
	var formXML = new XML();
	
	formXML.setContent(form);
	
	var strForm = formXML.toXMLString();
	
	if (strForm.indexOf("<!--ALL READY PROCESSED -->") != -1)
		return true;
		
	return false;
}

/**  This function is called to mark the options as already been processed.
*
*	@param {String} form - The XML representation of the bundle options
*	@return String  true if processed previously, false otherwise
*	@return String containing the new form XML
*	@type String
*/

function markProcessed (form)
{
	var formXML = new XML();
	
	formXML.setContent(form);
	
	var strForm = formXML.toXMLString();
	var iEnd = strForm.indexOf("</form>");
	return strForm.slice(0, iEnd) + "<!--ALL READY PROCESSED -->" + strForm.slice(iEnd);
}

/**  This function is called to add a set of options to the existing bundle options
*
*	@param {String} options	-  The current bundle options
*	@param {Number} id - The id of the current bundle component to be added.
*	@param {String}	componentOptions	-	The component options to be added
*	@return String containing the new bundle XML String
*	@type String
*/
function addNewOption(options, id, componentOptions, componentOptionsValidations) {
	var xml = new XML();
	var componentXML = new XML();
	if (xml.setContent(options)) {
		if (!vars.$G_src) { //add convert date function for QCCR1E120116
			componentOptions = lib.dynamicFormGenerator.convertFormDate(componentOptions, componentOptionsValidations, false);
		} else {
			componentOptions = lib.dynamicFormGenerator.addFormDataTypeAttribute(componentOptions, componentOptionsValidations);
		}
		if (componentXML.setContent(componentOptions)) {
			var node = new XML("item");
			node.setAttributeValue("id", id);

			node = lib.xmlHelpers.addReplaceChild(node, componentXML, "id");
			xml = lib.xmlHelpers.addReplaceChild(xml, node, "id");
			return xml.toXMLString();
		}
	}
	return options;
}

/**  This function is called to determine if a component of a bundle that is not 
*	mandatory should be ordered.
*
*	@param {String} options	-  The current bundle options
*	@param {Number} id - The id of the current bundle component to be checked.
*
*	@return Value showing if the component is selected or not.
*	@type Boolean
*/
function isSelected(options, id)
{
	var xml = new XML();
	
	if ( xml.setContent( options ) )
	{
		node = lib.xmlHelpers.getElement( xml, id, "id" );
		if ( node != null )
		{
			return node.getValue();
		}
	}
	
	return false;
}
/**  This function is called to return an array of item ids contained in the XML
*
*	@param {String} subBundle	-  The current bundle
*
*	@return Array containing the ids
*	@type Array
*/
function getBundleItemIds(bundle)
{
	var ids = new Array();
	
	var index = bundle.indexOf("item id=\"");
	var endIndex;
	var id;
	var i=0;
	
	while (index != -1)
	{
		endIndex = bundle.indexOf("\"", index + 9);
		id = bundle.slice(index+9, endIndex);
		ids[i]=id;
		i++;
		index = bundle.indexOf("item id=\"", endIndex);
	}
	
	return ids;
}

/**  This function is called to add a set of options within a bundle to the overall bundle options
*
*	@param {String} options	-  The current bundle options
*	@param {Number} id - The id of the current bundle component to be added.
*	@param {String}	componentOptions	-	The  options of the sub bundle to be added
*	@param {String}	subBundle	-	The options of the components of the subBundle
*	@return String containing the new bundle XML String
*	@type String
*/
function addNewBundle( options, id, subBundle, form )
{
	var subBundleXML2 = new XML();
	subBundleXML2.setContent( subBundle );
	
	var xml = new XML();
	var componentXML = new XML();
	var subBundleXML = new XML();
	var formXML = new XML();
	var node = new XML("item");
	
	if ( formXML.setContent( form ) )
	{
		if ( subBundle.indexOf("<bundle>") == -1  )
		{
			subBundle = "<bundle>"+subBundle+"</bundle>";
		}
		
		if ( subBundleXML.setContent( subBundle ) )
		{
			node.setAttributeValue("id", id);

			node = lib.xmlHelpers.addChildElement( node, formXML  );

			var nodeId = node.getAttributeValue("id");
			
			if (componentXML.setContent( options ) )
			{
    			var nodeTemp = componentXML.getFirstChildElement();

    			while ( nodeTemp != null )
				{    			
	   	   			var nodeTempId = nodeTemp.getAttributeValue("id");

					if ( nodeTempId == nodeId )
		   	     		node = nodeTemp;
			    	
			    	nodeTemp = nodeTemp.getNextSiblingElement();
				}

			}

			if( subBundle != null && subBundle !="<bundle></bundle>" )
			{
				
				subBundleXML = lib.xmlHelpers.addReplaceChild( node, subBundleXML, "id" );
				
				node = lib.xmlHelpers.getElement( subBundleXML, id, "id" );
				
			}
		}
	}
	if ( xml.setContent( options) )
	{
			if (node != null)	
			{		
				
				xml = lib.xmlHelpers.addReplaceChild( xml, node, "id" );
			}
			
			if( subBundle != null && subBundle !="<bundle></bundle>" )
			{
				var topItem = lib.xmlHelpers.getElement( xml, id, "id");
				
				var ids = getBundleItemIds(subBundle);						
				
				for ( var i=0; i<ids.length; i++)
				{ 
					var subItemId = ids[i];
					var subItem = lib.xmlHelpers.getElement( subBundleXML2, subItemId, "id");
					topItem = lib.xmlHelpers.addChildElement( topItem, subItem );
					xml = lib.xmlHelpers.addReplaceChild( xml, topItem, "id" );
				}
			}
			
						
			return xml.toXMLString();
	}

	return options;
}


/**  This function is called to return a string containing the XML of a sub bundle
*
*	@param {String} options	-  The current bundle options
*	@param {Number} id - The id of the current subbundle component to be selected.
*
*	@return string containing the subbundle XML
*	@type String
*/
function getSubBundle( options, id )
{
	var xml = new XML();
	
	if ( xml.setContent( options ) && id != null)
	{

		node = lib.xmlHelpers.getElement( xml, id, "id" );

		if ( node != null )
			return node.toXMLString();
	}
	return null;
}

/**  This function is called to return a string containing the options XML of a sub bundle
*
*	@param {String} options	-  The current bundle options
*	@param {Number} id - The id of the current subbundle component to be selected.
*
*	@return string containing the subbundle XML
*	@type String
*/
function getSubBundleOptions( options, id )
{
	var xml = new XML();
	
	// Get the item that has subbundle
	var bundleOptions = getSubBundle( options, id );
	return bundleOptions;
}


/** This function returns the XML element in a bundle specified by either an attribute value or node name.
*	If no attributeName is specified, the value is used.
*
*	@param 	{XML} element    - the xml that contains the dynamic form information
*   @param 	{String} id - The id of the node to be returned.
*	@param	{string} attributeName - The name of the attribute to check for id.  If none is specified the name of the node is used.
*   @param  {String} nodeName      - The name of the corresponding node in the element that need to be matched with the bundle option node
*   @param  {String} nodeLabel     - The label of the corresponding node in the element that need to be matched with the bundle option node
*	@return The element corresponding to the passed in ID.
*   @type 	String
*/
function getBundleElement( element, id, attributeName, nodeName, nodeLabel )
{
	while ( element != null )
	{
		var node = element.getFirstChildElement();

		if ( node == null )
		{
			node = element.getNextSiblingElement();
			 
			while ( node == null )
			{
				element = element.getParentNode();
				
				if ( element == null )
				{
					return null; 	
				}
				
				node = element.getNextSiblingElement();
			}
			
			element = node;

			if ( attributeName != null)
			{
				if (element.getAttributeValue(attributeName) == id && element.getNodeName() == nodeName)
					if ( nodeLabel != null )
					{
						 if ( element.getAttributeValue("label") == nodeLabel )
						 	return element;
						 else
						 	continue; 	
					}
					else		 	
						return element;
				else	
					continue;	
			}
			else
			{
				if (element.getName() == id )
					return element;
			}
		}
		else
		{
			element = node
			
			if ( attributeName != null)
			{
				if (element.getAttributeValue(attributeName) == id && element.getNodeName() == nodeName)
					if ( nodeLabel != null )
					{
						 if ( element.getAttributeValue("label") == nodeLabel )
						 	return element;
						 else
						 	continue; 	
					}
					else		 	
						return element;
				else
					continue;	
			}
			else
			{
				if (element.getName() == id )
					return element;
			}
		}
	}
    return null;
}	