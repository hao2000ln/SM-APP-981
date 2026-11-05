/****************************************************************
*  Functions used to maintain the outageevent external.status so the
*  scheduled downtime defined in outageevent can be synchronized
*  ucmdb adapter
*
*  Author: Shu Shiji(shiji.shu@hp.com)
 *  Date:2012/06/04
*  Update:
*  Version:1.0
****************************************************************/

/***********CLIP Downtime Constants************/
var BATCH_SIZE = 64;

//The status of outageevent that is ready to be synchronized
var READY = 1;

//The status of outageevent that is cancelled
var CANCELLED = 0;

//The status of outageevent that is withdrawn
var WITHDRAWN = 2;


/***********CLIP Downtime Constants************/
var clip_dowmtime_smis;

//smis log and log will be generated on the log folder configurred in smis instance
var smisLog ;

var select = lib.ScAPI_RAD._select;

var sm_reference_prefix ;

var host_name;

var last_tod;

var lastTimeStamp;
var timeStamp;



function initialize(){

    timeStamp = system.functions.tod();

    clip_dowmtime_smis = lib.smis_ConfigurationManager.getEnabledConfigItem("SMBSM_DOWNTIME");

    smisLog = clip_dowmtime_smis == null? null:clip_dowmtime_smis.getLogger();

    sm_reference_prefix = clip_dowmtime_smis.getParameterByCategoryAndName("General","sm.reference.prefix");

    host_name = clip_dowmtime_smis.getParameterByCategoryAndName("General", "sm.host");

    //assign the last_tod for accumulative query
    lastTimeStamp = system.vars.$L_schedule.times[0];

    last_tod = system.functions.str( lastTimeStamp );

    smisLog.debug("CLIP_DowntimeManagement","End of initialize()");

}



function maintainScheduledDowntime(){

  var ret;

  //initialize global variables
  initialize();

  //get timestamp, empty timestamp indicates the 1st schedule, will run the initial process.

  if(system.vars.$L_schedule.times[0] == null || system.vars.$L_schedule.times[0] == ""){

      smisLog.info("CLIP_DowntimeManagement","This is the initial run for CLIP Downtime Management");
      //update the timestamp to tod
      handleLegacyOutageEvent();

      system.vars.$L_schedule.times[0] = timeStamp;

      return;
  }

  //normal synchronization of Down Time
  syncToIntClipDownTime();
  updateCISyncStatus();


  //turn off the trigger when outageevent and ApprovalLog is updated
  system.functions.rtecall("trigger", ret, 0);

    handleRejectOutageEvent();

    handleReopenedOutageEvent();

    handleNormalOutageEvent();

  system.functions.rtecall("trigger", ret, 1);

  system.vars.$L_schedule.times[0] = timeStamp;

}


/** This method is used to handle the down time for change or task has been rejected or abandoned firstly and then reopened and set the status as "ready"
*
*   @returns void
*
*   @type
*/
function handleReopenedOutageEvent(){

      smisLog.info("CLIP_DowntimeManagement","Start to handle reopened outage event for CLIP Downtime Management");

      //Navigate through all the planned downtime in the outageEvent table for change and task
      var outageEvent = new SCFile("intClipDownTime");

      var date = system.functions.str(system.functions.tod());

      var sql = "record.tag #\"cm3\" and outage.end >='"+date+"'"+" and external.status=" + CANCELLED +" and  closed =\"f\" ";

      var rc = outageEvent.doSelect( sql );

      while ( rc == RC_SUCCESS )
      {

            outageEvent.external_status=READY;

            outageEvent.doUpdate();

            smisLog.debug("CLIP_DowntimeManagement","Downtime for CI:" + outageEvent.ci_name + " in " + outageEvent.record_tag + " is reopened");

            rc = outageEvent.getNext();

    }

    smisLog.info("CLIP_DowntimeManagement","Finish the handling of reopened outage event for CLIP Downtime Management");

}

