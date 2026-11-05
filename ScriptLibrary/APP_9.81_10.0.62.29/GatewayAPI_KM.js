var NO_RECORD_EXIT = lib.GatewayAPI_Constants.NO_RECORD_EXIT();
var NORMAL_EXIT = lib.GatewayAPI_Constants.NORMAL_EXIT();
var BAD_VALIDATION_EXIT = lib.GatewayAPI_Constants.BAD_VALIDATION_EXIT();
var setExitType = lib.GatewayAPI_Util.setExitType;
var setErrorMsg = lib.GatewayAPI_Util.setErrorMsg;
var log = lib.GatewayAPI_Logger.log("GatewayAPI_KM");
var createSCDatumArray = lib.GatewayAPI_Util.createSCDatumArray;
var scmsg = lib.GatewayAPI_RAD._scmsg;
var KMIDOLUtils = lib.KMIDOLUtils.require();
var NO_AUTH_EXIT= lib.GatewayAPI_Constants.NO_AUTH();

function retrieveDocTypes() {
	setExitType(NORMAL_EXIT);
	var tablefile = new SCFile("kmdoctype");
	var tablefind = tablefile.doSelect("true");
	var errorCount=0;
	var totalCount=0;
	while (tablefind==RC_SUCCESS)
	{
		var lang = new SCFile("language", SCFILE_READONLY);
		lang.setFields(["unique.id"]);
		var query ="unique.id=\"" + vars['$L.file']['name'] + "\"";
		var langret = lang.doSelect(query);
		while (langret == RC_SUCCESS)
		{
			var tmpfile = new SCFile("kmdoctype");
			funcs.fduplicate(tmpfile,tablefile);
			var doctype_name = tmpfile['name'];
			var doctype_display_name = getDocTypeLocalName(doctype_name);
			tmpfile['display.name'] = doctype_display_name;
			var views = tmpfile.format_view;
			var langcode = lang.unique_id;
			
			var i;
			var length = funcs.lng(views);
			for (i=0;i<length;i++)
	 	 	{
		 	 	var strData = views[i].view_data;
	            strData = lib.KMSRCCollection_Update.replaceSCMSGTokens(strData,langcode);
	            tmpfile.format_view[i].view_data=strData;
	 	 	}
	 	 	var xmlRecField = lib.KMUtils.recordToXML(tmpfile);
	 	 	
	 	 	vars['$L.file']['doctypes'][totalCount]['key']=tablefile['name'];
	 	 	vars['$L.file']['doctypes'][totalCount]['sedocid']=tablefile['name']+"_"+langcode;
	 	 	vars['$L.file']['doctypes'][totalCount]['xmlRec']=xmlRecField;
	 	 	totalCount++;
	 	 	langret = lang.getNext();
		}
		tablefind = tablefile.getNext();
	}
}

function searchDocTypes() {
	setExitType(NORMAL_EXIT);
	var tablefile = new SCFile("kmdoctype");
	var name = vars['$L.file']['name'];
	var tablefind = tablefile.doSelect("name=\"" + name + "\"");
	var errorCount=0;
	var totalCount=0;
	while (tablefind==RC_SUCCESS)
	{
		var lang = new SCFile("language", SCFILE_READONLY);
		lang.setFields(["unique.id"]);
		var languages = vars['$L.file']['languages'];
		var query ="unique.id isin {\"" + languages.split(",").join("\",\"") + "\"}";
		var langret = lang.doSelect(query);
		while (langret == RC_SUCCESS)
		{
			var tmpfile = new SCFile("kmdoctype");
			funcs.fduplicate(tmpfile,tablefile);
			var doctype_name = tmpfile['name'];
			var doctype_display_name = getDocTypeLocalName(doctype_name);
			tmpfile['display.name'] = doctype_display_name;
			var views = tmpfile.format_view;
			var langcode = lang.unique_id;
			
			var i;
			var length = funcs.lng(views);
			for (i=0;i<length;i++)
	 	 	{
		 	 	var strData = views[i].view_data;
	            strData = lib.KMSRCCollection_Update.replaceSCMSGTokens(strData,langcode);
	            tmpfile.format_view[i].view_data=strData;
	 	 	}
	 	 	var xmlRecField = lib.KMUtils.recordToXML(tmpfile);
	 	 	
	 	 	vars['$L.file']['doctypes'][totalCount]['key']=tablefile['name'];
	 	 	vars['$L.file']['doctypes'][totalCount]['sedocid']=tablefile['name']+"_"+langcode;
	 	 	vars['$L.file']['doctypes'][totalCount]['xmlRec']=xmlRecField;
	 	 	totalCount++;
	 	 	langret = lang.getNext();
		}
		tablefind = tablefile.getNext();
	}
}

