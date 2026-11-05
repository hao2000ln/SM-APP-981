// Copy from ScriptLibrary PDCodeMigration
function prepareCategories2Migrate() {
    var sdCatSelected = [],
        imCatSelected = [],
        pmCatSelected = [],
        allCat = [];

    var category = new SCFile("category");
    var rc = category.doSelect('true');
    while (rc == RC_SUCCESS) {
        if (category.name == "problem") {
            pmCatSelected.push(category.name);
        } else if (category.name == "service catalog") {
            sdCatSelected.push(category.name);
        } else if (category.name == "incident" || category.name == "request for information"|| category.name == "request for change" || category.name == "complaint") {
            sdCatSelected.push(category.name);
            imCatSelected.push(category.name);
        } else if (!(category.name.indexOf("NEW")==0 || category.name.indexOf("OLD")==0 || category.name.indexOf("PRE")==0) && category.active) {
            sdCatSelected.push(category.name);
            imCatSelected.push(category.name);
            pmCatSelected.push(category.name);
        }
        allCat.push(category.name);
        rc = category.getNext();
    }

    vars['$sdcat2migrate.selected'] = sdCatSelected;
    vars['$imcat2migrate.selected'] = imCatSelected;
    vars['$pmcat2migrate.selected'] = pmCatSelected;
    vars['$cat2migrate'] = allCat;
}

function isPDMigrationEnabled() {
    var scVersion = lib.upgradeVersionUtil.getSCVersion();
    var pdVersion = lib.upgradeVersionUtil.getPdVersion(scVersion);
    
    if ((pdVersion == "PDCP3" && scVersion.indexOf("9.3") == 0) 
        || (pdVersion == "" && lib.upgradeVersionUtil.getVersionIndex(scVersion) < lib.upgradeVersionUtil.getVersionIndex("9.50.0025"))) {
        return true;
    }
        
    return false;
}

function isVersionToMigrate(version) {
    if (version != null 
        && ((version.indexOf("PDCP3") >= 0 && version.indexOf("9.3") == 0) || (version.indexOf("PD") < 0 && lib.upgradeVersionUtil.getVersionIndex(version) < lib.upgradeVersionUtil.getVersionIndex("9.50.0025")))) {
        return true;
    }
    
    return false;
}

function isUpgradeToPD() {
    if (vars.$G_build) {
        return lib.ProcessDesignerEnablement.isPDEnabled();
    }
    
    return true;
}

function executePdMigration(pdVersion) {
    if (!isPDMigrationEnabled())
        return;
        
    var upgradestatus = lib.upgradeUtility.getRecord("upgradestatus", "true");
    if (upgradestatus == null) 
        return;
        
    lib.upgradeLog.upgrade("Execute PD Migration.");
    lib.upgradeLog.detail("Execute PD Migration.");
    
    if (upgradestatus["option"] == "rename") {
        vars["$use.pd.solution.matching"] = upgradestatus["use.pd.solution"];
        vars["$sync.category.back"] = upgradestatus["sync.category"];
        vars["$sdcat2migrate.selected"] = upgradestatus["sdCategory.selected"];
        vars["$imcat2migrate.selected"] = upgradestatus["imCategory.selected"];
        vars["$pmcat2migrate.selected"] = upgradestatus["pmCategory.selected"];
    
        lib.upgradeLog.detail("Migrating Modules...");
        if (pdVersion == "") {
        	//migrate change before other module, since "PDCodeMigration" print report altogether 
            lib.HybridChangeMigration.migrateChangeModule();
        }
        lib.PDCodeMigration.migrateByModules();
        lib.upgradeLog.detail("Migrating Modules finished.");
        handleResult4PDMigration();
    } else if (upgradestatus["option"] == "unconditional") {
        lib.upgradeLog.detail("Migrating Incident Categories...");
        lib.PDCodeMigration.migrateIncidentCategories(true);
        lib.upgradeLog.detail("Migrating Incident Categories finished.");
    }
}

