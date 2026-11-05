/**
 * ScriptLibrary name: HPT_BatchActionEngine
 * Executes registered bulk actions with row scope and optimistic locking.
 * Chuẩn hóa input, quyền, selection, sysmodtime và kết quả thành công/lỗi từng dòng.
 */

// Nạp các dependency framework cần cho một lần thực thi batch.
function batchDependencies() {
  var utils = lib.HPT_CommonApiUtils;
  var security = lib.HPT_ApiSecurity;
  var fieldAdapter = lib.HPT_SmFieldAdapter;
  var actionOrchestrator = lib.HPT_ActionOrchestrator;
  var screenRegistry = lib.HPT_ScreenRegistry;
  if (!utils || !security || !fieldAdapter || !actionOrchestrator) {
    throw new Error("Batch action dependencies are not available");
  }
  return {
    utils: utils,
    security: security,
    fieldAdapter: fieldAdapter,
    actionOrchestrator: actionOrchestrator,
    screenRegistry: screenRegistry
  };
}

function batchRetryable(code) {
  return code === "RECORD_MODIFIED_CONCURRENTLY" ||
    code === "QUERY_ERROR";
}

// Chuẩn hóa kết quả từng dòng để mọi màn hình có thể hiển thị/retry thống nhất.
function batchResult(id, success, code, message, extra) {
  var result = { id: id, success: success === true, message: message || "" };
  var key;
  if (code) result.code = code;
  for (key in (extra || {})) {
    if (Object.prototype.hasOwnProperty.call(extra, key)) result[key] = extra[key];
  }
  if (!result.success && result.retryable === undefined) {
    result.retryable = batchRetryable(result.code || "");
  }
  return result;
}

// Chuẩn hóa, loại trùng và giới hạn danh sách item từ request.
function normalizeItems(items, maximum, utils) {
  if (!Array.isArray(items) || !items.length) return { code: "MISSING_ITEMS" };
  if (items.length > maximum) return { code: "BATCH_LIMIT_EXCEEDED" };
  var result = [];
  var seen = {};
  var i;
  for (i = 0; i < items.length; i++) {
    var source = items[i];
    var id = source && utils.cleanString(source.id);
    var version = source && utils.cleanString(source.sysmodtime);
    if (!id || id.length > 200 || !version || version.length > 200) {
      return { code: "INVALID_BATCH_ITEM" };
    }
    if (Object.prototype.hasOwnProperty.call(seen, "$" + id)) continue;
    seen["$" + id] = true;
    result.push({ id: id, sysmodtime: version });
  }
  return { items: result };
}

function normalizeInputValue(value) {
  var type = typeof value;
  if (value === null || type === "boolean" || type === "number") return { value: value };
  if (type === "string") {
    if (value.length > 4000) return { code: "ACTION_INPUT_TOO_LONG" };
    return { value: value };
  }
  if (Array.isArray(value)) {
    if (value.length > 100) return { code: "ACTION_INPUT_LIMIT_EXCEEDED" };
    var result = [];
    for (var i = 0; i < value.length; i++) {
      var normalized = normalizeInputValue(value[i]);
      if (normalized.code || Array.isArray(normalized.value)) {
        return { code: normalized.code || "INVALID_ACTION_INPUT" };
      }
      result.push(normalized.value);
    }
    return { value: result };
  }
  return { code: "INVALID_ACTION_INPUT" };
}

function normalizeActionInput(input) {
  if (input === undefined || input === null) return { input: {} };
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { code: "INVALID_ACTION_INPUT" };
  }
  var result = {};
  var count = 0;
  var key;
  for (key in input) {
    if (!Object.prototype.hasOwnProperty.call(input, key)) continue;
    count += 1;
    if (count > 50 || !/^[A-Za-z][A-Za-z0-9_.-]{0,127}$/.test(key)) {
      return { code: "INVALID_ACTION_INPUT" };
    }
    var normalized = normalizeInputValue(input[key]);
    if (normalized.code) return normalized;
    result[key] = normalized.value;
  }
  return { input: result };
}

function findField(config, apiName) {
  var fields = config.fields || [];
  var i;
  for (i = 0; i < fields.length; i++) {
    if (fields[i].api === apiName) return fields[i];
  }
  return null;
}

function findPublicBatchAction(config, actionId) {
  var actions = config.screenPublic && config.screenPublic.bulkActions || [];
  for (var i = 0; i < actions.length; i++) {
    if (actions[i].id === actionId) return actions[i];
  }
  return null;
}

function findPublicScreenAction(config, actionId) {
  var actions = config.screenPublic && config.screenPublic.actions || [];
  for (var i = 0; i < actions.length; i++) {
    if (actions[i].id === actionId) return actions[i];
  }
  return null;
}

function batchConditionValuesEqual(left, right) {
  if (left === null || left === undefined) left = "";
  if (right === null || right === undefined) right = "";
  if (typeof left === "number" && typeof right === "number") return left === right;
  if (typeof left === "boolean" && typeof right === "boolean") return left === right;
  return String(left) === String(right);
}

// Đánh giá cùng DSL với runtime nhưng chỉ trên dữ liệu vừa đọc lại từ backend.
function batchRecordMatchesCondition(row, condition) {
  var rules = condition && condition.rules || [];
  for (var i = 0; i < rules.length; i++) {
    var rule = rules[i];
    var value = row ? row[rule.field] : undefined;
    var empty = value === undefined || value === null || value === "";
    var matched;
    if (rule.operator === "empty") matched = empty;
    else if (rule.operator === "notEmpty") matched = !empty;
    else if (rule.operator === "eq") matched = batchConditionValuesEqual(value, rule.value);
    else if (rule.operator === "neq") matched = !batchConditionValuesEqual(value, rule.value);
    else {
      var found = false;
      var values = rule.values || [];
      for (var valueIndex = 0; valueIndex < values.length; valueIndex++) {
        if (batchConditionValuesEqual(value, values[valueIndex])) {
          found = true;
          break;
        }
      }
      matched = rule.operator === "notIn" ? !found : found;
    }
    if (!matched) return false;
  }
  return true;
}

