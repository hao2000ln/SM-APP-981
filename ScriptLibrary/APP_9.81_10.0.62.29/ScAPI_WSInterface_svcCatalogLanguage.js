var log = lib.ScAPI_Logger.log("ScAPI_WSInterface_svcCatalogGather");

var JOINSVCCATALOG_FILE = lib.ScAPI_Constants.JOINSVCDISPLAY_FILENAME();
var SVCCATALOG_FILE = lib.ScAPI_Constants.SVCCATALOG_FILENAME();
var select = lib.ScAPI_RAD._select;
var count = lib.ScAPI_RAD._count;
var NO_RECORD_EXIT = lib.ScAPI_Constants.NO_RECORD_EXIT();
var NORMAL_EXIT = lib.ScAPI_Constants.NORMAL_EXIT();
var setExitType = lib.ScAPI_Util.setExitType;
var getAccessFields = lib.ScAPI_Util.getAccessFields;
var us_convert_currency = lib.ScAPI_RAD.us_convert_currency;
var money_format = lib.ScAPI_RAD.money_format;
var tod = lib.ScAPI_RAD._tod;
var svcCat_get_items_for_wsapi = lib.ScAPI_RAD.svcCat_get_items_for_wsapi;
var getCurrentOperator = lib.ScAPI_Util.getCurrentOperator;
var svcCat_filter_catalog = lib.ScAPI_RAD.svcCat_filter_catalog;
var max_return_count = 10000;

function getItem() {

	//Default type is "normal"
	setExitType(NORMAL_EXIT);
	var lang = vars.$L_file.language;
	var strQuery = null;
	var queryDisplay = null; //query statement only for svcDisplay table
	if (lang != null){
		strQuery = "syslanguage=\"" + lang + "\" and id ~= NULL";
		queryDisplay = "syslanguage=\"" + lang + "\"";
	}else{
		strQuery = 'syslanguage like "*" and id ~= NULL'; // return all the catalog items, even the ones in the default language.   //"syslanguage~=\"" + lang + "\"";
		queryDisplay = 'syslanguage like "*" ';
	}
	
	var inStringQuery = vars.$L_file['in.name.string'] == null ? "" : " and name isin {" + vars.$L_file['in.name.string'] +"}";

	if (log.isDebug()) log.debug("strQuery=" + strQuery);
	var showDetail = vars.$L_file.showDetail == null ? true : vars.$L_file.showDetail;
	var returnCount = vars.$L_file.returnCount;
	if (returnCount == null || returnCount > max_return_count){
		returnCount = max_return_count;
	}
	
	//get the target item
	var allItems = null;
	if(showDetail){
	    var fields = ['file.svcCatalog,id', 'file.svcCatalog,non.cart', 'file.svcCatalog,support.item','file.svcCatalog,cost', 'file.svcCatalog,currency',
	                  'file.svcCatalog,description', 'file.svcCatalog,detailedDescription',
	                  'file.svcCatalog,name','file.svcCatalog,type','file.svcCatalog,parent','file.svcCatalog,recurring.cost',
	                  'file.svcCatalog,recurring.cost.interval','file.svcDisplay,name','file.svcDisplay,displayName',
	                  'file.svcDisplay,syslanguage','file.svcDisplay,description', 'file.svcDisplay,detailedDescription', 'file.svcCatalog,infoOnly','active'];
		allItems = select(JOINSVCCATALOG_FILE,strQuery + inStringQuery, fields);
	} else {
	
		var idQuery = '';
		var minName = vars['$L_file']['minName'];
		if (minName != null) {
			idQuery = ' and name>"' + minName + '"';
		}
		
		var orderByFields = ['name'];
		var orderBySeq = [SCFILE_ASC];
		if(lang != null){
		    var fields = ['name'];
		    vars['$L.file']._count = count('svcDisplay', queryDisplay);
			allItems = select('svcDisplay',queryDisplay + idQuery + inStringQuery,fields, orderByFields, orderBySeq);
		} else {
			vars['$L.file']._count = count(SVCCATALOG_FILE, "id>0");
		    var fields = ['name'];
			allItems = select(SVCCATALOG_FILE,"true" + idQuery + inStringQuery,fields, orderByFields, orderBySeq);
		}
	}
	
	if (allItems == null ) {
		setExitType(NO_RECORD_EXIT);
		return;
	}
	
	var result = RC_SUCCESS;
	var i = 0;
	if (returnCount > 0){
		do{
			if(showDetail){
				vars.$L_file.catalog[i].catalogid = allItems.id; //id must be set first. Otherwise, it will cause an exception
				vars.$L_file.catalog[i].displayName = allItems.displayName;
				vars.$L_file.catalog[i].description = allItems.description;
				vars.$L_file.catalog[i].detailedDescription = allItems.detailedDescription;
				vars.$L_file.catalog[i].lang = allItems.syslanguage;
				vars.$L_file.catalog[i].cost = allItems.cost;
				vars.$L_file.catalog[i].currency = allItems.currency;
				vars.$L_file.catalog[i].recuringcost = allItems.recurring_cost;
				vars.$L_file.catalog[i].recurringCostInterval = allItems.recurring_cost_interval;
				vars.$L_file.catalog[i].non_cart = allItems.non_cart;
				vars.$L_file.catalog[i].support_item = allItems.support_item;
				vars.$L_file.catalog[i].infoOnly = allItems.infoOnly;
				vars.$L_file.catalog[i].type = allItems.type;
				vars.$L_file.catalog[i].active = allItems.active;
				var parentlist = allItems.parent;
				for ( var j = 0; j < parentlist.length(); j++){
					if(parentlist[j] != null){
				   		vars.$L_file.catalog[i].parent = parentlist[j];
				   		break;
					}
				}
			}
			vars.$L_file.catalog[i].name = allItems.name;
			i++;
			result = allItems.getNext();
		}while(result == RC_SUCCESS && i < returnCount)
	}
	
	if(i > 0){
		var versionid = lib.ScAPI_svcCatalog_DiffSync.getNextVersion();
		vars.$L_file.versionid = versionid.toString(); 
	}
	
	vars.$L_file['baseCurrency'] = vars.$G_root_currency;
	
	if (log.isDebug()) log.debug("return file=" + vars.$L_file);

}

function getItemIds(query)
{
    var file = select("svcCatalog", query, ["id"]);
    var ids = new Array();
    if (file != null)
    {
        do
        {
            ids.push(file.id);
        } while (file.getNext() == RC_SUCCESS);
    }
    
    return ids;
}

function filterItem() {
    setExitType(NORMAL_EXIT);

    var inIdStr = vars['$L.file']['in.id.string'];
    var contactName = vars['$L.file']['contact.name'];
    if (vars['$lo.operator'] == null)
    {
        vars['$lo.operator'] = new SCFile("operator");
        vars['$lo.operator'].doSelect("name=\"" + system.functions.operator() + "\"");
    }
    
    var radResult = svcCat_filter_catalog(inIdStr, contactName);
    vars['$L.file']['in.id.string'] = null;
    vars['$L.file']['out.id.string']    = radResult.prompt;
    vars['$L.file']['contact.name'] = radResult.text;
}