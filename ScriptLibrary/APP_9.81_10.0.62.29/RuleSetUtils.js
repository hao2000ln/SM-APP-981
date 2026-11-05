var obString = system.functions.scmsg("Object", "tablename");
var wfString = system.functions.scmsg("Workflow", "tablename");
var wfpString = system.functions.scmsg("WorkflowPhase", "tablename");
var trString = system.functions.scmsg("Transition", "tablename");
var rsString = system.functions.scmsg("RuleSet", "tablename");
var cmString = system.functions.scmsg("changeModel", "tablename");
var rmString = system.functions.scmsg("requestModel", "tablename");

/**
 *  This function is used to check and prevent deleting RuleSet while the RuleSet is still in use by RuleSet/Object/Workflow/WorkflowPhase/Transition/changeModel/requestModel.
 *
 *  @param {String} RuleSetID - The ID of RuleSet record.
 *  @return true or false flag to indicates a RuleSet is still in use or not. 
 *  @type Boolean
 */
function checkRuleSetIsInUse(RuleSetID) {

    var obquery = "(onCreateRules=\"" + RuleSetID + "\" or onUpdateRules=\"" + RuleSetID + "\" or afterAddRules=\"" +
        RuleSetID + "\" or afterUpdateRules=\"" + RuleSetID + "\" or initRules=\"" +
        RuleSetID + "\" or onDisplayRules=\"" + RuleSetID + "\" or onEnterRules=\"" + RuleSetID + "\" or onExitRules=\"" +
        RuleSetID + "\" or afterEnterRules=\"" + RuleSetID + "\" or actionId=\"" + RuleSetID + "\")";

    var wfquery = "(onCreateRules=\"" + RuleSetID + "\" or onUpdateRules=\"" + RuleSetID + "\" or afterAddRules=\"" +
        RuleSetID + "\" or afterUpdateRules=\"" + RuleSetID + "\" or initRules=\"" +
        RuleSetID + "\" or onDisplayRules=\"" + RuleSetID + "\" or onEnterRules=\"" + RuleSetID + "\" or onExitRules=\"" +
        RuleSetID + "\" or afterEnterRules=\"" + RuleSetID + "\" or btRule=\"" + RuleSetID + "\" or actionId=\"" + RuleSetID + "\")";

    var wfpquery = "(onCreateRules=\"" + RuleSetID + "\" or onUpdateRules=\"" + RuleSetID + "\" or onDeleteRules=\"" +
        RuleSetID + "\" or afterUpdateRules=\"" + RuleSetID + "\" or initRules=\"" +
        RuleSetID + "\" or onDisplayRules=\"" + RuleSetID + "\" or mtRules=\"" +
        RuleSetID + "\" or atRules=\"" +
        RuleSetID + "\" or defaultTransitionRules=\"" + RuleSetID + "\" or afterEnterRules=\"" + RuleSetID + "\" or actionId=\"" + RuleSetID + "\")";

    var RuleSet = new SCFile("RuleSet", SCFILE_READONLY);
    RuleSet.setFields(['tablename']);
    var rc = RuleSet.doSelect("id=\"" + RuleSetID + "\"");
    if (rc == RC_SUCCESS) {
        var tablename = RuleSet.tablename.toArray();
        if (tablename != null) {
            var tnLength = tablename.length;
            if (tnLength > 0) {
                obquery = obquery + " and ( ";
                wfquery = wfquery + " and ( ";
                wfpquery = wfpquery + " and ( ";
                for (var i = 0; i < tnLength; i++) {
                    obquery = obquery + "file.name=\"" + tablename[i] + "\"";
                    wfquery = wfquery + "tableName=\"" + tablename[i] + "\"";
                    wfpquery = wfpquery + "tableName=\"" + tablename[i] + "\"";
                    if (i != tnLength - 1) {
                        obquery = obquery + " or ";
                        wfquery = wfquery + " or ";
                        wfpquery = wfpquery + " or ";
                    }
                }
                obquery = obquery + " ) ";
                wfquery = wfquery + " ) ";
                wfpquery = wfpquery + " ) ";
            }
        }
    }


    //Object
    var Object = new SCFile("Object", SCFILE_READONLY);
    Object.setFields(['file.name']);
    rc = Object.doSelect(obquery);
    if (rc == RC_SUCCESS) {
        return true;
    }

    //Workflow
    var Workflow = new SCFile("Workflow", SCFILE_READONLY);
    Workflow.setFields(['name']);
    rc = Workflow.doSelect(wfquery);
    if (rc == RC_SUCCESS) {
        return true;
    }

    //WorkflowPhase and Transition
    var WorkflowPhase = new SCFile("WorkflowPhase", SCFILE_READONLY);
    WorkflowPhase.setFields(['phaseName']);
    rc = WorkflowPhase.doSelect(wfpquery);
    if (rc == RC_SUCCESS) {
        return true;
    }

    //changeModel and requestModel
    var changePlan = new SCFile("changePlan", SCFILE_READONLY);
    changePlan.setFields(['fileName']);
    var cmquery = "taskAssignment=\"" + RuleSetID + "\"";
    rc = changePlan.doSelect(cmquery);
    if (rc == RC_SUCCESS) {
        return true;
    }

    //RuleSet
    rc = RuleSet.doSelect("index(\"" + RuleSetID + "\" ,str(contents(currec()))) > 0");
    while (rc == RC_SUCCESS) {
        if (RuleSet.rule.toArray() != null) {
            var ruleLength = RuleSet.rule.toArray().length;
            if (ruleLength > 0) {
                for (var i = 0; i < ruleLength; i++) {
                    var JSON = system.library.JSON.json();
                    if (RuleSet.rule[i].ruleJSON != null) {
                        var jsonObj = JSON.parse(RuleSet.rule[i].ruleJSON);
                        if ((jsonObj.ruleset != null && jsonObj.ruleset == RuleSetID) || (jsonObj.rulesetName != null && jsonObj.rulesetName == RuleSetID)) {
                            return true;
                        }
                    }
                    var xml = new XML();
                    var ruleXML = RuleSet.rule[i].ruleXML;
                    if (ruleXML != null && ruleXML.length > 0) {
                        xml.setContent(ruleXML);
                        var ruleset = lib.xmlHelpers.getElement(xml, "ruleset");
                        var rulesetName = lib.xmlHelpers.getElement(xml, "rulesetName");
                        if ((ruleset != null && ruleset.getValue() == RuleSetID) || (rulesetName != null && rulesetName.getValue() == RuleSetID)) {
                            return true;
                        }
                    }
                }
            }
        }
        rc = RuleSet.getNext();
    }

    return false;
}

/**
 *  This function is used to build array list includes where(RuleSet, Object, Workflow, WorkflowPhase, Transition, changeModel, requestModel) a rule set is used in.
 *
 *  @param {String} RuleSetID - The ID of RuleSet record.
 *  @return Array that includes the usage information for specific RuleSet. 
 *  @type Array
 */
