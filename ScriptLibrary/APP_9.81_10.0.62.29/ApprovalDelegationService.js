

var security=lib.security;
var approvalService = lib.ApprovalService;
var approvalEnablement = lib.ApprovalEnablementManager;

/**
 * @public
 * @description  Whether can delegate all
 * @return {boolean} canDelegateAll - true/false
 */ 		
function canDelegateAll(){

	//need to handle the original SVC
	//if (system.vars.$G_sm_environment.approve_delegate != true)
	//		return false;
	
	var areas = approvalService.getAllCanApprovalDelegateApprovalSupportedSecAreas("delegate");
	var canDelegateAll = true;
  	var tables = [];
  	var canDelegate =false;
  	var temp = [];  	 
	for (i=0; i<areas.length; i++ ) {	  	 	
		canDelegate = security.hasRight(areas[i],"approve.delegate") ;	  	 	
		if(canDelegate == false || canDelegate =="false") {  
			return false; 
		} 	  	 
	}
  	return canDelegateAll; 
} 


/**
 * @public
 * @description  get All Can delegate Sec Areas from all secAreas
 * @return {Array} secAreas - secAreas
 */ 
function getCanDelegateModulesValue(){
	
	var result = [];
	//if (system.vars.$G_sm_environment.approve_delegate == true)
	//	result.push("SVC");			
	//var canDelegateMoudelsValue = getCanDelegateSecAreas(approvalService.getAllCanApprovalDelegateApprovalSupportedSecAreas("delegate"),true);
	//lib.ArrayUtil.addAllWithoutDuplicate(result,canDelegateMoudelsValue);
	
	//return  result;
	return getCanDelegateSecAreas(approvalService.getAllCanApprovalDelegateApprovalSupportedSecAreas("delegate"),true);
	
}


/**
 * @public
 * @description  get All Can delegate Sec Areas from all secAreas
 * @return {Array} secAreas - secAreas
 */ 
function getCanDelegateModules(){
	
	var result = [];
	//if (system.vars.$G_sm_environment.approve_delegate == true)
	//	result.push(system.functions.scmsg("SVC", "approval"));		
	
	//var canDelegateModules = getCanDelegateSecAreas(approvalService.getAllCanApprovalDelegateApprovalSupportedSecAreas("delegate"),false); 
	//lib.ArrayUtil.addAllWithoutDuplicate(result,canDelegateModules);
	//return result;
	
	return getCanDelegateSecAreas(approvalService.getAllCanApprovalDelegateApprovalSupportedSecAreas("delegate"),false);
	
	
}



/**
 * @public
 * @description  get All Can delegate Sec Areas from selected areas
 * @return {Array} secAreas - secAreas
 */ 	
function getCanDelegateSecAreas(areas, isValue){ 
	
 	var secAreas = [];
	var canDelegate =false; 
 	for (i=0; i<areas.length; i++ ) { 	
 		canDelegate = security.hasRight(areas[i],"approve.delegate") ; 		
		if(canDelegate == true || canDelegate =="true") { 
			if(isValue==true) {
				if(areas[i]=="Service Desk"){
					secAreas.push("SVC");
				}else{
					secAreas.push(areas[i]);
				}
			}else {
				if(areas[i]=="Service Desk"){
					secAreas.push(system.functions.scmsg("SVC", "approval"));
				}else{
					secAreas.push(system.functions.scmsg(areas[i], "local:secArea"));
				}			
			}
		} 
 	}
 	return secAreas; 
} 
	
	
//print(getDelegationSql())
	
/**
 * @public
 * @description  get delegation sql for approval.inbox
 * @return {String} sql - Query SQL
 */ 	 
