var $ = lib.c.$;

function isDisplayNameMode() {
	var dsIndex = indexOfDbdictField(lib.upgradeDbdictChangeFieldType.getSchema("device"), "display.name");
	if (dsIndex > 0)
		return true;
	else
		return false;
}


function isPDEnabled(incidentCategory) {
	var isPD = false;
	var obj = $("Object").select('file.name=\"probsummary\"').uniqueResult();
	if (obj && obj["workflowLocation"] != null) {
		isPD = true;
	}
	if(isPD){
		var imCodeCat = $("imCategory").select("name=\""+incidentCategory+"\"").uniqueResult();
		if (imCodeCat && imCodeCat["workflow"]) {
			var catWorkfolwName = imCodeCat["workflow"];
			var catWorkfolw = $("Workflow").select("name=\""+catWorkfolwName+"\"").uniqueResult();
			if(catWorkfolw && catWorkfolw["is.legacy.workflow"] && catWorkfolw["is.legacy.workflow"]==true){
				isPD= false;
			}
		}
	}
	//print("current system ispd is:"+isPD);
	return isPD;
}

function getCIIDByName(name) {
	var ci = $("device").select("logical.name=\"" + name + "\"").uniqueResult();
	if (ci) {
		return ci['logical.name'];
	} else {
		if (isDisplayNameMode()) {
			ci = $("device").select("sm.device.display.name=\"" + name + "\"").uniqueResult();
			if (ci) {
				return ci['logical.name'];
			}
		}
	}
	return name;
}

function cloneUser(oldOperatorName, newName, newFullName, newEmailAddress, newPassord) {
	var opernew = $("operator").select("name=\"" + newName + "\"").uniqueResult();
	if (opernew)
		return;
	var oper = $("operator").select("name=\"" + oldOperatorName + "\"").uniqueResult();
	var contactName = oper["contact.name"];
	if (contactName) {
		var contactNew = $("contacts").select("contact.name=\"" + newName + "\"").uniqueResult();
		if (contactNew)
			return;
		var contactCP = $("contacts").select("contact.name=\"" + contactName + "\"").uniqueResult();
		contactCP["contact.name"] = newName;
		contactCP["full.name"] = newFullName;
		contactCP["operator.id"] = newName;
		contactCP["user.id"] = "SAP000056";
		contactCP["email"] = newEmailAddress;
		contactCP.doInsert("add");
	}

	if (oper) {
		oper["name"] = newName;
		oper["full.name"] = newFullName;
		oper["contact.name"] = newName;
		oper["email"] = newEmailAddress;
		oper["password"] = newPassord;
		oper["never.expire.pass"]=true;		
		oper.doInsert();
	}
}

function addElementOnFormat(format, flags, line, column, length, window, attribute, graph, iutput, onput, subformat, property) {
	if (!format["field"])
		format["field"] = $.createSCArray();
	if (!isExistElementField(format["field"], property)) {
		format["field"].push($.createSCStructure(flags, line, column, length, window, attribute, graph, iutput, onput, subformat, property));
	}
	return format;
}

function insertElementOnFormat(format, flags, line, column, length, window, attribute, graph, iutput, onput, subformat, property, index) {
	if (!format["field"])
		format["field"] = $.createSCArray();
	if (!isExistElementField(format["field"], property)) {
		format["field"] = _insert(
				format["field"],
				$.createSCStructure(flags, line, column, length, window, attribute, graph, iutput, onput, subformat, property),
				index);
	}
	return format;
}

function appendFormatEndTag(format) {
	if (!format["field"])
		format["field"] = $.createSCArray();
	var endProperty = "end;X=1\tY=1\tHeight=2\tWidth=2\t";
	var len = format["field"].length();
	if (format["field"][len - 1]["property"] != endProperty)
		return format;
	format["field"].push($.createSCStructure(4096, 1, 1, 1, 1, null, [], null, "VO", null, endProperty));
	return format;
}

function isExistElementField(fields, property) {
	if (!fields)
		return false;
	var len = fields.length();
	for (var i = 0; i < len; i++) {
		if (fields[i]["property"] == property)
			return true;
	}
	return false;
}