// Xác minh lại các bản ghi được chọn từ màn hình liên quan trước screen action.
function verifyRelatedSelection(action, publicAction, body, dependencies, request, context) {
  var selector = publicAction && publicAction.selector;
  var payload = body && body.relatedSelection;
  var U = dependencies.utils;
  var Security = dependencies.security;
  if (!selector) {
    return payload === undefined
      ? { success: true, selection: null }
      : { success: false, code: "UNEXPECTED_RELATED_SELECTION", message: "Action không hỗ trợ danh sách liên quan" };
  }
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return { success: false, code: "MISSING_RELATED_SELECTION", message: "Chưa chọn dữ liệu liên quan" };
  }
  var relatedConfig = action.relatedSelection || {};
  if (!dependencies.screenRegistry ||
      typeof dependencies.screenRegistry.resolveScreen !== "function") {
    return {
      success: false,
      code: "RELATED_SCREEN_REGISTRY_UNAVAILABLE",
      message: "Không thể kiểm tra màn hình dữ liệu liên quan"
    };
  }
  var relatedScreenId = U.cleanString(payload.screenId);
  if (!relatedScreenId || relatedScreenId !== selector.screenId ||
      relatedScreenId !== relatedConfig.screenId) {
    return { success: false, code: "INVALID_RELATED_SCREEN", message: "Màn hình dữ liệu liên quan không hợp lệ" };
  }
  var maximum = Math.min(
    Number(relatedConfig.maxItems) || Number(selector.maxItems) || 100,
    Number(selector.maxItems) || 100,
    1000
  );
  var normalized = normalizeItems(payload.items, maximum, U);
  if (normalized.code) {
    return { success: false, code: normalized.code, message: "Danh sách dữ liệu liên quan không hợp lệ" };
  }
  var resolved = dependencies.screenRegistry.resolveScreen(relatedScreenId);
  if (!resolved || resolved.success !== true || !resolved.config) {
    return { success: false, code: "RELATED_SCREEN_UNAVAILABLE", message: "Không thể kiểm tra dữ liệu liên quan" };
  }
  var relatedScreen = resolved.config;
  var auth = Security.authorizeAction(
    relatedScreen.actionPermissions, "list", request, context
  );
  if (!auth || auth.error) {
    return { success: false, error: auth && auth.error, code: "FORBIDDEN", message: "Không có quyền chọn dữ liệu liên quan" };
  }
  var permission = Security.resolveDataPermission(relatedScreen.dataPermission, context);
  if (permission && permission.error) return { success: false, error: permission.error };
  var key = findField(relatedScreen, relatedScreen.keyField);
  var version = findField(relatedScreen, relatedScreen.versionField);
  if (!key || !version) {
    return { success: false, code: "INVALID_RELATED_SCREEN", message: "Màn hình liên quan thiếu khóa phiên bản" };
  }
  var requestedValueFields = relatedConfig.valueFields || [];
  var valueFields = [];
  for (var valueIndex = 0; valueIndex < requestedValueFields.length; valueIndex++) {
    var valueField = findField(relatedScreen, requestedValueFields[valueIndex]);
    if (!valueField) {
      return {
        success: false,
        code: "INVALID_RELATED_SCREEN",
        message: "Màn hình liên quan thiếu field dữ liệu đã cấu hình"
      };
    }
    valueFields.push(valueField);
  }
  var expected = {};
  var verified = {};
  var itemIndex;
  for (itemIndex = 0; itemIndex < normalized.items.length; itemIndex++) {
    expected["$" + normalized.items[itemIndex].id] = normalized.items[itemIndex];
  }
  /* Verify related rows in bounded `isin` chunks instead of issuing one
   * Service Manager select for every selected row or building a long OR query. */
  var verificationChunkSize = Math.min(
    Math.max(1, Number(relatedConfig.verificationChunkSize) || 50), 100
  );
  for (var chunkStart = 0; chunkStart < normalized.items.length;
      chunkStart += verificationChunkSize) {
    var file = null;
    try {
      var selectedIds = [];
      var chunkEnd = Math.min(chunkStart + verificationChunkSize, normalized.items.length);
      for (itemIndex = chunkStart; itemIndex < chunkEnd; itemIndex++) {
        selectedIds.push(normalized.items[itemIndex].id);
      }
      var query = U.buildInFilter(key.db, selectedIds);
      query = Security.combineQuery(query, permission || { query: "true" });
      file = new SCFile(relatedScreen.table, SCFILE_READONLY);
      if (typeof file.setFields === "function") {
        var selectedFields = [key.db, version.db];
        for (var fieldIndex = 0; fieldIndex < valueFields.length; fieldIndex++) {
          selectedFields.push(valueFields[fieldIndex].db);
        }
        file.setFields(selectedFields);
      }
      var rc = file.doSelect(query);
      while (rc === RC_SUCCESS) {
        var selectedId = U.cleanString(U.getSmField(file, key.db));
        var expectedItem = expected["$" + selectedId];
        if (expectedItem) {
          var rawVersion = U.getSmField(file, version.db);
          if (rawVersion !== undefined && rawVersion !== null &&
              typeof version.readTransform === "function") {
            rawVersion = version.readTransform(rawVersion, file);
          }
          if (U.cleanString(rawVersion) !== expectedItem.sysmodtime) {
            return {
              success: false,
              code: "RELATED_RECORD_MODIFIED_CONCURRENTLY",
              message: "Dữ liệu liên quan đã thay đổi, vui lòng chọn lại",
              id: expectedItem.id
            };
          }
          if (valueFields.length) {
            expectedItem.data = {};
            for (fieldIndex = 0; fieldIndex < valueFields.length; fieldIndex++) {
              var fieldValue = U.getSmField(file, valueFields[fieldIndex].db);
              if (fieldValue !== undefined && fieldValue !== null &&
                  typeof valueFields[fieldIndex].readTransform === "function") {
                fieldValue = valueFields[fieldIndex].readTransform(fieldValue, file);
              }
              expectedItem.data[valueFields[fieldIndex].api] = fieldValue;
            }
          }
          verified["$" + selectedId] = true;
        }
        rc = typeof file.getNext === "function" ? file.getNext() : 1;
      }
    } finally {
      U.closeFile(file, context);
    }
  }
  for (itemIndex = 0; itemIndex < normalized.items.length; itemIndex++) {
    if (!verified["$" + normalized.items[itemIndex].id]) {
      return {
        success: false,
        code: "RELATED_RECORD_NOT_FOUND",
        message: "Dữ liệu liên quan không tồn tại hoặc không thuộc phạm vi truy cập",
        id: normalized.items[itemIndex].id
      };
    }
  }
  return {
    success: true,
    selection: { screenId: relatedScreenId, items: normalized.items }
  };
}