function search() {
	setExitType(NORMAL_EXIT);
	var text = vars['$L.file']['query'];
	var filters = vars['$L.file']['filters'];
	var filtersObj;
	if (filters.length()>0) {
		filtersObj = {};
		filtersObj.Filters = [];
		var i;
		var length = filters.length();
		for (i=0; i<length; i++) {
			if (filters[i]['field'] && filters[i]['operator']) {
				filtersObj.Filters.push({"field":filters[i]['field'], "operator": filters[i]['operator'], "value": filters[i]['value']});
			}
		}
		if (filtersObj.Filters.length==0) {
			filtersObj = null;
		}
	}
	var startIndex = vars['$L.file']['startIndex'];
	var pageSize = vars['$L.file']['pageSize'];

	var searchResult = lib.KMSearchInterface.srcSearch(text, filtersObj, startIndex, pageSize);
	if (searchResult) {
		vars['$L.file']['result'] = searchResult.toXMLString();
	}
}

function retrieveDocument() {
	setExitType(NORMAL_EXIT);
	var docID = vars['$L.file']['id'];
	
	var kmdoc = null;
	var docfile = null;
	var requestOnBehalf=vars['$L.file']['author'];
	var capability=[];
	var oriOperator=funcs.operator();
	if (requestOnBehalf !=null && oriOperator!=requestOnBehalf){
	    lib.GatewayAPI_Util.changeUserSession(requestOnBehalf);
	} 
	var newOper=funcs.operator();
	capability = lib.GatewayAPI_Cache.getCapabilityWordCache().get(newOper);
	var canView=true;
	if (funcs.index("SysAdmin", capability) > 0 ||
	    funcs.index("KMAdmin", capability) > 0 ) {
	    canView=true;
	}
	else {
	    canView=canAccessKmdocument(docID);
	}
	    
	if(docID)
	{
		try
		{
			docfile =  new SCFile("kmdocument");
			var rc = docfile.doSelect('id="'+docID+'"');
			if( rc == RC_SUCCESS )
			{ //print(canView);
			   if(canView==false) {
      			 setExitType(NO_AUTH_EXIT);
     			 var docIDArray = createSCDatumArray();
     			 docIDArray.push(docID);
     			 setErrorMsg(scmsg(185, "km", docIDArray)); 
     			 if (newOper!=oriOperator){
				 	lib.GatewayAPI_Util.changeUserSession(oriOperator); 
				 }   
     			 return;
     			}
				kmdoc = docfile.getXML();
				var guidstr= lib.KMDocumentAttachment.getGUIDs(docID);
				if(guidstr)
				{
					KMIDOLUtils.appendNewNode( 1, 'guids', null, kmdoc, 'instance' );
					KMIDOLUtils.appendNewNode( 3, null, guidstr, kmdoc, 'guids' );
				}
		    }
		    else 
		    {
		    	setExitType(NO_RECORD_EXIT);
		    	vars.$L_file=null;
		    	if (newOper!=oriOperator) {
		    	    lib.GatewayAPI_Util.changeUserSession(oriOperator);
		    	}
		    	return;
		    }
			vars['$L.file']['summary'] = kmdoc.toXMLString();
			lib.KMDocStatusChanges.generateCatsForDoc(docfile);
			vars['$L.file']['doctype'] = docfile.generatedcats.join(";");
			if (newOper!=oriOperator) {
			    lib.GatewayAPI_Util.changeUserSession(oriOperator);
			}
		}
		catch(e)
		{
			log.error(e);
			setExitType(NO_RECORD_EXIT);
			vars.$L_file=null;
			if (newOper!=oriOperator) {
			    lib.GatewayAPI_Util.changeUserSession(oriOperator);
			}
		}
		try
		{		 
		 lib.KMUsageStats.incrementViewCount(docID, "kmdocument");
		}
		catch(er)
		{
			log.error(er);
			setExitType(BAD_VALIDATION_EXIT);
		}
	} else {
	   setExitType(NO_RECORD_EXIT);
	}
}

