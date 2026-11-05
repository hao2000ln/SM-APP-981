/**
 * ScriptLibrary name: HPT_CatalogEngine
 * Generic configuration-driven CRUD engine for Service Manager tables.
 * Thực thi list/filter/lookup/detail/CRUD từ metadata backend đã kiểm tra.
 */

/*
 * HPT - Không giữ dependency lib.* ở top-level. Mỗi entry point public nạp lại
 * dependency tại runtime để ScriptLibrary vẫn hoạt động sau publish/cache reload.
 */
var U;
var Security;

// Nạp lại utility/security ở mỗi entry point để chịu được cache reload.
function refreshDependencies() {
  U = lib.HPT_CommonApiUtils;
  if (!U) throw new Error("HPT_CommonApiUtils is not available");
  Security = lib.HPT_ApiSecurity;
}

function resolveDataPermission(config, context) {
  if (!config.dataPermission || config.dataPermission.enabled !== true) {
    return { query: "true", applied: false };
  }
  if (!Security || typeof Security.resolveDataPermission !== "function") {
    U.log("ERROR", context, "permission", "HPT_ApiSecurity is not available", {});
    return {
      error: U.serviceError(
        "SECURITY_UNAVAILABLE",
        "Không thể kiểm tra phân quyền dữ liệu",
        context
      )
    };
  }
  return Security.resolveDataPermission(config.dataPermission, context);
}

function applyDataPermission(query, permissionResult, context) {
  if (!permissionResult || permissionResult.error) return "false";
  if (!permissionResult.applied) return query || "true";
  if (!Security || typeof Security.combineQuery !== "function") {
    U.log("ERROR", context, "permission", "Security query combiner is not available", {});
    return "false";
  }
  return Security.combineQuery(query, permissionResult);
}

function authorizeAction(config, action, request, context) {
  if (!Security || typeof Security.authorizeAction !== "function") {
    U.log("ERROR", context, "authorization", "HPT_ApiSecurity action authorization is not available", {
      action: action
    });
    return U.serviceError(
      "SECURITY_UNAVAILABLE",
      "Không thể kiểm tra quyền thao tác",
      context
    );
  }
  var result = Security.authorizeAction(
    config.actionPermissions,
    action,
    request,
    context
  );
  return result && result.error ? result.error : null;
}

function message(config, key, fallback) {
  return config.messages && config.messages[key] ? config.messages[key] : fallback;
}

function endpoint(config, operation) {
  if (config.endpoints && config.endpoints[operation]) return config.endpoints[operation];
  return operation;
}

function contextFor(config, operation, request) {
  return U.createContext(
    config.module || "CatalogService",
    endpoint(config, operation),
    request,
    config.requestIdPrefix || "CAT"
  );
}

// Kiểm tra cấu hình tối thiểu trước khi truy cập DB.
function validateConfig(config, context) {
  if (!config || !config.table || !config.keyField || !config.fields || !config.fields.length) {
    return U.serviceError("INVALID_CONFIG", "Cấu hình catalog không hợp lệ", context);
  }
  return null;
}

/**
 * Tạo metadata an toàn cho UI từ catalog config.
 * Chỉ công bố API field và defaults; không trả table, DBDict field, hooks,
 * query hoặc messages nội bộ.
 */
function getUiConfig(config, request) {
  refreshDependencies();
  request = U.normalizeRequest(request);
  var context = contextFor(config, "uiConfig", request);
  var authorizationError = authorizeAction(config, "uiConfig", request, context);
  if (authorizationError) return authorizationError;
  var source = config || {};
  var defaults = source.defaults || {};
  var fields = source.fields || [];
  var search = source.search || [];
  var sortableConfig = source.sortable || {};
  var dbToApi = {};
  var searchable = [];
  var sortable = [];
  var filters = [];
  var filterRules = {};
  var i;
  var key;
  var apiField;

  for (i = 0; i < fields.length; i++) {
    if (fields[i] && fields[i].db && fields[i].api) {
      dbToApi[fields[i].db] = fields[i].api;
    }
  }

  for (i = 0; i < search.length; i++) {
    apiField = search[i] && dbToApi[search[i].db];
    if (apiField && searchable.indexOf(apiField) === -1) {
      searchable.push(apiField);
    }
  }

  for (key in sortableConfig) {
    if (Object.prototype.hasOwnProperty.call(sortableConfig, key)) {
      sortable.push(key);
    }
  }

  for (key in (source.filters || {})) {
    if (Object.prototype.hasOwnProperty.call(source.filters, key)) {
      filters.push(key);
      var filterDefinition = source.filters[key] || {};
      filterRules[key] = {
        maxValues: filterDefinition.maxValues || 50,
        maxLength: filterDefinition.maxLength || 200
      };
    }
  }

  var publicScreen = source.screenPublic || null;
  if (publicScreen && publicScreen.bulkActions) {
    var allowedBulkActions = [];
    for (i = 0; i < publicScreen.bulkActions.length; i++) {
      var bulkAction = publicScreen.bulkActions[i];
      if (!authorizeAction(config, "batch:" + bulkAction.id, request, context)) {
        allowedBulkActions.push(bulkAction);
      }
    }
    /* Definition factory returns a new config for each request. Copy the
     * projection anyway so authorization never mutates registry metadata. */
    var projectedScreen = {};
    for (key in publicScreen) {
      if (Object.prototype.hasOwnProperty.call(publicScreen, key)) {
        projectedScreen[key] = publicScreen[key];
      }
    }
    projectedScreen.bulkActions = allowedBulkActions;
    if (publicScreen.actions) {
      var allowedScreenActions = [];
      for (i = 0; i < publicScreen.actions.length; i++) {
        var screenAction = publicScreen.actions[i];
        var screenActionDenied = screenAction.type === "create"
          ? authorizeAction(config, "create", request, context)
          : (screenAction.serverAction === true
            ? authorizeAction(config, "screen:" + screenAction.id, request, context)
            : null);
        if (!screenActionDenied) {
          allowedScreenActions.push(screenAction);
        }
      }
      projectedScreen.actions = allowedScreenActions;
    }
    publicScreen = projectedScreen;
  }

  return {
    success: true,
    requestId: context.requestId,
    apiVersion: "1",
    defaults: {
      sortBy: defaults.sortBy || source.keyField || "",
      sortDir: defaults.sortDir === "desc" ? "desc" : "asc",
      pageSize: defaults.pageSize || 20,
      maxPageSize: defaults.maxPageSize || 100,
      minKeywordLength: defaults.minKeywordLength || 2,
      maxKeywordLength: defaults.maxKeywordLength || 200,
      includeUnfilteredTotal: defaults.includeUnfilteredTotal !== false,
      countCacheTtl: Math.max(0, Math.min(Number(defaults.countCacheTtl) || 0, 300000))
    },
    searchable: searchable,
    sortable: sortable,
    filters: filters,
    screen: publicScreen,
    /* Chỉ công bố giới hạn client cần áp dụng; không lộ DBDict field. */
    filterRules: filterRules
  };
}

