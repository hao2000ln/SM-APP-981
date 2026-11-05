var log = getLog( 'urlCreator' );
var base64encoder = lib.Base64Encoder.encode;
var base64decoder = lib.Base64Encoder.decode;

function getURLFromQuery( filename, query, title )
{
	var doceng = "docEngine";
 	var queryURI = encodeURIComponent( query );
 	var titleURI = encodeURIComponent( title );
 	var url =  makeSCWebURL( vars.$G_webserver_url,
									  doceng,
									  filename,
									  queryURI,
									  "",
									  "",
									  titleURI);
	
	return url;
}

function getReportMetaURLFromQuery( filename, query, title )
{
	var doceng = "reportMeta";
 	var queryURI = encodeURIComponent( query );
 	var titleURI = encodeURIComponent( title );
 	var url =  makeSCWebURL( vars.$G_webserver_url,
									  doceng,
									  filename,
									  queryURI,
									  "",
									  "",
									  titleURI);
	
	return url;
}

function getSMSPURL(filename, id)
{
	var filenameTag=null;
	if(filename === "joinsvcDisplay")
	{
		filenameTag = "catalog-item";
	}
	else if(filename === "kmdocument")
	{
		filenameTag = "knowledge-article";
	}
	else if(filename === "SurveyInternal")
	{
		filenameTag = "survey";
	}
	else if (filename === 'incidents')
	{
		var record = new SCFile('incidents', SCFILE_READONLY);
		record.setFields(['category']);
		var ret = record.doSelect('incident.id="' + lib.StringUtil.escapeAllStr(id) + '"');
		if (ret == RC_SUCCESS) {
			filenameTag = record['category'] == 'service catalog' ? 'service-request' : 'support-request';
		} else {
			return null;
		}
	}
	
	var baseUrl = vars["$G.smsp.url"];
	if(vars["$G.sm.portal"]!=="SMSP" || baseUrl===null || filenameTag === null)
	{
		return null;
	}
	return getSMSPNormalizedURL(baseUrl, filenameTag, id);
}

function getSMSPNormalizedURL(baseUrl, filenameTag, id) {
    var ret;
    if (baseUrl.indexOf('ess/smRequestTracking') !== -1) {   
        var str;
        if( filenameTag == "survey") {
            str = baseUrl.replace(/smRequestTracking/g, "sm-survey").split('?');
        } else { 
            str = baseUrl.split('?');
        }
        ret = str[0] + "/" + id + "?"+ str[1];
    } else if (baseUrl.indexOf('/saw/ess') !== -1) {
        var str = baseUrl.split('?');
        if (filenameTag == "survey") {
            ret = str[0] + "/sm-survey/" + id + "?"+ str[1];
        } else {
            ret = str[0] + "/smRequestTracking/" + id + "?"+ str[1];
        }
    } else {
        ret = baseUrl;
        if (baseUrl.charAt(baseUrl.length - 1) != '/') {
            ret = ret + "/";
        }
        if (filenameTag == "survey") {
            ret = ret + "saw/ess/sm-survey/" + id;
        } else { 
            ret = ret + "saw/ess/smRequestTracking/" + id;
        }
    }
    return ret;
}

function getSMSPOfflineTicketURL()
{
    var baseUrl = vars["$G.smsp.url"];
    if(vars["$G.sm.portal"]!=="SMSP" || baseUrl===null)
    {
       return null;
    }
    return baseUrl + "/support/request/create" ;
}

function getESSURLFromQuery( filename, query, title )
{
	var doceng = "docEngine";
	var queryURI = encodeURIComponent( query );
 	var titleURI = encodeURIComponent( title );
 	//Fix for Office 365, if <a href="" is not a http link, plain text will be displayed in the email.
 	var essURL = "http://null";
 	if(vars.$G_ess_url){
 		essURL = vars.$G_ess_url;
 	}
	var url =makeSCWebURL( essURL,
						  doceng,
						  filename,
						  queryURI,
						  "",
						  "",
						  titleURI);
					
	log.info("====>" + url);
	return url;
}

function getSRCURLFromQuery( file_name, query, title )
{
	var filename = funcs.filename(vars.$L_file);
	//QCCR1E130442 when schduled survey runs, there is no $L.file.
	//add below code to bypass the strange logic of getting filename from $L.file not the argument, keep old logic as not to break anything.
	if(!filename || file_name === "SurveyInternal"){
		filename = file_name;
	}
	return getSRCURLFromQueryInternal(filename, query, title);
}


