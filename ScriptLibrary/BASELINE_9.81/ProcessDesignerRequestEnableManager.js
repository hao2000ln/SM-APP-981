var $ = lib.c.$;
var _ = lib.Underscore.require();
var forceObject = lib.ProcessDesignerEnablementUtil.forceObject;
var getIconForPDMenu = lib.ProcessDesignerEnablementUtil.getIconForPDMenu;
_parse_evaluate=system.functions.parse_evaluate;

/**
 * Contants
 */
 
 
/**
 * Suffix Contants
 */
// the suffix used by PD temp records before enabling
var PDTMP_SUFFIX = "_for_pdrequest_tobe_used";
var PDTMP_SUFFIX_SHORT = "_for_pdrequest";
// the suffix used by legacy records after enabling
var LEGACY_SUFFIX = "_disabled_by_PDRM";
var LEGACY_SUFFIX_SHORT = "_disabled";

// Object constant
var OBJECT_NAMES = ["ocmq", "ocml", "ocmo", "request", "requestTask"];

var OBJECT_NAME_MAP={beforeEnable:["ocmq","ocml","ocmo","request_for_pdrequest_tobe_used","requestTask_for_pdrequest_tobe_used"],
                     afterEnable:["ocmq_disabled_by_PDRM","ocml_disabled_by_PDRM","ocmo_disabled_by_PDRM","request","requestTask"]
                     };
var SEARCHCONFIG_TOBE_DISABLED_TABLENAMES = ["ocmq", "ocml","ocmo"];
var SEARCHCONFIG_TABLENAMES = ["request", "requestTask"];

/**
 * Menu constant
 */
var TOP_MENUS= ["ADMIN","HOME","APPROVER GEN","HELPDESK GEN","RM GEN"];
// the descriptions and menu name of PD menu
// TODO, question: how menu do L10N? whether it is safe to use menu description field here?
var PD_MENU_DESCS = ["Request Management"];
var PD_MENU_DESCS_NEW = ["Request Fulfillment"];
var PD_MENU_NAMES = ["RM PD"];
var PD_MENU_CONDS = [];
PD_MENU_CONDS.push("lioption(\"Request Management\") and ( nullsub(jscall(\"security.getRights\", \"Request\", \"view\"),\"false\")=\"true\" or nullsub(jscall(\"security.getRights\", \"Request Tasks\", \"view\"),\"false\")=\"true\" or nullsub(jscall(\"security.getRights\", \"Request Management Configuration\", \"view\"),\"false\")=\"true\")");

// the prefix for legacy menu description after enabling
var LEGACY_MENU_PREFIX = "Legacy ";
// the ENV related menu items
var ENV_MENU_ITEM_DESCS = ["Request Management Quote Environment", "Request Management Order Environment", "Request Management Line Item Environment"];
var PROFILE_MENU_ITEM_DESCS = ["Request Management Profiles"];
// the commands which need to replaced by in menu during enabling
var ORG_RM_COMMANDS = [];
var NEW_RM_COMMANDS = [];

var EXT_MENU_ITEM_TO_REMOVE = [["SYSTEM ADMINISTRATION","Models"], ["GROUPS","Change Management Message Groups"]];
var EXT_MENU_ITEM_TO_RENAME = [["GROUPS","ChM Membership","Group Membership"], ["GROUPS","Incident Management Assignment Groups","Assignment Groups"]];

/**
 * Display Screen/Display Option constant
 */


// queue display option constant for ds scm.advanced
var QUEUE_DS_ID = "scm.advanced";
var QUEUE_DO_IDS = [];


 

/**
 * Inbox constant
 */

var ENABLE_QUEUE_OPERATION_UPDATE = "update";
var ENABLE_QUEUE_OPERATION_DELETE = "delete";
var ENABLE_QUEUE_OPERATION_ADD = "add";
var ENABLE_QUEUE_OPERATION_REPLACE = "replace";
var ENABLE_QUEUES = [];
ENABLE_QUEUES.push(["My Group's To Do List", ENABLE_QUEUE_OPERATION_UPDATE, ["short.query"], ['(itemType="probsummary" or itemType="incidents" or itemType="rootcause" or itemType="rootcausetask" or itemType="imTask" or itemType="cm3r" or itemType="cm3t"or itemType="timeperiodDefinition" or itemType="SurveyDefinition" or itemType="request" or itemType="requestTask") and group isin $lo.pm.assignments']]);
ENABLE_QUEUES.push(["My Group's To Do List", ENABLE_QUEUE_OPERATION_ADD, ["inbox.name","short.query"], ["My To Do List of Requests",'assignee=$lo.user.name and itemType="request" and status~="Suspended"']]);
ENABLE_QUEUES.push(["My Group's To Do List", ENABLE_QUEUE_OPERATION_ADD, ["inbox.name","short.query"], ["My To Do List of Request Tasks",'assignee=$lo.user.name and itemType="requestTask"']]);
ENABLE_QUEUES.push(["My Pending Delegated Approvals", ENABLE_QUEUE_OPERATION_REPLACE, ["short.query"], ['(file.name="ocmq" and current.pending.groups isin $G.delegated.ocmq.groups)'],['(file.name="request" and current.pending.groups isin $G.delegated.pdrm.groups)']]);
ENABLE_QUEUES.push(["All my Approvals", ENABLE_QUEUE_OPERATION_REPLACE, ["short.query"], [' (file.name="ocmq" and (current.pending.groups isin approval.groups in $G.ocmq.environment or current.pending.groups isin {$lo.user.name}) or current.pending.groups isin $G.delegated.ocmq.groups)'],[' (file.name="request" and (current.pending.groups isin approval.groups in $G.request.environment or current.pending.groups isin {$lo.user.name}) or current.pending.groups isin $G.delegated.pdrm.groups)']]);
ENABLE_QUEUES.push(["My Pending Approvals", ENABLE_QUEUE_OPERATION_REPLACE, ["short.query"], ['(file.name="ocmq" and (current.pending.groups isin approval.groups in $G.ocmq.environment or current.pending.groups isin {$lo.user.name})'],['(file.name="request" and (current.pending.groups isin approval.groups in $G.request.environment or current.pending.groups isin {$lo.user.name})']]);



