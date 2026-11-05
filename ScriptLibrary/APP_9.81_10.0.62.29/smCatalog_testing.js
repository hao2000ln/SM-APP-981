function setInfoFields( record, xmlString )
{
	var xmlObject = new XML();
	
	xmlObject.setContent(xmlString);
	{
		var test;
		test = xmlObject.getFirstChildElement();
		print(test.getName()+" : "+test.getValue() );
		print(test.getNextSiblingElement());
		
	}
	
}




var change = new SCFile("cm3r")
var item = new SCFile("smCatalog")
var sql = "name=\"Monitors\"";
if (item.doSelect( sql ) == RC_SUCCESS )
{
	
	system.library.smCatalog.setFilterArrays( item.access_filter_xml );
}