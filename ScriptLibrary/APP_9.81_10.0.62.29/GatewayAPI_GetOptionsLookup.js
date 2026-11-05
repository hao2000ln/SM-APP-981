/** @fileoverview GatewayAPI_GetOptionsLookup - contains functions used by the Service Catalog module
*   @author SMCi
*/
var log = getLog('GatewayAPI_GetOptionsLookup');
var NO_RECORD_EXIT = lib.GatewayAPI_Constants.NO_RECORD_EXIT();
var NORMAL_EXIT = lib.GatewayAPI_Constants.NORMAL_EXIT();
var setExitType = lib.GatewayAPI_Util.setExitType;
var displayName = lib.DisplayName;
var BAD_VALIDATION_EXIT = lib.GatewayAPI_Constants.BAD_VALIDATION_EXIT();
var setErrorMsg = lib.GatewayAPI_Util.setErrorMsg;
var getMessage = lib.GatewayAPI_Util.getMessage;
var count = lib.GatewayAPI_RAD._count;
var select = lib.GatewayAPI_RAD._select;
var findDefaultQBEFormat = lib.GatewayAPI_RAD.findDefaultQBEFormat;
var dynamicFormGenerator=lib.dynamicFormGenerator;
var _null=system.functions._null;
var getCurrentOperator = lib.GatewayAPI_Util.getCurrentOperator;
var getDisplayNameByLogicalName = displayName.getDisplayNameByLogicalName;
var typeArray = lib.DataTypeConst.typeArray;
var _changeUserSession=lib.GatewayAPI_Util.changeUserSession;
var fastCount=lib.GatewayAPI_RAD.fastCount;