function buildReferenceList(RuleSetID) {

    var typeArray = [];
    var locationArray = [];
    var queryArray = [];
    var URLArray = [];
    var TRTypeArray = [];
    var TRToPhaseArray = [];
    var rtArray = [];
    rtArray.push(typeArray);
    rtArray.push(locationArray);
    rtArray.push(queryArray);
    rtArray.push(URLArray);
    rtArray.push(TRTypeArray);
    rtArray.push(TRToPhaseArray);

    var queryString = "";
    var URLString = "";

    var obquery = "(onCreateRules=\"" + RuleSetID + "\" or onUpdateRules=\"" + RuleSetID + "\" or afterAddRules=\"" +
        RuleSetID + "\" or afterUpdateRules=\"" + RuleSetID + "\" or initRules=\"" +
        RuleSetID + "\" or onDisplayRules=\"" + RuleSetID + "\" or onEnterRules=\"" + RuleSetID + "\" or onExitRules=\"" +
        RuleSetID + "\" or afterEnterRules=\"" + RuleSetID + "\" or actionId=\"" + RuleSetID + "\")";

    var wfquery = "(onCreateRules=\"" + RuleSetID + "\" or onUpdateRules=\"" + RuleSetID + "\" or afterAddRules=\"" +
        RuleSetID + "\" or afterUpdateRules=\"" + RuleSetID + "\" or initRules=\"" +
        RuleSetID + "\" or onDisplayRules=\"" + RuleSetID + "\" or onEnterRules=\"" + RuleSetID + "\" or onExitRules=\"" +
        RuleSetID + "\" or afterEnterRules=\"" + RuleSetID + "\" or btRule=\"" + RuleSetID + "\" or actionId=\"" + RuleSetID + "\")";

    var wfpquery = "(onCreateRules=\"" + RuleSetID + "\" or onUpdateRules=\"" + RuleSetID + "\" or onDeleteRules=\"" +
        RuleSetID + "\" or afterUpdateRules=\"" + RuleSetID + "\" or initRules=\"" +
        RuleSetID + "\" or onDisplayRules=\"" + RuleSetID + "\" or mtRules=\"" +
        RuleSetID + "\" or atRules=\"" +
        RuleSetID + "\" or defaultTransitionRules=\"" + RuleSetID + "\" or afterEnterRules=\"" + RuleSetID + "\" or actionId=\"" + RuleSetID + "\")";

    var RuleSet = new SCFile("RuleSet", SCFILE_READONLY);
    RuleSet.setFields(['tablename']);
    var rc = RuleSet.doSelect("id=\"" + RuleSetID + "\"");
    if (rc == RC_SUCCESS) {
        var tablename = RuleSet.tablename.toArray();
        if (tablename != null) {
            var tnLength = tablename.length;
            if (tnLength > 0) {
                obquery = obquery + " and ( ";
                wfquery = wfquery + " and ( ";
                wfpquery = wfpquery + " and ( ";
                for (var i = 0; i < tnLength; i++) {
                    obquery = obquery + "file.name=\"" + tablename[i] + "\"";
                    wfquery = wfquery + "tableName=\"" + tablename[i] + "\"";
                    wfpquery = wfpquery + "tableName=\"" + tablename[i] + "\"";
                    if (i != tnLength - 1) {
                        obquery = obquery + " or ";
                        wfquery = wfquery + " or ";
                        wfpquery = wfpquery + " or ";
                    }
                }
                obquery = obquery + " ) ";
                wfquery = wfquery + " ) ";
                wfpquery = wfpquery + " ) ";
            }
        }
    }

    //RuleSet
    rc = RuleSet.doSelect("index(\"" + RuleSetID + "\" ,str(contents(currec()))) > 0");
    while (rc == RC_SUCCESS) {
        if (RuleSet.rule.toArray() != null) {
            var ruleLength = RuleSet.rule.toArray().length;
            if (ruleLength > 0) {
                var rsName = system.functions.scmsg(RuleSet.id, "local:RuleSet");
                if (rsName.indexOf("local:RuleSet-" + RuleSet.id) > 0) {
                    rsName = RuleSet.name;
                }
                for (var i = 0; i < ruleLength; i++) {
                    var JSON = system.library.JSON.json();
                    if (RuleSet.rule[i].ruleJSON != null) {
                        var jsonObj = JSON.parse(RuleSet.rule[i].ruleJSON);
                        if ((jsonObj.ruleset != null && jsonObj.ruleset == RuleSetID) || (jsonObj.rulesetName != null && jsonObj.rulesetName == RuleSetID)) {
                            rtArray[0].push(rsString);
                            rtArray[1].push(rsName + " " + rsString);
                            queryString = "id=\"" + RuleSet.id + "\"";
                            rtArray[2].push(queryString);
                            URLString = "";
                            rtArray[3].push(URLString);
                            rtArray[4].push("RuleSet");
                            rtArray[5].push("RuleSet");
                            break;
                        }
                    }

                    var xml = new XML();
                    if (RuleSet.rule[i].ruleXML != null) {
                        xml.setContent(RuleSet.rule[i].ruleXML);
                        var ruleset = lib.xmlHelpers.getElement(xml, "ruleset");
                        var rulesetName = lib.xmlHelpers.getElement(xml, "rulesetName");
                        if ((ruleset != null && ruleset.getValue() == RuleSetID) || (rulesetName != null && rulesetName.getValue() == RuleSetID)) {
                            rtArray[0].push(rsString);
                            rtArray[1].push(rsName + " " + rsString);
                            queryString = "id=\"" + RuleSet.id + "\"";
                            rtArray[2].push(queryString);
                            URLString = "";
                            rtArray[3].push(URLString);
                            rtArray[4].push("RuleSet");
                            rtArray[5].push("RuleSet");
                            break;
                        }
                    }
                }
            }
        }
        rc = RuleSet.getNext();
    }

    //Object
    var Object = new SCFile("Object", SCFILE_READONLY);
    Object.setFields(['file.name', 'onCreateRules', 'onUpdateRules', 'afterAddRules', 'afterUpdateRules',
        'initRules', 'onDisplayRules', 'onEnterRules', 'onExitRules', 'afterEnterRules', 'actionId'
    ]);

    rc = Object.doSelect(obquery);
    while (rc == RC_SUCCESS) {
        rtArray[0].push(obString);
        rtArray[1].push(Object.file_name + " " + obString);
        queryString = "file.name=\"" + Object.file_name + "\"";
        rtArray[2].push(queryString);
        URLString = system.library.RuleSetUtils.generateObjectURL(Object, RuleSetID);
        rtArray[3].push(URLString);
        rtArray[4].push("Object");
        rtArray[5].push("Object");
        rc = Object.getNext();
    }

    //Workflow
    var Workflow = new SCFile("Workflow", SCFILE_READONLY);
    Workflow.setFields(['name', 'tableName', 'onCreateRules', 'onUpdateRules', 'afterAddRules', 'afterUpdateRules',
        'initRules', 'onDisplayRules', 'onEnterRules', 'onExitRules', 'afterEnterRules', 'btRule', 'actionId'
    ]);

    rc = Workflow.doSelect(wfquery);
    while (rc == RC_SUCCESS) {
        rtArray[0].push(wfString);
        rtArray[1].push(Workflow.name + " " + wfString);
        queryString = "name=\"" + Workflow.name + "\"" + "&tableName=" + "\"" + Workflow.tableName + "\"";
        rtArray[2].push(queryString);
        URLString = system.library.RuleSetUtils.generateWorkflowURL(Workflow, RuleSetID);
        rtArray[3].push(URLString);
        rtArray[4].push("Workflow");
        rtArray[5].push("Workflow");
        rc = Workflow.getNext();
    }

    //WorkflowPhase and Transition
    var WorkflowPhase = new SCFile("WorkflowPhase", SCFILE_READONLY);
    WorkflowPhase.setFields(['phaseName', 'workflowName', 'tableName', 'atToPhase', 'mtToPhase', 'mtOption',
        'onCreateRules', 'onUpdateRules', 'onDeleteRules', 'afterUpdateRules',
        'initRules', 'onDisplayRules', 'mtRules', 'atRules', 'defaultTransitionRules', 'afterEnterRules', 'actionId'
    ]);

   rc = WorkflowPhase.doSelect(wfpquery);
    while (rc == RC_SUCCESS) {
        var URLandTransition = system.library.RuleSetUtils.generateWorkflowPhaseURL(WorkflowPhase, RuleSetID);
        for (var i = 0; i < URLandTransition.length; i++) {
            var msgArgs = [];
            var wfpCondition = WorkflowPhase.phaseName + ";" + WorkflowPhase.workflowName + ";" + WorkflowPhase.tableName;
            var wfpName = system.functions.scmsg(wfpCondition, "local:WorkflowPhase");
            if (wfpName.indexOf(wfpCondition) > 0) {
                wfpName = WorkflowPhase.workflowName;
            }
            if (URLandTransition[i].length == 1) {
               var spArray=URLandTransition[i][0].split("&");//Spliting character into array by "&"
               idx = system.library.ArrayUtil.indexOf(spArray, "rulestype=defaultTransitionRules");
               //dealing with defaultTransition
               if(idx>=0)
               { 
                   rtArray[0].push(trString);
                   msgArgs.push(WorkflowPhase.workflowName);
                   msgArgs.push(wfpName);//from Phase
                   
                   var sub_spArray=spArray[idx-1].split("=");
                   var wfpCondition = sub_spArray[1] + ";" + WorkflowPhase.workflowName + ";" + WorkflowPhase.tableName;
                   var wfpName = system.functions.scmsg(wfpCondition, "local:WorkflowPhase");
               
                  msgArgs.push(wfpName);//to Phase
                  rtArray[1].push(system.functions.scmsg(113, "ruleset", msgArgs));
                  rtArray[4].push("defaultTransition");
                  rtArray[5].push(sub_spArray[1]);  
               }
               //dealing with Phase
             else{
                   rtArray[0].push(wfpString);
                   msgArgs.push(WorkflowPhase.workflowName);
                   msgArgs.push(wfpName);
                   rtArray[1].push(system.functions.scmsg(110, "ruleset", msgArgs));
                   rtArray[4].push("WorkflowPhase");
                   rtArray[5].push("WorkflowPhase");
               } 
            }
            //dealing with autoTransition and manualTransition
            else {
                rtArray[0].push(trString); 
                if (URLandTransition[i][1] == "autoTransition") {
                    msgArgs.push(WorkflowPhase.workflowName);
                    msgArgs.push(wfpName); //fromPhase
                    var wfpCondition = URLandTransition[i][2] + ";" + WorkflowPhase.workflowName + ";" + WorkflowPhase.tableName;
                    var wfpName = system.functions.scmsg(wfpCondition, "local:WorkflowPhase");
                    if (wfpName.indexOf(wfpCondition) > 0) {
                        wfpName = URLandTransition[i][2];
                    }
                    msgArgs.push(wfpName); //toPhase
                    rtArray[1].push(system.functions.scmsg(113, "ruleset", msgArgs));
                    rtArray[4].push("autoTransition");
                    rtArray[5].push(URLandTransition[i][2]);
                } else {
                    msgArgs.push(WorkflowPhase.workflowName);
                    msgArgs.push(wfpName); //fromPhase
                    var wfpCondition = URLandTransition[i][2] + ";" + WorkflowPhase.workflowName + ";" + WorkflowPhase.tableName;
                    var wfpName = system.functions.scmsg(wfpCondition, "local:WorkflowPhase");
                    if (wfpName.indexOf(wfpCondition) > 0) {
                        wfpName = URLandTransition[i][2];
                    }
                    msgArgs.push(wfpName); //toPhase
                    rtArray[1].push(system.functions.scmsg(113, "ruleset", msgArgs));
                    rtArray[4].push("manualTransition");
                    rtArray[5].push(URLandTransition[i][2] + URLandTransition[i][3]);
                }
            }
            queryString = "phaseName=\"" + WorkflowPhase.phaseName + "\"" + "&workflowName=\"" + WorkflowPhase.workflowName + "\"" + "&tableName=\"" + WorkflowPhase.tableName + "\"";
            rtArray[2].push(queryString);
            URLString = URLandTransition[i][0];
            rtArray[3].push(URLString);
        }
        rc = WorkflowPhase.getNext();
    }

    //changeModel and requestModel
    var changePlan = new SCFile("changePlan", SCFILE_READONLY);
    changePlan.setFields(['fileName', 'number', 'taskAssignment']);
    //QCCR1E161278, dx, add query limitation for changePlan, only on changeModel and requestModel
    var cmquery = "taskAssignment=\"" + RuleSetID + "\""+" and (fileName=\"changeModel\" or fileName=\"requestModel\")";
    rc = changePlan.doSelect(cmquery);
    while (rc == RC_SUCCESS) {
        var cmName = system.functions.scmsg(changePlan.number, "local:changeModel");
        if (cmName.indexOf("local:changeModel-" + changePlan.number) > 0) {
            cmName = changePlan.number;
        }
        var rmName = system.functions.scmsg(changePlan.number, "local:requestModel");
        if (rmName.indexOf("local:requestModel-" + changePlan.number) > 0) {
            rmName = changePlan.number;
        }
        if (changePlan.fileName != null) {
            if (changePlan.fileName == "changeModel") {
                rtArray[0].push(cmString);
                rtArray[1].push(cmName + " " + cmString);
            } else {
                rtArray[0].push(rmString);
                rtArray[1].push(rmName + " " + rmString);
            }
        } else {
            var changeModel = new SCFile("changeModel", SCFILE_READONLY);
            changeModel.setFields("id");
            var nrc = changeModel.doSelect("id=\"" + changePlan.number + "\"");
            if (nrc == RC_SUCCESS) {
                rtArray[0].push(cmString);
                rtArray[1].push(cmName + " " + cmString);
            } else {
                rtArray[0].push(rmString);
                rtArray[1].push(rmName + " " + rmString);
            }
        }
        queryString = "fileName=\"" + system.functions.nullsub(changePlan.fileName, "") + "\"" + "and number=" + "\"" + changePlan.number + "\"";
        rtArray[2].push(queryString);
        URLString = "";
        rtArray[3].push(URLString);
        rtArray[4].push(changePlan.number); //Used as query key for query  changeModel/requestModel In DO RuleSet.viewRuleSetUsedIn_do nothing
        rtArray[5].push("changePlan");
        rc = changePlan.getNext();
    }

    return rtArray;
}

