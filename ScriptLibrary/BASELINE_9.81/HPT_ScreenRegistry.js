/**
 * ScriptLibrary name: HPT_ScreenRegistry
 * Backend-only allowlist mapping public screenId values to config factories.
 * Client chỉ gửi screenId; tên ScriptLibrary luôn do registry quyết định.
 */

// Danh sách screenId được phép và factory metadata tương ứng.
function screenDefinitions() {
  return {
    contracts: {
      enabled: true,
      library: "HPT_ContractListDefinition",
      factory: "getDefinition"
    },
    status_catalog: {
      enabled: true,
      library: "HPT_StatusListDefinition",
      factory: "getDefinition"
    },
    email_logs: {
      enabled: true,
      library: "HPT_EmailLogListDefinition",
      factory: "getDefinition"
    }
  };
}

function validScreenId(screenId) {
  return typeof screenId === "string" && /^[a-z][a-z0-9_-]{0,63}$/.test(screenId);
}

// Resolve, validate và tách metadata public/private của một màn hình.
function resolveScreen(screenId) {
  var definitions = screenDefinitions();
  if (!validScreenId(screenId) ||
      !Object.prototype.hasOwnProperty.call(definitions, screenId)) {
    return { success: false, code: "SCREEN_NOT_FOUND" };
  }

  var definition = definitions[screenId];
  if (!definition || definition.enabled !== true) {
    return { success: false, code: "SCREEN_NOT_FOUND" };
  }

  var libraryName = definition.library || definition.service;
  var factoryName = definition.factory || definition.configFactory;
  var definitionLibrary = lib[libraryName];
  var factory = definitionLibrary && definitionLibrary[factoryName];
  if (typeof factory !== "function") {
    return { success: false, code: "SCREEN_CONFIG_UNAVAILABLE" };
  }

  var config;
  try {
    config = factory();
  } catch (error) {
    return {
      success: false,
      code: "SCREEN_CONFIG_UNAVAILABLE",
      detail: error.toString()
    };
  }
  if (!config || typeof config !== "object") {
    return { success: false, code: "SCREEN_CONFIG_UNAVAILABLE" };
  }

  var validator = lib.HPT_ScreenDefinition;
  if (!validator || typeof validator.validateConfig !== "function") {
    return { success: false, code: "SCREEN_DEFINITION_UNAVAILABLE" };
  }
  var validation = validator.validateConfig(screenId, config);
  if (!validation || !validation.success) {
    return {
      success: false,
      code: "INVALID_SCREEN_DEFINITION",
      errors: validation && validation.errors ? validation.errors : []
    };
  }

  var actions = {};
  var batchActions = validation.config.batchActions || {};
  var actionId;
  for (actionId in batchActions) {
    if (Object.prototype.hasOwnProperty.call(batchActions, actionId)) {
      actions["batch:" + actionId] = batchActions[actionId];
    }
  }
  var publicActions = validation.config.screenPublic &&
    validation.config.screenPublic.bulkActions || [];
  var publicScreenActions = validation.config.screenPublic &&
    validation.config.screenPublic.actions || [];
  publicActions = publicActions.concat(publicScreenActions);
  for (var publicIndex = 0; publicIndex < publicActions.length; publicIndex++) {
    var selector = publicActions[publicIndex] && publicActions[publicIndex].selector;
    if (selector && (!definitions[selector.screenId] ||
        definitions[selector.screenId].enabled !== true)) {
      return {
        success: false,
        code: "INVALID_SCREEN_DEFINITION",
        errors: ["Unregistered selector screen: " + selector.screenId]
      };
    }
  }
  var actionRegistry = lib.HPT_ActionRegistry;
  var screenActions = validation.config.screenActions || {};
  for (actionId in screenActions) {
    if (Object.prototype.hasOwnProperty.call(screenActions, actionId)) {
      actions["screen:" + actionId] = screenActions[actionId];
    }
  }
  for (actionId in actions) {
    if (!Object.prototype.hasOwnProperty.call(actions, actionId) ||
        !actions[actionId] || actions[actionId].operation !== "custom") continue;
    if (!actionRegistry || typeof actionRegistry.isRegistered !== "function") {
      return { success: false, code: "ACTION_REGISTRY_UNAVAILABLE" };
    }
    if (!actionRegistry.isRegistered(actions[actionId].handlerId)) {
      return {
        success: false,
        code: "INVALID_SCREEN_DEFINITION",
        errors: ["Unregistered custom action handler: " + actions[actionId].handlerId]
      };
    }
  }

  return { success: true, screenId: screenId, config: validation.config };
}
