/**
 * ScriptLibrary name: HPT_SmFieldAdapter
 * Safe conversion and write adapter for Service Manager DBDict field types.
 * Chuyển đổi an toàn giữa dữ liệu API và kiểu field đặc thù của SM.
 *
 * Generic writes intentionally exclude expression and record. Those types are
 * stored as structured/binary values and must be handled by a custom action.
 */

function smAdapterError(code, message, field) {
  return { success: false, code: code, message: message, field: field || "" };
}

function smAdapterType(value) {
  return String(value || "").toLowerCase();
}

function smAdapterIsArray(value) {
  return typeof Array !== "undefined" && Array.isArray && Array.isArray(value);
}

function smAdapterCollectionLength(value) {
  if (value === undefined || value === null) return 0;
  if (smAdapterIsArray(value)) return value.length;
  if (typeof value.toArray === "function") {
    var arrayValue = value.toArray();
    if (arrayValue && typeof arrayValue.length === "number") return arrayValue.length;
  }
  if (typeof value.length === "function") {
    var length = Number(value.length());
    if (isFinite(length) && length >= 0) return length;
  }
  return typeof value.length === "number" ? value.length : 0;
}

function smAdapterToArray(value) {
  if (value === undefined || value === null) return [];
  if (smAdapterIsArray(value)) return value.slice(0);
  if (typeof value.toArray === "function") {
    var converted = value.toArray();
    if (smAdapterIsArray(converted)) return converted;
    if (converted !== undefined && converted !== null) return [converted];
  }
  var length = smAdapterCollectionLength(value);
  var result = [];
  for (var i = 0; i < length; i++) result.push(value[i]);
  return result;
}

/* Convert an SM value to an API-safe representation. Array fields can expose
 * the latest value for grids, a joined string, or the full array for detail. */
// Đọc scalar/array từ SM theo chế độ first/last/all.
function readValue(value, descriptor) {
  descriptor = descriptor || {};
  var type = smAdapterType(descriptor.smType);
  if (type !== "array") return value === undefined || value === null ? "" : value;
  var values = smAdapterToArray(value);
  var mode = String(descriptor.arrayReadMode || "all").toLowerCase();
  if (mode === "last") return values.length ? values[values.length - 1] : "";
  if (mode === "first") return values.length ? values[0] : "";
  if (mode === "join") {
    return values.map(function (item) {
      return item === undefined || item === null ? "" : String(item);
    }).join(descriptor.separator === undefined ? "; " : String(descriptor.separator));
  }
  return values;
}

// Parse datetime đầu vào và từ chối ngày không hợp lệ.
function smAdapterParseDateTime(value) {
  var raw = String(value);
  var local = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2})(?::(\d{2}))?)?$/.exec(raw);
  if (local) {
    var year = Number(local[1]);
    var month = Number(local[2]) - 1;
    var day = Number(local[3]);
    var hour = Number(local[4] || 0);
    var minute = Number(local[5] || 0);
    var second = Number(local[6] || 0);
    var localDate = new Date(year, month, day, hour, minute, second, 0);
    if (localDate.getFullYear() === year && localDate.getMonth() === month &&
        localDate.getDate() === day && localDate.getHours() === hour &&
        localDate.getMinutes() === minute && localDate.getSeconds() === second) {
      return localDate;
    }
    return null;
  }
  var parsed = new Date(raw);
  return isNaN(parsed.getTime()) ? null : parsed;
}

/* SCFile date/time fields require an SM datetime datum. A JavaScript Date is
 * accepted by the Node test harness but is converted to text by the SM
 * runtime, which then raises "Cannot store a string into ... type time". */
function smAdapterCreateDateTimeValue(dateValue) {
  if (typeof SCDatum === "undefined" || typeof funcs === "undefined" ||
      !funcs || typeof funcs.datemake !== "function") {
    return dateValue;
  }
  var datum = new SCDatum();
  datum.setType(3);
  funcs.datemake(
    datum,
    dateValue.getFullYear(),
    dateValue.getMonth() + 1,
    dateValue.getDate(),
    dateValue.getHours(),
    dateValue.getMinutes(),
    dateValue.getSeconds()
  );
  return datum;
}

