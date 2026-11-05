var _val = funcs.val;
var _getRights = lib.security.getRights;


/*security mapping field for problem mapping. custmize it to put your own logic*/
function populateRootcauseEnvironment() {
    //using setting to set default category information
    vars.$G_rc_global_environment["default"] = lib.settings.getSettingValue("Problem", "default.category");
    vars.$G_rc_environment["name"] = "Problem Environment";

    var rights_new = _val(_getRights("Problem", "new"), 4);
    var rights_expert = _val(_getRights("Problem", "expert"), 4);
    var rights_admin = _val(_getRights("Problem", "admin"), 4);
    var rights_delete = _getRights("Problem", "delete") != null && _getRights("Problem", "delete") != "never";
    var rights_view = _val(_getRights("Problem", "view"), 4);
    var rights_update = _getRights("Problem", "update");

    vars.$G_rc_environment["new"] = rights_new;
    vars.$G_rc_environment["close"] = rights_delete;
    vars.$G_rc_environment["update"] = rights_update;
    vars.$G_rc_environment["view"] = rights_view;

    vars.$G_rc_environment["change.category"] = rights_update != null && rights_update != "never";
    //vars.$G_rc_environment["reopen"] = _val(_getRights("Problem", "reopen"), 4);
    vars.$G_rc_environment["create.known.error"] = _val(_getRights("Problem", "create.known.error"), 4);
    vars.$G_rc_environment["pm.template"] = rights_expert;
    vars.$G_rc_environment["pm.complex"] = rights_expert;
    vars.$G_rc_environment["views"] = rights_view;
    vars.$G_rc_environment["count"] = rights_view;
    vars.$G_rc_environment["advanced.search"] = rights_expert;
    vars.$G_rc_environment["personal.inbox"] = _val(_getRights("Problem", "personal.inbox"), 4);
    vars.$G_rc_environment["global.inbox"] = _val(_getRights("Problem", "global.inbox"), 4);
    vars.$G_rc_environment["lock.on.display"] = _val(_getRights("Problem", "lock.on.display"), 4);
    vars.$G_rc_environment["partial.key"] = _val(_getRights("Problem", "partial.key"), 4);
    vars.$G_rc_environment["skip.warning"] = _val(_getRights("Problem", "skip.warning"), 4);
    vars.$G_rc_environment["allowedStatus"] = _getRights("Problem", "allowedStatus");
    vars.$G_rc_environment["assign.groups"] = _getRights("Problem", "assignmentGroup");
    vars.$G_rc_environment["initial.inbox"] = _getRights("Problem", "initial.inbox");
    vars.$G_rc_environment["edit.format"] = _getRights("Problem", "edit.format");
    vars.$G_rc_environment["search.format"] = _getRights("Problem", "search.format");
    vars.$G_rc_environment["qbe.format"] = _getRights("Problem", "qbe.format");
    vars.$G_rc_environment["manage.format"] = _getRights("Problem", "manage.format");
    vars.$G_rc_environment["print.format"] = _getRights("Problem", "print.format");
    vars.$G_rc_environment["append.query"] = _getRights("Problem", "append.query");
    vars.$G_rc_environment["inbox.search"] = _val(_getRights("Problem", "inbox.search"), 4);
    vars.$G_rc_environment["search.list"] = _val(_getRights("Problem", "search.list"), 4);
    vars.$G_rc_environment["list.edit"] = _val(_getRights("Problem", "list.edit"), 4);
    vars.$G_rc_environment["inbox.edit"] = _val(_getRights("Problem", "inbox.edit"), 4);

    vars.$G_rc_environment["kne.new"] = _val(_getRights("Problem", "create.known.error"), 4);
    vars.$G_rc_environment["kne.close"] = rights_delete;
    vars.$G_rc_environment["kne.update"] = rights_update;
    vars.$G_rc_environment["kne.view"] = rights_view;
    vars.$G_rc_environment["kne.change.category"] = rights_update != null && rights_update != "never";
    vars.$G_rc_environment["kne.template"] = rights_expert;
    vars.$G_rc_environment["kne.complex"] = rights_expert;
    vars.$G_rc_environment["kne.views"] = rights_view;
    vars.$G_rc_environment["kne.count"] = rights_view;
    vars.$G_rc_environment["kne.advanced.search"] = rights_expert;
    //vars.$G_rc_environment["kne.reopen"] = _val(_getRights("Problem", "reopen"), 4);
    vars.$G_rc_environment["kne.personal.inbox"] = _val(_getRights("Problem", "personal.inbox"), 4);
    vars.$G_rc_environment["kne.global.inbox"] = _val(_getRights("Problem", "global.inbox"), 4);
    vars.$G_rc_environment["kne.lock.on.display"] = _val(_getRights("Problem", "lock.on.display"), 4);
    vars.$G_rc_environment["kne.partial.key"] = _val(_getRights("Problem", "partial.key"), 4);
    vars.$G_rc_environment["kne.skip.warning"] = _val(_getRights("Problem", "skip.warning"), 4);
    vars.$G_rc_environment["kne.allowedStatus"] = _getRights("Problem", "allowedStatus");
    vars.$G_rc_environment["kne.assign.groups"] = _getRights("Problem", "assignmentGroup");
    vars.$G_rc_environment["kne.initial.inbox"] = _getRights("Problem", "initial.inbox");
    vars.$G_rc_environment["kne.edit.format"] = _getRights("Problem", "edit.format");
    vars.$G_rc_environment["kne.search.format"] = _getRights("Problem", "search.format");
    vars.$G_rc_environment["kne.qbe.format"] = _getRights("Problem", "qbe.format");
    vars.$G_rc_environment["kne.manage.format"] = _getRights("Problem", "manage.format");
    vars.$G_rc_environment["kne.print.format"] = _getRights("Problem", "print.format");
    vars.$G_rc_environment["kne.inbox.search"] = _val(_getRights("Problem", "inbox.search"), 4);
    vars.$G_rc_environment["kne.search.list"] = _val(_getRights("Problem", "search.list"), 4);
    vars.$G_rc_environment["kne.list.edit"] = _val(_getRights("Problem", "list.edit"), 4);
    vars.$G_rc_environment["kne.inbox.edit"] = _val(_getRights("Problem", "inbox.edit"), 4);

    rights_new = _val(_getRights("Problem Tasks", "new"), 4);
    rights_expert = _val(_getRights("Problem Tasks", "expert"), 4);
    rights_admin = _val(_getRights("Problem Tasks", "admin"), 4);
    rights_delete = _getRights("Problem Tasks", "delete") != null && _getRights("Problem Tasks", "delete") != "never";
    rights_view = _val(_getRights("Problem Tasks", "view"), 4);
    rights_update = _getRights("Problem Tasks", "update");

    vars.$G_rc_environment["pmt.new"] = rights_new;
    vars.$G_rc_environment["pmt.close"] = rights_delete;
    vars.$G_rc_environment["pmt.update"] = rights_update;
    //vars.$G_rc_environment["pmt.reopen"] = _val(_getRights("Problem Tasks", "reopen"), 4);
    vars.$G_rc_environment["pmt.view"] = rights_view;
    vars.$G_rc_environment["change.task.category"] = rights_admin;
    vars.$G_rc_environment["pmt.create.known.error"] = _val(_getRights("Problem Tasks", "create.known.error"), 4);
    vars.$G_rc_environment["pmt.template"] = rights_expert;
    vars.$G_rc_environment["pmt.complex"] = rights_expert;
    vars.$G_rc_environment["pmt.views"] = rights_view;
    vars.$G_rc_environment["pmt.count"] = rights_view;
    vars.$G_rc_environment["pmt.advanced.search"] = rights_expert;
    vars.$G_rc_environment["pmt.personal.inbox"] = _val(_getRights("Problem Tasks", "personal.inbox"), 4);
    vars.$G_rc_environment["pmt.global.inbox"] = _val(_getRights("Problem Tasks", "global.inbox"), 4);
    vars.$G_rc_environment["pmt.lock.on.display"] = _val(_getRights("Problem Tasks", "lock.on.display"), 4);
    vars.$G_rc_environment["pmt.allowedStatus"] = _getRights("Problem Tasks", "allowedStatus");
    vars.$G_rc_environment["pmt.assign.groups"] = _getRights("Problem Tasks", "assignmentGroup");
    vars.$G_rc_environment["pmt.partial.key"] = _val(_getRights("Problem Tasks", "partial.key"), 4);
    vars.$G_rc_environment["pmt.skip.warning"] = _val(_getRights("Problem Tasks", "skip.warning"), 4);
    vars.$G_rc_environment["pmt.initial.inbox"] = _getRights("Problem Tasks", "initial.inbox");
    vars.$G_rc_environment["pmt.edit.format"] = _getRights("Problem Tasks", "edit.format");
    vars.$G_rc_environment["pmt.search.format"] = _getRights("Problem Tasks", "search.format");
    vars.$G_rc_environment["pmt.qbe.format"] = _getRights("Problem Tasks", "qbe.format");
    vars.$G_rc_environment["pmt.manage.format"] = _getRights("Problem Tasks", "manage.format");
    vars.$G_rc_environment["pmt.print.format"] = _getRights("Problem Tasks", "print.format");
    vars.$G_rc_environment["pmt.inbox.search"] = _val(_getRights("Problem Tasks", "inbox.search"), 4);
    vars.$G_rc_environment["pmt.search.list"] = _val(_getRights("Problem Tasks", "search.list"), 4);
    vars.$G_rc_environment["pmt.list.edit"] = _val(_getRights("Problem Tasks", "list.edit"), 4);
    vars.$G_rc_environment["pmt.inbox.edit"] = _val(_getRights("Problem Tasks", "inbox.edit"), 4);

    vars.$G_rc_environment["ket.new"] = rights_new;
    vars.$G_rc_environment["ket.close"] = rights_delete;
    vars.$G_rc_environment["ket.update"] = rights_update;
    //vars.$G_rc_environment["ket.reopen"] = _val(_getRights("Problem Tasks", "reopen"), 4);
    vars.$G_rc_environment["ket.view"] = rights_view;
    vars.$G_rc_environment["ket.template"] = rights_expert;
    vars.$G_rc_environment["ket.complex"] = rights_expert;
    vars.$G_rc_environment["ket.views"] = rights_view;
    vars.$G_rc_environment["ket.count"] = rights_view;
    vars.$G_rc_environment["ket.advanced.search"] = rights_expert;
    vars.$G_rc_environment["ket.personal.inbox"] = _val(_getRights("Problem Tasks", "personal.inbox"), 4);
    vars.$G_rc_environment["ket.global.inbox"] = _val(_getRights("Problem Tasks", "global.inbox"), 4);
    vars.$G_rc_environment["ket.lock.on.display"] = _val(_getRights("Problem Tasks", "lock.on.display"), 4);
    vars.$G_rc_environment["ket.partial.key"] = _val(_getRights("Problem Tasks", "partial.key"), 4);
    vars.$G_rc_environment["ket.skip.warning"] = _val(_getRights("Problem Tasks", "skip.warning"), 4);
    vars.$G_rc_environment["ket.allowedStatus"] = _getRights("Problem Tasks", "allowedStatus");
    vars.$G_rc_environment["ket.assign.groups"] = _getRights("Problem Tasks", "assignmentGroup");
    vars.$G_rc_environment["ket.initial.inbox"] = _getRights("Problem Tasks", "initial.inbox");
    vars.$G_rc_environment["ket.edit.format"] = _getRights("Problem Tasks", "edit.format");
    vars.$G_rc_environment["ket.search.format"] = _getRights("Problem Tasks", "search.format");
    vars.$G_rc_environment["ket.qbe.format"] = _getRights("Problem Tasks", "qbe.format");
    vars.$G_rc_environment["ket.manage.format"] = _getRights("Problem Tasks", "manage.format");
    vars.$G_rc_environment["ket.print.format"] = _getRights("Problem Tasks", "print.format");
    vars.$G_rc_environment["ket.inbox.search"] = _val(_getRights("Problem Tasks", "inbox.search"), 4);
    vars.$G_rc_environment["ket.search.list"] = _val(_getRights("Problem Tasks", "search.list"), 4);
    vars.$G_rc_environment["ket.list.edit"] = _val(_getRights("Problem Tasks", "list.edit"), 4);
    vars.$G_rc_environment["ket.inbox.edit"] = _val(_getRights("Problem Tasks", "inbox.edit"), 4);

    /**start rc tailoring fields**/

    /**end rc tailoring fields**/
}

