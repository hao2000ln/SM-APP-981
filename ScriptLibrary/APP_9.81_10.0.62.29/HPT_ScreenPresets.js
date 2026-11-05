/**
 * ScriptLibrary name: HPT_ScreenPresets
 * Factory các metadata fragment dùng chung. Mỗi lần gọi luôn trả object mới để
 * màn hình không vô tình chia sẻ/mutate state cấu hình với màn hình khác.
 */

function presetOwn(object, key) {
  return Object.prototype.hasOwnProperty.call(object || {}, key);
}

function presetMerge(base, overrides) {
  var result = {};
  var key;
  for (key in base) if (presetOwn(base, key)) result[key] = base[key];
  for (key in (overrides || {})) {
    if (presetOwn(overrides, key)) result[key] = overrides[key];
  }
  return result;
}

// Chuẩn hóa giá trị trước khi tạo fingerprint để array/object có biểu diễn ổn định.
function presetVersionValue(value) {
  if (value === undefined || value === null) return "";
  if (typeof value === "object" && typeof JSON !== "undefined" && JSON.stringify) {
    try { return JSON.stringify(value); } catch (ignore) {}
  }
  return String(value);
}

// Tạo field optimistic-lock dùng chung; mỗi màn hình chỉ khai báo DBDict field cần bảo vệ.
function optimisticLockField(dependencies, overrides) {
  if (!Array.isArray(dependencies)) {
    throw new Error("optimisticLockField dependencies must be an array");
  }
  var protectedFields = dependencies.slice(0);
  var options = overrides || {};
  var versionDbField = options.db || "sysmodtime";
  var tokenPrefix = options.tokenPrefix || "v1";
  var fieldOverrides = {};
  var optionKey;
  for (optionKey in options) {
    if (presetOwn(options, optionKey) &&
        optionKey !== "tokenPrefix" &&
        optionKey !== "versionDependencies" &&
        optionKey !== "versionTransform") {
      fieldOverrides[optionKey] = options[optionKey];
    }
  }
  return presetMerge({
    api: "sysmodtime",
    db: versionDbField,
    type: "string",
    includeInList: true,
    versionDependencies: protectedFields,
    versionTransform: function (value, file) {
      var fields = [versionDbField].concat(protectedFields);
      var text = tokenPrefix;
      var i;
      for (i = 0; i < fields.length; i++) {
        var raw = fields[i] === versionDbField ? value : file[fields[i]];
        var normalized = presetVersionValue(raw);
        // Length-prefix tránh nhập nhằng khi dữ liệu chứa ký tự phân cách.
        text += "|" + fields[i].length + ":" + fields[i] +
          "=" + normalized.length + ":" + normalized;
      }
      var hash = 2166136261;
      for (i = 0; i < text.length; i++) {
        hash ^= text.charCodeAt(i);
        hash += (hash << 1) + (hash << 4) + (hash << 7) +
          (hash << 8) + (hash << 24);
      }
      return tokenPrefix + "-" + (hash >>> 0).toString(16);
    }
  }, fieldOverrides);
}

// Mặc định paging/search/count an toàn cho list screen.
function listDefaults(overrides) {
  return presetMerge({
    sortBy: "id",
    sortDir: "asc",
    pageSize: 10,
    maxPageSize: 100,
    maxPage: 100000,
    minKeywordLength: 2,
    maxKeywordLength: 100,
    includeUnfilteredTotal: false,
    countCacheTtl: 30000
  }, overrides);
}

// Mặc định selection nhất quán; single luôn bị giới hạn một bản ghi.
function selection(mode, overrides) {
  mode = mode === "single" || mode === "multiple" ? mode : "none";
  var result = presetMerge({
    mode: mode,
    maxItems: mode === "single" ? 1 : 100,
    retainAcrossPages: mode !== "none",
    clearOnQueryChange: mode !== "none",
    debug: false
  }, overrides);
  result.mode = mode;
  if (mode === "single") result.maxItems = 1;
  return result;
}

// Bộ lọc đơn vị ba cấp dùng chung cho các list screen nghiệp vụ.
function organizationCascadeFilter(overrides) {
  return presetMerge({
    id: "organization",
    type: "orgUnitCascade",
    levels: [
      {
        level: 1, key: "orgLv1", parameter: "unitLv1Values",
        label: "Đơn vị cấp 1", placeholder: "Tất cả đơn vị cấp 1", multiple: true
      },
      {
        level: 2, key: "orgLv2", parameter: "unitLv2Values",
        label: "Đơn vị cấp 2", placeholder: "Tất cả đơn vị cấp 2", multiple: true
      },
      {
        level: 3, key: "orgLv3", parameter: "unitLv3Values",
        label: "Đơn vị cấp 3", placeholder: "Tất cả đơn vị cấp 3", multiple: true
      }
    ]
  }, overrides);
}
