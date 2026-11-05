/** @fileoverview svcCatInterface - contains functions used for Service Catalog interface
*   @author Farahnaz Faegh
*/

/**
Constants
*/
var MODEL_FILE_NAME=lib.ProcessDesignerEnablement.isRequestEnabled()?"productCatalog":"model";

var logger = getLog("svcCatInterface");


/**
*   @class svcCatInterface
*   @constructor
*/
function svcCatInterface()
{
}

/** This function sets some global variables and required information for a service request
*   and returns the appropriate record to the RAD app in order to drive the service request
*	Example: cm3r record for change
*
*	@param {File} incident    - the incident record
*	@param {File} catalogItem - the svcCatalog record
*	@return File record to the RAD app
*   @type File
*/
function initInterface( fIncident, fCatalogItem )
{
  var strType;
  var strInterfaceName;
  var xmlString;
  var xmlObject;

  // Get the catalog info
  if ( fCatalogItem != null)
  {
    xmlObject        = new XML();
    var dCatalogItem = new SCDatum( fCatalogItem );
    strType          = dCatalogItem.type;
    strInterfaceName = dCatalogItem.interface_type; 
    xmlString        = dCatalogItem.interface_info;
    if ( xmlString == null ) {
    	xmlString="<info></info>";
    }
  }
  if (xmlObject.setContent(xmlString))
  {
	  // Get the catalog interface and set the values
	  var fSvcCatInterface = new SCFile("svcCatInterface", SCFILE_READONLY);
	  fSvcCatInterface.setFields(["record.type","xml.field","field.name","process.name"]);
	  var aXmlArray   = [];
	  var aFieldArray = [];
	  
	  if ( fSvcCatInterface.doSelect("interface.name=\""+strInterfaceName+"\"" ) == RC_SUCCESS )
	  {
	    var strRecordType = fSvcCatInterface.record_type;
	    
	    // Get the XML fields, field names, and expressions for this interface
	    aXmlArray = fSvcCatInterface.xml_field.toArray();
	    aFieldArray = fSvcCatInterface.field_name.toArray();
	    
	    var i;
	    var strField;
	    var strValue;
	    
	   	if ( strRecordType != null && strRecordType != "incidents" )
	    {
		    var fRecord = new SCFile( strRecordType );
		    
		    // Get the values for the corresponding fields from svcCatalog info block 
		    // and populate svcCatInterface table with the values
		    for ( i = 0; i < aXmlArray.length; i++ )
		    {
		      strField = aXmlArray[i];
		      strValue = getXMLFieldValueFromObject( xmlObject, strField );
		      if ( strValue != null && aFieldArray[i] != "") // && aXmlArray[i] == aFieldArray[i] ) 
		      {
		        try {
		          eval("fRecord." + aFieldArray[i] + "= strValue;");
		        }
		        catch (e) {
		          logger.error("initInterface", e.message);
		        }
		      }
		    }
		
		    // Set the global vars
		    
		    vars.$L_file = new SCDatum( fRecord );
		    vars.$L_file_save = new SCDatum( fRecord );
		    vars.$L_process = fSvcCatInterface.process_name;
			
		    return fRecord;
		}
	    else
	    {
		    // Get the values for the corresponding fields from svcCatalog info block 
		    // and populate svcCatInterface table with the values
		    for ( i = 0; i < aXmlArray.length; i++ )
		    {
		      strField = aXmlArray[i];
		      strValue = getXMLFieldValueFromObject( xmlObject, strField );
		      if ( strValue != null && aFieldArray[i] != "") { // && aXmlArray[i] == aFieldArray[i] )
		        try { 
		          eval("fIncident." + aFieldArray[i] + "= strValue;");
                }
                catch (e) {
                  logger.error("initInterface", e.message);
                }
		      }
		    }
		
		    // Set the global vars
		    
		    vars.$L_file =  fIncident ;
		    vars.$L_file_save =  fIncident ;
		    vars.$L_process = fSvcCatInterface.process_name;
		    
		    return null;
	    }
	  }
  }
  else
  {
	var msg = funcs.scmsg( 131, "ScriptLibrary", [strInterfaceName] );
	print(msg);
    
    return null;
  }
}

/**  This function takes a string of XML data and returns the value of a specific named element.
*    It is assumed that there is only one instance of the named element in the data. If more than 
*	 one element is encountered or the element is not found then NULL is returned.
*
*	@param {String} xmlInfo   	- the XML string
*	@param {String} strField 	- the target field in the XML
*	@return {Object} The target data in the XML string
*   @type String
*/
function getXMLFieldValue( xmlInfo, strField )
{	
  if ( xmlInfo == null)
  {

    return null;
  }
  
  var xmlObject = new XML();
	
  xmlObject.setContent(xmlInfo);
  var strVal = getXMLFieldValueFromObject ( xmlObject, strField ); 
    
  return strVal;
}

/**  This function takes an XML object and returns the value of a specific named element.
*    It is assumed that there is only one instance of the named element in the data. If more 
*    than one element is encountered or the element is not found then NULL is returned.
*
*	@param {XML} xmlObject   	- the XML 
*	@param {String} strField 	- the target field in the XML
*	@return {Object} The target data in the XML string
*   @type Object
*/
function getXMLFieldValueFromObject( xmlObject, strField )
{
  return findElement( xmlObject, strField );
 	
}

