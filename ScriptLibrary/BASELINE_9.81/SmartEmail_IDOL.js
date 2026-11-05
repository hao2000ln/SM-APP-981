var _ = lib.Underscore.require();
var api = lib.acicategory;

var logger = getLog('SmartEmail_IDOL');
var DEFAULT_CANDIDATE_NUM = 1;
var IDOL_Utilities = lib.IDOL_Utilities;
var IDOLFileMagic = lib.IDOLFileMagic.require();
var _contains = lib.ArrayUtil.contains;
var localscmsg = lib.NotificationRecipientsHelp.determinMsg;
var reloadQuery = lib.AddQuotation.reloadQuery;

function genRESTBaseURL() {
    return lib.smis_RestClient.genRESTBaseURL();
}


/**
*   Call IDOL Image Service to process the attachment in a ticket and set it to target field
*
*   @param {record} - scfile of a ticket record
**/
function processOCR(record, attachments, targetField, language) {
    var isInDAH = IDOL_Utilities.checkOCRInDAH();
    var description = '';  
    var imgTypeList = ['jpg','jpeg','gif','png','bmp','tiff','tif'];
    var index = 0;
    var attach_binary;
    var mine_type;
    var file_size;
    var text;
    
    var i;
    for (i=0; i<attachments.length; i++) {
    	if (attachments[i].fileType != null && _contains(imgTypeList, attachments[i].fileType.toLowerCase())) {
			attach_binary = readFile(attachments[i].filePath, 'b');
			mine_type = IDOLFileMagic.detectMineType(attach_binary);

			if (mine_type.indexOf('image') >= 0) {
                logger.info("OCR for image: " + attachments[i].fileName);
				file_size = attachments[i].fileSize;
	            if (isInDAH && file_size > IDOL_Utilities.maxImageSizeDAH()) {
	                text = funcs.scmsg('67', 'idol', [attachments[i].fileName]);
	            } else {
	                text = lib.IDOLImageOCRService.synchronousParse(attach_binary, language);
	            }
	            if (text) {
	               if (index > 0) {
	                    description += '\n' + IDOL_Utilities.ocrSeperator() + '\n';
	                }
	                description += text;
	                index ++;
	            }
			}
			else {
				logger.info("attachment \"" + attachments[i].fileName + "\" is not an image, skip the OCR.");
			}
		}
		else {
			logger.info("attachment \"" + attachments[i].fileName + "\" is not an image, skip the OCR.");
		}
    }
 
    if (description !== '') {
    	var ocrFlag = IDOL_Utilities.ocrFlag();
//        var msgrecord = '1';
//        var msgclass = 'idol';
//        var text = localscmsg(language,msgclass,msgrecord);
        record[targetField] = [IDOL_Utilities.removeOCRDescription(record[targetField])];
//        record[targetField].push(text);
        record[targetField].push(ocrFlag);
        description = description.split('\n');
        var idx;
        for (idx=0; idx < description.length; idx++) {
        	record[targetField].push(description[idx]);
        }
        record[targetField].push(ocrFlag);
    }
}


/**
    Query IDOL via SM RESTful API, to get suggestion for fields in ticket, e.g. category, subcategory, product.type, affected.item.
	IDOL Response Format:
	{
  		"Messages": [
    		"No suggestion for Smart Ticket configuration 7 due to incorrect parameter or configuration.",
    		"[object Object]"
  			],
  		"ReturnCode": 0,
  		"SmartAnalytics": {
   			"in": "{filename:\"incidents\",title:\"Test Incident in background\",description:[\"description\",\"Server is down\"],callback_contact: \"\"}",
    		"out": "{\"category\":\"incident\",\"subcategory\":\"hardware\",\"product.type\":\"hardware failure\",\"affected.item\":null}"
  		}
	}
**/
function fillSuggestionRESTAPI(record,operator) {
	var defaultValues = {};
	try{
		if(!lib.ArrayUtil.contains(lib.operatorUtil.getCapabilityWordsByOperator(operator), 'RESTful API')){
			return record;
		}
		var headers = lib.SmartEmailSMHelperAPI.createRESTHeader(operator);
		var filename = funcs.filename(record);
		var filetag = 'filename:"' + filename + '"';
		
		var title_field = (filename === "incidents") ? "title" : "brief_description";
		var desc_field = (filename === "incidents") ? "description" : "action";
		var contact_field = (filename === "incidents") ? "callback_contact" : "contact_name";
		
		var titletag = title_field + ':"' + populateTitle(filename,record) + '"';
		var desctag = desc_field + ':["' + populateDesc(filename,record) + '"]';
		var callbacktag = contact_field + ':"' + populateCallback(operator) + '"';
		var companytag = populateCompany(operator);

		var intag = '{'+ filetag + ',' + titletag + ',' + desctag + ',' + callbacktag;
		if(companytag){
			intag = intag + ',company:"' + companytag + '"' + '}';
		} else {
			intag = intag + '}';
		}

        var jsonBody = {
			SmartAnalytics:{
                  'in':intag
      			}
			};
		var restUrl = genRESTBaseURL() + 'SmartAnalytics/idol/action/suggest';
		var response = lib.smis_RestClient.doRESTPostRequest(restUrl, headers, JSON.stringify(jsonBody));

		response = rteJSONParse(response);
		checkRestfulResponseValid(response);
		var suggest = rteJSONParse(response["SmartAnalytics"]["out"]);
		if(suggest){
		    var field;
			for(field in suggest){
				if (suggest[field] && (suggest[field] !== "undefined" && suggest[field] !== "")) {
					defaultValues[field] = record[field];
					record[field] = suggest[field];
				}
			}
		}
	    
    }catch(ex){
	    logger.error(ex);
    }
	return defaultValues;
}