function actionInputEmpty(value) {
  if (value === undefined || value === null || value === "") return true;
  if (typeof value === "string" && !value.replace(/^\s+|\s+$/g, "")) return true;
  return Array.isArray(value) && !value.length;
}

function popupInputError(code, field, message) {
  return { code: code, field: field, message: message };
}

function popupConditionMatches(condition, values) {
  if (!condition) return true;
  var actual = values[condition.field];
  var empty = actionInputEmpty(actual);
  if (condition.operator === "empty") return empty;
  if (condition.operator === "notEmpty") return !empty;
  var actualKey = "$" + String(actual);
  if (condition.operator === "eq") return actualKey === "$" + String(condition.value);
  if (condition.operator === "neq") return actualKey !== "$" + String(condition.value);
  var set = {};
  var expected = condition.values || [];
  for (var i = 0; i < expected.length; i++) set["$" + String(expected[i])] = true;
  return condition.operator === "in" ? !!set[actualKey] : !set[actualKey];
}

function popupComparable(field, value) {
  if (field && (field.type === "number" || field.type === "integer" || field.type === "money")) {
    return Number(value);
  }
  if (field && (field.type === "date" || field.type === "datetime")) {
    return new Date(String(value)).getTime();
  }
  return String(value);
}

function popupCompare(left, operator, right) {
  if (operator === "eq") return left === right;
  if (operator === "neq") return left !== right;
  if (operator === "gt") return left > right;
  if (operator === "gte") return left >= right;
  if (operator === "lt") return left < right;
  return left <= right;
}

// Validate dữ liệu Dynamic Form theo metadata public đã được backend chuẩn hóa.
function validatePopupInput(publicAction, input, reason) {
  var popup = publicAction && publicAction.popup;
  var fields = popup && popup.fields || [];
  var allowed = {};
  var allFields = {};
  var formValues = {};
  var i;
  for (i = 0; i < fields.length; i++) {
    allFields[fields[i].name] = fields[i];
    if (fields[i].bind !== "reason") {
      allowed[fields[i].name] = fields[i];
      formValues[fields[i].name] = input[fields[i].name];
    } else {
      formValues[fields[i].name] = reason || "";
    }
  }
  var key;
  for (key in input) {
    if (Object.prototype.hasOwnProperty.call(input, key) && !allowed[key]) {
      return popupInputError("UNKNOWN_ACTION_INPUT", key, "Trường dữ liệu không được khai báo");
    }
  }
  for (key in allFields) {
    if (!Object.prototype.hasOwnProperty.call(allFields, key)) continue;
    var field = allFields[key];
    var value = formValues[key];
    var empty = actionInputEmpty(value);
    var visible = popupConditionMatches(field.visibleIf, formValues);
    var enabled = popupConditionMatches(field.enableIf, formValues);
    if ((!visible || !enabled) && !empty) {
      return popupInputError(
        "ACTION_INPUT_NOT_APPLICABLE", key,
        field.label + " không áp dụng trong trường hợp này"
      );
    }
    if (!visible || !enabled) continue;
    var required = field.required ||
      (field.requiredIf && popupConditionMatches(field.requiredIf, formValues));
    if (required && empty) {
      return popupInputError("ACTION_INPUT_REQUIRED", key, field.label + " không được để trống");
    }
    if (empty) continue;
    if (field.multiple) {
      if (!Array.isArray(value) || value.length > 100) {
        return popupInputError("INVALID_ACTION_INPUT_TYPE", key, field.label + " phải là danh sách");
      }
    } else if (Array.isArray(value)) {
      return popupInputError("INVALID_ACTION_INPUT_TYPE", key, field.label + " không được là danh sách");
    }
    if (field.type === "checkbox") {
      if (typeof value !== "boolean") {
        return popupInputError("INVALID_ACTION_INPUT_TYPE", key, field.label + " phải là kiểu boolean");
      }
      continue;
    }
    if (field.type === "number" || field.type === "integer" || field.type === "money") {
      if (typeof value !== "number" || !isFinite(value) ||
          (field.type === "integer" && Math.floor(value) !== value)) {
        return popupInputError("INVALID_ACTION_INPUT_TYPE", key, field.label + " không đúng định dạng số");
      }
      if (field.min !== undefined && value < Number(field.min)) {
        return popupInputError("ACTION_INPUT_MIN", key, field.label + " nhỏ hơn giá trị cho phép");
      }
      if (field.max !== undefined && value > Number(field.max)) {
        return popupInputError("ACTION_INPUT_MAX", key, field.label + " lớn hơn giá trị cho phép");
      }
      continue;
    }
    var values = field.multiple ? value : [value];
    for (i = 0; i < values.length; i++) {
      if (typeof values[i] !== "string") {
        return popupInputError("INVALID_ACTION_INPUT_TYPE", key, field.label + " phải là chuỗi");
      }
      if (values[i].length < Number(field.minLength || 0) ||
          values[i].length > Number(field.maxLength || 4000)) {
        return popupInputError("ACTION_INPUT_LENGTH", key, field.label + " có độ dài không hợp lệ");
      }
      if (field.pattern) {
        var expression;
        try { expression = new RegExp(field.pattern); } catch (patternError) { expression = null; }
        if (!expression || !expression.test(values[i])) {
          return popupInputError(
            "ACTION_INPUT_PATTERN", key,
            field.patternMessage || (field.label + " không đúng định dạng")
          );
        }
      }
      if (field.type === "date" && !/^\d{4}-\d{2}-\d{2}$/.test(values[i])) {
        return popupInputError("INVALID_ACTION_INPUT_TYPE", key, field.label + " không đúng định dạng ngày");
      }
      if (field.type === "datetime" &&
          !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/.test(values[i])) {
        return popupInputError("INVALID_ACTION_INPUT_TYPE", key, field.label + " không đúng định dạng ngày giờ");
      }
    }
    if (field.options && field.options.length) {
      var optionSet = {};
      for (i = 0; i < field.options.length; i++) {
        optionSet["$" + String(field.options[i].value)] = true;
      }
      for (i = 0; i < values.length; i++) {
        if (!optionSet["$" + String(values[i])]) {
          return popupInputError("INVALID_ACTION_OPTION", key, field.label + " chứa giá trị không được phép");
        }
      }
    }
  }
  var validators = popup && popup.validators || [];
  for (i = 0; i < validators.length; i++) {
    var validator = validators[i];
    var leftValue = formValues[validator.left];
    var rightValue = formValues[validator.right];
    if (actionInputEmpty(leftValue) || actionInputEmpty(rightValue)) continue;
    var leftField = allFields[validator.left];
    var left = popupComparable(leftField, leftValue);
    var right = popupComparable(leftField, rightValue);
    if (!popupCompare(left, validator.operator, right)) {
      return popupInputError(
        "ACTION_INPUT_CROSS_FIELD", validator.left,
        validator.message || "Dữ liệu giữa các trường không hợp lệ"
      );
    }
  }
  return null;
}