var ENABLE_REPORT_QUEUES = [];
ENABLE_REPORT_QUEUES.push('<model name="inbox" query="inbox.id=&quot;10000004&quot;"><keys><inbox.id sctype="decimal">10000004</inbox.id></keys><instance recordid="Open Interactions Assigned to My Groups (PD) - incidents - %NONE% - 10000004" uniquequery="inbox.id=10000004"><operator.name type="string">%NONE%</operator.name><inbox.name type="string">Open Interactions Assigned to My Groups (PD)</inbox.name><query type="string">open~="Closed" and open~="Canceled" and assignment isin $lo.pm.assignments</query><use.normalized type="boolean">true</use.normalized><normalized.query type="string">open~="Closed" and open~="Canceled" and assignment isin $lo.pm.assignments</normalized.query><inbox.type type="string">incidents</inbox.type><sysmodcount type="decimal">7</sysmodcount><sysmoduser type="string">System.Admin</sysmoduser><sysmodtime type="dateTime">10/24/14 00:50:32</sysmodtime><short.query type="string">open~="Closed" and open~="Canceled" and assignment isin $lo.pm.assignments</short.query><inbox.id type="decimal">10000004</inbox.id><container.id type="decimal">11</container.id><inbox.class type="string">classList</inbox.class><inbox.manager type="string">Servicedesk.Agent</inbox.manager><attributes sctype="array"><attributes sctype="structure"><name type="string">showLegend</name><value type="string">true</value></attributes><attributes sctype="structure"><name type="string">legendPosition</name><value type="string">right</value></attributes><attributes sctype="structure"><name type="string">donut</name><value type="string">true</value></attributes><attributes sctype="structure"><name type="string">donutValue</name><value type="string">35</value></attributes><attributes sctype="structure"><name type="string">maxStackedRow</name><value type="string">12</value></attributes><attributes sctype="structure"><name type="string">decimalPlaces</name><value type="string">2</value></attributes><attributes sctype="structure"><name type="string">supportTopN</name></attributes><attributes sctype="structure"><name type="string">colorOfNumberChart</name></attributes><attributes sctype="structure"><name type="string">maxRow</name><value type="string">12</value></attributes></attributes><list.display.count type="boolean">false</list.display.count><chart.source type="string">aggregate</chart.source><audience.type type="string">role</audience.type><fieldlist sctype="array"><fieldlist sctype="string">incident.id</fieldlist><fieldlist sctype="string">open</fieldlist><fieldlist sctype="string">title</fieldlist><fieldlist sctype="string">contact.name</fieldlist><fieldlist sctype="string">affected.item</fieldlist><fieldlist sctype="string">logical.name</fieldlist><fieldlist sctype="string">next.breach</fieldlist><fieldlist sctype="string">severity</fieldlist></fieldlist><viewtype type="string">Table</viewtype><role sctype="array"><role sctype="string">service catalog manager</role><role sctype="string">service desk agent</role><role sctype="string">service desk manager</role></role><filter sctype="structure"/><navLaunch type="string">recordList</navLaunch><standard.query type="string">open~="Closed" and open~="Canceled" and assignment isin $lo.pm.assignments</standard.query><aggregation.type type="string">Count</aggregation.type><inbox.description type="string">This report enables the user to review the list of all open interactions assigned to the user\'s groups.</inbox.description><list.type type="string">std</list.type><report.category type="string">Service Desk</report.category></instance></model>');
ENABLE_REPORT_QUEUES.push('<model name="inbox" query="inbox.id=&quot;10000005&quot;"><keys><inbox.id sctype="decimal">10000005</inbox.id></keys><instance recordid="Closed Interactions Assigned to My Groups (PD) - incidents - %NONE% - 10000005" uniquequery="inbox.id=10000005"><operator.name type="string">%NONE%</operator.name><inbox.name type="string">Closed Interactions Assigned to My Groups (PD)</inbox.name><query type="string">open="Closed" and (assignment isin $lo.pm.assignments)</query><use.normalized type="boolean">true</use.normalized><normalized.query type="string">open="Closed" and (assignment isin $lo.pm.assignments)</normalized.query><inbox.type type="string">incidents</inbox.type><sysmodcount type="decimal">7</sysmodcount><sysmoduser type="string">System.Admin</sysmoduser><sysmodtime type="dateTime">10/24/14 00:50:32</sysmodtime><short.query type="string">open="Closed" and (assignment isin $lo.pm.assignments)</short.query><inbox.id type="decimal">10000005</inbox.id><inbox.class type="string">classList</inbox.class><inbox.manager type="string">Servicedesk.Agent</inbox.manager><attributes sctype="array"><attributes sctype="structure"><name type="string">showLegend</name><value type="string">true</value></attributes><attributes sctype="structure"><name type="string">legendPosition</name><value type="string">right</value></attributes><attributes sctype="structure"><name type="string">donut</name><value type="string">true</value></attributes><attributes sctype="structure"><name type="string">donutValue</name><value type="string">35</value></attributes><attributes sctype="structure"><name type="string">maxStackedRow</name><value type="string">12</value></attributes><attributes sctype="structure"><name type="string">decimalPlaces</name><value type="string">2</value></attributes><attributes sctype="structure"><name type="string">supportTopN</name></attributes><attributes sctype="structure"><name type="string">colorOfNumberChart</name></attributes><attributes sctype="structure"><name type="string">maxRow</name><value type="string">12</value></attributes></attributes><audience.type type="string">role</audience.type><fieldlist sctype="array"><fieldlist sctype="string">incident.id</fieldlist><fieldlist sctype="string">open</fieldlist><fieldlist sctype="string">title</fieldlist><fieldlist sctype="string">contact.name</fieldlist><fieldlist sctype="string">affected.item</fieldlist><fieldlist sctype="string">logical.name</fieldlist><fieldlist sctype="string">next.breach</fieldlist><fieldlist sctype="string">severity</fieldlist></fieldlist><viewtype type="string">Table</viewtype><role sctype="array"><role sctype="string">administrator</role><role sctype="string">service catalog manager</role><role sctype="string">service desk agent</role><role sctype="string">service desk manager</role></role><filter sctype="structure"/><navLaunch type="string">view</navLaunch><allow.modify.query type="boolean">true</allow.modify.query><standard.query type="string">open="Closed" and (assignment isin $lo.pm.assignments)</standard.query><aggregation.type type="string">Count</aggregation.type><inbox.description type="string">This report enables the user to review all open interactions assigned to the user\'s groups, sorted by priority.</inbox.description><list.type type="string">std</list.type><report.category type="string">Service Desk</report.category><report.disabled type="boolean">false</report.disabled></instance></model>');
ENABLE_REPORT_QUEUES.push('<model name="inbox" query="inbox.id=&quot;10000006&quot;"><keys><inbox.id sctype="decimal">10000006</inbox.id></keys><instance recordid="Open Interactions Assigned to My Groups by Priority (PD) - incidents - %NONE% - 10000006" uniquequery="inbox.id=10000006"><operator.name type="string">%NONE%</operator.name><inbox.name type="string">Open Interactions Assigned to My Groups by Priority (PD)</inbox.name><query type="string">open~="Closed" and open~="Canceled" and assignment isin $lo.pm.assignments</query><use.normalized type="boolean">true</use.normalized><normalized.query type="string">open~="Closed" and open~="Canceled" and assignment isin $lo.pm.assignments</normalized.query><inbox.type type="string">incidents</inbox.type><sysmodcount type="decimal">7</sysmodcount><sysmoduser type="string">System.Admin</sysmoduser><sysmodtime type="dateTime">10/24/14 00:50:32</sysmodtime><short.query type="string">open~="Closed" and open~="Canceled" and assignment isin $lo.pm.assignments</short.query><inbox.id type="decimal">10000006</inbox.id><container.id type="decimal">11</container.id><inbox.class type="string">chart</inbox.class><inbox.manager type="string">Servicedesk.Agent</inbox.manager><attributes sctype="array"><attributes sctype="structure"><name type="string">showLegend</name><value type="string">true</value></attributes><attributes sctype="structure"><name type="string">legendPosition</name><value type="string">right</value></attributes><attributes sctype="structure"><name type="string">donut</name><value type="string">true</value></attributes><attributes sctype="structure"><name type="string">donutValue</name><value type="string">35</value></attributes><attributes sctype="structure"><name type="string">maxStackedRow</name><value type="string">12</value></attributes><attributes sctype="structure"><name type="string">decimalPlaces</name><value type="string">2</value></attributes><attributes sctype="structure"><name type="string">supportTopN</name></attributes><attributes sctype="structure"><name type="string">colorOfNumberChart</name></attributes><attributes sctype="structure"><name type="string">maxRow</name><value type="string">12</value></attributes></attributes><list.display.count type="boolean">false</list.display.count><chart.type type="string">pie</chart.type><chart.break.down.by type="string">priority.code</chart.break.down.by><chart.source type="string">aggregate</chart.source><audience.type type="string">role</audience.type><fieldlist sctype="array"><fieldlist sctype="string">incident.id</fieldlist><fieldlist sctype="string">open</fieldlist><fieldlist sctype="string">title</fieldlist><fieldlist sctype="string">contact.name</fieldlist><fieldlist sctype="string">affected.item</fieldlist><fieldlist sctype="string">logical.name</fieldlist><fieldlist sctype="string">next.breach</fieldlist><fieldlist sctype="string">severity</fieldlist></fieldlist><viewtype type="string">Table</viewtype><role sctype="array"><role sctype="string">administrator</role><role sctype="string">service catalog manager</role><role sctype="string">service desk agent</role><role sctype="string">service desk manager</role></role><filter sctype="structure"/><navLaunch type="string">recordList</navLaunch><standard.query type="string">open~="Closed" and open~="Canceled" and assignment isin $lo.pm.assignments</standard.query><aggregation.type type="string">Count</aggregation.type><inbox.description type="string">This report enables the user to review all open interactions assigned to the user\'s groups, sorted by priority.</inbox.description><list.type type="string">std</list.type><report.category type="string">Service Desk</report.category></instance></model>');
ENABLE_REPORT_QUEUES.push('<model name="inbox" query="inbox.id=&quot;10000007&quot;"><keys><inbox.id sctype="decimal">10000007</inbox.id></keys><instance recordid="Closed Interactions Assigned to My Groups by Priority (PD) - incidents - %NONE% - 10000007" uniquequery="inbox.id=10000007"><operator.name type="string">%NONE%</operator.name><inbox.name type="string">Closed Interactions Assigned to My Groups by Priority (PD)</inbox.name><query type="string">open="Closed" and (assignment isin $lo.pm.assignments)</query><use.normalized type="boolean">true</use.normalized><normalized.query type="string">open="Closed" and (assignment isin $lo.pm.assignments)</normalized.query><inbox.type type="string">incidents</inbox.type><sysmodcount type="decimal">7</sysmodcount><sysmoduser type="string">System.Admin</sysmoduser><sysmodtime type="dateTime">10/24/14 00:50:32</sysmodtime><short.query type="string">open="Closed" and (assignment isin $lo.pm.assignments)</short.query><inbox.id type="decimal">10000007</inbox.id><inbox.class type="string">chart</inbox.class><inbox.manager type="string">Servicedesk.Agent</inbox.manager><attributes sctype="array"><attributes sctype="structure"><name type="string">showLegend</name><value type="string">true</value></attributes><attributes sctype="structure"><name type="string">legendPosition</name><value type="string">right</value></attributes><attributes sctype="structure"><name type="string">donut</name><value type="string">true</value></attributes><attributes sctype="structure"><name type="string">donutValue</name><value type="string">35</value></attributes><attributes sctype="structure"><name type="string">maxStackedRow</name><value type="string">12</value></attributes><attributes sctype="structure"><name type="string">decimalPlaces</name><value type="string">2</value></attributes><attributes sctype="structure"><name type="string">supportTopN</name></attributes><attributes sctype="structure"><name type="string">colorOfNumberChart</name></attributes><attributes sctype="structure"><name type="string">maxRow</name><value type="string">12</value></attributes></attributes><chart.type type="string">pie</chart.type><chart.break.down.by type="string">priority.code</chart.break.down.by><chart.source type="string">aggregate</chart.source><audience.type type="string">role</audience.type><fieldlist sctype="array"><fieldlist sctype="string">incident.id</fieldlist><fieldlist sctype="string">open</fieldlist><fieldlist sctype="string">title</fieldlist><fieldlist sctype="string">contact.name</fieldlist><fieldlist sctype="string">affected.item</fieldlist><fieldlist sctype="string">logical.name</fieldlist><fieldlist sctype="string">next.breach</fieldlist><fieldlist sctype="string">severity</fieldlist></fieldlist><viewtype type="string">Table</viewtype><role sctype="array"><role sctype="string">administrator</role><role sctype="string">service catalog manager</role><role sctype="string">service desk agent</role><role sctype="string">service desk manager</role></role><filter sctype="structure"/><navLaunch type="string">view</navLaunch><allow.modify.query type="boolean">true</allow.modify.query><standard.query type="string">open="Closed" and (assignment isin $lo.pm.assignments)</standard.query><aggregation.type type="string">Count</aggregation.type><inbox.description type="string">This report enables the user to review all closed interactions assigned to the user\'s groups, sorted by priority.</inbox.description><list.type type="string">std</list.type><report.category type="string">Service Desk</report.category><report.disabled type="boolean">false</report.disabled></instance></model>');
ENABLE_REPORT_QUEUES.push('<model name="inbox" query="inbox.id=&quot;10000008&quot;"><keys><inbox.id sctype="decimal">10000008</inbox.id></keys><instance recordid="Closed Interactions by Assignment Group (PD) - incidents - %NONE% - 10000008" uniquequery="inbox.id=10000008"><operator.name type="string">%NONE%</operator.name><inbox.name type="string">Closed Interactions by Assignment Group (PD)</inbox.name><query type="string">open="Closed" and (assignment isin $lo.pm.assignments)</query><use.normalized type="boolean">true</use.normalized><normalized.query type="string">open="Closed" and (assignment isin $lo.pm.assignments)</normalized.query><inbox.type type="string">incidents</inbox.type><sysmodcount type="decimal">7</sysmodcount><sysmoduser type="string">System.Admin</sysmoduser><sysmodtime type="dateTime">10/24/14 00:50:32</sysmodtime><short.query type="string">open="Closed" and (assignment isin $lo.pm.assignments)</short.query><inbox.id type="decimal">10000008</inbox.id><inbox.class type="string">chart</inbox.class><inbox.manager type="string">Servicedesk.Manager</inbox.manager><attributes sctype="array"><attributes sctype="structure"><name type="string">showLegend</name><value type="string">true</value></attributes><attributes sctype="structure"><name type="string">legendPosition</name><value type="string">right</value></attributes><attributes sctype="structure"><name type="string">donut</name><value type="string">true</value></attributes><attributes sctype="structure"><name type="string">donutValue</name><value type="string">35</value></attributes><attributes sctype="structure"><name type="string">maxStackedRow</name><value type="string">12</value></attributes><attributes sctype="structure"><name type="string">decimalPlaces</name><value type="string">0</value></attributes><attributes sctype="structure"><name type="string">supportTopN</name></attributes><attributes sctype="structure"><name type="string">colorOfNumberChart</name></attributes><attributes sctype="structure"><name type="string">maxRow</name><value type="string">12</value></attributes></attributes><chart.type type="string">vbar</chart.type><chart.break.down.by type="string">assignment</chart.break.down.by><chart.source type="string">aggregate</chart.source><audience.type type="string">role</audience.type><fieldlist sctype="array"><fieldlist sctype="string">incident.id</fieldlist><fieldlist sctype="string">open</fieldlist><fieldlist sctype="string">title</fieldlist><fieldlist sctype="string">contact.name</fieldlist><fieldlist sctype="string">affected.item</fieldlist><fieldlist sctype="string">logical.name</fieldlist><fieldlist sctype="string">next.breach</fieldlist><fieldlist sctype="string">severity</fieldlist></fieldlist><viewtype type="string">Table</viewtype><role sctype="array"><role sctype="string">service catalog manager</role><role sctype="string">service desk agent</role><role sctype="string">service desk manager</role></role><filter sctype="structure"/><navLaunch type="string">view</navLaunch><allow.modify.query type="boolean">true</allow.modify.query><standard.query type="string">open="Closed" and (assignment isin $lo.pm.assignments)</standard.query><aggregation.type type="string">Count</aggregation.type><inbox.description type="string">This report enables the user to review all closed interactions, sorted by the assignment group.</inbox.description><list.type type="string">std</list.type><report.category type="string">Service Desk</report.category><report.disabled type="boolean">false</report.disabled></instance></model>');
ENABLE_REPORT_QUEUES.push('<model name="inbox" query="inbox.id=&quot;10000324&quot;"><keys><inbox.id sctype="decimal">10000324</inbox.id></keys><instance recordid="Open Problem Records Owned by Me by Subcategory(PD) - rootcause - %NONE% - 10000324" uniquequery="inbox.id=10000324"><operator.name type="string">%NONE%</operator.name><inbox.name type="string">Open Problem Records Owned by Me by Subcategory(PD)</inbox.name><query type="string">open=true and assignee.name=operator()</query><sort sctype="array"><sort sctype="string">id</sort></sort><use.normalized type="boolean">true</use.normalized><normalized.query type="string">open=true and assignee.name=operator()</normalized.query><inbox.type type="string">rootcause</inbox.type><sysmodcount type="decimal">18</sysmodcount><sysmoduser type="string">System.Admin</sysmoduser><sysmodtime type="dateTime">10/24/14 00:50:32</sysmodtime><short.query type="string">open=true and assignee.name=operator()</short.query><inbox.id type="decimal">10000324</inbox.id><container.id type="decimal">0</container.id><inbox.class type="string">chart</inbox.class><inbox.manager type="string">Problem.Coordinator</inbox.manager><attributes sctype="array"><attributes sctype="structure"><name type="string">showLegend</name><value type="string">true</value></attributes><attributes sctype="structure"><name type="string">legendPosition</name><value type="string">right</value></attributes><attributes sctype="structure"><name type="string">donut</name><value type="string">true</value></attributes><attributes sctype="structure"><name type="string">donutValue</name><value type="string">35</value></attributes><attributes sctype="structure"><name type="string">maxStackedRow</name><value type="string">0</value></attributes><attributes sctype="structure"><name type="string">decimalPlaces</name><value type="string">0</value></attributes><attributes sctype="structure"><name type="string">supportTopN</name></attributes><attributes sctype="structure"><name type="string">colorOfNumberChart</name></attributes><attributes sctype="structure"><name type="string">maxRow</name><value type="string">0</value></attributes></attributes><list.display.count type="boolean">false</list.display.count><chart.type type="string">hbar</chart.type><chart.break.down.by type="string">subcategory</chart.break.down.by><chart.source type="string">aggregate</chart.source><audience.type type="string">role</audience.type><fieldlist sctype="array"><fieldlist sctype="string">id</fieldlist><fieldlist sctype="string">current.phase</fieldlist><fieldlist sctype="string">assignment</fieldlist><fieldlist sctype="string">rcStatus</fieldlist><fieldlist sctype="string">logical.name</fieldlist><fieldlist sctype="string">affected.item</fieldlist><fieldlist sctype="string">brief.description</fieldlist></fieldlist><viewtype type="string">Table</viewtype><role sctype="array"><role sctype="string">problem analyst</role><role sctype="string">problem coordinator</role></role><filter sctype="structure"/><navLaunch type="string">recordList</navLaunch><standard.query type="string">open=true and assignee.name=operator()</standard.query><stack.field type="string">product.type</stack.field><aggregation.type type="string">Count</aggregation.type><inbox.description type="string">This report enables the user to review the number of open problem records owned by the user, sorted by subcategory.</inbox.description><list.type type="string">std</list.type><report.category type="string">Problem</report.category></instance></model>');
ENABLE_REPORT_QUEUES.push('<model name="inbox" query="inbox.id=&quot;10000325&quot;"><keys><inbox.id sctype="decimal">10000325</inbox.id></keys><instance recordid="Total Count of  Open Problem Records Owned by Me(PD) - rootcause - %NONE% - 10000325" uniquequery="inbox.id=10000325"><operator.name type="string">%NONE%</operator.name><inbox.name type="string">Total Count of  Open Problem Records Owned by Me(PD)</inbox.name><query type="string">open=true and assignee.name=operator()</query><sort sctype="array"><sort sctype="string">id</sort></sort><use.normalized type="boolean">true</use.normalized><normalized.query type="string">open=true and assignee.name=operator()</normalized.query><inbox.type type="string">rootcause</inbox.type><sysmodcount type="decimal">14</sysmodcount><sysmoduser type="string">System.Admin</sysmoduser><sysmodtime type="dateTime">10/24/14 00:50:32</sysmodtime><short.query type="string">open=true and assignee.name=operator()</short.query><inbox.id type="decimal">10000325</inbox.id><container.id type="decimal">0</container.id><inbox.class type="string">chart</inbox.class><inbox.manager type="string">Problem.Coordinator</inbox.manager><attributes sctype="array"><attributes sctype="structure"><name type="string">showLegend</name><value type="string">true</value></attributes><attributes sctype="structure"><name type="string">legendPosition</name><value type="string">right</value></attributes><attributes sctype="structure"><name type="string">donut</name><value type="string">true</value></attributes><attributes sctype="structure"><name type="string">donutValue</name><value type="string">35</value></attributes><attributes sctype="structure"><name type="string">maxStackedRow</name><value type="string">12</value></attributes><attributes sctype="structure"><name type="string">decimalPlaces</name><value type="string">0</value></attributes><attributes sctype="structure"><name type="string">supportTopN</name></attributes><attributes sctype="structure"><name type="string">colorOfNumberChart</name><value type="string">#0096D6</value></attributes><attributes sctype="structure"><name type="string">maxRow</name><value type="string">12</value></attributes></attributes><list.display.count type="boolean">false</list.display.count><chart.type type="string">number</chart.type><chart.source type="string">aggregate</chart.source><audience.type type="string">role</audience.type><fieldlist sctype="array"><fieldlist sctype="string">id</fieldlist><fieldlist sctype="string">current.phase</fieldlist><fieldlist sctype="string">assignment</fieldlist><fieldlist sctype="string">rcStatus</fieldlist><fieldlist sctype="string">logical.name</fieldlist><fieldlist sctype="string">affected.item</fieldlist><fieldlist sctype="string">brief.description</fieldlist></fieldlist><viewtype type="string">Table</viewtype><role sctype="array"><role sctype="string">problem analyst</role><role sctype="string">problem coordinator</role></role><filter sctype="structure"/><navLaunch type="string">recordList</navLaunch><standard.query type="string">open=true and assignee.name=operator()</standard.query><aggregation.type type="string">Count</aggregation.type><inbox.description type="string">This report provides the number of open problem records owned by the user.</inbox.description><list.type type="string">std</list.type><chart.number.label type="string">Opened Problem Records Owned by Me</chart.number.label><report.category type="string">Problem</report.category></instance></model>');
ENABLE_REPORT_QUEUES.push('<model name="inbox" query="inbox.id=&quot;10000357&quot;"><keys><inbox.id sctype="decimal">10000357</inbox.id></keys><instance recordid="Open Interactions Assigned to Me by Priority(PD) - incidents - %NONE% - 10000357" uniquequery="inbox.id=10000357"><operator.name type="string">%NONE%</operator.name><inbox.name type="string">Open Interactions Assigned to Me by Priority(PD)</inbox.name><query type="string">(assignee.name=operator()) and (open~="Closed" and open~="Canceled")</query><use.normalized type="boolean">true</use.normalized><normalized.query type="string">(assignee.name=operator()) and (open~="Closed" and open~="Canceled")</normalized.query><inbox.type type="string">incidents</inbox.type><sysmodcount type="decimal">14</sysmodcount><sysmoduser type="string">System.Admin</sysmoduser><sysmodtime type="dateTime">10/24/14 00:50:32</sysmodtime><short.query type="string">(assignee.name=operator()) and (open~="Closed" and open~="Canceled")</short.query><inbox.id type="decimal">10000357</inbox.id><container.id type="decimal">0</container.id><inbox.class type="string">chart</inbox.class><inbox.manager type="string">Servicedesk.Manager</inbox.manager><attributes sctype="array"><attributes sctype="structure"><name type="string">showLegend</name><value type="string">true</value></attributes><attributes sctype="structure"><name type="string">legendPosition</name><value type="string">right</value></attributes><attributes sctype="structure"><name type="string">donut</name><value type="string">true</value></attributes><attributes sctype="structure"><name type="string">donutValue</name><value type="string">35</value></attributes><attributes sctype="structure"><name type="string">maxStackedRow</name><value type="string">12</value></attributes><attributes sctype="structure"><name type="string">decimalPlaces</name><value type="string">0</value></attributes><attributes sctype="structure"><name type="string">supportTopN</name></attributes><attributes sctype="structure"><name type="string">colorOfNumberChart</name></attributes><attributes sctype="structure"><name type="string">maxRow</name><value type="string">0</value></attributes></attributes><list.display.count type="boolean">false</list.display.count><chart.type type="string">pie</chart.type><chart.break.down.by type="string">priority.code</chart.break.down.by><chart.source type="string">aggregate</chart.source><audience.type type="string">role</audience.type><fieldlist sctype="array"><fieldlist sctype="string">incident.id</fieldlist><fieldlist sctype="string">open</fieldlist><fieldlist sctype="string">title</fieldlist><fieldlist sctype="string">contact.name</fieldlist><fieldlist sctype="string">affected.item</fieldlist><fieldlist sctype="string">logical.name</fieldlist><fieldlist sctype="string">next.breach</fieldlist><fieldlist sctype="string">severity</fieldlist></fieldlist><viewtype type="string">Table</viewtype><role sctype="array"><role sctype="string">service desk agent</role><role sctype="string">service desk manager</role></role><filter sctype="structure"><access.filter.xml type="string">{}</access.filter.xml><choices sctype="array"><choices sctype="string">assigned</choices></choices><search.sql type="string">true</search.sql><filter.sql type="string">(owner.name=operator())</filter.sql></filter><navLaunch type="string">recordList</navLaunch><standard.query type="string">(assignee.name=operator()) and (open~="Closed" and open~="Canceled")</standard.query><is.mobile.used type="boolean">true</is.mobile.used><aggregation.type type="string">Count</aggregation.type><inbox.description type="string">This report enables the user to review all open interactions assigned to the user, sorted by priority.</inbox.description><list.type type="string">std</list.type><report.category type="string">Service Desk</report.category></instance></model>');
ENABLE_REPORT_QUEUES.push('<model name="inbox" query="inbox.id=&quot;10000358&quot;"><keys><inbox.id sctype="decimal">10000358</inbox.id></keys><instance recordid="Open Interactions Assigned to Me - Breached within 1 Day(PD) - incidents - %NONE% - 10000358" uniquequery="inbox.id=10000358"><operator.name type="string">%NONE%</operator.name><inbox.name type="string">Open Interactions Assigned to Me - Breached within 1 Day(PD)</inbox.name><query type="string">(assignee.name=operator()) and (open~="Closed" and open~="Canceled") and (next.breach&lt;=(tod()+\'1 00:00:00\')) and sla.breach=false</query><use.normalized type="boolean">true</use.normalized><normalized.query type="string">(assignee.name=operator()) and (open~="Closed" and open~="Canceled") and (next.breach&lt;=(tod()+\'1 00:00:00\')) and sla.breach=false</normalized.query><inbox.type type="string">incidents</inbox.type><sysmodcount type="decimal">18</sysmodcount><sysmoduser type="string">System.Admin</sysmoduser><sysmodtime type="dateTime">10/24/14 00:50:32</sysmodtime><short.query type="string">(assignee.name=operator()) and (open~="Closed" and open~="Canceled") and (next.breach&lt;=(tod()+\'1 00:00:00\')) and sla.breach=false</short.query><inbox.id type="decimal">10000358</inbox.id><container.id type="decimal">0</container.id><inbox.class type="string">classList</inbox.class><inbox.manager type="string">Servicedesk.Manager</inbox.manager><attributes sctype="array"><attributes sctype="structure"><name type="string">showLegend</name><value type="string">true</value></attributes><attributes sctype="structure"><name type="string">legendPosition</name><value type="string">right</value></attributes><attributes sctype="structure"><name type="string">donut</name><value type="string">true</value></attributes><attributes sctype="structure"><name type="string">donutValue</name><value type="string">35</value></attributes><attributes sctype="structure"><name type="string">maxStackedRow</name><value type="string">12</value></attributes><attributes sctype="structure"><name type="string">decimalPlaces</name><value type="string">2</value></attributes><attributes sctype="structure"><name type="string">supportTopN</name></attributes><attributes sctype="structure"><name type="string">colorOfNumberChart</name></attributes><attributes sctype="structure"><name type="string">maxRow</name><value type="string">12</value></attributes></attributes><list.display.count type="boolean">false</list.display.count><chart.source type="string">aggregate</chart.source><audience.type type="string">role</audience.type><fieldlist sctype="array"><fieldlist sctype="string">incident.id</fieldlist><fieldlist sctype="string">open</fieldlist><fieldlist sctype="string">title</fieldlist><fieldlist sctype="string">contact.name</fieldlist><fieldlist sctype="string">affected.item</fieldlist><fieldlist sctype="string">logical.name</fieldlist><fieldlist sctype="string">next.breach</fieldlist><fieldlist sctype="string">severity</fieldlist></fieldlist><viewtype type="string">Table</viewtype><sortBy sctype="array"><sortBy sctype="structure"><showSortField type="boolean">false</showSortField><sortFieldName type="string">incidents;severity</sortFieldName><sortType type="string">ascending</sortType></sortBy></sortBy><role sctype="array"><role sctype="string">service desk agent</role><role sctype="string">service desk manager</role></role><filter sctype="structure"><access.filter.xml type="string">{{NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL}}</access.filter.xml><choices sctype="array"><choices sctype="string">assigned</choices></choices><search.sql type="string">true</search.sql><filter.sql type="string">(owner.name=operator())</filter.sql></filter><navLaunch type="string">recordList</navLaunch><allow.modify.query type="boolean">false</allow.modify.query><standard.query type="string">(assignee.name=operator()) and (open~="Closed" and open~="Canceled") and (next.breach&lt;=(tod()+\'1 00:00:00\')) and sla.breach=false</standard.query><aggregation.type type="string">Count</aggregation.type><inbox.description type="string">This report enables the user to review all open interactions that are assigned to the user which will be breached within one day.</inbox.description><list.type type="string">title</list.type><list.tfields.header1Field type="string">incident.id</list.tfields.header1Field><list.tfields.header2Field type="string">open</list.tfields.header2Field><list.tfields.flagField type="string">severity</list.tfields.flagField><list.tfields.summaryField type="string">title</list.tfields.summaryField><list.tfields.footerField type="string">next.breach</list.tfields.footerField><report.category type="string">Service Desk</report.category></instance></model>');
ENABLE_REPORT_QUEUES.push('<model name="inbox" query="inbox.id=&quot;10000359&quot;"><keys><inbox.id sctype="decimal">10000359</inbox.id></keys><instance recordid="Open Interactions Assigned to Me by Category(PD) - incidents - %NONE% - 10000359" uniquequery="inbox.id=10000359"><operator.name type="string">%NONE%</operator.name><inbox.name type="string">Open Interactions Assigned to Me by Category(PD)</inbox.name><query type="string">(assignee.name=operator()) and (open~="Closed" and open~="Canceled")</query><use.normalized type="boolean">true</use.normalized><normalized.query type="string">(assignee.name=operator()) and (open~="Closed" and open~="Canceled")</normalized.query><inbox.type type="string">incidents</inbox.type><sysmodcount type="decimal">20</sysmodcount><sysmoduser type="string">System.Admin</sysmoduser><sysmodtime type="dateTime">10/24/14 00:50:32</sysmodtime><short.query type="string">(assignee.name=operator()) and (open~="Closed" and open~="Canceled")</short.query><inbox.id type="decimal">10000359</inbox.id><container.id type="decimal">0</container.id><inbox.class type="string">chart</inbox.class><inbox.manager type="string">Servicedesk.Manager</inbox.manager><attributes sctype="array"><attributes sctype="structure"><name type="string">showLegend</name><value type="string">true</value></attributes><attributes sctype="structure"><name type="string">legendPosition</name><value type="string">right</value></attributes><attributes sctype="structure"><name type="string">donut</name><value type="string">true</value></attributes><attributes sctype="structure"><name type="string">donutValue</name><value type="string">35</value></attributes><attributes sctype="structure"><name type="string">maxStackedRow</name><value type="string">12</value></attributes><attributes sctype="structure"><name type="string">decimalPlaces</name><value type="string">0</value></attributes><attributes sctype="structure"><name type="string">supportTopN</name></attributes><attributes sctype="structure"><name type="string">colorOfNumberChart</name></attributes><attributes sctype="structure"><name type="string">maxRow</name><value type="string">0</value></attributes></attributes><list.display.count type="boolean">false</list.display.count><chart.type type="string">pie</chart.type><chart.break.down.by type="string">category</chart.break.down.by><chart.source type="string">aggregate</chart.source><audience.type type="string">role</audience.type><fieldlist sctype="array"><fieldlist sctype="string">incident.id</fieldlist><fieldlist sctype="string">open</fieldlist><fieldlist sctype="string">title</fieldlist><fieldlist sctype="string">contact.name</fieldlist><fieldlist sctype="string">affected.item</fieldlist><fieldlist sctype="string">logical.name</fieldlist><fieldlist sctype="string">next.breach</fieldlist><fieldlist sctype="string">severity</fieldlist></fieldlist><viewtype type="string">Table</viewtype><role sctype="array"><role sctype="string">service desk agent</role><role sctype="string">service desk manager</role></role><filter sctype="structure"><access.filter.xml type="string">{{NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL}}</access.filter.xml><choices sctype="array"><choices sctype="string">assigned</choices></choices><search.sql type="string">true</search.sql><filter.sql type="string">(owner.name=operator())</filter.sql></filter><navLaunch type="string">recordList</navLaunch><standard.query type="string">(assignee.name=operator()) and (open~="Closed" and open~="Canceled")</standard.query><is.mobile.used type="boolean">true</is.mobile.used><aggregation.type type="string">Count</aggregation.type><inbox.description type="string">This report enables the user to review the interaction distribution chart for all open interactions assigned to the user, sorted by category .</inbox.description><list.type type="string">std</list.type><report.category type="string">Service Desk</report.category></instance></model>');
/* following inbox view reports for in=tool reporting are added in OOB with different IDs, so here they are no longer needed to handle here.
ENABLE_REPORT_QUEUES.push('<model name="inbox" query="inbox.id=&quot;10000460&quot;"><keys><inbox.id sctype="decimal">10000460</inbox.id></keys><instance recordid="Requests Awaiting Approval(PD) - Approval - %NONE% - 10000460" uniquequery="inbox.id=10000460"><operator.name type="string">%NONE%</operator.name><inbox.name type="string">Requests Awaiting Approval(PD)</inbox.name><query type="string">(approval.status="pending") and (file.name#"request")</query><use.normalized type="boolean">true</use.normalized><normalized.query type="string">(approval.status="pending") and (file.name#"request")</normalized.query><inbox.type type="string">Approval</inbox.type><sysmodcount type="decimal">18</sysmodcount><sysmoduser type="string">System.Admin</sysmoduser><sysmodtime type="dateTime">10/24/14 00:50:32</sysmodtime><short.query type="string">(approval.status="pending") and (file.name#"request")</short.query><inbox.id type="decimal">10000460</inbox.id><container.id type="decimal">0</container.id><inbox.class type="string">chart</inbox.class><inbox.manager type="string">Request.Manager</inbox.manager><attributes sctype="array"><attributes sctype="structure"><name type="string">showLegend</name><value type="string">true</value></attributes><attributes sctype="structure"><name type="string">legendPosition</name><value type="string">right</value></attributes><attributes sctype="structure"><name type="string">donut</name><value type="string">true</value></attributes><attributes sctype="structure"><name type="string">donutValue</name><value type="string">35</value></attributes><attributes sctype="structure"><name type="string">maxStackedRow</name><value type="string">12</value></attributes><attributes sctype="structure"><name type="string">decimalPlaces</name><value type="string">0</value></attributes><attributes sctype="structure"><name type="string">supportTopN</name></attributes><attributes sctype="structure"><name type="string">colorOfNumberChart</name><value type="string">#0096D6</value></attributes><attributes sctype="structure"><name type="string">maxRow</name><value type="string">12</value></attributes></attributes><chart.type type="string">number</chart.type><chart.source type="string">aggregate</chart.source><audience.type type="string">role</audience.type><fieldlist sctype="array"><fieldlist sctype="string">unique.key</fieldlist><fieldlist sctype="string">approval.status</fieldlist><fieldlist sctype="string">file.name</fieldlist><fieldlist sctype="string">last.update</fieldlist><fieldlist sctype="string">editor</fieldlist><fieldlist sctype="string">syslanguage</fieldlist></fieldlist><role sctype="array"><role sctype="string">request administrator</role><role sctype="string">request approver</role><role sctype="string">request coordinator</role></role><filter sctype="structure"><access.filter.xml type="string">{{NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL}}</access.filter.xml><choices sctype="array"><choices sctype="string">pending</choices></choices><search.fields sctype="array"><search.fields sctype="string">file.name</search.fields></search.fields><search.sql type="string">file.name#"ocmq"</search.sql><search.values sctype="array"><search.values sctype="string">ocmq</search.values></search.values><filter.sql type="string">(approval.status="pending") and (file.name#"ocmq")</filter.sql></filter><standard.query type="string">(approval.status="pending") and (file.name#"request")</standard.query><aggregation.type type="string">Count</aggregation.type><inbox.description type="string">This report enables the user to review the requests which are waiting for approval (PD).</inbox.description><list.type type="string">std</list.type><chart.number.label type="string">Awaiting Approval Requests</chart.number.label><report.category type="string">Request</report.category></instance></model>');
ENABLE_REPORT_QUEUES.push('<model name="inbox" query="inbox.id=&quot;10000461&quot;"><keys><inbox.id sctype="decimal">10000461</inbox.id></keys><instance recordid="Opened Request by phase(PD) - request - %NONE% - 10000461" uniquequery="inbox.id=10000461"><operator.name type="string">%NONE%</operator.name><inbox.name type="string">Opened Request by phase(PD)</inbox.name><query type="string">(open=true)</query><use.normalized type="boolean">true</use.normalized><normalized.query type="string">(open=true)</normalized.query><inbox.type type="string">request</inbox.type><sysmodcount type="decimal">20</sysmodcount><sysmoduser type="string">System.Admin</sysmoduser><sysmodtime type="dateTime">10/24/14 00:50:32</sysmodtime><short.query type="string">(open=true)</short.query><inbox.id type="decimal">10000461</inbox.id><container.id type="decimal">0</container.id><inbox.class type="string">chart</inbox.class><inbox.manager type="string">Request.Manager</inbox.manager><attributes sctype="array"><attributes sctype="structure"><name type="string">showLegend</name><value type="string">true</value></attributes><attributes sctype="structure"><name type="string">legendPosition</name><value type="string">right</value></attributes><attributes sctype="structure"><name type="string">donut</name><value type="string">true</value></attributes><attributes sctype="structure"><name type="string">donutValue</name><value type="string">35</value></attributes><attributes sctype="structure"><name type="string">maxStackedRow</name><value type="string">12</value></attributes><attributes sctype="structure"><name type="string">decimalPlaces</name><value type="string">0</value></attributes><attributes sctype="structure"><name type="string">supportTopN</name></attributes><attributes sctype="structure"><name type="string">colorOfNumberChart</name></attributes><attributes sctype="structure"><name type="string">maxRow</name><value type="string">12</value></attributes></attributes><chart.type type="string">pie</chart.type><chart.break.down.by type="string">current.phase</chart.break.down.by><chart.source type="string">aggregate</chart.source><audience.type type="string">role</audience.type><fieldlist sctype="array"><fieldlist sctype="string">number</fieldlist><fieldlist sctype="string">category</fieldlist><fieldlist sctype="string">current.phase</fieldlist><fieldlist sctype="string">status</fieldlist><fieldlist sctype="string">approval.status</fieldlist><fieldlist sctype="string">brief.description</fieldlist></fieldlist><role sctype="array"><role sctype="string">request administrator</role><role sctype="string">request coordinator</role><role sctype="string">request approver</role></role><filter sctype="structure"><access.filter.xml type="string">{}</access.filter.xml><choices sctype="array"><choices sctype="string">Active</choices></choices><search.sql type="string">true</search.sql><filter.sql type="string">(open=true)</filter.sql></filter><standard.query type="string">(open=true)</standard.query><aggregation.type type="string">Count</aggregation.type><inbox.description type="string">This report enables the user to review the number of opened requests, sorted by phase (PD).</inbox.description><list.type type="string">std</list.type><report.category type="string">Request</report.category></instance></model>');
ENABLE_REPORT_QUEUES.push('<model name="inbox" query="inbox.id=&quot;10000462&quot;"><keys><inbox.id sctype="decimal">10000462</inbox.id></keys><instance recordid="Request Backlog(PD) - request - %NONE% - 10000462" uniquequery="inbox.id=10000462"><operator.name type="string">%NONE%</operator.name><inbox.name type="string">Request Backlog(PD)</inbox.name><query type="string">(open=true)</query><use.normalized type="boolean">true</use.normalized><normalized.query type="string">(open=true)</normalized.query><inbox.type type="string">request</inbox.type><sysmodcount type="decimal">15</sysmodcount><sysmoduser type="string">System.Admin</sysmoduser><sysmodtime type="dateTime">10/24/14 00:50:32</sysmodtime><short.query type="string">(open=true)</short.query><inbox.id type="decimal">10000462</inbox.id><container.id type="decimal">0</container.id><inbox.class type="string">chart</inbox.class><inbox.manager type="string">Request.Manager</inbox.manager><attributes sctype="array"><attributes sctype="structure"><name type="string">showLegend</name><value type="string">true</value></attributes><attributes sctype="structure"><name type="string">legendPosition</name><value type="string">right</value></attributes><attributes sctype="structure"><name type="string">donut</name><value type="string">true</value></attributes><attributes sctype="structure"><name type="string">donutValue</name><value type="string">35</value></attributes><attributes sctype="structure"><name type="string">maxStackedRow</name><value type="string">12</value></attributes><attributes sctype="structure"><name type="string">decimalPlaces</name><value type="string">2</value></attributes><attributes sctype="structure"><name type="string">supportTopN</name></attributes><attributes sctype="structure"><name type="string">colorOfNumberChart</name></attributes><attributes sctype="structure"><name type="string">maxRow</name><value type="string">12</value></attributes></attributes><chart.type type="string">number</chart.type><chart.source type="string">aggregate</chart.source><audience.type type="string">role</audience.type><fieldlist sctype="array"><fieldlist sctype="string">number</fieldlist><fieldlist sctype="string">category</fieldlist><fieldlist sctype="string">current.phase</fieldlist><fieldlist sctype="string">status</fieldlist><fieldlist sctype="string">approval.status</fieldlist><fieldlist sctype="string">brief.description</fieldlist></fieldlist><role sctype="array"><role sctype="string">request administrator</role><role sctype="string">request coordinator</role><role sctype="string">request approver</role></role><filter sctype="structure"><access.filter.xml type="string">{}</access.filter.xml><choices sctype="array"><choices sctype="string">Active</choices></choices><search.sql type="string">true</search.sql><filter.sql type="string">(open=true)</filter.sql></filter><standard.query type="string">(open=true)</standard.query><aggregation.type type="string">Count</aggregation.type><inbox.description type="string">This report enables the user to review the number of all open requests (PD).</inbox.description><list.type type="string">std</list.type><chart.number.label type="string">Request Backlog</chart.number.label><report.category type="string">Request</report.category></instance></model>');
ENABLE_REPORT_QUEUES.push('<model name="inbox" query="inbox.id=&quot;10000463&quot;"><keys><inbox.id sctype="decimal">10000463</inbox.id></keys><instance recordid="Requests Created by Month within This Half Year(PD) - request - %NONE% - 10000463" uniquequery="inbox.id=10000463"><operator.name type="string">%NONE%</operator.name><inbox.name type="string">Requests Created by Month within This Half Year(PD)</inbox.name><query type="string">submit.date&gt;=(date(tod())-\'180 00:00:00\')</query><use.normalized type="boolean">true</use.normalized><normalized.query type="string">submit.date&gt;=(date(tod())-\'180 00:00:00\')</normalized.query><inbox.type type="string">request</inbox.type><sysmodcount type="decimal">19</sysmodcount><sysmoduser type="string">System.Admin</sysmoduser><sysmodtime type="dateTime">10/24/14 00:50:32</sysmodtime><short.query type="string">submit.date&gt;=(date(tod())-\'180 00:00:00\')</short.query><inbox.id type="decimal">10000463</inbox.id><container.id type="decimal">0</container.id><inbox.class type="string">chart</inbox.class><inbox.manager type="string">Request.Manager</inbox.manager><attributes sctype="array"><attributes sctype="structure"><name type="string">showLegend</name><value type="string">true</value></attributes><attributes sctype="structure"><name type="string">legendPosition</name><value type="string">right</value></attributes><attributes sctype="structure"><name type="string">donut</name><value type="string">true</value></attributes><attributes sctype="structure"><name type="string">donutValue</name><value type="string">35</value></attributes><attributes sctype="structure"><name type="string">maxStackedRow</name><value type="string">12</value></attributes><attributes sctype="structure"><name type="string">decimalPlaces</name><value type="string">0</value></attributes><attributes sctype="structure"><name type="string">supportTopN</name></attributes><attributes sctype="structure"><name type="string">colorOfNumberChart</name></attributes><attributes sctype="structure"><name type="string">maxRow</name><value type="string">12</value></attributes></attributes><chart.type type="string">line</chart.type><chart.break.down.by type="string">submit.date</chart.break.down.by><chart.source type="string">aggregate</chart.source><audience.type type="string">role</audience.type><fieldlist sctype="array"><fieldlist sctype="string">number</fieldlist><fieldlist sctype="string">category</fieldlist><fieldlist sctype="string">current.phase</fieldlist><fieldlist sctype="string">status</fieldlist><fieldlist sctype="string">approval.status</fieldlist><fieldlist sctype="string">brief.description</fieldlist></fieldlist><role sctype="array"><role sctype="string">request administrator</role><role sctype="string">request coordinator</role><role sctype="string">request approver</role></role><filter sctype="structure"/><standard.query type="string">submit.date&gt;=(date(tod())-\'180 00:00:00\')</standard.query><aggregation.type type="string">Count</aggregation.type><inbox.description type="string">This report enables the user to review the trend of Requests created in each month within this half of the year</inbox.description><list.type type="string">std</list.type><groupBy.calculator type="string">MONTH</groupBy.calculator><report.category type="string">Request</report.category></instance></model>');
ENABLE_REPORT_QUEUES.push('<model name="inbox" query="inbox.id=&quot;10000466&quot;"><keys><inbox.id sctype="decimal">10000466</inbox.id></keys><instance recordid="Total cost of Open Request by Month (PD) - request - %NONE% - 10000466" uniquequery="inbox.id=10000466"><operator.name type="string">%NONE%</operator.name><inbox.name type="string">Total cost of Open Request by Month (PD)</inbox.name><query type="string">submit.date&gt;=(date(tod())-\'180 00:00:00\')</query><use.normalized type="boolean">true</use.normalized><normalized.query type="string">submit.date&gt;=(date(tod())-\'180 00:00:00\')</normalized.query><inbox.type type="string">request</inbox.type><sysmodcount type="decimal">21</sysmodcount><sysmoduser type="string">System.Admin</sysmoduser><sysmodtime type="dateTime">10/24/14 00:50:32</sysmodtime><short.query type="string">submit.date&gt;=(date(tod())-\'180 00:00:00\')</short.query><inbox.id type="decimal">10000466</inbox.id><container.id type="decimal">0</container.id><inbox.class type="string">chart</inbox.class><inbox.manager type="string">Request.Manager</inbox.manager><attributes sctype="array"><attributes sctype="structure"><name type="string">showLegend</name><value type="string">true</value></attributes><attributes sctype="structure"><name type="string">legendPosition</name><value type="string">right</value></attributes><attributes sctype="structure"><name type="string">donut</name><value type="string">true</value></attributes><attributes sctype="structure"><name type="string">donutValue</name><value type="string">35</value></attributes><attributes sctype="structure"><name type="string">maxStackedRow</name><value type="string">12</value></attributes><attributes sctype="structure"><name type="string">decimalPlaces</name><value type="string">2</value></attributes><attributes sctype="structure"><name type="string">supportTopN</name></attributes><attributes sctype="structure"><name type="string">colorOfNumberChart</name></attributes><attributes sctype="structure"><name type="string">maxRow</name><value type="string">12</value></attributes></attributes><chart.type type="string">vbar</chart.type><chart.break.down.by type="string">submit.date</chart.break.down.by><chart.source type="string">aggregate</chart.source><audience.type type="string">role</audience.type><fieldlist sctype="array"><fieldlist sctype="string">number</fieldlist><fieldlist sctype="string">category</fieldlist><fieldlist sctype="string">current.phase</fieldlist><fieldlist sctype="string">status</fieldlist><fieldlist sctype="string">approval.status</fieldlist><fieldlist sctype="string">brief.description</fieldlist></fieldlist><role sctype="array"><role sctype="string">request administrator</role><role sctype="string">request coordinator</role><role sctype="string">request approver</role></role><filter sctype="structure"/><standard.query type="string">submit.date&gt;=(date(tod())-\'180 00:00:00\')</standard.query><aggregation.type type="string">Sum</aggregation.type><aggregation.field type="string">total.cost</aggregation.field><inbox.description type="string">This report enables the user to review the trend of the total cost of open Requests in each month</inbox.description><list.type type="string">std</list.type><groupBy.calculator type="string">MONTH</groupBy.calculator><report.category type="string">Request</report.category></instance></model>');
ENABLE_REPORT_QUEUES.push('<model name="inbox" query="inbox.id=&quot;10000467&quot;"><keys><inbox.id sctype="decimal">10000467</inbox.id></keys><instance recordid="Unassigned Requests by Priority(PD) - request - %NONE% - 10000467" uniquequery="inbox.id=10000467"><operator.name type="string">%NONE%</operator.name><inbox.name type="string">Unassigned Requests by Priority(PD)</inbox.name><query type="string">assigned.to=NULL</query><use.normalized type="boolean">true</use.normalized><normalized.query type="string">assigned.to=NULL</normalized.query><inbox.type type="string">request</inbox.type><sysmodcount type="decimal">18</sysmodcount><sysmoduser type="string">System.Admin</sysmoduser><sysmodtime type="dateTime">10/24/14 00:50:32</sysmodtime><short.query type="string">assigned.to=NULL</short.query><inbox.id type="decimal">10000467</inbox.id><container.id type="decimal">0</container.id><inbox.class type="string">chart</inbox.class><inbox.manager type="string">Request.Manager</inbox.manager><attributes sctype="array"><attributes sctype="structure"><name type="string">showLegend</name><value type="string">true</value></attributes><attributes sctype="structure"><name type="string">legendPosition</name><value type="string">right</value></attributes><attributes sctype="structure"><name type="string">donut</name><value type="string">true</value></attributes><attributes sctype="structure"><name type="string">donutValue</name><value type="string">35</value></attributes><attributes sctype="structure"><name type="string">maxStackedRow</name><value type="string">12</value></attributes><attributes sctype="structure"><name type="string">decimalPlaces</name><value type="string">0</value></attributes><attributes sctype="structure"><name type="string">supportTopN</name></attributes><attributes sctype="structure"><name type="string">colorOfNumberChart</name></attributes><attributes sctype="structure"><name type="string">maxRow</name><value type="string">12</value></attributes></attributes><chart.type type="string">pie</chart.type><chart.break.down.by type="string">priority</chart.break.down.by><chart.source type="string">aggregate</chart.source><audience.type type="string">role</audience.type><fieldlist sctype="array"><fieldlist sctype="string">number</fieldlist><fieldlist sctype="string">category</fieldlist><fieldlist sctype="string">current.phase</fieldlist><fieldlist sctype="string">status</fieldlist><fieldlist sctype="string">approval.status</fieldlist><fieldlist sctype="string">brief.description</fieldlist></fieldlist><role sctype="array"><role sctype="string">request administrator</role><role sctype="string">request coordinator</role><role sctype="string">request approver</role></role><filter sctype="structure"/><standard.query type="string">assigned.to=NULL</standard.query><aggregation.type type="string">Count</aggregation.type><inbox.description type="string">This report enables the user to review unassigned Requests, sorted by priority</inbox.description><list.type type="string">std</list.type><report.category type="string">Request</report.category></instance></model>');
*/

