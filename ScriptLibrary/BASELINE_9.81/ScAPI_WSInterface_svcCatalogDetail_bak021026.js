var log = lib.ScAPI_Logger.log("ScAPI_WSInterface_svcCatalogDetail");
var us_convert_currency = lib.ScAPI_RAD.us_convert_currency;
var select = lib.ScAPI_RAD._select;

var JOINSVCDISPLAY_FILENAME = lib.ScAPI_Constants.JOINSVCDISPLAY_FILENAME();
var select = lib.ScAPI_RAD._select;
var NO_RECORD_EXIT = lib.ScAPI_Constants.NO_RECORD_EXIT();
var NORMAL_EXIT = lib.ScAPI_Constants.NORMAL_EXIT();
var setExitType = lib.ScAPI_Util.setExitType;
var getOrderInfo = lib.ScAPI_WSInterface_Order_Info.getOrderInfo;
var tod = lib.ScAPI_RAD._tod;
var getDigitAfterDecimal = lib.ScAPI_Util.getDigitAfterDecimal;
var getCurrentOperator = lib.ScAPI_Util.getCurrentOperator;
var parseDateRangeValidation = lib.ScAPI_DVD_Utility.parseDateRangeValidation;

var oper ;
var defaultCurrency ;

var subItemLevelIndex;

function getItem() {
    //Default type is "normal"
    setExitType(NORMAL_EXIT);
    
    subItemLevelIndex = new Array();
    
    var itemName = vars.$L_file.name;
    var lang = vars.$L_file.syslanguage;

    var item = getCatalogEntry(itemName, lang);
    if (item == null){
        setExitType(NO_RECORD_EXIT);
        return;
    }    

    var cost = item.cost;
    var recurringCost = item.recurring_cost;
    var currency = item.currency;
    if (item.cost == null || item.cost == "") cost = 0;
    if (item.recurring_cost == null || item.recurring_cost == "") recurringCost = 0;
    
    if (item.currency == null || item.currency == "") item.currency = vars.$G_root_currency;
            
    var costTmp = cost;
    var recurringCostTmp = recurringCost;

    var options = lib.ScAPI_RAD.fix_bundle_opts_currency(item.options, item.currency, defaultCurrency, false, item["option.costs"] ).getForm();
    
    
    
    var optionCosts = _setOptionCosts(item.option_costs, item.options, item.currency);
    
    for (var i = 0; optionCosts != null && i < optionCosts.length; i++){
        vars.$L_file.option_costs[i].costadj = optionCosts[i].costadj;
        vars.$L_file.option_costs[i].label = optionCosts[i].label;
    }
    vars.$L_file.displayName = item.displayName;
    vars.$L_file.description = item.description;
    vars.$L_file.detailedDescription = item.detailedDescription;
    vars.$L_file.options = options;
    vars.$L_file.sysmodtime = item.sysmodtime;
    vars.$L_file.sysmodcount = item.sysmodcount;
    if(vars.$L_file.syslanguage == null) vars.$L_file.syslanguage = item.syslanguage;
    vars.$L_file.type = item.type;
    vars.$L_file.cost = costTmp;
    vars.$L_file.currency = item.currency;
    vars.$L_file.active = item.active;
    vars.$L_file.option_validations = parseDateRangeValidation(item.option_validations);
    vars.$L_file.restrictQuantity = item.restrictQuantity;
    vars.$L_file.recurring_cost = recurringCostTmp;
    vars.$L_file.recurring_cost_interval = item.recurring_cost_interval;
    vars.$L_file.support_item = item.support_item;
    vars.$L_file.non_cart = item.non_cart;
    vars.$L_file.infoOnly = item.infoOnly;
    
    if (item['support.item'] == true) {
        vars.$L_file.category = item.category;
        vars.$L_file.subcategory = item.subcategory;
        vars.$L_file['product.type'] = item['product.type'];
    }
    if (item.type == "bundle" ) {
        for (var i = 0; i < item.bundle.length(); i ++) {
            vars.$L_file.bundle[i].item_name = item.bundle[i].item_name;
            vars.$L_file.bundle[i].item_option = item.bundle[i].item_option;
            vars.$L_file.bundle[i].item_quantity = item.bundle[i].item_quantity;
            var costTmp = item.bundle[i].item_cost_adj;
            vars.$L_file.bundle[i].item_cost_adj = costTmp;
        }
        var list = new Array();
        _extractBundle(item, 0, null, list, null, null, lang);
        for (var i = 0; i < list.length; i++) {
            vars.$L_file.option_list[i].subItemId = list[i].subItemId;
            vars.$L_file.option_list[i].fromBundle = list[i].fromBundle;
            vars.$L_file.option_list[i].subItemType = list[i].subItemType;
            vars.$L_file.option_list[i].subItemName = list[i].subItemName;
            vars.$L_file.option_list[i].subOptionValidations = parseDateRangeValidation(list[i].subOptionValidations);
            vars.$L_file.option_list[i].subOptions = list[i].subOptions;
            if(list[i].option_costs != null){
                var optionCost = _convertToXML(list[i].option_costs);
                if (log.isDebug()) log.debug("optionCost : " + optionCost);
                vars.$L_file.option_list[i].subOptionCosts = optionCost;
            }
            if(list[i].itemOption != null){
                vars.$L_file.option_list[i].itemOption = list[i].itemOption;
            }
            vars.$L_file.option_list[i].itemQuantity = list[i].itemQuantity;
            vars.$L_file.option_list[i].itemOptionId = list[i].itemOptionId;
        }
    }


    if (log.isDebug()) log.debug("Return file is : " + vars.$L_file);

}

