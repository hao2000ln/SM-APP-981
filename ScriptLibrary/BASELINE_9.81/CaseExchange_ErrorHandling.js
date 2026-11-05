/****************************************************************
 *  Functions used to create incident for Case Exchange Error Handling.
 *  Author: DeHong Wang
 *  Date:2013/12/26
 *  Update:2014/02/11
 *  Version:0.2
 ****************************************************************/
var IS_ACTIVATED_INCIDENT_CREATION_KEY = "activateIncident";
var ASSIGNMENT_GROUP_KEY = "assignmentGroup";
var IMPACT_KEY = "impact";
var URGENCY_KEY = "urgency";
var CATEGORY_KEY = "category";
var SUBCATEGORY_KEY = "subcategory";
var SUBAREA_KEY = "subarea";
var AFFECTED_SERVICE_KEY = "affected.service";
var TITLE_KEY = "title";
var RELATED_INCIDENT_ID = "related.incident.id";
var additionalDescription = "";

/**
 *   This fuction is to get Logger for an integration instance.
 *
 *	@param {integrationInstance} - smis_InstanceConfiguration
 *	@return logger
 *	@type - smis_Logger
 */
function getLogger(integrationInstance) {

    var logger = new(lib.smis_Logger.getClass())();
    logger.setDefaultLevel(integrationInstance.loggerLevel);
    return logger;
}

function isIntegrationInstanceEnabled(integrationInstance) {
    var isEnabled = false;

    if (integrationInstance != null) {
        if (integrationInstance.status != lib.smis_Constants.INSTANCE_STATUS_DISABLE()) {
            isEnabled = true;
        }
    }

    return isEnabled;
}

function isActivatedIncidentCreationforError(integrationInstance) {
    var isActivatedCreation = false;

    if (integrationInstance != null) {
        var isActivated = integrationInstance.getConfigParameterValue(IS_ACTIVATED_INCIDENT_CREATION_KEY);

        isActivatedCreation = isActivated;
    }

    return isActivatedCreation;
}

//To check whether assignment group is valid.
function isAssignmentGroupValid(assignmentGroup) {
    var isAssignmentValid = false;
    var assignment = new SCFile("assignment", SCFILE_READONLY);

    assignment.setFields("name");

    var findAssignmentGroup = assignment.doSelect("name=\"" + assignmentGroup + "\"");

    if (findAssignmentGroup == RC_SUCCESS) {
        isAssignmentValid = true;
    }

    return isAssignmentValid;
}

function getAssignmentGroup(integrationInstance) {
    var assignmentGroup = "";

    if (integrationInstance != null) {
        assignmentGroup = integrationInstance.getConfigParameterValue(ASSIGNMENT_GROUP_KEY);

        if (!isAssignmentGroupValid(assignmentGroup)) {
            // To get default setting from Serivce Desk Environment
            var defaultAssignmentGroup = vars['$G.sm.global.environment']['Group'];

            if (isAssignmentGroupValid(defaultAssignmentGroup)) {
                additionalDescription += system.functions.scmsg(18, "CaseExchange", [assignmentGroup]) + "\n";
                assignmentGroup = defaultAssignmentGroup;
            } else {
                assignmentGroup = "";
            }
        }
    }

    return assignmentGroup;
}

function getImpact(integrationInstance) {
    var impact = "";

    if (integrationInstance != null) {
        impact = integrationInstance.getConfigParameterValue(IMPACT_KEY);
    }

    return impact;
}

function getUrgency(integrationInstance) {
    var urgency = "";

    if (integrationInstance != null) {
        var urgency = integrationInstance.getConfigParameterValue(URGENCY_KEY);
    }

    return urgency;
}

//To get incident category file name for probsummary from file Object.
//In PD environment, it's "imCategory". For Non-PD environment, it's "category".
function getCategoryFileName() {
    var categoryFileName = "";
    var categoryFileField = "category.file.name";

    var object = new SCFile("Object", SCFILE_READONLY);

    object.setFields(categoryFileField);

    var query = "file.name=\"probsummary\"";

    var findObject = object.doSelect(query);

    if (findObject == RC_SUCCESS) {
        categoryFileName = object[categoryFileField];
    }

    return categoryFileName;
}

