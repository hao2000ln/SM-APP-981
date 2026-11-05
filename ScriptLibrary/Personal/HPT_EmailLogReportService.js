/**
 * ScriptLibrary name: HPT_EmailLogReportService
 * Tổng hợp dashboard trong một lần quét có giới hạn, không đọc mail.body.
 */

function emailLogText(value) {
  return value === undefined || value === null ? "" : String(value);
}

function emailLogClose(file) {
  try { if (file && typeof file.doClose === "function") file.doClose(); } catch (ignore) {}
}

function emailLogIncrement(map, key) {
  key = emailLogText(key).replace(/^\s+|\s+$/g, "");
  if (!key) return;
  map["$" + key] = (map["$" + key] || 0) + 1;
}

function emailLogTop(map, limit) {
  var result = [], key;
  for (key in map) if (Object.prototype.hasOwnProperty.call(map, key)) {
    result.push({ label: key.substring(1), value: map[key] });
  }
  result.sort(function (a, b) { return b.value - a.value || (a.label < b.label ? -1 : 1); });
  return result.slice(0, limit);
}

function emailLogDateText(value) {
  if (value === undefined || value === null || value === "") return "";
  try {
    // SCFile trả date/time dưới dạng SCDatum; funcs.str chuyển đúng theo locale SM.
    if (typeof funcs !== "undefined" && typeof funcs.str === "function") {
      return emailLogText(funcs.str(value)).replace(/^\s+|\s+$/g, "");
    }
  } catch (ignore) {}
  return emailLogText(value).replace(/^\s+|\s+$/g, "");
}

function emailLogDay(value) {
  var text = emailLogDateText(value);
  var local = text.match(/(^|\D)(\d{1,2})[\/-](\d{1,2})[\/-](\d{2}|\d{4})(\D|$)/);
  if (local) {
    var localYear = local[4].length === 2 ? 2000 + Number(local[4]) : Number(local[4]);
    return (local[2].length < 2 ? "0" : "") + local[2] + "/" +
      (local[3].length < 2 ? "0" : "") + local[3] + "/" + localYear;
  }
  var iso = text.match(/(^|\D)(\d{4})-(\d{2})-(\d{2})(\D|$)/);
  return iso ? iso[4] + "/" + iso[3] + "/" + iso[2] : "Không xác định";
}

function emailLogRecentDays(value) {
  var day = emailLogDay(value);
  var match = day.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return { keys: [], counts: {} };
  var end = new Date(Number(match[3]), Number(match[2]) - 1, Number(match[1]));
  var keys = [], counts = {};
  for (var offset = 2; offset >= 0; offset--) {
    var current = new Date(end.getFullYear(), end.getMonth(), end.getDate() - offset);
    var key = (current.getDate() < 10 ? "0" : "") + current.getDate() + "/" +
      (current.getMonth() + 1 < 10 ? "0" : "") + (current.getMonth() + 1) + "/" +
      current.getFullYear();
    keys.push(key);
    counts["$" + key] = 0;
  }
  return { keys: keys, counts: counts };
}

// Sinh ngày hiện tại trực tiếp từ JavaScript để không phụ thuộc format của tod().
function emailLogTodayKey() {
  var now = new Date();
  return (now.getDate() < 10 ? "0" : "") + now.getDate() + "/" +
    (now.getMonth() + 1 < 10 ? "0" : "") + (now.getMonth() + 1) + "/" +
    now.getFullYear();
}

function emailLogTrendItems(recentDays) {
  var result = [];
  for (var i = 0; i < recentDays.keys.length; i++) {
    var key = recentDays.keys[i];
    result.push({ label: key, value: recentDays.counts["$" + key] || 0 });
  }
  return result;
}

function emailLogRecipients(value, map) {
  var parts = emailLogText(value).split(/[;,]/);
  for (var i = 0; i < parts.length; i++) emailLogIncrement(map, parts[i].toLowerCase());
}