function getCatalogEntry(itemName, lang) {
    // Get defaultCurrency
    oper = getCurrentOperator();
    
    defaultCurrency = oper.display_currency_code || vars.$G_root_currency;
    var defaultLang = oper.syslanguage || vars.$G_my_language;

    if (itemName == null ){
        return null;
    }
 
     if (!lang) {
        lang = defaultLang;
    }
    
    var strQuery = "name=\"" + itemName + "\" and syslanguage=\"" +lang+ "\"";
    
    if (log.isDebug()) log.debug("strQuery= " + strQuery);
    
    //get the target item
    var item = select(JOINSVCDISPLAY_FILENAME, strQuery);
    
    if (lang != defaultLang && item == null) {
        //if there is no record for the target language, get the default one.
        lang = defaultLang;
        var strQueryDefault = "name=\"" + itemName + "\" and syslanguage=\"" +defaultLang+ "\"";
        item = select(JOINSVCDISPLAY_FILENAME, strQueryDefault);
    }

    // get the system language one
    if (item == null) {
        var sysLang = vars.$G_root_language;
        if (sysLang == null) {
            var sysInfo = lib.ScAPI_Util.getSystemInfo();
            if (sysInfo != null) {
                sysLang = sysInfo.syslanguage;
            }
        }
        
        // if system language equals to input language or user language, do not select again
        if (sysLang == null || sysLang == lang || sysLang == defaultLang){
            return null;
        }
        
        strQueryDefault = "name=\"" + itemName + "\" and syslanguage=\"" +sysLang+ "\""; 
        item = select(JOINSVCDISPLAY_FILENAME, strQueryDefault);
        
        if (item == null){
            return null;
        }
    }
    return item;
}


function _setOptionCosts(form,options,currency) {    
    if (form == null || form == "") {
        return null;
    }

    var formXML = new XML();    
    formXML.setContent(form);
    var strRawCost;
    var strLabel;
    var node = formXML.getFirstChildElement();
    var nextnode;
    var costObj;
    var i = 0;
    var oCosts = new Array();//item.option_costs;
    var convertedCost;
    var costTmp;
    var selectId;
    
    var checkboxList = findcheckBoxList(options);
    while (node != null) {
        if (node.getName() == "selectnode") {
            selectId = node.getAttributeValue("id");
        }
        if ( node.getName() == "option"  && node.getValue() && node.getValue() != "null") {
            costObj = new Object();
            strRawCost = node.getAttributeValue("costadj");
            if (strRawCost != undefined && strRawCost != "" && strRawCost != null)    {

                costTmp = Number(strRawCost);
                // if(_searchIsCheckbox(options, selectId)){
                if(checkboxList[selectId]==true){
                    oCosts[i] = new optionCost(costTmp, node.getParentNode().getAttributeValue("id"));
                }else{
                    idValue = selectId + "." + node.getValue();
                    oCosts[i] = new optionCost(costTmp, idValue);
                }
                
                i++
            }
        }
        
        nextnode = node.getFirstChildElement();
        if (nextnode == null) nextnode = node.getNextSiblingElement();
        
        if (nextnode == null) {    
            node = node.getParentNode();

            if (node != null)
                node = node.getNextSiblingElement();
        } else {
            node = nextnode;
        }
    }
    return oCosts;
}

function _setOptionCostsBundle(bundleInfo, currency) {    
    if (bundleInfo == null || bundleInfo == "") {
        return null;
    }

    var oCosts = new Array();//item.option_costs;
    
    for(var i = 0; i < bundleInfo.length(); i++){
        var costAdj = bundleInfo[i]['item.cost.adj'];
        oCosts[i] = new optionCost(costAdj, bundleInfo[i]['item.name']);
    }
    
    return oCosts;
}