/*security mapping field for Incident mapping. custmize it to put your own logic*/
function populateProbsummaryEnvironment() {
    //using setting to set default category information
    vars.$G_pm_global_environment["default"] = lib.settings.getSettingValue("Incident", "default.category");
    //solution matching setting
    vars.$G_pm_environment["check.rc"] = funcs.nullsub(_val(_getRights("Incident", "check.rc"), 4), false);
    vars.$G_pm_environment["ir.query"] = funcs.nullsub(_val(_getRights("Incident", "ir.query"), 4), false);
    vars.$G_pm_environment["check.duplicates"] = funcs.nullsub(_val(_getRights("Incident", "check.duplicates"), 4), false);
    vars.$G_pm_environment["check.parents"] = funcs.nullsub(_val(_getRights("Incident", "check.parents"), 1), false);
    vars.$G_pm_environment["max.levels"] = _val(_getRights("Incident", "max.levels"), 1);
    vars.$G_pm_environment["max.hits"] = _val(_getRights("Incident", "max.hits"), 1);

    vars.$G_pm_environment["name"] = "Incident Environment";

    var rights_new = _val(_getRights("Incident", "new"), 4);
    var rights_expert = _val(_getRights("Incident", "expert"), 4);
    // var rights_admin = _val(_getRights("Incident", "admin"), 4);
    var rights_delete = _getRights("Incident", "delete") != null && _getRights("Incident", "delete") != "never";
    var rights_view = _val(_getRights("Incident", "view"), 4);
    var rights_update = _getRights("Incident", "update");

    vars.$G_pm_environment["new"] = rights_new;
    vars.$G_pm_environment["close"] = rights_delete;
    vars.$G_pm_environment["update"] = rights_update;
    vars.$G_pm_environment["view"] = rights_view;
    vars.$G_pm_environment["inactivate"] = rights_delete;
    vars.$G_pm_environment["mass.inactivate"] = rights_delete;
    vars.$G_pm_environment["log"] = rights_view;
    vars.$G_pm_environment["query"] = rights_expert; // advanced query
    vars.$G_pm_environment["notify"] = rights_view;
    vars.$G_pm_environment["views"] = rights_view;
    vars.$G_pm_environment["duplicates"] = rights_view;
    vars.$G_pm_environment["new.category"] = rights_update != null && rights_update != "never";
    vars.$G_pm_environment["prob.mgmt.candidate"] = rights_expert;
    vars.$G_pm_environment["suspend"] = rights_expert;
    vars.$G_pm_environment["unsuspend"] = rights_expert;
    vars.$G_pm_environment["notes"] = rights_expert;
    vars.$G_pm_environment["override"] = rights_expert;
    vars.$G_pm_environment["callback"] = rights_view;
    vars.$G_pm_environment["db.template"] = rights_expert;
    vars.$G_pm_environment["db.complex"] = rights_expert;

    /**popuate legacy Incident management profile variables**/
    vars.$G_pm_environment["reopen"] = _val(_getRights("Incident", "reopen"), 4);
    vars.$G_pm_environment["partial.key"] = _val(_getRights("Incident", "partial.key"), 4);
    vars.$G_pm_environment["skip.warning"] = _val(_getRights("Incident", "skip.warning"), 4);
    vars.$G_pm_environment["personal.inbox"] = _val(_getRights("Incident", "personal.inbox"), 4);
    vars.$G_pm_environment["global.inbox"] = _val(_getRights("Incident", "global.inbox"), 4);
    vars.$G_pm_environment["lock.on.display"] = _val(_getRights("Incident", "lock.on.display"), 4);
    vars.$G_pm_environment["modifyTemplate"] = _val(_getRights("Incident", "modifyTemplate"), 4);
    vars.$G_pm_environment["allowedStatus"] = _getRights("Incident", "allowedStatus");
    vars.$G_pm_environment["default.qbe"] = _getRights("Incident", "default.qbe");
    vars.$G_pm_environment["problem.search.format"] = _getRights("Incident", "problem.search.format");
    vars.$G_pm_environment["problem.manage.format"] = _getRights("Incident", "problem.manage.format");
    vars.$G_pm_environment["initial.inbox"] = _getRights("Incident", "initial.inbox");
    vars.$G_pm_environment["notify.format"] = _getRights("Incident", "notify.format");
    vars.$G_pm_environment["assignment.groups"] = _getRights("Incident", "assignmentGroup");
    vars.$G_pm_environment["categories"] = _getRights("Incident", "allowedCategory");
    vars.$G_pm_environment["inbox.search"] = _val(_getRights("Incident", "inbox.search"), 4);
    vars.$G_pm_environment["search.list"] = _val(_getRights("Incident", "search.list"), 4);
    vars.$G_pm_environment["list.edit"] = _val(_getRights("Incident", "list.edit"), 4);
    vars.$G_pm_environment["inbox.edit"] = _val(_getRights("Incident", "inbox.edit"), 4);
    vars.$G_pm_environment["massclose"] = _val(_getRights("Incident", "massclose"), 4);

    /**start pm tailoring fields**/

    /**end pm tailoring fields**/
}