function getOptionsLookup() {
    // log.setLevel("debug");
	setExitType(NORMAL_EXIT);
  	var lookup_table = vars.$L_file.tableName;  
  	var lookup_field = vars.$L_file.fieldName;
  	var component = vars.$L_file.component;
    var condition = vars.$L_file.condition;
  	var pagesize = vars.$L_file.pagesize;
  	var start = vars.$L_file.start;
  	var search_phrase = vars.$L_file.search;
  	var query_string = vars.$L_file.queryString;
  	var fieldDisplayName = "display.name";
  	var deviceTableName = "device";
  	
  	var oper=getCurrentOperator();
  	var oriOperator=oper.name;
  	var defaultValue=oper.contact_name;

    // Refinement start for Defect 1371145 - Problem evaluation the visible condition of a user selection in a catalog item

    //Clear variables value
    vars['$requested.for'] = null;
    vars['$requested.for.dept'] = null;
    vars['$requested.for.type'] = null;

    if (vars.$L_file.requested_for_type && !_null(vars.$L_file.requested_for_type) && vars.$L_file.requested_for && !_null(vars.$L_file.requested_for)) {
  	    if(vars.$L_file.requested_for_type=="individual") {
  	    	vars['$requested.for'] = vars.$L_file.requested_for;
  	    	vars['$requested.for.type'] = vars.$L_file.requested_for_type;
  		} else if (vars.$L_file.requested_for_type=="department") {
  		    vars['$requested.for.dept'] = vars.$L_file.requested_for;
  	    	vars['$requested.for.type'] = vars.$L_file.requested_for_type;
  	    }
  	}
  	
	// Refinement end				 
  	if (vars.$L_file.operator && !_null(vars.$L_file.operator)){
  	     var requestOnBehalf=vars.$L_file.operator;
	    if (oriOperator!=requestOnBehalf)
	    _changeUserSession(requestOnBehalf);
	     defaultValue=getCurrentOperator().contact_name;
  	}
  	var newOper=getCurrentOperator().name;
  	if(lookup_table=="contacts"){
        vars.$L_file.defaultValue= defaultValue;
    }
  	try {
        if (component != null && component == "exec-script") {
            var result = _execScript(condition, start, pagesize, search_phrase);
            vars.$L_file._count = result.count;
            vars.$L_file.header = result.header;
            vars.$L_file.values = result.values;
            return;
        }
  		var dbdict = getDBDICT(lookup_table);
  		_checkFieldTable(dbdict, lookup_field);
  		var qbe_format = findDefaultQBEFormat(lookup_table);

		var header_xml = new XML();
		header_xml.setContent("<columns/>");
		
		
		var qbe_nodes = new Array();
		var display_fields = [lookup_field];
		var lookup_caption = system.functions.nullsub(system.functions.get_field_caption(lookup_field, lookup_table), lookup_field);
		
		var lookup_node = header_xml.createNode(1, "column");
		lookup_node.setAttributeValue("field", lookup_field);
		lookup_node.setAttributeValue("label", lookup_caption);
		
		// add the hasdisplay attribute
		if(dynamicFormGenerator.needDisplayField(lookup_table,lookup_field)){
			fieldDisplayName = displayName.getDisplayLable(deviceTableName);
			lookup_node.setAttributeValue("hasDisplay","true");
			
			var displayname_node = header_xml.createNode(1, "column");
			displayname_node.setAttributeValue("field", fieldDisplayName);
			displayname_node.setAttributeValue("label", displayName.getFieldCaption(deviceTableName, fieldDisplayName));
			display_fields[1] = fieldDisplayName;
			qbe_nodes.push(displayname_node);
		}
		
		
		if (qbe_format && qbe_format.file) {
			var j = display_fields.length;
			var k = 0;
		    for (var i=0;i<qbe_format.file['field'].length();i++) {
		    	var field = qbe_format.file['field'][i]['input'];
		    	if (field == null || field == '') {
		    	  continue;
		    	}
		    	
		    	if (field != lookup_field && field != fieldDisplayName) {
		    		var qbe_node = header_xml.createNode(1, "column");
		    		qbe_node.setAttributeValue("field", qbe_format.file['field'][i]['input']);
		    		qbe_node.setAttributeValue("label", qbe_format.file['field'][i]['output']);
		    		qbe_node.setAttributeValue("idx", k);
		    		qbe_nodes.push(qbe_node);
		    		display_fields[j++] = qbe_format.file['field'][i]['input'];
		    	} else if (field == lookup_field) {
		    		lookup_node.setAttributeValue("label", qbe_format.file['field'][i]['output']);
		    		lookup_node.setAttributeValue("idx", k);
		    	}
		    	k++;
		    }
		}

		header_xml.appendNode(lookup_node);
		
		for (var i=0;i<qbe_nodes.length;i++) {
			header_xml.appendNode(qbe_nodes[i]);
		}
		
	    vars.$L_file.header = header_xml.toXMLString();
	    
	    var query = "true";
	    var search_phrase_query = "";
	    if (search_phrase && search_phrase != "") {
		    var arrayValues = search_phrase.split("\n");
			var searchKey = arrayValues[0];
			var searchKey = lib.StringUtil.escapeAllStr(searchKey);
	    	for (var i=0; i< display_fields.length; i++) {
		    	if (isSearchableField(dbdict, display_fields[i])) {
		    		if (search_phrase_query != "") {
		    			search_phrase_query += " or ";
		    		}
		    		if (dynamicFormGenerator.needDisplayField(lookup_table, display_fields[i])){
		    			search_phrase_query += lookup_table+";"+display_fields[i]+";"+deviceTableName+";logical.name;"+deviceTableName+";"+fieldDisplayName+" like \"" + searchKey + "*\"";
		    		}else{
		    			search_phrase_query += display_fields[i] + " like \"" + searchKey + "*\"";
		    		}
		    	}
		    }
	    }
	    
	    if (query_string && query_string != "") {
	    	query += " and (" + query_string + ")";
	    }
	    if (search_phrase_query != "") {
			query += " and (" + search_phrase_query + ")";
	    }
	    // customize query expression
	    var tailoringQuery = _getTailoringLookupQuery(component, condition, lookup_table, lookup_field);
        if (tailoringQuery != null) {
            query += " and (" + tailoringQuery + ")";
        }
	    query = system.functions.generate_sql_query(['*'], query, lookup_table, false);	  
	    var search_result = select(lookup_table, query, display_fields);
	    //var _count = count(lookup_table,query);
	    var _count=fastCount(search_result);
	    vars.$L_file._count = _count;
	    
	    var end = -1;
	  	if (start < 1) {
	    	start =1;
	  	}
	  	if (pagesize > 0) {
	     	end = start + pagesize - 1;
	  	}
	
	    var row = 1;
	    if (search_result) {
	    	var rc = RC_SUCCESS;
	    	var index = 0;
	    	
	    	var bNeedsDisplayName = displayName.hasDisplayName(lookup_table);
	    
	    	while( rc == RC_SUCCESS ) {
		        if (row >= start) {
					var value = null;
					var data_xml = new XML();
					data_xml.setContent("<values/>");
					for (var i=0; i< display_fields.length; i++) {
						if( display_fields[i] == fieldDisplayName){
							value = getDisplayNameByLogicalName(value);
						}else{
							value = search_result[display_fields[i]];
							if(i>0 && bNeedsDisplayName && dynamicFormGenerator.needDisplayField(lookup_table,display_fields[i])){
								value = getDisplayNameByLogicalName(value);
							}
						}
						
		          		var node = data_xml.createNode(1, "value");		          		
						
						if (value != null) {						
							node.setValue(formatValue(value));							
						}
						data_xml.appendNode(node);
					}
					vars.$L_file.values[index] = data_xml.toXMLString();
					index++; 
		        }
		        if (end!=-1 && row>=end) break;
		        rc = search_result.getNext();
		        row++;
		 	}
	    }
	 if (newOper!=oriOperator) _changeUserSession(oriOperator);
  	} catch( ex ) {
   		setExitType(BAD_VALIDATION_EXIT);
		setErrorMsg(ex);
		if (newOper!=oriOperator) _changeUserSession(oriOperator);
		
	}
}

