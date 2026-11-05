var logger = getLog("ddmEventForCiRelationship");

/** This function is called to populate an unplanned change for relationship that is to be opened by the DDM
*    setup default value for unplanned change if you like
*/
function createUnplannedChange(dmeRelationship, ddmRule) {
    
    //,relationshipName, upstream, subtype, olddownstr, downstream, ci, action
    var result = false;
    var change = new SCFile("cm3r");
    change.category = "Unplanned Change";
    var reason = funcs.scmsg(5, "ddmRule");
    change.reason = reason;
    change.initial_impact = "3";
    change.severity = "3";
    change.coordinator = "Change.Coordinator";
    change.requested_by = "discovery";
    change.status = "initial";
    change.approval_status = "pending";
    change.logical_name = dmeRelationship.upstream;
    change.affected_item = dmeRelationship.upstream;
    change.assets[0] = dmeRelationship.upstream;
    var desc = funcs.scmsg(12, "ddmRule", [dmeRelationship.upstream]);

    if (dmeRelationship.action == "add") {
        desc = funcs.scmsg(11, "ddmRule", [dmeRelationship.upstream]);
    } else if (dmeRelationship.action == "delete") {
        desc = funcs.scmsg(13, "ddmRule", [dmeRelationship.upstream]);
    }
    change.description[0] = desc;
    change.brief_description = desc;
    
    try {
        //add ddm customization
        eval(ddmRule.changeExpressions);
    } catch (e) {
        logger.error("createUnplannedChange", e.message);
    }
     
    var rc = change.doAction("add");
    if (rc == RC_SUCCESS) {
        result = logToDME(dmeRelationship, true, change.number, "cm3r");
    }
    
    return result;
}

/** This function is called to populate an incident for relationship that is to be opened by the DDM
*    setup default value for incident if you like
*/
function createIncident(dmeRelationship, ddmRule) {

    //,relationshipName, upstream, subtype, olddownstr, downstream, ci, action
    var result = false;
    var incident = new SCFile("probsummary");
    incident.category = "incident";
    incident.subcategory = "hardware";
    incident.product_type = "missing or stolen";
    incident.assignment = "Hardware";
    incident.initial_impact = "3";
    incident.severity = "3";    
    incident.site_category = "C";
    incident.contact_name = "ANALYST, INCIDENT";
    incident.affected_item = "MyDevices";
    incident.logical_name  = dmeRelationship.upstream;

    var desc = funcs.scmsg(12, "ddmRule", [dmeRelationship.upstream]);

    if (dmeRelationship.action == "add") {
        desc = funcs.scmsg(11, "ddmRule", [dmeRelationship.upstream]);
    } else if (dmeRelationship.action == "delete") {
        desc = funcs.scmsg(13, "ddmRule", [dmeRelationship.upstream]);
    }
    incident.action[0] = desc;
    incident.brief_description = desc;
    
    try {
        //add ddm customization
        eval(ddmRule.incidentExpressions);
    } catch (e) {
        logger.error("createIncident", e.message);
    }

    var rc = incident.doAction("add");

    if (rc == RC_SUCCESS) {
        result = logToDME(dmeRelationship, true, incident.number, "probsummary");
    }
    return result;
}

/**
 * update ci relationship with ddm process
 * @param cirelationship
 * @param soapaction
 * @returns {Boolean}
 */
function processRelationship(cirelationship, soapaction, ddmRule) {

    var result = false;
    //get ddm rule for relationship of the action type 
    //check the same relationship exists
    //change to function to support multi downstream ci
    var wholeDownstreamCI = [];
    
    var i;
    var length = funcs.lng(cirelationship.related_cis);
    for(i=0;i<length;i++){
        wholeDownstreamCI.push(cirelationship.related_cis[i]);
    }
    
    length = funcs.lng(wholeDownstreamCI);
    for(i=0;i<length;i++){
     
        cirelationship.related_cis=[wholeDownstreamCI[i]];   //only keep one
        
        var isExistsSameRelation = existsSameRelationship(cirelationship);

        //hard code the ucmdb relationship object to outage dependency null
        var actionType = getDdmRules_Rule(ddmRule, soapaction);
        if (null==actionType){
        	actionType = soapaction;
        }
        
        if(actionType=="addSetDep"){ //this is add dependency for cirelationship
            actionType="add";
            cirelationship.outage_dependency=true;
            cirelationship.outage_threshold=1;
        }
        var dmeRelationship = new DMERelationship(cirelationship, soapaction, "discovered");
        
        if ((isExistsSameRelation && soapaction == "add") || (!isExistsSameRelation && soapaction == "delete")) { //the result already applyed, just log it
            //rollback the relItem if it exists
           
            result = rollbackChanges(dmeRelationship);
        } else {

            if (actionType == "change" || actionType == "incident") { //create change or incident
                result = ciRelationshipEvent(dmeRelationship, actionType, ddmRule);
            } else if (actionType == "delete") { //delete and log
                dmeRelationship.active=false;
                result = deleteCiRelationshipEvent(dmeRelationship);
            } else if (actionType == "add") { //add and log 
                dmeRelationship.active=false;
                result = addCiRelationshipEvent(dmeRelationship);
            }
        }
    }
    return result;
}

