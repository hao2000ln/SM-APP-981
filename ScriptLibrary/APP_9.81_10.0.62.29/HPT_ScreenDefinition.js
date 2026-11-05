/**
 * ScriptLibrary name: HPT_ScreenDefinition
 * Validates backend screen metadata and creates a safe browser projection.
 * Đây là schema/normalizer trung tâm cho screen, action, popup và selector.
 */

function definitionError(errors) {
  return { success: false, code: "INVALID_SCREEN_DEFINITION", errors: errors };
}

function own(object, key) {
  return object && Object.prototype.hasOwnProperty.call(object, key);
}

function safeId(value) {
  return typeof value === "string" && /^[A-Za-z][A-Za-z0-9_.-]{0,127}$/.test(value);
}

function safeDbName(value) {
  return typeof value === "string" && value.length <= 128 &&
    /^[A-Za-z0-9_.-]+$/.test(value);
}

function safeText(value, fallback, maxLength) {
  var result = value === undefined || value === null ? "" : String(value);
  if (!result) result = fallback || "";
  // Metadata is rendered by the browser runtime. Keep the projection plain-text
  // even when a future screen definition is configured incorrectly.
  result = result.replace(/[\u0000-\u001F\u007F]/g, " ").replace(/[<>]/g, "");
  return result.substring(0, maxLength || 200);
}

function positiveNumber(value, fallback, maximum) {
  var parsed = Math.floor(Number(value));
  if (!(parsed > 0)) parsed = fallback;
  return maximum && parsed > maximum ? maximum : parsed;
}

function nonNegativeNumber(value, fallback, maximum) {
  var parsed = Math.floor(Number(value));
  if (!(parsed >= 0)) parsed = fallback;
  return maximum !== undefined && parsed > maximum ? maximum : parsed;
}

function conditionValue(value, path, errors) {
  var type = typeof value;
  if (value === null || type === "boolean" || type === "number") return value;
  if (type === "string") {
    return value.replace(/[\u0000-\u001F\u007F]/g, " ").substring(0, 500);
  }
  errors.push(path + " must be a scalar value");
  return null;
}

/* Conditions are deliberately a small declarative DSL. Never project a
 * JavaScript expression/function to the browser because it would turn screen
 * metadata into an eval surface. `enforceEnableIf` can recheck supported rules
 * in Batch Engine; complex business rules still belong to domain handlers. */
function normalizeCondition(source, availableFields, path, errors) {
  if (source === undefined || source === null) return null;
  if (!source || typeof source !== "object" || Array.isArray(source)) {
    errors.push(path + " must be an object");
    return null;
  }

  var result = {
    minSelected: nonNegativeNumber(source.minSelected, 0, 1000),
    records: source.records === "any" ? "any" : "all",
    rules: []
  };
  if (own(source, "maxSelected")) {
    result.maxSelected = nonNegativeNumber(source.maxSelected, 0, 1000);
    if (result.maxSelected < result.minSelected) {
      errors.push(path + ".maxSelected must be greater than or equal to minSelected");
    }
  }

  var allowedOperators = {
    eq: true, neq: true, in: true, notIn: true,
    empty: true, notEmpty: true
  };
  var rules = source.rules || [];
  if (!Array.isArray(rules) || rules.length > 20) {
    errors.push(path + ".rules must be an array with at most 20 items");
    rules = [];
  }
  for (var i = 0; i < rules.length; i++) {
    var rule = rules[i] || {};
    var rulePath = path + ".rules[" + i + "]";
    if (!safeId(rule.field) || !availableFields[rule.field]) {
      errors.push(rulePath + ".field is not a public field");
      continue;
    }
    if (!allowedOperators[rule.operator]) {
      errors.push(rulePath + ".operator is invalid");
      continue;
    }
    var normalizedRule = { field: rule.field, operator: rule.operator };
    if (rule.operator === "in" || rule.operator === "notIn") {
      if (!Array.isArray(rule.values) || !rule.values.length || rule.values.length > 50) {
        errors.push(rulePath + ".values must contain between 1 and 50 scalar values");
        continue;
      }
      normalizedRule.values = [];
      for (var valueIndex = 0; valueIndex < rule.values.length; valueIndex++) {
        normalizedRule.values.push(conditionValue(
          rule.values[valueIndex], rulePath + ".values[" + valueIndex + "]", errors
        ));
      }
    } else if (rule.operator !== "empty" && rule.operator !== "notEmpty") {
      normalizedRule.value = conditionValue(rule.value, rulePath + ".value", errors);
    }
    result.rules.push(normalizedRule);
  }
  return result;
}

function publicFields(config) {
  var result = {};
  var fields = config.fields || [];
  var lookups = config.lookups || [];
  var i;
  var j;
  for (i = 0; i < fields.length; i++) {
    if (fields[i] && safeId(fields[i].api)) result[fields[i].api] = true;
  }
  for (i = 0; i < lookups.length; i++) {
    var lookup = lookups[i] || {};
    if (safeId(lookup.targetField)) result[lookup.targetField] = true;
    var outputs = lookup.outputs || [];
    for (j = 0; j < outputs.length; j++) {
      if (outputs[j] && safeId(outputs[j].targetField)) {
        result[outputs[j].targetField] = true;
      }
    }
  }
  return result;
}

/* Validate backend-only metadata before any part of it is used by the engine.
 * Browser metadata validation alone is not sufficient because fields, sort and
 * filters eventually become Service Manager queries. */
