var log = lib.ScAPI_Logger.log();
var GET_TOP_CATEGORY_QUERY = lib.ScAPI_Constants.GET_TOP_CATEGORY_QUERY();
var SVCCATALOG_FILE = lib.ScAPI_Constants.SVCCATALOG_FILENAME();
var select = lib.ScAPI_RAD._select;
var NO_RECORD_EXIT = lib.ScAPI_Constants.NO_RECORD_EXIT();
var NORMAL_EXIT = lib.ScAPI_Constants.NORMAL_EXIT();
var setExitType = lib.ScAPI_Util.setExitType;

//Public methods
function getCatalogList()
{
	//the normal exit is the default action.
	setExitType(NORMAL_EXIT);
	var category = vars.$L_file.parentCategory;
	var requestedFor = vars.$L_file.requestFor;
	var catalogList = _getList(category,requestedFor);
	
}



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
	var link = lib.ScAPI_RAD.se_get_record(); // TODO
	lib.ScAPI_RAD.us_link();//TODO for fill.contact.name
	lib.ScAPI_RAD.us_link();//TODO for fill.callback.name
	lib.ScAPI_RAD.us_link();//TODO for fill.alternate.contact
	
*/	
	return null;
}



function _getList(category,requestedFor){

	var query = null;	
	if (category == undefined || category == null || category == "") {
		query = GET_TOP_CATEGORY_QUERY;
	} else {
		query = "active=true  and parent=\""+category+"\"";
	}
	
	if (log.isDebug()) log.debug("svcCatalogAPI","query string is <"+query+">");	
	var catalogFile = select(SVCCATALOG_FILE,query);
	if (log.isDebug()) log.debug("svcCatalogAPI",catalogFile);

	if (catalogFile == null) {
		setExitType(NO_RECORD_EXIT);
		return;	
	}
	
	var rstObj = lib.ScAPI_RAD.svcCat_get_items( catalogFile, _getInteractionInstance(),requestedFor,10000, true, false);	
	var itemNames =  rstObj.getItems();
	var displayNames = rstObj.getItemsDisplay();
    var descriptions = rstObj.getDesc();
    var costs = rstObj.getCosts();
	var total = rstObj.getTotal();
	var types = rstObj.getTypes();
	
	
	if (itemNames.length() <= 0) {
		setExitType(NO_RECORD_EXIT);
		return;	
	}
	
    for (var i = 0; i < itemNames.length(); i++) {
        vars.$L_file.catalogList[i].name = itemNames[i];
        vars.$L_file.catalogList[i].displayName = displayNames[i];
        if (descriptions != null && i <= descriptions.length())
            vars.$L_file.catalogList[i].desc = descriptions[i];

        if (costs!= null && i <= costs.length() && costs[i] != null)
           vars.$L_file.catalogList[i].cost = costs[i];
           
        vars.$L_file.catalogList[i].type = _converType(types[i]);
    
    }

    if (total != 0)  vars.$L_file.totalItems = total;

	if (log.isDebug()) log.debug("svcCatalogAPI","Return file is : " + vars.$L_file);
}

function _converType(typeVar) {
	
	var type = null;
	if (typeVar == undefined || typeVar == null ) return null;
	var typeNum = parseInt(typeVar);
	
	switch (typeNum) {
		case 0:
			type = "category";
			break;
		case 1:
			type = "item";
			break;
		case 2:
			type = "bundle";
			break;
		default:
			type = null;
			
	}
    return type;
}


