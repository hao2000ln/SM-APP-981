var DisplayName=lib.DisplayName;
var initDbdictFile=lib.dbdictHelper.initDbdictFile;
var initDatadictFile=lib.dbdictHelper.initDatadictFile;
var $=lib.c.$;
var _index=system.functions.index;
var dbdictHelper=system.functions.dbdict_helper;
var policyread=system.functions.policyread;
/**
 * Get fields of all comfill widgets which auto complete is enabled
 * @param {SCFile} format - format record
 * @return {Array} fields which are set for comfill widgets.
 */
function getInputForAutoCompleteComfill(format) {
  var ret = [];
  var fields = format.field;
  var length = format.field.length();
  for (var i=0;i<length;i++) {
    var f = format.field[i];
    var p = f.property;
    if (f.format != null) {
      var name = f.format;
      var file = new SCFile("format");
      var rc = file.doSelect("name=\"" + name + "\" or name=\"" + name + ".g\"");
      if (rc == RC_SUCCESS) {
        var array = getInputForAutoCompleteComfill(file);
        if (array.length > 0) {
          ret = ret.concat(array);
        }
      }
    }
    if (p != null && p.indexOf("ComFill;") == 0 && p.indexOf("autocomplete=1") > 0) {
      ret.push(f.input);
    }
  }
  return ret;
}

/**
 * Get link info for specified field
 * @param {String} field - field name which are used to locate link line in link record
 * @param {String} name - link name
 * @return {Object} information about link including reference table, field and expression
 */
function getLinkLineExpression(field, name) {
  var link = new SCFile("link");
  if (link.doSelect('name="' + name + '"') == RC_SUCCESS) {
    var index = system.functions.index(field, link.source_fields);
    if (index > 0) {
      var _exp = link.link_expressions[index-1];
      var _file = link.target_files[index-1];
      var _field = link.target_fields[index-1];
      if (_file != null && _field != null) {
          return { exp: _exp.length()>0? _exp.toArray().join(" ") : "", 
               file: _file,
               field: _field
             };
      }
    }
  }
  return null;
}
/**
 * Get link info for specified field in link which name equas to form name, and then search in master link.
 *
 * @param {String} field - field name which are used to locate link line in link record
 * @param {String} formName - form name
 * @param {String} table - table name
 * @return {Object} information about link including reference table, field and expression
 */
function getLinkExpression(field, formName, table) {
  formName = formName.replace(/\.[gw]$/, '');
  var exp = getLinkLineExpression(field, formName);
  if (exp == null && table != null) {
    return getLinkLineExpression(field, table);
  }
  return exp;
}

/**
 * Get reference fields used for querying in expression
 * @param {String} query - query expression
 * @param {String} name - link name
 * @return {Array} fields used for querying in expression
 */
function getFieldsInExpression(query) {
  var fields = [];
  var re = new RegExp("(^|\"|\\(|\\s)([a-zA-Z0-9\\.]*)\\s*(#|=)","g");
  while(arr = re.exec(query)) {
    if (system.functions.index(arr[2], fields) <= 0) {
      fields.push(arr[2]);
    }
  }
  return fields;
}

/**
 * Get field list which are added in key definition
 * @param {String} tableName - table name
 * @return {Array} fields in key definition
 */
function getIndexedFieldsDBDict(tableName) {
  var fields = [];
  var dbdict = new SCFile("dbdict");
  if (dbdict.doSelect('name="' + tableName + '"') == RC_SUCCESS) {
    var key = dbdict.key;
    for (var i=0;i<key.length();i++) {
      for(var j=0; j < key[i].name.length();j++) {
        var name = key[i].name[j];
        var index = name.lastIndexOf(",");
        if (index>-1) {
          name = name.substr(index + 1);
        }
        if (system.functions.index(name, fields) <= 0) {
          fields.push(name);
        }
      }
    }
  }
  return fields;
}

/*
 * Description: Validate performance for specified form
 * @param {String} formName, format name
 * @param {String} tableName, table name
 * @return {Array} fields which fields are not indexed, but it is enabled for auto complete
 */
function validateAutoCompletePerformance(format, tableName) {
  var retFields = [];
  var targetFields = [];
  var targetFiles = [];
  var fields = getInputForAutoCompleteComfill(format);
  var form = format.name;
  for (var i=0, len = fields.length; i< len; i++) {
    var f = fields[i];
    var ret = getLinkExpression(f, form, tableName);
    if (ret != null && ret.field != null && ret.file != null) {
      var indexedFields = getIndexedFieldsDBDict(ret.file);
      if (system.functions.index(ret.field, indexedFields) <= 0) {
        retFields.push(f);
        targetFields.push(ret.field);
        targetFiles.push(ret.file);
      }
    }
  }
  return [retFields.join(", "), targetFields.join(", "), targetFiles.join(", ")];
}
/*
 * Description: get Auto Complete Display Fields And Captions
 * @param {String} tableName, datadict name
 * 
 * @return {Array} fields array and captions array configured in datadict
 */

function getAutoCompleteDisplayFields(tableName){
    var fieldList=policyread(tableName,'','autocomplete.show.field');
    return fieldList;
}

function getFieldLocalizedCaption(fieldName, tableName){
	var caption="";
	caption=policyread(tableName,fieldName,'captions');
    if(caption===null || caption==="") return fieldName;
    return caption;
}

function initAutoCompleteShowFields(tableName){
    var valueList=[];
    var displayList=[];
    var fieldName="";
    var caption="";
    var smFile=initDbdictFile(tableName);
    var fieldList=smFile.field;
    var len=system.functions.lng(fieldList);
    var fieldType="";
    var isAlias=false;
    var displayLabel=DisplayName.getDisplayLable(tableName);
    for(var i=0;i<len;i++){
        fieldName=fieldList[i].name;
        fieldType=dbdictHelper("field.type",tableName, fieldName);
        isAlias=dbdictHelper("is.alias",tableName,fieldName);
        if(policyread(tableName, fieldName, "avail") && !policyread(tableName, fieldName, "invisible") && fieldType!==8 && fieldType!==9 && !isAlias || fieldName===displayLabel && policyread(tableName, fieldName, "avail") && !policyread(tableName, fieldName, "invisible")){
            valueList.push(fieldName);
            caption=getFieldLocalizedCaption(fieldName, tableName);
            displayList.push(caption+" - "+fieldList[i].name);
        }
    }
    //sort array a~z
    var temp=new SCDatum(8);
    temp.push(valueList);
    temp.push(displayList);
    var retcode;
    system.functions.rtecall("sort", retcode, temp, 1, 0);
    valueList=temp[0];
    displayList=temp[1];
    vars.$autoComfieldValueList=valueList;
    vars.$autoComfieldDisplayList=displayList;
}

function getFeildGlobalList(tableName, field){
    var globallist;
	var globalListName = policyread(tableName, field, "globallist" );
	
    if (globalListName!==null && globalListName!==""){
        globallist = $.cachedSelect("globallists", 'name="' + globalListName + '"');
        if ( globallist) {
        	//glCatche[tableName+field]= globallist;
        	return globallist;
        }
    	return null;
    }
    return null;
}

function getDisplayValueFromGlobalList(gl,value){
	if(gl===null || gl==="") return value;
	var dispVar = gl["display.variable"];
	var valuVar = gl["list.variable"];
    if (!dispVar || dispVar === "" || !valuVar || valuVar === "") return value;
	var returnValue = vars[dispVar][_index(value, vars[valuVar]) - 1];
    return returnValue ? returnValue : value;
}
