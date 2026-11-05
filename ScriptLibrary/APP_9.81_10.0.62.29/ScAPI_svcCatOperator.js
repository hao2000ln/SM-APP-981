/** @fileoverview svcOperatorInfo - contains functions used by the Service Catalog module
*   @author Levin
*/

var select = lib.ScAPI_RAD._select;
var count = lib.ScAPI_RAD._count;
var NO_RECORD_EXIT = lib.ScAPI_Constants.NO_RECORD_EXIT();
var NORMAL_EXIT = lib.ScAPI_Constants.NORMAL_EXIT();
var BAD_VALIDATION_EXIT = lib.ScAPI_Constants.BAD_VALIDATION_EXIT();
var setExitType = lib.ScAPI_Util.setExitType;
var setErrorMsg = lib.ScAPI_Util.setErrorMsg;
var index = system.functions.index;

var getCurrentOperator = lib.ScAPI_Util.getCurrentOperator;
var getSystemInfo = lib.ScAPI_Util.getSystemInfo;
var getMsg = lib.ScAPI_Util.getMessage;
var password_change = lib.ScAPI_RAD.password_change;
var log = new lib.ScAPI_Logger.log( 'ScAPI_svcCatOperator' );
var $ = lib.c.$;
function canRequestOnBehalf() {

	vars['$G.ess'] = true;
    setExitType(NORMAL_EXIT);
    

    var File = lib.DBUtils.File;
    var name = vars['$L.file']['name'];

    var record = select('joinSvcCatOperator', 'name="' + name + '"');

     if(record == null) {
       record = select('joinSvcCatOperator', 'name="' + vars['$lo.operator']['name']  + '"');
       if(record == null) {
		setExitType(NO_RECORD_EXIT);
		return;
    }
    }
	
	//set operator field to WS response except "canRequestOnBehalf" and "kmSecurity" fields
	var extaccess = select('extaccess', 'object.name="SvcCatOperator"');
	var fields = extaccess.soafield;
	for(var i = 0; i < fields.length(); i++) {
		if(fields[i] == "canRequestOnBehalf" || fields[i] == "kmSecurity"){
			continue;
		}
		vars.$L_file[fields[i]] = record[fields[i]];
	}

	vars.$L_file['canRequestOnBehalf'] = false;
	if(index('svcCatRequestOnBehalf', record['cap.exec']) < 1) {
		var capabilities = lib.ScAPI_WSInterface_svcCatalogGather._getAllCapabilityByUser(record['cap.exec']);
		if(index('svcCatRequestOnBehalf', capabilities) > 0) {
			vars.$L_file['canRequestOnBehalf'] = true;
		}
	} else {
		vars.$L_file['canRequestOnBehalf'] = true;
	}

	if (lib.KMCollection_Update_Utils.ifSRCChecked()){
		vars.$L_file['kmSecurity'] = lib.KMSRCSecurity.getSRCUserSecurity();
	}
	

	if (vars.$L_file['time.zone'] == null) {
		vars.$L_file['time.zone'] = lib.tzFunctions.getTZforCompany();
		if (vars.$L_file['time.zone'] == null) {
			vars.$L_file['time.zone'] = vars.$lo_time_zone;
		}
	}
	
	var timezoneOffset;
	if (getCurrentOperator()['name'] == name) {
		timezoneOffset = system.functions.val(system.functions.get_timezoneoffset(),2);
	} else {
		timezoneOffset = determinTimeZoneOffset(vars.$L_file['time.zone']);
	}
	vars.$L_file['timezoneOffset'] = timezoneOffset;
	
	if(lib.ProcessDesignerEnablement.isServicedeskEnabled())
	{
	  vars.$L_file['pd.sd.enabled'] = true;
	  vars.$L_file['tableAccessNew'] = system.functions.val(lib.security.getRights("Service Desk", "new"), 4);
	  
	}
    else {
     vars.$L_file['pd.sd.enabled'] = false;
     var tableAccess = new SCDatum(system.vars.$G_sm_environment.tableAccess);    
   
	 vars.$L_file['tableAccessNew'] = lib.tableAccess.hasNewAccess(tableAccess);
	}
	var fields1 = ['strong.queryhash.flag','keep.old.queryhash.flag','strong.queryhash.key'];
	var info = select('info', 'type=\"company\" and  format=\"info.company\"',fields1);
  	vars.$L_file['search.engine.name'] = lib.KMSearchInterface.getEngineName();
  	
    if(info != null) {       
	  vars.$L_file['strong.queryhash.flag'] = info['strong.queryhash.flag'];
	  vars.$L_file['keep.old.queryhash.flag'] = info['keep.old.queryhash.flag'];
	 
	  if (info['strong.queryhash.key'] != null && info['strong.queryhash.key'].length > 0)
                 {
        var decrypted = new SCDatum();
        var rc = system.functions.decrypt(decrypted, info['strong.queryhash.key'], true);
        if (rc == true)
         vars.$L_file['strong.queryhash.key'] = decrypted; 
        else{
          setErrorMsg(getMsg(192));
		  setExitType(BAD_VALIDATION_EXIT);
		  return; 
        }
        }
      else {
	    setErrorMsg(getMsg(191));
		setExitType(BAD_VALIDATION_EXIT);
		return; 
	   } 
    }
    
   $("sdCategory", SCFILE_READONLY).select('name=\"complaint\" or  name=\"compliment\"').iterate(function(record) { 
  
    if (record["name"] == "complaint") {
       vars.$L_file['sdcategory.complaint.enabled'] = record['active'];
     	      
    } else if (record["name"] == "compliment") {
       vars.$L_file['sdcategory.compliment.enabled'] = record['active'];
      
    }            
   });
}