function getDelegationSql(){

	var delegationList =  initDelegation();
	//print("delegationList"+delegationList);
	if(delegationList.length == 0) {
		return "";
	}
	var allSQL =  getDelegationGroupsForAll(delegationList[0]);
 	var partSQL = getDelegationGroupsForPart(delegationList[1]); 		
	
	var sql = "";
	
	if (allSQL==null || allSQL=="" ) {	
		if (partSQL == null || partSQL =="" ) {
			sql = "";
		}else {
			sql = partSQL;
		}
	} else {
		if (partSQL == null || partSQL =="" ) {
			sql = allSQL;	
		}else {
			sql = allSQL+ " or " + partSQL;	
		}
	}
	
	if( sql!="") {	
		sql = " or (" + sql +")";
	}				
	//print("getDelegationSql returns "+sql);
	return sql;	
}

//print(initDelegation("Request")[1]);
/**
 * @public
 * @description  retrieve delegation list for login operator
 * @return {Array} delegationList - [delegationListAll,delegationListPart]
 */
function initDelegation(module){
	var delegationList = [];		
	var delegationListAll =  [];
	var delegationListPart = [];
		
	delegationListPart =  getDelegationListbyModule(module);
      var value = getSimpleCacheValue("ApprovalDelegation", "ApprovalDelegation.all");
      if( value !== undefined)
      {
          delegationListAll = value;
      }
      else 
      {
          delegationListAll = getDelegationListbyModule("all");
          setSimpleCacheValue("ApprovalDelegation", "ApprovalDelegation.all", delegationListAll);
      }
            
	delegationList[0]= delegationListAll;
	delegationList[1]= delegationListPart;
	return 	delegationList;
}
	
	
	
/**
 * @public
 * @description  retrieve delegation list for login operator
 * @return {Array} delegationList - [delegationListAll,delegationListPart]
 */
function getDelegationListbyModule(module){

	var date = system.functions.str(system.functions.tod());
	//var date = system.functions.str(system.functions.date(system.functions.tod()));		  
	var delegateSql = "Enable=true and Delegate=\""+system.functions.operator()+"\" and DateFrom <='"+date+"' and DateTo >'"+date+"'";		
	if(module!=null) {
		delegateSql = delegateSql+ " and AppModule =\"" + module + "\"" ;
	}else {
		delegateSql = delegateSql+ " and AppModule <>\"all\"" ;		
	}
		
	//print(delegateSql)
	var delegate = new SCFile("ApprovalDelegation", SCFILE_READONLY);			
	var rc = delegate.doSelect(delegateSql);
	var delegationList = [];

	
	while(rc == RC_SUCCESS) { 	
		//print("initDelegation gets "+ delegate);
		var aDele = {};
		aDele.module = delegate.AppModule;
		aDele.group = delegate.AppGroup;
		aDele.approver = delegate.Approver;
		aDele.area = delegate.AppArea;
		delegationList.push(aDele);			 
		rc = delegate.getNext();
	}	
	
	return delegationList;

}
	
//print(getDelegationGroupsForPart(initDelegation()[1]))
//print(getDelegationGroupsForPart(initDelegation()[1],"Request"))	
/**
 * @public
 * @description  generate delegation sql for selected delegationlist and module
 * @return {String} sql - Query SQL
 */
function getDelegationGroupsForPart(delegationList,module){
	var sql = "";
	var tempSql = "";		
	var files;
	var fileNames ="";
	var groupsArray=[];

	var i; 				
	for(i=0;i<delegationList.length;++i){
		tempSql = "";
		fileNames = "((";
			
		if(module==null) {		
			//skip in the all
			if(delegationList[i].module =="all") {
 	 			continue;	
 	 		}
 	 		//backward supporting for SVC
 	 		if (delegationList[i].module =="SVC") { 	 		
 	 		
 	 			fileNames = fileNames + "file.name=\"incidents\" or file.name=\"svcCartItem\"" ;
 	 		
 	 		} else {	 		
 	 			files  = security.getTablesForArea(delegationList[i].module,false);	
				for (j=0; j<files.length; j++ ){		
					fileNames = fileNames + "file.name= \""+ files[j]  + "\"";			
					if (j<files.length-1) {
						fileNames = fileNames + " or " ;
					}		
				} 	 		
 	 		}	 		
            if(fileNames == "(("){
                tempSql = "false";
            }else{
                tempSql = fileNames  + ") and current.pending.groups isin {\"" + delegationList[i].group+ "\"})";
            } 
			sql = sql + tempSql;
	 	}else {
	 		
	 		if (delegationList[i].module==module){
	 			groupsArray.push(delegationList[i].group);
	 		} 	 			 
	 	}		 			 		
	 	if(module==null){
	 		if (i<delegationList.length-1) {
				sql = sql + " or " ;
			}
		}else{		 	
		 	sql = new QueryCond('current.pending.groups', ISIN, groupsArray).asRAD();		 		
		}			
	}
	return sql; 
}
	
