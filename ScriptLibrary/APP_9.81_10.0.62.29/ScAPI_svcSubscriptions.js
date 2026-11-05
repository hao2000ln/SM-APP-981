/**
 * @fileoverview svcSubscriptions - contains functions used for
 *               Subscription/UnSubscription
 * @author Princeton Viyani
 */
var log = lib.ScAPI_Logger.log("ScAPI_svcSubscriptions");
var queryBuilder = lib.ScAPI_RAD._queryBuilder;
var select = lib.ScAPI_RAD._select;
var NORMAL_EXIT = lib.ScAPI_Constants.NORMAL_EXIT();
var NO_RECORD_EXIT = lib.ScAPI_Constants.NO_RECORD_EXIT();
var BAD_VALIDATION_EXIT = lib.ScAPI_Constants.BAD_VALIDATION_EXIT();
var setExitType = lib.ScAPI_Util.setExitType;
var setErrorMsg = lib.ScAPI_Util.setErrorMsg;
var covertToArrayString = lib.ScAPI_Util.covertToArrayString;
var getCurrentOperator = lib.ScAPI_Util.getCurrentOperator;
var getMsg = lib.ScAPI_Util.getMessage;

var DEPT_DEF = 'dept';
var LOGIN_NAME = 'loginName';
var IN_ID_STRING = 'in.id.string';
var IN_STATUS_STRING = 'in.status.string';
var PAGE_SIZE = 'pagesize';
var START='start';
var UPDATE_TIME='updateTime';
var REC_COUNT='reccount';
var ID_STRING = 'id';
var COMMENTS='comments';

var sortByNames = ["Subscriber", "DateIssued","SubscriptionID","Status"];
var sortByFields = ['subscriber','sysmodtime','subscriptionID','status'];

/**
 * This function is called to get Subscription list of records.
 * 
 */