/**
 * All GlobalList Records constant
 */
// Global list for sla, to support Request, Request Task
var SLA_GL_NAMES = ["SLO Tables"];
var SLA_GL_LIST_VARS = ["request", "requestTask"];
var SLA_GL_DISP_VARS = ["Request","Request Tasks"];



// Global list for related record to support more link types



/**
 * All Links Records constant
 */

//for model change to product catalog
var RM_LINKS_1 = ["modelvendor"];
var RM_LINKLINES_1 = ["part.no"];


// links of related record constant
var RELATED_RECORD_LINKS = ["screlate.get.association"];
var RELATED_RECORD_LINKLINES = ["ocmq"];
// links of Mygroup constant
var MYGROUP_LINKS = ["myGroups"];
var MYGROUP_LINKLINES = ["member.of", "approver.of"];
// links of ocmlrec constant
var OCMLREC_LINKS = ["ocmlrec"];
var OCMLREC_LINKLINES = ["category"];
// km link
var KM_LINKS = ["kmquery"]; // some fields (category, subcategory, etc) now link to new tables (imCategory, imSubcategory, etc.)
var KM_LINKLINES = ["requestlib.category", "requestlib.subcategory"];

/**
 * All Extaccess Records constant
 */
//Define Extaccess which should not be exposed to customer in Non-PD mode.
var ENABLE_EXTACCESS=[];
ENABLE_EXTACCESS.push('<model name="extaccess" query="name=&quot;requestTask&quot;"><keys><object.name sctype="string">RequestTask</object.name><service.name sctype="string">RequestManagement</service.name></keys><instance recordid="RequestTask - RequestManagement" uniquequery="object.name=&quot;RequestTask&quot; and service.name=&quot;RequestManagement&quot;"><name type="string">requestTask</name><allowed.actions sctype="array"><allowed.actions sctype="string">Cancel Task</allowed.actions><allowed.actions sctype="string">Close Task</allowed.actions><allowed.actions sctype="string">save</allowed.actions><allowed.actions sctype="string">nextphase</allowed.actions></allowed.actions><sysmodtime type="dateTime">07/24/14 21:12:51</sysmodtime><sysmodcount type="decimal">1</sysmodcount><sysmoduser type="string">ricky.huang</sysmoduser><expressions sctype="array"><expressions sctype="operator">if ($L.bg.action="Cancel Task") then (closure.code in $L.file="9")</expressions><expressions sctype="operator">if ($L.bg.action="Close Task") then (actual.end in $L.file=tod())</expressions></expressions><service.name type="string">RequestManagement</service.name><object.name type="string">RequestTask</object.name><action.names sctype="array"><action.names sctype="string">Cancel</action.names><action.names sctype="string">Close</action.names><action.names sctype="string">Update</action.names><action.names sctype="string">MoveToNextPhase</action.names></action.names><soafield sctype="array"><soafield sctype="string">closure.code</soafield><soafield sctype="string">closure.comments</soafield><soafield sctype="string">actual.cost</soafield><soafield sctype="string">actual.end</soafield><soafield sctype="string">actual.lead.time</soafield><soafield sctype="string">actual.start</soafield><soafield sctype="string">agreement.ids</soafield><soafield sctype="string">assigned.group</soafield><soafield sctype="string">assigned.to</soafield><soafield sctype="string">balance</soafield><soafield sctype="string">company</soafield><soafield sctype="string">cost.currency.code</soafield><soafield sctype="string">cust.visible</soafield><soafield sctype="string">description</soafield><soafield sctype="string">folder</soafield><soafield sctype="string">impact</soafield><soafield sctype="string">next.breach</soafield><soafield sctype="string">number</soafield><soafield sctype="string">ooexecution.runid</soafield><soafield sctype="string">ooexecution.status</soafield><soafield sctype="string">oolink.name</soafield><soafield sctype="string">open</soafield><soafield sctype="string">ordered.quantity</soafield><soafield sctype="string">parent.request</soafield><soafield sctype="string">parent.svcCartId</soafield><soafield sctype="string">part.no</soafield><soafield sctype="string">planned.end</soafield><soafield sctype="string">planned.start</soafield><soafield sctype="string">planned.lead.time</soafield><soafield sctype="string">priority</soafield><soafield sctype="string">received.quantity</soafield><soafield sctype="string">request.coordinator</soafield><soafield sctype="string">sla.breached</soafield><soafield sctype="string">status</soafield><soafield sctype="string">title</soafield><soafield sctype="string">update.action</soafield><soafield sctype="string">update.date</soafield><soafield sctype="string">vendor</soafield><soafield sctype="string">CIListCMDB</soafield><soafield sctype="string">CIListContext</soafield><soafield sctype="string">cmdb.update.has.done</soafield><soafield sctype="string">CIReciptNo</soafield><soafield sctype="string">current.phase</soafield><soafield sctype="string">severity</soafield></soafield><soacaption sctype="array"><soacaption sctype="string">ClosureCode</soacaption><soacaption sctype="string">ClosureComments</soacaption><soacaption sctype="string">ActualCost</soacaption><soacaption sctype="string">ActualEndDate</soacaption><soacaption sctype="string">ActualLeadTime</soacaption><soacaption sctype="string">ActualStartDate</soacaption><soacaption sctype="string">SLAAgreementID</soacaption><soacaption sctype="string">AssignedGroup</soacaption><soacaption sctype="string">Assignee</soacaption><soacaption sctype="string">Balance</soacaption><soacaption sctype="string">Company</soacaption><soacaption sctype="string">Currency</soacaption><soacaption sctype="string">CustomerVisible</soacaption><soacaption sctype="string">Description</soacaption><soacaption sctype="string">Folder</soacaption><soacaption sctype="string">Impact</soacaption><soacaption sctype="string">NextExpiration</soacaption><soacaption sctype="string">RequestTaskID</soacaption><soacaption sctype="string">OOFlowRunID</soacaption><soacaption sctype="string">OOFlowRunStatus</soacaption><soacaption sctype="string">OOLinkName</soacaption><soacaption sctype="string">Open</soacaption><soacaption sctype="string">OrderQuantity</soacaption><soacaption sctype="string">ParentRequestNum</soacaption><soacaption sctype="string">ParentSvcCartID</soacaption><soacaption sctype="string">PartNO</soacaption><soacaption sctype="string">PlanEnd</soacaption><soacaption sctype="string">PlanStart</soacaption><soacaption sctype="string">PlanLeadTime</soacaption><soacaption sctype="string">Priority</soacaption><soacaption sctype="string">ReceivedQuantity</soacaption><soacaption sctype="string">Coordinator</soacaption><soacaption sctype="string">SlaBreached</soacaption><soacaption sctype="string">TaskStatus</soacaption><soacaption sctype="string">Title</soacaption><soacaption sctype="string">UpdateAction</soacaption><soacaption sctype="string">LastUpdateDate</soacaption><soacaption sctype="string">Vendor</soacaption><soacaption sctype="string">CIListPickFromCMDB</soacaption><soacaption sctype="string">CIListPickFromTicketContext</soacaption><soacaption sctype="string">CMDBUpdateHasDone</soacaption><soacaption sctype="string">NumberListOfCIReceipts</soacaption><soacaption sctype="string">CurrentPhase</soacaption><soacaption sctype="string">Urgency</soacaption></soacaption><execute.actions sctype="array"><execute.actions sctype="string"></execute.actions><execute.actions sctype="string"></execute.actions><execute.actions sctype="string"></execute.actions><execute.actions sctype="string">RM.nextTaskPhase</execute.actions></execute.actions><rest.enabled type="boolean">true</rest.enabled><rest.attachment.enabled type="boolean">true</rest.attachment.enabled><rest.resource.name type="string">RequestTask</rest.resource.name><rest.list.name type="string">requesttasks</rest.list.name><rest.keys sctype="array"><rest.keys sctype="string">number</rest.keys></rest.keys><rest.resource.put type="string">Update</rest.resource.put><rest.resource.post type="string">Update</rest.resource.post><rest.list.post type="string">Update</rest.list.post><rest.query.rights type="string">lioption("Request Management") and index("SysAdmin", $lo.ucapex)&gt;0</rest.query.rights><max.records.page type="decimal">1000</max.records.page></instance></model>');
ENABLE_EXTACCESS.push('<model name="extaccess" query="name=&quot;request&quot;"><keys><object.name sctype="string">RM</object.name><service.name sctype="string">RequestManagement</service.name></keys><instance recordid="Request - RequestManagement" uniquequery="object.name=&quot;RM&quot; and service.name=&quot;RequestManagement&quot;"><name type="string">request</name><allowed.actions sctype="array"><allowed.actions sctype="string">add</allowed.actions><allowed.actions sctype="string">Close</allowed.actions><allowed.actions sctype="string">save</allowed.actions><allowed.actions sctype="string">retract</allowed.actions><allowed.actions sctype="string">approve</allowed.actions><allowed.actions sctype="string">deny</allowed.actions><allowed.actions sctype="string">nextphase</allowed.actions><allowed.actions sctype="string">Reopen</allowed.actions></allowed.actions><sysmodtime type="dateTime">07/24/14 21:13:13</sysmodtime><sysmodcount type="decimal">1</sysmodcount><sysmoduser type="string">ricky.huang</sysmoduser><expressions sctype="array"><expressions sctype="operator">cleanup($update.action);cleanup($rm.activity);if (denull(update.action in $L.file)={""} or update.action in $L.file={}) then (update.action in $L.file=NULL)</expressions><expressions sctype="operator">$update.action=nullsub(denull(update.action in $L.file), {"No update provided"});update.action in $L.file=nullsub(update.action in $L.file.save, {""})</expressions><expressions sctype="operator">$rm.activity="external update"</expressions><expressions sctype="operator">if ($L.mode="update") then (current.phase in $L.file=current.phase in $L.file.save)</expressions></expressions><service.name type="string">RequestManagement</service.name><object.name type="string">RM</object.name><action.names sctype="array"><action.names sctype="string">Create</action.names><action.names sctype="string">Close</action.names><action.names sctype="string">Update</action.names><action.names sctype="string">Retract</action.names><action.names sctype="string">Approve</action.names><action.names sctype="string">Deny</action.names><action.names sctype="string">MoveToNextPhase</action.names><action.names sctype="string">Reopen</action.names></action.names><soafield sctype="array"><soafield sctype="string">admin.follow.time</soafield><soafield sctype="string">admin.lead.time</soafield><soafield sctype="string">agreement.ids</soafield><soafield sctype="string">alert</soafield><soafield sctype="string">alert.names</soafield><soafield sctype="string">alert.status</soafield><soafield sctype="string">approval.status</soafield><soafield sctype="string">approved.groups</soafield><soafield sctype="string">assigned.group</soafield><soafield sctype="string">assigned.to</soafield><soafield sctype="string">bill.to.code</soafield><soafield sctype="string">bill.to.dept</soafield><soafield sctype="string">bill.to.ext</soafield><soafield sctype="string">brief.description</soafield><soafield sctype="string">building</soafield><soafield sctype="string">business.area</soafield><soafield sctype="string">cancelled.date</soafield><soafield sctype="string">category</soafield><soafield sctype="string">close.date</soafield><soafield sctype="string">closed.by</soafield><soafield sctype="string">closure.code</soafield><soafield sctype="string">closure.comments</soafield><soafield sctype="string">comments</soafield><soafield sctype="string">company</soafield><soafield sctype="string">coordinator.dept</soafield><soafield sctype="string">coordinator.name</soafield><soafield sctype="string">cost.currency.code</soafield><soafield sctype="string">current.pending.groups</soafield><soafield sctype="string">current.phase</soafield><soafield sctype="string">cust.visible</soafield><soafield sctype="string">delivery.date</soafield><soafield sctype="string">description</soafield><soafield sctype="string">exchange.info</soafield><soafield sctype="string">floor</soafield><soafield sctype="string">folder</soafield><soafield sctype="string">future.groups</soafield><soafield sctype="string">global.lead.time</soafield><soafield sctype="string">hire.type</soafield><soafield sctype="string">impact</soafield><soafield sctype="string">justification</soafield><soafield sctype="string">last.operator</soafield><soafield sctype="string">location</soafield><soafield sctype="string">location.code</soafield><soafield sctype="string">model</soafield><soafield sctype="string">modelname</soafield><soafield sctype="string">next.breach</soafield><soafield sctype="string">number</soafield><soafield sctype="string">office.cube</soafield><soafield sctype="string">open</soafield><soafield sctype="string">orig.operator</soafield><soafield sctype="string">pay.type</soafield><soafield sctype="string">pending.groups</soafield><soafield sctype="string">phase.desc</soafield><soafield sctype="string">planned.end</soafield><soafield sctype="string">planned.start</soafield><soafield sctype="string">priority</soafield><soafield sctype="string">project.id</soafield><soafield sctype="string">reason</soafield><soafield sctype="string">requested.date</soafield><soafield sctype="string">requested.for</soafield><soafield sctype="string">requestor.dept</soafield><soafield sctype="string">requestor.name</soafield><soafield sctype="string">requestor.phone</soafield><soafield sctype="string">room</soafield><soafield sctype="string">ship.to.code</soafield><soafield sctype="string">ship.to.ext</soafield><soafield sctype="string">shipping.terms</soafield><soafield sctype="string">sla.breach</soafield><soafield sctype="string">status</soafield><soafield sctype="string">subcategory</soafield><soafield sctype="string">submit.date</soafield><soafield sctype="string">svc.options</soafield><soafield sctype="string">svcCartId</soafield><soafield sctype="string">total.cost</soafield><soafield sctype="string">update.action</soafield><soafield sctype="string">update.date</soafield><soafield sctype="string">severity</soafield><soafield sctype="string">affected.item</soafield><soafield sctype="string">logical.name</soafield></soafield><soacaption sctype="array"><soacaption sctype="string">AdminFollowTime</soacaption><soacaption sctype="string">AdminLeadTime</soacaption><soacaption sctype="string">AgreementIds</soacaption><soacaption sctype="string">Alert</soacaption><soacaption sctype="string">AlertNames</soacaption><soacaption sctype="string">AlertStatus</soacaption><soacaption sctype="string">ApprovalStatus</soacaption><soacaption sctype="string">ApprovedGroups</soacaption><soacaption sctype="string">AssignedGroup</soacaption><soacaption sctype="string">AssignedTo</soacaption><soacaption sctype="string">BilltoCode</soacaption><soacaption sctype="string">BilltoDept</soacaption><soacaption sctype="string">BilltoExt</soacaption><soacaption sctype="string">BriefDescription</soacaption><soacaption sctype="string">Building</soacaption><soacaption sctype="string">BusinessArea</soacaption><soacaption sctype="string">CancelledDate</soacaption><soacaption sctype="string">Category</soacaption><soacaption sctype="string">CloseDate</soacaption><soacaption sctype="string">ClosedBy</soacaption><soacaption sctype="string">ClosureCode</soacaption><soacaption sctype="string">ClosureComments</soacaption><soacaption sctype="string">Comments</soacaption><soacaption sctype="string">Company</soacaption><soacaption sctype="string">CoordinatorDept</soacaption><soacaption sctype="string">CoordinatorName</soacaption><soacaption sctype="string">CostCurrencyCode</soacaption><soacaption sctype="string">CurrentPendingGroups</soacaption><soacaption sctype="string">CurrentPhase</soacaption><soacaption sctype="string">CustVisible</soacaption><soacaption sctype="string">DeliveryDate</soacaption><soacaption sctype="string">Description</soacaption><soacaption sctype="string">ExchangeInfo</soacaption><soacaption sctype="string">Floor</soacaption><soacaption sctype="string">Folder</soacaption><soacaption sctype="string">FutureGroups</soacaption><soacaption sctype="string">GlobalLeadTime</soacaption><soacaption sctype="string">HireType</soacaption><soacaption sctype="string">Impact</soacaption><soacaption sctype="string">Justification</soacaption><soacaption sctype="string">LastOperator</soacaption><soacaption sctype="string">Location</soacaption><soacaption sctype="string">LocationCode</soacaption><soacaption sctype="string">Model</soacaption><soacaption sctype="string">ModelName</soacaption><soacaption sctype="string">NextBreach</soacaption><soacaption sctype="string">Number</soacaption><soacaption sctype="string">OfficeCube</soacaption><soacaption sctype="string">Open</soacaption><soacaption sctype="string">OrigOperator</soacaption><soacaption sctype="string">PayType</soacaption><soacaption sctype="string">PendingGroups</soacaption><soacaption sctype="string">PhaseDesc</soacaption><soacaption sctype="string">PlannedEnd</soacaption><soacaption sctype="string">PlannedStart</soacaption><soacaption sctype="string">Priority</soacaption><soacaption sctype="string">ProjectId</soacaption><soacaption sctype="string">Reason</soacaption><soacaption sctype="string">RequestedDate</soacaption><soacaption sctype="string">RequestedFor</soacaption><soacaption sctype="string">RequestedDept</soacaption><soacaption sctype="string">RequestorName</soacaption><soacaption sctype="string">RequestorPhone</soacaption><soacaption sctype="string">Room</soacaption><soacaption sctype="string">ShiptoCode</soacaption><soacaption sctype="string">ShiptoExt</soacaption><soacaption sctype="string">ShippingTerms</soacaption><soacaption sctype="string">SlaBreach</soacaption><soacaption sctype="string">Status</soacaption><soacaption sctype="string">Subcategory</soacaption><soacaption sctype="string">SubmitDate</soacaption><soacaption sctype="string">SvcOptions</soacaption><soacaption sctype="string">SvcCartId</soacaption><soacaption sctype="string">TotalCost</soacaption><soacaption sctype="string">UpdateAction</soacaption><soacaption sctype="string">UpdateDate</soacaption><soacaption sctype="string">Urgency</soacaption><soacaption sctype="string">AffectedService</soacaption><soacaption sctype="string">AffectedCI</soacaption></soacaption><execute.actions sctype="array"><execute.actions sctype="string">RM.createRecord</execute.actions><execute.actions sctype="string"></execute.actions><execute.actions sctype="string"></execute.actions><execute.actions sctype="string"></execute.actions><execute.actions sctype="string"></execute.actions><execute.actions sctype="string"></execute.actions><execute.actions sctype="string">RM.nextRequestPhase</execute.actions></execute.actions><rest.enabled type="boolean">true</rest.enabled><rest.attachment.enabled type="boolean">true</rest.attachment.enabled><rest.resource.name type="string">Request</rest.resource.name><rest.list.name type="string">requests</rest.list.name><rest.keys sctype="array"><rest.keys sctype="string">number</rest.keys></rest.keys><rest.resource.put type="string">Update</rest.resource.put><rest.resource.post type="string">Update</rest.resource.post><rest.list.post type="string">Create</rest.list.post><rest.query.rights type="string">lioption("Request Management") and index("SysAdmin", $lo.ucapex)&gt;0</rest.query.rights><max.records.page type="decimal">1000</max.records.page></instance></model>');
/**
 *Connector constant
 */
 var ENABLE_CONNECTORS=["Open New Request"];
 var ENABLE_CONNECTORWIZARDS=["svcCat Select Connector"];
  
 /**
 *Display Options Constant
 */
 
 var DO_NAMES = ["am.display.joinfile_do nothing_18", "am.display.joinfile_do nothing_2", "am.display.joinfile_do nothing_4"];
 var DS_ID = "am.display.joinfile";
 
 var DISABLE_DOS=[];
 DISABLE_DOS.push(["am.display.joinfile_do nothing_18","am.display.joinfile"]);
 DISABLE_DOS.push(["am.display.joinfile_do nothing_2","am.display.joinfile"]);
 DISABLE_DOS.push(["am.display.joinfile_do nothing_4","am.display.joinfile"]);
 
 var ENABLE_DOS = [];
 ENABLE_DOS.push(["am.display.joinfile_do nothing_18_for_pdrequest_tobe_used","am.display.joinfile"]);
  
