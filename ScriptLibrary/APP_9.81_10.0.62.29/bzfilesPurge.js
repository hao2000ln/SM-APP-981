Array.prototype.contains = function(obj) {

    for (var i = 0; i < this.length; i++) {
        if (this[i] == obj) {
            return true;
        }
    }
    return false;
}


/*----------generate files-----------------*/
function getCustomerAllFiles() {
    var file = new SCFile("dbdict");
    var rc = file.doSelect("true");
    var list = new Array();
    var i = 0;
    while (rc == RC_SUCCESS) {

        list[i] = file.name;
        i++;

        rc = file.getNext();
    }
    //print(list.length);
    return list.sort();
}

function getUnloadScriptFileList() {
    var file = new SCFile("unload");
    var rc = file.doSelect("name=\"" + "PurgeOutofBoxData" + "\"");
    var array = new Array();
    if (rc == RC_SUCCESS) {
        for (var i = 0; i < file.record.length(); i++) {
            if (file.record[i].filename != null)
                array[i] = file.record[i].filename;
            //print(file.record[i].filename);
        }
    }
    //print(array);
    return array;
}

function generateBzFile() {


    //var a1=[1,2,3,4,5,6,8,11,12,17,271,88888]; 
    //var b1=[2,3,4,6,8,11,202,271,88,888];


    //print(a1.concat(b1).join(',').match(/\b(\d+)\b(?=.*?\b\1\b)/g));
    //print(a1.concat(b1).join(',').replace(/\b(\d+),(?=.*?\b\1\b)/g, ''));


    // a is 932 upgrade file list
    var upgradeFiles = ["AlertDef", "ApprovalDef", "ModuleStatus", "Object", "Process", "RuleSet", "RuleType", "SMISAppInfo", "SMISRegistry", "ScriptLibrary", "ScriptPackage", "SearchConfig", "States", "SystemEvents", "TodoMap", "Workflow", "WorkflowPhase", "activityactions", "activitytype", "application", "applicationfields", "auditspecs", "bdmmapping", "capability", "cascadeupd", "category", "cirelationshiptype", "cm3messages", "cm3profile", "cm3rcategory", "cm3rcatphase", "cm3tcategory", "cm3tcatphase", "cmcontrol", "company", "contractcategory", "counters", "ctenv", "currency", "datamap", "dbdict", "ddescript", "ddmRule", "devtype", "displayevent", "displayoption", "displayscreen", "environment", "erddef", "eventmap", "eventregister", "extaccess", "extactions", "format", "formatctrl", "globallists", "help", "icmenv", "info", "ioaction", "ioevents", "joindefs", "kmattachments", "kmdoctype", "kmgroup", "kmhitlisttemplate", "kmknowledgebase", "kmmapping", "kmmimetypes", "kmprofile", "kmstatus", "kmstopword", "knownerrorcat", "knownerrorphase", "language", "link", "localizationUtil", "macrodef", "menu", "msgclass", "msgtype", "notification", "number", "ocmoptions", "ocmprofile", "patcortadmin", "pmenv", "problemtype", "producttype", "querygroups", "querystored", "rcenv", "report", "reportquery", "rootcausecat", "rootcausephase", "rootcausetaskcat", "scmessage", "screlconfig", "scripts", "secArea", "secModule", "secRights", "secRole", "settings", "settingsConfig", "slacontrol", "slamodulecontrol", "slaprofile", "smenv", "soatypes", "subcategory", "subtotals", "svcCatInterface", "svcCatStatusFieldMap", "svcCatStatusMap", "systext", "triggers", "tzfile", "uimcachedimages", "uimcompdefcategories", "uimcompdefinitions", "uimpages", "unload", "validity", "wizard", "inbox", "codes", "scFolderAccess", "probcause", "extensionstate", "cidatacopy", "caldutyhours", "calholidays", "assignment", "SYSATTACHMENTS", "htmltemplates", "displaybutton", "SurveyConnector", "SurveyDefinition", "SurveyParameterMapping", "SurveyRecipientMapping", "activitySurveyDefinition", "contacts", "operator", "secRoleRights", "svcSrcConfig"];
    // b is collected by dengxin for business files
    var bzFile1 = ["cm3r", "cm3t", "contract", "payment", "contractterms", "baseline", "pcsoftware", "device", "Subscription", "probsummary", "kmdocument", "kmattachments", "knownerror", "knownerrortask", "rootcause", "rootcausetask", "ocml", "model", "ocmo", "ocmq", "svcCatalog", "svcCart", "svcCartItem", "incidents", "servicecontract", "sla", "slocatalog", "sloavail", "slo", "contacts", "dept", "vendor"];
    var bzFile2 = getUnloadScriptFileList();


    print("bzfile2:", bzFile2.length);

    var bzFile = bzFile2.concat();

    var i = bzFile1.length;
    for (var i = 0; i < bzFile1.length; i++) {
        if (!bzFile2.contains(bzFile1[i])) {
            print(bzFile1[i]);
            bzFile.push(bzFile1[i]);
        }
    }

    print("bzfile:", bzFile.length, bzFile);


    for (var i = 0; i < bzFile.length; i++) {
        print(bzFile[i]);
        if (upgradeFiles.contains(bzFile[i])) {
            print("------confilication:", bzFile[i]);
        }
    }
    return bzFile;


}

