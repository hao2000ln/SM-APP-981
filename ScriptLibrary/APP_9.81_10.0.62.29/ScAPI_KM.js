var NO_RECORD_EXIT = lib.ScAPI_Constants.NO_RECORD_EXIT();
var NORMAL_EXIT = lib.ScAPI_Constants.NORMAL_EXIT();
var BAD_VALIDATION_EXIT = lib.ScAPI_Constants.BAD_VALIDATION_EXIT();
var setExitType = lib.ScAPI_Util.setExitType;
var setErrorMsg = lib.ScAPI_Util.setErrorMsg;
var log = lib.ScAPI_Logger.log("ScAPI_KM");
var KMIDOLUtils = lib.KMIDOLUtils.require();

function retrieveDocTypes() {
	setExitType(NORMAL_EXIT);
	var tablefile = new SCFile("kmdoctype");
	var tablefind = tablefile.doSelect("true");
	var errorCount=0;
	var totalCount=0;
	while (tablefind==RC_SUCCESS)
	{
		var lang = new SCFile("language");
		var query ="unique.id=\"" + vars['$L.file']['name'] + "\"";
		var langret = lang.doSelect(query);
		while (langret == RC_SUCCESS)
		{
			var tmpfile = new SCFile("kmdoctype");
			system.functions.fduplicate(tmpfile,tablefile);
			var doctype_name = tmpfile['name'];
			var doctype_display_name = getDocTypeLocalName(doctype_name);
			tmpfile['display.name'] = doctype_display_name;
			var views = tmpfile.format_view;
			var langcode = lang.unique_id;
			
			for (var i=0;i<system.functions.lng(views);i++)
	 	 	{
		 	 	var strData = views[i].view_data;
	            strData = system.library.KMSRCCollection_Update.replaceSCMSGTokens(strData,langcode);
	            tmpfile.format_view[i].view_data=strData;
	 	 	}
	 	 	var xmlRecField = system.library.KMUtils.recordToXML(tmpfile);
	 	 	
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
		var lang = new SCFile("language");
		var languages = vars['$L.file']['languages'];
		var query ="unique.id isin {\"" + languages.split(",").join("\",\"") + "\"}";
		var langret = lang.doSelect(query);
		while (langret == RC_SUCCESS)
		{
			var tmpfile = new SCFile("kmdoctype");
			system.functions.fduplicate(tmpfile,tablefile);
			var doctype_name = tmpfile['name'];
			var doctype_display_name = getDocTypeLocalName(doctype_name);
			tmpfile['display.name'] = doctype_display_name;
			var views = tmpfile.format_view;
			var langcode = lang.unique_id;
			
			for (var i=0;i<system.functions.lng(views);i++)
	 	 	{
		 	 	var strData = views[i].view_data;
	            strData = system.library.KMSRCCollection_Update.replaceSCMSGTokens(strData,langcode);
	            tmpfile.format_view[i].view_data=strData;
	 	 	}
	 	 	var xmlRecField = system.library.KMUtils.recordToXML(tmpfile);
	 	 	
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
		filtersObj = new Object();
		filtersObj.Filters = new Array();
		for (var i=0; i<filters.length(); i++) {
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
	   
	if( docID )
	{
		try
		{
			docfile =  new SCFile("kmdocument");
			var rc = docfile.doSelect('id="'+docID+'"');
			if( rc == RC_SUCCESS )
			{
				kmdoc = docfile.getXML();
				var guidstr= lib.KMDocumentAttachment.getGUIDs(docID);
				if(guidstr)
				{
					KMIDOLUtils.appendNewNode( 1, 'guids', null, kmdoc, 'instance' );
					KMIDOLUtils.appendNewNode( 3, null, guidstr, kmdoc, 'guids' );
				}
			}
			vars['$L.file']['summary'] = kmdoc.toXMLString();
			lib.KMDocStatusChanges.generateCatsForDoc(docfile);
			vars['$L.file']['doctype'] = docfile.generatedcats.join(";");
			
		}
		catch(er)
		{
			log.error(er);
			setExitType(NO_RECORD_EXIT);
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
	} 
}

function getDocTypeLocalName(name) {
	var kmDocTypeGL = vars['$G.kmdoctype.name'];
	var index = system.functions.index(name, kmDocTypeGL);
	var kmDocTypeGL_Display = vars['$G.kmdoctype.display'];
	if (index > 0) {
		return kmDocTypeGL_Display[index-1];
	}
	return name;
}