function findElement ( node, strField )
{
  	while (node != null && node.getNodeName() != strField )
  	{
  		var childNode = node.getFirstChildElement();
  		
  		if (childNode == null)
  		{
  		  	childNode = node.getNextSiblingElement();
  		  
  		  	while (childNode == null)
  		  	{
  		  	    node = node.getParentNode();
  		  	    
  		  	    // We're back to the top of the tree. 
  		  	    if ( node == null )
  		  	    {
  		  	    	return null;
  		  	    }
  		  		
  		  		childNode = node.getNextSiblingElement();	
  		  	}
  		  	
  		  	node = childNode;
  		}
  		else
  		{
  		   node = childNode;  
  		}
  	}
  	
  	return node.getText();
}

/**  This function takes an XML object and returns a value or an array of the values of a specific named element.
*
*	@param {String} xmlInfo   	- the XML string
*	@param {String} strField 	- the target field in the XML
*	@param {String} strNode 	- the target node (child element)in the XML
*	@return {Array} aArray      - the target data value(s) in the XML string
*   @type Array
*/
function getXMLValuesFromObject( xmlInfo, strField, strNode )
{
  if ( xmlInfo == null)
  {
	return null;
  }

  var xmlObject = new XML();
  
  xmlObject.setContent(xmlInfo);

  var strVal;
	
  // For elements that only have one instance in the xml block 
  if ( strNode == null )
  {
    strVal = findElement( xmlObject, strField );
    return strVal;  
  }
  
  var aArray = [];
  var nodes = xmlObject[ strNode ];
  
  // Populate the array if there are line items 
  if ( nodes != null )
  {
    var childNode = nodes.getFirstChildElement();
    var index = 0;

    while ( childNode != null )
    {
      strVal = findElement( childNode, strField );
    
      if ( strVal !=null )      
      {
        aArray[index] = strVal;
        index++;
      }
      childNode = childNode.getNextSiblingElement();
    }
  }
  return aArray;
}

/**  This function takes an XML object and sets an array of the values of 
*    specific named elements for the wizard to display. This sets the parts
*    for a request to be displayed in the wizard.
*
*	@param {String} xmlInfo   	- the XML string
*	@param {String} strField 	- the target field in the XML
*	@param {String} strNode 	- the target node (child element)in the XML
*	@param {String}  modelFileName	 - the model file name, if it is not specified, use MODEL_FILE_NAME
*	@return {Boolean} true      - true
*   @type Boolean
*/
function setPartLineItems( xmlString , modelFileName)
{
  var aPart= [];
  var aVendor = [];

  if ( xmlString != null )
  {
    var xml = new XML();
    xml.setContent( xmlString );

    aPart   = getXMLValuesFromObject( xmlString, "partno", "parts" );

    var msg;
    var index;
    for ( index = 0; index < aPart.length; index++ )
    {
      var fileName = MODEL_FILE_NAME;
      if(modelFileName!=null) {
          fileName = modelFileName;
      }
      
      var fModelFile = new SCFile( fileName, SCFILE_READONLY );

      if ( fModelFile.setFields(["part.desc","manufacturer"]).doSelect( "part.no=\"" + aPart[index] + "\"" ) == RC_SUCCESS )
      {
        var part = fModelFile.part_desc;
        var strCategory = getCategory( aPart[index] ,modelFileName );
        vars.$part = funcs.insert( vars.$part, 0, 1, part );
        vars.$component_part_no  = funcs.insert( vars.$component_part_no, 0, 1, aPart[index] );
        vars.$component_category = funcs.insert( vars.$component_category, 0, 1, strCategory );
      }
      else
      {
		msg = funcs.scmsg(132, "ScriptLibrary", [aPart[index]]);
		print(msg);
      }
    }        

    aVendor = getXMLValuesFromObject( xmlString, "vendorno", "parts" );
    var fVendorFile = new SCFile( "modelvendor", SCFILE_READONLY );
    
    for ( index = 0; index < aVendor.length; index++ )
    {
      if ( fVendorFile.setFields(["vendor"]).doSelect( "part.no=\"" + aPart[index] + "\"" ) == RC_SUCCESS )        
      {
        var vendor = fVendorFile.vendor;
        vars.$vendor = funcs.insert( vars.$vendor, 0, 1, vendor );
      }
      else // If there is no vendor in the vendor table, then replace with the manufacturer from the model table
      {
        vars.$vendor = funcs.insert( vars.$vendor, 0, 1, fModelFile.manufacturer );
		msg = funcs.scmsg(133, "ScriptLibrary", [aPart[index]]);
		print(msg);
      }
    }      

    vars.$qty = getXMLValuesFromObject( xmlString, "quantity", "parts" );
    vars.$option = getXMLValuesFromObject( xmlString, "option", "parts" );

    // Now display groups and dependencies
    var aComponentGroup = getXMLValuesFromObject( xmlString, "group", "parts" );
 
    if ( aComponentGroup != null ) {
      for ( index = 0; index < aComponentGroup.length; index++ ) {
        vars.$component_group = funcs.insert( vars.$component_group, 0, 1, aComponentGroup[index] );
      } 

      //generate a unique group name array
      vars.$component_group_unqiue = lib.ArrayUtil.removeDuplicateDatumElement(vars.$component_group);
    }

	var childNode;
	var strVal;
    var parentGrpNode = xml[ "parent_group" ];      

    if ( parentGrpNode != null )
    {
      childNode = parentGrpNode.getFirstChildElement();

      while ( childNode != null && childNode.getNodeName() == "item" )
      {
        strVal = findElement( childNode, "item" );
        vars.$parent_group = funcs.insert( vars.$parent_group, 0, 1,strVal );
        childNode = childNode.getNextSiblingElement();
      }
    }
    
    var dependentGrpNode = xml[ "dependent_group" ];      

    if ( dependentGrpNode != null )
    {
      childNode = dependentGrpNode.getFirstChildElement();
      while ( childNode != null && childNode.getNodeName() == "item" )
      {
        strVal = findElement( childNode, "item" );
        vars.$dependent_group = funcs.insert( vars.$dependent_group, 0, 1,strVal );
        childNode = childNode.getNextSiblingElement();
      }
    }

    var dependTypeGrpNode = xml[ "dependency_group" ];      

    if ( dependTypeGrpNode != null )
    {
      childNode = dependTypeGrpNode.getFirstChildElement();
      while ( childNode != null && childNode.getNodeName() == "item" )
      {
        strVal = findElement( childNode, "item" );
        vars.$dependency_type = funcs.insert( vars.$dependency_type, 0, 1,strVal );
        childNode = childNode.getNextSiblingElement();
      }
    }
  }  
  return true;
}

