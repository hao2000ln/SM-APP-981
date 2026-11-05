var underscore = system.library.Underscore;
var _ = underscore.require();

/* 
* the data type of the field.
*/
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


function FileNameCaptionMapping() {
	var nameMapping = {"cm3r":"Change", "incidents":"Interaction", "probsummary":"Incident"};
	return {		
		findValue: function(key) {
			return nameMapping[key];
		}
	};
}


/* 
* The name of the field type.
*/
function FieldTypeNames() {
	return {
		number:"number",
		character:"character",
		datetime:"datetime",
		logical:"logical",
		array:"array"
	}
}

/* 
* The value of the field label type.
*/
function FieldLabelTypes() {
	return {
		IS_ID:"isid",
		IS_TEXT:"istext"
	};
}

/* 
* The DB field name of the config table.
*/
function DbFields() {	
	return {
		ID:"id",
		COMPANY:"company",
		DEST_FILE_NAME:"dest.file.name",
		DEST_FIELD_NAME:"dest.field.name",
		DEST_FIELD_TYPE:"dest.field.type",
		QUESTION_LABEL:"question.label",
		ANSWER_TYPE:"answer.type",
		ORDER:"order",
		MANDATORY_CONDITION:"mandatory.condition",
        CUSTOM_ANSWER_ALLOWED:"custom.answer.allowed",
		GLOBALLIST:"global.list"
	};
}

/* 
* Get the DB field.
*/		  
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

/* 
* Select the givin field record by the field name in the grid.
*/
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

/* 
* Clone an array list.
*/
function cloneArray(array) {
	if(array == null) return;
	return array.slice(0);
}