var NORMAL_EXIT = 'normal';
var BAD_VALIDATION_EXIT = 'badval';

var log = getLog("IDOLAPI_GlobalSearch");

function search() {
	var text = vars['$L.file']['query'];
	var filters = vars['$L.file']['filters'];
	var filtersObj;
	if (filters && filters.length()>0) {
		filtersObj = {};
		filtersObj.Filters = [];
		var i;
		var length = filters.length();
		for (i=0; i<length; i++) {
			if (filters[i]['field'] && filters[i]['operator']) {
				filtersObj.Filters.push({"field":filters[i]['field'], "operator": filters[i]['operator'], "value": filters[i]['value']});
			}
		}
		if (filtersObj.Filters.length==0) {
			filtersObj = null;
		}
	}
	var startIndex = vars['$L.file']['startIndex'];
	var pageSize = vars['$L.file']['pageSize'];
    print(text);
	var searchResult = lib.KMSearchInterface.srcSearch(text, filtersObj, startIndex, pageSize);
	print(searchResult);
	if (searchResult) {
		vars['$L.file']['result'] = searchResult.toXMLString();
	}
}

//vars['$L.file'] = new SCFile('kmquery');
//vars['$L.file']['query'] = 'test';
//search();
//print(vars['$L.file']['result']);