/**
apply changes
mark the record as processed
if the downstream will be empty after the operation, remove the relationship
plan change will only change the planed relationship name
**/
function applyChanges(table, id) {
    
    var closeAbleStatus = "{\"discovered\", \"validated\", \"prevalidated\", \"preValidated\"}";

    var joinRelItem = new SCFile("joinDataModEventRelItem");

    var rc = joinRelItem.doSelect("linkedTableName=\"" + table + "\" and linkedRecordId=\"" + id + "\" and item.active=true and item.status isin " + closeAbleStatus);
    while (rc == RC_SUCCESS) {
        var cirelationship = new SCFile("cirelationship");
        if(joinRelItem.item_action=='add'){    //Add
            var query = "logical.name=\"" + lib.StringUtil.escapeAllStr(joinRelItem.logical_name) + "\" and relationship.name=\"" + lib.StringUtil.escapeAllStr(joinRelItem.relationship_name) + "\"";
            var ret = cirelationship.doSelect(query);
            var isUpdated = false;
            if (RC_SUCCESS==ret){
                if(joinRelItem.relationship_subtype==cirelationship.relationship_subtype){
                    applyChangesUpdateRelatedCI(cirelationship, joinRelItem);
                    isUpdated = true;
                } else {    // invalid relationship name
                    var newRelationship = new SCFile("cirelationship");
                    var query = "logical.name=\"" + lib.StringUtil.escapeAllStr(joinRelItem.logical_name) + "\" and relationship.subtype=\"" + lib.StringUtil.escapeAllStr(joinRelItem.relationship_subtype) + "\"";
                    ret = newRelationship.doSelect(query);
                    if(RC_SUCCESS==ret){
                        applyChangesUpdateRelatedCI(newRelationship, joinRelItem);
                        isUpdated = true;
                    } 
                }
            }
            
            if(!isUpdated){
                applyChangesCreateRelatedCI(cirelationship, joinRelItem);
            }
        } else {    // Delete 
            var query = 'logical.name="' + lib.StringUtil.escapeAllStr(joinRelItem.logical_name) 
                + '" and relationship.subtype="' + lib.StringUtil.escapeAllStr(joinRelItem.relationship_subtype) 
                + '" and relationship.name="'    + lib.StringUtil.escapeAllStr(joinRelItem.relationship_name) + '"';
            var ret = cirelationship.doSelect(query);
            while(ret==RC_SUCCESS){
                applyChangesUpdateRelatedCI(cirelationship, joinRelItem);
                ret = cirelationship.getNext();
            }
        }
        
        joinRelItem.item_processedDate = new Date();
        joinRelItem.item_status = "processed";
        joinRelItem.item_active = false;
        joinRelItem.active = false;
        joinRelItem.processedDate = new Date();
        joinRelItem.doUpdate();
        rc = joinRelItem.getNext();
    }
}

function applyChangesCreateRelatedCI(cirelationship, joinRelItem){

    cirelationship.logical_name = joinRelItem.logical_name;
    cirelationship.relationship_subtype = joinRelItem.relationship_subtype;
    cirelationship.relationship_name = joinRelItem.relationship_name;
    if(joinRelItem.outage_dependency!=null){
        cirelationship.outage_dependency = joinRelItem.outage_dependency;
    }
    
    if(joinRelItem.outage_threshold!=null) {
        cirelationship.outage_threshold = joinRelItem.outage_threshold;
    }
    cirelationship.related_cis = [joinRelItem.downstreamCi];
    cirelationship.relationship_type = getCIRelationshipType(joinRelItem.relationship_subtype);
    cirelationship.concatenated_name=cirelationship.logical_name+" "+ cirelationship.relationship_name;
    return RC_SUCCESS == cirelationship.doInsert();
}

function applyChangesUpdateRelatedCI(cirelationship, joinRelItem){
	var list = generateNewDownstreamCi(cirelationship.related_cis, joinRelItem.item_action, joinRelItem.downstreamCi);
	cirelationship.related_cis = list.toArray();
    
    if (funcs.lng(funcs.denull(cirelationship.related_cis)) == 0) { //remove the empty relationship
        return RC_SUCCESS == cirelationship.doDelete();
    } else {
        if(joinRelItem.outage_dependency!=null) {
            cirelationship.outage_dependency = joinRelItem.outage_dependency;
        }
        if(joinRelItem.outage_threshold!=null) {
            cirelationship.outage_threshold = joinRelItem.outage_threshold;
        }
        return RC_SUCCESS == cirelationship.doSave();
    }
}

/**
 * check whether the downstream CI has been changed
 * @param datumList1
 * @param datumList2
 * @returns {Boolean} true if the items are same after sort.
 */
function sameDownstream(datumList1, datumList2) {

    var list1 = [];
    var i;
    var iLoopTimes = datumList1.length();
    for (i = 0; i < iLoopTimes; i++) {
        if (datumList1[i] != null && datumList1[i] != "null" && datumList1[i] != "") {
            list1.push(datumList1[i]);
        }
    }
    var list2 = [];
    iLoopTimes = datumList2.length();
    for (i = 0; i < iLoopTimes; i++) {
        if (datumList2[i] != null && datumList2[i] != "null" && datumList2[i] != "") {
            list2.push(datumList2[i]);
        }
    }
    list1 = list1.sort();
    list2 = list2.sort();
    return list1.join(",") == list2.join(",");
}

/**
 * deny the changes by admin, will create a new dataModEventRel
 * create plans for unplanned change
 * @param id
 */
function denyChanges(id, isUnplanned) {

    var joinRelItem = new SCFile("joinDataModEventRelItem");
    var relCopy=[];
    var rc = joinRelItem.doSelect(" linkedRecordId=\"" + id + "\" and item.active=true ");
    while (rc == RC_SUCCESS) {
        joinRelItem.item_processedDate = new Date();
        joinRelItem.item_status = "denied";
        joinRelItem.item_active = false;
        if(!lib.ArrayUtil.contains(relCopy,joinRelItem.id)) {
            relCopy.push(joinRelItem.id);
        }
        joinRelItem.doUpdate();
        rc = joinRelItem.getNext();
    }

    if (isUnplanned == true) {
        
        var index;
        for(index=0;index<relCopy.length;index++){
            var dataModEventId=relCopy[index];
            var dataModEventRel = new SCFile("dataModEventRel");
            var dataModEventRelNew = new SCFile("dataModEventRel");
            rc = dataModEventRel.doSelect(" id=\"" +dataModEventId+"\"");
            if(rc == RC_SUCCESS){
                funcs.fduplicate(dataModEventRelNew, dataModEventRel);
                dataModEventRelNew.id=null;
                dataModEventRelNew.processedDate = null;
                dataModEventRelNew.doInsert();
                
                //clone new dmerel and link relItem to that rel.id
                var dataModEventRelItem = new SCFile("dataModEventRelItem");
                rc = dataModEventRelItem.doSelect(" relEventId=\"" + dataModEventId + "\" and item.status=\"denied\" and item.active=false ");
                while (rc == RC_SUCCESS) {
                
                 var dataModEventRelItemNew = new SCFile("dataModEventRelItem");
                 funcs.fduplicate(dataModEventRelItemNew, dataModEventRelItem);
                 dataModEventRelItemNew.item_id=null;
                 dataModEventRelItemNew.relEventId=dataModEventRelNew.id;
                 dataModEventRelItemNew.item_processedDate = null;
                 dataModEventRelItemNew.item_status = "planned";
                 dataModEventRelItemNew.item_active = true;
                 dataModEventRelItemNew.item_action = (dataModEventRelItem.item_action == "add" ? "delete" : "add");
                 dataModEventRelItemNew.doInsert();
                
                 rc = dataModEventRelItem.getNext();
                }
            }
    
        }

    }
}


