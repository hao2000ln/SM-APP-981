var util = lib.ArrayUtil;
var filename=funcs.filename;
var evaluate=funcs.evaluate;

var DME_MODE_REPLACE=0;
var DME_MODE_MERGE=1;
var DME_MODE_DELETE=2;
var DME_MODE_DELETE_ENABLED=false;


/** This function is create a updated CI file that apply the implemented array of structure fields values in dataModEvent and then sort it 
* So it can be compared with the sorted array of structure fields passed from ucmdb. 
*     @param {String} tableName - the table name that CI belong to
*     @param {String} ciRecordId - the logical name of the CI
*     @returns
*   @type Void
*/
function getUpdatedCIFile(tableName, ciRecordId){
    
   //get the original CI record
   var ciRecord = new SCFile(tableName);
   ciRecord.doSelect( "logical.name=\"" + ciRecordId + "\"" );
   
   vars.$ciFile = ciRecord;
        
   //get the structured fields list
   var ddmRule = new SCFile("ddmRule");
   ddmRule.doSelect( "tableName=\"" + tableName + "\"" );
   var strucFields = [];
   strucFields = getStructureFields(ddmRule) ;
  
   //iterate the datamodevent , if belong to structrued fields list , apply the change
   var dmeSql =  "tableName=\""+tableName+"\" and recordId=\""+ciRecordId+"\" and active=true and status isin {\"implemented\",\"planned\",\"failedValidation\"}";
   
   var dmeRecord = new SCFile("dataModEvent", SCFILE_READONLY);
   dmeRecord.setFields(["fieldName", "newValue"]);
   
   var rc = dmeRecord.doSelect(dmeSql);
   
   while ( rc == RC_SUCCESS ){
   
     var structName = lib.expectedStateHelper.getStructName(tableName,dmeRecord.fieldName);
     
     if( structName!=null){
     
        var arrayValue = funcs.val(dmeRecord.newValue, 8);
        
        var innertype=lib.tableFunctions.getFieldType(dmeRecord.fieldName,tableName);
        
        var subFieldName = dmeRecord.fieldName;

        var i;
        var max = funcs.max(funcs.lng(arrayValue),funcs.lng(vars.$original_file[structName]));            
        for(i=0; i<max; i++){
                   
            if(i>=funcs.lng(arrayValue)){
                 
              ciRecord[structName][i][subFieldName] = null;
              
           }else{

              //RTE side have some issue if we assign the array of structure field value like above sentence
              //as a workaround ,we do the assignment use rad expression and use parse_evaluate to achieve it 
              var subIndex = lib.tableFunctions.getFieldIndex(subFieldName,tableName);    
              var arrayIndex = i+1;
              vars.$L_tmpValue = arrayValue[i]; 
            
              if (innertype == 3){
                vars.$L_tmpValue = funcs.val(lib.dmeTimeConvert.formatFromISODate(arrayValue[i]),3);
              }
              
              var statement = subIndex + " in " + arrayIndex + " in " + structName +" in $ciFile"+"=" + "val($L.tmpValue," + innertype + ")";
              funcs.parse_evaluate( statement, 11 );
           }
        }           
   
    }
    
     rc = dmeRecord.getNext();
   }
   ciRecord = vars.$ciFile;
   //sort the array of structure fields same as new record passed from ucmdb.
   sortStructureFieldInFile(ddmRule , ciRecord);  
   
   return ciRecord;
}

/** This function is used to sort the array field for $L.file passed in
*
*     @param {String} arrayField - The array field need to be sorted.
*     @returns the sorted array values and convert it to String
*   @type Void
*/
function sortArrayField(arrayField){
   if(arrayField !=null){
    var array = funcs.val(arrayField,8);
    var errcode;
    var rtn = funcs.rtecall("sort", errcode, array, 0, 0);
    return funcs.str(array);
   }
   return null;
}


/** This function is used to sort the array of structure defiend in ddmRule for $L.file passed in
*
*     @param {Record} ddmRule - the $L.rule (ddmRule record) passed in
*     @param {Record} file - the $L.file (device record) passed in
*     @returns
*   @type Void
*/
function sortStructureFieldInFile(ddmRule , file){
   var structFields = getStructureFields(ddmRule);
   if(structFields.length > 0 ){
      var i;  
      for(i=0; i<structFields.length; i++){   
        if(file[structFields[i]] !=null){
            sortArrayOfStructureFields(file[structFields[i]]);
        }
      }
   }
}