function _extractBundle(item, id, parentBundleId, list, itemOption, itemQuantity, lang){
    var sysLang = vars.$G_root_language;
    var tempId = id;
    if (item == null){
        return tempId;
    }
    
    var levelIndex = null;
    if (subItemLevelIndex[parentBundleId] != null){
        levelIndex = "opt"+subItemLevelIndex[parentBundleId];
    }
    
    if (item.type == "item") {
        var tmp = _setBundleItem(item, id, parentBundleId, itemOption, itemQuantity, levelIndex);
        tmp.option_costs = _setOptionCosts(item.option_costs, item.options, item.currency);
        list.push(tmp);
        return tempId;
    }
    if (item.type == "bundle") {
        //_setBundleItem(item, id, parentBundleId)
        var tmp = _setBundleItem(item, id, parentBundleId, itemOption, itemQuantity, levelIndex);
        tmp.option_costs = _setOptionCostsBundle(item.bundle, item.currency);
        list.push(tmp);
        parentBundleId = tempId;
        
        for (var i = 0; i < item.bundle.length(); i++){
            var name = item.bundle[i].item_name;
            var subItem = getCatalogEntry(name, lang);
            tempId = tempId + 1;
            if (subItemLevelIndex[parentBundleId] == null) {
                subItemLevelIndex[parentBundleId] = 1;
            }else{
                subItemLevelIndex[parentBundleId]++;
            }
            tempId = _extractBundle(subItem, tempId, parentBundleId, list, item.bundle[i].item_option, item.bundle[i].item_quantity, lang);
        }
    }
    
    return tempId;
}


function optionCost(costadj, label){
    this.costadj = costadj;
    this.label= label;
}


function _setBundleItem(item, id, parentBundleId, itemOption, itemQuantity, itemOptionId){
    return new tmpItem(id, parentBundleId, item, itemOption, itemQuantity, itemOptionId);
}

function tmpItem(id, parentBundleId, item, itemOption, itemQuantity, itemOptionId){
    this.subItemId = id;
    this.fromBundle = parentBundleId;
    this.subItemType = item.type;
    this.subItemName = item.name;
    this.subOptionValidations = item.option_validations;
    if (item.currency == null || item.currency == "") item.currency = vars.$G_root_currency;
    this.subOptions = lib.ScAPI_RAD.fix_bundle_opts_currency(item.options, item.currency, defaultCurrency, false, item["option.costs"] ).getForm();
    this.option_costs = null;
    this.itemOption = itemOption;
    this.itemQuantity = itemQuantity;
    this.itemOptionId = itemOptionId;
}

function _convertToXML(optionCosts){
    if ( optionCosts == null ){
        return null;
    }
    var xml = new XML();
    xml.setContent("<option.costs/>");
    if ( optionCosts.length > 0 ){
        var node = xml.createNode(1,"option.costs");
        var subNodeCost = node.createNode(1, "OptionCost");
        subNodeCost.setValue(optionCosts[0].costadj);
        var subNodeLabel = node.createNode(1, "OptionLabel");
        subNodeLabel.setValue(optionCosts[0].label);
        node.appendNode(subNodeCost);
        node.appendNode(subNodeLabel);
        xml.appendNode(node);
    }
    for ( var i = 1; i < optionCosts.length; i++ ){
        var node = xml.createNode(1,"option.costs");
        var subNodeCost = node.createNode(1, "OptionCost");
        subNodeCost.setValue(optionCosts[i].costadj);
        var subNodeLabel = node.createNode(1, "OptionLabel");
        subNodeLabel.setValue(optionCosts[i].label);
        node.appendNode(subNodeCost);
        node.appendNode(subNodeLabel);
        xml.appendNode(node);
    }
    return xml.toXMLString();
}

function _searchNodeByValue(xmlString, parentId, value){
    var xml = new XML();
    xml.setContent(xmlString);
    
    var node = xml.getFirstChildElement();
    var nextnode;
    
    while(node != null){
        if ((node.getName() == 'select') && node.getAttributeValue('id') == parentId){
            var result = _searchSubnodeByValue(node, value);
            if (result != null) return result;
        }
        
        nextnode = node.getFirstChildElement();
        
        if (nextnode == null) {
            nextnode = node.getNextSiblingElement();
        }
        
        if (nextnode == null) {    
            node = node.getParentNode();
            if (node != null)
                node = node.getNextSiblingElement();
        } else {
            node = nextnode;
        }
    }
    return null;
}

