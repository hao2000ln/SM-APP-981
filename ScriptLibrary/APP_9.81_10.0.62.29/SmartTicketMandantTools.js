
var IDOLQueryEvaluator = lib.IDOLQueryEvaluator.require(),
    IDOLFieldProcessor = lib.IDOLFieldProcessor.require(),
    IDOLMandant = lib.IDOLMandant.require();

var arrayUtil = lib.ArrayUtil;
var _ = lib.Underscore.require();
var JSON = lib.JSON.json();
var logger = getLog('SmartTicketMandantTools');

function getMandantValueOfCurrentFile( inputFile ){
   var ret = []
   if(inputFile){
      var filename = system.functions.filename(inputFile);
      var mandantFieldName = IDOLMandant.getMandantField(filename);
      var mandantFieldType = lib.tableFunctions.getFieldType(mandantFieldName, filename, true);      
      logger.info('For scfile:'+ filename +' Mandant Field Name is:[' + mandantFieldName + '] mandant file type is :['+ mandantFieldType +']');
      
      if(mandantFieldType == -1){
        logger.info('Error Configuration of Mandant settings: for scfile:['+filename+']');
        return ret;
      }
      
      var mandantFieldValue = inputFile[mandantFieldName];
      if( mandantFieldValue ){
         if(mandantFieldType!=8){
           ret.push(mandantFieldValue);
         }else{
           ret = toJsArray( mandantFieldValue );
         }
      }
   }
   return ret;
}

var fileMap = 
{ 
  'incidents'   : function getOperator( inputfile ){ return getUser(getOperatorIDByContacts(inputfile['callback.contact']));},
  'probsummary' : function getOperator( inputfile ){ return inputfile['contact.name'];}
}

function getCurrentUserMandantValue(){
   return getUserMandantValue( vars["$lo.operator"] );
}

function getUserMandantValueByFile( inputFile ){
  var filename = system.functions.filename(inputFile);
  var getOperatorMethod = fileMap[filename];
  var operator = getOperatorMethod(inputFile);
  return getUserMandantValue( operator );
}

function getUserMandantValueByUserName( strUserName ){
   var fOperator = getUser(strUserName);
   if(fOperator){
      return getUserMandantValue(fOperator);
   }else{
      return [];
   }
}

function getOperatorIDByContacts( contactsName ){
   var name = contactsName || "";
   var sql = new QueryCond('contact.name', EQ, name);
   var fContacts = new SCFile('contacts', SCFILE_READONLY);
   fContacts.setFields(["operator.id"]);
   var rc = fContacts.doSelect(sql);
   if(rc === RC_SUCCESS){
      return fContacts['operator.id'];
   }else{
      return null;
   }
}

function getUser( strUserName ){
   var name = strUserName || "";
   var sql = new QueryCond('name', EQ, name);
   var fOperator = new SCFile('operator');
   var rc = fOperator.doSelect(sql);
   if(rc === RC_SUCCESS){
      return fOperator;
   }else{
      return null;
   }
}

function getUserMandantValue( fOperator ){
  if(!fOperator) {
     return [];
  }
  var securityGroupOfCurrentUser =  fOperator["security.group"];
  //print(securityGroupOfCurrentUser);

  var totalIncludes = [];
  var totalExcludes = [];

  for(var i=0; i<securityGroupOfCurrentUser.length(); i++){
    var aGroup = securityGroupOfCurrentUser[i];
    var obj = getMandantValueByGroup(aGroup);
    totalIncludes = _.union(totalIncludes, obj['includes']);
    totalExcludes = _.union(totalExcludes, obj['excludes']);
  }

  var ret = _.filter(totalIncludes, function(value){ return !_.contains(totalExcludes, value)});
  logger.info("operator's getUserMandantValue :["+ ret + "]");
  return ret;
}