function handleResult4PDMigration() {
    var pdmpatch = new SCFile("pdmpatches");
    var rc = pdmpatch.doSelect("true");
    while (rc==RC_SUCCESS) {
        var obname=lib.upgradeHelper.getObjectNameFromTag(pdmpatch["filename"], pdmpatch["tag"]);
        var result=lib.upgradeUtility.getRecord("upgraderesults", "object.type=\""+pdmpatch["filename"]+"\" and object.name=\""+obname+"\"");
        if (result!=null) {
            result["version.reconciled"]="PD Migration: Updated";
            if (result["result"] == "Already Current") {
                result["result"] = "Upgraded";
            }
            result.doUpdate();
        } else {
            result = new SCFile("upgraderesults");
            result["object.type"] = pdmpatch["filename"];
            result["object.name"] = obname;
            result["result"] = "Added";
            result["version.reconciled"]="PD Migration: Added";
            result["query"] = lib.upgradeHelper.getTagQueryFromName(pdmpatch["filename"], pdmpatch["tag"]);
            result.doInsert();
        }
        rc=pdmpatch.getNext();
    }
}

var category_list = ["incident", "problem", "service catalog", "request for information", "request for change", "complaint"];
var classicSuffix = " classic";
var codelessSuffix = " codeless";
var category_dbdict_prefix = ["im", "sd", "pbm"];
var category_dbdict_related = ["Area", "Subcategory"];
var category_dbdict_related_name_field = ["area.name", "subcategory.name"];

function updateHybridCategory() {
    lib.upgradeLog.upgrade("Update Category for Hybrid.");
    lib.upgradeLog.detail("Update Category for Hybrid.");
    
    var ret = new SCDatum();
	var triggerStatus = funcs.sysinfo_get("trigger");
    funcs.rtecall("trigger", ret, 0);
    
    for (var i=0; i<category_dbdict_prefix.length; i++) {
        var category_dbdict = category_dbdict_prefix[i] + "Category";
        if (lib.upgradeUtility.isDbdictExist(category_dbdict)) {
            for (var j=0; j<category_list.length; j++) {
                var category = lib.upgradeUtility.getRecord(category_dbdict, "name=\"" + category_list[j] + "\"");
                var categoryCodeless = lib.upgradeUtility.getRecord(category_dbdict, "name=\"" + category_list[j] + codelessSuffix + "\"");                
                if (categoryCodeless != null) {
                    if (category != null) {
                        renameCategoryRecord(category, category_list[j] + classicSuffix);
                    }
                    
                    renameCategoryRecord(categoryCodeless, category_list[j]);
                    
                    for (var k=0; k<category_dbdict_related.length; k++) {
                        updateCategoryRelated(category_dbdict_prefix[i] + category_dbdict_related[k], category_list[j], category_list[j] + classicSuffix, category_dbdict_related_name_field[k]);
                        updateCategoryRelated(category_dbdict_prefix[i] + category_dbdict_related[k], category_list[j] + codelessSuffix, category_list[j], category_dbdict_related_name_field[k]);
                    }
                }
            }
        }
    }
    
    funcs.rtecall("trigger", ret, triggerStatus);
}

function recoverHybridCategory() {
    lib.upgradeLog.upgrade("Recover Category for Hybrid.");
    lib.upgradeLog.detail("Recover Category for Hybrid.");
    
    var UPGRADE_PREFIX = lib.upgradeConstants.NEW_PREFIX();
    var OLD_PREFIX = lib.upgradeVersionUtil.getOldPrefix();
    
    var ret = new SCDatum();
	var triggerStatus = funcs.sysinfo_get("trigger");
    funcs.rtecall("trigger", ret, 0);
    
    for (var i=0; i<category_dbdict_prefix.length; i++) {
        var category_dbdict = category_dbdict_prefix[i] + "Category";
        if (lib.upgradeUtility.isDbdictExist(category_dbdict)) {
            for (var j=0; j<category_list.length; j++) {
                var category = lib.upgradeUtility.getRecord(category_dbdict, "name=\"" + category_list[j] + "\"");
                var categoryClassic = lib.upgradeUtility.getRecord(category_dbdict, "name=\"" + category_list[j] + classicSuffix + "\"");                
                if (categoryClassic != null) {
                    if (category != null) {
                        var tag = lib.upgradeHelper.getTag(category);
                        var obname = lib.upgradeHelper.getObjectNameFromTag(category_dbdict, tag);
                        renameCategoryRecord(category, category_list[j] + codelessSuffix);
                        renameCategory(category_dbdict, UPGRADE_PREFIX + category_list[j], UPGRADE_PREFIX + category_list[j] + codelessSuffix);
                        renameCategory(category_dbdict, OLD_PREFIX + category_list[j], OLD_PREFIX + category_list[j] + codelessSuffix);
                        updateCategoryUpgradeResult(category, obname, category_dbdict);
                    }
                    
                    renameCategoryRecord(categoryClassic, category_list[j]);
                    
                    for (var k=0; k<category_dbdict_related.length; k++) {
                        updateCategoryRelated(category_dbdict_prefix[i] + category_dbdict_related[k], category_list[j], category_list[j] + codelessSuffix, category_dbdict_related_name_field[k], true);
                        updateCategoryRelated(category_dbdict_prefix[i] + category_dbdict_related[k], category_list[j] + classicSuffix, category_list[j], category_dbdict_related_name_field[k], true);
                    }
                }
            }
        }
    }
    
    funcs.rtecall("trigger", ret, triggerStatus);
}