function addBzfiles() {


    var file = new SCFile("bzfiles");
    file.doSelect("true");
    file.bz_custom_files = new Array();
    file.bz_added_oob_files = new Array();
    file.bz_purge_history = new Array();
    file.doUpdate();
    /*
    	var file=new SCFile("bzfiles");
    	file.bz_name="customer";
    	file.bz_current_version="7.11.000";
    	file.bz_target_version="9.32.0016";
    	file.bz_default_files=generateBzFile();
    	file.doSave();
    */
}


function addSysfiles() {
    var file = new SCFile("sysfiles");
    file.doSelect("sys.type=\"oob\" and sys.version=\"7.11.000\"");
    file.sys_files = getAllFiles();
    file.doUpdate();
    /*
	file.sys_type="upgrade";
	file.sys_version="9.32.0016";
	
	var upgradeFiles= ["AlertDef","ApprovalDef","ModuleStatus","Object","Process","RuleSet","RuleType","SMISAppInfo","SMISRegistry","ScriptLibrary","ScriptPackage","SearchConfig","States","SystemEvents","TodoMap","Workflow","WorkflowPhase","activityactions","activitytype","application","applicationfields","auditspecs","bdmmapping","capability","cascadeupd","category","cirelationshiptype","cm3messages","cm3profile","cm3rcategory","cm3rcatphase","cm3tcategory","cm3tcatphase","cmcontrol","company","contractcategory","counters","ctenv","currency","datamap","dbdict","ddescript","ddmRule","devtype","displayevent","displayoption","displayscreen","environment","erddef","eventmap","eventregister","extaccess","extactions","format","formatctrl","globallists","help","icmenv","info","ioaction","ioevents","joindefs","kmattachments","kmdoctype","kmgroup","kmhitlisttemplate","kmknowledgebase","kmmapping","kmmimetypes","kmprofile","kmstatus","kmstopword","knownerrorcat","knownerrorphase","language","link","localizationUtil","macrodef","menu","msgclass","msgtype","notification","number","ocmoptions","ocmprofile","patcortadmin","pmenv","problemtype","producttype","querygroups","querystored","rcenv","report","reportquery","rootcausecat","rootcausephase","rootcausetaskcat","scmessage","screlconfig","scripts","secArea","secModule","secRights","secRole","settings","settingsConfig","slacontrol","slamodulecontrol","slaprofile","smenv","soatypes","subcategory","subtotals","svcCatInterface","svcCatStatusFieldMap","svcCatStatusMap","systext","triggers","tzfile","uimcachedimages","uimcompdefcategories","uimcompdefinitions","uimpages","unload","validity","wizard","inbox","codes","scFolderAccess","probcause","extensionstate","cidatacopy","caldutyhours","calholidays","assignment","SYSATTACHMENTS","htmltemplates","displaybutton","SurveyConnector","SurveyDefinition","SurveyParameterMapping","SurveyRecipientMapping","activitySurveyDefinition","contacts","operator","secRoleRights","svcSrcConfig"];
	file.sys_files=upgradeFiles;
	file.doSave();	
*/
}