/*
 * External filters are declared by the service. The client only sends API
 * parameter names; DBDict fields and operators remain controlled by backend.
 */
function applyConfiguredFilters(config, query, request, context) {
  var filters = config.filters || {};
  var name;
  var definition;
  var raw;
  var values;
  var unique;
  var i;
  var value;
  var conditions;

  for (name in filters) {
    if (!Object.prototype.hasOwnProperty.call(filters, name)) continue;
    definition = filters[name] || {};
    raw = request.query[name];
    if (raw === undefined || raw === null || raw === "") continue;

    if (definition.operator === "gte" || definition.operator === "lte") {
      value = U.cleanString(raw);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return { error: U.validationError("INVALID_FILTER", name + " không phải ngày hợp lệ", name, context) };
      }
      var dateParts = value.split("-");
      var year = Number(dateParts[0]);
      var month = Number(dateParts[1]);
      var day = Number(dateParts[2]);
      var parsedDate = new Date(year, month - 1, day);
      if (parsedDate.getFullYear() !== year || parsedDate.getMonth() !== month - 1 ||
          parsedDate.getDate() !== day) {
        return { error: U.validationError("INVALID_FILTER", name + " is not a valid date", name, context) };
      }
      /* Compare the SM date/time field directly. The upper bound is exclusive
       * at the next midnight, so sub-second values remain covered. */
      if (definition.operator === "lte") parsedDate.setDate(parsedDate.getDate() + 1);
      var dateValue = (parsedDate.getDate() < 10 ? "0" : "") + parsedDate.getDate() + "/" +
        (parsedDate.getMonth() + 1 < 10 ? "0" : "") + (parsedDate.getMonth() + 1) + "/" +
        parsedDate.getFullYear() + " 00:00:00";
      query = "(" + query + ") and (" + definition.db +
        (definition.operator === "gte" ? ">=" : "<") +
        '"' + U.escapeQueryValue(dateValue) + '")';
      continue;
    }

    try {
      values = typeof raw === "string" ? JSON.parse(raw) : raw;
    } catch (parseError) {
      return { error: U.validationError("INVALID_FILTER", name + " không hợp lệ", name, context) };
    }
    if (!(typeof Array !== "undefined" && Array.isArray && Array.isArray(values))) {
      return { error: U.validationError("INVALID_FILTER", name + " phải là danh sách", name, context) };
    }
    if (values.length > (definition.maxValues || 50)) {
      return { error: U.validationError("INVALID_FILTER", name + " có quá nhiều giá trị", name, context) };
    }

    unique = {};
    conditions = [];
    for (i = 0; i < values.length; i++) {
      value = U.cleanString(values[i]);
      if (!value || Object.prototype.hasOwnProperty.call(unique, "$" + value)) continue;
      if (definition.maxLength && value.length > definition.maxLength) {
        return { error: U.validationError("INVALID_FILTER", name + " chứa giá trị quá dài", name, context) };
      }
      unique["$" + value] = true;
      conditions.push("(" + U.buildEqualFilter(definition.db, value) + ")");
    }
    if (conditions.length) {
      query = "(" + query + ") and (" + conditions.join(" or ") + ")";
    }
  }
  return { query: query };
}

function runHook(config, hookName, args) {
  var hook = config.hooks && config.hooks[hookName];
  if (typeof hook !== "function") return null;
  return hook.apply(null, args || []);
}

/* Keeps unavailable rows visible in reusable selectors while marking them as
 * non-selectable. The target relation is queried once for the current page. */
function applySelectionAvailability(config, rows, context) {
  var policy = config.selectionAvailability;
  if (!policy || !rows || !rows.length) return rows;
  var values = [];
  var seen = {};
  var i;
  for (i = 0; i < rows.length; i++) {
    rows[i]._hptSelectable = true;
    rows[i]._hptSelectionDisabledReason = "";
    var value = U.cleanString(rows[i][policy.sourceField]);
    if (!value) {
      rows[i]._hptSelectable = false;
      rows[i]._hptSelectionDisabledReason = policy.missingReason || "Dữ liệu không hợp lệ";
    } else if (!seen["$" + value]) {
      seen["$" + value] = true;
      values.push(value);
    }
  }
  if (!values.length) return rows;

  var file = null;
  var used = {};
  try {
    file = new SCFile(policy.targetTable, SCFILE_READONLY);
    file.setFields([policy.targetField]);
    var rc = file.doSelect(U.buildInFilter(policy.targetField, values));
    while (rc === RC_SUCCESS) {
      var usedValue = U.cleanString(U.getSmField(file, policy.targetField));
      if (usedValue) used["$" + usedValue] = true;
      rc = file.getNext();
    }
    if (!U.isNotFoundRc(rc)) throw new Error("Availability query failed: " + U.rcDetail(rc));
  } catch (error) {
    U.log("ERROR", context, "selection-availability", "Không thể kiểm tra dữ liệu đã sử dụng", {
      detail: error.toString()
    });
    for (i = 0; i < rows.length; i++) {
      rows[i]._hptSelectable = false;
      rows[i]._hptSelectionDisabledReason = policy.errorReason || "Không thể kiểm tra khả năng lựa chọn";
    }
    return rows;
  } finally {
    U.closeFile(file, context);
  }

  for (i = 0; i < rows.length; i++) {
    var rowValue = U.cleanString(rows[i][policy.sourceField]);
    if (rowValue && used["$" + rowValue]) {
      rows[i]._hptSelectable = false;
      rows[i]._hptSelectionDisabledReason = policy.unavailableReason || "Bản ghi đã được sử dụng";
    }
  }
  return rows;
}

function keyField(config) {
  return U.findField(config, config.keyField);
}

