/************************************************
	@fileoverview TemplateTables
	@author: 	Joe Holloway
		
	This script creates function to match  
	and array field names to the field types
		

	@Date: 		3/10/07
	
*************************************************/

/**
	This function returns the matching list of field types.
	getTemplateTables()
	
	@param {String} tableName - name of datadict to
	use to get caption for.	
	@return {Array}  -  list of types. 
**/




function getTemplateTables2()
{
	var rtnTemplateTables = new String;

	var tempTables = new SCFile("Object");
	var rc = tempTables.doSelect("supportTemplates=true");
	
	if ( rc == RC_SUCCESS )
	{

	
		var TempTableList = new Datum();
		TempTableList.setType(8);
	
	
		var i = 0; 
		while(rc == RC_SUCCESS && i<5)  
		{ 
			i++;
			var a=TempTableList.push(tempTables.file_name);
			var rc = tempTables.getNext();

		}
	

	return TempTableList;	
	}
	

}


function getTemplateTables()
{
	var rtnTemplateTables = new String;

	
	var TempTableList = new Datum();
	TempTableList.setType(8);
	
	
	var aList = lib.TemplateFilter.getAllowedTemplateTableNames();
	for(var i=0;i<aList.length;++i)
	{
		TempTableList.push(aList[i]);
	}
	

	return TempTableList;	
	
	

}


/**
	This function returns the matching list of field types.
	getTemplateTableCaptions(templateTableList).
	
	@param {String} tableName - name of datadict to
	use to get caption for.	
	@return {Array}  -  list of types. 
**/

function getTemplateTableCaptions(templateTableList)
{
	var listLength=templateTableList.length()
	var TempTableCaptionList = new Datum();
	TempTableCaptionList.setType(8);
	
	var theCaption = new String("aaa");
	
	for(i=0; i<=listLength - 1; i++) 
	{
		theCaption=getTableCaption(templateTableList[i]);
		var a=TempTableCaptionList.push(theCaption);
	}
	
	return TempTableCaptionList;
}


/**
	This function returns the matching list of field types.
	getTableCaption(tableName)
	
	@param {String} tableName - name of datadict to
	use to get caption for.	
	@return {Array}  -  list of types. 
**/

function getTableCaption(tableName)
{
//	This uses the RAD function to get the scmessage for the passed in table name.

	var theMessage=system.functions.scmsg(tableName,"tablename");		
	return theMessage;

}





