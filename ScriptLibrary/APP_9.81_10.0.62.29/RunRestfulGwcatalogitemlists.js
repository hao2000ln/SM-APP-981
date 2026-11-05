var _ = lib.Underscore.require();
var $ = lib.c.$;
var restm=lib.RestfulMain;
var logger = getLog('RunRestfulgwcatalogitems');
var makeSort=lib.RestfulQuery.makeSort;
var us_convert_currency = lib.GatewayAPI_RAD.us_convert_currency;
var getCurrentOperator = lib.GatewayAPI_Util.getCurrentOperator;
var money_format = lib.GatewayAPI_RAD.money_format;
var tod = lib.GatewayAPI_RAD._tod;
var operCurrency; 
var defaultLang ; 
var defaultCurrency;
var parseDateRangeValidation = lib.GatewayAPI_DVD_Utility.parseDateRangeValidation;
/**
 * CAUTIONS: In strict counting mode, evaluating access filter on all catalog items will impact performance. Not adopt strict counting mode by default.
 */
function getStrictCountingMode() {
    return false;
}
/**
 * REST API 
 */
function POST(req, res) {
    //logger.setLevel("debug");
    var strictCounting = getStrictCountingMode();
    var startTime = new Date();
    var msgs = [];
    var start = +req.body.gwcatalogitem.start || 1;
    var count = +req.body.gwcatalogitem.count || 50;
    var isExpand = cleanParameter(req.body.gwcatalogitem.view || "noexpand");    
    var mixedLanguage = req.body.gwcatalogitem.mixedLanguage;
    
    if(start<1) start = 1;
    if(count<1) count = 50;
    defaultCurrency = getCurrentOperator.display_currency_code || vars.$G_root_currency;
    var appendquery = req.body.gwcatalogitem.query;

    var sql = 'select t1.name name ,t1.active active ,t1.cost cost,t1.currency currency,t1.parent parent ,t1.recurring.cost recurring.cost,t1.restrictQuantity restrictQuantity' + 
                    ',t1.recurring.cost.interval recurring.cost.interval,t1.type type ,t1.infoOnly infoOnly,t1.support.item support.item,t1.access.filter access.filter,t1.category.type category.type'+ 
                     ((isExpand == 'expand')?',t1.options,t1.option.costs,t1.option.validations':'') +
                    ',t2.displayName displayName,t2.description description' +
                    ',t3.popularity popularity,t3.isPopular isPopular ' +
                    'from svcCatalog t1 left outer join svcDisplay t2 on (t1.name=t2.name) left outer join gwsvcItemCountTotal t3 on (t1.id=t3.itemId)';
    var countSql = 'SELECT count(distinct t1.name)' +
                    ' from svcCatalog t1 left outer join svcDisplay t2 on (t1.name=t2.name) left outer join gwsvcItemCountTotal t3 on (t1.id=t3.itemId)';
     
    var beforeCW = new Date();
    logger.debug ("beforegetCapabilityWordCache Total Time Cost : " + (beforeCW.getTime()- startTime.getTime()));

    var capability = [];
    var oriOperator = funcs.operator();
    var requestOnBehalf = req.body.gwcatalogitem.operator;
    if (requestOnBehalf != null && requestOnBehalf != "") {
        if (oriOperator!=requestOnBehalf) {
            lib.GatewayAPI_Util.changeUserSession(requestOnBehalf);
        }
    } 
    var newOper = funcs.operator();
    capability = lib.GatewayAPI_Cache.getCapabilityWordCache().get(newOper);
    var afterCW = new Date();
    logger.debug("aftergetCapabilityWordCache Total Time Cost : " + (afterCW.getTime()- beforeCW.getTime()));
    var filter = new QueryCond('active', EQ, true)
                .and(new QueryCond('access.list', ISIN, capability).or(new QueryCond('access.list', EQ, null)))
                .asRAD();
    if (appendquery!=null && appendquery!='') 
    {
      sql+= ' where '+appendquery.replace(/supportItem/g, "support.item") + ' and '+filter;
      countSql+= ' where '+appendquery.replace(/supportItem/g, "support.item") + ' and '+filter;
    }
    else
    {
      sql += ' where '+ filter;
      countSql += ' where '+ filter;
    }
    logger.debug("sql is" + sql);
    
    var fieldList = ['name','displayName','popularity','isPopular','active','cost','currency','description','parent',
        'recurring.cost','recurring.cost.interval','type','infoOnly','support.item','access.filter','category.type'];
    var captionList =['name','displayName','popularity','isPopular','active','cost','currency','description','parent',
        'recurringCost','recurringCostInterval','type','informationOnly','supportItem','accessFilter','categoryType'];
    
    if (isExpand == 'expand') {
        fieldList.push("options");
        captionList.push("options");
        fieldList.push("option.costs");
        captionList.push("optionCosts");
        fieldList.push("option.validations");
        captionList.push("optionValidations");
    }

    var fieldMap = {};
    for ( var k=0; k<captionList.length; k++){
        if (null != captionList[k]) {
            fieldMap[captionList[k]] = fieldList[k];
        }
    }      
 
    var sortinput=req.body.gwcatalogitem.sort;
   
    var beforeQuery = new Date();
    logger.debug ("beforeQuery Total Time Cost : " + (beforeQuery.getTime()- afterCW.getTime()));
    if (sortinput!=null) {
        var sort = makeSort(sortinput, fieldMap);
        var sortFields=sort.sort;
        var sortSeqs=sort.sortorder;
        var returnFile = $("joinsvcDisplayItemCount", SCFILE_READONLY).setFields(fieldList).setOrderBy(sortFields,sortSeqs).select(sql);
    } else {
        var returnFile = $("joinsvcDisplayItemCount", SCFILE_READONLY).setFields(fieldList).select(sql);
    }
    var aferQuery = new Date();
    logger.debug ("aferQuery Total Time Cost : " + (aferQuery.getTime()- beforeQuery.getTime()));
    var countFile= $('svcCatalog', SCFILE_READONLY).select(countSql);
    var totalCount=0;
    var rc1=countFile.rc;
    if (rc1==RC_SUCCESS) totalCount = countFile.uniqueResult()[0];
    //var totalCount= $("svcCatalog", SCFILE_READONLY).count(sql); //lib.GatewayAPI_RAD._count("svcCatalog", sql);
    var rc=returnFile.rc;
    var afterCount = new Date();
    logger.debug ("afterCount Total Time Cost : " + (afterCount.getTime()- aferQuery.getTime()));
    var f = returnFile.scfile;
    
    var beforeSkip = new Date();
    logger.debug ("beforeSkip start Total Time Cost : " + (beforeSkip.getTime()- afterCount.getTime()));
    // skip the starting
    var recordIndex = 0;
    while (rc == RC_SUCCESS && recordIndex < start - 1) {
        if (strictCounting) {  // In strict counting mode
            if (_evaluateAccessFilter(f.access_filter)) {
                recordIndex++; // Counting this record only if access filter is true
            } else {
                totalCount--;     // Decrement total counting if access filter is false
            }
        } else {
            recordIndex++;    // Skip each item if it's not in strict counting mode
        }
        rc = f.getNext();
    }
    
    var afterSkip = new Date();
    logger.debug ("afterSkip start Total Time Cost : " + (afterSkip.getTime()- beforeSkip.getTime()));

    // get the page data    
    var data = [];
    var catalogItemNames = [];
    var recordIndex = 0;    
    if (! operCurrency ) operCurrency = getCurrentOperator().display_currency_code || vars.$G_root_currency;
    while (rc == RC_SUCCESS) {
        if (!strictCounting && recordIndex >= count) {
            break;  // Quit when it is not strict counting mode
        }
        var startRepack = new Date();
        logger.debug ("Category/item and access filter evaluation--- : " + f.name+" === "+f.access_filter);
        var canaccess = _evaluateAccessFilter(f.access_filter);
        logger.debug ("Category/item and access filter evaluation result is--- : " + f.name+" === "+canaccess);

        if (canaccess) {
            // If access filter is true
            if (recordIndex < count) {                          
                // Get item value
                var value = _getItem(f, operCurrency, isExpand, catalogItemNames); 
                data.push(value);
            }
            if (strictCounting) {
                recordIndex++;  // only count it when it's in strict counting mode
            }
        } else {
            totalCount--;
        }

        var beforeGetNext = new Date();
        rc = f.getNext();
        logger.debug ("getNext Time Cost : " + (new Date().getTime() - beforeGetNext.getTime()));
        if (!strictCounting) {
            recordIndex++; // Count each item if it's not strict counting mode
        }
        logger.debug ("repack one  Time Cost : " + (new Date().getTime() - startRepack.getTime()));
    }
    var repack = new Date();
    logger.debug ("repack Total Time Cost : " + (repack.getTime()- afterCount.getTime()));

    if (mixedLanguage != null) {
        var localization = lib.GatewayAPI_Util.getLocalizedCatalogMap(catalogItemNames, mixedLanguage);
        // Replace displayName and decriptin in english locale for catalog items
        for (var i = 0; i < data.length; i++) {
            var name = data[i].name;
            if (localization[name] != null ) {
                data[i].displayName = localization[name].displayName;
                data[i].description = localization[name].description;
            }
        }
    }

    logger.debug ("Total Time Cost : " + (new Date().getTime()- startTime.getTime()));
    res.send({Messages: msgs, entities: data, '@start': start, '@count': data.length, '@totalcount': totalCount });

    if (newOper != oriOperator) {
        lib.GatewayAPI_Util.changeUserSession(oriOperator);
    }
        
}