/**
 * @public
 * @description  generate delegation sql for selected delegationlist
 * @return {String} sql - Query SQL
 */	
function getDelegationGroupsForAll(delegationList){	
	
	var sql = "";		
	if (delegationList.length>0)	{
		sql = " current.pending.groups isin {";		
		var groups = getDelegationGroups(delegationList);
		var i;	
		for (i=0; i<groups.length;++i){				
			sql += "\"" +groups[i]+"\"";	
			if (i<groups.length-1) {
				sql+=",";	
			}
		}			
		sql += "} "; 
	}
		
	return sql; 	
}
	
/**
 * @public
 * @description  get can be approved groups for delegation list
 * @return {Array} groups - Groups Array
 */		
function getDelegationGroups(delegationList){
	
	var groups = [];
		    
	var i, j;
	for(i=0;i<delegationList.length;++i){
	
		var list = getApproverOfList(delegationList[i]);
	 	for(j=0;j<list.length;++j){
	 	
			if(arrayIndexOf(groups,list[j])<0) {
				groups.push(list[j]);
			}
		}		
	}
	
	return groups;
	
}
	
	
/**
 * @public
 * @description  get can be approved groups by approver defined in approval delegation
 * @return {Array} groups - Groups Array
 */	
function getApproverOfList(approvalDelegation){	
	
	var approver = approvalDelegation.approver;
	
	var groups = []; 	
	
	var module = approvalDelegation.module;
	
	if (module=="Timeperiod") {
		groups = vars.$lo_pm_assignments;
	
	}else {	
		groups = lib.MyGroupsSync.getApprovalOfInMyGroups(approver);    	
	}
	if (groups == null){
		groups = [];
	}
	groups.push(approver);

	return groups;
}
	
	
/**
 * @public
 * @description  return the index for a string in the array
 * @return {Array} groups - Groups Array
 */		
function arrayIndexOf(array1,string1){
	
	var i;
	for(i=0;i<array1.length;++i){
		if (array1[i] == string1) {
			return i;
		}
	}
	return -1;		
}

	

/**
 * @public
 * @description  get query for which operator can be delegated to. In wizard "Approval Delegation - Select Delegate".
 * @return {String} filteredQuery - Query SQL
 */		
function getFilteredQuery(module) {
	//first, process condition with delegate all
	var filteredQuery = "";


	if(module =="all" || ( ! module && system.vars.$delegate_all ) ){
		var i, length = system.vars.$avail_approval_modules_value.length();
	
		for(i=0;i<length;++i){
			var value =  system.vars.$avail_approval_modules_value[i];
			if(value =="SVC") {
				value= "Service Desk";
			} 
			filteredQuery +="("+ getQuery(value) + ")";	
			if (i<length-1){
				filteredQuery += " and ";
			}
			
		}
		
		//filteredQuery = "(secRole isin {\"rmCategory approver\"})";
		//filteredQuery = "(secRole isin {\"system administrator\"})";
		//filteredQuery = "(secRole ISIN {\"rmCategory approver\"}) and (secRole ISIN {\"system administrator\"})" ;
		filteredQuery = appendCapabilitySql(filteredQuery,"all");
	
	}else{	
		
		var delegateModule = module;
		if (delegateModule == null || delegateModule == "") { 
			delegateModule = system.vars.$delegate_module;
		}
		
		if(delegateModule =="SVC") {
			delegateModule="Service Desk";
		}
		filteredQuery =getQuery(delegateModule);	
		filteredQuery = appendCapabilitySql(filteredQuery,delegateModule);	
	}
	
	//print("return  filteredQuery "+filteredQuery);

	return filteredQuery;
}

	
//print("!!!!!"+getQuery("request"))
/**
 * @public
 * @description  get query to retrieve valid secRole. 
 * @return {String} filteredQuery - Query SQL
 */	
