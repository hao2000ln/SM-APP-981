var $ = lib.c.$;
var forceObject = lib.ProcessDesignerEnablementUtil.forceObject;
var getIconForPDMenu = lib.ProcessDesignerEnablementUtil.getIconForPDMenu;

/**
 * Contants
 */
// the suffix used by PD temp records before enabling
var PDTMP_SUFFIX = "_for_pd4_tobe_used";
var PDTMP_SUFFIX_SHORT = "_for_pd4";
// the suffix used by legacy records after enabling
var LEGACY_SUFFIX = "_disabled_by_PDHD";
var LEGACY_SUFFIX_SHORT = "_disabled";

// Object constant
var OBJECT_NAMES = new Array("probsummary", "incidents", "rootcause", "rootcausetask");

// Datadict constant
var DATADICT_FILES = new Array("probsummary", "rootcause", "rootcausetask", "incidents");
var DATADICT_FIELDS_1 = new Array("master.incident","category", "subcategory", "product.type", "current.phase", "problem.status");
var DATADICT_FIELDS_2 = new Array("category", "subcategory", "product.type", "current.phase", "rcStatus");
var DATADICT_FIELDS_3 = new Array("id", "incident.category", "category", "task.category", "subcategory", "product.type", "rcStatus", "current.phase", "parent.problem");
var DATADICT_FIELDS_4 = new Array("category", "subcategory", "product.type", "current.phase", "open");
var DATADICT_CAPTIONS_1 = new Array("IS Parent Incident","Category", "Subcategory", "Area", "Phase", "Status");
var DATADICT_CAPTIONS_2 = new Array("Category", "Subcategory", "Area", "Phase", "Status");
var DATADICT_CAPTIONS_3 = new Array("Task ID", "Parent Category", "Category", "Task Category", "Subcategory", "Area", "Status", "Phase", "Parent Problem");
var DATADICT_CAPTIONS_4 = new Array("Category", "Subcategory", "Area", "Phase", "Status");
// System:1, Application:2, Data:3
var DATADICT_UTYPE_1 = new Array(1, 1, 1, 1, 1);
var DATADICT_UTYPE_2 = new Array(1, 1, 1, 1, 1);
var DATADICT_UTYPE_3 = new Array(1, 1, 1, 1, 1, 1, 1, 1, 1);
var DATADICT_UTYPE_4 = new Array(1, 1, 1, 1, 1);
var DATADICT_CATEGORY_RELATED_INFO = new Array();
DATADICT_CATEGORY_RELATED_INFO.push(DATADICT_FILES);
DATADICT_CATEGORY_RELATED_INFO.push([DATADICT_FIELDS_1, DATADICT_FIELDS_2, DATADICT_FIELDS_3, DATADICT_FIELDS_4]);
DATADICT_CATEGORY_RELATED_INFO.push([DATADICT_CAPTIONS_1, DATADICT_CAPTIONS_2, DATADICT_CAPTIONS_3, DATADICT_CAPTIONS_4]);
DATADICT_CATEGORY_RELATED_INFO.push([DATADICT_UTYPE_1, DATADICT_UTYPE_2, DATADICT_UTYPE_3, DATADICT_UTYPE_4]);

// Menu constant
var TOP_MENUS= new Array("ADMIN","APPROVER GEN","HELPDESK GEN","HOME","ICM GEN","IM GEN","PM GEN");
// the descriptions and menu name of PD menu
// TODO, question: how menu do L10N? whether it is safe to use menu description field here?
var PD_MENU_DESCS = new Array("Incident Management", "Problem Management", "Service Desk");
var PD_MENU_NAMES = new Array("IM PD", "PM PD", "CC PD");
var PD_MENU_CONDS = new Array();
PD_MENU_CONDS.push("lioption(\"Incident Management\") and ( nullsub(jscall(\"security.getRights\", \"Incident\", \"view\"),\"false\")=\"true\" or nullsub(jscall(\"security.getRights\", \"Incident Tasks\", \"view\"),\"false\")=\"true\" or nullsub(jscall(\"security.getRights\", \"Incident Management Configuration\", \"view\"),\"false\")=\"true\")");
PD_MENU_CONDS.push("lioption(\"Root Cause\") and (nullsub(jscall(\"security.getRights\", \"Problem\", \"view\"),\"false\")=\"true\" or nullsub(jscall(\"security.getRights\", \"Problem Tasks\", \"view\"),\"false\")=\"true\" or nullsub(jscall(\"security.getRights\", \"Problem Management Configuration\", \"view\"),\"false\")=\"true\")");
PD_MENU_CONDS.push("lioption(\"Service Desk\") and (nullsub(jscall(\"security.getRights\", \"Service Desk\", \"view\"),\"false\")=\"true\" or nullsub(jscall(\"security.getRights\", \"Service Desk Configuration\", \"view\"),\"false\")=\"true\")");


// the prefix for legacy menu description after enabling
var LEGACY_MENU_PREFIX = "Legacy ";
// the ENV related menu items
var ENV_MENU_ITEM_DESCS = new Array("Incident Management Environment", "Service Desk Environment", "Problem Management Environment");
var PROFILE_MENU_ITEM_DESCS = new Array("Incident Management Profiles", "Problem Management Profiles", "Service Desk Profiles");
// the commands which need to replaced by in menu during enabling
var ORG_SD_COMMANDS = new Array("new call", "search call", "search cal", "search calls", "review cc", "PD new call", "PD search call", "PD review cc");
var NEW_SD_COMMANDS = new Array("Legacy new call", "Legacy search call", "Legacy search cal", "Legacy search calls", "Legacy review cc", "new call", "search call", "review cc");
var ORG_IM_COMMANDS = new Array("new incident", "search incident", "review im", "PD new incident", "PD search incident", "PD review im");
var NEW_IM_COMMANDS = new Array("Legacy new incident", "Legacy search incident", "Legacy review im", "new incident", "search incident", "review im");

// search config constant
var SEARCHCONFIG_TABLENAMES = new Array("probsummary", "rootcause", "rootcausetask", "incidents");
var SEARCHCONFIG_PD_SEARCHFORMATS = new Array("im.advFind.incident.search", "pbm.advFind.search.problem", "pbm.advFind.search.problem.task", "sd.advFind.search");
var SEARCHCONFIG_TOBE_DISABLED_TABLENAMES = new Array("knownerror", "knownerrortask");

// queue display option constant for ds scm.advanced
var QUEUE_DS_ID = "scm.advanced";
var QUEUE_DO_IDS = new Array("scm.advanced_massclose");

// links of related record constant
var RELATED_RECORD_LINKS = new Array("screlate.get.association");
var RELATED_RECORD_LINKLINES = new Array("rootcause", "problem", "incidents");

// global list for related record to support more link types
var RELATED_GL_NAMES = new Array("Related Records Type Change List");
var RELATED_GL_LIST_VARS_APPEND = new Array("Caused Problems","Solved Problems");
var RELATED_GL_DISP_VARS_APPEND = new Array("Caused Problems","Solved Problems");
var RELATED_GL_MSG_VARS_APPEND  = new Array("Caused Problems","Solved Problems");
var RELATED_GL_LIST_VARS_REMOVE = new Array("Related Known Errors");
var RELATED_GL_DISP_VARS_REMOVE = new Array("Related Known Errors");
var RELATED_GL_MSG_VARS_REMOVE  = new Array("Related Known Errors");


// KM
//   -- KM forms
var KM_FORM_1_ORG_REGEXP = /\"kmknowledgebase.advsearch.g\"/g;
var KM_FORM_1_NEW_VALUE = "\"kmknowledgebase.advsearch.pd.g\"";
var KM_FORM_2_ORG_REGEXP = /\"PM.error.km\"/g;
var KM_FORM_2_NEW_VALUE = "\"PM.error.km.pd\"";
var KM_FORM_3_ORG_REGEXP = /\"PM.problem.km\"/g;
var KM_FORM_3_NEW_VALUE = "\"PM.problem.km.pd\"";


//   -- KM links
var KM_LINKS = new Array("kmquery"); // some fields (category, subcategory, etc) now link to new tables (imCategory, imSubcategory, etc.)
var KM_LINKLINES = new Array();
KM_LINKLINES.push("incidentlib.category");
KM_LINKLINES.push("incidentlib.subcategory");
KM_LINKLINES.push("incidentlib.producttype");
KM_LINKLINES.push("interactionlib.category");
KM_LINKLINES.push("interactionlib.subcategory");
KM_LINKLINES.push("interactionlib.producttype");
KM_LINKLINES.push("knownerrorlib.category");
KM_LINKLINES.push("knownerrorlib.subcategory");
KM_LINKLINES.push("knownerrorlib.producttype");
KM_LINKLINES.push("problemlib.category");
KM_LINKLINES.push("problemlib.subcategory");
KM_LINKLINES.push("problemlib.producttype");
KM_LINKLINES.push("changelib.category");
KM_LINKLINES.push("changelib.subcategory");

//   -- KM knowledgebase
var KM_KNOWLEDGEBASES = new Array();
KM_KNOWLEDGEBASES.push("KnownError_Library");
KM_KNOWLEDGEBASES.push("Problem_Library");

// inbox 
// 1. inbox which need to enalbe in object
var ENABLE_QUEUE_IN_OBJECTS = new Array("imTask");
// 2. inbox which need to update
//    the struct is: [inboxName, operation:update/delete, [updateFields1,...], [updateToValue1,...]]
var ENABLE_QUEUE_OPERATION_UPDATE = "update";
var ENABLE_QUEUE_OPERATION_DELETE = "delete";
var ENABLE_QUEUES = new Array();
ENABLE_QUEUES.push(["My Group's To Do List", ENABLE_QUEUE_OPERATION_UPDATE, ["short.query"], ["((itemType=\"probsummary\" or itemType=\"incidents\" or itemType=\"rootcause\" or itemType=\"rootcausetask\" or itemType=\"imTask\" or itemType=\"cm3r\" or itemType=\"cm3t\") and group isin $lo.pm.assignments) or ((itemType=\"ocmq\" or itemType=\"ocml\") and group=$lo.dept.corp.structure)"]]);
ENABLE_QUEUES.push(["Rejected Incidents", ENABLE_QUEUE_OPERATION_UPDATE, ["short.query"], ["flag#true and resolution.code=\"Rejected\" and problem.status=\"Closed\""]]);
ENABLE_QUEUES.push(["All Open - Callback Interactions", ENABLE_QUEUE_OPERATION_UPDATE, ["short.query"], ["open=\"Callback\""]]);
ENABLE_QUEUES.push(["All Open Interactions", ENABLE_QUEUE_OPERATION_UPDATE, ["short.query","query","normalized.query","standard.query"], ["open~=\"Closed\" and open~=\"Canceled\"","open~=\"Closed\" and open~=\"Canceled\"","open~=\"Closed\" and open~=\"Canceled\"","open~=\"Closed\" and open~=\"Canceled\""]]);
ENABLE_QUEUES.push(["Self-Service Interactions", ENABLE_QUEUE_OPERATION_UPDATE, ["short.query"], ["ess.entry=true and (open=\"Open\" or open=\"Categorize\" or open=\"Assign\" or open=\"In Progress\")"]]);
ENABLE_QUEUES.push(["All Open Problems", ENABLE_QUEUE_OPERATION_UPDATE, ["short.query"], ["open#true and (isKnownError=NULL or isKnownError=false)"]]);
ENABLE_QUEUES.push(["High Priority Problems", ENABLE_QUEUE_OPERATION_UPDATE, ["short.query"], ["open#true and priority.code#\"1\" and (isKnownError=NULL or isKnownError=false)"]]);
ENABLE_QUEUES.push(["Open Problems Assigned to Me", ENABLE_QUEUE_OPERATION_UPDATE, ["short.query"], ["open#true and assignee.name=operator() and (isKnownError=NULL or isKnownError=false)"]]);
ENABLE_QUEUES.push(["Open Problems Assigned to My Group", ENABLE_QUEUE_OPERATION_UPDATE, ["short.query"], ["open#true and assignment isin $lo.pm.assignments and (isKnownError=NULL or isKnownError=false)"]]);
ENABLE_QUEUES.push(["Problem Records Owned by Me", ENABLE_QUEUE_OPERATION_UPDATE, ["short.query"], ["open#true and ticket.owner=operator() and (isKnownError=NULL or isKnownError=false)"]]);
ENABLE_QUEUES.push(["Problems in 'Problem Prioritization and Planning' Phase", ENABLE_QUEUE_OPERATION_UPDATE, ["short.query","inbox.name"], ["open#true and current.phase=\"Categorization\" and (isKnownError=NULL or isKnownError=false)","Problem in Categorization Phase"]]);
ENABLE_QUEUES.push(["Problems Not Assigned in 'Problem Investigation and Diagnosis' Phase", ENABLE_QUEUE_OPERATION_UPDATE, ["short.query","inbox.name"], ["open#true and current.phase=\"Investigation\" and (isKnownError=NULL or isKnownError=false)","Problem in Investigation Phase"]]);
ENABLE_QUEUES.push(["All Open Known Errors", ENABLE_QUEUE_OPERATION_UPDATE, ["short.query","inbox.type"], ["open#true and isKnownError=true","rootcause"]]);
ENABLE_QUEUES.push(["Known Errors Not Assigned in 'Known Error Investigation' Phase", ENABLE_QUEUE_OPERATION_DELETE, [], []]);
ENABLE_QUEUES.push(["Open Known Errors Assigned to Me", ENABLE_QUEUE_OPERATION_UPDATE, ["short.query","inbox.type"], ["open#true and assignee.name=operator() and isKnownError=true","rootcause"]]);
ENABLE_QUEUES.push(["Open Known Errors Assigned to My Group", ENABLE_QUEUE_OPERATION_UPDATE, ["short.query","inbox.type"], ["open#true and assignment isin $lo.pm.assignments and isKnownError=true","rootcause"]]);
ENABLE_QUEUES.push(["All Open Known Error Tasks", ENABLE_QUEUE_OPERATION_DELETE, [], []]);
ENABLE_QUEUES.push(["All Open Known Error Tasks Assigned to Me", ENABLE_QUEUE_OPERATION_DELETE, [], []]);
ENABLE_QUEUES.push(["All Known Errors", ENABLE_QUEUE_OPERATION_UPDATE, ["inbox.type"], ["rootcause"]]);
ENABLE_QUEUES.push(["All Closed Known Errors", ENABLE_QUEUE_OPERATION_UPDATE, ["inbox.type"], ["rootcause"]]);
ENABLE_QUEUES.push(["Known Errors Where Solution Time Is Not Met", ENABLE_QUEUE_OPERATION_DELETE, [], []]);


