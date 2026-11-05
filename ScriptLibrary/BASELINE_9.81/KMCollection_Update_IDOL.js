/**  @fileoverview KMCollection_Update_IDOL
 *   @author Yang,Chun-Fu
 *   this is the interface for KM reindex and KMUpdate scheduler.
 */
 
/*
	decide how many records to reset the cursor when doing full reindex.
	count 1000 as the record number
*/
var RESET_COUNT = 5000;
/*
	decide how many records indexed then reset the current number in kmreindex record.
*/
var UPDATE_REINDEX_POINT = 1000;

var IDOLKMIndexService = lib.IDOLKMIndexService.require(),
    KMDocument_Index_IDOL = lib.KMDocument_Index_IDOL.require(),
    KMIDOLUtils = lib.KMIDOLUtils.require(),
    IDOLConfigure =lib.IDOLConfigure.require(),
    IDOL_SharePoint = lib.IDOL_SharePoint.require();
var IDOLClientFactory = lib.IDOLClientFactory.require();
var gsclient = IDOLClientFactory.create('GlobalSearch');

var logger = getLog('KMCollection_Update_IDOL');

var KMCollectionUpdateIDOL= (function () {

  var Constants = lib.KMCollection_Status_Constant;
  var OFFLINE = Constants.INDEXSTATUS_OFFLINE(),
      NOT_STARTED = Constants.INDEXSTATUS_NOTSTARTED(),
      INDEXING = Constants.INDEXSTATUS_INDEXING(),
      FINISHED = Constants.INDEXSTATUS_FINISHED();

  function submitReindexRecord(fKmknowledgebase){
    var collectionname = fKmknowledgebase.kbname,
        kmreindex =  new SCFile("kmreindex"),
        ret = kmreindex.doSelect('collectionname="'+collectionname+'" and action="U"');

    //already submitted, just return
    if(ret === RC_SUCCESS){
      if(kmreindex.scquery == fKmknowledgebase.scquery){
        var records = kmreindex.total_number;
        print(funcs.scmsg('1107', 'km', [records]));
        return 0;
      }
      else {
        //scquery change, need reindex
        kmreindex.doDelete();
      }
    }

    var sclibtablename = fKmknowledgebase.sclibtablename,
        scquery =  fKmknowledgebase.scquery || 'true';

    var file = new SCFile(sclibtablename);
    var num = file.doCount(scquery);

    kmreindex.collectionname = collectionname;
    kmreindex.sclibtablename = sclibtablename;
    kmreindex.scquery = scquery;
    kmreindex.action = "U";
    kmreindex.total_number = num;
    kmreindex.record_number = 0;

    ret = kmreindex.doInsert();
    if(RC_SUCCESS == ret) {
      KMIDOLUtils.setKBFieldMap(collectionname,null);
      KMIDOLUtils.setKBFieldWeightPair(collectionname,null);
      KMIDOLUtils.setTypeMap(collectionname,null);
      KMIDOLUtils.getKBFieldMap(collectionname);
      KMIDOLUtils.getKBFieldWeightPair(collectionname);
      KMIDOLUtils.getTypeMap(collectionname);
      logger.info(num + ' documents submitted');
      print(funcs.scmsg('1107', 'km', [num]));
    }
    return ret;
  }

  function reindexNonSClib(fKmknowledgebase) {
    var result = IDOLKMIndexService.deleteIndexDB(fKmknowledgebase['kbname']);

    if (result != 0) {
      print(funcs.msg('1105', 'km', [fKmknowledgebase.kbname]));
      return -1;
    }

    result = IDOLKMIndexService.createIndexDB(fKmknowledgebase['kbname']);
    if (result === 0) {
      IDOLKMIndexService.mappingVDB(fKmknowledgebase['kbname']);
      result = IDOL_SharePoint.fullReindex(fKmknowledgebase);
    }
    return result;
  }

  function markFullReindexLibrary(fKmknowledgebase) {
    var stat = lib.jsaci.checkServerStatus(IDOLConfigure.getEndPoint(), lib.jsaci.getIDOLOEMLicenseFlag());

    var result;
    if(! stat){
      print(funcs.scmsg(224, "km"));
      return -1;
    }

    if(fKmknowledgebase.kbtype !== 'sclib') {
      result = reindexNonSClib(fKmknowledgebase);
      if (result === -1) {
        return result;
      }
      fKmknowledgebase['idoltoken'] = result;
      return 0;
    }

    result = lib.KMAdmin.kmadminlock();

    if (result != 0) {
      print(funcs.scmsg('1106', 'km'));
      return -1;
    }

    try {
      
      var dbname = fKmknowledgebase['kbname'];
      lib.KMCollection_Update_Utils.clearKMUpdateFile(dbname);
      lib.KMCollection_Update_Utils.clearKMErrorFile(dbname);
                  
      if (!IDOLKMIndexService.isDBExists(dbname)) {
        //this is a first time full index of the lib
        result = IDOLKMIndexService.createIndexDB(dbname);
        if (result != RC_SUCCESS){
          logger.error('Failed to create index db '+dbname+' in IDOL Server');
          return -1;
        }

        result = IDOLKMIndexService.mappingVDB(dbname);
        if (result != 0) {
          logger.error('Failed to mapping VDB');
          return -1;
        }
      } else{
        // this is reindex of an existing lib
        if (IDOLKMIndexService.isDBReadOnlyOnAnyContent(dbname)){
          print('The index database '+dbname+' is read only in IDOL server');
          logger.error('The index database '+dbname+' is read only in IDOL server');
          return -1;
        }
        
        result = IDOLKMIndexService.createIndexDB(dbname+IDOLKMIndexService.tempDBPostFix());
        if (result != 0) {
          logger.error('Failed to create temp index database for '+dbname);
          return -1;
        }
      }

      print(funcs.scmsg(225, "km"));

      result = submitReindexRecord(fKmknowledgebase);
      if (result != 0) {
        logger.error('Failed to submit document to indexer');
        lib.KMAdmin.kmadminunlock();
        return -1;
      }
      return result;
    } finally {
      lib.KMAdmin.kmadminunlock();
    }
  }

  /**
   * Full index according to kmreindex record
   *
   * @returns {Number}  RC_SUCCEED if success, -1 if error
   */
  function fullReindexSCLibrary(freindex) {
    var kbname = freindex.collectionname,
        sclibtablename = freindex.sclibtablename,
        scquery = freindex.scquery,
        record_number = freindex.record_number,
        kmknowledgebase = new SCFile("kmknowledgebase"), 
		checkedId = '', 
        checkedRecordId = '';
    var rc = kmknowledgebase.doSelect(new QueryCond('kbname', EQ, kbname));

    if (RC_SUCCESS !== rc){
      logger.error('full index for ' + kbname + ' error. Knowledgebase not found!');
      return -1;
    }

    var isReindex = IDOLKMIndexService.isDBExists(kbname + IDOLKMIndexService.tempDBPostFix());

    logger.info('full index for '+ kbname +' started');

    //set indexstatus to 'indexing'
    if (kmknowledgebase.indexstatus !== OFFLINE) {
      kmknowledgebase.indexstatus = INDEXING;
      kmknowledgebase.doUpdate();
    }

    var sclibFile = new SCFile(sclibtablename);
    var queryTmp = scquery;
    /*
		This is for resuming KM index process.
		If the kmreindex record existed and the record_number field contains ID value, start the indexing process from this ID.
	*/
    if(	record_number ) {
    	queryTmp = queryTmp + ' and ' + kmknowledgebase['docid'] + '>"' +  record_number + '"';
    	
    }
    var sortOrder = new Array(SCFILE_DSC);
	var sortFields = new Array( kmknowledgebase['docid'] );
	sclibFile.setOrderBy(sortFields, sortOrder);
    var result = sclibFile.doSelect(queryTmp);

    var currRec = 0;

    while(RC_SUCCESS === result) {
      currRec++;
      vars.$L_currRec = currRec;

      try{
        result = KMDocument_Index_IDOL.indexDocument(kmknowledgebase, sclibFile, isReindex);
        /*
			IDOL may return 500 - server internal error sometime although there's response.
			In this case, stop the KM index process and warning with log.
		*/
        if( result && result.toLowerCase().indexOf("indexid") != 0){ 
			logger.error( ' ----- index request returns error Index ID, document key = ' + sclibFile[kmknowledgebase['docid']] + ' ----- ' );
			return -1;
		} else {
			indexId = result.replace(/[a-zA-Z]+\=/gi, '');
		}
      } catch(e){
        result = -1;
        logger.error(e);
        //insert into kmknowledgebaseupdates for further retry
        var ret1 = lib.IDOLKMIncrementalIndex.verifyEnvironment();

        if (ret1 != 0) {
          logger.error( ' ----- verify environment failed. KM index process terminated. ----- ' );
          var rc1 = lib.KMCollection_Update_Utils.getKMUpdateProcState();
          if (rc1 == true) {
            lib.KMCollection_Update_Utils.stopKMUpdate();
          }
          return -1;
        } else{
          var kmuFile = new SCFile("kmknowledgebaseupdates");
          kmuFile.id = lib.KMCollection_Update_Utils.getNextKMUpdateId();
          kmuFile.collectionname = kbname;
          kmuFile.docid = String(sclibFile[kmknowledgebase.docid]);
          kmuFile.recdata = lib.KMUtils.recordToXML(sclibFile);
          kmuFile.sedocid = kbname+"_"+kmuFile.docid+"_0";
          kmuFile.action = "U";
          kmuFile.doInsert();
        }
      }
      if( ( currRec - 7500 ) % 10000 == 0 ) {
	   	checkedId = indexId;
	   	checkedRecordId = sclibFile[kmknowledgebase['docid']];
      }
	  if( currRec % 10000 == 0 ) {
		var count = 0;
	    var status = 2;
	    //if status == 0, it means index successfully complete.
	    //if status == 1, it means there's something wrong about the index job, it shall quit.
	    // if status ==2, it means the job still on going.
	    while( status == 2 ) { 
	    	status = checkIndexStatus(checkedId);
	    	if( status == 0  ) {
	    		break;
	    	} else if (status == 1) {
	    		logger.error( 'indexing error on ' + checkedRecordId + ', please check IDOL status ' );
	    		return -1;
	    	}
	    	logger.info( ' -----retry  ' + count + '  time and sleep for 6 seconds ----- ' );
	    	system.functions.sleep(6);
	    	if( count++ > 200 ) {
	    		logger.error( 'More than 200 retry times, there should be error, please check IDOL status. ' );
	    		lib.KMAdmin.kmadminlock();
	    		return -1;
	    	}
	    }
	    logger.info( ' ----- waited for ' + count * 6 + ' secs to complete ----- ' );
      }
      if(currRec % 10000 === 0) {
          freindex.record_number = currRec;
          freindex.doUpdate();
      }
      if(currRec % UPDATE_REINDEX_POINT === 0) {
		updateKMReindex(sclibFile[kmknowledgebase['docid']] , freindex.collectionname);
	  }
	  tmpquery = scquery + ' and ' + kmknowledgebase['docid'] + '>"' +  sclibFile[kmknowledgebase['docid']] + '"';
      result = sclibFile.getNext();
      /**
		reset cursor every 10k records.
      */
      if( currRec % RESET_COUNT === 0 ) {
        sclibFile.setOrderBy(sortFields, sortOrder);
    	result = sclibFile.doSelect(tmpquery);
      } 
    }

    updateKMReindex(sclibFile[kmknowledgebase['docid']], freindex.collectionname, 'D');
    
    if(isReindex){
      IDOLKMIndexService.renameIndexDB(kbname, kbname+'_old_');
      IDOLKMIndexService.flushIndexData();
      IDOLKMIndexService.renameIndexDB(kbname+IDOLKMIndexService.tempDBPostFix(),kbname);
      ret = IDOLKMIndexService.mappingVDB(kbname);
      if( ret == RC_SUCCESS){ 
        IDOLKMIndexService.removeIndexDB(kbname + '_old_');
      } else{
        logger.error('Reindex for '+kbname+' finished but failed to map VDB');
        return -1;
      }
    }
     
    logger.info('full index for '+freindex.collectionname+' finished');
    
    //set indexstatus to 'finished'
    if (kmknowledgebase.indexstatus !== OFFLINE) {
      kmknowledgebase.indexstatus = FINISHED;
      // XXX: It may use index start time.
      var endDate = new Date();
      kmknowledgebase.lastindextime = endDate;
      kmknowledgebase.doUpdate();
    }
    
    return RC_SUCCESS;
  }
  
  function updateKMReindex(id, libName, action) {
    var tmp = new SCFile('kmreindex');
    var rc = tmp.doSelect('collectionname="' + libName + '"');
    if( rc == RC_SUCCESS ) {
      tmp['record.number'] = id;
      if(action) {
      	tmp['action'] = action;
      }
      var rc2 = tmp.doUpdate();
      return tmp;
    }
  }
  
  /**
   * Full index on all modules
   *
   * @returns {Number}  RC_SUCCEED if success, -1 if error
   */
  function fullIndex(){
    var freindex = new SCFile("kmreindex"),
        ret = freindex.doSelect("true");

    while(ret === RC_SUCCESS) {
      try {
        var rc = fullReindexSCLibrary(freindex);
        if (rc == -1) {
        	logger.error('error when doing full index ' + freindex.collectionname);
        }
        ret = freindex.getNext();
      } catch (e) {
        logger.error('error when doing full index ' + freindex.collectionname + ', exception:' + e);
        logger.error(e.stack);
        return -1;
      }
    }
    return RC_SUCCESS;
  }

  function fullIndexNumber() {
    var freindex = new SCFile("kmreindex");
    return freindex.doCount(true);
  }

  function doPurge() {
    var freindex = new SCFile("kmreindex");
    return freindex.doPurge('action="D"');
  }

  function checkFullReindex(){
    if(fullIndexNumber() > 0){
      var ret = fullIndex();
      doPurge();
      return ret;
    }
    return RC_SUCCESS;
  }

  function refreshIndexes() {
    // XXX: the license check should located at displayoption ...
    // if (!funcs.lioption("Knowledge Management")) {
    //   logger.error("This system is not licensed for KM or Smart Analytics");
    //   return -1;
    // }

    var result = lib.IDOLKMIncrementalIndex.verifyEnvironment();
    if(RC_SUCCESS !== result){
      logger.error('IDOL server is not running in well status');
      return -1;
    }

    result = lib.KMAdmin.kmadminlock();
    if (result != 0) {
      logger.error("Admin locked, will retry next interval");
      return -1;
    }

    try {

      result = lib.KMCollection_Update_Utils.setIndexStopOff();
      if (result !=0) {
        return -1;
      }

      if(checkFullReindex() != RC_SUCCESS) {
        logger.error('full reindex failed');
        return -1;
      }

      result = lib.IDOLKMIncrementalIndex.checkIncrementalIndex();
      return result;
    } finally {
      lib.KMAdmin.kmadminunlock();
    }
  }
 // if index =-1, check the system's index status
 // return value 1 means can't get response or server is die
 // 2 means is busy to handle index
 // 0 index finish
 function checkIndexStatus(indexID)
 {
	var xml = gsclient.executeGSAction({
	  action: 'IndexerGetStatus',
	  index: indexID
	});
   if(xml == null)
   {
     
     return 1;
   }
   var ret = 2;
    var child = lib.jsaci.getResponsedata(xml);
    if(child != null)
    {

      var item = lib.jsaci.findFirstNamedItem(child,"item");
      
      while(item != null)
      {
        if(indexID == -1) //check the last one
        {
          var statusnow = lib.jsaci.getFirstNamedItemValue(item,"status");
          if(statusnow =="-4")
          {
            throw "Index data fail due to database name error!";
          }
          else if(statusnow =="-5")
          {
            throw "Index data fail due to bad parameter!";
          }
          if( statusnow =="-1"  || statusnow== "-37" || "-10" == statusnow)
            {
              ret = 0;
            }
           break;
        }
        if(indexID.toString().replace('\n','') == lib.jsaci.getFirstNamedItemValue(item,"id")) //special one
        {
        	
            var specialstatus = lib.jsaci.getFirstNamedItemValue(item,"status");
            logger.info('index status code = ' + specialstatus );
            switch (specialstatus) {
            	case '-4' :
            		throw "Index data fail due to database name error!";
            	case '-1' :
            		ret = 0;
            		break;
            	case '-37': 
            		ret = 0;
            		logger.error(' index failed on index id = ' + indexID );
            		break;
        		case '-10': 
        			ret = 0;
            		logger.error(' indexing return code = -10, the index action was interrupted.' );
            		break;
            	case '-34' : 
            		ret = 0;
            		logger.info( 'the document is pending commit.' );
            		break;
            	case '-9' :
            		ret = 1;
            		logger.error(' IDOL host out of memory. ');
            		break;
            	case '-7' :
            		ret = 2;
            		logger.info('document is in queue, waiting for processing.');
            		break;
        		case '-2' :
	        		ret = 1;
	        		logger.error(' not space left on IDOL host. ');
	        		break;
	        	case '-28' :
	        		ret = 0; 
	        		logger.error(' The index ID is not valid, ' + indexID );
	        		break;
	        	case '-25': 
	        		ret = 2;
	        		logger.error( 'IDOL DIH is busy, document is to be sent to IDOL server. Wait for retry till finished. ');
	        		break;
	        	default: 
	        		ret = 2;
            }
            return ret;
            
        }
        item = item.getNextSiblingElement();
       }
      
     }
   
   return ret;
 }

  return {
    refreshIndexes : refreshIndexes,
    reindex : markFullReindexLibrary
  };
}());

function require() {
  return KMCollectionUpdateIDOL;
}
