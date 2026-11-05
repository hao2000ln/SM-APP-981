var $ = lib.c.$;

var ProcessDesignCPUpgradeManager = $(new function() {
    var _moduleName = "";
    var _tableName = "";
    var _operator_profile_field = "";

    return {
        init: function(tableName, moduleName, operator_profile_field) {
            _tableName = tableName;
            _moduleName = moduleName;
            _operator_profile_field = operator_profile_field;
        },

        upgrade: function() {
            var ret;
            try {
                funcs.rtecall("trigger", ret, 1);
                this.upgradeSchema();
                this.upgradeObject();
                this.upgradeCategories();
                this.upgradeProfiles();
                funcs.rtecall("trigger", ret, 0);
                this.upgradeOperators();
                funcs.rtecall("trigger", ret, 1);
                this.upgradeAreas();
                this.upgradeUserRoles();
                this.postMethod();
            } catch (e) {
                print("Error in Upgrade " + _moduleName + " Module.");
                print(e.toString());
                funcs.rtecall("trigger", ret, 1);
            }
        },

        postMethod: function() {},

        upgradeObject: function() {},

        upgradeSchema: function() {},

        upgradeProfiles: function() {},

        getLegacyObject: function() {},

        upgradeCategories: function() {},

        createWorkflow: function(category, phaseTableName) {
            var workflow = new SCFile("Workflow");
            var sql = "name=\"" + category.name + "\" and tableName=\"" + _tableName + "\"";
            if (workflow.doSelect(sql) != RC_SUCCESS) {
                workflow.name = category.name;
                workflow.tableName = _tableName;
                workflow.description = category.name + " -  Upgraded.";
                workflow.type = "standard";
                workflow.defaultPhase = category.phases[0];
                workflow.firstPhase = category.phases[0];

                if (workflow.doInsert() == RC_SUCCESS) {
                    this.createPhases(category, workflow, phaseTableName);
                    print("workflow " + category.name + " created");
                }
            }
            return workflow;
        },

        createPhases: function(category, workflow, phaseTableName) {
            var lng = category.phases.length();
            var i;
            for (i = 0; i < lng; i++) {
                var phaseTable = new SCFile(phaseTableName);
                var sql = "name=\"" + category.phases[i] + "\"";
                var next = i + 1;
                if (phaseTable.doSelect(sql) == RC_SUCCESS) {

                    var wfPhase = new SCFile("WorkflowPhase");
                    var wfpSQL = "workflowName=\"" + workflow.name + "\" and tableName=\"" + workflow.tableName + "\" and phaseName=\"" + phaseTable.name + "\"";
                    if (wfPhase.doSelect(wfpSQL) == RC_SUCCESS) {
                        continue;
                    }

                    wfPhase.workflowName = workflow.name;
                    wfPhase.tableName = workflow.tableName;
                    wfPhase.phaseName = phaseTable.name;
                    wfPhase.displayForm = phaseTable.phase_format;
                    wfPhase.description = phaseTable.name;
                    wfPhase.detailedDescription = phaseTable.description;
                    wfPhase.active = true;
                    wfPhase.phaseOrder = next;

                    var updateCondStr = "$L.tableAccess.update=true";
                    // use new or update to authorize the first phase
                    if (i == 0) {
                        updateCondStr = updateCondStr + " or $L.tableAccess.new=true";
                    }
                    if (phaseTable.update_cond != null) {
                        updateCondStr = updateCondStr + " and (" + funcs.str(phaseTable.update_cond) + ")";
                    }
                    //set update condition
                    wfPhase.updateCond = funcs.parse(updateCondStr);
                    wfPhase.updateCondXML = "<XmlCondition><collection logical=\"\" negate=\"\"><condition logical=\"\" negate=\"false\">" +
                        "<operand type=\"expression\"><Expression caption=\"\">\"" + updateCondStr + "\"</Expression>" +
                        "</operand></condition></collection></XmlCondition>";
                    wfPhase.updateCondDesc = funcs.str(phaseTable.update_cond);
                    wfPhase.xCoordinate = 20 + (i * 140);
                    wfPhase.yCoordinate = 60;

                    if (category.phases[next] != null) {
                        wfPhase.manualTransition[0].mtToPhase = category.phases[next];
                        wfPhase.manualTransition[0].mtOptionName = "nextphase";
                        wfPhase.manualTransition[0].mtOptionLoc = 1;
                        wfPhase.manualTransition[0].mtId = 1;
                        if (phaseTable.close_cond != null && phaseTable.close_cond != "" && funcs.str(phaseTable.close_cond) != "true") {
                            phaseTable.close_cond = funcs.val(
                                "(" + funcs.str(phaseTable.close_cond) +
                                " ) and true", 10);
                            wfPhase.manualTransition[0].mtCondition = funcs.val(phaseTable.close_cond, 10);
                            wfPhase.manualTransition[0].mtCondXML = "<XmlCondition><collection logical=\"\" negate=\"\"><condition logical=\"\" negate=\"false\">" +
                                "<operand type=\"expression\"><Expression caption=\"\">\"" + funcs.str(phaseTable.close_cond) + " and true\"</Expression>" +
                                "</operand></condition></collection></XmlCondition>";
                            wfPhase.manualTransition[0].mtCondDesc = "(" + funcs.str(phaseTable.close_cond) + ")  and true";
                        } else {
                            wfPhase.manualTransition[0].mtCondXML = "";
                            wfPhase.manualTransition[0].mtCondDesc = "( true  )";
                            wfPhase.manualTransition[0].mtCondition = funcs.val("true", 10);
                        }
                        wfPhase.manualTransition[0].mtxCoordinate = 20 + (i * 140) + 120;
                        wfPhase.manualTransition[0].mtyCoordinate = 80;
                        wfPhase.manualTransition[0].mtOption = lib.Workflow.getOptionNumber(wfPhase, 1);
                    }
                    //adding the close phase for last one.
                    else {
                        var lastPhase = new SCFile("WorkflowPhase");
                        lastPhase.workflowName = workflow.name;
                        lastPhase.tableName = workflow.tableName;
                        lastPhase.phaseName = "closed";
                        lastPhase.displayForm = phaseTable.view_default;
                        lastPhase.description = "Closed";
                        lastPhase.active = false;
                        lastPhase.updateCond = false;
                        lastPhase.updateCondXML = "<XmlCondition><collection logical=\"\" negate=\"\"><condition logical=\"\" negate=\"false\">" +
                            "<operand type=\"expression\"><Expression caption=\"\">\"" + funcs.str("false") + "\"</Expression>" +
                            "</operand></condition></collection></XmlCondition>";
                        lastPhase.updateCondDesc = funcs.str("false");
                        lastPhase.xCoordinate = 20 + ((i + 1) * 140);
                        lastPhase.yCoordinate = 60;

                        wfPhase.manualTransition[0].mtToPhase = "closed";
                        wfPhase.manualTransition[0].mtOptionName = "close";
                        wfPhase.manualTransition[0].mtOptionLoc = 1;
                        wfPhase.manualTransition[0].mtId = 1;
                        wfPhase.manualTransition[0].mtCondition = phaseTable.close_cond;
                        if (phaseTable.close_cond != null && phaseTable.close_cond != "" && funcs.str(phaseTable.close_cond) != "true") {
                            phaseTable.close_cond = funcs.val(
                                "(" + funcs.str(phaseTable.close_cond) +
                                ")   ", 10);
                            wfPhase.manualTransition[0].mtCondition = funcs.val(phaseTable.close_cond, 10);
                            wfPhase.manualTransition[0].mtCondXML = "<XmlCondition><collection logical=\"\" negate=\"\"><condition logical=\"\" negate=\"false\">" +
                                "<operand type=\"expression\"><Expression caption=\"\">\"" + funcs.str(phaseTable.close_cond) + "\"</Expression>" +
                                "</operand></condition></collection></XmlCondition>";
                            wfPhase.manualTransition[0].mtCondDesc = "(" + funcs.str(phaseTable.close_cond) + ") ";
                        } else {
                            wfPhase.manualTransition[0].mtCondXML = "";
                            wfPhase.manualTransition[0].mtCondDesc = "( true  )";
                            wfPhase.manualTransition[0].mtCondition = funcs.val("true", 10);
                        }

                        wfPhase.manualTransition[0].mtOption = lib.Workflow.getOptionNumber(wfPhase, 1);
                        wfPhase.manualTransition[0].mtxCoordinate = 20 + (i * 140) + 120;
                        wfPhase.manualTransition[0].mtyCoordinate = 80;

                        // Add a reopen option to last phase
                        lastPhase.manualTransition[0].mtToPhase = phaseTable.name;
                        lastPhase.manualTransition[0].mtOptionName = "reopen";
                        lastPhase.manualTransition[0].mtOptionLoc = 1;
                        lastPhase.manualTransition[0].mtId = 1;

                        lastPhase.manualTransition[0].mtCondition = funcs.val("jscall(\"security.getToken\",\"" + _moduleName + "\",\"reopen\")=\"true\"", 10);
                        lastPhase.manualTransition[0].mtCondXML = "<XmlCondition><collection logical=\"\" negate=\"\" ><condition logical=\"\" negate=\"false\">" +
                            "<operand type=\"security\"><Area caption=\"" + _moduleName + "\">" + _moduleName + "</Area><Right caption=\"Reopen\">reopen</Right>" +
                            "</operand><Comparison>equals</Comparison><Value dataType=\"string\">true</Value></condition>" +
                            "</collection></XmlCondition>";
                        lastPhase.manualTransition[0].mtCondDesc = "( Reopen in " + _moduleName + "= true  )";
                        lastPhase.manualTransition[0].mtOption = lib.Workflow.getOptionNumber(wfPhase, 1);
                        lastPhase.manualTransition[0].mtxCoordinate = 70 + ((i + 1) * 140);
                        lastPhase.manualTransition[0].mtyCoordinate = 140;
                        lastPhase.doInsert();

                        var rmessage = new SCFile("scmessage");
                        var rmsql = "class=\"wfT\" and message.id=\"" + lastPhase.phaseName + "_" + wfPhase.workflowName + "_" + wfPhase.tableName + ":1\"";

                        if (rmessage.doSelect(rmsql) == RC_SUCCESS) {
                            rmessage.message = "Reopen";
                            rmessage.doUpdate();
                        } else {
                            rmessage._class = "wfT";
                            rmessage.message_id = lastPhase.phaseName + "_" + wfPhase.workflowName + "_" + wfPhase.tableName + ":1";
                            rmessage.message = "Reopen";
                            rmessage.doInsert();
                        }
                    }
                    var rc = wfPhase.doInsert();

                    var message = new SCFile("scmessage");
                    var msql = "class=\"wfT\" and message.id=\"" + wfPhase.phaseName + "_" + wfPhase.workflowName + "_" + wfPhase.tableName + ":1\"";

                    if (message.doSelect(msql) == RC_SUCCESS) {
                        if (category.phases[next] != null) {
                            message.message = "Next Phase";
                        } else {
                            message.message = "Close";
                        }
                        message.doUpdate();
                    } else {
                        message._class = "wfT";
                        message.message_id = wfPhase.phaseName + "_" + wfPhase.workflowName + "_" + wfPhase.tableName + ":1";
                        if (category.phases[next] != null) {
                            message.message = "Next Phase";
                        } else {
                            message.message = "Close";
                        }
                        message.doInsert();
                    }

                    var localmessage = new SCFile("scmessage");
                    msql = "class=\"local:WorkflowPhase\" and message.id=\"" + wfPhase.phaseName + ";" + wfPhase.workflowName + ";" + wfPhase.tableName + "\"";

                    if (localmessage.doSelect(msql) == RC_SUCCESS) {
                        localmessage.message = wfPhase.phaseName;
                        message.doUpdate();
                    } else {
                        localmessage._class = "local:WorkflowPhase";
                        localmessage.message_id = wfPhase.phaseName + ";" + wfPhase.workflowName + ";" + wfPhase.tableName;
                        localmessage.message = wfPhase.phaseName;
                        localmessage.doInsert();
                    }

                }

            }
        },

        upgradeOperators: function() {
            var operator = new SCFile("operator");
            var sql = "true";
            var profileNameMapping = {
                "problem manager/coord": ["problem manager", "problem coordinator"]
            };

            if (operator.doSelect(sql) != RC_SUCCESS) {
                return;
            }

            var needUpdate;
            var profileName;
            var index = 0;
            var i = 0;
            var results;

            do {
                needUpdate = false;

                profileName = operator[_operator_profile_field];
                //for problem manager and coordinator, not use problem manage/coord as the role name
                if (profileName == "problem manager/coord") {
                    profileName = "problem coordinator";
                }
                if (profileName != null && profileName != "") {
                    if (funcs.index(profileName, operator.secRole) == 0) {
                        operator.secRole.push(profileName);
                        needUpdate = true;
                    }
                }

                index = funcs.index("default", operator.secRole);
                if (index > 0) {
                    operator.secRole[index - 1] = "DEFAULT";
                    needUpdate = true;
                }

                if (funcs.lng(funcs.denull(operator.secRole)) == 0) {
                    operator.secRole[0] = "DEFAULT";
                    needUpdate = true;
                }

                if (needUpdate) {
                    //remove duplicate secRole to fix legacy issue.QCCR1E94839
                    results = lib.tableUtil.removeNullAndDuplicate(operator, operator.secRole);
                    operator.secRole = results;
                    operator.doUpdate();
                }

                i++;
                if (i % 1000 == 0) {
                    lib.upgradeLog.detail(`Check and Upgrade ${i} Operators.`);
                }
            }
            while (operator.getNext() == RC_SUCCESS);
        },

        upgradeAreas: function() {},

        upgradeUserRoles: function() {
            var usrRole = new SCFile("userrole");
            var sql = "true";
            var index = 0;
            usrRole.doSelect(sql);
            if (usrRole.getFirst() == RC_SUCCESS) {

                do {
                    var roleName = usrRole[_operator_profile_field];
                    //for problem manager and coordinator, not use problem manage/coord as the role name
                    if (roleName == "problem manager/coord") {
                        roleName = "problem coordinator";
                    }
                    if (roleName != null) {
                        if (funcs.index(roleName, usrRole.secRole) == 0) {
                            usrRole.secRole.push(roleName);
                        }
                    }

                    index = funcs.index("default", usrRole.secRole);
                    if (index > 0) {
                        usrRole.secRole[index - 1] = "DEFAULT";
                    }
                    if (funcs.lng(funcs.denull(usrRole.secRole)) == 0) {
                        usrRole.secRole[0] = "DEFAULT";
                    }
                    //remove duplicate secRole to fix legacy issue.QCCR1E94839
                    var results = lib.tableUtil.removeNullAndDuplicate(usrRole, usrRole.secRole);
                    usrRole.secRole = results;
                    vars.$L_sf = funcs.rtecall("sort", vars.$L_rc, usrRole.secRole, 0, 0);
                    usrRole.doUpdate();

                } while (usrRole.getNext() == RC_SUCCESS);
            }
        }
    };
});

function getClass() {
    return ProcessDesignCPUpgradeManager;
}