/**
 **Validity Configuraitons
 */
var VALIDITY_CONFIG = [{
    filename: "stock",
    fields: ["part.no"],
    sequence: [null]
}, {
    filename: "modelvendor",
    fields: ["part.no"],
    sequence: [null]
}];

var PDTMP_SUFFIX_SHORT_VALIDITY = "_for_pdrm";
var LEGACY_SUFFIX_SHORT_VALIDITY = "_disabled";

/**
 **Schedule Configuraitons
 */

var SCHEDULE_TO_REMOVE = ["OCM Create Order"];

/**
 **kmknowledgebase Request_Library
 */
var KM_KNOWLEDGEBASES = [];
KM_KNOWLEDGEBASES.push("Request_Library");

var KM_REQUEST_TRIGGERS = ["after.add.KM.ocmq", "after.update.KM.ocmq", "before.delete.KM.ocmq", "before.update.KM.ocmq"];


/**
 * Replace or delete a record
 */
function enableReplaced() {
	// 3. enable all display screen/display option includes Queue Display
    enableDisplays();
    
	// 7. Service Catalog Connector
    enableConnetor();
    
    //10. Object
    enableObjects();
    
     //15. enable Validity.
    
    
    // kmknowledgebase
    replaceKMRecords();
    
    // kmknowledgebasetemp
    replaceKMTempRecords();
    // km triggers in ocmq
    replaceKMTriggers(KM_REQUEST_TRIGGERS);
}

