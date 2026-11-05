function getDependFile( strFileName, strFileKey )
{
	var fFile = new SCFile(strFileName);
	var rc = fFile.doSelect("number=\"" + strFileKey + "\"");
				
	if (rc != RC_SUCCESS)
	{
		var msg = funcs.scmsg( 136, "ScriptLibrary", [strFileName] );
		print(msg);
		return -1; 
	}
		
	return fFile;
}

function getStatusMap( strFileName, fFile )
{
	var fSvcCatStatusFieldMap = new SCFile("svcCatStatusFieldMap", SCFILE_READONLY);
	fSvcCatStatusFieldMap.setFields(["field.name"]);
	
	var rc = fSvcCatStatusFieldMap.doSelect("file.name=\"" + strFileName + "\"");
		
	var aFieldMap = new Array(0);
	
	var strQuery = "source.file.name=\""+ strFileName + "\" AND (source.status=\"" + 
	                eval("fFile." + fSvcCatStatusFieldMap.field_name) + 
	                "\" AND source.field=\"" + fSvcCatStatusFieldMap.field_name + "\")";
		                
	rc = fSvcCatStatusFieldMap.getNext();

	while (rc == RC_SUCCESS)
	{
		strQuery += " OR (source.status=\"" + eval("fFile." + fSvcCatStatusFieldMap.field_name) + 
	                "\" AND source.field=\"" + fSvcCatStatusFieldMap.field_name + "\")";
		rc = fSvcCatStatusFieldMap.getNext();
	}
				
	var fSvcCatStatusMap = new SCFile( "svcCatStatusMap", SCFILE_READONLY );
	rc = fSvcCatStatusMap.doSelect( strQuery );
    var msg;
    				
	if ( rc != RC_SUCCESS ) 
	{
		msg = funcs.scmsg( 137, "ScriptLibrary", [strFileName] );
		print(msg);
		return -1;
	}
	else
	{	
		//Sort the fields by score.
		do
		{
			//if the skip flag is set on any of the status fields then bail
			if (fSvcCatStatusMap.skip_flag==true)
			{
				return -1;
			}
			//if there's only one field then it probably won't be scored.
			if (fSvcCatStatusMap.status_score == null)
			{
				aFieldMap[1] = {};
				aFieldMap[1].field_name = fSvcCatStatusMap.source_field;
				aFieldMap[1].source_status = fSvcCatStatusMap.source_status;
			  	aFieldMap[1].status = fSvcCatStatusMap.target_status;
			  	aFieldMap[1].transform_js_code = fSvcCatStatusMap.transform_js_code;
				aFieldMap[1].notification_name = fSvcCatStatusMap.notification_name;
				aFieldMap[1].notification_flag = fSvcCatStatusMap.notification_flag;
			}
			else if (fSvcCatStatusMap.status_score > 0)
			{ 
				aFieldMap[fSvcCatStatusMap.status_score] = {};
				aFieldMap[fSvcCatStatusMap.status_score].field_name = fSvcCatStatusMap.source_field;
				aFieldMap[fSvcCatStatusMap.status_score].source_status = fSvcCatStatusMap.source_status;
			  	aFieldMap[fSvcCatStatusMap.status_score].status = fSvcCatStatusMap.target_status;
			  	aFieldMap[fSvcCatStatusMap.status_score].transform_js_code = fSvcCatStatusMap.transform_js_code;
				aFieldMap[fSvcCatStatusMap.status_score].notification_name = fSvcCatStatusMap.notification_name;
				aFieldMap[fSvcCatStatusMap.status_score].notification_flag = fSvcCatStatusMap.notification_flag;
			}
			rc = fSvcCatStatusMap.getNext();
		}
		while ( rc == RC_SUCCESS );
	}

	if (aFieldMap.length == 0)
	{
		msg = funcs.scmsg( 136, "ScriptLibrary", [strFileName] );
		print(msg);
		return -1; 	
	}
	
	return aFieldMap;
}