function determinTimeZoneOffset(timezoneName) {
	var offset;
	var timezone = lib.tzFunctions.getTZFileByTZName(timezoneName);
	var switchovers = timezone['switchover'];
	var now = system.functions.tod();
	
	var beginDate = null;
	var endDate;
	var currentTimeSwtichover;
	var currentTimeChangeDefinition;
	if (switchovers && switchovers.length()>0) {
		switchovers = mergeSwitchovers(switchovers);
		var currentTimeSwtichoverIndex = findCurrentSwitchover(switchovers, now)
		if (currentTimeSwtichoverIndex) {
			currentTimeSwtichover = switchovers[currentTimeSwtichoverIndex];
		}
	} else { // No switchovers, use the first time change definition
		if (timezone['conversion.type'] && timezone['conversion.type'].length()>0) {
			currentTimeChangeDefinition = timezone['conversion.type'][0];
		}
	}
	if (currentTimeSwtichover) {
		var offsetDate = timezone['conversion.type'][currentTimeSwtichover['conversion.index']]['offset'];
		var offsetTimeStr = system.functions.val(timezone['conversion.type'][currentTimeSwtichover['conversion.index']]['offset'], 2);
		offset = offsetTimeStr;
	} else if (currentTimeChangeDefinition) {
		var offsetTimeStr = system.functions.val(currentTimeChangeDefinition['offset'], 2);
		offset = offsetTimeStr
	} else {
		//No way to get the offset if there is no any time-change-definition in timezone record...
	}
	return offset;
}

/**
 * Prevent empty switchover index.
 */
function mergeSwitchovers(switchovers_orig) {
	var switchovers = new Array();
	for (var i = 0; i<switchovers_orig.length(); i++) {
		if (switchovers_orig[i]['local.switchover.time'] != null && switchovers_orig[i]['local.switchover.time'] != "") {
			switchovers.push(switchovers_orig[i]);
		}
	}
	return switchovers;
}

/**
 * Binary search
 */
function findCurrentSwitchover(switchovers, now) {
	var low = 0;
	var high = switchovers.length - 1;
	var firstSwitchDate = system.functions.val(switchovers[low]['local.switchover.time'], 3);
	if (now < firstSwitchDate) {
		return null;
	}
	var lastSwitchDate = system.functions.val(switchovers[high]['local.switchover.time'], 3);
	if (now >= lastSwitchDate) {
		return high;
	}
	while (low <= high) {
		var middle = parseInt((low + high)/2);
		if (middle == high) {
			return middle;
		}
		
		var middleDate = system.functions.val(switchovers[middle]['local.switchover.time'], 3);
		if (now >= middleDate) {
			var nextDate = system.functions.val(switchovers[middle+1]['local.switchover.time'], 3);
			if (now < nextDate) {
				return middle;
			} else {
				low = middle + 1;
			}
		} else if (now < middleDate){
			high = middle - 1;
		} else {
			low = middle + 1;
		}
	}
	return low;	
}