//To check category is valid or not.
function isCategoryValid(category) {
    var isValid = false;
    var categoryFile = getCategoryFileName();

    var incidentCategory = new SCFile(categoryFile, SCFILE_READONLY);

    incidentCategory.setFields("name");

    var query = "name=\"" + category + "\"";
    query += " and active = \"true\"";

    var findCategory = incidentCategory.doSelect(query);

    if (findCategory == RC_SUCCESS) {
        isValid = true;
    }

    return isValid;
}

function getDefaultCategory(isIncidentPDEnabled) {
    var defaultCategory = "";
    var categorySettingFile = "environment";

    //For PD environment, get default category from file settings.
    //For Non-PD environment, get default category from file environment.
    if (isIncidentPDEnabled) {
        categorySettingFile = "settings";

        var setting = new SCFile(categorySettingFile, SCFILE_READONLY);
        var findSetting = setting.doSelect("name=\"Incident\"");

        if (findSetting == RC_SUCCESS) {
            var i = 0;

            //Get index of settingId for "default.category"
            for (var j = 0; j < setting.settingId.length(); j++) {
                if (setting.settingId[j] == "default.category") {
                    i = j;
                    break;
                }
            }

            //Get settingValue with the index
            if (setting.settingValue[i] != null) {
                defaultCategory = setting.settingValue[i];
            }
        }
    } else {
        //Get default category setting from global list which is set in file "environment"
        defaultCategory = vars["$G.pm.global.environment"]["default"];
    }

    return defaultCategory;
}

// To Get Category Setting for an integration instance in SMIS Configuration.
function getCategory(integrationInstance, isAdditionalDescNeeded) {
    var incidentCategory = "";

    if (integrationInstance != null) {
        incidentCategory = integrationInstance.getConfigParameterValue(CATEGORY_KEY);

        //To check category source which depends on whether PD is enalbed.
        var isPDEnabled = lib.ProcessDesignerEnablement.isIncidentEnabled();

        if (!isCategoryValid(incidentCategory)) {
            //Get Category Default Setting from Incident Management Environment.
            var defaultCategory = getDefaultCategory(isPDEnabled);

            if (isAdditionalDescNeeded) {
                additionalDescription += system.functions.scmsg(19, "CaseExchange", [incidentCategory]) + "\n";
            }

            if (isCategoryValid(defaultCategory)) {
                incidentCategory = defaultCategory;
            } else {
                incidentCategory = "incident";
            }
        }
    }

    return incidentCategory;
}

//To check subCategory is valid or not.
function isSubCategoryValid(isPDEnabled, category, subCategory) {
    var isValid = false;
    var subCategoryFile = "subcategory";
    var subCategoryField = "subcategory";

    if (isPDEnabled) {
        subCategoryFile = "imSubcategory";
        subCategoryField = "subcategory.name";
    }

    var incidentSubCategory = new SCFile(subCategoryFile, SCFILE_READONLY);

    incidentSubCategory.setFields(subCategoryField);

    var query = "category = \"" + category + "\"";
    query += " and " + subCategoryField + " = \"" + subCategory + "\"";
    query += " and active = \"true\"";

    var findSubCategory = incidentSubCategory.doSelect(query);

    if (findSubCategory == RC_SUCCESS) {
        isValid = true;
    }

    return isValid;
}

//To get first record from subCategory
function getDefaultSubCategory(isPDEnabled, category) {
    var subCategory = "";
    var subCategoryFile = "subcategory";
    var subCategoryField = "subcategory";

    if (isPDEnabled) {
        subCategoryFile = "imSubcategory";
        subCategoryField = "subcategory.name";
    }

    var incidentSubCategory = new SCFile(subCategoryFile, SCFILE_READONLY);

    incidentSubCategory.setFields(subCategoryField);

    var query = "category = \"" + category + "\"";
    query += " and active = \"true\"";

    var findSubCategory = incidentSubCategory.doSelect(query);

    if (findSubCategory == RC_SUCCESS) {
        var firstSubCategory = incidentSubCategory.getFirst();

        if (firstSubCategory == RC_SUCCESS) {
            subCategory = incidentSubCategory[subCategoryField];
        }
    }

    return subCategory;
}

