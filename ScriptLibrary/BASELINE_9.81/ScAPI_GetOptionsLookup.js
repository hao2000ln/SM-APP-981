/** @fileoverview ScAPI_GetOptionsLookup - contains functions used by the Service Catalog module
*   @author SMCi
*/
var log = new lib.ScAPI_Logger.log( 'ScAPI_GetOptionsLookup' );
var NO_RECORD_EXIT = lib.ScAPI_Constants.NO_RECORD_EXIT();
var NORMAL_EXIT = lib.ScAPI_Constants.NORMAL_EXIT();
var setExitType = lib.ScAPI_Util.setExitType;
var displayName = lib.DisplayName;
var BAD_VALIDATION_EXIT = lib.ScAPI_Constants.BAD_VALIDATION_EXIT();
var setErrorMsg = lib.ScAPI_Util.setErrorMsg;
var getMessage = lib.ScAPI_Util.getMessage;
var count = lib.ScAPI_RAD._count;
var select = lib.ScAPI_RAD._select;
var findDefaultQBEFormat = lib.ScAPI_RAD.findDefaultQBEFormat;
var dynamicFormGenerator=lib.dynamicFormGenerator;
var _null=system.functions._null;
/**  This function is called to submit request. It will query cart object with id and create interaction record.
*
*/
function getOptionsLookup() {
	setExitType(NORMAL_EXIT);
  	var lookup_table = vars.$L_file.tableName;  
  	var lookup_field = vars.$L_file.fieldName;
  	var pagesize = vars.$L_file.pagesize;
  	var start = vars.$L_file.start;
  	var search_phrase = vars.$L_file.search;
  	var query_string = vars.$L_file.queryString;
  	var fieldDisplayName = "display.name";
  	var deviceTableName = "device";
  	if (vars.$L_file.requested_for && !_null(vars.$L_file.requested_for)){
  	    vars['$requested.for'] = vars.$L_file.requested_for;
  	}
  	try {
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
		    for (var i=0;i<qbe_format.file['field'].length();i++) {
		    	var field = qbe_format.file['field'][i]['input'];
		    	if (field != null && field != lookup_field && field != fieldDisplayName) {
		    		var qbe_node = header_xml.createNode(1, "column");
		    		qbe_node.setAttributeValue("field", qbe_format.file['field'][i]['input']);
		    		qbe_node.setAttributeValue("label", qbe_format.file['field'][i]['output']);
		    		qbe_nodes.push(qbe_node);
		    		display_fields[j++] = qbe_format.file['field'][i]['input'];
		    	} else if (field != null && field == lookup_field) {
		    		lookup_node.setAttributeValue("label", qbe_format.file['field'][i]['output']);
		    	}
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
	    query = system.functions.generate_sql_query(['*'], query, lookup_table, false);	  
	    
	    var search_result = select(lookup_table, query, display_fields);
	    var _count = count(lookup_table,query);
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
	    
	    	while( rc == RC_SUCCESS ) {
		        if (row >= start) {
					var value = null;
					var data_xml = new XML();
					data_xml.setContent("<values/>");
					for (var i=0; i< display_fields.length; i++) {
						if( display_fields[i] == fieldDisplayName){
							value = displayName.getDisplayNameByLogicalName(value);
						}else{
							value = search_result[display_fields[i]];
							if(i>0 && dynamicFormGenerator.needDisplayField(lookup_table,display_fields[i])){
								value = displayName.getDisplayNameByLogicalName(value);
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
  	} catch( ex ) {
   		setExitType(BAD_VALIDATION_EXIT);
		setErrorMsg(ex);
	}
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
	if (system.functions.type(value) == lib.DataTypeConst.typeArray()) {
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