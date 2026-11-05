/** @fileoverview discoveryEvent - contains functions used by the Discovery Data Manager
*   @author Pete Budic
*/

/**  This function is called to populate an incident that is to be opened by the DDM
*
*	@param {Record} incident	-  The Incident that is to be populated
*	@param {String}	id	-	The id (tag) of the record that caused the event
*	@param {String} tableName - The name of the table which holds the record
*	@param {Array}  exceptionFields - Array of fields that had exceptions
*	@param {Array}	oldValues - Array of the expected values in the exception fields
*	@param {Array}	newValues - Array of the discovered values in the exception fields
*/
function populateIncident(incident, id, tableName, exceptionFields, oldValues, newValues, action, foreignId, record ,deleteStatus, fileName)
{
	incident.category = "incident";
	incident.subcategory = "hardware";
	incident.product_type = "missing or stolen";
	incident.assignment = "Hardware";
	incident.initial_impact = "3";
	incident.severity = "3";
	incident.logical_name = id;
	incident.site_category = "C";
	incident.contact_name = "ANALYST, INCIDENT";
	incident.affected_item= "MyDevices";
	var desc = funcs.scmsg( 4, "ddmRule", [id]);
	
	if ( action == "add" )
	{
		desc = funcs.scmsg( 6, "ddmRule");
	}
	else if ( action == "delete" )
	{
		if(fileName!="cirelationship") {
	    	desc= funcs.scmsg( 11, "ddmRule", [id,deleteStatus]);
	    }
	    else {
	    	desc= funcs.scmsg( 7, "ddmRule", [id]);
	    }
	}
	incident.action[0] = desc;

	if(vars.$G_multi && lib.uCMDBConfiguration.isEnabled() && record.company!=null) {
		incident.company = record.company;
	}
}

/**  This function is called to populate a change that is to be opened by the DDM
*
*	@param {Record} change	-  The Incident that is to be populated
*	@param {String}	id	-	The id (tag) of the record that caused the event
*	@param {String} tableName - The name of the table which holds the record
*	@param {Array}  exceptionFields - Array of fields that had exceptions
*	@param {Array}	oldValues - Array of the expected values in the exception fields
*	@param {Array}	newValues - Array of the discovered values in the exception fields
*/
function populateChange(change, id, tableName, exceptionFields, oldValues, newValues, action, foreignId, record ,deleteStatus, fileName)
{
	change.category="Unplanned Change";
	
	var reason = funcs.scmsg( 5, "ddmRule");
	change.reason = reason;
	change.initial_impact="3";
	change.severity = "3";
	change.coordinator = "Change.Coordinator";
	change.requested_by = "discovery";
	change.status = "initial";
	var desc = funcs.scmsg( 4, "ddmRule", [id]);
	
	if ( action == "add" )
	{
		desc = funcs.scmsg( 6, "ddmRule");
	}
	else if ( action == "delete" )
	{  
		if(fileName!="cirelationship") {
	    	desc= funcs.scmsg( 11, "ddmRule", [id,deleteStatus]);
	    }
	    else {
	    	desc= funcs.scmsg( 7, "ddmRule", [id]);
	    }
	}
	change.description[0] = desc;
	change.brief_description  = desc;
	change.assets[0] = id;
	change.logical_name = id;
	change.planned_start=funcs.tod();
	
	if(vars.$G_multi && lib.uCMDBConfiguration.isEnabled() && record.company!=null) {
		change.company = record.company;
	}
}

function createCIName( record ,ddmRule)
{
	return record.logical_name;
}

