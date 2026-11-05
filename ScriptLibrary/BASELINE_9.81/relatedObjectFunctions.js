/************************************************
	@fileoverview relatedObjectFunctions
	@author: 	Joe Holloway
		
	This script creates a function to set up the 
	related toField and toTable if it exists for 
	the incoming table and field. 
	

	@Date: 		3/27/07
	
*************************************************/

/**
	This function sets a variable for each the 
	toTable, and to toField.
	
		
	@param {String} sourceTable - name of source datadict.
	@param {String} sourceField - name of source field.

		
	
**/


function setToTableAndField(sourceTable, sourceField)

{
	var relatedObject = new SCFile("relatedObjectMap");
	var rc = relatedObject.doSelect("sourceTable=\""+sourceTable+"\" and sourceField=\""+sourceField+"\"");
	
	
	if (rc == RC_SUCCESS) 		
	{
		vars.$L_toTable = relatedObject.toTable;
		vars.$L_toField = relatedObject.toField;
		return true;
	}	// end if
	
	
	else
	{
 		vars.$L_toTable = null;
		vars.$L_toField = null;
		return false;
	}	// end else
	
}

/**
	This function inits a rofields record. 
	It stores the contents in $G.roFields.
	
	return= roFields File variable		
**/
function initROFields()
{
	var fName = new String("rofields");
  	vars.$G_roFields  = new SCFile(fName);
	return vars.$G_roFields;
}




/**
	This function returns the last "Field" in an 
	RO field.
	
	return= roFields File variable		
**/
function getLastROFieldName(fullROField)
{
    if (fullROField==null) return null;

	var fField = fullROField;
    var fLen=fField.length;
    var fpos1;
    var retField;
    
 	fpos1 = fField.lastIndexOf( ';', fLen );
  	retField=fField.slice(fpos1+1, fLen);
  	return retField;


}


/**
	This function returns the last "Field" in an 
	RO field.
	
	return= roFields File variable		
**/
function getLastROTableName(fullROField)
{
    if (fullROField==null) return null;

	var fField = fullROField;
    var fLen=fField.length;
    var fpos1;
    var fpos2;
    var retTable;
    
 	fpos1 = fField.lastIndexOf( ';', fLen );
  	fpos2 = fField.lastIndexOf( ';', fpos1-1 );
	retTable=fField.slice(fpos2+1, fpos1);
  	  	
  	return retTable;


}



function convertFieldName(tableName,fieldName)
{	
	if(fieldName.indexOf(tableName+";")!=-1)
		return fieldName;
	else return tableName+";"+fieldName;	
}




