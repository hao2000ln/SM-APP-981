var $ = lib.c.$;
var log = lib.ScAPI_Logger.log("ScAPI_Util");
var isNonPDRequestInParallel = lib.ProcessDesignerEnablement.isNonPDRequestInParallel;

function SMType() {}
SMType.Number = 1;
SMType.Character = 2;
SMType.Datetime = 3;
SMType.Logical = 4;
SMType.File = 6;
SMType.Array = 8;
SMType.Structure = 9;

function createSCDatumArray() {
    var arr = new SCDatum();
    arr.setType( SMType.Array );
    var i;
    for( i=0; i<arguments.length; i++ ) {
        arr.push( arguments[i] );
    }
    return arr;
} 

function setSCDatumArrayValue( arr, idx, value ) {
    var rt = isArray( arr );
    if( rt[0] ) {
    	var i;
        for( i = rt[1] - 1; i < idx; i++ ) {
            arr.push( null );
        }
        arr[idx] = value;
    }
}

function joinStringArray( strArr, c ) {
    var str = '';
    var rt = isArray( strArr );
    if( rt[0] ) {
        c = c || '';
        var i;
        for( i=0; i<rt[1]; i++ ) {
            str += ( str == '' ? '' : c ) + strArr[i];
        }
    }
    return str;
}

/*
 *@return [true/false, size]
 */
function isArray( obj ) {
    var rt = [false, 0];
    if( obj != null ) {
        rt[0] = ( obj instanceof Array
                    || typeof obj.length == 'function' );
        if( rt[0] ) {
            rt[1] = ( obj instanceof Array ? obj.length : obj.length() );
        }
    }
    return rt;
}

/*
 *@return true/false
 */
function mergeArray(arr1, arr2) {
    var rt1 = isArray(arr1);
    if ( rt1[0] ) {
        var rt2 = isArray(arr2);
        if ( rt2[0] ) {
        	var i;
            for (i=0; i<rt2[1]; i++) {
                arr1.push(arr2[i]);
            }
        } else {
            arr1.push(arr2);
        }
        return true;
    }
    return false;
}

function trimString( str ) {
    str = str || '';
    str = str.replace( /^\s+/, '' ).replace( /\s+$/, '' );
    return str;
}

/**
 * This function is to dump the object
 */
function dumpObject( prefix, obj, log ) {
    if( obj != null ) {
        log = log || print;
        prefix = prefix || '';
        var x;
        for( x in obj ) {
            log( prefix + '[' + x + ']=' + obj[x] );
            if( obj[x] != null && obj[x] instanceof Object ) {
                dumpObject( prefix + '.', obj[x], log );
            }
        }
    }
}



function indexOf(array,obj) {
	
	if (!isArray(array) || obj == undefined || obj == null) {
		return -1;
	}
	
	var i;
	for (i in array) {
		if (array[i] == obj) {
			break;
		}
	}
	return i;
}

function setExitType(type) {
    lib.BaseUtil.setExitType(type);
}

function setErrorMsg(msg) {
    lib.BaseUtil.setErrorMsg(msg);
}

function getAccessFields(name,objectName){
    var f = new SCFile("extaccess", SCFILE_READONLY);
    f.setFields(["soafield"]);
    var RC = f.doSelect("name=\""+name+"\" and object.name=\""+objectName+"\"");
    if (RC != RC_SUCCESS ) {
    	return [];
    }

    return f.soafield;
}
 
function getDigitAfterDecimal(currencyCode) {

  var currency = new SCFile("currency", SCFILE_READONLY);
  currency.setFields(["digits.after.decimal"]);
  if (currency.doSelect("currency.code=\""+currencyCode+"\"") == RC_SUCCESS) {
  	 return currency.digits_after_decimal;
  } else {
  	 return 2;
  }
  
}

function getCurrentOperator() {
	if (vars['$lo.operator'] != null){
		return vars['$lo.operator'];
	}
	var oper = new SCFile("operator");
	var RC = oper.doSelect("name=\"" + funcs.operator() + "\"");
	return oper;
}

function getContact(contactName){
	var contacts = new SCFile("contacts");
	var result = contacts.doSelect("contact.name=\"" + contactName + "\"");
	if (result == RC_SUCCESS) {
		return contacts;
	}
	return null;
}

function getContactFields(contactName, fields){
	var contacts = new SCFile("contacts", SCFILE_READONLY);
	contacts.setFields(fields);
	var result = contacts.doSelect("contact.name=\"" + contactName + "\"");
	if (result == RC_SUCCESS) {
		return contacts;
	}
	return null;
}

