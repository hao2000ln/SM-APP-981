// [yyyyMMdd_HHmmss][level][module][event][user=username] message data={...}
//writeSystemLogEntry("INFO", "Contract", "updateStatus.start", "Begin update", {
//   contractId: contractId,
//   status: status
// });
var LOG_FILE_PREFIX = "SM_LOG_DEV";
var LOG_FILE_NAME = LOG_FILE_PREFIX + ".log";
var LOG_MAX_SIZE = 1000000; // ~1 MB voi noi dung ASCII; do dai byte phu thuoc encoding.
var LOG_DIR_BY_ENV = {
  SIT: "E:/APPLICATION/OpenText/Service Manager 9.80/Server/logs/csep/",
  UAT: "/u01/OpenText/ServiceManager9.80/Server/logs/"
};

function getLogDir() {
  var ENV = lib.ESD_ENV_CONFIG.getENV();
  if (ENV === "PROD") {
    return null;
  }
  return LOG_DIR_BY_ENV[ENV] || null;
}

// ============================================================
// Moi event nam tren mot dong de de tim kiem, loc va import vao he thong log.
// ============================================================
function getSystemLogUserName() {
  try {
    return vars["$lo.user.name"] || "SYSTEM";
  } catch (e) {
    return "SYSTEM";
  }
}

function normalizeSystemLogText(value) {
  return value === undefined || value === null ? "" : String(value).replace(/[\r\n]+/g, "\\n");
}

function padSystemLogTime(value) {
  return value < 10 ? "0" + value : String(value);
}

function getSystemLogTimestamp() {
  var now = funcs.tod();

  return now.getFullYear() +
    padSystemLogTime(now.getMonth() + 1) +
    padSystemLogTime(now.getDate()) + "_" +
    padSystemLogTime(now.getHours()) +
    padSystemLogTime(now.getMinutes()) +
    padSystemLogTime(now.getSeconds());
}

function formatSystemLog(level, moduleName, eventName, message, context) {
  var logLine = "[" + getSystemLogTimestamp() + "]" +
    "[" + normalizeSystemLogText(level || "INFO").toUpperCase() + "]" +
    "[" + normalizeSystemLogText(moduleName || "General") + "]" +
    "[" + normalizeSystemLogText(eventName || "message") + "]" +
    "[user=" + normalizeSystemLogText(getSystemLogUserName()) + "] " +
    normalizeSystemLogText(message);

  if (context !== undefined && context !== null) {
    try {
      logLine += " data=" + JSON.stringify(context);
    } catch (e) {
      logLine += " data=" + normalizeSystemLogText(context);
    }
  }

  return logLine;
}

// appendSystemLog chi append, khong doc/check size de giam I/O va race condition.
// Loi ghi log khong duoc lam vo hieu nghiep vu goi ham nay.
function appendSystemLog(text) {
  try {
    var logDir = getLogDir();
    if (!logDir) {
      return false;
    }

    var filePath = logDir + LOG_FILE_NAME;

    writeFile(filePath, "a", normalizeSystemLogText(text) + "\n");
    return true;
  } catch (e) {
    print("[appendSystemLog] error=" + e.message);
    return false;
  }
}

/** Ghi structured log. Day la ham nen dung cho code moi. */
function writeSystemLogEntry(level, moduleName, eventName, message, context) {
  try {
    return appendSystemLog(formatSystemLog(level, moduleName, eventName, message, context));
  } catch (e) {
    print("[writeSystemLogEntry] error=" + e.message);
    return false;
  }
}

/** Wrapper tuong thich nguoc cho caller cu: ghi INFO/General/message. */
function writeSystemLog(text) {
  return writeSystemLogEntry("INFO", "General", "message", text);
}

// ============================================================
// rotateSystemLogIfNeeded - KHONG goi tu hot-path nghiep vu. Goi dinh
// ky tu SM Scheduler (khuyen nghi moi 15-30 phut). Doc file, neu vuot
// LOG_MAX_SIZE thi backup ra file rieng roi clear file goc.
//
// Luu y: van con 1 khoang ho hep gian rui ro neu co process khac dang
// append dung luc rotate chay (van chua the trien khai loai bo hoan
// toan neu SM JS ScriptLibrary khong co API file-lock). Chuyen sang
// chay dinh ky (thay vi moi lan ghi log) da giam manh tan suat va do
// vay giam manh xac suat trung thoi diem so voi ban cu.
// ============================================================
function rotateSystemLogIfNeeded() {
  try {
    var logDir = getLogDir();
    if (!logDir) {
      return false;
    }

    var filePath = logDir + LOG_FILE_NAME;
    var content = "";
    try {
      content = readFile(filePath, "t");
    } catch (e) {
      return false; // chua co file hoac khong doc duoc -> khong can rotate
    }

    if (!content || content.length <= LOG_MAX_SIZE) {
      return false;
    }

    var time = funcs.tod();
    var backupPath = logDir + LOG_FILE_PREFIX + "_" + time.getTime() + ".log";

    writeFile(backupPath, "w", content);
    writeFile(filePath, "w", "");

    print("[rotateSystemLogIfNeeded] rotated -> " + backupPath);
    return true;
  } catch (e) {
    print("[rotateSystemLogIfNeeded] error=" + e.message);
    return false;
  }
}
