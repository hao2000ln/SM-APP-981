
/**
*  This function is to validate the object
*	
*  @param {object} - The Object (Object) record.
*  @param {filename} string - File name of object.
*  @param {module} string - For future use.
*  @param {file} record - For future use.
*  @param {userSelect} boolean - For future use.
*  @return {boolean}  -  Whether the object is valid. 
*/
function validObject(object,filename, module, file, userSelect)
{

	if(object!= null && system.functions.filename(object)=="Object" && object.file_name==filename)
    {
    	return true;    	
    }    
    return false;
}
/**
*  This function is to validate the object with specified other parameter
*	
*  If object is the only object associated with a file, the object is valid.
*  Otherwise, specify one of the 'module', 'file','userSelect' to validate the object.
*  
*  @param {object} - The Object (Object) record.
*  @param {filename} string - File name of object.
*  @param {module} string - Module name of object.
*  @param {file} record - The record of the object's associated file.
*  @param {userSelect} boolean - Whether to get all list of objects of file.
*  @return {boolean}  -  Whether the object is valid. 
*/
function validObjectExt(object,filename, module, file, userSelect)
{

	if(object!= null && system.functions.filename(object)=="Object" && object.file_name==filename)
    {
    	if(object.multiple==true  )
    	{
    		if(userSelect==true)
    		{
    			return false;
    		}
    		if(file!=null)
    		{
    			var selection = false;  
    			for(var i =0; i< object.matchCats.length();++i)
    			{
    				if(file.category==object.matchCats[i])
    				{
    					selection=true;
    				}
    			}
    			if(selection==true)
    			{
    				return true;
    			}
    		}
    		else if(module!=null)
    		{
    			if( object.module==module)
    			{
    				return true;    			
    			}
    		} 
    		else
    		{
    			if(object['default']==true)
    			{
    				return true;
    			}
    		}  		
    		
    	}
    	else
    	{
    		
    		return true;    	
    	}
    	
    	
    }
    
    
    return false;
}
/**
*  This function is to get the object
*	
*  If object passed in is valid, return the original object.
*  
*  @param {object} - The Object (Object) record.
*  @param {filename} string - File name of object.
*  @param {module} string - For future use.
*  @param {file} record - For future use.
*  @param {userSelect} boolean - For future use.
*  @param {inQuery} string - Query to search against object.rarely used, just for special case.
*  @return {Array}  -  1st element is the object, 2nd element is the return code.
*  return code:  
	'original' - The passed in object is valid
	'new' - The function return a new fetched object
	'DEFAULT' - no object asssosiated with the file found and return the 'DEFAULT' object
*/
function getObject(object,filename, module, file,userSelect,inQuery)
{
	if(validObject(object,filename, module, file,userSelect))
	{	
		return [object,"original"];
	}	    
	
	var query = inQuery;
	if(query==null||query=="")
	{
		query="file.name=\""+filename+"\"";	
		
	}	
	var returnCode = "error";
	var theObject= new SCFile("Object");
	var rc=	theObject.doSelect(query);
	if(rc!=RC_SUCCESS)
	{	
		theObject.doSelect("file.name=\"DEFAULT\"");		
	}	
	
	if(rc==RC_SUCCESS)
	{
		returnCode = "new";
		if(theObject.file_name=="DEFAULT")
		{
			returnCode = "DEFAULT";
		}
	}	
	
	return   [theObject,returnCode];
}