function addCI(logicalName, id, type, deviceType, category, istatus, joinfileName, tempType, assignment) {

	var ci = $("device").select("logical.name=\"" + logicalName + "\"").uniqueResult();
	if (ci)
		return;
	ci = new SCFile("device");
	ci["logical.name"] = logicalName;
	if (isDisplayNameMode())
		ci["display.name"] = logicalName;
	else
		ci["id"] = id;
	ci["assignment"] = assignment;
	ci["type"] = type;
	ci["device.type"] = deviceType;
	ci["category"] = category;
	ci["istatus"] = istatus;
	ci["joinfile.name"] = joinfileName;
	ci.doSave();
}

function addCirelationship(relationshipName, logicalName, relatedCis, relationshipType, relationshipSubtype, concatenatedName) {
	var cs = $("cirelationship").select("relationship.name=\"" + relationshipName + "\" and logical.name=\"" + logicalName + "\"").uniqueResult();
	if (cs)
		return;
	cs = new SCFile("cirelationship");
	cs["relationship.name"] = relationshipName;
	cs["logical.name"] = logicalName;
	cs["related.cis"] = relatedCis;
	cs["relationship.type"] = relationshipType;
	cs["relationship.subtype"] = relationshipSubtype;
	cs["concatenated.name"] = concatenatedName;
	cs.doSave();
}

function addNewLinkLine(linkName, sourceField, priorSourceField, targetFile, targetField, targetFormat, qbeFormat, addQuery, comment,
	projectSourceFields, projectTargetFields, linkExpressions, postExpressions, javascriptPre, javascriptPost) {
	var linkPro = $("link").select("name=\"" + linkName + "\"").uniqueResult();
	if (linkPro) {
		var existSFIndex = $.indexOf(linkPro["source.fields"], sourceField);
		var existTFIndex = $.indexOf(linkPro["target.files"], targetFile);
		var existTFEIndex = $.indexOf(linkPro["target.fields"], targetField);

		if (existSFIndex >= 0 && existTFIndex >= 0 && existTFEIndex >= 0)
			return;

		var insertIndex = linkPro["source.fields"].length();
		if (!$.isEmpty(priorSourceField)) {
			var pIndex = $.indexOf(linkPro["source.fields"], priorSourceField);
			if (pIndex > -1) {
				insertIndex = pIndex + 2;
			}
		}
		linkPro["source.fields"] = _insert(linkPro["source.fields"], sourceField, insertIndex);
		linkPro["target.files"] = _insert(linkPro["target.files"], targetFile, insertIndex);
		linkPro["target.fields"] = _insert(linkPro["target.fields"], targetField, insertIndex);
		if (addQuery)
			linkPro["add.query"] = _insert(linkPro["add.query"], addQuery, insertIndex);

		if (comment)
			linkPro["comment"] = _insert(linkPro["comment"], comment, insertIndex);

		if (qbeFormat)
			linkPro["qbe.format"] = _insert(linkPro["qbe.format"], qbeFormat, insertIndex);

		if (targetFormat)
			linkPro["target.formats"] = _insert(linkPro["target.formats"], targetFormat, insertIndex);

		if (projectSourceFields)
			linkPro["project.source.fields"] = _insert(linkPro["project.source.fields"], projectSourceFields, insertIndex);

		if (projectTargetFields)
			linkPro["project.target.fields"] = _insert(linkPro["project.target.fields"], projectTargetFields, insertIndex);

		if (linkExpressions)
			linkPro["link.expressions"] = _insert(linkPro["link.expressions"], linkExpressions, insertIndex);

		if (postExpressions)
			linkPro["post.expressions"] = _insert(linkPro["post.expressions"], postExpressions, insertIndex);

		if (javascriptPre)
			linkPro["javascript.pre"] = _insert(linkPro["javascript.pre"], javascriptPre, insertIndex);

		if (javascriptPost)
			linkPro["javascript.post"] = _insert(linkPro["javascript.post"], javascriptPost, insertIndex);
	}
	linkPro.doAction("save");
}

