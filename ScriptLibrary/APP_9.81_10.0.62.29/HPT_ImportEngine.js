/**
 * ScriptLibrary name: HPT_ImportEngine
 * Reusable backend pipeline for validate/commit import requests.
 */

function importEngineFailure(code, message) {
  return { success: false, code: code, message: message };
}

function importEngineMode(input) {
  return input && input.importMode === "validate" ? "validate" : "commit";
}

function importEngineColumns(handler) {
  var columns = handler.getColumns();
  if (!Array.isArray(columns) || !columns.length) return null;
  for (var i = 0; i < columns.length; i++) {
    if (!columns[i] || typeof columns[i].input !== "string" || !columns[i].input ||
        typeof columns[i].property !== "string" || !columns[i].property) return null;
  }
  return columns;
}

/* Input HTTP hiện dùng các mảng scalar song song. Engine chuyển chúng thành row
 * chuẩn để domain handler không phụ thuộc transport format của màn hình. */
function importEngineRows(input, columns, maximum) {
  var rowNumbers = input && input.rowNumbers;
  if (!Array.isArray(rowNumbers) || !rowNumbers.length || rowNumbers.length > maximum) {
    return importEngineFailure("INVALID_IMPORT_CHUNK", "Dữ liệu import không hợp lệ");
  }
  var rows = [];
  for (var c = 0; c < columns.length; c++) {
    var values = input[columns[c].input];
    if (values === undefined && columns[c].optional === true) continue;
    if (!Array.isArray(values) || values.length !== rowNumbers.length) {
      return importEngineFailure("INVALID_IMPORT_CHUNK", "Các cột import không đồng nhất số dòng");
    }
  }
  for (var i = 0; i < rowNumbers.length; i++) {
    var row = { rowNumber: Number(rowNumbers[i]) };
    for (c = 0; c < columns.length; c++) {
      var source = input[columns[c].input];
      row[columns[c].property] = Array.isArray(source) ? source[i] : undefined;
    }
    rows.push(row);
  }
  return { success: true, rows: rows };
}

function importEngineResult(row, outcome, mode) {
  outcome = outcome || {};
  var ok = outcome.success === true;
  return {
    id: String(row.rowNumber),
    rowNumber: row.rowNumber,
    success: ok,
    code: outcome.code || "",
    message: outcome.message || (ok
      ? (mode === "validate" ? "Hợp lệ" : "Nhập thành công")
      : "Không thể nhập dữ liệu"),
    recordId: ok && outcome.data ? outcome.data.id || "" : ""
  };
}

function importEngineCall(handler, method, context, fallbackCode) {
  if (typeof handler[method] !== "function") return { success: true };
  try {
    return handler[method](context) || { success: true };
  } catch (error) {
    return importEngineFailure(fallbackCode, "Không thể xử lý dữ liệu import");
  }
}

// Chạy cùng một pipeline cho pre-check, import trực tiếp và background job.
function execute(handlerId, actionContext) {
  actionContext = actionContext || {};
  var registry = lib.HPT_ImportHandlerRegistry;
  if (!registry || typeof registry.resolve !== "function") {
    return importEngineFailure("IMPORT_REGISTRY_UNAVAILABLE", "Không thể khởi tạo import");
  }
  var resolved = registry.resolve(handlerId);
  if (!resolved || resolved.success !== true) {
    return importEngineFailure(
      resolved && resolved.code || "IMPORT_HANDLER_UNAVAILABLE",
      "Không thể khởi tạo xử lý import"
    );
  }
  var handler = resolved.handler;
  var columns = importEngineColumns(handler);
  if (!columns) return importEngineFailure("IMPORT_HANDLER_INVALID", "Cấu hình import không hợp lệ");
  var maximum = Math.max(1, Math.min(Number(handler.maxChunkSize) || 100, 1000));
  var input = actionContext.input || {};
  var mode = importEngineMode(input);
  var materialized = importEngineRows(input, columns, maximum);
  if (!materialized.success) return materialized;

  var rows = materialized.rows;
  var baseContext = {
    handlerId: handlerId,
    mode: mode,
    input: input,
    actionContext: actionContext,
    rows: rows,
    state: {}
  };
  for (var i = 0; i < rows.length; i++) {
    if (typeof handler.normalizeRow !== "function") continue;
    try {
      rows[i] = handler.normalizeRow({
        row: rows[i], index: i, mode: mode, input: input,
        actionContext: actionContext
      }) || rows[i];
    } catch (error) {
      return importEngineFailure("IMPORT_NORMALIZE_FAILED", "Không thể chuẩn hóa dữ liệu import");
    }
  }

  var prepared = importEngineCall(handler, "prepareBatch", baseContext, "IMPORT_PREPARE_FAILED");
  if (prepared.success !== true) return prepared;
  baseContext.state = prepared.state || {};

  var results = [];
  var succeeded = 0;
  for (i = 0; i < rows.length; i++) {
    var rowContext = {
      row: rows[i], index: i, mode: mode, input: input,
      actionContext: actionContext, state: baseContext.state,
      rows: rows
    };
    var outcome = importEngineCall(handler, "validateRow", rowContext, "IMPORT_VALIDATE_FAILED");
    if (outcome.success === true && mode === "commit") {
      outcome = importEngineCall(handler, "executeRow", rowContext, "IMPORT_EXECUTE_FAILED");
    }
    var itemResult = importEngineResult(rows[i], outcome, mode);
    if (itemResult.success) succeeded += 1;
    results.push(itemResult);
  }

  var finalContext = {
    handlerId: handlerId, mode: mode, input: input,
    actionContext: actionContext, rows: rows,
    state: baseContext.state, results: results
  };
  var finalized = importEngineCall(handler, "finalizeBatch", finalContext, "IMPORT_FINALIZE_FAILED");
  if (finalized.success !== true) return finalized;
  return {
    success: true,
    message: (mode === "validate" ? "Đã kiểm tra " : "Đã xử lý ") + results.length + " dòng import",
    data: {
      summary: {
        total: results.length,
        succeeded: succeeded,
        failed: results.length - succeeded
      }
    },
    relatedResults: results
  };
}