function getDocTypeLocalName(name) {
	var kmDocTypeGL = vars['$G.kmdoctype.name'];
	var index = funcs.index(name, kmDocTypeGL);
	var kmDocTypeGL_Display = vars['$G.kmdoctype.display'];
	if (index > 0) {
		return kmDocTypeGL_Display[index-1];
	}
	return name;
}


function canAccessKmdocument(itemName) {
    if (getKMPage(itemName, "Default View") !== null) {
        return true;
    }
    else {
        return false;
    }
}

function getKMPage(kmid, view, lang) {
    var kmdocument = new SCFile("kmdocument");
    var sql = "id = \"" + kmid + "\"";

    var rc = kmdocument.doSelect(sql);
    while (rc == RC_SUCCESS) {
        if (getDocWithViewName(kmdocument, view)) {
            return vars["$L.docwithview"];
        }
        rc = kmdocument.getNext();
    }

    return null;
}


function getDocWithViewName(record, specficViewName)
{
	var record2 = new SCFile();	
	funcs.fduplicate(record2, record);
	
	if (null!=record.title) {
	    record2.title = lib.StringUtil.escapeStringforXML(record.title);
	}
	
	if (null!=record.summary) {
	    record2.summary = lib.StringUtil.escapeStringforXML(record.summary);
	}
	
	record = record2;
	
	var showDoc = false;
	//first we need to create some arrays of the values in every view
	//so that we don't have to loop multiple times through the views later
	var kmViewNameArray = new SCDatum();
 	var kmViewSecLevelArray = new SCDatum();
	var kmViewGroupArray = new SCDatum();
	kmViewNameArray.setType(8);
	kmViewSecLevelArray.setType(8);
	kmViewGroupArray.setType(8);

	//QCCR1E54983 check the user authority for the document first unless they are in preview
	if (!vars.$L_preview)
	{
		var auth= doesUserHaveDocViewRights(record);
 		if(auth==false) 
 		{
	     	/*var arrayArgs = new SCDatum();
	   		arrayArgs.setType(2);  
	   		arrayArgs.push(record.id);
	   		print(funcs.scmsg(185, "km", arrayArgs)); */ //You do not have permission to view the knowledge document with id %S.
	   		return false;
	   	}
	}  

    //get the doctype record
	var q = new Query("kmdoctype", new QueryCond("name", EQ, record.doctype));
	var q0 = q[0]; 
	// Error check if the document was read correctly. I3150
	if (!q0)
	{
		print(funcs.scmsg(159, "km")); // Cannot display this document, possibly due to the deletion of a linked document.
		return false;
	}
	
	var views = q0.format_view;
	var vlength = views.length();
	var view;
	
	var vwIdx;
	for (vwIdx=0;vwIdx < vlength;vwIdx++)
	{
	    view = views[vwIdx];
	    var vwGrpIdx;
	    var rlength = view.view_roles.length();
		for (vwGrpIdx=0;vwGrpIdx < rlength;vwGrpIdx++)
		{
			kmViewNameArray = funcs.insert(kmViewNameArray,0,1,view.view_name,true);
			kmViewSecLevelArray = funcs.insert(kmViewSecLevelArray,0,1,view.view_seclevel,true);
			kmViewGroupArray = funcs.insert(kmViewGroupArray,0,1,view.view_roles[vwGrpIdx],true);
		}		
	}
	
	if (vwIdx==0)
	{
		//vwIdx should only be 0 if there were no views at all, in that case just
		//give a message to the user
	  	vars.$L_docwithview = "There is no view for this document type";		
	}
	else
	{
		//debugging statements
	  /*
		print(kmViewNameArray);
		print(kmViewSecLevelArray);
		print(kmViewGroupArray);
	  */
		//now that we have all the views values sorted in arrays we can use 
		//them to determine which view to use
		var highestLevelVal = 0;
		var highestLevelViewName = "";

        var vwLstIdx;
        var nlength;
        
		//first check if the user is an admin
		if (funcs.index("SysAdmin", vars.$lo_ucapex) > 0 ||
		    funcs.index("KMAdmin", vars.$lo_ucapex) > 0 ||
	    	vars.$G_km_environment.doctypes )
		{	
			//in this case just get the highest sec level view
			nlength = kmViewNameArray.length();
			for (vwLstIdx=0;vwLstIdx < nlength;vwLstIdx++)
			{
				if (kmViewSecLevelArray[vwLstIdx] > highestLevelVal)
				{
					highestLevelVal = kmViewSecLevelArray[vwLstIdx];
					highestLevelViewName = kmViewNameArray[vwLstIdx];
				}
			}

			if (highestLevelViewName == "")
			{
				showDoc = false;
			}
			else
			{
				showDoc = true;
			}

		}
		else
		{
			//call api to determine which groups the user has rights in with 
			//relation to the document based on the doc id passed in
			var grps = lib.KMSecurity.getKMGroupsForDocView(record);//call to api
			//grps should now either be an 
			//1 empty array (can't view doc)
			if (grps.length() == 0)
			{
	  			showDoc = false;
			}
			//2 single value array(use that group to pick the view)
			else if (grps.length() == 1)
			{
			    nlength = kmViewNameArray.length();
				for (vwLstIdx=0;vwLstIdx < nlength;vwLstIdx++)
				{
					if (kmViewGroupArray[vwLstIdx] == grps[0])
					{
						highestLevelVal = kmViewSecLevelArray[vwLstIdx];
						highestLevelViewName = kmViewNameArray[vwLstIdx];
					}
				}
				if (highestLevelViewName == "")
				{
					showDoc = false;
				}
				else
				{
					showDoc = true;
				}
			}
			//3 multi value array(multiple groups so sec level has to be considered)
			else
			{
			    nlength = kmViewNameArray.length();
				for (vwLstIdx=0;vwLstIdx < nlength;vwLstIdx++)
				{
				    var grpsIdx;
				    var glength = grps.length();
					for (grpsIdx=0;grpsIdx < glength;grpsIdx++)
					{
						if (kmViewGroupArray[vwLstIdx] == grps[grpsIdx])
						{
							if (kmViewSecLevelArray[vwLstIdx] > highestLevelVal)
							{
								highestLevelVal = kmViewSecLevelArray[vwLstIdx];
								highestLevelViewName = kmViewNameArray[vwLstIdx];
							}
						}
					}
				}
				if (highestLevelViewName == "")
				{
					showDoc = false;
				}
				else
				{
					showDoc = true;
				}
			}
		}

        var theView;
        var vwIdx2;
        var idxName;
        
		if (showDoc)
		{
		    //Updated by kang.pan@hp.com for KM Mobile Detail View 8/8/2013
			//If the client type is "mobile", the View Name should be "Default Mobile View"
			if (vars.$G_client_type=="mobile"){
				highestLevelViewName="Default Mobile View";
			}else if(specficViewName !=undefined && specficViewName!=null){
				highestLevelViewName=specficViewName;
			}
	    	//now we SHOULD have a value in our name variable-if we don't there is an error
			if (highestLevelViewName == "")
		    {
	    		//do nothing for now
		  		vars.$L_docwithview = "There was an error trying to locate the view for this document";
		    }	
			else
			{
				//since we have a name here we want to find the view that corresponds
				if (vlength > 0)
				{
					idxName = 0;
					for (vwIdx2=0;vwIdx2 < vlength;vwIdx2++)
					{
						if (views[vwIdx2].view_name == highestLevelViewName)
						{
							idxName = vwIdx2;
						}
					}
			
					//then get the view data from the query result
					theView = views[idxName].view_data;
					if (theView==null)
					{
						vars.$L_docwithview = "There is no data in the Document View for this Document Type."; 
					}
					else
					{
						theView = lib.KMDocPreview.replaceTokensWithData( theView, record);
				    	if(vars.$G_client_type=="mobile")
						{
						  theView = lib.KMDocPreview.replaceLikeTokensWithData( theView, record);
						}
				    	theView = lib.KMDocPreview.replaceSCMSGTokens(theView);
		    
					  	vars.$L_docwithview = theView;
					  	vars.$L_externaldoc = lib.KMDocPreview.getAttPreview(record.id);
					 }
				 }
				 else
				 {
				 	vars.$L_docwithview = "There is no Document View for this Document Type.";
				 }
			}
		}
		else
		{
			//so we have decided that if a user has no rights then they will get the default
			//view...this may fail if the default view does not exist 
		
			//since we have a name here we want to find the view that corresponds
			idxName = 0;
			var havedefault = false;
			var defaultViewName = "Default View";
			
			//Updated by kang.pan@hp.com for KM Mobile Detail View 8/8/2013
			//If the client type is "mobile", the Default View Name should be "Default Mobile View"
			if (vars.$G_client_type=="mobile"){
				defaultViewName="Default Mobile View";
			}
			
			for (vwIdx2=0;vwIdx2 < vlength;vwIdx2++)
			{
				if (views[vwIdx2].view_name == defaultViewName)
				{
					idxName = vwIdx2;
					havedefault = true;
				}
			}
			
			if ((idxName == 0 ) && (havedefault == false))
			{
			  //this means they not only have no rights but there is no default view 
			  //so they are unlucky...
				vars.$L_docwithview = "There is no default view for this document.";
			}
			else
			{
				//then get the view data from the query result
				theView = views[idxName].view_data;
				if (theView==null)
				{
					vars.$L_docwithview = "There is no data in the Document View for this Document Type."; 
				}
				else
				{
					theView = lib.KMDocPreview.replaceTokensWithData( theView, record);

				    theView = lib.KMDocPreview.replaceSCMSGTokens(theView);
	    			vars.$L_externaldoc = lib.KMDocPreview.getAttPreview(record.id);
		  			vars.$L_docwithview = theView;
			  	}
			 }
		
		}
	}
	
	return showDoc;
}


