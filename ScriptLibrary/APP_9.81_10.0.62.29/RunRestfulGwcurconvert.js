var logger = getLog('RunRestfulGwcurconvert');
var JSON = lib.JSON.json();
var parse_evaluate = system.functions.parse_evaluate;
var operator = system.functions.operator();
var $ = lib.c.$;
var operCurrency;

function GET(req, res) {
    var itCurrency = findItemCurrency(req.options.query);
    if(!itCurrency){
    	res.status(400).message('itemCurrency parameter and value are required');
    	return;
    }

	var cuRate = findCurconvert(itCurrency);
    
    if(cuRate){
        var retEntity = [{itemCurrency: itCurrency, currencyRate: cuRate, operatorCurrency: operCurrency}]
    	res.status(200).send({
    			returnCode:200,
		    	messages: ["Find item currency to operator currency rate successfully.", "complete action normally."],
		    	entities: retEntity
	    	}    	
    	);
    } else {
    	res.status(404).message('Currency Rate is not found for item currency to operator display currency.');
    }
}

function findCurconvert(currencyCode) {
	var currencyRate = 1;
	operCurrency = findOperatorCurrency(system.functions.operator());
	if (operCurrency != currencyCode){
		var sql = "currency.code=\"" + operCurrency  + "\" and root.code=\"" + currencyCode + "\"";	
	    var curconvert = lib.c.$('curconvert').setOrderBy(["date"], [SCFILE_DSC]).select(sql).uniqueResult();
	    if (curconvert === null)
	    	currencyRate = null;	
	    else 	        
	        currencyRate = curconvert['rate'];
    }
    return currencyRate;
}
function findOperatorCurrency(operatorName) {
	var oprCu = null;
	var returnFile = $("operator", SCFILE_READONLY).setFields(["display.currency.code"]).select("name=\"" + operatorName + "\"").uniqueResult();
	if (returnFile) {
		oprCu = returnFile["display.currency.code"];
	}
	return oprCu==null?vars.$G_root_currency:oprCu;
}

function findItemCurrency(query) {	
    value = query.match("itemCurrency=\"(.*)+\"");
	if (!value) {
		value = [,vars.$G_root_currency];
	}
	
    var ic = value[1];
    if (ic) {
        ic = ic.replace(/\\\\/g, '\\');
        ic = ic.replace(/\\\"/g, '\"');
        ic = ic.replace(/"/g, '');
    } 

    return ic;
}

function authorize() {
  return true;
}
