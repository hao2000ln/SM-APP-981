var logger = getLog('RunRestfulGwinteractionmetadata');
var lng = system.functions.lng;
var TABLE_NAME = 'incidents';
var policyread = system.functions.policyread;
var initDbdictFile = lib.dbdictHelper.initDbdictFile;
var dbdictHelper = system.functions.dbdict_helper;
var rtecall = system.functions.rtecall;
var scmsg = system.functions.scmsg;
var $ = lib.c.$;

function GET(request, response) {
    getInteractionMetadata(request, response);
}

//getInteractionMetadata();

function getInteractionMetadata(request, response) {
    var valueList = [];
    var displayList = [];
    var typeList = [];
    var fieldName = "";
    var i;
    var fDbdict=lib.dbdictHelper.initDbdictFile("incidents");
    var fDatadict=lib.dbdictHelper.initDatadictFile("incidents");
    var fieldList = fDatadict.fields;
    var len = lng(fieldList);
    for (i = 0; i < len; i++) {
        fieldName = fieldList[i];
        if (policyread(TABLE_NAME, fieldName, "avail") && !policyread(TABLE_NAME, fieldName, "invisible") && !_isAlias(TABLE_NAME, fieldName) && funcs.index(fieldName, valueList) == 0) {
            valueList.push(fieldName);
            var caption = getFieldCaption(TABLE_NAME, fieldName);
            displayList.push(caption);
            var fieldType= lib.GatewayAPI_Survey.getFiedType(fDbdict,fieldName);
            typeList.push(fieldType);
        }
    }
    //sort array a~z
    var temp = new SCDatum(8);
    temp.push(valueList);
    temp.push(displayList);
    temp.push(typeList);
    var retcode;
    rtecall("sort", retcode, temp, 0, 0);
    valueList = temp[0];
    displayList = temp[1];
    typeList = temp[2];
    var result = [];
    var j;
    for (j = 0; j < lng(valueList); j++) {
        result.push({
            "field": valueList.toArray()[j],
            "caption": displayList.toArray()[j],
            "type": typeList.toArray()[j]
        });
    }

    //print(lib.JSON2.toJSON(result));
    response.send({entities: result});
}

function getFieldCaption(tableName, fieldName) {
   return funcs.nullsub(funcs.get_field_caption(fieldName, tableName), fieldName);
}

function _isAlias(fileName, field) {
    return dbdictHelper("is.alias", fileName, field);
}

function authorize() {
    return true;
}