//To get subCategory from SMIS configuration instance.
function getSubCategory(integrationInstance, isAdditionalDescNeeded) {
    var subCategory = "";

    if (integrationInstance != null) {
        subCategory = integrationInstance.getConfigParameterValue(SUBCATEGORY_KEY);
        var category = getCategory(integrationInstance, false);

        var isPDEnabled = lib.ProcessDesignerEnablement.isIncidentEnabled();

        if (!isSubCategoryValid(isPDEnabled, category, subCategory)) {
            if (isAdditionalDescNeeded) {
                additionalDescription += system.functions.scmsg(20, "CaseExchange", [subCategory]) + "\n";
            }

            //To get first row in subCategory by category
            subCategory = getDefaultSubCategory(isPDEnabled, category);
        }
    }

    return subCategory;
}

//To check subArea is valid or not.
function isSubAreaValid(isPDEnabled, category, subCategory, subArea) {
    var isValid = false;
    var subAreaFile = "producttype";
    var subAreaField = "product.type";

    if (isPDEnabled) {
        subAreaFile = "imArea";
        subAreaField = "area.name";
    }

    var incidentSubArea = new SCFile(subAreaFile, SCFILE_READONLY);

    incidentSubArea.setFields(subAreaField);

    var query = "category = \"" + category + "\"";
    query += " and subcategory = \"" + subCategory + "\"";
    query += " and " + subAreaField + " = \"" + subArea + "\"";
    query += " and active = \"true\"";

    var findSubArea = incidentSubArea.doSelect(query);

    if (findSubArea == RC_SUCCESS) {
        isValid = true;
    }

    return isValid;
}

//To Get frist record from SubArea with specific category and subCategory.
function getDefaultSubArea(isPDEnabled, category, subCategory) {
    var subArea = "";
    var subAreaFile = "producttype";
    var subAreaField = "product.type";

    if (isPDEnabled) {
        subAreaFile = "imArea";
        subAreaField = "area.name";
    }

    var incidentSubArea = new SCFile(subAreaFile, SCFILE_READONLY);
    incidentSubArea.setFields(subAreaField);

    var query = "category = \"" + category + "\"";
    query += " and subcategory = \"" + subCategory + "\"";
    query += " and active = \"true\"";

    var findSubArea = incidentSubArea.doSelect(query);

    if (findSubArea == RC_SUCCESS) {
        var firstSubArea = incidentSubArea.getFirst();

        if (firstSubArea == RC_SUCCESS) {
            subArea = incidentSubArea[subAreaField];
        }
    }

    return subArea;
}

//Get SubArea Setting from SMIS configuration instance.
function getSubArea(integrationInstance) {
    var subArea = "";

    if (integrationInstance != null) {
        subArea = integrationInstance.getConfigParameterValue(SUBAREA_KEY);
        var category = getCategory(integrationInstance, false);
        var subCategory = getSubCategory(integrationInstance, false);

        var isPDEnabled = lib.ProcessDesignerEnablement.isIncidentEnabled();

        if (!isSubAreaValid(isPDEnabled, category, subCategory, subArea)) {
            additionalDescription += system.functions.scmsg(21, "CaseExchange", [subArea]) + "\n";
            //To get first record from subArea by category and subCategory.
            subArea = getDefaultSubArea(isPDEnabled, category, subCategory);
        }
    }

    return subArea;
}

//To check whether an affected service is valid or not.
function isAffectedServiceValid(affectedService) {
    var isValid = false;

    if (lib.smis_CommonLib.isEmpty(affectedService)) {
        return isValid;
    }

    var serviceItem = new SCFile("device", SCFILE_READONLY);

    serviceItem.setFields("logical.name");

    var query = "logical.name=\"" + affectedService + "\"";
    query += " and type=\"bizservice\"";

    var findServiceItem = serviceItem.doSelect(query);

    if (findServiceItem == RC_SUCCESS) {
        isValid = true;
    }

    return isValid;
}