function getSRCURLFromQueryInternal( filename, query, title, id)
{
	var record = new SCFile(filename, SCFILE_READONLY);
	
	var result = record.doSelect(query);
	var incident_id;
	var unique_key;//add for QCCR1E116922
	
	var url = vars.$G_src_url?vars.$G_src_url:"";
	var url_length = url.length;
	if( url.substring(url_length-1) != "/" ) {
	    url = url + "/";
	}
	
	var url_parameter = "";
	if(result == RC_SUCCESS){
		if (filename == "incidents"){
			incident_id = record["incident.id"];
			url += "secure/main.jsp#account/";
			url += record['category'] == 'service catalog' ? 'serviceRequest/' : 'supportRequest/';
			url_parameter = encodeIncidentIdForSRCRequest(incident_id);
		}else if(filename == "Approval"){
			unique_key = record["unique.key"];
			url += "secure/main.jsp#approval/";
			var approval_target_file_name = record["file.name"];
			//change for QCCR1E95472, use the record name replace hard code name
			var approvalLabel = record["name"];
			if (approval_target_file_name == "incidents") {
				url += "service/";
			} else if (approval_target_file_name == "cm3r") {
				url += "change/";
			} else if (approval_target_file_name == "ocmq" || approval_target_file_name == "request") {
				url += "quote/";
			}else if (approval_target_file_name == "svcCartItem") {
				url += "service/";
				incident_id=getIncidentIDFromSvcCartItem(unique_key);		
			}
			if (incident_id==null) {
			    incident_id = unique_key;
			}
			url_parameter = encodeIncidentIdForSRCApproval(unique_key, incident_id, approval_target_file_name, approvalLabel);
		} else if (filename == 'SurveyInternal') {
			unique_key = record['number'];
			url += "secure/main.jsp#survey/";
			url += "detail/" + unique_key;
		} else if (filename == 'kmdocument') {
			url += "secure/knowledgedocument.form?documentId=" + id;
		} else if (filename == 'joinsvcDisplay') {
			var tag = '';
			if (record['support.item']) {
				tag = 'support';
			} else {
				tag = 'services';
			}
			url += "secure/main.jsp#" + tag + "/itemDetails/";
			url_parameter = encodeIncidentIdForSRCRequest(id);
		}
	}
	
	if (log.isDebugEnabled()) {
	   log.debug("SRC_URL for incident\""+incident_id+"\":"+url+url_parameter);
	}
	return url+url_parameter;
}

function encodeServiceCatalogIdForSRCRequest(svcId) {
	var delimiter = ":@#<>:";
	var text = "sm"+delimiter+"sm"+delimiter+svcId;
	return base64encoder(text + delimiter + getQueryHashValue("joinsvcDisplay", svcId));
}


function encodeIncidentIdForSRCRequest(incidentId) {
	var delimiter = ":@#<>:";
	var text = "sm"+delimiter+"sm"+delimiter+incidentId;
	return base64encoder(text + delimiter + getQueryHashValue("incidents", incidentId));
}

function encodeIncidentIdForSRCApproval(uniqueKey, incidentId, filename, label) {
	var delimiter = ":@#<>:";
	var text = "sm"+delimiter+"sm"+delimiter+incidentId+delimiter+filename+delimiter+label+delimiter+uniqueKey+delimiter+delimiter;
	return base64encoder(text + delimiter + getQueryHashValue(filename, uniqueKey + incidentId));
}

//add for QCCR1E116922
function getIncidentIDFromSvcCartItem(cartItemID) {
	var cartItem = new SCFile("svcCartItem", SCFILE_READONLY);
	cartItem.setFields(["cartId"]);
	var rc = cartItem.doSelect("cartItemId=\"" + cartItemID + "\"");
	if (rc == RC_SUCCESS) {
		var cart = new SCFile("svcCart", SCFILE_READONLY);
		cart.setFields(["sdID"]);
		rc = cart.doSelect("cartId=\"" + cartItem.cartId + "\"");
		if (rc == RC_SUCCESS) {
			return cart.sdID;
		}
	}
	return null;
}

