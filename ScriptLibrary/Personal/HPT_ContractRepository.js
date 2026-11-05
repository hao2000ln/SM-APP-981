/**
 * ScriptLibrary name: HPT_ContractRepository
 * SCFile persistence operations for the contract domain.
 * Tập trung tên bảng/field DBDict và toàn bộ thao tác ghi dữ liệu SM.
 */

// Ghi nối tiếp lý do vào field array<character> để giữ lịch sử.
function appendReason(file, reason) {
  var adapter = lib.HPT_SmFieldAdapter;
  if (!adapter || typeof adapter.writeField !== "function") {
    return { success: false, code: "CONTRACT_REPOSITORY_UNAVAILABLE", message: "Không thể ghi dữ liệu hợp đồng" };
  }
  print("Appending reason to contract file: " + file);
  print("Reason: " + reason);
  var written = adapter.writeField(file, {
    field: "reason",
    smType: "array",
    elementType: "character",
    writeMode: "append",
    maxItemLength: 1000,
    maxItems: 10000
  }, reason);
  if (!written || written.success !== true) return written;
  var rc = file.doUpdate();
  return rc === RC_SUCCESS
    ? { success: true, message: "Cập nhật lý do thành công" }
    : { success: false, code: "CONTRACT_UPDATE_FAILED", message: "Không thể cập nhật hợp đồng" };
}

// Nạp utility tại runtime, tránh giữ dependency ScriptLibrary ở top-level.
function contractRepositoryUtils() {
  var utils = lib.HPT_CommonApiUtils;
  if (!utils || typeof utils.buildEqualFilter !== "function") {
    return null;
  }
  return utils;
}

// Xác minh mã trạng thái tồn tại trong danh mục.
function validateStatus(status) {
  var utils = contractRepositoryUtils();
  if (!utils) {
    return { success: false, code: "CONTRACT_REPOSITORY_UNAVAILABLE", message: "Không thể kiểm tra trạng thái" };
  }
  var catalog = new SCFile("esdDMstatus");
  var rc = catalog.doSelect(utils.buildEqualFilter("status.en", status));
  if (rc === RC_SUCCESS) return { success: true };
  if (typeof utils.isNotFoundRc === "function" && utils.isNotFoundRc(rc)) {
    return { success: false, code: "INVALID_STATUS", message: "Trạng thái không tồn tại hoặc không còn hiệu lực" };
  }
  return { success: false, code: "STATUS_CHECK_FAILED", message: "Không thể kiểm tra trạng thái" };
}

// Chặn số hợp đồng trùng, ngoại trừ bản ghi đang cập nhật.
function validateContractNumber(contractNo, currentId) {
  var utils = contractRepositoryUtils();
  if (!utils) {
    return { success: false, code: "CONTRACT_REPOSITORY_UNAVAILABLE", message: "Không thể kiểm tra số hợp đồng" };
  }
  var duplicate = new SCFile("esdHDcontract");
  var rc = duplicate.doSelect(utils.buildEqualFilter("contract.no", contractNo));
  if (rc !== RC_SUCCESS) {
    if (typeof utils.isNotFoundRc === "function" && utils.isNotFoundRc(rc)) {
      return { success: true };
    }
    return { success: false, code: "CONTRACT_NO_CHECK_FAILED", message: "Không thể kiểm tra số hợp đồng" };
  }
  var existingId = duplicate["id"] === undefined || duplicate["id"] === null
    ? "" : String(duplicate["id"]);
  return existingId === String(currentId || "")
    ? { success: true }
    : { success: false, code: "CONTRACT_NO_DUPLICATE", message: "Số hợp đồng đã tồn tại" };
}

// Batch lookup used by import pre-check to avoid one query for every row.
function findValidImportStatuses(values) {
  return findImportValues("esdDMstatus", "status.en", values,
    "STATUS_CHECK_FAILED", "Không thể kiểm tra danh mục trạng thái");
}

// Returns contract numbers that already exist in the contract table.
function findExistingImportContractNumbers(values) {
  return findImportValues("esdHDcontract", "contract.no", values,
    "CONTRACT_NO_CHECK_FAILED", "Không thể kiểm tra số hợp đồng đã tồn tại");
}

