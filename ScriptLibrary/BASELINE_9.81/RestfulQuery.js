var restRC = lib.RestfulConstant.getReturnCode();
var MaxCount = lib.RestfulConstant.getMaxCount();
var MaxConditionsPerQuery = 1000;// Max number of conditions in one query, used in pagination
var restm=lib.RestfulMain;
var _e = lib.StringUtil.escapeAllStr;

/**
* process get action for rest API
* @param {object} options - Options input by user
* @param {array} uri - uri input by user. [filename, id1 ...]
* @param {file} config - extaccess record related to the rest service

* @return {object} - error message if failed. json object if succeed.
**/
function processQuery(options, uri, config)
{
    
    try{
        var queryConditon = config['rest.query.rights'] == null ? 'true' : config['rest.query.rights'];
        if (!funcs.parse_evaluate(queryConditon, 4)){
            return restm.makeErrorMsg(restRC['no auth'], funcs.scmsg('3', 'restful', [uri[0], queryConditon]));
        }
        
        var query = options.query;
        var dbdict = restm.getdbdict(config.name);
        var values = uri.slice(1);
        
        var isMultiple = uri.length == 1;
        
        var listType = 1; //default listType is id only
        
        var maxRecordsPerPage = MaxCount;
        if (config['max.records.page'])  {
            maxRecordsPerPage = config['max.records.page'];
            if (maxRecordsPerPage==0){
                maxRecordsPerPage = MaxCount;
            }
        }
        
        var start = 1;
        var count = maxRecordsPerPage;
        
        if (isMultiple) {
            if (options.view == 'summary'){
                listType = 0;//count only
            } else if (options.view == 'expand'){
                listType = 2;//all fields
            }
            if (options.start != null) {                
                if (!isInteger(options.start)){
                    return restm.makeErrorMsg(restRC['badval'], funcs.scmsg('33', 'restful', ["start", options.start]));
                }
                
                start = parseInt(options.start, 10);
            }
            
            if (start < 1) {
                start = 1;
            }
            
            if (options.count != null)   {
                if (!isInteger(options.count)){
                    return restm.makeErrorMsg(restRC['badval'], funcs.scmsg('33', 'restful', ["count", options.count]));
                }
                
                count = parseInt(options.count, 10);
                
                if (0==count){
                    listType = 0;
                }
                if (count < 0) {
                    return restm.makeErrorMsg(restRC['badval'], funcs.scmsg('16', 'restful', [count.toString()]));
                }
                
                if (count>maxRecordsPerPage){
                    count = maxRecordsPerPage;
                }
        
            } else {
                count   = maxRecordsPerPage;
            }
        } else {
            listType = 2;
        }
        
        if (log.isDebugEnabled()) {
            log.debug("query0", query);
        }
        var queryFields = resolveQueryFields(query, values, config, dbdict);
        
        if (queryFields[0].length > 0){
            return restm.makeErrorMsg(restRC['badval'], funcs.scmsg('8', 'restful', [queryFields[0].toString()]));
        }
    
        query = queryFields[1];
        if (log.isDebugEnabled()) {
            log.debug("query1 after resolveQueryFields", query);
        }
        if (getRTEParm('disablejscallFromRestURL')=='1') {
            var regMatcher = /(jscall\s*\()(?=(?:[^"]|"[^"]*")*$)/;
            var qryTmp=query;
            qryTmp=qryTmp.replace(/\\\"/g, '');
            var d = qryTmp.match(regMatcher);
            if (d!=null)
            {
              log.debug("Cannot call jscall from URL.");
              return restm.makeErrorMsg(restRC['badval'], "Invalid URL");
            }
        }
        // convert field caption to field names.
        query = new SCFile(config.name).convertQuery(config, query);
        if (log.isDebugEnabled()) {
            log.debug("query2 after convertQuery", query);
        }
        
        if (query.toLowerCase().match(/^select\s/)) {
            return restm.makeErrorMsg(restRC['badval'], funcs.scmsg('387', 'scjsdesc', [queryFields[0].toString()])+": "+query);
        }
        
        var fieldList = config.soafield;
        var captionList = config.soacaption;
        var soapTypeList = config.soatype;
        
        var fieldMap = {};
        var k, length = captionList.length();
        for ( k=0;k<length;k++){
            if (null!=captionList[k]) {
                fieldMap[captionList[k]] = fieldList[k];
            }
        }
        
        var sort = makeSort(options.sort, fieldMap);
    
        if (null==sort){
            return restm.makeErrorMsg(restRC['badval'], funcs.scmsg('5', 'restful'));
        }

        var ret = queryEngine(config.name, query, sort.sort, sort.sortorder, listType, isMultiple, start, count, config['rest.keys'].toArray(), fieldList, dbdict);
    
        if (log.isDebugEnabled()){
            log.debug("RestfulQuery::processQuery::ret.returnCode = " + ret.returnCode);
        }
        
        if (ret.returnCode != restRC['success']){
            return restm.makeErrorMsg(ret.returnCode, ret.message, isMultiple);            
        }
        
        if (ret.count > 1 && values != null && values.length > 0){
            return restm.makeErrorMsg(restRC['badval'], funcs.scmsg('26', 'scxmlapi'));
        }
            
        // if only return keys, then need to retrieve the keys' caption from extaccess config
        if (listType == 1) {
            var keyList = config['rest.keys'];
            var keyCaptions = restm.getCaptions(keyList, fieldList, captionList);
            fieldList = keyList;
            captionList = keyCaptions;
        }
        
        if (isMultiple){
            if (listType != 0){
                var array = [];
                var recordIndex = 1;
                var i;
                for (i = 0; i < ret.file.length && i <= count; i++) {
                    do{
                        array.push(restm.file2Object(ret.file[i], fieldList, captionList, soapTypeList, config['rest.resource.name']));                
                        var rc = ret.file[i].getNext();
                        recordIndex++;
                    } while (rc == RC_SUCCESS && recordIndex <= count);
                }
                return restm.toJson(array, ret, true, config['rest.resource.name'], start, ret.message);    
            } else {
                return restm.toJson(null, ret, true, config['rest.resource.name'], start, ret.message);    
            }
        } else {
            var file = restm.file2Object(ret.file[0], fieldList, captionList, soapTypeList, config['rest.resource.name']);
            return restm.toJson(file, ret, false, config['rest.resource.name']);    
        }
    }catch(ex){
        return restm.makeErrorMsg(restRC['error'], ex);
    }
    
}

function generateQuery(filename, query)
{
    var objectType = null;
    if (funcs.index(filename, vars['$G.joinfiles'])>0 && filename != null) {
        objectType="device";
    }
    
    if (vars['$G.advFind.table']){
        //build.search.table.list
        buildSearchTableList();
    }
    
    //get.object
    var tempResults = getObject(filename, objectType);
    var object = tempResults.object;
    var env = tempResults.env;
    var authorized = tempResults.authorized;
    if (object != null){
        var returnMsg, returnCode;
        
        //if the user has no privilege to access this table, return no auth code
        if(!funcs.parse_evaluate(object['engine.access']+'', 4)){
            returnMsg = funcs.scmsg(177, "object", [filename]);
            returnCode = restRC['no auth'];
            return {'returnCode':returnCode, 'message':returnMsg};
        }
        if(!authorized){
            //need to change
            returnMsg = funcs.scmsg(185, "object", [filename]);
            returnCode = restRC['no auth'];
            return {'returnCode':returnCode, 'message':returnMsg};
        }
            
        //set up global list in the object
        var globalListsName = object['global.lists'];
            
        /*if (globalListsName != null){ //remove the global set up do to global var is not supported in rest query
            setupGlobals(globalListsName);
        }*/
    }
        
    //build the query statement with append query
    query = '(' + query+ ')' + lib.QueryHelper.buildAppendQuery(filename, null, true);
    if (log.isDebugEnabled()) {
        log.debug("query3 after buildAppendQuery", query);
    }

    return {'returnCode':restRC['success'], 'query':query};
}

function generateQueryForServer(filename, query)
{
  var result = generateQuery(filename, query);
  if(result.returnCode == restRC['success'])
  {
      return result.query;
  }else
  {
      return "false";
  }
}

/**
* query engine for rest API
* @param {string} filename - table name
* @param {string} query - Query statement against the file.  If user retrieves value by query, pass it through. If by id, the query should be constructed before calling this function to avoid additional search against dbdict
* @param {array} sortFields, sortSeqs: sort fields and sequences
* @param {Integer} listType - Return type for list. 0: count only, 1: keys only, 2: all fields
* @param {boolean} isMultiple: List or single resource
* @param {Integer} start: Start index for list resources
* @param {Integer} count: The count for list resources
* @param {array} restkeys: key fields

* @return {object} - to follow the standard WS response, return an object {returnCode, message, file, count} 

**/
function queryEngine(filename, query, sortFields, sortSeqs, listType, isMultiple, start, count, restKeys, returnFields, dbdict){
    var objectType = null;
    
    var returnMsg = null;
    var returnCode = null;
    var returnFile = null;
    var returnCount = null;
    
    //remove null keys
    var keys = [];
    var i;
    for (i = 0; i < restKeys.length; i++) {
        if(restKeys[i]) {
            keys.push(restKeys[i]);
        }
    }
    restKeys = keys;
    try{
        result = generateQuery(filename, query);
        if(result.returnCode != restRC['success']){
            return result;
        }
        query = result.query;
        
        //select record
        returnFile = new SCFile(filename, SCFILE_READONLY);
        //set sort fields
        if(sortFields != null && sortFields.length > 0){
            returnFile.setOrderBy(sortFields, sortSeqs);
        }
        
        //get total count
        var countFile = new SCFile(filename, SCFILE_READONLY);
        countFile.setFields(restKeys);
        returnCount = countFile.doCount(query);
        
        if (RC_ERROR==getLastRC()){
            return {'returnCode':restRC['badval'], 'message':funcs.scmsg('387', 'scjsdesc')+": "+query};    
        }
        
        if (returnCount == 0){
            //No (more) records found
            if (isMultiple){
                return {'returnCode':restRC['success'], 'file':[], 'count':returnCount, 'message':funcs.scmsg('330', 'scjsdesc')};    
            } else {
                return {'returnCode':restRC['no.record'], 'message':funcs.scmsg('330', 'scjsdesc')};    
            }
        }
        
        if (listType == 0){
            return {'returnCode':restRC['success'], 'count':returnCount};
        }
        
        // return single resource
        if(!isMultiple && returnCount===1) {
            var fieldList = makeSelectFieldList(returnFields);
            if (fieldList) {
                returnFile.setFields(fieldList);
            }
            var rc = returnFile.doSelectEx(query, start, count);
            return {'returnCode':restRC['success'], 'file':[returnFile], 'count':returnCount};
        }
        
        // multiple resources
        returnFile.setFields(restKeys);
        var rc = returnFile.doSelectEx(query, start, count);            
        if (RC_ERROR==rc){
            //No (more) records found
            return {'returnCode':restRC['badval'], 'message':funcs.scmsg('387', 'scjsdesc')+": "+query}    ;
        }
        
        if (RC_SUCCESS==rc && returnCount>0){
            var fileList = [returnFile];
            if(listType==2) {
                restKeysTypes = [];
                if(dbdict) {
                    for( var k=0;k<restKeys.length;k++) {
                        restKeysTypes[k] = [restm.getFieldDef(dbdict, restKeys[k]).type];
                    }
                }
                fileList = queryWithFields(filename, returnFile, query, count, restKeys, restKeysTypes, sortFields, sortSeqs, makeSelectFieldList(returnFields));
            }
            
            return {'returnCode':restRC['success'], 'file':fileList, 'count':returnCount};
        }
        
        if (isMultiple){
            return {'returnCode':restRC['success'], 'file':[], 'count':returnCount, 'message':funcs.scmsg('330', 'scjsdesc')};    
        }
        
        return {'returnCode':restRC['no.record'], 'message':funcs.scmsg('330', 'scjsdesc')};            
    } catch (ex) {
        return {
            'returnCode': restRC['badval'],
            'message': restm.makeSimpleErrorObject(ex)
        };
    }
}

// Make Select Field List
// for array of structure field, we need to keep the parent field and remove the duplicate one.
function makeSelectFieldList(list) {
    if(!list) return list;
    
    var result = [];
    var map = {};
    var length = list.length();
    for (var k = 0; k < length; k++) {
        var item = list[k];
        if(!item) {
            continue;
        }
        
        var index = item.indexOf('[');
        if (index > 0) {
            item = item.substring(0, index);
            if (!map[item]) {
                result.push(item);
                map[item] = true;
            }
        } else {
            result.push(item);
        }
    }

    return result;
}

function queryWithFields(filename, returnFile, query, count, restKeys, restKeysTypes, sortFields, sortSeqs, returnFields){
    var recordIndex = 1;
    var rc = RC_SUCCESS;
    var i=0;
    var idsArray = [];
    while(rc == RC_SUCCESS && recordIndex <= count) {
        recordIndex++;
        if (restKeys.length == 1) {
            idsArray.push(returnFile[restKeys[0]]);
        } else {
            var keys = [];
            for (i = 0; i < restKeys.length; i++) {
                keys[i] = returnFile[restKeys[i]];
            }
            idsArray.push(keys);
        }
        
        rc = returnFile.getNext();
    }
    
    var queries = buildInSql(idsArray, restKeys, restKeysTypes, query);
    returnFile = [];
    
    for (i = 0; i < queries.length; i++) {
        // for second query
        var aFile = new SCFile(filename, SCFILE_READONLY);
        if(returnFields) {
            aFile.setFields(returnFields);
        }
        //set sort fields
        if(sortFields != null && sortFields.length > 0){
            aFile.setOrderBy(sortFields, sortSeqs);
        }
        aFile.doSelect(queries[i]);
        returnFile.push(aFile);
    }
    
    return returnFile;
}


//Build pagination queries based on the ids returned from the first query. Separate to multiple queries if necessary
function buildInSql(idsArray, restKeys, restKeysTypes, query) {
    var result = [];
    var splitedIds = [];
    var size = MaxConditionsPerQuery / restKeys.length;
    var i = 0, j=0, k=0;
    while (i < idsArray.length) {
        splitedIds.push(idsArray.slice(i, i += size));
    }
    for (k = 0; k < splitedIds.length; k++) {
        var ids = splitedIds[k];
        if (restKeys.length == 1) {
            var inSql = ' and ' + restKeys[0] + ' isin {';
            for (i = 0; i < ids.length; i++){
                inSql = inSql + '"' + ids[i] + '"';
                if (i < (ids.length -1)){
                    inSql = inSql + ",";
                }
            }
            inSql = inSql + "}";
        } else {
            if (ids.length == 0) {
                inSql = ' and false';
            } else {
                var inSql = ' and (';
                for (i = 0; i < ids.length; i++){
                    for (j = 0; j < restKeys.length; j++) {
                        if (ids[i][j] != null) {
                          if(restKeysTypes[j]==2) { // string
                                inSql += restKeys[j] + '="' + _e(ids[i][j]) + '"';
                          } else if(restKeysTypes[j]==3) { // date time
                                inSql += restKeys[j] + '=\'' + funcs.str(ids[i][j]) + '\'';
                          } else {// number/boolean
                                inSql += restKeys[j] + '="' + ids[i][j] + '"';
                          }
                        } else {
                          inSql = inSql + "null(" + restKeys[j] + ")";
                        }                        
                        if (j < restKeys.length - 1) {
                            inSql = inSql + " and ";
                        }
                    }
                    if (i < (ids.length -1)){
                        inSql = inSql + " or ";
                    }
                }
                inSql = inSql + ")";
            }
        }
        
        result.push(query + inSql);
    }
    
    return result;
}

/**
* build query statement by query or key-value
* @param {string} query - query statement user input
* @param {array} values - values of key user input
* @param {file} mapping - extaccess file
* @param {object} dbdict - dbdict of the filename
*
* @return {array} - [one or more keys are not defined, query statement]
**/
function resolveQueryFields(query, values, mapping, dbdict)
{
    var keys = mapping['rest.keys'];
    
    var emptyKeys = [];
    
    var len = funcs.lng(keys);
    
    if (values && values.length > 0){
        query = '';
        var i;
        for(i = 0; i < len; i++){
            if (values[i] == null) {
                emptyKeys.push(keys[i]);
                continue;
            }
        
            if (query != '') {
                query += ' and ';
            }
            
            if (values[i] === "null") {
                query += keys[i] + '=NULL';
                continue;
            }
            
            var singlekey = keys[i];
            if (singlekey){
                var singleIndex = singlekey.lastIndexOf(',');
                if (singleIndex>0){
                    singlekey = singlekey.substring(singleIndex+1);
                }
            }
            
            var fieldType = restm.getFieldDef(dbdict, singlekey).type;
            if (fieldType == 1 || fieldType == 4){ 
                // if field type is number or boolean, append directly
                query += keys[i] + '=' + values[i];
            } else if (fieldType == 2 || fieldType == 11){
                // if field type is character or expression, need append double quotation mark
                query += keys[i] + '="' + _e(values[i]) + '"';
            } else if (fieldType == 3){
                // if field type is date/time, need convert the UTC to sm date format and append single quotation mark
                var xmlDate = new XMLDate(values[i]);
                if (xmlDate.getDatum() == 0){
                    throw funcs.scmsg('9', 'restful', [values[i]]);
                }
                var jsDate = xmlDate.getDate();
                query += keys[i] + '=\'' + lib.tzFunctions.convertDatetoString(jsDate, vars['$lo.date.order']) + '\'';
            }
        }
    } else {
        query = converTimeFormatInQuery(query);
    }
    
    if(null==query||''==query){
        query = "true";
    }

    return [emptyKeys, query];
}


function makeSort(sortStr, fieldMap){
    if (!sortStr) {
        return {"sort":[], "sortorder":[]};
    }
    
    var sort = [];
    var sortorder = [];
    
    var ret = sortStr.split(',');
    
    var i;
    for (i=0;i < ret.length; i++){
        var child = ret[i];
        
        child=child.split(':');
        if (child[0]==""){
            return null;
        }
        
        if (child.length>2){
            return null;
        } else if (2==child.length) {
            sort.push(child[0]);
            
            if (child[1]=='descending' || 'dsc'==child[1] || 'desc'==child[1]){            
                sortorder.push(SCFILE_DSC);
            } else if (child[1]=='ascending' || 'asc'==child[1]){
                sortorder.push(SCFILE_ASC);
            } else {
                return null;
            }
            
        } else if (1==child.length) {
            sort.push(child[0]);
            sortorder.push(SCFILE_ASC); //
        }
    }
        
    for (i=0;i<sort.length;i++){
        if (fieldMap[sort[i]]){
            sort[i] = fieldMap[sort[i]];
        }
    }
    
    return {"sort":sort, "sortorder":sortorder};
}


function buildSearchTableList(){
    var argNames = new SCDatum();
    var argVals = new SCDatum();
    var argTypes = new SCDatum();
    var results = new SCDatum();
            
    argNames.setType(8); 
    argVals.setType(8);      
    argTypes.setType(8);
    results.setType(8);
            
    argNames.push("file");
    argVals.push(vars['$G.advFind.table']);
    argTypes.push(6);
            
    var radResults = lib.RAD.run( "AdvFind.getTableList", argNames, argVals, argTypes, results );
}


function getObject(filename, objectType){
    var argNames = new SCDatum();
    var argVals = new SCDatum();
    var argTypes = new SCDatum();
    var results = new SCDatum();
            
    argNames.setType(8); 
    argVals.setType(8);      
    argTypes.setType(8);
    results.setType(8);

    argNames.push("name");  //object name
    argVals.push(filename);
    argTypes.push(2);

    argNames.push("condition"); //special object type
    argVals.push(objectType);
    argTypes.push(2);
    
    argNames.push("file");
    argVals.push(null);
    argTypes.push(6);
            
    argNames.push("second.record");
    argVals.push(null);
    argTypes.push(6);

    argNames.push("boolean1");  //background?
    argVals.push(true);
    argTypes.push(4);
    
    argNames.push("cond.input");  //background?
    argVals.push(null);
    argTypes.push(4);

    results.push("file");  //object file
    results.push("second.record");  //env file
    results.push("cond.input");  //authorized?
    
    var radResults = lib.RAD.run("se.get.object", argNames, argVals, argTypes, results);

    return {object: funcs.val(radResults.results[0], 6),
             env: funcs.val(radResults.results[1], 6),
             authorized: funcs.val(radResults.results[2], 4)};
}

function modifyTableAccess(filename, env){
    var argNames = new SCDatum();
    var argVals = new SCDatum();
    var argTypes = new SCDatum();
    var results = new SCDatum();
            
    argNames.setType(8);
    argVals.setType(8);
    argTypes.setType(8);
    results.setType(8);

    argNames.push("name");  //object name
    argVals.push(filename);
    argTypes.push(2);
    
    argNames.push("file");
    argVals.push(env);
    argTypes.push(6);
    
    var radResults = lib.RAD.run("tableAccess.modify", argNames, argVals, argTypes, results);
}

function setupGlobals(globalListNames){
    var argNames = new SCDatum();
    var argVals = new SCDatum();
    var argTypes = new SCDatum();
    var results = new SCDatum();

    argNames.setType(8); 
    argVals.setType(8);      
    argTypes.setType(8);
    results.setType(8);

    argNames.push("names");
    var i, len = funcs.lng(globalListNames);
    var tempArray = "{";
    for(i = 0; i < len; i++){
        paraName = "$gl"+i;
        vars[paraName] = globalListNames[i];
        tempArray += paraName;
        if(i < len - 1){
            tempArray += ',';
        }
    }
    tempArray += '}';
    argVals.push(tempArray);
    argTypes.push(8);

    argNames.push("name");
    argVals.push("create");
    argTypes.push(2);
    var radResults = lib.RAD.run( "apm.global.initer", argNames, argVals, argTypes, results );
}

/**
* convert ISO date format to SM local in query
* @param {string} query - query statement user input
*
* @return {string} - converted query
**/
function converTimeFormatInQuery(query){
    var regexp = new RegExp("'([0-9]{4})(-([0-9]{2})(-([0-9]{2})(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\\.([0-9]+))?)?(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?'", "g");
    query = query.replace(regexp, function(str){
        var xmlDate = new XMLDate(str.substring(1,str.length-1));
        if (xmlDate.getDatum() == 0){
            throw funcs.scmsg('9', 'restful', [str]);
        }
        var jsDate = xmlDate.getDate();
        return "'"+lib.tzFunctions.convertDatetoString(jsDate, vars['$lo.date.order'])+"'";
    });
    return query;
}


function isInteger(str){
    var re = /^[\+\-]?\d+$/;
    return re.test(str);
}

var log = getLog("rest.query");