/** This method is used to handle the outageevent for change or task has been rejected or abandoned and set the status as "cancelled"
*
*   @returns void
*
*   @type
*/
function handleRejectOutageEvent(){

      smisLog.info("CLIP_DowntimeManagement","Start to handle rejected outage event for CLIP Downtime Management");

      //Navigate through all the planned downtime in the outageEvent table for change and task
      var outageEvent = new SCFile("intClipDownTime");

      var date = system.functions.str(system.functions.tod());

      var sql = "record.tag #\"cm3\" and outage.start >='"+date+"'"+" and external.status=" + READY + " and  closed =\"t\" ";

      var rc = outageEvent.doSelect( sql );

      while ( rc == RC_SUCCESS )
      {

            outageEvent.external_status=CANCELLED;

            outageEvent.doUpdate();

            smisLog.debug("CLIP_DowntimeManagement","Downtime for CI:" + outageEvent.ci_name + " in " + outageEvent.record_tag + " is cancelled");

            rc = outageEvent.getNext();

    }

    smisLog.info("CLIP_DowntimeManagement","Finish the handling of rejected outage event for CLIP Downtime Management");

}



/** This method is used to handle the outageevent for change or task has followed the steps of normal defined processes.
*     If the related change or task has been approved , the external.status will be set as ready.
*     @returns void
*
*/

function handleNormalOutageEvent(){

      smisLog.info("CLIP_DowntimeManagement","Start to handle the normal outage event for CLIP Downtime Management");

      //used to cache the approved change number or task number
      var approvedChangeList = new Array();

      var approvedTaskList = new Array();

      populateApprovedList(approvedChangeList,"cm3r");

      populateApprovedList(approvedTaskList,"cm3t");

      //Navigate through all the planned downtime in the outageEvent table for change and task
      var outageEvent = new SCFile("intClipDownTime");

      var date = system.functions.str(system.functions.tod());

      var sql = "record.tag #\"cm3\" and outage.end >='"+date+"'"+" and \(external.status=NULL or external.status=" + WITHDRAWN + " \) and  closed ~=\"t\" ";

      var rc = outageEvent.doSelect( sql );

      while ( rc == RC_SUCCESS )
      {


              var recordtag = outageEvent.record_tag.split(";");

              var recordType = recordtag[0];//cm3r or cm3t

              var recordNumber = recordtag[1];//change number or task number


            if(_isRecordApproved(recordNumber,approvedChangeList) || _isRecordApproved(recordNumber,approvedTaskList) ){

                    outageEvent.external_status = READY;

                    outageEvent.external_process_reference[0] = _composeExternalReferenceNumber(recordNumber);

                    outageEvent.reference_number = recordNumber + " (" + host_name + ") " + outageEvent.ci_name;

                    outageEvent.doUpdate();

                    smisLog.debug("CLIP_DowntimeManagement","Downtime for CI:" + outageEvent.ci_name + " in " + outageEvent.record_tag + " is ready for sync");

            }

              rc = outageEvent.getNext();

    }

    smisLog.info("CLIP_DowntimeManagement","Finish the handling of normal outage event for CLIP Downtime Management");

}


/** This function is used to populate the approved change or task list
*
*     @param {String} recordType - cm3r or cm3t
*     @param {Array} approvedList - the change or task approved list
*     @returns
*   @type Void
*/
function populateApprovedList(approvedList,recordType){

  //get Change List and populate approved list

  var date = system.functions.str(system.functions.tod());

  var outageeventSql = "record.tag #\""+recordType+"\" and outage.end >='"+date+"'"+" and \(external.status=NULL or external.status=" + WITHDRAWN + " \) and  closed ~=\"t\" ";

  var  outageeventFields = ['record.tag'];

    var  outgageRc = select("intClipDownTime",outageeventSql,outageeventFields);

    if ( outgageRc != null ){

      var recordNumber;

      var recordtag;

      var recordType;

      var changeRecordList = new Array();

        do{

             recordtag = outgageRc.record_tag.split(";");

             recordType = recordtag[0];//cm3r or cm3t

             recordNumber = recordtag[1];//change number or task number


        //check whether the number has been approved
        approvalLogSql = "unique.key=\""+recordType+";"+recordNumber+"\"";

        approvalLogfields = ['action'];

              var rc = select("ApprovalLog",approvalLogSql,approvalLogfields);

              if( rc != null){

                //get the latest approved log for the final approval phase

              var lastPhaseApprovedRecord = rc.getLast();

              if(rc.action =="approved"){

            smisLog.debug("CLIP_DowntimeManagement",recordNumber + "  is approved");

                     approvedList.push(_retriveNumber(recordNumber));

                     continue;
            }
         }


               changeRecordList.push(recordNumber);

               if(changeRecordList.length % BATCH_SIZE ==0 ){

                _populateApprovedListByBatch(changeRecordList, approvedList,recordType);

                changeRecordList = new Array();

               }


         }while(outgageRc.getNext()==RC_SUCCESS)//loop outageevent

         //handle the remaining change or tasks that is less than the BATCH_SIZE
         if(changeRecordList.length >0){

            _populateApprovedListByBatch(changeRecordList, approvedList,recordType);

         }

        //sort the list to prepare for binary search
        approvedList.sort(function(x,y){
        return x-y;
      });

     }

}