/**  This function takes an string as the part description and returns the corresponding
*    value for the part number of that record from the model table.
*
*	@param {String} strPartDesc	- the part description
*	@param {String}  modelFileName	 - the model file name, if it is not specified, use MODEL_FILE_NAME
*	@return {String} part_no 	- the part number of the corresponding record
*   @type String
*/
function getPartNo( strPartDesc, modelFileName )
{
  var fileName = MODEL_FILE_NAME;
  if(modelFileName!=null) {
      fileName = modelFileName;
  }
  var fModelFile = new SCFile( fileName, SCFILE_READONLY );
  
  if ( fModelFile.setFields(["part.no"]).doSelect( "part.desc=\"" + strPartDesc + "\"" ) == RC_SUCCESS ) {
    return fModelFile.part_no;
  }
  else
  {
	var msg = funcs.scmsg(134, "ScriptLibrary", [strPartDesc]);
	print(msg);
  }
}

/**  This function takes an string as the part number and returns the corresponding
*    value for the vendor number from the vendor table.
*
*	@param {String} strPartNo	- the part number
*	@return {String} modelv_no 	- the vendor number of the corresponding record in the
*                                 vendor table  
*   @type String
*/
function getVendorNo( strPartNo )
{
  var fVendorFile = new SCFile( "modelvendor", SCFILE_READONLY );
  
  if ( fVendorFile.setFields(["modelv.no"]).doSelect( "part.no=\"" + strPartNo + "\"" ) == RC_SUCCESS ) {
    return fVendorFile.modelv_no;
  }
  else
  {
	var msg = funcs.scmsg(135, "ScriptLibrary", [strPartNo]);
	print(msg);
    
    return 0;
  }
}

/**  This function takes an string as the part number and returns the corresponding
*    value for the category of that record from the model table.
*
*	@param {String}  strPartNo	 - the part number
*	@param {String}  modelFileName	 - the model file name, if it is not specified, use MODEL_FILE_NAME
*	@return {String} strCategory - the category of the corresponding record
*   @type String
*/
function getCategory( strPartNo , modelFileName )
{
  var fileName = MODEL_FILE_NAME;
  if(modelFileName!=null) {
      fileName = modelFileName;
  }
  var fModelFile = new SCFile( fileName, SCFILE_READONLY );

  if ( fModelFile.setFields(["category"]).doSelect( "part.no=\"" + strPartNo + "\"" ) == RC_SUCCESS ) {
    return fModelFile.category;
  }
  else
  {
  	var msg = funcs.scmsg(134, "ScriptLibrary", [strPartNo]);
	print(msg);
  }
}


/** This function is used to convert the ServiceCenter thread variables for part 
*   line items back into a String representation of XML that can be written to a record.
*	@param	{Array}		fieldName	- The array of the element names for the XML
*	@param	{Array}		fieldValue	- The array containing the values for the elements
*
*	@return The XML String representation of the XML object.
*/
function writeParts( fieldName1, fieldValue1 )
{
  var xml = new XML();
  var fieldName= [];
  var fieldValue= [];
  fieldName=fieldName1.toArray();
  fieldValue=fieldValue1.toArray();
  var partsElement;
  var partElement;
  var element;
  var infoString = "<info> </info>";
  var xmlInfo;
  var bAddDepend = false;

  xml.setContent( infoString );

  if ( fieldName != null )
  {
	var i;
    for (i = 0; i < fieldName.length; i++ )
    {	

      if ( fieldName[i] != null )
	  {

        if ( fieldName[i] == "parts" && partsElement == null )
        {
          partsElement = xml.addElement( "parts" );
          partsElement.setValue( "" );
        }  

        else if ( fieldName[i] == "part" )
        {
          if ( partsElement == null )
          {
            partsElement = xml.addElement( "parts" );
          }

          partElement = partsElement.addElement( "part" );
          partElement.setValue( "" );
        }   

	    else if ( fieldName[i] == "partno" || fieldName[i] == "vendorno" || fieldName[i] == "quantity" || fieldName[i] == "option" || fieldName[i] == "group" )
        {
          var childElement = partElement.addElement( fieldName[i] );
          childElement.setValue( fieldValue[i] );
        }

        else if ( fieldName[i] == "parent_group" || fieldName[i] == "dependent_group" || fieldName[i] == "dependency_group" || fieldName[i] == "item" )
        {
          bAddDepend = true;
        }  
 
        else
        {
           element = xml.addElement( fieldName[i] );  
           element.setValue( fieldValue[i] );
	    }
      }  
    }
    xmlInfo = xml.toXMLString();
    
    // If there is a parent or dependent group, the we need to add them
    var aParentGroup = [];
    var aDependGroup = [];

    if ( vars.$parent_group.length() > 0 )
    {
      aParentGroup = vars.$parent_group.toArray();
    }

    if ( vars.$dependent_group.length() > 0 )
    {
      aDependGroup = vars.$dependent_group.toArray();
    }

    if (aDependGroup.length > 0 || aParentGroup.length > 0)
    {
      bAddDepend = true;
    }
    
    if ( bAddDepend )
    {
      xmlInfo = writeGroups( xmlInfo, vars.$parent_group, vars.$dependent_group, vars.$dependency_type );
    }
  }

  return xmlInfo;
}