// Validate table, field, lookup, filter và selectionAvailability backend.
function validateDataConfig(config, errors) {
  var fields = config.fields || [];
  var apiFields = {};
  var dbFields = {};
  var allowedTypes = {
    string: true, integer: true, number: true, boolean: true,
    date: true, datetime: true
  };
  var allowedSearchModes = { exact: true, prefix: true, contains: true };
  var i;
  var key;

  if (!safeDbName(config.table)) errors.push("config.table is invalid");
  if (!safeId(config.keyField)) errors.push("config.keyField is invalid");
  if (!fields.length || fields.length > 200) {
    errors.push("config.fields must contain between 1 and 200 items");
  }

  for (i = 0; i < fields.length && i < 200; i++) {
    var field = fields[i] || {};
    if (!safeId(field.api) || !safeDbName(field.db)) {
      errors.push("config.fields[" + i + "] is invalid");
      continue;
    }
    if (apiFields[field.api]) errors.push("Duplicate API field: " + field.api);
    /* A display-only alias may deliberately read the same DB field as an
     * opaque version token. The alias must opt in explicitly. */
    if (dbFields[field.db] && field.allowDuplicateDb !== true) {
      errors.push("Duplicate database field: " + field.db);
    }
    if (field.type && !allowedTypes[field.type]) {
      errors.push("Unsupported field type: " + field.type);
    }
    if (field.includeInList !== undefined && typeof field.includeInList !== "boolean") {
      errors.push("config.fields[" + i + "].includeInList must be boolean");
    }
    if (field.allowDuplicateDb !== undefined && typeof field.allowDuplicateDb !== "boolean") {
      errors.push("config.fields[" + i + "].allowDuplicateDb must be boolean");
    }
    if (field.versionDependencies !== undefined) {
      if (!Array.isArray(field.versionDependencies) || field.versionDependencies.length > 32) {
        errors.push("config.fields[" + i + "].versionDependencies must be an array with at most 32 fields");
      } else {
        for (var dependencyIndex = 0; dependencyIndex < field.versionDependencies.length; dependencyIndex++) {
          if (!safeDbName(field.versionDependencies[dependencyIndex])) {
            errors.push("config.fields[" + i + "].versionDependencies contains an invalid field");
            break;
          }
        }
      }
    }
    apiFields[field.api] = true;
    dbFields[field.db] = true;
  }

  if (safeId(config.keyField) && !apiFields[config.keyField]) {
    errors.push("config.keyField must reference a configured API field");
  }
  if (config.versionField && (!safeId(config.versionField) || !apiFields[config.versionField])) {
    errors.push("config.versionField must reference a configured API field");
  }

  var search = config.search || [];
  for (i = 0; i < search.length; i++) {
    var searchItem = search[i] || {};
    if (!dbFields[searchItem.db] || !allowedSearchModes[searchItem.mode || "contains"]) {
      errors.push("config.search[" + i + "] is invalid");
    }
  }

  var sortable = config.sortable || {};
  for (key in sortable) {
    if (!own(sortable, key)) continue;
    if (!safeId(key) || !dbFields[sortable[key]]) {
      errors.push("config.sortable." + key + " is invalid");
    }
  }

  var filters = config.filters || {};
  for (key in filters) {
    if (!own(filters, key)) continue;
    if (!safeId(key) || !filters[key] || !dbFields[filters[key].db]) {
      errors.push("config.filters." + key + " is invalid");
    }
    if (filters[key] && filters[key].operator !== undefined &&
        filters[key].operator !== "eq" && filters[key].operator !== "gte" &&
        filters[key].operator !== "lte") {
      errors.push("config.filters." + key + ".operator is invalid");
    }
  }

  var lookups = config.lookups || [];
  for (i = 0; i < lookups.length; i++) {
    var lookup = lookups[i] || {};
    if (!apiFields[lookup.sourceField] || !safeDbName(lookup.table) ||
        !safeDbName(lookup.keyField)) {
      errors.push("config.lookups[" + i + "] is invalid");
      continue;
    }
    var outputs = lookup.outputs || [{
      targetField: lookup.targetField,
      displayField: lookup.displayField
    }];
    for (var outputIndex = 0; outputIndex < outputs.length; outputIndex++) {
      var output = outputs[outputIndex] || {};
      if (!safeId(output.targetField) || !safeDbName(output.displayField)) {
        errors.push("config.lookups[" + i + "].outputs[" + outputIndex + "] is invalid");
      }
    }
  }

  var availability = config.selectionAvailability;
  if (availability) {
    if (!apiFields[availability.sourceField] ||
        !safeDbName(availability.targetTable) ||
        !safeDbName(availability.targetField) ||
        (availability.mode && availability.mode !== "disable") ||
        (availability.queryOperator && availability.queryOperator !== "isin")) {
      errors.push("config.selectionAvailability is invalid");
    }
  }

  var permissions = config.actionPermissions || {};
  if (!own(permissions, "uiConfig") || !own(permissions, "list")) {
    errors.push("config.actionPermissions must declare uiConfig and list");
  }
}

/* Validate backend mutation metadata independently from the browser schema.
 * Database field names and SM storage types never come from the client. */
