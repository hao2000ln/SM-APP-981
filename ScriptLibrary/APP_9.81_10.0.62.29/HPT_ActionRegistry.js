/**
 * ScriptLibrary name: HPT_ActionRegistry
 * Backend-only router and allowlist for domain-owned action registries.
 * Phân vùng registry theo namespace để không tạo một file action khổng lồ.
 */

// Khai báo namespace và ScriptLibrary registry tương ứng của từng domain.
function domainRegistries() {
  return {
    contracts: {
      enabled: true,
      library: "HPT_ContractActionRegistry"
    }
  };
}

function validHandlerId(handlerId) {
  return typeof handlerId === "string" &&
    /^[a-z][a-z0-9_-]*(?:\.[A-Za-z][A-Za-z0-9_-]*)+$/.test(handlerId) &&
    handlerId.length <= 128;
}

function actionNamespace(handlerId) {
  if (!validHandlerId(handlerId)) return "";
  return handlerId.substring(0, handlerId.indexOf("."));
}

function loadDomainDefinitions(handlerId) {
  var namespace = actionNamespace(handlerId);
  var registries = domainRegistries();
  if (!namespace || !Object.prototype.hasOwnProperty.call(registries, namespace)) {
    return { success: false, code: "ACTION_HANDLER_NOT_FOUND" };
  }
  var registration = registries[namespace];
  if (!registration || registration.enabled !== true) {
    return { success: false, code: "ACTION_HANDLER_NOT_FOUND" };
  }
  var domainRegistry = lib[registration.library];
  if (!domainRegistry || typeof domainRegistry.getDefinitions !== "function") {
    return { success: false, code: "ACTION_REGISTRY_UNAVAILABLE" };
  }
  var definitions;
  try {
    definitions = domainRegistry.getDefinitions();
  } catch (error) {
    return { success: false, code: "ACTION_REGISTRY_UNAVAILABLE" };
  }
  if (!definitions || typeof definitions !== "object") {
    return { success: false, code: "ACTION_REGISTRY_INVALID" };
  }
  return { success: true, namespace: namespace, definitions: definitions };
}

// Lấy metadata handler đã đăng ký; không nhận library/factory tùy ý từ client.
function getDefinition(handlerId) {
  var loaded = loadDomainDefinitions(handlerId);
  if (!loaded.success) return loaded;
  if (!Object.prototype.hasOwnProperty.call(loaded.definitions, handlerId)) {
    return { success: false, code: "ACTION_HANDLER_NOT_FOUND" };
  }
  var definition = loaded.definitions[handlerId];
  if (!definition || definition.enabled !== true ||
      typeof definition.library !== "string" || !definition.library ||
      typeof definition.factory !== "string" || !definition.factory) {
    return { success: false, code: "ACTION_HANDLER_INVALID" };
  }
  return { success: true, definition: definition };
}

function isRegistered(handlerId) {
  return getDefinition(handlerId).success === true;
}

// Nạp factory đã allowlist và trả về lifecycle handler có thể thực thi.
function resolve(handlerId) {
  var found = getDefinition(handlerId);
  if (!found.success) return found;
  var definition = found.definition;
  var library = lib[definition.library];
  var factory = library && library[definition.factory];
  if (typeof factory !== "function") {
    return { success: false, code: "ACTION_HANDLER_UNAVAILABLE" };
  }
  var handler;
  try {
    handler = factory();
  } catch (error) {
    return { success: false, code: "ACTION_HANDLER_UNAVAILABLE" };
  }
  if (!handler || typeof handler.executeItem !== "function") {
    return { success: false, code: "ACTION_HANDLER_INVALID" };
  }
  return { success: true, handlerId: handlerId, handler: handler };
}