/**
* Evalute access filter
*/
function _evaluateAccessFilter(accessFilter) {
    if (accessFilter && accessFilter.toString() != '' && accessFilter.toString() != 'true') {  
        if(accessFilter.toString().indexOf("$L.file")!==-1){
            return true;
        }
        return funcs.evaluate(funcs.parse(accessFilter.toString(), 2));
    }
    return true;
}

function _getItem(f, operCurrency, isExpand, catalogItemNames) {
    var covertCurrent = new Date();
    logger.debug ("beforeCovertCurrent Total Time Cost : " + (covertCurrent.getTime()- new Date().getTime()));
    var itemCurrency = f.currency;
    var    itemCost = f.cost;
    var    itemrecurringCost = f.recurring_cost;
    if (itemCurrency == null) itemCurrency = vars.$G_root_currency;
    var rate = lib.GatewayAPI_Cache.getCurrencyRateCache().get(operCurrency, itemCurrency);
    if (rate != null ) {
        itemCurrency = operCurrency;
        itemCost = f.cost==null?f.cost:f.cost*rate;
        itemrecurringCost = f.recurring_cost==null?f.recurring_cost:f.recurring_cost*rate;
    }
    var aftercovertCurrent = new Date();
    logger.debug ("afterCovertCurrent Total Time Cost : " + (aftercovertCurrent.getTime()- covertCurrent.getTime()));
    var value = {
          name: f.name,
          displayName: f.displayName,
          popularity: f.popularity,
          isPopular: f.isPopular,
          active: f.active,
          cost: itemCost,//f.cost,
          currency: itemCurrency,
          description: f.description,
          parent: f.parent.toArray(),
          recurringCost: itemrecurringCost, // f.recurring_cost,
          recurringCostInterval: f.recurring_cost_interval,
          type: f.type,
          categoryType: f.category_type,
          informationOnly: f.infoOnly,
          detailedDescription: f.detailedDescription,
          supportItem: f.support_item,
          image: lib.GatewayAPI_Cache.getCatalogImageCache().get(f.name),
          restrictQuantity: f.restrictQuantity
    };
    logger.debug ("repackValue one Time Cost : " + (new Date().getTime()- aftercovertCurrent.getTime()));

    if (isExpand == 'expand') {
        value["options"] = f.options;
        value["optionCosts"] = f.option_costs;
        value["optionValidations"] = f.option_validations;
        value["optionList"] = f.optionList;        
        if(f.type == "bundle"){
            setBundleItemOptions(f.name, value);
        }
    }
    catalogItemNames.push(value.name);
    return removeEmptyKeysAndWrapIt(value);
}

