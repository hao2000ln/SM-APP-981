var _getQuery = lib.DBUtils.getQueryByRecord;

function loadContent(fn) {
	var source_file = readFile(fn,"t");
	var lines = source_file.split('\n')
	var cols = lines[0].split('\t');
	var f = "svcCatalog";
	/*
	 *	source is in array type, to be change to object type
	 *	so when customer do scripting, he can set the value via source[col_name] instead of source[10]
	 */
	var source = lines[1].split('\t');
	
	var target = importRow(source,fields,f);
	
	target.doInsert();
}	

/**
	build object record according to the passed in headers and line content
*/
function buildObject(headers, line, delim) {
	var obj = new Object();
	var values = line.split(delim);
	for(var i=0;i<system.functions.lng(headers);i++) {
		obj[headers[i]]=(values[i]||"").replace(/\"/g,"");
	}
	return obj;
}

function getFields(descriptor) {
	var fields = descriptor.fields;
	for(var i = 0, iLoopTimes = fields.length(); i < iLoopTimes;i++) {
		var key = fields[i];		
		var index = lib.ArrayUtil.indexOf(list1, key);
		if(index>-1) indexList.push(index);
		fieldo.push(fields[i]);
	}
}
function SCSplit(arr,descriptor) {
	if(descriptor['name'] == "contacts" || descriptor['name'] == "operator") vars.$context="people";
	var dem = checkDelimitor(descriptor);
	var ret = new SCDatum();
	ret.setType(8);
	var temp = arr.split(dem);
	for(var i =0; i< temp.length;i++) {
		ret.push(temp[i]);
	}
	return ret;
}
function getFieldList(fn) {
	
	var fmap = {};
	var dbdict = new SCFile("dbdict",SCFILE_READONLY);
	dbdict.setFields(["name","field"]);
	var query = 'name="'+fn+'"';
	dbdict.doSelect(query);
	var fields = dbdict['field'];
	/* fields is in SCDatum type, not js array */
	for(var i in fields) {
		if(fields[i][1] == 1)
		fmap[fields[i][0]] = fields[i][3];
	}
	return fmap;
}

/**
	use for preview import
*/
function convert(list,fields, parsedArray){
	var alias = [];
	var fieldo = [];
	var indexList = [];
	var list1=list.toArray();
	for(var i = 0, iLoopTimes = fields.length(); i < iLoopTimes;i++) {
		var key = fields[i];		
		var index = lib.ArrayUtil.indexOf(list1, key);
		if(index>-1) indexList.push(index);
		fieldo.push(fields[i]);
	}
	var ret = new SCDatum();
	ret.setType(8);
	for(var i = 0, iLoopTimes = parsedArray.length();i < iLoopTimes;i++) {
		var texts =parsedArray[i].toArray();
		var row = new SCDatum();
		row.setType(8);
		
		for(var j=0;j<indexList.length;j++) {
			row.push(texts[indexList[j]]);
		}
	ret.push(row);
	}
	return ret;
}


/**
	@param descriptor, import descriptor record
	@param line, a line read by RAD
	@param scfields, fields of SC file, defined in mapping of import descriptor
	@param types, field types defined in mapping
	@param headers, col
	@param mode, add/update
	@return action result, 0/1
*/
function act(descriptor, line, cols) { 
	var delim = checkDelimitor(descriptor);
	var fn = descriptor['name'];
	var mode = descriptor['mode'];
	var source = buildObject(cols,line,delim);
	var f = setFields(descriptor, source)
	var rc;
	var q = _getQuery(f);
	var f1 = new SCFile(descriptor['name']);
	if(f1.doSelect(q) == RC_SUCCESS) {
		f1 = setFields(descriptor, source, f1);
		rc = f1.doUpdate();
	} else {
		rc = f.doInsert();
	}
	
	if(rc == RC_SUCCESS) {return 1;} else {return 0;}
}

/**
	parse the delimitor defined in import descriptor
	@param descriptor, import descriptor
	@return parsed delimitor
*/
function checkDelimitor(descriptor) {
	var ret;
	switch (descriptor['delim.type']) {
		case 'comma' : ret=','; break;
		case 'tab' : ret='\t'; break;
		case 'semicolon': ret=';'; break;
		case 'other': ret=descriptor['delim.other']; break;
		default: ret = ',';
	}
	return ret;
}
function checkMode(mode) {
	/**
	switch (mode) {
	case 'replace': 
			var q = _getQuery(f);
			if(f.doSelect(q) == RC_SUCCESS) {
				rc = f.doUpdate();
			} else rc = f.doInsert();
			break;
		case 'add': 
			rc = f.doInsert();			
			break;
	}
	*/
}
/**
	evaluate the expressions customer defined.
*/
function evaluation(script,target,source) {
	eval(script);
	return target;
}

/**
	do grammer check on the expressions customer defined.
**/
function checkGrammar(script){
	var rc = compile(script,' in javascript field at ');
}

/**
	set the fields value according to the map definition in descriptor
	@param descriptor, import description
	@param source, object created base on the column head and string line
	@param target, SCFile to be filled
	@return target, SCFile filled with value and evaluated by javascript.
*/
function setFields(descriptor,source,target){
	if(target==null) target = new SCFile(descriptor['name']);
	var script = descriptor['javascript'];
	var fields = descriptor['fields'];
	for(var i=0;i<system.functions.lng(fields);i++) {
		var row = fields[i];
		var value =source[row[11]];
		target[row[0]] = parseField(row[1], value);
	}
	target=evaluation(script,target,source);
	return target;
}

function parseField(type, value) {
	var ret;
	switch (system.functions.str(type)) {
				case '1': 
					ret = parseInt(value);
					break;
				case '8': 
					ret = value.split(';');
					break;
				default:
					ret=value;
					break;
	}
	return ret;	
}
function getIndexList(fileList, cols) {
	var indexList = new SCDatum();
	indexList.setType(8);
	for(var i=0;i<system.functions.lng(fileList);i++) {
		var item=fileList[i];
		indexList.push(lib.ArrayUtil.indexOf(cols.toArray(), item));
	}
	return indexList;
}
function convertLine() {
	
}
/**
	@param source, array, one line in external file
	@param fields, array, field names define in column fields, specify current column is related which field in target record
	@param target, SCFile, record to be insert.
*/
function importRow(source, fields, fn) {
	var typeMap = getFieldList(fn);
	var target = new SCFile(fn);
	for(var i=0;i<fields.length;i++){
		if(fields[i]) {
			
			var dataType = typeMap[fields[i]];
			print(fields[i] + ', ' + dataType + ', ' + source[i]);
			print(typeof dataType);
			switch(system.functions.str(dataType)) {
			//TODO;
				case '1': 
					target[fields[i]] = parseInt(source[i]);
					break;
				case '2': 
					target[fields[i]] = source[i];
					break;
				case '8': 
					target[fields[i]] = source[i].split(';');
					break;
			}
		}
	}
	eval(dummy_script);
	
	return target;
}

function createSourceObj(header) {
	var obj = {};
	obj.keys = header;
	var index = 0;
	util.each(header, function(item){
		obj[item]="";
	}, this);
	obj.getValueAt = function(i) {
		return this[this.keys[i]];
	}
	obj.setValueAt = function(i,value) {
		this[this.keys[i]] = value;
	}
	return obj;
}