/**
 * add/remove a CI from downstream list 
 * @param currentCis the current downstream ci
 * @param action  add/delete
 * @param downstream 
 * @returns
 */
function generateNewDownstreamCi(ciList, action, downstream) {

    var j = funcs.lng(ciList);
    var i = 0;
    var found = false;
    for (i = j - 1; i >= 0; i--) {
        if (ciList[i] == downstream) {
            if (action == "delete") {
                ciList = funcs._delete(ciList, i + 1);
            } else {
                found = true;
                break;
            }
        }
    }
    if (action == "add") {
        if (!found) {
            ciList = funcs.insert(ciList, 0, 1, downstream);
        }
    }
   return ciList;
}

/**
 * define the relationship obj for store
 * @param upstream
 * @param subtype
 * @param downstream
 * @param action
 * @returns {DMERelationship}
 */
function DMERelationship(cirelationship,  _action, _status) {

    this.relationshipName = cirelationship.relationship_name;
    this.upstream = cirelationship.logical_name;
    this.subtype = cirelationship.relationship_subtype;
    this.downstream = cirelationship.related_cis[0];
    this.action = _action;
    this.status = _status;
    this.outage_dependency = cirelationship.outage_dependency;
    this.outage_threshold = cirelationship.outage_threshold ;
    this.active=true;
    this.oldDownstream = "";
    this.newDownstream = "";
 
    this.setDownList = function (_oldDownstream, _newDownstream) {
        this.oldDownstream = getDownstreamString(_oldDownstream);
        this.newDownstream = getDownstreamString(_newDownstream);
    };
    this.setOrgDownList = function (ciList) {
        this.oldDownstream = getDownstreamString(ciList);
        this.newDownstream = generateNewDownstreamStr(ciList, this.action, this.downstream);
    };

    this.getRelationshipName = function () {
        if (this.relationshipName != null) {
            return this.relationshipName;
        } else { 
            return this.subtype + "_" + this.downstream;
        }
    };
}

/**
reuse the dme record
update the existing plan dme rel item to outOfDate
Requirement 2012/6/6  using Cancelled is better than outOfDate

**/
function planToDME(dmeRelationship, changeNum){

    var result=false;
    var rel = new SCFile("dataModEventRel"); 
    var sql = "relationship.name=\""+lib.StringUtil.escapeAllStr(dmeRelationship.getRelationshipName())+"\" and logical.name=\""+lib.StringUtil.escapeAllStr(dmeRelationship.upstream)+"\" ";
    sql +=" and linkedRecordId=\""+changeNum+"\" and linkedTableName=\"cm3r\" and eventId~=NULL";
    var ret=rel.doSelect(sql);
    var existedDME= ret==RC_SUCCESS;
    if(!existedDME){
        rel = new SCFile("dataModEventRel");
        rel.logical_name = dmeRelationship.upstream;
        rel.relationship_name = dmeRelationship.getRelationshipName();
        rel.relationship_subtype = dmeRelationship.subtype;
        rel.linkedRecordId = changeNum;
        rel.linkedTableName = "cm3r";
        rel.active = true;
        var callRtn = new SCDatum();
        var num = new SCDatum();
        num.setType(2);
        funcs.rtecall("getnumber", callRtn, num, "dataModEventGroup");
        rel.eventId=num;
    }
 
    rel.oldDownstreamCis = dmeRelationship.oldDownstream;
    rel.newDownstreamCis = dmeRelationship.newDownstream;   
    rel.outage_dependency = dmeRelationship.outage_dependency == true ;
    rel.outage_threshold = dmeRelationship.outage_threshold;

    rel.status = dmeRelationship.status;
    rel.createdDate = new Date(); 
    rel.doSave();
    var addingList = [];
     
    var deletingList = [];
    filterChangeList(rel, addingList, deletingList);
    if(existedDME){
        // set related dme item to experied which is not listed in the new change list
        var relItem = new SCFile("dataModEventRelItem");
        var itemQueryWithSameDownstream = "item.active=true  and relEventId=" + rel.id;
        var itemRet = relItem.doSelect(itemQueryWithSameDownstream);
        while (itemRet == RC_SUCCESS) {
            if(!lib.ArrayUtil.contains(addingList,relItem.downstreamCi) && !lib.ArrayUtil.contains(deletingList,relItem.downstreamCi)){
                relItem.item_status = "cancelled";
                relItem.item_active = false;
                var updateRet = relItem.doUpdate(); 
            } 
            itemRet=relItem.getNext();
       }   
    }
    
    var i; 
    for (i = 0; i < addingList.length; i++) {
        dmeRelationship.downstream = addingList[i];
        dmeRelationship.action = "add";
        result = createNewRelItem(dmeRelationship, rel);
        result=true;
    }
    for (i = 0; i < deletingList.length; i++) {
        dmeRelationship.downstream = deletingList[i];
        dmeRelationship.action = "delete";
        result = createNewRelItem(dmeRelationship, rel);
        result=true;
    }
       
    return result;   
}

/**
 * save dmeRelationship, create dataModEventRel and dataModEventRelItem
 * @param dmeRelationship
 * @param delta if false will treat is as full change, default is true
 * @param changeNum if no changeNum provied, just for log purpose
 * @param keepDownList
 * @returns {Boolean}
 */
