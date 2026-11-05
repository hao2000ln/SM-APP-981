var log = new lib.ScAPI_Logger.log('PortalNotification');
var $ = lib.c.$;
var isPDEnabled=lib.ProcessDesignerEnablement.isPDEnabled;
var DEBUG = false;
var _null = funcs._null;
var _filename = funcs.filename;
var lng = system.functions.lng;
var ArrayUtil = lib.ArrayUtil;

var expiredDays = 7; //When notification records are more than 7 days old, they will be cleaned.
var enablePortalNotification = false; //A flag to identify if Portal Notification enabled
var Approval_Source_Meta = {
  "svcCartItem": {
    "idField": "cartItemId",
    "titleField": "item.description",
    "delegateModule": "SVC"
  },
  "incidents": {
    "idField": "incident.id",
    "titleField": "title",
    "delegateModule": "SVC"
  },
  "request": {
    "idField": "number",
    "titleField": "brief.description",
    "delegateModule": "Request"
  }
}
/**Convert data to PortalNotification table
*  Entry for object triggers to trigger data to PortalNotification
*/
function convertToPortalNotification(idFieldName, recordBefore, recordAfter) {
    var info = lib.GatewayAPI_Util.getSystemInfo();
    if (info['sm.portal']=="SMSP" && enablePortalNotification){//Notification records will be triggered only when portal is new portal
      
        var entityBefore = recordBefore;
        var entityAfter = recordAfter;
        //Interaction notification
        if (_filename(entityAfter)==="incidents" && entityBefore['open'] !== entityAfter['open']){
        
            //Interaction Pending fulfillment notification
            if (entityAfter['open']=="Dispatched" || entityAfter['open']=="In Progress"){
                insertPortalNotification(_filename(entityAfter), "PENDING_FULFILLMENT", entityAfter[idFieldName], entityAfter['title'], entityAfter['open'], getSDReceipient(entityAfter));
            }
            //Interaction Resolved notification
            else if (entityAfter['open']=="Resolved"){
                insertPortalNotification(_filename(entityAfter), "REQUEST_RESOLVED", entityAfter[idFieldName], entityAfter['title'], entityAfter['open'], getSDReceipient(entityAfter));
            }
        }
        //Approval notification, currently only interaction and change are supported
        else if (_filename(entityAfter) === "Approval" && entityAfter['approval.status'] === "pending" && entityAfter['approvals.record'] === true && Approval_Source_Meta[entityAfter['file.name']]) {
            var entityId = "";
            var entityTitle = "";
            //entityId=entityAfter['unique.key'] + splitCharset + entityAfter['file.name']+ splitCharset + entityAfter['name'];
            entityId = entityAfter['unique.key'];
            //Item level approval, need retrieve related sd id
            var sourceMeta = Approval_Source_Meta[entityAfter['file.name']];
            var source = $(entityAfter['file.name'], SCFILE_READONLY).select(sourceMeta.idField + "=\"" + entityAfter['unique.key'] + "\"").uniqueResult();
            if (source !== null) {
                entityTitle = source[sourceMeta.titleField];
            }
            insertPortalNotification(_filename(entityAfter), "PENDING_APPROVAL", entityId, entityTitle, entityAfter['approval.status'], getApprovers(entityAfter['current.pending.groups'], entityAfter['file.name']));
        }
        //Hot news notification
        else if (_filename(entityAfter)==="kmdocument"){
            //To-do: here need add addtional valiation for hotnews-->valid from and valid to, not only the entityAfter['hotnews']==true
            if(entityAfter['hotnews']==true){
                if (record['current.phase']=="internal" || record['current.phase']=="external"){
                    insertPortalNotification(_filename(entityAfter), "HOT_NEWS", entityAfter[idFieldName], entityAfter['title'],"", getHotNewsViewers(record));
                }
            }
        }
    }
    
}

