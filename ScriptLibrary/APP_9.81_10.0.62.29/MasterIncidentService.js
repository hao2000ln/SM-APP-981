var $ = lib.c.$;
var _ = lib.Underscore.require();
var pendingStatus = "Pending Parent Incident";

function incidentMatchingStart() {

	var queryAppendix = ' and master.incident=true and flag=true';
	var queryDescAppendix = funcs.scmsg("27", "incMatch");
	
	//update matching option lists, keep incident info only.
	//append query filter to original queries
	
	var optVals      = vars.$match_opt_vals; 	   
	var optDisps	 = vars.$match_opt_disps;  
	var optQuerys    = vars.$im_queries;     
	var optQueryDesc = vars.$im_queries_desc;
	var optTable     = vars.$table_to_match; 

	var newOptVals 	    = $.createSCArray();
	var newOptDisps	    = $.createSCArray();
	var newOptQuerys    = $.createSCArray();
	var newOptQueryDesc = $.createSCArray();
	var newOptTable     = $.createSCArray();

	var i;
	for (i = funcs.lng(optTable) - 1; i >= 0; i--) {
		if (optTable[i] == "probsummary") {

			newOptVals.push(optVals[i]);
			newOptDisps.push(optDisps[i]);
			newOptQuerys.push(optQuerys[i] + queryAppendix);
			newOptQueryDesc.push(optQueryDesc[i]+queryDescAppendix);
			newOptTable.push(optTable[i]);
		}
	}

	vars.$match_opt_vals = newOptVals;
	vars.$match_opt_disps = newOptDisps;
	vars.$im_queries = newOptQuerys;    
	vars.$im_queries_desc = newOptQueryDesc;
	vars.$table_to_match = newOptTable;
}


function synParentRecord(record){
	// proceed Master Incident
	var defaultStatus = lib.settings.getSettingValue("Incident", "im.master2child.default.status"); // status glolabllists
	if (record.master_incident == true){
		record.parent_incident = null;
		//Set status to configured when current incident change from parent to child.
		if (defaultStatus != null && defaultStatus != "" && record.problem_status==pendingStatus)
		{
			record.problem_status=defaultStatus;
		}
	}
}
 /**
 * This function is reseting the status of child incident record.
 * <br>
 * History:<br>
 * 20140227 - <Zhichao Fei>  Add the function
 *
 * @date	20140227
 *  @param {record} - Current Incident Record file.
 *
 */

function resetChildRecordStatus(record){
	var relationModel = lib.settings.getSettingValue("Incident", "master.relation.model"); 
	var status = record['problem.status'];
	
	//Only close parent incident record and relation Model is independent, then we can execute below logic
	if (record['master.incident']==true && status == "Resolved" && relationModel=='independent'){
	    var defaultStatus = lib.settings.getSettingValue("Incident", "im.master2child.default.status");
        var childrenlist = $("probsummary").select('parent.incident="'+record.number+'" and flag = true').list();
        var i, length = funcs.lng(childrenlist);
        for (i = 0; i< length; i++){
            if (defaultStatus != null){
                childrenlist[i].problem_status = defaultStatus;
            }
            childrenlist[i].doSave();
        }
	}
}

function linkToMaster(record, matchRecord){
	//fill parent.incident field of child incident
	record["parent.incident"] = matchRecord.number;
	record["problem.status"] = pendingStatus;
	record["prob.mgmt.candidate"]= false;
	record["master.incident"] = null;
}

function isMasterIncident(id)
{
	var query = "number=\"" + id + "\"";
    var im= new SCFile("probsummary", SCFILE_READONLY);
    var fields = ["master.incident"];
    var rc = im.doSelect(query);
    if (rc == RC_SUCCESS) {
        return im["master.incident"];
    }
    return false;
 
}
 
function hasChildRecord(incident){
	var child = $("probsummary", SCFILE_READONLY).setFields(["number"]).select('parent.incident="'+incident.number+'"').uniqueResult();
	if (child) { return true; }
	else { return false;	}
}

function isChildRecord(incident){
	if (incident.parent_incident != null) {return true;}
	else {return false;}
}

/**
 *
 *  This function to copy fields defined in link from Master Incident to Child Incident
 *
 *  @date 6/5/2014
 *  @author Gary
 *  @param   {Object}     - incident record
 *  @returns {Object} 	  - child incident record
 *
 */
function copyLinkToChild(child, parent){
	var linkname = lib.settings.getSettingValue("Incident", "post.back.link.child"); // independent, cascade
	
	var rteNames = new SCDatum();
	rteNames.push("file");
	rteNames.push("record");
	rteNames.push("name");

	var rteValues = new SCDatum();
	rteValues.push(child);
	rteValues.push(parent);
	rteValues.push(linkname);

	// call rad "move.fields.by.link" to copy fields from parent incident to child
	funcs.rtecall("callrad", new SCDatum(), "move.fields.by.link",	rteNames, rteValues, false);
	
	return child;
}

/**
 *
 *  This function to sync related fields from parent incident to child incident
 *
 *  @date 5/25/2014
 *  @author Gary
 *  @param   {Object}    record    - master incident record
 *
 */
