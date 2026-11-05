print(JSON.stringify(resultObj, null, 4));

var log = getLog("BaseUtil");
function debug(msg) {
    log.debug(msg);
}

function info(msg) {
    log.info(msg);
}

function error(msg) {
    log.error(msg);
}

var LOG_NAME = "hpt.esd.contract";
var log = getLog(LOG_NAME);

function writeLog(level, eventName, details) {
  var message = "[" + eventName + "]";

  if (details !== undefined && details !== null) {
    try {
      message += " " + JSON.stringify(details);
    } catch (e) {
      message += " " + String(details);
    }
  }

  if (level === "debug") {
    log.debug(message);
  } else if (level === "info") {
    log.info(message);
  } else if (level === "warn") {
    log.warn(message);
  } else {
    log.error(message);
  }
}