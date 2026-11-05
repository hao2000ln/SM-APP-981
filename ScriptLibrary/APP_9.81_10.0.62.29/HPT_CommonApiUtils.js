/**
 * ScriptLibrary name: HPT_CommonApiUtils
 * Common helpers for CommonApiService catalog endpoints.
 * Gom request/context, lỗi chuẩn, query SM, field mapping và lookup batch.
 */

function getWriteLogEntry() {
  var logger = lib.HPT_WriteLog;
  return logger && logger.writeSystemLogEntry;
}

function hasOwn(object, key) {
  return object !== null && object !== undefined &&
    Object.prototype.hasOwnProperty.call(object, key);
}

function cleanString(value) {
  return value === undefined || value === null ? "" : String(value).trim();
}

/** Serialize dữ liệu server để nhúng an toàn trong thẻ script của HTMLViewer. */
function safeJsonForHtml(value) {
  var json;
  try {
    json = lib.ESD_Validate_Fields.safeJSONStringify(value);
  } catch (e) {
    json = JSON.stringify(value);
  }

  return String(json)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

// Chuẩn hóa request để service luôn có query/body an toàn.
function normalizeRequest(request) {
  var result = request || {};
  if (!result.query || typeof result.query !== "object") result.query = {};
  if (!result.headers || typeof result.headers !== "object") result.headers = {};
  if (result.body === undefined || result.body === null) result.body = {};
  return result;
}

function isValidBody(body) {
  return body !== null && typeof body === "object" &&
    !(typeof Array !== "undefined" && Array.isArray && Array.isArray(body));
}

function createRequestId(prefix) {
  return String(prefix || "API") + "-" + new Date().getTime() + "-" +
    Math.floor(Math.random() * 1000000);
}

// Tạo context thống nhất cho requestId, logging và response.
function createContext(moduleName, endpoint, request, requestIdPrefix) {
  var headers = request && request.headers ? request.headers : {};
  var requestId = headers["X-Request-ID"] || headers["x-request-id"] ||
    createRequestId(requestIdPrefix);
  requestId = String(requestId).replace(/[\r\n]/g, "").substring(0, 100);
  return {
    module: moduleName || "CatalogEngine",
    endpoint: endpoint || "operation",
    requestId: requestId || createRequestId(requestIdPrefix)
  };
}

function log(level, context, operation, message, data) {
  var logData = data || {};
  var writeLogEntry = getWriteLogEntry();
  if (!hasOwn(logData, "requestId")) logData.requestId = context.requestId;
  try {
    if (typeof writeLogEntry !== "function") return false;
    return writeLogEntry(
      level,
      context.module,
      context.endpoint + "." + operation,
      message,
      logData
    );
  } catch (e) {
    // Logging không được phép làm hỏng nghiệp vụ API.
    return false;
  }
}

function rcText(rc) {
  try {
    return RCtoString(rc);
  } catch (e) {
    return String(rc);
  }
}

function rcDetail(rc) {
  return "rc=" + rc + " (" + rcText(rc) + ")";
}

function isNotFoundRc(rc) {
  if (typeof RC_NO_MORE !== "undefined" && rc === RC_NO_MORE) return true;
  if (typeof RC_NOT_FOUND !== "undefined" && rc === RC_NOT_FOUND) return true;
  if (typeof RC_NO_MORE_RECORDS !== "undefined" && rc === RC_NO_MORE_RECORDS) return true;
  return false;
}

function closeFile(file, context) {
  if (!file) return;
  try {
    file.doClose();
  } catch (e) {
    if (context) {
      log("ERROR", context, "closeFile", "Không thể đóng SCFile", {
        detail: e.toString()
      });
    }
  }
}

// Sinh response lỗi chuẩn kèm requestId và metadata bổ sung.
function serviceError(code, message, context, extra) {
  var result = {
    success: false,
    code: code,
    message: message,
    requestId: context.requestId
  };
  var key;
  if (extra) {
    for (key in extra) {
      if (hasOwn(extra, key)) result[key] = extra[key];
    }
  }
  return result;
}

function validationError(code, message, field, context) {
  var extra = {};
  if (field) extra.field = field;
  return serviceError(code, message, context, extra);
}

function parseBoolean(value, defaultValue) {
  if (value === undefined || value === null || value === "") return defaultValue;
  var raw = String(value).toLowerCase();
  if (raw === "1" || raw === "true" || raw === "yes") return true;
  if (raw === "0" || raw === "false" || raw === "no") return false;
  return defaultValue;
}

function isPositiveInteger(value) {
  return /^\d+$/.test(String(value)) && parseInt(String(value), 10) > 0;
}

function parsePositiveInteger(value, defaultValue) {
  return isPositiveInteger(value) ? parseInt(String(value), 10) : defaultValue;
}

function escapeQueryValue(value) {
  return String(value)
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\*/g, "\\*")
    .replace(/\?/g, "\\?");
}

