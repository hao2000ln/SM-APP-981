/**
 * ScriptLibrary name: HPT_ImportHandlerRegistry
 * Backend-only router and allowlist for domain-owned import handlers.
 */

// Mỗi domain sở hữu registry riêng; framework không biết ScriptLibrary nghiệp vụ cụ thể.
function importDomainRegistries() {
  return {
    contracts: {
      enabled: true,
      library: "HPT_ContractImportHandlerRegistry"
    }
  };
}

function validImportHandlerId(handlerId) {
  return typeof handlerId === "string" && handlerId.length <= 128 &&
    /^[a-z][a-z0-9_-]*(?:\.[A-Za-z][A-Za-z0-9_-]*)+$/.test(handlerId);
}

function importHandlerNamespace(handlerId) {
  return validImportHandlerId(handlerId)
    ? handlerId.substring(0, handlerId.indexOf(".")) : "";
}

function getImportHandlerDefinition(handlerId) {
  var namespace = importHandlerNamespace(handlerId);
  var registration = namespace && importDomainRegistries()[namespace];
  if (!registration || registration.enabled !== true) {
    return { success: false, code: "IMPORT_HANDLER_NOT_FOUND" };
  }
  var domainRegistry = lib[registration.library];
  if (!domainRegistry || typeof domainRegistry.getDefinitions !== "function") {
    return { success: false, code: "IMPORT_HANDLER_REGISTRY_UNAVAILABLE" };
  }
  var definitions;
  try {
    definitions = domainRegistry.getDefinitions();
  } catch (error) {
    return { success: false, code: "IMPORT_HANDLER_REGISTRY_UNAVAILABLE" };
  }
  var definition = definitions && definitions[handlerId];
  if (!definition || definition.enabled !== true ||
      typeof definition.library !== "string" || !definition.library ||
      typeof definition.factory !== "string" || !definition.factory) {
    return { success: false, code: "IMPORT_HANDLER_NOT_FOUND" };
  }
  return { success: true, definition: definition };
}

// Chỉ resolve factory đã allowlist; tuyệt đối không nhận library/function từ request.
function resolve(handlerId) {
  var found = getImportHandlerDefinition(handlerId);
  if (!found.success) return found;
  var definition = found.definition;
  var library = lib[definition.library];
  var factory = library && library[definition.factory];
  if (typeof factory !== "function") {
    return { success: false, code: "IMPORT_HANDLER_UNAVAILABLE" };
  }
  var handler;
  try {
    handler = factory();
  } catch (error) {
    return { success: false, code: "IMPORT_HANDLER_UNAVAILABLE" };
  }
  if (!handler || typeof handler.getColumns !== "function" ||
      typeof handler.validateRow !== "function" ||
      typeof handler.executeRow !== "function") {
    return { success: false, code: "IMPORT_HANDLER_INVALID" };
  }
  return { success: true, handlerId: handlerId, handler: handler };
}