// Validate cấu hình thực thi batch chỉ tồn tại phía backend.
function validateBatchActionConfig(config, errors) {
  var actions = config.batchActions || {};
  var permissions = config.actionPermissions || {};
  var uiActions = config.screen && config.screen.bulkActions || [];
  var uiActionsById = {};
  var directApiFields = {};
  var configuredFields = config.fields || [];
  for (var fieldIndex = 0; fieldIndex < configuredFields.length; fieldIndex++) {
    if (configuredFields[fieldIndex] && safeId(configuredFields[fieldIndex].api)) {
      directApiFields[configuredFields[fieldIndex].api] = true;
    }
  }
  for (var uiIndex = 0; uiIndex < uiActions.length; uiIndex++) {
    if (uiActions[uiIndex] && safeId(uiActions[uiIndex].id)) {
      uiActionsById[uiActions[uiIndex].id] = uiActions[uiIndex];
    }
  }
  var allowedOperations = { "delete": true, update: true, custom: true };
  var allowedScalarTypes = {
    character: true, label: true, number: true, "date/time": true, logical: true
  };
  var actionId;
  for (actionId in actions) {
    if (!own(actions, actionId)) continue;
    var path = "config.batchActions." + actionId;
    var action = actions[actionId] || {};
    var operation = action.operation || "";
    if (!safeId(actionId) || !allowedOperations[operation]) {
      errors.push(path + " operation is invalid");
      continue;
    }
    if (!own(permissions, "batch:" + actionId)) {
      errors.push("config.actionPermissions must declare batch:" + actionId);
    }
    if (action.maxItems !== undefined &&
        (!(Number(action.maxItems) > 0) || Number(action.maxItems) > 1000)) {
      errors.push(path + ".maxItems must be between 1 and 1000");
    }
    if (action.chunkSize !== undefined &&
        (!(Number(action.chunkSize) > 0) || Number(action.chunkSize) > 100)) {
      errors.push(path + ".chunkSize must be between 1 and 100");
    }
    validateAsyncExecution(action.execution, path, errors);
    if (action.transactionMode !== undefined &&
        action.transactionMode !== "perItem" &&
        action.transactionMode !== "allValidated") {
      errors.push(path + ".transactionMode must be perItem or allValidated");
    }
    if (action.conflictMetadata !== undefined) {
      var conflictMetadata = action.conflictMetadata || {};
      if (conflictMetadata.exposeUpdatedBy !== undefined &&
          conflictMetadata.exposeUpdatedBy !== true &&
          conflictMetadata.exposeUpdatedBy !== false) {
        errors.push(path + ".conflictMetadata.exposeUpdatedBy must be boolean");
      }
      if (conflictMetadata.exposeUpdatedBy === true &&
          !safeDbName(conflictMetadata.updatedByField)) {
        errors.push(path + ".conflictMetadata.updatedByField is required");
      }
    }
    if (action.enforceEnableIf !== undefined && action.enforceEnableIf !== true &&
        action.enforceEnableIf !== false) {
      errors.push(path + ".enforceEnableIf must be boolean");
    }
    if (action.enforceEnableIf === true) {
      var enableIf = uiActionsById[actionId] && uiActionsById[actionId].enableIf;
      if (!enableIf) {
        errors.push(path + ".enforceEnableIf requires UI enableIf metadata");
      } else {
        if (enableIf.records === "any") {
          errors.push(path + ".enforceEnableIf only supports records=all");
        }
        var eligibilityRules = enableIf.rules || [];
        for (var eligibilityIndex = 0; eligibilityIndex < eligibilityRules.length; eligibilityIndex++) {
          if (!directApiFields[eligibilityRules[eligibilityIndex].field]) {
            errors.push(path + ".enforceEnableIf rules must reference direct API fields");
          }
        }
      }
    }
    if (typeof action.handler === "function") {
      errors.push(path + ".handler is not allowed; use a registered handlerId");
    }
    if (operation === "custom" &&
        (!safeId(action.handlerId) || String(action.handlerId).indexOf(".") === -1)) {
      errors.push(path + ".handlerId is required for custom operation");
    }
    var uiSelector = uiActionsById[actionId] && uiActionsById[actionId].selector;
    if (uiSelector) {
      var related = action.relatedSelection || {};
      if (operation !== "custom") {
        errors.push(path + ".relatedSelection requires custom operation");
      }
      if (!safeId(related.screenId) || related.screenId !== uiSelector.screenId) {
        errors.push(path + ".relatedSelection.screenId must match UI selector");
      }
      if (related.maxItems !== undefined &&
          (!(Number(related.maxItems) > 0) || Number(related.maxItems) > 1000)) {
        errors.push(path + ".relatedSelection.maxItems must be between 1 and 1000");
      }
      if (related.verificationChunkSize !== undefined &&
          (!(Number(related.verificationChunkSize) > 0) ||
            Number(related.verificationChunkSize) > 100)) {
        errors.push(path + ".relatedSelection.verificationChunkSize must be between 1 and 100");
      }
    } else if (action.relatedSelection !== undefined) {
      errors.push(path + ".relatedSelection requires UI selector metadata");
    }
    if (operation !== "update") continue;

    var writes = action.writes || [];
    if (!writes.length || writes.length > 50) {
      errors.push(path + ".writes must contain between 1 and 50 items");
      continue;
    }
    var targets = {};
    var popupFields = uiActionsById[actionId] && uiActionsById[actionId].popup &&
      uiActionsById[actionId].popup.fields || [];
    var popupInputs = {};
    for (var popupIndex = 0; popupIndex < popupFields.length; popupIndex++) {
      var popupField = popupFields[popupIndex] || {};
      if (safeId(popupField.name) && popupField.bind !== "reason") {
        popupInputs[popupField.name] = true;
      }
    }
    for (var i = 0; i < writes.length; i++) {
      var write = writes[i] || {};
      var writePath = path + ".writes[" + i + "]";
      var smType = String(write.smType || "").toLowerCase();
      var mode = String(write.writeMode || "replace").toLowerCase();
      var source = String(write.source || "");
      if (!safeDbName(write.field) || targets[write.field]) {
        errors.push(writePath + ".field is invalid or duplicated");
      } else {
        targets[write.field] = true;
      }
      if (mode !== "clear" && source !== "reason" &&
          !/^input\.[A-Za-z][A-Za-z0-9_.-]{0,127}$/.test(source)) {
        errors.push(writePath + ".source is invalid");
      }
      if (source.indexOf("input.") === 0 && !popupInputs[source.substring(6)]) {
        errors.push(writePath + ".source must reference a declared popup input");
      }
      if (smType === "array") {
        var elementType = String(write.elementType || "").toLowerCase();
        if (!allowedScalarTypes[elementType]) errors.push(writePath + ".elementType is invalid");
        if (mode !== "append" && mode !== "replace" && mode !== "clear") {
          errors.push(writePath + ".writeMode is invalid for array");
        }
      } else {
        if (!allowedScalarTypes[smType]) errors.push(writePath + ".smType is invalid");
        if (mode !== "replace" && mode !== "clear") {
          errors.push(writePath + ".writeMode is invalid for scalar");
        }
      }
      if (write.maxItemLength !== undefined &&
          (!(Number(write.maxItemLength) > 0) || Number(write.maxItemLength) > 4000)) {
        errors.push(writePath + ".maxItemLength is invalid");
      }
      if (write.maxItems !== undefined &&
          (!(Number(write.maxItems) > 0) || Number(write.maxItems) > 100000)) {
        errors.push(writePath + ".maxItems is invalid");
      }
    }
  }
}

// Validate screen action và related selection backend.
function validateScreenActionConfig(config, errors) {
  var actions = config.screenActions || {};
  var uiActions = config.screen && config.screen.actions || [];
  var uiById = {};
  var permissions = config.actionPermissions || {};
  var i;
  for (i = 0; i < uiActions.length; i++) {
    if (uiActions[i] && safeId(uiActions[i].id)) uiById[uiActions[i].id] = uiActions[i];
  }
  var actionId;
  for (actionId in actions) {
    if (!own(actions, actionId)) continue;
    var action = actions[actionId] || {};
    var path = "config.screenActions." + actionId;
    validateAsyncExecution(action.execution, path, errors);
    if (!safeId(actionId) || !uiById[actionId]) {
      errors.push(path + " must reference a declared screen action");
      continue;
    }
    if (action.operation !== "custom" || !safeId(action.handlerId) ||
        String(action.handlerId).indexOf(".") === -1) {
      errors.push(path + " must declare a registered custom handlerId");
    }
    if (!own(permissions, "screen:" + actionId)) {
      errors.push("config.actionPermissions must declare screen:" + actionId);
    }
    var selector = uiById[actionId].selector;
    var related = action.relatedSelection;
    if (selector) {
      if (!related || !safeId(related.screenId) || related.screenId !== selector.screenId) {
        errors.push(path + ".relatedSelection.screenId must match UI selector");
      }
      if (related && related.maxItems !== undefined &&
          (!(Number(related.maxItems) > 0) || Number(related.maxItems) > 1000)) {
        errors.push(path + ".relatedSelection.maxItems must be between 1 and 1000");
      }
      if (related && related.verificationChunkSize !== undefined &&
          (!(Number(related.verificationChunkSize) > 0) ||
            Number(related.verificationChunkSize) > 100)) {
        errors.push(path + ".relatedSelection.verificationChunkSize must be between 1 and 100");
      }
      var valueFields = related && related.valueFields || [];
      if (!Array.isArray(valueFields) || valueFields.length > 20) {
        errors.push(path + ".relatedSelection.valueFields is invalid");
      } else {
        for (i = 0; i < valueFields.length; i++) {
          if (!safeId(valueFields[i])) {
            errors.push(path + ".relatedSelection.valueFields contains an invalid API field");
          }
        }
      }
    } else if (related !== undefined) {
      errors.push(path + ".relatedSelection requires UI selector metadata");
    }
  }
}