/**
*  This function is to get the object with specified other parameter
*	
*  If object passed in is valid, return the original object.
*  Otherwise, specify one of the 'module', 'file','userSelect' to get object.
*  Specify nothing for single object or defaulted object.
*  Specify 'module' for object of that module.
*  Specify 'file' to evaluate object selction query.
*  Specify 'userSelect' to return list of the objects of the file
*  
*  @param {object} - The Object (Object) record.
*  @param {filename} string - File name of object.
*  @param {module} string - Module name of object.
*  @param {file} record - The record of the object's associated file.
*  @param {userSelect} boolean - Whether to get all list of objects of file.
*  @param {inQuery} string - Query to search against object.rarely used, just for special case.
*  @return {Array}  -  1st element is the object, 2nd element is the return code.
*  return code:  
	'original' - The passed in object is valid
	'new' - The function return a new fetched object
	'DEFAULT' - no object asssosiated with the file found and return the 'DEFAULT' object
*/
function getObjectExt(object,filename, module, file,userSelect,inQuery)
{
	if(validObject(object,filename, module, file,userSelect))
	{	
		return [object,"original"];
	}	    
	
	var query = inQuery;
	if(query==null||query=="")
	{
		query="file.name=\""+filename+"\"";	
	}
	
	var theObject= new SCFile("Object");
	var rc=	theObject.doSelect(query);
	var returnCode = "error";
	if(rc==RC_SUCCESS)
	{
        returnCode = "new";	 
        if(userSelect!=true)
        {        
	        var count= 0;
	        var found = false;
			if(theObject.multiple==true)
			{				
				while(rc==RC_SUCCESS)
				{	
					count++;
					if(validObjectExt(theObject, filename,module, file,userSelect))
					{												
						found=true;
						break;
					}
					rc=theObject.getNext();
				}
				if(count>1 && found== false)
				{				
					theObject.doSelect(query+" and default=true");
				}
				
			}
		}
		
	}
	else
	{	
		theObject.doSelect("file.name=\"DEFAULT\"");		
	}	
	
	if(theObject.file_name=="DEFAULT")
	{
		returnCode = "DEFAULT";
	}
	
	return   [theObject,returnCode];
}
/**
*  This function is to detect whether multiple objects of a file exist
*	
*/

function detectMultiple(record, oldrecord, mode)
{
	var otherObject = new SCFile("Object");
	var query = "file.name=\""+record.file_name+"\"";
	var rc = otherObject.doSelect(query);  
    
	if(mode=="update" && record.file_name==oldrecord.file_name)	//update
	{
		rc = otherObject.getNext();	
		
	}
	
	if(rc==RC_SUCCESS)
	{
		return true;
	}
	
	return false;
}

/**
*  This function is to run as trigger of Object before 'add' and 'update' to make sure value of field 'multiple' is correct.
*	
*/
function triggerObjectBefore(record, oldrecord, mode)	
{
	
	var multiple  = detectMultiple(record, oldrecord, mode);
	if(multiple==true && record.multiple!=true)
	{	
		record.multiple=true;			
	}
	if(multiple==false && record.multiple==true)
	{
		record.multiple=false;
	}
	if(record.multiple== true && (record.module==null||record.module==""))
	{
	    record.module="Module name auto generated @"+system.functions.str(system.functions.tod());

	}
		
	if(record.multiple== true&&record['default']==true)
	{
		refreshDefaultObjectCats(record);
	}

}

/**
*  This function is to run as trigger of Object before 'add' and 'update' to make sure value of field 'multiple' is correct.
*	
*/
function setOtherObjectNonDefault(record, oldrecord)
{
	
		var ret = 0;
		system.functions.rtecall("trigger", ret, 0);
		var otherObject = new SCFile("Object");
		var rc=	otherObject.doSelect("file.name=\""+record.file_name+"\"");
		while(rc==RC_SUCCESS)
		{
			if ( otherObject['module']==null || otherObject['module']!= record.module )
			{ 
			    if(otherObject['default']==true)
                {
                    otherObject['default']=false;
					otherObject.doUpdate();
				}
			}
			rc=otherObject.getNext();
		}

		system.functions.rtecall("trigger", ret, 1);	
}

/**
*  This function is to make other object of the file to be non-default if current object is default
*/
function setOtherObjectMultiple(record)
{
		
		var otherObject = new SCFile("Object");
	
		var rc=	otherObject.doSelect("file.name=\""+record.file_name+"\"");
		var ret = 0;
		system.functions.rtecall("trigger", ret, 0);
		if(rc==RC_SUCCESS)
		{
			do
			{
				if(otherObject.multiple==null||otherObject.multiple==false)
				{
					otherObject.multiple=true;
					otherObject.doUpdate();
				}
				rc=otherObject.getNext();
			}while(rc==RC_SUCCESS)			
		}		
		
		system.functions.rtecall("trigger", ret, 1);

}