function renameCategory(dbdict_name, fromName, toName) {
    var category = lib.upgradeUtility.getRecord(dbdict_name, "name=\""+fromName+"\"");
    if (category != null) {
        renameCategoryRecord(category, toName);
    }
}

function renameCategoryRecord(file, toName) {
    lib.upgradeLog.detail("Update "+system.functions.filename(file)+ " \""+file["name"]+ "\" to \"" + toName + "\"");
    file["name"] = toName;
    file.doUpdate();
}

function updateCategoryRelated(dbdict_name, fromCategory, toCategory, name_field, updateResult) {
    if (updateResult == null) {
        updateResult = false;
    }
    if (lib.upgradeUtility.isDbdictExist(dbdict_name)) {
        name_field = name_field == null ? "name" : name_field;
        var file = new SCFile(dbdict_name);
        var sql = "category=\"" + fromCategory + "\"";
        var rc = file.doSelect(sql);
        while (rc == RC_SUCCESS) {
            lib.upgradeLog.detail("Update "+dbdict_name+ " "+file[name_field]+ " field category from \""+fromCategory+"\" to \"" + toCategory + "\"");
            var obname = lib.upgradeHelper.getObjectNameFromTag(dbdict_name, lib.upgradeHelper.getTag(file));            
            file["category"] = toCategory;
            file.doUpdate();
            if (updateResult) {
                updateCategoryUpgradeResult(file, obname, dbdict_name);
            }
            rc = file.getNext();
        }
    }
}

function updateCategoryUpgradeResult(file, obname, filename) {
    if (file == null || obname == null) {
        return;
    }
    
    if (filename == null) {
        filename = system.functions.filename(file);
    }
    
    var sql = "object.type=\"" + filename + "\" and object.name=\"" + obname + "\"";
    var result = lib.upgradeUtility.getRecord("upgraderesults", sql);
    if (result != null) {        
        var tag = lib.upgradeHelper.getTag(file);
        var new_obname = lib.upgradeHelper.getObjectNameFromTag(filename, tag);
        var query = lib.upgradeHelper.getTagQuery(file, tag);
        result["object.name"] = new_obname;
        result["query"] = query; 
        if (result["upgobject.key"] != null) {
            result["upgobject.key"] = filename + ", " + new_obname;
        }
        
        lib.upgradeLog.detail("Update upgraderesults of " + filename + " \"" + obname + "\" to \"" + new_obname + "\"");
        
        result.doUpdate();
        
        updateCategoryUpgradeObject(filename, obname, new_obname, query);
    }
}

function updateCategoryUpgradeObject(filename, obname, new_obname, query) {
    var full_obname = filename + ", " + obname;
    var object = lib.upgradeUtility.getRecord("upgradeobjects", "object.name=\""+ full_obname +"\"");
    if (object != null) {
        lib.upgradeLog.detail("Update upgradeobjects of \"" + filename + ", " + obname + "\" to \"" + filename + ", " + new_obname + "\"");
        object["object.name"] = filename + ", " + new_obname;
        var length = system.functions.lng(object["contents"]);
        if (length > 0) {
            object["contents"][0]["name"] = new_obname;
            object["contents"][0]["query"] = query;
        }
        
        object.doUpdate();
    }
}