/**
 *  This function is used to generate URL for editing specific Object's RuleSet.
 *
 *	@param {SCDatum} Object - the Object record that uses the specific RuleSet.
 *  @param {String} RuleSetID - The ID of RuleSet record.
 *  @return URL string with ecoded parameters for visiting the specific Object in RuleSet Editor. 
 *  @type String
 */
function generateObjectURL(Object, RuleSetID) {
    var tempArray = [];
    var index = -1;
    var URLString = "";

    tempArray = Object.onCreateRules.toArray();
    index = system.library.ArrayUtil.indexOf(tempArray, RuleSetID);
    if (index != -1) {
        URLString = "fileRuleSetEditor&tableName=" + encodeURIComponent(Object.file_name) + "&defselect=object&rulestype=onCreateRules&rulesid=" + RuleSetID;
        return URLString;
    }
    tempArray = Object.afterAddRules.toArray();
    index = system.library.ArrayUtil.indexOf(tempArray, RuleSetID);
    if (index != -1) {
        URLString = "fileRuleSetEditor&tableName=" + encodeURIComponent(Object.file_name) + "&defselect=object&rulestype=afterAddRules&rulesid=" + RuleSetID;
        return URLString;
    }
    tempArray = Object.onEnterRules.toArray();
    index = system.library.ArrayUtil.indexOf(tempArray, RuleSetID);
    if (index != -1) {
        URLString = "fileRuleSetEditor&tableName=" + encodeURIComponent(Object.file_name) + "&defselect=object&rulestype=onEnterRules&rulesid=" + encodeURIComponent(RuleSetID);
        return URLString;
    }
    tempArray = Object.afterEnterRules.toArray();
    index = system.library.ArrayUtil.indexOf(tempArray, RuleSetID);
    if (index != -1) {
        URLString = "fileRuleSetEditor&tableName=" + encodeURIComponent(Object.file_name) + "&defselect=object&rulestype=afterEnterRules&rulesid=" + encodeURIComponent(RuleSetID);
        return URLString;
    }
    tempArray = Object.onExitRules.toArray();
    index = system.library.ArrayUtil.indexOf(tempArray, RuleSetID);
    if (index != -1) {
        URLString = "fileRuleSetEditor&tableName=" + encodeURIComponent(Object.file_name) + "&defselect=object&rulestype=onExitRules&rulesid=" + encodeURIComponent(RuleSetID);
        return URLString;
    }
    tempArray = Object.initRules.toArray();
    index = system.library.ArrayUtil.indexOf(tempArray, RuleSetID);
    if (index != -1) {
        URLString = "fileRuleSetEditor&tableName=" + encodeURIComponent(Object.file_name) + "&defselect=object&rulestype=initRules&rulesid=" + encodeURIComponent(RuleSetID);
        return URLString;
    }
    tempArray = Object.onDisplayRules.toArray();
    index = system.library.ArrayUtil.indexOf(tempArray, RuleSetID);
    if (index != -1) {
        URLString = "fileRuleSetEditor&tableName=" + encodeURIComponent(Object.file_name) + "&defselect=object&rulestype=onDisplayRules&rulesid=" + encodeURIComponent(RuleSetID);
        return URLString;
    }
    tempArray = Object.onUpdateRules.toArray();
    index = system.library.ArrayUtil.indexOf(tempArray, RuleSetID);
    if (index != -1) {
        URLString = "fileRuleSetEditor&tableName=" + encodeURIComponent(Object.file_name) + "&defselect=object&rulestype=onUpdateRules&rulesid=" + RuleSetID;
        return URLString;
    }
    tempArray = Object.afterUpdateRules.toArray();
    index = system.library.ArrayUtil.indexOf(tempArray, RuleSetID);
    if (index != -1) {
        URLString = "fileRuleSetEditor&tableName=" + encodeURIComponent(Object.file_name) + "&defselect=object&rulestype=afterUpdateRules&rulesid=" + encodeURIComponent(RuleSetID);
        return URLString;
    }
    if (Object.action.length() > 0) {
        var length = Object.action.length();
        for (var i = 0; i < length; i++) {
            if (Object.action[i].actionId == RuleSetID) {
                URLString = "fileRuleSetEditor&tableName=" + encodeURIComponent(Object.file_name) + "&defselect=object&rulestype=action&rulesid=" + encodeURIComponent(RuleSetID);
                return URLString;
            }
        }
    }
}