/*security mapping field for Service Desk mapping. custmize it to put your own logic*/
function populateServiceDeskEnvironment() {
    vars.$G_sm_environment["name"] = "Service Desk Environment";

    var rights_new = _val(_getRights("Service Desk", "new"), 4);
    var rights_expert = _val(_getRights("Service Desk", "expert"), 4);
    // var rights_admin = _val(_getRights("Service Desk", "admin"), 4);
    var rights_delete = _getRights("Service Desk", "delete") != null && _getRights("Service Desk", "delete") != "never";
    var rights_view = _val(_getRights("Service Desk", "view"), 4);
    var rights_update = _getRights("Service Desk", "update");

    vars.$G_sm_environment["new"] = rights_new;
    vars.$G_sm_environment["close"] = rights_delete;
    vars.$G_sm_environment["update"] = rights_update;
    vars.$G_sm_environment["view"] = rights_view;
    vars.$G_sm_environment["advanced.search"] = rights_expert;
    vars.$G_sm_environment["notify"] = rights_view;
    vars.$G_sm_environment["views"] = rights_view;
    vars.$G_sm_environment["db.template"] = rights_expert;
    vars.$G_sm_environment["db.complex"] = rights_expert;
    vars.$G_sm_environment["allowedStatus"] = _getRights("Service Desk", "allowedStatus");
    //vars.$G_sm_environment["approval.groups"] = _getRights("Service Desk", "approvalGroup");
    var approvalOf = lib.MyGroupsSync.getApprovalOfInMyGroups(funcs.operator());
    vars.$G_sm_environment["approval.groups"] = approvalOf;
    vars.$G_sm_environment["personal.inbox"] = _val(_getRights("Service Desk", "personal.inbox"), 4);
    vars.$G_sm_environment["global.inbox"] = _val(_getRights("Service Desk", "global.inbox"), 4);
    vars.$G_sm_environment["lock.on.display"] = _val(_getRights("Service Desk", "lock.on.display"), 4);
    vars.$G_sm_environment["modifyTemplate"] = _val(_getRights("Service Desk", "modifyTemplate"), 4);
    vars.$G_sm_environment["approve.delegate"] = _val(_getRights("Service Desk", "approve.delegate"), 4);
    vars.$G_sm_environment["initial.inbox"] = _getRights("Service Desk", "initial.inbox");
    vars.$G_sm_environment["edit.format"] = _getRights("Service Desk", "edit.format");
    vars.$G_sm_environment["initial.format"] = _getRights("Service Desk", "initial.format");
    vars.$G_sm_environment["search.format"] = _getRights("Service Desk", "search.format");
    vars.$G_sm_environment["qbe.format"] = _getRights("Service Desk", "qbe.format");
    vars.$G_sm_environment["manage.format"] = _getRights("Service Desk", "manage.format");
    vars.$G_sm_environment["print.format"] = _getRights("Service Desk", "print.format");
    vars.$G_sm_environment["ess.initial.format"] = _getRights("Service Desk", "ess.initial.format");
    vars.$G_sm_environment["ess.edit.format"] = _getRights("Service Desk", "ess.edit.format");
    vars.$G_sm_environment["ess.search.format"] = _getRights("Service Desk", "ess.search.format");
    vars.$G_sm_environment["ess.qbe.format"] = _getRights("Service Desk", "ess.qbe.format");
    vars.$G_sm_environment["default.template"] = _getRights("Service Desk", "default.template");
    vars.$G_sm_environment["append.query"] = _getRights("Service Desk", "append.query");
    vars.$G_sm_environment["inbox.search"] = _val(_getRights("Service Desk", "inbox.search"), 4);
    vars.$G_sm_environment["search.list"] = _val(_getRights("Service Desk", "search.list"), 4);
    vars.$G_sm_environment["list.edit"] = _val(_getRights("Service Desk", "list.edit"), 4);
    vars.$G_sm_environment["inbox.edit"] = _val(_getRights("Service Desk", "inbox.edit"), 4);
    vars.$G_sm_environment["massclose"] = _val(_getRights("Service Desk", "massclose"), 4);

    /**start sm tailoring fields**/

    /**end sm tailoring fields**/
}

