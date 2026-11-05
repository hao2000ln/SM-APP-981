/** @fileoverview setUserOptions

*   @author Farahnaz Faegh
*/

/** This function takes the information passed for the record in the optionList and 
*   the optionOptions from the Catalog Item and sets the options field for the record.
*
*	@param {optionList}       - Options for the record
*	@param {optionOptions}    - Sub options belonging to above options in the record
*	@return Boolean success or failure
*   @type Boolean
*/
function setUserOptions( fCatalogItem, optionList, optionOptions )
{

  var xmlString;
  var xmlObject = new XML();

    // If adding new options or updating options 
    fCatalogItem.options = "<form></form>";


  xmlString = fCatalogItem.options;
  if ( !xmlObject.setContent( xmlString ) )
  {
  	fCatalogItem.options = "<form></form>";
  	return false;
  }
  
  // Create arrays to store different attributes of the options
  var types        = new Array();
  var ids          = new Array();
  var labels       = new Array();
  var attributes   = new Array();
  var attrValues   = new Array();
  
  var optionIds    = new Array();
  var suboptionIds = new Array();
  var optionLabels = new Array();
  var index = 0;
  var strOption;
  var strOptions;
  
  var comma = 0;
    
  // Walk through optionList to get the ids, labels, attributes, and 
  // attribute values to populate the arrays.
  if ( optionList != null )
  {
    
    var next1;
    var next2;
    var next3;
    var next4;
    var next5;
	  	
    for ( var j = 0; comma < optionList.length; j++ )     
    {
	  strOption = optionList;
	  next1 = strOption.indexOf( ',', comma );
      types[j] = optionList.slice( comma, next1 );
      next2 = strOption.indexOf( ',', next1+1 );
      ids[j] = optionList.slice( next1+1, next2 );
      next3 = strOption.indexOf( ',', next2+1 );
      labels[j] = optionList.slice( next2+1, next3 );
      next4 = strOption.indexOf( ',', next3+1 );
      attributes[j] = optionList.slice( next3+1, next4 );
      next5 = strOption.indexOf( ',', next4+1 );
      attrValues[j] = optionList.slice( next4+1, next5 );
      comma = next5+1;
    }	
  }  	

  // Reset comma's position for the optionOptions field
  comma = 0;
    
  // Walk through optionOptions to get the ids, options, and labels 
  // to populate the arrays.
  if ( optionOptions != null )
  {

    var next1;
    var next2;
    var next3;
	  
	for ( var j = 0; comma < optionOptions.length; j++ )
	{
      strOptions = optionOptions;
      next1 = strOptions.indexOf( ',', comma );
      optionIds[j] = optionOptions.slice( comma, next1 );
      next2 = strOptions.indexOf( ',', next1+1 );
      suboptionIds[j] = optionOptions.slice( next1+1, next2 );
      next3 = strOptions.indexOf( ',', next2+1 );
      optionLabels[j] = optionOptions.slice( next2+1, next3 );
      comma = next3+1;
    }  
  }  	
  
  // Create the options field by adding elements using the populated arrays.
  for (var index = 0; index < ids.length; index++ )
  {
  
    var parent = xmlObject.getParentNode();
    var form = parent.getFirstChildElement();
    var node = form.addElement( types[index] );
    node.setAttributeValue( "id", ids[index] );
    node.setAttributeValue( "label", labels[index]);

    if ( attributes[index] != null && attributes[index] !="" && attrValues[index] != null && attrValues[index] != "" )
      node.setAttributeValue( attributes[index], attrValues[index]  );
    
    // Walk through optionList and compare optionOptions ids to find 
    // the correct options for the select type option.
    if ( types[index] == "select" )
    {
      for ( var i = 0; i < optionIds.length; i++ ) 
      {
        if ( optionIds[i] == ids[index] )
        {
          var element = node.addElement( "option" );
          element.setValue( suboptionIds[i] );
          element.addAttribute( "label", optionLabels[i] ); 
        } 
        else
        {
          if ( i == optionIds.length )
            break;
          else  
            continue;  
        }
      }      
    } 
  }       
  fCatalogItem.options = xmlObject.toXMLString();

  return true
}