/**
*  This function is to make sure value of field 'multiple' is correct for all the objects of a file.
*	
*/
function detectObjectMultiple(record)
{
	
		var multiple = false;
		var otherObject = new SCFile("Object");
		var rc=	otherObject.doSelect("file.name=\""+record.file_name+"\"");
		if(rc==RC_SUCCESS)
		{	
		
			if(RC_SUCCESS==otherObject.getNext())
			{
				multiple = true;
				var rc=	otherObject.doSelect("file.name=\""+record.file_name+"\"");
				var ret = 0;
				system.functions.rtecall("trigger", ret, 0);
				if(rc==RC_SUCCESS)
				{	
					do
					{
						otherObject.multiple=true;
						if(otherObject['default']==true)
						{
							refreshDefaultObjectCats(otherObject);
						}
						otherObject.doUpdate();
						rc=otherObject.getNext();
					}while(rc==RC_SUCCESS)			
				}		
				
				system.functions.rtecall("trigger", ret, 1);
			}
			else
			{
				var rc=	otherObject.doSelect("file.name=\""+record.file_name+"\"");
				var ret = 0;
				system.functions.rtecall("trigger", ret, 0);
				if(rc==RC_SUCCESS)
				{						
						otherObject.multiple=false;
						otherObject.doUpdate();
				
				}	
				system.functions.rtecall("trigger", ret, 1);	
			}
		}
		return multiple;

}

/**
*  This function is to run as trigger of Object after 'add' and 'update' to make sure value of field 'multiple' is correct for other object of the file.
*	
*/
function triggerObjectAfter(record, oldrecord)
{
	if(record.multiple==true)
	{
		setOtherObjectMultiple(record);
	}
	
	if(record.multiple==true)
	{
		if( record['default']==true)
		{
			setOtherObjectNonDefault(record, oldrecord);
			syncByObject(record);
		}
		else
		{
			refreshDefaultObjectCats(record, true);
		}	
		
	}
	
	synCategory(record, oldrecord);
	
	if(record.file_name!=oldrecord.file_name)
	{
		detectObjectMultiple(oldrecord);
	}
}

function synCategory(record, oldrecord)
{
	var ret = 0;
	system.functions.rtecall("trigger", ret, 0);
	if(record.category_file_name!=null && record.category_file_name!="")
	{
		var fCat = new SCFile(record.category_file_name);
		if(system.functions.exists("object.module",fCat) && system.functions.exists("name",fCat))
		{
			for(var i=0; i<record.matchCats.length();++i)
			{
				var rc = fCat.doSelect("name=\""+record.matchCats[i]+"\"")
				{
					if(rc==RC_SUCCESS)
					{
						fCat.object_module=record.module;
						fCat.doUpdate();
					}
				}
				
			}
		}
	}
	system.functions.rtecall("trigger", ret, 1);
}



/**
*  This function is to sync some field from default object to non-default object
*	
*/
function syncByObject(record)
{		
		var otherObject = new SCFile("Object");
		var rc=	otherObject.doSelect("file.name=\""+record.file_name+"\" and module~=\""+record.module+"\"");
		var ret = 0;
		system.functions.rtecall("trigger", ret, 0);
		if(rc==RC_SUCCESS)
		{
			do
			{		
				otherObject.category_file_name=record.category_file_name;
				otherObject.phase_file_name=record.phase_file_name;
				otherObject.profile_appl=record.profile_appl;
				otherObject.profile_variable=record.profile_variable;
				otherObject.revision_file=record.revision_file;
				otherObject.personal_inbox=record.personal_inbox;
				otherObject.global_inbox=record.global_inbox;
				otherObject.supportTemplates=record.supportTemplates;
				for (var i = 0; i < record.watch_variables.length(); i++)
				{
					otherObject.watch_variables[i] = record.watch_variables[i];
					otherObject.watch_variable_type[i]  = record.watch_variable_type[i];
					otherObject.watch_variable_name[i]= record.watch_variable_name[i];
					otherObject.watch_variable_global_list[i] = record.watch_variable_global_list[i];
				}
				for (;i < otherObject.watch_variables.length(); i++)
				{
					otherObject.watch_variables[i] = null;
					otherObject.watch_variable_type[i]  = null;
					otherObject.watch_variable_name[i]= null;
					otherObject.watch_variable_global_list[i] = null;
				}
		
		
				
				otherObject.doUpdate();
				rc=otherObject.getNext();
			}while(rc==RC_SUCCESS)			
		}		
		
		system.functions.rtecall("trigger", ret, 1);
}