/* Import actions do not use Dynamic Form popup fields. Their input allowlist
 * comes from import.columns plus the framework-owned rowNumbers array. */
function validateImportInput(publicAction, input) {
  var definition = publicAction && publicAction.import;
  var columns = definition && definition.columns || [];
  if (!definition || !columns.length) {
    return popupInputError("INVALID_IMPORT_CONFIG", "input", "Cấu hình import không hợp lệ");
  }
  var allowed = { rowNumbers: true, importMode: true };
  var i;
  for (i = 0; i < columns.length; i++) allowed[columns[i].field] = true;
  var key;
  for (key in input) {
    if (Object.prototype.hasOwnProperty.call(input, key) && !allowed[key]) {
      return popupInputError("UNKNOWN_ACTION_INPUT", key, "Trường dữ liệu không được khai báo");
    }
  }
  if (!Array.isArray(input.rowNumbers) || !input.rowNumbers.length) {
    return popupInputError("IMPORT_ROWS_REQUIRED", "rowNumbers", "File import không có dòng dữ liệu");
  }
  if (input.importMode !== undefined && input.importMode !== "validate" &&
      input.importMode !== "commit") {
    return popupInputError("INVALID_IMPORT_MODE", "importMode", "Chế độ import không hợp lệ");
  }
  var maximum = Math.min(Number(definition.chunkSize) || 50, 100);
  if (input.rowNumbers.length > maximum) {
    return popupInputError("IMPORT_CHUNK_LIMIT_EXCEEDED", "rowNumbers", "Số dòng import vượt quá giới hạn mỗi lần xử lý");
  }
  for (i = 0; i < columns.length; i++) {
    key = columns[i].field;
    if (!Array.isArray(input[key]) || input[key].length !== input.rowNumbers.length) {
      return popupInputError("INVALID_IMPORT_COLUMN", key, "Dữ liệu cột import không hợp lệ");
    }
  }
  return null;
}

function resolveWriteValue(write, reason, input) {
  var source = String(write.source || "");
  if (String(write.writeMode || "replace").toLowerCase() === "clear") {
    return { success: true, value: null };
  }
  if (source === "reason") return { success: true, value: reason };
  if (source.indexOf("input.") === 0) {
    var inputName = source.substring(6);
    if (!Object.prototype.hasOwnProperty.call(input, inputName)) {
      return { success: false, code: "ACTION_INPUT_REQUIRED", message: "Thiếu dữ liệu " + inputName };
    }
    return { success: true, value: input[inputName] };
  }
  return { success: false, code: "INVALID_BATCH_CONFIG", message: "Nguồn dữ liệu ghi không hợp lệ" };
}

function executeConfiguredUpdate(fieldAdapter, file, action, reason, input) {
  var writes = action.writes || [];
  if (!writes.length) {
    return { success: false, code: "INVALID_BATCH_CONFIG", message: "Action update chưa khai báo writes" };
  }
  for (var i = 0; i < writes.length; i++) {
    var resolved = resolveWriteValue(writes[i], reason, input);
    if (!resolved.success) return resolved;
    var writeResult = fieldAdapter.writeField(file, writes[i], resolved.value);
    if (!writeResult || writeResult.success !== true) {
      return {
        success: false,
        code: writeResult && writeResult.code || "SM_FIELD_WRITE_FAILED",
        message: writeResult && writeResult.message || "Không thể ghi dữ liệu vào field SM"
      };
    }
  }
  var rc = file.doUpdate();
  return rc === RC_SUCCESS
    ? { success: true, message: action.successMessage || "Cập nhật thành công" }
    : { success: false, code: "UPDATE_ERROR", message: "Không thể cập nhật bản ghi" };
}