/**
 *  This function is used to generate URL for editing specific Object's RuleSet.
 *
 *	@param {SCDatum} Workflow - the Workflow record that uses the specific RuleSet.
 *  @param {String} RuleSetID - The ID of RuleSet record.
 *  @return URL string with encoded parameters for visiting the specific Object in Workflow Editor.
 *  @type String
 **/
function generateWorkflowURL(Workflow, RuleSetID) {
    var tempArray = [];
    var index = -1;
    var URLString = "";

    tempArray = Workflow.onCreateRules.toArray();
    index = system.library.ArrayUtil.indexOf(tempArray, RuleSetID);
    if (index != -1) {
        URLString = "workflowEditor&tableName=" + encodeURIComponent(Workflow.tableName) + "&workFlowName=" +
            encodeURIComponent(Workflow.name) + "&hpProprietaryLic=false&defselect=workflow&rulestype=onCreateRules&rulesid=" + encodeURIComponent(RuleSetID);
        return URLString;
    }
    tempArray = Workflow.afterAddRules.toArray();
    index = system.library.ArrayUtil.indexOf(tempArray, RuleSetID);
    if (index != -1) {
        URLString = "workflowEditor&tableName=" + encodeURIComponent(Workflow.tableName) + "&workFlowName=" +
            encodeURIComponent(Workflow.name) + "&hpProprietaryLic=false&defselect=workflow&rulestype=afterAddRules&rulesid=" + encodeURIComponent(RuleSetID);
        return URLString;
    }
    tempArray = Workflow.onEnterRules.toArray();
    index = system.library.ArrayUtil.indexOf(tempArray, RuleSetID);
    if (index != -1) {
        URLString = "workflowEditor&tableName=" + encodeURIComponent(Workflow.tableName) + "&workFlowName=" +
            encodeURIComponent(Workflow.name) + "&hpProprietaryLic=false&defselect=workflow&rulestype=onEnterRules&rulesid=" + encodeURIComponent(RuleSetID);
        return URLString;
    }
    tempArray = Workflow.afterEnterRules.toArray();
    index = system.library.ArrayUtil.indexOf(tempArray, RuleSetID);
    if (index != -1) {
        URLString = "workflowEditor&tableName=" + encodeURIComponent(Workflow.tableName) + "&workFlowName=" +
            encodeURIComponent(Workflow.name) + "&hpProprietaryLic=false&defselect=workflow&rulestype=afterEnterRules&rulesid=" + encodeURIComponent(RuleSetID);
        return URLString;
    }
    tempArray = Workflow.onExitRules.toArray();
    index = system.library.ArrayUtil.indexOf(tempArray, RuleSetID);
    if (index != -1) {
        URLString = "workflowEditor&tableName=" + encodeURIComponent(Workflow.tableName) + "&workFlowName=" +
            encodeURIComponent(Workflow.name) + "&hpProprietaryLic=false&defselect=workflow&rulestype=onExitRules&rulesid=" + encodeURIComponent(RuleSetID);
        return URLString;
    }
    tempArray = Workflow.initRules.toArray();
    index = system.library.ArrayUtil.indexOf(tempArray, RuleSetID);
    if (index != -1) {
        URLString = "workflowEditor&tableName=" + encodeURIComponent(Workflow.tableName) + "&workFlowName=" +
            encodeURIComponent(Workflow.name) + "&hpProprietaryLic=false&defselect=workflow&rulestype=initRules&rulesid=" + encodeURIComponent(RuleSetID);
        return URLString;
    }
    tempArray = Workflow.onDisplayRules.toArray();
    index = system.library.ArrayUtil.indexOf(tempArray, RuleSetID);
    if (index != -1) {
        URLString = "workflowEditor&tableName=" + encodeURIComponent(Workflow.tableName) + "&workFlowName=" +
            encodeURIComponent(Workflow.name) + "&hpProprietaryLic=false&defselect=workflow&rulestype=onDisplayRules&rulesid=" + encodeURIComponent(RuleSetID);
        return URLString;
    }
    tempArray = Workflow.onUpdateRules.toArray();
    index = system.library.ArrayUtil.indexOf(tempArray, RuleSetID);
    if (index != -1) {
        URLString = "workflowEditor&tableName=" + encodeURIComponent(Workflow.tableName) + "&workFlowName=" +
            encodeURIComponent(Workflow.name) + "&hpProprietaryLic=false&defselect=workflow&rulestype=onUpdateRules&rulesid=" + encodeURIComponent(RuleSetID);
        return URLString;
    }
    tempArray = Workflow.afterUpdateRules.toArray();
    index = system.library.ArrayUtil.indexOf(tempArray, RuleSetID);
    if (index != -1) {
        URLString = "workflowEditor&tableName=" + encodeURIComponent(Workflow.tableName) + "&workFlowName=" +
            encodeURIComponent(Workflow.name) + "&hpProprietaryLic=false&defselect=workflow&rulestype=afterUpdateRules&rulesid=" + encodeURIComponent(RuleSetID);
        return URLString;
    }

    if (Workflow.action.length() > 0) {
        var length = Workflow.action.length();
        for (var i = 0; i < length; i++) {
            if (Workflow.action[i].actionId == RuleSetID) {
                URLString = "workflowEditor&tableName=" + encodeURIComponent(Workflow.tableName) + "&workFlowName=" +
                    encodeURIComponent(Workflow.name) + "&hpProprietaryLic=false&defselect=workflow&rulestype=action&rulesid=" + encodeURIComponent(RuleSetID);
                return URLString;
            }
        }
    }
    if (Workflow.backendTransition.length() > 0) {
        var length = Workflow.backendTransition.length();
        for (var i = 0; i < length; i++) {
            if (Workflow.backendTransition[i].btRule == RuleSetID) {
                URLString = "workflowEditor&tableName=" + encodeURIComponent(Workflow.tableName) + "&workFlowName=" +
                    encodeURIComponent(Workflow.name) + "&hpProprietaryLic=false&defselect=workflow&rulestype=backendTransition&rulesid=" + encodeURIComponent(RuleSetID);
                return URLString;
            }
        }
    }
}