// sla, to support Incident Task
var SLA_GL_NAMES = new Array("SLO Tables");
var SLA_GL_LIST_VARS = new Array("imTask");
var SLA_GL_DISP_VARS = new Array("Incident Tasks");
var SLA_SD_STATUS_PROGESSION=["Open","Categorize","Assign","Suspended","Dispatched","In Progress","Resolved","Withdrawal Requested","Callback","Closed"];
var SLA_IM_STATUS_PROGESSION=["Open", "Categorize", "Assign", "Work In Progress", "Pending Customer", "Pending Evidence", "Pending Vendor", "Pending Other", "Suspended", "Resolved", "Closed"];
var SLA_PBM_STATUS_PROGESSION=["Open", "Categorize", "Assign", "Work In Progress", "Pending", "Deferred", "Resolved", "Closed", "Abandoned"];
var SLA_PBMT_STATUS_PROGESSION=["Planned", "Ready", "Assigned", "Work In Progress", "Pending", "Pending Review", "Closed", "Cancelled"];

// SD module
var SD_LINKS_1 = new Array("svcCat.wizard.support.triplet", "joinsvcDisplay");
var SD_LINKLINES_1 = new Array("category", "subcategory", "product.type");
var SD_LINKS_2 = new Array("screlate.incidents.cm3r");
var SD_LINKLINES_2 = new Array("number");
var SD_LINKLINES_changeorder_2 = new Array(true);
var SD_LINKS_3 = new Array("screlate.incidents.problem");
var SD_LINKLINES_3 = new Array("incident.id");
var SD_LINKLINES_changeorder_3 = new Array(true);

var SD_SVCCATINTERFACES = new Array("Open an Incident");
var SD_SCRELCONFIGS = new Array("problem");
var SD_VALIDITY_FILENAME = "svcCat";
var SD_VALIDITY_FIELDS = new Array("category", "product.type", "subcategory");
var SD_VALIDITY_SEQUENCES = new Array(1, 1, 1);
var SD_REPLACE_ACTIVITYACTIONS = new Array("Save Activities");
var SD_DISABLE_ACTIVITYACTIONS = new Array("Update Activities");

// Links related to category/subcategory/area
var CATEGORY_RELATED_LINKS = new Array("probsummary", "rootcause", "rootcausetask", "incidents");
var CATEGORY_RELATED_LINKLINES = new Array("category", "subcategory", "product.type");

// ModuleStatus
var PD_MODULE_STATUS = new Array();
// SD
//PD_MODULE_STATUS.push(["incidents", "Categorize",8]);
//PD_MODULE_STATUS.push(["incidents", "Assign",9]);
//PD_MODULE_STATUS.push(["incidents", "Dispatched",10]);
//PD_MODULE_STATUS.push(["incidents", "Callback",11]);
//PD_MODULE_STATUS.push(["incidents", "Suspended",12]);
//PD_MODULE_STATUS.push(["incidents", "In Progress",13]);
//PD_MODULE_STATUS.push(["incidents", "Withdrawal Requested",14]);
//PD_MODULE_STATUS.push(["incidents", "Canceled",15]);
//PD_MODULE_STATUS.push(["incidents", "Pending Approval",16]);
// Problem
//PD_MODULE_STATUS.push(["rootcause", "Abandoned",12]);
//PD_MODULE_STATUS.push(["rootcause", "Assign",4]);
//PD_MODULE_STATUS.push(["rootcause", "Categorize",3]);
//PD_MODULE_STATUS.push(["rootcause", "Closed",11]);
//PD_MODULE_STATUS.push(["rootcause", "Pending",6]);
//PD_MODULE_STATUS.push(["rootcause", "Resolved",10]);
// Problem Task
//PD_MODULE_STATUS.push(["rootcausetask", "Pending",7]);
//PD_MODULE_STATUS.push(["rootcausetask", "Closed",12]);
//PD_MODULE_STATUS.push(["rootcausetask", "Pending Review",10]);
//PD_MODULE_STATUS.push(["rootcausetask", "Planned",2]);
//PD_MODULE_STATUS.push(["rootcausetask", "Ready",4]);
// Incident
//PD_MODULE_STATUS.push(["probsummary", "Categorize",1]);
//PD_MODULE_STATUS.push(["probsummary", "Assign",2]);
//PD_MODULE_STATUS.push(["probsummary", "Pending Evidence",4]);
//PD_MODULE_STATUS.push(["probsummary", "Pending Parent Incident",5]);

var PD_MODULES_STATUS_UPDATE = 
[
  {
  "module":"probsummary",
  "status":"Work in Progress",
  "newStatus": "Work In Progress"
  }
];


// AlertDef
var REPLACE_ALERT_DEFS = new Array("PM Past Due", "PMT Past Due");

// contextAction
var REPLACE_CONTEXT_ACTIONS = new Array("Possible workarounds for this Service");

/**var ENABLE_EXTACCESS = 
[
  {
  "name":"probsummary",
  "removedActions":
    [
    "mobileclose","reopensave","mobileresolve","mobilesave","resolvesave","resolvebg"
    ]
  },
  {
  "name":"rootcause",
  "removedActions":
    [
    "reopen"
    ]
  }
  
];*/

var ENABLE_HELPDESK_EXTACCESS = 
[
  {
  "serviceName":"IncidentManagement",
  "name":"probsummary",
  "objectName":"Incident",
  "removedAllowedActions":["reopensave","resolvebg"],
  "addedField":["current.phase","escalated","major.incident","escalation.teams","owner","review.detail"],
  "addedCaption":["Phase","Escalated","MajorIncident","EscalationTeams","IncidentManager","ReviewDetail"],
  "modifiedExpression":[
    "if ($L.mode=\"update\") then (current.phase in $L.file=current.phase in $L.file.save)",
    "if ($L.mode=\"add\" and null(category in $L.file)) then (category in $L.file=jscall(\"settings.getSettingValue\", \"Incident\", \"default.category\"))"
    				   ]
  },
  {
  "serviceName":"ProblemManagement",
  "name":"rootcause",
  "objectName":"Problem",
  "removedAllowedActions":["reopen"],
  "addedField":["id","current.phase","category","resolution","subcategory","product.type","problem.type","ticket.owner","assignment","initial.impact","rcStatus","description","severity","affected.item","assignee.name","incident.count","logical.name","affected.ci.count","rootcauseDate","solutionDate","expected.resolution.time","priority.code","brief.description","root.cause","closure.code","workaround","update"],
  "addedCaption":["ID","Phase","Category","Solution","SubCategory","Area","ProblemType","ProblemOwner","AssignmentGroup","Impact","Status","Description","Urgency","Service","Assignee","IncidentCount","PrimaryCI","AffectedCICount","ExpectedRootCauseIdentifiedDate","SolutionIdentifiedDate","ExpectedResolutionDate","Priority","Title","RootCause","ClosureCode","Workaround","JournalUpdates"],
  "modifiedExpression":
    [
    "update in $L.file=denull(update in $L.file)",
    "cleanup($pm.activity);cleanup($rc.update);if same(update in $L.file, update in $L.file.save) then ($L.need.to.update=true)",
    "$rc.update=update in $L.file;if (denull($rc.update)={}) then ($rc.update={\"Update sent from web services\"})",
    "if ($L.need.to.update=true) then ($rc.update={\"Update sent from web services\"})",
    "update in $L.file=update in $L.file.save",
    "if ($L.mode=\"update\") then (current.phase in $L.file=current.phase in $L.file.save)",
    "if ($L.mode=\"add\" and null(category in $L.file)) then (category in $L.file=jscall(\"settings.getSettingValue\", \"Problem\", \"default.category\"))"
    ]
  },
  {
  "serviceName":"ProblemManagement",
  "name":"rootcausetask",
  "objectName":"ProblemTask",
  "removedAllowedActions":[],
  "addedField":[],
  "addedCaption":[],
  "modifiedExpression":
    [
    "if ($L.mode=\"update\") then (current.phase in $L.file=current.phase in $L.file.save)",
    "if ($L.mode=\"add\" and null(category in $L.file)) then (category in $L.file=jscall(\"settings.getSettingValue\", \"Problem Task\", \"default.category\"))"
    ]
  },
  {
  "serviceName":"ServiceDesk",
  "name":"incidents",
  "objectName":"Interaction",
  "removedAllowedActions":[],
  "addedField":["current.phase","assignment","assignee.name"],
  "addedCaption":["Phase","AssignmentGroup","Assignee"],
  "modifiedExpression":
    [
    "if ($L.mode=\"update\") then (current.phase in $L.file=current.phase in $L.file.save)",
    "if ($L.mode=\"add\" and null(category in $L.file)) then (category in $L.file=jscall(\"settings.getSettingValue\", \"Service Desk\", \"default.category\"))",
    "if ($L.bg.action=\"solvedirectly\" and null(incident.id in $L.file)) then ($L.mode=\"add\")"
    ]
  }
];

var ENABLE_HELPDESK_DELETE_MODULESTATUS = 
[
  {
  "module":"rootcause",
  "status":["Rejected"]
  },
  {
  "module":"rootcausetask",
  "status":["Updated","Work-In-Progress"]
  }
];