/** This function is used to get the top level array of structure fields list
*
*     @param {Record} ddmRule - the $L.rule (ddmRule record) passed in
*     
*     @returns array of structure fields

*   @type array
*/  
 function getStructureFields(ddmRule){
    var strucFields = [];
    var rules = ddmRule.rules;
    var i;
    var len = funcs.lng(rules);
    for(i=0 ; i<len; i++){
      if(rules[i]["structure"] != null){
         strucFields.push(rules[i]["structure"]);   
       }
    }
     return util.removeDuplicateEmptyElement(strucFields);
 }
 
/** This function is used to sort the array of structures fields in $L.file . The sort algrithm is by 1st, 2nd, 3rd clomns in order. 
*  for exmaple , we have A,B,C,D property in this array of structure field, it will sort with A property firstly , if there are same values in 
*  property A , we will then sort by B , and then C.
*     @param {Record} ddmRule - the $L.rule (ddmRule record) passed in
*     
*     @returns array of structure fields

*   @type array
*/   
function sortArrayOfStructureFields(asfield){

  var temArray = [];
  var propArray =[];
  
  var i;
  var j;
  var len = funcs.lng(asfield);
  var fieldLen = funcs.lng(asfield[0]);
  for (i=0 ; i<len; i++ ){
    var tmpObj = {};
    var value = '';
    for (j=0 ; j<fieldLen ; j++ ){
       if (!asfield[i]) {
         continue;
       } 
       tmpObj[String.fromCharCode(65 + j) ]=asfield[i][j];
       value += asfield[i][j] + '\t';
       propArray.push(String.fromCharCode(65 + j));
    }
    
    tmpObj['SortValue'] = value;
    temArray.push(tmpObj);
  }
 
  sortObjects(temArray, propArray.join(",") + " desc");
 
  for (i=0 ; i<len ; i++ ){
 
    for (j=0 ; j<fieldLen ; j++ ){
       asfield[i][j]  = temArray[i][String.fromCharCode(65 + j)];    
    } 
  }

}

/** 
 * This function is used to merge the data from the new delta data from ucmdb to the original CI file 
 */
function mergeData() {
    var subIndex = lib.tableFunctions.getFieldIndex(vars.$L_field_name, filename(vars.$L_file));
    var subtype = lib.tableFunctions.getFieldType(vars.$L_field_name, filename(vars.$L_file));

    var i;
    for (i = 1; i <= vars.$L_length; i++) {
        var structure = vars.$L_file[vars.$L_struct_name][i - 1];
        if (!structure) {
            continue;
        }

        if (subtype == lib.DataTypeConst.typeDateTime()) {
            vars.$L_tmpVal = funcs.val(lib.dmeTimeConvert.formatFromISODate(structure[vars.$L_field_name]), 3);
        } else {
            vars.$L_tmpVal = structure[vars.$L_field_name];
        }

        var statement = subIndex + " in " + i + " in " + vars.$L_struct_name + " in $L.file.update" + "=$L.tmpVal";
        
        funcs.parse_evaluate(statement, lib.DataTypeConst.typeExpression());
    }
}

/** This function is used to apply the array of structure fields value to the CI in  update.fields panel of dme.updateRecord.sub rad application
*   
*     
*     @returns 
*   @type void
*/ 
function applyStructureFieldsValues(){

    var structName = lib.expectedStateHelper.getStructName(vars.$L_table,vars.$L_fname);
    var i;
    var max = funcs.max(funcs.lng(vars.$L_array_value),funcs.lng(vars.$L_file[structName]));
    for(i=0; i<max; i++){
           
        if(i>=funcs.lng(vars.$L_array_value)){
             
          vars.$L_file[structName][i][vars.$L_fname] = null;
          
       }else{
    
          var subIndex = lib.tableFunctions.getFieldIndex(vars.$L_fname,vars.$L_table);    
          var arrayIndex = i+1;
          vars.$L_tmpValue = vars.$L_array_value[i]; 
          var innertype = lib.tableFunctions.getFieldType(vars.$L_fname,vars.$L_table);
          
          if (innertype == 3){
            vars.$L_tmpValue = lib.dmeTimeConvert.formatFromISODate(vars.$L_array_value[i]);
          }
          
          var statement = subIndex + " in " + arrayIndex + " in " + structName +" in $L.file"+"=" + "val($L.tmpValue," + innertype + ")";
          funcs.parse_evaluate( statement, 11 );
       }
    }
}