function keyValue(config, request) {
  var queryName = config.keyQueryParam || config.keyField;
  return U.cleanString(request.query[queryName]);
}

function validateKey(config, value, context) {
  var field = keyField(config);
  if (!field) return U.serviceError("INVALID_CONFIG", "Không tìm thấy cấu hình khóa", context);
  if (!value) {
    return U.validationError("MISSING_ID", field.api + " không được để trống", field.api, context);
  }
  return U.validateField(field, value, context, true);
}

function buildKeyFilter(config, value) {
  return U.buildEqualFilter(keyField(config).db, value);
}

function applyBody(config, file, body, operation, context) {
  var fields = config.fields || [];
  var values = {};
  var changed = false;
  var i;
  var field;
  var present;
  var value;
  var error;

  for (i = 0; i < fields.length; i++) {
    field = fields[i];
    if (operation === "create" && field.create === false) continue;
    if (operation === "update" && field.update === false) continue;

    present = U.hasBodyField(body, field);
    if (operation === "create" && field.required && !present) {
      return {
        error: U.validationError(
          "MISSING_FIELD",
          field.api + " không được để trống",
          field.api,
          context
        )
      };
    }
    if (!present) continue;

    value = U.normalizeFieldValue(field, U.getBodyField(body, field));
    // Required fields may not be cleared during update when they are present.
    error = U.validateField(field, value, context, field.required === true);
    if (error) return { error: error };
    values[field.api] = value;
    U.setSmField(file, field.db, value);
    changed = true;
  }

  return { changed: changed, values: values };
}

