var lng = system.functions.lng;
var NO_RECORD_EXIT = lib.GatewayAPI_Constants.NO_RECORD_EXIT();
var NORMAL_EXIT = lib.GatewayAPI_Constants.NORMAL_EXIT();
var BAD_VALIDATION_EXIT = lib.GatewayAPI_Constants.BAD_VALIDATION_EXIT();
var setExitType = lib.GatewayAPI_Util.setExitType;
var setErrorMsg = lib.GatewayAPI_Util.setErrorMsg;
var select = lib.GatewayAPI_RAD._select;
var scmsg = system.functions.scmsg;
var nullsub = system.functions.nullsub;
var filename = system.functions.filename;
var getRecordTag = lib.localizeTable.getRecordTag;
var $ = lib.c.$;
var displayValue = $("#datadictService").displayValue;
var log = lib.GatewayAPI_Logger.log("GatewayAPI_RelatedRecords");

function retreiveRelatedRecords() {
	setExitType(NORMAL_EXIT);
	var sourceId = vars['$L.file']['source.id'];
	
	var relation = populateRelatedInfo(sourceId);
	
	var pdEnabled = lib.ProcessDesignerEnablement.isPDEnabled();

	if (vars.$hasRecords) {
		var statusMap = _getStatusMap(vars.$relatedId);
		
		for (var i=0; i<lng(vars.$relatedTitle); i++) {
			var _filename = vars.$relatedFilename[i];
			vars['$L.file']['related.records'][i]['title'] = vars.$relatedTitle[i];
			vars['$L.file']['related.records'][i]['id'] = vars.$relatedId[i];
			vars['$L.file']['related.records'][i]['type'] = vars.$relatedType[i];
			vars['$L.file']['related.records'][i]['filename'] = vars.$relatedFilename[i];
			vars['$L.file']['related.records'][i]['phase'] = vars.$relatedPhase[i];
			vars['$L.file']['related.records'][i]['status'] = nullsub(statusMap[vars.$relatedId[i]], 
				lib.custom.localvalue(vars.$relatedFilename[i], vars.$relatedStatus[i], vars['$G.my.language']));
		}
	}
}

function _getStatusMap(relatedIds) {
	var ids = system.functions.str(relatedIds);
	var query = "action.id isin " +ids;
	var fields = ['cartItemId', 'action.id', 'status'];
	var item = select("svcCartItem", query, fields, null);
	var statusMap = [];
	if (item) {
		do {
			statusMap[item['action.id']] = item['status'];
			var result = item.getNext();
		} while (result == RC_SUCCESS)
	}
	return statusMap;
}

function getValueTag(record) {
  return record["value"] + ";" + record["source.file"] + ";" + record["target.file"] + ";" + record["source.type"] + ";" + record["target.type"];
}

/**
 * This function is used to populate the attribute variables used for related section
 * 
 * @param {String}
 *          id - The id of the current file . We can use this id to retrieve all the related record from screlation table
 * @returns
 * @type Void
 */
function populateRelatedInfo(id) {
  // print("entered");
  var idFieldNameMap = {
    incidents: "incident.id",
    cm3r: "number",
    rootcause: "id",
    knownerror: "id",
    probsummary: "number",
    ocmq: "number",
    request: "number",
    requestTask: "number",
    sla:"agreement.id",
    kmdocument: "id"
  };
  // define the column attribute name for differnt record type
  var statusFieldMap = {
    incidents: "open",
    cm3r: "current_phase",
    rootcause: "rcStatus",
    knownerror: "rcStatus",
    probsummary: "problem_status",
    ocmq: "status",
    request: "status",
    requestTask: "status",
    sla:"display.category",// since agreement has status field, use field "display.category" instead of field "status"
    kmdocument: "status"
  };
  var titleFieldMap = {
    incidents: "title",
    cm3r: "brief_description",
    rootcause: "brief_description",
    knownerror: "brief_description",
    probsummary: "brief_description",
    ocmq: "brief_description",
    request: "brief_description",
    requestTask: "title",
    sla:"title",
    kmdocument: "title"
  };
  var relation = new SCFile("screlation");
  // column from the related record
  vars.$relatedTitle = [];
  vars.$relatedStatus = [];
  vars.$relatedPhase = [];

  // column from screlation table
  vars.$relatedId = [];
  vars.$relatedType = [];
  vars.$relatedFilename = [];

  var sql = "source=\"" + id + "\"";
  var rc = relation.doSelect(sql);

  while (rc == RC_SUCCESS) {

    // ignore screlation type of "Master to Child"
    if (relation.type == "Master to Child") {
      rc = relation.getNext();
      continue;
    }

    var dependFileName = relation.depend_filename;
    if (dependFileName === "problem") {
      dependFileName = "probsummary";
    }

    var sourceFileName = relation["source.filename"];
    if (sourceFileName === "problem") {
      sourceFileName = "probsummary";
    }

	var typeFilter="";
	if(sourceFileName=="rootcause" && vars.$G_pd_pm_enabled==true)
	{
		if(vars.$isKnownError==true )
		{
			typeFilter=" and source.type=\"ke\""
		}
		else
		{
			typeFilter=" and source.type~=\"ke\""
		}
	}
	
    var relationType = relation.type;
    var screlationtype = $("screlationtype").select(
            'value="' + relationType + '" and source.file="' + sourceFileName
                    + '"  and target.file="' + dependFileName + '"'+typeFilter).uniqueResult();
    if (screlationtype != null) {
      var tag = getValueTag(screlationtype);
      var typeStr = scmsg(tag, "local:screlationtype");
      if (typeStr.indexOf("Could not be found") == -1) {
        relationType = typeStr;
      }
      if (!screlationtype["showInRelatedTable"]) {
      	// skip this relation in table
      	rc = relation.getNext();
      	continue;
      }
    }
    
	// populate fields in screlation table
    vars.$relatedId.push(relation.depend);
    vars.$relatedType.push(relationType);
    vars.$relatedFilename.push(dependFileName);

    var dependFile = new SCFile(dependFileName);
    var relatedSql = idFieldNameMap[dependFileName] + "=\"" + relation.depend + "\"";
    var relatedRC = dependFile.doSelect(relatedSql);
    if (relatedRC == RC_SUCCESS) {
      // populate fields from related record
      vars.$relatedTitle.push(dependFile[titleFieldMap[dependFileName]]);
      vars.$relatedStatus.push(dependFile[statusFieldMap[dependFileName]]);
      vars.$relatedPhase.push(displayValue(dependFile,"current.phase"));
    }
    rc = relation.getNext();
  }

  vars.$source = id;
  vars.$sourceFilename = filename(vars.$L_file);
  vars.$hasRecords = nullsub(lng(vars.$relatedTitle), 0) > 0;
}