function updateLinkLineExpression(linkName, sourceField, linkExpressions, postExpressions, javascriptPre, javascriptPost) {
	var linkPro = $("link").select("name=\"" + linkName + "\"").uniqueResult();
	if (linkPro) {
		var updateIndex = $.indexOf(linkPro["source.fields"], sourceField);
		if (updateIndex < 0)
			return;
		if (linkExpressions)
			linkPro["link.expressions"] = _insert(linkPro["link.expressions"], _parseToExpression(linkExpressions), insertIndex);

		if (postExpressions)
			linkPro["post.expressions"] = _insert(linkPro["post.expressions"], _parseToExpression(postExpressions), insertIndex);

		if (javascriptPre)
			linkPro["javascript.pre"] = _insert(linkPro["javascript.pre"], javascriptPre, insertIndex);

		if (javascriptPost)
			linkPro["javascript.post"] = _insert(linkPro["javascript.post"], javascriptPost, insertIndex);
	}
	linkPro.doSave();
}

function addExtaccessExposeField(extaccess, addCaptionList, addFieldList, addTypeList) {
	if (!extaccess || !extaccess["soacaption"])
		return;

	for (var i = 0; i < addCaptionList.length; i++) {
		if (!$.contains(extaccess["soacaption"], addCaptionList[i])) {
			extaccess["soacaption"].push(addCaptionList[i]);
			extaccess["soafield"].push(addFieldList[i]);
			var len = extaccess["soacaption"].length();
			if (addTypeList[i] == 4) {
				extaccess["soatype"][len - 1] = "BooleanType";
			} else if (addTypeList[i] == 3) {
				extaccess["soatype"][len - 1] = "DateTimeType";
			} else {
				extaccess["soatype"][len - 1] = "";
			}
		}
	}
	//extaccess.doSave();
	return extaccess;
}

function addErddefRecord(file1, file2, counter, reltype, cascadeDeletes, file1NameList, file2NameList) {
	var erddef = $("erddef").select("file1=\"" + file1 + "\" and file2=\"" + file2 + "\" and counter=" + counter).uniqueResult();
	if (erddef) {
		print("erddef exist, add operation will be ignored!");
		return;
	}
	erddef = new SCFile("erddef");
	erddef["file1"] = file1;
	erddef["file2"] = file2;
	erddef["counter"] = counter;
	erddef["reltype"] = reltype;
	erddef["file1.names"] = $.createSCArray();
	erddef["file2.names"] = $.createSCArray();
	for (var i = 0; i < file1NameList.length; i++) {
		erddef["file1.names"].push(file1NameList[i]);
		erddef["file2.names"].push(file2NameList[i]);
	}
	erddef.doSave();
}

function addJoinTable(joinFileName, fileList) {
	var joinfile = $("joindefs").select("join.name=\"" + joinFileName + "\"").uniqueResult();
	if (joinfile) {
		print("joindefs " + joinFileName + "  exist, add operation will be ignored!");
		return;
	}
	joinfile = new SCFile("joindefs");
	joinfile["join.name"] = joinFileName;
	joinfile["join.tables"] = $.createSCArray();
	for (var i = 0; i < fileList.length; i++) {
		var table = $.createSCStructure(fileList[i], null);
		joinfile["join.tables"].push(table);
	}
	joinfile.doSave();
}

function createProcess(name, preExpressions, preJavascript, rad,
	postExpressions, postJavascript,
	nextProcess, processCondition) {

	var process = $("Process").select("process=\"" + name + "\"").uniqueResult();
	if (process) {
		print("Process " + name + " exist now, can't create a new same name one");
		return;
	}

	process = new SCFile("Process");
	process["process"] = name;
	process["pre.expressions"] = preExpressions;
	process["javascript.pre"] = preJavascript;
	process["rad"] = rad;
	process["post.expressions"] = postExpressions;
	process["javascript.post"] = postJavascript;
	process["next.process"] = nextProcess;
	process["process.condition"] = processCondition;
	process.doSave();
	print("successfully create new Process " + name);
	return process;
}

function createMsgs(syslanguage, msgclass, messageId, severity, message) {
	var scmessage = $("scmessage").select("syslanguage=\"en\" and class=\"SMSAP\" and message.id=\"" + messageId + "\"").uniqueResult();
	if (scmessage) {
		print("scmessage class=\"SMSAP\" and message.id=\"" + messageId + "\" had existed");
		return;
	}
	scmessage = new SCFile("scmessage");
	scmessage["syslanguage"] = syslanguage;
	scmessage["_class"] = msgclass;
	scmessage["message.id"] = messageId;
	scmessage["severity"] = severity;
	scmessage["message"] = message;
	scmessage.doSave();
}