function getQuery(moduleName){
	
	var rightsSQL =  "area = \"" + moduleName + "\" and view = true " ;		
	
	rightsSQL += " and "+addFolderQuery(moduleName);		
	
	var	secRights = new SCFile("secRights", SCFILE_READONLY);
	secRights.setFields(["role","settingId","settingValue"]);	
	//print("rightsSQL"+rightsSQL)
	var rc = secRights.doSelect(rightsSQL);	

	var secRightArray = [];
	
	var aRole ;
	
	while(rc == RC_SUCCESS) { 				

		if (moduleName == "Service Desk"){
		
			aRole=secRightArray.push(secRights.role);
		
		}else {
		
			var index = system.functions.index( "approvals", secRights.settingId );
			if ( index > 0 )
			{
				var valid = secRights.settingValue[ index - 1 ];
				if ( valid == "true" )
				{
					aRole=secRightArray.push(secRights.role);
				}
			}				
		}
		
		rc = secRights.getNext();
	}
	
 	return buildSql(secRightArray);
}
	
/**
 * @public
 * @description  get query to make sure the opeartor has the right secRoles
 * @return {String} filteredQuery - Query SQL
 */	
//make sure operator has the right profiles
function buildSql(secRightArray){	
	
	//print("secRightArray"+secRightArray);
		
	if (secRightArray.length>0){
			
		var sql = new QueryCond('secRole', ISIN, secRightArray).asRAD();		
		//print("sql"+sql);		
		return sql;	
	}else {
		return "";
	}
		
}
	
/**
 * @public
 * @description append capability words
 * @return {String} approvalQry - Query SQL
 */	
	
function appendCapabilitySql(approvalQry,module){
		
		//if(module == "SVC")
		//	return approvalQry;
			
	if (module == "Change" && 	lib.ProcessDesignerEnablement.isChangeEnabled()==false){
			 
		approvalQry += " and (cap.exec isin {\"SysAdmin\",\"ChmAdmin\",\"change request\",\"change task\"})";
	
	}else if (module == "Request"){		 
			
			approvalQry += " and (cap.exec isin {\"SysAdmin\",\"OCMAdmin\",\"OCMQ\"})";		
	
	}else if (module == "all"){
			
			//approvalQry += " and (cap.exec isin {\"SysAdmin\",\"OCMAdmin\",\"OCMQ\"} and cap.exec isin {\"SysAdmin\",\"ChmAdmin\",\"change request\",\"change task\"})";
		  	//approvalQry += " and (cap.exec isin {\"SysAdmin\",\"OCMAdmin\",\"OCMQ\"} and (index(\"SysAdmin\",str(cap.exec))>0 or index(\"ChmAdmin\", str(cap.exec))>0 or index(\"change request\", str(cap.exec))>0 or index(\"change task\", str(cap.exec))>0)) ";
			approvalQry += " and (cap.exec isin {\"SysAdmin\",\"OCMAdmin\",\"OCMQ\"})";		
			 
	}	
		
	return approvalQry;
}


//print(addFolderQuery("Request"));
/**
 * @public
 * @description  If folder is  enabled, we will also make sure to retrieve delegate if it has same filder access as the approver
 * @return {SCFile} currentUser - Operator
 */	
