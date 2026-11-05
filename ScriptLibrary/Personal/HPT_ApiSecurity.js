/**
 * ScriptLibrary name: HPT_ApiSecurity
 * Server-side authorization and row-scope query builder for Common API.
 */

function securityUtils() {
  var utils = lib.HPT_CommonApiUtils;
  if (!utils) throw new Error("HPT_CommonApiUtils is not available");
  return utils;
}

function securityError(code, message, context) {
  return {
    error: securityUtils().serviceError(code, message, context)
  };
}

function isSafeIdentifier(value) {
  return typeof value === "string" && value.length > 0 && value.length <= 128 &&
    /^[A-Za-z0-9_.-]+$/.test(value);
}

function currentContact() {
  try {
    return securityUtils().cleanString(vars["$lo.contact.name"]);
  } catch (error) {
    return "";
  }
}

function toArray(value) {
  if (value === undefined || value === null) return [];
  if (Array.isArray(value)) return value;
  if (typeof value.toArray === "function") return value.toArray();
  return [value];
}

function uniqueCleanValues(values, maxValues) {
  var utils = securityUtils();
  var result = [];
  var seen = {};
  var source = toArray(values);
  var i;
  var value;
  for (i = 0; i < source.length; i++) {
    value = utils.cleanString(source[i]);
    if (!value || Object.prototype.hasOwnProperty.call(seen, "$" + value)) continue;
    if (result.length >= maxValues) {
      return { error: true, values: [] };
    }
    seen["$" + value] = true;
    result.push(value);
  }
  return { error: false, values: result };
}

function ownerQuery(permission, contact) {
  var field = permission.ownerField || "created.by";
  if (!isSafeIdentifier(field)) return null;
  return securityUtils().buildEqualFilter(field, contact);
}

function unitQuery(permission, units) {
  var utils = securityUtils();
  var fields = permission.unitFields;
  var conditions = [];
  var i;
  var j;
  var perUnit;

  if (!Array.isArray(fields) || !fields.length) return null;
  for (i = 0; i < fields.length; i++) {
    if (!isSafeIdentifier(fields[i])) return null;
  }

  for (i = 0; i < units.length; i++) {
    perUnit = [];
    for (j = 0; j < fields.length; j++) {
      perUnit.push(utils.buildEqualFilter(fields[j], units[i]));
    }
    conditions.push("(" + perUnit.join(" or ") + ")");
  }
  return conditions.length ? conditions.join(" or ") : "";
}

/**
 * Resolve data scope from the authenticated SM operator.
 * Returns { query, applied, scope, unitCount } or { error }.
 */