/** Create new PortalNotification entry */
function insertPortalNotification(entityType, notificationType, entityId, entityTitle, status, receipients) {

    var fPortalNotification = new SCFile("PortalNotification");
    fPortalNotification.id = queryNextSeqNumber("PortalNotification");
    fPortalNotification.entityType = entityType;
    fPortalNotification.notificationType = notificationType;
    fPortalNotification.entityId = ""+entityId;
    fPortalNotification.entityTitle = ""+entityTitle;
    fPortalNotification.status = status;
    fPortalNotification.updatedOn = new Date();
    fPortalNotification.processed = false;
    fPortalNotification.retriedTimes = 0;
    if (receipients !== undefined && !_null(receipients)){
        fPortalNotification.receipients = receipients;
    
        if (DEBUG) {
            log.info("insert into PortalNotification: (" + fPortalNotification.id + ", " + entityType + ", "+ notificationType + ", " + entityId + ", " + status + ", " + receipients + ")");
        }
    
        var sql="entityId = \"" + entityId + "\" and status = \"" + status + "\"";
    
        if (fPortalNotification.doSelect(sql)!== RC_SUCCESS){
    	    var rc = fPortalNotification.doInsert();
    	    if (rc != RC_SUCCESS) {
        	    throw "Failed to insert (" + entityType + "," + entityId + ", "+ notificationType + ","  + status + "," + status + "," + ") into PortalNotification" + ", rc=" + RCtoString(rc);
    	    }
        }
    }

}

/** Get next number from sequence */
function queryNextSeqNumber(seqName) {
    var newId = new Datum();
    var rc = new Datum();
    funcs.rtecall("getnumber", rc, newId, seqName);
    rc = funcs.val(rc);
    if (rc == 0) {
        return newId.getText();
    } else {
        throw "Failed to query next sequence number from " + seqName + ", rc=" + RCtoString(rc);
    }
}
function getSDReceipient(interaction){
    var receipients=[];
    receipients.push(interaction['opened.by']);
    var receipient1 = getOpeartorByContact(interaction['callback.contact']);
    var receipient2 = getOpeartorByContact(interaction['contact.name']);
    if(!_null(receipient1)){
        if (!ArrayUtil.contains(receipients, receipient1)){
            receipients.push(receipient1);
        }
    }
    if(!_null(receipient2)){
        if (!ArrayUtil.contains(receipients, receipient2)){
            receipients.push(receipient2);
        }
    }
    
    return receipients;
}
function getOpeartorByContact(contactName){
    var operator = $("operator", SCFILE_READONLY).select("contact.name=\"" + contactName+ "\"").uniqueResult();
    if (operator !== null){
        return operator['name'];
    }
    return null;
}
function getApprovers(approverEntity, approvalType) {
    var approvers = [];
    for (i = 0; i < lng(approverEntity); i++) {
        if (approverEntity[i] === "falcon") {
            if (!ArrayUtil.contains(approvers, approverEntity[i])) {
                approvers.push(approverEntity[i]);
            }
            //check if there is approval delegation
            ArrayUtil.addAllWithoutDuplicate(approvers, getDelegatedApprovers(approverEntity[i], approvalType));
        }
        //check if pending on group
        else {
            var assignment = $("assignment", SCFILE_READONLY).select("name=\"" + approverEntity[i] + "\"").uniqueResult();
            //approval is pending on group
            if (assignment !== null) {
                //check if there is approval delegation
                ArrayUtil.addAllWithoutDuplicate(approvers, assignment.approvers);
                ArrayUtil.addAllWithoutDuplicate(approvers, getDelegatedApprovers(approverEntity[i], approvalType));
            }
            //approval is pending on operator
            else {
                if (!ArrayUtil.contains(approvers, approverEntity[i])) {
                    approvers.push(approverEntity[i]);
                }
            }
        }
    }
    return approvers;
}
function getDelegatedApprovers(appGroup, approvalType) {
    var delegatedApprovers = [];
    var sourceMeta = Approval_Source_Meta[approvalType];
    var appModule = sourceMeta.delegateModule;
    var date = system.functions.str(system.functions.tod());
    //var date = system.functions.str(system.functions.date(system.functions.tod()));		  
    var delegateSql = "Enable=true and AppGroup=\"" + appGroup + "\" and ( AppModule=\"all\" or AppModule=\"" + appModule + "\") and DateFrom <='" + date + "' and DateTo >'" + date + "'";
    var delegate = new SCFile("ApprovalDelegation", SCFILE_READONLY);
    if (delegate.doSelect(delegateSql) == RC_SUCCESS) {
        do {
            if (!ArrayUtil.contains(delegatedApprovers, delegate['Delegate'])) {
                delegatedApprovers.push(delegate['Delegate']);
            }
        } while (delegate.getNext() == RC_SUCCESS)
    }
    return delegatedApprovers;
}

