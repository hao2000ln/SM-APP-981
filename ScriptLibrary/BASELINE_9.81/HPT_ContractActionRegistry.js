/**
 * ScriptLibrary name: HPT_ContractActionRegistry
 * Backend-only custom action definitions owned by the contract domain.
 * Chỉ ánh xạ handlerId tới factory; không chứa nghiệp vụ hoặc truy vấn DB.
 */

// Trả về allowlist các custom action thuộc domain hợp đồng.
function getDefinitions() {
  return {
    "contracts.updateContract": {
      enabled: true,
      library: "HPT_ContractActions",
      factory: "getUpdateContractHandler"
    },
    "contracts.createFromStatuses": {
      enabled: true,
      library: "HPT_ContractActions",
      factory: "getCreateFromStatusesHandler"
    },
    "contracts.deleteContract": {
      enabled: true,
      library: "HPT_ContractActions",
      factory: "getDeleteContractHandler"
    },
    "contracts.importContracts": {
      enabled: true,
      library: "HPT_ContractActions",
      factory: "getImportContractsHandler"
    }
  };
}