function findImportValues(table, field, values, errorCode, errorMessage) {
  var utils = contractRepositoryUtils();
  if (!utils || !Array.isArray(values)) {
    return { success: false, code: errorCode, message: errorMessage };
  }
  var found = {};
  if (!values.length) return { success: true, values: found };
  var file = null;
  try {
    file = new SCFile(table, SCFILE_READONLY);
    if (typeof file.setFields === "function") file.setFields([field]);
    var rc = file.doSelect(utils.buildInFilter(field, values));
    while (rc === RC_SUCCESS) {
      var raw = file[field];
      var value = raw === undefined || raw === null ? "" : String(raw);
      if (value) found["$" + value] = true;
      rc = file.getNext();
    }
    if (typeof utils.isNotFoundRc === "function" && !utils.isNotFoundRc(rc)) {
      return { success: false, code: errorCode, message: errorMessage };
    }
    return { success: true, values: found };
  } catch (error) {
    return { success: false, code: errorCode, message: errorMessage };
  } finally {
    if (utils && typeof utils.closeFile === "function") utils.closeFile(file);
    else if (file) try { file.doClose(); } catch (ignored) {}
  }
}

// Ánh xạ changes sang DBDict và thực hiện doUpdate một lần.
function updateContract(file, changes) {
  var adapter = lib.HPT_SmFieldAdapter;
  if (!adapter || typeof adapter.writeField !== "function") {
    return { success: false, code: "CONTRACT_REPOSITORY_UNAVAILABLE", message: "Không thể ghi dữ liệu hợp đồng" };
  }
  var descriptors = {
    status: {
      field: "status", smType: "character", writeMode: "replace", maxItemLength: 255
    },
    isBudgeted: {
      field: "is.budgeted", smType: "logical", writeMode: "replace"
    },
    startDate: {
      field: "start.date", smType: "date/time", writeMode: "replace"
    },
    reason: {
      field: "reason", smType: "array", elementType: "character",
      writeMode: "append", maxItemLength: 1000, maxItems: 10000
    },
    contractNo: {
      field: "contract.no", smType: "character", writeMode: "replace", maxItemLength: 500
    },
    contractValueTotal: {
      field: "contract.value.total", smType: "number", writeMode: "replace"
    }
  };
  var key;
  for (key in descriptors) {
    if (!Object.prototype.hasOwnProperty.call(descriptors, key) ||
        !Object.prototype.hasOwnProperty.call(changes, key)) continue;
    var written = adapter.writeField(file, descriptors[key], changes[key]);
    if (!written || written.success !== true) return written;
  }
  var rc = file.doUpdate();
  return rc === RC_SUCCESS
    ? { success: true, message: "Cập nhật hợp đồng thành công" }
    : { success: false, code: "CONTRACT_UPDATE_FAILED", message: "Không thể cập nhật hợp đồng" };
}

/* Returns a set of status.en values already assigned to a contract. One query
 * is used for the whole selector submission to avoid an N+1 lookup pattern. */
function findUsedStatuses(statusValues) {
  var utils = contractRepositoryUtils();
  if (!utils || !Array.isArray(statusValues)) {
    return { success: false, code: "STATUS_USAGE_CHECK_FAILED", message: "Không thể kiểm tra trạng thái đã sử dụng" };
  }
  var used = {};
  if (!statusValues.length) return { success: true, used: used };
  var file = null;
  try {
    file = new SCFile("esdHDcontract", SCFILE_READONLY);
    file.setFields(["contract.status.id"]);
    var rc = file.doSelect(utils.buildInFilter("contract.status.id", statusValues));
    while (rc === RC_SUCCESS) {
      var value = file["contract.status.id"] === undefined || file["contract.status.id"] === null
        ? "" : String(file["contract.status.id"]);
      if (value) used["$" + value] = true;
      rc = file.getNext();
    }
    if (typeof utils.isNotFoundRc === "function" && !utils.isNotFoundRc(rc)) {
      return { success: false, code: "STATUS_USAGE_CHECK_FAILED", message: "Không thể kiểm tra trạng thái đã sử dụng" };
    }
    return { success: true, used: used };
  } catch (error) {
    return { success: false, code: "STATUS_USAGE_CHECK_FAILED", message: "Không thể kiểm tra trạng thái đã sử dụng" };
  } finally {
    if (utils && typeof utils.closeFile === "function") utils.closeFile(file);
    else if (file) try { file.doClose(); } catch (ignored) {}
  }
}

/* Creates one contract for one backend-verified status.en value. The field
 * contract.status.id is character, never an array. */
// Sinh next number và tạo một ticket hợp đồng cho một status.en.
function createFromStatus(statusValue) {
  var esdUtils = lib.ESD_Utils;
  if (!esdUtils || typeof esdUtils.generateNextNumber !== "function" ||
      typeof esdUtils.CreateTicket !== "function") {
    return {
      success: false,
      code: "ESD_UTILS_UNAVAILABLE",
      message: "Thư viện tạo hợp đồng chưa sẵn sàng"
    };
  }
  var tableName = "esdHDcontract";
  var nextNumber = esdUtils.generateNextNumber(tableName);
  if (!nextNumber) {
    return {
      success: false,
      code: "NEXT_NUMBER_FAILED",
      message: "Không thể sinh mã hợp đồng"
    };
  }
  var fields = {
    id: nextNumber,
    "contract.status.id": statusValue
  };
  var created = esdUtils.CreateTicket(tableName, fields);
  return created
    ? {
      success: true,
      message: "Tạo hợp đồng " + nextNumber + " thành công",
      data: { id: nextNumber, contractStatusId: statusValue }
    }
    : {
      success: false,
      code: "CONTRACT_CREATE_FAILED",
      message: "Không thể tạo hợp đồng"
    };
}

