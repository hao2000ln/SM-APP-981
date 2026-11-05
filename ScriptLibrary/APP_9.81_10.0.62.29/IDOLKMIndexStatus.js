var _ = lib.Underscore.require(),
    IDOLClientFactory = lib.IDOLClientFactory.require();

// global list: 'KM Reindex Job Status'
var JOB_STATUS = {
  PLANNED : 1,
  SENDING : 2,
  INDEXING : 3,
  COMPLETED : 4,
  FAILED : 5,
  PLAN_TO_TRANSFER : 6,
  TRANSFERRED : 7
};

var logger = getLog('IDOLKMIndexStatus');

var IDOLKMIndexStatus = (function() {

  var STATUS_TO_NAME = [
    null, 
    'planned', 'sending', 'indexing', 'completed', 'failed', 
    'plan_to_transfer', 'transfered'
  ];

  function refreshJobStatus(kmlib) {
    // XXX: in fact use 'kbname_N' is not a safe name convention
    // since some kbname can be the prefix of others
    // 
    // TODO: validate worker name to prevent this prefix issue
    var prefix = kmlib.kbname + '_',
        results = {};

    var job = new SCFile('kmreindexJob', SCFILE_READONLY);
    var rc = job.doSelect(new QueryCond('worker', LIKE, prefix));
    while (rc === RC_SUCCESS) {
      var status = job.status;
      var name = STATUS_TO_NAME[status];
      if (!name) {
        logger.warn('unknown status code: ' + status);
      }
      results[name] = (results[name] || 0) + 1;
      rc = job.getNext();
    }
    var total = 0;
    _.each(results, function(v) {
      total += v;
    });
    results['total'] = total;
    return results;
  }

  // TODO: refined IDOL index status check
  // if index =-1, error
  // 0 index finish
  // 1, pending
  // 2, failed
  function checkIndexStatus(indexID) {    
    var rc = {'rc':2, 'reason':''};
    var client = IDOLClientFactory.create('GlobalSearch');
    var ret = 2; 
    var reason = '';
    var xml = client.executeGSAction({
      action: 'IndexerGetStatus',
      index: indexID
    });
    if(xml == null) {
      rc['rc'] = 2;
      rc['reason']  = 'no response from IDOL server';
      return rc;
    }
    
    logger.info(xml);
    var child = lib.jsaci.getResponsedata(xml);
    if(child != null) {
      var item = lib.jsaci.findFirstNamedItem(child,"item");
      if(!item) {
        rc['rc'] = 2;
      	rc['reason']  = 'No Job id in response.';
      	return rc;
      }
      while(item != null) {
        if(indexID == -1)  {
          var statusnow = lib.jsaci.getFirstNamedItemValue(item,"status");
          if(statusnow =="-4") {
            ret = -1;
            reason ="Index data fail due to database name error!";
          } else if(statusnow =="-5") {
            ret = -1;
            reason =  "Index data fail due to bad parameter!";
          }
          if( statusnow =="-1"  || statusnow== "-37" || "-10" == statusnow) {
            ret = 0;
            reason = 'Seems complete';
          }
          rc['rc'] = ret;
          rc['reason'] = reason;
          break;
        }
        if(indexID.toString().replace('\n','') == lib.jsaci.getFirstNamedItemValue(item,"id"))  {
          var end_time = lib.jsaci.getFirstNamedItemValue(item,"end_time");
          var specialstatus = lib.jsaci.getFirstNamedItemValue(item,"status");
          var reason = '';
          logger.info('index status code = ' + specialstatus );
          /*
            In response, if there end_time tag, it represents that the job status will not change again.
            If the status code equals -1, it means the job is complete, return rc = 0, otherwise it means it failed, rc = 2. 
            If there's no end time or end time equals not finished, the status will change, and returns as pending job, rc = 1. 
            
          */
          if(end_time && end_time!='Not Finished') {
            if(specialstatus == -1 || specialstatus == '-1') {
              ret = 0;
              reason = 'Index Complete.';
            } else {
              ret = 2;
              reason = lib.jsaci.getFirstNamedItemValue(item,"description");
            }
          } else {
            ret = 1;
            reason = lib.jsaci.getFirstNamedItemValue(item,"description");
          }
          
          rc['rc'] = ret;
          rc['reason'] = reason;
          return rc; 
      }
      item = item.getNextSiblingElement();
    }
      
   }
   rc['rc'] = ret;
   rc['reason'] = reason;
   return ret;
   }
  

  return {
    JOB_STATUS : JOB_STATUS,
    refreshJobStatus : refreshJobStatus,
    checkIndexStatus : checkIndexStatus
  };
}());

function require() {
  return IDOLKMIndexStatus;
}