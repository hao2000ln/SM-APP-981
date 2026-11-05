var logger = getLog('RunRestfulSxEntityChangeLocker');
var JSON = lib.JSON.json();

/**
 * Lock  request payload:
 * {
 *   "lock":{
 *	  "sxId":"propel-sx-svcSM%343c",
 *    "action":"lock"
 *   }
 * }
 * UnLock request payload:
 * {
 *   "lock":{
 *	  "sxId":"propel-sx-svcSM%343c",
 *    "action":"unlock"
 *   }
 * }
 * Response body if Lock/Unlock success: 
 *  {
 *     "ReturnCode": "200",
 *     "Messages": "Lock successfully"
 *  }
 * Response body if Lock forbidden:     
 *  {
 *     "ReturnCode": "403",
 *     "Messages": "Unable to lock/unlock"
 *  }
 * Response body if bad request is received:
 *  {
 *     "ReturnCode": "400",
 *     "Messages": "Malformed request"
 *  }
 */
function POST(req, res) {
  var code;
  var message;
  var lockObj = req.body.lock;
  if (lockObj && lockObj.sxId && lockObj.action) {
    var sxId = lockObj.sxId;
    var action = lockObj.action;
    if (action == "lock") {
      if (lock(sxId)) {
        code = 200;
        message="Lock " + sxId + " successfully";
      } else {
        code = 403;
        message="Unable to acquire lock for " + sxId;
      }
    } else if (action == "unlock") {
      unlock(sxId);
      code = 200;
      message="Unlock " + sxId + " successfully";
    }
  } else {
    code = 400;
    message = "Malformed request";
  }
  res.status(200).send({
    "ReturnCode": code,
    "Messages": message
  });
}

function canLock(locker) {
  if (!locker.lock) return true;
  var time = locker.lockTime.getTime();
  var curTime = new Date().getTime();
  return (curTime - time) > 15000; 
}

function lock(sxId) {
  var locker = new SCFile("SxEntityChangeLocker");
  var sql="sxId=\"" + sxId + "\"";
  var rc = locker.doSelect(sql);
  if ((rc == RC_SUCCESS && canLock(locker))
    || rc != RC_SUCCESS) {
    // if not lock, lock it
    locker.lock = true;
    locker.lockTime = new Date();
    if (rc == RC_SUCCESS) {
      locker.doSave();
    } else {
      locker.sxId = sxId;
      locker.doInsert();
    }
    return true;
  }
  return false;
}

function unlock(sxId) {
  var locker = new SCFile("SxEntityChangeLocker");
  var sql="sxId=\"" + sxId + "\"";
  var rc = locker.doSelect(sql);
  if(rc == RC_SUCCESS && locker.lock)
  {
    // if lock, unlock it
    locker.lock = false;
    locker.doSave();
  }
  return true;
}

function authorize() {
  return true;
}