function logToDME(dmeRelationship, delta, changeNum, tableName, keepDownList) {

    if(true==keepDownList){
        
    } else {
        var ciList = _getCIList(dmeRelationship);

        dmeRelationship.setOrgDownList(ciList); //based on the orgdownlist do the delta change
    }
    
    var result = false;
    var rel = new SCFile("dataModEventRel");
    if (delta == undefined) {
        delta = true;
    }
    if (tableName == undefined) {
        tableName = "cm3r";
    }
    if (changeNum != undefined) {
        rel.linkedRecordId = changeNum;
        rel.linkedTableName = tableName;
        rel.active = true;
    }
   
    rel.logical_name = dmeRelationship.upstream;
    rel.relationship_name = dmeRelationship.getRelationshipName();
    rel.relationship_subtype = dmeRelationship.subtype;
    rel.oldDownstreamCis = dmeRelationship.oldDownstream;
    rel.newDownstreamCis = dmeRelationship.newDownstream;
    rel.outage_dependency = dmeRelationship.outage_dependency;
    rel.outage_threshold = dmeRelationship.outage_threshold;
  
    rel.status = dmeRelationship.status;
    rel.createdDate = new Date();
    var addrelret = rel.doInsert();
    
    if (addrelret == RC_SUCCESS) {
        if (delta) {
            result = createNewRelItem(dmeRelationship, rel);
        } else {
            var addingList = [];
            var deletingList = [];
            filterChangeList(rel, addingList, deletingList);
            
            var i;
            for (i = 0; i < addingList.length; i++) {
                dmeRelationship.downstream = addingList[i];
                dmeRelationship.action = "add";
                result = createNewRelItem(dmeRelationship, rel);
            }
            for (i = 0; i < deletingList.length; i++) {
                dmeRelationship.downstream = deletingList[i];
                dmeRelationship.action = "delete";
                result = createNewRelItem(dmeRelationship, rel);
            }
        }
    }

    return result;
}

/**
 * create new Rel Item with provided RelId
 * if the same change status are existing in the same change, ignore/update it
 * @param dmeRelationship
 * @param relEventId
 * @returns {Boolean}
 */
function createNewRelItem(dmeRelationship, dataModEventRel) {

    var relItem = new SCFile("dataModEventRelItem");
    var rc = relItem.doSelect("item.active=true and relEventId=" + dataModEventRel.id + " and downstreamCi=\"" + lib.StringUtil.escapeAllStr(dmeRelationship.downstream) + "\""); //add not NULL as inner join
    //if dataModEventRelItem is existed, replace it
    var needInsert = (rc != RC_SUCCESS); // no record means need insert
    while (rc == RC_SUCCESS) {
        //the same item
        if (relItem.item_action == dmeRelationship.action) {
            // if the same action record exist, do nothing.
            needInsert = needInsert || false; //only when needInsert never set to true
        } else { //update the existing one to outOfDate and create a new one
            relItem.item_status = "outOfDate";
            relItem.item_active = false;
            relItem.item_processedDate = new Date();
            relItem.doUpdate();
            needInsert = true;
        }
        rc = relItem.getNext();
    }

    if (needInsert) {
        var tmptem = new SCFile("dataModEventRelItem");
        tmptem.relEventId = dataModEventRel.id;
        tmptem.downstreamCi = dmeRelationship.downstream;
        tmptem.item_action = dmeRelationship.action;
        tmptem.item_active = dmeRelationship.active;
        tmptem.item_status = dmeRelationship.status;
        tmptem.item_createdDate = new Date();
        var addItemRet = tmptem.doInsert();
        if (addItemRet == RC_SUCCESS) {            
            return true;
        }
    } else {
        return true;
    }
    return false;
}


function _getCIList(dmeRelationship){

    var cirelationship = new SCFile("cirelationship", SCFILE_READONLY);
    cirelationship.setFields("related.cis"); 
    var query = 'logical.name="' + lib.StringUtil.escapeAllStr(dmeRelationship.upstream) 
        + '" and relationship.subtype="' + lib.StringUtil.escapeAllStr(dmeRelationship.subtype) 
        + '" and relationship.name="'+lib.StringUtil.escapeAllStr(dmeRelationship.relationshipName)+'"';

    var ret = cirelationship.doSelect(query);
    
    var ciList = [];
    var tmpMap = {};
    while(RC_SUCCESS==ret){
        var list = cirelationship.related_cis.toArray();
        var k;
        for(k=0;k<list.length;k++){
            var name = list[k];
            if(!tmpMap[name]){
                tmpMap[name] = "";
                ciList.push(name);
            }
        }
        
        ret = cirelationship.getNext();
    }
    
    return ciList;
}

/**
 * Update dataModEventRel
 * @param dataModEventRel, the object need to be updated.
 */
function updateDataModEventRel(dmeRelationship, dataModEventRel){

    var ciList = _getCIList(dmeRelationship);
    
    var relItem = new SCFile("dataModEventRelItem", SCFILE_READONLY);
    var rc = relItem.doSelect("item.active=true and relEventId=" + dataModEventRel.id ); 
    
    while(RC_SUCCESS == rc) {
        ciList = generateNewDownstreamCi(ciList, relItem.item_action, relItem.downstreamCi);
        rc = relItem.getNext();
    }
    
    var newStrCiList = getDownstreamString(ciList);

    var rel = new SCFile('dataModEventRel');
    rel.doSelect("id="+dataModEventRel.id);
    
    if (newStrCiList!=rel.newDownstreamCis) {
        rel.newDownstreamCis = newStrCiList;
        rel.doUpdate();
    }
}

/**
 * if the value proposed are same with the existing data, change the previous data as outOfDate 
 * @param dmeRelationship
 */
function rollbackChanges(dmeRelationship) {

    var joinRelItem = new SCFile("joinDataModEventRelItem");
    var query = 'logical.name="' + dmeRelationship.upstream + '" and relationship.subtype="' + dmeRelationship.subtype + '"';
    query += ' and item.active=true  and downstreamCi="' + lib.StringUtil.escapeAllStr(dmeRelationship.downstream) + '"';
    query += ' and relationship.name="' + lib.StringUtil.escapeAllStr(dmeRelationship.getRelationshipName()) + '"';
    
    var itemRet = joinRelItem.doSelect(query);
    while (itemRet == RC_SUCCESS) { //downstream already exist
        joinRelItem.item_status = "outOfDate";
        joinRelItem.item_active = false;
        joinRelItem.item_processedDate = new Date();
        var newStr = joinRelItem.newDownstreamCis;
        if (newStr == null) {
            newStr = "";
        }
        var tempCis = newStr.split(",");
        joinRelItem.newDownstreamCis = generateNewDownstreamStr(tempCis, dmeRelationship.action, dmeRelationship.downstream); //add this item to the new downstream
        var relupdate = joinRelItem.doUpdate();
        itemRet = joinRelItem.getNext();
    }
    
    return true;
}

