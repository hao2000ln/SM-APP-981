var _ = lib.Underscore.require(),
    KMIDOLUtils = lib.KMIDOLUtils.require();
    

var IDOLKMFieldMapping = (function() {

  function normalizeFieldName(fieldname) {
    return fieldname.replace(/[\.]/g, '_');
  }

  function mappingIDOLField(fieldName, libName) {
    fieldName = lib.KMUtils.scToJSName(fieldName);
    var postfix = '';
    if( libName ){
       var type = KMIDOLUtils.getFieldType(fieldName, libName);
       if(type === 'Date'){return mappingIDOLDateField(fieldName);}
       
       var indexWeight= KMIDOLUtils.getFieldIndexWeight(libName,fieldName);
       // TODO: handle field name mapping
       var isMatch = KMIDOLUtils.isMatchField(libName,fieldName);
       if(isMatch){
          postfix = KMIDOLUtils.matchFieldPostfix();
       }else{
         postfix = KMIDOLUtils.getFieldPostfix(indexWeight);
       }
    }
    
    return fieldName.toUpperCase() + postfix;
  }

  function mappingIDOLDateField(fieldName){
    fieldName = normalizeFieldName(fieldName);
    if (fieldName.match(/_date$/g)== null){
        fieldName += '_DATE';
    }
    fieldName =  fieldName.toUpperCase();
    return fieldName;
  }

  function normalizeLibraryName(name) {
    name = name || '';
    name = name.replace(/[\._]/g, '');
    return name;
  }

  function processFieldMapping(KMQuery, fieldmapping, that, libName) {
    var buff = parseQueryFields(KMQuery,fieldmapping, libName);

    if(that && that.processSpecial){
      var tmp = that.processSpecial(KMQuery);
      if(tmp){
        buff.push(tmp);
      }
    }
    return buff.join(' AND ');
  }

  function parseQueryFields(KMQuery,fieldmapping,libName) {
    return _.chain(fieldmapping).map(function(fields) {
      if (KMQuery[fields[0]]) {
        if (fields[2]){
          var tmp = KMQuery[fields[0]];
          return "MATCH{" + tmp + "}:" + mappingIDOLField(fields[1],libName);
        } else{
          return "STRING{"+KMQuery[fields[0]].split(',')+"}:" + mappingIDOLField(fields[1],libName);
        }
      } else {
      	//for a reference field, try to get display value
      	if (fields[0] && KMQuery[fieldName]) {
      		var fieldName = fields[0].replace("_", ".");
      		var refTable = system.library.DisplayName.getRefTable(fieldName, "kmquery");
      		if (refTable) {
      			var displayValue = system.functions.get_display_value(KMQuery, fieldName, -1, true);
      			//for reference field, display name is automactically indexed, so use field name to do a query
      			if (fields[2]) {
      				return "MATCH{" + displayValue + "}:" + mappingIDOLField(fields[1],libName);
      			} else {
      				return "STRING{" + displayValue.split(',')+"}:" + mappingIDOLField(fields[1],libName);
      			}
      		}
      		
      	}
      }
      return null;
    }).compact().value();
  }


  return {
    mappingIDOLField      : mappingIDOLField,
    mappingIDOLDateField  : mappingIDOLDateField,
    normalizeLibraryName  : normalizeLibraryName,
    processFieldMapping   : processFieldMapping
  };
})();

function require() {
  return IDOLKMFieldMapping;
}