function getHotNewsViewers(record){
    var viewers=[];
    var allKMGroups=[];
    var viewAccessType = record['current.phase'];
    var categoryIds=[];
    for(var i=0;i<lng(record['categories']);i++){
        ArrayUtil.addAllWithoutDuplicate(categoryIds,record['categories'][i].split(":"));
    }
    allKMGroups=getKMGroupsByKMCategories(categoryIds, viewAccessType);
    var kmgroup = new SCFile ("kmgroup", SCFILE_READONLY);
    kmgroup.setFields('operators');
    var query = "";
    for (var j=0;j<lng(allKMGroups);j++){
        query = "id=\"" + allKMGroups[j] + "\"";
        if(kmgroup.doSelect(query) === RC_SUCCESS){
            ArrayUtil.addAllWithoutDuplicate(viewers,kmgroup['operators'].toArray());
        }
    }

    return viewers;
}

function getKMGroupsByKMCategories(categoryIds, viewAccessType){
    var allGroups=[];
    for (var i=0;i<lng(categoryIds);i++){
        ArrayUtil.addAllWithoutDuplicate(allGroups, getKMGroupsByKMCategory(categoryIds[i], viewAccessType));
    }
    return allGroups;
}


function getKMGroupsByKMCategory(categoryId, viewAccessType){
    var groups = [];
    var query = "id=\"" + categoryId + "\"";
    var kmcategory = new SCFile("kmcategory", SCFILE_READONLY);
    kmcategory.setFields(['permission']);
    if (kmcategory.doSelect(query) === RC_SUCCESS) {
        for (var i=0;i<lng(kmcategory['permission']);i++) {
            if (KMProfileHasViewAccess (kmcategory['permission'][i]['kmprofile'], viewAccessType) && !ArrayUtil.contains(groups, kmcategory['permission'][i]['kmgroup'])){
                groups.push(kmcategory['permission'][i]['kmgroup']);
            }
        }
    }
    return groups;
}

function KMProfileHasViewAccess (profileId, viewAccessType){
    var query = "id=\"" + profileId + "\"";
    var kmprofile = new SCFile("kmprofile", SCFILE_READONLY); 
    kmprofile.setFields(['view.int.ext','view.ext']);
    if (kmprofile.doSelect(query) === RC_SUCCESS){
        if (viewAccessType=="internal" && kmprofile['view.int.ext']){
            return true;
        }
        else if (viewAccessType=="external" && kmprofile['view.ext']){
            return true;
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
}
function cleanUpOldNotifications (){
    var today = new Date();
    var nowYear = system.functions.year(today);
    var nowMonth = system.functions.month(today);
    var nowDay = system.functions.day(today);
    var fPortalNotification = new SCFile("PortalNotification");
    var sql=true;
    if (fPortalNotification.doSelect(sql) == RC_SUCCESS){
        do{
    	    var updatedOnYear = system.functions.year(fPortalNotification.updatedOn);
    	    var updatedOnMonth = system.functions.month(fPortalNotification.updatedOn);
    	    var updatedOnDay = system.functions.day(fPortalNotification.updatedOn);
    	
    	    if ((nowYear - updatedOnYear)>0 || (nowMonth - updatedOnMonth)>0 || (nowDay - updatedOnDay)>=expiredDays){
    	        fPortalNotification.doDelete();
    	    }
    	
        }while (fPortalNotification.getNext() == RC_SUCCESS)
    }
}