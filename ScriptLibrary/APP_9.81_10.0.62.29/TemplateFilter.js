/**
 *  This function returns alled tables and templates for logged in user
 *
 * @author:Hua Zhang
 * @Date 03/16/2007
 */

function getAllowedTemplateTables() {
    //get a list of tables that supports template
    var tableList = getTemplateTables();

    //filter tables based on profile for the table
    var filteredList = [];
    var i;
    for (i = 0; i < tableList.length; ++i) {
        if (canModifyTemplate(tableList[i])) {
            filteredList.push(funcs.scmsg(tableList[i], "tablename"));
        }
    }

    return filteredList;
}

function getAllowedTemplateTableNames() {
    //get a list of tables that supports template
    var tableList = getTemplateTables();

    //filter tables based on profile for the table
    var filteredList = [];
    var i;
    for (i = 0; i < tableList.length; ++i) {
        if (canModifyTemplate(tableList[i])) {
            filteredList.push(tableList[i]);
        }
    }

    return filteredList;
}


function getTemplateTables() {
    var tempTables = new SCFile("Object", SCFILE_READONLY);
    tempTables.setFields("file.name");
    var rc = tempTables.doSelect("supportTemplates=true");

    var TempTableList = [];

    while (rc == RC_SUCCESS) {
        TempTableList.push(tempTables.file_name);
        rc = tempTables.getNext();
    }

    return TempTableList;
}


function canModifyTemplate(tableName) {
    if (tableName == "incidents") {
        if (vars.$G_sm_environment.modifyTemplate != null && vars.$G_sm_environment.modifyTemplate) {
            return true;
        }
    } else if (tableName == "probsummary" || tableName == "imTask") {
        if (vars.$G_pm_environment.modifyTemplate != null && vars.$G_pm_environment.modifyTemplate) {
            return true;
        }
    } else if (tableName == "cm3t" || tableName == "cm3r") {
        if (vars.$G_cm3r_environment.modifyTemplate != null && vars.$G_cm3r_environment.modifyTemplate) {
            return true;
        }
    } else if (tableName == "ocml" || tableName == "ocmq" || tableName == "ocmo") {
        if (vars.$G_ocmq_environment.modifyTemplate != null && vars.$G_ocmq_environment.modifyTemplate) {
            return true;
        }
    } else if (tableName == "rootcause" || tableName == "rootcausetask" || tableName == "knownerror") {
        if (lib.security.getRights("Problem", "modifyTemplate") == "true") {
            return true;
        }
    } else if (tableName == "timeperiodDefinition") {
        if (lib.security.getToken("Timeperiod", "modifyTemplate") == "true") {
            return true;
        }
    } else if (tableName == "request") {
        if (lib.security.getRights("Request", "modifyTemplate") == "true") {
            return true;
        }
    } else if (tableName == "requestTask") {
        if (lib.security.getRights("Request Tasks", "modifyTemplate") == "true") {
            return true;
        }
    }
    return false;
}

function getGroupID(tableName) {
    var profileName = "";
    switch (tableName) {
        case "incidents":
            profileName = vars.$G_sm_environment.name;
            break;
        case "probsummary":
        case "imTask":
            profileName = vars.$G_pm_environment.name;
            break;
        case "rootcause":
        case "rootcausetask":
        case "knownerror":
            profileName = vars.$G_rc_environment.name;
            break;
        case "device":
            profileName = vars.$G_am_environment.name;
            break;
        case "contract":
            profileName = vars.$G_ct_environment.name;
            break;
        case "sla":
            profileName = vars.$G_sla_profile.name;
            break;
        case "ocmo":
        case "ocml":
        case "ocmq":
            profileName = vars.$G_ocmq_environment.name;
            if (profileName.indexOf("**") == 0) {
                profileName = profileName.substring(2);
            }
            break;
        case "cm3r":
        case "cm3t":
            profileName = vars.$G_cm3r_environment.name;
            if (profileName.indexOf("**") == 0) {
                profileName = profileName.substring(2);
            }
            break;
    }

    return profileName;
}

function getTableName(caption) {
    switch (caption) {
        case funcs.scmsg("incidents", "tablename"):
            return "incidents";
        case funcs.scmsg("probsummary", "tablename"):
            return "probsummary";
        case funcs.scmsg("imTask", "tablename"):
            return "imTask";
        case funcs.scmsg("cm3r", "tablename"):
            return "cm3r";
        case funcs.scmsg("cm3t", "tablename"):
            return "cm3t";
        case funcs.scmsg("rootcause", "tablename"):
            return "rootcause";
        case funcs.scmsg("rootcausetask", "tablename"):
            return "rootcausetask";
        case funcs.scmsg("knownerror", "tablename"):
            return "knownerror";
        case funcs.scmsg("ocmo", "tablename"):
            return "ocmo";
        case funcs.scmsg("ocml", "tablename"):
            return "ocml";
        case funcs.scmsg("ocmq", "tablename"):
            return "ocmq";
        case funcs.scmsg("timeperiodDefinition", "tablename"):
            return "timeperiodDefinition";
        default:
            return caption;
    }
}