var logger = getLog('GatewayAPI_Cache');
var sessionTimeOut = 60000;
var JSON = lib.JSON.json();

var capabilityWordCache = (function () {
	var libs = {};
	var max = 100;
	function get(oper) {
		if (!oper)
			return null;
		operName = oper;
		if (oper instanceof Object) {
			if (oper['name']) {
				operName = oper.name;
			} else {
				return null;
			}
		}
		logger.debug("Get Operator CapabilityWord, Operator name:" + operName);
		if (!libs[operName]) {
			return set(operName);
		}
		var timePassed = Date.now() - libs[operName]["t"];
		if (timePassed > sessionTimeOut) {
			logger.debug("Refresh Operator CapabilityWord, Operator name:" + operName);
			return set(operName);
		}
		return libs[operName]["cw"];
	}
	

	function set(operName) {
		if (!operName) return;
		logger.debug("Cache Operator CapabilityWord, Operator name:" + operName);
		var capWord = lib.capability.getAllCapabilityWordbyOperator(operName);
		libs[operName] = {
			"cw" : capWord,
			 "t" : Date.now()
			};
		clean(sessionTimeOut);
		return capWord;
	}
	
	function clean(sTimeOut) {
	    //logger.info("Clean Operator CapabilityWord Cache: " + sTimeOut);
	    var count = getCount();
	    if ( count < max ) return;
	    logger.debug("Clean Operator CapabilityWord Cache: " + sTimeOut);
		for (var i in libs) {
			var ti = Date.now() - libs[i]["t"];
			if ( ti > sTimeOut) {
				delete libs[i];
			}
		}
		count = getCount();
		if ( count > max ) {
			clean(Math.round(sTimeOut/2));
		} 
	}
	
	function getCount() {
		var index = 0;
		for (var i in libs) {
			index++;
		}
		logger.debug("getCount : " + index );
		return index;
	}
	
	function cleanAll(){
		libs = null;
		libs = {};
		count=0
	}
	return {
		'get' : get,
		'set' : set,
		'getCount':getCount,
		'cleanAll':cleanAll
	};
})();


function findCurconvert(currencyCode, rootCurrencyCode) {
	var currencyRate = 1;
		
	if (rootCurrencyCode != currencyCode){
		var sql = "currency.code=\"" + currencyCode  + "\" and root.code=\"" + rootCurrencyCode + "\"";	
	    var curconvert = lib.c.$('curconvert').setOrderBy(["date"], [SCFILE_DSC]).select(sql).uniqueResult();
	    if (curconvert === null){
	    	sql = "currency.code=\"" + rootCurrencyCode + "\" and root.code=\"" + currencyCode + "\"";	
	    	curconvert = lib.c.$('curconvert').setOrderBy(["date"], [SCFILE_DSC]).select(sql).uniqueResult();
	    	if (curconvert === null)
	    		return null;
	    	else
	    		currencyRate = 1/curconvert['rate'];
	    }
	    else 	        
	        currencyRate = curconvert['rate'];
    }
    return currencyRate.toFixed(5);
}


var currencyRateCache = (function () {
	var libs = {};
	var count = 0;
	var max = 100;
	function get(currencyCode, rootCurrencyCode) {
		logger.debug("Get currencyRate from "+rootCurrencyCode +" to " + currencyCode);
		if (!currencyCode || !rootCurrencyCode ) return null;
		var keyName = rootCurrencyCode +"_" + currencyCode;
		if(!libs[keyName]) {
			return set(currencyCode, rootCurrencyCode);
		}
		
		var timePassed = Date.now() - libs[keyName]["t"];
		if (timePassed > sessionTimeOut){
				logger.debug("Refresh currencyRate from "+rootCurrencyCode +" to " + currencyCode);
				return set(currencyCode, rootCurrencyCode);
		}
		
		return libs[keyName]["rate"];
	}
	

	function set(currencyCode, rootCurrencyCode) {
		if (!currencyCode || !rootCurrencyCode ) return null;
		logger.debug("Cache currencyRate from "+rootCurrencyCode +" to " + currencyCode);
		var rate = findCurconvert(currencyCode, rootCurrencyCode)
		//if (rate === null) return null;
		var keyName = rootCurrencyCode +"_" + currencyCode;
		libs[keyName] = {
			"rate" : rate,
			 "t" : Date.now()
			};
		clean(sessionTimeOut);
		return rate;
	}
	
	function clean(sTimeOut) {
	    //logger.info("Clean Operator CapabilityWord Cache: " + sTimeOut);
	    var count = getCount();
	    if ( count < max ) return;
	    logger.debug("Clean currencyRate Cache: " + sTimeOut);
		for (var i in libs) {
			var ti = Date.now() - libs[i]["t"];
			if ( ti > sTimeOut) {
				delete libs[i];
			}
		}
		count = getCount();
		if ( count > max ) {
			clean(Math.round(sTimeOut/2));
		} 
	}
	function getCount() {
		var index = 0;
		for (var i in libs) {
			index++;
		}
		logger.debug("getCount : " + index );
		return index;
	}
	function cleanAll(){
		libs = null;
		libs = {};
		count=0
	}
	return {
		'get' : get,
		'set' : set,
		'cleanAll':cleanAll
	};
})();


var catalogImageCache = (function () {
	var libs = {};
	var max = 1500;
	function get(catName) {
		logger.debug("Get catalog Image id, catalog name:" + catName);
		if(!libs[catName]) {
			return set(catName);
		}
		
		var timePassed = Date.now() - libs[catName]["t"];
		if (timePassed > sessionTimeOut){
				logger.debug("Refresh catalog Image id, catalog name:" + catName);
				return set(catName);
		}
		
		return libs[catName]["uid"];
	}
	

	function set(catName) {
		if (!catName) return;
		logger.debug("Cache catalog Image id, catalog name:" + catName);
		var uid  = getImageId(catName);
		libs[catName] = {
			"uid" : uid,
			 "t" : Date.now()
			};
		clean(sessionTimeOut);
		return uid;
	}
	
	function clean(sTimeOut) {
	    var count = getCount();
	    if ( count < max ) return;
	    logger.debug("Clean catalog Image id Cache: " + sTimeOut);
		for (var i in libs) {
			var ti = Date.now() - libs[i]["t"];
			if ( ti > sTimeOut) {
				delete libs[i];
			}
		}
		count = getCount();
		if ( count > max ) {
			clean(Math.round(sTimeOut/2));
		} 
	}
	
	function getCount() {
		var index = 0;
		for (var i in libs) {
			index++;
		}
		logger.debug("getCount : " + index );
		return index;
	}
	
	function cleanAll(){
		libs = null;
		libs = {};
		count=0
	}
	return {
		'get' : get,
		'set' : set,
		'getCount':getCount,
		'cleanAll':cleanAll
	};
})();

function getImageId(topic){
	//var query = "application=\"joinsvcDisplay\" and type=3 and topic=\"" + topic + "\"";
    var query = "application isin {\"svcCatalog\", \"joinsvcDisplay\"} and type=3 and topic=\"" + topic + "\"";    
    var image = lib.c.$("SYSATTACHMENTS", SCFILE_READONLY).setFields(["uid"]).select(query).uniqueResult();
    if (image){
    	return image.uid
    }else{
    	return null;
    }
}


function getCapabilityWordCache(){
	return capabilityWordCache;
}


function getCurrencyRateCache(){
	return currencyRateCache;
}

function getCatalogImageCache(){
	return catalogImageCache;
}


function getCurrencyRate(operCurrency, itemCurrency){
	return getCurrencyRateCache().get(operCurrency, itemCurrency);
}