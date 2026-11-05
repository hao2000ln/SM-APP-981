
/*
* Uncomment below line if you want to refresh all the screlation records. 
* Please be reminded that it will take several hours if there are millions of records in your system. 
*/

var REFRESH_ONLY_ACTIVE_SCRELATION_RECORDS ="source.active = true or depend.active = true";

//var REFRESH_All_SCRELATION_RECORDS = "true";

//migrateScrelations();

/*
*
*This method is used to refresh the screlation records based on the latest screlconfigs used for the Process Designer related records section. 
*
**/
function migrateScrelations(){
 
 var idFieldNameMap = {
    incidents: "incident.id",
    cm3r: "number",
    cm3t: "number",
    rootcause: "id",
    rootcausetask: "id",
    knownerror: "id",
    probsummary: "number",
    imTask: "id",
    ocmq: "number",
    request: "number",
    requestTask: "number",
    sla:"agreement.id",
    kmdocument: "id",
    timeperiodDefinition:"id",
    SurveyDefinition:"id"
  };


 var screlconfig = new SCFile("screlconfig");

 var rc = screlconfig.doSelect("true");

 var screlconfigMap = {};

 while (rc == RC_SUCCESS){
    
   var desFields = new Datum();
   
   desFields = screlconfig['desc.fields'].toArray();
   
   screlconfigMap[screlconfig['filename']] = desFields;
   
   rc = screlconfig.getNext();
 
  }

 var start = new Date();
 
 var scRelation = new SCFile("screlation");
 
 var querySql =  REFRESH_ONLY_ACTIVE_SCRELATION_RECORDS;
 
 if ( typeof REFRESH_All_SCRELATION_RECORDS !=='undefined'){
 
    querySql = REFRESH_All_SCRELATION_RECORDS;
    
 } 
 
 var totalCount =  scRelation.doCount(querySql);
 
 var rc = scRelation.doSelect(querySql);

 var rte = new Datum(); 

 system.functions.rtecall("trigger", rte, 0);

 var relatedRecord = null;

 var descFields = new Datum();

 var dependFilename ="";

 var relatedRecRC = null;
 
 var count = 0;

 while  (rc == RC_SUCCESS){

   var desc = new Datum();
   

   descFields = screlconfigMap[scRelation['depend.filename']];
   //print("map id " + scRelation['depend.filename']);
   
   if (scRelation['depend.filename'] ==="problem"){
   
      dependFilename = "probsummary";
      
   } else {
   
       dependFilename = scRelation['depend.filename'];
   }
   
   relatedRecord = new SCFile(dependFilename, SCFILE_READONLY);
   
   relatedRecord.setFields(handleFieldsArray(descFields));
   
   relatedRecRC = relatedRecord.doSelect(idFieldNameMap[dependFilename]+"=\""+ scRelation['depend'] + "\"");
   
   if(relatedRecRC == RC_SUCCESS){
      
      var fieldLength = descFields.length;
      
      for (var i =0; i< fieldLength; i++ ){
         
         if(descFields[i].indexOf(",1")>0){
     
         	var field = descFields[i].substring(0, descFields[i].indexOf(",1"));
         	
         	desc.push(relatedRecord[field][0]);
         	
         }else {
         
            desc.push(relatedRecord[descFields[i]]);
            
         }
           
      }
   }
   
   scRelation['desc'] = desc;
   
   scRelation.doUpdate();
   
   count ++;
   
   if (count %10000 ==0 ) print(count +" of total " + totalCount + " has been processed." );
   
   rc = scRelation.getNext();
 
 }
 
 system.functions.rtecall("trigger", rte, 1);
 
 var end = new Date();
 
 var spendTime = end - start;
 
 print("The data migration task of screlation has been completed");
 
 print("Total Spend Time:" + spendTime);
 
}



function handleFieldsArray(fieldArray){

   var array = [];
   
   for (var i=0 ; i < fieldArray.length ; i++ ){
   
     if(fieldArray[i].indexOf(",1")>0){
     
        array.push( fieldArray[i].substring(0, fieldArray[i].indexOf(",1")));
        
     } else {
     
        array.push(fieldArray[i]);
        
     }
     
   }
   
   return array;

} 
 
 
