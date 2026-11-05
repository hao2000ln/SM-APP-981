/**
 * ScriptLibrary name: HPT_ContractService
 * Business rules for contract actions. No screen rendering logic belongs here.
 * Validate input và điều phối Repository; không chứa xử lý UI.
 */

// Chuẩn hóa text đầu vào nghiệp vụ.
function contractText(value) {
  return String(value === undefined || value === null ? "" : value)
    .replace(/^\s+|\s+$/g, "");
}

// Phân biệt giá trị được nhập với null/undefined/chuỗi rỗng.
function contractHasValue(value) {
  return value !== undefined && value !== null &&
    !(typeof value === "string" && !contractText(value));
}

// Validate dữ liệu dùng chung một lần trước khi chạy batch update.
function prepareUpdate(batchContext) {
  batchContext = batchContext || {};
  var input = batchContext.input || {};
  var repository = lib.HPT_ContractRepository;
  if (!repository) {
    return { success: false, code: "CONTRACT_REPOSITORY_UNAVAILABLE", message: "Không thể chuẩn bị cập nhật hợp đồng" };
  }
  var state = {};
  var status = contractText(input.status);
  if (status) {
    var statusCheck = repository.validateStatus(status);
    if (!statusCheck || statusCheck.success !== true) return statusCheck;
    state.statusValidated = true;
  }
  var contractNo = contractText(input.contractNo);
  if (contractNo && (!batchContext.items || batchContext.items.length !== 1)) {
    return {
      success: false,
      code: "CONTRACT_NO_SINGLE_ONLY",
      message: "Số hợp đồng chỉ được cập nhật khi chọn một bản ghi"
    };
  }
  state.singleContractNumber = !!contractNo;
  return { success: true, state: state };
}

// Áp dụng rule cập nhật rồi chuyển changes đã chuẩn hóa xuống Repository.
function updateContract(actionContext) {
  actionContext = actionContext || {};
  var input = actionContext.input || {};
  var repository = lib.HPT_ContractRepository;
  if (!repository || typeof repository.updateContract !== "function") {
    return { 
      success: false,
      code: "CONTRACT_REPOSITORY_UNAVAILABLE", 
      message: "Không thể cập nhật hợp đồng" 
    };
  }

  var changes = {};
  var status = contractText(input.status);
  if (status) {
    if (status.length > 255) {
      return { success: false, code: "STATUS_TOO_LONG", message: "Trạng thái không hợp lệ" };
    }
    if (!actionContext.shared || actionContext.shared.statusValidated !== true) {
      var statusCheck = repository.validateStatus(status);
      if (!statusCheck || statusCheck.success !== true) return statusCheck;
    }
    changes.status = status;
  }

  if (contractHasValue(input.isBudgeted)) {
    if (input.isBudgeted !== true && input.isBudgeted !== false &&
        input.isBudgeted !== "true" && input.isBudgeted !== "false") {
      return { success: false, code: "INVALID_BUDGETED", message: "Giá trị Có dự chi không hợp lệ" };
    }
    changes.isBudgeted = input.isBudgeted === true || input.isBudgeted === "true";
  }

  if (contractHasValue(input.startDate)) changes.startDate = input.startDate;

  var reason = contractText(actionContext.reason);
  if (reason) {
    if (reason.length > 1000) {
      return { success: false, code: "REASON_TOO_LONG", message: "Lý do vượt quá độ dài cho phép" };
    }
    changes.reason = reason;
  }

  var contractNo = contractText(input.contractNo);
  if (contractNo) {
    if (contractNo.length > 500) {
      return { success: false, code: "CONTRACT_NO_TOO_LONG", message: "Số hợp đồng vượt quá độ dài cho phép" };
    }
    var itemCount = actionContext.batch && actionContext.batch.items
      ? actionContext.batch.items.length : 1;
    if ((!actionContext.shared || actionContext.shared.singleContractNumber !== true) &&
        itemCount !== 1) {
      return {
        success: false,
        code: "CONTRACT_NO_SINGLE_ONLY",
        message: "Số hợp đồng chỉ được cập nhật khi chọn một bản ghi"
      };
    }
    var numberCheck = repository.validateContractNumber(contractNo, actionContext.id);
    if (!numberCheck || numberCheck.success !== true) return numberCheck;
    changes.contractNo = contractNo;
  }

  if (contractHasValue(input.contractValueTotal)) {
    var total = typeof input.contractValueTotal === "number"
      ? input.contractValueTotal : Number(input.contractValueTotal);
    if (!isFinite(total) || total < 0) {
      return { success: false, code: "INVALID_CONTRACT_VALUE", message: "Tổng giá trị hợp đồng không hợp lệ" };
    }
    changes.contractValueTotal = total;
  }

  var hasChanges = false;
  var key;
  for (key in changes) {
    if (Object.prototype.hasOwnProperty.call(changes, key)) {
      hasChanges = true;
      break;
    }
  }
  if (!hasChanges) {
    return { success: false, code: "NO_CHANGES", message: "Vui lòng nhập ít nhất một giá trị cần cập nhật" };
  }
  return repository.updateContract(actionContext.file, changes);
}

