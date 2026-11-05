/** 
 * @fileoverview This javascript is use to copy computer data to node due to Configuration change after uCMDB enhancement
 * please review to javscript TestCopyDataToNode for more test script help
 * using steps:
 * 1. define the data mapping, i.e. mappingComputer, support simple fields, array and array of structure
 * 2. run lib.CopyDataToNode.copyData(mapping) to copy the data
 * 3. based on the document to change the devtype definition
 * 4. search a computer to confirm the records are associate with joinnode. mapped data are kept.
 */
var $ = lib.c.$;

var dbdictService;
var dataService;
var dbdict;
var descriptorSourceMeta;
var descriptorTargetMeta;
var pattern=/([a-zA-z][.\w]*?)(?=\s*(!=|~=|==|=|>|>=|<|<=))/g;


/**
sort the result via captions. remove the duplicate fields name
**/
function sortAndRemoveDuplicateResult(mapping) {
	//sort fields
	var fields = mapping.fields;

	var i;

	var nameList = [];
	var length = fields.length();
	for (i = 0; i < length; i++) {

		var name = fields[i].target_field;
		if (name == null || name == "") {
			continue;
		}
		if (lib.ArrayUtil.contains(nameList, name)) {
			fields[i].target_field = "";
		}
		else {
			nameList.push(name);
		}
	}

	for (i = fields.length() - 1; i >= 0; i--) {
		if (fields[i].target_field == null || fields[i].target_field == "") {
			mapping.fields = funcs._delete(mapping.fields, i + 1);
		}
	}

	vars.$L_rc = funcs.rtecall("sort", vars.$L_rc, mapping.fields, 1, 0);

	//sort mapping
	for (i = mapping.mapping.length() - 1; i >= 0; i--) {
		if (mapping.mapping[i].group == null || mapping.mapping[i].target_mapping == null || mapping.mapping[i].target_mapping == "") {
			mapping.mapping = funcs._delete(mapping.mapping, i + 1);
		}
	}
	
	vars.$L_rc = funcs.rtecall("sort", vars.$L_rc, mapping.mapping, 0, 0);
}


function showAllFields(dbdictname, onlyShowMainTable) {
	var  list = [];
	if(dbdictname==null) {
		return list;
	}
	
	var dbdict = $(dbdictname).dbdict();
	
	var dbdictService = $("#dbdictService");
	
	var descriptorMeta = dbdictService.getDescriptorMeta(dbdict["field"]);
	
	var primaryTable = dbdictService.getPrimaryTable(dbdict);
	
	var primaryTableAlias = primaryTable["sql.table.alias"];
	
	var dbFields = [];
	
	var firstChilds = descriptorMeta.childs;
	var i;
	for (i = 0; i < firstChilds.length; i++) {
		var child = firstChilds[i];
		var childField = child.field;
		var foption = childField["sql.field.options"];
		if(onlyShowMainTable){
			//only add field with out structure field.
			if (childField["type"] == 8 ) {
				if($.isEmpty(foption["sql.column.name"]) && child.childs!=null && child.childs.length==1 &&  child.childs[0].field["type"] != 9 && child.childs[0].field["sql.table.alias"] == primaryTableAlias) {
					list.push(child.path);
				}
			}else if (!$.isEmpty(foption["sql.column.name"]) &&  foption["sql.table.alias"] == primaryTableAlias) {
				list.push(child.path);
			} 
			
		}else{
            if (childField["type"] == 9) { //structure
                list.push(child.path);
                
                var j;
                for (j = 0; j < child.childs.length; ++j) {
                    var child2 = child.childs[j];
                    var childField2 = child2.field;
                    list.push(child2.path);
                }
            } else {
                list.push(child.path);
            }
        }
    }
	list.sort();
	return list;
}


function pad2(number) {
    var str = String(number);
    while (str.length < 2) {
        str = '0' + str;
    }
    return str;
}


