/************************************************
	@fileoverview convertToRelatedObjectCaptions
	@author: 	Joe Holloway
		
	This script creates function to convert  
	and array field names to the field captions
	
	

	@Date: 		4/4/2007
	
*************************************************/

/**
	This function checks to see if the fields we
	are monitoring for changes have indeed changed.
	
	@param {Array} fieldlist - list of field names
	@return {Array}  -  list of captions. 
**/





function getRelatedFieldCaptions(fieldlist)
{

	var returnCaptions = new Datum();
	if ( fieldlist != null )
	{
		returnCaptions.setType(8); 
		
		fieldlist.setType(8);
		var farrayLength = fieldlist.length();
		if ( fieldlist != null )
		{
			var flarrayLength = fieldlist.length();
			
		}
		else
			var flarrayLength = 0;
			
			


			
		for (var m = 0; m < flarrayLength; m++)
		{

			var theField=fieldlist[m];


			if ( theField != null && theField != "")
			{

				var mycaption=getROFieldCaption(theField);

				returnCaptions.push(mycaption);

				
			}	// end if
			 						
			
		}		// end outer For loop		



	
	}
	return returnCaptions;
		

}



function getROFieldCaption(incomingField,tablename)
{
//	This uses the RAD function to get the rte get.field.caption() function
//	to get the related object field caption for the passed in field name.



	
	if (tablename==null)   
	{		
		var thecaption=system.functions.get_field_caption(incomingField);
	}
	else 
	{
		var thecaption=system.functions.get_field_caption(incomingField,tablename);
	}
	
	return thecaption;

}


/**
  *@QCNo:QCCR1E56003
  *@Description:get the corresponding the format from Oject for inbox display
  *@author: 	Yu Li
  *@Date: 		7/26/2010	
**/
function getDefaultFormat(strFileName)
{
	if(strFileName==null) return null;
	var fObject = new SCFile ("Object");
	var rc= fObject.doSelect("file.name=\"" + strFileName + "\"" );
	if (rc == RC_SUCCESS)
	{
	  if (fObject.sc_manage_screen == "sc.manage.generic")
	      return strFileName+".qbe";
	  return fObject.sc_manage_screen;
	}
	return null;
}

/**
  *@QCNo:QCCR1E56003
  *@Description:get all columns according to the format 
  *@author: 	Yu Li
  *@Date: 		7/26/2010	
**/
function getColumnsFromFormat(strFormatName)
{
	if(strFormatName==null) return null;
	var fFormat = new SCFile( "format" );
	var rc = fFormat.doSelect( "name=\"" + strFormatName + "\"" );
	var iCount=0;
	var column=new Datum();
	if (rc == RC_SUCCESS)
    {
	    while (fFormat.field.length() > iCount)
		{
			
			if (fFormat.field[iCount].property.indexOf("Column;")==0)
			{
				column.push(fFormat.field[iCount].input);
				
			}
			iCount++;
		}
	}
	return column;	
}


/**
  *@Description:get all columns from usergrid 
  *@author: 	Zhang Qi
  *@Date: 		2012/09/06
 **/
function getColumnsFromUsergrid(strFileName)
{
	var ugName = strFileName + ".qbe.g";

	var sql = "name = \"" + ugName + "\" and operator = \"" + system.functions.operator() + "\" and null(gridname)";
	var fUsergrid = new SCFile ("usergrid");
	var rc = fUsergrid.doSelect(sql);
	if (rc == RC_SUCCESS)
	{
		return fUsergrid.fields;
	}
	
	return null;	
}


function getUsergrid(formatName) {
    var sql = "name = \"" + formatName + "\" and operator = \"" + system.functions.operator() + "\" and null(gridname)";
	var fUsergrid = new SCFile ("usergrid");
	var rc = fUsergrid.doSelect(sql);
	if (rc == RC_SUCCESS)
	{
		return fUsergrid;
	}
	
	return null;
}


