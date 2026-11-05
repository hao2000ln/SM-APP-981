/************************************************
	@fileoverview getAFieldsType
	@author: 	Joe Holloway
		
	This script creates a function to select a fields   
	type from a dbdict.  	

	@Date: 		2/5/07
	
*************************************************/

/**
	This function creates an array list.
	
		
	@param {Array} fieldname  - field name
	@param {String} dbdictname - name of datadict to search against
	@return={Array} rtnfieldtype - used to return incoming fields type
		
	
**/

function getAFieldsType(fieldname , dbdictname)

{

	var fDBdict = new SCFile("dbdict");
	var rc = fDBdict.doSelect("name=\""+dbdictname+"\"");
	var rtnfieldtype = new String;
	var rtnarrayfieldtype = new String;

	
 	if (rc == RC_SUCCESS) 		
	{
		
		var dbdictfieldstruct = new Datum();
		dbdictfieldstruct.setType(8); 
		dbdictfieldstruct = fDBdict.field;
		print("This is the dbdictfieldstruct list " + dbdictfieldstruct);
		
		var dbStructLength = dbdictfieldstruct.length();
		
		for (var m = 1; m < dbStructLength; m++)
		{
			
			if (fieldname == dbdictfieldstruct[m][0])  
			{
 				print(dbdictfieldstruct[m][0] + "  This is the field.");
				print(dbdictfieldstruct[m][1] + "  This is the level");
				print(dbdictfieldstruct[m][2] + "  This is the index");
				print(dbdictfieldstruct[m][3] + "  This is the type");
				print(dbdictfieldstruct[m+1][3] + "  This is the next fields type");
				print(dbdictfieldstruct[m] + "  This is the type");
				
				if (dbdictfieldstruct[m][3] == "8" )
				{
				
				rtnfieldtype = dbdictfieldstruct[m][3] + ":" + dbdictfieldstruct[m+1][3];
				
				
				} // end if 
				
			}	// end if
				
		}  // end for
		
	}  // end if (rc == RC_SUCCESS) 
	return rtnfieldtype	

}  //  end getAFieldsType function		



//var afieldtype = getAFieldsType("field" , "dbdict")
//print("The field type is :   "+ afieldtype)