// Tạo điều kiện bằng sau khi escape ký tự query SM.
function buildEqualFilter(fieldName, value) {
  return fieldName + '="' + escapeQueryValue(value) + '"';
}

/* Builds one native Service Manager `isin` expression for a bounded list.
 * Field names always come from validated backend metadata; values are encoded
 * as an SC datum instead of being concatenated into the query one by one. */
function buildInFilter(fieldName, values) {
  if (!/^[A-Za-z0-9_.]+$/.test(String(fieldName || ""))) {
    throw new Error("Invalid field name for isin filter");
  }
  if (!Array.isArray(values) || !values.length) {
    throw new Error("isin filter requires at least one value");
  }
  var normalized = [];
  var seen = {};
  for (var i = 0; i < values.length; i++) {
    var value = cleanString(values[i]);
    if (!value || hasOwn(seen, "$" + value)) continue;
    seen["$" + value] = true;
    normalized.push(value);
  }
  if (!normalized.length) throw new Error("isin filter has no valid values");
  var queryValues = normalized;
  if (lib.ArrayUtil && typeof lib.ArrayUtil.toSCDatum === "function") {
    queryValues = lib.ArrayUtil.toSCDatum(normalized);
  }
  return fieldName + " isin " + funcs.str(queryValues);
}

function toAliasFieldName(fieldName) {
  return String(fieldName).replace(/\./g, "_");
}

function getSmField(record, fieldName) {
  var value = record[fieldName];
  if (value !== undefined && value !== null) return value;
  return record[toAliasFieldName(fieldName)];
}

function setSmField(record, fieldName, value) {
  record[fieldName] = value;
  if (String(fieldName).indexOf(".") !== -1) {
    record[toAliasFieldName(fieldName)] = value;
  }
}

function getBodyField(body, field) {
  return hasOwn(body, field.api) ? body[field.api] : undefined;
}

function hasBodyField(body, field) {
  return hasOwn(body, field.api);
}

function normalizeFieldValue(field, value) {
  if (value === undefined || value === null) return value;
  if (!field.type || field.type === "string") {
    value = String(value);
    if (field.trim !== false) value = value.trim();
    if (field.uppercase && value) value = value.toUpperCase();
  }
  return value;
}

// Validate một field API theo metadata backend.
function validateField(field, value, context, required) {
  var empty = value === undefined || value === null || value === "";
  if (required && empty) {
    return validationError(
      "MISSING_FIELD",
      field.api + " không được để trống",
      field.api,
      context
    );
  }
  if (empty) return null;
  if (field.maxLength && String(value).length > field.maxLength) {
    return validationError(
      "INVALID_FIELD",
      field.api + " không được vượt quá " + field.maxLength + " ký tự",
      field.api,
      context
    );
  }
  if (field.pattern) {
    var pattern = field.pattern instanceof RegExp ? field.pattern : new RegExp(field.pattern);
    if (!pattern.test(String(value))) {
      return validationError(
        "INVALID_FIELD",
        field.invalidMessage || (field.api + " không đúng định dạng"),
        field.api,
        context
      );
    }
  }
  return null;
}

function findField(config, apiName) {
  var fields = config.fields || [];
  var i;
  for (i = 0; i < fields.length; i++) {
    if (fields[i].api === apiName) return fields[i];
  }
  return null;
}

function getDbFields(config, projection) {
  var result = [];
  var seen = {};
  var fields = config.fields || [];
  var i;
  for (i = 0; i < fields.length; i++) {
    if (projection === "list" && fields[i].includeInList === false) continue;
    // A display alias may intentionally share its source with a version token.
    if (!seen[fields[i].db]) {
      seen[fields[i].db] = true;
      result.push(fields[i].db);
    }
  }
  /* A computed version token may depend on fields that are intentionally not
   * returned in the list payload. Fetch those dependencies on the same query. */
  if (projection === "list") {
    var versionField = findField(config, config.versionField);
    var dependencies = versionField && versionField.versionDependencies || [];
    for (i = 0; i < dependencies.length; i++) {
      if (!seen[dependencies[i]]) {
        seen[dependencies[i]] = true;
        result.push(dependencies[i]);
      }
    }
  }
  return result;
}

