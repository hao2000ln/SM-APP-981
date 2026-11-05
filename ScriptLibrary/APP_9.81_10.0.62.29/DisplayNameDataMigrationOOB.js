/**
* This js is for Service Manager Out Of the Box data migration. 
* Be carefull that you'd better not execute this js in your Service Manager Envrienment coz it will result in big performance issue 
* since there will be much bigger data in your system than Service Manager Out Of the Box.
*/


var $ = lib.c.$;
var rtecall=funcs.rtecall;
var dataService = $("#dataService");
var dbdictService = $("#dbdictService");
//Constant
var TARGET_TABLE="device";
var INITNUMBER=1000001;
var useAdHocSql = false;


function migrateData(){
  //1. rebuild the relations
  lib.RelationManager.buildRelations();
  if( useAdHocSql ){
  //2. update CI display.name=logical.name
    batchUpdateCIDisplayNameByLogicalName();
    //3. regenerate logical name
    regenerateLogicalName(); // ad-hoc SQL
  }else{
    migrateDevice();
  }
  //4. cascade update other related tables which have fields referenced to logical.name
  updateRefTableData();
}

function updateRefTableData(){
  var relationRecord = new SCFile("relation");
    var cnt= 0;
    var relation_query="select DISTINCT source.file, source.field, source.sqltable, source.sqlfield from relation where target.file =\""+TARGET_TABLE+"\" and target.field= \"logical.name\" and status~= \"invalid\" order by source.file";
    var rc = relationRecord.doSelect( relation_query );

    while( RC_SUCCESS === rc ) {
        if(relationRecord[0]!==null && relationRecord[0]!==""){
          
          
          if( relationRecord[1].indexOf('In LOB:')>0 ){
            migrateReferenceTable(relationRecord[0], relationRecord[1].substring(7)) ;
          }else if(useAdHocSql){
            // UPDATE BIZSERVICEM1 SET BIZSERVICEM1.LOGICAL_NAME = DEVICE2M1.LOGICAL_NAME FROM BIZSERVICEM1 INNER JOIN DEVICE2M1 ON BIZSERVICEM1.LOGICAL_NAME = DEVICE2M1.DISPLAY_NAME
            var sql = 'UPDATE '+relationRecord[2]+' SET '+relationRecord[2]+'.'+relationRecord[3]+' = DEVICE2M1.LOGICAL_NAME FROM '+relationRecord[2]+' INNER JOIN DEVICE2M1 ON '+relationRecord[2]+'.'+relationRecord[3]+' = DEVICE2M1.DISPLAY_NAME';
            
            dataService.executeSQL(sql);
          }else{
              
              migrateReferenceTable(relationRecord[0], relationRecord[1]) ;
          }
      }

        rc = relationRecord.getNext();
        cnt++;
    }
    relationRecord.doClose();
    print(cnt + " tables had been merged!");
}

function getSingleLogicalName(device, displayName){
      var rtn = displayName;
      var sql = 'display.name="'+displayName+'"';
      
      var record = device.setFields(['logical.name']).select(sql).uniqueResult();
      if( record != null ){
            rtn = record.logical_name;
      }
      return rtn;
}

function migrateReferenceTable(fileName,fieldName){
    print( 'fileName='+fileName+';fieldName='+fieldName );    
    var simpleFieldName = dbdictService.getFieldNameByPath(fieldName); //firstUniqueKeyName=header,number
    
    
      var file = $(fileName);
      var device = $("device" ,SCFILE_READONLY) ;
      var cnt= 0;
      var records = file.selectAll().iterate( function(record) {
                         var value = record[simpleFieldName];                         
                         
                         
                         if( value !== null ){
                           
                               if( typeof value === 'string' ) {
                                     if( isNaN( value.substring(2) ) ){
                                          record [fieldName ] = getSingleLogicalName (device , value) ;
                                     }
                               }else{
                                     var arr = new Array();
                                     for(var i in value){
                                           arr.push( getSingleLogicalName (device , value [i]) ) ;
                                     }
                                    record [simpleFieldName ] = arr ;
                               }
                               
                               record.doUpdate();
                         }
                         cnt ++;
                   }) ;
      print( "Total:"+cnt);
}

function getCILogicalName(displayName) {
      return getDisplayNameByLogicalName(displayName) ;
}

function migrateDevice(){
    var prefix=getLogicalNamePrefix();
      var device = $("device");
      var cnt = INITNUMBER;
      var begin = funcs.tod();
      var CIs = device.selectAll().iterate( function(record) {                 
                         if( record.logical_name.substring(0,2) !== prefix ) {
                              
                              record.display_name = record.logical_name;
                              record.logical_name = prefix + cnt;
                              record.doUpdate();
                              cnt++;
                         }
                   }) ;
      initNumberRecord( cnt++ );             
      var end = funcs.tod();
      print( "CI counts: " + cnt +";cost: "+ ( begin - end) );
}

function batchUpdateCIDisplayNameByLogicalName(){
  var batchUpdateSql="update DEVICE2M1 set DISPLAY_NAME=LOGICAL_NAME";
  var result = dataService.executeSQL(batchUpdateSql);
}

function regenerateLogicalName(){  
  print("Start regenerateLogicalName...");
  var start=new Date().getTime();
  
  var prefix=getLogicalNamePrefix();
  var dev=new SCFile("device");
  var sql="true";
  var batchUpdateSql="";
  var i=0;
  if(dev.doSelect(sql)===RC_SUCCESS){
    do{
      i++;
      batchUpdateSql="update DEVICE2M1 set LOGICAL_NAME="+"\'"+prefix+(INITNUMBER+i)+"\' where LOGICAL_NAME=\'"+dev['logical.name']+"\'";
      dataService.executeSQL(batchUpdateSql);
    }while(dev.getNext()===RC_SUCCESS)
  }
  print(batchUpdateSql+" Total "+i+" records updated.");
  var end=new Date().getTime();
  print("End regenerateLogicalName..."+(end-start)/1000+"s");
  INITNUMBER=INITNUMBER+i;
  initNumberRecord(INITNUMBER);
}

function getLogicalNamePrefix(){
  var prefix=""
  var num=new SCFile("number",SCFILE_READONLY)
  var sql="name=\"device\"";
  if(num.doSelect(sql)===RC_SUCCESS){
    prefix=num['prefix'];
  }
  return prefix;
}

function initNumberRecord(num){
  var num=new SCFile("number")
  var sql="name=\"device\"";
  if(num.doSelect(sql)===RC_SUCCESS){
    num['number']=num;
    num.doUpdate();
  }
}

function getCINumber(){
  var number="";
  var newid = new Datum();            
  var rcode = new Datum();
  rcode = rtecall("getnumber", rcode, newid,"device" );
  number = newid.getText();
  return number;
}

//migrateData();