function getSubscription() 
{	
	var fields = ['subscriptionID','subscriber','status','sysmodtime','svcCatItemDesc','subscriberType','displayName'];

	var index = 0;
	var oper;
	var operName;
	var idString;
	var subscriptionStatus;
	var TimeUpdate;
	var deptField;
	var deptSubscriber;
	var contactName;
	var pageSize;
	var StartPage;
	var showDetail;


	// For Pagination
	var totalCount = 0;
	var startNum = 0;

	var idAssigned;
	var appendSql = "";
	var query;

	//Find the Login User
	oper = getCurrentOperator();
	vars.$L_file[LOGIN_NAME] = oper['name'];

	showDetail = vars.$L_file.showDetail == null ? true : vars.$L_file.showDetail;
	vars.$L_file.showDetail=showDetail;

	//He, Peng-Fei no more need to retrieve contact name because it can be retreived from global var $lo.dept.fullname
	//Get the department name for the current user
	
	vars.$L_file[DEPT_DEF] = vars['$lo.dept.fullname'];

	idString   = vars.$L_file[IN_ID_STRING];
	subscriptionStatus = vars.$L_file[IN_STATUS_STRING];
	TimeUpdate = vars.$L_file[UPDATE_TIME];
	idAssigned = idString == null ? false : true;
	
	var inType = vars.$L_file['in.type.string'];
	if (inType != null && inType != "department" && inType != "individual"){
		setErrorMsg(lib.ScAPI_Util.getMessage(187)); //Invalid subscription Type. The type must be department or individual.
		setExitType(BAD_VALIDATION_EXIT);
		return;
	}

	if (idAssigned) {
		appendSql += " and subscriptionID isin {" + idString + "}";
	}

	query = _getSubscriptionSQL(oper,vars.$L_file[DEPT_DEF], inType);

	if (appendSql != "") {
	    query =  query +  appendSql;
	}
	if(subscriptionStatus!= null && subscriptionStatus!= '') {
		if( funcs.index(subscriptionStatus, vars['$G.subscription.status']) < 1 ) {
			setExitType(BAD_VALIDATION_EXIT);
      		setErrorMsg(lib.ScAPI_Util.getMessage(179));
      		return;
		}
		query =  query +  " and status=\"" + subscriptionStatus + "\"";
	}
	if(TimeUpdate!=null && TimeUpdate!='') {
	    query = "("+ query +")"+  " and sysmodtime >= '" + new XMLDate(TimeUpdate).getDatum().getText() + "'";
	}
	
	vars.$L_file[REC_COUNT] = lib.ScAPI_RAD._count("Subscription", query);

	pageSize = vars.$L_file[PAGE_SIZE];
	pageSize = (pageSize == null) ? 10 : pageSize;
	vars.$L_file[PAGE_SIZE] = pageSize;
	if (vars.$L_file[START]==0) {
	    vars.$L_file[START]=1;
	}
	StartPage = vars.$L_file[START] == null ? 1 : vars.$L_file[START];
	vars.$L_file[START] = StartPage;
	var subscription;
	
	if (idAssigned)
	{	
		subscription = select("Subscription", query, fields, [getSortBy()], [getOrderBy()]);	
		if (subscription)
		{
			index=0;
			do
			{	         	
				_setToFile(subscription, index++);
			} while (subscription.getNext() == RC_SUCCESS);
			vars.$L_file[PAGE_SIZE] = null;
			vars.$L_file[START] = null;
		}
		else {		
			setExitType(BAD_VALIDATION_EXIT);
        	setErrorMsg(lib.ScAPI_Util.getMessage(184));
			return;
    	}
	}
	else
	{
		subscription = select("Subscription", query, ['subscriptionID'],[getSortBy()], [getOrderBy()]);
		if (subscription)
		{
			var subscriptionArr = [];
	    	do
	    	{
				if (totalCount < (StartPage - 1)){
					totalCount++;
		       		rc = subscription.getNext();
		           	continue;
				}
		     
				subscriptionArr.push(subscription['subscriptionID']);
				totalCount++;
				if (totalCount >= (StartPage + pageSize - 1)){
					break;
				}
			     
			     rc = subscription.getNext();
			     
		    } while (rc == RC_SUCCESS);
	    
	        var i;
	        
		    if (!showDetail){
				for (i = 0; i < subscriptionArr.length; i++){
					vars.$L_file.SubscriptionList[index]['subscriptionID'] = subscriptionArr[i].toString();					
					index++;
				}
			} else {
		    
				var inSql = ' and subscriptionID isin {';	
				for (i = 0; i < subscriptionArr.length; i++){
					inSql = inSql + '"' + subscriptionArr[i] + '"';
					if (i < (subscriptionArr.length - 1)){
						inSql = inSql + ",";
					}
				}
				inSql = inSql + "}";
			
				if (!lib.ArrayUtil.contains(fields,getSortBy())){
				    fields.push(getSortBy());
				}
			
				subscription = select("Subscription", query + inSql,fields, [getSortBy()], [getOrderBy()]);
		    	if (subscription){	    	
			        do
		    	    {
		        	    _setToFile(subscription, index);
		            	index++;
			            rc = subscription.getNext();
			        } while (rc == RC_SUCCESS);
		    	}
		 	}
		}
		else {
			setExitType(NO_RECORD_EXIT);
			return;
    	}    
	}

	vars.$L_file[IN_ID_STRING] = null; // Clear the user input string

	if (log.isDebug()) {
	    log.debug("Return file is : " + vars.$L_file);
	}

	setExitType(NORMAL_EXIT);
}


/**
 * This function is called to unsubscribe the record based on subscription ID
 * and Status as Active.
 * 
 */
function unsubscribeUnsubscription()
{ 
	setExitType(NORMAL_EXIT);
	vars['$G.ess'] = true;
	var requestID;
	var unsubscribeComments;
	var unsubscriptions;
	var operName;
	var deptSubscriber;
	var deptField;
	var Query;
	
	oper = getCurrentOperator();
 
	contactName = oper['contact.name'];
	if(contactName) {
		deptSubscriber = select("contacts", "contact.name=\"" + contactName + "\"", [DEPT_DEF]);	 
	}
	deptField = deptSubscriber[DEPT_DEF];
	requestID = vars.$L_file[ID_STRING]; 
	unsubscribeComments = vars.$L_file[COMMENTS]; 
	if(unsubscribeComments == null){
		setExitType(BAD_VALIDATION_EXIT);
		setErrorMsg(getMsg(130)); 
		return;
	}
	vars['$unsubscribe.comments.ws'] = [unsubscribeComments];
	
	Query = ' subscriptionID="' + requestID + '" and status="Active" and ( subscriber = "'+contactName+'" ';
	Query = Query + ' or subscriber isin '+covertToArrayString(vars['$G.requester.depts'])+' )';

	unsubscriptions = select('Subscription',Query); 
	if(unsubscriptions == null) { 		
		setErrorMsg(lib.ScAPI_Util.getMessage(183));
		setExitType(NO_RECORD_EXIT);
		return;
	}
	    
	else if(unsubscriptions != null)
	{
		//$L.file.save is used in Process change.open.save to save change history.
		//If $G.bg = true, $L.file.save will not be copied from $L.file
		//So we set $ws_src in API code to judge if $L.file.save needs to be set
		//It is set in Process change.open.save, RAD tab, above se.base.method
		vars['$ws.src'] = true;
		unsubscriptions.doAction('unsubscribe');
		vars['$ws.src'] = null;
	}
}

