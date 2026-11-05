
var KMCollection_Update_IDOL = lib.KMCollection_Update_IDOL.require(),
    IDOLKMIndexService = lib.IDOLKMIndexService.require(),
    IDOLKMIndexUpdate = lib.IDOLKMIndexUpdate.require(),
    IDOL_SharePoint = lib.IDOL_SharePoint.require(),
    logger = getLog('IDOLKMIncrementalIndex');
    
var SYSFUNCS=system.functions;    


function verifyEnvironment()
{
    var stat = lib.jsaci.checkServerStatus(lib.IDOLConfigure.require().getEndPoint(), lib.jsaci.getIDOLOEMLicenseFlag());
    if(! stat){
        print(system.functions.scmsg(224, "km"));
        logger.error(system.functions.scmsg(224, "km"));

        return -1;
    }

    return RC_SUCCESS;
}

function cleanupRedoTable() {
    var IDOLAdvancedSettings = lib.IDOLAdvancedSettings.require(); 
    var settings = IDOLAdvancedSettings.GlobalSearch || {};    
    var str = num2timestr(timestr2num(SYSFUNCS.tod()) - timestr2num(settings.REDO_CLEANUP_TIME + ' ' + '00:00:00'));
    
    var sql="origindate < '" + str + "'";
    logger.info(sql);
    
    var redo_file = new SCFile("kmknowledgebaseupdatesredo");
    redo_file.doPurge(sql);
    
    /*
    var rc = redo_file.doSelect(sql);
    while(rc == RC_SUCCESS){
       logger.info(redo_file);
       rc = redo_file.getNext();
    }
    */
}

function timestr2num( timestr )
{
	var tempTime=SYSFUNCS.val(timestr, 3);
	var ret=SYSFUNCS.val(tempTime, 1);
	return ret;
}

function num2timestr( num )
{
	var tempTime=SYSFUNCS.val(num, 3);	
	ret = SYSFUNCS.str(tempTime);
	return ret;
}



/**************************************************************************************************
 *
 * Check each collection for pending updates.  Call updateIndex if applicable
 *
 **************************************************************************************************/

function checkIncrementalIndex()
{
    var indexResult = 0;
    var collectionFile = new SCFile("kmknowledgebase");
    var collFind = collectionFile.doSelect("true");

    if (collFind == RC_SUCCESS)
    {
    
        cleanupRedoTable();
    
        collFind = collectionFile.getFirst();
        while (collFind == RC_SUCCESS )
        {
            var interval = collectionFile.interval;
            var currentinterval = lib.KMCollection_Update_Utils.getCurrentInterval(collectionFile);
            var indexStopResult = lib.KMCollection_Update_Utils.getIndexStop();

            if (indexStopResult != 0)
            {
                // double check that KMUpdate truly is stopped
                if (!lib.KMCollection_Update_Utils.getKMUpdateProcState())
                {
                    print("kill kmupdate here; result is" + indexStopResult);
                    lib.KMCollection_Update_Utils.stopKMUpdate();
                    print("stopKMUpdate executed");
                    lib.KMAdmin.kmadminunlock();
                    return -1;
                }
                else
                {
                    // KMUpdate is running, mark the stop flag to false; KMUpdate is not stopped
                    // Maybe someone started KMUpdate from the System Status screen
                    lib.KMCollection_Update_Utils.setIndexStopOff();
                }
            }

            if(currentinterval == null)
                currentinterval = 1;
            if(interval == null)
                interval = 1;

            if(interval > 0)
            {
                if(currentinterval == interval )
                {
                    var startDate = new Date();
                    var startTime = startDate.getTime();
					if (collectionFile.kbtype == "sclib") {
						try{
	                        if (lib.KMCollection_Update_Utils.getCurrentIndexing(collectionFile)) {
	                            //set indexing to false and index next interval, otherwise never got chance to make update
	                            lib.KMCollection_Update_Utils.setCurrentIndexing(collectionFile, false);
	                        	collFind = collectionFile.getNext();
	                            continue;
	                        }
	
	                        lib.KMCollection_Update_Utils.setCurrentIndexing(collectionFile, true);
	                        collectionFile.currentinterval = 1;
	                        lib.KMCollection_Update_Utils.setCurrentInterval(collectionFile);
	                        
	                        var kbname = lib.KMUtils.scToJSName(collectionFile.kbname);
	                        if (IDOLKMIndexService.isDBReadOnlyOnAnyContent(kbname)){
	                            logger.error('Index database '+kbname+' is read only in IDOL server, incremental index cannot proceed');
	                            collFind = collectionFile.getNext();
	                            continue;
	                        }
	                        
	                        indexResult = IDOLKMIndexUpdate.updateIndex(collectionFile);
	                        var endDate = new Date();
                        	var endTime = endDate.getTime();
                        	var totalTime = endTime-startTime;
                        	logger.info("index complete in: "+totalTime+" milliseconds");
                        	logger.info("index result for "+kbname+": "+indexResult);

                        lib.KMCollection_Update_Utils.setCurrentIndexing(collectionFile, false);
                        } catch (ex) {
                            logger.error(ex.message);
                        	logger.error(ex.stack);
                        }
                    } else {
                      try{
                    	     IDOL_SharePoint.incrementalIndex(collectionFile);
                    	}
                    	catch (e){logger.error(e.stack);}
                    }
                }
                else if(currentinterval < interval)
                {
                    currentinterval++;
                    collectionFile.currentinterval = currentinterval;
                    lib.KMCollection_Update_Utils.setCurrentInterval(collectionFile);
                }
                else if(currentinterval > interval)
                {
                    collectionFile.currentinterval = 1;
                    lib.KMCollection_Update_Utils.setCurrentInterval(collectionFile);
                }
            } //if interval > 0
            collFind = collectionFile.getNext();
        }// end while
        
        
    }

    try
    {
        IDOLKMIndexService.flushIndexData();
    }
    catch(er)
    {
        logger.error(er);
    }


    return indexResult;
}
