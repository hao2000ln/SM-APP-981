/************************************************
	@fileoverview tableUtil
	@author: 	Hua Zhang
		
	Utlities for tables

	@Date: 		02/23/09
	
*************************************************/

/**
	This function removes nulls and duplicate from an array
	
		
	@param  record  - file
	@param Array field - array field to remove nulls and duplicates
	@return - returns an javascript array of results
		
	
**/

function  removeNullAndDuplicate(record,field)
{
 	var list = field;
	var length=system.functions.lng(list);
	var results = new Array();
	var addIndex=0;
	for (var i=0;i<length;++i)
	{
		if (list[i] != null && list[i].length>0)
		{
			var dup = false;
			for(var k=0;k<addIndex;++k)
			{	
				if(results[k] == list[i])
				{
					dup = true;
					break;
				}
			}
			if(!dup)
			{		
				results[addIndex] = list[i];
				++addIndex;
			}	
		}	 	
	}	
	return results;
}	

function  removeNullAndDuplicateInStructure(record,structureField,field)
{ 	
 	var list = field;
	var length=system.functions.lng(list);
	var results = new Array();
	var addIndex=0;
	var dupNullArray =  new Array();
	var dupNullIndex=0;
	for (var i=0;i<length;++i)
	{
		if (list[i] != null && list[i].length>0)
		{
			var dup = false;
			for(var k=0;k<addIndex;++k)
			{	
				if(results[k] == list[i])
				{
					dup = true;
					break;
				}
			}
			if(!dup)
			{		
				results[addIndex] = list[i];
				++addIndex;				
			}	
			else
			{
				dupNullArray[dupNullIndex]=i+1;
				++dupNullIndex;
			}
		}	
		else
		{
			dupNullArray[dupNullIndex]=i+1;
			++dupNullIndex;
		} 	
	}
	return dupNullArray;
}	


function getAllFieldsInFileWithQueryAsArray(tableName, sqlStmt)
{
	var file = new SCFile( tableName);
	return(selectDB(file, sqlStmt));
}



function getFieldsInFileWithQueryAsArray(tableName, fields, sqlStmt)
{
	var file = new SCFile( tableName, SCFILE_READONLY);
	
	file.setFields( fields);
	return(selectDB(file, sqlStmt));
}	


function selectDB(scFile, sqlStmt)
{
   sqlStmt = system.functions.nullsub(sqlStmt, "true");
   
   var fileList = new Array();
   if( scFile.doSelect(sqlStmt) == RC_SUCCESS)
	{
	   
	   var i = 0;
	   do
	   {
	      var file2 = new SCFile();     
	      system.functions.fduplicate(file2, scFile);
	      fileList[i] = file2;
	      i++;	      
	   }while (scFile.getNext()== RC_SUCCESS)	   
	}	
	return fileList;
}