/**
 * This function is used to filter subscription list of records based on login user 
 * and user's department.
 * 
 */
function _getSubscriptionSQL(operator,deptName,type)
{
	var sql;
	if (type == 'department') {
		sql = 'subscriberType="dept" and subscriber isin $G.requester.depts';
	} else {
		sql = "(subscriber = \"%s\"";
		if(deptName!=null) {
		    sql+=" or subscriber = \"%s\"";
		}	
		sql+=") ";
	}	
	return queryBuilder(sql, [operator['contact.name'],deptName]);
}


/**
 * This function is used to set the output fields of subscription records 
 * 
 */
function _setToFile(subscription,index)
{
	vars.$L_file.SubscriptionList[index]['subscriptionID']=subscription['subscriptionID']==null?"":subscription['subscriptionID'].toString();
	vars.$L_file.SubscriptionList[index]['svcCatItemDesc']=subscription['svcCatItemDesc']==null?"":subscription['svcCatItemDesc'];
	vars.$L_file.SubscriptionList[index]['displayName']=subscription['displayName']==null?"":subscription['displayName'];
	vars.$L_file.SubscriptionList[index]['subscriber']=subscription['subscriber']==null?"":subscription['subscriber'];
	vars.$L_file.SubscriptionList[index]['status']=subscription['status']==null?"":subscription['status'];
	vars.$L_file.SubscriptionList[index]['sysmodtime'] = subscription['sysmodtime'];	
	if(subscription['subscriberType']!=null && subscription['subscriberType']=="contacts") {
		vars.$L_file.SubscriptionList[index]['subscriberType'] ="Individual";
	}
	else if(subscription['subscriberType']!=null && subscription['subscriberType']=="dept") {
		vars.$L_file.SubscriptionList[index]['subscriberType'] ="Department";
	}
	else {
		vars.$L_file.SubscriptionList[index]['subscriberType'] = subscription['subscriberType']==null?"":subscription['subscriberType'];
	}
	vars.$L_file.SubscriptionList[index]['canUnsubscribe'] = _checkCanUnsubscribe(subscription);
}


/**
* This functions is to check if the subscription can be unsubscribed by login user
*
*/
function _checkCanUnsubscribe(subscription){
	return (subscription['subscriber'] == vars['$lo.contact.name'] || funcs.index(subscription['subscriber'], vars['$G.requester.depts']) > 0 ) && subscription['status'] == 'Active';
}


/**
 * This function is used to set the output fields of subscription history 
 * 
 */
function _setToDetailsHistory(subscriptionHistory,index)
{
	if(subscriptionHistory!=null) {
    	vars.$L_file.SubscribeDetailsHistory[index]['status']=subscriptionHistory['type']==null?"":subscriptionHistory['type'];
    	vars.$L_file.SubscribeDetailsHistory[index]['timestamp']=subscriptionHistory['datestamp']==null ? new Date(0):subscriptionHistory['datestamp'];
    	var desc = "";
    	if(subscriptionHistory['description']!=null) {
    	    var j, length = subscriptionHistory['description'].length();
        	for (j = 0; j < length; j++){
            	desc = desc + "\n" + subscriptionHistory['description'][j];
    			}	
    		}
    	vars.$L_file.SubscribeDetailsHistory[index]['notes'] = desc;
	} 	
}

/**
 * This function is used to get Subscription Details and Subscription History
 * based on Subscription ID.
 * 
 */