var datadictGlobalListModification=
[
  {
  "datadictName":"incidents",
  "fieldName":["category","open","product.type","resolution.code","subcategory"],
  "globalListName":["Interaction Local Categories","Interaction Local Statuses","Interaction Local Areas","Interaction Local Completion Codes","Interaction Local Subcategories"]
  },
  {
  "datadictName":"probsummary",
  "fieldName":["category","problem.status","product.type","resolution.code","subcategory"],
  "globalListName":["Incident Local Categories","Incident Local Statuses","Incident Local Areas","Incident Closure Codes","Incident Local Subcategories"]
  },
  {
  "datadictName":"rootcause",
  "fieldName":["category","closure.code","current.phase","product.type","rcStatus","subcategory"],
  "globalListName":["Problem Local Categories","Problem Closure Codes","Problem Local WorkflowPhases","Problem Local Areas","Problem Local Statuses","Problem Local Subcategories"]
  },
  {
  "datadictName":"rootcausetask",
  "fieldName":["category","closure.code","current.phase","rcStatus"],
  "globalListName":["Problem Task Local Categories","Problem Task Closure Codes","Problem Task Local WorkflowPhases","Problem Task Local Statuses"]
  }
];

var datadictCaptionAndUsage=
[
  {
  "datadictName":"incidents",
  "fieldName":["contact.name","location.full.name","source.service"],
  "caption":["Service Recipient","Location Fullname",""],
  "usage":[0,0,2]
  },
  {
  "datadictName":"probsummary",
  "fieldName":["opened.by"],
  "caption":["Requested By"],
  "usage":[0]
  },
  {
  "datadictName":"rootcause",
  "fieldName":["affected.item","assignee.name","description","expected.resolution.time","id","impact","incident.category","open","open.time","opened.by","priority.code","root.cause","status","sysmodcount","sysmodtime","sysmoduser","update","update.time","updated.by"],
  "caption":["Affected Service","Assignee","","Expected Resolution Date","","Legacy Impact","Legacy Category","","","","","Root Cause","Legacy Status","","","","","",""],
  "usage":[0,0,2,0,1,0,0,1,1,1,1,0,0,1,1,1,1,1,1]
  },
  {
  "datadictName":"rootcausetask",
  "fieldName":["description","root.cause","status"],
  "caption":["","Task Outcome","Legacy Status"],
  "usage":[2,0,0]
  }
];

/**
 * Replace or delete the current record
 */
function enableReplaced() {
	// 2. enable the Objects, which will
    //   - rename the legacy Objects to <file name>_legacy_disabled_by_PD_HelpDesk
    //   - rename the temp new Objects <file name>_for_pd4_tobe_used to <file name>
    enableObjects();
    
    // 5. queue DS to disable the massclose for SD and incident
    enableQueueDisplays();
    
    replaceKMRecords();
    
    replaceKMTempRecords();
    
    replaceSD();
    
    // 15. AlertDef
    enableAlertDefs();
    
    // 16. contextAction
    enableContextActions();
}

/**
 * Update the current record directly
 */
function enableUpdated() {
	// 3. enable the Datadict, which will change the Datadict probsummary and rootcause:
    //   - rename the captions of category, subcategory and product.type to Category, Subcategory and Area, and set the Usage Type to System, Application and Application;
    enableDatadicts();
    
    // 3. add PD sub-menus to 9 tops menus (2 for change, and 7 for help desk)
    enableMenus();
    
    // 4. update the SearchConfig to use new PD format
    enableSearchConfigs();
    
    // 6. links for related records feature
    enableRelatedRecordLinks();
    
    // 7. KM
    updateKMRecords();
    
    // 8. inbox
    enableInboxes();
    
    // 9. SLA
    enableSLA();
    
    // 11. SD screlate and catelog related items
    updateSD();
    
    // 13. update the link lines which are category related
    enableCategoryLinks();
    
    // 14. ModuleStatus
    enableModuleStatus();
    
    // 17. extaccess
    enableHelpDeskExtaccesses();
    
	removeModuleStatus();
	
	// 18. Security
    enableSecurity();
}

/**
 * Main method of enabling the PD Helpe Desk.
 */
function enablePDHelpDesk() {
    print("Starting enabling PD Help Desk...");

    // 1. check whether PD Help Desk already enabled
    if(checkEnabled()) {
        print("The PD Help Desk has already been enabled, ignore current enable process!");
        return;
    }
    
    // replace or delete or add a record
    enableReplaced();
    // update a record
    enableUpdated();
    
    print("Finish enabling PD Help Desk");
}

function checkEnabled() {
    // TODO, currently we only check whether the probsummary Object is enabled or not.
    var pdTmpProbsummaryObjectName = "probsummary" + PDTMP_SUFFIX;
    var objectList = new SCFile("Object");
  var querySQL = "file.name=\"" + pdTmpProbsummaryObjectName + "\"";
  print("Query SQL for check enabled:" + querySQL);
  if (objectList.doSelect(querySQL) == RC_SUCCESS) {
    return false;
  } else {
    
    return true;
  }
    return false;
}

function enableObjects() {
    print("Start enabling Objects...");
    replaceRecords(OBJECT_NAMES, "Object", "file.name");
    print("Finish enabling Objects");
}

function enableDatadicts() {
    print("Start enabling Datadicts...");
    updateDatadicts(DATADICT_CATEGORY_RELATED_INFO);
   
    enablePDHelpDeskDatadictGlobalList();    
	enablePDHelpDeskDatadictCaptionAndUsage();
	
    print("Finish enabling Datadicts");
}

function updateDatadicts(datadictInfo) {
    var files = datadictInfo[0];
    var fields = datadictInfo[1]; // array of array, the fileds for each file
    var captions = datadictInfo[2]; // array of array, the captions for each file
    var usageTypes = datadictInfo[3]; // array of array, the usage types for each file
    for(var i=0; i<files.length; i++) {
        print("Enabling Datadict \"" + files[i] + "\"...");
        var datadict = new SCFile("datadict");
    var querySQL = "name=\"" + files[i] + "\"";
        // find the datadict
    if (datadict.doSelect(querySQL) == RC_SUCCESS) {
      // duplicate the original datadict
      var oldDatadict = new SCFile("datadict");
      system.vars.$L_void=system.functions.fduplicate(oldDatadict, datadict);

      // go through the datadict files
      for(var datadictFieldIdx=0; datadictFieldIdx<datadict.fields.length(); datadictFieldIdx++) {
          for(var tobeUpdatedFieldIdx=0; tobeUpdatedFieldIdx<fields[i].length; tobeUpdatedFieldIdx++) {
              if(datadict.fields[datadictFieldIdx] == fields[i][tobeUpdatedFieldIdx]) {
                  print("Updating field \"" + fields[i][tobeUpdatedFieldIdx] +"\", change caption to \"" + captions[i][tobeUpdatedFieldIdx] + "\", and change Usage Type to \"" + usageTypes[i][tobeUpdatedFieldIdx] + "\"");
                  datadict.captions[datadictFieldIdx] = captions[i][tobeUpdatedFieldIdx];
                  datadict.sysFieldType[datadictFieldIdx] = usageTypes[i][tobeUpdatedFieldIdx];
              }
          }
      }
      datadict.doUpdate();
      addSMPatches(datadict, oldDatadict, "datadict;" + datadict.name, "update");
    } else {
        // Ignore it if the datadict does not exist
      print("Can not find the datadict, ignore the enabling for datadict \"" + files[i] + "\"!");
    }
        print("Enabled Datadict \"" + files[i] + "\"");
    }
}

function enableMenus() {
  print("Start enabling Menus...");
  for(var i=0; i<TOP_MENUS.length; i++) {
        print("Enabling Top Menu \"" + TOP_MENUS[i] + "\"...");
        var topMenu = new SCFile("menu");
    var topMenuQuerySQL = "name=\"" + TOP_MENUS[i] + "\"";

    if (topMenu.doSelect(topMenuQuerySQL) == RC_SUCCESS) {
          
          var needToAddStreamlinedEntry = false;
          var noStreamlinedEntry = true;
          var sdEntryCond = null;
          
          if(null!=topMenu.description) {
            // duplicate the original top menu
        var oldTopMenu = new SCFile("menu");
        system.vars.$L_void=system.functions.fduplicate(oldTopMenu, topMenu);

            for(var j=0; j<topMenu.description.length(); j++) {
              for(var k=0; k<PD_MENU_DESCS.length; k++) {
                
                if(topMenu.description[j] == PD_MENU_DESCS[k]) {
                  print("Update menu \"" + topMenu.description[j] + "\"");
                  topMenu.group[j] = null;
                  topMenu.command[j] = null;
                  topMenu.application[j] = "menu.manager";
                  topMenu.pname[j] = "name";
                  topMenu.pvalue[j] = PD_MENU_NAMES[k];
                  topMenu.thread[j] = null;
                  topMenu.condition[j] = PD_MENU_CONDS[k];
                  topMenu.icon[j] = getIconForPDMenu(topMenu.description[j]);
                }
              }
              //update menu action I.E. "Register New Interaction/Open New Interaction" should replace to document.new
                if("Register New Interaction"==topMenu.description[j] || "Open New Interaction"==topMenu.description[j] || "Create New Interaction"==topMenu.description[j]){
                    topMenu.application[j] = "document.new";
                topMenu.pname[j] = "name";
                topMenu.pvalue[j] = "incidents";
                topMenu.description[j] = "Create New Interaction";
                sdEntryCond = system.functions.str(topMenu.condition[j]);
                if (sdEntryCond == null || sdEntryCond === "") {
                	topMenu.condition[j] = system.functions.val('jscall("sdUtil.isStreamlinedSDEnabled")=false', 10);
                }
                else {
                	topMenu.condition[j] = system.functions.val(sdEntryCond + ' and jscall("sdUtil.isStreamlinedSDEnabled")=false', 10);
                }
                
                needToAddStreamlinedEntry=true;
                 }
                 
                if("Create Streamlined Interaction" === topMenu.description[j]) noStreamlinedEntry = false;
            }
			
			if(needToAddStreamlinedEntry && noStreamlinedEntry){
				print("Append Streamlined Entry...");
				var sindex = getMenuItemLength(topMenu);
				topMenu.option[sindex] = getNextAvailableMenuOption(topMenu,sindex);
				topMenu.icon[sindex] = "icon-service-desk";
				topMenu.group[sindex] = "Service Desk";
				topMenu.description[sindex] = "Create Streamlined Interaction";
				topMenu.command[sindex] = null;
				topMenu.application[sindex] = "document.new";
				topMenu.pname[sindex] = "name";
				topMenu.pvalue[sindex] = "interactionDelegate";
				topMenu.thread[sindex] = null;
				if (sdEntryCond == null || sdEntryCond === "") {
                	topMenu.condition[sindex] = system.functions.val('jscall("IDOL_Help.canOpenSmartTicket")=false and jscall("sdUtil.isStreamlinedSDEnabled")=true', 10);
                }
                else {
                	topMenu.condition[sindex] = system.functions.val(sdEntryCond + ' and jscall("IDOL_Help.canOpenSmartTicket")=false and jscall("sdUtil.isStreamlinedSDEnabled")=true', 10);
                }			
			}
			
            topMenu.doUpdate();
            addSMPatches(topMenu, oldTopMenu, "menu;" + topMenu.name, "update");
          }

          print("Enabled top menu \"" + TOP_MENUS[i] + "\".");
    } else {
        // Ignore it if the top menu does not exist
      print("Can not find the top menu, ignore the enabling for top menu \"" + TOP_MENUS[i] + "\"!");
    }
    }

    print("Removing the PD Help Desk ENV menu items under \"System Administration->Onging Maintenance-> Environment Records\"...");
    // find the menu "ENV RECORDS", and remove the PD help desk related menus.
    // My personal opinion: it's better we don't remove them here :)
    var envMenu = new SCFile("menu");
  var envMenuQuerySQL = "name=\"ENV RECORDS\"";
  if (envMenu.doSelect(envMenuQuerySQL) == RC_SUCCESS) {
    // duplicate the original env menu
    var oldEnvMenu = new SCFile("menu");
    system.vars.$L_void=system.functions.fduplicate(oldEnvMenu, envMenu);

    for(var j=envMenu.description.length()-1; j>=0; j--) {
        if(lib.ArrayUtil.indexOf(ENV_MENU_ITEM_DESCS, envMenu.description[j])>=0) {
          print("Remove Menu Item \"" + envMenu.description[j]);
            envMenu.option[j] = null;
            envMenu.group[j] = null;
            envMenu.description[j] = null;
            envMenu.command[j] = null;
            envMenu.application[j] = null;
            envMenu.pname[j] = null;
            envMenu.pvalue[j] = null;
            envMenu.thread[j] = null;
            envMenu.condition[j] = null;
            envMenu.system[j] = null;
        }
      }
      envMenu.doUpdate();
      addSMPatches(envMenu, oldEnvMenu, "menu;" + envMenu.name, "update");
  } else {
    print("Can not find the menu \"ENV RECORDS\", ignore the removing\"!");
  }
    print("Finish removing the PD Help Desk ENV menus items");

    print("Removing the PD Help Desk Profile menu items under \"System Administration->Onging Maintenance-> Profiles\"...");
    var profileMenu = new SCFile("menu");
  var profileMenuQuerySQL = "name=\"MODULE PROFILES\"";
  if (profileMenu.doSelect(profileMenuQuerySQL) == RC_SUCCESS) {
    // duplicate the original env menu
    var oldprofileMenu = new SCFile("menu");
    system.vars.$L_void=system.functions.fduplicate(oldprofileMenu, profileMenu);

    for(var j=profileMenu.description.length()-1; j>=0; j--) {
        if(lib.ArrayUtil.indexOf(PROFILE_MENU_ITEM_DESCS, profileMenu.description[j])>=0) {
          print("Remove Menu Item \"" + profileMenu.description[j]);
            profileMenu.option[j] = null;
            profileMenu.group[j] = null;
            profileMenu.description[j] = null;
            profileMenu.command[j] = null;
            profileMenu.application[j] = null;
            profileMenu.pname[j] = null;
            profileMenu.pvalue[j] = null;
            profileMenu.thread[j] = null;
            profileMenu.condition[j] = null;
            profileMenu.system[j] = null;
        }
      }
      profileMenu.doUpdate();
      addSMPatches(profileMenu, oldprofileMenu, "menu;" + profileMenu.name, "update");
  } else {
    print("Can not find the menu \"MODULE PROFILES\", ignore the removing\"!");
  }
    print("Finish removing the PD Help Desk Profile menus items");

    print("Change the menu commands...");
    changeMenuCommands(ORG_SD_COMMANDS, NEW_SD_COMMANDS);
    changeMenuCommands(ORG_IM_COMMANDS, NEW_IM_COMMANDS);
    print("Finish Changing the menu commands");

  print("Finish enabling Menus");
}

