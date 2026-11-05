function isDisplayField(tableName, fieldName){
	if(!fieldName){
		return false;
	}
	return null!=lib.DisplayName.getRefTable(fieldName, tableName);
}

function getDisplayValue(value) {
	if(value===null) return '';
	if(!value) return value;
	
	var type = funcs.type(value);
	if(type ==8 || (type==2 && value.charAt(0)=='{')){
		if(type==2){
			var array = funcs.parse_evaluate(value, 2).toArray();
		} else if (type==8){
			var array = value.toArray();
		}
		
		var list = [];
		
		for(var k=0;k<array.length;k++) {
			var value = array[k];
			var item = lib.c.$('device', SCFILE_READONLY).setFields(['display.name', 'logical.name']).select('logical.name="'+lib.StringUtil.escapeAllStr(value)+'"').uniqueResult();
			if(item){
				list.push(item['display.name']);
			} else {
				list.push(value);
			}
		}
		
		return list;
	} else {
		var item = lib.c.$('device', SCFILE_READONLY).setFields(['display.name', 'logical.name']).select('logical.name="'+lib.StringUtil.escapeAllStr(value)+'"').uniqueResult();
		if(item){
			value = item['display.name'];
		}
		
		return value;
	}
}


function setupDmeDisplay(tableName, fieldName, oldValue, newValue, discoveredValue){
	vars.$is_display_field=false;
	if(!isDisplayField(tableName, fieldName)){
		return;
	}
	
	vars.$L_oldValue = ''+getDisplayValue(oldValue);
	var fieldType = funcs.dbdict_helper('field.type', tableName, fieldName);
	vars.$is_array_field=(8==fieldType);
	vars.$is_display_field=true;
	
	vars.$L_data = new SCFile('cm3r');
	if(vars.$is_array_field){
		vars.$L_data.assets = funcs.val(newValue, 8);
	} else {
		vars.$L_data.affected_item = newValue;
	}
	
	if(discoveredValue){
		vars['$L.discoveredValue'] = discoveredValue;
		vars['$L.discoveredValue.display'] = ''+getDisplayValue(discoveredValue);
	}
	
	setupLink(vars.$is_array_field);
}


function setupLink(isArray){
	
	var link = new SCFile('link');
	link["name"]='cm3r';
	var fieldName = isArray?'assets':'affected.item';
	link["source.fields"][0]=fieldName;
	link["target.files"][0]='device';
	link["target.fields"][0]='logical.name';
	
	link["source.fields"][0]=fieldName;
	link["project.target.fields"][0][0]=fieldName;
	link["project.source.fields"][0][0]='logical.name';
	
	link["javascript.post"][0]="vars.$this_value=vars.$File['"+fieldName+"'];";
	
	vars["$L.link"]=link;
}

function populateDmeDisplay(cm3r, dme){
	dme.status = vars.$L_status;
	if(!vars.$is_display_field){
		return;
	}
	
	var fieldName = vars.$is_array_field?'assets':'affected.item';
	dme.status = vars.$L_status;
	dme.newValue = funcs.str(cm3r[fieldName]);
}

function formatArray(value, isArray){
	if(isArray){
		return value.toArray() + '';
	}
	
	if(!value) {
		return value;
	}
	
	var array=funcs.val(value, 8);
	if(funcs.str(array)) {
		return array.toArray()+'';
	}
	
	return value;
}


function makeDisplayValueList(table, nameList, valueList){
    if(!nameList || !valueList) return [];
	var displayList = [];
	for (var k=0;k<nameList.length && k<valueList.length;k++) {
		displayList.push(''+lib.ddmEventHelper.formatValue(table, nameList[k], valueList[k]));
	}
	
	return displayList;
}

function formatValue(table, field, value){
	var display = '';
	if(isDisplayField(table, field)){
		display = ''+lib.ddmEventHelper.getDisplayValue(value);
	} else {
		display = lib.ddmEventHelper.formatArray(value);
	}
	
	return display;
}

function _getDisplayStrValue(value){
	return '' + getDisplayValue(value);
}

function triggerUpdate(_old, _new){
	// var field = _new.oldValue;newValue;fieldName;tableName
	if (isDisplayField(_new.tableName, _new.fieldName)){
		if(_old.oldValue!=_new.oldValue) {
			_new.oldDisplayValue = _getDisplayStrValue(_new.oldValue); 
		}
		
		if(_old.newValue!=_new.newValue) {
			_new.newDisplayValue = _getDisplayStrValue(_new.newValue); 
		}
	}
}


function triggerAdd(_new) {
	if (isDisplayField(_new.tableName, _new.fieldName)){
		_new.oldDisplayValue = _getDisplayStrValue(_new.oldValue); 
		_new.newDisplayValue = _getDisplayStrValue(_new.newValue); 
	}
}
