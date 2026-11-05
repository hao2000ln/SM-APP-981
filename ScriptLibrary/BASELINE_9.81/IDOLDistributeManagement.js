var IDOLRequest =lib.IDOLRequest.require(),
     IDOLConfigure = lib.IDOLConfigure.require(),
     _ = lib.Underscore.require(),
     XQuery = lib.XQuery.require();
     
var IDOLDistributeManager = ( function(){

   function buildVDBParamter( vdbAction,dbName, engineNumber){

    return {
      "action":"VDBManagement",
      "VDBAction":vdbAction,
      "VDBName":dbName,
      "VDBType":"Distributor",
      "VDBMapsTo":engineNumber+':'+dbName
    }
   }
   
    function GLSEngine(){
      return '0';  
    }
    
    function HTAEngine(){ 
      return '1';   
    }
    
    function manageVDB(vdbAction,dbName, engineNumber)
    {
       var idolUrl = IDOLConfigure.getConfig()['server.url'];
       var vdbParam = buildVDBParamter(vdbAction,dbName, engineNumber);
       var result =  IDOLRequest.doIDOLPost(idolUrl, vdbParam);
      
       var resp = XQuery.queryText('response', result);
      
       return resp === 'SUCCESS' ? 0:-1;   
    }
    
    function VDBAdd(){
       return 'VDBAdd';
    }
    
    function VDBUpdate(){
       return 'VDBEdit';
    }

    function isVDBExist( dbName ){
      var idolUrl = IDOLConfigure.getConfig()['server.url'];
      var param = {
          "action":"VDBManagement",
          "VDBAction":"ShowStatus"
         },
         result = IDOLRequest.doIDOLPost(idolUrl, param),
         vdbs = XQuery.query('responsedata/vdbs/vdb', result);
      
      return _.any(vdbs, function(vdb) {
            return vdb.getAttributeValue('name').toUpperCase() === dbName.toUpperCase();
      });   
    }
    
    
   function setDBPrivilege(dbname)
   {
       var idolUrl = IDOLConfigure.getConfig()['server.url'];
       var param = {
           "action":"RoleSetPrivilegeForRole",
           "Privilege":"Databases",
           "RoleName":"everyone",
           "Value":dbname
       };
       
       var resp =  IDOLRequest.doIDOLPost(idolUrl, param);
       resp = XQuery.queryText('response', resp);
       
       return resp === 'SUCCESS'?0:-1;
   }
   
   return {
   GLSEngine:GLSEngine,
   HTAEngine:HTAEngine,
   VDBAdd:VDBAdd,
   VDBUpdate:VDBUpdate,
   manageVDB:manageVDB,
   setDBPrivilege:setDBPrivilege,
   isVDBExist:isVDBExist
   }
}
)();

function require(){
  return IDOLDistributeManager
}
