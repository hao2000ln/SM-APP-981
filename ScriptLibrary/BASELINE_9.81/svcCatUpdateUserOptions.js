function setAllMandatoryOptions( )
{
	
	var sql = "type=\"item\"";	
	var record = new SCFile("joinsvcDisplay");
	
	var count = 0;
	var code = record.doSelect(sql);
		while(code == RC_SUCCESS){		
        if(setMandatoryOptions(record) )	       
		    
          count++;
		  if(count%100 == 0 && count > 0)
		   print("Processed " + count + " Catalog items" ); 		  
	    code = record.getNext();
	}	
	
	print("Processed total " + count + " Catalog items" ); 
}


function setMandatoryOptions( fCatalogItem )
{	 

    
  var xmlString;
  var xmlValString;
  var xmlObject = new XML();  
  var xmlValObject = new XML();
  var returnValue = false;
  var changed =false;
  if ( fCatalogItem.option_validations == null || fCatalogItem.option_validations  == "" )
	fCatalogItem.option_validations = "<validations></validations>";
  if ( fCatalogItem.options == null || fCatalogItem.options == "" )
  	fCatalogItem.options = "<form></form>";
  // Walk through the nodes to set the empty mandatory attributes
  
  	xmlString = fCatalogItem.options;
	xmlValString = fCatalogItem.option_validations;
	
  	if ( xmlObject.setContent( xmlString ) && xmlValObject.setContent( xmlValString ))
  	{
  	
  	var name;	
  	var parent = xmlObject.getParentNode();
  	var form = parent.getFirstChildElement();
  	var node = form.getFirstChildElement();
  
  	while ( node != null )
  	{
  	
  		name = node.getAttributeValue("id");  
  		
  		if ( node.getAttributeValue("mandatory") == null ||  node.getAttributeValue("mandatory") == "")
		{
		 
		
  		  var valNode = lib.xmlHelpers.getElement( xmlValObject, name, "id" );
  		 
  		
		   if ( valNode != null && valNode.getAttributeValue("mandatory") != null &&  valNode.getAttributeValue("mandatory") != "")
		     {
			 node.setAttributeValue("mandatory", valNode.getAttributeValue("mandatory"));
			
			 changed = true;
		
			 }
			  
		 }		
  		node = node.getNextSiblingElement();
  	}
	if(changed){
     fCatalogItem.options =  xmlObject.toXMLString();
	 returnValue = (fCatalogItem.doUpdate()==RC_SUCCESS);
	 }
  }
  return returnValue;
}