// Ánh xạ SCFile sang object API, có hỗ trợ readTransform.
function mapRecord(config, file, projection) {
  var result = {};
  var fields = config.fields || [];
  var i;
  var value;
  for (i = 0; i < fields.length; i++) {
    if (projection === "list" && fields[i].includeInList === false) continue;
    value = getSmField(file, fields[i].db);
    /* versionTransform emits an opaque optimistic-lock token. It is used only
     * for config.versionField; display fields continue to use readTransform. */
    if (value !== undefined && value !== null && fields[i].api === config.versionField &&
        typeof fields[i].versionTransform === "function") {
      value = fields[i].versionTransform(value, file);
    } else if (value !== undefined && value !== null && typeof fields[i].readTransform === "function") {
      // Cho phép từng field chuẩn hóa kiểu dữ liệu đặc thù của SM trước khi trả JSON.
      value = fields[i].readTransform(value, file);
    }
    result[fields[i].api] = value === undefined || value === null ? "" : value;
  }
  return result;
}

/**
 * Resolve khóa ngoại theo lô cho dữ liệu của một trang.
 * Mỗi lookup chạy một số query theo chunk, tránh query riêng cho từng record.
 */
/**
 * Gom các lookup dùng cùng bảng, khóa và điều kiện thành một batch query.
 * Mỗi lookup vẫn giữ sourceField, outputs, fallback và readTransform riêng.
 */