function resolveDataPermission(permission, context) {
  if (!permission || permission.enabled !== true) {
    return { query: "true", applied: false, scope: "", unitCount: 0 };
  }

  var utils = securityUtils();
  var contact = currentContact();
  var subModule = utils.cleanString(permission.subModule);
  var maxUnits = Number(permission.maxUnits) || 500;
  var provider;
  var permissionResult;
  var scope;
  var normalizedUnits;
  var queryParts = [];
  var owner;
  var units;

  if (!contact) {
    return securityError("FORBIDDEN", "Không xác định được người dùng hiện tại", context);
  }
  if (!isSafeIdentifier(subModule)) {
    utils.log("ERROR", context, "permission-config", "Invalid permission sub-module", {});
    return securityError("INVALID_SECURITY_CONFIG", "Cấu hình phân quyền không hợp lệ", context);
  }
  if (!(maxUnits > 0 && maxUnits <= 5000)) {
    utils.log("ERROR", context, "permission-config", "Invalid permission unit limit", {});
    return securityError("INVALID_SECURITY_CONFIG", "Cấu hình phân quyền không hợp lệ", context);
  }

  try {
    provider = lib.ESD_PERMS_RIGHTS;
    if (!provider || typeof provider.getUnitByDataPermissions !== "function") {
      throw new Error("ESD_PERMS_RIGHTS is not available");
    }
    permissionResult = provider.getUnitByDataPermissions(contact, subModule);
  } catch (error) {
    utils.log("ERROR", context, "permission-resolve", "Cannot resolve data permission", {
      detail: error.toString(),
      subModule: subModule
    });
    return securityError("FORBIDDEN", "Không thể xác định phạm vi dữ liệu", context);
  }

  scope = utils.cleanString(permissionResult && permissionResult.scope);
  if (!scope) {
    utils.log("WARN", context, "permission-denied", "No data permission configured", {
      subModule: subModule
    });
    return securityError("FORBIDDEN", "Người dùng chưa được phân quyền dữ liệu", context);
  }

  if (scope === "QT_PQDL_06") {
    return { query: "true", applied: true, scope: scope, unitCount: 0 };
  }

  owner = ownerQuery(permission, contact);
  if (scope === "QT_PQDL_01") {
    if (!owner) {
      return securityError(
        "INVALID_SECURITY_CONFIG",
        "Cấu hình phân quyền không hợp lệ",
        context
      );
    }
    return { query: owner, applied: true, scope: scope, unitCount: 0 };
  }

  normalizedUnits = uniqueCleanValues(permissionResult && permissionResult.unit, maxUnits);
  if (normalizedUnits.error) {
    utils.log("ERROR", context, "permission-resolve", "Permission unit limit exceeded", {
      subModule: subModule,
      maxUnits: maxUnits
    });
    return securityError("FORBIDDEN", "Phạm vi dữ liệu vượt quá giới hạn cho phép", context);
  }

  units = unitQuery(permission, normalizedUnits.values);
  if (units === null) {
    return securityError(
      "INVALID_SECURITY_CONFIG",
      "Cấu hình phân quyền không hợp lệ",
      context
    );
  }
  if (units) queryParts.push("(" + units + ")");
  if (permission.includeOwner !== false && owner) queryParts.push("(" + owner + ")");

  if (!queryParts.length) {
    utils.log("WARN", context, "permission-denied", "Resolved data scope is empty", {
      subModule: subModule,
      scope: scope
    });
    return securityError("FORBIDDEN", "Người dùng không có phạm vi dữ liệu", context);
  }

  return {
    query: queryParts.join(" or "),
    applied: true,
    scope: scope,
    unitCount: normalizedUnits.values.length
  };
}

function combineQuery(query, permissionResult) {
  var baseQuery = query || "true";
  var permissionQuery = permissionResult && permissionResult.query
    ? permissionResult.query
    : "false";
  return "(" + baseQuery + ") and (" + permissionQuery + ")";
}

function denyAction(action, context, reason) {
  var utils = securityUtils();
  utils.log("WARN", context, "action-denied", "API action was denied", {
    action: action,
    contact: currentContact(),
    reason: reason || "not-allowed"
  });
  return {
    error: utils.serviceError(
      "FORBIDDEN",
      "Người dùng không có quyền thực hiện thao tác này",
      context
    )
  };
}

/**
 * Authorize an engine operation from backend-only metadata.
 * Missing declarations are denied. A custom checker must be a server-side
 * function stored in the screen configuration; the client cannot name it.
 */
function authorizeAction(actionPermissions, action, request, context) {
  var rules = actionPermissions || {};
  var contact = currentContact();
  var rule = Object.prototype.hasOwnProperty.call(rules, action)
    ? rules[action]
    : null;
  var checker;
  var checkerResult;

  if (!contact) {
    return denyAction(action, context, "unauthenticated");
  }
  if (rule === true || (rule && rule.allow === true && typeof rule.checker !== "function")) {
    return { allowed: true, action: action };
  }
  if (rule === false || rule === null || rule === undefined || rule.allow === false) {
    return denyAction(action, context, "not-declared");
  }

  checker = typeof rule === "function" ? rule : rule.checker;
  if (typeof checker !== "function") {
    return denyAction(action, context, "invalid-rule");
  }

  try {
    checkerResult = checker({
      action: action,
      contact: contact,
      request: request,
      context: context
    });
  } catch (error) {
    securityUtils().log("ERROR", context, "action-check", "Action checker failed", {
      action: action,
      detail: error.toString()
    });
    return denyAction(action, context, "checker-error");
  }

  if (checkerResult === true || (checkerResult && checkerResult.allowed === true)) {
    return { allowed: true, action: action };
  }
  return denyAction(action, context, "checker-denied");
}
