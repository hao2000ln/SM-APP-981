/**
 * ScriptLibrary name: HPT_ContractJobExecutorRegistry
 * Allowlist for background-safe contract executors.
 */

function getDefinitions() {
  return {
    "contracts.importContractsJob": {
      enabled: true,
      backgroundSafe: true,
      library: "HPT_ContractJobExecutors",
      factory: "getImportContractsExecutor"
    }
  };
}