function getChangeByDME(id){

    var dataModEventRel = new SCFile("dataModEventRel", SCFILE_READONLY);
    dataModEventRel.setFields("linkedRecordId");
    var rc = dataModEventRel.doSelect(" id=\"" + id + "\" ");
    if (rc == RC_SUCCESS) {
        return dataModEventRel.linkedRecordId;
    }
}

/**
This method is used to do the auto-status change.
Logic copied from dme.decideAction and triggered by db trigger
**/
function decideAction(id,action){

    var joinRelItem = new SCFile("joinDataModEventRelItem");
    var returnAction=action;
    var rc = joinRelItem.doSelect(" linkedRecordId=\"" + id + "\" and linkedTableName=\"cm3r\" ");
    while (rc == RC_SUCCESS) {
        if(action=="implement"){
            if(joinRelItem.item_status!="implemented") {
                returnAction="none";
            }
        } else if(action=="validate"){
            if(joinRelItem.item_status=="failedValidation" && returnAction=="validate") {
                returnAction="failValidation";
            }
            if(joinRelItem.item_status=="implemented") {
                returnAction="none";
            }
        
        } else if(action=="cancel"){
            if(joinRelItem.item_status!="cancelled") {
                returnAction="none";
            }
        }
        rc = joinRelItem.getNext();
    }
    return returnAction;
}

/**
 * the attribute change and relationship change will combine to the same unplanned change. 
 * @param dmeRelationship
 * @param eventType incident/change
 * @returns {Boolean}
 */
function ciRelationshipEvent(dmeRelationship, eventType, ddmRule) {

    var result = true;
    var hasExistingChange = false;
    var changeList = [];
    var rel = new SCFile("dataModEventRel", SCFILE_READONLY);
    rel.setFields("linkedRecordId");
    var tableName = (eventType == "incident") ? "probsummary" : "cm3r";
    //query dmeRel with same logical.name and subtype
    var query = "logical.name=\"" + lib.StringUtil.escapeAllStr(dmeRelationship.upstream) + "\" and active=true and linkedTableName=\"" + tableName + "\"";
    var selectRet = rel.doSelect(query);
    while (selectRet == RC_SUCCESS) {
        if (!lib.ArrayUtil.contains(changeList, rel.linkedRecordId)) {
            changeList.push(rel.linkedRecordId);
        }
        selectRet = rel.getNext();
    }
    var dme = new SCFile("dataModEvent", SCFILE_READONLY);
    dme.setFields("linkedRecordId");
    //query dme with same logical.name
    query = "recordId=\"" + lib.StringUtil.escapeAllStr(dmeRelationship.upstream) + "\" and active=true and linkedTableName=\"" + tableName + "\"";
    selectRet = dme.doSelect(query);
   
    while (selectRet == RC_SUCCESS) {
        if (!lib.ArrayUtil.contains(changeList, dme.linkedRecordId)) {
            changeList.push(dme.linkedRecordId);
        }
        
        selectRet = dme.getNext();
    }
    
    var id;
    for (id=0; id<changeList.length; id++) {
        
        var changeNum = changeList[id];
        var changeIncident = null;
        if (eventType == "incident") {
            changeIncident = getIncidentById(changeNum);
        } else {
            changeIncident = getChangeById(changeNum);
        }
        if (changeIncident == null || changeIncident.status == "closed") {
            continue;
        }
       
        rel = new SCFile("dataModEventRel");
        //query dmeRel with same logical.name and subtype
        query ='linkedRecordId="' + changeNum + '"' 
                +' and relationship.subtype="' + lib.StringUtil.escapeAllStr(dmeRelationship.subtype)+'"' 
                +' and active=true and linkedTableName="' + tableName + '"';
        
        selectRet = rel.doSelect(query);
        
        var itemProcessed = false;
        
        if (selectRet != RC_SUCCESS &&  changeIncident.category == "Unplanned Change" ) { //if the dmerel not exist, create it
        	itemProcessed = true;
        	result = logToDME(dmeRelationship, true, changeNum, tableName);
            hasExistingChange = true;
        }
        
        var dmeLoged = false;
        
        while (selectRet == RC_SUCCESS) {
            if (eventType == "change" && changeIncident.category != "Unplanned Change") { //update plan change, change the item status
                itemProcessed = true;
                if(updatePlanChange(dmeRelationship, rel) != -1){
                    hasExistingChange = true;                
                }
            } else { //update unplanned change, change the item status, there should be only 1 unplanned change in ususally

                hasExistingChange = true;
                
                if(rel.relationship_name!=dmeRelationship.relationshipName){
                    selectRet = rel.getNext();
                    continue;
                }
                itemProcessed = true;
                var relItem = new SCFile("dataModEventRelItem");
                var itemQueryWithSameDownstream = "item.active=true  and downstreamCi=\"" + lib.StringUtil.escapeAllStr(dmeRelationship.downstream) + "\" and relEventId=" + rel.id;
                var itemRet = relItem.doSelect(itemQueryWithSameDownstream);
                
                if (itemRet == RC_SUCCESS) { //downstream already exist
                    if (relItem.item_action != dmeRelationship.action) { //change to outOfDate and log the new one if action not same
                        relItem.item_status = "outOfDate";
                        relItem.item_active = false;
                        var updateRet = relItem.doUpdate();
                        if (updateRet == RC_SUCCESS) {
                            result = createNewRelItem(dmeRelationship, rel);
                            updateDataModEventRel(dmeRelationship, rel);
                        }
                    }else{
                    }
                }else if(!dmeLoged){ //downstream item not exit, add the new one

                    result = createNewRelItem(dmeRelationship, rel);
                    updateDataModEventRel(dmeRelationship, rel);
                    dmeLoged=true;
                }else{
                }
            }
            
            //update change title which may be mixed name
            var relItem = new SCFile("dataModEventRelItem", SCFILE_READONLY);
            relItem.setFields("item.action");
            var getAllRelItemQuery = "item.active=true   and relEventId=" + rel.id;
            var itemRet = relItem.doSelect(getAllRelItemQuery);
            var mode = [];
            while (itemRet == RC_SUCCESS) {
                if(!lib.ArrayUtil.contains(mode, relItem.item_action)) {
                    mode.push(relItem.item_action);
                }
                itemRet=relItem.getNext();
            }
            if(mode.length==2){
                var desc = funcs.scmsg(12, "ddmRule", [dmeRelationship.upstream]);
                if (eventType == "incident") {
                   changeIncident.action[0] = desc;
                } else {
                   changeIncident.description[0] = desc;
                }
                changeIncident.doAction("save");
            }
            //end update the change
        
            selectRet = rel.getNext();
        }
        
        if(!itemProcessed){
            result = logToDME(dmeRelationship, true, changeNum, tableName);
            hasExistingChange = true;
        }
    }
    if (!hasExistingChange) { //no  change related, create one
//        var cirel = new SCFile("cirelationship");
        
        if (eventType == "incident") {
            result = createIncident(dmeRelationship, ddmRule);
        } else {
            result = createUnplannedChange(dmeRelationship, ddmRule);
        }
    }

    return result;
}