function addFolderQuery(module){

	//if folder is enabled, first find all folders the user has view access to
	var folderQuery = "true";
 	if (system.vars.$G_folderEntitlement) {
			 
		//getCurrentUser();			 
		var sql= "";
		var tableName="";
		//current tablename means area name
		
		var profileArray = vars.$G_role;	 
		
		var cond = "{";
		var i, length = profileArray.length(); 
		for(i=0; i<length; ++i){
			//print(profileArray[i])
			cond+="\""+profileArray[i]+"\",";
		} 
		cond = cond.substring(0,cond.length-1);	

		cond += "}"; 
		 
		sql = "tablename=\"" + module+ "\" and name isin "+cond;
		tableName = module;	  
	 
		var folderRights = new SCFile("FolderRights", SCFILE_READONLY);
		folderRights.setFields(["view","folder"]);
		var rc = folderRights.doSelect(sql);
		//next, check for each FolderRights record to see if it has view rights 
		
		//print("addFolderQuery after select folderRights "+folderRights);
		
		var folderArray = [];
		while(rc == RC_SUCCESS)  
		{ 				
			if (folderRights.view == true && isDuplicate(folderArray,folderRights.folder)!=true) {
				folderArray.push(folderRights.folder);
			}
			rc = folderRights.getNext();
		}
		
		//print("addFolderQuery after while folderArray "+folderArray);
		var aFolderQuery = "tablename=\""+tableName+"\" and view=true  ";
		
		if (folderArray.length !=0)
		{
			aFolderQuery += " and folder isin {";
			for (i in folderArray)
			{
			   	if (folderArray.hasOwnProperty(i)) {		    
					aFolderQuery += "\"" +folderArray[i]+"\"";
					if (i<folderArray.length-1) {
		 				aFolderQuery+=",";
		 			}
		 		}		
			}
			aFolderQuery += "}";
		}
		
	   // print("addFolderQuery after for aFolderQuery "+aFolderQuery);
		
		//next, find all profiles who has view rights to those folder
		var aRight = new SCFile("FolderRights", SCFILE_READONLY);
		aRight.setFields(["name"]);
		rc = aRight.doSelect(aFolderQuery);
		
		//print("aRight select results is "+aRight);
		
		var nodupFolderAray = [];
		var hasdupFolderAray = [];		
		while(rc == RC_SUCCESS)  
		{ 	
			//print("in while loop name is "+aRight.name);		
			hasdupFolderAray.push(aRight.name);	
			if(!isDuplicate(nodupFolderAray,aRight.name)) {			
				nodupFolderAray.push(aRight.name);
			}
				
			rc = aRight.getNext();
		} 
		 
		var newFolderArray = lib.ApprovalUtil.isCorrectLength(nodupFolderAray,hasdupFolderAray,folderArray.length);
		
		if (newFolderArray.length !=0)
		{
			folderQuery = " role isin {";  
			 
			for (i in newFolderArray)
			{
			   if (newFolderArray.hasOwnProperty(i)) {		   
					folderQuery += "\"" +newFolderArray[i]+"\"";
					if (i<newFolderArray.length-1) {
		 				folderQuery+=",";
		 			}
		 	   }		
			}
			folderQuery += "}";
		}
		
		//print("addFolderQuery returns  "+folderQuery);
	} 
	return folderQuery;
}

/**
 * @public
 * @description  whether the element is duplicate in array
 * @return {bollean} true/false
 */	
function isDuplicate(array,element){

	for (i in array)	{
		if(array[i] == element) {			
				return true;		
		}
	}
	return false;
}
	

	
	
//print(checkDelegate("file.name=\"rmCategory\" and unique.key=\"b\"","Request"));
//$L.appr.query="file.name=\""+str(filename($L.file))+"\" and unique.key=\""+number in $L.file+"\""
/**
 * @public
 * @description  check to see if this is a delegate approval, if it is, return delegate, else return empty string
 * @return {bollean} true/false
 */	
function checkDelegate(approvalQry,module){
	
	return checkDelegates(approvalQry,module, null);
}
	
	
	