/**
 * Update the current record directly
 */
function enableUpdated(buildFlag) {
	// 2. add PD Request Menues and Change OOB Request Menu 
    enableMenus();
    
    // 4. links for normal records
    enableLinks();
    
    // 5. inbox
    enableInboxes();
    
    // 6. SLA
    enableSLA();
    
	// 8. extaccess
    enablePDRequestExtaccesses();
    
    //11. Search Configuration
    enableSearchConfigs();
    
     //12. Service Desk Environment RM Post Back Link
    enableSDEnvRMLink();
    
    //13. Migrate link from 'model' to 'productCatalog'
    var BUILD_FLAG_NOT_A_BUILD="No";
    var BUILD_FLAG_FRESH_BUILD="Fresh";
    if(buildFlag==BUILD_FLAG_NOT_A_BUILD||buildFlag==BUILD_FLAG_FRESH_BUILD)
    {
    	enableProductCatalogLink();
    }
    
    //14. Migrate Legacy change group and request group to Assingment Group
   if(buildFlag==BUILD_FLAG_NOT_A_BUILD||buildFlag==BUILD_FLAG_FRESH_BUILD)
    {
    	enableAssignment();
    }
    
    //15. Migrate Legacy security profile to security role
    if (buildFlag == BUILD_FLAG_NOT_A_BUILD) {
        enableSecurity();
    }
    
    //16. enable Schedules.
    if(buildFlag==BUILD_FLAG_NOT_A_BUILD||buildFlag==BUILD_FLAG_FRESH_BUILD)
    {
    	enableSchedules();
    }
}

