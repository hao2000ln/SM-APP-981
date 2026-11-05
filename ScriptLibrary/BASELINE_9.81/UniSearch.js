/**
 *	Author: Zhang, Ming-Di
 *  Created for Global Search feature.
 **/
var util = lib.ArrayUtil;
var types,displays,custList,custListDisp;
if(vars.$G_unisearch_types) types=vars.$G_unisearch_types.toArray();
if(vars.$G_unisearch_types_disp) displays=vars.$G_unisearch_types_disp.toArray();
if(vars.$G_unisearch_custList) custList=vars.$G_unisearch_custList.toArray();
if(vars.$G_unisearch_custList_Disp) custListDisp=vars.$G_unisearch_custList_Disp.toArray();
var getArea = lib.FileUtil._file('datadict');
var getObject = lib.RAD.getObject;

function createQuery(str) {
	var ret = new SCDatum();
	ret.setType(8);
	if (!str.replace(/\*/g, '')) {
		ret.push('prefix.undefine');
		return ret;
	}
	/*
	Add input parsing for ". should be an issue in client side, when string start with a quote, exception occurs.
	 */
	str = str.replace(/\"/g, "\\\"");
	if (null == displays || null == types) {
		ret.push('not.enabled');
		ret.push(false);
		return ret;
	}
	var tableInx = getFileNameIndex(str);
	var filename = getFilename(tableInx, str);
	if (filename) {
		var key = str.replace(/[a-zA-Z]+/g, '');
		if (!key && filename != 'device') {
			ret.push('prefix.undefine');
			return ret;
		} else
			ret.push(filename);
		if (tableInx > -1)
			str = displays[tableInx] + "" + key;
	}
	var sql = buildQuery(filename, str);
	ret.push(sql);
	return ret;
}

function getFileNameIndex(str) {
	var index = -1;
	for (var i = 0; i < displays.length; i++) {
		var item = displays[i];
		if (str.replace(/[0-9]+/g, '').toUpperCase() == item.toUpperCase()
			 && str.toUpperCase().indexOf(item.toUpperCase()) == 0) {
			index = i;
			break;
		}
	}
	return index;
}

function getFilename(tableInx, str) {
	if (types[tableInx]) {
		ret = types[tableInx];
	} else
		ret = searchInCustList(str);
	return ret ? ret : 'device';
}


function searchInCustList(str){
	for(var i=0;i<custListDisp.length;i++){
		if(str.toUpperCase().indexOf(custListDisp[i].toUpperCase())==0) {
			return custList[i];
		}
	}
}

function getEnvironment(filename) {
	var environment = getObject(filename);
	if(null == environment.object) {throw new Error("Object not configured");return;}
	return environment;
}


function getUniqKey(obj) {
	/**
	 *	uniq key file defined in object record could be following format:
	 * 	line1: header,number
	 *	line2: [empty]
	 */
	return obj['unique.field'][0].split(',').pop();
}

function combineQueryString(key, str, cust){
	var op = cust?"=":"#";
	return key + op + '\"' + str+'\"';
}
function getViewAccess(environment){
	var obj = environment.object;
	var datadict = getArea.select('name=\"'+obj.file_name+'\"');
	if(!datadict) return false;
	var engineaccess = datadict.getFieldValue('engine.access');
	if(!engineaccess) return false;
	var area = datadict.getFieldValue('sc.area');
	var view = lib.security.getToken(area,'view');
	if(view){
		return String(view) == "true";
	} else {
		var prof = environment.env;
		if(!prof) return false;
		if(system.functions.filename(prof) == "docenv"){
			var rt = system.functions.val(prof.search, 4);
			return rt;
		} else {
			var tableAccess = system.functions.val(prof.tableAccess,4);
			return system.library.tableAccess.hasViewAccess(tableAccess);
		}
		
	}
}

function buildQuery(filename, str){
	var cust = false;
	if(util.indexOf(custList,filename)>-1){
		str = str.toUpperCase().replace(custListDisp[util.indexOf(custList,filename)].toUpperCase(),'');
		cust=true;
	}
	var environment = getEnvironment(filename);
	var obj = environment.object;
	var tableAccess = getViewAccess(environment);
	if(!tableAccess) return 'no.view.access';
	var key = getUniqKey( obj );
	var query = combineQueryString(key,str,cust);
	return query;
}