function doesUserHaveDocViewRights(record)
{
	// Ensure that the record is not null
	if ( record == null ) {
		return false;
	}

	// Check if this user is an admin. Admins can view any kmdocument
	// The operator cap.exec array settings indicate admin permissions
	/*if (funcs.index("SysAdmin", vars.$lo_ucapex) > 0 ||
	    funcs.index("KMAdmin", vars.$lo_ucapex) > 0 ) {
	    return true;
	}*/
	    
	// Not an admin. Check the user's view external or internal/external rights.
	var fullpathid = "";
	var docCatArrayLength = 0;
	var permCatArrayLength = 0;
	var m;
	var p;
	if ( record.status == "internal" )
	{
		permCatArrayLength = vars.$G_viewintext.length();
		// Check if this document's category(s) start with a cat in the vars.$G_viewintext array.
		// OK to view if so
		
		for (m = 0; m < permCatArrayLength; m++)
		{
			docCatArrayLength = record.categories.length();
			fullpathid = vars.$G_viewintext[m];	
			for (p = 0; p < docCatArrayLength; p++)
			{
			 //print("inrecord.categories"+record.categories[p] );
				if (record.categories[p].indexOf(fullpathid) == 0 ) {
					return true;					
				}
			}	
		}
		// Couldn't find the document's category in the view int and ext category array	for this user.
		return false;
	}	
	else if ( record.status == "external" )
	{
		permCatArrayLength = vars.$G_viewext.length();
		// Check if this document's category(s) start with a cat in the vars.$G_viewext array.
		// OK to view if so
		for (m = 0; m < permCatArrayLength; m++)
		{
			docCatArrayLength = record.categories.length();
			fullpathid = vars.$G_viewext[m];
			for (p = 0; p < docCatArrayLength; p++)
			{
				if (record.categories[p].indexOf(fullpathid) == 0 ) {
					return true;					
				}
			}	
		}		
		// Couldn't find the document's category in the view ext category array	for this user.
		return false;
	}
	else if ( record.status == "retired" )
	{
		permCatArrayLength = vars.$G_retire.length();
		// Check if this document's category(s) start with a cat in the vars.$G_retire array.
		// OK to view if so
		for (m = 0; m < permCatArrayLength; m++)
		{
			docCatArrayLength = record.categories.length();
			fullpathid = vars.$G_retire[m];	
			for (p = 0; p < docCatArrayLength; p++)
			{
				if (record.categories[p].indexOf(fullpathid) == 0 ) {
					return true;
				}					
			}	
		}
		 	
		// Couldn't find the document's category in the view ext category array	for this user.
		return false;
	}
	
	// This function was called with a document status other than internal or external.
	return false;	
}