function changeMenuCommands(orgCommands, newCommands) {
    for(var i=0; i<orgCommands.length; i++) {
        print("Changing for command \"" + orgCommands[i] + "\" to \"" + newCommands[i] + "\"...");
        var menu = new SCFile("menu");
    var menuQuerySQL = "command=\"" + orgCommands[i] + "\"";

    if (menu.doSelect(menuQuerySQL) == RC_SUCCESS) {
        do {
            print("Change Command \"" + orgCommands[i] + "\" for menu \"" + menu.name + "\"");
          if(null!=menu.command) {
            // duplicate the original menu
          var oldMenu = new SCFile("menu");
          system.vars.$L_void=system.functions.fduplicate(oldMenu, menu);

              for(var k=0; k<menu.command.length(); k++) {
                if(menu.command[k] == orgCommands[i]) {
                  print("Change Command \"" + orgCommands[i] + "\" for menu item \"" + menu.description[k] + "\"");
                  menu.command[k] = newCommands[i];
              }
            }
              menu.doUpdate();
              addSMPatches(menu, oldMenu, "menu;" + menu.name, "update");
            }
        } while (menu.getNext() == RC_SUCCESS)

          print("Changed for command \"" + orgCommands[i] + "\".");
    } else {
        // Ignore it if the menu does not exist
      print("Can not find the command \"" + orgCommands[i] + "\", ignore the change!");
    }
    }
}

function getNextAvailableMenuOption(menu, length) {

    var maxOption=0;
    if(!length)
    {
        length=getMenuItemLength(menu);    	
    }
    
    for(var i=0;i<length;++i)
    {    	
    	if(maxOption<menu.option[i])
    	maxOption=menu.option[i];	
    	
    }
    return maxOption+1;
}

function getMenuItemLength(menu) {
    if(null==menu) {
      return 0;
    }

    var retLen = 0;
    if(null!=menu.option) {
        retLen = Math.max(retLen, menu.option.length());
    }
    if(null!=menu.group) {
        retLen = Math.max(retLen, menu.group.length());
    }
    if(null!=menu.description) {
        retLen = Math.max(retLen, menu.description.length());
    }
    if(null!=menu.command) {
        retLen = Math.max(retLen, menu.command.length());
    }
    if(null!=menu.application) {
        retLen = Math.max(retLen, menu.application.length());
    }
    if(null!=menu.pname) {
        retLen = Math.max(retLen, menu.pname.length());
    }
    if(null!=menu.pvalue) {
        retLen = Math.max(retLen, menu.pvalue.length());
    }
    if(null!=menu.thread) {
        retLen = Math.max(retLen, menu.thread.length());
    }
    if(null!=menu.condition) {
        retLen = Math.max(retLen, menu.condition.length());
    }
    if(null!=menu.system) {
        retLen = Math.max(retLen, menu.system.length());
    }

    return retLen;
}

function enableSearchConfigs() {
  print("Start enabling SearchConfigs...");

    for(var i=0; i<SEARCHCONFIG_TABLENAMES.length; i++) {
        print("Enabling SearchConfig \"" + SEARCHCONFIG_TABLENAMES[i] + "\"...");
        var searchConfig = new SCFile("SearchConfig");
    var querySQL = "tablename=\"" + SEARCHCONFIG_TABLENAMES[i] + "\"";
    // find the SearchConfig
    if (searchConfig.doSelect(querySQL) == RC_SUCCESS) {
      // duplicate the original SearchConfig
      var oldSearchConfig = new SCFile("SearchConfig");
      system.vars.$L_void=system.functions.fduplicate(oldSearchConfig, searchConfig);

      // change the searchFormat
      searchConfig.searchFormat = SEARCHCONFIG_PD_SEARCHFORMATS[i];
      searchConfig.doUpdate();
      addSMPatches(searchConfig, oldSearchConfig, "SearchConfig;" + searchConfig.tablename, "update");
          print("Enabled SearchConfig \"" + SEARCHCONFIG_TABLENAMES[i] + "\".");
    } else {
        // Ignore it if SearchConfig does not exist
      print("Can not find the SearchConfig, ignore the enabling for SearchConfig \"" + SEARCHCONFIG_TABLENAMES[i] + "\"!");
    }
    }

    for(var i=0; i<SEARCHCONFIG_TOBE_DISABLED_TABLENAMES.length; i++) {
        print("Disabling SearchConfig \"" + SEARCHCONFIG_TOBE_DISABLED_TABLENAMES[i] + "\"...");
        var searchConfig = new SCFile("SearchConfig");
    var querySQL = "tablename=\"" + SEARCHCONFIG_TOBE_DISABLED_TABLENAMES[i] + "\"";
    // find the SearchConfig
    if (searchConfig.doSelect(querySQL) == RC_SUCCESS) {
      // duplicate the original SearchConfig
      var oldSearchConfig = new SCFile("SearchConfig");
      system.vars.$L_void=system.functions.fduplicate(oldSearchConfig, searchConfig);

      // update the tablename to xx_disabled_by_PDHD
      if(searchConfig.allowAdvAccess!=null) {
        searchConfig.allowAdvAccess = system.functions.parse(system.functions.str(searchConfig.allowAdvAccess) + " and false",2)
      } else {
        searchConfig.allowAdvAccess = system.functions.parse("false",2)
      }
      searchConfig.doUpdate();
      addSMPatches(searchConfig, oldSearchConfig, "SearchConfig;" + searchConfig.tablename, "update");
          print("Disabled SearchConfig \"" + SEARCHCONFIG_TOBE_DISABLED_TABLENAMES[i] + "\".");
    } else {
        // Ignore it if SearchConfig does not exist
      print("Can not find the SearchConfig, ignore the disabling for SearchConfig \"" + SEARCHCONFIG_TOBE_DISABLED_TABLENAMES[i] + "\"!");
    }
    }

    print("Finish enabling SearchConfigs");
}

function enableQueueDisplays() {
    print("Start enabling Display Options...");
    for(var i=0; i<QUEUE_DO_IDS.length; i++) {
        print("Enabling Display Option \"" + QUEUE_DO_IDS[i] + "\"...");
        var pdDisplayOption = new SCFile("displayoption");
    var pdQuerySQL = "id=\"" + QUEUE_DO_IDS[i] + PDTMP_SUFFIX + "\" and screen.id=\"" + QUEUE_DS_ID + PDTMP_SUFFIX + "\"";
    // find the PD temp Display Option first
    if (pdDisplayOption.doSelect(pdQuerySQL) == RC_SUCCESS) {
      var legacyDisplayOption = new SCFile("displayoption");
      var legacyQuerySQL = "id=\"" + QUEUE_DO_IDS[i] + "\" and screen.id=\"" + QUEUE_DS_ID + "\"";
      // find the legacy Display Option, rename it if it exists.
      var oldLegacyDisplayOption = null;
      if (legacyDisplayOption.doSelect(legacyQuerySQL) == RC_SUCCESS) {
        // duplicate the original legacy displayoption
        oldLegacyDisplayOption = new SCFile("displayoption");
        system.vars.$L_void=system.functions.fduplicate(oldLegacyDisplayOption, legacyDisplayOption);

        legacyDisplayOption.id = QUEUE_DO_IDS[i] + LEGACY_SUFFIX;
        legacyDisplayOption.screen_id = QUEUE_DS_ID + LEGACY_SUFFIX;
        legacyDisplayOption.doUpdate();
        // we do NOT put the legacy DisplayOption into smpatches as the id field is changed
        // ...

        print("Renamed the legacy Display Option name to \"" + legacyDisplayOption.id + "\"");
      } else {
        legacyDisplayOption = null;
        print("The legacy Display Option does not exist.");
      }

      // rename the PD temp Display Option
      pdDisplayOption.id = QUEUE_DO_IDS[i];
      pdDisplayOption.screen_id = QUEUE_DS_ID;
      pdDisplayOption.doUpdate();
      
      // insert to table forcedobjects
	  forceObject("displayoption", pdDisplayOption, legacyDisplayOption);
      addSMPatches(pdDisplayOption, oldLegacyDisplayOption, "displayoption;" + pdDisplayOption.id, "update");
          print("Enabled Display Option \"" + QUEUE_DO_IDS[i] + "\".");
    } else {
        // Ignore it if PD temp Display Option does not exist
      print("Can not find the temp PD Display Option, ignore the enabling for Display Option \"" + QUEUE_DO_IDS[i] + "\"!");
    }
    }
    print("Finish enabling Display Options");
}

function enableRelatedRecordLinks() {
    print("Start enabling Related Record Links...");
    updateLinks(RELATED_RECORD_LINKS, RELATED_RECORD_LINKLINES);
    print("Finish enabling Related Record Links");

    print("Start enabling Related Record Global Lists...");
    appendToGL(RELATED_GL_NAMES, RELATED_GL_LIST_VARS_APPEND, RELATED_GL_DISP_VARS_APPEND, RELATED_GL_MSG_VARS_APPEND);
    removeFromGL(RELATED_GL_NAMES, RELATED_GL_LIST_VARS_REMOVE, RELATED_GL_DISP_VARS_REMOVE, RELATED_GL_MSG_VARS_REMOVE);
    print("Finish enabling Related Record Global Lists");
    
    print("Start enabling Known Error screlationtype records");
    var screlationtype = new SCFile("screlationtype");
    var rc = screlationtype.doSelect('source.type="ke" or target.type="ke"');
    if(rc == RC_SUCCESS){
      do{
        if(screlationtype.isRelatedRecord != true) {
          screlationtype.isRelatedRecord=true;
          screlationtype.doSave();
        }
      }while(screlationtype.getNext()==RC_SUCCESS)
    }
    print("Finish enabling Known Error screlationtype records");     
}