function checkDelegates(approvalQry,module,delegateGrp){
	
 	if (approvalQry == null) {
		return "";
	}
	
	//retrieve approval
	var approval = new SCFile("Approval", SCFILE_READONLY);
	approval.setFields(["current.pending.groups"]);
	var rc = approval.doSelect(approvalQry);	
	
	var pendingGroups = approval.current_pending_groups;
	
	if(isDuplicate(pendingGroups, system.functions.operator())) {
		return "";
	}
	
	//retrieve user profile
    var currentUser = vars['$lo.operator'];
    var operatorName = system.functions.operator();
    if (currentUser == null || currentUser.name != operatorName) {
        currentUser = new SCFile("operator", SCFILE_READONLY);
        currentUser.setFields(["profile_service", "profile_incident", "profile_rootcause", "profile_request"]);
        var sql = "name=\"" + operatorName + "\"";
        rc = currentUser.doSelect(sql);
    }
	
	
	var profileName = "" ;
	var profileArray = [];
	var moduleName = ""; 	

	var i;
	
	if(module=="incidents" || module=="svcCartItem"){
		profileName = currentUser.profile_service;
		moduleName = "SVC";			
		if(isDuplicate(pendingGroups,profileName)) {
			return "";
		}
	} else if(module=="probsummary"){
		profileName = currentUser.profile_incident;
		moduleName = "Incident";		
		if(isDuplicate(pendingGroups,profileName)) {
			return "";			 
		}
	}else if(module=="timeperiodDefinition"){		
		profileArray = vars.$lo_pm_assignments;
		moduleName = "Timeperiod";			
		for (i=0;i<profileArray.length;i++){
			if(isDuplicate(pendingGroups, profileArray[i])) {
			 	return "";
			 }
		}	
	}else if(module=="rootcause"){
		profileName = currentUser.profile_rootcause;
		moduleName = "Problem";
		if(isDuplicate(pendingGroups,profileName)) {
			return "";
		}	
	}else if(module.indexOf("ocm")!=-1)	{
		profileArray = currentUser.profile_request;
		var profileArrayLength = system.functions.lng(profileArray);
		for(i=0; i < profileArrayLength; i++ )	{
			if(isDuplicate(pendingGroups,profileArray[i])) {
		 		return "";
		 	}
		}
 	}else {	
 		moduleName= security.getArea(module);
		var myGroups = new SCFile("myGroups", SCFILE_READONLY);
		myGroups.setFields(["approver_of"]);
		var mySql = "name=\""+system.functions.operator()+"\"";
		if ( myGroups.doSelect( mySql ) == RC_SUCCESS ){				
			profileArray = myGroups.approver_of;	
		}
		for(i in profileArray){	
			if(isDuplicate(pendingGroups,profileArray[i])) {
		 		return "";
		 	}
		}  
	} 
	
	//now, look for who it is delegate from
	var delegate = new SCFile("ApprovalDelegation", SCFILE_READONLY);
	delegate.setFields(["AppModule","Approver"]);
	var date = system.functions.str(system.functions.tod());

	var delegateSql ="";
	if (delegateGrp == null || delegateGrp =="" ) {
	 	delegateSql = "Enable=true and Delegate=\""+system.functions.operator()+"\" and DateFrom <='"+date+"' and DateTo >='"+date+"'";
	}else { 
		delegateSql = "Enable=true and Delegate=\""+system.functions.operator()+"\" and DateFrom <='"+date+"' and DateTo >='"+date+"'   and AppGroup=\"" + delegateGrp + "\"";
	}
 
	rc = delegate.doSelect(delegateSql);
	
	//print("after query rc "+rc+" delegate="+delegate);
 	while(rc == RC_SUCCESS)  { 	
	
		if (delegate.AppModule == "all" || delegate.AppModule == moduleName) {
			return delegate.Approver;
		}
		rc = delegate.getNext();	
	}
	
	return "";
}
	
	
//print(addDelegateGroups(vars.$G_myGroups["approver.of"], "Request Management Configuration"))
	