function postDeleteCIWithChange(tableName, ciId, newStatus){
    if(tableName=="cirelationship") {
    	return;
    }
    var sql="recordId=\""+escapeStr(ciId)+"\" and tableName=\""+tableName+"\"  and active=true and eventId~=NULL";    
    var foundDeleteStatus = false;    
    var file = new SCFile("dataModEvent");
	var linkedRecordList=[];
    if(RC_SUCCESS==file.doSelect(sql)){
    
	    var changeId = "";
	    
	    do{
	    	if(file.fieldName!="istatus"){
	    	 /* can enable outOfDate function if required
	    	  * update to outOfDate due requirement QCIM1E72162
	    	  */
	    		file.status="outOfDate";
	    		file.active=false;
	    		file.comments=funcs.scmsg(7, "ddmRule", [ciId]);
	    	} else {
	    		foundDeleteStatus = true;
	    	}
	    	if(RC_SUCCESS!=file.doUpdate()){
	    		//return false;
	    	}
	    	var	linkedTableName=file.linkedTableName;
	    	var linkedRecordId=file.linkedRecordId;
	    	if(!lib.ArrayUtil.contains(linkedRecordList,linkedRecordId)){
		    	linkedRecordList.push(linkedRecordId);
		    	updateChangeName(ciId,linkedTableName,linkedRecordId,newStatus); 
	    	}
	    }while(RC_SUCCESS==file.getNext());
    }   
}


function updateChangeName(logicalName, linkedTableName, linkedRecordId, deleteStatus){

	 var change=new SCFile(linkedTableName);
	 var sql="number=\""+linkedRecordId+"\"";
       if(RC_SUCCESS==change.doSelect(sql)){
         var deleteTitle = funcs.scmsg( 11, "ddmRule", [logicalName,deleteStatus]);
       	  if(linkedTableName=="probsummary"){
         	 change.action[0]=deleteTitle;
         	 }
          else{
          	change.description[0]=deleteTitle;
          	change.brief_description=deleteTitle;
          	/*
          	vars.$cm_activity="Update";
          		vars.$G_bg_activity_text = "a";
				vars.$G_bg_activity_type = "b";
			vars.$cm_update =["Change title from update to delete"];
			*/
          }	
          change.doUpdate();
       }
}

function updatePlanChange(ciTable, ciName){
    var dmePlan=new SCFile("dataModEvent");
    //and status isin {\"proposed\",\"planned\",\"implemented\",\"failedValidation\"} 
    var sql="recordId=\""+escapeStr(ciName)+"\" and tableName=\""+ciTable+"\"  and active=true and eventId=NULL"; 
    var rc=dmePlan.doSelect(sql);
    while(rc==RC_SUCCESS){
       	dmePlan.status="outOfDate";
	    dmePlan.active=false;
	    dmePlan.comments="outOfDate for CI is removed";
	    dmePlan.doUpdate();
	    rc=dmePlan.getNext();
   }	
}

function updateAllChangeToOutofDate(ciTable, ciName){
    var dmePlan=new SCFile("dataModEvent");
    var sql="recordId=\""+escapeStr(ciName)+"\" and tableName=\""+ciTable+"\"   and active=true "; 
    var rc=dmePlan.doSelect(sql);
    while(rc==RC_SUCCESS){
       	dmePlan.status="outOfDate";
	    dmePlan.active=false;
	    dmePlan.comments="outOfDate for CI is removed";
	    dmePlan.doUpdate();
	    rc=dmePlan.getNext();
   }	
}

function uniqueLogicaName( file,ddmRule)
{
	var sql = getQuery('device', file, file.logical_name);
	var device = new SCFile("device",SCFILE_READONLY);
	device.setFields(["logical.name"]);
	var rc = device.doSelect(sql);
	if( rc == RC_SUCCESS ){
		var orgiLogicalName = vars.$L_copy_file.logical_name;
		if( orgiLogicalName != null && orgiLogicalName != device.logical_name ){		
			print(funcs.scmsg(176, "ScriptLibrary"));
		}
		file.logical_name = device.logical_name;
	}	
}

function getTableNameViaType(ciType){
	var devtype=new SCFile("devtype", SCFILE_READONLY);
	devtype.setFields("joindef");
	devtype.doSelect("device.type=\"" + ciType + "\" and active=true");
	var fileType="device";
	if(devtype.joindef!=null && devtype.joindef!=""){
		fileType=devtype.joindef;
	}
	return fileType;
}

function populateNewCI( record ,ddmRule)
{
	//add validation for record.logical_name duplicate rule modified by panjun
	if( record.logical_name == null || record.logical_name == ""){
		record.logical_name = lib.DisplayName.getRecordNumber("device");
	}
}