// Hook v1 chỉ mở hai điểm đọc danh sách; hook lạ bị từ chối để tránh chạy ngầm.
function validateHookConfig(config, errors) {
  if (config.hooks === undefined || config.hooks === null) return;
  if (typeof config.hooks !== "object" || Array.isArray(config.hooks)) {
    errors.push("config.hooks must be an object");
    return;
  }
  var allowed = { beforeList: true, afterList: true };
  var hookName;
  for (hookName in config.hooks) {
    if (!own(config.hooks, hookName)) continue;
    if (!allowed[hookName] || typeof config.hooks[hookName] !== "function") {
      errors.push("Unsupported or invalid hook: " + hookName);
    }
  }
}

function normalizeColumns(screen, availableFields, errors) {
  var source = screen.columns || [];
  var allowedRenderers = {
    text: true,
    lookup: true,
    status: true,
    datetime: true,
    recordLink: true,
    detailLink: true
  };
  var result = [];
  var seen = {};
  var i;
  for (i = 0; i < source.length; i++) {
    var column = source[i] || {};
    var field = column.field;
    var name = column.name || field;
    var renderer = column.renderer || "text";
    if (!safeId(field) || !availableFields[field]) {
      errors.push("screen.columns[" + i + "].field is not a public field");
      continue;
    }
    if (!safeId(name)) {
      errors.push("screen.columns[" + i + "].name is invalid");
      continue;
    }
    if (seen[field]) {
      errors.push("Duplicate screen column: " + field);
      continue;
    }
    if (!allowedRenderers[renderer]) {
      errors.push("Unsupported screen column renderer: " + renderer);
      continue;
    }
    seen[field] = true;
    var normalized = {
      field: field,
      name: name,
      title: safeText(column.title, field, 160),
      renderer: renderer,
      visible: column.visible !== false,
      hideable: column.hideable !== false
    };
    if (safeId(column.sourceField)) normalized.sourceField = column.sourceField;
    if (safeId(column.colorField)) normalized.colorField = column.colorField;
    if (safeId(column.backgroundField)) normalized.backgroundField = column.backgroundField;
    if (safeId(column.resource)) normalized.resource = column.resource;
    result.push(normalized);
  }
  if (!result.length) errors.push("screen.columns must contain at least one valid column");
  if (result.length > 100) errors.push("screen.columns exceeds 100 items");
  return result.slice(0, 100);
}

function normalizeFilters(screen, config, errors) {
  var source = screen.filters || [];
  var configuredFilters = config.filters || {};
  var configuredOptions = config.filterOptions || {};
  var result = [];
  var seen = {};
  var i;
  var j;
  for (i = 0; i < source.length; i++) {
    var filter = source[i] || {};
    if (!safeId(filter.id) || seen[filter.id]) {
      errors.push("screen.filters[" + i + "].id is invalid or duplicated");
      continue;
    }
    seen[filter.id] = true;
    if (filter.type === "multiSelect") {
      if (!safeId(filter.parameter) || !own(configuredFilters, filter.parameter)) {
        errors.push("screen filter parameter is not configured: " + filter.id);
        continue;
      }
      if (!safeId(filter.option) || !own(configuredOptions, filter.option)) {
        errors.push("screen filter option is not configured: " + filter.id);
        continue;
      }
      result.push({
        id: filter.id,
        type: "multiSelect",
        label: safeText(filter.label, filter.id, 160),
        parameter: filter.parameter,
        option: filter.option,
        placeholder: safeText(filter.placeholder, "Tất cả", 160),
        multiple: filter.multiple !== false,
        cacheTtl: positiveNumber(filter.cacheTtl, 300000, 3600000)
      });
    } else if (filter.type === "date") {
      if (!safeId(filter.parameter) || !own(configuredFilters, filter.parameter)) {
        errors.push("screen date filter parameter is not configured: " + filter.id);
        continue;
      }
      result.push({
        id: filter.id,
        type: "date",
        label: safeText(filter.label, filter.id, 160),
        parameter: filter.parameter
      });
    } else if (filter.type === "orgUnitCascade") {
      var levels = [];
      var sourceLevels = filter.levels || [];
      for (j = 0; j < sourceLevels.length; j++) {
        var level = sourceLevels[j] || {};
        if (!(level.level >= 1 && level.level <= 3) ||
            !safeId(level.key) || !safeId(level.parameter) ||
            !own(configuredFilters, level.parameter)) {
          errors.push("Invalid org-unit filter level: " + filter.id + "[" + j + "]");
          continue;
        }
        levels.push({
          level: Number(level.level),
          key: level.key,
          parameter: level.parameter,
          label: safeText(level.label, level.key, 160),
          placeholder: safeText(level.placeholder, "Tất cả", 160),
          multiple: level.multiple !== false
        });
      }
      if (!levels.length) errors.push("Org-unit filter has no valid levels: " + filter.id);
      else result.push({ id: filter.id, type: "orgUnitCascade", levels: levels });
    } else {
      errors.push("Unsupported screen filter type: " + filter.type);
    }
  }
  if (result.length > 20) errors.push("screen.filters exceeds 20 items");
  return result.slice(0, 20);
}

function normalizeExecution(action, defaultScope, path, errors) {
  var execution = action && action.execution || {};
  var allowedScopes = { none: true, dialog: true, screen: true, framework: true };
  if (execution.maskScope !== undefined && !allowedScopes[execution.maskScope]) {
    errors.push(path + ".execution.maskScope must be none, dialog, screen or framework");
  }
  var scope = allowedScopes[execution.maskScope] ? execution.maskScope : defaultScope;
  return {
    maskScope: scope,
    maskMessage: safeText(execution.maskMessage, "Đang xử lý...", 200),
    preventClose: execution.preventClose === true,
    preventDuplicate: execution.preventDuplicate !== false
  };
}

function validateAsyncExecution(execution, path, errors) {
  if (execution === undefined) return;
  if (!execution || typeof execution !== "object" || Array.isArray(execution)) {
    errors.push(path + ".execution must be an object");
    return;
  }
  if (execution.asyncEnabled !== undefined && execution.asyncEnabled !== true &&
      execution.asyncEnabled !== false) {
    errors.push(path + ".execution.asyncEnabled must be boolean");
  }
  var threshold = Number(execution.asyncThreshold);
  var maximum = Number(execution.maxAsyncItems);
  if (execution.asyncThreshold !== undefined && (!(threshold > 0) || threshold > 1000)) {
    errors.push(path + ".execution.asyncThreshold must be between 1 and 1000");
  }
  if (execution.maxAsyncItems !== undefined && (!(maximum > 0) || maximum > 50000)) {
    errors.push(path + ".execution.maxAsyncItems must be between 1 and 50000");
  }
  if (execution.asyncEnabled === true && maximum && threshold && maximum < threshold) {
    errors.push(path + ".execution.maxAsyncItems must be >= asyncThreshold");
  }
  if (execution.asyncEnabled === true &&
      (!safeId(execution.executorId) || String(execution.executorId).indexOf(".") === -1)) {
    errors.push(path + ".execution.executorId is required when asyncEnabled=true");
  }
}