/**
 *  This function is used to generate URL that  specific WorkflowPhase and decide whether show Transition or not.
 *
 *	@param {WorkflowPhase} WorkflowPhase - the WorkflowPhase which used the given RuleSet.
 *  @param {String} RuleSetID - The ID of RuleSet record.
 *  @return An array that includes the WorkflowPhase info and Transition info. 
 *  @type Array
 **/
function generateWorkflowPhaseURL(WorkflowPhase, RuleSetID) {
    var tempArray = [];
    var rteArray = [];
    var WFPArray = [];
    var index = -1;
    var URLString = "";
    var Transition = "";
    var findRule = false;
    var hasTR = false;

    tempArray = WorkflowPhase.onCreateRules.toArray();
    index = system.library.ArrayUtil.indexOf(tempArray, RuleSetID);
    if (index != -1 && !findRule) {
        URLString = "workflowEditor&tableName=" + encodeURIComponent(WorkflowPhase.tableName) + "&workFlowName=" +
            encodeURIComponent(WorkflowPhase.workflowName) + "&hpProprietaryLic=false&defselect=phase&phase=" +
            encodeURIComponent(WorkflowPhase.phaseName) + "&rulestype=onCreateRules&rulesid=" + encodeURIComponent(RuleSetID);
        WFPArray.push(URLString);
        rteArray.push(WFPArray);
        findRule = true;
    }
    tempArray = WorkflowPhase.afterEnterRules.toArray();
    index = system.library.ArrayUtil.indexOf(tempArray, RuleSetID);
    if (index != -1 && !findRule) {
        URLString = "workflowEditor&tableName=" + encodeURIComponent(WorkflowPhase.tableName) + "&workFlowName=" +
            encodeURIComponent(WorkflowPhase.workflowName) + "&hpProprietaryLic=false&defselect=phase&phase=" +
            encodeURIComponent(WorkflowPhase.phaseName) + "&rulestype=afterEnterRules&rulesid=" + encodeURIComponent(RuleSetID);
        WFPArray.push(URLString);
        rteArray.push(WFPArray);
        findRule = true;
    }
    tempArray = WorkflowPhase.onDeleteRules.toArray();
    index = system.library.ArrayUtil.indexOf(tempArray, RuleSetID);
    if (index != -1 && !findRule) {
        URLString = "workflowEditor&tableName=" + encodeURIComponent(WorkflowPhase.tableName) + "&workFlowName=" +
            encodeURIComponent(WorkflowPhase.workflowName) + "&hpProprietaryLic=false&defselect=phase&phase=" +
            encodeURIComponent(WorkflowPhase.phaseName) + "&rulestype=onDeleteRules&rulesid=" + encodeURIComponent(RuleSetID);
        WFPArray.push(URLString);
        rteArray.push(WFPArray);
        findRule = true;
    }
    tempArray = WorkflowPhase.initRules.toArray();
    index = system.library.ArrayUtil.indexOf(tempArray, RuleSetID);
    if (index != -1 && !findRule) {
        URLString = "workflowEditor&tableName=" + encodeURIComponent(WorkflowPhase.tableName) + "&workFlowName=" +
            encodeURIComponent(WorkflowPhase.workflowName) + "&hpProprietaryLic=false&defselect=phase&phase=" +
            encodeURIComponent(WorkflowPhase.phaseName) + "&rulestype=initRules&rulesid=" + encodeURIComponent(RuleSetID);
        WFPArray.push(URLString);
        rteArray.push(WFPArray);
        findRule = true;
    }
    tempArray = WorkflowPhase.onDisplayRules.toArray();
    index = system.library.ArrayUtil.indexOf(tempArray, RuleSetID);
    if (index != -1 && !findRule) {
        URLString = "workflowEditor&tableName=" + encodeURIComponent(WorkflowPhase.tableName) + "&workFlowName=" +
            encodeURIComponent(WorkflowPhase.workflowName) + "&hpProprietaryLic=false&defselect=phase&phase=" +
            encodeURIComponent(WorkflowPhase.phaseName) + "&rulestype=onDisplayRules&rulesid=" + encodeURIComponent(RuleSetID);
        WFPArray.push(URLString);
        rteArray.push(WFPArray);
        findRule = true;
    }
    tempArray = WorkflowPhase.onUpdateRules.toArray();
    index = system.library.ArrayUtil.indexOf(tempArray, RuleSetID);
    if (index != -1 && !findRule) {
        URLString = "workflowEditor&tableName=" + encodeURIComponent(WorkflowPhase.tableName) + "&workFlowName=" +
            encodeURIComponent(WorkflowPhase.workflowName) + "&hpProprietaryLic=false&defselect=phase&phase=" +
            encodeURIComponent(WorkflowPhase.phaseName) + "&rulestype=onUpdateRules&rulesid=" + encodeURIComponent(RuleSetID);
        WFPArray.push(URLString);
        rteArray.push(WFPArray);
        findRule = true;
    }
    tempArray = WorkflowPhase.afterUpdateRules.toArray();
    index = system.library.ArrayUtil.indexOf(tempArray, RuleSetID);
    if (index != -1 && !findRule) {
        URLString = "workflowEditor&tableName=" + encodeURIComponent(WorkflowPhase.tableName) + "&workFlowName=" +
            encodeURIComponent(WorkflowPhase.workflowName) + "&hpProprietaryLic=false&defselect=phase&phase=" +
            encodeURIComponent(WorkflowPhase.phaseName) + "&rulestype=afterUpdateRules&rulesid=" + encodeURIComponent(RuleSetID);
        WFPArray.push(URLString);
        rteArray.push(WFPArray);
        findRule = true;
    }
    if (WorkflowPhase.action.length() > 0 && !findRule) {
        var length = WorkflowPhase.action.length();
        for (var i = 0; i < length; i++) {
            if (WorkflowPhase.action[i].actionId == RuleSetID) {
                URLString = "workflowEditor&tableName=" + encodeURIComponent(WorkflowPhase.tableName) + "&workFlowName=" +
                    encodeURIComponent(WorkflowPhase.workflowName) + "&hpProprietaryLic=false&defselect=phase&phase=" +
                    encodeURIComponent(WorkflowPhase.phaseName) + "&rulestype=action&rulesid=" + encodeURIComponent(RuleSetID);
                WFPArray.push(URLString);
                rteArray.push(WFPArray);
                findRule = true;
            }
        }
    }
    tempArray = WorkflowPhase.defaultTransitionRules.toArray();
    index = system.library.ArrayUtil.indexOf(tempArray, RuleSetID);
    if (index != -1 && !findRule) {
        URLString = "workflowEditor&tableName=" + encodeURIComponent(WorkflowPhase.tableName) + "&workFlowName=" +
            encodeURIComponent(WorkflowPhase.workflowName) + "&hpProprietaryLic=false&defselect=phase&phase=" +
            encodeURIComponent(WorkflowPhase.phaseName) +"&tophase="+encodeURIComponent(WorkflowPhase.defaultTransition)+ "&rulestype=defaultTransitionRules&rulesid=" + encodeURIComponent(RuleSetID);
        WFPArray.push(URLString);
        rteArray.push(WFPArray);
        findRule = true;
    }
    if (WorkflowPhase.autoTransition.length() > 0 && !hasTR) {
        var length = WorkflowPhase.autoTransition.length();
        for (var i = 0; i < length; i++) {
            var TRArray = [];
            if (WorkflowPhase.autoTransition[i].atRules != null) {
                tempArray = WorkflowPhase.autoTransition[i].atRules.toArray();
                index = system.library.ArrayUtil.indexOf(tempArray, RuleSetID);
                if (index != -1) {
                    URLString = "workflowEditor&tableName=" + encodeURIComponent(WorkflowPhase.tableName) + "&workFlowName=" +
                        encodeURIComponent(WorkflowPhase.workflowName) + "&hpProprietaryLic=false&defselect=autoTransition&phase=" +
                        encodeURIComponent(WorkflowPhase.phaseName) + "&tophase=" + encodeURIComponent(WorkflowPhase.autoTransition[i].atToPhase) + "&rulesid=" + encodeURIComponent(RuleSetID);
                    Transition = "autoTransition";
                    TRArray.push(URLString);
                    TRArray.push(Transition);
                    TRArray.push(WorkflowPhase.autoTransition[i].atToPhase);
                    rteArray.push(TRArray);
                    hasTR = true;
                }
            }
        }
    }
    if (WorkflowPhase.manualTransition.length() > 0 && !hasTR) {
        var length = WorkflowPhase.manualTransition.length();
        for (var i = 0; i < length; i++) {
            var TRArray = [];
            if (WorkflowPhase.manualTransition[i].mtRules != null) {
                tempArray = WorkflowPhase.manualTransition[i].mtRules.toArray();
                index = system.library.ArrayUtil.indexOf(tempArray, RuleSetID);
                if (index != -1) {
                    URLString = "workflowEditor&tableName=" + encodeURIComponent(WorkflowPhase.tableName) + "&workFlowName=" +
                        encodeURIComponent(WorkflowPhase.workflowName) + "&hpProprietaryLic=false&defselect=manualTransition&phase=" +
                        encodeURIComponent(WorkflowPhase.phaseName) + "&tophase=" + encodeURIComponent(WorkflowPhase.manualTransition[i].mtToPhase) + "&optionid=" +
                        encodeURIComponent(WorkflowPhase.manualTransition[i].mtOption) + "&rulesid=" + encodeURIComponent(RuleSetID);
                    Transition = "manualTransition";
                    TRArray.push(URLString);
                    TRArray.push(Transition);
                    TRArray.push(WorkflowPhase.manualTransition[i].mtToPhase);
                    TRArray.push(WorkflowPhase.manualTransition[i].mtOptionName);
                    rteArray.push(TRArray);
                    hasTR = true;
                }
            }
        }
    }
    return rteArray;
}