function updateKMRecords() {
    print("Start enabling KM Formats changing related...");
    // for "kmknowledgebase.advsearch.g" -> "kmknowledgebase.advsearch.pd.g"
    replaceFieldValue(new Array("kmquery.advancedoptions"), "Process", "process", "pre.expressions", KM_FORM_1_ORG_REGEXP, KM_FORM_1_NEW_VALUE);

    replaceFieldValue(new Array("kmknowledgebase.search.view_fill", "kmknowledgebase.search.view_find", "kmquery.default_newsearch_1"), "displayoption", "id", "condition", KM_FORM_1_ORG_REGEXP, KM_FORM_1_NEW_VALUE);
    // for "PM.error.km" -> "PM.error.km.pd"
    replaceFieldValue(new Array("kmquery.linkrequest"), "Process", "process", "javascript.pre", KM_FORM_2_ORG_REGEXP, KM_FORM_2_NEW_VALUE);
    // for "PM.problem.km" -> "PM.problem.km.pd"
    replaceFieldValue(new Array("kmquery.linkrequest"), "Process", "process", "javascript.pre", KM_FORM_3_ORG_REGEXP, KM_FORM_3_NEW_VALUE);
    print("Finish enabling KM Formats changing related");

    print("Start enabling KM Links...");
    updateLinks(KM_LINKS, KM_LINKLINES);
    print("Finish enabling KM Links");
}

function replaceKMRecords() {
	print("Start enabling KM Knowledgebases...");
    replaceRecords(KM_KNOWLEDGEBASES, "kmknowledgebase", "kbname");
    print("Finish enabling KM Knowledgebases");
}


function replaceKMTempRecords() {
	print("Start enabling KM Knowledgebases...");
    replaceRecords(KM_KNOWLEDGEBASES, "kmknowledgebasetemp", "kbname");
    print("Finish enabling KM Knowledgebases");
}

function enableInboxes() {
    print("Start enabling Inboxes...");

    print("Enabling inboxes feature in Object imTask...");
    updateRecords(ENABLE_QUEUE_IN_OBJECTS, "Object", "file.name", "scm.condition", system.functions.parse("lioption(\"Incident Management\")",2));
    updateInboxes(ENABLE_QUEUES);
    print("Enabled inboxes feature in Object imTask");

    print("Finish enabling Inboxes");
}

function enableSLA() {
    print("Start enabling SLA...");

    appendToGL(SLA_GL_NAMES, SLA_GL_LIST_VARS, SLA_GL_DISP_VARS);
    //update status progession list to PD version for SLA module control of interaction
    updateRecords(["incidents"], "slamodulecontrol", "table.name", "status.progression", SLA_SD_STATUS_PROGESSION);
    updateRecords(["incidents"], "slamodulecontrol", "table.name", "use.phases", false);
    //update status progession list to PD version for SLA module control of incident
    updateRecords(["probsummary"], "slamodulecontrol", "table.name", "status.progression", SLA_IM_STATUS_PROGESSION);
    updateRecords(["probsummary"], "slamodulecontrol", "table.name", "use.phases", false);
    //update status progession list to PD version for SLA module control of problem
    updateRecords(["rootcause"], "slamodulecontrol", "table.name", "status.progression", SLA_PBM_STATUS_PROGESSION);
    updateRecords(["rootcause"], "slamodulecontrol", "table.name", "response.state.field", "rcStatus");
    updateRecords(["rootcause"], "slamodulecontrol", "table.name", "use.phases", false);
    //update status progession list to PD version for SLA module control of problem task
    updateRecords(["rootcausetask"], "slamodulecontrol", "table.name", "status.progression", SLA_PBMT_STATUS_PROGESSION);
    updateRecords(["rootcausetask"], "slamodulecontrol", "table.name", "use.phases", false);
    //update status progession list to PD version for SLA module control of Service Catalog
    updateRecords(["svcCartItem"], "slamodulecontrol", "table.name", "use.phases", false);
    
    

    print("Finish enabling SLA");
}

function enableSecurity() {
    print("Start enabling Security...");

    lib.IncidentUpgradeManager.getInstance().upgradeProfiles();
    var ret = 0;
     system.functions.rtecall("trigger", ret, 0);
    lib.IncidentUpgradeManager.getInstance().upgradeOperators();
     system.functions.rtecall("trigger", ret, 1);
    lib.IncidentUpgradeManager.getInstance().upgradeUserRoles();
    lib.ServiceDeskUpgradeManager.getInstance().upgradeProfiles();
     system.functions.rtecall("trigger", ret, 0);
    lib.ServiceDeskUpgradeManager.getInstance().upgradeOperators();
     system.functions.rtecall("trigger", ret, 1);
    lib.ServiceDeskUpgradeManager.getInstance().upgradeUserRoles();
    lib.ProblemUpgradeManager.getInstance().upgradeProfiles();
     system.functions.rtecall("trigger", ret, 0);
    lib.ProblemUpgradeManager.getInstance().upgradeOperators();
     system.functions.rtecall("trigger", ret, 1);
    lib.ProblemUpgradeManager.getInstance().upgradeUserRoles();
    


    print("Finish enabling Security");
}
function updateSD() {
    print("Start enabling SD module...");
    updateLinks(SD_LINKS_1, SD_LINKLINES_1);
    updateLinks(SD_LINKS_2, SD_LINKLINES_2, SD_LINKLINES_changeorder_2);
    updateLinks(SD_LINKS_3, SD_LINKLINES_3, SD_LINKLINES_changeorder_3);
    updateRecords(SD_SVCCATINTERFACES, "svcCatInterface", "interface.name", "process.name", "im.first.PD");
    disableActivityActions(SD_DISABLE_ACTIVITYACTIONS, 'incidents');
    print("Finish enabling SD module");
}

function replaceSD() {
	replaceRecords(SD_SCRELCONFIGS, "screlconfig", "filename");
	replaceValidities();
	replaceActivityActions(SD_REPLACE_ACTIVITYACTIONS, 'incidents');
}

function replaceValidities() {
  for(var i=0; i<SD_VALIDITY_FIELDS.length; i++) {
        print("Enabling validity \"" + SD_VALIDITY_FIELDS[i] + "\"...");
        var pdRecord = new SCFile("validity");
    var pdQuerySQL = "filename=\"" + SD_VALIDITY_FILENAME + PDTMP_SUFFIX_SHORT + "\" and field.name=\"" + SD_VALIDITY_FIELDS[i] + "\" and sequence=\"" + SD_VALIDITY_SEQUENCES[i] + "\"";

    // find the PD temp record first
    if (pdRecord.doSelect(pdQuerySQL) == RC_SUCCESS) {
      var legacyRecord = new SCFile("validity");
      var legacyQuerySQL = "filename=\"" + SD_VALIDITY_FILENAME + "\" and field.name=\"" + SD_VALIDITY_FIELDS[i] + "\" and sequence=\"" + SD_VALIDITY_SEQUENCES[i] + "\"";

      // find the legacy Record, rename it if it exists.
      var oldLegacyRecord = null;
      if (legacyRecord.doSelect(legacyQuerySQL) == RC_SUCCESS) {
        // duplicate the original legacy validity
        oldLegacyRecord = new SCFile("validity");
        system.vars.$L_void=system.functions.fduplicate(oldLegacyRecord, legacyRecord);

        legacyRecord["filename"] = SD_VALIDITY_FILENAME + LEGACY_SUFFIX_SHORT;
        for(var fileLength=0; fileLength<legacyRecord["files"].length(); fileLength++) {
          legacyRecord["files"][fileLength] = legacyRecord["files"][fileLength] + LEGACY_SUFFIX_SHORT;
        }
        legacyRecord.doUpdate();
        // we do NOT put the legacy validity into smpatches as the unique field is changed
        // ...
        print("Renamed the legacy validity" + SD_VALIDITY_FILENAME);
      } else {
        legacyRecord = null;
        print("The legacy validity \"" + SD_VALIDITY_FILENAME + "\" does not exist.");
      }

      // rename the PD temp Record name
      pdRecord["filename"] = SD_VALIDITY_FILENAME;
      for(var fileLength=0; fileLength<pdRecord["files"].length(); fileLength++) {
        // currently the files always is "joinsvcDisplay" in OOB
        pdRecord["files"][fileLength] = "joinsvcDisplay";
      }
      pdRecord.doUpdate();
      
      // insert to table forcedobjects
	  forceObject("validity", pdRecord, legacyRecord);
      addSMPatches(pdRecord, oldLegacyRecord, "validity;" + pdRecord.field_name + ";" + pdRecord.sequence + ";" + pdRecord.filename, "update");
          print("Enabled validity \"" + SD_VALIDITY_FILENAME + "\".");
    } else {
        // Ignore it if PD temp Record does not exist
      print("Can not find the temp PD validity " + SD_VALIDITY_FIELDS[i] + ", ignore!");
    }
    }
}

function enableCategoryLinks() {
    updateLinks(CATEGORY_RELATED_LINKS, CATEGORY_RELATED_LINKLINES);
}

function enableModuleStatus() {
  print("Start enabling ModuleStatus...");
  var record = new SCFile("ModuleStatus");
  for(var i=0; i<PD_MODULE_STATUS.length; i++) {
      record.module=PD_MODULE_STATUS[i][0];
      record.status=PD_MODULE_STATUS[i][1];
      record.sort_order=PD_MODULE_STATUS[i][2];
      record.doSave();
      addSMPatches(record, record, "ModuleStatus;" + record.module + ";" + record.status, "add");
  }
  
  updateModuleStatus();
  print("Finish enabling ModuleStatus");
}

function updateModuleStatus() {
    for(var i = 0; i < PD_MODULES_STATUS_UPDATE.length; i++){
    var pdRecord = new SCFile("ModuleStatus");
    var pdQuerySQL = "module=\"" + PD_MODULES_STATUS_UPDATE[i].module + "\" and status=\"" + PD_MODULES_STATUS_UPDATE[i].status + "\"";
    // find the record first
    if (pdRecord.doSelect(pdQuerySQL) == RC_SUCCESS) {
      do {
            print("Update ModuleStatus \"" + PD_MODULES_STATUS_UPDATE[i].status + "\" of module \"" + PD_MODULES_STATUS_UPDATE[i].module + "\" to \"" + PD_MODULES_STATUS_UPDATE[i].newStatus + "\".");
        pdRecord.status = PD_MODULES_STATUS_UPDATE[i].newStatus;
        pdRecord.doUpdate();
        // below smpatches record should be added as action "update", but the module field is one of the key filed, so here we have to still treat it as action "add"
        addSMPatches(pdRecord, pdRecord, "ModuleStatus;" + pdRecord.module + ";" + pdRecord.status, "add");
        } while (pdRecord.getNext() == RC_SUCCESS)
    } else {
        // Ignore it if PD temp Record does not exist
      print("Can not find the temp PD ModuleStatus, ignore the enabling for ModuleStatus \"" + PD_MODULES_STATUS_UPDATE[i].status + "\"!");
    }
  }
}

function enableAlertDefs() {
    print("Start enabling AlertDefs...");
    replaceRecords(REPLACE_ALERT_DEFS, "AlertDef", "name");
    print("Finish enabling AlertDefs");
}

function enableContextActions() {
    print("Start enabling contextAction...");
    replaceRecords(REPLACE_CONTEXT_ACTIONS, "contextAction", "name");
    print("Finish enabling contextAction");
}