function _getHeader(fields) {
    var header_xml = new XML();
    header_xml.setContent("<columns/>");
    var lng = funcs.lng(fields);
    for (var i = 0; i < lng ;i++) {
        var name = fields[i].name;
        var label = fields[i].label;
        var label_node = header_xml.createNode(1, "column");
        label_node.setAttributeValue("field", name);
        label_node.setAttributeValue("label", label);
        if (fields[i].display) {
            label_node.setAttributeValue("idx", 0);
        }
        header_xml.appendNode(label_node);
    }
    return header_xml.toXMLString();
}

function _execScript(condition, start, pageSize, searchText) {
    var ctx = {};
    ctx.start = start;
    ctx.pageSize = pageSize;
    ctx.searchText = searchText;
    ctx.language = vars.$G_my_language;
    var param = rteJSONParse(condition);
    ctx.paramList = param.paramList;
    var scriptName = param.script;
    if (scriptName == null ||  lib[scriptName] == null || lib[scriptName].run == null) {
        throw getMessage(302, [scriptName]);
    }
    if (log.isDebugEnabled()) {
      log.debug("External Lookup \"" + scriptName + "\" Context " + rteJSONStringify(ctx));
    }
    var result = lib[scriptName].run(ctx);
    if (result == null) {
        throw getMessage(302, [scriptName]);
    }
    if (log.isDebugEnabled()) {
      log.debug("External Lookup \"" + scriptName + "\" Response " + rteJSONStringify(result));
    }
    
    var values = [];
    var count = funcs.lng(result.data);
    var fieldCount = funcs.lng(result.fields);
    for (var i = 0; i < count; i++) {
        var value_xml = new XML();
        value_xml.setContent("<values/>");
        var item = result.data[i];
        for (var j = 0; j < fieldCount; j++) {
            var field = result.fields[j].name;
            var node = value_xml.createNode(1, "value");
            node.setValue(item[field]);
            value_xml.appendNode(node);
        }
        values.push(value_xml.toXMLString());
    }
     return {
          'count': result.total,
          'header': _getHeader(result.fields),
          'values': values
    };
}

//Get additional lookup query expression based on component
function _getTailoringLookupQuery(component, condition, lookupTable, lookupField) {
  if (component == "approval-delegation" && lookupTable == "operator") {
      if (condition == null) return "false";
      if (condition == "all" && vars['$avail.approval.modules.value'] == null) {
        var oper=getCurrentOperator();
        // Init variables
        lib.GatewayAPI_ApprovalDelegation.getApprovalDelegationModules(oper);
      }
      return lib.ApprovalUtil.getFilteredQuery(condition);
  }
  return null;
}

function getDBDICT(fileName) {
	var file = new SCFile("dbdict");
	var rc = file.doSelect("name=\"" + fileName+ "\"");
	if (rc == RC_SUCCESS) {
		return file;
	}
	throw getMessage(122, [fileName]);
}

function isSearchableField(dbdict, fieldName){
	if (dbdict) {
		for (var i = 0; i < dbdict.field.length(); i++){
			if (dbdict.field[i].name == fieldName){
				if (lib.DataTypeConst.typeCharacter()==dbdict.field[i].type) {
					return true;
				}
				return false;				
			}
		}
	}
}

/**
 * format the value for diplay.
 * for example, array need to be formatted.
 */
function formatValue(value) {
	var display = "";
	if (system.functions.type(value) == typeArray()) {
		for (var i in value) {
			if (value[i]) {
				if (display!="") {
					display += "\n";
				}
				display += formatValue(value[i]);
			}
		}
		
	} else {
		display = system.functions.str(value);
	}
	return display;
}

function _checkFieldTable(dbdict, fieldName){
	if (dbdict) {
		for (var i = 0; i < dbdict.field.length(); i++){
			if (dbdict.field[i].name == fieldName){
				return true;
			}
		}
		var msg = new Array(fieldName, dbdict['name']);
		throw getMessage(123, msg);
	}
}