function getOperatorByCompany(){
	setExitType(NORMAL_EXIT);
	
	var table = vars.$L_file['table'] == null ? 'operator' : vars.$L_file['table'];
	vars.$L_file['table'] = table;
  	if (table != 'contacts' && table != 'operator'){
  		setErrorMsg(getMsg(150));
		setExitType(BAD_VALIDATION_EXIT);
		return;
  	}
  	
	var company = vars.$L_file['company'];
	
	var query = 'true';
	
	if (company != null) {
		query = 'company="' + company + '"';
	}
	
	var contactName = vars.$L_file['contact.name.in'];
	var firstName = vars.$L_file['first.name.in'];
	var lastName = vars.$L_file['last.name.in'];
	
	var contactNameQuery = null; //contact.name sub query string
	var firstLastQuery = null //first.name and last.name sub query string
	
	//make contact.query
	if (contactName != null){
		contactNameQuery = 'contact.name like "' + contactName + '*"';
	} 
	
	//first.name and last.name query
	if (firstName != null){
		if (table != 'contacts'){
			setErrorMsg(getMsg(151));
			setExitType(BAD_VALIDATION_EXIT);
			return;
		}
		firstLastQuery = 'first.name like "' + firstName + '*"';
	}
	if (lastName != null){
		if (table != 'contacts'){
			setErrorMsg(getMsg(151));
			setExitType(BAD_VALIDATION_EXIT);
			return;
		}
		if (firstName != null){
			firstLastQuery = firstLastQuery + ' and last.name like "' + lastName + '*"';
		} else {
			firstLastQuery = 'last.name like "' + lastName + '*"';
		}
	}
	
	//composite query
	//query should be like company='company' and (contact.name like 'contactName*' or (first.name like 'firstName*' and last.name like 'lastName*'))
	if (contactNameQuery != null && firstLastQuery != null){
		if (contactNameQuery != null){
			query = query + ' and (' + contactNameQuery;
		}
		if (firstLastQuery != null){
			query = query + ' or (' + firstLastQuery + '))';
		}
	} else {
		if (contactNameQuery != null){
			query = query + ' and ' + contactNameQuery;
		}
		if (firstLastQuery != null){
			query = query + ' and (' + firstLastQuery + ')';
		}
	}
	//print(query);
	//initiate pagination
	var pagesize = vars.$L_file.pagesize;
  	var start = vars.$L_file.start;
  	var end = -1;
  	if (start < 1) {
    	start =1;
  	}
  	if (pagesize < 1) {
  		pagesize = 10;
  	}
  	vars.$L_file.start = start;
  	vars.$L_file.pagesize = pagesize;
  	if (pagesize > 0) {
     	end = start + pagesize - 1;
  	}
  	var operator = null;

  	var fields = null;
  	if (table == 'operator') {
  	    fields = ['name','contact.name','full.name', 'email'];
  	}
  	else{
  	    fields = ['operator.id','first.name','last.name','contact.name','full.name', 'email'];
  	}
  	operator = select(table, query, fields);
  	vars.$L_file._count=count(table,query);
  	if (operator == null) {
  		setExitType(NO_RECORD_EXIT);
  		return;
  	}
  	var row = 1;
  	var index = 0;
  	do{
  		if (row > end)break;
  		if (row >= start) {
  			if (table == 'operator') {
	  			vars.$L_file.operators[index]['name'] = operator['name'];
  			}else{
  				vars.$L_file.operators[index]['name'] = operator['operator.id'];
  				vars.$L_file.operators[index]['first.name'] = operator['first.name'];
  				vars.$L_file.operators[index]['last.name'] = operator['last.name'];
  			}
  			vars.$L_file.operators[index]['contact.name'] = operator['contact.name'];
  			vars.$L_file.operators[index]['full.name'] = operator['full.name'];    						
  			vars.$L_file.operators[index]['email'] = operator['email'];
	  		index++;
  		}
  		res = operator.getNext();
  		row++;
  		
  	}while (res == RC_SUCCESS)
}

function resetPassword() {
	vars['$G.ess'] = true;
    lib.ScAPI_Util.setExitType(NORMAL_EXIT);    
    

    var File = lib.DBUtils.File;
    var name = vars['$L.file']['name'];
    var password = vars['$L.file']['password'];
    var newPassword = vars['$L.file']['newPassword'];
  
   
    
    
    var record = lib.ScAPI_RAD._select('operator', 'name="' + name + '"',['name']);

    if(record == null) {     
    
    
		lib.ScAPI_Util.setExitType(NO_RECORD_EXIT);
		return;
  
    }  
    
  var loginOperator = lib.ScAPI_Util.getCurrentOperator();
    
    if(loginOperator['name'] != record['name']){
  		setErrorMsg(getMsg(189));
		lib.ScAPI_Util.setExitType(BAD_VALIDATION_EXIT);
		
		return;
  	}  
    if(lib.Base64Encoder.isBase64(newPassword)==false || lib.Base64Encoder.isBase64(password)==false){
        setErrorMsg(getMsg(190));
		lib.ScAPI_Util.setExitType(BAD_VALIDATION_EXIT);
		
		return;
    
    } 
    if(password != null && password != "")
     password = lib.Base64Encoder.decode(password);
    if(newPassword != null && newPassword != "")
     newPassword = lib.Base64Encoder.decode(newPassword);
   
    
	var resetPwdExit = lib.ScAPI_RAD.password_change(true,name,password,newPassword) ;
	if(password != null && password != "")
	  password = lib.Base64Encoder.encode(password);
	if(newPassword != null && newPassword != "")
      newPassword = lib.Base64Encoder.encode(newPassword);
    
    
	
	if (lib.SeExternalHelper.isNormalAction(resetPwdExit)==false) 
	{
		lib.ScAPI_Util.setExitType(BAD_VALIDATION_EXIT);
		
		return;
	}
	
	
}