function syncParentFieldstoChild(record){
	// var relationModel = lib.settings.getSettingValue("Incident", "master.relation.model"); // independent, cascade
	// Find the screlation which the child's flag is true
	var childrenlist = $("probsummary").select('parent.incident="'+record.number+'" and flag = true').list();
	
	var i, length = funcs.lng(childrenlist);
    for (i = 0; i<length; i++){
        if (childrenlist[i] && record.flag == true){
        	childrenlist[i] = copyLinkToChild(childrenlist[i], record);
            childrenlist[i].doUpdate();
        }
    }
}

/**
 *
 *  This function to find all the child incidents owner for a master incident
 *
 *  @date 5/25/2014
 *  @author Gary
 *  @param   {Object}    record    - master incident record
 *
 */
function getChildrenOwner(record){
	// Find the screlation which the child's flag is true
	var recipients = [];
	var childrenlist = $("probsummary", SCFILE_READONLY).setFields(["assignee.name"]).select('parent.incident="'+record.number+'" and flag = true').list();
	var i, length = funcs.lng(childrenlist);
	for (i = 0; i<length; i++){
		recipients.push(childrenlist[i].assignee_name);
	}
	return recipients;
}



/**
 *
 *  This function to populate child incident list in the initial ruleset
 *
 *  @date 5/25/2014
 *  @author Ryan
 *  @param   {Number}    id    - number of master incident
 *  @returns {String} 	0		- Success
 *
 */

function populateChildInfo(id) {

	//initialize vars for pagination
	vars.$pagination_curPage = 0;
	vars.$pagination_totalPages = 0;
	vars.$pagination_itemsPerPage = 50;
	vars.$pagination_stepward = "next";
	vars.$pagination_curPageStr = "";

	vars.$childIncTotal = -1;
	vars.$childIncId = new SCDatum([]);
	vars.$childIncAffectService = new SCDatum([]);
	vars.$childIncAffectedCI = new SCDatum([]);
	vars.$childIncStatus = new SCDatum([]);
	vars.$childIncTitle = new SCDatum([]);

	vars.$child_records_per_page = new SCDatum([20,50,100,200]);

	var query = 'parent.incident=\"' + id + '\"';
	var children = new SCFile("probsummary", SCFILE_READONLY);
	var fields = ["number", "affected.item", "logical.name", "problem.status", "brief.description"];
	children.setFields(fields);
	vars.$childIncTotal = children.doCount(query);
	vars.$childCaption=funcs.scmsg("total","masterIncident",[vars.$childIncTotal]);
	vars.$pagination_totalPages = vars.$childIncTotal;

	if (vars.$childIncTotal > 0) {

		var rc = children.doSelect(query);
		while (rc == RC_SUCCESS) {

			vars.$childIncId.push(children.number);
			vars.$childIncAffectService.push(lib.DisplayName.getDisplayNameByLogicalName(children.affected_item));
			vars.$childIncAffectedCI.push(lib.DisplayName.getDisplayNameByLogicalName(children.logical_name));
			vars.$childIncStatus.push(children.problem_status);
			vars.$childIncTitle.push(children.brief_description);

			rc = children.getNext();
		}

	}

	generatePaginatedChildList();
}


/**
 *
 *  This function to maintain the pagenation of child incidents list
 *
 *  @date 5/25/2014
 *  @author Ryan
 *  @returns {String} 	0		- Succuss
 *
 */
function generatePaginatedChildList() {
	vars.$childIncId_copy = new SCDatum([]);
	vars.$childIncAffectService_copy = new SCDatum([]);
	vars.$childIncAffectedCI_copy = new SCDatum([]);
	vars.$childIncStatus_copy = new SCDatum([]);
	vars.$childIncTitle_copy = new SCDatum([]);
	lib.pagination.paginate("$pagination.stepward", "$pagination.curPage", "$pagination.itemsPerPage", "$pagination.totalPages", "$childIncId", "$childIncAffectService", "$childIncAffectedCI", "$childIncStatus", "$childIncTitle");

	vars.$pagination_curPageStr = " / " + vars.$pagination_totalPages;
	vars.$pagination_prev_enabled = (vars.$pagination_curPage > 1);
	vars.$pagination_next_enabled = (vars.$pagination_curPage < vars.$pagination_totalPages);
}

/**
 *
 *  This function is to remove parent record field of all child incidents.
 *
 *  @date 5/25/2014
 *  @author Ryan
 *  @param {SC File} 	record		- the master incident
 *
 */
function unrelateAll(record){

	var query = 'parent.incident="' + record.number +'"';

	$("probsummary").select(query).iterate(function(record){
		record.parent_incident = null;
		record.doSave();
	});
}


/**
 * This function is to remove parent record field of selected child incidents.
 * @param  {String} masterId number of master incident
 * @param  {String} childId  number of child incident
 * @return {[type]}          [description]
 */
function unrelateChild(masterId, childId){
	var query = 'number="' + childId + '"';
	var child = $("probsummary").select(query).uniqueResult();
	
	if (child) {
    	var rteNames = new SCDatum();
    	rteNames.push("file");
    	rteNames.push("second.file");
    	rteNames.push("name");

    	var rteValues = new SCDatum();
    	rteValues.push(child);
    	rteValues.push(child);
    	rteValues.push("im.schedule.unlinkAllChild");

    	funcs.rtecall("callrad", new SCDatum(), "Ruleset.run", rteNames, rteValues, false);
	}
}