// Chuẩn hóa character/number/logical/date-time theo descriptor.
function smAdapterNormalizeScalar(type, value, descriptor) {
  var field = descriptor.field || "";
  if (value === undefined || value === null) {
    return smAdapterError("SM_VALUE_REQUIRED", "Giá trị ghi dữ liệu không được để trống", field);
  }

  if (type === "character" || type === "label") {
    var text = String(value);
    if (descriptor.trim !== false) text = text.replace(/^\s+|\s+$/g, "");
    if (descriptor.maxItemLength && text.length > Number(descriptor.maxItemLength)) {
      return smAdapterError("SM_VALUE_TOO_LONG", "Giá trị vượt quá độ dài cho phép", field);
    }
    return { success: true, value: text };
  }

  if (type === "number") {
    var numberValue = typeof value === "number" ? value : Number(value);
    if (!isFinite(numberValue)) {
      return smAdapterError("SM_INVALID_NUMBER", "Giá trị không đúng kiểu number", field);
    }
    return { success: true, value: numberValue };
  }

  if (type === "logical") {
    if (value === true || value === false) return { success: true, value: value };
    var logicalValue = String(value).toLowerCase();
    if (logicalValue === "true" || logicalValue === "1" || logicalValue === "yes") {
      return { success: true, value: true };
    }
    if (logicalValue === "false" || logicalValue === "0" || logicalValue === "no") {
      return { success: true, value: false };
    }
    return smAdapterError("SM_INVALID_LOGICAL", "Giá trị không đúng kiểu logical", field);
  }

  if (type === "date/time") {
    /* Preserve a native SM datetime supplied by another ScriptLibrary. */
    if (value && typeof value.getType === "function" && Number(value.getType()) === 3) {
      return { success: true, value: value };
    }
    if (Object.prototype.toString.call(value) === "[object Date]" && !isNaN(value.getTime())) {
      return { success: true, value: smAdapterCreateDateTimeValue(value) };
    }
    var dateValue = smAdapterParseDateTime(value);
    if (!dateValue) {
      return smAdapterError("SM_INVALID_DATETIME", "Giá trị không đúng kiểu date/time", field);
    }
    return { success: true, value: smAdapterCreateDateTimeValue(dateValue) };
  }

  return smAdapterError(
    type === "expression" || type === "record" ? "SM_CUSTOM_HANDLER_REQUIRED" : "SM_TYPE_NOT_SUPPORTED",
    type === "expression" || type === "record"
      ? "Kiểu " + type + " phải được xử lý bằng custom handler"
      : "Kiểu dữ liệu SM chưa được hỗ trợ",
    field
  );
}

// Ghi scalar/array với validate type, length và writeMode.
function writeField(record, descriptor, rawValue) {
  descriptor = descriptor || {};
  var field = descriptor.field;
  var type = smAdapterType(descriptor.smType);
  var mode = String(descriptor.writeMode || "replace").toLowerCase();
  if (!record || !field) {
    return smAdapterError("SM_WRITE_CONFIG_INVALID", "Cấu hình field ghi dữ liệu không hợp lệ", field);
  }

  if (type === "expression" || type === "record") {
    return smAdapterNormalizeScalar(type, rawValue, descriptor);
  }
  if (mode === "clear") {
    record[field] = type === "array" ? [] : null;
    return { success: true, field: field, writeMode: mode };
  }

  if (type !== "array") {
    if (mode !== "replace") {
      return smAdapterError("SM_WRITE_MODE_INVALID", "Field scalar chỉ hỗ trợ replace hoặc clear", field);
    }
    var scalar = smAdapterNormalizeScalar(type, rawValue, descriptor);
    if (!scalar.success) return scalar;
    record[field] = scalar.value;
    return { success: true, field: field, writeMode: mode, value: scalar.value };
  }

  if (mode !== "append" && mode !== "replace") {
    return smAdapterError("SM_WRITE_MODE_INVALID", "Field array chỉ hỗ trợ append, replace hoặc clear", field);
  }
  var elementType = smAdapterType(descriptor.elementType);
  if (!elementType || elementType === "array" || elementType === "expression" || elementType === "record") {
    return smAdapterError("SM_ARRAY_ELEMENT_TYPE_INVALID", "Kiểu phần tử array không hợp lệ", field);
  }
  var sourceValues = smAdapterIsArray(rawValue) ? rawValue : [rawValue];
  var normalizedValues = [];
  for (var i = 0; i < sourceValues.length; i++) {
    var normalized = smAdapterNormalizeScalar(elementType, sourceValues[i], descriptor);
    if (!normalized.success) return normalized;
    normalizedValues.push(normalized.value);
  }

  var maximum = Number(descriptor.maxItems || 10000);
  if (!(maximum > 0) || maximum > 100000) maximum = 10000;
  var current = record[field];
  var targetCount = mode === "append"
    ? smAdapterCollectionLength(current) + normalizedValues.length
    : normalizedValues.length;
  if (targetCount > maximum) {
    return smAdapterError("SM_ARRAY_LIMIT_EXCEEDED", "Số phần tử array vượt quá giới hạn cho phép", field);
  }

  if (mode === "replace") {
    record[field] = normalizedValues;
  } else {
    if (current === undefined || current === null) {
      record[field] = [];
      current = record[field];
    }
    if (!current || typeof current.push !== "function") {
      return smAdapterError("SM_ARRAY_NOT_WRITABLE", "Field array không hỗ trợ thao tác append", field);
    }
    for (i = 0; i < normalizedValues.length; i++) current.push(normalizedValues[i]);
  }
  return {
    success: true,
    field: field,
    writeMode: mode,
    appended: mode === "append" ? normalizedValues.length : 0,
    count: targetCount
  };
}