// Dựng query dashboard từ allowlist cố định, đồng bộ với filter của danh sách.
function emailLogDashboardQuery(request, utils) {
  var query = 'log.id#""';
  var queryData = request.query || {};
  function addDate(name, operator, exclusiveEnd) {
    var value = utils.cleanString(queryData[name]);
    if (!value) return null;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return { error: name };
    var parts = value.split("-");
    var year = Number(parts[0]);
    var month = Number(parts[1]);
    var day = Number(parts[2]);
    var parsedDate = new Date(year, month - 1, day);
    if (parsedDate.getFullYear() !== year || parsedDate.getMonth() !== month - 1 ||
        parsedDate.getDate() !== day) return { error: name };
    if (exclusiveEnd) parsedDate.setDate(parsedDate.getDate() + 1);
    var dateValue = (parsedDate.getDate() < 10 ? "0" : "") + parsedDate.getDate() + "/" +
      (parsedDate.getMonth() + 1 < 10 ? "0" : "") + (parsedDate.getMonth() + 1) + "/" +
      parsedDate.getFullYear() + " 00:00:00";
    query = "(" + query + ") and (mail.queue.time" + operator + '"' +
      utils.escapeQueryValue(dateValue) + '")';
    return null;
  }
  var failure = addDate("fromDate", ">=", false) || addDate("toDate", "<", true);
  return failure || { query: query };
}

// Trả KPI và bốn nhóm chart; maxScanRecords ngăn dashboard quét bảng không giới hạn.
function getDashboard(request) {
  var file = null;
  var maxScanRecords = 20000;
  var topItems = 10;
  var query = 'log.id#""';
  var total = 0;
  var todayEmails = 0;
  var tickets = {}, senders = {}, recipients = {}, dayCounts = {};
  try {
    var resolved = lib.HPT_ScreenRegistry.resolveScreen("email_logs");
    if (!resolved || !resolved.success) {
      return { success: false, code: "SCREEN_CONFIG_UNAVAILABLE", message: "Cấu hình nhật ký email chưa sẵn sàng" };
    }
    var utils = lib.HPT_CommonApiUtils;
    var security = lib.HPT_ApiSecurity;
    var normalizedRequest = utils.normalizeRequest(request);
    var todayKey = emailLogTodayKey();
    var context = utils.createContext("HPT_EmailLogReportService", "getDashboard", normalizedRequest, "EML");
    var authorization = security.authorizeAction(
      resolved.config.actionPermissions, "list", normalizedRequest, context
    );
    if (!authorization || authorization.allowed !== true) {
      return authorization && authorization.error
        ? authorization.error
        : { success: false, code: "FORBIDDEN", message: "Không có quyền xem nhật ký email" };
    }
    var dashboardFilter = emailLogDashboardQuery(normalizedRequest, utils);
    if (dashboardFilter.error) {
      return utils.validationError("INVALID_FILTER", dashboardFilter.error + " không hợp lệ", dashboardFilter.error, context);
    }
    query = dashboardFilter.query;
    var scope = security.resolveDataPermission(resolved.config.dataPermission, context);
    if (scope && scope.error) return scope.error;
    query = security.combineQuery(query, scope);
    file = new SCFile("esdEmailLog", SCFILE_READONLY);
    file.setFields(["ticket.id", "mail.from", "mail.to", "mail.queue.time"]);
    var rc = file.doSelect(query);
    while (rc === RC_SUCCESS && total < maxScanRecords) {
      total++;
      emailLogIncrement(tickets, file["ticket.id"]);
      emailLogIncrement(senders, file["mail.from"]);
      emailLogRecipients(file["mail.to"], recipients);
      var queueDay = emailLogDay(file["mail.queue.time"]);
      if (queueDay !== "KhÃ´ng xÃ¡c Ä‘á»‹nh" && queueDay === todayKey) todayEmails++;
      if (queueDay !== "Không xác định") emailLogIncrement(dayCounts, queueDay);
      rc = file.getNext();
    }
    var ticketCount = emailLogTop(tickets, maxScanRecords).length;
    /* The three-day trend is always present: today and the two preceding
     * calendar days. Date filters narrow the counts but never create/remove
     * the three labels. */
    var recentDays = emailLogRecentDays(todayKey);
    for (var dayIndex = 0; dayIndex < recentDays.keys.length; dayIndex++) {
      var recentKey = recentDays.keys[dayIndex];
      recentDays.counts["$" + recentKey] = dayCounts["$" + recentKey] || 0;
    }
    return {
      success: true,
      data: {
        summary: {
          totalEmails: total,
          todayEmails: todayEmails,
          totalTickets: ticketCount,
          averageEmailsPerTicket: ticketCount ? Math.round(total * 100 / ticketCount) / 100 : 0
        },
        trend: emailLogTrendItems(recentDays),
        bySender: emailLogTop(senders, topItems),
        topTickets: emailLogTop(tickets, topItems),
        topRecipients: emailLogTop(recipients, topItems),
        scanned: total,
        truncated: total >= maxScanRecords
      }
    };
  } catch (error) {
    return { success: false, code: "EMAIL_LOG_DASHBOARD_FAILED", message: "Không thể tổng hợp nhật ký email" };
  } finally {
    emailLogClose(file);
  }
}