//add for QCCR1E116802
function getQueryHashValue(filename, incidentId, uniquekey) {
	var url = getURLFromQuery(filename, incidentId, "");
	var index = url.indexOf("queryHash");
	if (index > -1) {
		return url.substring(url.indexOf("queryHash") + 10);
	} else {
		return "";
	}
}

function getMobilityURLFromQuery( filename, query, title )
{
	var objType="";
	var objKey="";
	
	switch (filename)
	{
		case "cm3r" :
			objKey = getChangeKeyFromChangeQuery( query );
			objType = "change";
			break;
		case "Approval" :
			objKey = getUniqueIdFromApprovalQuery( query );
			objType = "change";
			break;
		case "probsummary" :
			objKey = getProbsummaryKeyFromProbsummaryQuery( query );		
			objType = "incident";
			break;
	}

	var url = String(vars.$G_mobility_url);
	
	if (url.charAt(url.length - 1) != "/")
	{
		url += "/";
	}
	
	url = url + "?record=" + objKey;
	
	return url;
}

function getChangeKeyFromChangeQuery( query )
{
	var change = new SCFile("cm3r", SCFILE_READONLY);
	change.setFields("number");
	var rc = change.doSelect(query);
	
	if (rc == RC_SUCCESS)
	{
		print(change.number);
		return change.number;
	}
	
	return null;
}

function getUniqueIdFromApprovalQuery( query )
{
	var approval = new SCFile("Approval",SCFILE_READONLY);
	approval.setFields("unique_key");
	var rc = approval.doSelect(query);
	
	if (rc == RC_SUCCESS)
	{
		return approval.unique_key;
	}
	
	return null;
	
}

function getProbsummaryKeyFromProbsummaryQuery( query )
{
	var probsum = new SCFile("probsummary",SCFILE_READONLY);
	probsum.setFields("number");
	var rc = probsum.doSelect(query);
	
	if (rc == RC_SUCCESS)
	{
		return probsum.number;
	}
	
	return null;
}

function drilldownURLCreater() {

	var handler = {
			
		getURLFromQuery: function (filename, query, title ) {
			
			var doceng = "docEngine";
			var templateURL = vars.$G_webserver_url || "http://<hostname>:<port>/<AppName>/index.do";
		 	var queryURI = encodeURIComponent( query );
		 	var titleURI = encodeURIComponent( title );
		 	var url =  makeSCWebURL( templateURL,
									  doceng,
									  filename,
									  queryURI,
									  "",
									  "",
									  titleURI);
	
			return url;
		}
	};
	
	return handler;
}


/**
*   get record url
*
*   @param {String}		file_name - file name
*   @param {String}		record_query - record query string
*   @param {String}		record_title - record title
*	@return {String}		url
**/
function getRecordURL(file_name, record_query, record_title, id) {
	var info = lib.ScAPI_Util.getSystemInfo();
	vars.$G_sm_portal = info['sm.portal'];
	vars.$G_webserver_url = info['webserver.url'];
	vars.$G_ess_url = info['ess.url'];
	vars.$G_src_url = info['src.url'];
	vars.$G_smsp_url = info['smsp.url'];
	  
	var url = null;
	if (vars.$G_sm_portal == 'ESS') {
		url = getESSURLFromQuery(file_name, record_query, record_title);
	} else if (vars.$G_sm_portal == 'SRC') {
		url = getSRCURLFromQueryInternal(file_name, record_query, record_title, id);
	} else if (vars.$G_sm_portal == 'SMSP') {
		url = getSMSPURL(file_name, id);
	}
	
	return url;
}


/**
*   get service portal url
*
*   @param {String}		file_name - file name
*   @param {String}		record_query - record query string
*   @param {String}		record_title - record title
*	@return {String}		url
**/
function getServicePortalURL(file_name, id, record_title) {
	var url = vars.$G_smsp_url?vars.$G_smsp_url:"";
	return '';
}

/**
*   get the web server url by based on $G.webserver.url 
*
*	@return {String}		url
**/
function getRelativeURL(){ 
	if(vars.$G_webserver_url!=null && vars.$G_webserver_url!= ""){
		return vars.$G_webserver_url.replace(/\/index\.do$/, "");	
	}else {
		return "http://null";
	}
}