/** This purpose of this function is to query the cm3r or cm3t in batch so as to improve performance
*
*     @param {String} recordType - cm3r or cm3t
*     @param {Array} approvedList - the change or task approved list
*     @param {Array} changeList - the change or task list that is going to be queried
*     @returns
*   @type Void
*/
function _populateApprovedListByBatch(changeList, approvedList,recordType){

  //start to compose the sql for change or task search
  var sql = "number isin {";

    for(i=0 ;i < changeList.length;i++){

      sql= sql.concat("\"");
      sql= sql.concat(changeList[i]);
      sql =sql.concat("\"");

      if(i != changeList.length-1){
         sql =sql.concat(",");
      }

    }
    sql = sql.concat("}");

    var fields = ['category','number'];

  var record = select(recordType,sql,fields);

  var recordNumber;

    if ( record != null ){

         do{
          recordNumber = record.number;

            finalApprovalPhase = getFinalApprovalPhase(recordType,record.category);

            //if final approval phase is not defined , we will assump it's approved
            if(finalApprovalPhase ==null){

                  smisLog.debug("CLIP_DowntimeManagement",recordNumber + "don't have final approval phase and it is auto approved");

                  approvedList.push(_retriveNumber(recordNumber));



            }

         }while(record.getNext()==RC_SUCCESS)

     }

}



/** This function is used to check whether a change or a task has been approved (for batch handling)
*
*     @param {String} recordNumber - the change or task number
*     @param {Array} approvedList - the change or task approved list
*     @returns whether the change or task has been approved or not
*   @type Boolean
*/
function  _isRecordApproved(recordNumber, approvedList){

    return lib.ArrayUtil.binarySearch(approvedList,_retriveNumber(recordNumber))>=0 ;


}


/** This function is compose the external reference number
*
*     @param {String} recordNumber - the change or task number
*    @returns the external referene number
*   @type String
*/
function  _composeExternalReferenceNumber(recordNumber){

    return  (system.functions.nullsub(sm_reference_prefix,"urn:x-hp:2009:sm")).concat(":",system.functions.nullsub(host_name,"<sm server name >"),":rfc|informational|provider:",recordNumber);

}



/** This function is used to check whether a change or a task has been approved (for single check,like change phase to one pre approved )
*
*     @param {SCFile} changeRecord - the change or task record
*     @returns whether the change or task has been approved or not
*   @type Boolean
*/
function  isRecordApproved(recordNumber, recordType){

  //check approval log fistly
    var sql = "unique.key=\""+recordType+";"+recordNumber+"\"";

    var approvalLogfields = ['action'];

    var rc = select("ApprovalLog",sql,approvalLogfields);

    if( rc != null){
          //get the latest approved log for the final approval phase
        var lastPhaseApprovedRecord = rc.getLast();

        if(rc.action =="approved"){

    smisLog.debug("CLIP_DowntimeManagement",recordNumber + "  is approved");

                return true ;

          }

    }

    //if no approval log , check whether the final approval phase is configurred
    sql = "number=\""+recordNumber+"\"";

    var fields = ['category'];

  var record = select(recordType,sql,fields);

    if(record != null){

            //if final approval phase is not defined , we will assump it's approved
            if(getFinalApprovalPhase(recordType,record.category) ==null){

            smisLog.debug("CLIP_DowntimeManagement",recordNumber + "don't have final approval phase and it is auto approved");

                  return true;

            }


     }

     return false;

}



/** This function is used to check whether the ucmdb.id of a ci is empty
*
*     @param {String} ciname - logical name of the ci
*     @returns whether the ucmdb.id of a ci is empty
*   @type Boolean

function isEmptyGlobalId(ciname){

    var sql = "logical.name=\""+ciname + "\"";

    var devicefields = ['ucmdb.id'];

    var rc = select("device",sql,devicefields);

    if( rc != null){

    if(rc.ucmdb_id==null){

      return true;

    }
  }

  return false;

}
*/

/** This function is used to return the digital number of change or task for sort and binary search
*
*     @param {String} recordNumber - the change or task record number
*     @returns the digital number of change or task
*   @type Int
*/
function _retriveNumber(recordNumber){

    return parseInt(recordNumber.match(/\d+/g));

}