function removeEmptyKeysAndWrapIt(obj) {
    if(obj != null) {
        for(var key in obj) {
            if(obj[key]==null || obj[key]==='') {
                delete obj[key];
            }
        }
    }
    return obj;
    
}
/*
function testIt() {
    var testObj = {
        a: '',
        b: null,
        c: 123,
        d: '123'
    };
    
    testObj = removeEmptyKeysAndWrapIt(testObj);
    print(rteJSONStringify(testObj));
}
testIt();
*/



    
function cleanParameter(parm) {    
    if (parm) {
        parm = parm.replace(/\\\\/g, '\\');
        parm = parm.replace(/\\\"/g, '\"');
        parm = parm.replace(/"/g, '');
    } 
    return parm;
}

function authorize() {
  return true;
}

function setBundleItemOptions(bundleName, value) {
    oper = getCurrentOperator();
    lang = oper.syslanguage || vars.$G_my_language;
    var bundleItem = $("joinsvcDisplay").select("name=\""+bundleName+"\" and syslanguage=\""+lang+"\"").uniqueResult();
    logger.debug("bundleName : " +  bundleName);
    if (bundleItem && bundleItem.type == "bundle") {
        logger.debug("bundleItem : "+lib.debugUtils.display(bundleItem))
        var list = new Array();
        subItemLevelIndex = new Array();
        _extractBundle(bundleItem, 0, null, list, null, null, lang);
        value["bundleSubItems"]= new Array()
        for (var i = 0; i < list.length; i++) {
            value["bundleSubItems"][i] = {}
            value["bundleSubItems"][i].subItemId = list[i].subItemId;
            value["bundleSubItems"][i].fromBundle = list[i].fromBundle;
            value["bundleSubItems"][i].subItemType = list[i].subItemType;
            value["bundleSubItems"][i].subItemName = list[i].subItemName;
            value["bundleSubItems"][i].subItemDisplayName = list[i].subItemDisplayName;
            //value["subItems"][i].subOptionValidations = parseDateRangeValidation(list[i].subOptionValidations);
            value["bundleSubItems"][i].subOptions = list[i].subOptions;
            //if (list[i].option_costs != null) {
            //    var optionCost = list[i].option_costs;
            //    value["subItems"][i].subOptionCosts = rteJSONStringify(optionCost);
            //}
            if (list[i].itemOption != null) {
                value["bundleSubItems"][i].subItemOptionInBundle = list[i].itemOption;
            }
            value["bundleSubItems"][i].subItemQuantityInBundle = list[i].itemQuantity;
            value["bundleSubItems"][i].subItemOptionIdInBundle = list[i].itemOptionId;
        }
    }
    return value;
}

function _extractBundle(item, id, parentBundleId, list, itemOption, itemQuantity, lang){
    var subItemLevelIndex = new Array();
    var sysLang = vars.$G_root_language;
    var tempId = id;
    if (item == null){
        return tempId;
    }
    var levelIndex = null;
    if (!subItemLevelIndex) subItemLevelIndex = new Array();
    if (subItemLevelIndex[parentBundleId] != null){
        levelIndex = "opt"+subItemLevelIndex[parentBundleId];
    }
    
    if (item.type == "item") {
        var tmp = _setBundleItem(item, id, parentBundleId, itemOption, itemQuantity, levelIndex);
        tmp.option_costs = lib.GatewayAPI_WSInterface_svcCatalogDetail._setOptionCosts(item.option_costs, item.options, item.currency);
        list.push(tmp);
        return tempId;
    }
    if (item.type == "bundle") {       
        var tmp = _setBundleItem(item, id, parentBundleId, itemOption, itemQuantity, levelIndex);
        tmp.option_costs = lib.GatewayAPI_WSInterface_svcCatalogDetail._setOptionCostsBundle(item.bundle, item.currency);
        if(parentBundleId !== null) list.push(tmp);
        parentBundleId = tempId;
        logger.debug("_extractBundle bundle: "+ item.bundle.length());
        for (var i = 0; i < item.bundle.length(); i++){
            var name = item.bundle[i].item_name;
            logger.debug("_extractBundle bundle item name: "+ name);
            var subItem = $("joinsvcDisplay").select("name=\""+name+"\" and syslanguage=\""+lang+"\"").uniqueResult();
            //logger.debug("_extractBundle bundle item subItem: "+ subItem);
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
    //this.subOptionValidations = item.option_validations;
    if (item.currency == null || item.currency == "") item.currency = vars.$G_root_currency;
    this.subOptions = lib.GatewayAPI_RAD.fix_bundle_opts_currency(item.options, item.currency, defaultCurrency, false, item["option.costs"] ).getForm();
    //this.option_costs = null;
    this.itemOption = itemOption;
    this.itemQuantity = itemQuantity;
    //this.itemOptionId = itemOptionId;
    this.subItemDisplayName = item.displayName;
}