function getStatusStringFromMap( aFieldMap, fFile )
{
   	var strTransformCode = "";
   	var strCompleteStatus = "";
   	   	
	//First go through the array and see if any status needs to be transformed
	var i;			
	for (i = 1; i < aFieldMap.length; i++)
	{	   
	    if (aFieldMap[i] != null)
	    {
			var strSourceStatus = eval( "fFile." + aFieldMap[i].source_field );
									
			strTransformCode = aFieldMap[i].transform_js_code;
			
			if (strTransformCode != "" && strTransformCode != null)
			{
				//go through the map and change the references to fields to aFieldMap references
				var j;				
				for (j = 1; j < aFieldMap.length; j++)
				{
					if (aFieldMap[j] != null)
					{
						var exp = new RegExp("@" + aFieldMap[j].field_name + ".SOURCEVALUE@", "g");
						strTransformCode = strTransformCode.replace(exp, "aFieldMap[" + j + "].source_status");
						
						exp = new RegExp("@" + aFieldMap[j].field_name + ".TARGETVALUE@", "g");
						strTransformCode = strTransformCode.replace(exp, "aFieldMap[" + j + "].status");
					}
				}
						
				try
				{
					eval(strTransformCode);
				}
				catch (er)
				{
        			var msg = funcs.scmsg( 138, "ScriptLibrary", [er] );
					print(msg);
				}	
			}
		}
	} 
	
	var tempstatus=[];
				
	//now set the status
	for (i = 1; i < aFieldMap.length; i++)
	{
	    if (aFieldMap[i] != null && aFieldMap[i].status != null && aFieldMap[i].status != "")
	    {
	    	tempstatus.push(aFieldMap[i].status);
	      	if (strCompleteStatus != "")
	      	{
	      		strCompleteStatus += " ";	
	      	}
	      	
			strCompleteStatus += aFieldMap[i].status;
		}
	}
	
	/**
	/// added by wang,xun (xunw@hp.com), hard code for request model here. 
	/// since request has some special requirement of statusmap, for details
	/// please reference with 'jinhong.zhang@hp.com'
	if(funcs.filename(fFile)=="request"){
		strCompleteStatus="";
		for (var i=0; i < tempstatus.length; i++)	{
			strCompleteStatus = strCompleteStatus + tempstatus[i]; 
			if(i==0){
				strCompleteStatus = strCompleteStatus + " request "; 
			}else if(i==1){
				strCompleteStatus = strCompleteStatus + " in ";
			}else if(i==2){
				strCompleteStatus = strCompleteStatus + " phase "; 
			}
		}
	}
	*/
	return strCompleteStatus;
}

function getEmailNotificationName( aFieldMap )
{
    var i;
	for (i = 1; i < aFieldMap.length; i++)
	{	    
	    if (aFieldMap[i] != null && aFieldMap[i].notification_flag == true)
	    {
 			return aFieldMap[i].notification_name;
		}
	}
	return -1;
}

function getCartItem( strCartItemID )
{
	var fSvcCartItem = new SCFile( "svcCartItem" );
	var rc = fSvcCartItem.doSelect( "cartItemId=\"" + strCartItemID + "\"" );
	if (rc == RC_SUCCESS) {
	    return fSvcCartItem;
	}
	else {
	    return null;
	}
}