function writeGroups( xmlInfo, aParent_group, aDependent_group, aDependType_group )
{
  if ( xmlInfo == null)
  {
	return null;
  }
 
  var xmlObject = new XML();
  
  xmlObject.setContent(xmlInfo);

  var nodes = xmlObject[ "parts" ];

  if ( nodes != null )
  {
  	var i;
  	var iCount;
  	var itemNode;
  	
    // Now add the parent group, dependent group, and dependency type array to the main xml node. 
    var node = nodes.getParentNode();
    var parentGroup = node[ "parent_group" ];

    var aParent = [];

    if ( aParent_group.length() > 0 )
    {
      aParent = aParent_group.toArray();
    }
	
    if ( parentGroup != null )
    {
      iCount = 0;
      itemNode = parentGroup.getFirstChildElement();

      while ( itemNode != null && itemNode.getNodeName() == "item" )
      {
        itemNode.setValue(aParent[iCount]);
        iCount++;   
        itemNode = itemNode.getNextSiblingElement();
      }  

    }
    // when there is no parent.group and this is the first time adding 
    else
    {
      parentGroup = node.addElement( "parent_group" );
 
      for ( i = 0; i < aParent.length; i++ )
      {
        (parentGroup.addElement( "item" )).setValue(aParent[i]);
      }  
    }

    var dependentGroup = node[ "dependent_group" ];
    var aDependent = [];

    if ( aDependent_group.length() > 0 ) {
      aDependent = aDependent_group.toArray();
    }

    if ( dependentGroup != null )
    {
      iCount = 0;
      itemNode = dependentGroup.getFirstChildElement();

      while ( itemNode != null && itemNode.getNodeName() == "item" )
      {
        itemNode.setValue(aDependent[iCount]);
        iCount++;   
        itemNode = itemNode.getNextSiblingElement();
      }  
    }  
    // when there is no dependent.group and this is the first time adding 
    else
    {
      dependentGroup = node.addElement( "dependent_group" );
      
      for ( i = 0; i < aDependent.length; i++ )
      {
        (dependentGroup.addElement( "item" )).setValue(aDependent[i]);
      }
    }

    var dependTypeGroup = node[ "dependency_group" ];
    var aDependType = [];

    if ( aDependType_group.length() > 0 ) {
      aDependType = aDependType_group.toArray();
    }

    if ( dependTypeGroup != null )
    {
      iCount = 0;
      itemNode = dependTypeGroup.getFirstChildElement();

      while ( itemNode != null && itemNode.getNodeName() == "item" )
      {
        itemNode.setValue(aDependType[iCount]);
        iCount++;   
        itemNode = itemNode.getNextSiblingElement();
      }  

    }
    // when there is no dependency.group and this is the first time adding 
    else
    {
      dependTypeGroup = node.addElement( "dependency_group" );
 
      for ( i = 0; i < aDependType.length; i++ )
      {
        (dependTypeGroup.addElement( "item" )).setValue(aDependType[i]);
      }  
    }
  }
  
  return xmlObject.toXMLString();
}



