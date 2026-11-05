var log = lib.ScAPI_Logger.log("ScAPI_WSInterface_svcCatalogFavorite");

var SVCCATALOG_FILE = lib.ScAPI_Constants.JOINSVCDISPLAY_FILENAME();
var select = lib.ScAPI_RAD._select;
var NO_RECORD_EXIT = lib.ScAPI_Constants.NO_RECORD_EXIT();
var NORMAL_EXIT = lib.ScAPI_Constants.NORMAL_EXIT();
var setExitType = lib.ScAPI_Util.setExitType;
var svcCat_get_items_for_wsapi = lib.ScAPI_RAD.svcCat_get_items_for_wsapi;
var currentOperator = vars['$lo.operator'];
var defaultLang = currentOperator.syslanguage || vars.$G_my_language;
var svcCat_get_catalog_favorite = lib.ScAPI_RAD.svcCat_get_catalog_favorite;

function getItem() {

	//Default type is "normal"
	setExitType(NORMAL_EXIT);
	
	//added by Zhi-Qiang
	var contactName = vars['$L.file']['contact.name'];
	
	if (contactName == null || contactName == "") {
		contactName = currentOperator['contact.name'];
	}
	var operator = currentOperator;
	if (contactName != currentOperator['contact.name']){
		operator = select('operator', 'contact.name="' + contactName + '"');
		if(operator == null) {
			setExitType(NO_RECORD_EXIT);
			return;
		}
	}
	
	var lang = vars.$L_file.language;
	if (lang == null) {
		lang = defaultLang;
	}
	
	var count = vars.$L_file._count;
	if (count == null || count <= 0) {
		count = 5;
	}
	if (log.isDebug()) log.debug("contactName=" + contactName + "; language="+lang);	//added by Zhi-Qiang
	var itemList = svcCat_get_catalog_favorite(operator, count);
	if (itemList == null) {
		setExitType(NO_RECORD_EXIT);
		vars.$L_file._count = 0;
		return;
	}
	for (var i = 0; i < itemList.length(); i++)	{
		vars.$L_file.catalog[i].itemName = itemList[i];
	}
	
	vars.$L_file._count = i;
	if (log.isDebug()) log.debug("Return file is : " + vars.$L_file);

}

function getFavorites(query, resultCount){
	var resultList = new Array();
	var orderByFields = ['count'];
	var orderBySeq = [SCFILE_DSC];
	var fields = ['item.name', 'count'];
	var itemCount = select("svcItemCount", query, fields, orderByFields, orderBySeq);
	
	if (itemCount != null) {
		var itemList = new Array();
		var result = RC_SUCCESS;
		var i = 0;
		do {
			var svcCat = lib.c.$("svcCatalog").select("name=\""+itemCount['item.name']+"\" and active=true").uniqueResult();			
			if (svcCat)
				resultList.push(itemCount['item.name']);
			result = itemCount.getNext();
			i++;
			if (i == resultCount - 1) {
				break;
			}
		} while (result == RC_SUCCESS)
	}
	return resultList;
}

//RAD: svcCat.get.favorites

function _compare(itemCount1,itemCount2) {
    return itemCount2._count - itemCount1._count;
}

function _getTranslatedItem(itemName,language) {
	var transItem = select(SVCCATALOG_FILE,"name = \""+itemName+"\" and syslanguage=\""+language+"\"");
	return transItem;
}

function _getOperator(operatorName) {
	var operator = select("operator", "name=\"" + operatorName + "\"");
	return operator;
}

//parameter requestFor is login name in operator
function _getInteractionInstance(requestFor) {
	
	
	var interaction = new SCFile("incidents");
	interaction["contact.name"] = requestFor;//vars.$lo_contact_name;
	interaction["callback.contact"] = requestFor;//vars.$lo_contact_name;
	interaction["alternate.contact"] = requestFor;//vars.$lo_contact_name;
	interaction["category"] = "service catalog";
	interaction["subcategory"] = "service catalog";
	interaction["problem.type"] = "service catalog";
	interaction["product.type"] = "service catalog";

	var link = lib.ScAPI_RAD.se_get_record("incidents", "name", "link", true); // TODO

	lib.ScAPI_RAD.us_link(interaction,"contact.name",link,"fill",true);//TODO for fill.contact.name
	lib.ScAPI_RAD.us_link(interaction,"callback.contact",link,"fill",true);//TODO for fill.callback.name
	lib.ScAPI_RAD.us_link(interaction,"alternate.contact",link,"fill",true);//TODO for fill.alternate.contact


	return interaction;
}