/**
this defalut value setting should apply for add/update
**/
function setDefaultValue(record){
	
	if ( record.assignment == null )
	{
		record.assignment = "AUTO";
	}
	if ( record.istatus == null )
	{
		record.istatus = "Installed";
	}
	if ( funcs.exists("os.name", record) && record.os_name == null )
	{
		record.os_name = record.operating_system;
	}
}

function translateUcmdbRelationship( record )
{		
        var ucmdbId=record.logical_name;
        record.logical_name = lib.configurationManagement.getCINameFromUcmdbId(ucmdbId, record.company );
        if ( record.logical_name == null )
        {
        		print(funcs.scmsg(172, "ScriptLibrary",[ucmdbId]));
                return false;
        }
        
        var i;
        var iLoopTimes = record.related_cis.length();
        for ( i = 0; i < iLoopTimes; i++ )
        {		
                ucmdbId=record.related_cis[i];
                record.related_cis[i] = lib.configurationManagement.getCINameFromUcmdbId(ucmdbId, record.company );
                if ( record.related_cis[i] == null )
                {
                		print(funcs.scmsg(172, "ScriptLibrary",[ucmdbId]));
                        return false;
                }
        }
        if ( record.relationship_name == null )
        {
                record.relationship_name = record.relationship_subtype +"_"+ record.related_cis[0];
        }
        
        if ( vars.$G_multi )
        {
                populateCompanyForRelationship(record);
        }
        return true;
}

function escapeStr(str){
	if (null==str){
		return str;
	}
	
	str = str.replace("\\", "\\\\");
	str = str.replace("\"", "\\\"");
	return str;
}

/*
*/
function getQuery( tableName, record, id )
{
	var sql = "false";

	if ( tableName == "cirelationship" )
	{
		var relname = record.relationship_name;
		if ( relname == null )
		{
			relname = record.related.cis[0];
		}
		sql = "relationship.name=\"" + escapeStr(relname) + "\" and logical.name=\"" + escapeStr(id)+"\"";
		return sql;
	}
		
	if ( funcs.exists("ucmdb.id", record ) == true ) 
	{
		if ( record.ucmdb_id != null )
		{
			sql = "ucmdb.id=\"" + record.ucmdb_id + "\"";
			//if(vars.$G_multi && record.company!=null && record.company.length!=0)
			//{
				//sql="ucmdb.id=\"" + record.ucmdb_id + "\" and company=\""+record.company+"\"";
			//}
			vars.$L_from_ucmdb = true;
		}
	}
	return sql;
}

function isCI( tablename )
{
	if ( tablename == "cirelationship" )
	{
		return false;
	}
	
	var devtype = new SCFile("devtype", SCFILE_READONLY);
	devtype.setFields("device.name");
	var sql = "joindef=\""+tablename+"\"";
	if ( devtype.doSelect(sql) == RC_SUCCESS )
	{
		return true;
	}
	return false;
}

function populateCompany(companyCode)
{
	if(vars.$G_multi && lib.uCMDBConfiguration.isEnabled() && companyCode.length!=0)
	{
		var ucmdbCompanyId = parseInt(companyCode);
		if (Number.isNaN(ucmdbCompanyId)) {
			return;
		}
		
		var companySql = "ucmdb.customer.id="+ucmdbCompanyId; 
		var company = new SCFile("company", SCFILE_READONLY);
		company.setFields("company");
		if ( company.doSelect(companySql) == RC_SUCCESS )
		{
			return company.company;
		}
	} 
}

/**  This function is called to retrieve the ucmdb.customer.id, user name and password of the company from a CI
*
*	@param {ciRecord} device	-  The CI that is being queried
*/
function getUCMDBCompanyData( ciRecord )
{
	if (!ciRecord || !ciRecord.company) {
	    return null;
	}
	var company = ciRecord.company;
	var companySql = "company=\""+company+"\"";
	var companyFile = new SCFile("company", SCFILE_READONLY);
	companyFile.setFields(["ucmdb.customer.id", "ucmdb.userid", "ucmdb.password"]);

	if ( companyFile.doSelect( companySql ) == RC_SUCCESS )
	{
		var companyData = {};
		companyData.ucmdb_customer_id = companyFile.ucmdb_customer_id;
		if (companyFile.ucmdb_userid != null) {
			companyData.ucmdb_userid = companyFile.ucmdb_userid;
		}
		if (companyFile.ucmdb_password != null) {
			companyData.ucmdb_password = companyFile.ucmdb_password;
		}	
		return companyData;
	}
	else {
	   print("Company record not found for company name "+ciRecord.company);
	}
	
	return null;
}