function updatePlanChange(dmeRelationship, rel) {

    var relItem = new SCFile("dataModEventRelItem");
    var itemQuery = "item.active=true  and downstreamCi=\"" + lib.StringUtil.escapeAllStr(dmeRelationship.downstream) + "\" and relEventId=" + rel.id;
    var itemRet = relItem.doSelect(itemQuery);
    if (itemRet == RC_SUCCESS) {
        if (relItem.item_action != dmeRelationship.action) { //same 1-1, different action treat as failedValidation
            relItem.item_status = "failedValidation";
        } else {
            if (relItem.item_status == "planned") {
                relItem.item_status = "preValidated";
            } else if (relItem.item_status == "implemented" || relItem.item_status == "failedValidation") {
                relItem.item_status = "validated";
            }
        }
        var updateRet = relItem.doUpdate();
    }else{
        return -1;
    }
}

/**
 * organize the new downstream str with action type
 * @param dataModEventRel
 * @param action
 * @param downstream
 * @returns
 */
function generateNewDownstreamStr(tempCis, action, downstream) {

    var j = funcs.lng(tempCis);
    var i = 0;
    var found = false;
    for (i = j - 1; i >= 0; i--) {
        if (tempCis[i] == downstream) {
            if (action == "delete") {
                tempCis = funcs._delete(tempCis, i + 1);
            } else {
                found = true;
                break;
            }
        }
    }

    if (action == "add") {
        if (!found) {
            tempCis = funcs.insert(tempCis, 0, 1, downstream);
        }
    }
    return getDownstreamString(tempCis);
}

/**
 * create unplanned change and link it to dataModEventRel
 * @param relationshipName
 * @param upstream
 * @param subtype
 * @param olddownstr
 * @param downstream
 * @param ci
 * @param action
 * @returns {Boolean}
 */



/**
 * return true if the change is Unplanned change
 * @param cmnumber
 * @returns {Boolean}
 */
function getChangeById(cmnumber) {

    var cm3r = new SCFile("cm3r");
    var query = "number=\"" + cmnumber + "\" and status<>\"close\"";
    var ret = cm3r.doSelect(query);
    if (ret == RC_SUCCESS) {
        return cm3r;
    } else {
        return null;
    }
}

function getIncidentById(incident) {

    var probsummary = new SCFile("probsummary");
    var query = "number=\"" + incident + "\" and status<>\"close\"";
    var ret = probsummary.doSelect(query);
    if (ret == RC_SUCCESS) {
        return probsummary;
    } else {
        return null;
    }
}


/**
 * check if the cirelationship already same with the proposal
 * @param upstream
 * @param subtype
 * @param downstream
 * @returns Boolean the exist of downstream ci
 */
function existsSameRelationship(cirelationship) {

    var exsits = false;
    var cirel = new SCFile("cirelationship", SCFILE_READONLY);
    cirel.setFields("related.cis");

    var query = 'logical.name="' + lib.StringUtil.escapeAllStr(cirelationship.logical_name) 
        + '" and relationship.subtype="' + lib.StringUtil.escapeAllStr(cirelationship.relationship_subtype) 
        + '" and relationship.name="'+lib.StringUtil.escapeAllStr(cirelationship.relationship_name)+'"';

    
    var ret = cirel.doSelect(query);
    while (ret == RC_SUCCESS) {
        var i;
        var length = funcs.lng(cirel.related_cis);
        for (i = 0; i < length; i++) {
            if (cirelationship.related_cis[0] == cirel.related_cis[i]) {
                exsits = true;
                break;
            }
        }
        if (exsits) {
            break;
        }
        else {
            ret = cirel.getNext();
        }
    }
    
    return exsits;
}

function existsSameRelationshipName(logical_name, relationship_name, mode) {

    if (mode != "add") {
        return false;
    }
    var cirel = new SCFile("cirelationship", SCFILE_READONLY);
    cirel.setFields("logical.name");

    var query = "logical.name=\"" + lib.StringUtil.escapeAllStr(logical_name) + "\" and relationship.name=\"" + lib.StringUtil.escapeAllStr(relationship_name) + "\"";
    var ret = cirel.doSelect(query);
    return ret == RC_SUCCESS;
}

/*
 * get the detailed rule in a ddmrule queryed by a tablename rules="add" or
 * rules="update" or rules="delete" return value ="incident" or value="change"
 * or value="insert" or value="update" or value="delete"
 */
function getDdmRules_Rule(ddmRule, rules) {
    if (ddmRule != null) {
        switch (rules) {
        case "add":
                return ddmRule.insertAction;
        case "update":
                return ddmRule.updateAction;
        case "delete":
                return ddmRule.deleteAction;
        }
    } else {
        return null;
    }
}

/**
 * insert the downstream to the existing relationship or create a new relationship
 * @param dmeRelationship
 * @returns {Boolean}
 */