function getAllMandantValue(){
  var fSecurityGroup = new SCFile('scsecuritygroup');
  var rc = fSecurityGroup.doSelect('true');
  var allValue = [];
  
  while(rc == RC_SUCCESS){
     /**
     var includevalue = toJsArray(fSecurityGroup.include);
	 var excludevalue = toJsArray(fSecurityGroup.exclude);    
     var totalvalue = _.union( includevalue, excludevalue );    
     allValue = _.union(allValue, totalvalue); 
     **/
     var includevalue = lib.ArrayUtil.toJsArray(system.functions.denull(fSecurityGroup.include));
	 var excludevalue = lib.ArrayUtil.toJsArray(system.functions.denull(fSecurityGroup.exclude));    
     var totalvalue = includevalue.concat(excludevalue);
     allValue = allValue.concat(totalvalue);
     
     rc = fSecurityGroup.getNext();
  }
  
  allValue = _.uniq(_.sortBy(allValue), true);
  /**print("allvalue=>" + allValue.length + "," + allValue[0]);**/

  return allValue;
}


function generateTestMandantValue(){
  var fSecurityGroup = new SCFile('scsecuritygroup');
  var $ = lib.c.$;
  //var include1 = $.createSCArray();
  
  for(var i=0; i<7500; i++) {
    var include1 = $.createSCArray();
    var mandantvalue = "M" + i
    include1.push(mandantvalue)
  
    fSecurityGroup['security.id'] = mandantvalue;
    fSecurityGroup['include'] = include1;
    fSecurityGroup.doInsert();
  }
}

function testMandantValue(){
   var allvalue = [];
   
   var prefix1 = ['a0_','b0_','c0_', 'd0_', 'e0_', 'f0_', 'g0_', 'h0_', 'j0_', 'k0_', 'l0_', 'm0_', 'n0_', 'o0_', 'p0_', 'q0_', 'r0_', 's0_', 't0_', 'u0_', 'v0_', 'w0_', 'x0_', 'y0_', 'z0_'];
   var prefix2 = ['a1_','b1_','c1_', 'd1_', 'e1_', 'f1_', 'g1_', 'h1_', 'j1_', 'k1_', 'l1_', 'm1_', 'n1_', 'o1_', 'p1_', 'q1_', 'r1_', 's1_', 't1_', 'u1_', 'v1_', 'w1_', 'x1_', 'y1_', 'z1_'];
   var prefix3 = ['a2_','b2_','c2_', 'd2_', 'e2_', 'f2_', 'g2_', 'h2_', 'j2_', 'k2_', 'l2_', 'm2_', 'n2_', 'o2_', 'p2_', 'q2_', 'r2_', 's2_', 't2_', 'u2_', 'v2_', 'w2_', 'x2_', 'y2_', 'z2_'];
   
   var prefix = _.union(prefix1, prefix2, prefix3);
   
   for(var j=0; j<prefix.length; j++){
     var prefix_str = prefix[j];
     
     for(var i=0; i< 100; i++){
       var t = prefix_str + i + "";
       allvalue.push(t);
     }
   }
   
   return allvalue;
}

function toJsArray(smArray) {
	var result = [];
	if(smArray){
	  for (var i = 0; i < smArray.length(); i++) {
		if (smArray[i]) result.push(smArray[i]);
	  }
	}
	return result;
}

function getMandantValueByGroup( securityGroup ){
  var fSecurityGroup = new SCFile('scsecuritygroup', SCFILE_READONLY);
  var sql = 'security.id="' + securityGroup + '""'  
  var rc =  fSecurityGroup.doSelect(sql);
  if(rc == RC_SUCCESS) {
     var includes = toJsArray(fSecurityGroup.include);
	 var excludes = toJsArray(fSecurityGroup.exclude);    
     return {'includes': includes, 'excludes': excludes}
  }
  return {'includes': [], 'excludes': []}
}


function getRestrictingQueryByOperator( categoryFileName, fOperator ){
  if(!fOperator) {
     return [];
  }
  var securityGroupOfCurrentUser =  toJsArray(system.functions.denull(fOperator["security.group"]));
  var query =new QueryCond('filename', EQ, categoryFileName)
      .and(new QueryCond('security.id', ISIN, securityGroupOfCurrentUser));
      
  var fScaccess = new SCFile('scaccess');
  var rc = fScaccess.doSelect(query);
  
  ret = [];
  while(rc == RC_SUCCESS) {
     ret.push(fScaccess['restricting.query']);
     rc = fScaccess.getNext();
  }
  return ret;
}

function getUserRestrictingQueryByFile( inputFile , categoryFileName ){
  var filename = system.functions.filename(inputFile);
  var getOperatorMethod = fileMap[filename];
  var operator = getOperatorMethod(inputFile);
  return getRestrictingQueryByOperator(categoryFileName, operator);
}
