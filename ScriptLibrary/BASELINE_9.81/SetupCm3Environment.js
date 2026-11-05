_getRights = lib.security.getRights;
_val = system.functions.val;

vars.$G_legacy_change=_val(lib.settings.getSettingValue("Change", "legacy"), 4);

function cm3rEnvironment(){
vars.$G_cm3r_environment["name"] = "Change Environment";
vars.$G_cm3r_environment["area"] = "r";
cm3r_new = _val(_getRights("Change", "new"),4);
cm3r_expert = _val(_getRights("Change", "expert"),4);
cm3r_admin = _val(_getRights("Change", "admin"),4);
cm3r_update = _getRights("Change", "update");
cm3r_close = _getRights("Change", "delete")!=null && _getRights("Change", "delete")!="never";
cm3r_view = _val(_getRights("Change", "view"),4);
vars.$G_cm3r_environment["alert"] = cm3r_expert;
vars.$G_cm3r_environment["apprdism"] = cm3r_expert;
vars.$G_cm3r_environment["approve.mass"] = cm3r_expert;
vars.$G_cm3r_environment["approve.override"] = cm3r_admin;
vars.$G_cm3r_environment["clear"] = cm3r_view;
vars.$G_cm3r_environment["close"] = cm3r_close ;
vars.$G_cm3r_environment["closed.update"] = cm3r_expert;
vars.$G_cm3r_environment["count"] = cm3r_view;
vars.$G_cm3r_environment["cpyopn"] = cm3r_new;
vars.$G_cm3r_environment["db.complex"] = cm3r_expert;
vars.$G_cm3r_environment["db.template"] = cm3r_expert;
vars.$G_cm3r_environment["duplicates"] = cm3r_expert;
vars.$G_cm3r_environment["fill"] = cm3r_view;
vars.$G_cm3r_environment["find"] = cm3r_view;
vars.$G_cm3r_environment["irquery"] = cm3r_view;
vars.$G_cm3r_environment["new"] = cm3r_new;
vars.$G_cm3r_environment["new.category"] = cm3r_admin;
vars.$G_cm3r_environment["notify"] = cm3r_view;
vars.$G_cm3r_environment["open"] = cm3r_new;
vars.$G_cm3r_environment["pagelist"] = cm3r_expert;
vars.$G_cm3r_environment["phase.sel"] = cm3r_admin;
vars.$G_cm3r_environment["query.window"] = cm3r_expert;
vars.$G_cm3r_environment["show.parent"] = cm3r_view;
vars.$G_cm3r_environment["tasks"] = cm3r_view;
vars.$G_cm3r_environment["update"] = cm3r_update;
vars.$G_cm3r_environment["view"] = cm3r_view;
vars.$G_cm3r_environment["views"] = cm3r_view;
vars.$G_cm3r_environment["approval.groups"] =vars.$G_myGroups.approver_of;
vars.$G_cm3r_environment["groups"] = vars.$G_myGroups.member_of;
vars.$G_cm3r_environment["manager.group"] = vars.$G_myGroups.member_of;
vars.$G_cm3r_environment["allowed.cats"] = _getRights("Change", "allowedCategory");
vars.$G_cm3r_environment["allowedStatus"] = _getRights("Change", "allowedStatus");
vars.$G_cm3r_environment["append.query"] = _getRights("Change", "append.query");
vars.$G_cm3r_environment["approvals"] = _val(_getRights("Change", "approvals"),4);
vars.$G_cm3r_environment["approve.delegate"] = _val(_getRights("Change", "approve.delegate"),4);
vars.$G_cm3r_environment["default.category"] = _getRights("Change", "default.category");
vars.$G_cm3r_environment["default.task.category"] = _getRights("Change", "default.task.category");
vars.$G_cm3r_environment["initial.fmt"] = _getRights("Change", "initial.format");
vars.$G_cm3r_environment["initial.request.inbox"] = _getRights("Change", "initial.request.inbox");
vars.$G_cm3r_environment["initial.task.inbox"] = _getRights("Change", "initial.task.inbox");
vars.$G_cm3r_environment["modifyTemplate"] = _val(_getRights("Change", "modifyTemplate"),4);
vars.$G_cm3r_environment["partial.key"] = _val(_getRights("Change", "partial.key"),4);
vars.$G_cm3r_environment["qbe.format"] = _getRights("Change", "qbe.format");
vars.$G_cm3r_environment["reopen"] = _val(_getRights("Change", "reopen"),4);
vars.$G_cm3r_environment["request.manage.format"] = _getRights("Change", "request.manage.format");
vars.$G_cm3r_environment["skip.warning"] = _val(_getRights("Change", "skip.warning"),4);
vars.$G_cm3r_environment["task.manage.format"] = _getRights("Change", "task.manage.format");
vars.$G_cm3r_environment["audit"] = cm3r_admin;
vars.$G_cm3r_environment["calc.risk"] = _val(_getRights("Change", "calc.risk"),4);
vars.$G_cm3r_environment["review"] = _val(_getRights("Change", "review"),4);
vars.$G_cm3r_environment["withdraw"] = cm3r_close ;
vars.$G_cm3r_environment["history"] = _val(_getRights("Change", "history"),4);
vars.$G_cm3r_environment["active.query"] = _val(_getRights("Change", "active.query"),4);
vars.$G_cm3r_environment["all.query"] = _val(_getRights("Change", "all.query"),4);


/**start cm3r tailoring fields**/

/**end cm3r tailoring fields**/
}