// Kiểm tra giới hạn/trùng lặp rồi tạo một hợp đồng cho mỗi trạng thái.
function createFromStatuses(actionContext) {
  actionContext = actionContext || {};
  var repository = lib.HPT_ContractRepository;
  if (!repository || typeof repository.createFromStatus !== "function" ||
      typeof repository.findUsedStatuses !== "function") {
    return {
      success: false,
      code: "CONTRACT_REPOSITORY_UNAVAILABLE",
      message: "Không thể tạo hợp đồng"
    };
  }
  var selection = actionContext.relatedSelection;
  if (!selection || selection.screenId !== "status_catalog" ||
      !Array.isArray(selection.items) || !selection.items.length) {
    return {
      success: false,
      code: "INVALID_RELATED_SELECTION",
      message: "Danh sách trạng thái không hợp lệ"
    };
  }
  var configuredLimit = Number(
    actionContext.actionConfig && actionContext.actionConfig.relatedSelection &&
    actionContext.actionConfig.relatedSelection.maxItems
  ) || 20;
  if (selection.items.length > configuredLimit) {
    return {
      success: false,
      code: "CREATE_LIMIT_EXCEEDED",
      message: "Chỉ được tạo tối đa " + configuredLimit + " hợp đồng trong một lần"
    };
  }
  var results = [];
  var createdIds = [];
  var candidates = [];
  var selectedStatuses = {};
  for (var i = 0; i < selection.items.length; i++) {
    var selectedItem = selection.items[i] || {};
    var status = contractText(
      selectedItem.data && selectedItem.data.status_en
    );
    if (!status || status.length > 255) {
      results.push({
        id: contractText(selectedItem.id),
        success: false,
        code: "INVALID_STATUS_VALUE",
        message: "Giá trị status.en không hợp lệ"
      });
      continue;
    }
    if (selectedStatuses["$" + status]) {
      results.push({
        id: contractText(selectedItem.id), status: status, success: false,
        code: "DUPLICATE_STATUS_SELECTION",
        message: "Trạng thái bị chọn trùng trong cùng một lần tạo"
      });
      continue;
    }
    selectedStatuses["$" + status] = true;
    candidates.push({ id: contractText(selectedItem.id), status: status });
  }

  var usage = repository.findUsedStatuses(candidates.map(function (item) { return item.status; }));
  if (!usage || usage.success !== true) {
    return usage || {
      success: false, code: "STATUS_USAGE_CHECK_FAILED",
      message: "Không thể kiểm tra trạng thái đã sử dụng"
    };
  }
  for (i = 0; i < candidates.length; i++) {
    var candidate = candidates[i];
    if (usage.used && usage.used["$" + candidate.status]) {
      results.push({
        id: candidate.id, status: candidate.status, success: false,
        code: "STATUS_ALREADY_USED",
        message: "Trạng thái đã được thêm vào hợp đồng"
      });
      continue;
    }
    /* One selected, unused status row creates exactly one contract record. */
    var created = repository.createFromStatus(candidate.status) || {};
    var result = {
      id: candidate.id,
      status: candidate.status,
      success: created.success === true,
      code: created.code || "",
      message: created.message || (created.success === true
        ? "Tạo hợp đồng thành công" : "Không thể tạo hợp đồng")
    };
    if (created.success === true && created.data && created.data.id) {
      result.contractId = created.data.id;
      createdIds.push(created.data.id);
    }
    results.push(result);
  }
  if (!createdIds.length) {
    return {
      success: false,
      code: "CONTRACT_CREATE_FAILED",
      message: "Không thể tạo hợp đồng từ các trạng thái đã chọn",
      relatedResults: results
    };
  }
  var failed = results.length - createdIds.length;
  return {
    success: true,
    message: failed
      ? "Đã tạo " + createdIds.length + " hợp đồng, " + failed + " bản ghi thất bại"
      : "Đã tạo " + createdIds.length + " hợp đồng thành công",
    data: {
      summary: { total: results.length, succeeded: createdIds.length, failed: failed },
      createdIds: createdIds
    },
    relatedResults: results
  };
}