// Truy vấn list có permission, filter, sort, paging và lookup batch.
function list(config, request) {
  refreshDependencies();
  var startedAt = new Date().getTime();
  request = U.normalizeRequest(request);
  var context = contextFor(config, "list", request);
  var configError = validateConfig(config, context);
  if (configError) return configError;
  var authorizationError = authorizeAction(config, "list", request, context);
  if (authorizationError) return authorizationError;

  try {
    var defaults = config.defaults || {};
    var maxPage = defaults.maxPage || 1000000;
    var maxPageSize = defaults.maxPageSize || 100;
    var defaultPageSize = defaults.pageSize || 20;
    var minKeywordLength = defaults.minKeywordLength || 2;
    var maxKeywordLength = defaults.maxKeywordLength || 200;

    if (request.query.page !== undefined && request.query.page !== "" &&
        !U.isPositiveInteger(request.query.page)) {
      return U.validationError("INVALID_FIELD", "page phải là số nguyên dương", "page", context);
    }
    if (request.query.limit !== undefined && request.query.limit !== "" &&
        !U.isPositiveInteger(request.query.limit)) {
      return U.validationError("INVALID_FIELD", "limit phải là số nguyên dương", "limit", context);
    }

    var page = U.parsePositiveInteger(request.query.page, 1);
    var limit = U.parsePositiveInteger(request.query.limit, defaultPageSize);
    var keyword = U.cleanString(request.query.keyword);
    if (page > maxPage) {
      return U.validationError("INVALID_FIELD", "page không được vượt quá " + maxPage, "page", context);
    }
    if (limit > maxPageSize) {
      return U.validationError("INVALID_FIELD", "limit không được vượt quá " + maxPageSize, "limit", context);
    }
    if (keyword.length > maxKeywordLength) {
      return U.validationError(
        "INVALID_FIELD",
        "keyword không được vượt quá " + maxKeywordLength + " ký tự",
        "keyword",
        context
      );
    }
    if (keyword && keyword.length < minKeywordLength) {
      return U.validationError(
        "INVALID_FIELD",
        "keyword phải có ít nhất " + minKeywordLength + " ký tự",
        "keyword",
        context
      );
    }

    var sortable = config.sortable || {};
    var requestedSortBy = String(request.query.sortBy || defaults.sortBy || config.keyField);
    if (request.query.sortBy !== undefined && request.query.sortBy !== "" &&
        !Object.prototype.hasOwnProperty.call(sortable, requestedSortBy)) {
      return U.validationError(
        "INVALID_FIELD",
        "sortBy không được hỗ trợ: " + requestedSortBy,
        "sortBy",
        context
      );
    }
    var sortBy = sortable[requestedSortBy] || sortable[defaults.sortBy] || keyField(config).db;
    var sortDir = String(request.query.sortDir || defaults.sortDir || "asc").toLowerCase();
    if (request.query.sortDir !== undefined && request.query.sortDir !== "" &&
        sortDir !== "asc" && sortDir !== "desc") {
      return U.validationError(
        "INVALID_FIELD",
        "sortDir chỉ nhận asc hoặc desc",
        "sortDir",
        context
      );
    }
    if (sortDir !== "desc") sortDir = "asc";
    var includeTotal = U.parseBoolean(request.query.includeTotal, true);
    /*
     * DataTables needs both the filtered total and the total before keyword
     * filtering. Keep this opt-in so ordinary catalog API callers still pay
     * for one count only.
     */
    var includeUnfilteredTotal = includeTotal &&
      U.parseBoolean(request.query.includeUnfilteredTotal, false);
    var includeTiming = U.parseBoolean(request.query.includeTiming, false);
    var timing = {
      countMs: 0, unfilteredCountMs: 0, selectMs: 0,
      lookupMs: 0, lookupQueries: 0, lookupKeys: 0, totalMs: 0
    };
    var permissionResult = resolveDataPermission(config, context);
    if (permissionResult.error) return permissionResult.error;
    var filterQuery = keyword ? U.buildSearchFilter(config, keyword) : "true";
    var configuredFilterResult = applyConfiguredFilters(
      config, filterQuery, request, context
    );
    if (configuredFilterResult.error) return configuredFilterResult.error;
    filterQuery = configuredFilterResult.query;
    var hookResult = runHook(config, "beforeList", [filterQuery, request, context]);
    if (hookResult && hookResult.error) return hookResult.error;
    if (hookResult && hookResult.query) filterQuery = hookResult.query;
    filterQuery = applyDataPermission(filterQuery, permissionResult, context);

    var total = null;
    if (includeTotal) {
      var countStartedAt = new Date().getTime();
      var countResult = U.countFile(config.table, filterQuery, context);
      timing.countMs = new Date().getTime() - countStartedAt;
      if (!countResult.success) {
        return U.serviceError(
          "QUERY_ERROR",
          message(config, "listError", "Không thể đếm danh sách"),
          context,
          { total: 0, page: page, limit: limit, count: 0, data: [] }
        );
      }
      total = countResult.count;
    }

    var totalAll = null;
    if (includeUnfilteredTotal) {
      if (!keyword) {
        totalAll = total;
      } else {
        /* Apply the same list hook to the unfiltered query so row-scope
         * restrictions configured by a catalog remain in effect. */
        var unfilteredQueryResult = applyConfiguredFilters(
          config, "true", request, context
        );
        if (unfilteredQueryResult.error) return unfilteredQueryResult.error;
        var unfilteredQuery = unfilteredQueryResult.query;
        var unfilteredHookResult = runHook(
          config,
          "beforeList",
          [unfilteredQuery, request, context]
        );
        if (unfilteredHookResult && unfilteredHookResult.error) {
          return unfilteredHookResult.error;
        }
        if (unfilteredHookResult && unfilteredHookResult.query) {
          unfilteredQuery = unfilteredHookResult.query;
        }
        unfilteredQuery = applyDataPermission(unfilteredQuery, permissionResult, context);

        var unfilteredCountStartedAt = new Date().getTime();
        var unfilteredCountResult = U.countFile(config.table, unfilteredQuery, context);
        timing.unfilteredCountMs = new Date().getTime() - unfilteredCountStartedAt;
        if (!unfilteredCountResult.success) {
          return U.serviceError(
            "QUERY_ERROR",
            message(config, "listError", "Không thể đếm danh sách"),
            context,
            { total: 0, totalAll: 0, page: page, limit: limit, count: 0, data: [] }
          );
        }
        totalAll = unfilteredCountResult.count;
      }
    }

    var offset = (page - 1) * limit;
    // Fetch one extra record so pagination metadata reflects the select at T1,
    // instead of relying only on the potentially stale count captured at T0.
    var fetchLimit = limit + 1;
    var rows = [];
    var file = null;
    var rc;
    var usedDoSelectEx = false;
    var selectStartedAt = new Date().getTime();
    try {
      file = new SCFile(config.table, SCFILE_READONLY);
      file.setFields(U.getDbFields(config, "list"));
      if (typeof file.setOrderBy === "function") {
        file.setOrderBy([sortBy], [sortDir === "desc" ? SCFILE_DSC : SCFILE_ASC]);
      }
      if (typeof file.doSelectEx === "function") {
        rc = file.doSelectEx(filterQuery, offset, fetchLimit);
        usedDoSelectEx = true;
      } else {
        rc = file.doSelect(filterQuery);
      }

      if (rc === RC_SUCCESS && !usedDoSelectEx) {
        var skipped;
        for (skipped = 0; skipped < offset && rc === RC_SUCCESS; skipped++) {
          rc = file.getNext();
        }
      }
      while (rc === RC_SUCCESS && rows.length < fetchLimit) {
        rows.push(U.mapRecord(config, file, "list"));
        if (rows.length >= fetchLimit) break;
        rc = file.getNext();
      }
      if (rc !== RC_SUCCESS && !U.isNotFoundRc(rc)) {
        throw new Error("SCFile select failed: " + U.rcDetail(rc));
      }
    } catch (selectError) {
      U.log("ERROR", context, "select", "Service operation failed", {
        detail: selectError.toString()
      });
      return U.serviceError(
        "QUERY_ERROR",
        message(config, "listError", "Không thể tải danh sách"),
        context,
        { total: 0, page: page, limit: limit, count: 0, data: [] }
      );
    } finally {
      timing.selectMs = new Date().getTime() - selectStartedAt;
      U.closeFile(file, context);
    }

    var rawRowCount = rows.length;
    var hasMore = rawRowCount > limit;
    if (hasMore) rows.pop();

    var lookupStartedAt = new Date().getTime();
    var lookupResult;
    if (typeof U.resolveLookups === "function") {
      lookupResult = U.resolveLookups(config, rows, context);
    } else {
      /*
       * ScriptLibrary có thể được publish/reload lệch thời điểm. Không để engine mới
       * làm hỏng toàn bộ danh sách khi CommonApiUtils trên runtime vẫn là bản cũ.
       */
      var configuredLookups = config.lookups || [];
      var lookupIndex;
      var rowIndex;
      for (lookupIndex = 0; lookupIndex < configuredLookups.length; lookupIndex++) {
        var unavailableLookup = configuredLookups[lookupIndex] || {};
        var unavailableOutputs = unavailableLookup.outputs || [{
          targetField: unavailableLookup.targetField,
          fallback: unavailableLookup.fallback
        }];
        for (rowIndex = 0; rowIndex < rows.length; rowIndex++) {
          for (var outputIndex = 0; outputIndex < unavailableOutputs.length; outputIndex++) {
            if (!unavailableOutputs[outputIndex].targetField) continue;
            rows[rowIndex][unavailableOutputs[outputIndex].targetField] =
              unavailableOutputs[outputIndex].fallback === "source"
                ? (rows[rowIndex][unavailableLookup.sourceField] || "")
                : "";
          }
        }
      }
      lookupResult = { success: true, data: rows, stats: { queries: 0, uniqueKeys: 0 } };
    }
    timing.lookupMs = new Date().getTime() - lookupStartedAt;
    timing.lookupQueries = lookupResult.stats ? lookupResult.stats.queries : 0;
    timing.lookupKeys = lookupResult.stats ? lookupResult.stats.uniqueKeys : 0;
    if (!lookupResult.success) {
      return U.serviceError(
        "LOOKUP_ERROR",
        message(config, "lookupError", "Không thể ánh xạ dữ liệu tham chiếu"),
        context,
        { total: total, page: page, limit: limit, count: 0, data: [] }
      );
    }
    rows = lookupResult.data;
    rows = applySelectionAvailability(config, rows, context);

    var emptyPage = page > 1 && rawRowCount === 0;
    var pageOutOfRangeAtCount = includeTotal && page > 1 && offset >= total;
    var stalePageSuspected = includeTotal && total > 0 && offset < total && rawRowCount === 0;

    if (stalePageSuspected) {
      U.log("WARN", context, "empty-page", "Count and select returned inconsistent page boundary", {
        page: page,
        limit: limit,
        offset: offset,
        totalAtCount: total
      });
    }

    hookResult = runHook(config, "afterList", [rows, request, context]);
    if (hookResult && hookResult.error) return hookResult.error;
    if (hookResult && hookResult.data) rows = hookResult.data;

    timing.totalMs = new Date().getTime() - startedAt;
    var result = {
      success: true,
      total: total,
      totalAll: totalAll,
      page: page,
      limit: limit,
      count: rows.length,
      hasMore: hasMore,
      reachedEnd: !hasMore,
      emptyPage: emptyPage,
      pageOutOfRangeAtCount: pageOutOfRangeAtCount,
      stalePageSuspected: stalePageSuspected,
      includeTotal: includeTotal,
      includeUnfilteredTotal: includeUnfilteredTotal,
      sortBy: requestedSortBy,
      sortDir: sortDir,
      requestId: context.requestId,
      data: rows,
      message: message(config, "listSuccess", "Lấy danh sách thành công")
    };
    if (includeTiming) {
      result.timing = timing;
      U.log("INFO", context, "timing", "Query timing", {
        page: page,
        limit: limit,
          includeTotal: includeTotal,
          includeUnfilteredTotal: includeUnfilteredTotal,
          keywordLength: keyword.length,
          countMs: timing.countMs,
          unfilteredCountMs: timing.unfilteredCountMs,
        selectMs: timing.selectMs,
        lookupMs: timing.lookupMs,
        lookupQueries: timing.lookupQueries,
        lookupKeys: timing.lookupKeys,
        totalMs: timing.totalMs
      });
    }
    return result;
  } catch (error) {
    U.log("ERROR", context, "unexpected", "Unexpected service error", {
      detail: error.toString()
    });
    return U.serviceError(
      "QUERY_ERROR",
      message(config, "listError", "Không thể tải danh sách"),
      context,
      { total: 0, page: 1, limit: 20, count: 0, data: [] }
    );
  }
}

