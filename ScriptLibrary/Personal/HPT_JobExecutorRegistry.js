/**
 * ScriptLibrary name: HPT_JobExecutorRegistry
 * Server-side allowlist for background job executors.
 */

function jobExecutorDomainRegistries() {
  return {
    contracts: {
      enabled: true,
      library: "HPT_ContractJobExecutorRegistry"
    }
  };
}

function validJobExecutorId(value) {
  return typeof value === "string" && value.length <= 128 &&
    /^[a-z][a-z0-9_-]*(?:\.[A-Za-z][A-Za-z0-9_-]*)+$/.test(value);
}

function jobExecutorNamespace(executorId) {
  return validJobExecutorId(executorId)
    ? executorId.substring(0, executorId.indexOf(".")) : "";
}

function getJobExecutorDefinition(executorId) {
  var namespace = jobExecutorNamespace(executorId);
  var registries = jobExecutorDomainRegistries();
  var registration = namespace && registries[namespace];
  if (!registration || registration.enabled !== true) {
    return { success: false, code: "JOB_EXECUTOR_NOT_FOUND" };
  }
  var domainRegistry = lib[registration.library];
  if (!domainRegistry || typeof domainRegistry.getDefinitions !== "function") {
    return { success: false, code: "JOB_EXECUTOR_REGISTRY_UNAVAILABLE" };
  }
  var definitions = domainRegistry.getDefinitions();
  var definition = definitions && definitions[executorId];
  if (!definition || definition.enabled !== true || definition.backgroundSafe !== true ||
      typeof definition.library !== "string" || typeof definition.factory !== "string") {
    return { success: false, code: "JOB_EXECUTOR_NOT_FOUND" };
  }
  return { success: true, definition: definition };
}

function resolve(executorId) {
  var found = getJobExecutorDefinition(executorId);
  if (!found.success) return found;
  var definition = found.definition;
  var library = lib[definition.library];
  var factory = library && library[definition.factory];
  if (typeof factory !== "function") {
    return { success: false, code: "JOB_EXECUTOR_UNAVAILABLE" };
  }
  var executor;
  try {
    executor = factory();
  } catch (error) {
    return { success: false, code: "JOB_EXECUTOR_UNAVAILABLE" };
  }
  if (!executor || typeof executor.execute !== "function") {
    return { success: false, code: "JOB_EXECUTOR_INVALID" };
  }
  return { success: true, executorId: executorId, executor: executor };
}
