var underscore = system.library.Underscore;
var _ = underscore.require();

function FieldTypes() {
	return {	
		number:1,
		character:2,
		datetime:3,
		logical:4,
		label:5,
		record:6,
		array:8,
		structure:9,
		expression:11,
		table:22
	};
}

function FieldTypeNames() {
	//TODO:how to localize this??
	return {
		number:"number",
		character:"character",
		datetime:"datetime",
		logical:"logical"
	}
}

function FieldLabelTypes() {
	return {
		IS_ID:"isid",
		IS_DEFAULT:"isdefault",
		IS_TEXT:"istext"
	};
}

function ValidationRuleTypes() {
	return {
		NONE: "none",
		GLOBALLIST:"globallist",
		TABLE_RECORD: "recordintable"
	};
}

function DbFields() {	
	return {
		ID:"id",
		COMPANY:"company",
		FILE_NAME:"file.name",
		FIELD_NAME:"field.name",
		FIELD_TYPE:"field.type",
		FIELD_LABEL:"field.label",
		FIELD_LABEL_TYPE:"field.label.type",
		ORDER:"order",
		ACTIVE:"active",
		GLOBALLIST:"globallist",
		VALIDATION_RULE: "validation.rule",
		MATCH_TABLE: "match.table",
		MATCH_FIELD: "match.field"
	};
}


function FileNameCaptionMapping() {
	var nameMapping = {"cm3r":"Change", "incidents":"Interaction", "probsummary":"Incident"};
	return {		
		findValue: function(key) {
			return nameMapping[key];
		}
	};
}
		  
function DBFields(fieldNames, fieldCaps) {
	return {
		fieldNames: fieldNames,
		fieldCaps: fieldCaps,
		findCaption: function(name) {
			for(var i in fieldNames) {
				if(fieldNames[i] == name) return fieldCaps[i];
			}
		},
		findName: function(caption) {
			for(var i in fieldCaps) {
				if(fieldCaps[i] == caption) return fieldNames[i];
			}
		}
	}	
}

function TableSelection(fieldName) {
	this.tableName = fieldName;
	this.dataSize = vars[fieldName].length();
}
TableSelection.prototype = {
	fixSelectedIndex: function () {
		system.functions.cursor_field_name_set(this.tableName, this.dataSize ? 1 : 0);
	},
	
	getSelectedIndex: function () {
		return this.dataSize ? system.functions.cursor_line(1) : 0;
	},
	
	setSelectedIndex: function (index) {
		if (!this.dataSize)
			index = 0;
		else if (index < 1)
			index = 1;
		else if (index > this.dataSize)
			index = this.dataSize;
		system.functions.cursor_field_name_set(this.tableName, index);
	},
	getDataSize: function() {
		return this.dataSize;
	}
}


function cloneArray(array) {
	if(array == null) return;
	return array.slice(0);
}