/**
 *  Get the customer id from CI record
 *  Parameter:
 *      ciRecord -  CI record
 *  When company doesn't exist or no ucmdb.customer.id, 
 *    return the value defined in SMtoUCMDB SMIS intance
 *        The default value is 1
 */
function getUCMDBCustomerID(ciRecord) {
    var companyData = getUCMDBCompanyData(ciRecord);
    if (!companyData || !companyData.ucmdb_customer_id) {
        return lib.uCMDBConfiguration.getUcmdbCustomerID();
    }
    
    return companyData.ucmdb_customer_id;
}

/**
 *  Get the customer id from CI logical name
 *  Parameter:
 *      logicalname -  CI logical name
 */
function getUCMDBCustomerIDByLogicalName(logicalname) {
    if (!logicalname) {
        return null;
    }
    
    var ciRecord = new SCFile("device");
    var rc = ciRecord.doSelect("logical.name=\"" + logicalname + "\"");
    if (rc == RC_SUCCESS) {
        return getUCMDBCustomerID(ciRecord);
    }
    
    return null;
}

/**
 *  Get the customer id from the array of CI logical name
 *  Parameter:
 *      logicalnameArray - the array that every element is CI logical name
 *  When there are more than one logical name in the array, 
 *  return the first customer id from the element of the array
 */
function getUCMDBCustomerIDByLogicalNameArray(logicalnameArray) {
    if (!logicalnameArray) {
        return null;
    }

    var array = logicalnameArray;
    if (!(logicalnameArray instanceof Array)) {
        array = logicalnameArray.toArray();
    }
    
    if (!array) {
        return null;
    }
    
    var i;
    var customerid = null;
    for (i=0; i<array.length; i++) {
        customerid = getUCMDBCustomerIDByLogicalName(array[i]);
        if (customerid) {
            break;
        }
    }
    
    return customerid;
}

function populateCompanyForRelationship(record)
{
	var parentCIName = record.logical_name;
	var parentCI = new SCFile("device", SCFILE_READONLY);
	parentCI.setFields(["company"]);
	var sql = "logical.name=\""+escapeStr(parentCIName)+"\"";
	if ( parentCI.doSelect(sql) == RC_SUCCESS )
	{
		var company = parentCI.company;
		if(company != null) {
			record.company = parentCI.company;
		}
	}
}

function invalidDelCall(serviceName, type)
{	
	var devType = new SCFile("devtype", SCFILE_READONLY);
	devType.setFields("joindef");
	var ret = devType.doSelect("device.type=\""+type+"\" and active=true");
	if (ret == RC_SUCCESS && (devType.joindef==serviceName||(devType.joindef==null && serviceName=="device")))
	{
		return false;
	}
	
	return true;
}