function getContactValue(contactName, contactNotify, otherInfo){
	var contacts = new SCFile("contacts", SCFILE_READONLY);
	var contactType;
	if (contactNotify == "Email" || contactNotify == "E-mail"){
	    contactType = 'email';
	}
	else if (contactNotify == "Telephone"){
	    contactType = 'contact.phone';
	}
	else if (contactNotify == "Page"){
	    contactType = 'beeper.phone';
	}
	else if (contactNotify == "Other"){
		contactType = 'other';
		return otherInfo;
	}
    else {
	   return null;
	}
	
	contacts.setFields([contactType]);
	var result = contacts.doSelect('contact.name="' + contactName + '"');
	if (result == RC_SUCCESS) {
		return contacts[contactType];
	}
}

function getMessage(msgrecord, args) {
    if (args == null) {
      return funcs.scmsg(msgrecord, "SvcCatAPI");
    } else {
      return funcs.scmsg(msgrecord, "SvcCatAPI", args);
    }
}

function getSystemInfo(){
	var info = new SCFile("info");
	var result = info.doSelect('type="company"');
	if (result == RC_SUCCESS) {
		return info;
	}
	return null;
}

/**
 * This function is to change and SCDatum with array type to string
 */
function covertToArrayString(SCDatumArray){
	var result = '{';
	var i;
	var length = funcs.lng(SCDatumArray);
	for (i = 0; i < length; i++){
		result += '"' + SCDatumArray[i] + '"';
		if (i < length - 1) {
			result += ',';
		}
	}
	result += '}';
	return result;
}

/**
 * This function is to change and SCDatum with array type to string in line, refer to ScAPI_WSInterface_Interaction_Info.96
 */
function covertArrayToStringInLine(SCDatumArray){
	var desc = "";
	var j;
	var length = funcs.lng(SCDatumArray);
	for (j = 0; j < length; j++){
		if (SCDatumArray[j] != null){
			if (j == 0){
				desc = SCDatumArray[j];
			} else {
				desc = desc + "\n" + SCDatumArray[j];
			}
		} else {
			if (j!=0){
				desc = desc + "\n";
			}
		}
	}
	return desc;
}


function getIfApprovalModLaterThanTime(unique_key,file_name,name,origUpdateTime,component){
    var ApprovalFile = new SCFile("Approval", SCFILE_READONLY);
	var fields1 = ["unique.key", "file.name","name","sysmodtime","component"];
	ApprovalFile.setFields(fields1);
	var query = 'unique.key="' + unique_key + '" and file.name="' + file_name + '" and name="' + name + '" and component=' + component;
	var result = ApprovalFile.doSelect(query);
	if (result == RC_SUCCESS) 
	{
	 
	 if (origUpdateTime != null && ApprovalFile.sysmodtime != null){
	 var currentDate = new SCDatum( ApprovalFile.sysmodtime );
	 var origdateTime = new SCDatum(origUpdateTime);
	
	if( currentDate.getText() > origdateTime.getText()) 
	 {
		return true;
	 }
	}
	}
	return false;
}



function getQuoteFileName()
{
	var pdEnabled = lib.ProcessDesignerEnablement.isRequestEnabled();
	if (pdEnabled)
	{
		return "request";
	}
	return "ocmq";
}

function getRequestFileNames()
{
	var pdEnabled = lib.ProcessDesignerEnablement.isRequestEnabled();
	if (pdEnabled)
	{
		var isWithOCMQ = isNonPDRequestInParallel();
		if (isWithOCMQ) {
			return ["request", "ocmq"];
		}
		return ["request"];
	}
	return ["ocmq"];
}

function getChangeGroups()
{
	var pdEnabled = lib.ProcessDesignerEnablement.isChangeEnabled();
	var changeGroups;
	if (pdEnabled)
	{
		changeGroups = vars['$G.myGroups']['approver.of'];
	} else
	{
		var changeGroupsObj = vars['$G.cm3r.environment']['approval.groups'];
		if (changeGroupsObj)
	    {
	      changeGroups = changeGroupsObj.toArray();
	    } else
	    {
	      changeGroups = [];
	    }
	}
	return changeGroups;
}

function getQuoteGroups()
{
	var quoteGroupsObj = vars['$G.ocmq.environment']['approval.groups'];
	var quoteGroups;
	if (quoteGroupsObj)
    {
      quoteGroups = quoteGroupsObj.toArray();
    } else
    {
      quoteGroups = [];
    }
	return quoteGroups;
}

function getRequestGroups()
{
	var quoteGroups = vars['$G.myGroups']['approver.of'];
	return quoteGroups;
}

function getDisplayNameByLogicalName(logicalName){
	return lib.DisplayName.getDisplayNameByLogicalName(logicalName);
}

function getOperatorNameFromContactName(contactName) {

  var operatorName = "";
  var operator = new SCFile("operator", SCFILE_READONLY);
  operator.setFields(["name"]);
  var query = "contact.name = \"" + contactName + "\"";
  var result = operator.doSelect(query);
  if (result == RC_SUCCESS){
    operatorName = operator["name"];
  }
  return operatorName;

}