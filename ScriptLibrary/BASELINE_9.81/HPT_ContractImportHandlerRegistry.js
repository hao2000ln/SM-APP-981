/**
 * ScriptLibrary name: HPT_ContractImportHandlerRegistry
 * Allowlist import handlers owned by the contract domain.
 */

function getDefinitions() {
  return {
    "contracts.import": {
      enabled: true,
      library: "HPT_ContractImportHandler",
      factory: "getHandler"
    }
  };
}