/**function enableExtaccesses() {
    print("Start enabling extaccess...");
    for(var i = 0; i < ENABLE_EXTACCESS.length; i++){
    var pdRecord = new SCFile("extaccess");
    var pdQuerySQL = "name=\"" + ENABLE_EXTACCESS[i].name + "\"";
    // find the record first
    if (pdRecord.doSelect(pdQuerySQL) == RC_SUCCESS) {
      do {
        // duplicate the original extaccess
        var oldPdRecord = new SCFile("extaccess");
        system.vars.$L_void=system.functions.fduplicate(oldPdRecord, pdRecord);

        // go through the allowed.actions
        for(var j=pdRecord["allowed.actions"].length()-1;j>=0; j--) {
          if(lib.ArrayUtil.indexOf(ENABLE_EXTACCESS[i].removedActions, pdRecord["allowed.actions"][j])>=0) {
              print("removing action \"" + pdRecord["allowed.actions"][j] + "\" of \"extaccess \"" + pdRecord["service.name"] + "\" of file \"" + pdRecord["name"] + "\".");
            pdRecord.allowed_actions=system.functions._delete(pdRecord.allowed_actions,j+1);
            pdRecord.action_names=system.functions._delete(pdRecord.action_names,j+1);
            pdRecord.action_type=system.functions._delete(pdRecord.action_type,j+1);
            pdRecord.execute_actions=system.functions._delete(pdRecord.execute_actions,j+1);
          }
        }
        pdRecord.doUpdate();
        addSMPatches(pdRecord, oldPdRecord, "extaccess;" + pdRecord.object_name + ";" + pdRecord.service_name, "update");
            print("Enabled extaccess \"" + pdRecord["service.name"] + "\" of file \"" + pdRecord["name"] + "\".");
        } while (pdRecord.getNext() == RC_SUCCESS)
    } else {
        // Ignore it if PD temp Record does not exist
      print("Can not find the temp PD extaccess, ignore the enabling for extaccess \"" + ENABLE_EXTACCESS[i].name + "\"!");
    }
  }
    
    print("Finish enabling extaccess");

}*/

function removeModuleStatus() {
    print("Start removing HelpDesk ModuleStatus...");
    var pdRecord=null;
    var pdQuerySQL="";
    for(var i = 0; i < ENABLE_HELPDESK_DELETE_MODULESTATUS.length; i++){
      for (j=0;j<ENABLE_HELPDESK_DELETE_MODULESTATUS[i].status.length;j++){
      pdRecord = new SCFile("ModuleStatus");
      pdQuerySQL = "module=\"" + ENABLE_HELPDESK_DELETE_MODULESTATUS[i].module + "\" and status=\"" + ENABLE_HELPDESK_DELETE_MODULESTATUS[i].status[j] + "\"";
      if (pdRecord.doSelect(pdQuerySQL) == RC_SUCCESS) {
        lib.ProcessDesignerEnablementUtil.forceObject("ModuleStatus", pdRecord);
        pdRecord.doDelete();
      } 
      else{
          // Ignore it if PD temp Record does not exist
        print("Can not find the temp HelpDesk ModuleStatus of "+ENABLE_HELPDESK_DELETE_MODULESTATUS[i].module+"--"+ENABLE_HELPDESK_DELETE_MODULESTATUS[i].status[j]);
      }
    }
  }
  
    pdRecord=new SCFile("irfields");
    pdQuerySQL = "name=\"probsummary\" and fieldname=\"brief.description\"";
    if (pdRecord.doSelect(pdQuerySQL) == RC_SUCCESS) {
    pdRecord.doDelete();
  } 
  else{
     // Ignore it if PD temp Record does not exist
    print("Can not find the temp irfields record of probsummary--brief.description");
  }
    print("Finish removing HelpDesk ModuleStatus...");
}


function enableHelpDeskExtaccesses() {
    print("Start enabling HelpDesk extaccess...");
    for(var i = 0; i < ENABLE_HELPDESK_EXTACCESS.length; i++){
    var pdRecord = new SCFile("extaccess");
    var pdQuerySQL = "object.name=\"" + ENABLE_HELPDESK_EXTACCESS[i].objectName + "\" and name=\"" + ENABLE_HELPDESK_EXTACCESS[i].name + "\"";
    // find the record first
    if (pdRecord.doSelect(pdQuerySQL) == RC_SUCCESS) {
      do {
        // duplicate the original extaccess
        var oldPdRecord = new SCFile("extaccess");
        system.vars.$L_void=system.functions.fduplicate(oldPdRecord, pdRecord);
        if(ENABLE_HELPDESK_EXTACCESS[i].removedAllowedActions.length>0){
          
          for(var j=pdRecord["allowed.actions"].length()-1;j>=0; j--) {
            if(lib.ArrayUtil.indexOf(ENABLE_HELPDESK_EXTACCESS[i].removedAllowedActions, pdRecord["allowed.actions"][j])>=0) {
                print("removing action \"" + pdRecord["allowed.actions"][j] + "\" of \"extaccess \"" + pdRecord["service.name"] + "\" of file \"" + pdRecord["name"] + "\".");
              pdRecord.allowed_actions=system.functions._delete(pdRecord.allowed_actions,j+1);
              pdRecord.action_names=system.functions._delete(pdRecord.action_names,j+1);
              pdRecord.action_type=system.functions._delete(pdRecord.action_type,j+1);
              pdRecord.execute_actions=system.functions._delete(pdRecord.execute_actions,j+1);
            }
          }
        }
        if(ENABLE_HELPDESK_EXTACCESS[i].addedField.length>0){
          for (var h=0;h<ENABLE_HELPDESK_EXTACCESS[i].addedField.length;h++){
            pdRecord["soafield"].push(ENABLE_HELPDESK_EXTACCESS[i].addedField[h]);
            pdRecord["soacaption"].push(ENABLE_HELPDESK_EXTACCESS[i].addedCaption[h]);
            
          }
        }
        if(ENABLE_HELPDESK_EXTACCESS[i].modifiedExpression.length>0){
          pdRecord["expressions"] = system.functions.denull(pdRecord["expressions"]);
          for (var m=0;m<ENABLE_HELPDESK_EXTACCESS[i].modifiedExpression.length;m++){
            pdRecord["expressions"].push(system.functions.parse(ENABLE_HELPDESK_EXTACCESS[i].modifiedExpression[m],11));
          }
        }
        pdRecord.doUpdate();
        addSMPatches(pdRecord, oldPdRecord, "extaccess;" + pdRecord.object_name + ";" + pdRecord.service_name, "update");
        print("Enabled extaccess \"" + pdRecord["object.name"] + "--"+ pdRecord["service.name"] + "\" of file \"" + pdRecord["name"] + "\".");
      } while (pdRecord.getNext() == RC_SUCCESS)
    } else {
        // Ignore it if PD temp Record does not exist
      print("Can not find the temp HelpDesk extaccess, ignore the enabling for extaccess \"" + ENABLE_CM_EXTACCESS[i].name + "\"!");
    }
  }
    
    print("Finish enabling HelpDesk extaccess");
}


/**
 * The common private function for update a list of links to disable the 
 * related linklines by changing the linkline to xxx_disabled_by_PDHD, and 
 * and enable linkline by changing the tmp PD record from xxx_for_pd4_tobe_used
 * to xxx.
 * @param links the list of link.
 * @param linklines the linklines to be enabled.
 */
function updateLinks(links, linklines, changeorders) {
    if(null == links) {
      return;
    }
 
    for(var i=0; i<links.length; i++) {
        print("Enabling link \"" + links[i] + "\"...");
        var pdRecord = new SCFile("link");
    var pdQuerySQL = "name=\"" + links[i] + "\"";
    // find the link first
    if (pdRecord.doSelect(pdQuerySQL) == RC_SUCCESS) {
      // duplicate the original link
      var oldPdRecord = new SCFile("link");
      system.vars.$L_void=system.functions.fduplicate(oldPdRecord, pdRecord);

      for(var j=0; j<linklines.length; j++) {
          var orgIndex = -1;
          var newIndex = -1;
          for(var k=0; k<pdRecord.source_fields.length(); k++) {
              if(linklines[j]==pdRecord.source_fields[k]) {
                  orgIndex = k;
              }
              if((linklines[j]+PDTMP_SUFFIX)==pdRecord.source_fields[k]) {
                  newIndex = k;
              }
          }
                if (orgIndex != -1 && newIndex != -1) {
                    print("Update the legacy link line from \"" + linklines[j] + "\" to \"" + linklines[j] + LEGACY_SUFFIX + "\"");
                    pdRecord.source_fields[orgIndex] = linklines[j] + LEGACY_SUFFIX;
                    print("Update the PD temp link line from \"" + linklines[j] + PDTMP_SUFFIX + "\" to \"" + linklines[j] + "\"");
                    pdRecord.source_fields[newIndex] = linklines[j];
                    if (changeorders != null && changeorders[j] == true) {
                        changeLinklinePosition(pdRecord, orgIndex, newIndex);
                    }
          }
      }

      // rename the linkline
      pdRecord.doUpdate();
      addSMPatches(pdRecord, oldPdRecord, "link;" + pdRecord.name, "update");
          print("Enabled link \"" + links[i] + "\".");
    } else {
        // Ignore it if link does not exist
      print("Can not find the link, ignore the enabling for link \"" + links[i] + "\"!");
    }
    }
}

function changeLinklinePosition (link, orgIdx, newIdx) {
    var tmpSourcefield = link.source_fields[orgIdx];
    link.source_fields[orgIdx] = link.source_fields[newIdx];
    link.source_fields[newIdx] = tmpSourcefield;

    var tmpTargetFiles = link.target_files[orgIdx];
    link.target_files[orgIdx] = link.target_files[newIdx];
    link.target_files[newIdx] = tmpTargetFiles;

    var tmpTargetFields = link.target_fields[orgIdx];
    link.target_fields[orgIdx] = link.target_fields[newIdx];
    link.target_fields[newIdx] = tmpTargetFields;

    var tmpComment = link.comment[orgIdx];
    link.comment[orgIdx] = link.comment[newIdx];
    link.comment[newIdx] = tmpComment;

    var tmpAddQuery = link.add_query[orgIdx];
    link.add_query[orgIdx] = link.add_query[newIdx];
    link.add_query[newIdx] = tmpAddQuery;

    var tmpQbeFormat = link.qbe_format[orgIdx];
    link.qbe_format[orgIdx] = link.qbe_format[newIdx];
    link.qbe_format[newIdx] = tmpQbeFormat;

    //project.source.fields, for array type we need to use syste.vars.$L.xxx
    system.vars.$L_tmpProjectSourceFields = link.project_source_fields[orgIdx];
    link.project_source_fields[orgIdx] = link.project_source_fields[newIdx];
    link.project_source_fields[newIdx] = system.vars.$L_tmpProjectSourceFields;

    //project.target.fields, for array type we need to use syste.vars.$L.xxx
    system.vars.$L_tmpProjectTargetFields = link.project_target_fields[orgIdx];
    link.project_target_fields[orgIdx] = link.project_target_fields[newIdx];
    link.project_target_fields[newIdx] = system.vars.$L_tmpProjectTargetFields;

    // link.expressions, for array type we need to use syste.vars.$L.xxx
    system.vars.$L_tmpLinkExpressions = link.link_expressions[orgIdx];
    link.link_expressions[orgIdx] = link.link_expressions[newIdx];
    link.link_expressions[newIdx] = system.vars.$L_tmpLinkExpressions;

    // post.expressions, for array type we need to use syste.vars.$L.xxx
    system.vars.$L_tmpPostExpressions = link.post_expressions[orgIdx];
    link.post_expressions[orgIdx] = link.post_expressions[newIdx];
    link.post_expressions[newIdx] = system.vars.$L_tmpPostExpressions;

    var tmpStructure = link.structure[orgIdx];
    link.structure[orgIdx] = link.structure[newIdx];
    link.structure[newIdx] = tmpStructure;

    var tmpTargetFormats = link.target_formats[orgIdx];
    link.target_formats[orgIdx] = link.target_formats[newIdx];
    link.target_formats[newIdx] = tmpTargetFormats;

    var tmpJavascriptPre = link.javascript_pre[orgIdx];
    link.javascript_pre[orgIdx] = link.javascript_pre[newIdx];
    link.javascript_pre[newIdx] = tmpJavascriptPre;

    var tmpJavascriptPost = link.javascript_post[orgIdx];
    link.javascript_post[orgIdx] = link.javascript_post[newIdx];
    link.javascript_post[newIdx] = tmpJavascriptPost;

    // ind.link, for array type we need to use syste.vars.$L.xxx
    system.vars.$L_tmpIndLink = link.ind_link[orgIdx];
    link.ind_link[orgIdx] = link.ind_link[newIdx];
    link.ind_link[newIdx] = system.vars.$L_tmpIndLink;
}

/**
 * The common private function for replacing a list of legacy records with PD records
 * by changing the key filed value of legacy record from xxx to xxx_disabled_by_PDHD
 * and changing the tmp PD record from xxx_for_pd4_tobe_used to xxx.
 * @param records the list of record names which to be replaced.
 * @param fileName  the file name of the records.
 * @param keyField  the key field name of the records.
 */