/* Deletes exactly one backend-verified contract. Table and field names are
 * fixed here; the browser can never provide a filename or an SM query. */
// Xóa đúng một ticket hợp đồng theo id đã được backend xác minh.
function deleteContract(contractId) {
  var utils = contractRepositoryUtils();
  var esdUtils = lib.ESD_Utils;
  if (!utils || !esdUtils || typeof esdUtils.deleteTicket !== "function") {
    return {
      success: false,
      code: "ESD_UTILS_UNAVAILABLE",
      message: "Thư viện xóa hợp đồng chưa sẵn sàng"
    };
  }
  var id = String(contractId === undefined || contractId === null ? "" : contractId)
    .replace(/^\s+|\s+$/g, "");
  if (!id) {
    return { success: false, code: "INVALID_CONTRACT_ID", message: "Mã hợp đồng không hợp lệ" };
  }
  var query = utils.buildEqualFilter("id", id);
  try {
    /* ESD_Utils.deleteTicket returns undefined in the current implementation;
     * a thrown error or an explicit false value is treated as failure. */
    var deleted = esdUtils.deleteTicket("esdHDcontract", query);
    if (deleted === false) {
      return { success: false, code: "CONTRACT_DELETE_FAILED", message: "Không thể xóa hợp đồng" };
    }
    return {
      success: true,
      deleted: true,
      message: "Xóa hợp đồng " + id + " thành công",
      data: { id: id }
    };
  } catch (error) {
    return {
      success: false,
      code: "CONTRACT_DELETE_FAILED",
      message: "Không thể xóa hợp đồng"
    };
  }
}

// Create one contract from an already normalized import row.
function createImportedContract(row) {
  row = row || {};
  var esdUtils = lib.ESD_Utils;
  var adapter = lib.HPT_SmFieldAdapter;
  if (!esdUtils || typeof esdUtils.generateNextNumber !== "function" ||
      typeof esdUtils.CreateTicket !== "function" || !adapter ||
      typeof adapter.writeField !== "function") {
    return { success: false, code: "ESD_UTILS_UNAVAILABLE", message: "Thư viện tạo hợp đồng chưa sẵn sàng" };
  }
  var duplicate = validateContractNumber(row.contractNo, "");
  if (!duplicate || duplicate.success !== true) return duplicate;
  var nextNumber = esdUtils.generateNextNumber("esdHDcontract");
  if (!nextNumber) {
    return { success: false, code: "NEXT_NUMBER_FAILED", message: "Không thể sinh mã hợp đồng" };
  }
  /* Normalize every value through the same adapter used by update actions.
   * In particular, start.date must reach SCFile as Date instead of an Excel
   * display string such as 15/10/2026. */
  var fields = {};
  var writes = [
    [{ field: "id", smType: "character", writeMode: "replace", maxItemLength: 255 }, nextNumber],
    [{ field: "contract.no", smType: "character", writeMode: "replace", maxItemLength: 500 }, row.contractNo],
    [{ field: "status", smType: "character", writeMode: "replace", maxItemLength: 255 }, row.status]
  ];
  if (row.startDate) {
    writes.push([{ field: "start.date", smType: "date/time", writeMode: "replace" }, row.startDate]);
  }
  if (row.contractValueTotal !== null && row.contractValueTotal !== undefined &&
      row.contractValueTotal !== "") {
    writes.push([{ field: "contract.value.total", smType: "number", writeMode: "replace" }, row.contractValueTotal]);
  }
  for (var i = 0; i < writes.length; i++) {
    var written = adapter.writeField(fields, writes[i][0], writes[i][1]);
    if (!written || written.success !== true) return written;
  }
  var created = false;
  try {
    created = esdUtils.CreateTicket("esdHDcontract", fields);
  } catch (error) {
    print("createImportedContract EXCEPTION: " + (error && error.message ? error.message : error));
    created = false;
  }
  return created
    ? { success: true, message: "Tạo hợp đồng thành công", data: { id: nextNumber } }
    : { success: false, code: "CONTRACT_CREATE_FAILED", message: "Không thể tạo hợp đồng" };
}