/*security mapping field for Request mapping. custmize it to put your own logic*/
function populateRequestEnvironment() {
    if (!vars.$G_request_environment) {
        vars.$G_request_environment = new SCFile("ocmprofile");
    }
    if (!vars.$G_requestTask_environment) {
        vars.$G_requestTask_environment = new SCFile("ocmprofile");
    }

    vars.$G_request_environment["name"] = "Request Environment";

    var rights_new = _val(_getRights("Request", "new"), 4);
    var rights_expert = _val(_getRights("Request", "expert"), 4);
    var rights_admin = _val(_getRights("Request", "admin"), 4);
    var rights_delete = _getRights("Request", "delete") != null && _getRights("Request", "delete") != "never";
    var rights_view = _val(_getRights("Request", "view"), 4);
    var rights_update = _getRights("Request", "update");

    vars.$G_request_environment["new"] = rights_new;
    vars.$G_request_environment["close"] = rights_delete;
    vars.$G_request_environment["update"] = rights_update;
    vars.$G_request_environment["view"] = rights_view;
    vars.$G_request_environment["qbe.format"] = _getRights("Request", "qbe.format");
    vars.$G_request_environment["quote.initial.inbox"] = _getRights("Request", "initialView");
    vars.$G_request_environment["approve"] = _getRights("Request", "approvals");
    vars.$G_request_environment["views"] = _getRights("Request", "canAlternateForm");
    vars.$G_request_environment["approve.delegate"] = _getRights("Request", "approve.delegate");
    vars.$G_request_environment["initial.fmt"] = _getRights("Request", "initialFormat");
    vars.$G_request_environment["append.query"] = _getRights("Request", "append.query");
    vars.$G_request_environment["skip.warning"] = _getRights("Request", "skipWarning");
    vars.$G_request_environment["manager.group"] = _getRights("Request", "manager.group");
    vars.$G_request_environment["quote.manage.format"] = _getRights("Request", "queueFormat");
    vars.$G_request_environment["audit"] = rights_expert;
    vars.$G_request_environment["pagelist"] = rights_expert;
    vars.$G_request_environment["valid.lkup"] = rights_expert;
    vars.$G_request_environment["alert.brw"] = rights_expert;
    vars.$G_request_environment["apprdism"] = rights_expert;
    vars.$G_request_environment["approve.mass"] = rights_expert;
    vars.$G_request_environment._count = rights_view;
    vars.$G_request_environment["query.window"] = rights_view;
    vars.$G_request_environment["clear"] = rights_view;
    vars.$G_request_environment["approve.override"] = rights_admin;

    var tableAccess = new SCFile("tableAccess");
    tableAccess.tablename = "request";
    tableAccess.name = vars.$G_request_environment["name"];
    tableAccess["new"] = vars.$G_request_environment["new"];
    tableAccess.view = vars.$G_request_environment["view"];
    tableAccess.close = vars.$G_request_environment["close"];
    tableAccess.update = vars.$G_request_environment["update"];
    tableAccess.allowedStatus = vars.$G_request_environment["allowedStatus"];
    if (vars['$G.folderEntitlement']) {
        lib.tableAccess.setFolders(tableAccess);
    }
    vars.$G_request_environment["tableAccess"] = tableAccess;

    var approvalOf = lib.MyGroupsSync.getApprovalOfInMyGroups(funcs.operator());
    vars.$G_request_environment["approval.groups"] = approvalOf;
    vars.$G_requestTask_environment["approval.groups"] = approvalOf;

    rights_new = _val(_getRights("Request Tasks", "new"), 4);
    rights_expert = _val(_getRights("Request Tasks", "expert"), 4);
    rights_admin = _val(_getRights("Request Tasks", "admin"), 4);
    rights_delete = _getRights("Request Tasks", "delete") != null && _getRights("Request Tasks", "delete") != "never";
    rights_view = _val(_getRights("Request Tasks", "view"), 4);
    rights_update = _getRights("Request Tasks", "update");

    vars.$G_requestTask_environment["name"] = "Request Task Environment";
    vars.$G_requestTask_environment["new"] = rights_new;
    vars.$G_requestTask_environment["close"] = rights_delete;
    vars.$G_requestTask_environment["update"] = rights_update;
    vars.$G_requestTask_environment["view"] = rights_view;
    vars.$G_requestTask_environment["qbe.format"] = _getRights("Request Tasks", "qbe.format");
    vars.$G_requestTask_environment["views"] = _getRights("Request Tasks", "canAlternateForm");
    vars.$G_requestTask_environment["initial.fmt"] = _getRights("Request Tasks", "initialFormat");
    vars.$G_requestTask_environment["append.query"] = _getRights("Request Tasks", "append.query");
    vars.$G_requestTask_environment["skip.warning"] = _getRights("Request Tasks", "skip.warning");
    vars.$G_requestTask_environment["line.initial.inbox"] = _getRights("Request Tasks", "initialView");
    vars.$G_requestTask_environment["line.manage.format"] = _getRights("Request Tasks", "queueFormat");
    vars.$G_requestTask_environment["audit"] = rights_expert;
    vars.$G_requestTask_environment["pagelist"] = rights_expert;
    vars.$G_requestTask_environment["valid.lkup"] = rights_expert;
    vars.$G_requestTask_environment["alert.brw"] = rights_expert;
    vars.$G_requestTask_environment["apprdism"] = rights_expert;
    vars.$G_requestTask_environment["approve.mass"] = rights_expert;
    vars.$G_requestTask_environment._count = rights_view;
    vars.$G_requestTask_environment["query.window"] = rights_view;
    vars.$G_requestTask_environment["clear"] = rights_view;
    vars.$G_requestTask_environment["approve.override"] = rights_admin;

    tableAccess = new SCFile("tableAccess");
    tableAccess.tablename = "requestTask";
    tableAccess.name = vars.$G_requestTask_environment["name"];
    tableAccess["new"] = vars.$G_requestTask_environment["new"];
    tableAccess.view = vars.$G_requestTask_environment["view"];
    tableAccess.close = vars.$G_requestTask_environment["close"];
    tableAccess.update = vars.$G_requestTask_environment["update"];
    tableAccess.allowedStatus = vars.$G_requestTask_environment["allowedStatus"];
    if (vars['$G.folderEntitlement']) {
        lib.tableAccess.setFolders(tableAccess);
    }
    vars.$G_requestTask_environment["tableAccess"] = tableAccess;

    /**start sm tailoring fields**/

    /**end sm tailoring fields**/
}