/**
	Query IDOL for possible solution for ticket, Knowledge_Library, Catalog_Library are configured here.
{
  "@count": 2,
  "@start": 1,
  "Messages": [],
  "ResourceName": "SmartAnalytics",
  "ReturnCode": 0,
  "content": [
    {"SmartAnalytics": {
      "content": "PC Backup. PC Backup. The PC Backup service provides a secure reliable means of protecting data stored locally on <em>Windows<\/em> based clie
nt PC's, offering a fast and easy method of data restoration while being relatively transparent to the user.. The PC Backup service provides a secure relia
ble means of protecting",
      "id": "1631",
      "title": "PC Backup"
    }},
    {"SmartAnalytics": {
      "content": "iPaq. iPaq. Great for performance and connectivity. Great for performance and connectivity  · Intel PXA270 processor (520MHz)  ·<em>Windows<\/
em> Mobile 5.0 for Pocket PC, Premium Edition · 256 MB total memory (192 MB ROM 64 MB RAM) · Up to 192 MB user available persistent storage memory · Bluetooth w
ireless",
      "id": "1687",
      "title": "iPaq"
    }}]
}

**/
function findSolutionRESTAPI(record,operator) {
	var solutionCandidates = {};
	if(!lib.ArrayUtil.contains(lib.operatorUtil.getCapabilityWordsByOperator(operator), 'RESTful API')){
		return solutionCandidates;
	}
	var numberofDoc = lib.settings.getSettingValue("SmartEmail", "proposedDocNumber");
	var numberofSO = lib.settings.getSettingValue("SmartEmail", "proposedServiceOfferingNumber");
	try{
		var restUrl = genRESTBaseURL() + 'SmartAnalytics/idol/action/search';
		var headers = lib.SmartEmailSMHelperAPI.createRESTHeader(operator);
		var filename = funcs.filename(record);
		var queryValue = populateDesc(filename,record);
		var query = reloadQuery(queryValue);
		var jsonBody = {
 			 SmartAnalytics:{
                  "query":query,
                  start:1,
                  count:0,
                  filters:null,
                  max_characters:10,
                  startTag:'<_em_>',
                  endTag:'</_em_>',
                  attachflag:false
  				}
			};

        var libraris;
        var filter;
        
		if (numberofDoc > 0) {
			libraris = getIDOLKnowledgeBaseLib();
			if(libraris.length > 0){
				filter = populateFilter(libraris);
				jsonBody['SmartAnalytics']['filters'] = filter;
				jsonBody['SmartAnalytics']['count'] = numberofDoc;
	
				var responseDoc = lib.smis_RestClient.doRESTPostRequest(restUrl, headers, JSON.stringify(jsonBody));
				responseDoc = rteJSONParse(responseDoc);
				checkRestfulResponseValid(responseDoc);
				solutionCandidates["Knowledge_Library"] = prepareResult(responseDoc['content'],'kmdocument',libraris[0]);
			}
		}

        if (numberofSO > 0) {
        	libraris = getIDOLCatalogLib();
        	if(libraris.length > 0){
				filter = populateFilter(libraris);
	        	jsonBody['SmartAnalytics']['filters'] = filter;
				jsonBody['SmartAnalytics']['count'] = numberofSO;
	
				var responseSO = lib.smis_RestClient.doRESTPostRequest(restUrl, headers, JSON.stringify(jsonBody));
				responseSO = rteJSONParse(responseSO);
				checkRestfulResponseValid(responseSO);
				solutionCandidates["Catalog_Library"] = prepareResult(responseSO['content'],'joinsvcDisplay',libraris[0]);
			}
        }
		
    }catch(ex){
        logger.error(ex);
    }

    return solutionCandidates;
}

function prepareResult(contents,default_filename,default_library){
	var result = [];

	if(contents){
		var lng = contents.length;
		var i;
		for(i = 0; i < lng; i++){
			var item = {
				'id':contents[i]['SmartAnalytics']['id'],
				'title':contents[i]['SmartAnalytics']['title'] || contents[i]['SmartAnalytics']['href'],
				'isAttachment':contents[i]['SmartAnalytics']['isAttachment'],
				'hotnews':contents[i]['SmartAnalytics']['hotnews']
			};
			if(contents[i]['SmartAnalytics']['kbname']){
				item['filename'] = getFilenameByIdolLibrary(contents[i]['SmartAnalytics']['kbname']);
				item['kbname'] = contents[i]['SmartAnalytics']['kbname'];
			}else{
				item['filename'] = default_filename;
				item['kbname'] = default_library;
			
			}
			if(contents[i]['SmartAnalytics']['href']){
				item['href'] = contents[i]['SmartAnalytics']['href'];
			}
			generateHref(item);
			result.push(item);
		}
	}
	return result;
}