function replaceExpression(expression, initExpList, replacedExpList) {
	if (!expression || expression.length() <= 0)
		return expression;
		
	if (!initExpList || initExpList.length <= 0)
		return expression;
		
	if (!replacedExpList || replacedExpList.length <= 0)
		return expression;
		
	if (initExpList.length != replacedExpList.length)
		return expression;

	var newExpression = new SCFile();
	newExpression.setType(8);
	
	if ((typeof initExpList) == "string")
		addedExpList = [addedExpList];
		
	if ((typeof replacedExpList) == "string")
		addedExpList = [replacedExpList];
		
	var exlength = expression.length();
	for (var i = 0; i < exlength; i++) {
		var isHit = false;
		var extStr = _str(expression[i]);
		for (var j = 0; j < initExpList.length; j++) {

			//print(extStr.indexOf(initExpList[j]));
			if (extStr && extStr.indexOf(initExpList[j]) >= 0) {
				newExpression.push(_parseToExpression(replacedExpList[j]));
				isHit = true;
			}
		}
		if (!isHit)
			newExpression.push(_parseToExpression(extStr));
	}
	//print(newExpression);
	return newExpression;
}

function addExpression(expression, addedExpList) {
	if (!addedExpList || addedExpList.length <= 0)
		return expression;
	if (!expression) {
		expression = new SCFile();
		expression.setType(8);
	}
	if ((typeof addedExpList) == "string")
		addedExpList = [addedExpList];
	for (var i = 0; i < addedExpList.length; i++) {
		var isExist = false;
		for (var j = 0; j < expression.length(); j++) {
			var initExp = _str(expression[j]);
			if (addedExpList[i] && initExp && initExp.indexOf(addedExpList[i]) >= 0) {
				isExist = true;
				break;
			}
		}
		if (!isExist)
			expression.push(_parseToExpression(addedExpList[i]));
	}
	return expression;
}


function insertExpression(expression, insertExpList, index) {
	if (!expression || expression.length() <= 0)
		return expression;
	if (!insertExpList || insertExpList.length <= 0)
		return expression;

	if ((typeof insertExpList) == "string")
		insertExpList = [insertExpList];

	var exlength = expression.length();
	var insertIndex = index -1 ;
	if (index < 0)
		insertIndex = exlength + index;
	
	var jsExpressions = expression.toArray();

	var tmpExpression = [];
	for (var x = insertIndex; x < exlength; x++) {
		tmpExpression.push(jsExpressions.pop());
	}
	
	for (var i = 0; i < insertExpList.length; i++) {
		var isExist = false;
		for (var j = 0; j < jsExpressions.length; j++) {
			var initExp = jsExpressions[j];
			if (insertExpList[i] && initExp && initExp.indexOf(insertExpList[i]) >= 0) {
				isExist = true;
				break;
			}
		}
		if (!isExist)
			jsExpressions.push(insertExpList[i]);
	}
	
	var tlen = tmpExpression.length;
	for (var j = tlen - 1; j >= 0; j--) {
		jsExpressions.push(tmpExpression[j]);
	}
	
	var newExpression = new SCFile();
	newExpression.setType(8);
	for(var i=0;i<jsExpressions.length;i++){
	newExpression.push(_parseToExpression(jsExpressions[i]));
	
	}
	return newExpression;
}

function _parseToExpression(str) {
	return system.functions.parse(str, 11);
}

function _parseToLogical(str) {
	return system.functions.parse(str, 4);
}

function addNewFieldToDbdict(scFile, newFieldName, newFieldType, sqlFieldOptions) {
	var scFileDbdict = lib.upgradeDbdictChangeFieldType.getSchema(scFile);
	if (!scFileDbdict) {
		print("Dbdict " + scFile + " can't be found, add field operation will be ingore!")
		return
	}
	var nindex = indexOfDbdictField(scFileDbdict, newFieldName);
	if (nindex) {
		print("Field " + newFieldName + " has existed, add the field operation will be ingore!")
		return;
	}
	lib.upgradeDbdictChangeFieldType.addNewField(scFileDbdict, newFieldName, newFieldType, null, -1, sqlFieldOptions);
}