//To get default affected service from device table
function getDefaultAffectedService() {
    var logicalName = "";
    var serviceItem = new SCFile("device", SCFILE_READONLY);

    serviceItem.setFields("logical.name");

    var query = "type=\"bizservice\"";

    var findServiceItem = serviceItem.doSelect(query);

    if (findServiceItem == RC_SUCCESS) {
        logicalName = serviceItem.logical_name;
    }

    return logicalName;
}

//Get Affected Service from SMIS configuraton instancce.
function getAffectedService(integrationInstance) {
    var affectedService = "";

    if (integrationInstance != null) {
        affectedService = integrationInstance.getConfigParameterValue(AFFECTED_SERVICE_KEY);

        if (!isAffectedServiceValid(affectedService)) {
            additionalDescription += system.functions.scmsg(22, "CaseExchange", [affectedService]) + "\n";

            affectedService = getDefaultAffectedService();
        }
    }

    return affectedService;
}

function getTitle(integrationInstance) {
    var title = "";

    if (integrationInstance != null) {
        title = integrationInstance.getConfigParameterValue(TITLE_KEY);

        if (lib.smis_CommonLib.isEmpty(title) || lib.smis_CommonLib.trimStr(title) == "") {
            title = "Case Exchange Error";
        }

        return title;
    }
}

function getDescription(integrationInstance, taskID) {

    if (integrationInstance == null) {
        return null;
    }

    var logger = getLogger(integrationInstance);

    var description = system.functions.scmsg(23, "CaseExchange", [integrationInstance.name]) + "\n";

    var taskEntity = lib.smis_TaskManager.readTask(integrationInstance.intId, taskID);

    if (taskEntity == null || taskEntity == undefined) {
        logger.warn("Case Exchange", "Could not get task information from taks queue for task(Task ID=." + taskID + ")");
    } else {
        description += system.functions.scmsg(24, "CaseExchange", [taskEntity.internalId]) + "\n";
        description += system.functions.scmsg(25, "CaseExchange", [taskEntity.id]) + "\n";
        description += system.functions.scmsg(26, "CaseExchange", [taskEntity.responseMsg]) + "\n";
    }

    description = additionalDescription + "\n" + description;

    return description;
}

// To set realtedIncidentID for an integration instance
function setRelatedIncidentID(integrationInstance, relatedIncidentID) {
    if (integrationInstance != null) {
        integrationInstance.setConfigParameterValue(RELATED_INCIDENT_ID, relatedIncidentID);
        lib.smis_ConfigurationManager.updateParam(integrationInstance);
    }
}

// To check whether is a incidnet is opened
function isIncidentOpened(incidentID) {
    var isIncidentOpened = false;
    var incident = new SCFile("probsummary", SCFILE_READONLY);
    var fields = new Array("number", "status");

    incident.setFields(fields);

    var findIncident = incident.doSelect("number=\"" + incidentID + "\"");

    if (findIncident == RC_SUCCESS) {
        if (incident.status != "closed") {
            isIncidentOpened = true;
        }
    }

    return isIncidentOpened;
}

/**
 *   This fuction is to create incident for error handling for a connector.
 *
 *	@param {integrationInstance} - smis_InstanceConfiguration
 *   @taskID {taskID} - SMIS task ID
 *	@return incidentID
 *	@type - String
 */
