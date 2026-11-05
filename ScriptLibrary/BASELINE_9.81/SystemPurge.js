var DBMAX_PURGE_DEFAULT = 0
var DBMAX_PURGE_DEMO = 1
var DBMAX_PURGE_PRODUCT = 2

var log = getLog("SystemPurge");

function purgeData(purgeType, initpwd)
{
    if (DBMAX_PURGE_DEMO == purgeType)
    {
        return purgeDemoData(initpwd);
    }
    else if (DBMAX_PURGE_PRODUCT == purgeType)
    {
        return purgeProductData(initpwd);
    }

    return RC_SUCCESS;
}

function purgeDemoData(initpwd)
{
    var operator = new SCFile("operator");
    var ret = operator.doSelect("true");
    while (RC_SUCCESS == ret)
    {
        operator.expire_password = true;
        operator.never_expire_pass = false;
        if (initpwd && initpwd.length > 0)
        {
            operator.password = initpwd;
        }
        if (RC_SUCCESS != operator.doUpdate())
        {
            log.error("update operator " + operator.name + "failed");
            return RC_ERROR;
        }
        ret = operator.getNext();
    }

    return RC_SUCCESS;
}

function purgeProductData(initpwd)
{
    var unload = new SCFile("unload");
    var ret = unload.doSelect("name=\"PurgeOutofBoxData\"");
    if (RC_SUCCESS == ret)
    {
        funcs.rtecall( "trigger", 1, 0);
        for (i = 0; i < unload.record.length(); ++i)
        {
            var filename = unload.record[i][0];
            var query = unload.record[i][1];

            var rteReturnValue = new SCDatum();
            var rteNames = new SCDatum();
            var rteValues = new SCDatum();

            rteNames.push("name");
            rteNames.push("prompt");
            rteNames.push("query");

            rteValues.push(unload);
            rteValues.push(filename);
            rteValues.push(query);

            log.info("Starting purge: filename="+filename+", query="+query);
            var rc = funcs.rtecall("callrad",
                                rteReturnValue,
                                "us.unload.delete", //RAD app name
                                rteNames,
                                rteValues,
                                false); //false to run in same thread, true to run in new thread
            if (rc != true)
            {
                log.error("Failed purge: filename="+filename+", query="+query );
                return RC_ERROR;
            }
            else
            {
                log.info("Complete purge: filename="+filename+", query="+query );
            }
        }
        funcs.rtecall( "trigger", 1, 1);
    }

    return purgeDemoData(initpwd);
}