/*security mapping field for SLM mapping. custmize it to put your own logic*/
function populateSLMEnvironment() {

    if (!vars.$G_sla_profile) {
        vars.$G_sla_profile = new SCFile("slaprofile");
    }
    vars.$G_sla_profile["name"] = "SLM Environment";

    var rights_new = _val(_getRights("Service Level Management", "new"), 4);
    // var rights_expert = _val(_getRights("Service Level Management", "expert"), 4);
    // var rights_admin = _val(_getRights("Service Level Management", "admin"), 4);
    var rights_delete = _getRights("Service Level Management", "delete") != null && _getRights("Service Level Management", "delete") != "never";
    var rights_view = _val(_getRights("Service Level Management", "view"), 4);
    var rights_update = _getRights("Service Level Management", "update");
    var allow_status = _getRights("Service Level Management", "allowedStatus");

    //	vars.$G_sla_profile["new"] = rights_new;
    //	vars.$G_sla_profile["close"] = rights_delete;
    //	vars.$G_sla_profile["update"] = rights_update;
    //	vars.$G_sla_profile["view"] = rights_view;

    //SLA
    vars.$G_sla_profile["sla.view"] = rights_view;
    vars.$G_sla_profile["sla.create"] = rights_new;
    vars.$G_sla_profile["sla.update"] = rights_update;
    vars.$G_sla_profile["sla.delete"] = rights_delete;
    vars.$G_sla_profile["sla.allowedStatus"] = allow_status;

    //Response SLO
    vars.$G_sla_profile["slor.view"] = rights_view;
    vars.$G_sla_profile["slor.create"] = rights_new;
    vars.$G_sla_profile["slor.update"] = rights_update;
    vars.$G_sla_profile["slor.delete"] = rights_delete;
    vars.$G_sla_profile["slor.allowedStatus"] = allow_status;

    //Availibility SLO
    vars.$G_sla_profile["sloa.view"] = rights_view;
    vars.$G_sla_profile["sloa.create"] = rights_new;
    vars.$G_sla_profile["sloa.update"] = rights_update;
    vars.$G_sla_profile["sloa.delete"] = rights_delete;
    vars.$G_sla_profile["sloa.allowedStatus"] = allow_status;

    //SLO Catalog
    var sltcatalog_right = _getRights("Service Level Management", "sltcat.manage");
    vars.$G_sla_profile["slocat.view"] = sltcatalog_right;
    vars.$G_sla_profile["slocat.create"] = sltcatalog_right;
    vars.$G_sla_profile["slocat.update"] = sltcatalog_right ? "always" : "never";
    vars.$G_sla_profile["slocat.delete"] = sltcatalog_right;
    vars.$G_sla_profile["slocat.allowedStatus"] = allow_status;

    //settings
    vars.$G_sla_profile["aggregate.view"] = _getRights("Service Level Management", "aggregate.view");
    vars.$G_sla_profile["monthly.avail.view"] = _getRights("Service Level Management", "monthly.avail.view");
    vars.$G_sla_profile["monthly.resp.view"] = _getRights("Service Level Management", "monthly.resp.view");
    vars.$G_sla_profile["outage.detail.view"] = _getRights("Service Level Management", "outage.detail.view");
    vars.$G_sla_profile["outage.event.view"] = _getRights("Service Level Management", "outage.event.view");
    vars.$G_sla_profile["resp.detail.view"] = _getRights("Service Level Management", "resp.detail.view");
    vars.$G_sla_profile["sla.active.view"] = _getRights("Service Level Management", "sla.active.view");

    //init the whole profile and sla tableAccess 
    var tableAccess = new SCFile("tableAccess");
    tableAccess.tablename = "sla";
    tableAccess.name = vars.$G_sla_profile["name"];
    tableAccess["new"] = rights_new;
    tableAccess.view = rights_view;
    tableAccess.close = rights_delete;
    tableAccess.update = rights_update;
    tableAccess.allowedStatus = allow_status;
    if (vars['$G.folderEntitlement']) {
        lib.tableAccess.setFolders(tableAccess);
    }
    vars.$G_sla_profile["tableAccess"] = tableAccess;
    vars.$G_sla_profile["tableAccessSla"] = tableAccess;

    //init the slo catalog tableAccess 
    tableAccess = new SCFile("tableAccess");
    tableAccess.tablename = "slocatalog";
    tableAccess.name = vars.$G_sla_profile["name"];
    tableAccess["new"] = sltcatalog_right;
    tableAccess.view = sltcatalog_right;
    tableAccess.close = sltcatalog_right;
    tableAccess.update = vars.$G_sla_profile["slocat.update"];
    tableAccess.allowedStatus = allow_status;
    if (vars['$G.folderEntitlement']) {
        lib.tableAccess.setFolders(tableAccess);
    }
    vars.$G_sla_profile["tableAccessSloc"] = tableAccess;

    //init the response slo tableAccess 
    tableAccess = new SCFile("tableAccess");
    tableAccess.tablename = "slo";
    tableAccess.name = vars.$G_sla_profile["name"];
    tableAccess["new"] = rights_new;
    tableAccess.view = rights_view;
    tableAccess.close = rights_delete;
    tableAccess.update = rights_update;
    tableAccess.allowedStatus = allow_status;
    if (vars['$G.folderEntitlement']) {
        lib.tableAccess.setFolders(tableAccess);
    }
    vars.$G_sla_profile["tableAccessSlo"] = tableAccess;

    //init the avaiability slo tableAccess 
    tableAccess = new SCFile("tableAccess");
    tableAccess.tablename = "sloavail";
    tableAccess.name = vars.$G_sla_profile["name"];
    tableAccess["new"] = rights_new;
    tableAccess.view = rights_view;
    tableAccess.close = rights_delete;
    tableAccess.update = rights_update;
    tableAccess.allowedStatus = allow_status;
    if (vars['$G.folderEntitlement']) {
        lib.tableAccess.setFolders(tableAccess);
    }
    vars.$G_sla_profile["tableAccessSloavail"] = tableAccess;

    /**start sm tailoring fields**/

    /**end sm tailoring fields**/
}