/** This function is used to apply the fields value to the CI in  update.fields panel of dme.updateRecord.sub rad application. Including array of structure fields
*   
*     
*     @returns 
*   @type void
*/ 
function applyValidatedFieldValues(){
    var processedNames = [];
    var structValueList = {};
    
    var i;
    var j;
    var k;
    var len = funcs.lng(vars.$L_names);
    for (j=0; j<len; j++){
        var fieldName = vars.$L_names[j];
        var begin=fieldName.indexOf('[');
        var end  =fieldName.indexOf(']', begin+1);
        if (begin>0 && end>0){
            fieldName = fieldName.substring(begin+1, end);
        }
        
        if (util.contains(processedNames, fieldName)) {
            continue;
        }
        
        var structName = lib.expectedStateHelper.getStructName(vars.$L_table,fieldName);

        vars.$L_array_value=funcs.val(vars.$L_values[j], 8);
        
        var length;
        
        //apply value for array of structure fields
        if(structName !=null){
            var structFieldNames = lib.expectedStateHelper.getStructFieldNames(vars.$L_table, structName);
            if (structFieldNames == null) {
                return;
            }
            
            if (structValueList[structName] == null) {
                structValueList[structName] = {"mapping":{}, "mode":DME_MODE_REPLACE, "length":0};
            }
            var filedLen = util.length(structFieldNames);
            for (i=0; i<filedLen; i++) {
                var index = util.indexOf(vars.$L_names.toArray(), structFieldNames[i]);
                if (index < 0) {
                    index = util.indexOf(vars.$L_names.toArray(), "[" + structFieldNames[i] + "]");
                }
                if (index>=0) {
                    processedNames.push(structFieldNames[i]);
                    structValueList[structName]["mapping"][structFieldNames[i]] = funcs.val(vars.$L_values[index], 8).toArray();
                    if (vars.$L_modes[index] > structValueList[structName]["mode"]) {
                        structValueList[structName]["mode"] = vars.$L_modes[index];
                    }
                    length = util.length(structValueList[structName]["mapping"][structFieldNames[i]]);
                    if (length > structValueList[structName]["length"]) {
                        structValueList[structName]["length"] = length;
                    }
                }
            }

            /*
            for(var i=0; i< funcs.max(funcs.lng(vars.$L_array_value),funcs.lng(vars.$L_file[structName])); i++){
                   
                if(i>=funcs.lng(vars.$L_array_value)){
                     
                  vars.$L_file[structName][i][fieldName] = null;
                  
               }else{
            
                  var subIndex = lib.tableFunctions.getFieldIndex(fieldName,vars.$L_table);    
                  var arrayIndex = i+1;
                  vars.$L_tmpValue = vars.$L_array_value[i]; 
                  var innertype = lib.tableFunctions.getFieldType(fieldName,vars.$L_table);
                  
                  if (innertype == 3){
                  
                    vars.$L_tmpValue = lib.dmeTimeConvert.formatFromISODate(vars.$L_array_value[i]);
                  }
                  
                  var statement = subIndex + " in " + arrayIndex + " in " + structName +" in $L.file"+"=" + "val($L.tmpValue," + innertype + ")";
                  
                  funcs.parse_evaluate( statement, 11 );                                   
               }               
    
            }*/
         //apply value for fields other than array of structure type    
         }else {
              var absFieldType=lib.tableFunctions.getFieldType(fieldName, vars.$L_table,true);

              var fieldType=lib.tableFunctions.getFieldType(fieldName, vars.$L_table);
                          
              if (absFieldType == 8 && vars.$L_modes[j] > DME_MODE_REPLACE) {
                  if (vars.$L_modes[j] == DME_MODE_MERGE) {
                      length = funcs.lng(vars.$L_array_value);
                      vars.$L_file[fieldName] = funcs.denull(vars.$L_file[fieldName]);
                      var lng = funcs.lng(vars.$L_file[fieldName]);
                      for (i=0; i<length; i++) { // loop the field values in dataModEvent
                          if (fieldType == 3) {
                              var fieldvalues = lib.dmeTimeConvert.formatToISODate(vars.$L_file[fieldName]);

                              if (lng == 0 || !util.contains(fieldvalues.toArray(), vars.$L_array_value.toArray()[i])) {
                                  vars.$L_file[fieldName] = funcs.insert(vars.$L_file[fieldName], lng+1, 1, lib.dmeTimeConvert.formatFromISODate(vars.$L_array_value.toArray()[i]));
                              }
                          } else {
                              if (!util.contains(vars.$L_file[fieldName].toArray(), vars.$L_array_value.toArray()[i])) {
                                  vars.$L_file[fieldName] = funcs.insert(vars.$L_file[fieldName], lng+1, 1, vars.$L_array_value.toArray()[i]);
                              }
                          }
                      }
                  } else if (vars.$L_modes[j] == DME_MODE_DELETE) {
                      length = funcs.lng(vars.$L_file[fieldName]);
                      for (i=length-1; i>=0; i--) { // loop the field values in $L.file
                          if ((fieldType == 3 && util.contains(vars.$L_array_value.toArray(), lib.dmeTimeConvert.formatToISODate(vars.$L_file[fieldName].toArray()[i])))
                                || (fieldType != 3 && util.contains(vars.$L_array_value.toArray(), vars.$L_file[fieldName].toArray()[i]))) {
                              vars.$L_file[fieldName] = funcs._delete(vars.$L_file[fieldName], i+1);
                          }
                      }
                  }
              } else {
                  if (fieldType == 3) {
                      vars.$L_values[j]=lib.dmeTimeConvert.formatFromISODate(vars.$L_values[j]);
                      vars.$L_file[fieldName] = vars.$L_values[j];
                  } else {
                      vars.$L_file[fieldName]=funcs.val(vars.$L_values[j], absFieldType);
                  }
              }
         
         }  
    }
    
    var struct;
    for (struct in structValueList) {
        var mode = structValueList[struct]["mode"];
        var length = structValueList[struct]["length"];
        var fieldlist = [];
        var field;
        for (field in structValueList[struct]["mapping"]) {
            fieldlist.push(field);
        }
        
        var structFieldNames = lib.expectedStateHelper.getStructFieldNames(vars.$L_table, struct);
        
        var lng = funcs.lng(vars.$L_file[struct]);
        
        var fieldname;
        var fieldType;
        var same;
        
        if (mode == DME_MODE_REPLACE) { //replace
            for (j=lng-1; j>=0; j--) { // loop array structure in $L.file to remove all elements
                vars.$L_file[struct]=funcs._delete(vars.$L_file[struct], j+1);
            }
            
            for (i=0; i<length; i++) { // loop the array in array structure json
                for (k=0; k<fieldlist.length; k++) { // loop field
                    fieldname = fieldlist[k];
                    fieldType=lib.tableFunctions.getFieldType(fieldname, vars.$L_table);
                    if (fieldType == 3) {
                        vars.$L_file[struct][i][fieldname] = lib.dmeTimeConvert.formatFromISODate(structValueList[struct]["mapping"][fieldname][i]);
                    } else {
                        vars.$L_file[struct][i][fieldname] = structValueList[struct]["mapping"][fieldname][i];
                    }
                }
            } 
        } else if (mode == DME_MODE_MERGE) { // merge
            for (i=0; i<length; i++) { // loop the array in array structure json
                same = false;
                for (j=0; j<lng; j++) { // loop array structure in $L.file
                    k=-1;
                    for (k=0; k<structFieldNames.length; k++) { // loop field
                        fieldname = structFieldNames[k];
                        if (structValueList[struct]["mapping"][fieldname] == null) {
                            if (vars.$L_file[struct][j][fieldname] == null) {
                                continue;
                            } else {
                                break;
                            }
                        }
                        fieldType=lib.tableFunctions.getFieldType(fieldname, vars.$L_table);
                       
                        if ((fieldType == 3 && lib.dmeTimeConvert.formatToISODate(vars.$L_file[struct][j][fieldname]) != structValueList[struct]["mapping"][fieldname][i]) 
                            || (fieldType != 3 && vars.$L_file[struct][j][fieldname] != structValueList[struct]["mapping"][fieldname][i])) {
                            break;
                        }
                    }
                    
                    if (k == structFieldNames.length) {
                        same = true;
                        break;
                    }
                }
                
                if (!same) {
                    vars.$L_file[struct] = funcs.denull(vars.$L_file[struct]);
                    var l = funcs.lng(vars.$L_file[struct]);
                    for (k=0; k<fieldlist.length; k++) {
                        fieldname = fieldlist[k];
                        fieldType=lib.tableFunctions.getFieldType(fieldname, vars.$L_table);
                        if (fieldType == 3) {
                            vars.$L_file[struct][l][fieldname] = lib.dmeTimeConvert.formatFromISODate(structValueList[struct]["mapping"][fieldname][i]);
                        } else {
                            vars.$L_file[struct][l][fieldname] = structValueList[struct]["mapping"][fieldname][i];
                        }
                    }
                }
            }
        } else if (mode == DME_MODE_DELETE) { //delete
            for (j=lng-1; j>=0; j--) { // loop array structure in $L.file
                same = false;
                for (i=0; i<length; i++) { // loop the array in array structure json
                    k=-1;
                    for (k=0; k<structFieldNames.length; k++) { // loop field
                        fieldname = structFieldNames[k];
                        if (structValueList[struct]["mapping"][fieldname] == null) {
                            if (vars.$L_file[struct][j][fieldname] == null) {
                                continue;
                            } else {
                                break;
                            }
                        }
                        fieldType=lib.tableFunctions.getFieldType(fieldname, vars.$L_table);
                        if ((fieldType == 3 && lib.dmeTimeConvert.formatToISODate(vars.$L_file[struct][j][fieldname]) != structValueList[struct]["mapping"][fieldname][i]) 
                            || (fieldType != 3 && vars.$L_file[struct][j][fieldname] != structValueList[struct]["mapping"][fieldname][i])) {
                            break;
                        }
                    }
                    
                    if (k == structFieldNames.length) {
                        same = true;
                        break;
                    }
                }
                
                if (same) {
                    vars.$L_file[struct]=funcs._delete(vars.$L_file[struct], j+1);
                }
            }
        }
    }
}