/** This function is used to set ServiceCenter thread variables for components of a part. 
*   
*	@param  {String} xmlString 			- the XML string
*	@param	{Array}	aParts				- The components part number array
*	@param	{Array}	aQty            	- The components quantity array
*	@param	{Array}	aOption         	- The components option type array
*
*	@return {Boolean} true 				- true
*/
function displayComponents( xmlString, aParts, aPartsDesc, aQtys, aOptions )
{
  var aPart     = [];
  var aPartDesc = [];
  var aQty      = [];
  var aOption   = []; 

  aPart     = aParts.toArray();
  aPartDesc = aPartsDesc.toArray();
  aQty      = aQtys.toArray();
  aOption   = aOptions.toArray();

  var lng = aPart.length;
	
  var i;
  for ( i = 0; i < lng; i++ )
  {
    var strCategory = getCategory( aPart[i] );

    if ( vars.$component_part_no != null ) {
      vars.$component_part_no = funcs.denull( vars.$component_part_no );
    }	
    vars.$component_part_no   = funcs.insert( vars.$component_part_no, 0, 1, aPart[i] );
 
    if ( vars.$component_category != null ) {
      vars.$component_category = funcs.denull( vars.$component_category );
    }	
    vars.$component_category   = funcs.insert( vars.$component_category, 0, 1, strCategory );

    if ( vars.$component_description != null ) {
      vars.$component_description = funcs.denull( vars.$component_description );
    }	
    vars.$component_description   = funcs.insert( vars.$component_description, 0, 1, aPartDesc[i] );

    if ( vars.$component_option_type != null ) {
      vars.$component_option_type = funcs.denull( vars.$component_option_type );
    }	
    vars.$component_option_type   = funcs.insert( vars.$component_option_type, 0, 1, aOption[i] );

    if ( vars.$component_qty != null ) {
      vars.$component_qty = funcs.denull( vars.$component_qty );
    }	
    vars.$component_qty   = funcs.insert( vars.$component_qty, 0, 1, funcs.val( aQty[i],1 ) );
  }

  if ( xmlString != null )
  {
    var xml = new XML();
    xml.setContent( xmlString );

    var aComponentGroup = getXMLValuesFromObject( xmlString, "group", "parts" );
 
    if ( aComponentGroup != null ) {
      var index; 
      for ( index = 0; index < aComponentGroup.length; index++ ) {
        vars.$component_group = funcs.insert( vars.$component_group, 0, 1, aComponentGroup[index] );
      }

	  //generate a unqiue group name array
      vars.$component_group_unqiue = lib.ArrayUtil.removeDuplicateDatumElement(vars.$component_group);
    }

    var parentGrpNode = xml[ "parent_group" ];      
	var childNode;
	var strVal;
	
    if ( parentGrpNode != null )
    {
      childNode = parentGrpNode.getFirstChildElement();

      while ( childNode != null && childNode.getNodeName() == "item" )
      {
        strVal = findElement( childNode, "item" );
        vars.$parent_group = funcs.insert( vars.$parent_group, 0, 1,strVal );
        childNode = childNode.getNextSiblingElement();
      }
    }
    
    var dependentGrpNode = xml[ "dependent_group" ];      

    if ( dependentGrpNode != null )
    {
      childNode = dependentGrpNode.getFirstChildElement();
      while ( childNode != null && childNode.getNodeName() == "item" )
      {
        strVal = findElement( childNode, "item" );
        vars.$dependent_group = funcs.insert( vars.$dependent_group, 0, 1,strVal );
        childNode = childNode.getNextSiblingElement();
      }
    }

    var dependTypeGrpNode = xml[ "dependency_group" ];      

    if ( dependTypeGrpNode != null )
    {
      childNode = dependTypeGrpNode.getFirstChildElement();
      while ( childNode != null && childNode.getNodeName() == "item" )
      {
        strVal = findElement( childNode, "item" );
        vars.$dependency_type = funcs.insert( vars.$dependency_type, 0, 1,strVal );
        childNode = childNode.getNextSiblingElement();
      }
    }
  }

  return true;
}

/** This function is used to add dependencies for the request lines of a request
*   
*	@param	{String}	thisParent		- The parent group to be added
*	@param	{String}	thisDependent   - The dependent group to be added
*	@param	{String}	thisDependType  - The dependency type to be added
*
*	@return {Boolean} true 				- true
*/
function addDependencies( thisParent, thisDependent,thisDependType )
{
  var bFound=false;
  var aParent     = [];
  var aDependent  = [];

  if ( vars.$parent_group.length() > 0 ) {
    aParent = vars.$parent_group.toArray();
  }

  if ( vars.$dependent_group.length() > 0 ) {
    aDependent  = vars.$dependent_group.toArray();
  }

  if ( aParent != null ) {
    aParent = funcs.denull( aParent );
  }	

  if ( aDependent != null ) {
    aDependent = funcs.denull( aDependent );
  }	

  if ( vars.$dependency_type.length() > 0 ) {
    vars.$dependency_type = funcs.denull( vars.$dependency_type );
  }	

  if ( thisParent != null && thisDependent !=null )
  {
    if ( aParent.length() > 0 && aDependent.length() > 0 )
    {
      var iCount=1;
      var index=1;

      while ( index > 0 ) 
      {
        index=funcs.index(thisParent, aParent, iCount);

        // subtract one from the index since the index function in RAD starts at 1
        // and the array index in ordinary world starts at 0.
        var iPair = index - 1;

        if ( index > 0 && aDependent[iPair] == thisDependent ) 
        {  
          bFound = true;
          if ( thisDependType != null ) {
            vars.$dependency_type[iPair] = thisDependType;
          }
          index = 0;
        }   
 
        else if ( index > 0 && aDependent[iPair] != thisDependent )
        { 
          iCount = index + 1;
          bFound = true;
          vars.$dependent_group[iPair] = thisDependent;

          if ( thisDependType != null ) {
            vars.$dependency_type[iPair] = thisDependType;
          }
        }

        else {
          bFound = false;
        }
      }  
    }
  }

  if ( !bFound )  
  {    
    if ( thisParent != null && thisParent != "" ) {
      vars.$parent_group = funcs.insert( vars.$parent_group, 0, 1,thisParent );
    }

    if ( thisDependent != null && thisDependent != "" ) {
      vars.$dependent_group = funcs.insert( vars.$dependent_group, 0, 1,thisDependent );
    }

    if ( thisDependType != null && thisDependType != "" ) {
      vars.$dependency_type = funcs.insert( vars.$dependency_type, 0, 1,thisDependType );
    }
  }

  return true;
}


