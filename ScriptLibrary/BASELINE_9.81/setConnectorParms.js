/** @fileoverview setConnectorParms

*   @author Farahnaz Faegh
*/

/** This function takes the information passed for the record in the connectorInfo and 
*   connectorSubInfo from the Catalog Item and sets the interface.info field for the record.
*
*	@param cnnectorInfo       - Connector for the record
*	@param {connectorSubInfo} - Other connector info for the record
*	@return Boolean success or failure
*   @type Boolean
*/
function setConnectorParms( fCatalogItem, connectorInfo, connectorSubInfo )
{

  var xmlString;
  var xmlObject = new XML();

    // If adding new options or updating options 
    fCatalogItem.interface_info = "<form></form>";


  xmlString = fCatalogItem.interface_info;
  if ( !xmlObject.setContent( xmlString ) )
  {
  	fCatalogItem.interface_info = "<form></form>";
  	return false;
  }

  // Create arrays to store different attributes of the options
  var strConnector;
  var strConnectorInfo
  var strCategory;
  var strType;
  var strInitialImpact;
  var strSeverity;
  var strCoordinator;
  var strReason;
  var strAssets;
  var strSubcategory;
  var strAssignDept;
  var strReleaseType;
  var strParts;
  var strParentGroup;
  var strDependentGroup;
  var strDependencyGroup;
  var strAssignment;
  var strPartNumber;
    
  var aConnectorSubInfo = new Array();
  var aAssets          = new Array();
  var aParts           = new Array();
  var aParentGroup     = new Array();
  var aDependentGroup  = new Array();
  var aDependencyGroup = new Array();
  var aPartNo          = new Array();
  var aVendorNo        = new Array();
  var aQuantity        = new Array();
  var aOption          = new Array();
  var aGroup           = new Array();
  var aItem            = new Array();
  var aLogicalName     = new Array();
  
  var comma = 0;
  
  var element;
  var partsElement;
  var partElement;
  var parentGrpElement;
  var dependentGrpElement;
  var dependencyGrpElement;
  var AssetsElement;
  var childElement;
  
  // Walk through connectorInfo to get the connector fields based on the connector type 
  if ( connectorInfo != null )
  {
    
    var next1;
    var next2;
    var next3;
    var next4;
    var next5;
    var next6;
    var next7;
	  	
    strConnectorInfo = connectorInfo;
	next1 = strConnectorInfo.indexOf( ',', comma );
    strConnector = connectorInfo.slice( comma, next1 );
      
    if ( strConnector == "Open a Record Using Web Services" || strConnector == "Open a Standard Request in AssetCenter" || strConnector == "Open a Standard Request in Asset Manager" ) 
    {
      next2 = strConnectorInfo.indexOf( ',', next1+1 );
      strPartNumber = connectorInfo.slice( next1+1, next2 );
    }

    else if ( strConnector == "Open a Service Desk Interaction" ) 
    {
      next2 = strConnectorInfo.indexOf( ',', next1+1 );
      strInitialImpact = connectorInfo.slice( next1+1, next2 );
      next3 = strConnectorInfo.indexOf( ',', next2+1 );
      strAssignment = connectorInfo.slice( next2+1, next3 );
    }

    else if ( strConnector == "Open New Request" ) 
    {
      next2 = strConnectorInfo.indexOf( ',', next1+1 );
      strCategory = connectorInfo.slice( next1+1, next2 );
      next3 = strConnectorInfo.indexOf( ',', next2+1 );
      strParts = connectorInfo.slice( next2+1, next3 );
      next4 = strConnectorInfo.indexOf( ',', next3+1 );
      strParentGroup = connectorInfo.slice( next3+1, next4 );
      next5 = strConnectorInfo.indexOf( ',', next4+1 );
      strDependentGroup = connectorInfo.slice( next4+1, next5 );
      next6 = strConnectorInfo.indexOf( ',', next5+1 );
      strDependencyGroup = connectorInfo.slice( next5+1, next6 );
    }

    else if ( strConnector == "Open a Change" || strConnector == "Open MAC Ticket" || strConnector == "Open a Subscription Change" ) 
    {
      next2 = strConnectorInfo.indexOf( ',', next1+1 );
      strCategory = connectorInfo.slice( next1+1, next2 );
      
      if ( strCategory == "Application" || strCategory == "CI Group"|| strCategory == "HW server"
          || strCategory == "Hardware" || strCategory == "KM Document" || strCategory == "Security"
          || strCategory == "Subscription" )
      {    
        next3 = strConnectorInfo.indexOf( ',', next2+1 );
        strInitialImpact = connectorInfo.slice( next2+1, next3 );
        next4 = strConnectorInfo.indexOf( ',', next3+1 );
        strSeverity = connectorInfo.slice( next3+1, next4 );
      }
      else if ( strCategory == "MAC" ) 
      {
        next3 = strConnectorInfo.indexOf( ',', next2+1 );
        strType = connectorInfo.slice( next2+1, next3 );
        next4 = strConnectorInfo.indexOf( ',', next3+1 );
        strInitialImpact = connectorInfo.slice( next3+1, next4 );
        next5 = strConnectorInfo.indexOf( ',', next4+1 );
        strSeverity = connectorInfo.slice( next4+1, next5 );
      }

      else if ( strCategory == "RFC" )
      {
        next3 = strConnectorInfo.indexOf( ',', next2+1 );
        strCoordinator = connectorInfo.slice( next2+1, next3 );
        next4 = strConnectorInfo.indexOf( ',', next3+1 );
        strReason = connectorInfo.slice( next3+1, next4 );
        next5 = strConnectorInfo.indexOf( ',', next4+1 );
        strInitialImpact = connectorInfo.slice( next4+1, next5 );
        next6 = strConnectorInfo.indexOf( ',', next5+1 );
        strSeverity = connectorInfo.slice( next5+1, next6 );
        next7 = strConnectorInfo.indexOf( ',', next6+1 );
        strAssets = connectorInfo.slice( next6+1, next7 );
      }

      else if ( strCategory == "RFC - Advanced" )
      {
        next3 = strConnectorInfo.indexOf( ',', next2+1 );
        strSubcategory = connectorInfo.slice( next2+1, next3 );
        next4 = strConnectorInfo.indexOf( ',', next3+1 );
        strInitialImpact = connectorInfo.slice( next3+1, next4 );
        next5 = strConnectorInfo.indexOf( ',', next4+1 );
        strSeverity = connectorInfo.slice( next4+1, next5 );
        next6 = strConnectorInfo.indexOf( ',', next5+1 );
        strAssignDept = connectorInfo.slice( next5+1, next6 );
      }

      else if ( strCategory == "Release Management" )
      {
        next3 = strConnectorInfo.indexOf( ',', next2+1 );
        strCoordinator = connectorInfo.slice( next2+1, next3 );
        next4 = strConnectorInfo.indexOf( ',', next3+1 );
        strReason = connectorInfo.slice( next3+1, next4 );
        next5 = strConnectorInfo.indexOf( ',', next4+1 );
        strInitialImpact = connectorInfo.slice( next4+1, next5 );
        next6 = strConnectorInfo.indexOf( ',', next5+1 );
        strSeverity = connectorInfo.slice( next5+1, next6 );
        next7 = strConnectorInfo.indexOf( ',', next6+1 );
        strReleaseType = connectorInfo.slice( next6+1, next7 );
      }
    }  
  }  	

  comma = 0;
    
  // Walk through connectorSubInfo to get the arrays of values  
  if ( connectorSubInfo != null )
  {

    var next1;
    var next2;
    var next3;
    var next4;
    var next5;
    var next6;

    var aConnectorSubInfo = connectorSubInfo;
    
	for ( var j = 0; j < aConnectorSubInfo.length; j++ )
	{
      comma = 0;
    
      next1 = aConnectorSubInfo[j].indexOf( ',', comma );
      
      if ( strParts !="" && strParts != null 
         && ( aConnectorSubInfo[j].slice( comma, next1 ) == strParts ) 
         && ( aConnectorSubInfo[j].slice( comma, next1 ) != null ) 
         && ( aConnectorSubInfo[j].slice( comma, next1 ) !="" ) 
         )
      {
        aParts[j] = aConnectorSubInfo[j].slice( comma, next1 ); 
        next2 = aConnectorSubInfo[j].indexOf( ',', next1+1 );
        aPartNo[j] = aConnectorSubInfo[j].slice( next1+1, next2 );  
        next3 = aConnectorSubInfo[j].indexOf( ',', next2+1 );
        aVendorNo[j] = aConnectorSubInfo[j].slice( next2+1, next3 );   
        next4 = aConnectorSubInfo[j].indexOf( ',', next3+1 );
        aQuantity[j] = aConnectorSubInfo[j].slice( next3+1, next4 );   
        next5 = aConnectorSubInfo[j].indexOf( ',', next4+1 );
        aOption[j] = aConnectorSubInfo[j].slice( next4+1, next5 );   
        next6 = aConnectorSubInfo[j].indexOf( ',', next5+1 );
        aGroup[j] = aConnectorSubInfo[j].slice( next5+1, next6 );   
      }   
        
      else if ( strParentGroup !="" && strParentGroup != null
         && ( aConnectorSubInfo[j].slice( comma, next1 ) == strParentGroup ) 
         && ( aConnectorSubInfo[j].slice( comma, next1 ) != null ) 
         && ( aConnectorSubInfo[j].slice( comma, next1 ) !="" ) 
         )
      {
        aParentGroup[j] = aConnectorSubInfo[j].slice( comma, next1 ); 
        next2 = aConnectorSubInfo[j].indexOf( ',', next1+1 );
        aItem[j] = aConnectorSubInfo[j].slice( next1+1, next2 );  
            
      }

      else if ( strDependentGroup !="" && strDependentGroup != null
         && ( aConnectorSubInfo[j].slice( comma, next1 ) == strDependentGroup ) 
         && ( aConnectorSubInfo[j].slice( comma, next1 ) != null ) 
         && ( aConnectorSubInfo[j].slice( comma, next1 ) !="" ) 
         )
      {
        aDependentGroup[j] = aConnectorSubInfo[j].slice( comma, next1 ); 
        next2 = aConnectorSubInfo[j].indexOf( ',', next1+1 );
        aItem[j] = aConnectorSubInfo[j].slice( next1+1, next2 );  
           
      }

      else if ( strDependencyGroup !="" && strDependencyGroup != null
         && ( aConnectorSubInfo[j].slice( comma, next1 ) == strDependencyGroup ) 
         && ( aConnectorSubInfo[j].slice( comma, next1 ) != null ) 
         && ( aConnectorSubInfo[j].slice( comma, next1 ) !="" ) 
         )
      {
        aDependencyGroup[j] = aConnectorSubInfo[j].slice( comma, next1 ); 
        next2 = aConnectorSubInfo[j].indexOf( ',', next1+1 );
        aItem[j] = aConnectorSubInfo[j].slice( next1+1, next2 );  
           
      }
 
      else if ( strAssets !="" && strAssets != null 
         && ( aConnectorSubInfo[j].slice( comma, next1 ) == strAssets ) 
         && ( aConnectorSubInfo[j].slice( comma, next1 ) != null ) 
         && ( aConnectorSubInfo[j].slice( comma, next1 ) !="" ) 
         )
      {
        aAssets[j] = aConnectorSubInfo[j].slice( comma, next1 ); 
        next2 = aConnectorSubInfo[j].indexOf( ',', next1+1 );
        aLogicalName[j] = aConnectorSubInfo[j].slice( next1+1, next2 );  
      }
    }  
  }  	
  
  // Create the interface.info field by adding elements using the populated arrays.
  
  var parent = xmlObject.getParentNode();
  var form = parent.getFirstChildElement();

  if ( strConnector == "Open a Record Using Web Services" || strConnector == "Open a Standard Request in AssetCenter" || strConnector == "Open a Standard Request in Asset Manager" ) 
  {
    var node = form.addElement( "partNumber" );
    node.setValue( strPartNumber );
  }  
    
  else if ( strConnector == "Open a Service Desk Interaction" ) 
  {
    var node = form.addElement( "impact" );
    node.setValue( strInitialImpact );
    node= form.addElement( "assignment" );
    node.setValue( strAssignment );
  }
   
  else if ( strConnector == "Open New Request" ) 
  {
      node= form.addElement( "category" );
      node.setValue( strCategory );
  }

  else if ( strConnector == "Open a Change" || strConnector == "Open MAC Ticket" || strConnector == "Open a Subscription Change" ) 
  {
    var node = form.addElement( "category" );
    node.setValue( strCategory );
     
    if ( strCategory == "Application" || strCategory == "CI Group"|| strCategory == "HW server"
      || strCategory == "Hardware" || strCategory == "KM Document" || strCategory == "Security"
      || strCategory == "Subscription" )
    {
      node= form.addElement( "initial.impact" );
      node.setValue( strInitialImpact );
      node= form.addElement( "severity" );
      node.setValue( strSeverity );
    } 
      
    else if ( strCategory == "MAC" ) 
    {
      node= form.addElement( "type" );
      node.setValue( strType );
      node= form.addElement( "initial.impact" );
      node.setValue( strInitialImpact );
      node= form.addElement( "severity" );
      node.setValue( strSeverity );
    } 
      
    else if ( strCategory == "RFC" || strCategory == "Release Management" )
    {
      node= form.addElement( "coordinator" );
      node.setValue( strCoordinator );
      node= form.addElement( "reason" );
      node.setValue( strReason );
      node= form.addElement( "initial.impact" );
      node.setValue( strInitialImpact );
      node= form.addElement( "severity" );
      node.setValue( strSeverity );
    } 

    else if ( strCategory == "RFC - Advanced" )
    {
      node= form.addElement( "subcategory" );
      node.setValue( strSubcategory );
      node= form.addElement( "initial.impact" );
      node.setValue( strInitialImpact );
      node= form.addElement( "severity" );
      node.setValue( strSeverity );
      node= form.addElement( "assign.dept" );
      node.setValue( strAssignDept );
    }

    else if ( strCategory == "Release Management" )
    {
      node= form.addElement( "coordinator" );
      node.setValue( strCoordinator );
      node= form.addElement( "reason" );
      node.setValue( strReason );
      node= form.addElement( "initial.impact" );
      node.setValue( strInitialImpact );
      node= form.addElement( "severity" );
      node.setValue( strSeverity );
      node= form.addElement( "release.type" );
      node.setValue( strReleaseType );
    } 
  }
 
  // Walk through connectorSubInfo and find the correct sub info for request or RFC type connector.
    
  if ( strConnector == "Open New Request" ) 
  {
    if ( aParts.length > 0 )
      partsElement = form.addElement( "parts" );
    
    if ( aParentGroup.length > 0 )
      parentGrpElement = form.addElement( "parnet_group" );

    if ( aDependentGroup.length > 0 )
      dependentGrpElement = form.addElement( "dependent_group" );

    if ( aDependencyGroup.length > 0 )
      dependencyGrpElement = form.addElement( "dependency_group" );

    for ( var index = 0; index < aConnectorSubInfo.length; index++ )
    { 

      if ( aParts[index] != "" && aParts[index] != "" && aParts[index] == "parts" )
      {
        partElement  = partsElement.addElement( "part" );
        ( partElement.addElement( "partno" ) ).setValue( aPartNo[index] );
        ( partElement.addElement( "vendorno" ) ).setValue( aVendorNo[index] );
        ( partElement.addElement( "quantity" ) ).setValue( aQuantity[index] );
        if ( aOption[index] != null && aOption[index] !="" )
          ( partElement.addElement( "option" ) ).setValue( aOption[index] );
        if ( aGroup[index] != null && aGroup[index] !="" )
          ( partElement.addElement( "group" ) ).setValue( aGroup[index] );
      } 
       
      else if ( aParentGroup[index] != "" && aParentGroup[index] != "" && aParentGroup[index] == "parent_group" )
      {
        ( parentGrpElement.addElement( "item" ) ).setValue( aItem[index] );
      } 

      else if ( aDependentGroup[index] != "" && aDependentGroup[index] != "" && aDependentGroup[index] == "dependent_group" )
      {
        ( dependentGrpElement.addElement( "item" ) ).setValue( aItem[index] );
      } 

      else if ( aDependencyGroup[index] != "" && aDependencyGroup[index] != "" && aDependencyGroup[index] == "dependency_group" )
      {
        ( dependencyGrpElement.addElement( "item" ) ).setValue( aItem[index] );
      }
    }
  }   

  else if ( strConnector == "Open a Change" && strCategory == "RFC" ) 
  {
    if ( aAssets.length > 0 )
      assetsElement = form.addElement( "assets" );
    
    for ( var index = 0; index < aConnectorSubInfo.length; index++ )
    { 

      if ( aAssets[index] != "" && aAssets[index] != "" && aAssets[index] == "assets" )
      {
        ( assetsElement.addElement( "logical.name" ) ).setValue( aLogicalName[index] );
      }
    }    
  }  
  
  fCatalogItem.interface_info = xmlObject.toXMLString();

  return true;
}