function addNewTable(scFile, fieldNameList, fieldTypeList, fieldSqlTypeList, keysList, keysTypeList) {
	var scFileDbdict = lib.upgradeDbdictChangeFieldType.getSchema(scFile);
	if (scFileDbdict) {
		print("Dbdict " + scFile + " had existed, add operation will be ingore!");
		return;
	}
	scFileDbdict = new SCFile("dbdict");
	scFileDbdict["name"] = scFile;
	scFileDbdict["root.record"] = -1;
	scFileDbdict["file.options"] = $.createSCStructure(false);
	scFileDbdict["field"] = $.createSCArray();
	scFileDbdict["field"].push(createField("descriptor", 0, 1, 9, null));

	for (var i = 0; i < fieldNameList.length; i++) {
		var sqlOptions = generateSqlFieldOptions("m1", covertSCNameToSqlName(fieldNameList[i]), fieldSqlTypeList[i], false);
		scFileDbdict["field"].push(createField(fieldNameList[i], 1, i + 1, fieldTypeList[i], sqlOptions));
	}

	scFileDbdict["key"] = $.createSCArray();
	for (var i = 0; i < keysList.length; i++) {
		scFileDbdict["key"].push($.createSCStructure(keysTypeList[i], keysList[i], $.createSCArray()));
	}

	scFileDbdict["sql.tables"] = $.createSCArray();
	var sqlTableStructure = $.createSCStructure("null", covertSCNameToSqlName(scFile) + "M1", "m1", $.createSCArray(), $.createSCArray())
		scFileDbdict["sql.tables"].push(sqlTableStructure);
	submit(scFileDbdict);
	print("New dbdict " + scFile + " was created successfully!");
}

function addNewArrayStructureToDbdict(scFile, arrayFieldName, structureFieldNameList, structureFieldTypeList) {
	var scFileDbdict = lib.upgradeDbdictChangeFieldType.getSchema(scFile);
	if (!scFileDbdict) {
		print("Dbdict " + scFile + " can't be found, add field operation will be ingore!")
		return
	}
	var nindex = indexOfDbdictField(scFileDbdict, arrayFieldName);
	if (nindex) {
		print("Array Field " + arrayFieldName + " has existed, add the field operation will be ingore!")
		return;
	}
	var maxIndex = lib.upgradeDbdictChangeFieldType.getMaxFieldIndex(scFileDbdict);
	var arraySqlOptions = generateSqlFieldOptions("m1", covertSCNameToSqlName(arrayFieldName), "IMAGE", true);
	var arrayField = createField(arrayFieldName, 1, maxIndex + 1, 8, arraySqlOptions);
	scFileDbdict.field.push(arrayField);

	var structureField = createField(arrayFieldName, 2, 1, 9, null);
	scFileDbdict.field.push(structureField);

	for (var i = 0; i < structureFieldNameList.length; i++) {
		var arrayFieldTmp = createField(structureFieldNameList[i], 3, i + 1, structureFieldTypeList[i], null);
		scFileDbdict.field.push(arrayFieldTmp);
	}

	if (lib.upgradeDbdictChangeFieldType.submit(scFileDbdict)) {
		print("add new array staructure field " + arrayFieldName + " to dbdict " + scFile + " successfully!");
		return 0
	} else {
		print("add new array staructure field " + arrayFieldName + " to dbdict " + scFile + " failed!");
		return -1;
	}
}

