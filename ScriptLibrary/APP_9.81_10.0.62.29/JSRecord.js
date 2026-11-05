//////////////////////////////////////////////////////////////////////////////////////
//               for SM Collaboration 1.1 JS Record 
//////////////////////////////////////////////////////////////////////////////////////

/*
  get infomation of objects
  
  arg : file name, query, fields
  
  returns : map of field name and field info including type and value
  
*/
function getObjectInfo(args){
  var arg = args.split("^^^^^");
  var file = arg[0];
  var query = arg[1];
  var fields = arg[2];
  var fieldsArray = fields.split("#");
  var rc;
  var records = [];
  if(fields!=null){
    var scFile =_select_fields(file, query, fieldsArray);
  }else{
    var scFile = _select_fields(file, query, null);
  }
  if(scFile!=null){
    var rc= scFile.getFirst(); 
    if( rc== RC_SUCCESS ){
      var obj = {};
      for( var i = 0 ; i < fieldsArray.length; i++){
        var fieldValue = new SCDatum(scFile[fieldsArray[i]]);
        var fieldInfo = new _sm_field_value(fieldsArray[i], fieldValue.getType(), fieldValue);
        obj[fieldsArray[i]]=fieldInfo;
      }
    }
    return lib.JSON2.toJSON(obj);
  }
  return null;
}

function _sm_field_value(fieldName, fieldType, fieldValue){
  this.fieldName = fieldName;
  this.fieldType = fieldType;
  if(fieldType !== "ARRAY"){
    this.fieldValue = [fieldValue.getText()];
  } else {
     this.fieldValue = fieldValue.toArray();
  }
}

function _select_fields( fileName, query, fields ) {
    var file = new SCFile( fileName, SCFILE_READONLY);
    var rc = "";
    try {
        if(fields!==null && fields != ""){
            file.setFields(fields);
        }
        rc = file.doSelect( query );
        if( rc == RC_SUCCESS ) {
            return file;
        }
    }catch( ex ) {
        print( ex );
    }
    return null;
}