/** This function is sort the array according to the object elements in the array. Exmple : sortObjects(temArray, "propA,propB,propC desc");
*
*     @param {Array} objArray - the object array need to be sorted. 
*     @param {Array} properties - the sort properties info and sort order paramter   
*     @returns void

*   @type 
*/  
function sortObjects(objArray, properties) {
    var primers = arguments[2] || {};
    properties = util.map(properties.split(/\s*,\s*/), function(prop){
        prop = prop.match(/^([^\s]+)(\s*desc)?/i);
        if( prop[2] && prop[2].toLowerCase() === 'desc' ) {
            return [prop[1] , -1];
        } else {
            return [prop[1] , 1];
        }
    },this);
    
    function valueCmp(x, y) {
        if(x==null ) {
            return 1;
        }
        return x > y ? 1 : x < y ? -1 : 0; 
    }
    
    function arrayCmp(a, b) {
//        var arr1 = [], arr2 = [];
//        util.each(properties, function(prop) {
//            var aValue = a[prop[0]],
//                bValue = b[prop[0]];
//            if( typeof primers[prop[0]] != 'undefined' ) {
//                aValue = primers[prop[0]](aValue);
//                bValue = primers[prop[0]](bValue);
//            }
//            arr1.push( prop[1] * valueCmp(aValue, bValue) );
//            arr2.push( prop[1] * valueCmp(bValue, aValue) );
//        }, this);
//        return arr1 < arr2 ? -1 : 1;
        var aValue = a['SortValue'];
        var bValue = b['SortValue'];
 
        return aValue > bValue ? 1 : -1;
    }
    
    objArray.sort(function(a, b) {
        return arrayCmp(a, b);
    });
}