function batchCurrentVersion(env, file) {
  var rawVersion = env.U.getSmField(file, env.version.db);
  if (rawVersion !== undefined && rawVersion !== null &&
      typeof env.version.versionTransform === "function") {
    rawVersion = env.version.versionTransform(rawVersion, file);
  } else if (rawVersion !== undefined && rawVersion !== null &&
      typeof env.version.readTransform === "function") {
    rawVersion = env.version.readTransform(rawVersion, file);
  }
  return env.U.cleanString(rawVersion);
}

// Chỉ trả người cập nhật khi backend metadata chủ động cho phép công khai field đó.
function batchConflict(env, file, currentVersion) {
  var metadata = env.action.conflictMetadata || env.config.conflictMetadata || {};
  var conflict = { sysmodtime: currentVersion };
  if (metadata.exposeUpdatedBy === true && metadata.updatedByField) {
    var updatedBy = env.U.cleanString(env.U.getSmField(file, metadata.updatedByField));
    if (updatedBy) conflict.updatedBy = updatedBy;
  }
  if (metadata.updatedAtField) {
    var updatedAtDefinition = findField(env.config, metadata.updatedAtField);
    if (updatedAtDefinition) {
      var updatedAt = env.U.getSmField(file, updatedAtDefinition.db);
      if (updatedAt !== undefined && updatedAt !== null &&
          typeof updatedAtDefinition.readTransform === "function") {
        updatedAt = updatedAtDefinition.readTransform(updatedAt, file);
      }
      updatedAt = env.U.cleanString(updatedAt);
      if (updatedAt) conflict.updatedAt = updatedAt;
    }
  }
  return conflict;
}

function batchItemContext(env, item, file, current) {
  return {
    id: item.id,
    actionId: env.actionId,
    actionConfig: env.action,
    file: file,
    current: current,
    reason: env.reason,
    input: env.input,
    request: env.request,
    context: env.context,
    relatedSelection: env.relatedSelection
  };
}

/* Kiểm tra lại record trên cursor hiện tại ngay trước validation/ghi. Kết quả
 * fail chứa metadata đủ để client giữ selection và hướng dẫn người dùng retry. */
function validateLoadedBatchItem(env, item, file, validateCustom) {
  var currentVersion = batchCurrentVersion(env, file);
  if (currentVersion !== item.sysmodtime) {
    var conflict = batchConflict(env, file, currentVersion);
    var message = conflict.updatedBy
      ? "Bản ghi đã được " + conflict.updatedBy + " thay đổi"
      : "Bản ghi đã được người khác thay đổi";
    return {
      success: false,
      result: batchResult(item.id, false, "RECORD_MODIFIED_CONCURRENTLY", message, {
        retryable: true,
        sysmodtime: currentVersion,
        conflict: conflict
      })
    };
  }
  var current = env.U.mapRecord(env.config, file);
  if (env.enforcedCondition &&
      !batchRecordMatchesCondition(current, env.enforcedCondition)) {
    return {
      success: false,
      result: batchResult(
        item.id, false, "ACTION_CONDITION_NOT_MET",
        "Bản ghi không còn thỏa điều kiện thực hiện action"
      )
    };
  }
  var itemContext = batchItemContext(env, item, file, current);
  if (validateCustom && env.customExecution &&
      typeof env.ActionOrchestrator.validateItem === "function") {
    var validation = env.ActionOrchestrator.validateItem(
      env.customExecution, itemContext
    ) || { success: true };
    if (validation.success === false) {
      return {
        success: false,
        result: batchResult(
          item.id, false, validation.code || "ACTION_VALIDATION_FAILED",
          validation.message || "Bản ghi không thỏa điều kiện nghiệp vụ", {
            retryable: validation.retryable,
            fieldErrors: validation.fieldErrors
          }
        )
      };
    }
  }
  return { success: true, current: current, itemContext: itemContext };
}

function executeLoadedBatchItem(env, item, file, checked) {
  var actionResult;
  var rc;
  if (env.action.operation === "delete") {
    rc = file.doDelete();
    actionResult = rc === RC_SUCCESS
      ? { success: true, deleted: true, message: env.action.successMessage || "Xóa thành công" }
      : { success: false, code: "DELETE_ERROR", message: "Không thể xóa bản ghi" };
  } else if (env.action.operation === "update") {
    actionResult = executeConfiguredUpdate(
      env.FieldAdapter, file, env.action, env.reason, env.input
    );
  } else if (env.action.operation === "custom") {
    actionResult = env.ActionOrchestrator.executeItem(
      env.customExecution, checked.itemContext
    ) || {};
  } else {
    actionResult = {
      success: false, code: "INVALID_BATCH_CONFIG", message: "Action chưa có handler"
    };
  }

  var result;
  if (actionResult.success === true) {
    result = batchResult(item.id, true, "", actionResult.message || "Thực hiện thành công", {
      data: actionResult.data,
      deleted: actionResult.deleted === true,
      relatedResults: actionResult.relatedResults
    });
    env.U.log("INFO", env.context, "batch-item", "Batch item completed", {
      id: item.id, actionId: env.actionId, success: true,
      reasonProvided: !!env.reason
    });
  } else {
    result = batchResult(
      item.id, false, actionResult.code || "ACTION_FAILED",
      actionResult.message || "Không thể thực hiện thao tác", {
        retryable: actionResult.retryable,
        fieldErrors: actionResult.fieldErrors,
        conflict: actionResult.conflict
      }
    );
    env.U.log("WARN", env.context, "batch-item", "Batch item rejected", {
      id: item.id, actionId: env.actionId,
      code: result.code, reasonProvided: !!env.reason
    });
  }

  if (env.customExecution &&
      typeof env.ActionOrchestrator.afterItem === "function") {
    var after = env.ActionOrchestrator.afterItem(
      env.customExecution, checked.itemContext, result
    ) || { success: true };
    if (after.success === false) {
      result.warnings = [{
        code: after.code || "ACTION_AFTER_ITEM_FAILED",
        message: after.message || "Hậu xử lý bản ghi chưa hoàn tất"
      }];
      env.U.log("WARN", env.context, "batch-after-item", "Batch item post-processing failed", {
        id: item.id,
        actionId: env.actionId,
        code: after.code || "ACTION_AFTER_ITEM_FAILED"
      });
    }
  }
  return result;
}

