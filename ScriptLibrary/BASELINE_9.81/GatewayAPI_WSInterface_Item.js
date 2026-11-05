var log = lib.GatewayAPI_Logger.log();

var select = lib.GatewayAPI_RAD._select;
var us_convert_currency = lib.GatewayAPI_RAD.us_convert_currency;
var money_format = lib.GatewayAPI_RAD.money_format;

var SVCCATALOG_FILE = lib.GatewayAPI_Constants.SVCCATALOG_FILENAME();
var select = lib.GatewayAPI_RAD._select;
var NO_RECORD_EXIT = lib.GatewayAPI_Constants.NO_RECORD_EXIT();
var NORMAL_EXIT = lib.GatewayAPI_Constants.NORMAL_EXIT();
var setExitType = lib.GatewayAPI_Util.setExitType;

function getItem() {

	//Default type is "normal"
	setExitType(NORMAL_EXIT);
	var requestFor = vars.$L_file["x.requestFor"];
	var name = vars.$L_file.name;
	var syslanguage = vars.$L_file.syslanguage;
	
	if (log.isDebug()) log.debug("svcCatalogAPI","requestFor=" + requestFor + "; name="+name);
	
	if (name == null || name == "") {
		setExitType(NO_RECORD_EXIT);
		return;
	}
	

	if (syslanguage == null || syslanguage == "") {
		syslanguage = vars.$lo_operator.syslanguage;
	}
	
	
	
	//get the target item
	var item = select(SVCCATALOG_FILE,"name=\""+name+"\" and syslanguage=\""+syslanguage+"\"");
	
	if (item == null ) {
		setExitType(NO_RECORD_EXIT);
		return;
	}
	
	
	var retItem = lib.GatewayAPI_RAD.svcCat_get_items( item, _getInteractionInstance(),requestFor,10000, true, false);
	if (retItem == undefined || retItem == null || retItem.getItems().length() == 0 ) {
		setExitType(NO_RECORD_EXIT);
		return;
	}
	
	
	var costs = retItem.getCosts();
	if (costs.length() > 0) {
		vars.$L_file["x.unitCost"] = costs[0];
	}
	
	var availableFields = _getAccessFields(SVCCATALOG_FILE, "Item");
	//populate the file
	for (var i in availableFields) {
		if (availableFields[i] != "x.requestFor" && availableFields[i] != "x.unitCost")
			vars.$L_file[availableFields[i]] = item[availableFields[i]]; 
	}

	
	if (log.isDebug()) log.debug("svcCatalogAPI","Return file is : " + vars.$L_file);
	
}



// Private methods

function _getInteractionInstance() {
/*
	var interaction = new SCFile("incidents");
	interaction["contact.name"] = vars.$lo_contanct_name;
	interaction["callback.contact"] = vars.$lo_contanct_name;
	interaction["alternate.contact"] = vars.$lo_contanct_name;
	interaction["category"] = "service catalog";
	interaction["subcategory"] = "service catalog";
	interaction["problem.type"] = "service catalog";
	interaction["product.type"] = "service catalog";

 	// TODO list
	var link = lib.GatewayAPI_RAD.se_get_record(); // TODO
	lib.GatewayAPI_RAD.us_link();//TODO for fill.contact.name
	lib.GatewayAPI_RAD.us_link();//TODO for fill.callback.name
	lib.GatewayAPI_RAD.us_link();//TODO for fill.alternate.contact
	
*/
	return null;
}


function _getAccessFields(name,objectName){
	var f = new SCFile("extaccess");
	var RC = f.doSelect("name=\""+name+"\" and object.name=\""+objectName+"\"");
	if (RC != RC_SUCCESS ) return [];
	
	return f.soafield;
}