
var $ = lib.c.$;

function createInstance(id, ipandport) {
	var sapSmisConf = new SCFile("SMISConfiguration");
	var RC = sapSmisConf.doSelect("intId=\"" + id + "\"");
	if (RC == RC_SUCCESS)
		sapSmisConf.doDelete();

	sapSmisConf["intId"] = id;
	sapSmisConf["description"] = ["ServiceManager integration with SAP Solution Manager"];
	sapSmisConf["EPAdapter"] = "smis_DummyAdapter";
	sapSmisConf["intervalTime"] = 5;
	sapSmisConf["loggerLevel"] = "INFO";
	sapSmisConf["maxRetryTime"] = 3;
	sapSmisConf["name"] = "SMSAP";
	sapSmisConf["runOnStartup"] = "true";
	sapSmisConf["SMAdapter"] = "smis_DummyAdapter";
	sapSmisConf["status"] = lib.smis_Constants.INSTANCE_STATUS_DISABLE();
	sapSmisConf["version"] = "1.00";
	sapSmisConf["supportRT"] = "false";
	sapSmisConf["template"] = "SMSAP";
	sapSmisConf["category"] = "UI-based";
	sapSmisConf["mgrName"] = "smis_DummyManager";

	sapSmisConf["paramInfo"] = $.createSCArray();
	sapSmisConf["paramInfo"][0] = $.createSCStructure("General", "", "baseurl", "http://"+ipandport+"/ovictex/servlet/OvHDTrigger", "false", "Character");
	sapSmisConf["paramInfo"][1] = $.createSCStructure("SolutionManager", "", "exthd1", "SolMan-IT", "false", "Character");
	sapSmisConf.doSave();
	lib.smis_ConfigurationManager.enableInstance(id);
}

//createInstance("135", "16.187.190.16:8080");