function batchOrderedResults(items, outcomes) {
  var results = [];
  for (var i = 0; i < items.length; i++) {
    var result = outcomes["$" + items[i].id];
    if (result) results.push(result);
  }
  return results;
}

/* Mỗi chunk dùng đúng một doSelect `isin`. Ở execution pass, chính cursor
 * mutable này được truyền cho handler để tránh quay lại N truy vấn SELECT. */
function runBatchPass(env, validationOnly, validateCustom) {
  var outcomes = {};
  var items = env.items;
  for (var chunkStart = 0; chunkStart < items.length; chunkStart += env.chunkSize) {
    var chunkEnd = Math.min(chunkStart + env.chunkSize, items.length);
    var chunkItems = {};
    var selectedIds = [];
    var itemIndex;
    for (itemIndex = chunkStart; itemIndex < chunkEnd; itemIndex++) {
      chunkItems["$" + items[itemIndex].id] = items[itemIndex];
      selectedIds.push(items[itemIndex].id);
    }
    env.U.log("INFO", env.context, validationOnly ? "batch-validation-chunk" : "batch-chunk",
      validationOnly ? "Batch validation chunk started" : "Batch chunk started", {
        actionId: env.actionId,
        chunk: Math.floor(chunkStart / env.chunkSize) + 1,
        chunkCount: env.chunkCount,
        chunkSize: chunkEnd - chunkStart
      });

    var file = null;
    var seen = {};
    try {
      var query = env.U.buildInFilter(env.key.db, selectedIds);
      query = env.Security.combineQuery(query, env.permission);
      file = validationOnly
        ? new SCFile(env.config.table, SCFILE_READONLY)
        : new SCFile(env.config.table);
      var rc = file.doSelect(query);
      if (rc === RC_SUCCESS) {
        while (rc === RC_SUCCESS) {
          var selectedId = env.U.cleanString(env.U.getSmField(file, env.key.db));
          var item = chunkItems["$" + selectedId];
          if (item) {
            seen["$" + selectedId] = true;
            try {
              var checked = validateLoadedBatchItem(env, item, file, validateCustom);
              outcomes["$" + selectedId] = checked.success
                ? (validationOnly
                  ? batchResult(selectedId, true, "", "Kiểm tra hợp lệ")
                  : executeLoadedBatchItem(env, item, file, checked))
                : checked.result;
            } catch (itemError) {
              env.U.log("ERROR", env.context, "batch-item", "Batch item failed", {
                id: selectedId, actionId: env.actionId, detail: itemError.toString()
              });
              outcomes["$" + selectedId] = batchResult(
                selectedId, false, "ACTION_FAILED", "Không thể thực hiện thao tác"
              );
            }
          }
          rc = typeof file.getNext === "function" ? file.getNext() : 1;
        }
      } else if (!env.U.isNotFoundRc(rc)) {
        for (itemIndex = chunkStart; itemIndex < chunkEnd; itemIndex++) {
          outcomes["$" + items[itemIndex].id] = batchResult(
            items[itemIndex].id, false, "QUERY_ERROR", "Không thể đọc bản ghi"
          );
          seen["$" + items[itemIndex].id] = true;
        }
      }
    } catch (chunkError) {
      env.U.log("ERROR", env.context, "batch-chunk", "Batch chunk failed", {
        actionId: env.actionId,
        detail: chunkError.toString()
      });
      for (itemIndex = chunkStart; itemIndex < chunkEnd; itemIndex++) {
        if (!outcomes["$" + items[itemIndex].id]) {
          outcomes["$" + items[itemIndex].id] = batchResult(
            items[itemIndex].id, false, "QUERY_ERROR", "Không thể đọc bản ghi"
          );
        }
        seen["$" + items[itemIndex].id] = true;
      }
    } finally {
      env.U.closeFile(file, env.context);
    }
    for (itemIndex = chunkStart; itemIndex < chunkEnd; itemIndex++) {
      if (!seen["$" + items[itemIndex].id] && !outcomes["$" + items[itemIndex].id]) {
        outcomes["$" + items[itemIndex].id] = batchResult(
          items[itemIndex].id, false, "NOT_FOUND",
          "Không tìm thấy bản ghi hoặc không có quyền truy cập"
        );
      }
    }
  }
  return batchOrderedResults(items, outcomes);
}

function batchSummary(results, chunkCount, transactionMode) {
  var succeeded = 0;
  var conflicts = 0;
  var retryable = 0;
  for (var i = 0; i < results.length; i++) {
    if (results[i].success === true) succeeded += 1;
    if (results[i].code === "RECORD_MODIFIED_CONCURRENTLY") conflicts += 1;
    if (results[i].retryable === true) retryable += 1;
  }
  return {
    total: results.length,
    succeeded: succeeded,
    failed: results.length - succeeded,
    conflicts: conflicts,
    retryable: retryable,
    chunks: chunkCount,
    transactionMode: transactionMode
  };
}

