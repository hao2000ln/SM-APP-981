var STATUS_SYNC_RELATION_ESCALATION = ["Escalation"];
var STATUS_SYNC_RELATION_STREAMLINED = ["Trigger To", "Fulfillment"];
var $ = lib.c.$;
var logger = getLog("StatusSyncServiceConfig");

var STATUS_MAPS_ESCALATION = {
    probsummary: {
        statusField: "problem.status",
        statusMap: {
            "Resolved": {
                targetStatus: "Resolved",
                syncFields: [{
                    source: "resolution",
                    target: "resolution",
                    override: false
                },
                {
                    source: "resolution.channel",
                    target: "resolution.channel",
                    override: true
                }]
            },
            "Work In Progress": {
                targetStatus: "Dispatched",
                currentStatus: ["Resolved"]
            }
        }
    },
    request: {
        statusField: "status",
        statusMap: {
            "Fulfilled": {
                targetStatus: "Resolved",
                syncFields: [{
                    source: "resolution",
                    target: "resolution",
                    defaultValue: [funcs.scmsg(148, "sm")],
                    override: false
                },
                {
                    source: "resolution.channel",
                    target: "resolution.channel",
                    override: true
                }]
            },
            "In Progress": {
                targetStatus: "Dispatched",
                currentStatus: ["Resolved"]
            }
        }
    },
    rootcause: {
        statusField: "rcStatus",
        idField: "id",
        statusMap: {
            "Resolved": {
                targetStatus: "Resolved",
                syncFields: [{
                    source: "resolution",
                    target: "resolution",
                    override: false
                },
                {
                    source: "resolution.channel",
                    target: "resolution.channel",
                    override: true
                }]
            },
            "Work In Progress": {
                targetStatus: "Dispatched",
                currentStatus: ["Resolved"]
            }
        }
    },
    cm3r: {
        statusField: "current.phase",
        statusMap: {
            "Post Implementation Review": {
                targetStatus: "Resolved"
            }
        }
    }
};

var STATUS_MAPS_STREAMLINED = {
    probsummary: {
        statusField: "problem.status",
        statusMap: {
            "Pending Customer": {
                targetStatus: "Pending Customer",
                priority: 0
            },
            "Resolved": {
                targetStatus: "Resolved",
                priority: 0,
                syncFields: [{
                    source: "resolution",
                    target: "resolution",
                    override: false
                },
                {
                    source: "resolution.channel",
                    target: "resolution.channel",
                    override: true
                }]
            }
        },
        defaultStatus: {
            targetStatus: "Dispatched",
            priority: 1
        },
        ignoreStatus: ["Closed"]
    },
    request: {
        statusField: "status",
        statusMap: {
            "Pending Customer": {
                targetStatus: "Pending Customer",
                priority: 0
            },
            "Fulfilled": {
                targetStatus: "Resolved",
                priority: 0,
                syncFields: [{
                    source: "resolution",
                    target: "resolution",
                    defaultValue: [funcs.scmsg(148, "sm")],
                    override: false
                },
                {
                    source: "resolution.channel",
                    target: "resolution.channel",
                    override: true
                }]
            }
        },
        defaultStatus: {
            targetStatus: "Dispatched",
            priority: 1
        },
        ignoreStatus: ["Closed"]
    },
    rootcause: {
        statusField: "rcStatus",
        idField: "id",
        statusMap: {
            "Pending": {
                targetStatus: "Pending Customer",
                priority: 0
            },
            "Resolved": {
                targetStatus: "Resolved",
                priority: 0,
                syncFields: [{
                    source: "resolution",
                    target: "resolution",
                    override: false
                },
                {
                    source: "resolution.channel",
                    target: "resolution.channel",
                    override: true
                }]
            }
        },
        defaultStatus: {
            targetStatus: "Dispatched",
            priority: 1
        },
        ignoreStatus: ["Closed", "Abandoned"]
    },
    cm3r: {
        statusField: "current.phase",
        statusMap: {},
        defaultStatus: {
            targetStatus: "Dispatched",
            priority: 1
        },
        ignoreStatus: ["Closed", "Abandoned"]
    }
};

/**
 *  This function is wrapper to return the configured relation type which need status sync.
 */
function getStusSyncRelation(streamlined) {
    return streamlined ? STATUS_SYNC_RELATION_STREAMLINED : STATUS_SYNC_RELATION_ESCALATION;
}

/**
 *  This function is wrapper to return the status sync map.
 */
function getStusSyncMap(streamlined) {
    return streamlined ? STATUS_MAPS_STREAMLINED : STATUS_MAPS_ESCALATION;
}

/**
 *  This function is calculate whether the fulfillment record can be automatically closed or not
 */
function canClose(record) {
	var _map = {
		probsummary: {
			id:"number",
			hasOpenTask: $("#incidentService").countActiveTasksOfIncident(record["number"]) > 0
		},
		rootcause: {
			id:"id",
			hasOpenTask: $("#problemService").hasOpenRelatedTask(record)
		},
		request: {
			id:"number",
			hasOpenTask: lib.RequestService.hasOpenTasks(record["number"])
		}
	};

	// check whether the record has open interactions or not
	var record_id = record[_map[funcs.filename(record)]["id"]];
	var screlationService = $("#screlationService");
	var open_interaction_count = screlationService.countRelatedRecords(record_id, " and depend.filename=\"incidents\" and depend.active=true");
	if (open_interaction_count > 0) {
		logger.warn("Cannot close the record \"" + record_id + "\" as it still has " + open_interaction_count + " open interactions.");
		return false;
	}
	
	// check whether the record has open tasks or not
	if (_map[funcs.filename(record)]["hasOpenTask"]) {
		logger.warn("Cannot close the record \"" + record_id + "\" as it still has open tasks.");
		return false;
	}

	return true;
}