function publicAsyncExecution(backendAction) {
  var execution = backendAction && backendAction.execution || {};
  return {
    asyncEnabled: execution.asyncEnabled === true,
    asyncThreshold: positiveNumber(execution.asyncThreshold, 100, 1000),
    maxAsyncItems: positiveNumber(execution.maxAsyncItems, 10000, 50000)
  };
}

function mergeExecution(uiExecution, backendAction) {
  var asyncExecution = publicAsyncExecution(backendAction);
  uiExecution.asyncEnabled = asyncExecution.asyncEnabled;
  uiExecution.asyncThreshold = asyncExecution.asyncThreshold;
  uiExecution.maxAsyncItems = asyncExecution.maxAsyncItems;
  return uiExecution;
}

function popupDimension(value, fallback, minimum, maximum) {
  if (value === undefined || value === null || value === "") return fallback;
  var parsed = Math.floor(Number(value));
  if (!(parsed >= minimum && parsed <= maximum)) return fallback;
  return parsed;
}

function normalizePopupOptions(source, path, errors) {
  if (!Array.isArray(source) || !source.length || source.length > 200) {
    errors.push(path + " must contain between 1 and 200 items");
    return [];
  }
  var result = [];
  var seen = {};
  for (var i = 0; i < source.length; i++) {
    var item = source[i];
    var value = item && typeof item === "object" ? item.value : item;
    var label = item && typeof item === "object" ? item.label : item;
    if (value === undefined || value === null ||
        (typeof value !== "string" && typeof value !== "number" && typeof value !== "boolean")) {
      errors.push(path + "[" + i + "].value must be scalar");
      continue;
    }
    var key = "$" + String(value);
    if (seen[key]) continue;
    seen[key] = true;
    result.push({ value: value, label: safeText(label, String(value), 200) });
  }
  return result;
}

function popupPattern(value, path, errors) {
  if (value === undefined || value === null || value === "") return "";
  var pattern = String(value);
  if (pattern.length > 256 || /(\([^)]*[+*][^)]*\))[+*{]/.test(pattern)) {
    errors.push(path + " is too complex");
    return "";
  }
  try {
    new RegExp(pattern);
  } catch (patternError) {
    errors.push(path + " is invalid");
    return "";
  }
  return pattern;
}

function normalizePopupCondition(source, fieldNames, path, errors) {
  if (source === undefined || source === null) return null;
  if (!source || typeof source !== "object" || Array.isArray(source)) {
    errors.push(path + " must be an object");
    return null;
  }
  var operators = { eq: true, neq: true, "in": true, notIn: true, empty: true, notEmpty: true };
  if (!safeId(source.field) || !fieldNames[source.field]) {
    errors.push(path + ".field must reference a popup field");
    return null;
  }
  if (!operators[source.operator]) {
    errors.push(path + ".operator is invalid");
    return null;
  }
  var result = { field: source.field, operator: source.operator };
  if (source.operator === "in" || source.operator === "notIn") {
    if (!Array.isArray(source.values) || !source.values.length || source.values.length > 50) {
      errors.push(path + ".values must contain between 1 and 50 items");
      return null;
    }
    result.values = source.values.map(function (value, index) {
      return conditionValue(value, path + ".values[" + index + "]", errors);
    });
  } else if (source.operator !== "empty" && source.operator !== "notEmpty") {
    result.value = conditionValue(source.value, path + ".value", errors);
  }
  return result;
}