function createIncidentByInstance(integrationInstance, taskID) {
    if (integrationInstance == null) {
        return null;
    }

    var logger = getLogger(integrationInstance);

    var isInstanceEnabled = isIntegrationInstanceEnabled(integrationInstance);

    if (!isInstanceEnabled) {
        // To log info in log
        logger.info("Case Exchange", "Integration Instance (ID=" + integrationInstance.intId + ") is not enabled.");

        return null;
    }

    var isActivatedIncidentCreation = isActivatedIncidentCreationforError(integrationInstance);

    if (isActivatedIncidentCreation) {
        //To clear additonal description for previous creation.
        additionalDescription = "";
        //To get related incident ID
        var relatedIncidentID = integrationInstance.getConfigParameterValue(RELATED_INCIDENT_ID);

        logger.debug("Case Exchange", "Get Related Incident ID " + relatedIncidentID + " for SMIS Instance " + integrationInstance.intId);

        //To check whether the realted incident is opened.
        if (relatedIncidentID != null && !(lib.smis_CommonLib.isEmpty(relatedIncidentID)) && lib.smis_CommonLib.trimStr(relatedIncidentID) != "") {
            var isRelatedIncidentOpened = isIncidentOpened(relatedIncidentID);

            if (isRelatedIncidentOpened) {
                logger.info("Case Exchange", "There's an incident opened for this integration instance. The inicdent number is " + relatedIncidentID + ".");
                return relatedIncidentID;
            }
        }

        //To create new incident for the error.
        var assignmentGroup = getAssignmentGroup(integrationInstance);
        var impact = getImpact(integrationInstance);
        var urgency = getUrgency(integrationInstance);
        var category = getCategory(integrationInstance, true);
        var subCategory = getSubCategory(integrationInstance, true);
        var subArea = getSubArea(integrationInstance);
        var title = getTitle(integrationInstance);
        var affectedService = getAffectedService(integrationInstance);
        var description = getDescription(integrationInstance, taskID);
        var isPDEnabled = lib.ProcessDesignerEnablement.isIncidentEnabled();

        //Valid subCategory and subArea
        if (!isSubCategoryValid(isPDEnabled, category, subCategory)) {
            subCategory = "";
        }

        if (!isSubAreaValid(isPDEnabled, category, subCategory, subArea)) {
            subArea = "";
        }

        // If impact or urgency is empty, can not create incident.
        if (lib.smis_CommonLib.isEmpty(impact) || lib.smis_CommonLib.isEmpty(urgency)) {
            logger.error("Case Exchange", "Impact or Urgency setting for error handling is empty.");
            return null;
        }

        // If assignment group is empty or affected service is empty, can not create incident.
        if (lib.smis_CommonLib.isEmpty(assignmentGroup) || lib.smis_CommonLib.isEmpty(affectedService)) {
            logger.error("Case Exchange", "Couldn't get valid Assignment Group or Affected Service for incident creation.");
            return null;
        }

        //Check subCategory and subArea are empty or not. For PD environment, they're not mandatory fields.
        if (!isPDEnabled && (lib.smis_CommonLib.isEmpty(subCategory) || lib.smis_CommonLib.isEmpty(subArea))) {
            logger.error("Case Exchange", "Couldn't get valid subCategory or subArea for incident creation.");
            return null;
        }

        var newIncident = new SCFile("probsummary");

        newIncident.initial_impact = impact;
        newIncident.severity = urgency;
        newIncident.category = category;
        newIncident.subcategory = subCategory;
        newIncident.product_type = subArea;
        newIncident.affected_item = affectedService;
        newIncident.assignment = assignmentGroup;
        newIncident.brief_description = title;
        newIncident.action[0] = description;

        var rc = newIncident.doAction("add");

        if (rc == RC_SUCCESS) {
            logger.info("Case Exchange", "Success to create incident for case exchange error. The incident number is " + newIncident.number + ".");
            //To update realted incident ID in the integration instance.
            setRelatedIncidentID(integrationInstance, newIncident.number);
            //integrationInstance.setConfigParameterValue(RELATED_INCIDENT_ID,relatedIncidentID);

            return newIncident.number;
        } else {
            logger.error("Case Exchange", "Could not create record for case exchange error. " + RCtoString(rc));
            return null;
        }
    } else {
        logger.info("Case Exchange", "Incident Creation for Integration Instance (ID=" + integrationInstance.intId + ") is not activated.");
        return null;
    }
}