/** This function is used to get the final approval phase of change or task configured in smis
*
* @param {String} category - the category of change or task belong to
* @returns the final approval phase configured for one change category or task cateogry in SMIS
*   @type String
*/
function getFinalApprovalPhase(recordType, category){

  var finalApprovalPhase = null;

  if(recordType == "cm3r"){

        finalApprovalPhase = clip_dowmtime_smis.getParameterByCategoryAndName("Change", category);

     }else {

        finalApprovalPhase = clip_dowmtime_smis.getParameterByCategoryAndName("Task", category);

     }

  return finalApprovalPhase ;

}


/** This function is used for trigger trigger.sync.approvallog.with.approval.after.update.
* and it is used to add the phase approval info to the current approvallog table.
*
*     @param {SCFile} changeRecord - the change or task record
*     @returns whether the change or task has been approved or not
*   @type Boolean
*/
function syncApprovalLogWithApproval(oldrecord , approvalRecord){

  //initialize the smis instance everytime to get the latest configuration . Otherwise , this global varialbe defined in this JS will be cached.
  clip_dowmtime_smis = lib.smis_ConfigurationManager.getEnabledConfigItem("SMBSM_DOWNTIME");

  smisLog = clip_dowmtime_smis == null? null:clip_dowmtime_smis.getLogger();

  //only when the SMBSM_OUTAGEMANAGE smis instance is enabled we will sync the approval log
  if(clip_dowmtime_smis !=null){

          if (approvalRecord.file_name=="cm3r" || approvalRecord.file_name=="cm3t"){

              var oldApprovalStatus = oldrecord.approval_status;

              var approvalStatus = approvalRecord.approval_status;

                if(oldApprovalStatus != approvalStatus){

                        var record  = new SCFile(approvalRecord.file_name);

                        var sql = "number=\""+approvalRecord.unique_key+"\"";

                        if(record.doSelect(sql) == RC_SUCCESS){

                            var finalApprovalPhase =  getFinalApprovalPhase(approvalRecord.file_name , record.category) ;

                            if(finalApprovalPhase !=null){

                                  if(finalApprovalPhase.indexOf(record.current_phase)!=-1){

                                      //approval retracted
                                        if(oldrecord.approval_status =="approved" && approvalRecord.approval_status =="pending"){

                                          withdrawOutageevent(approvalRecord.file_name, record);

                                        }else {

                                            //add one approval log indicate the current approval status of final approval phase for change or task
                        insertApprovalLog(approvalRecord.file_name , record,approvalRecord.approval_status);

                                        }

                                     smisLog.debug("CLIP_DowntimeManagement", "Phase " + record.current_phase + " in " + approvalRecord.unique_key + " is" + approvalRecord.approval_status );

                                  }
                               } //finalApprovalPhase
                        }

                }
          }



    }
}

/** This function is used to check whehter the popup window should be displayed to allow
* user to withdraw the outageevent that has already been approved during the change phase action
*
*     @param {SCFile} record - the change or task record
*     @returns whether the popup widow should be displayed
*   @type Boolean
*/
function isWithdrawPopupDisplayed(record){

  //initialize the smis instance everytime to get the latest configuration . Otherwise , this global varialbe defined in this JS will be cached.
  clip_dowmtime_smis = lib.smis_ConfigurationManager.getEnabledConfigItem("SMBSM_DOWNTIME");

  smisLog = clip_dowmtime_smis == null? null:clip_dowmtime_smis.getLogger();


  if(clip_dowmtime_smis !=null){

     // if user choose to remove the WithdrawDowntime paramter or set the value as not equal to "true" , the phase jump will not be prompted to the user
    if(clip_dowmtime_smis.getParameterByCategoryAndName("General", "WithdrawDowntime")!="true"){

       return false;

    }


      if(getFinalApprovalPhase("cm3r", record.category) == null){

          return false ;

      }else if (isRecordApproved(record.number,"cm3r")){

          var recordtag = "cm3r;"+record.number;

          var outageevent = new SCFile("intClipDownTime");

          if(outageevent.doSelect("record.tag=\"" + recordtag +"\"" )==RC_SUCCESS){
             if(outageevent.external_status !=WITHDRAWN){

                return true;

               }
          }


      }


    }

    return false;
}