function addCiRelationshipEvent(dmeRelationship) {

    var result = false;
    var cirelationship = new SCFile("cirelationship");
    var query = 'logical.name="' + lib.StringUtil.escapeAllStr(dmeRelationship.upstream) 
	    + '" and relationship.subtype="' + lib.StringUtil.escapeAllStr(dmeRelationship.subtype) 
	    + '" and relationship.name="'+lib.StringUtil.escapeAllStr(dmeRelationship.relationshipName)+'"';
    
    var selRet = cirelationship.doSelect(query);
   
    if (selRet == RC_SUCCESS) {
        
        //directly update the downstream ci to existing cirelationship
        dmeRelationship.setOrgDownList(cirelationship.related_cis);
        cirelationship.related_cis = funcs.insert(cirelationship.related_cis, 0, 1, dmeRelationship.downstream);
        var updateRet = cirelationship.doUpdate();
        //log the result
        if (updateRet == RC_SUCCESS) {
            result = logToDME(dmeRelationship, true, undefined, undefined, true);
        }
    } else {
        dmeRelationship.oldDownstream = "";
        dmeRelationship.setOrgDownList(cirelationship.related_cis);
        //create new cirelationship record and save the log
        cirelationship.relationship_name = dmeRelationship.getRelationshipName();
        cirelationship.logical_name = dmeRelationship.upstream;
        cirelationship.relationship_subtype = dmeRelationship.subtype;
        cirelationship.relationship_type = getCIRelationshipType(dmeRelationship.subtype);
        cirelationship.outage_dependency = dmeRelationship.outage_dependency;
        cirelationship.outage_threshold = dmeRelationship.outage_threshold;
        cirelationship.related_cis = [dmeRelationship.downstream];
        cirelationship.concatenated_name=cirelationship.logical_name+" "+ cirelationship.relationship_name;
        var addret = cirelationship.doInsert();

        if (addret == RC_SUCCESS) {

            result = logToDME(dmeRelationship, true, undefined, undefined, true);
        }
    }
    return result;
}

// delete the relationship and delete the DataModEventRel and
// DataModEventRelItem to reflect the update history
function deleteCiRelationshipEvent(dmeRelationship) {

    var result = false;
    var find = false;
    var cirelationship = new SCFile("cirelationship");
    var oldCiList = [];
    
    var query = 'logical.name="' + lib.StringUtil.escapeAllStr(dmeRelationship.upstream) 
        + '" and relationship.subtype="' + lib.StringUtil.escapeAllStr(dmeRelationship.subtype) 
        + '" and relationship.name="'+lib.StringUtil.escapeAllStr(dmeRelationship.relationshipName)+'"';
    
    var ret = cirelationship.doSelect(query);
    //TODO there may be more than one relationship contains this downsteam
    if (ret == RC_SUCCESS) {
        //get the current downstream ci string
        oldCiList = cirelationship.related_cis;
        dmeRelationship.setOrgDownList(oldCiList);
        //find the target ci and remove it from the list
        var i;
        var length = funcs.lng(cirelationship.related_cis);
        for (i = 0; i < length; i++) {
            if (dmeRelationship.downstream == cirelationship.related_cis[i]) {
                cirelationship.related_cis= funcs._delete( cirelationship.related_cis, i+1);
                find = true;
                break;
            }
        }
        if (find) {
            var updateret =null;
            if (funcs.lng(funcs.denull(cirelationship.related_cis)) == 0) {
                cirelationship.related_cis = [dmeRelationship.downstream]; //reset the downstream CI for the trigger need use it
                updateret = cirelationship.doDelete();
            }else {
                updateret = cirelationship.doUpdate();
            }
            if (updateret == RC_SUCCESS) {
                result = logToDME(dmeRelationship, true, undefined, undefined, true);
            }
        }
    }
    return result;
}



/**
 * combine the downstream CI to str. 
 * @param downstreamCIs
 * @returns {String}
 */
function getDownstreamString(downstreamCIs) {

    var downstreamCIStr = "";
    if (typeof (downstreamCIs) == "string") {
        return downstreamCIs;
    }
    var len = funcs.lng(downstreamCIs);
    var i;
    for (i = 0; i < len; i++) {
        downstreamCIStr += downstreamCIs[i];
        if (i < len - 1) {
            downstreamCIStr += ",";
        }
    }
    return downstreamCIStr;
}


/**
 * get the relationship type based on subtype
 * @param subtype
 * @returns
 */
function getCIRelationshipType(subtype) {

    var relType = new SCFile("cirelationshiptype", SCFILE_READONLY);
    relType.setFields("relationship.type");
    var query = "relationship.subtype=\"" + lib.StringUtil.escapeAllStr(subtype) + "\"";
    var rc = relType.doSelect(query);
    if (rc == RC_SUCCESS) {
        return relType.relationship_type;
    } else {
        return null;
    }
}

function filterChangeListByItem(rel, addingList, deletingList, existingList) {

    var relItem = new SCFile("dataModEventRelItem", SCFILE_READONLY);
    var itemQueryWithSameDownstream = "item.active=true  and relEventId=" + rel.id;
    var itemRet = relItem.doSelect(itemQueryWithSameDownstream);
    while (itemRet == RC_SUCCESS) {
        if(relItem.item_action=="add") {
            addingList.push(relItem.downstreamCi);
        }
        else if(relItem.item_action=="delete") {
            deletingList.push(relItem.downstreamCi);
        }
        itemRet=relItem.getNext();
    }
        
    var oldDown = rel.oldDownstreamCis;
   
    if (oldDown == null) {
        oldDown = "";
    }
   
    var oldCis = oldDown.split(",").sort();
 
    var i;
    for (i = 0; i < oldCis.length; i++) {
        if (oldCis[i] != "null" && oldCis[i] != "") {
            if (!lib.ArrayUtil.contains(deletingList, oldCis[i]) && !lib.ArrayUtil.contains(addingList, oldCis[i])) { 
                existingList.push(oldCis[i]);
            }
        }
    }

    return true;
}

function filterChangeList(rel, addingList, deletingList) {

    var newDown = rel.newDownstreamCis;
    var oldDown = rel.oldDownstreamCis;
    if (newDown == null) {
        newDown = "";
    }
    if (oldDown == null) {
        oldDown = "";
    }
    var newCis = newDown.split(",").sort();
    var oldCis = oldDown.split(",").sort();

    var i;
    for (i = 0; i < newCis.length; i++) {
        if (!lib.ArrayUtil.contains(oldCis, newCis[i])) {
            if (!lib.ArrayUtil.contains(addingList, newCis[i]) && newCis[i] != "null" && newCis[i] != "") {
                addingList.push(newCis[i]);
            }
        }  
    }
    for (i = 0; i < oldCis.length; i++) {
        if (!lib.ArrayUtil.contains(newCis, oldCis[i])) {
            if (!lib.ArrayUtil.contains(deletingList, oldCis[i]) && oldCis[i] != "null" && oldCis[i] != "") {
                deletingList.push(oldCis[i]);
            }
        }
    }

    return true;
}