function insertFields(ddmRule , actions , fieldList) {
	var i;
	
	//filter fields via action type
	var fields=[];
	if(actions==null){
		fields=fieldList;
	}else{
		for(i in actions){
			 if(actions[i]=="Add"){
			     fields.push(fieldList[i]);
			 }
		}
	}
	
    var extaccessList = [];
    var dbdictList = getTables(ddmRule.tableName);
    var list = [];
    for (i = ddmRule.rules.length() - 1; i >= 0; i--) {
        if (ddmRule.rules[i].fieldName == "" || ddmRule.rules[i].fieldName == undefined) {
            ddmRule.rules = funcs._delete(ddmRule.rules, i + 1); //RAD index is from 1
        }
        list.push(ddmRule.rules[i].fieldName);
    }
  
    var ruleLength = ddmRule.rules.length();
    var u = ruleLength;
    //find the last row
    for (i = ruleLength - 1; i >= 0; i--) {
        if (ddmRule.rules[i].fieldName == null || (ddmRule.rules[i].fieldName == "" && ddmRule.rules[i].structure == "")) {
            u = i;
        } else {
            break;
        }
    }
    ruleLength = u;
    var fieldsLength = funcs.lng(fields);
    var index;
    for (index = 0; index < fieldsLength; index++) {
        if (fields[index] == null) {
            continue;
        }

        var ind = fields[index].indexOf("[");
        var filedName = fields[index];
        if (ind > 0) {
            filedName = filedName.substring(ind + 1, fields[index].indexOf("]"));
        }

        if (!lib.ArrayUtil.contains(list, filedName) && filedName != "") {
            list.push(filedName);
            if (ind > 0) {
                ddmRule.rules[u].structure = fields[index].substring(0, ind);
                ddmRule.rules[u].fieldName = filedName;
                var indexIn = findIndexFromDbdict(dbdictList, filedName);
                //TODO there is a strange issue that structureIndex can't accept number always. if the column used may require string format
                if (u >= ruleLength || typeof (ddmRule.rules[u].structureIndex) == "number") {
                    ddmRule.rules[u].structureIndex = indexIn;
                } else {
                    ddmRule.rules[u].structureIndex = "" + indexIn;
                }

            } else {
                ddmRule.rules[u].fieldName = filedName;
            }
            u = u + 1;
        }
    }
    //sort the result
	sortAndRemoveDuplicateResult(ddmRule);
    var count = ddmRule.rules.length() - ruleLength;

    if (count > 0) {
        print(funcs.scmsg(145, "wizard", [count]));
    } else {
        print(funcs.scmsg(146, "wizard"));
    }
}

/*
sort method for caption compare
*/
function sortRules(rule1,rule2){

    var index1=lib.ArrayUtil.indexOf(this.fields,rule1.fieldName);
    var index2=lib.ArrayUtil.indexOf(this.fields,rule2.fieldName);
    if(this.captions==null) {
        return -1;
    }
    var caption1=this.captions[index1];
    var caption2=this.captions[index2];
    if(caption1==null){
    	caption1=rule1.fieldName;
    }
    if(caption2==null){
    	caption2=rule2.fieldName;
    }
    return   (""+caption1).localeCompare(caption2);
}

/**
sort the result via captions. remove the duplcate fields name
**/
function sortAndRemoveDuplicateResult(ddmRule){

	var rules=ddmRule.rules;
	var allFields = lib.GetFieldNames.getAllFields( ddmRule.tableName );
	this.fields= allFields[0].toArray();
	this.captions= allFields[1].toArray();
	 
	var list=[];
	var nameList=[];
	var i;
	for(i in rules){
		var obj={};
		var name=rules[i].fieldName;
		if(name==null || name==""){
			continue;
		}
		if(!lib.ArrayUtil.contains(nameList,name)){
			obj.fieldName=rules[i].fieldName;
			obj.structure=rules[i].structure;
			obj.fieldCondition=rules[i].fieldCondition;
			obj.structureIndex=rules[i].structureIndex;
			list.push(obj);
			nameList.push(name);
		}
	}
	list.sort(sortRules);
	
	ddmRule.rules=[];
	for(i=0;i< list.length;i++){
		ddmRule.rules[i].structure = list[i].structure ;
		ddmRule.rules[i].fieldName = list[i].fieldName ;
		ddmRule.rules[i].structureIndex = list[i].structureIndex ;     
		ddmRule.rules[i].fieldCondition = list[i].fieldCondition ;         
	}
}

function loadFieldsQuickly(ddmRule){
	var sc=new SCFile("extaccess", SCFILE_READONLY);
	sc.setFields("object.name");
	var rc=sc.doSelect("name=\""+  ddmRule.tableName +"\"");
	
	var fields=listFieldsViaWebservice(ddmRule,[sc.object_name])[1];
    insertFields(ddmRule, null ,fields);
}