/** This function is used to withdraw the outageevent that has been approved if user to use
*  change phase function to jump back to the phase prior to the final approval phase
*
*     @param {SCFile} record - the change or task record
      @param {String} filename - cm3r or cm3t
*   @returns void
*   @type void
*/
function withdrawOutageevent(filename, record){

  //set the change or task related outageevent external status as "withdrawn"
  var recordtag = filename +";"+ record.number;

  var outageevent = new SCFile("intClipDownTime");

  var rc = outageevent.doSelect("record.tag=\"" + recordtag +"\"");

  while( rc ==RC_SUCCESS){


       if(outageevent.external_status == READY){

      outageevent.external_status = WITHDRAWN;

      outageevent.doUpdate();

     }

     rc = outageevent.getNext();

  }

  //add one approval log indicate that the approval of the change has been withdrawn
  insertApprovalLog(filename ,record,"withdrawn");


}

/** This function is used to insert one approvallog that record the status of final approval phase for
*   one change or task.
*   @param {String} filename - cm3r or cm3t
*   @param {SCFile} record - the change or task record
*   @param {String} approvalStatus - the status of final approval phase
*   @returns void
*   @type void
*/
function insertApprovalLog(filename , record , approvalStatus){

    var approvallog = new SCFile("ApprovalLog");
    approvallog.file_name = filename;
    //append the file name so that this log will not be displayed on change or task page
    approvallog.unique_key = filename + ";" + record.number;
    approvallog.category = record.category;
    approvallog.current_phase = record.current_phase;
    approvallog.action = approvalStatus;
    approvallog.date = new Date();
    approvallog.operator = "System";
    approvallog.name = "Phase Approval";
    approvallog.doSave();

}


/** this function is used to update intClipDownTime record whose CI has ucmdb.id, is.ci.synced will be set to true.
 *
 *  @returns void
 *
 */
function updateCISyncStatus(){

    var date = system.functions.str(system.functions.tod());
    var dt   = new SCFile("intClipDownTime");
    var sql  = "outage.end >='"+date+"'"+" and is.ci.synced = NULL";

    if(dt.doSelect(sql) == RC_SUCCESS){

        do{

            if( select("device","logical.name=\""+dt.ci_name+"\" and ucmdb.id ~= NULL",['ucmdb.id']) ){

                dt["is.ci.synced"] = true;
                dt.doSave();
            }
   
        }while(dt.getNext() == RC_SUCCESS)


    }

}



/** this function is used to synchronize the outageevent record to intClipDownTime via insertion or updating
 *
 *  @returns void
 *
 */
function syncToIntClipDownTime(){

    smisLog.debug("CLIP_DowntimeManagement","Synchronize from outageevent to intClipDownTime with timestamp: "+last_tod);

    var outageEvent = new SCFile("outageevent");
    var sql = "record.tag#\"cm3\" and sysmodtime>'" + last_tod + "'";
    var gotRecord = false;

    if(outageEvent.doSelect(sql) == RC_SUCCESS){

        gotRecord = true;

        do{

            var dt = new SCFile("intClipDownTime");
            var refNumber = outageEvent.record_tag.split(";")[1] + " (" + host_name + ") " + outageEvent["ci.name"];

            //check existance of correstponding intClipDownTime records
            dt.doSelect( "reference.number=\""+ refNumber + "\"" );

            //key value
            dt["reference_number"] = refNumber;
            //other properies to be synchronized
            dt["record.tag"]       = outageEvent["record.tag"];
            dt["ci.name"]          = outageEvent["ci.name"];
            dt["outage.start"]     = outageEvent["outage.start"];
            dt["outage.end"]       = outageEvent["outage.end"];
            dt["closed"]           = outageEvent["closed"];

            var rc = dt.doSave();
            if(rc != RC_SUCCESS) smisLog.error( "CLIP_DowntimeManagement","intClipDownTime record could not be saved, key: \"" + dt["reference_number"] + "\"  error code: " + RCtoString(rc) );

        }while(outageEvent.getNext() == RC_SUCCESS)

    }

    return gotRecord;

}