function htmlViewChanges(rel) {
    var str = "<table border=1 style='font-size:12px;>";
    str += "<tr><td colspan='2'><b>Other Downstream CIs related to this relationship</b></td></tr>";
     str += "<tr><td >Configuration Item </td><td >Action </td></tr>";
    var addingList = [];
    var existingList = [];
    var deletingList = [];

    filterChangeListByItem(rel, addingList, deletingList, existingList);
    if (addingList.length + existingList.length <= 1 && deletingList.length + existingList.length <= 1) {
        return null;
    }

    var i;
    for (i = 0; i < addingList.length; i++) {
        str += generateChangeLine(addingList[i], "plan to add", rel.downstreamCi);
    }
    for (i = 0; i < deletingList.length; i++) {
        str += generateChangeLine(deletingList[i], "plan to delete", rel.downstreamCi);
    }
    for (i = 0; i < existingList.length; i++) {
        str += generateChangeLine(existingList[i], "no change", rel.downstreamCi);
    }

    str += "</table>";
    return str;
}

function generateChangeLine(currentCi, type, highlightItem) {
    var needHighLight = highlightItem == currentCi ? "background-color:#cccccc;" : "";
    var color = "";
    if (type == "add") {
        color = "color:#222222;";
    } else if (type == "delete") {
        color = "color:#333333;";
    }
    return "<tr style='" + color + needHighLight + "'><td>" + lib.DisplayName.getDisplayNameByLogicalName(currentCi) + "</td><td>" + type + "</td></tr>\n";
}


function getPendingChanges(id) {
    return getActiveDataModEvents(vars.$L_file, true);
}

function getHistoricChanges(id) {
    return getActiveDataModEvents(vars.$L_file, false);
}

function getActiveDataModEvents(record, active) { 
	/** 
		code refacted by QCCR1E113752, low performance and out-of-memory when displaying CI records with massive relationships
	**/
	//avoid format designer error message
    if(record==null) {
        return "";
    }  
    var html;
    var strColumnWidth = "width=\"20%\"";
    var strRowClass;
    var caption;
    var fieldValue;
    var oldValue;
    var newValue;
    var change = new SCFile("cm3r", SCFILE_READONLY);
	change.setFields("planned_start planned_end");
    
    html = lib.htmlTemplates.getBasicListTemplate() + "<DIV class=\"resultTable\"><TABLE id=\"relationshipDetail_"+active+"\" name=\"relationshipDetail_"+active+"\" class=\"listTable\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\">";
    var filename = funcs.filename(record);
    var sql = " logical.name=\"" + lib.StringUtil.escapeAllStr(record.logical_name) + "\"  and item.active=" + active;
    var events = new SCFile("joinDataModEventRelItem", SCFILE_READONLY);
	events.setFields("logical_name relationship_name downstreamCi item_status item_action linkedRecordId linkedTableName item_createdDate");
    var rows = '';
    var row=0;
    if (events.doSelect(sql) == RC_SUCCESS) {
        do {
     		rows += makeRow(events,change,row);
     		row++;
        } while (events.getNext() == RC_SUCCESS);
    } 
    
    sql = " downstreamCi=\"" + lib.StringUtil.escapeAllStr(record.logical_name) + "\"  and item.active=" + active;
    
    if (events.doSelect(sql) == RC_SUCCESS) {
        do {
          rows += makeRow(events,change,row);row++;
        } while (events.getNext() == RC_SUCCESS);
    } 
    if(rows!="") {
    	html += "<TR valign=top CLASS=\"oddRow\">" + "<TD><B>" + funcs.scmsg(11, "dataModEvent") + "</TD>" + "<TD><B>" + funcs.scmsg(12, "dataModEvent") + "</TD>" + "<TD><B>" + funcs.scmsg(13, "dataModEvent") + "</TD>" + "<TD><B>" + funcs.scmsg(15, "dataModEvent") + "</TD>" + "<TD><B>" + funcs.scmsg(14, "dataModEvent") + "</TD>" + "<TD><B>" + funcs.scmsg(5, "dataModEvent") + "</TD>" + "<TD><B>" + funcs.scmsg(6, "dataModEvent") + "</TD>" + "<TD><B>" + funcs.scmsg(7, "dataModEvent") + "</TD>" + "</TR>";
    	html += rows;
    }
    html += "</TABLE>";
    return html;
}

function makeRow(events,change,row) {
	var html = '';
    var strRowClass = row % 2 == 0 ? "evenRow" : "oddRow";
    html += "<TR valign=top CLASS=\"" + strRowClass + "\">";
    html += "<TD " + "width=\"20%\"" + " >" + events.logical_name + " </TD>";

    html += "<TD>" + events.relationship_name + "</TD>";
    html += "<TD>" + events.downstreamCi + "</TD>";
    html += "<TD>" + events.item_action + "</TD>";
    html += "<TD>" + events.item_status + "</TD>";
    var linkRecordStr = "";
    if (events.linkedRecordId != null) {
        linkRecordStr = '<a href="sclink://' + events.linkedTableName + ':number=&quot;' + events.linkedRecordId + '&quot;">' + events.linkedRecordId;
    }
    html += '<TD>' + linkRecordStr + '</TD>';

    if(events.linkedRecordId!=null){
        var csql = "number=\"" + events.linkedRecordId + "\"";
        if (change.doSelect(csql) == RC_SUCCESS) {
            if (change.planned_start != null) {
                html += "<TD>" + funcs.str(change.planned_start) + "</TD>";
            } else {
                html += "<TD></TD>";
            }
            if (change.planned_end != null) {

                html += "<TD>" + funcs.str(change.planned_end) + "</TD>";
            } else {
                html += "<TD></TD>";
            }
        } else {
            html += "</TD></TD>";
        }
    }else{
        html += "<TD></TD><TD>"+funcs.str(events.item_createdDate)+"</TD>";
    }
    html += "</TR>";
    return html;
}
var j = lib.JSON2.toJSON;