function sendEmail( strSDInteractionNumber, strCompleteStatus, strNotificationName, fSvcCartItem)
{			
	var fSDInteraction = new SCFile( "incidents" );					
					
	var rc = fSDInteraction.doSelect("incident.id=\"" + strSDInteractionNumber + "\"");
	if ( rc != RC_SUCCESS ) 
	{
		var msg = funcs.scmsg( 139, "ScriptLibrary", [strSDInteractionNumber] );
		print(msg);
		return -1;
	}
	else
	{
		var rteReturnValue = new SCDatum();
		var rteNames = new SCDatum();
		var rteValues = new SCDatum();
		var argNames = new SCDatum();
		var argVals = new SCDatum();
					
		//Parameter names for RAD app us.notify  	
		rteNames.push("name"); 		//Notification Name - INTO.NAME
		rteNames.push("record"); 		//Current File - INTO.FILE
		rteNames.push("names"); 		//Extra Arguements - INTO.ARGS
		rteNames.push("second.file");	//Save copy of the current file - INTO.OLD
		rteNames.push("types"); 		//Extra Arguement Names - INTO.ARG.NAMES
		
		//Adding arrays to an array is tricky. First we have to set the types by hand.
		argVals.setType(8); 	//type array
		argNames.setType(8);	//type array
		
		//modified to match new Datum push behavior -Hua		 
		argVals.push(strCompleteStatus);
		argVals.push(fSvcCartItem.item_description);
		
		argNames.push("$L.status");
		argNames.push("$L.item.desc");

		//Now we set the array type for rteValues and use funcs.insert to get 
		//the arg arrays in properly into the rteValue array. You can't mix push() with 
		//funcs.insert() or the rteValues array will become corrupt. 
		
		rteValues.setType(8);
		rteValues=funcs.insert(rteValues, 0, 1, strNotificationName);
		rteValues=funcs.insert(rteValues, 0, 1, fSDInteraction);
		rteValues=funcs.insert(rteValues, 0, 1, argVals);
		rteValues=funcs.insert(rteValues, 0, 1, fSDInteraction); //won't be used
		rteValues=funcs.insert(rteValues, 0, 1, argNames);
				
		funcs.rtecall("callrad", 
									rteReturnValue, 
									"us.notify", //RAD app name
									rteNames, 
									rteValues,
									false); //false to run in same thread, true to run in new thread
	}
	
	return 1;	
}	

function updateCartItem( scRelation, strDependActive )	
{	
	var strCartItemID = scRelation.cartItemId;
	var fSvcCartItem = getCartItem( strCartItemID );
	
	if (fSvcCartItem) {
		var strSetStatus = checkAndSetStatus( scRelation, fSvcCartItem );
		var strSetCompleted = checkAndSetCompleted( strDependActive, fSvcCartItem );
		
		if (strSetStatus == true || strSetCompleted == true)
		{
			fSvcCartItem.doAction("update");
		}
	}
}

function checkAndSetStatus( scRelation, fSvcCartItem )
{
	var strSDInteractionNumber = scRelation.source;
	var strFileName = scRelation.depend_filename;
	var strFileKey = scRelation.depend;
	
	var fFile = getDependFile( strFileName, strFileKey );
	var aFieldMap = getStatusMap( strFileName, fFile );
	
	if (aFieldMap != -1)
	{
		var strCompleteStatus = getStatusStringFromMap( aFieldMap, fFile );
	
		if (strCompleteStatus != fSvcCartItem.status)
		{
			checkAndSendEmail( strSDInteractionNumber, strCompleteStatus, fSvcCartItem, aFieldMap );
			fSvcCartItem.status = strCompleteStatus;
			return true;
		}
	}
	return false;
}

function checkAndSendEmail( strSDInteractionNumber, strCompleteStatus, fSvcCartItem, aFieldMap )
{
	var strNotificationName = getEmailNotificationName( aFieldMap );
	if (strNotificationName != -1)
	{
			sendEmail( strSDInteractionNumber, strCompleteStatus, strNotificationName, fSvcCartItem );
	}
}

function checkAndSetCompleted( strDependActive, fSvcCartItem )
{
	var strCompleted = funcs.nullsub( fSvcCartItem.completed, false );
	if (strDependActive == false && strCompleted == false)
	{
		fSvcCartItem.completed = true;
		return true;
	}
 	if (strDependActive == true && strCompleted == true)
 	{
		fSvcCartItem.completed = false;
		return true;
	}
	return false;
}

function printOut( target )
{
	print( target );
}