/** This function is used to write the dependencies info for parts of a request 
*   to the xml string. 
*   
*	@param  {String} xmlInfo   			- the XML string
*	@param	{Array}	aComponent_group	- The components part number array
*	@param	{Array}	aParent_group      	- The components quantity array
*	@param	{Array}	aDependent_group   	- The components option type array
*
*	@return The XML String representation of the XML object.
*/
function writeDependencies( xmlInfo, aComponent_group, aParent_group, aDependent_group, aDependType_group )
{
  if ( xmlInfo == null)
  {
	return null;
  }
 
  var xmlObject = new XML();
  var componentGroup;
  
  xmlObject.setContent(xmlInfo);

  var nodes = xmlObject[ "parts" ];

  if ( nodes != null )
  {
    var childNode = nodes.getFirstChildElement();

    if ( aComponent_group != null )
    {
      var index = 0; 

      while ( childNode != null && childNode.getNodeName() == "part" )
      {
        componentGroup = childNode[ "group" ];

        if ( componentGroup != null ) {
          componentGroup.setValue( aComponent_group[index] );
        }
        else {
          (childNode.addElement( "group" )).setValue(aComponent_group[index]);
        }

        index++;
        childNode = childNode.getNextSiblingElement();
      }  
    }

	var i;
	var iCount;
	var itemNode;
	
    // Now add the parent group, dependent group, and dependency type array to the main xml node. 
    var node = nodes.getParentNode();

    var parentGroup = node[ "parent_group" ];
    var aParent = [];

    if ( aParent_group.length() > 0 ) {
      aParent = aParent_group.toArray();
    }

    if ( parentGroup != null )
    {
      iCount = 0;
      itemNode = parentGroup.getFirstChildElement();

      while ( itemNode != null && itemNode.getNodeName() == "item" )
      {
        itemNode.setValue(aParent[iCount]);
        iCount++;   
        itemNode = itemNode.getNextSiblingElement();
      }  

    }
    // when there is no parent.group and this is the first time adding 
    else
    {
      parentGroup = node.addElement( "parent_group" );
 
      for ( i = 0; i < aParent.length; i++ )
      {
        (parentGroup.addElement( "item" )).setValue(aParent[i]);
      }  
    }

    var dependentGroup = node[ "dependent_group" ];
    var aDependent = [];

    if ( aDependent_group.length() > 0 ) {
      aDependent = aDependent_group.toArray();
    }

    if ( dependentGroup != null )
    {
      iCount = 0;
      itemNode = dependentGroup.getFirstChildElement();

      while ( itemNode != null && itemNode.getNodeName() == "item" )
      {
        itemNode.setValue(aDependent[iCount]);
        iCount++;   
        itemNode = itemNode.getNextSiblingElement();
      }  
    }  
    // when there is no dependent.group and this is the first time adding 
    else
    {
      dependentGroup = node.addElement( "dependent_group" );
      
      for ( i = 0; i < aDependent.length; i++ )
      {
        (dependentGroup.addElement( "item" )).setValue(aDependent[i]);
      }
    }

    var dependTypeGroup = node[ "dependency_group" ];
    var aDependType = [];

    if ( aDependType_group.length() > 0 ) {
      aDependType = aDependType_group.toArray();
    }

    if ( dependTypeGroup != null )
    {
      iCount = 0;
      itemNode = dependTypeGroup.getFirstChildElement();

      while ( itemNode != null && itemNode.getNodeName() == "item" )
      {
        itemNode.setValue(aDependType[iCount]);
        iCount++;   
        itemNode = itemNode.getNextSiblingElement();
      }  

    }
    // when there is no dependency.group and this is the first time adding 
    else
    {
      dependTypeGroup = node.addElement( "dependency_group" );
 
      for ( i = 0; i < aDependType.length; i++ )
      {
        (dependTypeGroup.addElement( "item" )).setValue(aDependType[i]);
      }  
    }
  }

  return xmlObject.toXMLString();
}

/** This function is used to convert the ServiceCenter thread variables for Change 
*   information back into a String representation of XML that can be written to a record.
*	@param	{String}	strtype				- The type of MAC change.
*	@param	{String}	strinitialimpact		- The inital impact value.
*	@param	{String}	strseverity 		- The change severity value.
*	@param	{String}	strreasonvalue		- The reason for change value.
*	@param	{String}	strcoordinatorvalue	- The change coordinator value.
*	@param	{String}	strcategory			- The change category value.
*	@param	{String}	strreltype			- The change release type value.
*
*	@return The XML String representation of the XML object.
*/
function writeChange( assets, strtype, strinitialimpact, strseverity, strreasonvalue, 
                        strcoordinatorvalue, strcategory, strsubcat, strdept,strreltype,
                        strservice, strdate, strChangeModel, strChangeModelName )
{
  var strType;
  var xml = new XML();
  var infoString = "<info> </info>";
  xml.setContent( infoString );
  
  if (strcategory == "RFC - Advanced" || strcategory == "RFC")
  {
    var assetsElement = xml.addElement( "assets" );

    if ( assets.length() > 0 ) {
      assets = funcs.denull( assets );
    }	

    var i = 0;
    while (i < assets.length())
    {
  	  (assetsElement.addElement("logical.name")).setValue(assets[i]);
  	  i++;
    }
  }
  if (strcategory != null)
  {
    (xml.addElement( "category" )).setValue(strcategory); 
  }
  
  if (strtype != null && strtype != "")
  { 
    (xml.addElement( "type" )).setValue(strtype);
  }
  
  if (strinitialimpact != null)
  {
    (xml.addElement( "initial.impact" )).setValue(strinitialimpact);
  }
  
  if (strseverity != null)
  {
    (xml.addElement( "severity" )).setValue(strseverity);
  }
  
  if (strreasonvalue != null)
  {
    (xml.addElement( "reason" )).setValue(strreasonvalue);
  }
  
  if (strcoordinatorvalue != null && ( strcategory == "RFC" || strcategory == "Release Management" ) )
  {
    (xml.addElement( "coordinator" )).setValue(strcoordinatorvalue);
  }
  
  if (strsubcat != null)
  {
    (xml.addElement( "subcategory" )).setValue(strsubcat);  
  }

  if (strdept != null)
  {
    (xml.addElement( "assign.dept" )).setValue(strdept);  
  }

  if (strreltype != null && strcategory == "Release Management")
  {
    (xml.addElement( "release.type" )).setValue(strreltype);  
  }
  
  if (strservice != null )
  {
    (xml.addElement( "affected.item" )).setValue(strservice);  
  }
  
  if (strdate != null )
  {
    (xml.addElement( "requestedDate" )).setValue(strdate);  
  }
  
  if (strChangeModel != null )
  {
    (xml.addElement( "changeModel" )).setValue(strChangeModel);  
  }  
  
  if (strChangeModelName != null )
  {
    (xml.addElement( "changeModelName" )).setValue(strChangeModelName);  
  }  
    
  return xml.toXMLString();  
}

