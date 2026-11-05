var $ = lib.c.$;
var _contains = lib.ArrayUtil.contains;
var STATUS_SYNC_RELATION_ESCALATION = lib.StatusSyncServiceConfig.getStusSyncRelation(false);
var STATUS_SYNC_RELATION_ESCALATION_STR = funcs.str(STATUS_SYNC_RELATION_ESCALATION);
var STATUS_MAPS_ESCALATION = lib.StatusSyncServiceConfig.getStusSyncMap(false);

var STATUS_SYNC_RELATION_STREAMLINED = lib.StatusSyncServiceConfig.getStusSyncRelation(true);
var STATUS_SYNC_RELATION_STREAMLINED_STR = funcs.str(STATUS_SYNC_RELATION_STREAMLINED);
var STATUS_MAPS_STREAMLINED = lib.StatusSyncServiceConfig.getStusSyncMap(true);

var STATUS_SYNC_RELATION = STATUS_SYNC_RELATION_STREAMLINED.concat(STATUS_SYNC_RELATION_ESCALATION);
var STATUS_SYNC_RELATION_STR = funcs.str(STATUS_SYNC_RELATION);

var StatusSyncService = $({
    /**
     *  This function is get the target sync status of interaction based on its Escalation.
     *
     *  @param {interaction} object- The interaction record
     *  @return {string}  -  The target sync status.
     */
    getSyncStatus: function(interaction, syncFiledsInfo) {

        var mappedStatus = null;
        var mappedStatusPriority = -1;
        var theStatusMap = STATUS_MAPS_STREAMLINED;
        var mappedStatuses = [];

        var rels = $("screlation").select("type isin " + STATUS_SYNC_RELATION_STR + " and source=\"" + interaction.incident_id + "\"").list();
        var i;
        for (i = 0; i < rels.length; ++i) {
            var rel = rels[i];
            if (_contains(STATUS_SYNC_RELATION_ESCALATION, rel.type)) {
                theStatusMap = STATUS_MAPS_ESCALATION;
            }
            var filename = rel.depend_filename == "problem" ? "probsummary" : rel.depend_filename;
            if (theStatusMap[filename]) {
                var idField = theStatusMap[filename].idField;
                idField = idField ? idField : "number";
                var escalation = $(filename).select(idField + "=\"" + rel.depend + "\"").uniqueResult();
                if (escalation) {
                    var sourceStatus = escalation[theStatusMap[filename].statusField];
                    if (!_contains(theStatusMap[filename].ignoreStatus, sourceStatus)) {
                        var statusMapEntry = theStatusMap[filename].statusMap[sourceStatus];
                        if (statusMapEntry && statusMapEntry.currentStatus && !_contains(statusMapEntry.currentStatus, interaction.open)) {
                        	statusMapEntry = null;
                        }
                        statusMapEntry = statusMapEntry ? statusMapEntry : theStatusMap[filename].defaultStatus;
                        if (statusMapEntry) {
	                        if ((statusMapEntry.priority !== undefined && statusMapEntry.priority < mappedStatusPriority) || mappedStatusPriority == -1) {
	                            mappedStatus = statusMapEntry.targetStatus;
	                            if (mappedStatus == "Pending Customer") {
	                            	if (statusMapEntry.syncFields === undefined) {
	                            	    statusMapEntry.syncFields = [];
	                            	}
                            		syncFiledsInfo.syncFields = [statusMapEntry.syncFields];
	                                syncFiledsInfo.source = [escalation];
	                                syncFiledsInfo.idField = [idField];
	                            	break;
	                            }
	                            else {
		                            if (!_contains(mappedStatuses, mappedStatus)) {
		                                mappedStatuses.push(mappedStatus);
		                            }
		                            
		                            mappedStatusPriority = statusMapEntry.priority ? statusMapEntry.priority : mappedStatusPriority;
		                            if (syncFiledsInfo && statusMapEntry.syncFields) {
		                                syncFiledsInfo.syncFields.push(statusMapEntry.syncFields);
		                                syncFiledsInfo.source.push(escalation);
		                                syncFiledsInfo.idField.push(idField);
		                            }
		                        }
	                        }
	                    }
                    }
                }
            }
        }
        if (mappedStatus !== "Pending Customer" && mappedStatuses.length > 1) {
        	mappedStatus = null;
        	if (_contains(mappedStatuses, "Dispatched")) {
        		mappedStatus = "Dispatched";
        		syncFiledsInfo.syncFields = [[]];
        	}
        }

        return mappedStatus;
    },
    /**
     *  This function is check whether interaction need status sync based on its Escalation.
     *
     *  @param {interaction} object- The interaction record
     *  @return {boolean}  -  Whether interaction need status sync.
     */
    needSyncStatus: function(interaction) {
        var status = this.getSyncStatus(interaction);
        if (status && status != interaction.open) {
            return true;
        }
        return false;
    },
    /**
     *  This function is set the sync status based on its Escalation.
     *
     *  @param {interaction} object- The interaction record
     *  @return {boolean}  -  Whether interaction status changed.
     */
    setSyncStatus: function(interaction) {
        if (this.ignoreStatusSync(interaction)) {
            return false;
        }
        if (interaction.active) {
            var syncFieldsInfo = {
                syncFields: [],
                source: [],
                idField: []
            };
            var status = this.getSyncStatus(interaction, syncFieldsInfo);
            if (status && status != interaction.open) {
                interaction.open = status;
                if (syncFieldsInfo.syncFields) {
                    var source = syncFieldsInfo.source;
                    var syncFields = syncFieldsInfo.syncFields;
                    var idField = syncFieldsInfo.idField;
                    var i, j, index;
                    for (i = 0; i < syncFields.length; ++i) {
                    	for (j = 0; j < syncFields[i].length; ++j) {
	                    	var syncValue = $.isEmpty(source[i][syncFields[i][j].source]) ? syncFields[i][j].defaultValue : source[i][syncFields[i][j].source];
	                        if (syncFields[i][j].override) {
	                            interaction[syncFields[i][j].target] = syncValue;
	                        } else {
	                            if (interaction[syncFields[i][j].target]) {
	                            	interaction[syncFields[i][j].target] = funcs.denull(interaction[syncFields[i][j].target]);
	                            	//interaction[syncFields[i][j].target].push('*** below is the update from record "' + source[i][idField[i]] + '" ***');
	                            	interaction[syncFields[i][j].target].push(funcs.scmsg("147","sm",[source[i][idField[i]]]));
	                            	var length = funcs.lng(syncValue);
	                            	for (idx=0; idx < length; idx++) {
	                            		interaction[syncFields[i][j].target].push(syncValue[idx]);
	                            	}
	                            }
	                            else {
	                            	interaction[syncFields[i][j].target] = syncValue;
	                            }
	                        }
	                    }
                    }
                }
                return true;
            }
        }
        return false;
    },
    /**
     *  This function is check whether the interaction need ignore status sync.
     *
     *  @param {interaction} object- The interaction record
     *  @return {boolean}  -  Whether interaction need status sync.
     */
    ignoreStatusSync: function(interaction) {
        var workflow = vars['$L.workflow'];
        if (!workflow) {
            var object = vars['$L.object'];
            if (!object) {
                object = $("Object").select("file.name=\"incidents\"").uniqueResult();
            }
            if (!object || !object.workflowLocation) {
                return true;
            }
            workflow = lib.Workflow.getWorkflow(object, interaction);
        }
        if (!workflow || workflow['is.legacy.workflow']) {
            return true;
        }

        return false;
    }

});

function getClass() {
    return StatusSyncService;
}