function addDelegateGroups(currentGroups,module){

    var delegationListforSVCSupporting = [];
	var rsforSVC = [] ;
	var rs =[];
	rsforSVC = lib.ArrayUtil.toSCDatum(rsforSVC);
	rs = lib.ArrayUtil.toSCDatum(rs);
	if(module=="incidents" || module=="svcCartItem"){
		delegationListforSVCSupporting =  initDelegation("SVC");
		rsforSVC= retrieveGroupfromDelegation(delegationListforSVCSupporting,currentGroups,"SVC");
	}
		
	module = security.getArea(module);	 
    var delegationList = initDelegation(module); 

 	rs = retrieveGroupfromDelegation(delegationList,currentGroups,module); 	

   	var length=lib.ArrayUtil.length(rsforSVC);  	

 	if(length>0) {
 		lib.ArrayUtil.addAllWithoutDuplicate(rs,rsforSVC);
 	} 
	
  	return rs;  
}


function retrieveGroupfromDelegation(delegationList,currentGroups,module){
	
	var allGroups =[];
 	var partGroups =[];	
 	
 	allGroups = lib.ArrayUtil.toSCDatum(allGroups);
	partGroups = lib.ArrayUtil.toSCDatum(partGroups);
	
    //print("delegationList"+delegationList);	
	if(delegationList[0].length == 0 && delegationList[1].length==0) {
    	return currentGroups;
    }
     
    var allSQL =  getDelegationGroupsForAll(delegationList[0]);
	//print("allSQL"+allSQL);
	var partSQL = getDelegationGroupsForPart(delegationList[1],module);
	//print("partSQL"+partSQL);
	
    if(allSQL != "") {
    	allGroups = retrieveGroups(allSQL);
    } 
    //print("allGroups"+allGroups);
    if(partSQL!="") {
  	 	partGroups =retrieveGroups(partSQL);
    }
    
    //print("allGroups"+allGroups) 
    //print("partGroups"+partGroups)
   
    lib.ArrayUtil.addAllWithoutDuplicate(allGroups,partGroups);
    //print("result"+allGroups) 
    
    return allGroups;   

}

function retrieveGroups(sql){
		
	var currentGroups = [];
		
	if (sql=="" || sql==null) {
		return currentGroups;
	}
	//print(sql);
	sql = sql.substring(sql.indexOf("{"));
		
    var delegateGroups = system.functions.evaluate(system.functions.parse(sql,8));
    var i, length = system.functions.lng(delegateGroups); 
    for(i=0;i<length;++i){
    	if(!lib.ApprovalUtil.isDuplicate(currentGroups,delegateGroups[i])){       
        	currentGroups = system.functions.insert(currentGroups,1,1,delegateGroups[i]);
        }
    }
    //print("currentGroups"+currentGroups)    
    return currentGroups; 	
}

//print(getMyPendingDelegatedApprovalsViewSQL());
function getMyPendingDelegatedApprovalsSQL(){

	return getDelegationSql();

}

function getMyPendingDelegatedApprovalsViewSQL(){

	
	var query = "";
	var oobquery ="(file.name=\"cm3r\" and current.pending.groups isin $G.delegated.cm3r.groups) or (file.name=\"request\" and current.pending.groups isin $G.delegated.pdrm.groups) or ((file.name=\"incidents\" or file.name=\"svcCartItem\") and current.pending.groups isin $G.delegated.svc.groups) or (file.name=\"timeperiodDefinition\" and current.pending.groups isin $G.delegated.timeperiod.groups)" ;
	query = oobquery;
	
	if (approvalEnablement.isNewApprovalInboxDelegation()){	
		var sql = getMyPendingDelegatedApprovalsSQL();
		//print("sql"+sql);
		if(sql!=null && sql!="") {		
			query = oobquery + sql ;		
		}		
	} 
	
	return query;

}

//print(canDelegateAll())
//print(getCanDelegateModulesValue())