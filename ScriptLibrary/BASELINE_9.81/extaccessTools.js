/** @fileoverview extaccessTools

*   @author Farahnaz Faegh
*/

/** This function takes the extacces record and the name in that record.
*   If the name matches a field in one of the join tables for the join file,
*   then it populates the soafile array based on the appropriate table name.
*
*	@param fExtaccess       - extaccess record
*	@param strName          - table name in the record
*	@return Boolean success or failure
*   @type Boolean
*/
function populateSoaFile( fExtaccess, strName )
{

  var bracket;
  var comma;
  var strField;
  var strTable;
  var strFieldName;
  var tablesCount;
  var aTables;
  var bFound = false;
  

  var fJoindefs = new SCFile("joindefs");
  var rc = fJoindefs.doSelect( "join.name=\"" + strName + "\"" );
  

  if ( rc == RC_SUCCESS )
  {

    // Find the number of tables for the joinfile and insert them into an array 
    tablesCount = fJoindefs.join_tables.length();
    aTables= new Array();

    for ( var j = 0; j < tablesCount; j++ )
      aTables[j] = fJoindefs.join_tables[j][0];

    // make sure to null the array field before any operation
    fExtaccess.soafield = system.functions.denull( fExtaccess.soafield ); 

    // Populate soafile array field of extacces based on looking for the value of   
    // soafield of extacces in each of the join tables
	for ( var i = 0; i< fExtaccess.soafield.length(); i++ )
    {
      bFound = false;
	  
	  // Do only if the field is not null
      if ( fExtaccess.soafield[i] != null && fExtaccess.soafield[i] !="" ) 
	  {
	  // Look for an array of structure field
	    bracket = fExtaccess.soafield[i].indexOf( '[', 0 );
	  
	    if ( bracket > 0 )
	      strField = fExtaccess.soafield[i].slice( 0, bracket );

	    else
	    { 
	      // Look for a structure field
	      comma = fExtaccess.soafield[i].indexOf( ',', 0 );
	  
	      if ( comma > 0 )
	        strField = fExtaccess.soafield[i].slice( 0, comma );
	  
	      else
	        // Set to a regular field
	        strField = fExtaccess.soafield[i];
	    }
	  }   
      else
        strField = ""; 

      // If the field is null, we need to set the corresponding element in soafile to null
      if ( i > 0 && strField == "" || strField == null )
        fExtaccess.soafile[i] = "";

      // Find the corresponding field in the jointables and set the soafile elements 
      else
      {
        for ( var k = 0; k < aTables.length; k++ )
  	    {

          var fTable = new SCFile( "dbdict" );
          
          var rc = fTable.doSelect( "name=\"" + aTables[k] + "\"" );
                    
          if ( rc == RC_SUCCESS )
          {
            var fieldCount = fTable.field.length();
            var aFields = new Array()

            for ( var l = 0; l < fieldCount; l++ )
            {
              aFields[l] = fTable.field[l][0];
          
              if ( aFields[l] != null && aFields[l] != "" && aFields[l] == strField )
              {
                bFound = true;
                fExtaccess.soafile[i] = aTables[k];
	            break; 
	          }
	        }
            if ( bFound )
              break;
          }  // End of if RC_SUCCESS
  	    }  //  End of for loop for aTables
        
        // Display a message if the field does not exist in any of the join files
        if ( rc !=RC_SUCCESS && !bFound )
        {
          var msg = system.functions.scmsg( 159, "ScriptLibrary", [strField] );
	      print(msg);
        }    
      }  // End of else
	}  // End of fExtaccess.soafield
  }
  else
  {
    // If not a join file then make sure the array is null  
    fExtaccess.soafile = {};
  }

  return true; 
}  

function getFieldNameFromCaption( fExtaccess, strCaption )
{
	var i = 0;
		
	while (fExtaccess[9][i] != null)
	{
		if (fExtaccess[10][i] == strCaption)
		{
			return fExtaccess[9][i];
		}
		i++;
	}	
	
	return null;
}

function getSelectedFieldsAsXML ( strFileName, strExtaccessName, strQuery, aFields )
{
	var fFile = new SCFile(strFileName);
	var fExtaccess = new SCFile("extaccess");
	
	var rc = fFile.doSelect(strQuery);
	
	if (rc != RC_SUCCESS)
	{
		return null;
	}
	
	fExtaccess.doSelect("service.name=\"" + strExtaccessName + "\" and object.name=\"" + strExtaccessName +" \"");
		
	var returnString = "<" + strExtaccessName + ">";
	var fieldString;
	
	
	for (var i = 0; i < aFields.length; i++)
	{
		var fieldOpen = "<" + aFields[i] + ">";
		var fieldClose = "</" + aFields[i] + ">";
		var fileField = lib.extaccessTools.getFieldNameFromCaption(fExtaccess, aFields[i]);
		
		if (fileField.indexOf(",") != -1)
		{
			fileField = fileField.slice(fileField.indexOf(",") + 1);
		} 
		 
		var fieldValue = fFile[fileField];
		
		
		if (fieldValue != null && fieldValue.toString().indexOf("[C++ object Datum]") != -1)
		{
			fieldString = fieldOpen + fieldValue.join() + fieldClose;
		}
		else
		{
			fieldString = fieldOpen + fieldValue + fieldClose;
		}
		
		returnString += fieldString;
	}
	
	returnString += "</"+ strExtaccessName + ">";
	
	return returnString;
}