function cm3tEnvironment(){
vars.$G_cm3t_environment["name"] = "Change Environment";
vars.$G_cm3t_environment["area"] = "t";
cm3t_new = _val(_getRights("Change Tasks", "new"),4);
cm3t_expert = _val(_getRights("Change Tasks", "expert"),4);
cm3t_admin = _val(_getRights("Change Tasks", "admin"),4);
cm3t_update = _getRights("Change Tasks", "update");
cm3t_close = _getRights("Change Tasks", "delete")!=null && _getRights("Change Tasks", "delete")!="never";
cm3t_view = _val(_getRights("Change Tasks", "view"),4);
vars.$G_cm3t_environment["alert"] = cm3t_expert;
vars.$G_cm3t_environment["apprdism"] = cm3t_expert;
vars.$G_cm3t_environment["approve.mass"] = cm3t_expert;
vars.$G_cm3t_environment["approve.override"] = cm3t_admin;
vars.$G_cm3t_environment["clear"] = cm3t_view;
vars.$G_cm3t_environment["close"] = cm3t_close;
vars.$G_cm3t_environment["closed.update"] = cm3t_expert;
vars.$G_cm3t_environment["count"] = cm3t_view;
vars.$G_cm3t_environment["cpyopn"] = cm3t_new;
vars.$G_cm3t_environment["db.complex"] = cm3t_expert;
vars.$G_cm3t_environment["db.template"] = cm3t_expert;
vars.$G_cm3t_environment["duplicates"] = cm3t_expert;
vars.$G_cm3t_environment["fill"] = cm3t_view;
vars.$G_cm3t_environment["find"] = cm3t_view;
vars.$G_cm3t_environment["irquery"] = cm3t_view;
vars.$G_cm3t_environment["new"] = cm3t_new;
vars.$G_cm3t_environment["new.category"] = cm3t_admin;
vars.$G_cm3t_environment["notify"] = cm3t_view;
vars.$G_cm3t_environment["open"] = cm3t_new;
vars.$G_cm3t_environment["pagelist"] = cm3t_expert;
vars.$G_cm3t_environment["phase.sel"] = cm3t_admin;
vars.$G_cm3t_environment["query.window"] = cm3t_expert;
vars.$G_cm3t_environment["show.parent"] = cm3t_view;
vars.$G_cm3t_environment["tasks"] = cm3t_view;
vars.$G_cm3t_environment["update"] = cm3t_update;
vars.$G_cm3t_environment["view"] = cm3t_view;
vars.$G_cm3t_environment["views"] = cm3t_view;
vars.$G_cm3t_environment["approval.groups"] =vars.$G_myGroups.approver_of;
vars.$G_cm3t_environment["groups"] = vars.$G_myGroups.member_of;
vars.$G_cm3t_environment["allowed.cats"] = _getRights("Change Tasks", "allowedCategory");
vars.$G_cm3t_environment["allowedStatus"] = _getRights("Change Tasks", "allowedStatus");
vars.$G_cm3t_environment["append.query"] = _getRights("Change Tasks", "append.query");
vars.$G_cm3t_environment["approvals"] = _val(_getRights("Change Tasks", "approvals"),4);
vars.$G_cm3t_environment["approve.delegate"] = _val(_getRights("Change Tasks", "approve.delegate"),4);
vars.$G_cm3t_environment["default.category"] = _getRights("Change Tasks", "default.category");
vars.$G_cm3t_environment["default.task.category"] = _getRights("Change Tasks", "default.task.category");
vars.$G_cm3t_environment["initial.fmt"] = _getRights("Change Tasks", "initial.format");
vars.$G_cm3t_environment["initial.request.inbox"] = _getRights("Change Tasks", "initial.request.inbox");
vars.$G_cm3t_environment["initial.task.inbox"] = _getRights("Change Tasks", "initial.task.inbox");
vars.$G_cm3t_environment["modifyTemplate"] = _val(_getRights("Change Tasks", "modifyTemplate"),4);
vars.$G_cm3t_environment["partial.key"] = _val(_getRights("Change Tasks", "partial.key"),4);
vars.$G_cm3t_environment["qbe.format"] = _getRights("Change Tasks", "qbe.format");
vars.$G_cm3t_environment["reopen"] = _val(_getRights("Change Tasks", "reopen"),4);
vars.$G_cm3t_environment["request.manage.format"] = _getRights("Change Tasks", "request.manage.format");
vars.$G_cm3t_environment["skip.warning"] = _val(_getRights("Change Tasks", "skip.warning"),4);
vars.$G_cm3t_environment["task.manage.format"] = _getRights("Change Tasks", "task.manage.format");
vars.$G_cm3t_environment["audit"] = cm3t_admin;
vars.$G_cm3t_environment["calc.risk"] = _val(_getRights("Change Tasks", "calc.risk"),4);
vars.$G_cm3t_environment["review"] = _val(_getRights("Change Tasks", "review"),4);
vars.$G_cm3t_environment["withdraw"] = cm3t_close ;
vars.$G_cm3t_environment["history"] = _val(_getRights("Change Tasks", "history"),4);
vars.$G_cm3t_environment["active.query"] = _val(_getRights("Change Tasks", "active.query"),4);
vars.$G_cm3t_environment["all.query"] = _val(_getRights("Change Tasks", "all.query"),4);


/**start cm3t tailoring fields**/

/**end cm3t tailoring fields**/
}