/**  This function takes an XML object and sets an array of the values of 
*    specific named elements for the wizard to display. This sets the values
*	 for the various change requests.
*
*	@param {String} xmlInfo   	- the XML string
*	@return {Boolean} true      - true
*   @type Boolean
*
*/
function setChangeInfo( xmlString )
{
  if ( xmlString != null )
  {
    var xml = new XML();
    xml.setContent( xmlString );
    
    var strType = findElement( xml, "type" );
	var strInitialImpact = findElement ( xml, "initial.impact" );
	var strSeverity = findElement ( xml, "severity" );
    var strReason = findElement ( xml, "reason" );
    var strCoordinator = findElement ( xml, "coordinator" );
    var strCategory = findElement ( xml, "category" );
    var strSubcategory = findElement( xml, "subcategory" );
    var strDept = findElement ( xml, "assign.dept" );
    var strRelType = findElement ( xml, "release.type" );
    var strService = findElement ( xml, "affected.item" );
    var strDate = findElement ( xml, "requestedDate" );
	var aAssets = getXMLValuesFromObject(xmlString, "logical.name", "assets");
	
    vars.$changeModel = findElement ( xml, "changeModel" );
	vars.$changeModelName = findElement ( xml, "changeModelName" );
    
    if (strType != null)
    {
      vars.$type = strType;
    }
    
    if (strInitialImpact != null)
    {
      vars.$initial_impact = strInitialImpact;    
    }
    
    if (strSeverity != null)
    {
      vars.$severity = strSeverity;    
    }
    
    if (strReason != null)
    {
      vars.$reasonvalue = strReason;    
    }
    
    if (strCoordinator != null)
    {
      vars.$coordinatorvalue = strCoordinator;    
    }
    
    if (strCategory != null)
    {
      vars.$category = strCategory;    
    }

    if (strDept != null)
    {
      vars.$assign_dept = strDept;    
    }
    
    if (strRelType != null)
    {
      vars.$rel_type = strRelType;    
    }

    if (strSubcategory != null)
    {
      vars.$subcategory = strSubcategory;    
    }
    
    if (aAssets != null)
    {
      vars.$wiz_assets = aAssets;
    }
    
    if (strService != null)
    {
      vars.$service = strService;
      var ids=new SCDatum(8);
      ids.push(vars.$service);
      vars.$service_value = [];
      vars.$service_display = [];
      lib.DisplayName.getDisplayNamesByIds("device",ids,vars.$service_value,vars.$service_display);
    }
    
    if (strDate != null)
    {
      vars.$requestedDate = strDate;
    }
    
  }
            
  return true;
}


/** This function is used to get an array of XML variables with a specific value. Usually, the XML 
*   will come from a dynamic form
*   
*   @parm 	{String} 	strXML 			-	The incoming XML.
*	@parm 	{String}	strNodeName		-	The nodes to be examined.
*	@parm	{String}	strAttrName		-	The attribute to be returned.
*	@parm	{String}	strSearchValue	-	The value to be searched for.
*
*	@return An array of attribute values.
*/

function searchXMLNodesForValue( strXML, strNodeName, strAttrName, strSearchValue )
{
  if ( strXML == null)
  {
	return null;
  }

  var xmlObject = new XML();
  
  xmlObject.setContent(strXML);

  var aArray = [];
  var nodes = xmlObject[ strNodeName ];
  
  // Populate the array if there are line items 
  if ( nodes != null )
  {
    var childNode = nodes.getFirstChildElement();
    var index = 0;

    while ( childNode != null )
    {
      var strVal = findElement( childNode, strField );
    
      if ( strVal == strSearchValue )      
      {        
        aArray[index] = childNode.getAttributeValue(strAttrName);
        index++;
      }
      childNode = childNode.getNextSiblingElement();
    }
  }
  return aArray;
}


/**  This function takes an XML object and sets an array of the values of 
*    specific named elements for the wizard to display. This sets the values
*	 for the various fields for a web service request.
*
*	@param {String} xmlInfo   	- the XML string
*	@return {Boolean} true      - true
*   @type Boolean
*/
function setWebServiceRecordInfo( xmlString )
{
  if ( xmlString != null )
  {
    var xml = new XML();
    xml.setContent( xmlString );
    
    var strPart = findElement( xml, "partNumber" );
    
    if ( strPart != null )
    {
      vars.$value = strPart;
    }

  }
            
  return true;
}


/** This function is used to convert the ServiceCenter thread variables for Web Service request 
*   back into a String representation of XML that can be written to a record.
*	@param	{String}	partnumber			- The partnumber value.
*
*	@return The XML String representation of the XML object.
*/
function writeWebServiceFieldChanges( strPartNumber )
{
  var xml = new XML();
  var infoString = "<info> </info>";
  xml.setContent( infoString );
  
  if ( strPartNumber != null && strPartNumber != "" )
  {
    (xml.addElement( "partNumber" )).setValue(strPartNumber); 
  }

  return xml.toXMLString();  
}