/** This function is to get Discovered Event Manager Rule record based on current file from ucmdb
*
*     @param {record} CI record 
*     @param {record} DEMRule record    
*     @returns void
*/ 
function getDEMRule(record){
    var dem=new SCFile("ddmRule",SCFILE_READONLY);
    var sql="tableName=\""+filename(record)+"\"";
    if(dem.doSelect(sql)===RC_SUCCESS){
        vars["$L.file"] = record;
        do{
            if(evaluate(dem['condition']) || dem['condition']==="" || dem['condition']===null){
                return dem;
            }
        }while(dem.getNext()===RC_SUCCESS);
    }
    return null;
}

function getDmeModeReplace() {
    return DME_MODE_REPLACE;
}

function getDmeModeMerge() {
    return DME_MODE_MERGE;
}

function getDmeModeDelete() {
    return DME_MODE_DELETE;
}

function getDmeModeValueList() {
    return DME_MODE_DELETE_ENABLED ? [DME_MODE_REPLACE, DME_MODE_MERGE, DME_MODE_DELETE] : [DME_MODE_REPLACE, DME_MODE_MERGE];
}

function getDmeModeDisplayValueList() {
    return DME_MODE_DELETE_ENABLED ? [funcs.scmsg("mode:"+DME_MODE_REPLACE, "dataModEvent"), 
                                       funcs.scmsg("mode:"+DME_MODE_MERGE, "dataModEvent"), 
                                       funcs.scmsg("mode:"+DME_MODE_DELETE, "dataModEvent")]
                                    : [funcs.scmsg("mode:"+DME_MODE_REPLACE, "dataModEvent"), 
                                       funcs.scmsg("mode:"+DME_MODE_MERGE, "dataModEvent")];
}

function setDMEProcessed(ids) {
    var sql= "id isin {"+ids.toArray()+"}";
   
    var dme=new SCFile("dataModEvent");
    var rc=dme.doSelect(sql);
    var vDate = funcs.tod();
    while(rc == RC_SUCCESS){
        
        dme.status="processed";
        dme.active=false;
        dme.processedDate= vDate;
        dme.doUpdate();
        
        rc = dme.getNext();
    }
}