function replaceRecords(records, fileName, keyField) {
    if(null == records) {
      return;
    }

    for(var i=0; i<records.length; i++) {
        print("Enabling " + fileName + " \"" + records[i] + "\"...");
        var pdRecord = new SCFile(fileName);
        var pdQuerySQL = keyField + "=\"" + records[i] + PDTMP_SUFFIX + "\"";
        // find the PD temp record first
        if (pdRecord.doSelect(pdQuerySQL) == RC_SUCCESS) {
          var legacyRecord = new SCFile(fileName);
          var legacyQuerySQL = keyField + "=\"" + records[i] + "\"";
          // find the legacy Record, rename it if it exists.
          var oldLegacyRecord = null;
          if (legacyRecord.doSelect(legacyQuerySQL) == RC_SUCCESS) {
            // duplicate the original legacy reocrd
            oldLegacyRecord = new SCFile(fileName);
            system.vars.$L_void=system.functions.fduplicate(oldLegacyRecord, legacyRecord);

            legacyRecord[keyField] = records[i] + LEGACY_SUFFIX;
            legacyRecord.doUpdate();
            print("Renamed the legacy " + fileName + " " + keyField + " to \"" + legacyRecord[keyField] + "\"");
          } else {
            legacyRecord = null;
            print("The legacy " + fileName + " does not exist.");
          }

          // rename the PD temp Record name
          pdRecord[keyField] = records[i];
          pdRecord.doUpdate();
          
          // insert to table forcedobjects
          forceObject(fileName, pdRecord, legacyRecord);
          addSMPatches(pdRecord, oldLegacyRecord, fileName + ";" + pdRecord[keyField], "update");
          print("Enabled " + fileName + " \"" + records[i] + "\".");
    } else {
        // Ignore it if PD temp Record does not exist
      print("Can not find the temp PD " + fileName + ", ignore the enabling for " + fileName + " \"" + records[i] + "\"!");
    }
    }
}

/**
 * The common private function for renaming a list of backup records with PD records
 * by changing the key filed value of backup record from xxx_for_pd4_tobe_used to xxx.
 * @param records the list of record names which to be renamed.
 * @param fileName  the file name of the records.
 * @param keyField  the key field name of the records.
 */
function renameRecords(records, fileName, keyField) {
    if(null == records) {
      return;
    }

    for(var i=0; i<records.length; i++) {
        print("Enabling " + fileName + " \"" + records[i] + "\"...");
        var pdRecord = new SCFile(fileName);
    var pdQuerySQL = keyField + "=\"" + records[i] + PDTMP_SUFFIX + "\"";
    // find the PD temp record first
    if (pdRecord.doSelect(pdQuerySQL) == RC_SUCCESS) {
      do {
        // rename the PD temp Record name
        pdRecord[keyField] = records[i];
        print("Renamed the temp " + fileName + " " + keyField + " from \"" + records[i] + PDTMP_SUFFIX + "\" to \"" + pdRecord[keyField] + "\"");
        pdRecord.doUpdate();
        addSMPatches(pdRecord, pdRecord, fileName + ";" + pdRecord[keyField], "add");
            print("Enabled " + fileName + " \"" + records[i] + "\".");
        } while (pdRecord.getNext() == RC_SUCCESS)
    } else {
        // Ignore it if PD temp Record does not exist
      print("Can not find the temp PD " + fileName + ", ignore the enabling for " + fileName + " \"" + records[i] + "\"!");
    }
    }
}

/**
 * The common private function for updating a list of records.
 * @param records the list of record names which to be updated.
 * @param fileName  the file name of the records.
 * @param keyField  the key field name of the records.
 * @param updateField the field name to be updated.
 * @param updateValue the value to be updated to the update field.
 */
function updateRecords(records, fileName, keyField, updateField, updateValue) {
    if(null == records) {
      return;
    }

    for(var i=0; i<records.length; i++) {
        print("Updating " + fileName + " \"" + records[i] + "\"...");
        var pdRecord = new SCFile(fileName);
    var pdQuerySQL = keyField + "=\"" + records[i] + "\"";
    // find the PD temp record first
    if (pdRecord.doSelect(pdQuerySQL) == RC_SUCCESS) {
      do {
        // duplicate the original datadict
        var oldPdRecord = new SCFile(fileName);
        system.vars.$L_void=system.functions.fduplicate(oldPdRecord, pdRecord);

        // rename the PD temp Record name
        pdRecord[updateField] = updateValue;
        pdRecord.doUpdate();
        addSMPatches(pdRecord, oldPdRecord, fileName + ";" + pdRecord[keyField], "update");

        print("Updated the field " + updateField + " of " + fileName + " " + records[i] + " to \"" + updateValue + "\"");
        } while (pdRecord.getNext() == RC_SUCCESS)
    } else {
        // Ignore it if PD temp Record does not exist
      print("Can not find the " + fileName + ", ignore the updating " + fileName + " \"" + records[i] + "\"!");
    }
    }
}

/**
 * The common private function for updating a list of records to replace a string in specified field.
 * @param records the list of record names which to be updated.
 * @param fileName  the file name of the records.
 * @param keyField  the key field name of the records.
 * @param updateField the field name to be updated.
 * @param orgString the value to be replaced, the substring or the regexp.
 * @param newString the new value to update the org string.
 */
function replaceFieldValue(records, fileName, keyField, updateField, orgString, newString) {
    if(null == records) {
      return;
    }

    for(var i=0; i<records.length; i++) {
        print("Updating " + fileName + " \"" + records[i] + "\"...");
        var pdRecord = new SCFile(fileName);
    var pdQuerySQL = keyField + "=\"" + records[i] + "\"";
    // find the record first
    if (pdRecord.doSelect(pdQuerySQL) == RC_SUCCESS) {
      do {
        // duplicate the original record
        var oldPdRecord = new SCFile(fileName);
        system.vars.$L_void=system.functions.fduplicate(oldPdRecord, pdRecord);

          if (pdRecord[updateField]==null) {
              continue;
          } else if (system.functions.type(pdRecord[updateField])==2) {// string type
              pdRecord[updateField] = pdRecord[updateField].replace(orgString, newString);
          } else if (system.functions.type(pdRecord[updateField])==10) {// operator type
            var str=system.functions.str(pdRecord[updateField]);
            str=str.replace(orgString, newString);
            pdRecord[updateField]=system.functions.parse(str, 2);
          } else if (system.functions.type(pdRecord[updateField])==8) { // array type
              for (var j=0; j<pdRecord[updateField].length(); j++) {
                  if (system.functions.type(pdRecord[updateField][j])==10) { // array of operator
                      var str=system.functions.str(pdRecord[updateField][j]);
                    str=str.replace(orgString, newString);
                    pdRecord[updateField][j]=system.functions.parse(str, 11);// we must use 11 here
                  } else {
                      print("Warning, unsupported of array of type " + system.functions.type(pdRecord[updateField]));
                  }
              }
          } else {
              print("Warning, unsupported type " + system.functions.type(pdRecord[updateField]));
          }
        pdRecord.doUpdate();
        addSMPatches(pdRecord, oldPdRecord, fileName + ";" + pdRecord[keyField], "update");
        
        print("Updated the field " + updateField + " of " + fileName + " " + records[i] + " to replace \"" + orgString + "\" to \"" + newString + "\"");
        } while (pdRecord.getNext() == RC_SUCCESS)
    } else {
        // Ignore it if Record does not exist
      print("Can not find the " + fileName + ", ignore the updating " + fileName + " \"" + records[i] + "\"!");
    }
    }
}

/**
 * The common private function for updating a list of inbox.
 * @param records the list of record which to be updated, the struct of this parameter is:
 *   [inboxName, operation:update/delete, [updateFields1,...], [updateToValue1,...]]
 */
function updateInboxes(records) {
    if(null == records) {
      return;
    }

    for(var i=0; i<records.length; i++) {
        print("Updating inbox \"" + records[i][0] + "\"...");
        var pdRecord = new SCFile("inbox");
    var pdQuerySQL = "inbox.name=\"" + records[i][0] + "\"";
    // find the record first
    if (pdRecord.doSelect(pdQuerySQL) == RC_SUCCESS) {
        if(ENABLE_QUEUE_OPERATION_DELETE==records[i][1]) {
            lib.ProcessDesignerEnablementUtil.forceObject("inbox", pdRecord);
            pdRecord.doDelete();
            // we do nothing for inbox deltion in smpatches
            print("Deleted the inbox \"" + records[i][0] + "\"");
        } else if(ENABLE_QUEUE_OPERATION_UPDATE==records[i][1]) {
            // duplicate the original datadict
          var oldPdRecord = new SCFile("inbox");
          system.vars.$L_void=system.functions.fduplicate(oldPdRecord, pdRecord);

            for(var j=0; j<records[i][2].length; j++) {
                pdRecord[records[i][2][j]] = records[i][3][j];
                print("Updating field \"" + records[i][2][j] + "\" to value \"" + records[i][3][j] + "\".");
            }
            
            if (oldPdRecord["inbox.name"] != pdRecord["inbox.name"]) {
            	// if the inbox name is changed, check if the new inbox name is exist or not
            	var checkRecord = $("inbox").select('inbox.name="' + pdRecord["inbox.name"] + '"').uniqueResult();
            	if (checkRecord == null) {
            		pdRecord.doUpdate();
					addSMPatches(pdRecord, oldPdRecord, "inbox;" + pdRecord.inbox_id, "update");
            
					print("Updated inbox \"" + records[i][0] + "\".");
            	}
            } else {
            	pdRecord.doUpdate();
				addSMPatches(pdRecord, oldPdRecord, "inbox;" + pdRecord.inbox_id, "update");
            
				print("Updated inbox \"" + records[i][0] + "\".");
			}
        } else {
            print("Unknown operation \"" + records[i][1] + "\", ingore the inbox \"" + records[i][0] + "\"");
        }
    } else {
        // Ignore it if PD temp Record does not exist
      print("Can not find the inbox, \"" + records[i][0] + "\", ignore it!");
    }
    }
}

/**
 * The common private function for appending a list to global list.
 * @param glNames the list of global list names which to be updated.
 * @param listVars  the values to be appended.
 * @param dispVars  the display values to be appended.
 * @param msgVars the message values to be appended.
 */
function appendToGL(glNames, listVars, dispVars, msgVars) {
    if(null == glNames) {
      return;
    }

    for(var i=0; i<glNames.length; i++) {
        print("Appending to global list \"" + glNames[i] + "\"...");
        var glRecord = new SCFile("globallists");
    var glQuerySQL = "name=\"" + glNames[i] + "\"";
    // find the gl record
    if (glRecord.doSelect(glQuerySQL) == RC_SUCCESS) {
      do {
        // duplicate the original datadict
        var oldGlRecord = new SCFile("globallists");
        system.vars.$L_void=system.functions.fduplicate(oldGlRecord, glRecord);

        // append the value if it is not in list
        for(var j=0; j<listVars.length; j++) {
          if(glRecord["value.list"].indexOf("\"" + listVars[j] + "\"") == -1) {
            print("Appended the value \"" + listVars[j] + "\" to global list " + glNames[i]);
            glRecord["value.list"] = glRecord["value.list"].replace("}", ", \"" + listVars[j] + "\"}");
            print("Appended the display value \"" + dispVars[j] + "\" to global list " + glNames[i]);
            glRecord["display.list"] = glRecord["display.list"].replace("}", ", \"" + dispVars[j] + "\"}");
            if(null!=msgVars && msgVars.length>=j+1 && null!=glRecord["message.list"]) {
              print("Appended the message value \"" + msgVars[j] + "\" to global list " + glNames[i]);
              glRecord["message.list"] = glRecord["message.list"].replace("}", ", \"" + msgVars[j] + "\"}");
            }
          } else {
            print("The globallist \"" + glNames[i] + "\" already contains value \"" + listVars[j] + "\", ignore it.");
          }
        }
        glRecord.doUpdate();
        addSMPatches(glRecord, oldGlRecord, "globallists;" + glRecord.name, "update");
        } while (glRecord.getNext() == RC_SUCCESS)
    } else {
        // Ignore it if gl Record does not exist
      print("Can not find the global list \"" + glNames[i] + "\", ignore the appending!");
    }
    }
}

