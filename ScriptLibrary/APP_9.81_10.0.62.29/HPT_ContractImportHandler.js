/**
 * ScriptLibrary name: HPT_ContractImportHandler
 * Contract-specific mapping, validation and persistence for the shared import engine.
 */

function contractImportText(value) {
  return String(value === undefined || value === null ? "" : value)
    .replace(/^\s+|\s+$/g, "");
}

function contractImportUniqueValues(rows, property) {
  var result = [];
  var seen = {};
  for (var i = 0; i < rows.length; i++) {
    var value = contractImportText(rows[i][property]);
    if (!value || seen["$" + value]) continue;
    seen["$" + value] = true;
    result.push(value);
  }
  return result;
}

function contractImportDateIsValid(value) {
  var source = contractImportText(value);
  var match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(source);
  var day;
  var month;
  var year;
  if (match) {
    day = Number(match[1]);
    month = Number(match[2]);
    year = Number(match[3]);
  } else {
    match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(source);
    if (!match) return false;
    year = Number(match[1]);
    month = Number(match[2]);
    day = Number(match[3]);
  }
  if (year < 1900 || year > 9999 || month < 1 || month > 12 || day < 1) return false;
  return day <= new Date(year, month, 0).getDate();
}

function contractImportNormalizeDate(value) {
  var source = contractImportText(value);
  var match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(source);
  return match ? match[3] + "-" + match[2] + "-" + match[1] : source;
}

function contractImportRepository() {
  var repository = lib.HPT_ContractRepository;
  return repository && typeof repository.createImportedContract === "function" &&
    typeof repository.findValidImportStatuses === "function" &&
    typeof repository.findExistingImportContractNumbers === "function"
    ? repository : null;
}

function getHandler() {
  return {
    maxChunkSize: 100,

    // Tên input thuộc API; tên property là model nội bộ được truyền qua pipeline.
    getColumns: function () {
      return [
        { input: "contract_no", property: "contractNo" },
        { input: "status", property: "status" },
        { input: "start_date", property: "startDate", optional: true },
        { input: "contract_value_total", property: "contractValueTotal", optional: true }
      ];
    },

    normalizeRow: function (context) {
      var row = context.row;
      var rawTotal = row.contractValueTotal;
      return {
        rowNumber: Number(row.rowNumber),
        contractNo: contractImportText(row.contractNo),
        status: contractImportText(row.status),
        startDate: contractImportText(row.startDate),
        normalizedStartDate: row.startDate
          ? contractImportNormalizeDate(row.startDate) : "",
        contractValueTotal: rawTotal === "" || rawTotal === null || rawTotal === undefined
          ? null : (typeof rawTotal === "number" ? rawTotal : Number(rawTotal))
      };
    },

    // Lookup theo batch để số query không tăng tuyến tính theo số dòng import.
    prepareBatch: function (context) {
      var repository = contractImportRepository();
      if (!repository) {
        return { success: false, code: "CONTRACT_REPOSITORY_UNAVAILABLE", message: "Không thể nhập hợp đồng" };
      }
      var statusLookup = repository.findValidImportStatuses(
        contractImportUniqueValues(context.rows, "status")
      );
      if (!statusLookup || statusLookup.success !== true) return statusLookup;
      var duplicateLookup = repository.findExistingImportContractNumbers(
        contractImportUniqueValues(context.rows, "contractNo")
      );
      if (!duplicateLookup || duplicateLookup.success !== true) return duplicateLookup;
      return {
        success: true,
        state: {
          repository: repository,
          validStatuses: statusLookup.values || {},
          existingContractNumbers: duplicateLookup.values || {}
        }
      };
    },

    validateRow: function (context) {
      var row = context.row;
      var state = context.state || {};
      if (!isFinite(row.rowNumber) || row.rowNumber < 2) {
        return { success: false, code: "INVALID_ROW_NUMBER", message: "Số dòng không hợp lệ" };
      }
      if (!row.contractNo || row.contractNo.length > 500) {
        return { success: false, code: "INVALID_CONTRACT_NO", message: "Số hợp đồng không hợp lệ" };
      }
      if (!row.status || row.status.length > 255) {
        return { success: false, code: "INVALID_STATUS", message: "Trạng thái không hợp lệ" };
      }
      if (row.startDate && !contractImportDateIsValid(row.startDate)) {
        return {
          success: false, code: "INVALID_START_DATE",
          message: "Ngày bắt đầu phải có dạng dd/MM/yyyy hoặc yyyy-MM-dd"
        };
      }
      if (!state.validStatuses || !state.validStatuses["$" + row.status]) {
        return {
          success: false, code: "INVALID_STATUS",
          message: "Trạng thái không tồn tại hoặc không còn hiệu lực"
        };
      }
      if (state.existingContractNumbers && state.existingContractNumbers["$" + row.contractNo]) {
        return {
          success: false, code: "CONTRACT_NO_DUPLICATE",
          message: "Số hợp đồng đã tồn tại"
        };
      }
      if (row.contractValueTotal !== null &&
          (!isFinite(row.contractValueTotal) || row.contractValueTotal < 0)) {
        return {
          success: false, code: "INVALID_CONTRACT_VALUE",
          message: "Tổng giá trị hợp đồng không hợp lệ"
        };
      }
      return { success: true, message: "Hợp lệ" };
    },

    executeRow: function (context) {
      var row = context.row;
      return context.state.repository.createImportedContract({
        contractNo: row.contractNo,
        status: row.status,
        startDate: row.normalizedStartDate,
        contractValueTotal: row.contractValueTotal
      });
    }
  };
}
