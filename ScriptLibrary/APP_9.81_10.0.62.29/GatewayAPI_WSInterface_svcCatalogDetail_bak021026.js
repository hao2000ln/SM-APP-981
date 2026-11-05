var log = lib.GatewayAPI_Logger.log("GatewayAPI_WSInterface_svcCatalogDetail");
var us_convert_currency = lib.GatewayAPI_RAD.us_convert_currency;
var select = lib.GatewayAPI_RAD._select;

var JOINSVCDISPLAY_FILENAME = lib.GatewayAPI_Constants.JOINSVCDISPLAY_FILENAME();
var select = lib.GatewayAPI_RAD._select;
var NO_RECORD_EXIT = lib.GatewayAPI_Constants.NO_RECORD_EXIT();
var NORMAL_EXIT = lib.GatewayAPI_Constants.NORMAL_EXIT();
var setExitType = lib.GatewayAPI_Util.setExitType;
var setErrorMsg = lib.GatewayAPI_Util.setErrorMsg;
var getOrderInfo = lib.GatewayAPI_WSInterface_Order_Info.getOrderInfo;
var tod = lib.GatewayAPI_RAD._tod;
var getDigitAfterDecimal = lib.GatewayAPI_Util.getDigitAfterDecimal;
var getCurrentOperator = lib.GatewayAPI_Util.getCurrentOperator;
var parseDateRangeValidation = lib.GatewayAPI_DVD_Utility.parseDateRangeValidation;
var buildArrayStringQuery=lib.GatewayAPI_Util.buildArrayStringQuery;
var BAD_VALIDATION_EXIT = lib.GatewayAPI_Constants.BAD_VALIDATION_EXIT();
var NO_AUTH_EXIT= lib.GatewayAPI_Constants.NO_AUTH()
var convert_currency=lib.GatewayAPI_svcCatApprovals.convert_currency;

var oper ;
var defaultCurrency ;
var defaultLang;
var newOper;

var subItemLevelIndex;