// Chuẩn hóa Dynamic Form popup và loại bỏ metadata không an toàn cho client.
function normalizePopup(action, config, path, errors, requireReason) {
  if (!action.popup) {
    if (requireReason) errors.push(path + ".popup must declare a reason field");
    return null;
  }
  var popup = action.popup;
  if (!popup || typeof popup !== "object" || Array.isArray(popup)) {
    errors.push(path + ".popup must be an object");
    return null;
  }
  if (popup.dirtyGuard !== undefined && typeof popup.dirtyGuard !== "boolean") {
    errors.push(path + ".popup.dirtyGuard must be boolean");
  }
  var sourceFields = popup.fields || [];
  if (!Array.isArray(sourceFields) || !sourceFields.length || sourceFields.length > 30) {
    errors.push(path + ".popup.fields must contain between 1 and 30 items");
    return null;
  }
  var allowedTypes = {
    text: true, textarea: true, number: true, integer: true,
    money: true, select: true, checkbox: true, date: true, datetime: true, lookup: true
  };
  var configuredOptions = config.filterOptions || {};
  var availableFields = publicFields(config);
  var prefillSource = popup.prefill && popup.prefill.source
    ? String(popup.prefill.source) : "none";
  if (prefillSource !== "none" && prefillSource !== "selectedRow" &&
      prefillSource !== "detail") {
    errors.push(path + ".popup.prefill.source must be none, selectedRow or detail");
    prefillSource = "none";
  }
  var layoutSource = popup.layout && typeof popup.layout === "object" &&
    !Array.isArray(popup.layout) ? popup.layout : {};
  var layoutColumns = positiveNumber(layoutSource.columns, 1, 4);
  var fields = [];
  var fieldNames = {};
  for (var declaredIndex = 0; declaredIndex < sourceFields.length; declaredIndex++) {
    if (sourceFields[declaredIndex] && safeId(sourceFields[declaredIndex].name)) {
      fieldNames[sourceFields[declaredIndex].name] = true;
    }
  }
  var normalizedNames = {};
  var hasReason = false;
  var i;
  for (i = 0; i < sourceFields.length; i++) {
    var field = sourceFields[i] || {};
    var fieldPath = path + ".popup.fields[" + i + "]";
    if (!safeId(field.name) || normalizedNames[field.name]) {
      errors.push(fieldPath + ".name is invalid or duplicated");
      continue;
    }
    var type = allowedTypes[field.type] ? field.type : "";
    if (!type) {
      errors.push(fieldPath + ".type is invalid");
      continue;
    }
    var bind = field.bind === "reason" ? "reason" : "input";
    if (field.bind && field.bind !== "reason" && field.bind !== "input") {
      errors.push(fieldPath + ".bind must be input or reason");
    }
    if (bind === "reason") {
      if (hasReason) errors.push(path + ".popup may contain only one reason field");
      hasReason = true;
    }
    normalizedNames[field.name] = true;
    var normalized = {
      name: field.name,
      bind: bind,
      type: type,
      label: safeText(field.label, field.name, 160),
      placeholder: safeText(field.placeholder, "", 300),
      helpText: safeText(field.helpText, "", 300),
      required: field.required === true || (bind === "reason" && requireReason),
      multiple: (type === "select" || type === "lookup") && field.multiple === true,
      minLength: nonNegativeNumber(field.minLength, 0, 4000),
      maxLength: positiveNumber(field.maxLength, type === "textarea" ? 1000 : 255, 4000),
      rows: positiveNumber(field.rows, 4, 20),
      colSpan: positiveNumber(field.colSpan, 1, layoutColumns)
    };
    normalized.visibleIf = normalizePopupCondition(
      field.visibleIf, fieldNames, fieldPath + ".visibleIf", errors
    );
    normalized.enableIf = normalizePopupCondition(
      field.enableIf, fieldNames, fieldPath + ".enableIf", errors
    );
    normalized.requiredIf = normalizePopupCondition(
      field.requiredIf, fieldNames, fieldPath + ".requiredIf", errors
    );
    normalized.clearWhenHidden = field.clearWhenHidden !== false;
    if (field.pattern !== undefined) {
      normalized.pattern = popupPattern(field.pattern, fieldPath + ".pattern", errors);
      normalized.patternMessage = safeText(
        field.patternMessage, normalized.label + " không đúng định dạng", 300
      );
    }
    /* valueFrom is an API field, never a DBDict field. */
    if (field.valueFrom !== undefined) {
      if (!safeId(field.valueFrom) || !availableFields[field.valueFrom]) {
        errors.push(fieldPath + ".valueFrom must reference a configured API field");
      } else {
        normalized.valueFrom = field.valueFrom;
      }
    }
    if (normalized.maxLength < normalized.minLength) {
      errors.push(fieldPath + ".maxLength must be greater than or equal to minLength");
    }
    if (type === "textarea") {
      normalized.minHeight = popupDimension(field.minHeight, 100, 60, 600);
      normalized.maxHeight = popupDimension(field.maxHeight, 240, 60, 800);
      normalized.resize = field.resize === "none" ? "none" : "vertical";
      normalized.showCounter = field.showCounter === true;
      if (normalized.maxHeight < normalized.minHeight) {
        errors.push(fieldPath + ".maxHeight must be greater than or equal to minHeight");
      }
    }
    if (type === "number" || type === "integer" || type === "money") {
      if (field.min !== undefined && isFinite(Number(field.min))) normalized.min = Number(field.min);
      if (field.max !== undefined && isFinite(Number(field.max))) normalized.max = Number(field.max);
      if (normalized.min !== undefined && normalized.max !== undefined && normalized.max < normalized.min) {
        errors.push(fieldPath + ".max must be greater than or equal to min");
      }
      normalized.step = type === "integer" ? 1 : (Number(field.step) > 0 ? Number(field.step) : "any");
      if (type === "money") {
        normalized.precision = nonNegativeNumber(field.precision, 0, 6);
        normalized.currency = safeText(field.currency, "VND", 12);
        normalized.thousandSeparator = field.thousandSeparator === "." ? "." : ",";
        normalized.decimalSeparator = normalized.thousandSeparator === "." ? "," : ".";
      }
    }
    if (field.defaultValue !== undefined) {
      if (Array.isArray(field.defaultValue) && normalized.multiple) {
        normalized.defaultValue = field.defaultValue.slice(0, 100).map(function (value) {
          return conditionValue(value, fieldPath + ".defaultValue", errors);
        });
      } else {
        normalized.defaultValue = conditionValue(field.defaultValue, fieldPath + ".defaultValue", errors);
      }
    }
    if (type === "select" || type === "lookup") {
      if (field.lookupMode !== undefined && field.lookupMode !== "local" &&
          field.lookupMode !== "remote") {
        errors.push(fieldPath + ".lookupMode must be local or remote");
      }
      if (Array.isArray(field.options) && field.options.length) {
        normalized.options = normalizePopupOptions(field.options, fieldPath + ".options", errors);
      } else if (safeId(field.option) && own(configuredOptions, field.option)) {
        normalized.option = field.option;
        normalized.cacheTtl = positiveNumber(field.cacheTtl, 300000, 3600000);
      } else {
        errors.push(fieldPath + " must declare safe static options or a registered option");
      }
      if (field.dependsOn !== undefined) {
        if (!normalized.option) {
          errors.push(fieldPath + ".dependsOn requires a registered backend option");
        } else if (!safeId(field.dependsOn) || field.dependsOn === field.name) {
          errors.push(fieldPath + ".dependsOn is invalid");
        } else if (!fieldNames[field.dependsOn]) {
          errors.push(fieldPath + ".dependsOn must reference an earlier popup field");
        } else {
          normalized.dependsOn = field.dependsOn;
          normalized.parentParameter = safeId(field.parentParameter)
            ? field.parentParameter : "parentId";
        }
      }
      if (type === "lookup" && field.lookupMode === "remote") {
        if (normalized.multiple) errors.push(fieldPath + ".remote lookup does not support multiple");
        normalized.lookupMode = "remote";
        normalized.minSearchLength = positiveNumber(field.minSearchLength, 2, 10);
        normalized.debounce = positiveNumber(field.debounce, 300, 2000);
        normalized.pageSize = positiveNumber(field.pageSize, 20, 100);
      }
    }
    fields.push(normalized);
  }
  if (requireReason && !hasReason) errors.push(path + ".popup must contain bind: reason");
  var validators = [];
  var validatorSource = popup.validators || [];
  if (!Array.isArray(validatorSource) || validatorSource.length > 20) {
    errors.push(path + ".popup.validators must be an array with at most 20 items");
    validatorSource = [];
  }
  var compareOperators = { eq: true, neq: true, gt: true, gte: true, lt: true, lte: true };
  for (var validatorIndex = 0; validatorIndex < validatorSource.length; validatorIndex++) {
    var validator = validatorSource[validatorIndex] || {};
    var validatorPath = path + ".popup.validators[" + validatorIndex + "]";
    if (validator.type !== "compare" || !fieldNames[validator.left] ||
        !fieldNames[validator.right] || !compareOperators[validator.operator]) {
      errors.push(validatorPath + " is invalid");
      continue;
    }
    validators.push({
      type: "compare", left: validator.left, right: validator.right,
      operator: validator.operator,
      message: safeText(validator.message, "Dữ liệu giữa các trường không hợp lệ", 300)
    });
  }
  return {
    title: safeText(popup.title, action.label || "Nhập thông tin", 200),
    submitLabel: safeText(popup.submitLabel, "Xác nhận", 80),
    cancelLabel: safeText(popup.cancelLabel, "Hủy", 80),
    width: popupDimension(popup.width, 560, 320, 1200),
    height: popupDimension(popup.height, 0, 0, 1000),
    minWidth: popupDimension(popup.minWidth, 320, 280, 1200),
    maxWidth: popupDimension(popup.maxWidth, 900, 320, 1600),
    minHeight: popupDimension(popup.minHeight, 0, 0, 1000),
    maxHeight: popupDimension(popup.maxHeight, 760, 240, 1200),
    layout: {
      columns: layoutColumns,
      columnGap: nonNegativeNumber(layoutSource.columnGap, 14, 40),
      rowGap: nonNegativeNumber(layoutSource.rowGap, 14, 40)
    },
    prefill: {
      source: prefillSource,
      requireSingle: prefillSource !== "none" &&
        !(popup.prefill && popup.prefill.requireSingle === false)
    },
    dirtyGuard: popup.dirtyGuard !== false,
    validators: validators,
    fields: fields
  };
}