function _searchSubnodeByValue(xml, value){
    var node = xml.getFirstChildElement();
    var nextnode;
    
    while(node != null){
        if (node.getValue() == value && node.getName() == "option"){
            var parentNode = node.getParentNode();
            var style = parentNode.getAttributeValue("style");
            if (style == "radio" || style == "combo"){
                return parentNode.getAttributeValue("id") + "." + node.getValue();
            }
        }
        
        nextnode = node.getFirstChildElement();
        
        if (nextnode == null) {
            nextnode = node.getNextSiblingElement();
        }
        
        if (nextnode == null) {    
            node = node.getParentNode();
            if (node != null)
                node = node.getNextSiblingElement();
        } else {
            node = nextnode;
        }
    }
    return null;
}

function _searchIsCheckbox(xmlString, selectnodeId){
    var xml = new XML();
    xml.setContent(xmlString);
    
    var node = xml.getFirstChildElement();
    var nextnode;
    
    while(node != null){
        if (node.getAttributeValue("id") == selectnodeId && node.getName() == "checkbox"){
            return true;
        }
        
        nextnode = node.getFirstChildElement();
        
        if (nextnode == null) {
            nextnode = node.getNextSiblingElement();
        }
        
        if (nextnode == null) {    
            node = node.getParentNode();
            if (node != null)
                node = node.getNextSiblingElement();
        } else {
            node = nextnode;
        }
    }
    return false;
}

function _extractSupportTriplet(interfaceInfo){
    var xml = new XML();
    xml.setContent(interfaceInfo);
    var node = xml.getFirstChildElement();
    
    var category;
    var subCategory;
    var productType; 
    
    while (node != null) {
        if (node.getName() == "category") {
            category = node.getValue();
        } else if (node.getName() == "subcategory") {
            subCategory = node.getValue();
        } else if (node.getName() == "producttype") {
            productType = node.getValue();
        }
        node = node.getNextSiblingElement();
    }
    return new triplet(category, subCategory, productType);
}

function triplet(category, subCategory, productType){
    this.category = category;
    this.subCategory = subCategory;
    this.productType = productType;
}

function getItemOrderInfo(){
    //Default type is "normal"
    setExitType(NORMAL_EXIT);

    oper = getCurrentOperator();
    
    var itemName = vars.$L_file.name;
    var lang = vars.$L_file.syslanguage;
    var defaultLang = oper.syslanguage || vars.$G_my_language;
    
    if (log.isDebug()) log.debug("itemName=" + itemName + "; language="+ lang);
    
    if (itemName == null ){
        setExitType(NO_RECORD_EXIT);
        return;
    }
    
    if (!lang) {
        lang = defaultLang;
    }
    
    var strQuery = "name=\"" + itemName + "\" and syslanguage=\"" +lang+ "\"";
    
    if (log.isDebug()) log.debug("strQuery= " + strQuery);

    
    //get the target item
    var item = select(JOINSVCDISPLAY_FILENAME, strQuery);
    
    if (lang != defaultLang && item == null) {
        //if there is no record for the target language, get the default one.
        lang = defaultLang;
        var strQueryDefault = "name=\"" + itemName + "\" and syslanguage=\"" +defaultLang+ "\"";
        item = select(JOINSVCDISPLAY_FILENAME, strQueryDefault);
        
    }
    
    // get the system language one
    if (item == null) {
        var sysLang = vars.$G_root_language;
        if (sysLang == null) {
            var sysInfo = lib.ScAPI_Util.getSystemInfo();
            if (sysInfo != null) {
                sysLang = sysInfo.syslanguage;
            }
        }
        
        // if system language equals to input language or user language, do not select again
        if (sysLang == null || sysLang == lang || sysLang == defaultLang){
            setExitType(NO_RECORD_EXIT);
            return;
        }
        
        strQueryDefault = "name=\"" + itemName + "\" and syslanguage=\"" +sysLang+ "\""; 
        item = select(JOINSVCDISPLAY_FILENAME, strQueryDefault);
        
        if (item == null){
            setExitType(NO_RECORD_EXIT);
            return;
        }
    }
    
    var orderInfo = getOrderInfo(item, lang);
    vars.$L_file.orderInfo = orderInfo;
}


function findcheckBoxList(options) {
    var ret = {};
    
    var xml = new XML();
    xml.setContent(options);
    var node = xml.getFirstChildElement();
    var nextnode;
    
    while(node != null){
        if (node.getName() == "checkbox"){            
            ret[node.getAttributeValue("id")] = true;
        }
        
        nextnode = node.getFirstChildElement();
        
        if (nextnode == null) {
            nextnode = node.getNextSiblingElement();
        }
        
        if (nextnode == null) {    
            node = node.getParentNode();
            if (node != null)
                node = node.getNextSiblingElement();
        } else {
            node = nextnode;
        }
    }
    
    return ret;
}