// Entry point bulk action: kiểm tra quyền/lock rồi xử lý an toàn từng item.
function execute(config, request) {
  var dependencies = batchDependencies();
  var U = dependencies.utils;
  var Security = dependencies.security;
  var FieldAdapter = dependencies.fieldAdapter;
  var ActionOrchestrator = dependencies.actionOrchestrator;
  request = U.normalizeRequest(request);
  var context = U.createContext(
    config.module || "HPT_ScreenService", "batchAction", request,
    config.requestIdPrefix || "BATCH"
  );
  if (!U.isValidBody(request.body)) {
    return U.validationError("INVALID_BODY", "Body JSON không hợp lệ", "body", context);
  }

  var actionId = U.cleanString(request.body.actionId);
  var action = config.batchActions && config.batchActions[actionId];
  if (!actionId || !action || action.enabled === false) {
    return U.validationError("BATCH_ACTION_NOT_ALLOWED", "Thao tác hàng loạt không được hỗ trợ", "actionId", context);
  }

  var auth = Security.authorizeAction(
    config.actionPermissions, "batch:" + actionId, request, context
  );
  if (!auth || auth.error) return auth && auth.error
    ? auth.error : U.serviceError("FORBIDDEN", "Không có quyền thực hiện thao tác", context);

  var maximum = Math.min(Number(action.maxItems) || 100, 1000);
  var normalized = normalizeItems(request.body.items, maximum, U);
  if (normalized.code) {
    return U.validationError(normalized.code, "Danh sách bản ghi không hợp lệ", "items", context);
  }
  var reason = U.cleanString(request.body.reason);
  var reasonMaxLength = Math.min(Number(action.reasonMaxLength) || 1000, 4000);
  if (action.requireReason === true && !reason) {
    return U.validationError("REASON_REQUIRED", "Lý do không được để trống", "reason", context);
  }
  if (reason.length > reasonMaxLength) {
    return U.validationError("REASON_TOO_LONG", "Lý do vượt quá độ dài cho phép", "reason", context);
  }
  var normalizedInput = normalizeActionInput(request.body.input);
  if (normalizedInput.code) {
    return U.validationError(
      normalizedInput.code, "Dữ liệu bổ sung của thao tác không hợp lệ", "input", context
    );
  }
  var publicAction = findPublicBatchAction(config, actionId);
  if (!publicAction) {
    return U.serviceError("INVALID_BATCH_CONFIG", "Cấu hình action không hợp lệ", context);
  }
  var enforcedCondition = action.enforceEnableIf === true ? publicAction.enableIf : null;
  if (enforcedCondition) {
    var selectedCount = normalized.items.length;
    if (selectedCount < Number(enforcedCondition.minSelected || 0) ||
        (enforcedCondition.maxSelected !== undefined &&
          selectedCount > Number(enforcedCondition.maxSelected))) {
      return U.validationError(
        "ACTION_CONDITION_NOT_MET",
        "Số lượng bản ghi không thỏa điều kiện thực hiện action",
        "items",
        context
      );
    }
  }
  var popupValidation = validatePopupInput(publicAction, normalizedInput.input, reason);
  if (popupValidation) {
    return U.validationError(
      popupValidation.code, popupValidation.message, popupValidation.field, context
    );
  }
  var relatedValidation = verifyRelatedSelection(
    action, publicAction, request.body, dependencies, request, context
  );
  if (!relatedValidation.success) {
    if (relatedValidation.error) return relatedValidation.error;
    return U.validationError(
      relatedValidation.code || "INVALID_RELATED_SELECTION",
      relatedValidation.message || "Danh sách dữ liệu liên quan không hợp lệ",
      "relatedSelection",
      context
    );
  }
  var relatedSelection = relatedValidation.selection;

  var key = findField(config, config.keyField);
  var version = findField(config, config.versionField);
  if (!key || !version) {
    return U.serviceError("INVALID_BATCH_CONFIG", "Cấu hình khóa phiên bản không hợp lệ", context);
  }
  var permission = Security.resolveDataPermission(config.dataPermission, context);
  if (permission && permission.error) return permission.error;

  var customExecution = null;
  if (action.operation === "custom") {
    customExecution = ActionOrchestrator.start(action.handlerId, {
      actionId: actionId,
      actionConfig: action,
      screenId: config.screen && config.screen.id || "",
      screenConfig: config,
      items: normalized.items,
      reason: reason,
      input: normalizedInput.input,
      request: request,
      context: context,
      dataPermission: permission || { query: "true", applied: false },
      relatedSelection: relatedSelection
    });
    if (!customExecution || customExecution.success !== true) {
      return U.serviceError(
        customExecution && customExecution.code || "ACTION_HANDLER_UNAVAILABLE",
        customExecution && customExecution.message || "Không thể khởi tạo action nghiệp vụ",
        context
      );
    }
  }

  var chunkSize = Math.min(Number(action.chunkSize) || 25, maximum, 100);
  var chunkCount = Math.ceil(normalized.items.length / chunkSize);
  var transactionMode = action.transactionMode || "perItem";
  var env = {
    U: U,
    Security: Security,
    FieldAdapter: FieldAdapter,
    ActionOrchestrator: ActionOrchestrator,
    config: config,
    action: action,
    actionId: actionId,
    request: request,
    context: context,
    permission: permission || { query: "true", applied: false },
    key: key,
    version: version,
    items: normalized.items,
    reason: reason,
    input: normalizedInput.input,
    relatedSelection: relatedSelection,
    enforcedCondition: enforcedCondition,
    customExecution: customExecution,
    chunkSize: chunkSize,
    chunkCount: chunkCount
  };
  var results;
  var batchAborted = false;
  if (transactionMode === "allValidated") {
    var validationResults = runBatchPass(env, true, true);
    var validationFailed = false;
    var validationIndex;
    for (validationIndex = 0; validationIndex < validationResults.length; validationIndex++) {
      if (validationResults[validationIndex].success !== true) {
        validationFailed = true;
        break;
      }
    }
    if (validationFailed) {
      batchAborted = true;
      results = [];
      for (validationIndex = 0; validationIndex < validationResults.length; validationIndex++) {
        results.push(validationResults[validationIndex].success === true
          ? batchResult(
            validationResults[validationIndex].id, false, "BATCH_ABORTED",
            "Batch không được thực hiện vì có bản ghi không hợp lệ"
          )
          : validationResults[validationIndex]);
      }
    } else {
      /* Phase ghi vẫn recheck id + sysmodtime trên cursor mới. Đây là
       * allValidated (best effort), không tuyên bố rollback transaction. */
      results = runBatchPass(env, false, false);
    }
  } else {
    results = runBatchPass(env, false, true);
  }

  var summary = batchSummary(results, chunkCount, transactionMode);

  U.log("INFO", context, "batch-summary", "Batch action completed", {
    actionId: actionId,
    total: summary.total,
    succeeded: summary.succeeded,
    failed: summary.failed,
    conflicts: summary.conflicts,
    transactionMode: transactionMode
  });

  var postProcess = null;
  if (customExecution) {
    if (!batchAborted) {
      postProcess = ActionOrchestrator.finalize(customExecution, results) || { success: true };
    }
    ActionOrchestrator.cleanup(customExecution);
    if (postProcess && postProcess.success === false) {
      U.log("WARN", context, "batch-finalize", "Batch post-processing failed", {
        actionId: actionId,
        code: postProcess.code || "ACTION_FINALIZE_FAILED"
      });
    }
  }

  var response = {
    success: true,
    apiVersion: "1",
    screenId: config.screen && config.screen.id || "",
    actionId: actionId,
    requestId: context.requestId,
    summary: summary,
    results: results
  };
  if (postProcess && postProcess.success === false) {
    response.postProcess = {
      success: false,
      code: postProcess.code || "ACTION_FINALIZE_FAILED",
      message: postProcess.message || "Hậu xử lý action chưa hoàn tất"
    };
  }
  return response;
}