// Resolve lookup theo nhóm/chunk để tránh truy vấn N+1.
function resolveLookups(config, rows, context) {
  var lookups = config.lookups || [];
  var chunkSize = 50;
  var groups = [];
  var groupByKey = {};
  var totalQueries = 0;
  var totalUniqueKeys = 0;
  var lookupIndex;
  var rowIndex;

  for (lookupIndex = 0; lookupIndex < lookups.length; lookupIndex++) {
    var lookup = lookups[lookupIndex] || {};
    var outputs = lookup.outputs || [{
      targetField: lookup.targetField,
      displayField: lookup.displayField,
      fallback: lookup.fallback,
      readTransform: lookup.readTransform
    }];
    var validOutputs = outputs.length > 0;
    var outputIndex;
    for (outputIndex = 0; outputIndex < outputs.length; outputIndex++) {
      if (!outputs[outputIndex] || !outputs[outputIndex].targetField ||
          !outputs[outputIndex].displayField) validOutputs = false;
    }
    if (!lookup.sourceField || !lookup.table || !lookup.keyField || !validOutputs) {
      log("ERROR", context, "lookup-config", "Cấu hình lookup không hợp lệ", {
        lookupIndex: lookupIndex
      });
      if (lookup.required === true) return { success: false };
      continue;
    }

    var entry = {
      lookup: lookup,
      sourceField: lookup.sourceField,
      outputs: outputs,
      seen: {},
      resolved: {}
    };
    var groupKey = [lookup.table, lookup.keyField, lookup.extraQuery || ""].join("\u001f");
    var group = groupByKey[groupKey];
    if (!group) {
      group = {
        table: lookup.table,
        keyField: lookup.keyField,
        extraQuery: lookup.extraQuery,
        fields: [lookup.keyField],
        keys: [],
        seen: {},
        entries: [],
        required: false
      };
      groupByKey[groupKey] = group;
      groups.push(group);
    }
    group.entries.push(entry);
    if (lookup.required === true) group.required = true;
    for (outputIndex = 0; outputIndex < outputs.length; outputIndex++) {
      if (group.fields.indexOf(outputs[outputIndex].displayField) === -1) {
        group.fields.push(outputs[outputIndex].displayField);
      }
    }

    for (rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      var sourceValue = rows[rowIndex][lookup.sourceField];
      var sourceKey = sourceValue === undefined || sourceValue === null
        ? ""
        : String(sourceValue);
      for (outputIndex = 0; outputIndex < outputs.length; outputIndex++) {
        rows[rowIndex][outputs[outputIndex].targetField] =
          outputs[outputIndex].fallback === "source" ? sourceKey : "";
      }
      if (sourceKey) {
        entry.seen[sourceKey] = true;
        if (!hasOwn(group.seen, sourceKey)) {
          group.seen[sourceKey] = true;
          group.keys.push(sourceKey);
        }
      }
    }
  }

  for (var groupIndex = 0; groupIndex < groups.length; groupIndex++) {
    group = groups[groupIndex];
    totalUniqueKeys += group.keys.length;
    for (var start = 0; start < group.keys.length; start += chunkSize) {
      var chunk = group.keys.slice(start, start + chunkSize);
      var file = null;
      var rc;
      var query = buildInFilter(group.keyField, chunk);
      if (group.extraQuery) query = "(" + query + ") and (" + group.extraQuery + ")";

      try {
        file = new SCFile(group.table, SCFILE_READONLY);
        file.setFields(group.fields);
        totalQueries += 1;
        rc = file.doSelect(query);
        while (rc === RC_SUCCESS) {
          var keyValue = getSmField(file, group.keyField);
          var resolvedKey = keyValue === undefined || keyValue === null
            ? ""
            : String(keyValue);
          if (resolvedKey) {
            for (var entryIndex = 0; entryIndex < group.entries.length; entryIndex++) {
              entry = group.entries[entryIndex];
              if (!hasOwn(entry.seen, resolvedKey)) continue;
              var resolvedValues = {};
              for (outputIndex = 0; outputIndex < entry.outputs.length; outputIndex++) {
                var output = entry.outputs[outputIndex];
                var displayValue = getSmField(file, output.displayField);
                var transform = output.readTransform || entry.lookup.readTransform;
                if (typeof transform === "function") displayValue = transform(displayValue, file);
                resolvedValues[output.targetField] =
                  displayValue === undefined || displayValue === null ? "" : displayValue;
              }
              entry.resolved[resolvedKey] = resolvedValues;
            }
          }
          rc = file.getNext();
        }
        if (!isNotFoundRc(rc)) throw new Error("SCFile lookup failed: " + rcDetail(rc));
      } catch (lookupError) {
        log(group.required ? "ERROR" : "WARN", context, "lookup", "Không thể ánh xạ dữ liệu tham chiếu", {
          table: group.table,
          detail: lookupError.toString()
        });
        if (group.required) return { success: false };
        break;
      } finally {
        closeFile(file, context);
      }
    }

    for (entryIndex = 0; entryIndex < group.entries.length; entryIndex++) {
      entry = group.entries[entryIndex];
      for (rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        var rowValue = rows[rowIndex][entry.sourceField];
        var rowKey = rowValue === undefined || rowValue === null ? "" : String(rowValue);
        if (!hasOwn(entry.resolved, rowKey)) continue;
        for (outputIndex = 0; outputIndex < entry.outputs.length; outputIndex++) {
          var target = entry.outputs[outputIndex].targetField;
          rows[rowIndex][target] = entry.resolved[rowKey][target];
        }
      }
    }
  }

  return {
    success: true,
    data: rows,
    stats: { queries: totalQueries, uniqueKeys: totalUniqueKeys }
  };
}

// Tạo query search từ danh sách field đã allowlist.
function buildSearchFilter(config, keyword) {
  var search = config.search || [];
  var conditions = [];
  var escaped = escapeQueryValue(keyword);
  var i;
  var item;
  var value;
  for (i = 0; i < search.length; i++) {
    item = search[i];
    if (item.mode === "exact") value = escaped;
    else if (item.mode === "prefix") value = escaped + "*";
    else value = "*" + escaped + "*";
    conditions.push('(' + item.db + ' like "' + value + '")');
  }
  return conditions.length ? "(" + conditions.join(" or ") + ")" : "true";
}

// Đếm bản ghi và chuẩn hóa lỗi trả về từ SM.
function countFile(filename, query, context) {
  var file = null;
  try {
    file = new SCFile(filename, SCFILE_READONLY);
    var count = file.doCount(query);
    var rc = getLastRC();
    if (rc === RC_SUCCESS) return { success: true, count: count };
    log("ERROR", context, "count", "Service operation failed", { detail: rcDetail(rc) });
    return { success: false, rc: rc };
  } catch (e) {
    log("ERROR", context, "count", "Service operation failed", { detail: e.toString() });
    return { success: false };
  } finally {
    closeFile(file, context);
  }
}