function getItem(arg) {
    //Default type is "normal"
    setExitType(NORMAL_EXIT);
    
    subItemLevelIndex = new Array();
    
    var itemName = vars.$L_file.name;
    var catalogId= vars.$L_file.svcCatalogId;
    var lang = vars.$L_file.syslanguage;
    oper = getCurrentOperator();
    var oriOperator=oper.name;
    defaultCurrency = oper.display_currency_code || vars.$G_root_currency;
   // defaultLang = oper.syslanguage || vars.$G_my_language;
    defaultLang="en";
    if (!lang) {
        lang = defaultLang;
    }
    
    if (vars.$L_file.operator !=null) {
       var requestOnBehalf=vars.$L_file.operator;
       if (oriOperator!=requestOnBehalf)
        lib.GatewayAPI_Util.changeUserSession(requestOnBehalf);
    } 
    
    newOper=getCurrentOperator().name;
    var item;
    if (arg){
        item=getCatalogEntryNoAuth(itemName,lang,catalogId);
    } else {
        item=getCatalogEntry(itemName,lang,catalogId);
    }
    if (item == null){
        setExitType(NO_RECORD_EXIT);
        setErrorMsg(lib.GatewayAPI_Util.getMessage(300)); 
        vars.$L_file=null;
        if (newOper!=oriOperator) lib.GatewayAPI_Util.changeUserSession(oriOperator);
        return;
    } 
    var cost = item.cost;
    var recurringCost = item.recurring_cost;
    
    if (item.cost == null || item.cost == "") cost = 0;
    if (item.recurring_cost == null || item.recurring_cost == "") recurringCost = 0;
    
    if (item.currency == null || item.currency == "") item.currency = vars.$G_root_currency;
    var currency = item.currency;
            
    var costTmp = convert_currency(currency, cost);
    var recurringCostTmp = convert_currency(currency, recurringCost);
    var displaybundleoptions=vars.$L_file.options;
    if (vars.$L_file.options && vars.$L_file.options=='true'){
        //print("defaultCurrencty"+defaultCurrency);
        var options = lib.GatewayAPI_RAD.fix_bundle_opts_currency(item.options, currency, defaultCurrency, false, item["option.costs"] ).getForm();
        var optionCosts = _setOptionCosts(item.option_costs, item.options, currency);
        for (var i = 0; optionCosts != null && i < optionCosts.length; i++){
            vars.$L_file.option_costs[i].costadj = optionCosts[i].optionCost;
            vars.$L_file.option_costs[i].label = optionCosts[i].optionLabel;
        }
       vars.$L_file.option_validations = parseDateRangeValidation(item.option_validations);
    } else
    vars.$L_file.options = null;

    
    vars.$L_file.displayName = item.displayName;
    vars.$L_file.description = item.description;
    vars.$L_file.detailedDescription = item.detailedDescription;
    var fields = getDateTypeFieldsFromValidations(item.option_validations);
    vars.$L_file.options = convertDefaultValueInDateTypeUserOptions(options, fields);
    vars.$L_file.option_mappings= item.option_mappings;
    vars.$L_file.sysmodtime = item.sysmodtime;
    vars.$L_file.sysmodcount = item.sysmodcount;
    //if(vars.$L_file.syslanguage == null) vars.$L_file.syslanguage = item.syslanguage;
    vars.$L_file.syslanguage = item.syslanguage;
    vars.$L_file.type = item.type;
    vars.$L_file.cost = costTmp;
    vars.$L_file.currency = defaultCurrency;
    vars.$L_file.active = item.active;
    //vars.$L_file.option_validations = parseDateRangeValidation(item.option_validations);
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
    var includeDeptOnlyItem = false;
    if (item.type == "bundle" ) {
        for (var i = 0; i < item.bundle.length(); i ++) {
            vars.$L_file.bundle[i].item_name = item.bundle[i].item_name;
            vars.$L_file.bundle[i].item_option = item.bundle[i].item_option;
            vars.$L_file.bundle[i].item_quantity = item.bundle[i].item_quantity;
            var costTmp = item.bundle[i].item_cost_adj;
            vars.$L_file.bundle[i].item_cost_adj = convert_currency(currency, costTmp);
        }
        var list = new Array();
        var DeptOnlyList = [];
        _extractBundle(item, 0, null, list, null, null, lang, DeptOnlyList);
       if(displaybundleoptions=='true'){
        for (var i = 0; i < list.length; i++) {
            vars.$L_file.option_list[i].subItemId = list[i].subItemId;
            vars.$L_file.option_list[i].fromBundle = list[i].fromBundle;
            vars.$L_file.option_list[i].subItemType = list[i].subItemType;
            vars.$L_file.option_list[i].subItemName = list[i].subItemName;
            vars.$L_file.option_list[i].subItemDisplayName = list[i].subItemDisplayName;
            vars.$L_file.option_list[i].subItemCurrency = defaultCurrency;
            var subOptionValidations = list[i].subOptionValidations;
            var subOptions = list[i].subOptions;
            var subOptionMappings = list[i].subOptionMappings;
            vars.$L_file.option_list[i].subOptionValidations = subOptionValidations;
            var fields = getDateTypeFieldsFromValidations(subOptionValidations);
            vars.$L_file.option_list[i].subOptions = convertDefaultValueInDateTypeUserOptions(subOptions, fields);
            vars.$L_file.option_list[i].subOptionMappings = subOptionMappings;
            if(list[i].option_costs != null){
                //var optionCost = _convertToXML(list[i].option_costs);
                var optionCost = list[i].option_costs;
                if (log.isDebug()) log.debug("optionCost : " + optionCost);
                vars.$L_file.option_list[i].subOptionCosts = rteJSONStringify(optionCost);
            }
            if(list[i].itemOption != null){
                vars.$L_file.option_list[i].itemOption = list[i].itemOption;
            }
            vars.$L_file.option_list[i].itemQuantity = list[i].itemQuantity;
            vars.$L_file.option_list[i].itemOptionId = list[i].itemOptionId;
        }
       }
      for (var k = 0; k < DeptOnlyList.length; k++)
      {
         if(DeptOnlyList[k])
         {
           includeDeptOnlyItem = true;
           break;
         }
      }
    }
    else if(item.subscribeDept && item.createSubscription && !item.support_item && !item.subscribeIndividual)
    {
      includeDeptOnlyItem = true;
    }

    if (log.isDebug()) log.debug("Return file is : " + vars.$L_file);
    if(includeDeptOnlyItem) vars.$L_file.includeDeptOnlyItem=includeDeptOnlyItem;
  
    if (itemName==null) {
    itemName=item.name;
    vars.$L_file.name=item.name;
    }
    
    var imageId=getImageId(itemName);
    vars.$L_file.imageId=imageId;
    
    log.debug("vars.$L_file.orderInfo : " + vars.$L_file.orderInfo);
    if(vars.$L_file.orderInfo && vars.$L_file.orderInfo =='true') vars.$L_file.orderInfo=getOrderInfo(item,lang); else vars.$L_file.orderInfo = null;
    log.debug("vars.$L_file.orderInfo : " + vars.$L_file.orderInfo);
    

    
    if (newOper!=oriOperator) lib.GatewayAPI_Util.changeUserSession(oriOperator);
}