/*security mapping field for Configuration mapping. custmize it to put your own logic*/
function populateConfigurationEnvironment() {
    vars.$G_am_environment["name"] = "Inventory Environment";

    var rights_new = _val(_getRights("Configuration Item", "new"), 4);
    var rights_expert = _val(_getRights("Configuration Item", "expert"), 4);
    // var rights_admin = _val(_getRights("Configuration Item", "admin"), 4);
    var rights_delete = _getRights("Configuration Item", "delete") != null && _getRights("Configuration Item", "delete") != "never";
    var rights_view = _val(_getRights("Configuration Item", "view"), 4);
    var rights_update = _getRights("Configuration Item", "update");

    vars.$G_am_environment["add"] = rights_new;
    vars.$G_am_environment["new"] = rights_new;
    vars.$G_am_environment["delete"] = rights_delete;
    vars.$G_am_environment["update"] = rights_update;
    vars.$G_am_environment["view"] = rights_view;
    vars.$G_am_environment["db.template"] = rights_expert;
    vars.$G_am_environment["db.complex"] = rights_expert;
    vars.$G_am_environment["allowedStatus"] = _getRights("Configuration Item", "allowedStatus");

    vars.$G_am_environment["mass.delete"] = _val(_getRights("Configuration Item", "mass.delete"), 4);
    vars.$G_am_environment["query.window"] = rights_view;
    vars.$G_am_environment["allow.partial"] = _val(_getRights("Configuration Item", "allow.partial"), 4);
    vars.$G_am_environment["skip.warning"] = _val(_getRights("Configuration Item", "skip.warning"), 4);
    vars.$G_am_environment["views"] = rights_view;
    vars.$G_am_environment["change.devtype"] = _val(_getRights("Configuration Item", "change.devtype"), 4);
    vars.$G_am_environment["open.problem"] = _val(_getRights("Configuration Item", "open.problem"), 4);
    vars.$G_am_environment["request.change"] = _val(_getRights("Configuration Item", "request.change"), 4);
    vars.$G_am_environment["export"] = rights_view;
    vars.$G_am_environment["require.password"] = _val(_getRights("Configuration Item", "require.password"), 4);
    vars.$G_am_environment["confirm.on.end"] = _val(_getRights("Configuration Item", "confirm.on.end"), 4);
    vars.$G_am_environment["auditor"] = _val(_getRights("Configuration Item", "auditor"), 4);

    vars.$G_am_environment["search.format"] = _getRights("Configuration Item", "search.format");
    vars.$G_am_environment["inbox.search"] = _val(_getRights("Configuration Item", "inbox.search"), 4);
    vars.$G_am_environment["search.list"] = _val(_getRights("Configuration Item", "search.list"), 4);
    vars.$G_am_environment["list.edit"] = _val(_getRights("Configuration Item", "list.edit"), 4);
    vars.$G_am_environment["inbox.edit"] = _val(_getRights("Configuration Item", "inbox.edit"), 4);

    var allowedCategories = _getRights("Configuration Item", "allowedCategory");
    if (funcs.lng(funcs.denull(allowedCategories)) == 0) {
        vars.$G_am_environment["type"] = [];
    } else {
        vars.$G_am_environment["type"] = lib.BaselineHelper.getAllOtherCITypes(allowedCategories);
    }

    var tableAccess = new SCFile("tableAccess");
    tableAccess.tablename = "device";
    tableAccess.name = vars.$G_am_environment["name"];
    tableAccess["new"] = vars.$G_am_environment["new"];
    tableAccess.view = vars.$G_am_environment["view"];
    tableAccess.close = vars.$G_am_environment["delete"];
    tableAccess.update = vars.$G_am_environment["update"];
    tableAccess.allowedStatus = vars.$G_am_environment["allowedStatus"];
    if (vars['$G.folderEntitlement']) {
        lib.tableAccess.setFolders(tableAccess);
    }
    vars.$G_am_environment["tableAccess"] = tableAccess;

    /**start sm tailoring fields**/

    /**end sm tailoring fields**/
}