function listFieldsViaWebservice(ddmRule,webservice){

    var list=[];
    var fieldList=[];
    var i;
    var length = funcs.lng(webservice); 
    for(i=0;i<length;i++){
        var extaccess=new SCFile("extaccess", SCFILE_READONLY);
        extaccess.setFields("soafield");
    	var rc=extaccess.doSelect("object.name = \""+webservice[i]+"\"");
    	 if(rc==RC_SUCCESS){
    	  var j;
    	  var jLoopTimes = extaccess.soafield.length();
    	  for(j = 0;j < jLoopTimes;j++){
    	    if(!lib.ArrayUtil.contains(fieldList,extaccess.soafield[j])){
    	    	if(extaccess.soafield[j]!="" && extaccess.soafield[j]!=null){
    		    	var obj={};
    		    	obj.field=extaccess.soafield[j];
    		    	obj.caption=extaccess.soacaption[j];
    		    	obj.action="Add";
    				list.push(obj);
    				fieldList.push(extaccess.soafield[j]);
    			}
    	   }
    	  }
    	 }
     }
    
    list.sort(sortCaptions);
    fieldList=[];
    var captionList=[];
    var actionList=[];
    for (i=0;i<list.length;i++){
        fieldList.push(list[i].field);
        captionList.push(list[i].caption);
        actionList.push(list[i].action);
    }
    
    return [actionList,fieldList,captionList];
}

function sortCaptions(obj1,obj2){
	return   (""+obj1.caption).localeCompare(obj2.caption);
}

/**
base on the same table name used in webservice and ddmRule.
use this method to load the line to rule.
**/
function loadFieldsViaWebservice(ddmRule,webservice){
	var extaccessList=[];
	var dbdictList=getTables(ddmRule.tableName);
	var list=[];
	var i;
	for(i=ddmRule.rules.length()-1; i>=0 ;i--){
		if(ddmRule.rules[i].fieldName=="" || ddmRule.rules[i].fieldName==undefined){
		 ddmRule.rules= funcs._delete(ddmRule.rules, i+1 ); //RAD index is from 1
		}
		list.push(ddmRule.rules[i].fieldName);
	}
	
	var extaccess;
	
	if(webservice==undefined || webservice==null){
		extaccess=new SCFile("extaccess", SCFILE_READONLY);
		extaccess.setFields("soafield");
		var rc=extaccess.doSelect("name=\""+ddmRule.tableName+"\"");
		while(rc==RC_SUCCESS){
			extaccessList.push(extaccess);
			rc=extaccess.getNext();
		}
	 }else{
	 	extaccessList.push(webservice);
	 }	
	 
	 var index;
	 for(index=0;index<	extaccessList.length;index++){
	 		extaccess=extaccessList[index];
			var u=ddmRule.rules.length();
			var ruleLength=ddmRule.rules.length();
			//find the last row
			for(i=ddmRule.rules.length()-1; i>=0;i--){
				if(ddmRule.rules[i].fieldName==null || (ddmRule.rules[i].fieldName=="" && ddmRule.rules[i].structure=="")){
					u=i;
				}else{
					break;
				}
			}
		    
		    var iLoopTimes = extaccess.soafield.length();  
			for(i = 0;i < iLoopTimes;i++){
				if(extaccess.soafield[i]==null){
					continue;
				}
			     var ind=extaccess.soafield[i].indexOf("[");
			     var filedName=extaccess.soafield[i];
			     if(ind>0){
			     	 filedName=filedName.substring(ind+1,extaccess.soafield[i].indexOf("]"));
			     }
			     
				if(!lib.ArrayUtil.contains(list,filedName) && filedName!="" ){
					list.push(filedName);
					if(ind>0){
						ddmRule.rules[u].structure=extaccess.soafield[i].substring(0,ind);
						ddmRule.rules[u].fieldName=filedName;
						var indexIn=findIndexFromDbdict(dbdictList,filedName);
						//TODO there is a strange issue that structureIndex can't accept number always. if the column used may require string format
						if(u>=ruleLength || typeof(ddmRule.rules[u].structureIndex) =="number"){
							ddmRule.rules[u].structureIndex=indexIn;
						}else{
							ddmRule.rules[u].structureIndex=""+indexIn;
						}
						
					}else{
						ddmRule.rules[u].fieldName=filedName;
					}
					u=u+1;
				}
			}
		}
}

function findIndexFromDbdict(dbList, fieldName){

    var j;
	for(j=0;j<dbList.length;j++){
		var file=dbList[j];
		var i;
		var iLoopTimes = file.field.length();
		for(i = 0;i < iLoopTimes;i++){
			if(file.field[i].name==fieldName && file.field[i].type!=8&& file.field[i].type!=9){
				return file.field[i].index;
			}
		}
	}
		
	return null;
}