function getCatalogEntry(itemName,lang,catalogId) {
    // Get defaultCurrency
    //oper = getCurrentOperator();
    //defaultCurrency = oper.display_currency_code || vars.$G_root_currency;
    //var defaultLang = oper.syslanguage || vars.$G_my_language;
    var initsql;
    if (itemName !=null){
       initsql="name=\"" + itemName+"\"";
    } 
    else if (catalogId!=null)
    {
         initsql="id=" + catalogId;
    } else 
    { 
      return null;
    }
    
    
   
    var  capability = lib.GatewayAPI_Cache.getCapabilityWordCache().get(newOper)||[];
    log.debug("capability"+capability);
   
    var filter = "active=true  and "+ "("+buildArrayStringQuery(capability,'access.list')+" or null(access.list))";
                
    //var strQuery = "name=\"" + itemName + "\" and syslanguage=\"" +lang+ "\"";
    var strQuery =initsql+" and syslanguage=\"" +lang+ "\" and " +filter+"\"";
    
    if (log.isDebug()) log.debug("strQuery= " + strQuery);
  
    
    //get the target item
    var item = select(JOINSVCDISPLAY_FILENAME, strQuery);
    
    if (lang != defaultLang && item == null) {
        //if there is no record for the target language, get the default one.
        lang = defaultLang;
        var strQueryDefault = initsql+" and syslanguage=\"" +defaultLang+ "\" and " +filter+"\"";
        item = select(JOINSVCDISPLAY_FILENAME, strQueryDefault);
    }
    
    if (item == null){
            return null;
     }

    // get the system language one
   /* if (item == null) {
     var sysLang = vars.$G_root_language;
        if (sysLang == null) {
            var sysInfo = lib.GatewayAPI_Util.getSystemInfo();
            if (sysInfo != null) {
                sysLang = sysInfo.syslanguage;
            }
        }
        
        // if system language equals to input language or user language, do not select again
        if (sysLang == null || sysLang == lang || sysLang == defaultLang){
            return null;
        }
        
         //set lang as en
        var sysLang='en';
        strQueryDefault = initsql+" and syslanguage=\"" +sysLang+ "\" and " +filter+"\""; 
        item = select(JOINSVCDISPLAY_FILENAME, strQueryDefault);
        print("strQuery3= " +strQueryDefault);
        if (item == null){
            return null;
        }
    }*/
    
     var canaccess = true;
      if (item.access_filter && item.access_filter.toString() != '' && item.access_filter.toString() != 'true')
      {  
         if(item.access_filter.toString().indexOf("$L.file")!==-1){
             canaccess=true;
         }
         else{
             canaccess = funcs.evaluate(funcs.parse(item.access_filter.toString(), 2));
         }
      } 
    
      
     if(canaccess==false)
      { 
        return null;
        }
      
    item["sysmodtime"] = item["file.svcCatalog"][1];
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

                costTmp = convert_currency(currency, Number(strRawCost));
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
        costAdj = convert_currency(currency, costAdj);
        oCosts[i] = new optionCost(costAdj, bundleInfo[i]['item.name']);
    }
    
    return oCosts;
}