function addNewFieldToStructure(scFile, structureFieldName, newFieldName, newFieldType, sqlFieldOptions) {
	var scFileDbdict = lib.upgradeDbdictChangeFieldType.getSchema(scFile);
	var nindex = indexOfDbdictField(scFileDbdict, newFieldName);
	if (nindex) {
		print("Field " + newFieldName + " has existed, add the field operation will be ingore!")
		return;
	}
	var sindex = indexOfDbdictField(scFileDbdict, structureFieldName);
	if (!sindex)
		return;
	var changed = false;
	var newFields = new SCFile();
	newFields.setType(8);
	for (var i = 0; i < scFileDbdict.field.length(); i++) {
		newFields.push(scFileDbdict.field[i]);
		if (scFileDbdict.field[i].name == structureFieldName && scFileDbdict.field[i].type == 9) {
			changed = true;
			var structureFieldLevel = scFileDbdict.field[i].level;
			var maxIndex = 0;
			for (var j = i + 1; j < scFileDbdict.field.length(); j++) {

				if (j == scFileDbdict.field.length() - 1 && scFileDbdict.field[j].level >= structureFieldLevel + 1) {
					var newField = createField(newFieldName, structureFieldLevel + 1, maxIndex + 1, newFieldType, sqlFieldOptions);
					newFields.push(newField);
					i = j + 1;
				} else if (scFileDbdict.field[j].level >= structureFieldLevel + 1) {
					newFields.push(scFileDbdict.field[j]);
					maxIndex = scFileDbdict.field[j].index;
				} else {
					var newField = createField(newFieldName, structureFieldLevel + 1, maxIndex + 1, newFieldType, sqlFieldOptions);
					newFields.push(newField);
					newFields.push(scFileDbdict.field[j]);
					i = j + 1;
					break;
				}
			}
		}
	}

	if (changed) {
		scFileDbdict.field = newFields;
		if (lib.upgradeDbdictChangeFieldType.submit(scFileDbdict)) {
			print("add new field "+structureFieldName+" to a structure successfully!");
			return 0
		} else {
			print("add new field "+structureFieldName+" to a structure failed!");
			return 1;
		}
	}
}

function _insert(scArray, element, index) {
	if (index < 0)
		index = scArray.length() + index + 1;
	return system.functions.insert(scArray, index, 1, element); ;
}

function _str(strs) {
	return system.functions.str(strs);
}

function _type(obj) {
	return system.functions.type(obj);
}

function covertSCNameToSqlName(fieldName) {
	if (fieldName) {
		fieldName = fieldName.toUpperCase();
		fieldName = fieldName.replace(/\./g, "_");
		return fieldName;
	}
	return null;
}
function generateSqlFieldOptions(tableName, fieldName, fieldType, isRc) {
	var sqlFieldOptions = new SCDatum();
	sqlFieldOptions.setType(system.library.DataTypeConst.typeStructure());
	sqlFieldOptions.push(tableName);
	sqlFieldOptions.push(fieldName);
	sqlFieldOptions.push(fieldType);
	sqlFieldOptions.push(isRc);
	return sqlFieldOptions;
}

function indexOfDbdictField(scFileDbdict, fieldName) {
	for (var i = 0; i < scFileDbdict.field.length(); i++) {
		if (scFileDbdict.field[i].name == fieldName) {
			//found
			return scFileDbdict.field[i].index;
		}
	}
	//not found
	return null;
}

function createField(fieldName, level, index, fieldType, sqlFieldOptions) {
	// a field is of type of structure
	var field = new SCDatum();
	field.setType(system.library.DataTypeConst.typeStructure());
	field.push(fieldName);
	field.push(level);
	field.push(index);
	field.push(fieldType);

	//structure
	field.push(null);
	//db2.field.name
	field.push(null);
	//db2.length
	field.push(null);

	field.push(sqlFieldOptions);

	//structure.array.options
	var structArrayOptions = $.createSCStructure(false, null, null, false);
	field.push(structArrayOptions);

	return field;
}

function submit(scFile) {
	//update to backend RDBMS TABLE
	if (updateDB(scFile) == true) {
		//update dbdict
		if (scFile.doUpdate() == RC_SUCCESS) {
			return true;
		} else {
			//Update of dbdict:rootcausetask failed
			lib.upgradeLog.scError(1115, [scFile.name]);
			return false;
		}
	} else {
		//Update of RDBMS table schema:rootcausetask failed
		lib.upgradeLog.scError(1116, [scFile.name]);
		return false;
	}
}

/**
 * Method: updateDB
 *
 * Update field in the backend RDBMS TABLE
 */
function updateDB(scFile) {
	var rteReturnValue;
	var rteNames = new SCDatum();
	var rteValues = new SCDatum();
	rteNames.push("file");
	rteValues.setType(8);
	rteValues = system.functions.insert(rteValues, 0, 1, scFile);
	var rteReturnValue = new SCDatum();
	//this rad app will have to run in the same thread
	var result = system.functions.rtecall("callrad",
			rteReturnValue,
			"sm.hotfix.create.dbdict", //RAD app name
			rteNames,
			rteValues,
			false); //false to run in same thread, true to run in new thread
	return result;
}