function isSafeDbName(value) {
  return /^[A-Za-z0-9_.]+$/.test(String(value || ""));
}

function optionItem(value) {
  return { value: value, label: value };
}

function loadDefinedOptionValues(definition) {
  var values = definition.values || [];
  var maxItems = definition.maxItems || values.length;
  var result = [];
  var seen = {};
  var i;
  var value;
  for (i = 0; i < values.length && result.length < maxItems; i++) {
    value = U.cleanString(values[i]);
    if (!value || Object.prototype.hasOwnProperty.call(seen, "$" + value)) continue;
    seen["$" + value] = true;
    result.push(value);
  }
  return result;
}

/* DISTINCT is executed by the SM/RDBMS query path; only configured names are accepted. */
function loadDistinctOptionValues(definition, context) {
  var table = definition.table;
  var field = definition.field;
  var maxItems = definition.maxItems || 500;
  var file = null;
  var result = [];
  var seen = {};
  var rc;
  var value;
  if (!isSafeDbName(table) || !isSafeDbName(field)) {
    return { success: false, configError: true };
  }
  try {
    file = new SCFile(table, SCFILE_READONLY);
    rc = file.doSelect("select DISTINCT " + field + " from " + table);
    while (rc === RC_SUCCESS && result.length < maxItems) {
      value = U.cleanString(U.getSmField(file, field));
      if (value && !Object.prototype.hasOwnProperty.call(seen, "$" + value)) {
        seen["$" + value] = true;
        result.push(value);
      }
      rc = file.getNext();
    }
    if (rc !== RC_SUCCESS && !U.isNotFoundRc(rc)) {
      throw new Error("SCFile distinct failed: " + U.rcDetail(rc));
    }
    return { success: true, values: result };
  } catch (error) {
    U.log("ERROR", context, "filter-options-distinct", "Service operation failed", {
      table: table, field: field, detail: error.toString()
    });
    return { success: false };
  } finally {
    U.closeFile(file, context);
  }
}

function loadLookupOptions(lookup, context, runtime) {
  var paged = !!runtime;
  runtime = runtime || {};
  if (!lookup || !lookup.table || !lookup.keyField || !lookup.labelField ||
      !isSafeDbName(lookup.table) || !isSafeDbName(lookup.keyField) ||
      !isSafeDbName(lookup.labelField)) {
    return { success: false, configError: true };
  }
  var fields = [lookup.keyField, lookup.labelField];
  var extraFields = lookup.extraFields || {};
  var key;
  for (key in extraFields) {
    if (!Object.prototype.hasOwnProperty.call(extraFields, key)) continue;
    if (!isSafeDbName(extraFields[key])) return { success: false, configError: true };
    if (fields.indexOf(extraFields[key]) === -1) fields.push(extraFields[key]);
  }
  var result = [];
  var file = null;
  var rc;
  var requestedLimit = paged
    ? Math.max(1, Math.min(100, Number(runtime.limit) || 20))
    : Math.max(1, Math.min(1000, Number(lookup.maxItems) || 500));
  var page = paged ? Math.max(1, Math.min(10000, Number(runtime.page) || 1)) : 1;
  var offset = (page - 1) * requestedLimit;
  var maxItems = requestedLimit + (paged ? 1 : 0);
  try {
    file = new SCFile(lookup.table, SCFILE_READONLY);
    file.setFields(fields);
    if (lookup.orderBy && typeof file.setOrderBy === "function") {
      if (!isSafeDbName(lookup.orderBy)) return { success: false, configError: true };
      file.setOrderBy([lookup.orderBy], [SCFILE_ASC]);
    }
    var query = lookup.query || "true";
    var keyword = U.cleanString(runtime.search);
    if (keyword) {
      var escaped = U.escapeQueryValue(keyword);
      var searchQuery = "((" + lookup.keyField + " like \"*" + escaped + "*\") or (" +
        lookup.labelField + " like \"*" + escaped + "*\"))";
      query = "(" + query + ") and " + searchQuery;
    }
    rc = file.doSelect(query);
    for (var skipped = 0; skipped < offset && rc === RC_SUCCESS; skipped++) {
      rc = file.getNext();
    }
    while (rc === RC_SUCCESS && result.length < maxItems) {
      var item = {
        value: U.getSmField(file, lookup.keyField),
        label: U.getSmField(file, lookup.labelField)
      };
      for (key in extraFields) {
        if (Object.prototype.hasOwnProperty.call(extraFields, key)) {
          item[key] = U.getSmField(file, extraFields[key]) || "";
        }
      }
      if (item.value !== undefined && item.value !== null && item.value !== "") result.push(item);
      rc = file.getNext();
    }
    if (rc !== RC_SUCCESS && !U.isNotFoundRc(rc)) {
      throw new Error("SCFile options failed: " + U.rcDetail(rc));
    }
    var hasMore = result.length > requestedLimit;
    if (hasMore) result = result.slice(0, requestedLimit);
    return { success: true, data: result, page: page, limit: requestedLimit, hasMore: hasMore };
  } catch (error) {
    U.log("ERROR", context, "filter-options-lookup", "Service operation failed", {
      table: lookup.table, detail: error.toString()
    });
    return { success: false };
  } finally {
    U.closeFile(file, context);
  }
}