/**  This function is called to find the tables of dbdict/joindefs
*
*	@param {String} tableName	-  The name of table 
*	@return The tables of joindefs
*	@type Array
*/
function getTables( tableName )
{
	var table = new SCFile("dbdict");
	var joindefs = new SCFile("joindefs", SCFILE_READONLY);
	joindefs.setFields("join.tables");
	var sql = "name=\"" + tableName + "\"";

    if ( table.doSelect( sql ) == RC_SUCCESS )
	{
		return [table];
	}
	
	var joinsql = "join.name=\""+tableName+"\"";
	var tables=[];
	if ( joindefs.doSelect(joinsql) == RC_SUCCESS )
	{
	    var i;
	    var iLoopTimes = joindefs.join_tables.length();
		for (i = 0; i < iLoopTimes; i++ )
		{
			tables.push(getTables(joindefs.join_tables[i].table_name)[0]);
		}
	}
	return tables;
}

function removeQuote(str){
	if(str!=null){
		return str.replace(/"/g,"");
	}
	return str;
}

/**
 * Find a ddmRule by table and condition
 * The function is call when close change/incident, when the dataModEvent fields contain the field 'istatus'.
 * @param vars.$L_table table name
 * Return ddmRule, the matched ddmRule object 
 */
function findDdmRule() {
	
	var ddmRule = new SCFile('ddmRule');
	var ret = ddmRule.doSelect('tableName="'+vars.$L_table+'"');
	
	var found = false;
	while (RC_SUCCESS==ret){	
		if (null==ddmRule.condition || funcs.parse_evaluate(funcs.str(ddmRule.condition), 2)){
			found = true;
			break;
		}
		
		ret = ddmRule.getNext();
	}
	
	if (found){
		return ddmRule;
	} else {
		return new SCFile('ddmRule');
	}
}

/**
 * Find a DEM Reconcile Record by table name
 * The function is called when reconciling ci in RAD of ddm.processData.
 * @param tableName table name
 * Return Array of Reconcile Query Expression
 */
function getDEMReconcile(tableName){
    var expAry;
    var seqAry;
    var temp=new SCDatum(8);
    var demRconcile=new SCFile("ddmReconcile",SCFILE_READONLY);
    demRconcile.setFields(["expression", "expression.sequence"]);
    var sql="tableName=\""+tableName+"\"";
    if(demRconcile.doSelect(sql)===RC_SUCCESS){
        expAry=demRconcile['expression'];
        seqAry=demRconcile['expression.sequence'];
    }
    if(expAry!==null && !funcs._null(expAry)){
        temp.push(seqAry);
        temp.push(expAry);
        var retcode;
        funcs.rtecall("sort", retcode, temp, 0, 0);
        return temp[1];
    }
    return null;
}


/**
 * format ucmdb string_list field value
 *
 * If try to map a UCMDB string_list into SM array field, add line in UCMDB Webservice Rad Expressions
 * e.g.
 * $L.void=jscall("discoveryEvent.formatUcmdbStringList", $L.file, "addlMacAddress")
 *
 * @param {SCFile} record
 * @param {String} field
 */
function formatUcmdbStringList(record, field) {
    if (!record || !funcs.exists(field, record)) {
        return;
    }

    var value = record[field];

    if (!value || funcs.type(value) != lib.DataTypeConst.typeArray() || !value[0]) {
        return;
    }

    // convert array first element into array 
    record[field] = stringList2Array(value[0]);
}


/**
 * convert string_list value into array
 *
 * @param {String} stringList
 *          format is "<Values><Value>aaa</Value><Value>bbb</Value></Values>"
 * @returns {Array}
 */
function stringList2Array(stringList) {
    if (!stringList) {
        return [];
    }

    var reg = /^\s*<Values>(.+)<\/Values>\s*$/;
    var match = stringList.match(reg);

    if (!match || !match[1]) {
        return [stringList];
    }

    var result = [];

    // <Value>aaa</Value><Value>bbb</Value>
    var values = match[1];

    values.replace(/<Value>([^<]+)<\/Value>/g, function(match, p1) {
        if (p1) {
            result.push(p1.trim());
        }
    });

    // [aaa, bbb]
    return result;
}