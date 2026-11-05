/************************************************
	@fileoverview fileLinks
	@author: 	Joe Holloway
		
	This script creates function to use related tables
	based on the link tables.

	@Date: 		2/27/07
	
*************************************************/

/**
	This function sets a master link record for a table.
	it sets up vars.$L_masterLink_file 
			
	@param {String} fileName - name of datadict to	
**/
function setMasterLink(fileName)
{			
	var flink = new SCFile("link");
	var rc = flink.doSelect("name=\""+fileName+"\"");
	
 	if (rc == RC_SUCCESS) 		
	{	
		vars.$L_masterLink_file = flink;
		return true;	 
	}	// end if	
	else
	{
		vars.$L_masterLink_file = "NULL";
		return false;
	}	// end else		
}	// end setMasterLink()


/**
	This function sets target file and field variables 
	once a master link record for a dbdict table has been setup.
			
	@param {String} fieldName - name of field in record to link from	
**/
function setLinkedFieldFileName(fieldName)
{			
	var targetfiles = new Datum();
	targetfiles.setType(8); 
	var sourcefields = new Datum();
	sourcefields.setType(8); 
	
	if (vars.$L_masterLink_file == "NULL")	
	{
		return null;
	}	
	else
	{
		sourcefields  = vars.$L_masterLink_file.source_fields;
		targetfiles = vars.$L_masterLink_file.target_files;
		
		var fieldindex=-1;
		var farrayLength = sourcefields.length();
	
		for_loop1:
		for (var z = 0; z < farrayLength; z++)	
		{
			if (sourcefields[z]==fieldName) 
			{
				fieldindex=z;
				if (targetfiles[z] !== null) 
				{
					break for_loop1;
				}	
			}	// end if		
		}	// end for	

		if (fieldindex != -1)
		{	
			vars.$L_linkTargetFilename = vars.$L_masterLink_file.target_files[fieldindex];	
			vars.$L_linkTargetField = vars.$L_masterLink_file.target_fields[fieldindex];	
			vars.$L_fill_skip_found = system.functions.index("fill\.skip=true",system.functions.str(vars.$L_masterLink_file.link_expressions[fieldindex]))>0
				
			return vars.$L_linkTargetFilename;
		}
		else
		{
			vars.$L_linkTargetField = null;
		}
	}	// end else
}	// end setMasterLink()