/* Enrich a defined/distinct value list with one batched lookup query. */
function mapFilterOptionValues(values, lookup, context) {
  if (!lookup || !isSafeDbName(lookup.table) ||
      !isSafeDbName(lookup.keyField) || !isSafeDbName(lookup.labelField)) {
    return { success: false, configError: true };
  }
  var rows = [];
  var outputs = [{
    targetField: "label",
    displayField: lookup.labelField,
    fallback: "source"
  }];
  var extraFields = lookup.extraFields || {};
  var key;
  var i;
  for (key in extraFields) {
    if (Object.prototype.hasOwnProperty.call(extraFields, key)) {
      if (!isSafeDbName(extraFields[key])) return { success: false, configError: true };
      outputs.push({ targetField: key, displayField: extraFields[key], fallback: "empty" });
    }
  }
  for (i = 0; i < values.length; i++) rows.push({ value: values[i] });
  var mapped = U.resolveLookups({
    lookups: [{
      sourceField: "value",
      table: lookup.table,
      keyField: lookup.keyField,
      outputs: outputs,
      extraQuery: lookup.query,
      required: true
    }]
  }, rows, context);
  if (!mapped.success) return mapped;
  mapped.data.sort(function (left, right) {
    return String(left.label || left.value).localeCompare(String(right.label || right.value));
  });
  return mapped;
}

/** Load options using defined, lookup or DISTINCT + batched lookup. */
// Tải option distinct/static/dependent đã đăng ký trong metadata.
function getFilterOptions(config, optionName, request) {
  refreshDependencies();
  request = U.normalizeRequest(request);
  var context = contextFor(config, "options", request);
  var authorizationError = authorizeAction(config, "filterOptions", request, context);
  if (authorizationError) return authorizationError;
  var definition = config.filterOptions && config.filterOptions[optionName];
  if (!definition || (definition.source !== "defined" &&
      definition.source !== "lookup" && definition.source !== "distinct" &&
      definition.source !== "dependent")) {
    return U.serviceError("INVALID_CONFIG", "Cấu hình dữ liệu bộ lọc không hợp lệ", context);
  }
  var remoteSearch = U.cleanString(request.query.search);
  if (remoteSearch.length > 100) {
    return U.validationError("INVALID_OPTION_SEARCH", "Từ khóa tìm kiếm quá dài", "search", context);
  }
  var remotePage = Math.max(1, Math.min(10000, Number(request.query.page) || 1));
  var remoteLimit = Math.max(1, Math.min(100, Number(request.query.limit) || 20));
  var remoteRequest = { search: remoteSearch, page: remotePage, limit: remoteLimit };
  var loaded;
  if (definition.source === "lookup") {
    loaded = loadLookupOptions(definition.lookup, context, remoteSearch ? remoteRequest : null);
  } else if (definition.source === "dependent") {
    var parentParameter = definition.parentParameter || "parentId";
    var parentValues = [];
    var rawParentValues = request.query.parentIds;
    if (rawParentValues !== undefined && rawParentValues !== null && rawParentValues !== "") {
      try {
        parentValues = typeof rawParentValues === "string"
          ? JSON.parse(rawParentValues)
          : rawParentValues;
      } catch (parentParseError) {
        return U.validationError(
          "INVALID_FILTER_PARENT",
          "parentIds không hợp lệ",
          "parentIds",
          context
        );
      }
      if (!(typeof Array !== "undefined" && Array.isArray && Array.isArray(parentValues))) {
        return U.validationError(
          "INVALID_FILTER_PARENT",
          "parentIds phải là danh sách",
          "parentIds",
          context
        );
      }
    } else {
      var singleParent = U.cleanString(request.query[parentParameter]);
      if (singleParent) parentValues = [singleParent];
    }
    var dependentLookup = definition.lookup || {};
    var parentField = dependentLookup.parentField;
    var maxParents = definition.maxParents || 20;
    if (!parentValues.length) {
      return U.validationError(
        "MISSING_FILTER_PARENT",
        parentParameter + " không được để trống",
        parentParameter,
        context
      );
    }
    if (parentValues.length > maxParents) {
      return U.validationError(
        "INVALID_FILTER_PARENT",
        "parentIds có quá nhiều giá trị",
        "parentIds",
        context
      );
    }
    if (!isSafeDbName(parentField)) {
      return U.serviceError("INVALID_CONFIG", "Cấu hình dữ liệu bộ lọc không hợp lệ", context);
    }
    var runtimeLookup = {};
    var lookupKey;
    for (lookupKey in dependentLookup) {
      if (Object.prototype.hasOwnProperty.call(dependentLookup, lookupKey)) {
        runtimeLookup[lookupKey] = dependentLookup[lookupKey];
      }
    }
    var parentConditions = [];
    var seenParents = {};
    for (var parentIndex = 0; parentIndex < parentValues.length; parentIndex++) {
      var parentValue = U.cleanString(parentValues[parentIndex]);
      if (!parentValue || parentValue.length > (definition.maxParentLength || 160)) {
        return U.validationError(
          "INVALID_FILTER_PARENT",
          "Giá trị đơn vị cha không hợp lệ",
          "parentIds",
          context
        );
      }
      if (Object.prototype.hasOwnProperty.call(seenParents, "$" + parentValue)) continue;
      seenParents["$" + parentValue] = true;
      parentConditions.push("(" + U.buildEqualFilter(parentField, parentValue) + ")");
    }
    var parentQuery = "(" + parentConditions.join(" or ") + ")";
    runtimeLookup.query = dependentLookup.query
      ? "(" + dependentLookup.query + ") and (" + parentQuery + ")"
      : parentQuery;
    loaded = loadLookupOptions(runtimeLookup, context, remoteSearch ? remoteRequest : null);
  } else {
    var values;
    if (definition.source === "defined") {
      values = loadDefinedOptionValues(definition);
    } else {
      loaded = loadDistinctOptionValues(definition.distinct || {}, context);
      if (loaded.success) values = loaded.values;
    }
    if ((!loaded || loaded.success) && values) {
      if (definition.lookup) loaded = mapFilterOptionValues(values, definition.lookup, context);
      else loaded = { success: true, data: values.map(optionItem) };
    }
  }
  if (!loaded || !loaded.success) {
    return U.serviceError(
      loaded && loaded.configError ? "INVALID_CONFIG" : "QUERY_ERROR",
      loaded && loaded.configError ? "Cấu hình dữ liệu bộ lọc không hợp lệ" : "Không thể tải dữ liệu bộ lọc",
      context, { data: [] }
    );
  }
  if (remoteSearch && definition.source !== "lookup" && definition.source !== "dependent") {
    var lowered = remoteSearch.toLowerCase();
    var matching = loaded.data.filter(function (item) {
      return String(item.value || "").toLowerCase().indexOf(lowered) !== -1 ||
        String(item.label || "").toLowerCase().indexOf(lowered) !== -1;
    });
    var optionOffset = (remotePage - 1) * remoteLimit;
    loaded.hasMore = matching.length > optionOffset + remoteLimit;
    loaded.data = matching.slice(optionOffset, optionOffset + remoteLimit);
    loaded.page = remotePage;
    loaded.limit = remoteLimit;
  }
  return {
    success: true,
    requestId: context.requestId,
    count: loaded.data.length,
    page: loaded.page || 1,
    limit: loaded.limit || loaded.data.length,
    hasMore: loaded.hasMore === true,
    data: loaded.data
  };
}