// Kiểm tra context nghiệp vụ rồi yêu cầu Repository xóa hợp đồng.
function deleteContract(actionContext) {
  actionContext = actionContext || {};
  var repository = lib.HPT_ContractRepository;
  if (!repository || typeof repository.deleteContract !== "function") {
    return {
      success: false,
      code: "CONTRACT_REPOSITORY_UNAVAILABLE",
      message: "Không thể xóa hợp đồng"
    };
  }
  var contractId = contractText(actionContext.id);
  if (!contractId) {
    return {
      success: false,
      code: "INVALID_CONTRACT_ID",
      message: "Mã hợp đồng không hợp lệ"
    };
  }
  return repository.deleteContract(contractId);
}

// Pre-check or import one chunk represented by parallel scalar arrays.
function importContracts(actionContext) {
  /* Compatibility entry point: sau khi publish Sprint 1, caller cũ cũng được
   * chuyển qua engine mới. Khối xử lý cũ bên dưới chỉ là fallback khi rollout
   * ScriptLibrary chưa đồng bộ giữa các App Server. */
  var sharedImportEngine = lib.HPT_ImportEngine;
  if (sharedImportEngine && typeof sharedImportEngine.execute === "function") {
    return sharedImportEngine.execute("contracts.import", actionContext || {});
  }
  actionContext = actionContext || {};
  var input = actionContext.input || {};
  var repository = lib.HPT_ContractRepository;
  if (!repository || typeof repository.createImportedContract !== "function" ||
      typeof repository.findValidImportStatuses !== "function" ||
      typeof repository.findExistingImportContractNumbers !== "function") {
    return { success: false, code: "CONTRACT_REPOSITORY_UNAVAILABLE", message: "Không thể nhập hợp đồng" };
  }
  var rowNumbers = input.rowNumbers;
  var contractNumbers = input.contract_no;
  var statuses = input.status;
  var startDates = input.start_date || [];
  var totals = input.contract_value_total || [];
  var importMode = input.importMode === "validate" ? "validate" : "commit";
  if (!Array.isArray(rowNumbers) || !Array.isArray(contractNumbers) ||
      !Array.isArray(statuses) || !rowNumbers.length || rowNumbers.length > 100 ||
      contractNumbers.length !== rowNumbers.length || statuses.length !== rowNumbers.length) {
    return { success: false, code: "INVALID_IMPORT_CHUNK", message: "Dữ liệu import không hợp lệ" };
  }
  var uniqueStatuses = contractImportUniqueValues(statuses);
  var uniqueContractNumbers = contractImportUniqueValues(contractNumbers);
  var statusLookup = repository.findValidImportStatuses(uniqueStatuses);
  if (!statusLookup || statusLookup.success !== true) return statusLookup;
  var duplicateLookup = repository.findExistingImportContractNumbers(uniqueContractNumbers);
  if (!duplicateLookup || duplicateLookup.success !== true) return duplicateLookup;
  var validStatuses = statusLookup.values || {};
  var existingContractNumbers = duplicateLookup.values || {};
  var results = [];
  var succeeded = 0;
  for (var i = 0; i < rowNumbers.length; i++) {
    var rowNumber = Number(rowNumbers[i]);
    var contractNo = contractText(contractNumbers[i]);
    var status = contractText(statuses[i]);
    var startDate = contractText(startDates[i]);
    var totalValue = totals[i];
    var failure = null;
    if (!isFinite(rowNumber) || rowNumber < 2) {
      failure = { code: "INVALID_ROW_NUMBER", message: "Số dòng không hợp lệ" };
    } else if (!contractNo || contractNo.length > 500) {
      failure = { code: "INVALID_CONTRACT_NO", message: "Số hợp đồng không hợp lệ" };
    } else if (!status || status.length > 255) {
      failure = { code: "INVALID_STATUS", message: "Trạng thái không hợp lệ" };
    } else if (startDate && !contractImportDateIsValid(startDate)) {
      failure = {
        code: "INVALID_START_DATE",
        message: "Ngày bắt đầu phải có dạng dd/MM/yyyy hoặc yyyy-MM-dd"
      };
    }
    if (!failure && !validStatuses["$" + status]) {
      failure = { code: "INVALID_STATUS", message: "Trạng thái không tồn tại hoặc không còn hiệu lực" };
    }
    if (!failure && existingContractNumbers["$" + contractNo]) {
      failure = { code: "CONTRACT_NO_DUPLICATE", message: "Số hợp đồng đã tồn tại" };
    }
    var normalizedTotal = null;
    if (!failure && totalValue !== "" && totalValue !== null && totalValue !== undefined) {
      normalizedTotal = typeof totalValue === "number" ? totalValue : Number(totalValue);
      if (!isFinite(normalizedTotal) || normalizedTotal < 0) {
        failure = { code: "INVALID_CONTRACT_VALUE", message: "Tổng giá trị hợp đồng không hợp lệ" };
      }
    }
    /* Keep the repository input canonical. Excel/UI may send dd/MM/yyyy, while
     * the SM field adapter accepts the unambiguous yyyy-MM-dd representation. */
    var normalizedStartDate = startDate ? contractImportNormalizeDate(startDate) : "";
    var created = failure || (importMode === "validate"
      ? { success: true, message: "Hợp lệ", data: {} }
      : repository.createImportedContract({
        contractNo: contractNo,
        status: status,
        startDate: normalizedStartDate,
        contractValueTotal: normalizedTotal
      }));
    var ok = created && created.success === true;
    if (ok) succeeded += 1;
    results.push({
      id: String(rowNumber),
      rowNumber: rowNumber,
      success: ok,
      code: created && created.code || "",
      message: created && created.message || (ok
        ? (importMode === "validate" ? "Hợp lệ" : "Nhập thành công")
        : "Không thể nhập dữ liệu"),
      recordId: ok && created.data ? created.data.id : ""
    });
  }
  return {
    success: true,
    message: (importMode === "validate" ? "Đã kiểm tra " : "Đã xử lý ") + results.length + " dòng import",
    data: { summary: { total: results.length, succeeded: succeeded, failed: results.length - succeeded } },
    relatedResults: results
  };
}