/**
 * The common private function for removing a list from global list.
 * @param glNames the list of global list names which to be updated.
 * @param listVars  the values to be removed.
 * @param dispVars  the display values to be removed.
 * @param msgVars the message values to be removed.
 */
function removeFromGL(glNames, listVars, dispVars, msgVars) {
    if(null == glNames) {
      return;
    }

    for(var i=0; i<glNames.length; i++) {
        print("Appending to global list \"" + glNames[i] + "\"...");
        var glRecord = new SCFile("globallists");
    var glQuerySQL = "name=\"" + glNames[i] + "\"";
    // find the gl record
    if (glRecord.doSelect(glQuerySQL) == RC_SUCCESS) {
      do {
        // duplicate the original datadict
        var oldGlRecord = new SCFile("globallists");
        system.vars.$L_void=system.functions.fduplicate(oldGlRecord, glRecord);

        // remove the value if it is in list
        for(var j=0; j<listVars.length; j++) {
          if(glRecord["value.list"].indexOf("\"" + listVars[j] + "\"") == -1) {
            print("The globallist \"" + glNames[i] + "\" does not contains value \"" + listVars[j] + "\", ignore it.");
          } else {
            print("Removing the value \"" + listVars[j] + "\" from global list " + glNames[i]);
            glRecord["value.list"] = removeGLItem(glRecord["value.list"], listVars[j]);
            print("Removing the display value \"" + dispVars[j] + "\" from global list " + glNames[i]);
            glRecord["display.list"] = removeGLItem(glRecord["display.list"], dispVars[j]);
            if(null!=msgVars) {
              print("Removing the message value \"" + msgVars[j] + "\" from global list " + glNames[i]);
              glRecord["message.list"] = removeGLItem(glRecord["message.list"], msgVars[j]);
            }
          }
        }
        glRecord.doUpdate();
        addSMPatches(glRecord, oldGlRecord, "globallists;" + glRecord.name, "update");
        } while (glRecord.getNext() == RC_SUCCESS)
    } else {
        // Ignore it if gl Record does not exist
      print("Can not find the global list \"" + glNames[i] + "\", ignore the appending!");
    }
    }
}

function removeGLItem(glString, item) {
  // try the item is not at the end of the gl string
  var regExp = new RegExp("\"" + item + "\"\\s*,", "i");
  if(regExp.test(glString)) {
      
      glString = glString.replace(regExp, "");
      return glString;
  }

  // try the item is not at the beginning of the gl string
  regExp = new RegExp(",\\s*\"" + item + "\"", "i");
  if(regExp.test(glString)) {
      
      glString = glString.replace(regExp, "");
      return glString;
  }

  // try the item is the only one item of the gl (at the beginning/end of the gl string)
  regExp = new RegExp("\"" + item + "\"", "i");
  if(regExp.test(glString)) {
      
      glString = glString.replace(regExp, "");
      return glString;
  }

  print("The Item \"" + item +"\" does not exist in the global list string");
  return glString;
}

/**
 * The unit test for function remove
 */
function testRemoveGLItem() {
  var name="\"name1\" , \"name2\" , \"name3\"";

  print(removeGLItem(name,"name1"));
  print(removeGLItem(name,"name2"));
  print(removeGLItem(name,"name3"));
}

/**
 * The common private function for disabling a list of legacy activityactions.
 * @param activityActionNames the list of record names which to be disabled.
 * @param tableName the table field value of activityactions.
 */
function disableActivityActions(activityActionNames, tableName) {
    if(null == activityActionNames) {
      return;
    }

    for(var i=0; i<activityActionNames.length; i++) {
        print("Disabling activityactions \"" + activityActionNames[i] + "\" of table \"" + tableName + "\"...");
        var record = new SCFile("activityactions");
    var querySQL = "table=\"" + tableName + "\" and name=\"" + activityActionNames[i] + "\"";
    // find the record
    if (record.doSelect(querySQL) == RC_SUCCESS) {
      do {
        // duplicate the original datadict
        var oldRecord = new SCFile("activityactions");
        system.vars.$L_void=system.functions.fduplicate(oldRecord, record);

        // set the condition field to false
        record["condition"] = system.functions.parse("false",2);
        record.doUpdate();
        addSMPatches(record, oldRecord, "activityactions;" + record.name + ";" + record.table, "update");

        print("Disabled the activityactions \"" + activityActionNames[i] + "\"");
        } while (record.getNext() == RC_SUCCESS)
    } else {
        // Ignore it if not exist
      print("Can not find the activityactions \"" + activityActionNames[i] + "\", ignore it!");
    }
    }
}

/**
 * The common private function for replacing a list of legacy activityactions with PD records
 * by changing the name filed value of legacy record from xxx to xxx_disabled_by_PDHD
 * and changing the tmp PD record from xxx_for_pd4_tobe_used to xxx, meanwhile the legacy
 * record should be disabled by setting the condition to "false", and the PD record should
 * be activated by setting the condition to "$L.mode=\"save\" or $L.mode=\"update\"".
 * @param activityActionNames the list of record names which to be replaced.
 * @param tableName the table field value of activityactions.
 */
function replaceActivityActions(activityActionNames, tableName) {
    if(null == activityActionNames) {
      return;
    }

    for(var i=0; i<activityActionNames.length; i++) {
        print("Enabling activityactions \"" + activityActionNames[i] + "\" of table \"" + tableName + "\"...");
        var pdRecord = new SCFile("activityactions");
    var pdQuerySQL = "table=\"" + tableName + "\" and name=\"" + activityActionNames[i] + PDTMP_SUFFIX + "\"";
    // find the PD temp record first
    if (pdRecord.doSelect(pdQuerySQL) == RC_SUCCESS) {
      var legacyRecord = new SCFile("activityactions");
      var legacyQuerySQL = "table=\"" + tableName + "\" and name=\"" + activityActionNames[i] + "\"";
      // find the legacy Record, rename it if it exists.
      var oldLegacyRecord = null;
      if (legacyRecord.doSelect(legacyQuerySQL) == RC_SUCCESS) {
        // duplicate the original record
        oldLegacyRecord = new SCFile("activityactions")
        system.vars.$L_void=system.functions.fduplicate(oldLegacyRecord, legacyRecord);

        legacyRecord["name"] = activityActionNames[i] + LEGACY_SUFFIX;
        legacyRecord["condition"] = system.functions.parse("false",2);
        legacyRecord.doUpdate();
        print("Renamed the legacy activityactions to \"" + legacyRecord["name"] + "\"");
      } else {
        legacyRecord = null;
        print("The legacy activityactions does not exist.");
      }

      // rename the PD temp Record name
      pdRecord["name"] = activityActionNames[i];
      pdRecord["condition"] = system.functions.parse("$L.mode=\"save\" or $L.mode=\"update\"",2);
      pdRecord.doUpdate();
      
      // insert to table forcedobjects
	  forceObject("activityactions", pdRecord, legacyRecord);
      addSMPatches(pdRecord, oldLegacyRecord, "activityactions;" + pdRecord.name + ";" + pdRecord.table, "update");
      
          print("Enabled activityactions \"" + activityActionNames[i] + "\".");
    } else {
        // Ignore it if PD temp Record does not exist
      print("Can not find the temp PD activityactions, ignore the enabling for \"" + activityActionNames[i] + "\"!");
    }
    }
}


/**
 * Common private function to add smpatches record while enablement script upadating/adding a 
 * record.
 */
function addSMPatches(file, oldFile, recordTag, action) {
  // 1. find the signaturemake
  var signaturemake = new SCFile("signaturemake");
  var querySQL = "table.name=\"" + system.functions.filename(file) + "\"";
  var oldSignture = null;
  var newSignture = null;
  if (signaturemake.doSelect(querySQL) == RC_SUCCESS) {
    // found it
    if(null!=oldFile) {
      oldSignture = system.functions.make_sig(oldFile, signaturemake.fields, signaturemake.fieldarray_type).toString();
    }
    newSignture = system.functions.make_sig(file, signaturemake.fields, signaturemake.fieldarray_type).toString();
  } else {
      // the signaturemake could not be found
    print("Can not find the signaturemake for file \"" + system.functions.filename(file) + "\"!");
    if(null!=oldFile) {
      oldSignture = system.functions.make_sig(oldFile).toString();
    }
    newSignture = system.functions.make_sig(file).toString();
  }
  
  // 2. try to find the smpatches, update it if existing, otherwise add it.
  if(null==oldFile) {
    action="add";
  }
  var smpatches = new SCFile("smpatches");
  var patchQuerySQL = "version=\"SM9.30\" and tag=\"" + recordTag + "\"";
  if(smpatches.doSelect(patchQuerySQL) == RC_SUCCESS) {
    // found it, then update it
    print("Find the smpatches, update it!");
    smpatches.curr_sig=newSignture;
    var foundPreSigVer = false;
    for(var i=0; i<smpatches["pre.sigs.ver"].length(); i++) {
          if(smpatches["pre.sigs.ver"][i]=="SM9.30_PD4") {
              smpatches["pre.sigs"][i]=newSignture;
              foundPreSigVer = true;
              break;
          }
      }
      if(!foundPreSigVer && smpatches.action!="add") {
          smpatches.pre_sigs_ver[smpatches["pre.sigs.ver"].length()]="SM9.30_PD4";
      smpatches.pre_sigs[smpatches["pre.sigs"].length()]=newSignture;
      }
  } else {
      // the smpatches could not be found
    print("Can not find the smpatches, add it!");
    smpatches.version="SM9.30";
    smpatches.filename=system.functions.filename(file);
    smpatches.tag=recordTag;
    smpatches.action=action;
    smpatches.curr_sig=newSignture;
    if(action=="add") {
    } else if(action=="update") {
      smpatches.pre_sigs_ver[0]="SM9.30.000";
      smpatches.pre_sigs_ver[1]="SM9.30_PD4";
      smpatches.pre_sigs[0]=oldSignture;
      smpatches.pre_sigs[1]=newSignture;
    } else {
        print("Unknown action \"" + action + "\"!");
    }
  }
  smpatches.doSave();
}
function enablePDHelpDeskDatadictGlobalList(){
  
  var fields=[];
    var gls=[];
    var dataDict=new SCFile("datadict");
    var sql;
    for (var i=0;i<datadictGlobalListModification.length;i++){
      sql="name=\""+datadictGlobalListModification[i].datadictName+"\"";
      if(dataDict.doSelect( sql )=== RC_SUCCESS){
        fields=dataDict.fields;
        gls=dataDict.globallist;
        for(var j=0;j<datadictGlobalListModification[i].fieldName.length;j++){
          for(var k=0;k<fields.length();k++){
            if(fields[k]===datadictGlobalListModification[i].fieldName[j]){
              
              
              gls[k]=datadictGlobalListModification[i].globalListName[j];
            }
          }
        }
        dataDict.doUpdate();
      }
    }
  
}
function enablePDHelpDeskDatadictCaptionAndUsage(){
  
  var fields=[];
    var captions=[];
    var usages=[];
    var dataDict=new SCFile("datadict");
    var sql;
    for (var i=0;i<datadictCaptionAndUsage.length;i++){
      sql="name=\""+datadictCaptionAndUsage[i].datadictName+"\"";
      if(dataDict.doSelect( sql )=== RC_SUCCESS){
        fields=dataDict.fields;
        captions=dataDict.captions;
        usages=dataDict.sysFieldType;
        for(var j=0;j<datadictCaptionAndUsage[i].fieldName.length;j++){
          for(var k=0;k<fields.length();k++){
            if(fields[k]===datadictCaptionAndUsage[i].fieldName[j]){
              if(""!==datadictCaptionAndUsage[i].caption[j]){
                captions[k]=datadictCaptionAndUsage[i].caption[j];
              }
              if(0!==datadictCaptionAndUsage[i].usage[j]){
                usages[k]=datadictCaptionAndUsage[i].usage[j];
              }
            }
          }
        }
        dataDict.doUpdate();
      }
    }
  
}