/* Backward compatibility for services still using optionSources. */
function options(config, optionName, request) {
  refreshDependencies();
  if (config.filterOptions && config.filterOptions[optionName]) {
    return getFilterOptions(config, optionName, request);
  }
  var legacy = config.optionSources && config.optionSources[optionName];
  if (!legacy) return getFilterOptions(config, optionName, request);
  var compatibilityConfig = {
    module: config.module,
    requestIdPrefix: config.requestIdPrefix,
    actionPermissions: config.actionPermissions,
    filterOptions: {}
  };
  compatibilityConfig.filterOptions[optionName] = {
    source: "lookup",
    lookup: {
      table: legacy.table,
      keyField: legacy.valueField,
      labelField: legacy.labelField,
      extraFields: legacy.extraFields,
      query: legacy.query,
      orderBy: legacy.orderBy,
      maxItems: legacy.maxItems
    }
  };
  return getFilterOptions(compatibilityConfig, optionName, request);
}

// Đọc một bản ghi theo khóa và data scope.
function detail(config, request) {
  refreshDependencies();
  request = U.normalizeRequest(request);
  var context = contextFor(config, "detail", request);
  var configError = validateConfig(config, context);
  if (configError) return configError;
  var authorizationError = authorizeAction(config, "detail", request, context);
  if (authorizationError) return authorizationError;
  var value = keyValue(config, request);
  var keyError = validateKey(config, value, context);
  if (keyError) return keyError;
  var permissionResult = resolveDataPermission(config, context);
  if (permissionResult.error) return permissionResult.error;
  var recordQuery = applyDataPermission(
    buildKeyFilter(config, value),
    permissionResult,
    context
  );
  var file = null;
  try {
    file = new SCFile(config.table, SCFILE_READONLY);
    file.setFields(U.getDbFields(config));
    var rc = file.doSelect(recordQuery);
    if (rc !== RC_SUCCESS) {
      if (U.isNotFoundRc(rc)) {
        return U.serviceError("NOT_FOUND", message(config, "notFound", "Không tìm thấy bản ghi"), context);
      }
      U.log("ERROR", context, "select", "Service operation failed", { detail: U.rcDetail(rc) });
      return U.serviceError("QUERY_ERROR", message(config, "detailError", "Không thể tải chi tiết"), context);
    }
    var data = U.mapRecord(config, file);
    var hookResult = runHook(config, "afterDetail", [data, request, context]);
    if (hookResult && hookResult.error) return hookResult.error;
    if (hookResult && hookResult.data) data = hookResult.data;
    return {
      success: true,
      requestId: context.requestId,
      data: data,
      message: message(config, "detailSuccess", "Lấy chi tiết thành công")
    };
  } catch (error) {
    U.log("ERROR", context, "select", "Service operation failed", { detail: error.toString() });
    return U.serviceError("QUERY_ERROR", message(config, "detailError", "Không thể tải chi tiết"), context);
  } finally {
    U.closeFile(file, context);
  }
}

// Tạo bản ghi generic từ field allowlist và hook cấu hình.
function create(config, request) {
  refreshDependencies();
  request = U.normalizeRequest(request);
  var context = contextFor(config, "create", request);
  var configError = validateConfig(config, context);
  if (configError) return configError;
  var authorizationError = authorizeAction(config, "create", request, context);
  if (authorizationError) return authorizationError;
  if (!U.isValidBody(request.body)) {
    return U.validationError("INVALID_BODY", "Body JSON không hợp lệ", "body", context);
  }

  var key = keyField(config);
  var rawKey = U.getBodyField(request.body, key);
  var value = U.normalizeFieldValue(key, rawKey);
  var keyError = U.validateField(key, value, context, true);
  if (keyError) return keyError;

  var duplicateFile = null;
  try {
    duplicateFile = new SCFile(config.table, SCFILE_READONLY);
    var duplicateRc = duplicateFile.doSelect(buildKeyFilter(config, value));
    if (duplicateRc === RC_SUCCESS) {
      return U.serviceError(
        "DUPLICATE_KEY",
        message(config, "duplicate", key.api + " đã tồn tại"),
        context
      );
    }
    if (!U.isNotFoundRc(duplicateRc)) {
      // Duplicate check is advisory. The unique key at DBDict/RDBMS remains
      // the final guard, so a temporary check failure must not block insert.
      U.log("WARN", context, "duplicate-check", "Duplicate check skipped; insert will enforce unique key", {
        detail: U.rcDetail(duplicateRc),
        table: config.table,
        keyField: key.api
      });
    }
  } catch (duplicateError) {
    U.log("WARN", context, "duplicate-check", "Duplicate check skipped; insert will enforce unique key", {
      detail: duplicateError.toString(),
      table: config.table,
      keyField: key.api
    });
  } finally {
    U.closeFile(duplicateFile, context);
  }

  var file = null;
  try {
    file = new SCFile(config.table);
    var applied = applyBody(config, file, request.body, "create", context);
    if (applied.error) return applied.error;
    var hookResult = runHook(config, "beforeCreate", [file, applied.values, request, context]);
    if (hookResult && hookResult.error) return hookResult.error;
    var rc = file.doInsert();
    if (rc !== RC_SUCCESS) {
      U.log("ERROR", context, "insert", "Service operation failed", { detail: U.rcDetail(rc) });
      return U.serviceError("CREATE_ERROR", message(config, "createError", "Không thể tạo bản ghi"), context);
    }
    var data = U.mapRecord(config, file);
    hookResult = runHook(config, "afterCreate", [data, request, context]);
    if (hookResult && hookResult.data) data = hookResult.data;
    return {
      success: true,
      requestId: context.requestId,
      message: message(config, "createSuccess", "Tạo bản ghi thành công"),
      data: data
    };
  } catch (error) {
    U.log("ERROR", context, "insert", "Service operation failed", { detail: error.toString() });
    return U.serviceError("CREATE_ERROR", message(config, "createError", "Không thể tạo bản ghi"), context);
  } finally {
    U.closeFile(file, context);
  }
}

