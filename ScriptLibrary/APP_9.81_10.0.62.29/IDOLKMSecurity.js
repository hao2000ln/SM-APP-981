var _ = lib.Underscore.require(),
    IDOL_SharePoint = lib.IDOL_SharePoint.require(),
    XQuery = lib.XQuery.require(),
    logger = getLog('IDOLKMSecurity');

// Lifetime for security info global cache in seconds, default is 12 hours
var SECURITY_INFO_CACHE_LIFETIME = 12 * 60 * 60;
 
var IDOLKMSecurity = (function() {

  function readSecurityInfo(userName) {
    var secInfo = "";
    var readParam = { "username":userName,"securityinfo":true };
    var xml = IDOL_SharePoint.getSecurityInfo( readParam );
    var resp = XQuery.queryText('response', xml);

    if( resp == "SUCCESS") {
      secInfo = XQuery.queryText('responsedata/autn:securityinfo', xml);
    }
    return secInfo;
  }

  function getSecurityInfo(operator) {
    var secInfo = {};
    var lastReadTime = getUpdateTimeCache(operator);
    if (lastReadTime) {
      var date = new Date();
      var elapsedTime = Math.floor(date.getTime() / 1000) - lastReadTime;
      var securityInfo = getSecurityInfoCache(operator);
      if (elapsedTime < SECURITY_INFO_CACHE_LIFETIME && securityInfo) {
        if (logger.isDebugEnabled()) {
          logger.debug('Get security info from global cache for operator ' + operator);
        }
        return {"securityinfo": securityInfo};
      }
    }
    try {
      var readParam = {"username":operator};
      var ntAccount = IDOL_SharePoint.getNTAccount(operator);
      if (ntAccount) {
        var rc;
        if (logger.isDebugEnabled()) {
          logger.debug('Get NT account ' + ntAccount + ' for ' + operator);
        }
        if (IDOL_SharePoint.userExist(readParam) === "false") {
          rc = IDOL_SharePoint.userUpdate(operator,ntAccount, 'useradd');
        } else {
           rc = IDOL_SharePoint.userUpdate(operator,ntAccount,'useredit');
        }
        if (rc === RC_SUCCESS) {
          var strInfo = readSecurityInfo(operator);
          if (strInfo.length > 1) {
            updateSecurityInfoCache(operator, strInfo);
            updateUpdateTimeCache(operator);
            if (logger.isDebugEnabled()) {
              logger.debug('Cache security info for operator ' + operator);
            }
            secInfo = {"securityinfo": strInfo};
          }
        }
      } else {
        logger.warn('Unable to find NTAccount for ' + operator);
      }
    } catch (e) {
      logger.error(e);
      throw e;
    }
    return secInfo;
  }

  function updateSecurityInfoCache(operator, securityInfo) {
    if (!getSecurityInfoCache(operator)) {
      var counter = getSystemCacheValue("GlobalSearch", "SecurityInfoCounter", "SecurityInfoCounter");
      if (!counter) counter = 0;
      counter++;
      logger.info('Security info count in global cache is ' + counter);
      setSystemCacheValue("GlobalSearch", "SecurityInfoCounter", "SecurityInfoCounter", counter);
    }
    setSystemCacheValue("GlobalSearch", "SecurityInfo", operator, securityInfo);
  }

  function getSecurityInfoCache(operator) {
    return getSystemCacheValue("GlobalSearch", "SecurityInfo", operator);
  }

  function getSecurityInfoCounter() {
    return getSystemCacheValue("GlobalSearch", "SecurityInfoCounter", "SecurityInfoCounter");
  }

  function getUpdateTimeCache(operator) {
    return getSystemCacheValue("GlobalSearch", "SecurityInfo", operator + "_lastUpdateTime");
  }

  function updateUpdateTimeCache(operator) {
    setSystemCacheValue("GlobalSearch", "SecurityInfo", operator + "_lastUpdateTime", Math.floor(new Date().getTime()/1000));
  }

  return {
    getSecurityInfo : getSecurityInfo
  }
})();

function require() {
  return IDOLKMSecurity;
}