function getSubscribeDetailsHistory() {
	setExitType(NORMAL_EXIT);
	var idString = vars.$L_file[ID_STRING];
	var index = 0;
	var chgQuoteId = "";
	var associatedId = "";
	var reqId = "";
	var incidentId = "";
	
	var fieldsSubscription = ['subscriptionID', 'subscriberType', 'subscriber', 'svcCatItemDesc', 'displayName', 'status', 'serviceSLA'];
	var fieldsHistory = ['number', 'type', 'datestamp', 'description'];
	
	var subscription = select('Subscription','subscriptionID="' + idString + '"', fieldsSubscription);
	if (subscription == null) {
		setExitType(NO_RECORD_EXIT);
		return;
	} else {
		
		if(subscription['subscriberType'] == "contacts") {
			vars['$L.file']['subscriberType'] = "Individual";
		} else if(subscription['subscriberType'] == "dept") {
			vars['$L.file']['subscriberType'] = "Department";
		} else {
			vars['$L.file']['subscriberType'] = subscription['subscriberType']==null?"":subscription['subscriberType'];	
		}
		vars['$L.file']['subscriber'] = subscription['subscriber']==null?"":subscription['subscriber'];
		vars['$L.file']['description'] = subscription['svcCatItemDesc']==null?"":subscription['svcCatItemDesc'];
		vars['$L.file']['serviceitem'] = subscription['displayName']==null?"":subscription['displayName'];		
		vars['$L.file']['subscriberStatus'] = subscription['status']==null?"":subscription['status'];
		vars['$L.file']['canUnsubscribe'] = _checkCanUnsubscribe(subscription);
		vars['$L.file']['serviceSLA'] = _getServiceSLA(subscription['serviceSLA']);
	}
	
	var subscriptionHistory = select('activitySubscription','number="' + idString + '"', fieldsHistory, [getSortBy()], [getOrderBy()]);
	
	if (subscriptionHistory != null) {
		do {
			chgQuoteId = "";
			_setToDetailsHistory(subscriptionHistory,index);
			var arrChgQuoteId = _getRelatedChangeQuote(idString);
			associatedId = covertToArrayString(arrChgQuoteId);
			
			index++;
			rc = subscriptionHistory.getNext();
		} while (rc == RC_SUCCESS);
		
		
		if (associatedId != "") {
			var relationRecordsFields=['depend'];
			var relationRecords = select('screlation', 'source isin ' + 
				associatedId + ' and depend.filename="incidents"',relationRecordsFields );
			
			if (relationRecords!=null) {
				do {
					if(reqId.indexOf(relationRecords['depend']+",")==-1) {
						reqId = reqId+relationRecords['depend']+",";
						}
				} while (rc == RC_SUCCESS);
				
				var associatedReqId="";
				if (reqId!="") {
					associatedReqId = reqId.slice(0,-1);
				}
			
				if (associatedReqId!="") {
					var interactionRecordsFields=['incident.id'];
					var interactionRecords=select('incidents', 'incident.id isin {"' + 
							associatedReqId + '"} and category="service catalog"', 
							interactionRecordsFields);
					
		
					if (interactionRecords != null) {			
							incidentId = interactionRecords['incident.id'];
						}
					
				} // Endif (associatedReqId!="")
			} // Endif (relationRecords!=null)
		} //Endif (associatedId!="")
	} //Endif(subscriptionHistory != null)	
	vars.$L_file['associatedRequest'] =incidentId;
} //End getSubscribeDetailsHistory()


/**
 * This function is used for geting the service SLA's title from SLA
 * based on the agreement id.
 * 
 */
function _getServiceSLA(serviceSLA){
	if(serviceSLA==null){
		return null;
	}else{
		var fieldsSLA = ['title'];
		var slaRecords = select('sla', 'agreement.id=' + serviceSLA, fieldsSLA );
		return slaRecords==null?"":slaRecords['title'];
	}
}

/**
 * This function is used for sorting records
 * based on the sorting order.
 * 
 */
function getSortBy(){
   var sortBy = vars.$L_file['SortBy'];
   var index = lib.ArrayUtil.indexOf(sortByNames, sortBy);
   if (index > -1){
      return sortByFields[index];
   }
   return "sysmodtime";
}


/**
 * This function is used to determine the sorting order.
 * 
 */
function getOrderBy(){
    var orderby = vars.$L_file['OrderBy'];
    if (orderby == null){
        return SCFILE_DSC;
    }
    
    var requestType = funcs.tolower(orderby);
    if (requestType == "asc"){
       return SCFILE_ASC;
    }
    
    if (requestType == "desc"){
        return SCFILE_DSC;
    }
    
    if (requestType == "des"){
        return SCFILE_DSC;
    }
    
    return SCFILE_DSC;
}

/**
 * This function is to get related changes and quotes id to an array by subscription id
 */
function _getRelatedChangeQuote(subscriptionId){
	var chgQuoteIds = [];
	var fieldsChg = ['header,number'];
	var fieldsQuote = ['number'];
	var changes = select('cm3r', 'header,foreign.id = "' + subscriptionId + '"', fieldsChg);
	var quotes = select('ocmq', 'foreign.id = "' + subscriptionId + '"', fieldsQuote);
	if (changes != null){
		do {
			chgQuoteIds.push(changes['header,number']);
		} while (changes.getNext() == RC_SUCCESS);	
	}
	if (quotes != null){
		do {
			chgQuoteIds.push(quotes['number']);
		} while (quotes.getNext() == RC_SUCCESS);
	}
	return chgQuoteIds;
}