/* Executes a registered action that is attached to the screen itself rather
 * than to existing selected parent rows (for example: create from selector). */
// Entry point action cấp màn hình, không phụ thuộc selection của grid hiện tại.
function executeScreenAction(config, request) {
  var dependencies = batchDependencies();
  var U = dependencies.utils;
  var Security = dependencies.security;
  var ActionOrchestrator = dependencies.actionOrchestrator;
  request = U.normalizeRequest(request);
  var context = U.createContext(
    config.module || "HPT_ScreenService", "screenAction", request,
    config.requestIdPrefix || "ACTION"
  );
  if (!U.isValidBody(request.body)) {
    return U.validationError("INVALID_BODY", "Body JSON không hợp lệ", "body", context);
  }
  var actionId = U.cleanString(request.body.actionId);
  var action = config.screenActions && config.screenActions[actionId];
  var publicAction = findPublicScreenAction(config, actionId);
  if (!actionId || !action || action.enabled === false || !publicAction ||
      publicAction.serverAction !== true) {
    return U.validationError(
      "SCREEN_ACTION_NOT_ALLOWED", "Thao tác màn hình không được hỗ trợ", "actionId", context
    );
  }
  var auth = Security.authorizeAction(
    config.actionPermissions, "screen:" + actionId, request, context
  );
  if (!auth || auth.error) return auth && auth.error
    ? auth.error : U.serviceError("FORBIDDEN", "Không có quyền thực hiện thao tác", context);

  var normalizedInput = normalizeActionInput(request.body.input);
  if (normalizedInput.code) {
    return U.validationError(
      normalizedInput.code, "Dữ liệu bổ sung của thao tác không hợp lệ", "input", context
    );
  }
  var popupValidation = publicAction.type === "import"
    ? validateImportInput(publicAction, normalizedInput.input)
    : validatePopupInput(publicAction, normalizedInput.input, U.cleanString(request.body.reason));
  if (popupValidation) {
    return U.validationError(
      popupValidation.code, popupValidation.message, popupValidation.field, context
    );
  }
  var relatedValidation = verifyRelatedSelection(
    action, publicAction, request.body, dependencies, request, context
  );
  if (!relatedValidation.success) {
    if (relatedValidation.error) return relatedValidation.error;
    return U.validationError(
      relatedValidation.code || "INVALID_RELATED_SELECTION",
      relatedValidation.message || "Danh sách dữ liệu liên quan không hợp lệ",
      "relatedSelection", context
    );
  }
  var execution = ActionOrchestrator.start(action.handlerId, {
    actionId: actionId,
    actionConfig: action,
    screenId: config.screen && config.screen.id || "",
    screenConfig: config,
    items: [],
    reason: U.cleanString(request.body.reason),
    input: normalizedInput.input,
    request: request,
    context: context,
    relatedSelection: relatedValidation.selection
  });
  if (!execution || execution.success !== true) {
    return U.serviceError(
      execution && execution.code || "ACTION_HANDLER_UNAVAILABLE",
      execution && execution.message || "Không thể khởi tạo action nghiệp vụ", context
    );
  }
  var result;
  var postProcess;
  try {
    result = ActionOrchestrator.executeItem(execution, {
      id: "",
      actionId: actionId,
      actionConfig: action,
      reason: U.cleanString(request.body.reason),
      input: normalizedInput.input,
      request: request,
      context: context,
      relatedSelection: relatedValidation.selection
    }) || {};
    if (result.success !== true) {
      return U.serviceError(
        result.code || "ACTION_FAILED",
        result.message || "Không thể thực hiện thao tác", context
      );
    }
    postProcess = ActionOrchestrator.finalize(execution, [{
      id: result.data && result.data.id || "", success: true
    }]) || { success: true };
    if (postProcess.success === false) {
      return U.serviceError(
        postProcess.code || "ACTION_FINALIZE_FAILED",
        postProcess.message || "Hậu xử lý action chưa hoàn tất", context
      );
    }
    return {
      success: true,
      apiVersion: "1",
      screenId: config.screen && config.screen.id || "",
      actionId: actionId,
      requestId: context.requestId,
      message: result.message || "Thực hiện thành công",
      data: result.data,
      relatedResults: result.relatedResults
    };
  } catch (error) {
    U.log("ERROR", context, "screen-action", "Screen action failed", {
      actionId: actionId, detail: error.toString()
    });
    return U.serviceError("ACTION_FAILED", "Không thể thực hiện thao tác", context);
  } finally {
    ActionOrchestrator.cleanup(execution);
  }
}