/** This method is used to handle the outageevent for change or task has followed the steps of normal defined processes.
*     If the related change or task has been approved , the external.status will be set as ready.
*     @returns void
*
*/
function handleLegacyOutageEvent(){

    smisLog.info("CLIP_DowntimeManagement_Upgrade","Start to handle legacy outage event for CLIP Downtime Management");

    //used to cache the approved change number or task number
    var approvedChangeList = new Array();

    var approvedTaskList = new Array();

    populateLegacyApprovedList(approvedChangeList,"cm3r");

    populateLegacyApprovedList(approvedTaskList,"cm3t");

    //Navigate through all the planned downtime in the outageEvent table for change and task
    var outageEvent = new SCFile("outageevent");

    var date = system.functions.str(system.functions.tod());

    var sql = "record.tag #\"cm3\" and outage.end >='"+date+"'"+" and closed ~=\"t\" ";

    var rc = outageEvent.doSelect( sql );

    var recordtag ;

    var recordType ;//cm3r or cm3t

    var recordNumber ;//change number or task number

    var ret;


    while ( rc == RC_SUCCESS )
    {

        smisLog.debug("CLIP_DowntimeManagement_Upgrade","outageevent record.tag: " + outageEvent.record_tag);

        var dt = new SCFile("intClipDownTime");

        recordtag = outageEvent.record_tag.split(";");

        recordType = recordtag[0];//cm3r or cm3t

        recordNumber = recordtag[1];//change number or task number

        var refNumber = recordNumber + " (" + host_name + ") " + outageEvent["ci.name"];

        //assign properties
        //key value
        dt["reference.number"] = refNumber;
        //other properies to be synchronized
        dt["record.tag"]       = outageEvent["record.tag"];
        dt["ci.name"]          = outageEvent["ci.name"];
        dt["outage.start"]     = outageEvent["outage.start"];
        dt["outage.end"]       = outageEvent["outage.end"];
        dt["closed"]           = outageEvent["closed"];
        if(select("device","logical.name=\""+dt.ci_name+"\" and ucmdb.id ~= NULL",['ucmdb.id'])) dt["is.ci.synced"] = true;

        dt.external_process_reference[0] = _composeExternalReferenceNumber(recordNumber);


        if (_isRecordApproved(recordNumber,approvedChangeList) || _isRecordApproved(recordNumber,approvedTaskList) ){

            //turn off the trigger when outageevent  is updated

            dt.external_status = READY;


            smisLog.debug("CLIP_DowntimeManagement_Upgrade","Downtime for CI:" + outageEvent.ci_name + " in " + outageEvent.record_tag + " is ready for sync");

        }

        smisLog.debug("CLIP_DowntimeManagement_Upgrade","intClipDownTime reference.number: " + dt.reference_number);

        rc = dt.doSave();
        if(rc != RC_SUCCESS) smisLog.error( "CLIP_DowntimeManagement","intClipDownTime record could not be saved, key: \"" + dt["reference.number"] + "\"  error code: " + RCtoString(rc) );

        rc = outageEvent.getNext();

    }

    smisLog.info("CLIP_DowntimeManagement_Upgrade","Finish the handling of legacy outage event for CLIP Downtime Management");

}


/** This function is used to populate the legacy approved change or task list
*
*     @param {String} recordType - cm3r or cm3t
*     @param {Array} approvedList - the change or task approved list
*     @returns
*   @type Void
*/
function populateLegacyApprovedList(approvedList,recordType){

    var date = system.functions.str(system.functions.tod());

    var sql = "ci.down=\"t\" and down.end >='"+date+"'"+ " and status ~=\"closed\"";

    var cm3fields = ['category','current.phase','number'];

    var record = select(recordType,sql,cm3fields);

    var recordNumber;

    var finalApprovalPhase;

    var rc;

    var approvalLogfields;

    var approvalLogSql;

    if ( record != null ){

        do{

            recordNumber = record.number;

            finalApprovalPhase = getFinalApprovalPhase(recordType,record.category);

            //if final approval phase is not defined , we will assump it's approved
            if(finalApprovalPhase ==null){

                smisLog.debug("CLIP_DowntimeManagement_Upgrade",recordNumber + "don't have final approval phase and it is auto approved");

                approvedList.push(_retriveNumber(recordNumber));

                continue;

            }


            var approvalLogSql = "unique.key=\""+record.number+"\" and action=\"approved\"" + "and current.phase=\""+ finalApprovalPhase +"\"";


            approvalLogfields = ['action'];

            rc = select("ApprovalLog",approvalLogSql,approvalLogfields);

            if( rc != null){

                if(record.current_phase != finalApprovalPhase){

                    smisLog.debug("CLIP_DowntimeManagement_Upgrade",recordNumber + "  is approved");

                    approvedList.push(_retriveNumber(recordNumber));


                }
            }

        }while(record.getNext()==RC_SUCCESS)
    }

    //sort the list to prepare for binary search
    approvedList.sort(function(x,y){
        return x-y;
    });


}