/**
 *  This function is used to remove RuleSet from the selected locations (RuleSet, Object, Workflow, WorkflowPhase, changeModel or requestModel).
 *
 *  @param {String} ruleset - The ID of current RuleSet record.
 *  @param {Array} rows - array of the selected row(s) indexes.
 *  @param {Array} type - array of where the RuleSet used in. Posssible values:Object, Workflow, WorkflowPhase, Transition, changeModel or requestModel.
 *  @param {Array} query - array of the query condition of RuleSet/Object/Workflow/WorkflowPhase/Transition/changeModel/requestModel.
 *  @return the result of removing RuleSet.
 *  @type String
 **/
function removeRuleSet(ruleset, rows, type, query, rtArray) {

    var rowArray = [];
    var hasHPProprietary = false;
    if (rows != null && rows.toArray() != null) {
        rowArray = rows.toArray();
    } else {
        return "NO_RECORD_SELECTED";
    }
    for (var j = 0, len = rowArray.length; j < len; j++) {
        var rowIndex = rowArray[j] - 1;
        var typeString = type[rowIndex];
        var queryString = query[rowIndex];
        var RuleSetID = ruleset;
        var TRType = rtArray[4].toArray()[rowIndex];
        var TRToPhase = rtArray[5].toArray()[rowIndex];
        var tempArray = [];
        var index = -1;

        if (typeString == rsString) {
            var RuleSet = new SCFile("RuleSet");
            var rsquery = queryString;
            var rc = RuleSet.doSelect(rsquery);
            if (rc == RC_SUCCESS) {
                if (RuleSet.sysrestricted == true) {
                    hasHPProprietary = true;
                    continue;
                }
                if (RuleSet.rule.toArray() != null) {
                    var ruleLength = RuleSet.rule.toArray().length;
                    if (ruleLength > 0) {
                        for (var i = 0; i < ruleLength; i++) {
                            var string = "";
                            var JSON = system.library.JSON.json();
                            if (RuleSet.rule[i].ruleJSON != null) {
                                var jsonObj = JSON.parse(RuleSet.rule[i].ruleJSON);
                                if ((jsonObj.ruleset != null && jsonObj.ruleset == RuleSetID) || (jsonObj.rulesetName != null && jsonObj.rulesetName == RuleSetID)) {
                                    string = RuleSet.rule[i].ruleJSON.replace(RuleSetID, "");
                                    RuleSet.rule[i].ruleJSON = string;
                                }
                            }
                            var xml = new XML();
                            if (RuleSet.rule[i].ruleXML != null) {
                                xml.setContent(RuleSet.rule[i].ruleXML);
                                var ruleset = lib.xmlHelpers.getElement(xml, "ruleset");
                                var rulesetName = lib.xmlHelpers.getElement(xml, "rulesetName");
                                if ((ruleset != null && ruleset.getValue() == RuleSetID) || (rulesetName != null && rulesetName.getValue() == RuleSetID)) {
                                    string = RuleSet.rule[i].ruleXML.replace(RuleSetID, "");
                                    RuleSet.rule[i].ruleXML = string;
                                }
                            }
                        }
                        rc = RuleSet.doUpdate();
                    }
                }
            }
        }

        if (typeString == obString) {
            var Object = new SCFile("Object");
            var obquery = queryString;
            var rc = Object.doSelect(obquery);
            if (rc == RC_SUCCESS) {
                tempArray = Object.onCreateRules.toArray();
                index = system.library.ArrayUtil.indexOf(tempArray, RuleSetID);
                if (index != -1) {
                    tempArray.splice(index, 1);
                    Object.onCreateRules = tempArray;
                }
                tempArray = Object.onUpdateRules.toArray();
                index = system.library.ArrayUtil.indexOf(tempArray, RuleSetID);
                if (index != -1) {
                    tempArray.splice(index, 1);
                    Object.onUpdateRules = tempArray;
                }
                tempArray = Object.afterAddRules.toArray();
                index = system.library.ArrayUtil.indexOf(tempArray, RuleSetID);
                if (index != -1) {
                    tempArray.splice(index, 1);
                    Object.afterAddRules = tempArray;
                }
                tempArray = Object.afterUpdateRules.toArray();
                index = system.library.ArrayUtil.indexOf(tempArray, RuleSetID);
                if (index != -1) {
                    tempArray.splice(index, 1);
                    Object.afterUpdateRules = tempArray;
                }
                tempArray = Object.initRules.toArray();
                index = system.library.ArrayUtil.indexOf(tempArray, RuleSetID);
                if (index != -1) {
                    tempArray.splice(index, 1);
                    Object.initRules = tempArray;
                }
                tempArray = Object.onDisplayRules.toArray();
                index = system.library.ArrayUtil.indexOf(tempArray, RuleSetID);
                if (index != -1) {
                    tempArray.splice(index, 1);
                    Object.onDisplayRules = tempArray;
                }
                tempArray = Object.onEnterRules.toArray();
                index = system.library.ArrayUtil.indexOf(tempArray, RuleSetID);
                if (index != -1) {
                    tempArray.splice(index, 1);
                    Object.onEnterRules = tempArray;
                }
                tempArray = Object.onExitRules.toArray();
                index = system.library.ArrayUtil.indexOf(tempArray, RuleSetID);
                if (index != -1) {
                    tempArray.splice(index, 1);
                    Object.onExitRules = tempArray;

                }
                tempArray = Object.afterEnterRules.toArray();
                index = system.library.ArrayUtil.indexOf(tempArray, RuleSetID);
                if (index != -1) {
                    tempArray.splice(index, 1);
                    Object.afterEnterRules = tempArray;
                }
                if (Object.action.length() > 0) {
                    var newActionArray = new Datum();
                    newActionArray.setType(8);
                    var length = Object.action.length();
                    for (var i = 0; i < length; i++) {
                        if (Object.action[i].actionId != RuleSetID) {
                            newActionArray.push(Object.action[i]);
                        }
                    }
                    Object.action = newActionArray;
                }
                rc = Object.doUpdate();

            }
        }

        if (typeString == wfString) {
            var Workflow = new SCFile("Workflow");
            var wfpquery = queryString;
            var rc = Workflow.doSelect(wfpquery);
            if (rc == RC_SUCCESS) {
                if (Workflow.sysrestricted == true) {
                    hasHPProprietary = true;
                    continue;
                }
                tempArray = Workflow.onCreateRules.toArray();
                index = system.library.ArrayUtil.indexOf(tempArray, RuleSetID);
                if (index != -1) {
                    tempArray.splice(index, 1);
                    Workflow.onCreateRules = tempArray;
                }
                tempArray = Workflow.onUpdateRules.toArray();
                index = system.library.ArrayUtil.indexOf(tempArray, RuleSetID);
                if (index != -1) {
                    tempArray.splice(index, 1);
                    Workflow.onUpdateRules = tempArray;
                }
                tempArray = Workflow.afterAddRules.toArray();
                index = system.library.ArrayUtil.indexOf(tempArray, RuleSetID);
                if (index != -1) {
                    tempArray.splice(index, 1);
                    Workflow.afterAddRules = tempArray;
                }
                tempArray = Workflow.afterUpdateRules.toArray();
                index = system.library.ArrayUtil.indexOf(tempArray, RuleSetID);
                if (index != -1) {
                    tempArray.splice(index, 1);
                    Workflow.afterUpdateRules = tempArray;
                }
                tempArray = Workflow.initRules.toArray();
                index = system.library.ArrayUtil.indexOf(tempArray, RuleSetID);
                if (index != -1) {
                    tempArray.splice(index, 1);
                    Workflow.initRules = tempArray;
                }
                tempArray = Workflow.onDisplayRules.toArray();
                index = system.library.ArrayUtil.indexOf(tempArray, RuleSetID);
                if (index != -1) {
                    tempArray.splice(index, 1);
                    Workflow.onDisplayRules = tempArray;
                }
                tempArray = Workflow.onEnterRules.toArray();
                index = system.library.ArrayUtil.indexOf(tempArray, RuleSetID);
                if (index != -1) {
                    tempArray.splice(index, 1);
                    Workflow.onEnterRules = tempArray;
                }
                tempArray = Workflow.onExitRules.toArray();
                index = system.library.ArrayUtil.indexOf(tempArray, RuleSetID);
                if (index != -1) {
                    tempArray.splice(index, 1);
                    Workflow.onExitRules = tempArray;
                }
                tempArray = Workflow.afterEnterRules.toArray();
                index = system.library.ArrayUtil.indexOf(tempArray, RuleSetID);
                if (index != -1) {
                    tempArray.splice(index, 1);
                    Workflow.afterEnterRules = tempArray;
                }
                if (Workflow.action.length() > 0) {
                    var newActionArray = new Datum();
                    newActionArray.setType(8);
                    var length = Workflow.action.length();
                    for (var i = 0; i < length; i++) {
                        if (Workflow.action[i].actionId != RuleSetID) {
                            newActionArray.push(Workflow.action[i]);
                        }
                    }
                    Workflow.action = newActionArray;
                }
                if (Workflow.backendTransition.length() > 0) {
                    var newActionArray = new Datum();
                    newActionArray.setType(8);
                    var length = Workflow.backendTransition.length();
                    for (var i = 0; i < length; i++) {
                        if (Workflow.backendTransition[i].btRule != RuleSetID) {
                            newActionArray.push(Workflow.backendTransition[i]);
                        }
                    }
                    Workflow.backendTransition = newActionArray;
                }
                rc = Workflow.doUpdate();
            }
        }

        if (typeString == wfpString) {
            var WorkflowPhase = new SCFile("WorkflowPhase");
            var wfpquery = queryString;
            var rc = WorkflowPhase.doSelect(wfpquery);
            if (rc == RC_SUCCESS) {
                var Workflow = new SCFile("Workflow");
                var nrc = Workflow.doSelect("name = \"" + WorkflowPhase.workflowName + "\" and tableName = \"" + WorkflowPhase.tableName + "\"");
                if (nrc == RC_SUCCESS) {
                    if (Workflow.sysrestricted == true) {
                        hasHPProprietary = true;
                        continue;
                    }
                    Workflow.doSave();
                }
                tempArray = WorkflowPhase.onCreateRules.toArray();
                index = system.library.ArrayUtil.indexOf(tempArray, RuleSetID);
                if (index != -1) {
                    tempArray.splice(index, 1);
                    WorkflowPhase.onCreateRules = tempArray;
                }
                tempArray = WorkflowPhase.onUpdateRules.toArray();
                index = system.library.ArrayUtil.indexOf(tempArray, RuleSetID);
                if (index != -1) {
                    tempArray.splice(index, 1);
                    WorkflowPhase.onUpdateRules = tempArray;
                }
                tempArray = WorkflowPhase.onDeleteRules.toArray();
                index = system.library.ArrayUtil.indexOf(tempArray, RuleSetID);
                if (index != -1) {
                    tempArray.splice(index, 1);
                    WorkflowPhase.onDeleteRules = tempArray;
                }
                tempArray = WorkflowPhase.afterUpdateRules.toArray();
                index = system.library.ArrayUtil.indexOf(tempArray, RuleSetID);
                if (index != -1) {
                    tempArray.splice(index, 1);
                    WorkflowPhase.afterUpdateRules = tempArray;
                }
                tempArray = WorkflowPhase.initRules.toArray();
                index = system.library.ArrayUtil.indexOf(tempArray, RuleSetID);
                if (index != -1) {
                    tempArray.splice(index, 1);
                    WorkflowPhase.initRules = tempArray;
                }
                tempArray = WorkflowPhase.onDisplayRules.toArray();
                index = system.library.ArrayUtil.indexOf(tempArray, RuleSetID);
                if (index != -1) {
                    tempArray.splice(index, 1);
                    WorkflowPhase.onDisplayRules = tempArray;
                }
                tempArray = WorkflowPhase.defaultTransitionRules.toArray();
                index = system.library.ArrayUtil.indexOf(tempArray, RuleSetID);
                if (index != -1) {
                    tempArray.splice(index, 1);
                    WorkflowPhase.defaultTransitionRules = tempArray;
                }
                tempArray = WorkflowPhase.afterEnterRules.toArray();
                index = system.library.ArrayUtil.indexOf(tempArray, RuleSetID);
                if (index != -1) {
                    tempArray.splice(index, 1);
                    WorkflowPhase.afterEnterRules = tempArray;
                }
                if (WorkflowPhase.action.length() > 0) {
                    var newActionArray = new Datum();
                    newActionArray.setType(8);
                    var length = WorkflowPhase.action.length();
                    for (var i = 0; i < length; i++) {
                        if (WorkflowPhase.action[i].actionId != RuleSetID) {
                            newActionArray.push(WorkflowPhase.action[i]);
                        }
                    }
                    WorkflowPhase.action = newActionArray;
                }
                rc = WorkflowPhase.doUpdate();
            }

        }

        if (typeString == trString) {
            var WorkflowPhase = new SCFile("WorkflowPhase");
            var wfpquery = queryString;
            var rc = WorkflowPhase.doSelect(wfpquery);
            if (rc == RC_SUCCESS) {
                var Workflow = new SCFile("Workflow");
                var nrc = Workflow.doSelect("name = \"" + WorkflowPhase.workflowName + "\" and tableName = \"" + WorkflowPhase.tableName + "\"");
                if (nrc == RC_SUCCESS) {
                    if (Workflow.sysrestricted == true) {
                        hasHPProprietary = true;
                        continue;
                    }
                    Workflow.doSave();
                }
                if (WorkflowPhase.autoTransition.length() > 0 && TRType == "autoTransition") {
                    var length = WorkflowPhase.autoTransition.length();
                    for (var i = 0; i < length; i++) {
                        if (WorkflowPhase.autoTransition[i].atRules != null && WorkflowPhase.autoTransition[i].atToPhase == TRToPhase) {
                            tempArray = WorkflowPhase.autoTransition[i].atRules.toArray();
                            index = system.library.ArrayUtil.indexOf(tempArray, RuleSetID);
                            if (index != -1) {
                                tempArray.splice(index, 1);
                                WorkflowPhase.autoTransition[i].atRules = tempArray;
                                break;
                            }
                        }
                    }
                }
                if (WorkflowPhase.manualTransition.length() > 0 && TRType == "manualTransition") {
                    var length = WorkflowPhase.manualTransition.length();
                    for (var i = 0; i < length; i++) {
                        var TRKey = WorkflowPhase.manualTransition[i].mtToPhase + WorkflowPhase.manualTransition[i].mtOptionName;
                        if (WorkflowPhase.manualTransition[i].mtRules != null && TRKey == TRToPhase) {
                            tempArray = WorkflowPhase.manualTransition[i].mtRules.toArray();
                            index = system.library.ArrayUtil.indexOf(tempArray, RuleSetID);
                            if (index != -1) {
                                tempArray.splice(index, 1);
                                WorkflowPhase.manualTransition[i].mtRules = tempArray;
                                break;
                            }
                        }
                    }
                }
                rc = WorkflowPhase.doUpdate();
            }

        }

        if (typeString == cmString || typeString == rmString) {
            var changePlan = new SCFile("changePlan");
            var cmquery = queryString;
            rc = changePlan.doSelect(cmquery);
            if (rc == RC_SUCCESS) {
                if (changePlan.tasks.length() > 0) {
                    var length = changePlan.tasks.length();
                    for (var i = 0; i < length; i++) {
                        if (changePlan.tasks[i].taskAssignment == RuleSetID) {
                            changePlan.tasks[i].taskAssignment = null;
                        }
                    }
                }
                changePlan.doUpdate();
            }
        }

    }


    if (hasHPProprietary) {
        print(system.functions.scmsg(116, "ruleset"));
    } else {
        print(system.functions.scmsg(112, "ruleset"));
    }
    return "SUCCESS";
}