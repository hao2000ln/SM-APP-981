var $ = lib.c.$;
var _ = lib.Underscore.require();
var logger = getLog("refCheckScheduler");

/*
 status list as following:
 {"1","2","3","4","5"}
 {"In Progress", "Scheduled", "Started", "Finished", "Error"}
 */
function getTotalCount() {
    var file = new SCFile( "relation", SCFILE_READONLY );

    var query = "select count(*) as cnt from relation";
    var rc = file.doSelect( query );
    if ( RC_SUCCESS == rc ) {
        if (logger.isDebugEnabled()) {
            logger.debug( "Record count of relation file is: " + file.cnt );
        }
        return file.cnt;
    }
    return -1;
}

function checkScheduleIsRunning() {
    var procs = funcs.processes( "SYSTEM" );

    var userName;
    var userCount = 0;
    var tidArray = [];
    var j;
    var length = procs.length();
    for ( j = 0; j < length; j++ ) {
        var proc = procs[j].toArray();
        userName = proc[3];

        if (logger.isDebugEnabled()) {
            logger.debug( "userName= " + userName );
        }
        if ( userName == "refcheck" ) {
            userCount++;
            tidArray.push( proc[6] );
        }
    }

    if ( userCount > 1 ) {
        var minTID = _.min( tidArray );
        var currentTID = system.user.threadID;
        if ( minTID == currentTID ) {
            return false;
        }
        return true;
    }
    return false;
}

function refCheckScheduler() {
    if ( checkScheduleIsRunning() == true ) {
        logger.debug( "refCheck schedule is already running!" );
        return;
    }

    var refObj = $( "refCheckStatistic", SCFILE_READONLY );
    var refStat = refObj.setOrderBy( ["status"], [SCFILE_ASC]).select( "status=\"2\" or status=\"1\"");
    var taskCount = refStat.count( "status=\"2\" or status=\"1\"" );

    var rad_operator = funcs.operator;
    var rad_resetsession = funcs.resetsession;
    var preOwner = null;
    var scheduleOp = rad_operator();
    var oldBG = vars['$G.bg'];
    var lib_reportExport = lib.reportExport;

    if ( taskCount > 0 ) {
        refStat.rc = refStat.scfile.getFirst();

        while ( refStat.rc != RC_NO_MORE ) {
            var taskOwner = refStat.scfile["user.name"];
            if (logger.isDebugEnabled()) {
                logger.debug( "task owner = " + taskOwner );
            }
            try {
                if ( preOwner !== taskOwner ) {
                    logger.debug( "Preowner is " + preOwner + " current owner is " + taskOwner );
                    lib_reportExport.setOpertor( taskOwner );
                    logger.debug( "setOpertor() executed." );
                    rad_resetsession();
                    logger.debug( "resetsession executed." );
                    lib_reportExport.loginAs( taskOwner );
                    logger.debug( "loginAs executed." );
                    preOwner = taskOwner;
                    logger.debug( "Switch user context from " + preOwner + " to " + taskOwner );
                }

                if (logger.isDebugEnabled()) {
                    logger.debug( "File list will be handled this time: " + refStat.scfile["filename.list"] );
                }
                taskHandler( refStat, refStat.scfile );
            }
            catch ( e ) {
                lib_reportExport.setOpertor( scheduleOp );
                logger.error( "Error handling reference missing check task for user " + taskOwner );
                logger.error(e.message);
            }

            refStat.rc = refStat.scfile.getNext();
            vars['$G.bg'] = oldBG;
        }

        lib_reportExport.setOpertor( scheduleOp );
    }
}

function taskHandler( fileObj, scfile ) {
    var fileCount = scfile["filename.list"].length();
    if ( fileCount == 0 ) {
        return;
    }

    var rad_val = funcs.val;
    var lib_lobcheck = lib.LobRecordCheck;

    // reset state of refCheckService and check whether we need to check lob data
    var refCheckService = $("#refCheckService");
    if ( getTotalCount() <= 0 ) {
        refCheckService.sendMsgToUser( 31, refCheckService.ERROR, scfile["user.name"], ["true"]);
        return;
    }

    refCheckService.reset();
    refCheckService.setStatus( "3" );
    refCheckService.setBatchID( scfile["batch.id"] );
    var checkLob = scfile["check.blob"];
    if ( !$.isEmpty( checkLob ) && rad_val( checkLob , 4 ) == true ) {
        refCheckService.setLobCheck( true );
    }
    refCheckService.setCurrentUser( scfile["user.name"] );

    // start to find out the primary key is null and reference missing data
    var k;
    for ( k = 0; k < fileCount; k++ ) {
        if (logger.isDebugEnabled()) {
            logger.debug( "Start to handle file: " + scfile["filename.list"][k] );
        }
        refCheckService.getEntityReport( scfile["filename.list"][k] );
        refCheckService.getRefReport( scfile["filename.list"][k] );
        if( refCheckService.checkLob() == true ) {
            var lobcheck = new lib_lobcheck.LobRecordCheck();
            lobcheck.checkRelations( scfile["filename.list"][k], refCheckService );
        }
    }

    refCheckService.setStatus( "4" );
    refCheckService.saveStatistics();
    refCheckService.sendMsgToUser( 30, refCheckService.INFO, scfile["user.name"], scfile["filename.list"].toArray() );

    refCheckService.reset();
}