// Chuẩn hóa màn hình list được nhúng trong popup selector.
function normalizeSelector(action, path, errors) {
  if (!action.selector) return null;
  var selector = action.selector;
  if (!selector || typeof selector !== "object" || Array.isArray(selector)) {
    errors.push(path + ".selector must be an object");
    return null;
  }
  if (!safeId(selector.screenId)) {
    errors.push(path + ".selector.screenId is invalid");
  }
  if (selector.mode !== undefined && selector.mode !== "single" &&
      selector.mode !== "multiple") {
    errors.push(path + ".selector.mode must be single or multiple");
  }
  var mode = selector.mode === "single" ? "single" : "multiple";
  if (selector.maxItems !== undefined &&
      (!(Number(selector.maxItems) > 0) || Number(selector.maxItems) > 1000)) {
    errors.push(path + ".selector.maxItems must be between 1 and 1000");
  }
  return {
    screenId: safeId(selector.screenId) ? selector.screenId : "",
    mode: mode,
    maxItems: mode === "single" ? 1 : positiveNumber(selector.maxItems, 100, 1000),
    title: safeText(selector.title, "Chọn dữ liệu", 200),
    submitLabel: safeText(selector.submitLabel, "Xác nhận", 80),
    cancelLabel: safeText(selector.cancelLabel, "Hủy", 80),
    width: popupDimension(selector.width, 1100, 480, 1600),
    maxHeight: popupDimension(selector.maxHeight, 820, 320, 1200)
  };
}

// Chuẩn hóa action cấp màn hình và áp dụng allowlist permission.
// Normalize reusable XLSX import metadata and expose only allowlisted API fields.
function normalizeImportDefinition(source, availableFields, path, errors) {
  if (!source || typeof source !== "object" || Array.isArray(source)) {
    errors.push(path + ".import must be an object");
    return null;
  }
  var columns = [];
  var seen = {};
  var input = source.columns || [];
  for (var i = 0; i < input.length && i < 50; i++) {
    var column = input[i] || {};
    if (!safeId(column.field) || !availableFields[column.field] || seen[column.field]) {
      errors.push(path + ".import.columns[" + i + "].field is invalid");
      continue;
    }
    var type = column.type === "number" || column.type === "date" ||
      column.type === "boolean" ? column.type : "string";
    seen[column.field] = true;
    columns.push({
      field: column.field,
      header: safeText(column.header, column.field, 160),
      type: type,
      required: column.required === true,
      unique: column.unique === true,
      maxLength: positiveNumber(column.maxLength, type === "string" ? 500 : 0, 4000),
      min: typeof column.min === "number" ? column.min : null,
      example: safeText(column.example, "", 500)
    });
  }
  if (!columns.length) errors.push(path + ".import.columns is required");
  return {
    accept: ".xlsx",
    title: safeText(source.title, "Nhập dữ liệu Excel", 200),
    maxHeight: popupDimension(source.maxHeight, 760, 320, 1200),
    templateName: safeText(source.templateName, "import-template.xlsx", 120),
    sheetName: safeText(source.sheetName, "Data", 31),
    maxRows: positiveNumber(source.maxRows, 500, 1000),
    maxFileSize: positiveNumber(source.maxFileSize, 10485760, 10485760),
    chunkSize: positiveNumber(source.chunkSize, 50, 100),
    invalidRowPolicy: source.invalidRowPolicy === "rejectAll" ? "rejectAll" : "skip",
    precheck: source.precheck !== false,
    resultFile: source.resultFile !== false,
    columns: columns
  };
}

function normalizeActions(screen, config, availableFields, errors) {
  var source = screen.actions || [];
  var backend = config.screenActions || {};
  var allowedTypes = { export: true, refresh: true, create: true, custom: true, import: true };
  var result = [];
  var seen = {};
  var i;
  for (i = 0; i < source.length; i++) {
    var action = source[i] || {};
    if (!safeId(action.id) || seen[action.id] || !allowedTypes[action.type]) {
      errors.push("Invalid or duplicated screen action at index " + i);
      continue;
    }
    if (action.type === "export" &&
        (action.confirm === true || action.visibleIf || action.enableIf || action.popup || action.selector)) {
      errors.push("Export action does not support confirm, popup, selector, visibleIf or enableIf");
      continue;
    }
    if (action.type === "create") {
      if (!action.popup) errors.push("Create action must declare popup metadata");
      if (!own(config.actionPermissions || {}, "create")) {
        errors.push("config.actionPermissions must declare create for create actions");
      }
    }
    if (action.type === "import" && !own(backend, action.id)) {
      errors.push("Import action must declare a backend screen action: " + action.id);
    }
    seen[action.id] = true;
    result.push({
      id: action.id,
      type: action.type,
      label: safeText(action.label, action.id, 160),
      enabled: action.enabled !== false,
      order: positiveNumber(action.order, (i + 1) * 10, 10000),
      filename: safeText(action.filename, "export", 120),
      confirm: action.confirm === true,
      confirmMessage: safeText(action.confirmMessage, "", 300),
      execution: mergeExecution(
        normalizeExecution(action, "none", "screen.actions[" + i + "]", errors),
        backend[action.id]
      ),
      popup: normalizePopup(action, config, "screen.actions[" + i + "]", errors, false),
      selector: normalizeSelector(action, "screen.actions[" + i + "]", errors),
      import: action.type === "import"
        ? normalizeImportDefinition(action.import, availableFields,
          "screen.actions[" + i + "]", errors)
        : null,
      serverAction: own(backend, action.id),
      visibleIf: normalizeCondition(action.visibleIf, availableFields,
        "screen.actions[" + i + "].visibleIf", errors),
      enableIf: normalizeCondition(action.enableIf, availableFields,
        "screen.actions[" + i + "].enableIf", errors)
    });
  }
  if (result.length > 50) errors.push("screen.actions exceeds 50 items");
  return result.slice(0, 50);
}