/**
 * Main method of enabling the PD Request Management .
 */
function enablePDRequestManagement(purgeFlag) {
    print("Starting enabling PD Request Management...");

    // 1. check whether PD Request Management already enabled
    if(checkEnabled()) {
        print("The PD Request Management has already been enabled, ignore current enable process!");
        return;
    }
    
    // replace or delete or add a record
    enableReplaced();
    // update a record
    enableUpdated(purgeFlag);

    print("Finish enabling PD Request Management");    
}

function checkEnabled() {
  
  // Check whether PD Request Module is enabled. 
  var obj = lib.c.$("Object").select('file.name=\"request\"').uniqueResult();  
  if(obj == null) {  
     return false;
  } else {
     return true;
  }  
}
 


function enableMenus() {
  print("Start enabling Menus for Request Module...");
  
  var i, j;
  
  for(i=0; i<TOP_MENUS.length; i++) {
        print("Enabling Top Menu \"" + TOP_MENUS[i] + "\"...");
        var topMenu = new SCFile("menu");
    var topMenuQuerySQL = "name=\"" + TOP_MENUS[i] + "\"";

    if (topMenu.doSelect(topMenuQuerySQL) == RC_SUCCESS) {
          if(null!=topMenu.description) {
            // duplicate the original top menu
        var oldTopMenu = new SCFile("menu");
        system.vars.$L_void=system.functions.fduplicate(oldTopMenu, topMenu);

            for(j=0; j<topMenu.description.length(); j++) {
              for(var k=0; k<PD_MENU_DESCS.length; k++) {
                
                if(topMenu.description[j] == PD_MENU_DESCS[k]) {
                  print("Update menu \"" + topMenu.description[j] + "\"");
                  topMenu.group[j] = null;
                  topMenu.command[j] = null;
                  topMenu.description[j] = PD_MENU_DESCS_NEW[k];
                  topMenu.application[j] = "menu.manager";
                  topMenu.pname[j] = "name";
                  topMenu.pvalue[j] = PD_MENU_NAMES[k];
                  topMenu.thread[j] = null;
                  topMenu.condition[j] = PD_MENU_CONDS[k];  
                  topMenu.icon[j] = getIconForPDMenu(PD_MENU_DESCS[k]);
                }
              }
            }
          
            topMenu.doUpdate();
            addSMPatches(topMenu, oldTopMenu, "menu;" + topMenu.name, "update");
          }

          print("Enabled top menu \"" + TOP_MENUS[i] + "\" for Change Module.");
    } else {
        // Ignore it if the top menu does not exist
      print("Can not find the top menu, ignore the enabling for top menu \"" + TOP_MENUS[i] + "\"!");
    }
    }

    print("Removing the Request ENV menu items under \"System Administration->Onging Maintenance-> Environment Records\"...");
    // find the menu "ENV RECORDS", and remove the PD help desk related menus.
    
    var envMenu = new SCFile("menu");
  var envMenuQuerySQL = "name=\"ENV RECORDS\"";
  if (envMenu.doSelect(envMenuQuerySQL) == RC_SUCCESS) {
    // duplicate the original env menu
    var oldEnvMenu = new SCFile("menu");
    system.vars.$L_void=system.functions.fduplicate(oldEnvMenu, envMenu);

    for(j=envMenu.description.length()-1; j>=0; j--) {
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
    print("Finish removing the Request ENV menus items");
    
    
  //QCCR1E117008 There is still legacy item in the PD menu.
  //1. Delete "Models" menu item under System Administration -> Base System Configuration.
  //2. In System Administration -> Ongoing Maintenance -> Groups, delete "Change Management Message Groups"; rename "ChM Membership" as "Group Membership"; rename "Incident Management Assignment Groups" as "Assignment Groups".
  print("Updating the system menu related to PD Request");
  for (var x=0; x<EXT_MENU_ITEM_TO_REMOVE.length; x++)
  {
    var topMenu = EXT_MENU_ITEM_TO_REMOVE[x][0];
    var menuItem = EXT_MENU_ITEM_TO_REMOVE[x][1];
    print("Removing Menu Item \""+ menuItem +"\" in Top Menu \"" + topMenu + "\"...");
    var toRemoveMainMenu = new SCFile("menu");
    var toRemoveMainMenuQuerySQL = "name=\""+ topMenu +"\"";
    if (toRemoveMainMenu.doSelect(toRemoveMainMenuQuerySQL) == RC_SUCCESS) {
      var oldMenu = new SCFile("menu");
      system.vars.$L_void=system.functions.fduplicate(oldMenu, toRemoveMainMenu);
      for(j=toRemoveMainMenu.description.length()-1; j>=0; j--) {
        if(menuItem == toRemoveMainMenu.description[j]) {
          print("Remove Menu Item \"" + toRemoveMainMenu.description[j]);
          toRemoveMainMenu.option[j] = null;
          toRemoveMainMenu.group[j] = null;
          toRemoveMainMenu.description[j] = null;
          toRemoveMainMenu.command[j] = null;
          toRemoveMainMenu.application[j] = null;
          toRemoveMainMenu.pname[j] = null;
          toRemoveMainMenu.pvalue[j] = null;
          toRemoveMainMenu.thread[j] = null;
          toRemoveMainMenu.condition[j] = null;
          toRemoveMainMenu.system[j] = null;
        }
      }
      toRemoveMainMenu.doUpdate();
      addSMPatches(toRemoveMainMenu, oldMenu, "menu;" + toRemoveMainMenu.name, "update");
    }
    else
    {
      print("Can not find the menu \""+topMenu+"\", ignore the removing\"!");
    }
  }

  for (var x=0; x<EXT_MENU_ITEM_TO_RENAME.length; x++)
  {
    var topMenu = EXT_MENU_ITEM_TO_RENAME[x][0];
    var menuItem = EXT_MENU_ITEM_TO_RENAME[x][1];
    var newMenuItem = EXT_MENU_ITEM_TO_RENAME[x][2];
    print("Updating Menu Item \""+ menuItem +"\" in Top Menu \"" + topMenu + "\"...");
    var toUpdateMainMenu = new SCFile("menu");
    var toUpdateMainMenuQuerySQL = "name=\""+ topMenu +"\"";
    if (toUpdateMainMenu.doSelect(toUpdateMainMenuQuerySQL) == RC_SUCCESS) {
      var oldMenu = new SCFile("menu");
      system.vars.$L_void=system.functions.fduplicate(oldMenu, toUpdateMainMenu);
      for(j=toUpdateMainMenu.description.length()-1; j>=0; j--) {
        if(menuItem == toUpdateMainMenu.description[j]) {
          print("Rename Menu Item \"" + toUpdateMainMenu.description[j]);
          toUpdateMainMenu.description[j] = newMenuItem;
        }
      }
      toUpdateMainMenu.doUpdate();
      addSMPatches(toUpdateMainMenu, oldMenu, "menu;" + toUpdateMainMenu.name, "update");
    }
    else
    {
      print("Can not find the menu \""+topMenu+"\", ignore the removing\"!");
    }
  }

  print("Finish Updating the system menu related to PD Request");
    
    print("Removing the Request Profile menu items under \"System Administration->Onging Maintenance-> Profiles\"...");
    var profileMenu = new SCFile("menu");
  var profileMenuQuerySQL = "name=\"MODULE PROFILES\"";
  if (profileMenu.doSelect(profileMenuQuerySQL) == RC_SUCCESS) {
    // duplicate the original env menu
    var oldprofileMenu = new SCFile("menu");
    system.vars.$L_void=system.functions.fduplicate(oldprofileMenu, profileMenu);

    for(j=profileMenu.description.length()-1; j>=0; j--) {
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
    print("Finish removing the Request Profile menus items");
   

  print("Finish enabling Menus");
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

function enableDisplays() {
   print("Start enabling Display Options...");
   enableDisplayOption(DO_NAMES, DS_ID);  
   print("Finish enabling Display Options");

}

function enableDisplayOption(displayOptions, displayScreen) {
    print("Start enabling Display Options for displayScreen"+ displayScreen + "...");
    
    var i;
    for(i=0; i<displayOptions.length; i++) {
        print("Enabling Display Option \"" + displayOptions[i] + "\"...");
        var legacyDisplayOption = new SCFile("displayoption");
	    var legacyQuerySQL = "id=\"" + displayOptions[i] + "\" and screen.id=\"" + displayScreen + "\"";
		// find the legacy Display Option, rename it if it exists.
		var oldLegacyDisplayOption = null;
      	if (legacyDisplayOption.doSelect(legacyQuerySQL) == RC_SUCCESS) {
        	// duplicate the original legacy displayoption
       		oldLegacyDisplayOption = new SCFile("displayoption");
        	system.vars.$L_void=system.functions.fduplicate(oldLegacyDisplayOption, legacyDisplayOption);

	        legacyDisplayOption.id = displayOptions[i] + LEGACY_SUFFIX;
    	    legacyDisplayOption.screen_id = displayScreen + LEGACY_SUFFIX;
        	legacyDisplayOption.doUpdate();

	        print("Renamed the legacy Display Option name to \"" + legacyDisplayOption.id + "\"");
    	} else {
        	legacyDisplayOption = null;
      	}
        
        var pdDisplayOption = new SCFile("displayoption");
	    var pdQuerySQL = "id=\"" + displayOptions[i] + PDTMP_SUFFIX + "\" and screen.id=\"" + displayScreen + PDTMP_SUFFIX + "\"";
   		 // find the PD temp Display Option first
    	if (pdDisplayOption.doSelect(pdQuerySQL) == RC_SUCCESS) {
			// rename the PD temp Display Option
      		pdDisplayOption.id = displayOptions[i];
      		pdDisplayOption.screen_id = displayScreen;
      		pdDisplayOption.doUpdate();
          	print("Enabled Display Option \"" + displayOptions[i] + "\".");
    	} else {
    		pdDisplayOption = null;
	    }
      	
      	if (pdDisplayOption != null) {
      		addSMPatches(pdDisplayOption, oldLegacyDisplayOption, "displayoption;" + pdDisplayOption.id, "update");
      	} else {
      		pdDisplayOption = oldLegacyDisplayOption;
      	}
      	
      	// insert to table forcedobjects
		if (pdDisplayOption != null) {
        	forceObject("displayoption", pdDisplayOption, legacyDisplayOption);
        }
      	
    }
    
    
    print("Finish enabling Display Options for displayScreen"+ displayScreen + "...");
}


function  enableLinks(){

    print("Start enabling RM Links...");
    updateLinks(RELATED_RECORD_LINKS, RELATED_RECORD_LINKLINES);
    updateLinks(MYGROUP_LINKS, MYGROUP_LINKLINES);
    //updateLinks(OCMLREC_LINKS, OCMLREC_LINKLINES);
    updateLinks(KM_LINKS, KM_LINKLINES);
    print("Finish enabling RM Links");

}

function  enableSDEnvRMLink(){

    print("Start enabling Service Desk Environment RM Links...");
    updateRecords(["service desk"], "environment", "name", ["post.back.link.rm"], ["request.incident.post.back"]);
    print("Finish enabling Service Desk Environment RM Links");

}

function enableRelatedRecordLinks() {
    print("Start enabling Related Record Links...");
    updateLinks(RELATED_RECORD_LINKS, RELATED_RECORD_LINKLINES);
    print("Finish enabling Related Record Links");

    print("Start enabling Related Record Global Lists...");
    appendToGL(RELATED_GL_NAMES, RELATED_GL_LIST_VARS_APPEND, RELATED_GL_DISP_VARS_APPEND, RELATED_GL_MSG_VARS_APPEND);
    removeFromGL(RELATED_GL_NAMES, RELATED_GL_LIST_VARS_REMOVE, RELATED_GL_DISP_VARS_REMOVE, RELATED_GL_MSG_VARS_REMOVE);
    print("Finish enabling Related Record Global Lists");    
}



function enableInboxes() {
    print("Start enabling Inboxes...");

    updateInboxes(ENABLE_QUEUES);
    disabelLagacyRequestInbox();
    enableReportInbox();

    print("Finish enabling Inboxes");
}

function enableSLA() {
    print("Start enabling SLA...");

    appendToGL(SLA_GL_NAMES, SLA_GL_LIST_VARS, SLA_GL_DISP_VARS);

    print("Finish enabling SLA");
}

function enableSecurity() {
    print("Start enabling Security...");

    lib.RequestUpgradeManager.getInstance().upgradeProfiles();
 
    var ret = 0;
    system.functions.rtecall("trigger", ret, 0);
    lib.RequestUpgradeManager.getInstance().upgradeOperators();
    system.functions.rtecall("trigger", ret, 1);
    lib.RequestUpgradeManager.getInstance().upgradeUserRoles();

    print("Finish enabling Security");
}



  


function enablePDRequestExtaccesses() {
    print("Start enabling PD Request Management extaccess...");
     
     for(var i = 0; i<ENABLE_EXTACCESS.length;++i)
     { 
      var pdRecord = new SCFile("extaccess");
      pdRecord.setRecord(ENABLE_EXTACCESS[i]);
      
      var checkRecord = $("extaccess").select('object.name="' + pdRecord["object.name"] + '"').uniqueResult();
      
      if (checkRecord == null) {
      	pdRecord.doInsert();
      	print("Enabled extaccess \"" + pdRecord["object.name"] + "--"+ pdRecord["service.name"] + "\" of file \"" + pdRecord["name"] + "\".");
      	addSMPatches(pdRecord, pdRecord, "extaccess;" + pdRecord.object_name + ";" + pdRecord.service_name , "add");
      }
     }
    print("Finish enabling PD Request Management extaccess");
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
function replaceRecordsByRename(records, fileName, keyField) {
    if(null == records) {
      return;
    }

    for(var i=0; i<records.length; i++) {
        print("Enabling " + fileName + " \"" + records[i] + "\"...");
    	
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
      	
      	var pdRecord = new SCFile(fileName);
    	var pdQuerySQL = keyField + "=\"" + records[i] + PDTMP_SUFFIX + "\"";
    	// find the PD temp record first
    	if (pdRecord.doSelect(pdQuerySQL) == RC_SUCCESS) {
      		// rename the PD temp Record name
      		pdRecord[keyField] = records[i];
      		pdRecord.doUpdate();
        	print("Enabled " + fileName + " \"" + records[i] + "\".");
	    } else {
    	    pdRecord = null;
    	}
      	
      	if (pdRecord != null) {
      		addSMPatches(pdRecord, oldLegacyRecord, fileName + ";" + pdRecord[keyField], "update");
      	} else {
      		pdRecord = oldLegacyRecord;
      	}
      	
		// insert to table forcedobjects
		if (pdRecord != null) {
        	forceObject(fileName, pdRecord, legacyRecord);
        }
    }
}


/**
 * The common private function for replacing a list of legacy records with PD records
 * by removing the key filed value of legacy record from xxx
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
            legacyRecord.doDelete();
            print("Deleted the legacy " + fileName + " " + keyField );
          } else {
            legacyRecord = null;
            print("The legacy " + fileName + " does not exist.");
          }

          // rename the PD temp Record name
          pdRecord[keyField] = records[i];
          pdRecord.doUpdate();
          
          // DO NOT insert to table forcedobjects for update only
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
        } while (pdRecord.getNext() == RC_SUCCESS);
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
 * @param updateFields  the list of field name to be updated.
 * @param updateValues  the list of value to be updated to the update field.
 */
function updateRecords(records, fileName, keyField, updateFields, updateValues) {
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
        for(var j=0;j<updateFields.length;++j)
        {
            pdRecord[updateFields[j]] = updateValues[j];
            print("Updated the field " + updateFields[j] + " of " + fileName + " " + records[i] + " to \"" + updateValues[j] + "\"");
        }
        pdRecord.doUpdate();
        addSMPatches(pdRecord, oldPdRecord, fileName + ";" + pdRecord[keyField], "update");

        
        } while (pdRecord.getNext() == RC_SUCCESS);
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
        } while (pdRecord.getNext() == RC_SUCCESS);
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
      //do {
        if(ENABLE_QUEUE_OPERATION_DELETE==records[i][1]) {
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
            pdRecord.doUpdate();
            addSMPatches(pdRecord, oldPdRecord, "inbox;" + pdRecord.inbox_id , "update");
            
            print("Updated inbox \"" + records[i][0] + "\".");
        } else if(ENABLE_QUEUE_OPERATION_ADD==records[i][1]){
          for(var j=0; j<records[i][2].length; j++) {
                pdRecord[records[i][2][j]] = records[i][3][j];            
            }
            pdRecord.inbox_id=null;
            
            var checkRecord = $("inbox").select('inbox.name="' + pdRecord["inbox.name"] + '"').uniqueResult();
            if (checkRecord == null) {
            	pdRecord.doInsert();
            	addSMPatches(pdRecord, pdRecord, "inbox;" + pdRecord.inbox_id , "add");
            
            	print("Added inbox \"" + pdRecord.inbox_name + "\".");
            }
        } else if(ENABLE_QUEUE_OPERATION_REPLACE==records[i][1]){
           // duplicate the original datadict
          var oldPdRecord = new SCFile("inbox");
          system.vars.$L_void=system.functions.fduplicate(oldPdRecord, pdRecord);

            for(var j=0; j<records[i][2].length; j++) {
                var oldValue = pdRecord[records[i][2][j]];
                var newValue =  oldValue.replace(records[i][3][j], records[i][4][j]);               
                pdRecord[records[i][2][j]]=newValue;              
                print("Updating field \"" + records[i][2][j] + "\" to value \"" + newValue + "\".");
            }
            pdRecord.doUpdate();
            addSMPatches(pdRecord, oldPdRecord, "inbox;" + pdRecord.inbox_id , "update");           
            print("Updated inbox \"" + records[i][0] + "\".");
        
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
        } while (glRecord.getNext() == RC_SUCCESS);
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
        } while (glRecord.getNext() == RC_SUCCESS);
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

function enableObjects() {
    print("Start enabling Objects...");
    replaceRecordsByRename(OBJECT_NAMES, "Object", "file.name");
    print("Finish enabling Objects");
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

      // update the tablename to xx_disabled_by_PDHD
      if(searchConfig.allowAdvAccess!=null) {
        searchConfig.allowAdvAccess = system.functions.parse(system.functions.str(searchConfig.allowAdvAccess).replace("false and",""),2);
      } else {
        searchConfig.allowAdvAccess = system.functions.parse("true",2);
      }
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
        searchConfig.allowAdvAccess = system.functions.parse("("+system.functions.str(searchConfig.allowAdvAccess) + ") and false",2);
      } else {
        searchConfig.allowAdvAccess = system.functions.parse("false",2);
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


function enableConnetor() {
    print("Start enabling Connector...");
    replaceRecords(ENABLE_CONNECTORS, "svcCatInterface", "interface.name");
    replaceRecords(ENABLE_CONNECTORWIZARDS, "wizard", "name");
    print("Finish enabling Connector");
}

function enableProductCatalogLink() {
    var link = new SCFile("link");
    var rc = link.doSelect("target.files=\"model\"");
    var fields = ['source.fields', 'target.fields', 'project.source.fields', 'project.target.fields',"comment", "qbe.format", "sort.fields", "link.expressions", "javascript.pre", "javascript.post", "post.expressions", "javascript.post", "target.sort.field", "target.sort.order"];
    while (rc == RC_SUCCESS) {

        print("Enabling link \"" + link.name + "\"...");

        // duplicate the original link
        var oldPdRecord = new SCFile("link");
        system.vars.$L_void = system.functions.fduplicate(oldPdRecord, link);

        var lng = system.functions.lng(link['source.fields']);
        var added = 0;
        for (var j = 0; j < lng; j++) {
            if (link['target.files'][j] == "model" && !_.string.endsWith(link['source.fields'][j],LEGACY_SUFFIX)) {

                print("Create link line \"" + link['source.fields'][j] + "\"");
                for (var k = 0; k < fields.length; ++k) {
                    if (link[fields[k]]) {
                        link[fields[k]][lng + added] = link[fields[k]][j];
                    }
                }
                link['target.files'][lng + added] = "productCatalog";
                /*use RAD expression to copy add.query, otherwise, it will lose the type*/
                vars.$L_temp_link=link;
                var statements=(lng + added+1)+" in add.query in $L.temp.link="+(j+1)+" in add.query in $L.temp.link";
                _parse_evaluate(statements,11);


                print("Update the legacy link line from \"" + link['source.fields'][j] + "\" to \"" + link['source.fields'][j] + LEGACY_SUFFIX + "\"");
                link['source.fields'][j] = link['source.fields'][j] + LEGACY_SUFFIX;

                added = added + 1;
            }
        }

        print("Enabled link \"" + link.name + "\".");
        link.doUpdate();
        addSMPatches(link, oldPdRecord, "link;" + link.name, "update");
        rc = link.getNext();
    }
}


function enableAssignment() {
    print("Start enabling Assignment Group...");
    lib.MergeGroupsUtil.DataMigrationForLegacyGroups();
    print("Finish enabling Assignment Group");
}


function enableSchedules() {
    print("Start enabling Schedules...");
    for (var i = 0; i < SCHEDULE_TO_REMOVE.length; ++i) {
        var fSch = new SCFile("schedule");
        if (RC_SUCCESS == fSch.doSelect('name="' + SCHEDULE_TO_REMOVE[i] + '"')) {
            fSch.doDelete();
            // we do nothing for inbox deltion in smpatches
            print("Deleted the schedule \"" + SCHEDULE_TO_REMOVE[i] + "\"");
        }
    }

    print("Finish enabling Schedules");
}

function replaceValidities() {
    for (var it = 0; it < VALIDITY_CONFIG.length; ++it) {
        for (var i = 0; i < VALIDITY_CONFIG[it].fields.length; i++) {
            print("Enabling validity \"" + VALIDITY_CONFIG[it].fields[i] + "\"...");
            var pdRecord = new SCFile("validity");
            var pdQuerySQL = "filename=\"" + VALIDITY_CONFIG[it].filename + PDTMP_SUFFIX_SHORT_VALIDITY + "\" and field.name=\"" + VALIDITY_CONFIG[it].fields[i] + "\"";
            pdQuerySQL = VALIDITY_CONFIG[it].sequence[i] ? (pdQuerySQL + " and sequence=\"" + VALIDITY_CONFIG[it].sequence[i] + "\"") : pdQuerySQL;
            
            // find the PD temp record first
            if (pdRecord.doSelect(pdQuerySQL) == RC_SUCCESS) {
                var legacyRecord = new SCFile("validity");
                var legacyQuerySQL = "filename=\"" + VALIDITY_CONFIG[it].filename + "\" and field.name=\"" + VALIDITY_CONFIG[it].fields[i] + "\"";
                legacyQuerySQL = VALIDITY_CONFIG[it].sequence[i] ? (legacyQuerySQL + " and sequence=\"" + VALIDITY_CONFIG[it].sequence[i] + "\"") : legacyQuerySQL;
                
                // find the legacy Record, rename it if it exists.
                var oldLegacyRecord = null;
                if (legacyRecord.doSelect(legacyQuerySQL) == RC_SUCCESS) {
                    // duplicate the original legacy validity
                    oldLegacyRecord = new SCFile("validity");
                    system.vars.$L_void = system.functions.fduplicate(oldLegacyRecord, legacyRecord);

                    legacyRecord["filename"] = VALIDITY_CONFIG[it].filename + LEGACY_SUFFIX_SHORT_VALIDITY;
                    for (var fileLength = 0; fileLength < legacyRecord["files"].length(); fileLength++) {
                        legacyRecord["files"][fileLength] = legacyRecord["files"][fileLength] + LEGACY_SUFFIX_SHORT_VALIDITY;
                    }
                    legacyRecord.doUpdate();
                    // we do NOT put the legacy validity into smpatches as the unique field is changed
                    // ...
                    print("Renamed the legacy validity" + VALIDITY_CONFIG[it].filename);
                } else {
                	legacyRecord = null;
                    print("The legacy validity \"" + VALIDITY_CONFIG[it].filename + "\" does not exist.");
                }

                // rename the PD temp Record name
                pdRecord["filename"] = VALIDITY_CONFIG[it].filename;
                for (var fileLength = 0; fileLength < pdRecord["files"].length(); fileLength++) {
                    pdRecord["files"][fileLength] = ("" + pdRecord["files"][fileLength]).replace(PDTMP_SUFFIX_SHORT_VALIDITY, "");
                }
                pdRecord.doUpdate();
                
                // insert to table forcedobjects
          		forceObject("validity", pdRecord, legacyRecord);
                addSMPatches(pdRecord, oldLegacyRecord, "validity;" + pdRecord.field_name + ";" + pdRecord.sequence + ";" + pdRecord.filename, "update");
                print("Enabled validity \"" + VALIDITY_CONFIG[it].filename + "\".");
            } else {
                // Ignore it if PD temp Record does not exist
                print("Can not find the temp PD validity " + VALIDITY_CONFIG[it].fields[i] + ", ignore!");
            }
        }
    }
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

function disabelLagacyRequestInbox() {
    /*var inbox2Diable = [];
    $("inbox").select('inbox.type="ocmq" or inbox.type="ocml" or inbox.type="ocmo"').iterate(
        function(record) {
            inbox2Diable.push(record.inbox_id);
        });

    

    updateRecords(inbox2Diable, "inbox", "inbox.id", ["container.id", "report.disabled"], [null, true]);*/
    updateRecords(["9"], "inbox", "inbox.id", ["inbox.name"], ["Request Fulfillment"]);
}

function enableReportInbox() {
    print("Start enabling PD Report Inboxes...");

    for (var i = 0; i < ENABLE_REPORT_QUEUES.length; ++i) {
        var fInboxOld = new SCFile("inbox");
        var fInbox = new SCFile("inbox");
        fInbox.setRecord(ENABLE_REPORT_QUEUES[i]);
        var rc = fInboxOld.doSelect('inbox.id="' + fInbox.inbox_id + '"');
        if (rc != RC_SUCCESS) {
            fInbox.doInsert();
            print("Enabled Report inbox \"" + fInbox["inbox.id"] + "-" + fInbox.inbox_name + "\".");
            addSMPatches(fInbox, fInbox, "inbox;" + fInbox.inbox_id, "add");
        } else {
            fInbox.doSave();
            print("Enabled Report inbox \"" + fInbox["inbox.id"] + "-" + fInbox.inbox_name + "\".");
            addSMPatches(fInbox, fInboxOld, "inbox;" + fInbox.inbox_id, "update");
        }
    }
    print("Finish enabling PD Report Inboxes");
}

function replaceKMTriggers(triggerNames) {
	for (var i = 0; i < triggerNames.length; i++) {
		var fTrigger = new SCFile("triggers");
		var rc = fTrigger.doSelect("trigger.name = \"" + triggerNames[i] + "\"");
		if (rc == RC_SUCCESS) {
			var name = fTrigger["trigger.name"];
			name = name.replace('ocmq', 'request');
			fTrigger.name = name;
			fTrigger["trigger.name"] = name;
			fTrigger["table.name"] = 'request';
			fTrigger.doUpdate();
		}
	}
	
}