function _extractBundle(item, id, parentBundleId, list, itemOption, itemQuantity, lang, DeptOnlyList){
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
        if(item.subscribeDept && item.createSubscription && !item.support_item && !item.subscribeIndividual)
        {
          DeptOnlyList.push(true);
        }
        else
        {
          DeptOnlyList.push(false);
        }
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
            var subItem = getCatalogEntryNoAuth(name, lang);
            tempId = tempId + 1;
            if (subItemLevelIndex[parentBundleId] == null) {
                subItemLevelIndex[parentBundleId] = 1;
            }else{
                subItemLevelIndex[parentBundleId]++;
            }
            tempId = _extractBundle(subItem, tempId, parentBundleId, list, item.bundle[i].item_option, item.bundle[i].item_quantity, lang, DeptOnlyList);
        }
    }
    
    return tempId;
}


function optionCost(costadj, label){
    //this.costadj = costadj;
    //this.label= label;
    this.optionCost=costadj;
    this.optionLabel= label;
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
    this.subOptionMappings = item.option_mappings;
    if (item.currency == null || item.currency == "") item.currency = vars.$G_root_currency;
    this.currency = item.currency;
    this.subOptions = lib.GatewayAPI_RAD.fix_bundle_opts_currency(item.options, item.currency, defaultCurrency, false, item["option.costs"] ).getForm();
    this.option_costs = null;
    this.itemOption = itemOption;
    this.itemQuantity = itemQuantity;
    this.itemOptionId = itemOptionId;
    this.subItemDisplayName = item.displayName;
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
            var sysInfo = lib.GatewayAPI_Util.getSystemInfo();
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



function getImageId(topic){
    var attfile = new SCFile("SYSATTACHMENTS", SCFILE_READONLY);
    attfile.setFields(["application"],["topic"],["type"],["uid"]);
    //var query = "application=\"joinsvcDisplay\" and type=3 and topic=\"" + topic + "\"";
    var query = "application isin {\"svcCatalog\", \"joinsvcDisplay\"} and type=3 and topic=\"" + topic + "\"";     
    var rc= attfile.doSelect(query);
    if (rc == RC_SUCCESS){
        var imageId=attfile.uid;
        return imageId;
    } else {
        return null;
    }
}


function getCatalogEntryNoAuth(itemName,lang,catalogId) {
  
    var initsql;
    if (itemName !=null){
       initsql="name=\"" + itemName+"\"";
    } 
    else if (catalogId!=null)
    {
         initsql="id=" + catalogId;
    } else 
    { 
      return null;
    }
    
                
    //var strQuery = "name=\"" + itemName + "\" and syslanguage=\"" +lang+ "\"";
    var strQuery =initsql+" and syslanguage=\"" +lang+ "\"";
    
    if (log.isDebug()) log.debug("strQuery= " + strQuery);
  
    
    //get the target item
    var item = select(JOINSVCDISPLAY_FILENAME, strQuery);
    
    if (lang != defaultLang && item == null) {
        //if there is no record for the target language, get the default one.
        lang = defaultLang;
        var strQueryDefault = initsql+" and syslanguage=\"" +defaultLang+ "\"";
        item = select(JOINSVCDISPLAY_FILENAME, strQueryDefault);
    }
    
    if (item == null){
            return null;
     }
   
      
    item["sysmodtime"] = item["file.svcCatalog"][1];
    return item;
}

function getDateTypeFieldsFromValidations(validations) {
    if (validations == null || validations == "") {
        return null;
    }
    var ret = [];
    var formXML = new XML();    
    formXML.setContent(validations);
    var node = formXML.getFirstChildElement();
    while (node != null) {
        if (node.getName() == "date") {
            ret.push(node.getAttributeValue('id'));
        }
        node = node.getNextSiblingElement();
    }
    return ret;
}


function convertDefaultValueInDateTypeUserOptions(form, fields) {
    if (form == null || form == "" || form == "true" || fields == null || fields.length == 0) {
        return form;
    }
    var formXML = new XML();    
    formXML.setContent(form);
    var node = formXML.getFirstChildElement();
    while (node != null) {
        var id = node.getAttributeValue('id');
        if (funcs.index(id, fields) > 0) {
          var text = node.getText();
          if (text != null && text != "") {
             node.setText(lib.tzFunctions.convertDateStringToGMT(text, 6));
          }
        }
        node = node.getNextSiblingElement();
    }
    return formXML.toXMLString();
}
