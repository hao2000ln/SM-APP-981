/** @fileoverview svcCatConnectorWizards - contains functions used for Service Catalog connector wizards
*   @author Pete Budic
*/

/**
*   @class svcCatConnectorWizards
*   @constructor
*/
function svcCatConnectorWizards()
{
}

/**  This fuction takes an XML object and sets an array of the values of 
*    specific named elements for the wizard to display. This sets the values
*	 for the various change requests.
*
*	@param {String} xmlInfo   	- the XML string
*	@return {Boolean} true      - true
*   @type Boolean
*/
function getInteractionInfo( xmlString )
{
  if ( xmlString != null )
 	 {
	    var xml = new XML();
	    xml.setContent( xmlString );
	    
	    var strInitialImpact = null;
	    var strAssignment = null;
	    

		element = lib.xmlHelpers.getElement( xml, "impact", null );
		if (element != null) strInitialImpact = element.getValue();

	    element = lib.xmlHelpers.getElement( xml, "assignment", null );
	    if (element != null) strAssignment = element.getValue();

	    if (strInitialImpact != null)
	      	vars.$svc_impact = strInitialImpact;
		
	    if (strAssignment != null)
	      	vars.$svc_assignment = strAssignment;
		
	}
            
	return true;
}

/**  This fuction takes an XML object and sets an array of the values of 
*    specific named elements for the wizard to display. This sets the values
*	 for the various change requests.
*
*	@return {String} xmlString       - the string containing the new XML information
*   @type String
*/
function setInteractionInfo( )
{
    var xml = new XML();
  	var xmlString = "<info> </info>";
    xml.setContent( xmlString );
    

 	if ( vars.$svc_impact != null )
 		(xml.addElement( "impact" )).setValue( vars.$svc_impact );

 	if ( vars.$svc_assignment != null )
 		(xml.addElement( "assignment" )).setValue( vars.$svc_assignment );


    xmlString = xml.toXMLString();
  	return xmlString;
}