// Cập nhật generic với validation và optimistic locking.
function update(config, request) {
  refreshDependencies();
  request = U.normalizeRequest(request);
  var context = contextFor(config, "update", request);
  var configError = validateConfig(config, context);
  if (configError) return configError;
  var authorizationError = authorizeAction(config, "update", request, context);
  if (authorizationError) return authorizationError;
  if (!U.isValidBody(request.body)) {
    return U.validationError("INVALID_BODY", "Body JSON không hợp lệ", "body", context);
  }
  var value = keyValue(config, request);
  var keyError = validateKey(config, value, context);
  if (keyError) return keyError;
  var permissionResult = resolveDataPermission(config, context);
  if (permissionResult.error) return permissionResult.error;
  var recordQuery = applyDataPermission(
    buildKeyFilter(config, value),
    permissionResult,
    context
  );
  var file = null;
  try {
    file = new SCFile(config.table);
    var rc = file.doSelect(recordQuery);
    if (rc !== RC_SUCCESS) {
      if (U.isNotFoundRc(rc)) {
        return U.serviceError("NOT_FOUND", message(config, "notFound", "Không tìm thấy bản ghi"), context);
      }
      U.log("ERROR", context, "select-for-update", "Service operation failed", { detail: U.rcDetail(rc) });
      return U.serviceError("QUERY_ERROR", message(config, "updateError", "Không thể cập nhật bản ghi"), context);
    }
    var applied = applyBody(config, file, request.body, "update", context);
    if (applied.error) return applied.error;
    if (!applied.changed) {
      return U.validationError(
        "NO_FIELDS_TO_UPDATE",
        "Không có trường hợp hợp lệ để cập nhật",
        "body",
        context
      );
    }
    var hookResult = runHook(config, "beforeUpdate", [file, applied.values, request, context]);
    if (hookResult && hookResult.error) return hookResult.error;
    rc = file.doUpdate();
    if (rc !== RC_SUCCESS) {
      U.log("ERROR", context, "update", "Service operation failed", { detail: U.rcDetail(rc) });
      return U.serviceError("UPDATE_ERROR", message(config, "updateError", "Không thể cập nhật bản ghi"), context);
    }
    var data = U.mapRecord(config, file);
    hookResult = runHook(config, "afterUpdate", [data, request, context]);
    if (hookResult && hookResult.data) data = hookResult.data;
    return {
      success: true,
      requestId: context.requestId,
      message: message(config, "updateSuccess", "Cập nhật bản ghi thành công"),
      data: data
    };
  } catch (error) {
    U.log("ERROR", context, "update", "Service operation failed", { detail: error.toString() });
    return U.serviceError("UPDATE_ERROR", message(config, "updateError", "Không thể cập nhật bản ghi"), context);
  } finally {
    U.closeFile(file, context);
  }
}

// Xóa generic sau kiểm tra quyền, scope và concurrency.
function remove(config, request) {
  refreshDependencies();
  request = U.normalizeRequest(request);
  var context = contextFor(config, "remove", request);
  var configError = validateConfig(config, context);
  if (configError) return configError;
  var authorizationError = authorizeAction(config, "delete", request, context);
  if (authorizationError) return authorizationError;
  var value = keyValue(config, request);
  var keyError = validateKey(config, value, context);
  if (keyError) return keyError;
  var permissionResult = resolveDataPermission(config, context);
  if (permissionResult.error) return permissionResult.error;
  var recordQuery = applyDataPermission(
    buildKeyFilter(config, value),
    permissionResult,
    context
  );
  var file = null;
  try {
    file = new SCFile(config.table);
    var rc = file.doSelect(recordQuery);
    if (rc !== RC_SUCCESS) {
      if (U.isNotFoundRc(rc)) {
        return U.serviceError("NOT_FOUND", message(config, "notFound", "Không tìm thấy bản ghi"), context);
      }
      U.log("ERROR", context, "select-for-delete", "Service operation failed", { detail: U.rcDetail(rc) });
      return U.serviceError("QUERY_ERROR", message(config, "deleteError", "Không thể xóa bản ghi"), context);
    }
    var current = U.mapRecord(config, file);
    var hookResult = runHook(config, "beforeDelete", [current, request, context]);
    if (hookResult && hookResult.error) return hookResult.error;
    rc = file.doDelete();
    if (rc !== RC_SUCCESS) {
      U.log("ERROR", context, "delete", "Service operation failed", { detail: U.rcDetail(rc) });
      return U.serviceError("DELETE_ERROR", message(config, "deleteError", "Không thể xóa bản ghi"), context);
    }
    runHook(config, "afterDelete", [current, request, context]);
    return {
      success: true,
      requestId: context.requestId,
      message: message(config, "deleteSuccess", "Xóa bản ghi thành công"),
      deletedId: value
    };
  } catch (error) {
    U.log("ERROR", context, "delete", "Service operation failed", { detail: error.toString() });
    return U.serviceError("DELETE_ERROR", message(config, "deleteError", "Không thể xóa bản ghi"), context);
  } finally {
    U.closeFile(file, context);
  }
}