function generateHref(item){
	var href = null;
	if(item && item['filename'] && (item['filename'] == 'joinsvcDisplay' || item['filename'] == 'kmdocument') ){
		href = lib.urlCreator.getRecordURL(item['filename'], 'id="' + item['id'] + '"', item['title'], item['id']);
		if(vars.$G_sm_portal == 'ESS' && item['filename'] == 'joinsvcDisplay'){
			href = href + '&libname=' + item['kbname'] + '&openRecord=true';
		}
		item['href'] = href;
	}
}

function generateHTMLForProposals(proposals){
	var result = "";
	if(proposals && proposals.length > 0){
		var lng = proposals.length;
		result += '<ul>';
		var i;
		for(i = 0; i < lng; i++){
			result += '<li>';
			result += '<a href="' + proposals[i]['href'] + '">';
			result += proposals[i]['title'];
			result += '</a></li>';
		}
		result += '</ul>';
	}
	
	return result;
}

function getFilenameByIdolLibrary(library){
	var libfile = '';
	if(library){
		var sclib= new SCFile("kmknowledgebase",SCFILE_READONLY);
		var query = ' kbname="' + library + '"';
		sclib.setFields(['sclibtablename']);
		var ret = sclib.doSelect(query);
		if(ret == RC_SUCCESS){
			libfile = sclib.sclibtablename;
		}
	}
	return libfile;
}

function getIDOLKnowledgeBaseLib(){
	var kmlib = [];
	var sclib= new SCFile("kmknowledgebase",SCFILE_READONLY);
	var query = ' (kbtype="sclib" and sclibtablename="kmdocument") ';
	//For support External Libraries
    query = query + ' or (kbtype<>"sclib")';
	sclib.setFields(['kbname']);
	var ret = sclib.doSelect(query);
	while(ret == RC_SUCCESS){
		kmlib.push(sclib.kbname);
		ret = sclib.getNext();
	}
	return kmlib;
}

function getIDOLCatalogLib(){
	var calaloglib = [];
	var sclib= new SCFile("kmknowledgebase",SCFILE_READONLY);
	var query = 'kbtype="sclib" and sclibtablename="joinsvcDisplay"';
	sclib.setFields(['kbname']);
	var ret = sclib.doSelect(query);
	while(ret == RC_SUCCESS){
		calaloglib.push(sclib.kbname);
		ret = sclib.getNext();
	}
	return calaloglib;
}

function populateFilter(libs){
	var filter = {};
	if(libs && libs.length > 0){
		var lng = libs.length;
		var i;
		for(i = 0; i < lng; i++){
			filter[libs[i]] = {};
		}
	}
	return rteJSONStringify(filter);
}

function populateTitle(filename,record){
	var title = "";

	if('probsummary' == filename){
		title = record["brief.description"];
	} else if('incidents' == filename){
		title = record["title"];
	}

	if(!title){
		title = "";
	}
	return title.replace(/\"/gm, "");
}

function populateCallback(callback){
	var contact = lib.MailUtil.getContactRecord(callback, ['contact.name']);
	var conttag = "";
	if(contact){
		conttag = contact['contact.name'];
	}
	return conttag;
}

function populateCompany(callback){
	var companytag = null;

	if (vars['$G.system.info']['multi.company']) {
		var operator_record = new SCFile("operator", SCFILE_READONLY);
		operator_record.setFields(['company']);
		var rc = operator_record.doSelect('name="' + callback + '"');
		if (rc == RC_SUCCESS) {
			companytag = operator_record.company;
		}
	} else {
	    companytag = lib.SmartTicketMandantTools.getUserMandantValueByUserName(callback).join(',');
	}
	
	return companytag;
}

function populateDesc(filename,record){
	var desc = "";
	if('probsummary' == filename){
		desc = record["action"];
	} else if('incidents' == filename){
		desc = record["description"];
	}
	
	var temp = "";
	if(desc && typeof desc != 'string'){
		var desctemp = lib.ArrayUtil.toJsArray(desc);
		temp = desctemp.join(",").split('\n').join(",");
	} else {
		if(!desc){
			temp = "";
		} else {
			temp = funcs.str(desc);
		}
	}
	
	return temp.replace(/\"/gm, "");
}

// Check the response of RESTFul request to search
// When return code is not 0, print the response to log and return false
function checkRestfulResponseValid(response) {
    if (response == null) {
        return false;
    }
    
    var returnCode = +response["ReturnCode"];
    if (returnCode == 0) {
        return true;
    }
    
    var responseStr = rteJSONStringify(response);
    logger.error(responseStr);
    
    return false;
}