/**  This function takes an XML object and sets an array of the values of 
*    specific named elements for the wizard to display. This sets the values
*	 for the various incident request.
*
*	@param {String} xmlInfo   	- the XML string
*	@return {Boolean} true      - true
*   @type Boolean
*
*/
function setIncidentInfo( xmlString )
{
  if ( xmlString != null )
  {
    var xml = new XML();
    xml.setContent( xmlString );
    
    var strService = findElement ( xml, "affected.item" );
    var strAssignment = findElement ( xml, "assignment" );
    
    if (strService != null)
    {
      vars.$service = strService;
      var ids=new SCDatum(8);
      ids.push(vars.$service);
      vars.$service_value = [];
      vars.$service_display = [];
      lib.DisplayName.getDisplayNamesByIds("device",ids,vars.$service_value,vars.$service_display);
    }
    if (strAssignment != null)
    {
      vars.$assignment = strAssignment;    
    }
    
  }
            
  return true;
}

/** This function is used to convert the ServiceCenter thread variables for Incident 
*   information back into a String representation of XML that can be written to a record.
*	@param	{String}	strservice				- The Service CI.
*	@param	{String}	strassignment		- The assignment group.
*
*	@return The XML String representation of the XML object.
*/
function writeInsert( strservice, strassignment )
{
  var strType;
  var xml = new XML();
  var infoString = "<info> </info>";
  xml.setContent( infoString );
 
  if (strservice != null )
  {
    (xml.addElement( "affected.item" )).setValue(strservice);  
  }
  if (strassignment != null)
  {
    (xml.addElement( "assignment" )).setValue(strassignment);  
  }
  return xml.toXMLString();  
}


/**  This function takes an XML object and sets an array of the values of 
*    specific named elements for the wizard to display. This sets the values
*	 for the various requests.
*
*	@param {String} xmlInfo   	- the XML string
*	@return {Boolean} true      - true
*   @type Boolean
*
*/
function setRequestInfo( xmlString )
{
  if ( xmlString != null )
  {
    var xml = new XML();
    xml.setContent( xmlString );
    
    var strCategory = findElement ( xml, "category" );
    var strSubcategory = findElement( xml, "subcategory" );
    var strDepartment = findElement( xml, "department" );
    var strCompany = findElement( xml, "company" );
    var strRequestModel= findElement ( xml, "requestModel" );
	var strRequestModelName = findElement ( xml, "requestModelName" );
    var strAssignGroup = findElement ( xml, "assigngroup" );
    var strImpact = findElement ( xml, "impact" );
    var strSeverity = findElement ( xml, "severity" );
    
    if (strCategory != null)
    {
      vars.$category = strCategory;    
    }
    
    if (strSubcategory != null)
    {
      vars.$subcategory = strSubcategory;    
    }
     
    if (strDepartment != null)
    {
      vars.$department = strDepartment;    
    }
    
    if (strCompany!= null)
    {
      vars.$company = strCompany;    
    }
    if (strRequestModel!= null)
    {
      vars.$requestModel = strRequestModel;    
    }
    
    if (strRequestModelName!= null)
    {
      vars.$requestModelName = strRequestModelName;    
    }
     
     if (strImpact != null)
    {
      vars.$impact = strImpact;    
    }
     
     if (strSeverity != null)
    {
      vars.$severity = strSeverity;    
    }
  
    if (strAssignGroup != null)
    {
      vars.$assigngroup = strAssignGroup;    
    }
   
  }
            
  return true;
}

/** This function is used to convert the ServiceCenter thread variables for Request 
*   information back into a String representation of XML that can be written to a record.
*	@param	{String}	strCategory			- The request category value.
*   @param	{String}	strSubcategory      - The request sub category value
*   @param	{String}	strDepartment       - The request bill to department value
*   @param	{String}	strCompany          - The request company value
*	@param	{String}	strPriority			- The request priority value.
*   @param	{String}	strAssignGroup	    - The request assignment group value.
*   @param	{String}	strRequestModel	    - The request request model id value.
*   @param	{String}	strRequestModelName	   - The request request model name value.
*	@return The XML String representation of the XML object.
*/
function writeRequest(strCategory, strSubcategory,strDepartment,strCompany,strRequestModel,strRequestModelName,strAssignGroup,strImpact,strSeverity)
{
  var strType;
  var xml = new XML();
  var infoString = "<info> </info>";
  xml.setContent( infoString );
  
  if (strCategory != null)
  {
    (xml.addElement( "category" )).setValue(strCategory); 
  }
  
  if (strSubcategory != null)
  {
    (xml.addElement( "subcategory" )).setValue(strSubcategory);  
  }
  
  if (strDepartment != null)
  {
    (xml.addElement( "department" )).setValue(strDepartment);  
  }
  
   if (strCompany != null)
  {
    (xml.addElement( "company" )).setValue(strCompany);  
  }
   
  if (strRequestModel != null )
  {
    (xml.addElement( "requestModel" )).setValue(strRequestModel);  
  }  
  
   if (strRequestModelName != null )
  {
    (xml.addElement( "requestModelName" )).setValue(strRequestModelName);  
  }  
  
   if (strImpact != null)
  {
    (xml.addElement( "impact" )).setValue(strImpact);
  }
  
   if (strSeverity != null)
  {
    (xml.addElement( "severity" )).setValue(strSeverity);
  }
  
  
  if (strAssignGroup != null)
  {
    (xml.addElement( "assigngroup" )).setValue(strAssignGroup);  
  }

  return xml.toXMLString();  
}