/*----------get files-----------------*/


function getDiffsets(original, a1, a2) {


    var diffsets = new Array();

    for (var i = 0; i < original.length; i++) {
        if (!a1.contains(original[i]) && !a2.contains(original[i]))
            diffsets.push(original[i]);
    }
    //print(diffsets);
    return diffsets;

}

/*
function getSysOOBFilesByVersion(version){
	var file=new SCFile("sysfiles");
	var rc=file.doSelect("sys.type=\"oob\" and sys.version=\""+version+"\"");
	if(rc == RC_SUCCESS) return file.sys_files;
	else return new Array();
}
*/

// for type oob sysfiles, it is a full collection from the latest version, since the latest sm version files should contains all files in previous version.
// so we just use one full collection includes all oob files + upgrade generated files
function getSysOOBFiles() {
    return getSysfiles("oob");
}


//similar with getSysOOBFiles, use the file list of latest version 
function getSysUpgradeRequiredFiles() {
    return getSysfiles("upgradeRequired");
}

// this collection is defined by us to limit customer to select our system required files to business files
function getSysSystemFiles() {
    return getSysfiles("system");
}

// this collection is defined by us to limit customer to select our system required files to business files
function getSysDefaultBZFiles() {
    return getSysfiles("defaultBZ");
}


function getSysfiles(type) {
    var file = new SCFile("sysfiles");
    var rc = file.doSelect("sys.type=\"" + type + "\"");
    if (rc == RC_SUCCESS) return file.sys_files.toArray().sort();
    else return new Array();

}

// this collection is defined by us to limit customer to select upgrade generated files to business files.
function getSysUpgradeGeneratedFiles() {
    return getSysfiles("upgradeGenerated");
}


// purge files
function executeSQL(statement) {
    var names = new SCDatum();
    var values = new SCDatum();
    names.push("values");
    values.push([statement, "commit"]);
    try {
        system.functions.rtecall("callrad", new SCDatum(), "SQLexecute", names, values, false);
        return true;
    } catch (e) {
        return false;
    }
}

function purgeBzFiles(bzfiles) {
    var i = bzfiles.length;
    while (i--) {
        //print("purge file:",bzfiles[i]);
        if (bzfiles[i] != "operator") {
            purgeFile(bzfiles[i]);
        }
    }
}

function purgeFile(filename) {
    try {
        var file = new SCFile("dbdict");
        var rc = file.doSelect("name=\"" + filename + "\"");
        if (rc == RC_SUCCESS) {
            print("purge File:", filename);
            var tablename;
            var dbtype;
            var sql = "DELETE FROM ";
            if (filename == "SYSATTACHMENTS") {
                sql = "TRUNCATE TABLE ";
            }
            var i;
            var sql1;
            var length = file.sql_tables.length();
            for (i = 0; i < length; i++) {

                tablename = file.sql_tables[i].sql_table_name;
                if (tablename != null && tablename.toUpperCase() == "NULLTABLE") {
                    print("     skip NULLTABLE");
                    continue;
                }
                dbtype = file.sql_tables[i].sql_db_type;

                //print("table:"+tablename, "type:"+dbtype);

                sql1 = sql + tablename;
                print("    ", sql1);
                executeSQL(sql1);
            }
        }
    } catch (e) {
        print("purge file exception:", e);
    }
}


////////test/////////
//addBzfiles();
//addSysfiles();
//getSysOOBFiles("7.11.000");
//purgeBzFiles();
//getDiffsets(["a1","a2","3"],["3"],["a3"]); 
//getUnloadScriptFileList ();