// Chuẩn hóa toolbar action phụ thuộc selection.
function normalizeBulkActions(screen, config, availableFields, errors) {
  var source = screen.bulkActions || [];
  var backend = config.batchActions || {};
  var result = [];
  var seen = {};
  var allowedStyles = { primary: true, danger: true, secondary: true };
  var i;
  for (i = 0; i < source.length; i++) {
    var action = source[i] || {};
    if (!safeId(action.id) || seen[action.id]) {
      errors.push("Invalid or duplicated bulk action at index " + i);
      continue;
    }
    if (!own(backend, action.id)) {
      errors.push("Bulk action has no backend definition: " + action.id);
      continue;
    }
    seen[action.id] = true;
    var backendAction = backend[action.id] || {};
    result.push({
      id: action.id,
      label: safeText(action.label, action.id, 160),
      enabled: action.enabled !== false && backendAction.enabled !== false,
      order: positiveNumber(action.order, (i + 1) * 10, 10000),
      confirm: action.confirm === true,
      confirmMessage: safeText(action.confirmMessage, "", 300),
      requireReason: backendAction.requireReason === true,
      reasonPlaceholder: safeText(action.reasonPlaceholder, "Nhập lý do", 300),
      reasonMaxLength: positiveNumber(backendAction.reasonMaxLength, 1000, 4000),
      style: allowedStyles[action.style] ? action.style : "secondary",
      execution: mergeExecution(
        normalizeExecution(action, "screen", "screen.bulkActions[" + i + "]", errors),
        backendAction
      ),
      popup: normalizePopup(
        action, config, "screen.bulkActions[" + i + "]", errors,
        backendAction.requireReason === true
      ),
      selector: normalizeSelector(action, "screen.bulkActions[" + i + "]", errors),
      visibleIf: normalizeCondition(action.visibleIf, availableFields,
        "screen.bulkActions[" + i + "].visibleIf", errors),
      enableIf: normalizeCondition(action.enableIf, availableFields,
        "screen.bulkActions[" + i + "].enableIf", errors)
    });
  }
  if (result.length > 20) errors.push("screen.bulkActions exceeds 20 items");
  return result.slice(0, 20);
}

// Entry point: validate toàn bộ và trả screenPublic an toàn cho trình duyệt.
// Chỉ công khai cấu hình dashboard ở dạng dữ liệu; client không nhận callback tùy ý.
function normalizeDashboard(screen, errors) {
  var source = screen.dashboard;
  if (!source) return null;
  if (!safeId(source.serviceName) || !safeId(source.functionName)) {
    errors.push("screen.dashboard endpoint is invalid");
    return null;
  }
  function items(values, max) {
    var result = [];
    values = values || [];
    for (var i = 0; i < values.length && i < max; i++) {
      if (!values[i] || !safeId(values[i].field)) continue;
      result.push({ field: values[i].field, label: safeText(values[i].label, values[i].field, 160) });
    }
    return result;
  }
  return {
    serviceName: source.serviceName,
    functionName: source.functionName,
    topItems: positiveNumber(source.topItems, 10, 20),
    cards: items(source.cards, 8),
    charts: items(source.charts, 6)
  };
}

// Metadata popup chi tiết chỉ tham chiếu các API field đã được allowlist.
function normalizeDetail(screen, availableFields, errors) {
  var source = screen.detail;
  if (!source) return null;
  if (!safeId(source.keyField) || !availableFields[source.keyField] ||
      !safeId(source.bodyField) || !availableFields[source.bodyField]) {
    errors.push("screen.detail field configuration is invalid");
    return null;
  }
  return {
    title: safeText(source.title, "Chi tiết", 160),
    keyField: source.keyField,
    bodyField: source.bodyField,
    bodyFormatField: safeId(source.bodyFormatField) && availableFields[source.bodyFormatField]
      ? source.bodyFormatField : ""
  };
}

function validateConfig(screenId, config) {
  var errors = [];
  if (!safeId(screenId)) return definitionError(["screenId is invalid"]);
  if (!config || typeof config !== "object") return definitionError(["config is required"]);
  if (String(config.schemaVersion) !== "1") {
    errors.push("config.schemaVersion must be 1");
  }
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]{0,39}$/.test(String(config.definitionVersion || ""))) {
    errors.push("config.definitionVersion is invalid");
  }
  var screen = config.screen;
  if (!screen || typeof screen !== "object") return definitionError(["config.screen is required"]);
  if (screen.id !== screenId) errors.push("config.screen.id must match registry screenId");
  if (String(screen.version) !== "1") errors.push("config.screen.version must be 1");
  if (screen.kind !== "list") errors.push("Only list screen kind is currently supported");
  if (!config.table || !config.keyField || !(config.fields || []).length) {
    errors.push("Catalog data configuration is incomplete");
  }

  validateDataConfig(config, errors);
  validateBatchActionConfig(config, errors);
  validateScreenActionConfig(config, errors);
  validateHookConfig(config, errors);

  var availableFields = publicFields(config);
  var requestedSelectionMode = screen.selection && screen.selection.mode;
  if (requestedSelectionMode && requestedSelectionMode !== "none" &&
      requestedSelectionMode !== "single" && requestedSelectionMode !== "multiple") {
    errors.push("screen.selection.mode must be none, single or multiple");
  }
  var selectionMode = requestedSelectionMode === "multiple" || requestedSelectionMode === "single"
    ? requestedSelectionMode : "none";
  /* `none` is a real feature-off mode: keep dormant bulk-action metadata in
   * the backend definition, but do not validate or expose it to the browser.
   * This lets a screen switch selection on/off with one metadata value. */
  var bulkActions = selectionMode === "none"
    ? [] : normalizeBulkActions(screen, config, availableFields, errors);
  if (selectionMode !== "none" && !safeId(config.versionField)) {
    errors.push("config.versionField is required for selectable screens");
  }
  if (selectionMode !== "none" && !availableFields[config.versionField]) {
    errors.push("config.versionField must be a public field");
  }

  var publicUi = {
    id: screenId,
    version: "1",
    definitionVersion: String(config.definitionVersion),
    kind: "list",
    title: safeText(screen.title, screenId, 200),
    state: {
      key: safeText(screen.state && screen.state.key, screenId, 120),
      version: safeText(screen.state && screen.state.version, "1", 40)
    },
    columns: normalizeColumns(screen, availableFields, errors),
    filters: normalizeFilters(screen, config, errors),
    dashboard: normalizeDashboard(screen, errors),
    detail: normalizeDetail(screen, availableFields, errors),
    selection: {
      mode: selectionMode,
      maxItems: selectionMode === "single" ? 1 :
        positiveNumber(screen.selection && screen.selection.maxItems, 100, 1000),
      retainAcrossPages: selectionMode !== "none" &&
        !(screen.selection && screen.selection.retainAcrossPages === false),
      clearOnQueryChange: selectionMode !== "none" &&
        !(screen.selection && screen.selection.clearOnQueryChange === false),
      debug: !!(screen.selection && screen.selection.debug === true),
      keyField: config.keyField,
      /* Keep the version field in safe public metadata even when the normal
       * list is not selectable; the same list may be mounted as a selector. */
      versionField: safeId(config.versionField) ? config.versionField : ""
    },
    actions: normalizeActions(screen, config, availableFields, errors),
    bulkActions: bulkActions
  };

  if (errors.length) return definitionError(errors);
  config.screenPublic = publicUi;
  return { success: true, config: config, publicUi: publicUi };
}