function contractImportUniqueValues(values) {
  var result = [];
  var seen = {};
  for (var i = 0; i < values.length; i++) {
    var value = contractText(values[i]);
    if (!value || seen["$" + value]) continue;
    seen["$" + value] = true;
    result.push(value);
  }
  return result;
}

/* Browser validation is only for user experience. Validate the imported date
 * again in the domain service before any record is created. */
function contractImportDateIsValid(value) {
  var source = contractText(value);
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
  var daysInMonth = new Date(year, month, 0).getDate();
  return day <= daysInMonth;
}

// Convert a validated import date to the canonical value used by the SM adapter.
function contractImportNormalizeDate(value) {
  var source = contractText(value);
  var match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(source);
  if (!match) return source;
  return match[3] + "-" + match[2] + "-" + match[1];
}

/* Entry point mới dùng chung cho import trực tiếp và background job.
 * importContracts cũ được giữ trong Sprint 1 để các tích hợp đã publish không bị gãy. */
function executeImport(actionContext) {
  var engine = lib.HPT_ImportEngine;
  if (!engine || typeof engine.execute !== "function") {
    return {
      success: false,
      code: "IMPORT_ENGINE_UNAVAILABLE",
      message: "Không thể khởi tạo import hợp đồng"
    };
  }
  return engine.execute("contracts.import", actionContext || {});
}