/**
*  This function is to run as trigger of Object after 'Delete' to make sure value of field 'multiple' is correct.
*	
*/
function triggerObjectDelete(record, oldrecord)
{
		detectObjectMultiple(oldrecord);
}

/**
*  This function is to run as trigger of Object after 'Delete' to make sure value of field 'multiple' is correct.
*	
*/
function refreshDefaultObjectCats(record,doUpdate)
{	
	if(record.multiple!=true)return;
	var defaultObj = null;	
	if(record['default']==true)
	{
		defaultObj=record;
	}
	else
	{
		var fObj = new SCFile("Object");
		var rc = fObj.doSelect("file.name=\""+record.file_name+"\" and default=true");
		if(rc==RC_SUCCESS)
		{
			defaultObj=fObj;
		}		
	}
	if(defaultObj==null) return;
	
	var arrCats = getDefaultObjectCats(defaultObj);
	var lngOrigCats = defaultObj.matchCats.length();
	var iOverride = 0;
	for(var i =0; i<arrCats.length;++i)
	{
		if(arrCats[i]!=null&&arrCats[i]!="")
		{
			defaultObj.matchCats[iOverride++]=arrCats[i];
		}
	}
	
	if(iOverride<lngOrigCats)
	{
		
		for (;iOverride<lngOrigCats;++iOverride)
		{
			defaultObj.matchCats[iOverride]=null;
		} 	
		defaultObj.matchCats=system.functions.denull(defaultObj.matchCats);
	}
	
	if(iOverride>0 && doUpdate==true)
	{
		var ret = 0;
		system.functions.rtecall("trigger", ret, 0);
		defaultObj.doUpdate();
		system.functions.rtecall("trigger", ret, 1);
	}
}


function validateMatchCats(record, oldrecord, theIndex, indexVar)
{
	if(record.file_name==oldrecord.file_name && record['default']!=true)
	{
		var otherObject = new SCFile("Object");
		var rc=	otherObject.doSelect("file.name=\""+record.file_name+"\"");
		while(rc==RC_SUCCESS)
		{
			if ( otherObject['module']!= oldrecord.module && otherObject['default']!=true)
			{ 
			    for(var i=0; i<record.matchCats.length();++i)
	                	{
	                	for(var j=0; j<otherObject.matchCats.length();++j)
	                	{
	                		if(record.matchCats[i]==otherObject.matchCats[j])
	                		{
	                			vars[indexVar]=i+1;
	                			return false;
	                		}
	                		
	                	}
	                    
				}
			}
			rc=otherObject.getNext();
		}
		
	}
	 return true;
}

function getDefaultObjectCats(object)
{
	if(object.multiple!=true ||object.category_file_name==null|| object['default']!=true) 
	{
		print("error!");
		throw 1;//this function is only used to get available category for the default category
	}		
	
	var arrAllCats = new Array();
	var fCat = new SCFile(object.category_file_name);
	var rc = fCat.doSelect("true");//no other restriction.
	while(rc==RC_SUCCESS)
	{
		arrAllCats.push(fCat.name);
		rc = fCat.getNext();
	}
	
	var otherObject = new SCFile("Object");
	var rc=	otherObject.doSelect("file.name=\""+object.file_name+"\"");
	while(rc==RC_SUCCESS)
	{
		if ( otherObject['module']!= object.module )
		{ 
		    for(var i=0; i<arrAllCats.length;++i)
            {
               	for(var j=0; j<otherObject.matchCats.length();++j)
               	{
               		
               		if(arrAllCats[i]==otherObject.matchCats[j])
               		{
               			arrAllCats[i]=null;
               			break;
               		}
                		
               	}
                    
			}
		}
		rc=otherObject.getNext();
	}
	
	return arrAllCats;
}
		
