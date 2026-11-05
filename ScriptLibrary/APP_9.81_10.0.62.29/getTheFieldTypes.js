/************************************************
	@fileoverview getTheFieldTypes
	@author: 	Joe Holloway
		
	This script creates function to match  
	and array field names to the field types
		

	@Date: 		12/17/06
	
*************************************************/

/**
	This function returns the matching list of field types
	.
	
	@param {Array} fieldlist - list of field names
	@param {String} datadictname - name of datadict to
	use to get field types from.	
	@return {Array}  -  list of types. 
**/


function getFieldTypes(fieldlist, datadictname)


{

			
	var returnTypes = new Datum();
	returnTypes.setType(8); 
				
	var fDatadict = new SCFile("datadict");
	var rc = fDatadict.doSelect("name=\""+datadictname+"\"");
 	if ( rc == RC_SUCCESS )		
	{		
		var fields = new Datum();
		fields.setType(8); 
		fields = fDatadict.fields;
		
		var ftypes = new Datum();
		ftypes.setType(8); 
		ftypes= fDatadict.types;
		
		var farrayLength = fields.length();
		if ( fieldlist != null )
		{
			var flarrayLength = fieldlist.length();
		}
		else
			var flarrayLength = 0;
			
//		This for loop is used to select a field from the the incoming field list.			
			
		for (var m = 0; m < flarrayLength; m++)
		{
			var theField=fieldlist[m];


			if ( theField != null && theField != "")
			{
				var fieldindex=-1;
				for (var z = 0; z < farrayLength; z++)
				{
					if (fields[z]==theField) 
					{
						fieldindex=z;
					}			
				}	
				
				if (fieldindex > -1 )
				{
					var temptype= ftypes[fieldindex];
					if (temptype==null)
					{
						temptype=theField;
					}
					returnTypes.push(temptype);	
					
				}
				 	
				else 
				{
					
					var temp = theField;
					themessage=system.functions.scmsg(160, "ScriptLibrary", [temp] );
					print(themessage);
				
				} 	
			}
			 						
		}			

		
	}
	return returnTypes;
		

}