function convertToSql( sql) {
	if(sql==null) {
		sql="";
	}
	sql = convertNullStr(sql); // convert condition 'null(xxx)' to  'xxx=null' or similiar
	var match;
	pattern.lastIndex = 0;
	var newSql=[];
	var lastEndPostion=0;
	
	while ((match = pattern.exec(sql)) != null) { 
		var beginPos = match.index;
		var endPos   = pattern.lastIndex;
		newSql.push(["sql",sql.substring(lastEndPostion,beginPos)]);
		lastEndPostion=endPos;
		var field=getFieldName(match[1]);
		var sqlType="column";
		if(field==null) {
			field=match[1];
		}
		else if(field != match[1]){
			 var sourceType=getFieldType(match[1],descriptorSourceMeta);
			//if the type is date(3), don't convert the quote
			if(sourceType==3){
				sqlType="datetime";
			}
		} 
		
		newSql.push([sqlType,field]);
	}
	if(lastEndPostion!=sql.length){
	  newSql.push(["sql",sql.substring(lastEndPostion,sql.length)]);
	}
	
	var returnStr="";
	
	var i;
	for(i=newSql.length-1;i>=0;i--){
		var type=newSql[i][0];
		if(type=="sql"){
			if(i>0 && newSql[i-1][0]=="datetime"){ //don't replace ' for it is time.
				 var dateValue=newSql[i][1].replace(/^.*('.*').*$/g,"$1");
				 returnStr = newSql[i][1].replace(dateValue,UTCDate(dateValue))
				.replace(/[!~]=\s*null(?!=\w)/g, " is not null ")
				.replace(/=\s*null(?!=\w)/g, " is null ")
				.replace(/~=/g, "<>") 
				.replace(/"/g, "'")
				+ returnStr;
		    }else{
			    returnStr =newSql[i][1]
				.replace(/[!~]=\s*null(?!=\w)/g, " is not null ")
				.replace(/=\s*null(?!=\w)/g, " is null ")
				.replace(/~=/g, "<>") 
				.replace(/'/g, "''").replace(/"/g, "'")
				+ returnStr;
			}
			
		}else if(type=="column" || type=="datetime"){
			returnStr = newSql[i][1] + returnStr;
		}
	
	}
	
	return returnStr;
}		 

function UTCDate(dateStr){
  var dt=funcs.val(dateStr.replace(/'/g, ""),3);
	if(dt!=null){
		var localTime = dt.getTime();
		var localOffset=dt.getTimezoneOffset()*60000; 
		var utc = localTime + localOffset; 
		dt=new Date(utc);
		var dtstring = dt.getFullYear()
	    + '-' + pad2(dt.getMonth()+1)
	    + '-' + pad2(dt.getDate())
	    + ' ' + pad2(dt.getHours())
	    + ':' + pad2(dt.getMinutes())
	    + ':' + pad2(dt.getSeconds());
	 return "'"+dtstring+"'";
	}
   	return dateStr;
}						

function validate(mapping, valueMapping) {
	dbdictService = $("#dbdictService");
    dataService = $("#dataService");
    dbdict = $(mapping.target_table).dbdict();
    descriptorTargetMeta = dbdictService.getDescriptorMeta(dbdict["field"]);
    var sdbdict = $(mapping.source_table).dbdict();
    descriptorSourceMeta = dbdictService.getDescriptorMeta(sdbdict["field"]);
    var dbType = dbdict["sql.tables"][0]["sql.db.type"];
	
    if (mapping.batch && mapping.target_table!=mapping.source_table) {
		funcs.msg(funcs.scmsg(9, "migrationSetting"), 3);
		return false;
	}
	//build sql
	if( mapping["query"]==null || mapping["query"]==""){
		mapping["query"]="true";
	}
	if (valueMapping == null) {
		valueMapping = {};
	}
	//group value mapping condition

	var i, total;
	for (i = 0, total=mapping.mapping.length(); i < total; i++) {
		if (mapping.mapping[i].group == null) {
			continue;
		}
		var valueItems = [];
		if (valueMapping[mapping.mapping[i].group] != null) {
			valueItems = valueMapping[mapping.mapping[i].group];
		}
		var mappingType = [];
		valueMapping[mapping.mapping[i].group] = valueItems;
		var valueItem = {};
		valueItem["type"] = mapping.mapping[i].type_mapping;

		//verify batch update only support fixedValue and sourceField
		if (!mapping.batch) {

			valueItem["target"] = mapping.mapping[i].target_mapping;
			valueItem["source"] = mapping.mapping[i].source_mapping;

		}
		else {
			if (valueItem["type"] != "fixedValue" && valueItem["type"] != "sourceField") {
				funcs.msg(funcs.scmsg(8, "migrationSetting"), 3);
				return false;
			}
			valueItem["target"] = mapping.mapping[i].target_mapping;
			if (valueItem["type"] == "fixedValue") {
				var targetFieldType = getFieldType(mapping.mapping[i].group);
				if (targetFieldType == 2 ) { //handle string and date type
					valueItem["target"] = "'" + valueItem["target"].replace(/'/g, "''") + "'";
				}else if (targetFieldType == 3 ) {
					//convert to iso date 
					if(mapping.batch){
 					  valueItem["target"] = UTCDate(valueItem["target"]);
				    
					}
				}
				else if (targetFieldType == 4) { //handle true/false
					if (valueItem["target"] == "true") {
						valueItem["target"] = "'t'";
					}
					else if (valueItem["target"] == "false") {
						valueItem["target"] = "'f'";
					}
					else {
						valueItem["target"] = "NULL";
					}
				}
			}else if (valueItem["type"] == "sourceField") {
				if(getFieldName(valueItem["target"])==null){
				  funcs.msg(funcs.scmsg(4, "migrationSetting",[valueItem["target"]]), 3);
				  return false;
				}
			}
			if (mapping.mapping[i].source_mapping != null && mapping.mapping[i].source_mapping != "") {
				valueItem["source"] = mapping.mapping[i].source_mapping;
			}
			//if next line is same field, the source field is mandatory
			if(i<total-1 && mapping.mapping[i].group==mapping.mapping[i+1].group && valueItem["source"] ==null){
				funcs.msg(funcs.scmsg(3, "migrationSetting",[i+1,valueItem["target"]]), 3);
				return false;
			}

		}
        valueItem["matchConditon"] = valueItem["source"];
        if (valueItem["matchConditon"]) {
            var matchConditon = valueItem["matchConditon"];
            matchConditon = matchConditon.replace(pattern, "$1 in $L.tmp.file");
            matchConditon = matchConditon.replace(/([.\w]+ in \$L.tmp.file)=\s*null(?!=\w)/g, "null($1)").replace(/([.\w]+ in \$L.tmp.file)~=\s*null(?!=\w)/g, "not null($1)");
            if (matchConditon != "") {
                valueItem["matchConditon"] = "$L.matched=(" + matchConditon + ")";
            } else {
                valueItem["matchConditon"] = null;
            }
        }
		valueItems.push(valueItem);

	}
	
	if(vars.$L_file.source_table==vars.$L_file.target_table){
        vars.$targetfields=vars.$sourcefields=showAllFields(vars.$L_file.source_table,vars.$L_file.batch);
	 }else{
	 	vars.$sourcefields=showAllFields(vars.$L_file.source_table,false);
		vars.$targetfields=showAllFields(vars.$L_file.target_table,false);
	 }

	//verify all the field should be mapped
	var length = mapping.fields.length();
	for (i = 0; i < length; i++) {
		var field=mapping.fields[i];
		if (field == null || $.isEmpty(field.target_field)) {
				continue;
			}
		var target_field = field.target_field;
		var source_field = field.source_field;	
		
		if (target_field != null && valueMapping[target_field] == null && $.isEmpty(source_field)) {
			funcs.msg(funcs.scmsg(7, "migrationSetting", [target_field]), 3);
			return false;
		}
		
		//verify all the fields are vaild
		if(!$.isEmpty(target_field) && !lib.ArrayUtil.contains(vars.$targetfields, target_field)){
			funcs.msg(funcs.scmsg(4, "migrationSetting", [target_field]), 3);
			return false;
		}
		
        var targetType = getFieldTypeByPath(field.target_field, descriptorTargetMeta);
        field.target_type = targetType.type;
		if($.isEmpty(source_field) ){
			continue;
		}
		
		if(!$.isEmpty(source_field) && !lib.ArrayUtil.contains(vars.$sourcefields, source_field)){
			funcs.msg(funcs.scmsg(4, "migrationSetting", [source_field]), 3);
			return false;
		}
	
        var sourceType = getFieldTypeByPath(field.source_field, descriptorSourceMeta);
        field.source_type = sourceType.type;

        //verify the type match
        if (targetType.type != sourceType.type || targetType.compoundTypeDesc != sourceType.compoundTypeDesc) {
            
            funcs.msg(funcs.scmsg(12, "migrationSetting", [source_field, target_field]), 3);
            return false;
        }
		
	}
	
	//speacail fix for query synax
	var query=covertToSMQuery(mapping["query"]);
	var countTotal=new SCFile(mapping.source_table, SCFILE_READONLY).doCount(query);
	vars.$record_count=funcs.scmsg(10, "migrationSetting",[countTotal]);
	if(countTotal==0){
	    funcs.msg(funcs.scmsg(2, "migrationSetting"), 2);
		return false;
	}

	if(mapping.fields.length()==0){
	    funcs.msg(funcs.scmsg(1, "migrationSetting"), 3);
		return false;
	}
	
	return true;
}

function covertToSMQuery(sql){
	return sql.replace(/([a-zA-z][.\w]*?)\s*=\s*null(?!=\w)/g, "null($1)").replace(/([a-zA-z][.\w]*?)\s*~=\s*null(?!=\w)/g, "not null($1)");
}

function getFieldName( fieldName, mate){
	if(mate==null){
	mate=descriptorTargetMeta;
	}
 	var fieldMeta = dbdictService.getFieldMeta(fieldName,mate);
	if(fieldMeta==null){
	  return null;
	}		
	var field = fieldMeta.field;

	var sqlFieldName = field["sql.field.options"]["sql.column.name"];
	return dataService.escapeField(dbdict,sqlFieldName);
}

function getFieldType(fieldName, mate){
	if(mate==null){
	mate=descriptorTargetMeta;
	}
	var field=dbdictService.getFieldMeta(fieldName,mate);
	if(field!=null){
	 return field.field["type"];
	}else{
	 return null;
	}
}

function getFieldChildTypes(fieldName, mate){
	if(mate==null){
	mate=descriptorTargetMeta;
	}
	var field=dbdictService.getFieldMeta(fieldName,mate, false);
	if(field!=null){
	 var fields=[];
	 var i;
	 for(i=0;i<field.childs.length;i++){
	 	fields.push(field.childs[i].field["type"]);
	 }
	 return fields.join(",");
	}else{
	 return null;
	}
}

function copyData(mapping) {

	//build sql
   	
	var valueMapping = {};
	validate(mapping, valueMapping);
	var table = dbdictService.getPrimaryTable(dbdict)["sql.table.name"];
	var setCond = "";
	var i, length = mapping.fields.length();
	for (i = 0; i < length; i++) {

		var field = mapping.fields[i];
		if (field == null ||$.isEmpty(field.target_field)) {
				continue;
		}
		if (setCond != "") {
			setCond += " , ";
		}
		targetFieldName=getFieldName(field.target_field);
		sourceFieldName=field.source_field;
		if(sourceFieldName!=null && sourceFieldName!=""){
			sourceFieldName=getFieldName(field.source_field);
		}else{
			sourceFieldName=targetFieldName;
		}	
		if (valueMapping[field.target_field] != null) {
			var valueItems = valueMapping[field.target_field];
			var fieldUpdate = "";

			var useCaseWhen=true;
			var j;
			for (j = 0; j < valueItems.length; j++) {
				var valueItem = valueItems[j];
				var targetValue=valueItem["target"];
				if (valueItem["type"] == "sourceField") {
				 targetValue=getFieldName(targetValue);
				}
				if (!$.isEmpty(valueItem["source"])){
					fieldUpdate += " WHEN " + convertToSql(valueItem["source"]) + "  THEN " +targetValue ;
					if ( j == valueItems.length - 1){
						fieldUpdate += " ELSE " + sourceFieldName;
					}
				}else if(valueItems.length == 1){ //only one item without condition.
				   setCond += "\r\n          " + targetFieldName + "=" + targetValue;
				   useCaseWhen=false;
				}else if($.isEmpty(valueItem["source"])){
				   fieldUpdate += " ELSE " + targetValue;
				}else {
				   fieldUpdate += " ELSE " + sourceFieldName;
				}
				
			}
			if (useCaseWhen && fieldUpdate != "") {
				setCond += "\r\n          " + targetFieldName + " = (CASE   " + fieldUpdate + " END)";
			}
		}
		else { //if no value mapping, use the field mapping
			var sourceFieldName = getFieldName( field.target_field);
			setCond += "\r\n          " + targetFieldName + "=" + sourceFieldName;
		}

	}

	sql = "update " + table + " set " + setCond;
	
	if( mapping["query"]!=null && mapping["query"]!="" && mapping["query"]!="true"){
		sql += " \r\nwhere " +  convertToSql( mapping["query"]);
	}
	
	return sql;
}

function mapFields(mapping, sourceTable, targetTable, valueMapping) {
    var fieldLength = typeof (mapping.fields.length) == "number" ? mapping.fields.length : mapping.fields.length();
    var i;
    for (i = 0; i < fieldLength; i++) {
        var field = mapping.fields[i];
        if (field == null || $.isEmpty(field.target_field)) {
            continue;
        }
        //the type of the target field, need use this to convert number to string.
        var targetFieldType = field.target_type;
        if (valueMapping[field.target_field] != null) {
            var valueItems = valueMapping[field.target_field];
            var valueItem;
            var matchedIndex = -1;
            var j;
            for (j = 0; j < valueItems.length; j++) {
                valueItem = valueItems[j];
                if (valueItem["matchConditon"] != null) {
                    vars.$L_tmp_file = sourceTable;
                    try {
                        funcs.parse_evaluate(valueItem["matchConditon"], 11); //;$L.f=rtecall(\"msg\",$L.s,$L.tmp)
                    } catch (e) {
                        print(e);
                    }
                    if (vars.$L_matched) {
                        matchedIndex = j;
                        break;
                    }

                } else { //only one item without condition.
                    matchedIndex = j;
                }
            }

            if (matchedIndex > -1) {
                valueItem = valueItems[matchedIndex];
                if (valueItem["type"] == "fixedValue") {
                    targetTable[field.target_field] = funcs.val(valueItem["target"], targetFieldType);
                } else if (valueItem["type"] == "sourceField") {
                    targetTable[field.target_field] = funcs.val(sourceTable[valueItem["target"]], targetFieldType);
                } else if (valueItem["type"] == "jsCallback") {
                    var $value = "_not used_";
                    eval(valueItem["target"]);
                    if ($value != "_not used_") {
                        targetTable[field.target_field] = funcs.val($value, targetFieldType);
                    }
                }
            } else { //if no match, use the field mapping.
                if (!$.isEmpty(field.source_field)) {
                    targetTable[field.target_field] = funcs.val(sourceTable[field.source_field], targetFieldType);
                }
            }

        } else { //if no value mapping, use the field mapping
            if (!$.isEmpty(field.source_field)) {
                targetTable[field.target_field] = funcs.val(sourceTable[field.source_field], targetFieldType);
            }
        }

    }
}

function copyDataByClone(mapping) {

    var valueMapping = {};
    validate(mapping, valueMapping);

	var todoKey = getTodoKey(mapping.source_table);
    var dbdict = dbdictService.getValidDbdict(mapping.source_table);
    var pkScource = dbdictService.getPrimaryKey(dbdict.key)[1];
    dbdict = dbdictService.getValidDbdict(mapping.target_table);
    var pkTarget = dbdictService.getPrimaryKey(dbdict.key)[1];
    var keyMapping = null;
    if (!lib.Underscore.require().isEqual(pkScource, pkTarget)) {
        keyMapping = {
            fields: []
        };
        
        var i, ilength = pkTarget.length();
        for (i = 0; i < ilength; ++i) {
            
            var j, jlength = mapping.fields.length();
            for (j = 0; j < jlength; j++) {
                var field = mapping.fields[j];
                if (field == null || $.isEmpty(field.target_field)) {
                    continue;
                }
                
                if (pkTarget[i] == field.target_field) {
                	keyMapping.fields.push(field);
                }
            }
        }
    }

    var filter = mapping.filter;
    var skipCurrent = false;
    var $sourceTable = new SCFile(mapping.source_table); //query can use join
    var sql = covertToSMQuery(mapping["query"]);
    var totalCount = $sourceTable.doCount(sql);
    var ret = $sourceTable.doSelect(sql);
    var dataService = $("#dataService");
    var recordCount = 0;
    var skipTotal=0;
    
  	// disable trigger
  	var triggerStatus = funcs.sysinfo_get("trigger");
  	var retvalue;
  	funcs.rtecall("trigger", retvalue, 0);
    
    while (ret == RC_SUCCESS) {

        var tagQuery = lib.DBUtils.getQueryByRecord($sourceTable);
        if (filter) {
            skipCurrent = false;
            eval(filter);
            if (skipCurrent) {
                print(funcs.scmsg(13, "migrationSetting", [1 + recordCount, totalCount, tagQuery]));
                recordCount++;
                skipTotal++;
                ret = $sourceTable.getNext();
                continue;
            }
        }

        var $targetTable = new SCFile(mapping.target_table);
        if (todoKey) {
            var fTodo = new SCFile("Todo");
            var todoExist = fTodo.doSelect("record.id=\"" + funcs.str($sourceTable[todoKey]) + "\"");
	        if (todoExist == RC_SUCCESS) {
	            fTodo.doRemove();
	        }
        }
        
        print(funcs.scmsg(5, "migrationSetting", [1 + recordCount, totalCount, tagQuery]));
        if (keyMapping) {
            mapFields(keyMapping, $sourceTable, $targetTable, valueMapping);
            tagQuery = lib.DBUtils.getQueryByRecord($targetTable);
        }
        
        var targetExist = $targetTable.doSelect(tagQuery); //query the record to make it mergeable
        
        if (targetExist != RC_SUCCESS) {
            $targetTable = new SCFile(mapping.target_table);
        }
        mapFields(mapping, $sourceTable, $targetTable, valueMapping);
        recordCount++;
        $targetTable.doSave();
        
        //QCRQ1E99015 [PbM] Separate Known Error from Problem (Part 4) - Data Migration
        var sourceRecord = $sourceTable;
        var targetRecord = $targetTable;
        if (mapping.post_script) {eval(mapping.post_script);}
        
        ret = $sourceTable.getNext();
    }
    
    // enable trigger
  	funcs.rtecall("trigger", retvalue, triggerStatus);
    
    print(funcs.scmsg(11, "migrationSetting", [recordCount-skipTotal]));
    if (skipTotal>0) {
    	print(funcs.scmsg(14, "migrationSetting", [skipTotal]));
    }
}

function strReplacer(chArr, start, escape) {

    var strStart = chArr.indexOf('"', start);
    if (strStart != -1) {
    	var i;
        for (i = strStart + 1; i < chArr.length; ++i) {
            var ch = chArr[i];
            if (ch == '"' && chArr[i - 1] != '\\') {
                var str = chArr.substr(strStart, i - strStart + 1);
                //print(str);
                if (escape) {
                    str = str.replace(/and/g, "&and&");
                    str = str.replace(/or/g, "&or&");
                } else {
                    str = str.replace(/&and&/g, "and");
                    str = str.replace(/&or&/g, "or");
                }
                return {
                    start: strStart,
                    tail: i,
                    replace: str
                };
            }
        }
    }

    return null;
}

function preProcessStr(str, locateReplacer, escape) {
    if (!str || str == "") {
    	return;
    }
    var pos = [];
    var posAll = [0];
    var start = 0;
    var lastEnd = 0;
    var strResult = "";
    do {
        found = locateReplacer(str, lastEnd, escape);
        if (found) {
            strResult = strResult + str.substr(lastEnd, found.start - lastEnd) + found.replace;
            lastEnd = found.tail + 1;
        } else {
            strResult = strResult + str.substr(lastEnd, str.length - lastEnd);
            break;
        }

    } while (true);

    //print(strResult);
    return strResult;
}

function convertNullStr(str){  
    str = preProcessStr(str, strReplacer, true);
	var arr = [];
	var split1 = str.split("and ");  // seperate when 'and'.
	var rtn="";
	var pvalue;
	var i;
	for (i=0; i<split1.length;i++) {	 
		split1[i] = trim(split1[i]);
		if (i>0) { 	
			split1[i]= " and "+split1[i];
		}
		if (split1[i].indexOf(" or ")>0) { 
			var split2 = split1[i].split(" or ");  //// seperate when 'or'.
			var j;
			for (j=0; j<split2.length; j++) {
				pvalue=convertSingleNull(split2[j]);
				
				if (j<split2.length-1) 	{	
					pvalue = pvalue+" or "; 
				}
				arr.push(pvalue);
			}
		}
		else  {
			pvalue = convertSingleNull(split1[i]); 
			arr.push(pvalue);
		}
	}

	var k;
	for (k=0;k<arr.length;k++) {
		rtn+=arr[k];
	}
	
    rtn = preProcessStr(rtn, strReplacer, false);
	return rtn; 
}

function convertSingleNull(str) { // convert null(xxx) to xxx=null or not null(zzz) to zzz~=null
 	var split3;
 	var rtn="";
 	var tarr;
 	var j;
 	if (str.indexOf("not null(")>=0) 	{ 
		tarr = str.split("not null(");
		tarr[1] = tarr[1].replace(")","");
		split3= tarr[1].split(")");
		rtn = tarr[0]+split3[0]+"~=null";
		for (j=0;j<split3.length-1; j++) {
			rtn+=")";
		}	
		return rtn;
 	}
	if (str.indexOf("null(")>=0 && str.indexOf("not null(")<0)  {
		tarr = str.split("null(");
		tarr[1] = tarr[1].replace(")","");
		split3= tarr[1].split(")");
		rtn = tarr[0]+split3[0]+"=null";
		for (j=0;j<split3.length-1; j++)  {
			rtn+=")";
		}	
		return rtn;
 	} 

 	else { 	
		return str;
	}
}

function trim(str)  {  // remove the blank space, tab before and after the string
	var pattern = new RegExp("^[\\s]+","gi");
	var str2 = str.replace(pattern,"");
	var pattern2 = new RegExp("^[\\s]+","gi");
	return str2.replace(pattern,"");
}

function getFieldTypeByPath(path, meta) {
    var fieldMeta = dbdictService.getFieldMeta(path, meta, false);
    var compoundTypeDesc = null;
    if (fieldMeta.childs != null) {
        compoundTypeDesc = getCompoundType(fieldMeta);
        compoundTypeDesc = lib.JSON2.toJSON(compoundTypeDesc);
    }

    return {
        type: fieldMeta.field.type,
        compoundTypeDesc: compoundTypeDesc
    };
}

function getCompoundType(fieldMeta) //{me:8, childs:[{me:1}]}
{
    var typeDesc = {};
    typeDesc.me = fieldMeta.field.type;
    if (fieldMeta.childs != null && fieldMeta.childs.length > 0) {
    	typeDesc.childs = [];
    }
    var i;
    for (i = 0; i < fieldMeta.childs.length; i++) {
        typeDesc.childs.push(getCompoundType(fieldMeta.childs[i]));
    }
    return typeDesc;
}

function getTodoKey(filename)
{
	var todoMap = $("TodoMap", SCFILE_READONLY).setFields(["ToDo.field", "module.field"]).select("name=\""+filename+"\"").uniqueResult();
	if(todoMap)
	{
		var i, length = todoMap['ToDo.field'].length(); 
		for(i=0;i<length;++i)
		{
			if(todoMap['ToDo.field'][i]=="record.id") {
				return todoMap['module.field'][i];
			}
		}	
	}
	return null;
}
